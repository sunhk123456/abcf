/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/9/5
 */

import React, {PureComponent} from 'react';
import styles from "./infoList.less"

class InfoList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    return (
      <div className={styles.infoListContent}>
        <div className={styles.infoListItem}>
          <div className={styles.title}>
            <span className={styles.circleRed}></span>盈利能力
          </div>
          <ul className={styles.itemUl}>
            <li className={styles.itemLi}>
              <span className={styles.name}>出账收入</span>
              <span className={styles.value}>2,605,415.54</span>
            </li>
            <li className={styles.itemLi}>
              <span className={styles.name}>出账收入</span>
              <span className={styles.value}>2,605,415.54</span>
            </li>
            <li className={styles.itemLi}>
              <span className={styles.name}>出账收入</span>
              <span className={styles.value}>2,605,415.54</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default InfoList;
