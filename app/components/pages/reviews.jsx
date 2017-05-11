import React from 'react';
import { t } from 'localizify';
import DocumentTitle from 'react-document-title';
import Loader from '../utils/loader';
import ReviewService from '../../services/review';
import ReviewList from '../items/review-list';

class ReviewsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: {},
      loading: true
    };
  }

  componentDidMount() {
    const service = new ReviewService();
    service.get().then((reviews) => {
      this.setState({
        loading: false,
        reviews
      });
    });
  }


  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    return (
      <DocumentTitle title={t('Reviews')}>
        <div>
          <h2>{t('Reviews')}</h2>
          <div className="grey">
            {t('Here you can leave a feedback about the platform or ask a question')}.
          </div>
          <hr className="light" />

          <div className="margin-top-20">
            <ReviewList data={this.state.reviews} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default ReviewsPage;
