jest.mock('../../services', () => {
  const originalModule = jest.requireActual('../../services');

  return {
    ...originalModule,
    getDataSource: () => {
      return Promise.resolve({
        select: 'usa',
      });
    },
  };
});

import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
import { sleep } from '@/__tests__/utils';
import TestForm from '../eform';

describe('eform 逻辑测试', () => {
  it('数据回填', async () => {
    const wrapper = mount(<TestForm />);
    const formApi = getFormApi(wrapper);
    await sleep(200);
    wrapper.update();

    expect(formApi.getFieldValue('select')).toBe('usa');

    wrapper.unmount();
  });
});
