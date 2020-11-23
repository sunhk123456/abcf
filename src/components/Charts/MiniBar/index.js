import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class MiniBar extends React.Component {
  render() {
    const { height } = this.props;




    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          图表
        </div>
      </div>
    );
  }
}
export default MiniBar;
