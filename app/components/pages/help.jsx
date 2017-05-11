import React from 'react';
import DocumentTitle from 'react-document-title';
import { t } from 'localizify';

const HomePage = () => (
  <DocumentTitle title={t('Help')}>
    <div>
      <h2>{t('Help')}</h2>
    </div>
  </DocumentTitle>
);

export default HomePage;
