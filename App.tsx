import React from 'react';
import '@unistyles/unistyles';
import Navigation from '@navigation/Navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from '@states/store';
import {Provider} from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Navigation />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
