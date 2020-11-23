import React,{ PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import { Tabs,DatePicker} from 'antd';
import moment from 'moment';
import styles from './header.less';
import Cookie from '@/utils/cookie';
import RouterSwitch from '../Common/routerSwitch'

// const wrappedTest = WrappedComponent =>{
//   return class extends React.Component{
//     render(){
//       console.log(this.props);
//       return <WrappedComponent {...this.props} newProp="给被包装的组件添加的新属性" />
//     }
//   }
// };
//
// @wrappedTest
/**
 * store里的state发生变化，组件的props属性也跟着变化
 */
const {MonthPicker} = DatePicker;

@connect(({dayOverViewHeader,billingRevenue })=>({
  moduleData:dayOverViewHeader.moduleData,
  maxDate:dayOverViewHeader.maxDate,
  selectedDate:dayOverViewHeader.selectedDate,
  proName:billingRevenue.proName,
  dateType:dayOverViewHeader.dateType,
  tabId:dayOverViewHeader.tabId,
}))
class DayOverViewHeader extends PureComponent{
  /**
   * 作用：将props（store和父组件）和本组件的state关联起来，props的数据变化时，显示的去更新本组件state的数据，
   * 如果组件不涉及自己的状态，即本组件没有state，此声明周期时不需要的
   * @param nextProps
   * @param prevState
   * @returns {*}
   */
  // static getDerivedStateFromProps(nextProps,prevState){
  //   if((nextProps.selectedDate!== "" && nextProps.selectedDate !== prevState.selectedDate)
  //     ||(nextProps.maxDate!== "" && nextProps.maxDate !== prevState.maxDate)
  //     || ( nextProps.moduleData.length>0 && nextProps.moduleData !== prevState.moduleData)
  //     || nextProps.provName !== prevState.provName){
  //     return { maxDate:nextProps.maxDate,selectedDate:nextProps.selectedDate,moduleData:nextProps.moduleData,provName:nextProps.provName};
  //   }
  //   return null;
  // }

  componentDidMount(){
    // 请求模块数据、最大账期
    const { dispatch,dateType,tabId } = this.props;
    dispatch({
      type:"dayOverViewHeader/fetchModuleData",
      payload:{dateType,}
    });
    if(tabId !== ""){
      dispatch({
        type:"dayOverViewHeader/fetchMaxDate",
        payload:{dateType,tabId}
      });
    }
  }

  componentDidUpdate(prevProps){
    const {dispatch,tabId,dateType} = this.props;
    if(prevProps.tabId !== tabId){
      dispatch({
        type:"dayOverViewHeader/fetchMaxDate",
        payload:{dateType,tabId}
      });
    }
  }

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { maxDate } = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  /**
   * 切换模块
   * @param tabId
   */
  handleChangeTab = tabId => {
    const {provOrCityName,provOrCityId } = Cookie.getCookie('loginStatus');
    const { dispatch } = this.props;
    dispatch({
      type:"dayOverViewHeader/changeTabId",
      payload:tabId
    });
    // 初始化先赋值model里的省份和name
    dispatch({
      type:"billingRevenue/changeProv",
      payload:{
        proId:provOrCityId,
        proName:provOrCityName,
        selectProAndCity:{
          proId:provOrCityId,
          proName:provOrCityName,
          cityId: "-1",
          cityName:provOrCityName
        }
      }
    })
  };

  /**
   * 选择账期
   * @param date
   * @param dateString
   */
  handleChangeDate = (date,dateString) =>{
    const {provOrCityName,provOrCityId } = Cookie.getCookie('loginStatus');
    const { dispatch } = this.props;
    dispatch({
      type:"dayOverViewHeader/changeDate",
      payload:dateString
    });
    dispatch({
      type:"billingRevenue/changeProv",
      payload:{
        proName:provOrCityName,
        proId:provOrCityId
      }
    })
  };

  render(){
    const {power,provOrCityName } = Cookie.getCookie('loginStatus');
    const { moduleData,proName,selectedDate,dateType } = this.props;
    let proShowName;
    if(power === 'city'||power==="specialCity"){
      proShowName = provOrCityName;
    }else {
      proShowName = proName;
    }
    const triangle = <i className={styles.dateTriangle} />;
    const tabPanels = moduleData.map(item => <Tabs.TabPane key={item.tabId} tab={item.tabName} /> );
    const dateComponent = dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(selectedDate, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.handleChangeDate} suffixIcon={triangle} />
      :<MonthPicker value={moment(selectedDate, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.handleChangeDate} suffixIcon={triangle} />
    const titleName = dateType === "1"?"日运营总览":"月运营总览";
    return (
      <Fragment>
        <div className={styles.title}>
          <span className={styles.titleName}>{titleName}（{proShowName}）</span>
          <RouterSwitch />
          <span className={styles.date}>
            <span className={styles.dateTitle}>日期</span>&nbsp;&nbsp;
            {dateComponent}
          </span>
        </div>
        <div className={styles.moduleTab}>
          <Tabs type='card' onChange={this.handleChangeTab}>
            {tabPanels}
          </Tabs>
        </div>
      </Fragment>
      )
  }
}
export default DayOverViewHeader;
