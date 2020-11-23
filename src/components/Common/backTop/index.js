/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 公共组件：回到顶部组件/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author xingxiaodong
 * @date 2019/3/14
 */
import React, { Fragment, PureComponent } from 'react';
import {BackTop,Icon} from 'antd';
import iconFont from '../../../icon/Icons/iconfont';
import styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});


class BackTopComponent extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      showBackTop:true,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps) {
    const {show}=nextProps
    if (show) {
      return {
        showBackTop:show
      };
    }
    return null;
  }



  render(){
    const {showBackTop}=this.state
    return(
      <Fragment>
        {showBackTop?
          <div className={styles.page}>
            <BackTop visibilityHeight={0}>
              <div className={styles.backTopIcon}>
                <IconFont className={styles.iconFont} type="icon-i-back-top" />
              </div>
            </BackTop>
          </div>
          :null}
      </Fragment>
    )
  }
}
export default BackTopComponent
// 使用方法：直接引用此组件则可。<BackTopComponent />


