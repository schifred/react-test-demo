import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
import TestForm from '../cform';
import { UserContextProvider } from '../../contexts/user';

describe('cform 逻辑测试', () => {
  it('数据回填', async () => {
    const wrapper = mount(<TestForm />, {
      wrappingComponent: UserContextProvider,
      wrappingComponentProps: {
        value: {
          userInfo: { nationality: 'usa' },
        },
      },
    });
    const formApi = getFormApi(wrapper);

    expect(formApi.getFieldValue('select')).toBe('usa');

    wrapper.unmount();
  });
});
