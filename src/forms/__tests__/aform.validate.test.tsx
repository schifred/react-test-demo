import React from 'react';
import { mount } from 'enzyme';
import { getFormApi, storeFormInstance, clearFormInstance } from '@/__tests__/form';
import TestForm from '../aform';

describe('aform 逻辑测试', () => {
  beforeAll(() => {
    storeFormInstance();
  });

  afterAll(() => {
    clearFormInstance();
  });

  it('表单校验', async () => {
    const onFinish = jest.fn((x) => x);
    const wrapper = mount(<TestForm onFinish={onFinish} />);
    const formApi = getFormApi(wrapper);

    await formApi.setFieldValueAsync('select', '');

    expect(formApi.getFieldError('select')).toBe('Please select your country!');

    wrapper.unmount();
  });
});
