jest.mock('../dform.hook', () => {
  return () => ({
    dataSource: {
      select: 'usa',
    },
  });
});

import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
import TestForm from '../dform';

describe('dform 逻辑测试', () => {
  it('数据回填', async () => {
    const wrapper = mount(<TestForm />);
    const formApi = getFormApi(wrapper);

    expect(formApi.getFieldValue('select')).toBe('usa');

    wrapper.unmount();
  });
});
