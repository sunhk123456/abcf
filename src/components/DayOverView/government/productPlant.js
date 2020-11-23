/**
 * @Description: 政企业务
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/18
 */

import React, { PureComponent } from 'react';
import styles from './productPlant.less'
import BarLineTimeEchart from './barLineTimeEchart';



class ProductPlant extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentWillMount() {
  
  }
  
  componentDidMount() {
  
  }
  
  
  moduleTitle=(title)=>
    (
      <div className={styles.moduleTitle}>
        <div className={styles.line} />
        <div className={styles.moduleTitleText}>{title}</div>
      </div>
    );
  
  
  render() {
    const {data}=this.props;
    return (
      <div className={styles.productPlant}>
        <div>{this.moduleTitle(data.title || "未知板块")}</div>
        {data.header.list&&
        <div className={styles.header}>
          <div className={styles.headerTitle}>{data.header.title}</div>
          <div className={styles.headerListFirst}>
            <div>{data.header.list[0].name}</div>
            <div className={styles.headerListFirstValue}>{data.header.list[0].value}</div>
            <div>{data.header.list[0].unit}</div>
          </div>
          <div className={styles.headerListSecond}>
            <div>{data.header.list[1].name}</div>
            <div className={styles.headerListSecondValue}>{data.header.list[1].value}</div>
            <div>{data.header.list[1].unit}</div>
          </div>
        </div>}
        <div className={styles.main}>
          <BarLineTimeEchart
            chartData={data.echart}
            single
            echartId="HomeBasisBarEchart2"
            color={["#589de1","#ccc"]}
          />
        </div>
      </div>
    );
  }
}

export default ProductPlant;
