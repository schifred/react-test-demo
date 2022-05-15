import React from 'react';
import { shallow, mount } from 'enzyme';
import Filter from '../filter';

describe('filter 搜索框快照', () => {
  it('shallow 快照', async () => {
    const fn = jest.fn();
    const wrapper = shallow(<Filter onSearch={fn} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  it('mount 快照', async () => {
    const fn = jest.fn();
    const wrapper = mount(<Filter onSearch={fn} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });
});
