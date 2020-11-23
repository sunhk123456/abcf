/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  产品信息列表组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/14
 */

import React from 'react';
import { Icon } from 'antd';
import iconFont from '../../icon/Icons/iconfont';
import styles from './productList.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
class ProductList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};

  }

  componentDidMount() {
  }

  //  点击查看详情按钮
  onClick = index => {
    const { clickDetails } = this.props;
    clickDetails(index)
  }

  render() {
    const { data } = this.props;
    const listDom = [];
    // eslint-disable-next-line no-unused-expressions
    data && data.forEach((item, index) => {
      const itemDom = []
      item.value.forEach((innerItem, innerIndex) => {
        itemDom.push(
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.contentItem} key={`${innerItem.name}${innerIndex}`}>
            <IconFont type={`icon-${innerItem.iconName}`} className={styles.icon} />&nbsp;{innerItem.name}:&emsp;{innerItem.value}
          </div>
        )
      })
      listDom.push (
        // eslint-disable-next-line react/no-array-index-key
        <div className={styles.listItem} key={`${item.title}${index}`}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.content}>{itemDom}</div>
          <div className={styles.btn} onClick={() => {this.onClick(index)}}>查看详情</div>
        </div>
      )
    })
    return (
      <div className={styles.productList}>
        {listDom}
      </div>
    );
  }
}

export default ProductList;
