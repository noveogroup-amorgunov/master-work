import React from 'react';
import DocumentTitle from 'react-document-title';
import { t } from 'localizify';
import { Link } from 'react-router';

const HomePage = () => (
  <DocumentTitle title={t('Page not found')}>
    <div>
      <h2>{t('Page not found')}</h2>
      <p>{t('We are sorry but the page you are looking for does not exist')}.
        <br />
        <Link to="/">{t('Go to main page?')}</Link>
      </p>
    </div>
  </DocumentTitle>
);

export default HomePage;
