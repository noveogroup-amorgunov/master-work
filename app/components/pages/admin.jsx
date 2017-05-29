import React from 'react';
import DocumentTitle from 'react-document-title';
import Chart from 'chart.js';
import { t } from 'localizify';
import { Link } from 'react-router';
import $ from 'jquery';

import LogService from '../../services/log';
import TaskService from '../../services/task';

// http://blog.carbonfive.com/2015/01/07/vintage-terminal-effect-in-css3/
// https://hyper.is/
// https://codepen.io/deluxive/pen/lxEGs
// {/* contentEditable="true" */}
// https://codepen.io/ronnieskansing/pen/wKEjB
// https://codepen.io/ramsaylanier/pen/wawwNa
// https://codepen.io/adonisk/pen/qaebp

const storage = [];
let typing = false;

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      loadsCount: 0,
    };

    this.addLine = this.addLine.bind(this);
    this.uploadLogs = this.uploadLogs.bind(this);

    this.log = new LogService();
    this.taskServive = new TaskService();
  }

  componentDidMount() {

    const chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)'
    };

    // var randomScalingFactor = function() {
    //   return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    // };

    this.taskServive.get().then((_tasks) => {
      const tasks = _tasks.reverse().filter(item => item.exucatedTime);
      const config = {
        type: 'line',
        data: {
          labels: tasks.map((item, index) => index),
          datasets: [{
            label: t('Task time exucating'),
            backgroundColor: chartColors.red,
            borderColor: chartColors.red,
            data: tasks.map(item => item.exucatedTime / 1000),
            fill: false,
          }]
        },
        options: {
          responsive: false,
          width: 300,
          height: 250,
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: t('Count of tasks')
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: t('Time, sec')
              }
            }]
          }
        }
      };

      const config2 = Object.assign({}, config, {
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: t('Task count'),
            backgroundColor: chartColors.blue,
            borderColor: chartColors.blue,
            data: tasks.map(item => item.exucatedTime / 1000),
            fill: false,
          }]
        },
        options: {
          responsive: false,
          width: 300,
          height: 250,
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: t('Date')
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: t('Count of tasks')
              }
            }]
          }
        }
      });

      const ctx = document.getElementById('chart-1').getContext('2d');
      this.myLine1 = new Chart(ctx, config);

      const ctx2 = document.getElementById('chart-2').getContext('2d');
      this.myLine2 = new Chart(ctx2, config2);
    });

    this.$element = $('.enter .lines');
    this.uploadLogs();
    this._updater = setInterval(this.uploadLogs, 17000);
  }

  uploadLogs() {
    this.log.get().then((newLogs) => {
      const oldLogs = this.state.logs;
      const logs = newLogs
        .filter(item => oldLogs.map(i => i._id).indexOf(item._id) === -1)
        .reverse();

      // logs//

      logs.forEach((item) => {
        const date = ((new Date(item.time)).toLocaleString()).split(', ')[1].split(' ')[0].split(':').map(this.addZero).join(':');
        this.typeLine(`[${date}] ${item.message}`, this.state.loadsCount === 0);
      });
      // $('.enter .lines').append(`<br/><span class="fore">osx</span>: [<span class="accent">${date}</span>]  <span class="output">${text}</span>`);

      this.setState({
        logs: oldLogs.concat(logs),
        loadsCount: this.state.loadsCount + 1
      });
    });
  }

  addZero(number) {
    const length = number.toString().length;
    return length >= 2 ? number : (new Array(3 - length)).join('0') + number;
  }

  typeChar(content, charIdx, fastTyping, callback) {
    const rand = Math.round(Math.random() * 100);

    if (typeof content[charIdx] === 'undefined') {
      this.$element.append('<br/><span class="fore">osx</span>:<span class="accent">>></span>:');
      return callback();
    }

    setTimeout(() => {
      const char = content[charIdx++];
      this.$element.append(char);
      this.typeChar(content, charIdx, fastTyping, callback);
    }, !fastTyping ? rand : 0);
  }

  typeLine(_line, fastTyping = true) {
    // console.log(typing, storage);
    _line && storage.push(_line);
    if (!typing && storage.length) {
      typing = true;
      const line = storage.shift();
      this.typeChar(line, 0, fastTyping, () => { typing = false; this.typeLine(); });
    }
  }

  componentWillUnmount() {
    clearInterval(this._updater);
  }

  addLine(event) {
    const text = 'Execute new task hello (59280280b98c770cd730fa96)';
    const date = (new Date()).toLocaleString();
    $('.enter .lines').append(`<br/><span class="fore">osx</span>: [<span class="accent">${date}</span>]  <span class="output">${text}</span>`);
  }

  render() {
    return (
      <DocumentTitle title={t('Admin panel')}>
        <div>
          <h2>{t('Admin panel')}</h2>
          <div className="grey">
            {t('Only russian yet')}.
          </div>
          <hr className="light" />
          <h3>{t('Logs')}</h3>
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-header-buttons">
                <div className="red"></div>
                <div className="yellow"></div>
                <div className="green"></div>
              </div>
              {/* terminal */ }
            </div>
            <div className="terminal-main">
              <div className="enter">
                <span className="lines">
                  <span className="fore">osx</span>:<span className="accent">>></span>:
                </span>
              </div>
            </div>
          </div>
          <h3>{t('Task statistics')}</h3>

          <canvas id="chart-1" width="300px" height="250px"></canvas>
          <canvas id="chart-2" width="300px" height="250px"></canvas>
          {/* <button onClick={this.addLine}>Add line</button> */}
        </div>
      </DocumentTitle>);
  }
}

export default AdminPage;
