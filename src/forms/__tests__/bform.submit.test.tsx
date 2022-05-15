import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
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
    const formApi = getFormApi(wrapper);

    expect(formApi.getField('cascader').length).toBeTruthy();
    expect(formApi.getFieldValue('select')).toBe('china');
    expect(formApi.getFieldValue('cascader')).toStrictEqual(['zhejiang', 'hangzhou', 'xihu']);

    wrapper.unmount();
  });
});
