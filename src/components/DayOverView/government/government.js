/**
 * @Description: 政企业务
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/18
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import styles from './government.less'
import Operation from './operation';
import BusinessTable from './businessTable'
import IncomeAnalysis from './stackBar';
import ProductPlant from './productPlant';

@connect(
  ({
     governmentModels,
     dayOverViewHeader
   }) => ({
    governmentModels,
    dayOverViewHeader,
    operation:governmentModels.operation,
    stackBar:governmentModels.stackBar,
    product:governmentModels.product,
    integration:governmentModels.integration,
    businessData:governmentModels.businessData,
    date:dayOverViewHeader.selectedDate,
    tabId:dayOverViewHeader.tabId,
    dateType:dayOverViewHeader.dateType,
  })
)
class Government extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
      // this.init()
  }

  componentDidUpdate(prevProps) {
    const {date}=this.props;
    if(!isEqual(date,prevProps.date)){
      this.init()
    }
  }

  // 请求所有接口数据

  init=()=>{
    const {date,tabId,dateType}=this.props;
    const params={
      date,
      tabId,
      dateType
    };
    this.getOperationData(params);
    this.getStackBarData(params);
    this.getBusinessData(params);
    this.getProductData(params);
    this.getIntegrationData(params);
  };

  // 请求运营公司板块数据

  getOperationData=(params)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `governmentModels/getOperationData`,
      payload: params,
    });

  };

  // 请求名单制收入分析接口数据

  getStackBarData=(params)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `governmentModels/getStackBarData`,
      payload: params,
    });

  };

  // 请求产互公司数据
  getProductData=(params)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `governmentModels/getProductData`,
      payload: {...params,type:"product"},
    });

  };

  // 请求集成公司数据

  getIntegrationData=(params)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `governmentModels/getIntegrationData`,
      payload: {...params,type:"integration"},
    });

  };

  // 请求4个表格数据

  getBusinessData=(params)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `governmentModels/getBusinessData`,
      payload: params,
    });

  };



  render() {
    const {operation,stackBar,product,integration,businessData}=this.props;

    const businessTableDom = businessData.list && businessData.list.map(item =>
      (
        <div className={styles.tableContainer} key={item.title}>
          <BusinessTable data={item} />
        </div>
      ),
    );
    return (
      <div className={styles.government}>
        {operation.title&&<Operation data={operation} />}
        {stackBar.title&&
        <div className={styles.incomeAnalysisWrapper}>
          <IncomeAnalysis
            stack
            vertical
            chartData={stackBar}
            echartId="HomeBasisBarEchart2"
            color={["#df9460","#5fadde","#dc67ac","#5ad6e4"]}
            titlePosition="center"
          />
        </div>}
        <div className={styles.businessTable}>
          <div className={styles.businessTitle}>{businessData.title}</div>
          {businessTableDom}
        </div>
        <div className={styles.footer}>
          {product.title &&
          <div className={styles.footerItem}>
            <ProductPlant data={product} />
          </div>}
          {integration.title &&
          <div className={styles.footerItem}>
            <ProductPlant data={integration} />
          </div>}
        </div>
      </div>
    );
  }
}

export default Government;
