import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import localizify, { t } from 'localizify';

class LanguageSwitcher extends React.Component {
  static getClass(locale) {
    return localizify.getLocale() === locale ? 'active' : '';
  }

  static onChangeLocale(event) {
    if (!$(event.target).hasClass('active')) {
      const locale = $(event.target).data('locale');
      localStorage.locale = locale;
      location.reload();
    }
  }

  render() {
    return (
      <div className="language-switcher">
        <span className="mobile">Change language: </span>
        <span data-locale="en" onClick={LanguageSwitcher.onChangeLocale} className={LanguageSwitcher.getClass('en')}>EN</span>
        <span data-locale="ru" onClick={LanguageSwitcher.onChangeLocale} className={LanguageSwitcher.getClass('ru')}>RU</span>
      </div>
    );
  }
}

export default LanguageSwitcher;
