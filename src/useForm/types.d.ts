import { RuleItem } from 'async-validator';

export interface FieldMeta<Values> {
  initialValue?: any; // 初始值
  trigger?: string; // 收集字段的事件
  valuePropName?: string; // 字段值的 props 属性
  getValueFromEvent?: (...args: any[]) => any; // 灌入 store 的值
  normalize?: (value: any) => any; // 将值序列化后灌入字段组件
  rules?: RuleItem[]; // 字段校验规则
  validateFirst?: boolean; // 校验失败后是否阻止其他字段校验
  validateTrigger?: string; // 校验字段的事件
  fieldRef?: any; // 字段组件 ref
  [key: string]: any;
}

export interface Fields {
  [name: string]: any;
}

export interface Errors {
  [name: string]: string[];
}

export interface Options<Values> {
  onValuesChange?: (values: Values) => void;
}

export interface Form<Values> {
  registerField: (name: string, meta?: FieldMeta<Values>) => void;
  unRegisterField: (name: string) => void;
  setFieldMeta: (name: string, key: string | any, value?: any) => void;
  getFieldMeta: (name: string, key?: string) => any;
  getFieldDecorator: (
    name: string,
    meta: FieldMeta<Values>,
  ) => (inst: React.ReactElement) => React.ReactElement;
  getFieldRef: (name: string) => any;
  getFieldsValue: () => Values;
  getFieldValue: (name: string) => any;
  getFieldInitialValue: (name: string) => any;
  getFieldsError: () => Errors;
  getFieldError: (name: string) => undefined | string[];
  setFieldValue: (name: string, value: any) => void;
  setFieldsValue: (vals: Values) => void;
  resetFields: () => void;
  validateField: (name: string, value?: any) => Promise<Fields>;
  validateFields: (names?: string[]) => Promise<Fields>;
  isFormChanged: () => boolean;
  isFieldTouched: (name: string) => boolean;
  isFieldsTouched: () => boolean;
}
