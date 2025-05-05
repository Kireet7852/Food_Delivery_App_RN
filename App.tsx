import React from 'react';
import '@unistyles/unistyles';
import Navigation from '@navigation/Navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from '@states/store';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
