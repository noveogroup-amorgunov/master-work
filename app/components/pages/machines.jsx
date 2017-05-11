import React from 'react';
import $ from 'jquery';
import { t } from 'localizify';
import DocumentTitle from 'react-document-title';

import Loader from '../utils/loader.jsx';
import { ServerService } from '../../services/server.js';

const getImage = name => `/resources/img/${name}.png`;

class ServerItem extends React.Component {
  render() {
    const data = this.props.data;
    const statusClasses = ['server-status'];

    const statusName = data.isAvailable ? t('active') : t('disactive');
    const onClick = data.isAvailable ? this.props.onTurnOff : this.props.onTurnOn;
    const onClickName = data.isAvailable ? t('turn off server') : t('turn on server');

    if (data.isAvailable) {
      statusClasses.push('server-status-on');
    }

    return (
      <div className="server">
        <div className={statusClasses.join(' ')}></div>
        <div className="server-img">
          <img src={getImage(data.img)} />
        </div>
        <div className="server-name">
          <b>{data.name}</b>
        </div>
        <div className="server-desc">
          {statusName}, <span data-id={data._id} onClick={onClick}>{onClickName}</span>
        </div>
      </div>
    );
  }
}

class ServersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: {},
      loading: true
    };

    this.service = new ServerService();
    this.service.get().then((servers) => {
      this.setState({
        loading: false,
        servers
      });
    });

    this.onTurnOff = this.onTurnOff.bind(this);
    this.onTurnOn = this.onTurnOn.bind(this);
  }

  onTurnOn(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ loading: true });
    const id = $(event.target).data('id');

    this.service.on(id).then(() => {
      this.service.get().then((servers) => {
        this.setState({ loading: false, servers });
      });
    });
  }

  onTurnOff(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ loading: true });
    const id = $(event.target).data('id');

    this.service.off(id).then(() => {
      this.service.get().then((servers) => {
        this.setState({ loading: false, servers });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    return (
      <DocumentTitle title={t('Servers')}>
        <div>
          <h2>{t('Servers')}</h2>
          <div className="grey">
            {t('Here you can turn on or off servers')}.
          </div>
          <hr className="light" />
          <div className="server-list margin-top-20">
            {this.state.servers.map((item, index) =>
              <div key={index}>
                <ServerItem
                  data={item}
                  onTurnOn={this.onTurnOn}
                  onTurnOff={this.onTurnOff}
                />
              </div>
            )}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default ServersPage;
