/* eslint-disable react/no-unescaped-entities */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/7/25
 */
import React, { PureComponent } from 'react';
import {Select, Icon, Form} from 'antd';
import style from './specialConditions.less';

const {Option} = Select;
class TwoLayerSelector extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      childList:[],
      selected:true,
    }
  };

  /**
   * 二维筛选框第一层选择
   * @param value
   */
  selectFist=value=>{
    const {selectorData }= this.props;
    if(selectorData!==undefined&&selectorData.value.data.length!==0){
      let childList = [];
      for (let index of selectorData.value.data){
        if(index.id===value) {
          childList = index.child
          break;
        }
      }
      this.setState({
        childList,
        selected:false
      })
    }
  }


  render(){
    const {selected,childList}= this.state;
    const {selectorData,form}= this.props
    const size=window.screen.width>1869?"large":"default";
    const optionList = [];
    const optionData = selectorData.value.data;
    if(optionData.length!==0){
      optionData.forEach(selectItem=>{
        optionList.push(<Option key={selectItem.id}>{selectItem.name}</Option>)
      })
    }
    const secOption=[];
    if(childList.length!==0){
      childList.forEach(secItem=>{
        secOption.push(<Option key={secItem.id}>{secItem.name}</Option>)
      })
    }
    return (
      <div className={style.proList} key={selectorData.id}>
        <div style={{width:'50%'}}>
          <Form.Item label={selectorData.name}>
            {form.getFieldDecorator(selectorData.id)(
              <Select
                onChange={this.selectFist}
                showSearch
                size={size}
                placeholder="请选择"
                style={{width:'100%'}}
                suffixIcon={<Icon type="caret-down" />}
              >
                {optionList}
              </Select>
            )}
          </Form.Item>
        </div>
        <div style={{width:'50%'}}>
          <Form.Item label={selectorData.value.childName}>
            {form.getFieldDecorator(selectorData.value.childId)(
              <Select
                disabled={selected}
                showSearch
                size={size}
                placeholder="请选择"
                style={{width:'100%'}}
                suffixIcon={<Icon type="caret-down" />}
              >
                {secOption}
              </Select>
            )}
          </Form.Item>
        </div>
      </div>
    )
  }

}
export default TwoLayerSelector;
