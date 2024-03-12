export interface ComponentMethods {
  _elem: this;
  _find: (sel: string) => HTMLElement;
  _slot: InnerHTML;
}

interface WebComponentProps {
  tagName: string;
  setup: Fn;
  run: Fn;
  template: (props?: { [key: string]: string }) => string;
}

export type Fn = (props: { [key: string]: string }) => void;

export function createWebComponent<T extends WebComponentProps>(Component: T) {
  class ReactiveElement extends HTMLElement {
    connectedCallback() {
      const props: { [key: string]: string } = {};

      Array.from(this.attributes).forEach((attr) => {
        if (attr.nodeName !== null && attr.nodeValue !== null) {
          props[attr.nodeName] = attr.nodeValue;
        }
      });

      let state = Object.create({
        _elem: this,
        _find: (sel: string) => this.querySelector(sel),
        _slot: this.innerHTML
      });

      state = new Proxy(state, {
        set: (obj, prop, value) => {
          const result = Reflect.set(obj, prop, value);
          renderElement();
          return result;
        }
      });

      let rendering = false;

      const renderElement = () => {
        if (rendering === false) {
          rendering = true;
          this.innerHTML = Component.template.call(state, props);
          Component.run.call(state, props);
          rendering = false;
        }
      };

      Component.setup.call(state, props);
      renderElement();
    }
  }
  customElements.define(Component.tagName, ReactiveElement);
}
