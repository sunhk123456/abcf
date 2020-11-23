/**
 * @Description: 单个地域组件
 *
 * @author: 风信子
 *
 * @date: 2019/8/22
 */

import React, {PureComponent} from 'react';
import { connect } from 'dva';
import classnames from "classnames";
import styles from "./singleRegion.less";


@connect(({ singleRegionModel }) => ({
  singleRegionModel
}))
class SingleRegion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDiv: false, // 是否显示下拉
    };
  }

  componentDidMount() {
    document.onclick = this.onblur;
    this.init();
  }

  componentDidUpdate(prevProps) {
    const  {markType} = this.props;
    if(markType !== prevProps.markType){
      this.init();
    }
  }

  onblur =()=>{
    this.setState({showDiv: false});
  }

  init(){
    const {dispatch,dateType, markType} = this.props;
    dispatch({
      type: 'singleRegionModel/singleRegionFetch',
      payload: {
        dateType,
        markType
      }
    });
  }

  /*
  * 显示下拉事件
  * */
  handlePro() {
    this.setState({
      showDiv: true,
    });
  }

  /*
   * 处理选中某个数据
   * index 索引
   *
   * */
  handleProList(index, id, name) {
    const { dispatch } = this.props;
    this.setState({showDiv: false});
    dispatch({
      type: 'singleRegionModel/selectData',
      payload: {
        id,
        name
      }
    });
  }


  render() {
    const { singleRegionModel, titleName="地域" } = this.props;
    const { singleRegionData,selectData } = singleRegionModel;
    const {showDiv} = this.state;
    if (singleRegionData !== undefined && singleRegionData.length > 0) {

      const list = singleRegionData.map((data, index) =>
        <li
          key={data.id}
          title={data.name}
          onClick={e => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation(); // 阻止事件向上传播
            this.handleProList(index, data.id, data.name);
          }}
        >
          {data.name}
        </li>
      );

      return (
        <div className={styles.indexContainer}>
          <span className={styles.name}>{titleName}</span>
          <div
            className={styles.cityFrame}
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              e.stopPropagation(); // 阻止事件向上传播
              this.handlePro();
            }}
          >
            <span className={classnames(styles.FrameName,showDiv?styles.FrameNameActive:styles.FrameNameNoActive)}>{selectData.name}</span>
            <i className={classnames(styles.triangle,showDiv?styles.triangleActive:styles.triangleNoActive)} />
            <div className={classnames(styles.cityList,!showDiv && styles.cityListNone)}>
              <ul className={styles.cityUl}>{list}</ul>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default SingleRegion;
