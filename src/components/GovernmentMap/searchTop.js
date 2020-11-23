/* eslint-disable */
import React, { PureComponent } from 'react';
import { DatePicker, Select } from 'antd';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import styles from './searchTop.less';
const dateFormat = 'YYYY-MM';
const { Option } = Select;
const {MonthPicker} = DatePicker;

@connect(
  ({ governMapModels }) => ({ governMapModels })
)

class SearchTop extends PureComponent{
  constructor(props){
      super(props);
      this.state={
        firstLoad:true, // 是否是页面首次刷新加载
      };
  };

  componentDidMount() {
    this.getMaxDate();
    this.getIndexList();
  }

  componentDidUpdate(prevProps) {
    const {governMapModels:{date}}=this.props;
    const {firstLoad} = this.state;
    const that = this;
    // 当日期改变且是页面刷新首次日期改变的时候
    if(!isEqual(date,prevProps.governMapModels.date)&& firstLoad ){
      this.initMap();
      that.setState({
        firstLoad:false
      })
    }
  }

  /**
   * 请求地图数据
   * @constructor
   */
  initMap=()=>{
    const {governMapModels:{markType,dateType,date,indexId,cityId,cityName,provId,provName,searchCheck},dispatch} = this.props;
    // 初始化时请求地图数据放到model中
      dispatch({
        type:'governMapModels/getMapData',
        payload:{
          markType,
          dateType,
          date,
          indexId,
          provId,
          provName,
          cityId,
          cityName,
        }
      });
      // 点击查询按钮后改变查询按钮状态
      dispatch({
        type:'governMapModels/changeSearch',
        payload:!searchCheck
      })
  };

  // 获取指标选择列表数据
  getIndexList = () =>{
    const {dispatch,governMapModels:{markType,dateType,date}} = this.props;
    dispatch({
      type: 'governMapModels/getIndexListData',
      payload: {
        markType,
        dateType,
        date,
      }
    })
  };

  // 改变账期数据
  changeConditionDate = (date, dateString)=>{
    const { dispatch } = this.props;
    dispatch({
      type: `governMapModels/setDate`,
      payload: {date:dateString},
    });
  };

  // 获取最大账期数据
  getMaxDate=()=>{
    const { dispatch ,governMapModels:{dateType,markType}} = this.props;
    const params = {
      markType,
      dateType
    };
    dispatch({
      type: `governMapModels/getMaxDate`,
      payload: params,
    });
  };

  // 指标选择触发
  handleIndexChange=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: `governMapModels/setIndexData`,
      payload: value,
    });
  };

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { governMapModels:{maxDate} } = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  render(){
    const { governMapModels:{indexList,date,indexId} }=this.props;
    let options;
    if(indexList!==undefined && indexList.length>0){
      options = indexList.map((item)=>(
        <Option key={Math.random()+item.name} value={item.id}>{item.name}</Option>
      ));
    }
      return (
        <div className={styles.condition}>
          <div className={styles.dateDom}>
            <span>账期：</span>
            <MonthPicker
              dropdownClassName={styles.dateDropdown}
              disabledDate={this.disabledDate}
              format={dateFormat}
              showToday={false}
              value={moment(date, dateFormat)}
              allowClear={false}
              onChange={this.changeConditionDate}
            />
          </div>
          <div className={styles.indexSelect}>
            <span>指标选择：</span>
            <Select
              placeholder="请选择"
              value={indexId}
              onChange={(value)=>this.handleIndexChange(value)}
            >
              {options}
            </Select>
          </div>
          <div className={styles.queryDownload}>
            <div className={styles.query} onClick={()=>{this.initMap()}}>查询</div>
          </div>
        </div>
      )
  }
}
export default SearchTop;
