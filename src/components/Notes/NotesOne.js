import React, {Component} from 'react';
import {connect} from 'dva';
import classnames from 'classnames';
import styles from './NotesOne.less';


@connect(({notesData}) => ({
  notesOneData:notesData.notesOneData,
  btn:notesData.btn
}))
class NotesRevise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notesOneData:props.notesOneData,
      btn:props.btn
    }
  }

  static getDerivedStateFromProps(props, state) {
    if ( props.notesOneData !== state.notesOneData ) {
      return {
        notesOneData:props.notesOneData,
        btn:props.btn
      };
    }
    return null;
  }


  /**
    * 功能：显示公告列表
    * */
  toNotesList = () => {
    const {handleToNotesList} = this.props
    handleToNotesList();
  }

  /**
   * 关闭单条公告
   * */
  isShowNoteRevise = () =>{
    const {handleIsShowNotesOne} = this.props;
    handleIsShowNotesOne();
  }



  render() {
    const {btn,notesOneData} = this.state;
    if (btn === '' && notesOneData === undefined){
      return null
    }
    const npBtns = btn === 'showNotesList' ?
      (
        <div className={styles.npBtns}>
          <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.toNotesList}>公告列表</div>
          <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.isShowNoteRevise}>关闭</div>
        </div>
      ):
      (
        <div className={styles.npBtns}>
          <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.toNotesList}>返回列表</div>
          <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.isShowNoteRevise}>关闭</div>
        </div>
      )
    return (
      <div className={styles.notesReviseContent}>
        <div className={styles.npContent}>
          <div className={styles.npNotesTitle}>
            <input type="text" value={notesOneData.title} readOnly />
          </div>
          <div className={styles.npNotesContent}>
            <div className={styles.npNotesContentTitle}>发布内容</div>
            <div className={styles.npNotesContentContent}>
              <textarea value={notesOneData.content || ""} readOnly />
            </div>
          </div>
          <div className={styles.npNotesNameAndDate}>
            <div className={styles.npNotesName}>发布人：{notesOneData.name}</div>
            <div className={styles.npNotesDate}>发布时间：{notesOneData.datetime}</div>
          </div>
          {npBtns}
        </div>
      </div>
    )
  }
}

export default NotesRevise


