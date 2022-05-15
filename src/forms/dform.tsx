import React from 'react';
import AForm from './aform';
import useHook from './dform.hook';

const DForm = ({ onFinish }: { onFinish?: (values: unknown) => void }) => {
  const { dataSource } = useHook();

  return <AForm onFinish={onFinish} dataSource={dataSource} />;
};

export default DForm;
