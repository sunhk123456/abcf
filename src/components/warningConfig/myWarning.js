/*
*   添加警告弹出层组件
*   2019-12-4
*   yinlingyun
* */
import React, { PureComponent } from 'react';
import { Icon, notification, Popconfirm, Pagination  } from 'antd';
import { connect } from 'dva';
import {APIURL_WARNING_NUMBER} from '@/services/webSocketUrl';
import Websocket from 'react-websocket';
import Cookie from '@/utils/cookie';
import isEqual from "lodash/isEqual";
import styles from './myWarning.less';

@connect(({ warningModels }) => ({
  warningModels
}))
class myWarning extends PureComponent{

  static defaultProps={
    onClose:() => {this.handleClick(false)}
  };

  constructor(props) {
    super(props);
    this.addWarning = React.createRef();
    this.state = {
      websocketSign: false, // websocket标记是否挂载
    }
  }

  componentDidMount() {
    this.getMyWarning();
  }

  componentDidUpdate(prveProps) {
    const {warningModels:{list}} = this.props;
    if (!isEqual(prveProps.warningModels.list,list)) {
      console.log("刷新")
    }
  }

  // 删除成功弹窗
  openNotificationSuccess = type => {
    notification[type]({
      message: '删除预警成功',
      duration: 3,
    });
  };

  // 删除失败弹窗
  openNotificationFailed = (type,info) => {
    notification[type]({
      message: '删除预警失败',
      description:info,
      duration: 3,
    });
  };

  // 删除确认
  deleteConfirm = (id) => {
    console.log('确认删除预警')
    this.getDeleteWarning(id);
  };

  // 删除取消
  deleteCancel = () => {
    console.log('取消删除预警')
  };

  // 获取我的预警数据
  getMyWarning = (page="1") => {
    const {dispatch} = this.props;
    const params = {
      markType:"",
      indexId:"",
      provId:"",
      cityId:"",
      dateType:"",
      "pageNum":"10",
      "num":page
    };
    dispatch({
      type: `warningModels/getMyWarning`,
      payload: params,
    });
  };

  // 请求删除预警
  getDeleteWarning = (id) => {
    const {dispatch,warningModels:{provId,cityId,markType,indexId,dateType}} = this.props;
    const params = {
      markType,
      indexId,
      provId,
      cityId,
      dateType,
      warnId: id,
    };
    dispatch({
      type: `warningModels/getDeleteWarning`,
      payload: params,
      callback: res =>{
        if (res.status === 'success'){
          this.openNotificationSuccess('success');
          this.getMyWarning();
          // 删除成功开启WebSocket
          console.log("删除成功开启WebSocket")
          // this.openWebsocket();
          this.setState({websocketSign:true})
        } else {
          this.openNotificationFailed('error',res.message);
        }
      }
    });
  };

  dataListDisplay=(data)=> {
    console.log("data");
    console.log(data);
    return data.map((item) => {
      const condition={
        warnId:item.warnId, // 编辑预警的id
        dateType: item.dateType, // 日月标识
        markType: item.markType, // 专题id
        indexId: item.indexId, // 指标Id
        provId:item.provId,
        cityId:item.cityId,
        IsSubKpi:item.IsSubKpi, // 指标专题标识，1：指标；2：专题
      };
      const children = item.value.map((its) => (
        <div key={its.name} className={styles.warningItem}>
          {its.name}
          <span>&nbsp;{its.value}&nbsp;</span>
          {its.unit};
          {its.configName}
          <span>&nbsp;{its.configValue}&nbsp;</span>
          {its.unit}
        </div>
      ));
      const listName = item.cityId === "-1" ? `${item.indexName}-${item.provName}` : `${item.indexName}-${item.provName}-${item.cityName}`
      return (
        <div className={styles.contentTop} key={item.warnId}>
          <div className={styles.contentTopTitle}>
            {listName}
            <div className={styles.handleButton}>
              <span>
                <span onClick={() => {this.handleClickAddWarning(true,condition);}}>编辑</span>
                &nbsp;|
              </span>
              <Popconfirm
                placement="rightTop"
                title='确定要删除此条预警吗'
                onConfirm={() => this.deleteConfirm(item.warnId)}
                onCancel={() => this.deleteCancel}
                okText="是"
                cancelText="否"
              >
                <span>&nbsp;删除</span>
              </Popconfirm>
            </div>
          </div>
          {children}
        </div>
      )
    });};

  // 删除调用方法
  deleteFun = (id) => {
    console.info(id);
    this.getDeleteWarning(id)
  };

  // 添加预警
  handleClickAddWarning=(params,condition)=>{
    // 设置请求弹出层数据筛选条件
    // const condition={
    //   warnId:"", // 编辑预警的id
    //   dateType: '2', // 日月标识
    //   markType: '', // 专题id
    //   indexId: 'CKP_12783', // 指标Id
    //   provId:"111",
    //   cityId:"-1",
    //   IsSubKpi:"1", // 指标专题标识，1：指标；2：专题
    // };
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/setCondition`,
      payload: condition,
    });
    // 清除编辑的省市
    dispatch({
      type: `warningModels/setEditArea`,
      payload: {proId:condition.provId,cityId:condition.cityId},
    });
    // 显示弹出层
    dispatch({
      type: `warningModels/setVisible`,
      payload: {visible:params},
    });
    // 关闭我的预警弹出层
    const {onClose}=this.props;
    onClose();
  };

  pageOnChange=(pageNumber)=>{
    this.getMyWarning(pageNumber)
  };

  // 自主关闭原先的webSocket并开启新的webSocket
  openWebsocket=()=>{
    console.log("自主关闭原先的webSocket并开启新的webSocket")
    this.warningRefWebSocket.componentWillUnmount();
    this.warningRefWebSocket.setupWebsocket();
  };

  // webSocket
  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const parames = {
      token,
      userId,
    };
    this.sendMessage(JSON.stringify(parames))
  };

  // webSocket
  handleClose = () =>{
    console.log("websocket close");
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 发送消息
   * @method sendMessage
   * @param myMessage 参数：myMessage 参数描述：
   * @return {返回值类型} 返回值说明
   */
  sendMessage = (myMessage) => {
    this.warningRefWebSocket.sendMessage(myMessage);
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
   */
  // eslint-disable-next-line
  handleData(data) {
    const result = JSON.parse(data);
    console.log("删除接受websocket返回结果")
    console.log(result)
    // 更新预警数字
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/setWarningNumber`,
      payload: {number:result},
    });
    this.warningRefWebSocket.componentWillUnmount();
    console.log("关闭了websocket")
  }

  render() {
    const {onClose,warningModels}=this.props;
    const {websocketSign} = this.state;
    const {warningData} = warningModels;
    const{ title,list,total,currentPage} = warningData;
    const displayList = this.dataListDisplay(list);
    return(
      <div className={styles.addWarning}>
        <div className={styles.popWrapper} ref={this.addWarning}>
          <div className={styles.title}>
            {title}
            <div className={styles.icon} onClick={onClose}>
              <Icon type="close" />
            </div>
          </div>
          {displayList}
          <div className={styles.pagination}>
            <Pagination
              showQuickJumper
              pageSize={10}
              defaultCurrent={1}
              total={parseInt(total,10)}
              current={Number(currentPage)}
              onChange={this.pageOnChange}
            />
          </div>
        </div>
        {websocketSign && (<Websocket
          url={APIURL_WARNING_NUMBER}
          onMessage={(data)=>this.handleData(data)}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          ref={socket => {
            this.warningRefWebSocket = socket;
          }}
        />) }

      </div>
    )
  }
}

export default myWarning;
