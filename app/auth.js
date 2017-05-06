import $ from 'jquery';
import { t } from 'localizify';

/*
const fetchAuth = (email, pass, cb) =>
  setTimeout(() => {
    console.log(email, pass);
    if (email === 'joe@mail.ru' && pass === 'pass1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7),
        id: 1,
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
*/

function pretendRegisterRequest(data, cb) {
  console.log(`pretendRegisterRequest: ${JSON.stringify(data)}`);
  $.ajax({
    type: 'POST',
    url: `${window.config.proxy}/api/signup`,
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: (response) => {
      console.log(response);
      if (response.token) {
        cb({
          authenticated: true,
          token: response.token,
          user: response.user,
        });
      } else {
        cb({ authenticated: false, message: response.message });
      }
    },
    error: (xhr, status, err) => {
      console.error(status, err.toString());
      cb({ authenticated: false });
    }
  });
}

function pretendRequest(data, cb) {
  console.log(`pretendREquest: ${JSON.stringify(data)}`);
  $.ajax({
    type: 'POST',
    url: `${window.config.proxy}/api/login`,
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: (response) => {
      console.log(response);
      if (response.token) {
        cb({
          authenticated: true,
          token: response.token,
          user: response.user,
        });
      } else {
        cb({ authenticated: false, message: response.message });
      }
    },
    error: (xhr, status, err) => {
      console.error(status, err.toString());
      cb({ authenticated: false });
    }
  });
}

export default {
  login(data = {}, cb) {
    cb = arguments[arguments.length - 1];

    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }

    if (!data.email || !data.password) {
      if (cb) cb(false);
      this.onChange(false);
      return;
    }

    pretendRequest(data, (res) => {
    // fetchAuth(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        localStorage.userId = res.user._id;
        localStorage.email = data.email;
        localStorage.isAdmin = !!res.user.isAdmin;
        if (cb) cb(true, res.message);
        this.onChange(true);
      } else {
        if (cb) cb(false, res.message);
        this.onChange(false);
      }
    });
  },

  register(data = {}, cb) {
    cb = arguments[arguments.length - 1];

    if (!data.email || !data.password) {
      if (cb) cb(false, t('Enter email and password'));
      this.onChange(false);
      return;
    }

    pretendRegisterRequest(data, (res) => {
      if (res.authenticated) {
        /*localStorage.token = res.token;
        localStorage.email = data.email;
        localStorage.userId = res.user._id;*/
        if (cb) cb(true, res.message);
        this.onChange(true);
      } else {
        if (cb) cb(false, res.message);
        this.onChange(false);
      }
    });
  },

  getToken() {
    return localStorage.token;
  },

  getEmail() {
    return localStorage.email;
  },

  getId() {
    return localStorage.userId;
  },

  logout(cb) {
    delete localStorage.token;
    delete localStorage.email;
    delete localStorage.userId;
    delete localStorage.isAdmin;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  isAdmin() {
    // hack that localStorage save isAdmin as string -_-
    return this.loggedIn() && localStorage.isAdmin == 'true';
  },

  onChange() {}
};
