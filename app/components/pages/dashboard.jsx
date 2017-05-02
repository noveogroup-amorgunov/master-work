import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { t } from 'localizify';

import auth from '../../auth';
import User from './user';

const DashboardPage = React.createClass({
  render() {
    const token = auth.getToken();
    const email = auth.getEmail();
    const id = auth.getId();

    return (
      <DocumentTitle title={t('Personal page')}>
        <div>
          <User dashboard={true} params={{ email, id }} />
          <div className="margin-top-20">
            <span>{t('Your token')}: <span className="token-text">{token}</span></span><br />
            <span><Link to="changepassword">{t('Change password')}</Link></span>
          </div>
        </div>
      </DocumentTitle>
    );
  }
});

export default DashboardPage;
