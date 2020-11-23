/* eslint-disable no-param-reassign,arrow-body-style,react/no-unused-state,no-else-return,prefer-template,react/destructuring-assignment,no-unused-vars,no-plusplus,array-callback-return,no-lonely-if,consistent-return,prefer-const,object-shorthand,prefer-destructuring,react/jsx-no-bind,react/jsx-tag-spacing,jsx-a11y/mouse-events-have-key-events */
/**
 *
 * title: productOvewView
 *
 * description:  渠道-top5组件
 *
 * @author: guoshengxiang
 *
 * @date 2019/06/10
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import styles from './productEchart.less';

class ChannelViewTop5  extends PureComponent{
  constructor(props){
    super(props);
    this.state={
    }
  };

render(){
  const{chartData,progressColor,tabName}=this.props;
  console.log(chartData)
  const thList=[];
  const trList=[];
  if(Object.keys(chartData).length > 0){
    chartData.thData.map((item,index)=>{
      thList.push(
        <td key={`th${index}`} style={{width:index===0?"10%":index===1?"35%":"55%"}}>{item}</td>
      )
    });
    chartData.tbodyData.map((item,index)=>{
      let lineWidth=0;
      if(chartData.tbodyData[0].value.replace(/,/g,'')>0){
        lineWidth=parseFloat(item.value.replace(/,/g,'')/chartData.tbodyData[0].value.replace(/,/g,''))*100;
      }
      let len=window.screen.width>1870?24:window.screen.width>1101?18:15;
      if(tabName==="渠道评价"){
        len=window.screen.width>1870?12:window.screen.width>1101?8:5;
      }
      const str=item.name.length>len?`${item.name.substr(0,len)}...`:item.name;
      trList.push(
        <tr key={item.id}>
          <td style={{color:index<3?"#C91717":"#1E1E1E"}}>{item.ranking}</td>
          <td title={item.name}>{str}</td>
          <td>
            <div className={styles.progress}>
              <div className={styles.progressBg}><div className={styles.progressContent} style={{backgroundColor:progressColor,width:`${lineWidth}%`}} /></div>
              <div className={styles.progressText}>{item.value}{item.unit}</div>
            </div>
          </td>
        </tr>
      )
    });
  }

  return (
    <div className={styles.ChannelViewTop5}>
      <div className={styles["top5-title"]}>{chartData.title}</div>
      <div className={styles["top5-table"]}>
        <table>
          <tbody>
            <tr className={styles.thList}>{thList}</tr>
            {trList}
          </tbody>
        </table>
      </div>
    </div>
  )
}
}

export default ChannelViewTop5;
