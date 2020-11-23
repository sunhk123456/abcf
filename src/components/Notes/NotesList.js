import React, {Component} from 'react';
import {connect} from 'dva';
import {Table} from 'antd';
import classnames from 'classnames';
import styles from "./NotesList.less";


@connect(({ notesData }) => ({
  noteData: notesData.noteData,
  showFlag:notesData.showFlag,
}))
class NotesList extends Component{
  constructor(props){
    super(props);
    this.state = {
      // dateNotesList:this.props.data,
    }
  }

  componentDidMount(){
    // const {dispatch} = this.props;
    // dispatch({
    //   type:'notesData/fetchNoteData',
    //   payload:{}
    // });
  }


  /*
  * 功能：关闭公告列表
  * */
  closeNotesList = () => {
    const {handleCloseNotesList} = this.props;
    handleCloseNotesList();
  };

  /*
  * 功能：查看单个公告信息
  * */
  toNotesOne = (btn,noteId) => {
    const {handleToNotesOne} = this.props;
    handleToNotesOne(btn,noteId);
  };

  render(){
    const {noteData} = this.props;
    if (noteData.length === 0){
      return null;
    }


    const sw = window.screen.width;
    let tableHeight;
    let tableheaderWidth1;
    let tableheaderWidth2;
    if (sw > 1890) {
      tableHeight = 300
    } else if(sw > 1400) {
      tableHeight = 250
    } else if(sw > 1000) {
      tableHeight = 200
    }

    if (sw >1300){
      tableheaderWidth1 = 100;
      tableheaderWidth2 = 150;
    }else if (sw > 1100){
      tableheaderWidth1 = 50;
      tableheaderWidth2 = 100;
    }else {
      tableheaderWidth1 = 45;
      tableheaderWidth2 = 90;
    }



    const btn = "toNotesList";
    // 公告表头
    const noteColumns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
        // width:'10%',
        width:tableheaderWidth1,
      }, {
        title: '公告名称',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        // width:'15%',
        width:tableheaderWidth2,
        className:styles.resultColumns,
      }, {
        title: '发布人',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        // width:'10%',
        width:tableheaderWidth2,
      }, {
        title: '发布时间',
        dataIndex: 'datetime',
        key: 'datetime',
        align: 'center',
        // width:'15%',
        width:tableheaderWidth2,
        className:styles.resultColumns,
      }, {
        title: '发布内容',
        dataIndex: 'content',
        key: 'content',
        className:styles.resultColumns,
        render: (text, record) => (
          <span className={styles.resContent} onClick={() => this.toNotesOne(btn,record.noteId)}>{record.content}</span>
        ),
      },
    ];



    return(
      <div className={styles.notesListContent}>
        <div className={styles.npContent}>
          <div className={styles.npNotesTitle}>公告列表</div>
          <div className={styles.npNotesContent}>
            <Table columns={noteColumns} dataSource={noteData} rowClassName={styles.resultTables} bordered size="small" pagination={false} scroll={{ y: tableHeight }} />
          </div>
          <div className={styles.npBtns}>
            <div className={classnames(styles.npBtnClose,styles.npBtnsBtn)} onClick={this.closeNotesList.bind(this)}>关闭</div>
          </div>
        </div>
      </div>
    )
  }
}

export default NotesList;
