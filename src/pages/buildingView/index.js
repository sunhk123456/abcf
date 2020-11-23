/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/12/9
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import isEqual from 'lodash/isEqual';
import {Tooltip} from "antd";
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import BuildingTable from '../../components/BuildingView/buildingViewTable'; // 表格
import BuildingTop10 from "../../components/building/buildingTop10"; // top10
import NameBrEchart from "../../components/BuildingView/nameBrEchart"; // 柱状图
import RosePie from '@/components/BuildingView/rosePie';
import CutPie from '@/components/BuildingView/cutPie';
import Conditon from '@/components/BuildingView/condition';
import RaiseStock from '@/components/terminalQuery/TypeComparison';
import BuildingViewAreaEchart from '../../components/BuildingView/AreaEchart'; // 地域分布

import styles from './index.less';

import TimeChart from '@/components/ProductView/TimeEchart';
import waSai from "../../components/BuildingView/pic/ganTan.png";


const rosePieColors=[
  "#85abd2",
  "#7D94F2",
  "#8484D2",
  "#AB84D2",
  "#B361E5",
  "#D284D2",
  "#D284AB",
  "#F27D94",
  "#EC9296",
  "#D28484",
  "#E35F65",
  "#D2AB84",
  "#ECE793",
  "#D6E561",
  "#D2D284",
  "#ABD284",
  "#84D284",
  "#61E571",
  "#2BDAD1",
  "#1EA9A2",
  "#84D2D2",
  "#578CC1",
  "#3B6EA0",
  "#1D55AF",
  "#A06E3B",
  "#DD992C",
  "#C18C57",
  "#ECBB93",
  "#E5B262",
  "#F2DB7E",
]

@connect(({ buildingViewModels,proCityModels }) => ({
  buildingViewModels,
  proCityModels,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indexAndName:"", // 选中指标省市提示文字
      productMix:false, // 产品结构（南丁格尔玫瑰图）
      custDistribute: false, // 客户分布（普通饼图）
      raiseStock: false, // 增存量结构
      timeEchart: false, // 时间趋势图
      areaEchart: false, // 地域分布图
      industryDistribute: false, // 行业分布图
      tip:{}, // 表格选中的地市
    }
  }

  componentDidMount() {
    this.getTable();
    this.initEchart();
  }

  componentDidUpdate(prveProps){
    const self=this;
    if(!isEqual(prveProps.buildingViewModels.payloadPrepare,self.props.buildingViewModels.payloadPrepare)){
      this.getTable();
      this.initEchart();
    }
  }

  /**
   * @date: 2019/12/10
   * @author wangjian
   * @Description: 方法描述 请求增量图结构数据
   * @method getRaiseStockData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getRaiseStockData=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchRaiseStock`,
      payload: params,
    });
  }

  /**
   * @date: 2019/12/10
   * @author wangjian
   * @Description: 方法描述 请求全国合计时间趋势图数据
   * @method getTimeEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getTimeEchart(params){
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchTimeEchart`,
      payload: params,
    });
  }

  /**
   * @date: 2019/12/10
   * @author 风信子
   * @Description: 地域分布图
   * @method getAreaEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getAreaEchart(params){
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchAreaEchart`,
      payload: params,
    });
  }

  /**
   * @date: 2019/12/10
   * @author wangjian
   * @Description: 方法描述 客户分布（普通饼图）
   * @method getRaiseStockData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getCutPie=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchCutPie`,
      payload: {...params,type:"custDistribute"},
    });
  }


  /**
   * @date: 2019/12/11
   * @author 风信子
   * @Description: 方法描述 行业分布图
   * @method getIndustryDistribute
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getIndustryDistribute=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchIndustryDistribute`,
      payload: {...params,type:"industryDistribute"},
    });
  }

  /**
   * @date: 2019/12/11
   * @author 风信子
   * @Description: 方法描述 新增合同排名客户
   * @method getNewContractRank
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getNewContractRank=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchNewContractRank`,
      payload: {...params,type:"newContractRank"},
    });
  }

  /**
   * @date: 2019/12/11
   * @author 风信子
   * @Description: 方法描述 出账收入排名客户
   * @method getOutAccount
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getOutAccount=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchOutAccount`,
      payload: {...params,type:"outAccount"},
    });
  }

  /**
   * @date: 2019/12/10
   * @author wangjian
   * @Description: 方法描述 产品结构（玫瑰饼图）
   * @method getRosePie
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getRosePie=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchRosePie`,
      payload: {...params,type:"productMix"},
    });
  }

  /**
   * @date: 2019/12/9
   * @author 风信子
   * @Description: 方法描述 获取表格接口
   * @method getTable
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getTable(num="1", type="",sorterIndex=""){
    const {dispatch,buildingViewModels:{payloadPrepare}} = this.props;
    const {markType,dateType,date,custType,industryType,raiseStockType,provId,cityId} = payloadPrepare;
    const params = {
      markType,
      dateType,
      date,
      custType,
      industryType,
      raiseStockType,
      pageNum:"10",
      num,
      sorter:type,
      provId,
      cityId,
      sorterIndex
    }
    dispatch({
      type: `buildingViewModels/getTableData`,
      payload: params,
    });
  }

  /**
   * @date: 2019/12/10
   * @author 风信子
   * @Description:  下方图边总请求入口
   * @method initEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  initEchart(paramsTable={},tip={}){
    const {dispatch,buildingViewModels:{payloadPrepare}} = this.props;
    const defaultParams = {
      ...payloadPrepare,
      indexId:[],
    }
    const params = Object.assign(defaultParams,paramsTable);
    // tip 显示选中表格展示
    let indexAndName = "";
    if(JSON.stringify(tip) !== "{}"){
      const {name,cityName, proName,thPName} = tip
      indexAndName = `${proName}-${cityName} ${thPName}-${name}`;
    }

    dispatch({
      type: `buildingViewModels/cleanData`,
    });
    this.setState({indexAndName,tip});
    this.echartType(params);
    this.getNewContractRank(params);
    this.getOutAccount(params);
  }

  // 处理下载条件整理
  downloadPayload(tip){
    const {buildingViewModels:{downloadPayload,maxDate},proCityModels:{selectCity, selectPro},} = this.props;
    let condition = [];
    if(downloadPayload.length === 0){
      condition =[
        { name:"省分",value:selectPro.proName },
        { name:"地市",value:selectCity.cityName },
        { name:"账期",value:maxDate },
        { name:"客户类型",value:"全部"},
        { name:"行业类型",value:"全部"},
        { name:"赠存量",value:"全部"},
      ]
    }else{
      condition = [
        { name:"省分",value:tip.proName || selectPro.proName },
        { name:"地市",value:tip.cityName || selectCity.cityName },
        ...downloadPayload
      ];
    }
    const conditionValue = condition.map((item)=>[item.name,item.value]);
    const downloadData = {
      specialName:"政企总览",
      conditionValue
    }
    return downloadData;
  }

  /**
   * @date: 2019/12/11
   * @author 风信子
   * @Description: 图表显示类型判断
   * @method echartType
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  echartType(params){
    const {dispatch} = this.props;
    dispatch({
      type: `buildingViewModels/fetchEchartType`,
      payload: params,
      callback:(res)=>{
        let productMix = false; // 产品结构（南丁格尔玫瑰图）
        let custDistribute = false; // 客户分布（普通饼图）
        let raiseStock = false; // 增存量结构
        let timeEchart = false; // 时间趋势图
        let areaEchart = false;  // 地域分布图
        let industryDistribute = false; // 行业分布
        res.forEach((item)=>{
          const {type} = item;
          if(type === "productMix"){
            this.getRosePie(params);
            productMix = true;
          }else if(type === "custDistribute"){
            this.getCutPie(params);
            custDistribute = true;
          }else if(type === "raiseStock"){
            this.getRaiseStockData(params);
            raiseStock = true;
          }else if(type === "timeEchart"){
            this.getTimeEchart(params);
            timeEchart = true;
          }else if(type === "areaEchart"){
            this.getAreaEchart(params);
            areaEchart = true;
          }else if(type === "industryDistribute"){
            this.getIndustryDistribute(params); // 行业分布图
            industryDistribute = true;
          }
        })
        this.setState({productMix,custDistribute,raiseStock,timeEchart,areaEchart,industryDistribute})
      }
    });
  }

  render() {
    const {buildingViewModels:{
      tableData,
      markType,
      rosePieData,
      raiseStockData,
      timeEchartData,
      cutPieData,
      areaEchartData,
      industryDistributeData,
      newContractRankData,
      outAccountData
    }} = this.props;
    const {indexAndName,productMix,custDistribute,industryDistribute,raiseStock,timeEchart,areaEchart,tip} = this.state;
    const downloadData = this.downloadPayload(tip); // 整理下载参数数据
    return (
      <PageHeaderWrapper>
        <div className={styles.buildingView}>
          <div className={styles.title}>
            政企总览
          </div>
          {/* 筛选条件组件 */}
          <Conditon />
          <div className={styles.table}>
            <div className={styles.tableTop}>
              <span className={styles.iconRed} />
              <span className={styles.tableName}>
                数据情况概览
                <Tooltip
                  title="合同信息:仅合同系统，政企中台客户中心自有合同数据正在整合中"
                  trigger='hover'
                  placement='bottomLeft'
                  overlayClassName={styles.buildingViewToolTip}
                  // defaultVisible
                >
                  <img
                    src={waSai}
                    alt=''
                    className={styles.toolTipImg}
                  />
                </Tooltip>
              </span>
            </div>
            <BuildingTable
              tableData={tableData}
              markType={markType}
              sorter
              openFunction
              refreshMake
              callBackRefreshEchart={(params,callBackTip)=>{this.initEchart(params,callBackTip)}}
              callBackNum={(num, type, kpiId)=>{this.getTable(num, type,kpiId)}}
            />
          </div>
          <div className={styles.selectNameTitle}>
            所选指标：{indexAndName}
          </div>
          <div className={styles.barTopContainer}>
            {timeEchart &&  (
              <div className={styles.barTopDivItem}>
                <div className={styles.bg}>
                  <TimeChart downloadData={downloadData} chartData={timeEchartData} />
                </div>
              </div>
              )
            }
            {areaEchart && (
              <div className={styles.barTopDivItem}>
                <div className={styles.bg}>
                  <BuildingViewAreaEchart
                    downloadData={downloadData}
                    chartData={areaEchartData}
                    sort
                  />
                </div>
              </div>
              )
            }
          </div>

          <div className={styles.PieDivContainer}>
            {productMix && (
              <div className={styles.PieDivItem}>
                <div className={styles.bg}>
                  <RosePie
                    handleMaximum
                    rosePieData={rosePieData}
                    colors={rosePieColors}
                    downloadData={downloadData}
                  />
                </div>
              </div>
              )
            }
            {raiseStock && (
              <div className={styles.PieDivItem}>
                <div className={styles.bg}>
                  <RaiseStock
                    downloadData={downloadData}
                    echartId="RaiseStock12138"
                    isCenter
                    name="增存量结构"
                    color={["#5faddd","#ff7c9e"]}
                    dataList={raiseStockData}
                  />
                </div>
              </div>
              )
            }
            {custDistribute && (
              <div className={styles.PieDivItem}>
                <div className={styles.bg}>
                  <CutPie
                    cutPieData={cutPieData}
                    // colors={rosePieColors}
                    downloadData={downloadData}
                    hasBorder
                    hasLegend
                    titlePosition="center"
                    echartId='buildingViewCutPie'
                  />
                </div>
              </div>
              )
            }
          </div>

          {industryDistribute && (
            <div className={styles.barContainer}>
              <NameBrEchart downloadData={downloadData} chartData={industryDistributeData} />
            </div>
          )
          }

          <div className={styles.topTenContainer}>
            <div className={styles.topTenItem}>
              <BuildingTop10
                echartId='buildingViewTop1'
                downloadData={downloadData}
                download
                chartData={newContractRankData}
                titlePosition="center"
              />
            </div>
            <div className={styles.topTenItem}>
              <BuildingTop10
                echartId='buildingViewTop2'
                downloadData={downloadData}
                download
                chartData={outAccountData}
                titlePosition="center"
              />
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default Index;
