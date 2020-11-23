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
import OverviewIndexDetail from '../../components/DayOverView/overviewIndexDatail';
import Government from '@/components/DayOverView/government/government';
import Cookie from '@/utils/cookie';

@connect(({dayOverViewHeader,overviewIndexDetail})=>({tabId:dayOverViewHeader.tabId,dateType:dayOverViewHeader.dateType,popUpShow:overviewIndexDetail.popUpShow}))
class DayOverView extends PureComponent{
  constructor(props){
    super(props);
    const {dispatch} = this.props;
    dispatch({
      type:"dayOverViewHeader/changeDateType",
      payload:"1"
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
    const {power} = Cookie.getCookie('loginStatus');
    const {popUpShow,tabId} = this.props;
    const pageStatus = tabId !== "TAB_105";
    const forthTabBottom = tabId === "TAB_104"?(
      <div className={styles.bottom}>
        <div className={styles.mixEchartLeft}>
          <MixEchart signPosition="3" />
        </div>
        <div className={styles.mixEchartRight}>
          <MixEchart signPosition="4" />
        </div>
      </div>
    ):null;
    // all/prov/city/specialCity
    const contentTopLeft = (power === 'city' || power === 'specialCity')? <div className={styles.mapAndBar}><CityLine /></div>
      :<div className={styles.mapAndBar}><MapAndBar /></div>;

    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.dayOverViewHeader}>
            <DayOverViewHeader />
          </div>
          {
            pageStatus ? (
              <Fragment>
                <div className={styles.contentTop}>
                  {contentTopLeft}
                  <div className={styles.indexTable}>
                    <IndexTable />
                  </div>
                </div>
                <div className={styles.contentBottom}>
                  <div className={styles.mixEchartLeft}>
                    <MixEchart signPosition="1" />
                  </div>
                  <div className={styles.mixEchartRight}>
                    <MixEchart signPosition="2" />
                  </div>
                </div>
                {forthTabBottom}
                {/* 运营总览弹出层：地市、账期、筛选条件、指标id */}
                {popUpShow?<OverviewIndexDetail />:null}
              </Fragment>
            ) : <Government />
          }
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default DayOverView;
