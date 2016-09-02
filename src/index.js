import 'babel-polyfill'; // generators
import React from 'react';
import { render as renderReact } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Settings from './components/settings';

const store = configureStore(process.env.ENV === 'development');

renderReact(
    <Provider store={store}>
      <Settings/>
    </Provider>,
    document.getElementById('root')
);
