/* eslint-disable react/no-string-refs,no-param-reassign */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 多选列表组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/3/14
 */
import React from "react";
import { Checkbox,Button } from "antd";
import {connect} from 'dva'
import checkboxStyle from './multiCheckbox.less'


const CheckboxGroup = Checkbox.Group;
@connect(
  ({RangeRelease,loading}) => ({
    RangeRelease,
    loading: loading.models.RangeRelease,

  })
)
class Muticheckbox extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    };
    this.muticheckbox = React.createRef();
  }

  onChange = (checkedValues) => {
    const {RangeRelease} = this.props;
    const {plainOptions} = RangeRelease;
    this.setState({
      checkedList: checkedValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < plainOptions.length),
      checkAll: checkedValues.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    const {RangeRelease} = this.props;
    const {plainOptions} = RangeRelease;
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  submitClick=()=>{
    this.quxiaoClick();
    const {callbackSpecial} = this.props
    const {checkedList}= this.state
    callbackSpecial(checkedList)
  }

  quxiaoClick =()=>{
    this.muticheckbox.current.style.display='none'
  }

  selectClick=()=>{
    this.muticheckbox.current.style.display='block'
  }

  render() {
   const {RangeRelease}= this.props
    const {checkboxList}=RangeRelease
    const   checkboxlist = checkboxList.map((special)=><div><Checkbox name="checkbox" value={special.specialId}>{special.specialName}</Checkbox></div>)
    const {checkedList,indeterminate,checkAll} = this.state;

    return (
      <div className={checkboxStyle.main}>
        <div className={checkboxStyle.out} onClick={this.selectClick}>请选择专题</div>
        <div ref={this.muticheckbox} className={checkboxStyle.show}>
          <div>
            <Checkbox name="checkbox" indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>全选</Checkbox>
          </div>
          <CheckboxGroup value={checkedList} onChange={this.onChange}>
            {checkboxlist}
          </CheckboxGroup>
          <div className={checkboxStyle.button}>
            <Button size="small" onClick={this.quxiaoClick}>取消</Button>
            <Button size="small" onClick={this.submitClick}>确定</Button>
          </div>
        </div>

      </div>
    );
  }
}

export default Muticheckbox;
