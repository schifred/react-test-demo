import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form, Select, Input, FormInstance, Button } from 'antd';
import { sleep } from '@/__tests__/utils';
import Filter from '../filter';

describe('filter 表单校验', () => {
  let formInstance: FormInstance;
  beforeAll(() => {
    const originUseForm = Form.useForm;
    Form.useForm = jest.fn((...args) => {
      const [form] = originUseForm(...args);

      formInstance = form;
      return [{ ...form }];
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('搜索', async () => {
    const onSearch = jest.fn((x) => x);
    const wrapper = mount(<Filter onSearch={onSearch} />);

    await wrapper.find({ name: 'select' }).find(Select).at(0).invoke('onChange')?.('usa', {});
    wrapper.update();
    await wrapper.find({ name: 'input' }).find(Input).at(0).invoke('onChange')?.('test');

    wrapper.find('form').simulate('submit');
    await sleep(50);
    expect(onSearch).toBeCalledWith({
      select: 'usa',
      input: 'test',
    });

    wrapper.unmount();
  });

  it('重置', async () => {
    const onSearch = jest.fn((x) => x);
    const wrapper = mount(<Filter onSearch={onSearch} />);

    await wrapper.find({ name: 'select' }).find(Select).at(0).invoke('onChange')?.('usa', {});
    wrapper.update();
    await wrapper.find({ name: 'input' }).find(Input).at(0).invoke('onChange')?.('test');

    await wrapper.find(Button).last().simulate('click');
    expect(onSearch).toBeCalledWith({
      select: 'china',
      input: undefined,
    });

    wrapper.unmount();
  });
});
