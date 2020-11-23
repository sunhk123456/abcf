import React, { PureComponent } from 'react';

import styles from './index.less'

class CircleTurn extends PureComponent {
  constructor(props){
    super(props);
    this.state={
    
    };
  }
  
  
  render() {
    return (
      <div className={styles.queryWrapper}>
        <div className={styles.circleEmptySmall}>
          <div className={styles.circleSolidSmall} />
          <div className={styles.circleSolidNormal} />
          <div className={styles.circleSolidLarge} />
          <div className={styles.circleSolidSmallTwo} />
        </div>
        <div className={styles.circleEmptySmall2}>
          <div className={styles.circleSolidSmall} />
          <div className={styles.circleSolidNormal} />
          <div className={styles.circleSolidLarge} />
        </div>
        <div className={styles.circleEmptySmall3}>
          <div className={styles.circleSolidSmall} />
          <div className={styles.circleSolidNormal} />
          <div className={styles.circleSolidLarge} />
          <div className={styles.circleSolidSmallTwo} />
        </div>
        <div className={styles.circleEmptySmall4} />
      </div>
    
    );
  }
}
export default CircleTurn
