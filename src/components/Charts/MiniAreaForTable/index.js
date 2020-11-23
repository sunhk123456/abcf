import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class MiniAreaForTable extends React.PureComponent {
  render() {
    const {
      height,
    } = this.props;



    return (
      <div className={styles.miniChart} style={{ height,width:30 }}>
        <div className={styles.chartContent}>
          图表
        </div>
      </div>
    );
  }
}

export default MiniAreaForTable;
