/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 终端信息查询-秒懂产品组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  ls
 * @date 2019/12/09
 */
/* eslint-disable */
import React, { PureComponent } from 'react';

import styles from './index.less'

export default  class KnowProduct extends PureComponent {

  static defaultProps = {
    'dataList':{
      "title":"秒懂产品",
      "list":[
      ]
    }
  };

  constructor(props){
    super(props)

    this.state={
    }
  }

  /** 遍历得到秒懂产品DOM结构 */
  getKnowProduck = (list) => (
    list && list.map(item => (
      <div className={styles.line} key={`${Math.random() * 100}product`}>
        <span title={item.name} className={styles.name}>{item.name}：</span>
        <div className={styles.itemValue}>
          {item.value && item.value.map(itemValue => (
            <p title={itemValue} className={styles.value} key={`${Math.random() * 100}value`}>{itemValue}</p>
          ))}
        </div>
      </div>
    ))
  )

  render(){
    const { dataList } = this.props;
    const { list } = dataList; // 从仓库中取出的数据
    if(!(list && list.length > 0))return null;
    return(
      <div className={styles.wrapper}>
        <div className={styles.title}>{dataList.title}</div>
        <div className={styles.contain}>
          { this.getKnowProduck(list)}
        </div>
      </div>
    )
  }
}
