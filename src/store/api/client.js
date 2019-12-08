import axios from 'axios';
import { CANCEL } from 'redux-saga';

axios.defaults.baseURL = process.env.BASE_URL;

const resolve = res => res;
const reject = error => {
  let retError = error;

  if (axios.isCancel(error)) {
    // eslint-disable-next-line no-console
    console.warn(`Canceled HTTP call to ${error.message.url}`);
  }

  // error of type Network Error has no response key
  if (error.response) {
    const { data } = error.response;
    retError = data ? new Error(data.message) : error;
  }

  return Promise.reject(retError);
};

const CancelToken = () => ({
  cancel: () => null
});

const wrapHttpWithCancellation = (httpMethod, arity) => (...args) => {
  const inCancelToken = args[arity] || CancelToken();

  if (!inCancelToken) {
    return httpMethod(...args);
  }

  const url = args[0];
  const reqConfig = args[arity - 1] || {};

  const cancelToken = new axios.CancelToken(cancelFn => {
    const { cancel } = inCancelToken;
    inCancelToken.cancel = (...args2) => {
      const cancelFeedback = {
        url,
        payload: args2
      };
      cancel(cancelFeedback);
      cancelFn(cancelFeedback);
    };
  });

  const request = httpMethod.apply(null, [
    ...args.slice(0, arity - 1),
    {
      ...reqConfig,
      cancelToken
    }
  ]);
  request[CANCEL] = () => inCancelToken.cancel();

  return request;
};

/**
 * instantiate axios
 * @param config - axios config [details](https://github.com/axios/axios#request-config)
 * @return {AxiosInstance}
 */
const client = (config = {}) => {
  const cfg = {
    ...config
  };

  // const jwtToken = storage.access_token;
  //
  // if (jwtToken) {
  //   cfg = {
  //     ...cfg,
  //     headers: {
  //       ...(cfg.headers || {}),
  //       Authorization: `Bearer ${jwtToken}`
  //     }
  //   };
  // }

  const instance = axios.create(cfg);
  // intercept un-authenticated requests, and log the user out if unauthorized.
  instance.interceptors.response.use(resolve, reject);

  // Mofidy HTTP methods to allow cancellation with a token
  const {
    get, put,
    post, patch
  } = instance;

  const del = instance.delete.bind(instance);
  instance.get = wrapHttpWithCancellation(get, 2);
  instance.delete = wrapHttpWithCancellation(del, 2);
  instance.put = wrapHttpWithCancellation(put, 3);
  instance.post = wrapHttpWithCancellation(post, 3);
  instance.patch = wrapHttpWithCancellation(patch, 3);

  instance.CancelToken = CancelToken;

  return instance;
};

client.CancelToken = CancelToken;

export default client;
