import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './redux/reducers';
import thunk from 'redux-thunk';

import { getModal } from './redux/actions';

import './home.css';
import './home-mobile.css';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// const store = createStoreWithMiddleware(reducers);
const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
