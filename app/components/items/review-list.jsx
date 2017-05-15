import React from 'react';
import $ from 'jquery';
import { t } from 'localizify';
import { Link } from 'react-router';
import Loader from '../utils/loader';
import timeAgo from '../../utils/time-ago';
import ReviewService from '../../services/review';
import auth from '../../auth';

class ReviewItem extends React.Component {
  render() {
    const data = this.props.data;
    let user = data.user;

    if (!user) {
      user = {
        username: data.username || t('Guest'),
        email: data.email,
      };
    } else {
      user.username = `${user.firstname} ${user.secondname}`;
    }

    const formatLabel = (label, value) => {
      if (!value) {
        return label;
      }
      return (<span>
        { label.split(value)
          .reduce((prev, current, i) => {
            if (!i) {
              return [current];
            }
            return prev.concat(<Link to="/help" key={value + current}><b>{t('Help')}</b></Link>, current);
          }, [])
        }
      </span>);
    };

    let answer = false;
    if (data.answer) {
      answer = formatLabel(data.answer, '{/help}');
    }

/*
    {data.roles !== 'admin' && (<div style={{ float: 'right', width: '120px' }}>
      <a data-id={data._id} href="#" onClick={button.onClick} style={{ height: '23px', padding: '0px 5px' }} className="btn btn-block btn-social btn-linkedin">{button.text}</a>
      <a data-id={data._id} href="#" onClick={this.props.onDelete} style={{ height: '23px', padding: '0px 5px' }} className="btn btn-block btn-social btn-github">Удалить</a>
    </div>)}
    <div style={{ fontSize: '16px' }}><b>{data.firstname} {data.secondname}</b></div>
    <div>
      Почта: <a href={`mailto:${data.email}`}>{data.email}</a> <br/>
      Место работы: {data.job} <br/>
      Телефон: {data.phone} <br/>
      Причина: {data.comment} <br/>
      Дата регистрация: {timeAgo(data.created_at)} <br/>
    </div>
*/
    return (
      <div className="row review-container">
        <div className="review-author">
          <strong>{user.username}  (<a href={`mailto:${user.email}`}>{user.email})</a></strong>
          <span className="review-time">
          {timeAgo(data.created_at)}
          </span>
        </div>
        <div className="review-text">
          {data.text}
          {data.answer && (<div style={{ paddingTop: '10px' }}>
            <span className="review-text-answer">
              <b>{t('Admin answer')}: </b> {answer}
            </span>
          </div>)}
        </div>
        {auth.isAdmin() && (<div className="review-answer">

          <div className="review-answer-form hidden">
            <hr />
            <form className="form">
              <label>
                <textarea placeholder={t('Type your answer')}></textarea>
              </label>
            </form>
          </div>

          <a href="#" onClick={this.props.onAnswer} data-id={data._id}>{t('Get answer')}</a>
        </div>)}
      </div>
    );
  }
}

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: {},
      loading: false
    };
  }

  componentDidMount() {
    this.service = new ReviewService();
    this.setState({
      reviews: this.props.data || []
    });
  }

  onAnswer(event) {
    event.preventDefault();
    const $form = $(event.target).parent().find('.review-answer-form');
    const answer = $form.find('textarea').val();
    if (!answer) {
      $form.toggleClass('hidden');
    } else {
      this.setState({ loading: true });
      const id = $(event.target).data('id');

      this.service
        .addAnswer({ id, answer })
        .then(() => {
          $form.toggleClass('hidden');
          $form.find('textarea').val('');
          this.service.get().then((reviews) => {
            this.setState({ loading: false, reviews });
          });
        });
    }
  }

  handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ loading: true });

    const email = this.refs.email.value;
    const username = this.refs.name.value;
    const text = this.refs.text.value;

    const data = { email, username, text };

    if (auth.loggedIn()) {
      data.user = auth.getId();
    }

    this.service.add(data).then(() => {
      this.service.get().then((reviews) => {
        this.setState({
          loading: false,
          reviews
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (<Loader isActive="true" />);
    }

    const reviews = this.state.reviews;

    if (!reviews || !reviews.length) {
      return (<div>{t('Error')}</div>);
    }

    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          <label><input required="required" type="email" ref="email" placeholder={t('your email')} defaultValue={auth.getEmail() || ''} /></label><br />
          <label><input required="required" type="name" ref="name" placeholder={t('your name')} defaultValue={auth.getName() || ''} /></label><br />
          <label><textarea ref="text" placeholder=""></textarea></label><br />
          <button className="btn btn-block btn-social btn-linkedin" type="submit">{t('Add review')}</button>
          <span className="message-error">
          {/* {this.state.error && (
            <p>{t(this.state.message)}</p>
          )} */}
          </span>
        </form>
        <div className="margin-top-20 reviews-list">
          {reviews.map((item, index) =>
            <div key={index}>
              <ReviewItem
                data={item}
                onAnswer={this.onAnswer.bind(this)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ReviewList;
