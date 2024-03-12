import { ComponentMethods, createWebComponent } from ".";

interface CreateComponentProps<T> {
  tagName: string;
  template: string;
  data: T;
  reactivity: (props: T & ComponentMethods) => void;
}

export const createComponent = <T extends object>(props: CreateComponentProps<T>) => {
  const { tagName, template, data, reactivity } = props;

  const generateTemplate = (state: T) => {
    let templateCopy = template;

    const values = template
      .match(/{([^}]+)}/g)
      ?.map((item) => item.replaceAll('{', '').replaceAll('}', ''));

    values?.forEach((value) => {
      if (value in state) {
        //@ts-ignore
        templateCopy = templateCopy.replace(`{${value}}`, state[value]);
      }
    });
    return templateCopy;
  };

  createWebComponent({
    tagName,

    setup: function (this: T) {
      for (const key in data) {
        this[key] = data[key];
      }
    },

    template: function (this: T) {
      return generateTemplate(this);
    },

    run: function (this: T & ComponentMethods) {
      reactivity(this)
    }
  });
};
