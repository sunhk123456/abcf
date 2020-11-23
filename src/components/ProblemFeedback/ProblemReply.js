/**
 *反馈回复组件
 * by:CaoRuining
 */
import React, { PureComponent } from 'react';
import { message } from 'antd';
import {connect} from 'dva'
import classnames from 'classnames'
import yangshi from './ProblemReply.less';
import tinyImg from  './u4290.png';


@connect(
  ({systemOperator,systemOperatorCom}) => ({
    componentStatus:systemOperator.componentStatus,
    problemId:systemOperatorCom.problemId,
    replyInfo:systemOperatorCom.replyInfo,
    commitStatus:systemOperator.commitStatus,
    replyContent:systemOperatorCom.replyContent,
    problemType:systemOperatorCom.problemType
  })
)

class ProblemReply extends PureComponent{
  constructor(props){
    super(props);
    this.state={
    }
  }

  componentWillMount(){
  }

  componentDidMount(){

  }



  /**
   *隐藏组件
   */
  hiddenComponent = ()=> {
    const {dispatch} = this.props;

    dispatch({
      type:'systemOperator/fetchComStatus',
      payload:{
        status:'none'
      }
    })
  };

  /**
   * 提交回复功能
   * @returns {*}
   */
  replyCommit = ()=>{
    const {dispatch,problemId,replyContent} = this.props;
    const params = {
      problemId,
      replyContent
    };
    dispatch({
      type:'systemOperator/fetchCommitReply',
      payload: params
    }).then((commitStatus)=>{
      if(commitStatus.result){
        message.success('提交成功');
        this.hiddenComponent();
      }else {
        message.warning("提交失败！");
      }
    });

  };


  /**
   * 修改回复内容
   * @returns {*}
   */
  changeReplyContent = (content)=>{
    const {dispatch} = this.props;

    dispatch({
      type:'systemOperatorCom/fetchReplyContent',
      payload:{
        replyContent1:content
      }
    })
  };






  render(){
    const {componentStatus,replyInfo,replyContent} = this.props;
    return(
      <div className={yangshi.cover} style={{display:componentStatus}}>
        <div className={yangshi.replyBackground} style={{display:componentStatus}}>
          <div className={yangshi.replyContent}>
            <h4>问题回复</h4>
            <div className={classnames(yangshi.replyColumns,yangshi.r1)}>
              <img src={tinyImg} alt='' />
              <p className={yangshi.paragraph}>用户信息</p>
              <ul className={yangshi.userInfo}>
                <li title={replyInfo.userName}>反&nbsp;馈&nbsp;人：<span>{replyInfo.userName}</span></li>
                <li title={replyInfo.deptName}>部&nbsp;&nbsp;门：<span>{replyInfo.deptName}</span></li>
                <li title={replyInfo.userId}>帐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：<span>{replyInfo.userId}</span></li>
                <li title={replyInfo.tel}>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：<span>{replyInfo.tel}</span></li>
                <li title={replyInfo.email}>邮&nbsp;&nbsp;箱：<span>{replyInfo.email}</span></li>
                <li title={replyInfo.exporeType}>浏&nbsp;览&nbsp;器：<span>{replyInfo.exporeType}</span></li>
              </ul>
            </div>
            <div className={classnames(yangshi.replyColumns,yangshi.r2)}>
              <img src={tinyImg} alt='' />
              <p className={yangshi.paragraph}>问题描述</p>
              <br />
              <div className={yangshi.question}>
                <p>相关页面：</p>
                <span>{replyInfo.pageName}</span>
                <br />
                <p>问题类型：</p>
                <span>{replyInfo.problemType}</span>
                <br />
                <p>问题具体描述：</p>
                <div className={yangshi.quesDetails}>
                  <div className={yangshi.details_question}>{replyInfo.problemDesc}</div>
                </div>
              </div>
            </div>
            <div className={classnames(yangshi.replyColumns,yangshi.r3)}>
              <img src={tinyImg} alt='' />
              <p className={yangshi.paragraph}>回复处理</p>
              <div className={yangshi.replyDetails}>
                <textarea name="replyContent" placeholder='请输入回复内容...' value={replyContent||''} onChange={(e) => this.changeReplyContent(e.target.value)} />
                <div className={yangshi.replyButton}>
                  <input type="button" value='取消' onClick={()=>{this.hiddenComponent()}} />
                  <input type="button" value='提交回复' onClick={()=>{this.replyCommit()}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default ProblemReply;
