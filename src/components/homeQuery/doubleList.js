/**
 * @Description: 两组列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2020/1/9
 */

import React, { PureComponent } from 'react';
import {Rate} from "antd";
import FontSizeEchart from '../ProductView/fontSizeEchart';
import styles from "./doubleList.less";

class DoubleList extends PureComponent {

  static defaultProps = {
    doubleListData:[
      {
        "title":"家庭星级",
        "type":"homeStar",
        "list":[
          {"name":"星级","value":"2.5"},
        ]
      },
      {
        "title":"营销机会",
        "type":"marketing",
        "list":[
          {"name":"未加装IPTV","value":"可加装IPTV"},
          {"name":"存在速率XM","value":"可提速"},
          {"name":"存在异网号码","value":"可携号转网"},
        ]
      },
    ]
  }

  constructor(props) {
    super(props);
    this.state ={

    }
  }

  componentDidMount() {

  }

  render() {
    const {doubleListData} = this.props;
    const{titleSize}=FontSizeEchart();
    const listDom = doubleListData.map((item)=>{
      if(item.type === "homeStar"){
        const listStar = item.list.map((itemList)=>(
          <div className={styles.rateDiv} key={itemList.name+itemList.value}>
            {itemList.name}：
            <Rate className={styles.Rate} disabled value={itemList.value} />
          </div>
        ))
        return (
          <div key={item.type} className={styles.container}>
            <div className={styles.title} style={{fontSize:titleSize}}>{item.title}</div>
            {listStar}
          </div>
        )
      }
      const marketingList = item.list.map((marketingItem)=>(<li key={marketingItem.name+marketingItem.vale}>{marketingItem.name}-{marketingItem.value}</li>))
      return (
        <div className={styles.container}>
          <div className={styles.title} style={{fontSize:titleSize}}>{item.title}</div>
          <ul className={styles.marketing}>
            {marketingList}
          </ul>
        </div>
      )
    })
    return (
      <div className={styles.doubleList}>
        {listDom}
      </div>
    );
  }
}

export default DoubleList;
