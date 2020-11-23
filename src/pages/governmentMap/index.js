import React,{PureComponent} from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './index.less';
import SearchTop from '../../components/GovernmentMap/searchTop';
import BuildingMap from '../../components/building/buildingMap';
// import { echartsMapJson } from '@/services/webSocketUrl';

@connect(
  ({
     governMapModels,
   }) => ({
    governMapModels,
    markType:governMapModels.markType,
    dateType:governMapModels.dateType,
    provName:governMapModels.provName,
    cityName:governMapModels.cityName,
    provId:governMapModels.provId,
    cityId:governMapModels.cityId,
    date:governMapModels.date,
    mapData:governMapModels.mapData,// 地图数据
    indexId:governMapModels.indexId,
    GeoJson:governMapModels.GeoJson,
    title:governMapModels.title,
  })
)
class GovernmentMap extends PureComponent{
    constructor(props){
        super(props);
        this.state={
          checkedDate:'', // 暂存日期数据
          checkedId:'',  // 暂存指标id数据
          firstLoad:true, // 是否是页面首次加载
        };
    };


  componentDidUpdate(prevProps) {
    const {governMapModels:{searchCheck,date,indexId}}=this.props;
    const {firstLoad} = this.state;
    const that = this;
    // 请求最大账期返回数据且为首次加载，获取数据暂存到state中
    if(!isEqual(date,prevProps.governMapModels.date)&& firstLoad ){
      that.setState({
        firstLoad:false,
        checkedDate:date,
        checkedId:indexId,
      })
    }
    // 当查询按钮点击时，重新获取数据到state暂存空间
    if(!isEqual(searchCheck,prevProps.governMapModels.searchCheck)){
      that.setState({
        checkedDate:date,
        checkedId:indexId,
      })
    }
  }

  /**
   * 请求地图数据
   * @param params 地图切换的省分地市参数
   * @constructor
   */
  MapCallback=(params)=>{
    const { markType, dateType, dispatch} = this.props;
    // 使用state内的指标Id和账期数据进行查询
    const { checkedDate,checkedId } = this.state;
      dispatch({
        type: 'governMapModels/getMapData',
        payload: {
          indexId:checkedId,
          markType,
          dateType,
          date:checkedDate,
          provId: params.provId,
          provName:params.provName,
          cityId:params.cityId,
          cityName:params.cityName,
        }
      })
  };

  /**
   * 地图地市切换，不请求地图数据，仅请求地图外其他数据
   * @param mapName
   */
  changeMap=(mapName)=>{
    const {dispatch} = this.props;
        dispatch({
          type: 'governMapModels/getMap',
          payload: mapName
        })
      };

  changeIndex=(params)=>{
    console.log(params);
  };

  render(){
    const{title,GeoJson}=this.props;
    const {governMapModels:{provName,cityName,provId,cityId,mapData}}=this.props;
      return (
        <PageHeaderWrapper>
          <div className={styles.title}>{title}</div>
          <div className={styles.contain}>
            <SearchTop  />
            <div className={styles.mapContain}>
              <BuildingMap
                provId={provId}
                provName={provName}
                cityId={cityId}
                cityName={cityName}
                mapData={mapData}
                GeoJson={GeoJson}
                callback={this.MapCallback}
                changeMap={this.changeMap}
                hasButton='0'
                changeIndex={this.changeIndex}
                containId='governMap'
              />
            </div>
          </div>
        </PageHeaderWrapper>
      )
  }
}
export default GovernmentMap;
