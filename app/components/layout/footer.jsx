import React from 'react';
import { t } from 'localizify';

const Footer = () => (
  <footer className="footer" id="footer">
    <div className="copyright">
      {t('Created using')} <a href="#">HapiJS</a> &amp; <a href="#">ReactJS</a>  | <span className="js-now-year">2017</span>
    </div>
  </footer>
);

export default Footer;