/**
 * @Description: 小智首页
 *
 * @author: 风信子
 *
 * @date: 2019/9/10
 */

import React, { PureComponent,Fragment } from 'react';
import {connect} from 'dva'

import { routerState } from '@/utils/tool';
import DownloadUrl from '@/services/downloadUrl.json';
import Cookie from '@/utils/cookie';
import moment from 'moment';

import {message} from "antd";

import styles from './XiaoZhiResponse.less';
import popUpImg from './img/u953.png';
import popDownImg from './img/u621.png';
import userImg from './img/u677.png';
import QuestionTypeList from "./questionTypeList";




@connect(({ xiaozhiModels }) => ({
  xiaozhiModels,
}))
class XiaoZhiResponse extends PureComponent{

  constructor(props){
    super(props);
    this.state= {
      visible:false,
      imgStyle:0,
      chatTime:"00:00:00"
    };
    this.listRef = React.createRef();
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = snapshot;
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    // 捕捉滚动位置，以便我们可以稍后调整滚动.
    const {xiaozhiModels:{chatInfo}} = this.props;
    if (chatInfo.length !== prevProps.xiaozhiModels.chatInfo.length) {
      const list = this.listRef.current;
      return list.scrollHeight;
    }
    return null;
  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 获取常见问题
   * @method getfetchFaqs
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getfetchFaqs(){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/fetchFaqs',
    });
  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 获取问题分类
   * @method getQuestionType
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getQuestionType(){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/fetchQuestionType',
    });
  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 获取问题分类及各分类下的数据列表
   * @method getQueryTypeList
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getQueryTypeList(){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/fetchQueryTypeList',
    });
  }

  getQueryConversation(){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/fetchQueryConversation',
    });
  }

  /**
   * @date: 2019/9/16
   * @author 风信子
   * @Description: 请求回答的问题接口
   * @method getQueryQuestion
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getQueryQuestion(condition="", questionState){
    const {dispatch,xiaozhiModels} = this.props;
    const {
      requestParams, // 默认初始请求参数
      // selectChatQuestion, // 选中的常见问题选项
      // questionState, // 0表示 输入状态 1表示 常见问题  2表示问题分类选中
      selectTypeList, // 选中的问题分类
      // selectQuestionList, // 选中问题组件列表
      // inputQuestion, // 问题组件列表上方的input

    } = xiaozhiModels;
    const params = {};
    if(questionState === 0){
      params.isInput = "input";
      params.content = condition;
    }else if(questionState === 1){
      params.isInput = "select";
      params.qId = condition.id;
      params.qcontent = condition.content;
    }else if(questionState === 3){
      params.isInput = "select";
      params.clarifyCode = condition.id;
      params.clarifyContent = condition.content;
    }else {
      params.isInput = "select";
      params.typeId = selectTypeList.typeId;
      params.typeName = selectTypeList.typeName;
      params.id = condition.id;
      params.name = condition.name;
    }
    const requestParamsCopy = {...requestParams};
    const paramsAssign = Object.assign(requestParamsCopy,params);
    dispatch({
      type: 'xiaozhiModels/fetchQueryQuestion',
      payload:paramsAssign
    });
  }

  showModal1 =() =>{
    const { visible,imgStyle }=this.state;
    const {dispatch} = this.props;
    if(!visible){
      this.getfetchFaqs(); // 请求常见问题
      this.getQuestionType(); // 获取问题分类
      this.getQueryTypeList(); // 获取问题分类及各分类下的数据列表
      this.getQueryConversation(); // 获取会话信息
      this.setState({chatTime:moment().format('HH:mm:ss')})
    }else{
      dispatch({
        type: 'xiaozhiModels/updataQuestionListShow',
        payload: !visible,
      });
    }
    this.setState(
      {
        visible:!visible,
        imgStyle:imgStyle===0?1:0
      }
    )
  };

  // 跳转到基站
  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 点击问题分类按钮显示 问题列表
   * @method 方法名 typeFun
   * @param {object} 参数：item 参数描述： name\id
   * @return {返回值类型} 返回值说明
  */
  typeFun(item){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/updataSelectTypeList',
      payload: item,
    });
    dispatch({
      type: 'xiaozhiModels/updataQuestionListShow',
      payload: true,
    });
  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 监听底部输入框值修改
   * @method changeBottomInput
   * @param {string} 参数：value 参数描述：输入的值
  */
  changeBottomInput(value){
    const {dispatch} = this.props;
    dispatch({
      type:'xiaozhiModels/updataBottomInput',
      payload: value
    })
  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 输入框内容 提交
   * @method submitBottomInput
  */
  submitBottomInput(){
    const {dispatch, xiaozhiModels:{bottomInput}} = this.props;
    const inputValue = bottomInput.replace(/(^\s*)|(\s*$)/g, "");
    if(inputValue !== ""){
      dispatch({
        type:'xiaozhiModels/addUserChatInfo',
        payload:{
          value: inputValue,
          questionState: 0
        }
      });
      // 清空内容
      dispatch({
        type:'xiaozhiModels/updataBottomInput',
        payload: ""
      });
      this.getQueryQuestion(inputValue, 0);
    }else {
      message.error("请输入有效内容！")
    }

  }

  /**
   * @date: 2019/9/12
   * @author 风信子
   * @Description: 常见问题选择
   * @method chatQuestion
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  chatQuestion(xiaozhiItem, isType){
    const {dispatch} = this.props;
    const  questionState = isType === "-1" ? 1 : 3;
    dispatch({
      type:'xiaozhiModels/addUserChatInfo',
      payload:{
        value: xiaozhiItem.content,
        questionState
      }
    });
    dispatch({
      type:'xiaozhiModels/updataSelectChatQuestion',
      payload: xiaozhiItem
    });
    this.getQueryQuestion(xiaozhiItem, questionState);
  }

  /**
   * @date: 2019/9/16
   * @author 风信子
   * @Description: 跳转页面
   * @method jumpHandle
   * @param {object} 参数：data 参数描述：跳转包含的数据
  */
  jumpHandle(data, dateType){
    const {id, url, markType,data:{title,date,cityId, provId, selectType}} = data;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre = /^http.+\?.+/;
    const { dispatch } = this.props;
    if(re.test(url)){
      // window.open(`${url}?ticket=${token}&source=cloud&token=${token}`)
      let urlCpoy = "";
      if (pre.test(url)) {
        urlCpoy = `${url}&ticket=${token}&source=cloud&token=${token}`;
      } else {
        urlCpoy = `${url}?ticket=${token}&source=cloud&token=${token}`;
      }
      window.open(urlCpoy);
    }else if(markType === "3"){
      dispatch({
        type: 'myReportCardModel/getFetchOnlineViewReport',
        payload: {markType: id},
        callback: (res) => {
          if(res.path){
            const w =window.open('about:blank');
            w.location.href=`${DownloadUrl.urls[1].url}?file=${res.path}`;
          }else {
            message.error("预览失败，权限不足")
          }
        }
      });
    }else {
      const params = {
        id,
        title,
        dateType
      };
      if(markType === "1"){
        params.layoutFlag = 1;
        params.screenConditionTags = [];
        params.dimension = [{date,cityId, provId, selectType}]
      }
      // 基站跳转
      if(id === "menuOut" || id === "D11011" || id === "D11009" || url === "/baseStation"){
        this.JumpBaseStation(url);
        return false;
      }
      routerState(url,params)
    }
    this.showModal1();
    return false;
  }

  keypress(e) {
    if (e.which !== 13) return;
    this.submitBottomInput();
  }

  intelligenceAnalysis(data){
    console.log(data);
    const {url} = data;
    this.setState(
      {
        visible:false,
        imgStyle:0
      }
    );
    routerState(
      url,
      {
        ...data
      },
      "xiaoZhiState"
    )
  }

  render(){
    const { imgStyle,visible, chatTime } = this.state;
    const {xiaozhiModels} = this.props;
    const {chatInfo, questionTypeData, bottomInput} = xiaozhiModels;
    const chatinfoDom = chatInfo.map((item, chatInfoIndex)=>{
      // isUser 是否为用户聊天 记录
      // isType 如果是小智回答 -2表示询问选择  -1表示常见问题 0表示正常聊天 1指标 2专题 3报告 4报表 6表示指标分析
      const {isUser,isType ,chartWord, data } = item;
      if(isUser){
        return (
          <div className={styles.userInfo} key={Math.random()}>
            <div className={styles.userRecord}>
              <div className={styles.userText}>
                {chartWord}
              </div>
            </div>
            <img className={styles.userImg} src={userImg} alt="用户" />
          </div>
        )
      }
      let xiaozhiInfo = null; // 常见问题专用
      let typeInfoDmo = null; // 问题分类专用
      let chatRecordDemo = null; // 关键字布局
      if(isType === "0"){
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }else if(isType === "-1" || isType === "-2"){
        const xiaozhiInfoLi = data.map((xiaozhiItem,xiaozhiIndex)=>(<li key={xiaozhiItem.id} onClick={()=>this.chatQuestion(xiaozhiItem, isType)}>{xiaozhiIndex+1}、{xiaozhiItem.content}</li>));
        xiaozhiInfo = (<ul className={styles.questionList}>{xiaozhiInfoLi}</ul>);
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }else if(isType === "1"){
        const {id, data:{dataValue, dataName, title, markName, unit, dayOrMonth}} = data;
        const dataType = dayOrMonth.indexOf("日") === -1 ? "2" : "1";
        const liWidth = parseInt((1/dataName.length)*100,10);
        const valueDom = dataName.map((dataNameItem, index)=>{
          const unitCopy = index === 0 ? `(${unit})` : "";
          return (
            <li key={`${index+id}`} style={{width:`${liWidth}%`}}>
              <div>{dataNameItem+unitCopy}</div>
              <div title={dataValue[index]}>{dataValue[index]}</div>
            </li>
          )
        });
        typeInfoDmo = (
          <div className={styles.typeIndex}>
            <div className={styles.typeIndexTop}>
              <span className={styles.typeIndexTitle} onClick={()=>this.jumpHandle(data, dataType)}>{title}</span>
              <span className={styles.iconName}>{markName}</span>
            </div>
            <div className={styles.indexValue}>
              <ul className={styles.indexValueUl}>
                {valueDom}
              </ul>
            </div>
          </div>
        );
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }else if(isType === "2"){
        const {id, data:{content, title, type, tabName}} = data;
        const dataType = tabName.indexOf("日") === -1 ? "2" : "1";
        typeInfoDmo = (
          <div key={`${id}`} className={styles.typeIndex}>
            <div className={styles.typeIndexTop}>
              <span className={styles.typeIndexTitle} onClick={()=>this.jumpHandle(data,dataType)}>{title}</span>
              <span className={styles.iconName2}>{type}</span>
            </div>
            <div className={styles.indexValue}>
              {content}
            </div>
          </div>
        );
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }else if(isType === "3"){
        const {id, data:{issueTime, title, type, issue, reportType, dataSource, reportCycle, reportTime, deptName}} = data;
        const dataType = reportCycle.indexOf("日") === -1 ? "2" : "1";
        typeInfoDmo = (
          <div key={`${id}`} className={styles.typeIndex}>
            <div className={styles.typeIndexTop}>
              <span className={styles.typeIndexTitle} onClick={()=>this.jumpHandle(data, dataType)}>{title}</span>
              <span className={styles.iconNameReport}>{type}</span>
            </div>
            <div className={styles.indexValue}>
              <ul className={styles.reportUl}>
                <li>
                  <span className={styles.reportName}>发布人 : </span>
                  <span className={styles.reportValue} title={issue}>{issue}</span>
                </li>
                <li>
                  <span className={styles.reportName}>发布时间 : </span>
                  <span className={styles.reportValue} title={issueTime}>{issueTime}</span>
                </li>
                <li>
                  <span className={styles.reportName}>报告类型 : </span>
                  <span className={styles.reportValue} title={reportType}>{reportType}</span>
                </li>
                <li>
                  <span className={styles.reportName}>报告周期 : </span>
                  <span className={styles.reportValue} title={reportCycle}>{reportCycle}</span>
                </li>
                <li>
                  <span className={styles.reportName}>报告时间 : </span>
                  <span className={styles.reportValue} title={reportTime}>{reportTime}</span>
                </li>
                <li>
                  <span className={styles.reportName}>分析部门 : </span>
                  <span className={styles.reportValue} title={deptName}>{deptName}</span>
                </li>
                <li>
                  <span className={styles.reportName}>数据来源 : </span>
                  <span className={styles.reportValue} title={dataSource}>{dataSource}</span>
                </li>
              </ul>
            </div>
          </div>
        );
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }else if(isType === "4"){
        const {id, data:{tableData, title, type, tabName, tableHead}} = data;
        const dataType = tabName.indexOf("日") === -1 ? "2" : "1";
        const indexValueDom = tableHead.map((reportTableItem, reportTableIndex)=>(
          <li key={`${reportTableIndex+id}`}>
            <span className={styles.reportTableName}>{reportTableItem} : </span>
            <span className={styles.reportTableValue} title={tableData[reportTableIndex]}>{tableData[reportTableIndex]}</span>
          </li>
        ));
        typeInfoDmo = (
          <div className={styles.typeIndex}>
            <div className={styles.typeIndexTop}>
              <span className={styles.typeIndexTitle} onClick={()=>this.jumpHandle(data, dataType)}>{title}</span>
              <span className={styles.iconNameReportTable}>{type}</span>
            </div>
            <div className={styles.indexValue}>
              <ul className={styles.reportTableUl}>
                {indexValueDom}
              </ul>
            </div>
          </div>
        );
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            <div className={styles.chatText}>
              {chartWord}
            </div>
            {xiaozhiInfo}
          </div>
        )
      }if(isType === "6"){
        const {isReasonPage} = data;
        let isReasonDom = null; // 跳转文字还是现实内容
        if(isReasonPage === "true"){
          isReasonDom = (
            <div className={styles.chatText}>
              {chartWord}
              <span className={styles.isReasonDomTrue} onClick={()=>this.intelligenceAnalysis(data)}>请点击查看</span>
            </div>
          )
        }else if(isReasonPage === "false") {
          const {falseReason} = data;
          const objDom = {};
          falseReason.forEach((itemReason)=>{
            objDom[itemReason.id] = (<Fragment><span className={styles[`classColor${itemReason.color}`]}>{itemReason.value}</span>{itemReason.unit}</Fragment>);
          });
          const chartWordArr = chartWord.split("##");
          const chartWordCopy = chartWordArr.map((itemChartWordArr)=>{
            if(itemChartWordArr in objDom){
              return objDom[itemChartWordArr];
            }
            return itemChartWordArr;

          });
          isReasonDom = (
            <div className={styles.chatText}>
              {chartWordCopy}
            </div>
          )
        }
        chatRecordDemo = (
          <div className={styles.chatRecord}>
            {isReasonDom}
          </div>
        )
      }
      return (
        <div className={styles.xiaozhiInfo} key={`chatInfoIndex_${chatInfoIndex+1}`}>
          <img className={styles.xiaozhiImg} src={popDownImg} alt="小智" />
          {chatRecordDemo}
          {typeInfoDmo}
        </div>
      )
    });

    const questionTypeDom = questionTypeData.map((item)=>{
      let liStyle = "";
      if(item.typeId === "1"){
        liStyle = "zhibiao";
      }else if(item.typeId === "2"){
        liStyle = "zhuanti";
      }else if(item.typeId === "3"){
        liStyle = "baogao";
      }else if(item.typeId === "4"){
        liStyle = "baobiao";
      }
      return (<li key={item.typeId} onClick={()=>this.typeFun(item)} className={styles[liStyle]}>{item.typeName}</li>)
    });

    return (
      <Fragment>
        <div onClick={this.showModal1} className={styles.clickButton}>
          <img
            src={imgStyle === 0 ? popUpImg : popDownImg}
            style={imgStyle === 0 ?{width:31,height:31,marginTop:9,marginLeft:9.5}:null}
            alt=""
          />
        </div>
        <div className={styles.container} style={{right: visible ? "50px" : "-650px"}}>
          <div className={styles.title}>
            <span className={styles.iconFont}>智能</span>
            <span className={styles.titleName}>智能交互</span>
          </div>
          <div className={styles.content}>
            <div className={styles.infoContent} ref={this.listRef}>
              <div className={styles.chatTime}>
                {chatTime}
              </div>
              {chatinfoDom}
              <QuestionTypeList callBackQueryQuestion={(condition, questionState)=>this.getQueryQuestion(condition, questionState)} />
            </div>
            <div className={styles.typeList}>
              <span className={styles.listName}>问题分类</span>
              <ul className={styles.ulList}>
                {questionTypeDom}
              </ul>
            </div>
          </div>
          <div className={styles.inputContent}>
            <input className={styles.inputText} onKeyPress={(e)=>this.keypress(e)} onChange={(e)=>this.changeBottomInput(e.target.value)} value={bottomInput} type="text" />
            <span className={styles.submit} onClick={()=>this.submitBottomInput()}>提交</span>
          </div>

        </div>

      </Fragment>
    )
  }
}


export  default XiaoZhiResponse;
