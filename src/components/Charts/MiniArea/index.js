import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class MiniArea extends React.PureComponent {
  render() {
    const {
      height,
    } = this.props;
    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          {height > 0}
        </div>
      </div>
    );
  }
}

export default MiniArea;
