import 'babel-polyfill'; // generators
import React from 'react';
import { render as renderReact } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Settings from './components/settings';

const state = JSON.parse(localStorage.getItem('state'));
const store = configureStore(state || {});

renderReact(
    <Provider store={store}>
      <Settings/>
    </Provider>,
    document.getElementById('root')
);
