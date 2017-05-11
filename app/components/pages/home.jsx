import React from 'react';
import DocumentTitle from 'react-document-title';
import { t } from 'localizify';

const HomePage = () => (
  <DocumentTitle title={t('Home page')}>
    <div>
      {/* <Questions fetched="false" /> */}
      <h2>{t('About system')}</h2>
      <p>{t('The information system is designed to provide convenient access to users for computing resources')} <b><a target="_blank" href="http://www.sscc.icmmg.nsc.ru/">{t('The Siberian Supercomputer Center SB RAS')}</a></b> {t('to perform tasks')} <b><a href="#">{t('the permutation test')}</a></b>.</p>

      <img className="preview-img preview-img--first" src="https://d84525d1.ngrok.io/resources/img/35.JPG" />
      <img className="preview-img" src="https://d84525d1.ngrok.io/resources/img/50.jpg" />

      <p>{t('Also the system supports the possibility of sharing the experience of using the permutation test and the results obtained with the tools of the electronic library and the possibility of open discussion of published articles.')}</p>
      <h2>{t('Publications')}</h2>

      <ol>
        <li><a target="_blank" href="http://faculty.washington.edu/kenrice/sisg/SISG-08-06.pdf"><small>ENG, {t('Presentation')}</small> <b>Permutation tests</b>, Ken Rice, Thomas Lumley, UW Biostatistics, <small>Seattle, June 2008</small></a></li>
        <li><a target="_blank" href="http://www.let.rug.nl/~nerbonne/teach/rema-stats-meth-seminar/presentations/Permutation-Monte-Carlo-Jianqiang-2009.pdf"><small>ENG, {t('Presentation')}</small> <b>Permutation Test & Monte Carlo Sampling</b>, MA, Jianqiang, <small>March 18th, 2009</small></a></li>
        <li><a target="_blank" href="http://www.let.rug.nl/~nerbonne/teach/rema-stats-meth-seminar/presentations/Permutation-Monte-Carlo-Jianqiang-2009.pdf"><small>RU, {t('Article')}</small> <b>Permutation Test </b>, MA, Jianqiang, <small>March 18th, 2009</small></a></li>
        <li><a target="_blank" href="http://www.fil.ion.ucl.ac.uk/spm/doc/books/hbf2/pdfs/Ch16.pdf"><small>ENG, {t('Article')}</small> <b>Nonparametric Permutation Tests
      for Functional Neuroimaging</b>, T.E. Nichols, A.P. Holmes, <small>March 4, 2003</small></a></li>
      </ol>

      <h2>{t('Available programs for the permutation test (PT)')}</h2>

      <ol>
        <li>
          <a href="#"><b>{t('The test for the analysis of genetic determination of traits')}</b></a><br />

            <small>
              <p><b>Назначение</b> Программа предназначена для проведения перестановочных тестов. Разработанные методы применяются для  случаев, когда нет возможности получить истинные повторения наблюдений. Программа позволяет формировать так называемые "псевдовыборки".  На основе этих псевдовыборок можно получить необходимые характеристики искомого параметра: оценки математического ожидания, дисперсии, доверительного интервала.</p><p><b>Область применения</b> Представленный вариант позволяет проводить перестановочный тест в задачах генетики, но при небольшой переработке или соблюдении шаблона входного файла можно решать задачи из другой области. <a href="#">Читать подробнее</a></p>
            </small>

        </li>
      </ol>
    </div>
  </DocumentTitle>
);

export default HomePage;
