import React,{Component} from "react";
import {Icon} from 'antd';
import {connect} from 'dva';
import styles from './Notes.less';
import iconFont from '../../icon/Icons/iconfont';
import NotesList from './NotesList';
import NotesOne from './NotesOne';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
})

@connect(({ notesData }) => ({
  noteData: notesData.noteData,
  showFlag:notesData.showFlag,
  hideNotes:notesData.hideNotes
}))
class Notes extends Component{
  constructor(props){
    super(props);
    this.state={
      isShowNotesList : false,        // 是否显示公告列表弹出层
      isShowNotesOne : false,         // 是否显示单个公告信息弹出层
    }
  }

  componentDidMount(){
    const {dispatch} = this.props;
    dispatch({
      type:'notesData/fetchNoteData',
      payload:{}
    });
    this.firstShowNotes();

  }


  /**
   * 初次展示公告栏
  * */
  firstShowNotes = () =>{
    const {showFlag,dispatch} = this.props;
    const hideNotes = false
    if (showFlag === '1'){
      const NoteTimer = setTimeout(()=>{
        dispatch({
          type:'notesData/getShowFlag',
          payload:'0'
        });
        dispatch({
          type:'notesData/getHideNotes',
          payload:{hideNotes}
        })
        clearTimeout(NoteTimer);
      },5000);
    }else {
      dispatch({
        type:'notesData/getHideNotes',
        payload:{hideNotes}
      })
    }
  }

  /**
   * 处理右下公告栏显示数据
   * */
  convertData = (data) =>{
    const data0 = [];
    for (let i = 0; i < 4; i+=1){
      data0.push(data[i]);
    }
    return data0;
  }



  /**
   * 隐藏右下公告栏
   * */
  hideNotesFun = () =>{
    const {dispatch} = this.props;
    const hideNotes = false
    dispatch({
      type:'notesData/getHideNotes',
      payload:{hideNotes}
    })
  }

  /**
   * 是否显示公告列表
   * */
  isShowNotesList = () =>{
    const {isShowNotesList} = this.state
    this.setState({
      isShowNotesList:!isShowNotesList
    })
  }

  /**
   * 显示公告列表，隐藏单条公告
  * */
  toNotesList = () =>{
    this.setState({
      isShowNotesList : true,        // 是否显示公告列表弹出层
      isShowNotesOne : false,         // 是否显示单个公告信息弹出层
    })
  }

  /**
   * 公告列表点击单条公告
   * */
  toNotesOne = (btn,id) => {
    const {noteData,dispatch} = this.props;
    this.setState({
      isShowNotesList : false,        // 是否显示公告列表弹出层
      isShowNotesOne : true,         // 是否显示单个公告信息弹出层
    })
    let params = {};
    noteData.forEach((data) => {
      if (data.noteId === id){
        params = {
          "btn":btn,
          "data":data,
        }
        dispatch({
          type:'notesData/getNoteOne',
          payload:{params}
        })
      }
    })
  }

  /**
   * 隐藏单条公告
   * */
  hideNotesOne = () => {
    this.setState({
      isShowNotesOne:false
    })
  }

  render() {
    const {isShowNotesList,isShowNotesOne} = this.state;
    const {noteData,hideNotes,showFlag} = this.props;
    if (noteData.length === 0 || showFlag === ''){
      return null
    }
    const partNotes = this.convertData(noteData);
    const titleTrs = partNotes.map((date) =>
      <tr className={styles.pageContentNoteTableTr} key={date.noteId}>
        <td onClick={this.toNotesOne.bind(this,"showNotesList",date.noteId)}><div className={styles.noteTableV}>{date.title}</div></td>
      </tr>
    );

    const contentTrs =partNotes.map((date) =>
      <tr className={styles.pageContentNoteTableTr} key={date.noteId}>
        <td onClick={this.toNotesOne.bind(this,"showNotesList",date.noteId)}><div className={styles.noteTableV}>{date.content}</div></td>
      </tr>
    );
    return (
      <div>
        <div className={styles.pageContent} style={{display:hideNotes?'block':'none'}}>
          <div className={styles.pageContentHeader}>
            <span className={styles.pageContentHeaderTitle}>公告栏</span>
            <span><IconFont className={styles.notice} type="icon-gonggao" /></span>
            <span><IconFont onClick={this.hideNotesFun} className={styles.messageHidden} type="icon-delete" /></span>
            {/* <img alt="" src={require('../../../../images/component/common/notes/delete.png')} className={styles.messageHidden} onClick={this.showtitle.bind(this,false)} /> */}
          </div>
          <div className={styles.pageContentNote}>
            <table className={styles.pageContentNoteTableTitle}>
              <tbody>
                {titleTrs}
              </tbody>
            </table>
            <table className={styles.pageContentNoteTableContent}>
              <tbody>
                {contentTrs}
              </tbody>
            </table>
          </div>
          <div
            className={styles.pageContentMore}
            onClick={this.isShowNotesList}
          >
            查看更多	&gt;	&gt;
          </div>
        </div>
        <div style={{display:isShowNotesList?'block':'none'}}>
          <NotesList
            handleCloseNotesList={this.isShowNotesList}
            handleToNotesOne={this.toNotesOne}
          />
        </div>

        <div style={{display:isShowNotesOne?'block':'none'}}>
          <NotesOne
            handleIsShowNotesOne={this.hideNotesOne}
            handleToNotesList={this.toNotesList}
            mes="notes"
          />
        </div>
      </div>
    )
  }

}

export default Notes;
