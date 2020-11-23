/**
 * @Description: 二级菜单浮出层组件
 *
 * @author: xingxiaodong
 *
 * @date: 2020/2/6
 */

import React, { PureComponent } from 'react';
import ThreeMenuContent from './threeMenuContent'
import styles from "./rightMenuPop.less"

import HotContent from './hotContent';
import QueryInput from './queryInput';

class RightMenuPop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    const {rightMenuPopData}=this.props;
    const {children,id,isHot,searchBox,hotList}=rightMenuPopData;
    console.log("rightMenuPopData")
    console.log(id)
    console.log(rightMenuPopData)
    console.log('hotList',hotList);
    return (
      <div className={styles.page}>
        { searchBox==="true" &&
          <div className={styles.search}>
            <QueryInput twoMenuId={id} />
          </div>}
        { isHot==="true" &&
          <div className={styles.hotContent}>
            <HotContent hotList={hotList} twoMenuId={id} />
          </div>}
        <div className={styles.menuContent}>
          <ThreeMenuContent menuData={children} twoMenuId={id} />
        </div>
      </div>
    );
  }
}

export default RightMenuPop;
