import React from 'react';
import DocumentTitle from 'react-document-title';
import { t } from 'localizify';
import { Link } from 'react-router';

const HomePage = () => (
  <DocumentTitle title={t('Help')}>
    <div>
      <h2>{t('Help')}</h2>
      <div className="grey">
        {t('Only russian yet')}.
      </div>
      <hr className="light" />
      <ol className="ol-list">
        <li>Первым делом нужно <b><Link to="/signup">зарегистрироваться в системе</Link></b>. После регистрации ваш аккаунт будет проверен администратором системы. Вы получи email письмо, что аккаунт подтвержден и сможете использовать систему.</li>
        <li>Далее нужно перейти в <b><Link to="/dashboard">личный кабинет</Link></b> и нажать на кнопку: "Добавить задачу".</li>
        <li>На странице добавления задачи нужно ввести имя для задачи и описание, указать входные данные и конфигурацию, а так же указать, на каком сервер производить вычисления. После задача добавляется в очередь. Как только задача будут выполнена, Вам на электронную придет письмо вместе с ссылкой для скачивания результатов:
          <br />
          <br />
          <br />
          <img src={`${window.config.proxy}/resources/img/help-email.png`} />
        </li>
        <li>Так же информацию о задаче можно просмотреть в личном кабинете (время выполнения, время ожидания в очереди) и удалить старые неактуальные задачи.</li>
      </ol>
    </div>
  </DocumentTitle>
);

export default HomePage;
