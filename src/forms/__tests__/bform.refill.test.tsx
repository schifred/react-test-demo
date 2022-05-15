import React from 'react';
import { mount } from 'enzyme';
import { sleep } from '@/__tests__/utils';
import TestForm from '../bform';

describe('bform 逻辑测试', () => {
  it('数据回填', async () => {
    const wrapper = mount(
      <TestForm
        dataSource={{
          select: 'china',
          province: 'zhejiang',
          city: 'hangzhou',
          county: 'xihu',
        }}
      />,
    );

    expect(wrapper.find({ 'data-name': 'cascader' }).children().at(0).length).toBeTruthy();
    expect(wrapper.find({ 'data-name': 'select' }).children().at(0).prop('value')).toBe('china');
    expect(wrapper.find({ 'data-name': 'cascader' }).children().at(0).prop('value')).toStrictEqual([
      'zhejiang',
      'hangzhou',
      'xihu',
    ]);

    wrapper.unmount();
  });
});
