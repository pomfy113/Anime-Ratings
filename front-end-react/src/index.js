import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './home.css';
import './home-mobile.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './redux/reducers';

import { getModal } from './redux/actions'


const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
