/**
 * @Description: 渠道总览Tab
 *
 * @author: 风信子
 *
 * @date: 2019/6/10
 */

import React, {PureComponent} from 'react';
import {DatePicker, Icon, Select} from 'antd';
import moment from 'moment';
import { connect } from 'dva/index';
import isEqual from 'lodash/isEqual';
import Cookie from '@/utils/cookie';
import ProductViewTimeEchart from '../ProductView/TimeEchart';
import ProductViewAreaEchart from '../ProductView/AreaEchart';
import TreeMap from '@/components/Echart/analyseSpecial/treeMapAndBar/index';
// import ProductViewPieEchart from '../ProductView/PieEchart';
import Top5 from "./productEchart";
import ProvinceCity from '@/components/Until/proCity';

import ProductTable from "@/components/ProductView/productTable"; // 产品总览表格组件

import styles from "./overviewTab.less"

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const { Option } = Select;

@connect(({ overviewTabModels, proCityModels }) => ({
  overviewTabModels,
  proCityModels
}))
class OverviewTab extends PureComponent {
  constructor(props) {
    super(props);
    const {power} = Cookie.getCookie('loginStatus');
    this.state = {
      flag:power !== 'city' && power !== 'specialCity',
      markType:"channelView",
      dateType:"2",
      channelIndex:"",
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {markType,dateType} = this.state;
    dispatch({
      payload: {markType, dateType, tabId:""},
      type: `overviewTabModels/fetchChannelViewDate`,
      callback:()=>{
        this.getOverviewTabTable("1", "", "","init");
        this.initEchart();
        this.getChannelType();
      }
    });
    // this.getOverviewTabTable("1", "", "","init");
    // this.initEchart();
    // this.getChannelType();
 
  }

  // static getDerivedStateFromProps(props, state) {
  //   const {overviewTabModels:{overviewTableData:{thData,tbodyData}}} = props;
  //   const{channelIndex}=state;
  //   if(thData.length>0&&tbodyData.length>0 && channelIndex === ""){
  //     console.log("getDerivedStateFromProps")
  //     console.log(`${tbodyData[0].channelName}、${thData[2].name}`)
  //     return {
  //       channelIndex: `${tbodyData[0].channelName}、${thData[2].name}`
  //     }
  //   }
  //   return null;
  // }

  componentDidUpdate(prevProps) {
    const {overviewTabModels:{overviewTableData:{thData,tbodyData}}} = this.props;
    const{channelIndex}=this.state;
    if(channelIndex===""&&thData.length>0&&tbodyData.length>0 && !isEqual(tbodyData,prevProps.overviewTabModels.overviewTableData.tbodyData)){
      // eslint-disable-next-line
      this.setState({
        channelIndex: `${tbodyData[0].channelName}、${thData[2].name}`
      })
    }
  }

  componentWillUnmount() {
    this.setState({
        channelIndex:""
    })
    const {dispatch} = this.props;
    dispatch({
      type:"overviewTabModels/saveSelectChannelTypeData",
      payload:undefined // 重置渠道为空
    })
  }


  /**
   * @date: 2019/8/6
   * @author 风信子
   * @Description: 获取渠道分类接口
   * @method getChannelType
  */
  getChannelType(){
    const {dispatch, tabId}=this.props;
    const {markType} = this.state;
    dispatch({
      payload: {
        tabId,
        markType
      },
      type: `overviewTabModels/fetchChannelType`
    });
  }

  /**
  * @date: 2019/6/13
  * @author 风信子
  * @Description: 获取表格数据
  * @method getOverviewTabTable
  * @param {string} 参数：num 参数描述：页面
  */
  getOverviewTabTable(num="1",type="", kpiId="",flag=false){
    const {markType,dateType} = this.state;
    const {dispatch, tabId, overviewTabModels, proCityModels}=this.props;
    const {selectCity, selectPro} = proCityModels;
    const {date,channelTypeId} = overviewTabModels;
    const params = {
      pageNum: "10",
      markType,
      num,
      sorter: type,
      sorterIndex: kpiId,
      date,
      tabId,
      dateType,
      channelClass:channelTypeId,
      provId: flag?"":(selectPro.proId || ""),
      cityId: flag?"":(selectCity.cityId || "")
    }
    dispatch({
      payload: params,
      type: `overviewTabModels/fetchOverviewTabTable`
    });
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 全国合计时间趋势图
   * @method getTimeEchart
   * @param {Object} 参数：params 参数描述：请求参数
   */
  getTimeEchart(params){
    const {dispatch}=this.props;
    dispatch({
      payload: params,
      type: `overviewTabModels/fetchOverviewTabTimeEchart`
    });
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 全国合计地域分布图
   * @method getAreaEchart
   * @param {Object} 参数：params 参数描述：请求参数
   */
  getAreaEchart(params){
    const {dispatch}=this.props;
    dispatch({
      payload: params,
      type: `overviewTabModels/fetchOverviewTabAreaEchart`
    });
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 产品销售TOP5
   * @method getProductEchart
   * @param {Object} 参数：params 参数描述：请求参数
   */
  getProductEchart(params){
    const {dispatch}=this.props;
    dispatch({
      payload: params,
      type: `overviewTabModels/fetchOverviewTabProductEchart`
    });
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 全国合计月出账收入业务构成图接口
   * @method getProductEchart
   * @param {Object} 参数：params 参数描述：请求参数
   */
  getBusinessPie(params){
    const {dispatch}=this.props;
    dispatch({
      payload: params,
      type: `overviewTabModels/fetchOverviewTabBusinessPie`
    });
  }

  /**
   * @date: 2019/6/13
   * @author liuxiuqian
   * @Description: 选中日期改变
   * @method changeConditionDate
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  changeConditionDate=(date, dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"overviewTabModels/saveDate",
      payload:dateString
    })
  }

  // 下载要用
  channelViewTableRef = (ref) => {
    this.child = ref;
  };

  handleDownload =() =>{
    this.child.handleDownload();
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 初始化echart
   * @method initEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  initEchart(param= {}){
    const {markType,dateType} = this.state;
    const {tabId, overviewTabModels, proCityModels}=this.props;
    const {selectCity, selectPro} = proCityModels;
    const {date,channelTypeId} = overviewTabModels;
    if(param.channelName!==undefined){
      this.setState({
        channelIndex:`${param.channelName}、${param.indexName}`,
        flag:(param.provId!=='011'&& param.provId!=='013'&& param.provId!=='031'&& param.provId!=='083')&&param.cityId === "-1"
      });
    }
    const params = {
      markType,
      date,
      tabId,
      dateType,
      provId: selectPro.proId || "",
      cityId: selectCity.cityId || "",
      channelId:"",   // 渠道Id 没有传空
      channelName:"", // 渠道名称 没有传空
      channelClass: channelTypeId,// 渠道分类id
      indexId:"", // 指标id
      ...param
    }
    this.getTimeEchart(params);
    this.getProductEchart(params);
    this.getBusinessPie(params);
    this.getAreaEchart(params);
  }

  /**
   * @date: 2019/6/14
   * @author 风信子
   * @Description: 查询事件
   * @method queryBtn
   */
  queryBtn(){
    const { proCityModels} = this.props;
    const {selectCity, selectPro} = proCityModels;
    this.setState({
      channelIndex:"",
      flag:(selectPro.proId!=='011'&& selectPro.proId!=='013'&& selectPro.proId!=='031'&& selectPro.proId!=='083')&&(selectCity.cityId=== '-1' || selectCity.cityId===undefined || selectCity.cityId==="")
    },()=>{
      this.initEchart();
      this.child.searchReset();// 调用表格子组件
      this.getOverviewTabTable("1")
    });

  }

  /**
   * @date: 2019/8/6
   * @author 风信子
   * @Description: 渠道分类选中处理
   * @method handleChannelTypeChange
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  handleChannelTypeChange(value){
    const {dispatch,overviewTabModels:{channelTypeData}} = this.props;
    const arrValue = value.split(",");
    const arrSelectData = channelTypeData.filter((item)=> arrValue.includes(item.channelId))
    dispatch({
      type:"overviewTabModels/saveSelectChannelTypeData",
      payload:arrSelectData
    })
  }

  render() {
    const {markType,channelIndex,flag} = this.state;
    const {overviewTabModels, proCityModels} = this.props;
    const {selectCity, selectPro} = proCityModels;
    const {
      overviewTableData,
      date,
      maxDate,
      timeEchartData,
      areaEchartData,
      pieEchartData,
      top5Data,
      channelTypeData,
      channelTypeName
    } = overviewTabModels;
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }

    // 表格下载参数
    const defaultParams = {
      title:"渠道总览",
      tableName:"渠道信息",
      params: [{
        name: "账期",
        value: date
      },{
        name: "省分",
        value: selectPro.proName || ""
      },{
        name: "地市",
        value: selectCity.cityName || ""
      },{
        name: "渠道分类",
        value: channelTypeName || ""
      }]
    }

    const channelTypeOption = channelTypeData.map((item)=>(<Option key={item.channelId} value={item.channelId}>{item.channelName}</Option>))

    return (
      <div className={styles.overviewTab}>
        <div className={styles.condition}>
          <div className={styles.dateDom}>
            <span>账期：</span>
            <MonthPicker
              dropdownClassName={styles.dateDropdown}
              disabledDate={disabledDate}
              format={monthFormat}
              showToday={false}
              value={moment(date || null,monthFormat)}
              allowClear={false}
              onChange={this.changeConditionDate}
            />
          </div>
          <div className={styles.ProCityDiv}>
            <ProvinceCity markType={markType} />
          </div>
          <div className={styles.channelType}>
            <span>渠道分类：</span>
            <Select
              placeholder="请选择"
              value={channelTypeName}
              onChange={(value)=>this.handleChannelTypeChange(value)}
              dropdownClassName={styles.channelTypeSelectItme}
            >
              {channelTypeOption}
            </Select>
          </div>

          <div className={styles.queryDownload}>
            <span className={styles.query} onClick={()=>{this.queryBtn()}}>查询</span>
            <span className={styles.download} onClick={this.handleDownload}>
              <Icon className={styles.downIcon} type="download" />下载
            </span>
          </div>
        </div>
        <div className={styles.tableContent}>
          <div className={styles.tableTop}>
            <span className={styles.iconRed} />
            <span className={styles.tableName}>渠道信息</span>
          </div>
          <ProductTable
            tableData={overviewTableData}
            defaultParams={defaultParams}
            markType={markType}
            onRef={this.channelViewTableRef}
            openFunction
            refreshMake
            sorter
            callBackRefreshEchart={(params)=>{this.initEchart(params)}}
            callBackNum={(num, type, pkiId)=>{this.getOverviewTabTable(num, type, pkiId)}}
          />
        </div>
        <div className={styles.selectedIndex}><b>所选渠道、指标：</b>{channelIndex}</div>
        <div className={styles.echartsList}>
          {/*  {flag?(
            <div style={{width:"49.5%"}}>
              <ProductViewTimeEchart chartData={timeEchartData} />
            </div>
          ):(
            <div style={{width:"100%"}}>
              <ProductViewTimeEchart chartData={timeEchartData} />
            </div>
          )} */}
          <div style={{width:flag?"49.5%":"100%"}}>
            <ProductViewTimeEchart chartData={timeEchartData} />
          </div>
          {flag&&(
            <div>
              <ProductViewAreaEchart chartData={areaEchartData} />
            </div>
          )}
          <div>
            <Top5 chartData={top5Data} progressColor="rgba(97, 183, 219, 1)" tabName="渠道总览" />
          </div>
          <div>
            <TreeMap chartData={pieEchartData} />
            {/* <ProductViewPieEchart chartData={pieEchartData} /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default OverviewTab;
