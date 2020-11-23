/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key,prefer-const,no-plusplus */
import React,{ PureComponent} from "react";
import styles from './buttonCondition.less';

class ButtonCondition extends PureComponent {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state={
      buttonConditions:data, // 按钮筛选条件
      buttonChoose:[
        [true],[true],[true]
      ], // 按钮的初始选定状态,二维数组代表呈现在页面中的第几行的第几个按钮
      testNum:1, // 用来解决setState的异步刷新问题
    }
  }

componentWillReceiveProps(nextprops){
    const {data}=nextprops;
    this.setState({
      buttonConditions:data, // 按钮筛选条件
    })
}

// 利用给出的按钮筛选条件数据，创造出若干行按钮的样式
  createButtonCondition=(buttonsData,choose)=>{
    let i=0;
    let j=0;
    let buttonChild=[];
    let buttonAll=[];
    for(i=0;i<buttonsData.length;i++){
      for(j=0;j<buttonsData[i].values.length;j++){
        buttonChild.push(
          <span style={{display:'inline-block',cursor:'pointer',textAlign:'center'}} title={i.toString()+j.toString()} className={choose[i][j]===true?styles.btnStyleChoosed:styles.btnStyle} id={buttonsData[i].screenTypeId+buttonsData[i].values[j].sid} onClick={this.onClickButtonCon}>
            {buttonsData[i].values[j].sname}
          </span>
        );
      }
      buttonAll.push(<div className={styles.btnDiv}>{buttonsData[i].screenTypeName+":"}{buttonChild}</div>);
      buttonChild=[];
    }
    return buttonAll;
  }

  // 按钮筛选条件点击
  onClickButtonCon=(e)=>{
    const {buttonChoose,testNum}=this.state;
    let newButtonChoose=buttonChoose;
    let allNotChooseState=false; // 除了全部按钮外的所有按钮存在着选中状态标志
    let i=0;
    let lineNumber=Number(e.target.title.substr(0,1));
    let SpanNumber=Number(e.target.title.substr(1,1));
    if(SpanNumber===0){
      for(i=0;i<newButtonChoose[lineNumber].length;i++){
        if(i===0){
          newButtonChoose[lineNumber][i]=true;
        }
        else {
          newButtonChoose[lineNumber][i]=false;
        }
      }
    }
    else {
      newButtonChoose[lineNumber][SpanNumber] = newButtonChoose[lineNumber][SpanNumber] === true ? "" : true;
      newButtonChoose[lineNumber][0]="";
    }
    for(i=1;i<newButtonChoose[lineNumber].length;i++){
      if(newButtonChoose[lineNumber][i]===true){
        allNotChooseState=true;
      }
    }
    if(allNotChooseState===false){
      newButtonChoose[lineNumber][0]=true;
    }
    this.setState({
      buttonChoose:newButtonChoose,
      testNum:testNum+1
    })
  }

  // 利用当前按钮筛选条件的状态生成当前用于请求接口时的筛选条件格式
  createButtonConditionForSearch=()=>{
    const {buttonChoose,buttonConditions}=this.state;
    let i=0;
    let j=0;
    let k=0;
    let condition=[{1:[]},{2:[]},{3:[]}];
    if(buttonConditions.length>0){
      for(i=0;i<buttonChoose.length;i++){
        for(j=0;j<buttonChoose[i].length;j++){
          if(buttonChoose[i][j]===true){
            condition[i][i+1][k]=buttonConditions[i].values[j].sid;
            k++;
          }
        }
        k=0;
      }
    }
    return condition;
  }

  render() {
  const {buttonConditions,buttonChoose,testNum}=this.state;
    let buttonCondition; // 按钮筛选条件
    buttonCondition=this.createButtonCondition(buttonConditions,buttonChoose);
    this.createButtonConditionForSearch();
    return (
      <div style={{display:'inline-block',width:'80%'}}>
        <span style={{position:'absolute',display:'none'}}>{testNum}</span>
        { buttonCondition}
      </div>
    );
  }
}
export default ButtonCondition;
