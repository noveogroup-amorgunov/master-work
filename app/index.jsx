import ReactDOM from 'react-dom';
import React from 'react';
import { Router, useRouterHistory /*, browserHistory*/ } from 'react-router';
import localizify from 'localizify';
import { createHistory } from 'history';

import en from './messages/en.json';
import ru from './messages/ru.json';
import routes from './routers/routers.jsx';

window.config = {
  basename: '/',
  proxy: process.env.API_URL
  // 'https://4754dc5a.ngrok.io/'
};

localizify
  .add('en', en)
  .add('ru', ru)
  .setLocale(localStorage.locale || localizify.detectLocale() || 'en');

const browserHistory = useRouterHistory(createHistory)({
  basename: window.config.basename
});

ReactDOM.render(
  <Router routes={routes} history={browserHistory}></Router>,
  document.getElementById('app')
);
