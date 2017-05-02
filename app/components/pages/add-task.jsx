import React from 'react';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import { t } from 'localizify';
import $ from 'jquery';
import DocumentTitle from 'react-document-title';

import auth from '../../auth';
import formatText from '../../utils/format-str';
import TaskService from '../../services/task';

const TagsVariants = React.createClass({
  render() {
    const data = this.props.data;

    return (
      <div className="tags-variants">
        {data.map((item, index) =>
          <span key={index}>
            <a onClick={this.props.onAddNewTag} href="#"><b>{item.name}</b> ({item.popular})</a>&nbsp;
          </span>
        )}
        
      </div>
    );
  }
});

const Tag = React.createClass({
  render() {
    return (
      <a href="#" onClick={this.props.onTagClick} className="post-tag">{this.props.name}</a>
    );
  }
});

const SelectedTags = React.createClass({
  render() {
    const data = this.props.data;

    return (
      <div className="tags-label">
        <b>Теги:</b>&nbsp;
        <div className="tags">
          {data.map((item, index) => 
            <span key={index}>
              <Tag name={item} onTagClick={this.props.onTagClick} />
            </span>
          )}
        </div>
      </div>
    );
  }
});

const AddTaskPage = withRouter(
  React.createClass({
    getInitialState() {
      return {
        error: false,
        message: '',
        tags: [],
        findedTags: [],
        inputValue: ''
      };
    },

    handleSubmit(event) {
      event.preventDefault();

      // const title = this.refs.title.value.trim();
      // const comment = this.refs.comment.value.trim();
      // const tags = this.state.tags.join(',');
      // console.log(this.refs.server);
      const data = {
        name: this.refs.name.value,
        description: this.refs.description.value,
        server: $(this.refs.server).val(),
        program: $(this.refs.program).val(),
        config: this.refs.config.value,
      };
      console.log(data);
      const service = new TaskService();
      const inputData = {};
      service.uploadInputData(inputData).then((inputFile) => {
        service.add(Object.assign({}, data, { inputFile })).then((response) => {
          // this.setState({ data, loading: false });
          console.log(response);
          if (response.message) {
            const { location } = this.props;

            if (location.state && location.state.nextPathname) {
              this.props.router.replace(location.state.nextPathname);
            } else {
              // this.props.router.replace(`/tasks/${response.task._id}`);
              this.props.router.replace('/dashboard');
            }
          } else {
            console.error(response);
          }
        }).catch(console.error);
      });

      // $.ajax({
      //   type: 'POST',
      //   url: `${window.config.basename}/api/question`,
      //   contentType: 'application/json',
      //   data: JSON.stringify({ title, comment, tags, token: auth.getToken() }),
      //   success: data => {

      //   },
      //   error: (xhr, status, err) => {
      //     console.error(status, err.toString());
      //   }
      // });

      return false;
    },

    onChange(e) {
      // e.preventDefault();

/*      var searchedTerm = ReactDOM.findDOMNode(this.refs.searched).value.trim();
      this.setState({ inputValue: searchedTerm });
      if (!searchedTerm) {
        this.setState({ findedTags: [] });
        return;
      }

      $.ajax({
        type: 'POST',
        // data: { q: text }
        url: `${window.config.basename}/api/tags/${searchedTerm}`,
        contentType: 'application/json',
      })
      .done(response => {
        if (response) {
          console.log(JSON.stringify(response));
          const findedTags = response;
          this.setState({ findedTags });
        }
      });*/
    },

    addNewTag(e) {
      event.preventDefault();
      var tag = ReactDOM.findDOMNode(this.refs.searched).value.trim();
      this.addTag(tag);
      return false;
    },

    addTag(tag) {
      console.log(`new tag: ${tag}`);
      if (tag) {
        if (this.state.tags.indexOf(tag) === -1) {
          this.setState({ tags: [tag].concat(this.state.tags) });
        }
        this.setState({ inputValue: '', findedTags: [] });
      }
    },

    onAddNewTag(event) {
      event.preventDefault()
      const that = event.currentTarget;

      var tag = $(that).find('b').text(); // .replace(/[^a-zA-ZА-Яа-яЁё0-9-_]+/g,'');
      this.addTag(tag);
    },

    onTagClick(event) {
      console.log('delete tag!');

      event.preventDefault()
      const that = event.currentTarget;

      var deletedTag = $(that).text();
      if (this.state.tags.indexOf(deletedTag) !== -1) {

        const newTags = this.state.tags.filter(name => name !== deletedTag);
        this.setState({ tags: newTags })

        // tagsArray.splice(tagsArray.indexOf(deletedTag), 1);
        console.log(JSON.stringify(this.state.tags));
      }
    },

    onChangeAnswer() {
      const comment = this.refs.comment.value.trim();
      $('.preview').html(formatText(comment));
    },

    render() {
      console.log('ADD TASK');
      const tags = this.state.tags;
      // {/*onChange={this.onChangeAnswer}*/}
      /*

      {t('Add tag')}:
      <input
        id="add-tag"
        type="text"
        ref='searched'
        value={this.state.inputValue}
        onChange={this.onChange}
        placeholder={t('Type tag')} /> <a href="javascript:void(0);" onClick={this.addNewTag}>{t('Add new tag')}</a>
      
      <TagsVariants onAddNewTag={this.onAddNewTag} data={this.state.findedTags} />
      <SelectedTags onTagClick={this.onTagClick} data={tags} />

      */
      return (
        <DocumentTitle title={t('Add task')}>
          <div>
            <h1>{t('Add task')}</h1>
              <form onSubmit={this.handleSubmit}>
                {t('Task name')}: <input ref="name" type="text" name="name" required="required" /><br />
                {t('Task description')}: <textarea style={{ height: '100px' }} className="comment" ref="description" name="comment" /><br />
                <hr className="light" />


                {t('Server')}:
                <select ref="server">
                  <option value="5908119b654e3f0e2e6de416">{t('Кластер суперкомпьютера')}</option>
                  <option value="5908119b654e3f0e2e6de415">{t('Тестовый сервер')}</option>
                </select><br />

                {t('Program')}:
                <select ref="program">
                  <option value="5908119b654e3f0e2e6de414">{t('Permutation test')}</option>
                </select><br />

                {t('Input data')}: <input ref="input" name="input" type="file" required="required" /><br />

                {t('Config file')}: <textarea style={{ height: '100px' }} ref="config" name="config" required="required" /><br />
                

                <br />
                <button className="btn btn-block btn-social btn-github" type="submit">{t('Add task')}</button>
                {this.state.error && (
                  <p>{this.state.message}</p>
                )}
              </form>
          </div>
        </DocumentTitle>
      );
    }
  })
);

export default AddTaskPage;
