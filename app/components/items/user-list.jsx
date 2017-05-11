import React from 'react';
import $ from 'jquery';

import { t } from 'localizify';
import { Link } from 'react-router';

import Loader from '../utils/loader';
import timeAgo from '../../utils/time-ago';
import UserService from '../../services/user';

class UserItem extends React.Component {
  render() {
    // console.log(this.props.data);
    const data = this.props.data;
    const button = {
      onClick: this.props.onActive,
      text: t('Active'),
    };
    if (data.isActive) {
      button.onClick = this.props.onDisactive;
      button.text = t('Disactive');
    }

    // {/*  */}

    return (
      <div className="row task-container" style={{ height: 'auto' }}>
        {data.roles !== 'admin' && (<div style={{ float: 'right', width: '120px' }}>
          <a data-id={data._id} href="#" onClick={button.onClick} style={{ height: '23px', padding: '0px 5px' }} className="btn btn-block btn-social btn-linkedin">{button.text}</a>
          <a data-id={data._id} href="#" onClick={this.props.onDelete} style={{ height: '23px', padding: '0px 5px' }} className="btn btn-block btn-social btn-github">{t('Delete')}</a>
        </div>)}
        <div style={{ fontSize: '16px' }}><b>{data.firstname} {data.secondname}</b></div>
        <div>
          Почта: <a href={`mailto:${data.email}`}>{data.email}</a> <br/>
          Место работы: {data.job} <br/>
          Телефон: {data.phone} <br/>
          Причина: {data.comment} <br/>
          Дата регистрация: {timeAgo(data.created_at)} <br/>
        </div>
      </div>
    );
  }
}

const UserList = React.createClass({
  getInitialState() {
    return {
      loading: false,
      users: []
    };
  },

  componentDidMount() {
    this.service = new UserService();
    this.setState({
      users: this.props.data || []
    });
  },

  onDelete(event) {
    event.stopPropagation();
    this.setState({ loading: true });
    const id = $(event.target).data('id');

    this.service.delete(id).then(() => {
      this.service.getUsers().then((users) => {
        this.setState({
          loading: false,
          users
        });
      });
    });
  },

  onActive(event, action = true) {
    event.stopPropagation();
    this.setState({ loading: true });
    const id = $(event.target).data('id');

    this.service.updateStatus(id, action).then(() => {
      this.service.getUsers().then((users) => {
        this.setState({
          loading: false,
          users
        });
      });
    });
  },

  onDisactive(event) {
    this.onActive(event, false);
  },

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    const users = this.state.users;

    if (!users || !users.length) {
      return (<div>{t('Error')}</div>);
    }

    return (
      <div className="users-list">
        {users.map((item, index) =>
          <div key={index}>
            <UserItem
              data={item}
              onDelete={this.onDelete}
              onActive={this.onActive}
              onDisactive={this.onDisactive}
            />
          </div>
        )}
      </div>
    );
  }
});

export default UserList;
