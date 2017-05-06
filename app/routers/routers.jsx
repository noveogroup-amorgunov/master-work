import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../components/app.jsx';
import auth from '../auth';

import {
  HomePage,
  LoginPage,
  LogoutPage,
  AddTaskPage,
  DashboardPage,
  QuestionPage,
  QuestionsByTagPage,
  SignupPage,
  UserPage,
  ChangePasswordPage,
  TaskPage,
  ReviewsPage,
  UsersPage,
  ServersPage,
  HelpPage,
  PermutationTestPage,
} from '../components/index.jsx';


function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

function requireAdmin(nextState, replace) {
  if (!auth.isAdmin()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>

    <Route path="/login" component={LoginPage} />
    <Route path="/logout" component={LogoutPage} onEnter={requireAuth} />
    <Route path="/signup" component={SignupPage} />

    <Route path="/questions/:id" component={QuestionPage} />
    <Route path="/questions/tagged/:name" component={QuestionsByTagPage} />

    <Route path="/users/:name" component={UserPage} />

    <Route path="/add" component={AddTaskPage} onEnter={requireAuth} />
    <Route path="/reviews" component={ReviewsPage} />
    <Route path="/dashboard" component={DashboardPage} onEnter={requireAuth} />

    <Route path="/changepassword" component={ChangePasswordPage} onEnter={requireAuth} />

    <Route path="/task/:id" component={TaskPage} onEnter={requireAuth} />


    <Route path="/users" component={UsersPage} onEnter={requireAdmin} />
    <Route path="/servers" component={ServersPage} onEnter={requireAdmin} />
    <Route path="/help" component={HelpPage} />
    <Route path="/permutation-test" component={PermutationTestPage} />
  </Route>
);
