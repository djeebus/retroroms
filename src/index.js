import {remote} from 'electron';
import 'babel-polyfill'; // generators
import React from 'react';
import { render as renderReact } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import Settings from './components/settings';

const store = configureStore(remote.app.devMode);

renderReact(
    <Provider store={store}>
      <Settings/>
    </Provider>,
    document.getElementById('root')
);
