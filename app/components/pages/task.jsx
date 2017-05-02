import React from 'react';
import $ from 'jquery';
import { t } from 'localizify';
import { withRouter } from 'react-router';
import { Link } from 'react-router';

import Loader from '../utils/loader';
import auth from '../../auth';
import formatText from '../../utils/format-str';
import declOfNum from '../../utils/number-dec';
import timeAgo from '../../utils/time-ago';

import TaskService from '../../services/task';

const TaskPage = withRouter(React.createClass({
  getInitialState() {
    return {
      data: {},
      loading: true
    };
  },

  componentDidMount() {
    const taskService = new TaskService();
    const taskId = this.props.params.id;

    taskService.getById(taskId)
    .then((task) => {
      console.log(task);
      this.setState({
        data: task,
        loading: false
      });
    });
  },

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    if (!this.state.data) {
      return (<div>{t('Task not found')}</div>);
    }

    const { _id: id, outputFile, error, status, name, created_at: createdAt, description, exucatedTime } = this.state.data;
    const server = this.state.data.server;
    // console.log(server);
    return (
      <div>
        <h1>{name}</h1>
        <div className="row task-container">
          <div className={`task-status task-status-${status || 'new'}`}></div>
          <Link to={`/task/${id}`} className="">{name}</Link>
          <span className="task-date"><span title={createdAt} className="relativetime">{t('Created')} {timeAgo(createdAt)}</span></span>
          <div className="task-description">{description}</div>
          <div className="task-description">
            {status === 'done' && `${t('Time of exucated')}: ${(exucatedTime || 0) / 1000} ${t('sec')}`}
            <b className="task-error">{error && t(error)}</b>
          </div>
        </div>
        <div className="clear padding-bottom-10"></div>

        <div className="task-content">
          {t('Server')}: {server.name} <br />
          {outputFile && (<a href={`https://4754dc5a.ngrok.io/uploads/${outputFile}`}>{t('Download results')}</a>)}
        </div>
      </div>
    );
  }
}));

export default TaskPage;
