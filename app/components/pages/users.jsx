import React from 'react';
import auth from '../../auth';
import { t } from 'localizify';
import DocumentTitle from 'react-document-title';
import Loader from '../utils/loader';
import UserService from '../../services/user';
import UserList from '../items/user-list';

const UsersPage = React.createClass({
  getInitialState() {
    return {
      users: {},
      loading: true
    };
  },

  componentDidMount() {
    const service = new UserService();
    service.getUsers().then(users => {
      this.setState({
        loading: false,
        users
      });
    });
  },

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    return (
      <DocumentTitle title={t('Users')}>
        <div className="margin-top-20">
          <h2>{t('Users')}:</h2>
          <UserList data={this.state.users} />
        </div>
      </DocumentTitle>
    );
  }
});

export default UsersPage;
