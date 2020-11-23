/**
 * @Description: 政企业务
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/18
 */

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import iconFont from '@/icon/Icons/iconfont';
import styles from './operation.less'


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

class Operation extends PureComponent {
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
  
  sectionOneTitle=(title)=>(
    <div className={styles.sectionOneSecondTitle}>
      <div className={styles.sectionOneSecondText}>{title}</div>
    </div>
  );
  
  sectionOneItem=(item,iconColor)=>(
    <div className={styles.itemWrapper}>
      <div className={styles.itemTitle}>
        <div className={styles.itemTitleIcon}>
          <IconFont
            type="icon-shouru-copy"
            style={{color:iconColor,fontSize:"17px"}}
          />
        </div>
        <div className={styles.itemTitleText}>{item.itemTitle}</div>
      </div>
      {item.itemValue[0] &&
      <div className={styles.itemListFirst}>
        <div>{item.itemValue[0].name}</div>
        <div>
          <span className={styles.itemListFirstValue}>{item.itemValue[0].value}</span>
          <span>{item.itemValue[0].unit}</span>
        </div>
      </div>}
      {item.itemValue[1] &&
      <div className={styles.itemListSecond}>
        <div>{item.itemValue[1].name}</div>
        <div>
          <span>{item.itemValue[1].value}</span>
          <span>{item.itemValue[1].unit}</span>
        </div>
      </div>}
    </div>
  );
  
  render() {
    const {data}=this.props;
    return (
      <div className={styles.operation}>
        <section className={styles.sectionOne}>
          <div className={styles.sectionOneTitle}>{this.moduleTitle(data.title || "运营公司")}</div>
          {data.list &&
          <div className={styles.sectionOneList}>
            <div className={styles.sectionOneSubtitle}>{this.sectionOneTitle(data.list[0].title || "移网基础")}</div>
            <div className={styles.sectionOneItem}>{this.sectionOneItem(data.list[0].itemList[0],"rgb(223, 148, 96)")}</div>
            <div className={styles.sectionOneSubtitle}>{this.sectionOneTitle(data.list[1].title ||"固网基础")}</div>
            <div className={styles.sectionOneItem}>{this.sectionOneItem(data.list[1].itemList[0],"rgb(95, 173, 222)")}</div>
            <div className={styles.sectionOneItem}>{this.sectionOneItem(data.list[1].itemList[1],"rgb(220, 103, 172)")}</div>
            <div className={styles.sectionOneItem}>{this.sectionOneItem(data.list[1].itemList[2],"rgb(90, 214, 228)")}</div>
          </div>}
        </section>
      </div>
    );
  }
}

export default Operation;
