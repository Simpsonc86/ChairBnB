//frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Import BrowserRouter, Provider, and configureStore
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store';

import { restoreCSRF, csrfFetch } from './store/csrf';

import * as sessionActions from "./store/session";

// Create a variable to access your store and expose it to the window. 
const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Define a Root React functional component that returns the App component wrapped in Redux's Provider and React Router DOM's BrowserRouter provider components.
function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

// Call ReactDOM.render function passing in the Root component and the HTML element with the id of "root".
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
