/**
 * @Description: 渠道评价组件Tab
 *
 * @author: 风信子
 *
 * @date: 2019/6/10
 */

import React, {PureComponent} from 'react';
import {Input,Icon,DatePicker,message} from "antd";
import  moment from "moment";
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import ProductViewTimeEchart from '../ProductView/TimeEchart';
// import ProductViewPieEchart from '../ProductView/PieEchart';
import TreeMap from '@/components/Echart/analyseSpecial/treeMapAndBar/index';
import Top5 from "./productEchart";
import ProvinceCity from '@/components/Until/proCity';
import InfoList from "./infoList";
import classNames from "classnames";
import styles from "./evaluateTab.less"

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

@connect(({ evaluateTab, proCityModels,loading }) => ({
  evaluateTab,
  proCityModels,
  loading: loading.models.evaluateTab,
}))
class EvaluateTab extends PureComponent {
  constructor(props) {
    super(props);
    const {dispatch,tabId}=props;
    dispatch({
      type:"evaluateTab/fetchMaxDate",
      payload:{dateType:"2",markType:"channelView",tabId}
    });
    this.state = {
      channelId:"",
      channelName:"",
      nameList:[],
      listFlag:false,
      channelIndex:"",
    }
  }

  componentDidMount() {
    const {evaluateTab:{date,baseInfo},proCityModels:{selectPro, selectCity},tabId}=this.props;
    const defaultParams={
      markType: 'channelView',
      provId:selectPro.proId||"",
      cityId:selectCity.cityId||"",
      channelId:"",
      channelName:"",
      dateType:"2",
      indexId:"",
      date,
      tabId,
    };
    this.initChart(defaultParams)
    // 获取默认显示的指标
    if(baseInfo.length > 0 && baseInfo[2].item[0].itemName){
      this.setState({channelIndex:baseInfo[2].item[0].itemName})
    }
  }

  componentDidUpdate(prevProps) {
    const{evaluateTab:{condition,baseInfo},tabId}=this.props;
    if(!isEqual(condition,prevProps.evaluateTab.condition) && Object.keys(condition).length > 0){
      this.initChart({...condition,tabId,markType: 'channelView',dateType:"2",indexId:""})
    }
    // 获取默认显示的指标
    if(!isEqual(baseInfo,prevProps.evaluateTab.baseInfo)){
      const self = this;
      self.setState({channelIndex:baseInfo[2].item[0].itemName})
    }
  }

  componentWillUnmount(){
    const {dispatch}=this.props;
    dispatch({
      type:"evaluateTab/clearCondition",
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
  fetchProductName=e=>{
    this.setState({
      channelName:e.target.value
    });
    const {dispatch,proCityModels:{selectPro, selectCity}}=this.props;
    dispatch({
      type:"evaluateTab/fetchChannelNameHint",
      payload:{
        markType:"channelView",
        value:e.target.value,
        cityId:selectCity.cityId||"",
        provId:selectPro.proId||""
      },
      callback:(res)=>{
        this.setState({
          nameList:res||[],
        });
      }
    })
  };

  /**
   * 查询
   */
  handleSearch=()=>{
    const {channelId,channelName}=this.state;
    const {dispatch,proCityModels:{selectPro, selectCity},evaluateTab:{date},tabId}=this.props;
    dispatch({
      type:"evaluateTab/checkChannel",
      payload:{
        date,
        tabId,
        channelId,
        channelName,
        provId:selectPro.proId||"",
        cityId:selectCity.cityId||""
      },
      callback:res=>{
        if(res.code!=="success"){
          message.error(res.message,2)
        }else {
          this.setState({channelIndex:""})
        }
      }
    })
  };

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

  changeConditionDate=(date, dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"evaluateTab/fetchDate",
      payload:dateString
    })
  }

  /**
   * 获取数据
   * @param payload 请求参数
   */
  initChart=(payload)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"evaluateTab/fetchBaseTable",
      payload
    });
    dispatch({
      type:"evaluateTab/fetchTimeEchartData",
      payload
    });
    dispatch({
      type:"evaluateTab/fetchTableEchartData",
      payload
    });
    dispatch({
      type:"evaluateTab/fetchPieEchartData",
      payload
    });
  };

  changeChart=(indexId,indexFlag,itemValue,indexName)=>{
    if(indexFlag==="true"&&itemValue!=="-"){
      this.setState({
        channelIndex:indexName
      })
      const {dispatch,evaluateTab:{date,condition},proCityModels:{selectPro, selectCity},tabId}=this.props;
      let payload={
        markType: 'channelView',
        provId:selectPro.proId||"",
        cityId:selectCity.cityId||"",
        channelId:"",
        channelName:"",
        dateType:"2",
        indexId,
        date,
        tabId,
      };
      if(Object.keys(condition).length > 0){
        payload={
          ...payload,
          ...condition,
        }
      }
      dispatch({
        type:"evaluateTab/fetchTimeEchartData",
        payload
      });
      dispatch({
        type:"evaluateTab/fetchTableEchartData",
        payload
      });
      dispatch({
        type:"evaluateTab/fetchPieEchartData",
        payload
      });
    }
  }

  render() {
    const {evaluateTab:{baseInfo,baseInfo2, channel,timeEchartData,pieEchartData,top5,date,maxDate}}=this.props;
    const {listFlag,nameList,channelName,channelIndex}=this.state;
    const triangle = <Icon type="caret-down" theme="filled" />;
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    const number=["","一星","二星","三星","四星","五星"];
    const evaluate=["","差","一般","较好","好","很好"];
    const baseInfoList=[];
    const otherInfoList=[];
    if(baseInfo.length>0){
      for(let i=0;i<baseInfo[0].item.length;i+=2) {
        baseInfoList.push(
          <tr key={baseInfo[0].item[i].itemId}>
            <td className={styles.infoItemName}>{baseInfo[0].item[i].itemName}:</td>
            <td style={{fontWeight:"bold"}}><div className={styles.infoItemValue} title={baseInfo[0].item[i].itemValue}>{baseInfo[0].item[i].itemValue}</div></td>
            <td className={styles.infoItemName}>{baseInfo[0].item[i+1]?`${baseInfo[0].item[i+1].itemName}:`:""}</td>
            <td style={{fontWeight:"bold"}}><div className={styles.infoItemValue} title={baseInfo[0].item[i+1]?baseInfo[0].item[i+1].itemValue:""}>{baseInfo[0].item[i+1]?baseInfo[0].item[i+1].itemValue:""}</div></td>
          </tr>
        );
      }
      baseInfo.map((item,index)=>{
        if(index>0){
          const trList=[];
          if(item.item.length>4){
            for(let i=0;i<item.item.length;i+=2) {
              trList.push(
                <tr key={item.item[i].itemId}>
                  <td
                    onClick={()=>this.changeChart(item.item[i].itemId,item.item[i].indexFlag,item.item[i].itemValue,item.item[i].itemName)}
                    className={styles.infoItemName}
                    style={{cursor:item.item[i].indexFlag==="true"?"pointer":null}}
                  >
                    {item.item[i].itemName.indexOf("其中") === -1 ? item.item[i].itemName : (item.item[i].itemName.indexOf("5G发展用户") === -1 ? `\u3000\u3000\u3000\u3000\u3000${item.item[i].itemName.substr(3)}`: `\u3000\u3000${item.item[i].itemName}`)}:
                  </td>
                  <td
                    onClick={()=>this.changeChart(item.item[i].itemId,item.item[i].indexFlag,item.item[i].itemValue,item.item[i].itemName)}
                    style={{fontWeight:"bold",cursor:item.item[i].indexFlag==="true"?"pointer":null}}
                  >
                    <span className={item.item[i].indexFlag==="true" && styles.underline}>
                      {item.item[i].itemValue}{item.item[i].unit}
                    </span>

                  </td>
                  <td
                    onClick={()=>this.changeChart(item.item[i+1].itemId,item.item[i+1].indexFlag,item.item[i+1].itemValue,item.item[i+1].itemName)}
                    className={styles.infoItemName}
                    style={{cursor:item.item[i+1]&&item.item[i+1].indexFlag==="true"?"pointer":null}}
                  >
                    {item.item[i+1]?`${item.item[i + 1].itemName}:`:""}
                  </td>
                  <td
                    onClick={()=>this.changeChart(item.item[i+1].itemId,item.item[i+1].indexFlag,item.item[i+1].itemValue,item.item[i+1].itemName)}
                    style={{fontWeight:"bold",cursor:item.item[i+1]&&item.item[i].indexFlag==="true"?"pointer":null}}
                  >
                    <span className={item.item[i+1] && item.item[i].indexFlag==="true" && styles.underline}>
                      {item.item[i+1] && `${item.item[i + 1].itemValue}${item.item[i+1].unit}`}
                    </span>
                  </td>
                </tr>
              );
            }
          }else {
            const starNum=[];
            const progress=[];
            let starProgress="-";
            item.item.map(list=>{
              if(list.itemName==="渠道评价等级"&&list.itemValue!=="-"){
                starProgress=list.itemValue;
                for(let i=0;i<list.itemValue;i+=1){
                  starNum.push(<Icon type="star" theme="filled" style={{color:"#f4ea2a"}} />);
                }
                progress.push(<div className={styles.progress}><div className={styles.progressContent} style={{width:`${list.itemValue*20}%`}} /></div>)
              }
              trList.push(
                <tr
                  key={list.itemId}
                  onClick={()=>this.changeChart(list.itemId,list.indexFlag,list.itemValue,list.itemName)}
                  style={{cursor:list.indexFlag==="true" && item.id === "04" ?"pointer":null}}
                >
                  <td align="top" className={styles.infoItemName}>
                    {list.itemName}:
                  </td>
                  <td style={{fontWeight:"bold"}}>
                    <span className={list.indexFlag==="true" && item.id === "04" && styles.underline}>

                      {list.itemName==="渠道评价等级"?number[list.itemValue]:list.itemValue}
                      {list.unit}
                      {list.itemName==="渠道评价等级"&&starNum}
                      {list.itemName==="渠道毛利率"&&progress}
                      {list.itemName==="渠道毛利率"&&evaluate[starProgress]}
                    </span>

                  </td>
                  <td />
                </tr>);
              return null
            })
          }
          const style={
            // width:window.screen.width>960?index===2?"45%":"25%":index===2?"50%":"30%",
            // marginLeft:window.screen.width>960?17:0,
            // paddingRight:window.screen.width>960?"2%":0,
            // borderRight:index!==baseInfo.length-1?"1px solid rgb(228,228,228)":null
          }
          otherInfoList.push(
            <div key={item.id} style={style}>
              <div className={styles.infoTitle}><div className={styles.circleRed} />{item.name}</div>
              <div className={styles.otherInfoItem}>
                <table>
                  <tbody>
                    {trList}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
        return null
      });
    }
    return (
      <div className={styles.evaluateTab}>
        <div className={styles.condition}>
          <div className={styles.ProCityDiv}>
            <ProvinceCity markType="channelView" />
          </div>
          <div style={{width:"35%"}} className={styles.inputStyle}>
            <div className={styles.conditionName}>账期：</div>
            <MonthPicker
              showToday={false}
              dropdownClassName={styles.dateDropdown}
              value={moment(date || null,monthFormat)}
              disabledDate={disabledDate}
              allowClear={false}
              format={monthFormat}
              onChange={this.changeConditionDate}
              // suffixIcon={triangle}
            />
          </div>
          <div style={{width:"25%"}} className={styles.inputStyle}>
            <div className={styles.conditionName}>渠道ID：</div>
            <Input onChange={this.changeChannelId} placeholder="请输入" />
          </div>
          <div style={{width:"50%"}} className={classNames(styles.inputStyle,styles.inputChannelName)}>
            <div className={styles.conditionName}>渠道名称：</div>
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
          </div>

          <div className={styles.otherInfo}>
            <div>
              <div className={styles.infoTitle}><div className={styles.circleRed} />{baseInfo.length>0?baseInfo[0].name:""}</div>
              <div className={styles.baseInfoItem}>
                <table>
                  <tbody>
                    {baseInfoList}
                  </tbody>
                </table>
              </div>
            </div>
            {otherInfoList[0]}
          </div>
          <div className={styles.otherInfo}>
            {otherInfoList.slice(1)}
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
            <Top5 chartData={top5} progressColor="rgba(92, 213, 227, 1)" tabName="渠道评价" />
          </div>
          <div>
            <TreeMap chartData={pieEchartData} />
          </div>
        </div>
      </div>
    )
  }
}

export default EvaluateTab;
