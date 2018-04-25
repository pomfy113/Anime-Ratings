import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './css/home.css';
import './css/modal.css';
import './css/home-mobile.css';
import './css/modal-mobile.css';

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
