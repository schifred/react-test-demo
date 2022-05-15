import React, { useEffect } from 'react';
import { Form, Select, Cascader, Button } from 'antd';
import useForm from '../useForm';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const BForm = ({
  onFinish,
  dataSource,
}: {
  onFinish?: (values: unknown) => void;
  dataSource?: any;
}) => {
  const form = useForm();

  useEffect(() => {
    if (dataSource)
      form.setFieldsValue({
        select: dataSource?.select,
        cascader: [dataSource?.province, dataSource?.city, dataSource?.county].filter((it) => !!it),
      });
  }, [dataSource]);

  return (
    <Form {...formItemLayout} onFinish={onFinish}>
      <Form.Item label="Select" hasFeedback>
        {form.getFieldDecorator('select', {
          rules: [
            {
              required: true,
              message: 'Please select your country!',
            },
          ],
        })(
          <Select placeholder="Please select a country">
            <Option value="china">China</Option>
            <Option value="usa">U.S.A</Option>
          </Select>,
        )}
      </Form.Item>

      {form.getFieldValue('select') === 'china' ? (
        <Form.Item label="Cascader">
          {form.getFieldDecorator('cascader', {
            initialValue: ['zhejiang'],
          })(<Cascader options={options} changeOnSelect />)}
        </Form.Item>
      ) : null}

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

export default BForm;
