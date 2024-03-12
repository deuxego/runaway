import { createComponent } from './lib';

interface StateSchema {
  count: number;
}

createComponent<StateSchema>({
  tagName: 'counter-tag',
  data: {
    count: 0
  },
  template: `<div> {count}
                <button id="btn-inc">inc</button> 
                <button id="btn-dec">dec</button> 
             </div>`,

  reactivity: (component) => {
    component._find('#btn-inc').onclick = () => (component.count += 1);
    component._find('#btn-dec').onclick = () => (component.count -= 1);
  }
});

document.body.innerHTML = `<counter-tag></counter-tag>`;
