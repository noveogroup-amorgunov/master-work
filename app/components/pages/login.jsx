import React from 'react';
import { withRouter } from 'react-router';
import { t } from 'localizify';
import auth from '../../auth';

const LoginPage = withRouter(
  React.createClass({

    getInitialState() {
      return {
        error: false,
        message: ''
      };
    },

    handleSubmit(event) {
      event.preventDefault();

      const email = this.refs.email.value;
      const password = this.refs.pass.value;

      auth.login({ email, password }, (loggedIn, message = t('Type wrong data')) => {
        if (!loggedIn) {
          return this.setState({ error: true, message: t(message) });
        }

        const { location } = this.props;

        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname);
        } else {
          this.props.router.replace('/');
        }
      });
    },

    render() {
      return (
        <form className="form" onSubmit={this.handleSubmit}>
          <label><input required="required" type="email" ref="email" placeholder={t('email')} defaultValue="joe@mail.ru" /></label><br />
          <label><input required="required" type="password" ref="pass" placeholder={t('password')} /></label><br />
          <button className="btn btn-block btn-social btn-linkedin" type="submit">{t('Login to system')}</button>
          <span className="message-error">
          {this.state.error && (
            <p>{t(this.state.message)}</p>
          )}
          </span>
        </form>
      );
    }
  })
);

export default LoginPage;
