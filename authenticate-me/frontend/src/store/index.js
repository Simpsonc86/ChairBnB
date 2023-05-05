// frontend/src/store/index.js


///Setting up the redux store

// import createStore, combineReducers, applyMiddleware, and compose from the redux package. Import thunk from redux-thunk.
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


// Create a rootReducer that calls combineReducers and pass in an empty object for now.
const rootReducer = combineReducers({
});


//Initialize an enhancer variable that will be set to different store enhancers depending on if the Node environment is in development or production.
let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// create a configureStore function that takes in an optional preloadedState. Return createStore invoked with the rootReducer, the preloadedState, and the enhancer.

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };

// Finally, export the configureStore function at the bottom of the file as the default export.  
  
  export default configureStore;