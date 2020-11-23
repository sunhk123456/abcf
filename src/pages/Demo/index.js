import React, { PureComponent } from 'react';
import styles from './index.less'
import CircleTurn from '../../components/Common/cssCircleTurn';

class Demo extends PureComponent {
  constructor(props){
    super(props);
    this.state={

    };
  }


  componentDidMount() {

    // let start=null;
    // const step=(timestamp)=>{
    //   console.log(111);
    //   console.log(timestamp);
    //   const element = document.getElementById('SomeElementYouWantToAnimate');
    //   if (!start) start = timestamp;
    //   const progress = timestamp - start;
    //   console.log(progress);
    //   element.style.left = Math.min(progress / 10, 200) + 'px';
    //   if (progress < 2000) {
    //     console.log('-----');
    //     window.requestAnimationFrame(step);
    //   }
    // };
    // requestAnimationFrame(step);
  }



  render() {
    return (
      <div className={styles.page}>
        <div>ttt</div>
      </div>
    );
  }
}
export default Demo
