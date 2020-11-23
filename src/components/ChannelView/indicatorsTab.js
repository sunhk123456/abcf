/**
 * @Description: 业务指标组件Tab
 *
 * @author: gsx
 *
 * @date: 2019/6/12
 */

import React, {PureComponent} from 'react';
import {Input,DatePicker,message,Icon} from "antd";
import  moment from "moment";
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import ProductViewTimeEchart from '../ProductView/TimeEchart';
import ProductViewPieEchart from '../ProductView/PieEchart';
import Top5 from "./productEchart";
import ProvinceCity from '@/components/Until/proCity';
import styles from "./indicatorsTab.less"

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const dayFormat = "YYYY-MM-DD";

@connect(({ indicatorsTab, proCityModels,loading }) => ({
  indicatorsTab,
  proCityModels,
  loading: loading.models.indicatorsTab,
}))
class IndicatorsTab extends PureComponent {
  constructor(props) {
    super(props);
    const {dispatch,tabId,proCityModels:{selectPro, selectCity}}=props;
    dispatch({
      type:"indicatorsTab/fetchMaxDate",
      payload:{markType: 'channelView',tabId}
    });
    this.state = {
      channelId:"",
      channelName:"",
      dateType:"1",
      nameList:[],
      listFlag:false,
      provId:selectPro.proId||"",
      cityId:selectCity.cityId||"",
      channelIndex: "",
    };
    this.dayRef=React.createRef();
    this.monthRef=React.createRef();
  }

  componentDidMount() {
    const {indicatorsTab:{date,baseInfo},proCityModels:{selectPro, selectCity},tabId}=this.props;
    const defaultParams={
      provId:selectPro.proId||"",
      cityId:selectCity.cityId||"",
      markType: 'channelView',
      channelId:"",
      channelName:"",
      dateType:"1",
      indexId:"",
      tabId,
      date,
    };
    this.initChart(defaultParams)
    // 获取默认显示的指标
    if(baseInfo.length > 0 && baseInfo[0].item[0].itemName){
      this.setState({channelIndex:baseInfo[0].item[0].itemName})
    }
  }

  componentDidUpdate(prevProps,prevState) {
    const{indicatorsTab:{condition,baseInfo,date},tabId}=this.props;
    const {dateType,cityId,provId}=this.state;
    if(!isEqual(condition,prevProps.indicatorsTab.condition) && Object.keys(condition).length > 0){
      this.initChart({...condition,dateType,date,tabId,indexId:"",markType: 'channelView'})
    }
    if(!isEqual(dateType,prevState.dateType)||!isEqual(date,prevProps.indicatorsTab.date)){
      if(Object.keys(condition).length > 0){
        this.initChart({...condition,dateType,date,tabId,indexId:"",markType: 'channelView'})
      }else {
        const defaultParams={
          provId,
          cityId,
          markType: 'channelView',
          channelId:"",
          channelName:"",
          indexId:"",
          dateType,
          tabId,
          date,
        };
        this.initChart(defaultParams)
      }
    }
    // 获取默认显示的指标
    if(!isEqual(baseInfo,prevProps.indicatorsTab.baseInfo) || tabId !== prevProps.tabId){
      const self = this;
      self.setState({channelIndex:baseInfo[0].item[0].itemName})
    }
  }

  componentWillUnmount(){
    const {dispatch}=this.props;
    dispatch({
      type:"indicatorsTab/clearCondition",
      payload:{}
    })
  }

  /**
   * 渠道Id
   * @param e
   */
  changeChannelId=e=>{
    this.setState({
      channelId:e.target.value
    })
  };

  /**
   * 渠道名称
   * @param e
   */
  changeChannelName=(value,e)=>{
    e.preventDefault();
    this.setState({
      channelName:value,
      listFlag:false
    });
    const inputList=document.getElementsByTagName("input");
    for(let i=0;i<inputList.length;i+=1){
      inputList[i].blur()
    }
  };

  /**
   * 获取渠道名称
   * @param e
   */
  fetchProductName=e=>{
    this.setState({
      channelName:e.target.value
    });
    const {dispatch,proCityModels:{selectPro, selectCity}}=this.props;
    dispatch({
      type:"indicatorsTab/fetchChannelNameHint",
      payload:{
        value:e.target.value,
        markType:"channelView",
        cityId:selectCity.cityId||"",
        provId:selectPro.proId||""
      },
      callback:(res)=>{
        this.setState({
          nameList:res||[]
        });
      }
    })
  };

  /**
   * 查询
   */
  handleSearch=()=>{
    const {channelId,channelName}=this.state;
    const {dispatch,proCityModels:{selectPro, selectCity},tabId}=this.props;
    dispatch({
      type:"indicatorsTab/checkChannel",
      payload:{
        tabId,
        channelId,
        channelName,
        provId:selectPro.proId||"",
        cityId:selectCity.cityId||""
      },
      callback:res=>{
        if(res.code!=="success"){
          message.error(res.message,2)
        }
      }
    })
  };

  /**
   * 获取数据
   * @param payload 请求参数
   */
  initChart=(payload)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"indicatorsTab/fetchBaseTable",
      payload
    });
    dispatch({
      type:"indicatorsTab/fetchTimeEchartData",
      payload
    });
    dispatch({
      type:"indicatorsTab/fetchPieEchartData",
      payload
    });
  };

  /**
   * 日月切换按钮
   * @param id
   */
  changeButton=id=>{
    if(id==="1"){
      this.dayRef.current.className="antd-pro-components-channel-view-indicators-tab-selected";
      this.monthRef.current.className="antd-pro-components-channel-view-indicators-tab-unSelected";
    }else {
      this.dayRef.current.className="antd-pro-components-channel-view-indicators-tab-unSelected";
      this.monthRef.current.className="antd-pro-components-channel-view-indicators-tab-selected";
    }
    const {dispatch,indicatorsTab:{maxDay,maxMonth}}=this.props;
    dispatch({
      type:"indicatorsTab/fetchDate",
      payload:id==="1"?maxDay:maxMonth
    });
    this.setState({
      dateType:id
    })
  };

  changeConditionDate=(date, dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"indicatorsTab/fetchDate",
      payload:dateString
    })
  };

  changeChart=(indexId,itemValue,indexName)=>{
    if(itemValue!=="-"){
      const{dispatch,indicatorsTab:{condition,date},proCityModels:{selectPro, selectCity},tabId}=this.props;
      const {dateType}=this.state;
      let payload={
        provId:selectPro.proId||"",
        cityId:selectCity.cityId||"",
        markType: 'channelView',
        channelId:"",
        channelName:"",
        dateType,
        indexId,
        tabId,
        date,
      };
      this.setState({channelIndex:indexName})
      if(Object.keys(condition).length > 0){
        payload={
          ...payload,
          ...condition
        }
      }
      dispatch({
        type:"indicatorsTab/fetchTimeEchartData",
        payload
      });
      dispatch({
        type:"indicatorsTab/fetchPieEchartData",
        payload
      });
    }
  };

  render() {
    const{indicatorsTab:{baseInfo,channel,timeEchartData,pieEchartData,date,maxDay,maxMonth}}=this.props;
    const {dateType,nameList,channelName,listFlag, channelIndex}=this.state;
    const progressColor=dateType==="1"?"rgba(111, 179, 237, 1)":"rgba(92, 213, 227, 1)";
    const triangle = <Icon type="caret-down" theme="filled" />;
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(dateType ==="1"?maxDay:maxMonth);
    }
    const baseInfoList=baseInfo.map((item,index)=>(
      <div key={item.id} style={{width:baseInfo.length<4?"33%":"25%",borderRight:index!==baseInfo.length-1?"1px solid rgb(228,228,228)":null}}>
        <div className={styles.infoTitle}><div className={styles.circleRed} />{item.name}</div>
        <div className={styles.baseInfoItem}>
          <table>
            <tbody>
              {item.item.map(list=>{
                  if(Array.isArray(list.itemValue)){
                    return list.itemValue.map((child,childIndex)=>(
                      <tr onClick={()=>this.changeChart(child.itemChildId,child.itemChildValue,child.itemChildName)}>
                        <td style={{textIndent:28}} className={styles.infoItemName}>{childIndex===0?`${list.itemName}:`:""}</td>
                        <td className={styles.infoItemName}>{child.itemChildName}:</td>
                        <td style={{fontWeight:"bold"}}>
                          <span className={styles.underline}>
                            {child.itemChildValue}{child.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                    return(
                      <tr onClick={()=>this.changeChart(list.itemId,list.itemValue, list.itemName)}>
                        <td className={styles.infoItemName}>
                          {list.itemName}:
                        </td>
                        <td style={{fontWeight:"bold"}}>
                          <span className={styles.underline}>
                            {list.itemValue}{list.unit}
                          </span>
                        </td>
                        <td />
                      </tr>
                    )})}
            </tbody>
          </table>
        </div>
      </div>
        ));
    return (
      <div className={styles.indicatorsTab}>
        <div className={styles.condition}>
          <div className={styles.ProCityDiv}>
            <ProvinceCity markType="channelView" />
          </div>
          <div className={styles.inputStyle}>
            <span>渠道ID：</span>
            <Input onChange={this.changeChannelId} placeholder="请输入" />
          </div>
          <div className={styles.inputStyle}>
            <span>渠道名称：</span>
            <Input
              title={channelName}
              onChange={this.fetchProductName}
              placeholder="请输入"
              value={channelName}
              onFocus={()=> this.setState({listFlag:true})}
              onBlur={()=>this.setState({listFlag:false})}
            />
            {
              nameList.length>0&&(
                <div style={{display:listFlag?"block":"none"}} className={styles.liList}>
                  {nameList.map(item=>(<div title={item.sname} onMouseDown={this.changeChannelName.bind(this,item.sname)}>{item.sname}</div>))}
                </div>
              )
            }
          </div>
          <div className={styles.queryDownload}>
            <span className={styles.query} onClick={this.handleSearch}>查询</span>
          </div>
        </div>
        <div className={styles.channelInfo}>
          <div className={styles.tableTop}>
            <span className={styles.iconRed} />
            <span className={styles.tableName}>渠道信息</span>
            <span className={styles.changeButton}>
              <span ref={this.dayRef} style={{borderRight: "1px solid #999"}} className={styles.selected} onClick={()=>{this.changeButton("1")}}>日</span>
              <span ref={this.monthRef} className={styles.unSelected} onClick={()=>{this.changeButton("2")}}>月</span>
            </span>
            <span className={styles.DateStyle}>
              <span>账期：</span>
              {dateType==="1"?(
                <DatePicker
                  dropdownClassName={styles.dateDropdown}
                  showToday={false}
                  value={moment(date || null,dayFormat)}
                  disabledDate={disabledDate}
                  allowClear={false}
                  format={dayFormat}
                  onChange={this.changeConditionDate}
                  // suffixIcon={triangle}
                />
              ):(
                <MonthPicker
                  dropdownClassName={styles.dateDropdown}
                  showToday={false}
                  value={moment(date || null,monthFormat)}
                  disabledDate={disabledDate}
                  allowClear={false}
                  format={monthFormat}
                  onChange={this.changeConditionDate}
                  // suffixIcon={triangle}
                />
              )}

            </span>
          </div>
          <div className={styles.baseInfo}>
            {baseInfoList}
          </div>
        </div>
        <div className={styles.selectedIndex}>
          <b>所选渠道、指标：</b>
          {JSON.stringify(channel) !== "{}" && (channel.channelId !== "" ? `（${channel.channelId}）${channel.channelName}` : channel.channelName)}、
          {channelIndex}
        </div>
        <div className={styles.echartsList}>
          <div>
            <ProductViewTimeEchart chartData={timeEchartData} />
          </div>
          <div>
            {/*<Top5 chartData={top5} progressColor={progressColor} tabName="业务指标" />*/}
            <ProductViewPieEchart chartData={pieEchartData} />
          </div>
        </div>
      </div>
    )
  }
}

export default IndicatorsTab;
