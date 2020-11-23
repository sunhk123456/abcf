/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  智能分析-原因分析组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/21
 */

import React from 'react';
import styles from './reasonAnalysis.less'

class ReasonAnalysis extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, desc } = this.props;
    const reasonDom =[];
    data.forEach(item => {
      // eslint-disable-next-line no-unused-expressions
      item && reasonDom.push(
        <li key={item} className={styles.reasonLi}>{item}</li>
      )
    })
    return (
      <div className={styles.reasonAnalysis}>
        {reasonDom.length !== 0 && <span>原因分析：</span>}
        <ul className={styles.reasonUl}>{reasonDom}</ul>
        {desc &&<span className={styles.desc}>{desc}</span>}
      </div>
    );
  }
}

export default ReasonAnalysis;
