/* eslint-disable react/prefer-stateless-function */
import React,{ PureComponent,Fragment } from 'react';
import {connect} from 'dva'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DayOverViewHeader from "../../components/DayOverView/header";
import styles from './index.less';
import MapAndBar from "../../components/DayOverView/mapAndBar";
import IndexTable from "../../components/DayOverView/indexTable";
import MixEchart from "../../components/DayOverView/mixEchart";
import CityLine from "../../components/DayOverView/cityLine";
import Cookie from '@/utils/cookie';
import GaugeChart from "../../components/DayOverView/gaugeCharts";
import OverviewIndexDetail from '../../components/DayOverView/overviewIndexDatail'

@connect(({dayOverViewHeader,overviewIndexDetail})=>({dateType:dayOverViewHeader.dateType,popUpShow:overviewIndexDetail.popUpShow}))
class MonthOverView extends PureComponent{
  constructor(props){
    super(props);
    const {dispatch} = this.props;
    dispatch({
      type:"dayOverViewHeader/changeDateType",
      payload:"2"
    });
    dispatch({
      type:"dayOverViewHeader/changeDate",
      payload:""
    });
    dispatch({
      type:"dayOverViewHeader/changeTabId",
      payload:""
    });
  }

  render() {
    const {popUpShow} = this.props;
    const {power} = Cookie.getCookie('loginStatus');
    // all/prov/city/specialCity
    const contentTopLeft = (power === 'city' || power === 'specialCity')? <div className={styles.mapAndBar}><CityLine /></div>
      :<div className={styles.mapAndBar}><MapAndBar /></div>;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.dayOverViewHeader}>
            <DayOverViewHeader />
          </div>
          <div className={styles.contentTop}>
            {contentTopLeft}
            <div className={styles.indexTable}>
              <IndexTable signPosition="1" />
            </div>
          </div>
          <div className={styles.contentMiddleOne}>
            <div className={styles.mixEchartOne}>
              <MixEchart signPosition="1" />
            </div>
            <div className={styles.contentMiddleOneRight}>
              <GaugeChart />
            </div>
          </div>
          <div className={styles.contentMiddleTwo}>
            <div className={styles.mixEchartTwo}>
              <MixEchart signPosition="2" />
            </div>
            <div className={styles.indexTableTwo}>
              <IndexTable signPosition="2" />
            </div>
          </div>
          <div className={styles.contentBottom}>
            <div className={styles.mixEchartThree}>
              <MixEchart signPosition="3" />
            </div>
            <div className={styles.mixEchartLast}>
              <MixEchart signPosition="4" />
            </div>
          </div>
          {/* 运营总览弹出层：地市、账期、筛选条件、指标id */}
          {popUpShow?<OverviewIndexDetail />:null}
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default MonthOverView;
