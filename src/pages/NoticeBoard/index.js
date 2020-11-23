/**
 * @Description: 公告管理
 *
 * @author: sunrui
 *
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Tabs, Button, Menu, Dropdown, Table, Divider, Modal} from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import NotesRevise from '../../components/NoticeBoard/NotesRevise';
import WarningIndexClass from "../../components/NoticeBoard/WarnIndexSelected";

@connect(
  ({noticeBoard,notesRevise,warnIndexSelected}) => ({
    noteData: noticeBoard.noteData,
    anomalyIndex: noticeBoard.anomalyIndex,
    moduleId:noticeBoard.moduleId,
    isSuccess:notesRevise.isSuccess,
    indexLists:noticeBoard.indexLists,
    indexId:warnIndexSelected.indexId,
  })
)


class NoticeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNotesRevise:false,    // 是否显示修改公告信息弹出层
      isShowNotesForm:false,
      isShowIndexForm:false,
      activeKey:'1',
      modalVisible: false,
      confirmLoading: false,
      delId:'',
      delTitle:'',
      noticeText:'',
      noticeName:'',
    };

  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type:'noticeBoard/fetchNoteData',
      payload:{}
    });
    dispatch({
      type:'noticeBoard/fetchAnomalyIndex',
      payload:{}
    });
    dispatch({
      type:'noticeBoard/fetchIndexLists',
      payload:{}
    })
  };


  /**
  * 功能：公告修改接口
  * */
  fetchNotesChange = (noteId,title,content) => {
    const {dispatch, moduleId} = this.props;
    let params ={};
    if(moduleId === '1'){
      params = {
        "noteId":noteId,
        "title":title,
        "content":content
      };
      dispatch({
        type:'notesRevise/fetchNotesChange',
        payload:params
      }).then((isSuccess)=>{
        if (isSuccess){
          dispatch({
            type:'noticeBoard/fetchNoteData',
            payload:{}
          })
        }
      })
    }else{
      const contentBase =Buffer.from(content,'base64').toString();
      params ={
        "indexId":noteId,
        "content":contentBase,
      };
      dispatch({
        type:'notesRevise/fetchIndexChange',
        payload:params
      }).then((isSuccess)=>{
        if(isSuccess){
          dispatch({
            type:'noticeBoard/fetchAnomalyIndex',
            payload:{}
          })
        }
      })
    }
  };

  /**
   * 功能：删除接口
   * */
  fetchDelNoteIndex = (id,title) => {
    const {moduleId,dispatch} = this.props;
    this.setState({
      confirmLoading:true
    })
    let params ={};
    if(moduleId === '1'){
      params = {
        "title":title,
        "noteId":id
      };
      dispatch({
        type:'noticeBoard/fetchDelNotes',
        payload:params
      }).then((isSuccess)=>{
        if(isSuccess){
          this.setState({
            confirmLoading:false,
            modalVisible:false
          })
          dispatch({
            type:'noticeBoard/fetchNoteData',
            payload:{}
          });
        }
      })
    }else{
      params ={
        "indexId":id
      };
      dispatch({
        type:'noticeBoard/fetchDelIndex',
        payload:params
      }).then((isSuccess)=>{
        if(isSuccess){
          this.setState({
            confirmLoading:false,
            modalVisible:false
          })
          dispatch({
            type:'noticeBoard/fetchAnomalyIndex',
            payload:{}
          });
        }
      })

    }

  }

  /**
   * 功能：修改按钮
   * */
  handleChangeNotesRevise = (content) => {
    const {dispatch} = this.props;
    const {isShowNotesRevise} = this.state;
      this.setState({
        isShowNotesRevise:!isShowNotesRevise
      })
    this.findNotesOne(content);
    const isModify = true;
    dispatch({
      type:'notesRevise/fetchIsModify',
      payload:{isModify}
    })
  };

  /**
   * 功能：删除按钮
   * */
  delNoteIndex = (id,title) => {
    this.setState({
      modalVisible:true,
      delId:id,
      delTitle:title
    })

  };

  handleOk = () =>{
    const {delId, delTitle} = this.state;
    this.fetchDelNoteIndex(delId,delTitle)
  };

  handleCancel = () =>{
    this.setState({
      modalVisible:false
    })
  }

  /**
   * 功能：查看公告、指标
   * */
  handleIsShowNotesRevise = (content) => {
    const {dispatch} = this.props;
    const {isShowNotesRevise} = this.state;
    this.setState({
      isShowNotesRevise:!isShowNotesRevise
    })
    this.findNotesOne(content);
    const isModify = false;
    dispatch({
      type:'notesRevise/fetchIsModify',
      payload:{isModify}
    })
  };

  /**
   * 功能：匹配单个公告信息
   * */
  findNotesOne = (content) => {
    const {noteData,anomalyIndex,moduleId,dispatch} = this.props;
    if (moduleId === '1'){
      noteData.forEach((data) => {
        if (data.content === content){
          dispatch({
            type:'notesRevise/fetchNotesOne',
            payload:{data}
          })
        }
      })
    }else {
      anomalyIndex.forEach((data) => {
        if (data.content === content){
          dispatch({
            type:'notesRevise/fetchNotesOne',
            payload:{data}
          })
        }
      })
    }

  };

  /**
   * 切换标签页改变moduleId
   * */
  selectorNote = (key) => {
    const {dispatch} = this.props;
    dispatch({
      type:'noticeBoard/selectorNote',
      payload:{key}
    })
    this.setState({
      activeKey:key
    })
  };

  /**
   * 功能：隐藏公告、指标新增菜单
   * */
  handleRemove = () => {
    this.setState({
      isShowNotesForm:false,
      isShowIndexForm:false
    })
  }

  /**
   * 功能：显示公告、指标新增菜单
   * */
  showNoteMenu = () => {
    this.setState({
      isShowNotesForm:true,
      activeKey:'1'
    })

  }

  showIndexMenu = () => {
    this.setState({
      isShowIndexForm:true,
      activeKey:'2'
    })
  }

      /**
      * 功能：公告增加接口
      * */
  fetchNotesAdd = (title,content) => {
    const {dispatch} = this.props;
    const {activeKey} = this.state
    let params ={};
    if(activeKey === '1'){
      params ={
        "title":title,
        "content":content,
      };
      dispatch({
        type:'noticeBoard/fetchAddNotes',
        payload:params
      }).then((isSuccess)=>{
        if (isSuccess){
          dispatch({
            type:'noticeBoard/fetchNoteData',
            payload:{}
          })
        }
      })
    }else{
      params ={
        "indexId":title,
        "content":content,
      };
      dispatch({
        type:'noticeBoard/fetchAddIndex',
        payload:params
      }).then((isSuccess)=>{
        if(isSuccess){
          dispatch({
            type:'noticeBoard/fetchAnomalyIndex',
            payload:{}
          })
        }
      })
    }
  }

  changeNoticeText = (e) =>{
    this.setState({
      noticeText:e.target.value
    })
  }

  changeNoticeName = (e) =>{
    this.setState({
      noticeName:e.target.value
    })
  }

  /**
    * 功能：公告提交按钮
    * */
  handleAddNotesSubmit = () => {
    const {noticeText,noticeName} = this.state;
    this.setState({
      isShowNotesForm:false,
      isShowIndexForm:false,
      noticeText:'',
      noticeName:'',
    })
    const titleBase = Buffer.from(noticeName).toString('base64');
    const contentBase = Buffer.from(noticeText).toString('base64');
    this.fetchNotesAdd(titleBase,contentBase);
  }

  /**
    * 功能：异常提交按钮
    * */
  handleAddIndexSubmit = () => {
    const {indexId} = this.props;
    const {noticeText} = this.state;
    this.setState({
      isShowNotesForm:false,
      isShowIndexForm:false,
      noticeText:'',
      noticeName:'',
    })
    this.fetchNotesAdd(indexId,noticeText);
    this.child.resetSelected()
  }

  /**
   * 获取子组件
   * */
  onRef = (ref) =>{
    this.child = ref
  }

  /**
   * 新增公告、异常指标
   * */
  AddNotesIndex = (e) =>{
    if (e.key === '1'){
      this.showNoteMenu()
    }else {
      this.showIndexMenu()
    }
  }

  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  }

  render() {
    const {noteData , anomalyIndex} = this.props;
    const {isShowNotesRevise,isShowNotesForm,isShowIndexForm,activeKey,modalVisible,confirmLoading, noticeText, noticeName} = this.state;
    const {TabPane} = Tabs;
    // 公告表头
    const noteColumns = [
      {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
        width:60,
     // width:'8%',
    }, {
      title: '公告名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width:200,
        className:styles.resultColumns,
        render:(text)=>(<span title={text}>{text}</span>)
      }
    , {
      title: '发布人',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
        width:100,
    }, {
      title: '发布时间',
      dataIndex: 'datetime',
      key: 'datetime',
      align: 'center',
        width:100,
        className:styles.resultColumns,
    }, {
      title: '发布内容',
      dataIndex: 'content',
        align: 'center',
      key: 'content',
        minWidth:150,
        className:styles.resultColumns,
        render: (text, record) => (
          <span className={styles.resContent} onClick={() => this.handleIsShowNotesRevise(record.content)} title={record.content}>{record.content}</span>
        ),
    },
      {
      title: '操作',
      key: 'action',
        align: 'center',
        width:100,
      render: (record) => (
        <span className={styles.noticeBoardAction}>
          <span
            style={{color:'#C91717',cursor:'pointer'}}
            onClick={() => this.handleChangeNotesRevise(record.content)}
          >修改
          </span>
          <Divider type="vertical" />
          <span
            style={{color:'#C91717',cursor:'pointer'}}
            onClick={()=>this.delNoteIndex(record.noteId,record.title)}
          >删除
          </span>
        </span>
      ),
    }
    ];
    // 异常表头
    const indexColumns = [
      {
      title: '序号',
      dataIndex: 'indexId',
      key:'indexId',
        width:'8%',
      align: 'center',
        render:(text,record,index)=>`${index+1}`,
    }, {
      title: '指标名称',
      dataIndex: 'indexName',
      key: 'indexName',
      align: 'center',
        width:'15%',
        className:styles.resultColumns,
    }, {
      title: '发布人',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
        width:'10%',
    }, {
      title: '发布时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
        width:'13%',
    }, {
      title: '异常情况',
      dataIndex: 'content',
      key: 'content',
        className:styles.resultColumns,
        render: (text, record) => (
          <span className={styles.resContent} onClick={() => this.handleIsShowNotesRevise(record.content)}>{record.content}</span>
        ),
    }, {
      title: '操作',
      key: 'action',
        width:'10%',
        render: (record) => (
          <span className={styles.noticeBoardAction}>
            <span
              style={{color:'#C91717',cursor:'pointer'}}
              onClick={() => this.handleChangeNotesRevise(record.content)}
            >修改
            </span>
            <Divider type="vertical" />
            <span
              style={{color:'#C91717',cursor:'pointer'}}
              onClick={()=>this.delNoteIndex(record.indexId,record.indexName)}
            >删除
            </span>
          </span>
        ),
    }];
    const menu = (
      <Menu onClick={this.AddNotesIndex}>
        <Menu.Item key="1">
          <span>公告</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>指标波动</span>
        </Menu.Item>
      </Menu>
    )
    const operations = (
      <Dropdown overlay={menu} placement="bottomCenter">
        <Button>新 &nbsp;&nbsp;&nbsp;增</Button>
      </Dropdown>
    )

    // 表单
    let formTitle = '';
    let formTitleContext = '';
    let formContextName = '';
    if(activeKey === '1'){
      formTitle = '公告名称';
      formTitleContext = <input type="text" id="noticeName" className={styles.noticeinputtitle} onChange={this.changeNoticeName.bind(this)} value={noticeName} />;
      formContextName = '公告内容';
    }else{
      formTitle = '指标名称';
      formContextName = '异常情况';
    }

    return (
      <PageHeaderWrapper>
        <div className={styles.noticeBoard}>
          <h2 className={styles.noticeBoardTitle}>提示列表</h2><br />
          <div className={styles.noticeBoardTabs}>
            <Tabs tabBarExtraContent={operations} type="card" onChange={this.selectorNote} activeKey={activeKey}>
              <TabPane tab="公告列表" key="1">
                {/* 公告列表表单 */}
                <div className={styles.noticecontentform} ref={(c) => {this.noticeContentForm = c;}} style={{display:isShowNotesForm?'block':'none'}}>
                  <div className={styles.formnotice}>
                    <form>
                      <div className={styles.formnoticeName}>
                        <span className={styles.formnoticeNameleft} ref={(c) => {this.formTitle = c;}}>{formTitle}</span>
                        {formTitleContext}
                      </div>
                      <div className={styles.formnoticeText}>
                        {formContextName}
                        <textarea id="noticeText" onChange={this.changeNoticeText.bind(this)} value={noticeText} />
                      </div>
                      <div className={styles.formbtn}>
                        <div
                          className={classnames(styles.formBtn,styles.formsub)}
                          onClick={this.handleAddNotesSubmit.bind(this)}
                        >提交
                        </div>
                        <div className={classnames(styles.formBtn,styles.formrem)} onClick={this.handleRemove.bind(this)}>取消</div>
                      </div>
                    </form>
                  </div>
                </div>
                <br />
                <Table
                  columns={noteColumns}
                  dataSource={noteData}
                  rowClassName={this.changeRowColor}
                  bordered
                  size="small"
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="异常指标" key="2">
                {/* 异常指标表单 */}
                <div className={styles.noticecontentform} ref={(c) => {this.noticeContentForm = c;}} style={{display:isShowIndexForm?'block':'none'}}>
                  <div className={styles.formnotice}>
                    <form>
                      <div className={styles.formnoticeName}>
                        <span className={styles.formnoticeIndexNameleft} ref={(c) => {this.formTitle = c;}}>{formTitle}</span>
                        <WarningIndexClass onRef={this.onRef} />
                      </div>
                      <div className={styles.formnoticeText}>
                        {formContextName}
                        <textarea id="noticeText" onChange={this.changeNoticeText.bind(this)} value={noticeText} />
                      </div>
                      <div className={styles.formbtn}>
                        <div
                          className={classnames(styles.formBtn,styles.formsub)}
                          onClick={this.handleAddIndexSubmit.bind(this)}
                        >提交
                        </div>
                        <div className={classnames(styles.formBtn,styles.formrem)} onClick={this.handleRemove.bind(this)}>取消</div>
                      </div>
                    </form>
                  </div>
                </div>
                <br />
                <Table
                  rowClassName={this.changeRowColor}
                  columns={indexColumns}
                  dataSource={anomalyIndex}
                  bordered
                  size="small"
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </div>
          {
            isShowNotesRevise?(
              <NotesRevise
                handleNotesChange={this.fetchNotesChange}
                handleIsShowNotesRevise={this.handleIsShowNotesRevise}
              />
            ): null
          }
          <Modal
            title="提示"
            visible={modalVisible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>确定要删除吗？</p>
          </Modal>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default NoticeBoard
