import React from 'react';
import { t } from 'localizify';
import DocumentTitle from 'react-document-title';

class ReviewsPage extends React.Component {
  render() {
    return (
      <DocumentTitle title={t('Reviews')}>
        <p>{t('Reviews')}</p>
      </DocumentTitle>
    );
  }
}

export default ReviewsPage;
