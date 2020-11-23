import React,{PureComponent} from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './index.less';
import HotTop10 from '../../components/hotInfoDisplay/hotTop10';
import TerminalProportion from '../../components/hotInfoDisplay/TerminalProportion';
import TerminalNRChart from '../../components/hotInfoDisplay/terminalNRChart'
import TerminalType from '../../components/hotInfoDisplay/terminalType'
import PriceBar from '../../components/hotInfoDisplay/terminalPriceBar';
import TreeMap from '../../components/Echart/analyseSpecial/treeMap';
import BuildingTop10 from '../../components/building/buildingTop10';
import BarLineEchart from '../../components/hotInfoDisplay/BarLineEchart';
import BuildingMap from '@/components/building/buildingMap';
import Cookie from '@/utils/cookie';
import CollectComponent from '../../components/myCollection/collectComponent';

const {MonthPicker} = DatePicker;

@connect(
  ({hotInfoDisplayModels})=>(
    {
      hotInfoDisplayModels,
      specialName:hotInfoDisplayModels.specialName,
      selectIndex:hotInfoDisplayModels.selectIndex, // 页签
      tabId:hotInfoDisplayModels.tabId,
      date:hotInfoDisplayModels.date,
      maxDate:hotInfoDisplayModels.maxDate,
      dateType:hotInfoDisplayModels.dateType,
      markType:hotInfoDisplayModels.markType,
      provName:hotInfoDisplayModels.provName,
      cityName:hotInfoDisplayModels.cityName,
      provId:hotInfoDisplayModels.provId,
      cityId:hotInfoDisplayModels.cityId,
      titleData:hotInfoDisplayModels.titleData,
      terminalProportion:hotInfoDisplayModels.terminalProportion,
      terminalPriceData:hotInfoDisplayModels.terminalPriceData,
      useTerminalData:hotInfoDisplayModels.useTerminalData,
      terminalBrandData:hotInfoDisplayModels.terminalBrandData,
      terminalSell:hotInfoDisplayModels.terminalSell, // 热门终端销售top10
      terminalRow:hotInfoDisplayModels.terminalRow, // 在用终端排行top10
      terminalIn:hotInfoDisplayModels.terminalIn, // 换机终端流入top10
      terminalOut:hotInfoDisplayModels.terminalOut, // 换机终端流出top10
      netTypeRank:hotInfoDisplayModels.netTypeRank, // 5G在网机型排名TOP10
      terminalOpenTypeRank:hotInfoDisplayModels.terminalOpenTypeRank, // VoLTE终端打开开关机型排名TOP10
      terminalTypeRank:hotInfoDisplayModels.terminalTypeRank, // VoLTE终端未打开机型排名TOP10
      online5GData:hotInfoDisplayModels.online5GData,
      volTETerminalData:hotInfoDisplayModels.volTETerminalData,
      terminalTypeData:hotInfoDisplayModels.terminalTypeData,
      terminalNRData:hotInfoDisplayModels.terminalNRData,
      mapData:hotInfoDisplayModels.mapData,// 地图返回数据
      GeoJson: hotInfoDisplayModels.GeoJson,
    }
  )
)
class HotInfoDisplay extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      indexFlag:'1',// 地图切换的标志，1表示在线终端，2表示新增终端
    };
  }

  componentDidMount() {
    const {tabId} = this.props;
    this.initMap(tabId);
    this.getTitleData();
    this.getMaxDate();
  }

  componentDidUpdate(prevProps) {
    const {date,tabId,selectIndex,provId,cityId} = this.props;
    const self = this;
    if(prevProps.selectIndex!==undefined&&prevProps.date){
      if(prevProps.selectIndex!==selectIndex){
        this.initMap(tabId);
        self.setState({indexFlag:'1'})
      }else if(!isEqual(date,prevProps.date)&&prevProps.date!==''){
        const {indexFlag} = this.state;
        this.getMapData(indexFlag)
      }
    }
    // 切换页签调用接口
    if(!isEqual(selectIndex,prevProps.selectIndex)){
        this.getMaxDate();
      }

    // 日期改变调用接口
      if(prevProps.date&&!isEqual(date,prevProps.date)){
        if(selectIndex===0){
          this.initRequestFirstTab()
        }else if(selectIndex===1){
          this.initRequestSecondTab()
        }
      }

    // 省份，地市改变调用接口
      if(!isEqual(provId,prevProps.provId)||!isEqual(cityId,prevProps.cityId)){
        if(selectIndex===0){
          this.initRequestFirstTab()
        }else if(selectIndex===1){
          this.initRequestSecondTab()
        }
      }
  }

  // 请求第一个页签5G和volte终端下图表
  initRequestFirstTab = () => {
    console.log("请求第一个页签联通终端下图表");
    this.getTerminalTypeData(); // 请求5G终端类型分布饼图数据
    this.getTerminalNRData(); // 请求5G终端NR登网情况饼图数据
    this.getTerminalBrand(); // 请求5G终端品牌分布矩形树图数据
    this.getNetTypeRankData(); // 5G在网机型排名TO
    this.getTerminalOpenTypeRankData();// VoLTE终端打开开关机型排名TOP10
    this.getTerminalTypeRankData(); // VoLTE终端未打开机型排名TOP10
    this.getTerminalNRData();  // 请求5G终端NR登网情况饼图数据
    this.getTerminalTypeData(); // 请求5G终端类型分布饼图数据
    this.getOnline5GData(); // 请求5G终端数量占比图数据
    this.getVolTETerminalData(); // 请求VoLTE终端相关信息图数据
  };

  // 请求第二个页签联通终端下图表
  initRequestSecondTab=()=>{
    console.log("请求第二个页签联通终端下图表");
    this.getTerminalProportion(); // 获取联通终端-双卡终端卡槽占比数据
    this.getTerminalSellData(); // 热门终端销售top10
    this.getTerminalRowData(); // 在用终端排行top10
    this.getTerminalOutData();// 换机终端流入top10
    this.getTerminalInData(); // 换机终端流出top10
    this.getTerminalPriceBar(); // 终端采购价格分布柱状图
    this.getUseTerminal(); // 请求在用终端品牌占比矩形树图数据
  };

  setTable=(index,item)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `hotInfoDisplayModels/setTabIdAndDate`,
      payload: {
        selectIndex:index,
        tabId:item.id,
        date:"",
      },
    });
  };

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { maxDate } = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  // 日期控件日期改变触发函数
  onChangeDate=(date, dateString)=>{
    const { dispatch} = this.props;
    dispatch({
      type: `hotInfoDisplayModels/setDate`,
      payload: {date:dateString},
    });
  };

  // 获取最大账期数据
  getMaxDate=()=>{
    const { dispatch,markType,dateType,tabId  } = this.props;
    const params = {
      tabId,
      markType,
      dateType
    };
    dispatch({
      type: `hotInfoDisplayModels/getMaxDate`,
      payload: params,
    });
  };

  // 获取页签数据
  getTitleData=()=>{
    const { dispatch,markType,dateType} = this.props;
    const params={
      markType,
      dateType,
    };
    dispatch({
      type: `hotInfoDisplayModels/getTitleData`,
      payload: params,
    });
  };

  // 获取联通终端-双卡终端卡槽占比数据
  getTerminalProportion=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params = {
      markType,
      dateType,
      tabId,
      cityId,
      provId,
      date,
      chartType:'terminalCard',
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalProportion`,
      payload: params,
    });
  };

  // 热门终端销售top10
  getTerminalSellData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalSell",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalSellData`,
      payload: params,
    });
  };

  // 在用终端排行top10
  getTerminalRowData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalRow",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalRowData`,
      payload: params,
    });
  };

  // 换机终端流入top10
  getTerminalInData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalIn",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalInData`,
      payload: params,
    });
  };

  // 换机终端流出top10
  getTerminalOutData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalOut",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalOutData`,
      payload: params,
    });
  };

  // 5G在网机型排名TOP10
  getNetTypeRankData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"netTypeRank",
    };
    dispatch({
      type: `hotInfoDisplayModels/getNetTypeRankData`,
      payload: params,
    });
  };

  // VoLTE终端打开开关机型排名TOP10
  getTerminalOpenTypeRankData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalOpenTypeRank",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalOpenTypeRankData`,
      payload: params,
    });
  };

  // VoLTE终端未打开机型排名TOP10
  getTerminalTypeRankData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      "chartType":"terminalTypeRank",
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalTypeRankData`,
      payload: params,
    });
  };

  /**
     * 请求在用终端品牌占比矩形树图数据
     * @param
     * @returns {XML}
     */
  getUseTerminal=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:'useTerminal'
    };
    dispatch({
      type: `hotInfoDisplayModels/getUseTerminal`,
      payload: params,
    });
  };

  /**
   * 请求5G终端品牌分布矩形树图数据
   * @param
   * @returns {XML}
   */
  getTerminalBrand=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
     tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:'terminalBrand'
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalBrand`,
      payload: params,
    });
  };

  /**
   * 请求终端采购价格柱状图数据
   * @param
   * @returns {XML}
   */
  getTerminalPriceBar=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      "tabId": tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:'terminalPrice'
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalPriceBar`,
      payload: params,
    });
  };

  /**
   * 请求5G终端NR登网情况饼图数据
   * @param
   * @returns {XML}
   */
  getTerminalNRData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:'terminalNR'
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalNRData`,
      payload: params,
    });
  };

  /**
   * 请求5G终端类型分布饼图数据
   * @param
   * @returns {XML}
   */
  getTerminalTypeData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:'terminalType'
    };
    dispatch({
      type: `hotInfoDisplayModels/getTerminalTypeData`,
      payload: params,
    });
  };

  /**
   * 请求5G终端数量占比图数据
   * @param
   * @returns {XML}
   */
  getOnline5GData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:"terminalProportion",
    };
    dispatch({
      type: `hotInfoDisplayModels/getOnline5GData`,
      payload: params,
    });
  };

  /**
   * 请求VoLTE终端相关信息图数据
   * @param
   * @returns {XML}
   */
  getVolTETerminalData=()=>{
    const { dispatch,markType,dateType,cityId,provId,date,tabId } = this.props;
    const params={
      tabId,
      markType,
      dateType,
      cityId,
      provId,
      date,
      chartType:"terminalMessage",
    };
    dispatch({
      type: `hotInfoDisplayModels/getVolTETerminalData`,
      payload: params,
    });
  };


  /**
   * 请求地图数据
   * @param params 地图切换的省分地市参数
   * @constructor
   */
  initMap=(tabId)=>{
    const {provOrCityId,provOrCityName,power} = Cookie.getCookie('loginStatus');
    const {markType,dateType,date,dispatch} = this.props;
    // 初始化时请求地图数据放到model中
    if(power==='city'){
      dispatch({
        type:'hotInfoDisplayModels/getMapData',
        payload:{
          moduleId:tabId,
          changeIndex:'1',
          markType,
          dateType,
          date,
          provId:'',
          provName:'',
          cityId:provOrCityId,
          cityName:provOrCityName,
        }
      })
    }else {
      dispatch({
        type: 'hotInfoDisplayModels/getMapData',
        payload: {
          moduleId:tabId,
          changeIndex:'1',
          markType,
          dateType,
          date,
          provId: provOrCityId,
          provName: provOrCityName,
          cityId: '',
          cityName: '',
        }
      })
    }
  };

  getMapData=(changeIndex)=>{
    const { markType, dateType, date, dispatch,provId,provName,cityId,cityName,tabId} = this.props;
    dispatch({
      type: 'hotInfoDisplayModels/getMapData',
      payload: {
        moduleId:tabId,
        changeIndex,
        markType,
        dateType,
        date,
        provId,
        provName,
        cityId,
        cityName,
      }
    })
  };

  /**
   * 请求地图数据
   * @param params 地图切换的省分地市参数
   * @constructor
   */
  MapCallback=(params)=>{
    const {indexFlag} = this.state;
    const { markType, dateType, date, dispatch,tabId} = this.props;
      dispatch({
        type: 'hotInfoDisplayModels/getMapData',
        payload: {
          moduleId:tabId,
          changeIndex:indexFlag,
          markType,
          dateType,
          date,
          provId: params.provId,
          provName:params.provName,
          cityId: params.cityId,
          cityName: params.cityName,
        }
      })
  };

  /**
   * 请求地图
   * @param params
   */
  changeMap=(mapName)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'hotInfoDisplayModels/getMap',
      payload: mapName
    })
  }

  /**
   * 地图中指标切换触发事件
   * @param params
   */
  changeIndex=()=>{
    const {indexFlag} = this.state;
    const changeIndex=(indexFlag==="1")?"2":"1";
    this.getMapData(changeIndex);
    this.setState({indexFlag:changeIndex})
  };


  render(){
    const {GeoJson,dateType,terminalProportion,date,titleData,terminalPriceData,useTerminalData,terminalBrandData,selectIndex,provName,cityName,specialName,online5GData,volTETerminalData,provId,cityId,mapData,terminalTypeData,terminalNRData,markType}=this.props;
    const {titleName,list}=titleData;
    const downloadData={
      specialName,
      conditionValue: [
        ["筛选条件："],
        ["省份",provName],
        ["地市",cityName],
        ["日期",date]
      ]};
    const downloadDataTreeMap={
      specialName,
      condition: [
        {key:'省份',value:[provName]},
        {key:'地市',value:[cityName]},
        {key:'日期',value:[date]},
      ]};
    let tab=null;
    if(list){
       tab=list.map((item,index)=>
        (<div key={item.id} className={selectIndex===index?styles.active:styles.tableItem} onClick={()=>this.setTable(index,item)}>{item.name}</div>)
      );
    }
    const triangle = <i className={styles.dateTriangle} />;
    const dateComponent = dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.onChangeDate} suffixIcon={triangle} />
      :<MonthPicker value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.onChangeDate} suffixIcon={triangle} />;
    const {terminalSell,terminalRow,terminalIn,terminalOut,netTypeRank,terminalOpenTypeRank,terminalTypeRank}=this.props;
    const collectStyle ={
      marginLeft:'1%',
	  marginBottom:'10px',
    };
	return (
      <PageHeaderWrapper>
        <div className={styles.page}>
		  <span>
		    <span className={styles.titleName}>{titleName}</span>
		    <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
		  </span>
          <div className={styles.content}>
            <div className={styles.table}>
              {tab}
            </div>
          </div>
          <div className={styles.main}>
            {
              selectIndex === 0 &&
              <div className={styles.volteTerminal}>
                <div className={styles.header}>
                  <div className={styles.date}>
                    <span className={styles.dateTitle}>日期:</span>&nbsp;&nbsp;
                    {dateComponent}
                  </div>
                </div>
                <div className={styles.mapLine}>
                  <div className={styles.mapWrapper}>
                    <BuildingMap provId={provId} provName={provName} cityId={cityId} cityName={cityName} mapData={mapData} GeoJson={GeoJson} callback={this.MapCallback} changeMap={this.changeMap} hasButton='0' changeIndex={this.changeIndex} containId='hotinfo1' />
                  </div>
                  <div className={styles.pieWrapper}>
                    <TerminalType
                      chartData={terminalTypeData}
                      echartId="terminalType"
                      downloadData={downloadData}
                      color={[
                        "#5CD5E3",
                        "#DC69AB",
                        "#61ADDD",
                        "#DE9462",
                        "#91C7AE",
                        "#919BC6",
                        "#C391C6",
                        "#DC6868",
                        "#B6DC6B",
                        "#D0C862"]}
                    />
                  </div>
                </div>
                <div className={styles.barEchart}>
                  <BarLineEchart echartId="online5G" single downloadData={downloadData} chartData={online5GData} color={["#F9A3A8","#EFB55B"]} />
                </div>
                <div className={styles.treeEchart}>
                  <div className={styles.treeEchartItem}>
                    <TerminalNRChart chartData={terminalNRData} echartId="terminalNR" downloadData={downloadData} color={["#F8636D","#FA8D94","#FCB1B6"]} />
                  </div>
                  <div className={styles.treeEchartItem}>
                    <TreeMap
                      chartData={terminalBrandData}
                      backGroundColor='#F7F8FC'
                      colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
                      downloadData={downloadDataTreeMap}
                      fromHotInfo
                    />
                  </div>
                </div>
                <div className={styles.topEchartThree}>
                  <div className={styles.topEchartThreeItem}>
                    <BuildingTop10 chartData={netTypeRank} download downloadData={downloadData} echartId='netTypeRank' />
                  </div>
                  <div className={styles.topEchartThreeItem}>
                    <BuildingTop10 chartData={terminalOpenTypeRank} addRedMark download downloadData={downloadData} echartId='terminalOpenTypeRank' />
                  </div>
                  <div className={styles.topEchartThreeItem}>
                    <BuildingTop10 chartData={terminalTypeRank} addRedMark download downloadData={downloadData} echartId='terminalTypeRank' />
                  </div>
                </div>
                {volTETerminalData&&volTETerminalData.chartX&&volTETerminalData.chartX.length>0&&
                  <div className={styles.barEchart}>
                    <BarLineEchart echartId="volTETerminal" addRedMark vertical double downloadData={downloadData} chartData={volTETerminalData} color={["#43BBEA","#EEB151","#2EABFE"]} />
                  </div>
                }
              </div>
            }
            {
              selectIndex === 1 &&
              <div className={styles.unicomTerminal}>
                <div className={styles.header}>
                  <div className={styles.date}>
                    <span className={styles.dateTitle}>日期:</span>&nbsp;&nbsp;
                    {dateComponent}
                  </div>
                </div>
                <div className={styles.mapLine}>
                  <div className={styles.mapWrapper}>
                    <BuildingMap provId={provId} provName={provName} cityId={cityId} cityName={cityName} mapData={mapData} GeoJson={GeoJson} callback={this.MapCallback} changeMap={this.changeMap} hasButton='0' changeIndex={this.changeIndex} containId='hotinfo2' />
                  </div>
                  <div className={styles.pieWrapper}>
                    <TerminalProportion dataList={terminalProportion} addRedMark download downloadData={downloadData} echartId='terminalProportion' />
                  </div>
                </div>
                <div className={styles.topEchart}>
                  <div className={styles.topEchartItem}>
                    <HotTop10 chartData={terminalSell} download downloadData={downloadData} echartId='terminalSell' />
                  </div>
                  <div className={styles.topEchartItem}>
                    <HotTop10 chartData={terminalRow} download downloadData={downloadData} echartId='terminalRow' />
                  </div>
                </div>
                <div className={styles.topEchart}>
                  <div className={styles.topEchartItem}>
                    <HotTop10 chartData={terminalIn} download downloadData={downloadData} echartId='terminalIn' />
                  </div>
                  <div className={styles.topEchartItem}>
                    <HotTop10 chartData={terminalOut} download downloadData={downloadData} echartId='terminalOut' />
                  </div>
                </div>
                <div className={styles.treeEchart}>
                  <div className={styles.treeEchartItem}>
                    {/* 终端采购价格分布 */}
                    <PriceBar
                      chartData={terminalPriceData}
                      colors={['#6eabdb']}
                      downloadData={downloadData}
                      echartId="clearLove4396"
                      xNamelineFeed
                      download
                    />
                  </div>
                  <div className={styles.treeEchartItem}>
                    <TreeMap
                      chartData={useTerminalData}
                      backGroundColor='#F7F8FC'
                      colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
                      downloadData={downloadDataTreeMap}
                      fromHotInfo
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default HotInfoDisplay
