/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/11/6
 */

import React, {PureComponent} from 'react';
import styles from './numberBrand.less';

class NumberBrand extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number:[0,1,2,3,4,5,6,7,8,9]
    }
    this.contentItemRef = React.createRef();
  }

  componentDidMount() {
    // setTimeout(()=>{
      this.handleAnimation();
    // },2000)
  }

  componentDidUpdate(prevProps) {
    const {peopleData:{value}} = this.props;
    if(value !== prevProps.value){
      this.handleAnimation();
    }
  }

  handleAnimation(){
    const {peopleData:{value}} = this.props;
    value.split("").forEach((numberItem, numberIndex)=>{
      const top = numberItem*60;
      const itemDom = this.contentItemRef.current.children[numberIndex].childNodes[0];
      itemDom.style.top = `-${top}px`;
      // itemDom.style.transitionDuration = `${numberItem}s`;
    })

  }

  render() {
    const {number} = this.state;
    const {peopleData:{value, name, unit}} = this.props;
    const brandContent =  value.split("").map((item, contentIndex)=>{
      const numberItmeDom = number.map((numberItme,index)=>(<div className={styles.numberItem} key={`${numberItme}_${index+1}`}>{numberItme}</div>))
      return (
        <div key={`${contentIndex+1}`} className={styles.contentItem}>
          <div className={styles.contentItem2}>
            {numberItmeDom}
          </div>
        </div>
      )
    })

    return (
      <div className={styles.numberBrand}>
        <div className={styles.name}>{name}</div>
        <div className={styles.numberContent} ref={this.contentItemRef}>
          {brandContent}
          <div className={styles.contentItem}>
            <div className={styles.contentItem2}>
              <div className={styles.numberItemUnit}>{unit}</div>
            </div>
          </div>
        </div>
        <div className={styles.name}>{name}</div>
      </div>
    )
  }
}

export default NumberBrand;
