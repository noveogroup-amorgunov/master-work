import React from 'react';
import { withRouter } from 'react-router';
import { t } from 'localizify';
import auth from '../../auth';

const SignupPage = withRouter(
  React.createClass({

    getInitialState() {
      return {
        error: false,
        message: ''
      };
    },

    handleSubmit(event) {
      event.preventDefault();

      const data = {
        email: this.refs.email.value,
        password: this.refs.pass.value,
        firstname: this.refs.firstname.value,
        secondname: this.refs.secondname.value,
        job: this.refs.job.value,
      };

      auth.register(data, (loggedIn, message = t('Wrong email/password')) => {
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
        <form onSubmit={this.handleSubmit}>
          <label><input required="required" type="email" ref="email" placeholder={t('email')}/></label><br />
          <label><input required="required" type="password" ref="pass" placeholder={t('password')}/></label><br />
          <label><input required="required" type="text" ref="firstname" placeholder={t('firstname')}/></label><br />
          <label><input required="required" type="text" ref="secondname" placeholder={t('secondname')}/></label><br />
          <label><input type="text" ref="job" placeholder={t('job')}/></label><br />
          <button className="btn btn-block btn-social btn-linkedin" type="submit">{t('Sign up 2')}</button>
          {this.state.error && (
            <p>{t(this.state.message)}</p>
          )}
        </form>
      );
    }
  })
);

export default SignupPage;
