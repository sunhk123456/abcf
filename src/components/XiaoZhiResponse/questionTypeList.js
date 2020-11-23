/**
 * @Description: 问题列表组件
 *
 * @author: 风信子
 *
 * @date: 2019/9/11
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";

import { Icon } from 'antd';
import styles from "./questionTypeList.less";


@connect(({ xiaozhiModels }) => ({
  xiaozhiModels,
}))
class QuestionTypeList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectItem:{}, // 处理选中的 问题列表
    }
  }

  componentDidMount() {

  }

  /**
   * @date: 2019/9/11
   * @author 风信子
   * @Description: 方法描述 修改input值
   * @method 方法名 inputQuestionFun
   * @param {string} 参数：valueText 参数描述：输入的值
  */
  inputQuestionFun(valueText){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/updataInputQuestion',
      payload: valueText,
    });
  }

  /**
   * @date: 2019/9/11
   * @author 风信子
   * @Description: 方法描述 确定事件
   * @method 方法名 defineFun
  */
  defineFun(){
    const {selectItem} = this.state;
    const {dispatch, callBackQueryQuestion, xiaozhiModels:{inputQuestion, selectTypeList}} = this.props;
    if(selectItem.name === inputQuestion){
      dispatch({
        type: 'xiaozhiModels/updataSelectQuestionList',
        payload: selectItem,
      });
      dispatch({
        type: 'xiaozhiModels/addUserChatInfo',
        payload:{
          value: `${selectTypeList.typeName}：${inputQuestion}`,
          questionState: 2
        }
      });
      callBackQueryQuestion(selectItem, 2)
    }
    dispatch({
      type: 'xiaozhiModels/updataQuestionListShow',
      payload: false,
    });
  }

  /**
   * @date: 2019/9/11
   * @author 风信子
   * @Description: 方法描述 处理选中的 问题列表
   * @method 方法名 questionList
   * @param {object} 参数：item 参数描述：选中项
   * @return {返回值类型} 返回值说明
  */
  questionList(item){
    const {dispatch} = this.props;
    dispatch({
      type: 'xiaozhiModels/updataInputQuestion',
      payload: item.name,
    });
    this.setState({selectItem: item});
  }

  render() {
    const {xiaozhiModels} = this.props;
    const {fillerQuestionList,inputQuestion, questionListShow } = xiaozhiModels;

    const questionListDom = fillerQuestionList.map((item)=>(<li onClick={()=>this.questionList(item)} key={item.id}>{item.name}</li>))

    return (
      <div className={styles.questionTypeList} style={{top: questionListShow ? "0px" : "100%" }}>
        <div className={styles.inputDefine}>
          <input className={styles.inputQ} onChange={(e)=>this.inputQuestionFun(e.target.value)} value={inputQuestion} type="text" />
          <span className={styles.iconClose} onClick={()=>this.inputQuestionFun("")}>
            <Icon type="close-circle" theme="filled" />
          </span>
          <span className={styles.defineQ} onClick={()=>this.defineFun()}>确定</span>
        </div>
        <ul className={styles.qList}>
          {questionListDom}
        </ul>
      </div>
    )
  }
}

export default QuestionTypeList;
