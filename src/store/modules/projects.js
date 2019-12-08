import { put, call } from 'redux-saga/effects';
import { createModule } from '@/store/utils';
import api from '@/store/api';

const initialState = {
  isFetching: false,
  error: '',
  data: {}
};

const module = createModule({
  id: 'projects',
  initialState,

  mutations: {
    fetch(state) {
      console.log('fetch');
      state.isFetching = true;
    },
    fail(state, { payload: { message } }) {
      console.log('fail');
      state.isFetching = false;
      state.error = message;
    },
    success(state, { payload: { data } }) {
      console.log('success');
      state.data = data.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }
  },

  sagas: actions => ({
    [actions.fetch]: {
      * saga({ payload }) {
        try {
          const data = yield call(api.list, payload);

          console.log(data);

          yield put(actions.success(data));
        } catch (error) {
          yield put(actions.fail(error));
        }
      }
    }
  })
});

export const { actions, selector } = module;

export default module;
