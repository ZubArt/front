import client from './client';

let instance;
// eslint-disable-next-line no-return-assign
const initClient = () => (instance || (instance = client()));

export default {
  list(params) {
    return initClient().get(params);
  }
};
