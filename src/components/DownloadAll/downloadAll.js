/**
 * @Description: 下载全部
 *
 * @author: liuxiuqian
 *
 * @date: 2019/03/18
 * <DownloadAll
     downloadParam={}  // name, markType, moduleId, dateType 下载参数
     visible={}      // 显示隐藏组件
     indexTypeVisible={true} // 是否含有指标类型
     onCancel={}  // 关闭返回事件
   />
 */
import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
// import isEqual from 'lodash/isEqual';
import { DatePicker, Select, message } from 'antd';
import moment from 'moment';
import io from 'socket.io-client';
import DownloadUrl from '@/services/downloadUrl.json';
import Cookie from '@/utils/cookie';
import styles from './downloadAll.less';
import preparing from "@/assets/image/downloadAll/preparing.gif";
import prepared from "@/assets/image/downloadAll/prepared.png";

const { MonthPicker} = DatePicker;
const {Option} = Select;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';


@connect(({ downloadAllModels }) => ({
  downloadAllModels
}))

class DownloadAll extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      domStyleFlag: 1, // 页面样式的标志  1表示准备前，2表示准备中，3表示数据具备完成
      downloadPath: null, // 下载路径
      visible: false
    };

  }

  componentDidMount() {
    // this.initFetch();
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.visible !== prevState.visible){
      return {visible:nextProps.visible }
    }
    return null;
  }

  componentDidUpdate(prevProps,prevState){

    // const { downloadParam } = this.props;
    // const { markType, moduleId} = downloadParam;
    // if(markType !== prevProps.downloadParam.markType){
    //   this.initFetch();
    // }else if(moduleId !== prevProps.downloadParam.moduleId){
    //   this.initFetch();
    // }
    if(prevState.visible !== this.state.visible && this.state.visible){
      this.initFetch();
    }
  }

  getSocketIO(){
    const { dispatch, downloadParam, downloadAllModels } = this.props;
    const { name, markType, moduleId, dateType } = downloadParam;
    const { date, selectData, redDot } = downloadAllModels;
    const {userId, token} = Cookie.getCookie('loginStatus');
    const fileNameURI = encodeURIComponent(name);
    const socketip = DownloadUrl.urls[4].url;
    const socket = io.connect(socketip);
    socket.on('connecting', ()=> {
      console.log("正在连接");
    });
    socket.on('connect', ()=> {
      console.log("连接成功");
      this.hideTimeout = setTimeout(()=>{
        this.hideModal();
      },1000*20)
    });
    socket.on('connect_failed', ()=> {
      console.log("连接失败");
    });

    // 发送消息
    socket.emit('event', {
      userId,
      token,
      specialId : markType,
      date,
      fileName : fileNameURI,
      filePath : DownloadUrl.urls[2].url,
      dateType,
      hostIP: window.location.hostname,
      moduleId,
      indexType:selectData.id
    });
    // 接收消息
    socket.on('server2client', (data)=> {
      if(data.dataState === "true"){
        // setDate
        dispatch({
          type: 'downloadAllModels/setRedDot',
          payload: redDot + 1
        });
        // this.confirmRequest();
        socket.disconnect();    // 断开连接
      }
    });
    // 与服务其断开
    socket.on('disconnect', ()=>{
      console.log("与服务器断开");
      clearTimeout(this.hideTimeout);
    });
    // 重新连接到服务器
    socket.on('reconnect', ()=>{
      console.log("重新连接到服务器");
    });
  }

  /**
   * @date: 2019/3/18
   * @author liuxiuqian
   * @Description: 选中日期更新
   * @method onChange
   * @param  date 日期moment格式
   * @param dateString 日期字符串格式
   */
  onChange = (date, dateString) => {
    const { dispatch } = this.props;
    // setDate
    dispatch({
      type: 'downloadAllModels/setDate',
      payload: dateString
    });
  }

  handleChange = (value, option) =>{
    const { dispatch } = this.props;
    // setDate
    dispatch({
      type: 'downloadAllModels/setCondition',
      payload: {
        id: value,
        name: option.props.children
      }
    });
  }

  /**
   * @date: 2019/3/18
   * @author liuxiuqian
   * @Description: 初始化请求
   * @method initFetch
   */
  initFetch(){
    const { dispatch, downloadParam, indexTypeVisible } = this.props;
    // const {dateType, markType, moduleId} = downloadParam;
    // 获取最大账期
    dispatch({
      type: 'downloadAllModels/getDownloadMaxDate',
      payload: {
        ...downloadParam
      }
    });
    if(indexTypeVisible){
      // 获取筛选条件类型
      dispatch({
        type: 'downloadAllModels/getDownloadConditions',
        payload: {
          ...downloadParam
        }
      });
    }
  }

  /**
   * @date: 2019/3/19
   * @author liuxiuqian
   * @Description: 判断数据是否具备
   * @method confirmRequest
   */
  confirmRequest(){
    const { dispatch, downloadParam, downloadAllModels, visible } = this.props;
    const { name, markType, moduleId } = downloadParam;
    const { date, selectData } = downloadAllModels;
    // setDate
    dispatch({
      type: 'downloadAllModels/getDownloadAllPath',
      payload: {
        specialId: markType,
        date,
        moduleId,
        fileName: name,
        indexType: selectData.id,
        filePath: DownloadUrl.urls[2].url
      }
    }).then((res) =>{
      if(res.downloadState === "true"){
        this.setState({downloadPath: res.path, domStyleFlag: visible ? 3 : 1})
      }else {
        this.setState({downloadPath: res.path, domStyleFlag: 2})
        this.getSocketIO();
      }
    });
  }

  /**
   * @date: 2019/3/19
   * @author liuxiuqian
   * @Description: 下载
   * @method downloadPath
   */
  downloadPath(){
    const {downloadPath} = this.state;
    const { onCancel} = this.props;
    if(downloadPath){
      window.open(downloadPath,"_self");
      onCancel();
    }else {
      message("下载失败，请重新下载");
    }
  }

  hideModal(){
    const {onCancel} = this.props;
    clearTimeout(this.hideTimeout);
    this.setState({domStyleFlag: 1});
    onCancel();
  }

  render() {
    const { downloadParam, downloadAllModels, visible, indexTypeVisible } = this.props;
    const {domStyleFlag} = this.state;
    const { dateType, name } = downloadParam;
    const { date, maxDate, downloadConditions, selectData } = downloadAllModels;
    if(visible){
      // 日期
      let disabledDate;
      if(date !== ''){
        disabledDate=(current)=>current && current > moment(maxDate);
      }
      let dateModule = null;
      const triangle = <i className={styles.dateTriangle} />
      if(dateType === "1" || dateType === 1){
        dateModule = <DatePicker onChange={this.onChange} disabledDate={disabledDate} value={moment(date, dateFormat)} allowClear={false} suffixIcon={triangle} showToday={false}/>;
      }else {
        dateModule = <MonthPicker onChange={this.onChange} disabledDate={disabledDate} value={moment(date, monthFormat)} allowClear={false} suffixIcon={triangle} />
      }

      // 筛选条件
      const selectModule = downloadConditions.map((item)=><Option key={item.id} value={item.id}>{item.name}</Option>)

      // 内容样式
      let domStyle = null;
      if(domStyleFlag === 1){
        domStyle = (
          <Fragment>
            <div className={styles.condition}>
              <span className={styles.dateDev}>
                日期：{dateModule}
              </span>
              {
                indexTypeVisible ?
                  <span className={styles.screen}>
                    指标类型：
                    <span>
                      <Select value={selectData.name} style={{ width: 150 }} onChange={this.handleChange} suffixIcon={triangle}>
                        {selectModule}
                      </Select>
                    </span>
                  </span>  : null
              }

            </div>
            <div className={styles.content}>
              <div className={styles.preparationData}>
                *需要准备数据
              </div>
            </div>
          </Fragment>
        )
      }else if(domStyleFlag === 2){
        domStyle = (
          <Fragment>
            <div className={styles.condition}>
              <span className={styles.dateDev}>
                日期：<span className={styles.selectName}>{date}</span>
              </span>
              {
                indexTypeVisible ?
                  <span className={styles.screen}>
                    指标类型：<span className={styles.selectName}>{selectData.name}</span>
                  </span> : null
              }
            </div>
            <div className={styles.content}>
              <div className={styles.preparationData}>
                <img className={styles.preparing} src={preparing} alt="数据准备中..." />
                <span className={styles.contentText}>(数据准备超过20s后对话框会自动关闭，关闭后可在 首页-我的消息-下载列表重新查看下载信息)</span>
              </div>
            </div>
          </Fragment>
        )
      }else if(domStyleFlag === 3){
        domStyle = (
          <Fragment>
            <div className={styles.condition}>
              <span className={styles.dateDev}>
                日期：<span className={styles.selectName}>{date}</span>
              </span>
              {
                indexTypeVisible ?
                  <span className={styles.screen}>
                    指标类型：<span className={styles.selectName}>{selectData.name}</span>
                  </span> : null
              }
            </div>
            <div className={styles.content}>
              <div className={styles.preparationData2}>
                <span className={styles.prepared}>
                  数据已经准备就绪
                  <img className={styles.preparedImg} src={prepared} alt="数据已具备" />
                </span>
                <span className={styles.contentText}>(下载完毕后可在 首页-我的消息-下载列表 内查看)</span>
              </div>
            </div>
          </Fragment>
        )
      }
      return (
        <Fragment>
          <div className={styles.downloadAll}>
            <div className={styles.container}>
              <div className={styles.titleDiv}>专题：<span className={styles.titleName}>{name}</span></div>
              {domStyle}
              <div className={styles.btnContent}>
                {domStyleFlag === 1 ? <span className={styles.btnStyle} onClick={()=>{this.confirmRequest()}}>确定</span> : null}
                {domStyleFlag === 3 ? <span className={styles.btnStyle} onClick={()=>this.downloadPath()}>下载</span> : null}
                <span className={styles.btnStyle} onClick={()=>this.hideModal()}>关闭</span>
              </div>
            </div>
          </div>
        </Fragment>
      )
    }
    return null;
  }
}

export default DownloadAll;
