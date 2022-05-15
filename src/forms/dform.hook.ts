import { useMemo } from 'react';
import { useUserContext } from '../contexts/user';

export default () => {
  const { userInfo } = useUserContext();
  const dataSource = useMemo(() => {
    if (userInfo?.nationality)
      return {
        select: userInfo?.nationality,
      };
  }, [userInfo]);

  return {
    dataSource,
  };
};
