import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import auth from '../auth';

import Header from './layout/header.jsx';
import Footer from './layout/footer.jsx';

const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: auth.loggedIn(),
      isAdmin: auth.isAdmin(),
    };
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn,
      isAdmin: auth.isAdmin(),
    });
  },

  componentWillMount() {
    auth.onChange = this.updateAuth;
    auth.login();
  },

  render() {
    return (
      <div>
        <Header loggedIn={this.state.loggedIn} isAdmin={this.state.isAdmin} />
        <section className="content" id="main">
          {this.props.children}
        </section>
        <Footer />
      </div>
    );
  }
});

export default App;
