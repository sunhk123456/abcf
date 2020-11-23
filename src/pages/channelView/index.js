/**
 * @Description: 渠道视图页面
 *
 * @author: 风信子
 *
 * @date: 2019/6/4
 */

import React, { PureComponent } from 'react';
import { Tabs} from 'antd';
import { connect } from 'dva/index';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import OverviewTab from "../../components/ChannelView/overviewTab"; // 渠道总览Tab
import EvaluateTab from "../../components/ChannelView/evaluateTab"; // 渠道评价Tab
import IndicatorsTab from "../../components/ChannelView/indicatorsTab"; // 业务指标Tab
import CollectComponent from '../../components/myCollection/collectComponent'; // 收藏图标
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ overviewTabModels,proCityModels }) => ({
  overviewTabModels,
  proCityModels
}))
class ChannelView extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      markType:"channelView",
      key:"",
    }
  }

  componentDidMount(){
    const {dispatch} = this.props;
    const {markType} = this.state;
    dispatch({
      payload: {markType, dateType:"2"},
      type: `overviewTabModels/fetchChannelViewTab`
    });
  }

  // componentDidUpdate(prevProps,prevState){
  //
  // }

  handleChange=key=>{
    // "组件销毁清空地域选中" 因为在组件销毁的时候清空有点慢所以在这请一下
    const {dispatch,proCityModels}=this.props;
    const {areaDate} = proCityModels;
    const selectPro = {
      proId: areaDate[0].proId,
      proName: areaDate[0].proName
    };
    const selectCity = {
      cityId: "-1",
      cityName: areaDate[0].proName
    };
    dispatch({
      type:"proCityModels/setSelectData",
      payload:{
        selectPro,
        selectCity,
      }
    });
    this.setState({
      key,
    })
  };

  render() {
    const {overviewTabModels} = this.props;
    const {tabData} = overviewTabModels;
    // const{key,markType}=this.state;
    const{key}=this.state;
    const list=[];
    const tabPane = tabData.map(item=>{
      if(item.tabId==="01"){
        list.push(<OverviewTab tabId={item.tabId} />)
      }else if(item.tabId==="02"){
        list.push(<EvaluateTab tabId={item.tabId} />)
      }else {
        list.push(<IndicatorsTab tabId={item.tabId} />)
      }
       return (
         <TabPane tab={item.tabName} key={item.tabId} />
      )});
    // 收藏图标样式
    const collectStyle ={
      marginRight: '10px',
      width: '30px',
      height: '30px'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.channelView}>
          <div className={styles.titlePart}>
            <Tabs animated={false} onChange={this.handleChange}>
              {tabPane}
            </Tabs>
            <CollectComponent markType="D0203" searchType='2' imgStyle={collectStyle} />
          </div>
          {list[Number(key||1)-1]}
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default ChannelView;
