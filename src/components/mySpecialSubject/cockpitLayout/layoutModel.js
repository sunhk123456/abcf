/**
 * @Description: 布局弹窗组件
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/8
 */

import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import iconFont from '@/icon/Icons/iconfont';


import styles from "./layoutModel.less";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

class LayoutModel extends PureComponent {

  static defaultProps = {
    LayoutModelData : [
      [
        {
          column:"1",
          span:"3",
          content:"布局1/2"
        },
        {
          column:"2",
          span:"3",
          content:"布局1/2"
        },
      ],
      [
        {
          column:"1",
          span:"2",
          content:"布局1/3"
        },
        {
          column:"2",
          span:"4",
          content:"布局2/3"
        },
      ],
      [
        {
          column:"1",
          span:"4",
          content:"布局2/3"
        },
        {
          column:"2",
          span:"2",
          content:"布局1/3"
        },
      ],
      [
        {
          column:"1",
          span:"2",
          content:"布局1/3"
        },
        {
          column:"2",
          span:"2",
          content:"布局1/3"
        },
        {
          column:"3",
          span:"2",
          content:"布局1/3"
        },
      ],
      [
        {
          column:"1",
          span:"6",
          content:"布局1/1"
        }
      ],
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      rowDom:[], // 布局dom
      selectLayout:0, // 选中的布局 默认第一个
    }
  }

  componentDidMount() {
    this.layoutHandle();
  }


  btnHandle =(type)=>{
    const { selectLayout } = this.state;
    const {callBackSelectLayout,LayoutModelData} = this.props;
    let layoutArr = [];
    if(type){
      layoutArr = LayoutModelData[selectLayout]
    }
    callBackSelectLayout(type,layoutArr);
  };

  /**
   * @date: 2020/5/8
   * @author 风信子
   * @Description: 方法说明 选着布局类型
   * @method 方法名 rowClickHandle
   * @param {int} 参数名 rowIndex 参数说明 选中的索引
   */
  rowClickHandle = (rowIndex)=>{
    this.setState({selectLayout:rowIndex},()=>{this.layoutHandle();})
  };

  /**
   * @date: 2020/5/8
   * @author 风信子
   * @Description: 方法说明 页面布局
   * @method 方法名 layoutHandle
   */
  layoutHandle =()=>{
    const {LayoutModelData} = this.props;
    const {selectLayout} = this.state;
    const rowDom = LayoutModelData.map((rowItem,rowIndex)=>{
      const columnDom = rowItem.map((columnItem,columnIndex)=>{
        const {content,span,column} = columnItem;
        const widthColumn = (parseInt(span,10)/6)*100;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${column}_${columnIndex}_column`} className={styles.column} style={{width:`${widthColumn}%`}}>
            <span className={styles.redIcon} />
            {content}
          </div>
        )
      });

      return (
        <div
          className={styles.row}
          // eslint-disable-next-line react/no-array-index-key
          key={rowIndex}
          style={selectLayout === rowIndex ? {borderColor: "#C91717"} : null}
          onClick={()=>this.rowClickHandle(rowIndex)}
        >
          {columnDom}
        </div>
      )
    });
    this.setState({rowDom})
  };

  render() {
    const {rowDom} = this.state;
    return (
      <div className={styles.layoutModel}>
        <div className={styles.popSelectType}>
          <div className={styles.title}>
            布局类型选择
            <IconFont className={styles.close} type="icon-delete" onClick={()=>this.btnHandle(false)} />
          </div>
          <div className={styles.content}>
            {rowDom}
          </div>
          <div className={styles.btnContent}>
            <Button onClick={()=>this.btnHandle(false)}>取消</Button>
            <Button type="red" onClick={()=>this.btnHandle(true)} className={styles.btnStyle}>确定</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LayoutModel;
