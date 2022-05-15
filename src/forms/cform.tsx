import React, { useMemo } from 'react';
import { useUserContext } from '../contexts/user';
import AForm from './aform';

const CForm = ({ onFinish }: { onFinish?: (values: unknown) => void }) => {
  const { userInfo } = useUserContext();
  const dataSource = useMemo(() => {
    if (userInfo?.nationality)
      return {
        select: userInfo?.nationality,
      };
  }, [userInfo]);

  return <AForm onFinish={onFinish} dataSource={dataSource} />;
};

export default CForm;
