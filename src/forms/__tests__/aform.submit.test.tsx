import React from 'react';
import { mount } from 'enzyme';
import { getFormApi } from '@/__tests__/form';
import { sleep } from '@/__tests__/utils';
import TestForm from '../aform';

describe('aform 逻辑测试', () => {
  it('数据提交', async () => {
    const onFinish = jest.fn((x) => x);
    const wrapper = mount(<TestForm onFinish={onFinish} />);
    const formApi = getFormApi(wrapper);

    formApi.setFieldValue('select', 'china');
    formApi.setFieldValue('input', 'test');

    wrapper.find('form').simulate('submit');
    await sleep(50);
    expect(onFinish).toBeCalledWith({
      select: 'china',
      input: 'test',
    });

    wrapper.unmount();
  });

  it('数据回填', async () => {
    const wrapper = mount(
      <TestForm
        dataSource={{
          select: 'china',
          input: 'test',
        }}
      />,
    );
    const formApi = getFormApi(wrapper);

    expect(formApi.getField('input').length).toBeTruthy();
    expect(formApi.getFieldValue('select')).toBe('china');
    expect(formApi.getFieldValue('input')).toBe('test');

    wrapper.unmount();
  });
});
