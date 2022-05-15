import React, { useEffect } from 'react';
import { Form, Select, Input, Button } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const AForm = ({
  onFinish,
  dataSource,
}: {
  onFinish?: (values: unknown) => void;
  dataSource?: unknown;
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (dataSource) form.setFieldsValue(dataSource);
  }, [dataSource]);

  return (
    <Form {...formItemLayout} form={form} onFinish={onFinish}>
      <Form.Item
        name="select"
        label="Select"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please select your country!',
          },
        ]}
      >
        <Select placeholder="Please select a country">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Input"
        shouldUpdate={(prevValues, currentValues) => prevValues.select !== currentValues.select}
      >
        {({ getFieldValue }) =>
          getFieldValue('select') === 'china' ? (
            <Form.Item name="input" noStyle initialValue="aaa">
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AForm;
