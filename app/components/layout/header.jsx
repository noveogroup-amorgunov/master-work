import React from 'react';
import { Link } from 'react-router';
import { t } from 'localizify';

import LanguageSwitcher from '../utils/language-switcher';

class Header extends React.Component {
  render() {
    return (
      <header id="header">
        <div className="header-wrap">
          <div className="header">
            <ul id="menu" className="menu">
              <li className="li logo">
                <Link to="/" className="black south" activeClassName="active" title="export-default">
                  <strong>
                  <i className="fa fa-mortar-board"></i> sci-permute
                  </strong>
                </Link>
              </li>
              {/* <li className="li"><Link to="/add" activeClassName="active"><u>{t('Add')}</u></Link></li> */}
              <li className="li"><Link to="/dashboard" activeClassName="active"><u>{t('Profile')}</u></Link></li>
              <li className="li"><Link to="/reviews" activeClassName="active"><u>{t('Reviews')}</u></Link></li>
              {this.props.isAdmin && (
                <li className="li"><Link to="/users" activeClassName="active"><u>{t('Users')}</u></Link></li>
              )}

              <li className="li right"><LanguageSwitcher /></li>
              <li className="li right">
                {this.props.loggedIn ? (
                  <span>{t('Hi')}, <b>{localStorage.email}</b> <Link to="/logout"><u>{t('Logout')}</u></Link></span>
                ) : (
                  <span>
                    <Link to="/login" activeClassName="active">{t('Login')}</Link>
                    <Link to="/signup" activeClassName="active">{t('Sign up')}</Link>
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
};

export default Header;