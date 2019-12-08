import map from 'lodash/map';
import {
  takeEvery, call,
  race, take, put
} from 'redux-saga/effects';
import { mapSagaActions } from 'vuex-coolstory';
import { mapState } from 'vuex';

export const createSlice = ({
  id,
  initialState,
  mutations,
  ...rest
}) => {
  const mutationsMapped = {};
  const sagas = [];
  const actions = Object.keys(mutations).reduce((acc, key) => {
    const type = `${id}/${key}`;
    const action = payload => ({
      type,
      payload,
    });
    action.type = type;
    action.toString = () => type;

    mutationsMapped[type] = mutations[key];
    acc[key] = action;

    sagas.push(function* () {
      yield takeEvery(type, function* () {
        yield put(action());
      });
    });

    return acc;
  }, {});

  return {
    id,
    namespaced: true,
    state: initialState,
    actions,
    mutations,
    getters: {},
    sagas,
    ...rest,
  };
};

// eslint-disable-next-line no-empty-function
const Generator = (function* () {}).constructor;

export const createModule = ({ sagas, ...slice }) => {
  slice.mutations.cancel = slice.mutations.cancel || (state => state);

  const module = createSlice(slice);
  if (sagas) {
    const sagasWithContext = sagas(module.actions);

    module.sagas = [
      ...module.sagas,
      ...map(sagasWithContext, (sagaObj, actionType) => {
        let saga;
        let taker;
        if (sagaObj instanceof Generator) {
          saga = sagaObj;
          taker = takeEvery;
        } else if (sagaObj.watcher) {
          return sagaObj.watcher;
        } else {
          // eslint-disable-next-line prefer-destructuring
          saga = sagaObj.saga;
          taker = sagaObj.taker || takeEvery;
        }
        return function* () {
          yield taker(actionType, function* (...args) {
            yield race({
              task: call(saga, ...args),
              cancel: take(module.actions.cancel)
            });
          });
        };
      })
    ];
  }

  const actions = Object.keys(module.actions).reduce((acc, key) => ({
    ...acc,
    [key]: module.actions[key].type
  }), {});

  module.actions = mapSagaActions(actions);
  module.selector = mapState([module.id]);

  return module;
};
