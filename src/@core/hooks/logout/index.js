'use client';

import store from '@/store';
import persistStore from 'redux-persist/es/persistStore';

const userLogOut = () => {
  let persistor = persistStore(store);
  persistor.pause();
  persistor.flush().then(() => {
    return persistor.purge();
  });
  localStorage.removeItem('userCredential');
  localStorage.clear();
  window.location.href =
    window.location.protocol + '//' + window.location.host + '/' + 'auth';
};

export default userLogOut;
