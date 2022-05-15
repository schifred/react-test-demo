import { version } from 'antd';
import { ShallowWrapper, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form, FormInstance } from 'antd';
import { sleep } from './utils';

/**
 * 查询 Form.Item
 * @param wrapper
 * @param name
 * @returns
 */
const getFormItem = (wrapper: ShallowWrapper | ReactWrapper, name: string) => {
  return version[0] === '4' ? wrapper.find({ name }) : wrapper.find({ 'data-name': name }).parent();
};

/**
 * 查询表单项
 * @param wrapper
 * @param name
 * @returns
 */
const getField = (wrapper: ShallowWrapper | ReactWrapper, name: string) => {
  return version[0] === '4'
    ? wrapper.find({ name }).find({ id: name }).at(0)
    : wrapper.find({ 'data-name': name }).children().at(0);
};

/**
 * 同步修改表单项的值
 * @param wrapper
 * @param name
 * @param value
 * @returns
 */
const setFieldValue = (wrapper: ShallowWrapper | ReactWrapper, name: string, value: any) => {
  const fieldWrapper = getField(wrapper, name);
  return fieldWrapper.invoke('onChange')(value);
};

/**
 * 异步修改表单项的值
 * @param wrapper
 * @param name
 * @param value
 * @returns
 */
const setFieldValueAsync = async (
  wrapper: ShallowWrapper | ReactWrapper,
  name: string,
  value: any,
) => {
  return await act(async () => {
    const fieldWrapper = getField(wrapper, name);
    fieldWrapper.invoke('onChange')(value);
    await sleep(200);
    wrapper.update();
  });
};

/**
 * 同步修改表单的值
 * @param wrapper
 * @param values
 */
const setFieldsValue = (wrapper: ShallowWrapper | ReactWrapper, values: any) => {
  Object.keys(values).forEach((name) => {
    const fieldWrapper = getField(wrapper, name);
    fieldWrapper.invoke('onChange')(values[name]);
  });
};

/**
 * 异步修改表单的值
 * @param wrapper
 * @param values
 */
const setFieldsValueAsync = async (wrapper: ShallowWrapper | ReactWrapper, values: any) => {
  Object.keys(values).forEach((name) => {
    const fieldWrapper = getField(wrapper, name);
    fieldWrapper.invoke('onChange')(values[name]);
  });

  await sleep(200);
  wrapper.update();
};

/**
 * 获取表单项的值
 * @param wrapper
 * @param name
 * @returns
 */
const getFieldValue = (wrapper: ShallowWrapper | ReactWrapper, name: string) => {
  const fieldWrapper = getField(wrapper, name);
  return fieldWrapper.prop('value');
};

/**
 * 获取校验报错文案
 * @param wrapper
 * @param name
 * @returns
 */
const getFieldError = (wrapper: ShallowWrapper | ReactWrapper, name: string) => {
  const formItemWrapper = getFormItem(wrapper, name);
  const errorWrapper = formItemWrapper.find('.ant-form-item-explain-error');
  return errorWrapper?.exists() ? errorWrapper.text() : undefined;
};

export const getFormApi = (wrapper: ShallowWrapper | ReactWrapper) => {
  return {
    getField: (name: string) => getField(wrapper, name),
    setFieldValue: (name: string, value: any) => setFieldValue(wrapper, name, value),
    setFieldValueAsync: (name: string, value: any) => setFieldValueAsync(wrapper, name, value),
    setFieldsValue: (values: any) => setFieldsValue(wrapper, values),
    setFieldsValueAsync: (values: any) => setFieldsValueAsync(wrapper, values),
    getFieldValue: (name: string) => getFieldValue(wrapper, name),
    getFieldError: (name: string) => getFieldError(wrapper, name),
  };
};

export let formInstance: FormInstance;
const originUseForm = Form.useForm;
const originConsoleWarn = console.warn;

/**
 * 模拟 FormInstance
 * @returns
 */
export const storeFormInstance = () => {
  Form.useForm = jest.fn((...args) => {
    const [form] = originUseForm(...args);

    formInstance = form;
    return [form];
  });

  console.warn = jest.fn();
};

/**
 * 清除 FormInstance 模拟
 * @returns
 */
export const clearFormInstance = () => {
  Form.useForm = originUseForm;
  console.warn = originConsoleWarn;
};
