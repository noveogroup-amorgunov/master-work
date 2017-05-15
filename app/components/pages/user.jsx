import React from 'react';
import $ from 'jquery';
import { t } from 'localizify';

import { Link } from 'react-router';
import UserService from '../../services/user';
import TaskService from '../../services/task';

import Loader from '../utils/loader';
import declOfNum from '../../utils/number-dec';

import TaskListSmall from '../items/task-list-small';
// import QuestionListSmall from '../items/question-list-small';
// import AnswerListSmall from '../items/answer-list-small';

const UserPage = React.createClass({
  getInitialState() {
    return {
      data: {},
      tasks: [],
      user: null,
      isExist: false,
      loading: true
    };
  },
  componentDidMount() {
    const userId = this.props.params.id;
    const service = new UserService();
    const taskService = new TaskService();

    Promise.all([
      taskService.get(),
      service.getMe(),
    ]).then(([tasks, user]) => {
      this.setState({ loading: false });
      console.log(user);
      if (!user) {
        return;
      }
      this.setState({
        isExist: true,
        tasks,
        user
      });
    });
  },

  onUpdate() {
    const taskService = new TaskService();
    this.setState({ loading: true });
    taskService.get().then((tasks) => {
      this.setState({ loading: false });

      this.setState({
        isExist: true,
        tasks
      });
    });
  },

  onDelete(event) {
    const id = $(event.target).data('id');

    const taskService = new TaskService();
    this.setState({ loading: true });
    taskService.delete(id).then(() => {
      this.setState({ loading: false });
      const tasks = this.state.tasks.filter(item => id !== item._id);
      this.setState({
        isExist: true,
        tasks
      });
    });
  },

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    if (!this.state.isExist) {
      return (<div><h2>{t('User haven\'t exist')}</h2></div>);
    }

    // console.log(this.state.data);
    const tasks = this.state.tasks || [];
    const username = `${this.state.user.firstname} ${this.state.user.secondname}`;
    return (
      <div>
        <h2>{this.props.dashboard ? t('Hello') + ', ' : t('User\'s page')} {username}</h2>

        <div className="grey">
          {t('Here you can see own profile, add new task and see list of your tasks')}.
        </div>
        <hr className="light" />
        <div className="margin-top-20">

          <Link to="/add" className="btn btn-block btn-social btn-linkedin" type="submit">{t('Add task')}</Link>

          {/* <div className="user-stats">
            <div className="row">
                <div className="stat answers col-3">
                    <span className="number">{tasks.length}</span>
                    {declOfNum(tasks.length, [t('question'), t('questions'), t('questions-2')])}
                </div>
            </div>
          </div> */}
          <div className="clear"></div>
          <div className="margin-top-20">
            <h2>{t('Tasks')}:</h2>
            <a href="#" onClick={this.onUpdate}>{t('Update tasks list')}</a>
            <TaskListSmall data={tasks} onDelete={this.onDelete} />
          </div>
          {/* <div className="margin-top-20">
            <h2>{t('Answer')}</h2>
            <AnswerListSmall data={answers} />
          </div> */}
        </div>
      </div>
    );
  }
});

export default UserPage;
