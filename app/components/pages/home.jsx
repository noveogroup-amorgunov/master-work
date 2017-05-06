import React from 'react';
import DocumentTitle from 'react-document-title';
import { t } from 'localizify';

const HomePage = () => (
  <DocumentTitle title={t('Home page')}>
    <div>
      {/* <Questions fetched="false" /> */}
      <h2>О Информационной системе</h2>

      <p>Информационная система предназначена для предоставления удобного доступа пользователям к вычислительным ресурсам <b><a target="_blank" href="http://www.sscc.icmmg.nsc.ru/">Сибирского Суперкомпьютерного центра</a></b> для выполнения задач <b><a href="#">перестановочного теста.</a></b></p>

      <img src="http://www.sscc.icmmg.nsc.ru/imgs/slider/35.JPG" style={{ paddingLeft: '50px', height: '200px', margin: '0 auto' }} />
      <img src="http://www.sscc.icmmg.nsc.ru/imgs/slider/50.jpg" style={{ height: '200px', margin: '0 auto' }} />


      <p>Также система поддерживает возможность обмена опытом использования перестановочного теста и полученными результатами средствами электронной библиотеки и возможности открытого обсуждения опубликованных статей.</p>
      <h2>Публикации</h2>

      <ol>
        <li><a href="#"><small>ENG, Презентация</small> <b>Permutation tests</b>, Ken Rice, Thomas Lumley, UW Biostatistics, <small>Seattle, June 2008</small></a></li>
        <li><a href="#"><small>ENG, Презентация</small> <b>Permutation Test & Monte Carlo Sampling</b>, MA, Jianqiang, <small>March 18th, 2009</small></a></li>
        <li><a href="#"><small>RU, Статья</small> <b>Permutation Test </b>, MA, Jianqiang, <small>March 18th, 2009</small></a></li>
        <li><a href="#"><small>ENG, Статья</small> <b>Nonparametric Permutation Tests
      for Functional Neuroimaging</b>, T.E. Nichols, A.P. Holmes, <small>March 4, 2003</small></a></li>
      </ol>

      <h2>Доступные программы для проведения перестановочного теста (ПТ)</h2>

      <ol>
        <li>
          <a href="#"><b>Проведение ПТ для анализа генетической детерминации признаков</b></a><br />

            <small><p><b>Назначение</b> Программа предназначена для проведения перестановочных тестов. Разработанные методы применяются для  случаев, когда нет возможности получить истинные повторения наблюдений. Программа позволяет формировать так называемые "псевдовыборки".  На основе этих псевдовыборок можно получить необходимые характеристики искомого параметра: оценки математического ожидания, дисперсии, доверительного интервала.</p><p><b>Область применения</b> Представленный вариант позволяет проводить перестановочный тест в задачах генетики, но при небольшой переработке или соблюдении шаблона входного файла можно решать задачи из другой области. <a href="#">Читать подробнее</a></p>
            </small>

        </li>
      </ol>
    </div>
  </DocumentTitle>
);

export default HomePage;
