/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  名单制头部列表组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/26
 */

import React from 'react';
import { Icon } from 'antd';
import styles from './headList.less'
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
class HeadList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }


  render() {
    const { data } = this.props;
    const growthValue = data[0].list[1].value;
    let type = 'unchanged';
    //  判断同比增幅正负，添加不同样式
    if (growthValue > 0) {type = 'increase'}
    else if(growthValue < 0){type = 'decrease'}

    return (
      <div className={styles.headList}>


        <div className={styles.listItem}>
          <div className={styles.listIcon}>
            <IconFont type="icon-qianbao" className={styles.icon} />
          </div>
          <div className={styles.listText}>
            <div className={styles.name}>{data[0].list[0].name}</div>
            <div className={styles.value}>
              {data[0].list[0].value}&ensp;
              <span className={styles.unit}>{data[0].list[0].unit}</span>
            </div>
            <div className={styles.desc}>
              {data[0].list[1].name}
              <div className={styles[type]}>{growthValue}{data[0].list[1].unit}</div>
            </div>
          </div>
        </div>


        <div className={styles.listItem}>
          <div className={styles.listIcon}>
            <IconFont type="icon-kehu" className={styles.icon} />
          </div>
          <div className={styles.listText}>
            <div className={styles.name}>{data[1].list[0].name}</div>
            <div className={styles.value}>
              {data[1].list[0].value}
            </div>
            <div className={styles.blank} />
          </div>
        </div>


        <div className={styles.listItem}>
          <div className={styles.listIcon}>
            <IconFont type="icon-kehu1" className={styles.icon} />
          </div>
          <div className={styles.listText}>
            <div className={styles.name}>{data[2].list[0].name}</div>
            <div className={styles.value}>
              {data[2].list[0].value}/{data[2].list[1].value}
            </div>
            <div className={styles.desc}>{data[2].desc}</div>
          </div>
        </div>


        <div className={styles.listItem}>
          <div className={styles.listIcon}>
            <IconFont type="icon-zhibiao" className={styles.icon} />
          </div>
          <div className={styles.listText}>
            <div className={styles.name}>{data[3].list[0].name}</div>
            <div className={styles.value}>
              {data[3].list[0].value}&ensp;
              <span className={styles.unit}>{data[0].list[0].unit}</span>
            </div>
            <div className={styles.desc}>{data[3].desc}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default HeadList;
