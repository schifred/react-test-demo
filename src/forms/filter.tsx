import React from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
const { Option } = Select;

const Filter = ({ onSearch }: { onSearch?: (values: unknown) => void }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSearch}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name="select" label="Select" hasFeedback initialValue="china">
            <Select placeholder="Please select a country">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="input" label="Input" hasFeedback>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => {
              form.resetFields();
              const values = form.getFieldsValue();
              onSearch?.(values);
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
