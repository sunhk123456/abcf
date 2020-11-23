/**
 * @Description: 携号转网监控报表（实时） echart
 *
 * @author: 风信子
 *
 * @date: 2019/11/13
 */

import React, {PureComponent} from 'react';
import { connect } from 'dva';
import Websocket from 'react-websocket';
import Cookie from '@/utils/cookie';
import {APIURL_NETTOWORK_ECHART} from '@/services/webSocketUrl';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Icon} from 'antd';
import isEqual from 'lodash/isEqual';
import ContrastChart from '@/components/NumberToNetwork/contrastChart';
import ProcedureChart from '@/components/NumberToNetwork/procedureChart';
import styles from "./index.less";
import CollectComponent from '../../components/myCollection/collectComponent'


@connect(
  ({
     NumberToNetworkModel
   }) => ({
    NumberToNetworkModel,
  })
)
class NumberToNetwork extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      'markType':"XHZW_REALTIME_D",
      'selectIndex':0,
      'titleName':'携号转网实时监控',
      'refresh':'页面实时数据刷新频率:1分钟/次',
      'icon':false, // 是否展示下拉地域列表
      'areaName':'', // 切换地域名字 （不包含北十南二十一，试验非试验）
      'areaNameId':"", // 切换地域名字（不包含北十南二十一，试验非试验）
      'tabId':"", // 选中id （包含北十南二十一，试验非试验）
      'tabName':"", // 选中名字（包含北十南二十一，试验非试验）
      "list":[],
      "areaList":[],
      timeHorizon:"自xx月xx日零点截止到xx点",
      contrastData:{},
      procedureData: {},
      cleanJoinRegionData:{},
      newJoinRegionData:{},
      newOutRegionData:{}
    }
  }

  componentDidMount() {
    this.initRequest();
  }

  componentWillUnmount() {
    this.setState({
      selectIndex:0,
    })
  }

  initRequest = () => {
    const { dispatch } = this.props;
    const { markType } = this.state;
    const params = {
      markType,
    };
    dispatch({
      type: `NumberToNetworkModel/fetchTitleData`,
      payload: params,
      callback:(res)=>{
        if(res&&res.list[0]){
          this.setState({
            'areaName':res.list[0].name,
            'areaNameId':res.list[0].id,
            'tabId':res.list[0].id,
            'tabName':res.list[0].name,
            'titleName':res.titleName,
            'refresh':res.list[0].refresh,
            'list':res.list,
            'areaList':res.areaList
          })
        }
      }
    });
  };

  setTable=(index,item)=>{

    const {tabId} = this.state;
    if(tabId===item.id){return null}
    // console.log('tab被点击');
    // console.log(item);
    this.setState({
      selectIndex:index,
      tabName:item.name,
      tabId:item.id
    },()=>{
      // console.log('切换tabId')
      this.refWebSocket.componentWillUnmount();
      this.refWebSocket.setupWebsocket();
    });
    return null;
  };

  setIcon=(e)=>{
    // 阻止事件传播
    if(e && e.stopPropagation) { // 非IE
      e.stopPropagation();
    } else { // IE
      window.event.cancelBubble = true;
    }
    const{icon}=this.state;
    this.setState({
      icon:!icon
    })
  };

  setAreaItem=(item)=>{

    const {tabId} = this.state;
    if(tabId===item.id){return null}
    // console.log('areaName被点击');
    this.setState({
      selectIndex:0,
      areaName:item.name,
      areaNameId:item.id,
      tabName:item.name,
      tabId:item.id
    },()=>{
      // console.log('切换tabId')
      this.refWebSocket.componentWillUnmount();
      this.refWebSocket.setupWebsocket();
    })
    return null
  };

  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const {tabId} = this.state;
    const parames = {
      token,
      userId,
      markType:"XHZW_REALTIME_D",
      selectId:tabId
    }
    this.sendMessage(JSON.stringify(parames))
  }

  handleClose = () =>{
    console.log("websocket close");
  }

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 发送消息
   * @method sendMessage
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  sendMessage = message => {
    this.refWebSocket.sendMessage(message);
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
   */
  // eslint-disable-next-line
  handleData(data) {
    const {contrastData, procedureData, cleanJoinRegionData,newJoinRegionData,newOutRegionData} = this.state;
    const result = JSON.parse(data);
    if(!isEqual(result.contrastData,contrastData) || !isEqual(result.procedureData,procedureData) || !isEqual(result.cleanJoinRegionData,cleanJoinRegionData)
      || !isEqual(result.newJoinRegionData,newJoinRegionData)|| !isEqual(result.newOutRegionData,newOutRegionData)
    ){
      this.setState({...result})
    }
  }

  render() {
    const {selectIndex,refresh,icon,areaName,areaNameId,tabName,titleName,list,areaList,contrastData,procedureData,cleanJoinRegionData,newJoinRegionData,newOutRegionData,timeHorizon}=this.state;
    const tab=list.map((item,index)=>{
      if(index===0){
        return null
      }
        return (<div key={item.id} title={item.name} className={selectIndex===index?styles.active:styles.tableItem} onClick={()=>this.setTable(index,item)}>{item.name}</div>)
    });
    const areaTab=areaList.map((item)=>(
      <div key={item.id} className={styles.areaItem} title={item.name} onClick={(e)=>{this.setAreaItem(item);this.setIcon(e)}}>
        {item.name.length>5?(`${item.name.slice(0,4)}...`):item.name}
      </div>
    ));
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      paddingBottom:'3px',
      width:'30px'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.titleName}>
            {titleName}
            <CollectComponent key="XHZW_REALTIME_D" markType="XHZW_REALTIME_D" searchType='2' imgStyle={collectStyle} />
            <div className={styles.details}>{`${timeHorizon}   ${refresh}`}</div>
          </div>
          <div className={styles.content}>
            <div className={styles.table}>
              <div
                key={areaNameId}
                title={areaName}
                className={selectIndex===0?styles.active:styles.tableItem}
                onClick={()=>this.setTable(0,{ name: areaName,id:areaNameId })}
              >
                {areaName.length>5?(`${areaName.slice(0,4)}...`):areaName}
                {areaList.length>0&&
                <div className={styles.areaIcon} onClick={(e)=>this.setIcon(e)}>
                  {icon?<Icon type="caret-up" />:<Icon type="caret-down" />}
                </div>}
              </div>
              {tab}
            </div>
            {icon &&
            <div className={styles.areaList}>
              {areaTab}
            </div>}
          </div>
          <div className={styles.main}>
            {/* ComtrastChart组件有两种宽度 50%时Long=0 100%时Long=1 */}
            <div className={styles.contrastChart}>
              <ContrastChart selectName={tabName} echartData={contrastData} Long={0} echartId='contrastCharId0' />
            </div>
            <div className={styles.procedureChart}>
              <ProcedureChart selectName={tabName} echartData={procedureData} />
            </div>
            {JSON.stringify(cleanJoinRegionData) !== "{}" &&
            <div className={styles.netGrowth} style={{width: '100%'}}>
              <ContrastChart selectName={tabName} echartData={cleanJoinRegionData} Long={1} echartId='contrastCharId1' />
            </div>}
            {JSON.stringify(newJoinRegionData) !== "{}" &&
            <div className={styles.netGrowth} style={{width: '100%'}}>
              <ContrastChart selectName={tabName} echartData={newJoinRegionData} Long={1} echartId='contrastCharId2' />
            </div>}
            {JSON.stringify(newOutRegionData) !== "{}" &&
            <div className={styles.netGrowth} style={{ width: '100%' }}>
              <ContrastChart selectName={tabName} echartData={newOutRegionData} Long={1} echartId='contrastCharId3' />
            </div>}
          </div>
        </div>
        <Websocket
          url={APIURL_NETTOWORK_ECHART}
          onMessage={(data)=>this.handleData(data)}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          ref={socket => {
            this.refWebSocket = socket;
          }}
        />
      </PageHeaderWrapper>
    )
  }
}

export default NumberToNetwork;





