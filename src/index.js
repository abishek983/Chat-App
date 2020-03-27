import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route , BrowserRouter as Router } from 'react-router-dom';
import loginComponent from './login/login';
import signupComponent from './signup/signup';
import dashboardComponent from './dashboard/dashboard';
const firebaseConfig = require('./keys/firebaseConfig');

const firebase = require("firebase");
require("firebase/firestore"); // Required for side-effects?????
firebase.initializeApp(firebaseConfig.default);

const routing =(
  <Router>
    <div id='routing-container'>
      <Route path='/login' component={loginComponent}></Route>
      <Route path='/signup' component={signupComponent}></Route>
      <Route path='/dashboard' component={dashboardComponent}></Route>
    </div>
  </Router>
);


ReactDOM.render(
  <React.StrictMode>
    {routing}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
