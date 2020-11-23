import React,{ PureComponent } from 'react';
import { DatePicker } from 'antd';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import BuildingTable from '../../components/building/table';
import BuildingPopup from '../../components/building/buildingPopup';
import BuildBarEchart from '../../components/building/barEchart';
import FunnelEchart from '../../components/building/funnelPlot';
import TotalData from '../../components/building/totalData';
import BuildingTop10 from '../../components/building/buildingTop10';
import BuildingMap from '../../components/building/buildingMap';
import styles from './index.less'
import ArcgisMap from '../../components/building/arcgisMap';
import FontSizeEchart from '../../components/ProductView/fontSizeEchart';
import CollectComponent from '../../components/myCollection/collectComponent';

const {MonthPicker} = DatePicker;


@connect(
  ({
     buildingModels,
   }) => ({
    buildingModels,
    markType:buildingModels.markType,
    dateType:buildingModels.dateType,
    provName:buildingModels.provName,
    cityName:buildingModels.cityName,
    provId:buildingModels.provId,
    cityId:buildingModels.cityId,
    specialName:buildingModels.specialName,
    maxDate:buildingModels.maxDate,
    date:buildingModels.date,
    tableData:buildingModels.tableData, // 表格数据
    barEchartData:buildingModels.barEchartData,  // 新增用户与收入时间趋势数据
    houseIncome:buildingModels.houseIncome, // 楼宇总收入top10
    newUser:buildingModels.newUser, // 新增用户 top10
    newIncome:buildingModels.newIncome, // 新增收入 top10
    totalData:buildingModels.totalData,
    mapData:buildingModels.mapData,// 地图数据
    GeoJson: buildingModels.GeoJson,// 地图轮廓数据
  })
)
class Building extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      showPopup: false, // 弹出显示
      popData:{}, // 弹窗数据
      popType:"noPop", // 弹出层类型判断  notPop 啥都不弹出  table仅弹出表格，top10AndTable弹出表格和top10
      changeMap:false, // 切换gis
    };
  }

  componentDidMount() {
    this.getMapData();
    this.getMaxDate();
    this.initRequest();
    this.getTableData();
  }

  componentDidUpdate(prevProps) {
    const {date,provId,cityId}=this.props;
    const that = this;
    if(prevProps.date){
      if(!isEqual(date,prevProps.date)||!isEqual(provId,prevProps.provId)||!isEqual(cityId,prevProps.cityId)){
        this.initRequest();
      }
      if(!isEqual(date,prevProps.date)&&prevProps.date!==''){
        this.getTableData();
        this.getMapData();
      }
    }
    if(cityId && !isEqual(cityId, prevProps.cityId)){
      if(cityId === 'V0370200'){
        that.setState({
          changeMap:true,
        })
      }
      if(cityId === '-1'){
        that.setState({
          changeMap:false,
        })
      }
    }
  }

  initRequest=()=>{
    this.getHouseIncomeData();
    this.getNewUserData();
    this.getNewIncomeData();
    this.getBarEchartData();
    this.getFunnelData();
    this.getTotalData();
  };

  getMaxDate=()=>{
    const { dispatch,markType,dateType  } = this.props;
    const params = {
      markType,
      dateType
    };
    dispatch({
      type: `buildingModels/getMaxDate`,
      payload: params,
    });
  };

  getHouseIncomeData=()=>{
    const { dispatch,markType,dateType,date,provId,cityId } = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"houseIncome"
    };
    dispatch({
      type: `buildingModels/getHouseIncomeData`,
      payload: params,
    });
  };

  getNewUserData=()=>{
    const { dispatch,markType,dateType,date,provId,cityId } = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"newUser"
    };
    dispatch({
      type: `buildingModels/getNewUserData`,
      payload: params,
    });
  };

  getNewIncomeData=()=>{
    const { dispatch,markType,dateType,date,provId,cityId } = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"newIncome"
    };
    dispatch({
      type: `buildingModels/getNewIncomeData`,
      payload: params,
    });
  };

  getBarEchartData=()=>{
    const { dispatch,markType,dateType,date,provId,cityId } = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
    };
    dispatch({
      type: `buildingModels/getBarEchartData`,
      payload: params,
    });
  };

  getTableData=()=>{
    const { dispatch,markType,dateType,date,provId,cityId } = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
    };
    dispatch({
      type: `buildingModels/getTableData`,
      payload: params,
    });
  };

  getFunnelData=()=>{
    const {dispatch,buildingModels:{date,dateType,markType,provId,cityId}} = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId
    };
    dispatch({
      type: `buildingModels/getFunnelEcharts`,
      payload: params,
    });
  };

  getTotalData=()=>{
    const {dispatch,buildingModels:{date,dateType,markType,provId,cityId}} = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId
    };
    dispatch({
      type: `buildingModels/getTotalData`,
      payload: params,
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
    const { dispatch, provId,cityId} = this.props;
    if(!(provId==="017"&&cityId==="V0370200")){ // 山东青岛市无法选择重设设置日期
      dispatch({
        type: `buildingModels/setDate`,
        payload: {date:dateString},
      });
    }
  };

  /**
   * @date: 2019/12/3
   * @author 喵帕斯
   * @Description: 表格点击回调
   * @method tableCallback
   * @param event  参数描述：点击的元素
   * @param record 参数描述：点击行信息
   */
  tableCallback=(event,record)=>{
    console.log(record);
    const {provName,provId,cityId,cityName,popType} = record;
    const popData = {
      provName,
      provId,
      cityId,
      cityName,
      popType
    }
    this.setState({popData,popType})
    this.popupShow(true)
  };

  /**
   * 请求地图上展示数据
   */
  getMapData=()=>{
    const { markType, dateType, date, dispatch,provId,provName,cityId,cityName} = this.props;
    dispatch({
      type: 'buildingModels/getMapData',
      payload: {
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
    const { markType, dateType, date, dispatch} = this.props;
    if(params.cityId!=='V0370200'){
      dispatch({
        type: 'buildingModels/getMapData',
        payload: {
          markType,
          dateType,
          date,
          provId: params.provId,
          provName:params.provName,
          cityId: params.cityId,
          cityName: params.cityName,
        }
      })
    }else {
      dispatch({
        type: 'buildingModels/changeCity',
        payload: {
          provId:'017',
          provName:'山东',
          cityId:'V0370200',
          cityName:'青岛市',
        }
      })
      // if(JSON.stringify(params))
    }
  }

  /**
   * 地图地市切换，不请求地图数据，仅请求地图组件json
   * @param params
   */
  changeMap=(mapName)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'buildingModels/getMap',
      payload: mapName
    })
  }

  changeIndex=(params)=>{
    console.log(params)
  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 处理弹出的状态
   * @method popupShow
   * @param type
   */
  popupShow(type){
    this.setState({showPopup:type})
  }

  render() {
    const {markType,specialName,provName,cityName,provId,cityId,date,tableData,barEchartData,dateType,houseIncome,newUser,newIncome,totalData,mapData,GeoJson}=this.props;
    const {showPopup,popData,popType,changeMap,}=this.state;
    const triangle = <i className={styles.dateTriangle} />;
    const dateComponent = dateType==='1'?
      <DatePicker
        allowClear={false}
        showToday={false}
        value={moment(date, 'YYYY-MM-DD')}
        disabledDate={this.disabledDate}
        onChange={this.onChangeDate}
        suffixIcon={triangle}
      />
      :<MonthPicker
        value={moment(date, 'YYYY-MM')}
        allowClear={false}
        disabledDate={this.disabledDate}
        onChange={this.onChangeDate}
        suffixIcon={triangle}
      />;
    const mapDisplay = changeMap?<ArcgisMap /> :null;
    const downloadData={
      specialName,
      conditionValue: [
        ["筛选条件："],
        ["省份",provName],
        ["地市",cityName],
        ["日期",date]
      ]
    };
    const fontsize = FontSizeEchart();
    const { titleSize } = fontsize;
	const collectStyle ={
      marginLeft:'1%'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.title} style={{fontSize:`${titleSize}px`}}>
            政企楼宇转交情况
			<CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
            <span className={styles.date}>
              <span className={styles.dateTitle}>日期:</span>&nbsp;&nbsp;
              {dateComponent}
            </span>
          </div>
          <div className={styles.echartsContain}>
            <div className={styles.largeOne} style={changeMap?{display:'none'}:null}>
              <BuildingMap changeColor="1" provId={provId} provName={provName} cityId={cityId} cityName={cityName} mapData={mapData} GeoJson={GeoJson} callback={this.MapCallback} changeMap={this.changeMap} hasButton='0' changeIndex={this.changeIndex} containId='building' />
            </div>
            <div className={styles.largeOne} style={changeMap?null:{display:'none'}}>
              {mapDisplay}
            </div>
            <div className={styles.littleOne}>
              <FunnelEchart />
            </div>
          </div>
          <div className={styles.totalArea}>
            <TotalData totalData={totalData} />
          </div>
          <div className={styles.threeContent}>
            <div className={styles.threeContentItem}>
              <BuildingTop10
                download
                echartId='buildingTop1'
                specialName={specialName}
                provName={provName}
                cityName={cityName}
                date={date}
                chartData={houseIncome}
              />
            </div>
            <div className={styles.threeContentItem}>
              <BuildingTop10
                download
                echartId='buildingTop2'
                specialName={specialName}
                provName={provName}
                cityName={cityName}
                date={date}
                chartData={newUser}
              />
            </div>
            <div className={styles.threeContentItem}>
              <BuildingTop10
                download
                echartId='buildingTop3'
                specialName={specialName}
                provName={provName}
                cityName={cityName}
                date={date}
                chartData={newIncome}
              />
            </div>
          </div>
          <div className={styles.barEchart}>
            <BuildBarEchart chartData={barEchartData} download downloadData={downloadData} />
          </div>
          <div className={styles.table}>
            <BuildingTable
              specialName={specialName}
              provName={provName}
              cityName={cityName}
              date={date}
              tableData={tableData}
              callback={this.tableCallback}
            />
          </div>
        </div>
        {showPopup && popType !== "notPop" && <BuildingPopup popData={popData} callBackClose={()=>this.popupShow(false)} />}
      </PageHeaderWrapper>
    )
  }
}

export default Building;
