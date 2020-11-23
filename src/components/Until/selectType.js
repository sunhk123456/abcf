/**
 * @Description: 筛选条件组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/3/8
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import styles from "./selectType.less"

@connect(({selectTypeModels}) =>({
  ...selectTypeModels
}))
class SelectType extends PureComponent  {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentDidMount() {
    const {type} = this.props;
    // 此处是拦截专题多次请求的问题， 由于在指标页回退也被拦截了 导致不能加载筛选条件  固注释掉了
    // if(type !== "specialReport"){
    //   this.init();
    // }
    this.init();
  }

  componentDidUpdate(prevProps){
    const { dispatch, markType, requestfalse, tabId, type} = this.props;
    if(type !== "specialReport" && prevProps.markType !== markType && !requestfalse){
      console.log("markType变化请求")
      dispatch({
        type:'selectTypeModels/requestfalse',
      })
      this.init();
    }else if(tabId && prevProps.tabId !== tabId && !requestfalse){
      console.log("tabId变化请求")
      dispatch({
        type:'selectTypeModels/requestfalse',
      })
      this.init();
    }
  }

  init(){
    const { dispatch, type, markType, selectType, tabId = ""} = this.props;
    if(selectType&&selectType.length!==0){
      dispatch({
        type:'selectTypeModels/getSelectTypeFetch2',
        payload:{
          param:{
            typeFetch: type,
            markType,
            tabId
          },
          selectIdData: selectType
        }
      })
    }else {
      dispatch({
        type:'selectTypeModels/getSelectTypeFetch',
        payload:{
          param:{
            typeFetch: type,
            markType,
            tabId
          }
        }
      })
    }
  }

  /**
   * @date: 2019/3/11
   * @author liuxiuqian
   * @Description: 处理选中方法
   * @method seclectHandle
   * @param {screenTypeId} 父id
   * @param {item2} 当前选中id name
   */
  seclectHandle(screenTypeId,item2){
    const {dispatch} = this.props;
    const {sid, sname} = item2;
    dispatch({
      type:'selectTypeModels/setSelectData',
      payload:{
        selectIdData: this.handleSelectIdData(screenTypeId,sid),
        selectNameData: this.handleSelectNameData(screenTypeId,sid, sname)
      }
    })
  }


  /**
   * @date: 2019/3/11
   * @author liuxiuqian
   * @Description: 选中name数据处理
   * @method handleSelectNameData
   * @param {screenTypeId} 父id
   * @param {sid} 当前选中id
   * @param {sname} 当前选中name
   * @return 返回数组
   */
  handleSelectNameData(screenTypeId, sid, sname){
    const {selectNameData} = this.props;
    const upDateSelectNameData = [];
    selectNameData.forEach((item)=>{
      let snameArr = [];
      if(item.screenTypeId === screenTypeId){
        const objItem = {
          screenTypeId: item.screenTypeId,
          screenTypeName: item.screenTypeName
        };
        let oldSnameArr = item.value[0].sid === "-1" ? [] : item.value;
        if(sid === "-1"){
          snameArr.push({sid:"-1",sname: "全部"})
        }else {
          if(!item.value.find((value)=> value.sid === sid)){
            oldSnameArr.push({sid, sname})
          }else if(oldSnameArr.length > 1){
            oldSnameArr.splice(oldSnameArr.findIndex((value)=>value.sid === sid),1)
          }else {
            oldSnameArr = [{sid:"-1",sname: "全部"}];
          }
          snameArr = oldSnameArr;
        }
        objItem.value = snameArr
        upDateSelectNameData.push(objItem);
      }else {
        upDateSelectNameData.push(item);
      }
    })
    return upDateSelectNameData;
  }

  /**
   * @date: 2019/3/11
   * @author liuxiuqian
   * @Description: 选中id数据处理
   * @method handleSelectIdData
   * @param {screenTypeId} 父id
   * @param {sid} 当前选中id
   * @return 返回数组
   */
  handleSelectIdData(screenTypeId,sid){
    const {selectIdData} = this.props;
    const upDateselectIdData = []
    selectIdData.forEach((item)=>{
      let sidArr = [];
      if(screenTypeId === Object.keys(item)[0]){
        // oldSidArr 用于记录非全部id 当等于-1 时清空
        let oldSidArr = item[screenTypeId][0] === "-1" ? [] : item[screenTypeId];
        if(sid === "-1"){
          sidArr.push(sid)
        }else {
          // 判断是否存在
          if(!oldSidArr.includes(sid)){
            oldSidArr.push(sid);
          }else if(oldSidArr.length > 1) {
            oldSidArr.splice(oldSidArr.indexOf(sid),1)
          }else {
            oldSidArr = ["-1"]
          }
          sidArr = oldSidArr
        }
        const obj = {};
        obj[screenTypeId] = sidArr
        upDateselectIdData.push(obj)
      }else {
        upDateselectIdData.push(item)
      }
    })
    return upDateselectIdData
  }

  render() {
    const {conditionData, selectIdData} = this.props;
    const conditionList = conditionData.map((item)=>{
      // const activeArr = selectIdData[index][item.screenTypeId]
      let activeArr = [];
      selectIdData.forEach((selectIdItem) =>{
        if(selectIdItem[item.screenTypeId]){
          activeArr = selectIdItem[item.screenTypeId]
        }
      })
      const liDom = item.values.map((item2)=>{
        let activeStyle = null;
        if(activeArr.includes(item2.sid)){
          activeStyle = "active";
        }
        return (<li key={item2.sid} title={item2.sname} onClick={()=>this.seclectHandle(item.screenTypeId,item2)} className={styles[activeStyle]}>{item2.sname}</li>);
      })
      return (
        <div key={item.screenTypeId} className={styles.ListDiv}>
          <span className={styles.listName}>{item.screenTypeName}:</span>
          <ul className={styles.listItem}>
            {liDom}
          </ul>
        </div>
      );
    })

    return (
      <div className={styles.container}>
        {conditionList}
      </div>
    )
  }
}

export default SelectType;
