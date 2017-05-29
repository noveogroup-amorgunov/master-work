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
import UploadService from '../../services/upload';
import Loader from '../utils/loader';
import { Link } from 'react-router';

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
      configMsg: '',
      inputFile: null,
      configFile: null,
    };

    this.serverService = new ServerService();
    this.programService = new ProgramService();
    this.uploadService = new UploadService();
    this.service = new TaskService();

    this.serverService.get().then((servers) => {
      servers.unshift({ _id: -1, name: t('Select server automatically') });
      this.setState({
        loading: false,
        servers
      });
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateConfig = this.validateConfig.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadConfigFile = this.uploadConfigFile.bind(this);
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


    if (!this.state.inputFile || !this.state.configFile) {
      return this.setState({
        error: true,
        message: t('Input file and config file is required'),
      });
    }

    if (!this.state.isValidConfig) {
      return this.setState({
        error: true,
        message: t('Unvalid config'),
      });
    }

    const data = {
      name: this.refs.name.value,
      description: this.refs.description.value,
      server: $(this.refs.server).val(),
      program: $(this.refs.program).val(),
      inputFile: this.state.inputFile._id,
      config: this.state.configFile._id,
    };

    // console.log(data);

    this.service.add(Object.assign({}, data)).then((response) => {
      // this.setState({ data, loading: false });
      if (response.message) {
        browserHistory.goBack(); // go to dashboard
      } else {
        console.error(response);
      }
    }).catch(console.error);

    return false;
  }

  uploadConfigFile(event) {
    this.uploadFile(event, true);
  }

  uploadFile(event, isConfigFile = false) {
    const file = (event.target.files[0]);
    const formData = new FormData();
    formData.append('file', file);

    this.uploadService.add(formData, isConfigFile).then((response) => {
      // this.setState({ data, loading: false });
      console.log(response);
      if (isConfigFile) {
        this.setState({
          configFile: response.data
        });

        if (!response.isValidConfig) {
          this.setState({
            isValidConfig: false,
            configMsg: t(response.msg || 'Unvalid config'),
          });
        } else {
          this.setState({
            isValidConfig: true,
            configMsg: '',
          });
        }
      } else {
        this.setState({
          inputFile: response.data
        });
      }
    }).catch(console.error);
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
              <span className="message-text"><p>{t('Automatically server selecting choose server which solve task is more faster')}</p></span>
              {/* <br /> */}

              {t('Program')}:
              <div className="select-style" style={{ marginBottom: '10px' }}><select ref="program">
                <option value="5908119b654e3f0e2e6de414">{t('Permutation test')}</option>
              </select><br /></div>

              {t('Input data')}: (<span className="message-text"><Link target="_blank" to="help#example-input-file">{t('See example of input data file')}</Link></span>)
              <input
                type="file"
                accept="image/txt"
                ref="input-file"
                onChange={this.uploadFile}
              />
              <br />

              {t('Config file')} (<span className="message-text">{t('Config file should be matched by pattern')}, <Link target="_blank" to="help#example-config-file">{t('see example of config file')}</Link></span>)
              <input
                type="file"
                accept="image/txt"
                ref="input-file"
                onChange={this.uploadConfigFile}
              />
              <br />
              <span className="message-error">
              {this.state.configMsg && (
                <p>{t(this.state.configMsg)}</p>
              )}
              </span>

              {/*<textarea
                className={configClassName}
                onChange={this.validateConfig}
                style={{ height: '100px' }}
                ref="config"
                name="config"
                required="required"
              /> */}

              <br />
              <button className="btn btn-block btn-social btn-github" type="submit">{t('Add task')}</button>
              {this.state.error && (
                <span className="message-error"><p>{t(this.state.message)}</p></span>
              )}
            </form>
        </div>
      </DocumentTitle>
    );
  }
}

export default AddTaskPage;
