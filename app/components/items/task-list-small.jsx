import React from 'react';
import $ from 'jquery';
import { t } from 'localizify';
import { Link } from 'react-router';

import declOfNum from '../../utils/number-dec';
import timeAgo from '../../utils/time-ago';
import formatText from '../../utils/format-str';
import UserSign from '../utils/user-sign';
import Vote from './vote';

class TaskListSmallItem extends React.Component {
  render() {
    console.log(this.props.data);
    const { _id: id, outputFile, error, status, name, created_at: createdAt, description, exucatedTime } = this.props.data;
    
    const file = outputFile ? `${window.config.proxy}/uploads/${outputFile}` : '#';

    return (
      <div className="row task-container">
        <div className={`task-status task-status-${status || 'new'}`}></div>
        {/* <Link to={`/task/${id}`} className="">{name}</Link> */}
        <a target="_blank" href={file} className="">{name}</a>
        <span className="task-date"><span title={createdAt} className="relativetime">{t('Created')} {timeAgo(createdAt)}</span></span>
        <div className="task-description">{description}</div>
        <div className="task-description">
          {status === 'done' && `${t('Time of exucated')}: ${(exucatedTime || 0) / 1000} ${t('sec')}`}
          <b className="task-error">{error && t(error)}</b>
        </div>
      </div>
    );
  }
}

const TaskListSmall = React.createClass({
  componentDidMount() {},

  render() {
    const data = this.props.data;

    if (!data || !data.length) {
      return (<div>{t('User haven\'t tasks yet')}</div>);
    }

    return (
      <div className="tasks-list-small">
        {data.map((item, index) =>
          <div key={index}>
            <TaskListSmallItem data={item} />
          </div>
        )}
      </div>
    );
  }
});

export default TaskListSmall;
