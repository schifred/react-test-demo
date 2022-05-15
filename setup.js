import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

/** enzyme react16 适配器 */
Enzyme.configure({ adapter: new Adapter() });
/** enzyme react16 适配器 */

/**
 * window 准备
 * 部分来自 https://enzymejs.github.io/enzyme/docs/guides/jsdom.html
 * 部分来自 antd 测试代码实现
 */
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth;
  global.window.innerHeight = height || global.window.innerHeight;
  global.window.dispatchEvent(new Event('resize'));
};
global.window.scrollTo = () => {};
if (!window.matchMedia) {
  Object.defineProperty(global.window, 'matchMedia', {
    value: jest.fn((query) => ({
      matches: query.includes('max-width'),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
}

// Fix css-animation or rc-motion deps on these
window.AnimationEvent = window.AnimationEvent || (() => {});
window.TransitionEvent = window.TransitionEvent || (() => {});

copyProps(window, global);
/** window 准备 */

/** antd 对 ReactWrapper 的改写 */
Object.assign(Enzyme.ReactWrapper.prototype, {
  findObserver() {
    return this.find('ResizeObserver');
  },
  triggerResize() {
    const ob = this.findObserver();
    ob.instance().onResize([{ target: ob.getDOMNode() }]);
  },
});
/** antd 对 ReactWrapper 的改写 */
