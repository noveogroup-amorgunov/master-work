import React from 'react';
import { Router, withRouter, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { t } from 'localizify';
import $ from 'jquery';
import DocumentTitle from 'react-document-title';
import auth from '../../auth';
import formatText from '../../utils/format-str';
import TaskService from '../../services/task';
import ServerService from '../../services/server';
import ProgramService from '../../services/program';
import Loader from '../utils/loader';

class AddTaskPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      message: '',
      inputValue: '',
      loading: true,
      servers: [],
      isValidConfig: null,
      configMsg: ''
    };

    this.serverService = new ServerService();
    this.programService = new ProgramService();

    this.serverService.get().then((servers) => {
      this.setState({
        loading: false,
        servers
      });
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateConfig = this.validateConfig.bind(this);
  }

  validateConfig(event) {
    event.preventDefault();

    this.programService.validate({ data: this.refs.config.value }).then((response) => {
      if (response && response.result) {
        this.setState({
          isValidConfig: true,
          configMsg: '',
        });
      } else {
        this.setState({
          isValidConfig: false,
          configMsg: t(response.msg || 'Unvalid config'),
        });
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // todo if config valid when continue


    const data = {
      name: this.refs.name.value,
      description: this.refs.description.value,
      server: $(this.refs.server).val(),
      program: $(this.refs.program).val(),
      config: this.refs.config.value,
    };
    console.log(data);
    const service = new TaskService();
    const inputFile = {}; // , { inputFile }
    // service.uploadInputData(inputData).then((inputFile) => {
    service.add(Object.assign({}, data)).then((response) => {
      // this.setState({ data, loading: false });
      if (response.message) {
        browserHistory.goBack(); // go to dashboard
      } else {
        console.error(response);
      }
    }).catch(console.error);
    return false;
  }

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    const configClassName = this.state.isValidConfig ? 'success' : this.state.isValidConfig === false ? 'error' : '';

    return (
      <DocumentTitle title={t('Add task')}>
        <div>
          <h1>{t('Add task')}</h1>
            <form onSubmit={this.handleSubmit}>
              {t('Task name')}: <input ref="name" type="text" name="name" required="required" /><br />
              {t('Task description')}: <textarea style={{ height: '100px' }} className="comment" ref="description" name="comment" /><br />
              <hr className="light" />


              {t('Server')}:
              <div className="select-style"><select ref="server">
                {this.state.servers.map((item, index) =>
                  <option key={index} value={item._id}>{t(item.name)}</option>
                )}
              </select></div>
              <br />

              {t('Program')}:
              <div className="select-style" style={{ marginBottom: '10px' }}><select ref="program">
                <option value="5908119b654e3f0e2e6de414">{t('Permutation test')}</option>
              </select><br /></div>

              {t('Input data')}: <input ref="input" name="input" type="file" /><br />

              {t('Config file')}: <textarea
                className={configClassName}
                onChange={this.validateConfig}
                style={{ height: '100px' }}
                ref="config"
                name="config"
                required="required"
              /><br />
              <span className="message-error">
              {this.state.configMsg && (
                <p>{t(this.state.configMsg)}</p>
              )}
              </span>

              <br />
              <button className="btn btn-block btn-social btn-github" type="submit">{t('Add task')}</button>
              {this.state.error && (
                <p>{this.state.message}</p>
              )}
            </form>
        </div>
      </DocumentTitle>
    );
  }
}

export default AddTaskPage;
