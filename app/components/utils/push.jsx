import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

const Push = React.createClass({
  render() {
    // const { text } = this.props;

    return (
      <div className="push_subscribe fadeIn">
        <div className="push_subscribe__shadow"></div>

        <div className="push_subscribe__container">
          <p className="push_subscribe__text">
            Узнавайте первым <span className="red">важные</span>новости
          </p>
          <div className="push_subscribe__button subscribe">Подписаться</div>
          <div className="push_subscribe__close"></div>
        </div>
      </div>
    );
  }
});

export default Push;

