import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
import AForm from '../aform';

describe('aform 逻辑测试', () => {
  it('字段联动显示隐藏', async () => {
    const wrapper = mount(<AForm />);
    const formApi = getFormApi(wrapper);
    expect(formApi.getField('input').length).toBeFalsy();
    expect(formApi.getFieldValue('select')).toBe(undefined);

    formApi.setFieldValue('select', 'china');

    expect(formApi.getFieldValue('select')).toBe('china');
    expect(formApi.getField('input').length).toBeTruthy();
    wrapper.unmount();
  });
});
