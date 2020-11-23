import React, {Component} from 'react';
import {connect} from 'dva';
import classnames from 'classnames';
import styles from './NotesRevise.less';


@connect(({notesRevise,noticeBoard}) => ({
  note: noticeBoard.noteData,
  moduleId:noticeBoard.moduleId,
  notesOneData:notesRevise.notesOneData,
  isModify:notesRevise.isModify,
}))
class NotesRevise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notesOneData:props.notesOneData,
      title:props.notesOneData.title,
      content:props.notesOneData.content,
      indexName:props.notesOneData.indexName,
    }
  }



  static getDerivedStateFromProps(props, state) {
    if ( props.notesOneData !== state.notesOneData ) {
      return {
        notesOneData:props.notesOneData,
        title:props.notesOneData.title,
        content:props.notesOneData.content,
        indexName:props.notesOneData.indexName,
        indexId:props.notesOneData.indexId,
        isModify:props.isModify,
      };
    }
    return null;
  }


  /**
  * 功能：是否显示“修改公告”弹窗
  * */
  isShowNoteRevise = () => {
    const {handleIsShowNotesRevise} = this.props;
    handleIsShowNotesRevise();
  };

  /**
  * 功能：“确认修改”按钮
  * */
  notesChange = () => {
    this.isShowNoteRevise();
    const {handleNotesChange,moduleId,notesOneData} = this.props;
    const {title,content,indexName} = this.state;
    const contentBase = Buffer.from(content).toString('base64');
    if (moduleId === "1"){
      const titleBase = Buffer.from(title).toString('base64');
      handleNotesChange(notesOneData.noteId,titleBase,contentBase);
    }else {
      handleNotesChange(notesOneData.indexId,indexName,contentBase);
    }

  };


  render() {
    const {moduleId,notesOneData,isModify} = this.props;
    const {title,content,indexName} = this.state;
    const datetime = moduleId === '1'? notesOneData.datetime:notesOneData.date;
    const onChangeTitle = moduleId === '1'?(e) => this.setState({title:e.target.value}):(e) => this.setState({indexName:e.target.value});
    const npBtns = isModify ?
    (
      <div className={styles.npBtns}>
        <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.notesChange.bind(this,)}>确认修改</div>
        <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.isShowNoteRevise.bind(this)}>取消</div>
      </div>
    ):
    (
      <div className={styles.npBtns}>
        <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.isShowNoteRevise.bind(this)}>关闭</div>
      </div>
    )
    const notesTitle = moduleId === '1'?
      <input type="text" value={moduleId === '1'?title:indexName} onChange={onChangeTitle} readOnly={!isModify} />
      :
      <input type="text" value={moduleId === '1'?title:indexName} onChange={onChangeTitle} readOnly={false} />
    return (
      <div className={styles.notesReviseContent}>
        <div className={styles.npContent}>
          <div className={styles.npNotesTitle}>
            {notesTitle}
          </div>
          <div className={styles.npNotesContent}>
            <div className={styles.npNotesContentTitle}>{moduleId === '1'?'发布内容：':'异常情况'}</div>
            <div className={styles.npNotesContentContent}>
              <textarea value={content || ""} onChange={(e) => this.setState({content:e.target.value})} readOnly={!isModify} />
            </div>
          </div>
          <div className={styles.npNotesNameAndDate}>
            <div className={styles.npNotesName}>发布人：{notesOneData.name}</div>
            <div className={styles.npNotesDate}>发布时间：{datetime}</div>
          </div>
          {npBtns}
        </div>
      </div>
    )
  }
}

export default NotesRevise


