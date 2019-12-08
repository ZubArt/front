import { all } from 'redux-saga/effects';

import projects from './projects';

const rootModules = [
  projects
];

const sagas = rootModules.map(module => module.sagas)
  .reduce((acc, arr) => [
    ...acc,
    ...arr
  ]);

export function* rootSaga() {
  yield all(sagas.map(saga => saga()));
}

export const modules = rootModules.reduce((acc, module) => {
  const { id, sagas: _, ...rest } = module;

  return {
    ...acc,
    [id]: rest
  };
}, {});
