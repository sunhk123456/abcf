/**
 * @Description: 专题类型选择
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/21
 */

import React, { PureComponent } from 'react';
import { Button, Icon, Radio, message } from 'antd';
import {APIURL_MYSPECIALSUBJECT_IMG} from "@/services/webSocketUrl"
import styles from "./selectType.less";
import iconFont from '@/icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});


class SelectType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      specialType:[
        {
        id:"cockpit",
        name:"驾驶舱型"
        },
        {
          id:"table",
          name:"表格型"
        }
      ],
      radioValue:"cockpit", // 选中的类型
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  onChangeRadio=(e)=>{
    this.setState({
      radioValue:  e.target.value,
    })
  };

  /**
   * @date: 2020/4/22
   * @author 风信子
   * @Description: 方法说明
   * @method 方法名
   * @param {boolean} 参数名 type 参数说明 点击类型 确定 ture 取消和关闭 false
   * @return {返回值类型} 返回值说明
   */
  btnHandle(type){
    const { radioValue } = this.state;
    const {callBackBtn} = this.props;
    if(type){
      if(radioValue === ""){
        message.error("请选择！");
        return null;
      }
    }
    callBackBtn(type,radioValue);
    return null;
  }

  render() {
    const {specialType,radioValue} = this.state;
    const specialTypeDom = specialType.map((item)=>(
      <div className={styles.itme} key={item.id}>
        <div className={styles.itemRadio}>
          <Radio.Group onChange={this.onChangeRadio} value={radioValue}>
            <Radio value={item.id}>{item.name}</Radio>
          </Radio.Group>
        </div>
        <img className={styles.itemImg} src={`${APIURL_MYSPECIALSUBJECT_IMG}${item.id}.jpg`} alt={item.name} />
      </div>
      ));
    console.log(111,specialTypeDom);
    return (
      <div className={styles.selectType}>
        <div className={styles.popSelectType}>
          <div className={styles.title}>
            专题类型选择
            <IconFont className={styles.close} type="icon-delete" onClick={()=>this.btnHandle(false)} />
          </div>
          <div className={styles.content}>
            {specialTypeDom}
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

export default SelectType;
