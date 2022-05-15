import React from 'react';
import { useRequest } from 'ahooks';
import AForm from './aform';
import { getDataSource } from '../services';

const EForm = ({ onFinish }: { onFinish?: (values: unknown) => void }) => {
  const { data: dataSource } = useRequest(getDataSource);

  return <AForm onFinish={onFinish} dataSource={dataSource} />;
};

export default EForm;
