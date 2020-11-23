/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  详细信息列表组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/15
 */

import React from 'react';
import styles from './detailsList.less';
import { Icon } from 'antd';
import iconFont from '@/icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
class DetailsList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectId: 0,  //  当前选择的标签
    };

  }

  componentDidMount() {
  }

  //  点击选择标签
  selectTabs = id => {
    this.setState({
      selectId: id
    })
  }

  render() {
    const { selectId } = this. state;
    const { data } = this.props;
    //  基本信息dom
    const basicDom = [];
    //  详细信息dom
    const detaliDom = [];
    data.value.forEach(item => {
      basicDom.push(
        <div key={item.name} className={`${styles.basicItem} ${selectId ? styles.hidden : ''}`}>
          <div className={styles.name}>&emsp;&emsp;{item.name}</div>
          <div>&emsp;&emsp;{item.value}</div>
        </div>
      )
    })
    data.detailedInfo.forEach(item => {
      //  列表中title下方的内容dom
      const innerDom = [];
      item.contentValue.forEach(innerItem => {
        //  列表中title下方的内容dom————右侧具体的值dom
        const innerValueDom = [];
        innerItem.value.forEach(innerItemValue => {
          innerValueDom.push(
            <div key={innerItemValue}>{innerItemValue}</div>
          )
        })
        innerDom.push(
          <div key={innerItem.name} className={styles.detailInnerItem}>
            <div className={styles.name}>{innerItem.name}</div>
            <div className={styles.innerItemValue}>{innerValueDom}</div>
          </div>
        )
      })
      detaliDom.push(
        <div key={item.title} className={`${styles.detailItem} ${selectId ? null : styles.hidden}`}>
          <div className={styles.title}><IconFont type={`icon-${item.titleIcon}`} />&nbsp;{item.title}</div>
          {innerDom}
        </div>
      )
    })
    return (
      <div className={styles.detailsList}>
        <div className={styles.title}>
          <div className={styles.titleItem}>&emsp;&emsp;产品名称</div>
          <span>&emsp;&emsp;{data.title}</span>
        </div>
        <div className={styles.tabs}>
          <div
            className={selectId ? styles.hiddenTabs : styles.showTabs}
            onClick={() => this.selectTabs(0)}
          >
            <IconFont type='icon-class' className={styles.icon} />基本信息
          </div>
          <div
            className={selectId ? styles.showTabs : styles.hiddenTabs}
            onClick={() => this.selectTabs(1)}
          >
            <IconFont type='icon-function' className={styles.icon} />详情信息
          </div>
        </div>
        <div className={styles.detailsContent}>
          {basicDom}
          {detaliDom}
        </div>
      </div>
    );
  }
}

export default DetailsList;
