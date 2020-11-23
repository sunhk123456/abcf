/* eslint-disable react/no-array-index-key,prefer-template,no-else-return */
import React,{Component,Fragment} from 'react';
import {connect} from 'dva';
import {Tooltip,Icon} from 'antd';
import classNames from 'classnames';
import EarlyWarning from './earlyWarning';
import styles from './indexTable.less';
import Cookie from '@/utils/cookie';
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
@connect(({dayOverViewHeader,billingRevenue})=>({
  dateType:dayOverViewHeader.dateType,
  date:dayOverViewHeader.selectedDate,
  tabId:dayOverViewHeader.tabId,
  proId:billingRevenue.proId,
  proName:billingRevenue.proName
}))
class IndexTable extends Component{
  constructor(props){
    super(props);
    this.state = {
      indexTableData:[],// 全部省的数据
      indexData:{}, // 单个省的数据
      proId:props.proId
    };
  }

  componentDidMount(){
    const {power} = Cookie.getCookie('loginStatus');
    const { date,tabId,dateType,proId} = this.props;
    if(date !== "" && tabId !== "" && dateType !== ""){
      if(power==='city' || power==='specialCity'){
        this.initRequest();
      }else if((power==='all' || power==='prov') && proId !== undefined ){
        this.initRequest();
      }
    }
  }

  static getDerivedStateFromProps(nextProps,prevState){
    const { indexTableData } = prevState;
    const { proId } = nextProps;
    if(proId !== prevState.proId){
      let indexData = {};
      if(indexTableData.length>0){
        indexData = indexTableData.find((item)=>  item.proId === proId);
      }
      return {
        proId:nextProps.proId,
        indexData
      }
    }
    return null;
  }

  componentDidUpdate(prevProps){
    // 账期、切换标签变化去请求
    const {power} = Cookie.getCookie('loginStatus');
    const { date,proId} = this.props;
   if(prevProps.date !== date && date !== ""){
      if(power==='city' || power==='specialCity'){
        this.initRequest();
      }else if((power==='all' || power==='prov') && proId !== undefined ){
        this.initRequest();
      }
    }

  }

  handleData= (indexTableData)=>{
    const {power,provOrCityId} = Cookie.getCookie('loginStatus');
    const { proId} = this.props;
    if(power==='city' || power==="specialCity"){
      return indexTableData.find(item => item.proId === provOrCityId);
    }else{
      return indexTableData.find(item => item.proId === proId);
    }
  };

  ratioDataColor =(data)=>{
    let color;
    if(data === '-'){
      // 正常灰色
      color =  'dataBlank';
    }else{
      const res = data.replace(/%/g, "").replace(/,/g,'');
      color = parseFloat(res)>=0?'dateGreen':'dataRed';
    }
    return color;
  };

  /**
   * 弹出层
   * @param kpiCode
   */
  popUpShow = (kpiCode) =>{
    const {dispatch} = this.props;
    dispatch({
      type:"overviewIndexDetail/setKpiCode",
      payload:kpiCode
    });
    dispatch({
      type:"overviewIndexDetail/setPopUpShow",
      payload:true
    });
  };

  // 请求数据
  initRequest(){
    const { dispatch,date,tabId,dateType,signPosition} = this.props;
    const params = {
      date,
      tabId,
      dateType
    };
    if(dateType==='2'){
      params.indexListId = tabId+'_indexList_'+signPosition;
    }
    dispatch({
      type:"indexList/fetchIndexList",
      payload:params
    })
      .then(indexTableData=>{
        const indexData = this.handleData(indexTableData);
        this.setState({
          indexTableData,
          indexData
        });
      });
  };

  render(){
    const {indexData} = this.state;
    if(indexData && indexData.data!== undefined){
      const {data} = indexData;
      const {tabId,dateType,signPosition} = this.props;
      let heightDiv = "33%";
      if(tabId === "TAB_103"){
        heightDiv = "50%"
      }else if(dateType === "2"){
        if(signPosition === '1'){
          heightDiv = "25%";
        }else{
          heightDiv = "50%";
        }
      }
      // 遍历渲染的指标列表
      let indexDataList;
      if (data !== undefined) {
        indexDataList = data.map((singleData, index)=>{
          const {warningLevel,showEarlyWarning,desc,showException,excepDiscription,kpiCode} = singleData;
          // 智能预警
          const warning = showEarlyWarning === "0"|| showEarlyWarning === undefined?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
          const monthSumNum = showEarlyWarning === "0"|| showEarlyWarning === undefined?
            <span className={classNames(styles.monthSumNum,styles.monthSumNumRight)}>{singleData.items[0]}</span>:
            <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
              <span className={styles.monthSumNum}>{singleData.items[0]}</span>
              <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
            </Tooltip>
          // 指标异动
          const exception = showException === "0" || showException=== undefined? null : <Tooltip placement="bottomLeft" title={excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}><Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} /></Tooltip>;
          const ringRatingDataColorF= this.ratioDataColor(singleData.items[1]);
          const ringRatingDataColorS= this.ratioDataColor(singleData.items[2]);
          return (
            <div key={index} className={styles.singleKpi} style={{height:heightDiv}}>
              <div className={styles.kpiName}><span className={styles.titleSpan} onClick={()=>{this.popUpShow(kpiCode)}}>{exception}{singleData.name}</span></div>
              <div className={styles.indexTable}>
                <div className={styles.monthSum}>
                  <div className={styles.monthSumText}>{singleData.title[0]}</div>
                  <div className={styles.monthSumData}>
                    {monthSumNum}
                    <span className={styles.monthSumUnit}>{singleData.unit}</span>
                  </div>
                </div>
                <div className={styles.ringRating}>
                  <div className={styles.middleText}>{singleData.title[1]}</div>
                  <div className={classNames(styles.ringRatingData,styles[ringRatingDataColorF])}>{singleData.items[1]}</div>
                </div>
                <div className={styles.samerating}>
                  <div className={styles.middleText}>{singleData.title[2]}</div>
                  <div className={classNames(styles.ringRatingData,styles[ringRatingDataColorS])}>{singleData.items[2]}
                  </div>
                </div>
              </div>
            </div> )
        });
      }

      return (
        <Fragment>
          <div className={styles.outerbox}>
            {indexDataList}
          </div>
        </Fragment>
      )
    }else{
      return null;
    }
  }
}
export default IndexTable;
