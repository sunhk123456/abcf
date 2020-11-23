/* eslint-disable prefer-const,prefer-destructuring,object-shorthand,array-callback-return,prefer-template,no-lonely-if,no-unused-vars,no-plusplus,dot-notation,arrow-body-style */
/**
 *   xingxiaodong 20190227
 *   移动业务计费收入分析专题表格组件
 * */
import React, { PureComponent, Fragment } from 'react';
import {Table,Button } from 'antd';
import EmbedLineChart from "../Echart/specialTableEmbedLineChart/specialTableEmbedLineChart";
import EmbedHistogram from "../Echart/specialTableEmbedHistogram/specialTableEmbedHistogram";
import styles from './analysisTable.less';

class AnalysisTable extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      tableData:null,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {tableData}=nextProps
    if (tableData && tableData !== prevState.tableData) {
      return {
        tableData,
      };
    }
    return null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const {tableData}=this.state
  //   if(tableData !== prevState.tableData){
  //     console.log("组件tableData更新")
  //     console.log(tableData)
  //     console.log("------")
  //   }
  // }

  // 拼接单元格内特殊位置的样式，（值为正或负，相应为绿色增长，或是红色下降）

  rowClassNameHandle=(record)=> {
    let foldTableCss2 = styles;
    let format = record.format; // 判断颜色
    let classColorName = ""; // classname的拼接
    if(record.value3.substr(0,1)==="-"){
      let trRed = "trRed" + 3;
      classColorName += styles[trRed] + " ";
    }
    else if(record.value3.substr(0,1)!=="-"){
      let trGreen = "trGreen" + 3;
      classColorName += styles[trGreen] + " ";
    }
    if(record.value4.substr(0,1)==="-"){
      let trRed = "trRed" + 4;
      classColorName += styles[trRed] + " ";
    }
    else if(record.value4.substr(0,1)!=="-"){
      let trGreen = "trGreen" + 4;
      classColorName += styles[trGreen] + " ";
    }
    return classColorName + styles["trStyle"];
  }

  render() {
    const {tableData}=this.state;
    let columns=[];
    if (tableData!==null&&tableData.thData&&tableData.thData.length>0) {
      let i=0; // 用于循环表格的数据长度
      let j=0;  // 用于循环表格某一条数据的kpiValues长度
      for(i=0;i<tableData.tbodyData.length;i++){
        for(j=0;j<tableData.tbodyData[i].kpiValues.length;j++){
          tableData.tbodyData[i]["value"+j]=tableData.tbodyData[i].kpiValues[j];
        }
      }
      let thData = tableData.thData; // 表头数据

      columns = [
        {
          title: thData[0],
          dataIndex: "kpiName",
          key: "kpiName",
           width:'30%',
          render: text => (
            <span title={text} style={{paddingLeft:17}}>
              {text}
            </span>
          ),
        },
        {
          title: thData[1],
          dataIndex: "unit",
          key: "unit",
          align:'center',
           width:'15%',
        }
      ];
      // console.log("tableData");
      // console.log(tableData);
      thData.map((data, index) => {
        let classColorName = "tdColor" + (index - 2);
        // if(index>1){
        //   columns.push({
        //     title: data,
        //     dataIndex: "value" + (index - 2),
        //     key: "value" + (index - 2),
        //     align:'center',
        //     className: styles[classColorName],
        //     width:55/thData.length+"%",
        //
        //     render: (text, record) => {
        //       console.log("text,record");
        //       console.log(text);
        //       console.log(record);
        //       let ecahetDom = null;
        //       const{lineChartData,histogramData}=record
        //       if(index===2){
        //         ecahetDom=(<EmbedLineChart data={lineChartData} />)
        //       }
        //       if(index===3){
        //         ecahetDom=(<EmbedHistogram data={histogramData} />)
        //       }
        //       return (
        //         <div className={styles.valueContent}>
        //           <span className={styles[classColorName]} style={{width:100}}>{text}</span>
        //           {ecahetDom}
        //         </div>)
        //     }
        //
        //   })
        // }

        if(index===2){

          columns.push({
            title: data,
            dataIndex: "value" + (index - 2),
            key: "value" + (index - 2),
            align:'center',
            className: styles[classColorName],
            width:55/thData.length+"%",
            render: text => (
              <span title={text}>
                {text}
              </span>
            ),
          });
          columns.push({
            title: "",
            dataIndex: "lineChartData",
            key: "valueLine",
            align:'left',
            render: (text,record,xindex) => (
              <div style={{height:50,width: 60,paddingTop:5,position:"relative"}}>
                <EmbedLineChart
                  data={record.lineChartData}
                />
              </div>
            ),
          });
        }
        else if(index===3){
          columns.push({
            title: data,
            dataIndex: "value" + (index - 2),
            key: "value" + (index - 2),
            align:'center',
            width:55/thData.length+"%",
            render: text => (
              <span title={text}>
                {text}
              </span>
            ),
          });
          columns.push({
            title: "",
            dataIndex: "histogramData",
            key: "valueHistogram",
            align:'center',
            width:55/thData.length+"%",
            render: (text,record,xindex) =>{
              return(
                <div style={{height:50,paddingTop:5,position:"relative"}}>
                  <EmbedHistogram data={text} />
                </div>
              )
            }
          });
        }
        else if(index===5||index===6){
          columns.push({
            title: data,
            dataIndex: "value" + (index - 2),
            key: "value" + (index - 2),
            align:'center',
            className: styles[classColorName],
            width:55/thData.length+"%",
          });
        }
        else if(index===4) {
          columns.push({
            title: data,
            dataIndex: "value" + (index - 2),
            key: "value" + (index - 2),
            align:'center',
            width:55/thData.length+"%",
          });
        }
        else {
          console.info(columns);
        }
      });
    } else {
      columns= null;
    }
    return(
      <Fragment>
        <div className={styles.foldTable}>
          {tableData!==null&&
          <Table
            columns={columns}
            pagination={false}
            rowClassName={record=>{return this.rowClassNameHandle(record);}}
            dataSource={tableData.tbodyData}
            scroll={{y:'50vh'}}
          />
          }
        </div>
      </Fragment>
    )
  }
}
export default AnalysisTable
