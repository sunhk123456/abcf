import React, {PureComponent} from 'react';
import {connect} from "dva";
import isEqual from 'lodash/isEqual';  // 分档收入对应的家庭数量占比
import Conditon from '../condition';
import CutPie from '@/components/BuildingView/cutPie';
import styles from './index.less';
import HomeCompareBar from '../homeCompareBar';  // 分档收入对应的家庭数量占比
// import HomeNumTimeLine from '../homeNumTimeLine';
// import HomeCompareLine from '../homeCompareLine';
import TreeMap from '../../Echart/analyseSpecial/treeMap';
import BuildingMap from '@/components/building/buildingMap';
import HomeBasisBarEchart from '../basisBarEchart';
import PriceBar from '../../hotInfoDisplay/terminalPriceBar';
// import { echartsMapJson } from '../../../services/webSocketUrl';

const rosePieColors = [
  "#5CD5E3",
  "#DC69AB",
  "#61ADDD",
  "#DE9462",
  "#91C7AE",
  "#919BC6",
  "#C391C6",
  "#DC6868",
  "#B6DC6B",
  "#D0C862"]

@connect(({homeViewFirstTabModels, homeViewModels,loading}) => ({
  homeViewFirstTabModels,
  homeViewModels,
  loading: loading.models.homeViewFirstTabModels,
}))
class HomeViewFirstTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadData: {}, // 下载参数
      downloadDataTreeMap:{}, // treemap专用
    }
  }

  componentDidMount() {
    // this.initEchart();
    this.getMaxDate();
    this.getMapData();
  }

  componentDidUpdate(prveProps) {
    const {homeViewFirstTabModels:{payloadPrepare,provId,cityId}} = this.props
    if (!isEqual(prveProps.homeViewFirstTabModels.payloadPrepare,payloadPrepare)) {
      this.initEchart();
      this.getMapData();
    }else if(provId !== "" && (!isEqual(prveProps.homeViewFirstTabModels.provId,provId) || !isEqual(prveProps.homeViewFirstTabModels.cityId,cityId))){
      this.initEchart({provId,cityId});
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/clearData`,
    });
  }

  /**
   * @date: 2019/12/27
   * @author 喵帕斯
   * @Description: 新增离网家庭用户地域分布
   * @method getHomeUserBarData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getHomeUserBarData = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/getHomeUserBarData`,
      payload: {...params, chartType: "homeUserBar"},
    });
  };

  /**
   * @date: 2019/12/27
   * @author 喵帕斯
   * @Description: 趸交非趸交地域分布
   * @method getStackBarData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getStackBarData = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/getStackBarData`,
      payload: {...params, chartType: "stackBar"},
    });
  };

  /**
   * @date: 2019/12/13
   * @author 王健
   * @Description: 对比饼图
   * @method getComparePie
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getComparePie = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchHomePies`,
      payload: {...params, chartType: "callNumberCompare"},
    });
  }

  /**
   * @date: 2019/12/16
   * @author 风信子
   * @Description: 方法描述 最大账期
   * @method getMaxDate
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getMaxDate = () =>{
    const {dispatch, homeViewModels:{tabId},homeViewFirstTabModels:{dateType,markType}} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchMaxDate`,
      payload: {
        tabId,
        markType,
        dateType
      }
    });
  }

  // 请求折线图数据
  initLineData = (params, type) => {
    let transType;
    if (type === 'timeLine') {
      transType = 'homeViewFirstTabModels/getLeftLineData'
    } else if (type === 'homeNumCompare') {
      transType = 'homeViewFirstTabModels/getRightLineData'
    }
    const {dispatch} = this.props;
    dispatch({
      type: transType,
      payload: {
        ...params,
        chartType: type
      }
    })
  };


  /**
   * @date: 2019/12/13
   * @author 王健
   * @Description: 消费行为构成饼图
   * @method getPayBehaviorPie
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getPayBehaviorPie = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchHomePies`,
      payload: {...params, chartType: "payBehavior"},
    });
  }

  /**
   * @date: 2019/12/16
   * @author 风信子
   * @Description: 方法描述 分档收入对应的家庭数量占比
   * @method getHomeNumBar
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getHomeNumBar = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchHomeNumBar`,
      payload: {...params, chartType: "bar"},
    });
  }

  /**
   * @date: 2019/12/27
   * @author 风信子
   * @Description: 方法描述 单/宽融合家庭分布 饼图
   * @method getHomeDistribution
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getHomeDistribution = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchHomePies`,
      payload: {...params, chartType: "homeDistribution"},
    });
  }

  /**
   * @date: 2019/12/27
   * @author 风信子
   * @Description: 方法描述 渠道家庭分布
   * @method getHomeDistribution
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getChannelHomeDistribution = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchChannelHomeDistribution`,
      payload: {...params, chartType: "channelHomeDistribution"},
    });
  }

  /**
   * @date: 2019/12/16
   * @author 风信子
   * @Description: 方法描述 分速率家庭数量
   * @method getTreeMapData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  getTreeMapData= (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchTreeMapData`,
      payload: params,
    });
  }

  // 获取家庭数量分布时间趋势图数据
  getHomeNumTimeLineData = (data) => {
    const {dispatch} = this.props;
    const params = {
      chartType: "line",
      ...data
    };
    dispatch({
      type: `homeViewFirstTabModels/getHomeNumTimeLineData`,
      payload: params,
    });
  };

  /**
   * 请求地图上展示数据
   */
  getMapData=()=>{
    const {dispatch, homeViewModels:{tabId},homeViewFirstTabModels:{dateType,markType,date,provId,provName,cityId,cityName,payloadPrepare}} = this.props;
    const {custType,townType} = payloadPrepare;
    dispatch({
      type: 'homeViewFirstTabModels/getMapData',
      payload: {
        custType,
        townType,
        tabId,
        markType,
        dateType,
        date,
        provId,
        provName,
        cityId,
        cityName,
      }
    })
  }

  /**
   * 请求地图数据
   * @param params 地图切换的省分地市参数
   * @constructor
   */
  MapCallback=(params)=>{
    const {dispatch, homeViewModels:{tabId},homeViewFirstTabModels:{dateType,markType,date,payloadPrepare}} = this.props;
    const {custType,townType} = payloadPrepare;
    dispatch({
        type: 'homeViewFirstTabModels/getMapData',
        payload: {
          custType,
          townType,
          tabId,
          markType,
          dateType,
          date,
          provId: params.provId,
          provName:params.provName,
          cityId: params.cityId,
          cityName: params.cityName,
        }
      })
  }

  /**
   * 地图地市切换，不请求地图数据，仅请求地图组件json
   * @param params
   */
  changeMap=(mapName)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'homeViewFirstTabModels/getMap',
      payload: mapName
    })
  }

  /**
   * @date: 2019/12/10
   * @author 风信子
   * @Description:  下方图边总请求入口
   * @method initEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  initEchart(paramsMap = {}) {
    const {homeViewFirstTabModels: {payloadPrepare}} = this.props;
    const defaultParams = {
      ...payloadPrepare
    }
    const params = Object.assign(defaultParams, paramsMap);
    this.getComparePie(params); // 本网/异网通话次数对比
    // this.getHomeNumTimeLineData(params); // 获取家庭数量分布时间趋势图数据
    this.getPayBehaviorPie(params); // 消费行为构成饼图
    // this.initLineData(params, 'timeLine'); // 移网/固网语音使用量及漫游话务量时间趋势
    // this.initLineData(params, 'homeNumCompare'); // 单宽/融合家庭数量对比
    this.getHomeDistribution(params);// 单宽/融合家庭数量对比 饼图
    this.getChannelHomeDistribution(params); // 渠道家庭分布
    this.getHomeNumBar(params); // 分档收入对应的家庭数量占比
    this.getTreeMapData(params); // 分速率家庭数量
    this.downloadPayload();
    this.getStackBarData(params);// 趸交非趸交地域分布
    this.getHomeUserBarData(params);// 新增离网家庭用户地域分布
  }

  // 处理下载条件整理
  downloadPayload() {
    const {homeViewFirstTabModels: {downloadPayload, maxDate,provName,cityName}} = this.props;
    let condition = [];
    if (downloadPayload.length === 0) {
      condition = [
        {name: "账期", value: maxDate},
        {name: "客户类型", value: "全部"},
        {name: "城镇类型", value: "全部"},
        { name:"省分",value:provName },
        { name:"地市",value:cityName },
      ]
    } else {
      condition = [
        ...downloadPayload,
        { name:"省分",value:provName },
        { name:"地市",value:cityName }
      ];

    }
    const downloadDataTreeMap = {
      specialName: "家庭视图",
      condition: [
        ...condition.map((item)=>({key:item.name,value:[item.value]}))
      ]
    };
    const conditionValue = condition.map((item) => [item.name, item.value]);
    const downloadData = {
      specialName: "家庭视图",
      conditionValue
    }
    this.setState({downloadData,downloadDataTreeMap});
  }

  render() {
    const {downloadData,downloadDataTreeMap} = this.state;
    const {homeViewFirstTabModels: {
      callNumberComparePieData,
      // homeNumTimeLineData,
      payBehaviorPieData,
      treeMapData,
      // rightChartData,
      homeDistributionData,
      channelHomeDistributionData,
      // leftChartData,
      homeNumBar,
      provId,
      provName,
      cityId,
      cityName,
      mapData,
      GeoJson,
      stackBarData,
      homeUserBarData,
    },loading} = this.props;

    return (
      <div className={styles.homeView}>
        <div className={styles.conditions}>
          {/* 筛选条件组件 */}
          <Conditon />
        </div>
        <div className={styles.chinaMapAndHomeMemberDiv}>
          <div className={styles.chinaMap}>
            <BuildingMap provId={provId} provName={provName} cityId={cityId} cityName={cityName} mapData={mapData} GeoJson={GeoJson} callback={this.MapCallback} changeMap={this.changeMap} hasButton='0' containId='homeView' />
          </div>
          <div className={styles.homeMember}>
            {callNumberComparePieData &&
            <CutPie
              cutPieData={callNumberComparePieData}
              colors={rosePieColors}
              markType="HOME_SUB_M"
              downloadData={downloadData}
              hasBorder={false}
              hasLegend={false}
              titlePosition="left"
              echartId="conversionContrast"
            />
            }
          </div>
        </div>
        {
          !loading && (
            <div className={styles.timeLineAndRectDiv}>
              {stackBarData.chartX&&stackBarData.chartX.length>0&&
              <div className={styles.timeLine}>
                {/* <HomeNumTimeLine echartId="homeNumTimeLine" chartData={homeNumTimeLineData} color={['#FFA37F', '#FF78A2']} downloadData={downloadData} /> */}
                <HomeBasisBarEchart resize chartData={stackBarData} stack vertical echartId="HomeBasisBarEchart1" color={['#78AED9','#E76E6F']} downloadData={downloadData} />
              </div>
              }
              <div id="homeViewTreeMap" className={styles.rectDiv} style={{width:stackBarData.chartX&&stackBarData.chartX.length>0?"49.5%":"100%"}}>
                <TreeMap
                  chartData={treeMapData}
                  backGroundColor='#F7F8FC'
                  colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
                  downloadData={downloadDataTreeMap}
                  fromHotInfo
                />
              </div>
            </div>
          )
        }
        <div className={styles.twoPiesDiv}>
          <div className={styles.smartHome}>
            {/* <HomeCompareLine */}
            {/*  downloadData={downloadData} */}
            {/*  echartId="timeLine" */}
            {/*  chartData={leftChartData} */}
            {/* /> */}
            <PriceBar
              chartData={channelHomeDistributionData}
              colors={['#6eabdb']}
              downloadData={downloadData}
              echartId="clearLove4396"
              download
            />
          </div>
          <div className={styles.smartType}>
            {/* <HomeCompareLine */}
            {/*  downloadData={downloadData} */}
            {/*  echartId="homeNumCompare" */}
            {/*  chartData={rightChartData} */}
            {/* /> */}
            <CutPie
              cutPieData={homeDistributionData}
              // colors={["#F8636D","#FA8D94","#FCB1B6"]}
              colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
              downloadData={downloadData}
              hasBorder={false}
              markType="HOME_SUB_M"
              hasLegend
              titlePosition="left"
              echartId="homeDistribution"
            />
          </div>
        </div>
        <div className={styles.compareAndTop10Div}>
          <div className={styles.compare}>
            {payBehaviorPieData &&
            <CutPie
              cutPieData={payBehaviorPieData}
              colors={rosePieColors}
              downloadData={downloadData}
              // hasBorder
              markType="HOME_SUB_M"
              hasLegend
              titlePosition="left"
              echartId="behaviorCom"
            />
            }
          </div>
          <div className={styles.top10}>
            <HomeCompareBar
              downloadData={downloadData}
              echartId="homeBar"
              valueToProportion
              chartData={homeNumBar}
            />
          </div>
        </div>
        {homeUserBarData.chartX&&homeUserBarData.chartX.length>0&&
        <div className={styles.areaBarEchart}>
          <HomeBasisBarEchart
            vertical
            chartData={homeUserBarData}
            echartId="HomeBasisBarEchart2"
            color={["#EEB151","#2EABFE"]}
            downloadData={downloadData}
            titlePosition="left"
          />
        </div>
        }
      </div>
    )
  }

}

export default HomeViewFirstTab
