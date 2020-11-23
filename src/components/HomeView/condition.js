/**
 * @Description:筛选条件组件（家庭试图情况页面）
 *
 * @author: 王健
 *
 * @date: 2019/12/11
 */

import React, {PureComponent} from 'react';
import { connect } from 'dva/index';
import { Select, DatePicker } from 'antd';

import moment from 'moment';
import styles from './condition.less';

const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

@connect(({ homeViewFirstTabModels,homeViewModels, proCityModels }) => ({
  homeViewFirstTabModels,
  homeViewModels,
  proCityModels
}))
class Condition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      custType:[], // 客户类型
      townType:[], // 城镇类型
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
    const {dispatch, homeViewModels:{tabId},homeViewFirstTabModels:{dateType,markType}} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/fetchConditions`,
      payload: {
        markType,
        tabId,
        dateType
      },
    });
  }

  /**
   * @date: 2019/12/11
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
   * @date: 2019/12/11
   * @author 王健
   * @Description: 筛选条件处理（针对家庭类型、城镇类型和增存量）
   * @method createConditions
   * @param conditionData,类型为数组 参数描述：包括3组下拉框类型筛选条件的数组
   * @return 返回值类型：以div标签为界的数组，返回值说明：根据数据创造出相应的筛选条件
   */
  createConditions=(conditionData)=> {
    const {custType,townType} =this.state;
    const conditionDiv = []; // 收集各个筛选条件内容的数组
    // 判断数据中体现家庭类型的字段是否存在，其选项内容是否为空
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
    // 判断数据中体现城镇类型的字段是否存在，其选项内容是否为空
    if (conditionData.townType && conditionData.townType.length > 0) {
      conditionDiv.push(
        <div className={styles.channelType} key="townType">
          <span>城镇类型：</span>
          <Select
            placeholder="请选择"
            value={townType}
            onChange={(value) => this.changeCondition(value,'townType')}
            dropdownClassName={styles.channelTypeSelectItme}
          >
            {this.createSelectOptions(conditionData.townType)}
          </Select>
        </div>
      )
    }
    return conditionDiv;
  }

  /**
   * @date: 2019/12/11
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
          custType:[value]
        })
        break;
      case 'townType':
        this.setState({
          townType:[value]
        })
        break;
      default:
        break;
    }
  }

  /**
   * @date: 2019/12/11
   * @author wangjian
   * @Description: 选中日期改变
   * @method changeConditionDate
   * @param date,
   * @param dateString,
   * @return {返回值类型} 返回值说明
   */
  changeConditionDate=(date, dateString)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewFirstTabModels/saveDate`,
      payload: dateString,
    });
  }

  /**
   * @date: 2019/12/11
   * @author wangjian
   * @Description: 查询事件
   * @method queryBtn
   */
  queryBtn(){
   const {custType,townType} =this.state;
    const {dispatch,
      homeViewFirstTabModels:{conditions,markType,date,provId,dateType,cityId},
      homeViewModels:{tabId}
    } =this.props;
    const payLoadData={
      date,
      markType,
      custType,
      townType,
      tabId,
      dateType,
      provId,
      cityId
    }
    dispatch({
      type: `homeViewFirstTabModels/fetchSavePayLoad`,
      payload: payLoadData,
    });

    let custName='';
    let townName='';
    // console.log("conditions")
    // console.log(conditions)
    // console.log("townType")
    // console.log(townType)
    conditions.townType.forEach((item)=>{
      if(item.id===townType[0]){
        townName=item.name;
      }
    })
    conditions.custType.forEach((item)=>{
      if(item.id===custType[0]){
        custName=item.name;
      }
    })

    const downloadData=[
      { name:"账期",value:date },
      { name:"客户类型",value:custName },
      { name:"城镇类型",value:townName },
      // { name:"省分",value:provName },
      // { name:"地市",value:cityName },
    ]
    // console.log(downloadData)
    // console.log("downloadData")
    dispatch({
      type: `homeViewFirstTabModels/fetchSaveDownLoad`,
      payload: downloadData,
    });

  }

  render() {
    const {homeViewFirstTabModels:{conditions,maxDate,date}}=this.props;
    // 通过最大账期的数值，确定一个日期组件可选择的最大数值
    let disabledDate;
    if(maxDate !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    return (
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
