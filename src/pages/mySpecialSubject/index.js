/**
 * @Description: 我的工作台我的收藏页面
 *
 * @author: 喵帕斯
 *
 * @date: 2020/04/20
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import { Modal } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import MySpecialSubjectApply from '../../components/mySpecialSubject/apply';
import styles from './index.less';



@connect(
  (
    {mySpecialSubjectModels}
  )=>(
    {
      mySpecialSubjectModels,
      specialName: mySpecialSubjectModels.specialName,
      selectIndex: mySpecialSubjectModels.selectIndex,
      moduleId: mySpecialSubjectModels.moduleId,
      titleData: mySpecialSubjectModels.titleData,
      selectSpecial:mySpecialSubjectModels.selectSpecial,
      status:mySpecialSubjectModels.status
     
    }
  )
)
class MySpecialSubject extends PureComponent{
  
  constructor(props){
    super(props);
    this.state={
      index:0,
      item:{}
    };
  }
  
  componentDidMount(){
    this.getTitleData();
  }
  
  // 获取页签数据
  getTitleData=()=>{
    const { dispatch} = this.props;
    const params={
      menuId:"mySpecialSubject"
    };
    dispatch({
      type: `mySpecialSubjectModels/getTitleData`,
      payload: params,
    });
  };
  
  // 切换页签
  setTable=(index,item,status)=>{
    const {dispatch}=this.props;
    if(status!=="current"){
      this.setState({
        changePopVisible:true,
        index,
        item
      })
    }else {
      // 清空当前选中专题
      dispatch({
        type:"mySpecialSubjectModels/setSelectSpecial",
        payload:{"name":"","id":"","dateType":"D","specialType":""}, // 选中的专题列表的名称
      });
      dispatch({
        type: `mySpecialSubjectModels/getModuleId`,
        payload: {
          selectIndex:index,
          moduleId:item.moduleId
        },
      });
  
      
    }

  };
  
  /**
   * @date: 2020/4/29
   * @author 喵帕斯
   * @Description: 方法说明:切换专题提示保存专题弹出层函数
   * @method 方法名 changeButtonFun
   * @param {string}  buttonType 参数说明
   * @return {返回值类型} 返回值说明
   */
  changeButtonFun=(buttonType)=>{
    const {changePopVisible}=this.state;
    const {dispatch}=this.props;
    // 当点击弹窗的确定按钮时
    if(buttonType==='ok'){
      // 关闭弹窗
      this.setState({
        changePopVisible:!changePopVisible  // 关闭弹窗
      });
      dispatch({
        type:"mySpecialSubjectModels/setStatus",
        payload:"current"
      });
      const {index,item}=this.state;
      this.setTable(index,item,"current")
      
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      this.setState({
        changePopVisible:!changePopVisible  // 关闭弹窗
      })
    }
  };
  
  render() {
    const {titleData,selectIndex,specialName,status}=this.props;
    const {changePopVisible}=this.state;
    let tab=null;
    if(titleData){
      tab=titleData.map((item,index)=>
        (
          <div
            key={item.moduleId}
            className={selectIndex === index ? styles.active : styles.tableItem}
            onClick={() => this.setTable(index, item,status)}
          >
            {item.moduleName}
          </div>
        )
      );
    }
    return (
      <PageHeaderWrapper>
        {/* 离开当前专题时提示保存专题弹出层 */}
        <Modal
          title="提示"
          visible={changePopVisible}
          onOk={()=>this.changeButtonFun('ok')}
          onCancel={()=>this.changeButtonFun('cancel')}
          centered
          className={styles.modelClass}
        >
          <div className={styles.confirmText}>
            <span>专题未保存，是否离开？</span>
          </div>
        </Modal>
        <div className={styles.mySpecialSubject}>
          <div className={styles.titleName}>
            {specialName}
          </div>
          <div className={styles.content}>
            <div className={styles.table}>
              {tab}
            </div>
          </div>
          <div className={styles.main}>
            {
              selectIndex===0 && <MySpecialSubjectApply />
            }
            {
              selectIndex===1 && <MySpecialSubjectApply />
            }
         
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
  
}

export default MySpecialSubject;
