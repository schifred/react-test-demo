import request from 'umi-request';

export const getDataSource = () => {
  return request.get('/test');
};
