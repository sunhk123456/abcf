/**
 * @Description:筛选条件组件
 *
 * @author: 王健
 *
 * @date: 2019/12/9
 */

import React, {PureComponent} from 'react';
import { connect } from 'dva/index';
import { Select, DatePicker } from 'antd';
import ProvinceCity from '@/components/Until/proCity';

import moment from 'moment';
import styles from './condition.less';

const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

@connect(({ buildingViewModels, proCityModels }) => ({
  buildingViewModels,
  proCityModels
}))
class Condition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      industryType:"", // 行业类型
      custType:"", // 客户类型
      raiseStockType:"", // 增存量
    }
  }

  componentDidMount() {
      this.init();
  }

  /**
     * 做出页面的初始化操作，包括最大账期，筛选条件的初始请求
     * @param
     * @returns {XML}
     */
  init=()=>{
    const {
      dispatch,
      buildingViewModels:{markType,dateType,tabId}
    } =this.props;
    dispatch({
      type: `buildingViewModels/fetchConditions`,
      payload: {
        markType,
        tabId,
        dateType
      },
    });
    dispatch({
      type: `buildingViewModels/fetchMaxDate`,
      payload: {
        markType,
        tabId,
        dateType
      },
    });
    // dispatch({
    //   type: `buildingViewModels/fetchRosePie`,
    //   payload: {
    //     markType:'',
    //     tabId:'',
    //     type:'productMix'
    //   },
    // });
  }

  /**
   * @date: 2019/12/9
   * @author 王健
   * @Description: 筛选条件下拉框选项处理
   * @method createSelectOptions
   * @param OptionData,类型为数组 参数描述：包括该筛选条件下的所有选项数据
   * @return {返回值类型：数组} 返回值说明：根据选项数据创造出相应的Option标签下的内容
   */
  createSelectOptions=(OptionData)=>{
    // channelTypeOption，完整的Option信息
    const channelTypeOption = OptionData.map((item)=>(<Option key={item.id} value={item.id}>{item.name}</Option>))
    return channelTypeOption;
  }


  /**
   * @date: 2019/12/9
   * @author 王健
   * @Description: 筛选条件处理（针对客户类型、行业类型和增存量）
   * @method createConditions
   * @param conditionData,类型为数组 参数描述：包括3组下拉框类型筛选条件的数组
   * @return 返回值类型：以div标签为界的数组，返回值说明：根据数据创造出相应的筛选条件
   */
  createConditions=(conditionData)=> {
    const {industryType,custType,raiseStockType} =this.state;
    const conditionDiv = []; // 收集各个筛选条件内容的数组
    // 判断数据中体现客户类型的字段是否存在，其选项内容是否为空
    if (conditionData.custType && conditionData.custType.length > 0) {
      conditionDiv.push(
        <div className={styles.channelType} key="custType">
          <span>客户类型：</span>
          <Select
            placeholder="请选择"
            value={custType}
            onChange={(value) => this.changeCondition(value,'custType')}
            dropdownClassName={styles.channelTypeSelectItme}
          >
            {this.createSelectOptions(conditionData.custType)}
          </Select>
        </div>
      )
    }
    // 判断数据中体现行业类型的字段是否存在，其选项内容是否为空
    if (conditionData.industryType && conditionData.industryType.length > 0) {
      conditionDiv.push(
        <div className={styles.channelType} key="industryType">
          <span>行业类型：</span>
          <Select
            placeholder="请选择"
            value={industryType}
            onChange={(value) => this.changeCondition(value,'industryType')}
            dropdownClassName={styles.channelTypeSelectItme}
          >
            {this.createSelectOptions(conditionData.industryType)}
          </Select>
        </div>
      )
    }
    // 判断数据中体现赠存量的字段是否存在，其选项内容是否为空
    if (conditionData.raiseStockType && conditionData.raiseStockType.length > 0) {
      conditionDiv.push(
        <div className={styles.channelType} key="raiseStockType">
          <span>增存量：</span>
          <Select
            placeholder="请选择"
            value={raiseStockType}
            onChange={(value) => this.changeCondition(value,'raiseStockType')}
            dropdownClassName={styles.channelTypeSelectItme}
          >
            {this.createSelectOptions(conditionData.raiseStockType)}
          </Select>
        </div>
      )
    }
    return conditionDiv;
  }

  /**
   * @date: 2019/12/9
   * @author 王健
   * @Description: 更新某筛选条件时，同时更新其对应的state值
   * @method changeCondition
   * @param type,类型为字符串 参数描述：type类型，明确修改的筛选条件时哪一个
   *  @param value，类型为字符串， 参数描述：value，其值更改为什么
   * @return void
   */
  changeCondition=(value,type)=>{
    switch (type) {
      case 'custType':
        this.setState({
          custType:value
        })
        break;
      case 'industryType':
        this.setState({
          industryType:value
        })
        break;
      case 'raiseStockType':
        this.setState({
          raiseStockType:value
        })
        break;
      default:
        break;
    }
  }

  /**
   * @date: 2019/12/9
   * @author wangjian
   * @Description: 选中日期改变
   * @method changeConditionDate
   * @param date,
   * @param dateString,
   * @return {返回值类型} 返回值说明
   */
  changeConditionDate=(date, dateString)=>{
    const {dispatch}=this.props;
    // dispatch({
    //   type:"overviewTabModels/saveDate",
    //   payload:dateString
    // })
    console.info(date,dateString)
    dispatch({
        type:"buildingViewModels/fetchSaveDate",
        payload:{
          date:dateString
        }
      })
  }

  /**
   * @date: 2019/12/9
   * @author wangjian
   * @Description: 查询事件
   * @method queryBtn
   */
  queryBtn(){
   const {industryType,custType,raiseStockType} =this.state;
    const {buildingViewModels:{markType,dateType}} = this.props;
    const {
      proCityModels:{selectCity, selectPro},
      dispatch,
      buildingViewModels:{conditions,date},
      // clickSearch
    } =this.props;
    const payLoadData={
      date,
      markType,
      dateType,
      industryType:industryType!==""?[industryType]:[],
      custType:custType!==""?[custType]:[],
      raiseStockType:raiseStockType!==""?[raiseStockType]:[],
      provId:selectPro.proId,
      cityId:selectCity.cityId
    }
    let custName='';
    let industryName='';
    let raiseStockName='';
    conditions.raiseStockType.forEach((item)=>{
      if(item.id===raiseStockType){
        raiseStockName=item.name;
      }
    })
    conditions.custType.forEach((item)=>{
      if(item.id===custType){
        custName=item.name;
      }
    })
    conditions.industryType.forEach((item)=>{
      if(item.id===industryType){
        industryName=item.name;
      }
    })
    const downloadData=[
      { name:"账期",value:date },
      // { name:"省分",value:selectPro.proName },
      // { name:"地市",value:selectCity.cityName },
      { name:"客户类型",value:custName },
      { name:"行业类型",value:industryName },
      { name:"赠存量",value:raiseStockName },
    ]
    dispatch({
      type: `buildingViewModels/fetchSavePayLoad`,
      payload: payLoadData,
      // callback:()=>{
      //   clickSearch();
      // }
    });
    dispatch({
      type: `buildingViewModels/fetchSaveDownLoad`,
      payload: downloadData,
    });
  }

  render() {
    const {buildingViewModels:{conditions,maxDate,date,markType}}=this.props;
    // 通过最大账期的数值，确定一个日期组件可选择的最大数值
    let disabledDate;
    if(maxDate !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    return (
      <div className={styles.condition}>
        <div className={styles.dateDom}>
          <span className={styles.dateSpan}>账期</span>
          <span>：</span>
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
        <div className={styles.proCityDiv}>
          <ProvinceCity markType={markType} />
        </div>
        {Object.keys(conditions).length !== 0&&this.createConditions(conditions)}
        <div className={styles.queryDownload}>
          <span className={styles.query} onClick={()=>{this.queryBtn()}}>查询</span>
          {/* <span className={styles.download} onClick={null}> */}
          {/*  <Icon className={styles.downIcon} type="download" />下载 */}
          {/* </span> */}
        </div>
      </div>
    )
  }
}

export default Condition;
