import { useState } from 'react';
import { Button, Form, Input, Select, DatePicker, InputNumber } from 'antd';

const TournamentForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Format dates to ISO string
      const formattedValues = {
        ...values,
        start_date: values.start_date.toISOString().split('T')[0],
        end_date: values.end_date.toISOString().split('T')[0],
        sign_up_limit_date: values.sign_up_limit_date.toISOString().split('T')[0]
      };

      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedValues)
      });

      if (!response.ok) throw new Error('Failed to create tournament');
      
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Tournament Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="format" label="Tournament Format" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="single_elimination">Single Elimination</Select.Option>
          <Select.Option value="round_robin">Round Robin</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="teams_limit" label="Teams Limit" rules={[{ required: true }]}>
        <InputNumber min={2} />
      </Form.Item>

      {/* Add more form fields */}

      <Button type="primary" htmlType="submit">
        Create Tournament
      </Button>
    </Form>
  );
};

export default TournamentForm; 