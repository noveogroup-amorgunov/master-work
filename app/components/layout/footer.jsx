import React from 'react';
import { t } from 'localizify';
import { Link } from 'react-router';

const Footer = () => (
  <footer className="footer" id="footer">
    <div className="copyright">
    <a href="mailto:fxl@list.ru">{t('Send mail to admin')}</a> | <Link to="/help">{t('Help')}</Link> | {t('Created using')} <a href="#">HapiJS</a> &amp; <a href="#">ReactJS</a>  | <span className="js-now-year">2017</span>
    </div>
  </footer>
);

export default Footer;