import { fork } from 'redux-saga/effects';

export default function* RootSaga() {
  yield fork(FirstSaga);
}
function* FirstSaga() {
  yield console.log('Hello saga');
}
