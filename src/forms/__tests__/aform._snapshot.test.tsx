import React from 'react';
import { shallow, mount, render } from 'enzyme';
import TestForm from '../aform';

describe('aform 快照测试', () => {
  it('shallow 快照', async () => {
    const fn = jest.fn();
    const wrapper = shallow(<TestForm onFinish={fn} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  it('部分字段展示快照', async () => {
    const fn = jest.fn();
    const wrapper = mount(<TestForm onFinish={fn} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  it('全字段展示快照', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <TestForm
        onFinish={fn}
        dataSource={{
          select: 'china',
          input: 'test',
        }}
      />,
    );

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  // it('render 快照', async () => {
  //   const fn = jest.fn();
  //   const wrapper = render(<TestForm onFinish={fn} />);

  //   expect(wrapper).toMatchSnapshot();
  // });
});
