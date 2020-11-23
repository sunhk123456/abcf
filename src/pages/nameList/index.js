/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  名单制客户收入分析专题页面</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/25
 */

import React from 'react';
import { connect } from 'dva';
import BuildingMap from '@/components/building/buildingMap';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import HeadList from '../../components/NameList/headList';
import SearchCondition from '../../components/NameList/searchCondition'
import styles from './index.less';
import NameListLineChart from '../../components/NameList/lineChart';
import NameListButton from '../../components/NameList/nameListButton';
import PieAndTable from '@/components/NameList/pieAndTable'; // 业务产品 (饼图和表格)
import NameListPie from '../../components/NameList/nameListPie';
import NameListPopup from '../../components/NameList/popup/nameListPop';

@connect(({nameListModels})=>({
  specialName:nameListModels.specialName,
  GeoJson:nameListModels.GeoJson,
  cityId:nameListModels.cityId, // 地图的市id
  provId:nameListModels.provId, // 地图的省id
  provName:nameListModels.provName, //  地图的 省name
  cityName:nameListModels.cityName, // 地图的 市name
  mapData:nameListModels.mapData,
  totalMapData:nameListModels.totalMapData,
  selectIndexMap:nameListModels.selectIndexMap,
  totalLineChartData:nameListModels.totalLineChartData,
  selectIndexLineChart:nameListModels.selectIndexLineChart,
  lineChartData:nameListModels.lineChartData,
  pieData:nameListModels.pieData,
  headData:nameListModels.headData,
  maxDate:nameListModels.maxDate,
  conditionData:nameListModels.conditionData
}))
class NameList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      popupVisible:false
    };
  }

  componentDidMount() {
    this.getMapData();
    this.getLineChartData();
    this.getHeadData();
    this.getConditionData();
    this.getPieData();
  }

  //  请求头部列表数据
  getHeadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `nameListModels/getHeaderData`,
      payload: {
        markType: '',
        date: '',
        dateType: '2'
      }
    });
  };

  //  请求筛选条件数据
  getConditionData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `nameListModels/getCondition`,
      payload: {
        markType: '',
        dateType: '2'
      }
    });
    dispatch({
      type: `nameListModels/getMaxDate`,
      payload: {
        markType: '',
        dateType: '2'
      },
    });
  };

  // 请求折线图数据
  getPieData=()=>{
    const {dispatch, provId,provName,cityId,cityName} = this.props;

    dispatch({
      type: 'nameListModels/getPieData',
      payload: {
        provId,
        provName,
        cityId,
        cityName,
      }
    })
  };

  // 请求折线图数据
  getLineChartData=()=>{
    const {dispatch, provId,provName,cityId,cityName} = this.props;
    
    dispatch({
      type: 'nameListModels/getLineChartData',
      payload: {
        provId,
        provName,
        cityId,
        cityName,
      }
    })
  };
  
  /**
   * 请求地图上展示数据
   */
  getMapData=()=>{
    const {dispatch, provId,provName,cityId,cityName} = this.props;
   
    dispatch({
      type: 'nameListModels/getMapData',
      payload: {
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
    console.log("地图组件回调");
    console.log(params);
    // 请求地图数据
    const {dispatch} = this.props;
    dispatch({
      type: 'nameListModels/getMapData',
      payload: {
        provId: params.provId,
        provName:params.provName,
        cityId: params.cityId,
        cityName: params.cityName,
      }
    });
    // 设置省份地市
    dispatch({
      type: 'nameListModels/changeCity',
      payload: {
        provId: params.provId,
        provName:params.provName,
        cityId: params.cityId,
        cityName: params.cityName,
      }
    })
  };
  
  /**
   * 地图地市切换，不请求地图数据，仅请求地图组件json
   * @param params
   */
  changeMap=(mapName)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'nameListModels/getMap',
      payload: mapName
    })
  };
  
  // 地图右上角金额同比切换按钮被点击
  buttonClicked=(item)=>{
    const {dispatch} = this.props;
    // 切换按钮
    dispatch({
      type: 'nameListModels/setSelectIndexMap',
      payload: item.id
    });
    // 切换地图数据
    dispatch({
      type: 'nameListModels/switchMap',
      payload: item.mapData
    });
  };
  
  lineChartCallback=(item)=>{
    const {dispatch} = this.props;
    // 切换按钮
    dispatch({
      type: 'nameListModels/setSelectIndexLineChart',
      payload: item.id
    });
    // 切换地图数据
    dispatch({
      type: 'nameListModels/switchLineChart',
      payload: item.chartData
    });
  };

  //  点击搜搜
  onSearch = values => {
    console.log(values);
  };
  
  closePopup=(boolean)=>{
    this.setState({
      popupVisible:boolean || false
    })
  };
  
  nameListPieCallback=()=>{
    this.closePopup(true)
  };

  render() {
    const {  maxDate, conditionData}=this.props;
    const {GeoJson,provId,provName,cityId,cityName,mapData,totalMapData,selectIndexMap,headData,specialName} = this.props;
    const {lineChartData,selectIndexLineChart,totalLineChartData}=this.props;
    const {pieData}=this.props;
    const {popupVisible}=this.state;
    return (
      <PageHeaderWrapper>
        {popupVisible &&<NameListPopup visible={popupVisible} close={this.closePopup} />}
        <div className={styles.nameList}>
          <div className={styles.specialName}>{specialName}</div>
          <div className={styles.header}>{headData.length && <HeadList data={headData} />}</div>
          <div className={styles.condition}>
            <SearchCondition
              maxDate={maxDate}
              data={conditionData}
              onSearch={values => {this.onSearch(values)}}
            />
          </div>
          <div className={styles.firstRow}>
            <div className={styles.mapWrapper}>
              <div className={styles.buttonWrapper}>
                <NameListButton arrayData={totalMapData} selectIndex={selectIndexMap} callback={this.buttonClicked} />
              </div>
              <BuildingMap provId={provId} provName={provName} cityId={cityId} cityName={cityName} mapData={mapData} GeoJson={GeoJson} callback={this.MapCallback} changeMap={this.changeMap} hasButton='0' containId='nameList' />
            </div>
            <div className={styles.incomePie}>
              <NameListPie
                callback={this.nameListPieCallback}
                echartId="nameListPieIncome"
                chartData={pieData}
                colors={[
                  "#73b7e4",
                  "#84def5",
                  "#6ddae9",
                  "#b1d9c6",
                  "#fbe390",
                  "#e9af71",
                  "#d19e85",
                  "#fa8787",
                  "#e27bb8",
                  "#d79af1"
                ]}
                hasBorder={false}
                hasLegend
                titlePosition="left"
              />
            </div>
          </div>
          <div className={styles.secondRow}>
            <div className={styles.lineChart}>
              <div className={styles.lineChartButtonWrapper}>
                <NameListButton arrayData={totalLineChartData} selectIndex={selectIndexLineChart} callback={this.lineChartCallback} />
              </div>
              <NameListLineChart chartData={lineChartData} />
            </div>
            <div className={styles.pieChart}>
              <PieAndTable />
            </div>
          </div>

        </div>
      </PageHeaderWrapper>
    );
  }
}

export default NameList;
