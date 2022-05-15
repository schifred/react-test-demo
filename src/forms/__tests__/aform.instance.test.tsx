import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { getFormApi, formInstance, storeFormInstance, clearFormInstance } from '@/__tests__/form';
import { sleep } from '@/__tests__/utils';
import TestForm from '../aform';

describe('aform 逻辑测试', () => {
  beforeAll(() => {
    storeFormInstance();
  });

  afterAll(() => {
    clearFormInstance();
  });

  it('formInstance 数据回填', async () => {
    const wrapper = mount(<TestForm />);
    const formApi = getFormApi(wrapper);

    await act(async () => {
      await formInstance?.setFieldsValue({
        select: 'china',
        input: 'test',
      });
      wrapper.update();
    });

    expect(formApi.getField('input').length).toBeTruthy();
    expect(formApi.getFieldValue('select')).toBe('china');
    expect(formApi.getFieldValue('input')).toBe('test');

    wrapper.unmount();
  });

  it('formInstance 数据校验', async () => {
    const wrapper = mount(<TestForm />);
    const formApi = getFormApi(wrapper);

    await act(async () => {
      await formInstance?.validateFields().catch(() => {});
      await sleep(200);
      wrapper.update();
    });

    expect(formApi.getFieldError('select')).toBe('Please select your country!');

    wrapper.unmount();
  });
});
