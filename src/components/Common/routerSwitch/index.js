/**
 *
 * title: productFeatures.js
 *
 * description: 地址切换组件
 *
 * author: xingxiaodong
 *
 * date 2019/3/28
 *
 */

import React, { Fragment, PureComponent } from 'react';
import router from 'umi/router';
import styles from "./index.less"

class RouterSwitch extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      isShow:false
    }
  }

  onClicked=(dateType)=>{
    if(dateType==="1"){
      router.push(`/dayOverView`)
    }
    if(dateType==="2"){
      router.push(`/MonthOverView`)
    }
  }

  close=()=>{
    this.setState({
      isShow:false
    })
  }

  show=()=>{
    this.setState({
      isShow:true
    })
  }

  render() {
    const{isShow}=this.state
    return(
      <Fragment>
        <span className={styles.page} onFocus={this.show} onMouseEnter={this.show} onMouseLeave={this.close}>
          <span className={styles.title}>
            切换
          </span>
          <div className={isShow?styles.titleHover:styles.none}>
            <p onClick={()=>{this.onClicked("1")}}>日运营总览</p>
            <p onClick={()=>{this.onClicked("2")}}>月运营总览</p>
          </div>
        </span>

      </Fragment>);
  }
}
export default RouterSwitch
