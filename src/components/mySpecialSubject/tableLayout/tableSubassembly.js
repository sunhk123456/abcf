/**
 * @Description: 表格组件
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/27
 */

import React, { PureComponent } from 'react';
import { Table, Tooltip } from 'antd';
import isEqual from 'lodash/isEqual';
import classNanes from "classnames";
import { connect } from 'dva';

import styles from "./tableSubassembly.less";



@connect(
  (
    {mySpecialSubjectModels,proCityModels}
  )=>(
    {
      mySpecialSubjectModels,
      proCityModels,
      mySpecialList:mySpecialSubjectModels.mySpecialList,
      maxDate:mySpecialSubjectModels.maxDate,
      date:mySpecialSubjectModels.date,
      selectSpecial:mySpecialSubjectModels.selectSpecial,
      dateType:mySpecialSubjectModels.selectSpecial.dateType,
      markType:mySpecialSubjectModels.selectSpecial.id,
      status:mySpecialSubjectModels.status,
      selectPro:proCityModels.selectPro,
      selectCity:proCityModels.selectCity,
      moduleId:mySpecialSubjectModels.moduleId,
      tableTimeEchart:mySpecialSubjectModels.tableTimeEchart,
      tableAreaEchart:mySpecialSubjectModels.tableAreaEchart,
    }
  )
)
class TableSubassembly extends PureComponent {
  static  defaultProps = {
    tableData:{
      "tableName":"",
      "thData":[],
      "tbodyData":[]
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      tableLineId:"" // 上次点击的行id
    };
    const {onRef}=this.props;
    onRef(this); // 把子组件this传给父组件

  }

  componentWillMount() {

  }

  componentDidMount() {

    // 首次渲染清空上次点击的行id
    this.setState({
      tableLineId:""
    });
  }

  componentDidUpdate(prevProps) {
    const {tableData} = this.props;
    if(!isEqual(tableData,prevProps.tableData)){
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        tableLineId:""
      });
    }
  }

  // 处理时间趋势图图数据，保存到modules
  handleTimeEchartData=(thId,data)=>{
    let newChart=[];
    let newTableData={};
    let newExample=[];
    let newUnit=[];
    if(data.chartList && data.chartList.length>0){
      newChart=data.chartList[0].chart; // thId 为空时匹配第一个数据
      data.chartList.forEach((item)=>{
        if(item.id===thId){
          newChart=item.chart
        }
      });
    }
    if(data.tableDataList && data.tableDataList.length>0){
      newTableData=data.tableDataList[0].tableData; // thId 为空时匹配第一个数据
      data.tableDataList.forEach((item)=>{
        if(item.id===thId){
          newTableData=item.tableData
        }
      });
    }
    if(data.example && data.example.length>0){
      newExample=data.example[0].name; // thId 为空时匹配第一个数据
      newUnit=data.example[0].unit;
      data.example.forEach((item)=>{
        if(item.id===thId){
          newExample=item.name;
          newUnit=item.unit;
        }
      });
    }
    const newData=Object.assign({},data,{
      chart:newChart,
      tableData:newTableData,
      example:[newExample],
      unit:newUnit,
      yName:newUnit,
      title:`${data.title}-${newExample}`
    });
    const {dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/setTableTimeEchartOneData",
      payload:newData,
    });
    return null
  };

  // 处理地域柱状图图数据，保存到modules
  handleAreaEchartData=(thId,data)=>{
    // const resData =  {
    //   "title":"",
    //   "xName":"sddd",
    //   "yName":"sddd",
    //   "chartX":["201803", "201804", "201805", "201806", "201807", "201808"],
    //   "chartList":[
    //     {
    //       "id":"cc",
    //       "chart":[{
    //         "name":"移网",
    //         "value":["11","754","467","754","467","754",],
    //         "unit":"家庭数",
    //         "type":"bar"
    //       }]
    //     }
    //   ]
    // };
   if(Object.keys(data).length>0) {
     let newChart=[];
     if(data.chartList && data.chartList.length>0){
       newChart=data.chartList[0].chart; // thId 为空时匹配第一个数据
       data.chartList.forEach((item)=>{
         if(item.id===thId){
           newChart=item.chart
         }
       });
     }
     const newData=Object.assign({},data,{
       chart:newChart[0].value,
       unit:newChart[0].unit,
       yName:newChart[0].unit,
       example:[newChart[0].name],
       title:`${data.title}-${newChart[0].name}`
     });
     const {dispatch}=this.props;
     dispatch({
       type:"mySpecialSubjectModels/setTableAreaEchartOneData",
       payload:newData,
     });
   }else {
     const {dispatch}=this.props;
     dispatch({
       type:"mySpecialSubjectModels/setTableAreaEchartOneData",
       payload:{},
     });
   }
  };

  // 请求表格专题时间趋势图数据
  getTableTimeEchartData=(params,thId)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/getTableTimeEchartData",
      payload:params,
      callback:(response)=>{
        this.handleTimeEchartData(thId,response)
      }
    })
  };

  // 请求表格专题地域柱状图数据
  getTableAreaEchartData=(params,thId)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/getTableAreaEchartData",
      payload:params,
      callback:(response)=>{
        this.handleAreaEchartData(thId,response)
      }
    })
  };


  /**
   * @date: 2020/4/27
   * @author 风信子
   * @Description: 方法说明 点击th处理 请求右侧数据
   * @method 方法名 thHandle
   * @param {string} 参数名 id 参数说明 指标id
   * @param {string} 参数名 thId 参数说明 类型id
   */
  thHandle=(record,thItem,condition,text)=>{
    if(text.value==='-'){
      return null
    }
    const {id,kpiName}=record;
    const indexName=kpiName.value;
    const {dispatch}=this.props;
    // 点击表格设置筛选条件
    dispatch({
      type:"mySpecialSubjectModels/setChartCondition",
      payload:{
        indexName,
        thName: thItem.title
      },
    });
    const thId=thItem.id;
    // setChartCondition
    const {tableLineId}=this.state;
    if(tableLineId!==id){
      // 请求echart图数据
      const params=Object.assign({},condition,{
        "specialType":"table",
        "indexId":id,
        "valueType":thId,
      });
      this.getTableTimeEchartData(params,thId);
      this.getTableAreaEchartData(params,thId);
    }else if(tableLineId===id){
      const {tableTimeEchart,tableAreaEchart}=this.props;
      this.handleTimeEchartData(thId,tableTimeEchart);
      this.handleAreaEchartData(thId,tableAreaEchart);
    }
    this.setState({
      tableLineId:id
    });
    return null
  };



  render() {
    const {tableData:{thData,tbodyData},dateType} = this.props;
    const screenWidth = window.screen.width;
    let tdWidth = "";
    let scrollY = 305;
    if(screenWidth > 1800){
      scrollY = "57vh";
    }else if(screenWidth > 1400 && screenWidth < 1800){
      scrollY = "56vh";
    }
    const columns = thData.map((thItem, thIndex)=>{
      if(thIndex === 1){
        tdWidth = "10%";
      }else if(thIndex === 2){
        tdWidth = "20%";
      }else if(thIndex === 5){
        tdWidth = "12%";
      }else if(thIndex === 3){
        if(dateType === "D"){
          tdWidth = "20%";
        }else {
          tdWidth = "12%";
        }
      }else if(thIndex === 4){
        if(dateType === "D"){
          tdWidth = "12%";
        }else {
          tdWidth = "20%";
        }
      }
      return ({
        title: thItem.title,
        dataIndex: thItem.id,
        key: thItem.id,
        width: tdWidth,
        align:thIndex !== 0 ? "center" : "left",
        render: (text, record) => {
          const {value,isClick,color} = text;
          const {desc,condition} = record;
          return thIndex === 0 ? (
            <Tooltip title={desc} placement="bottomLeft" overlayClassName={styles.mySpecialSubjectTableDetail}>
              <div className={styles.tableText} title={value}>{value}</div>
            </Tooltip>
          ) : (
            <div
              style={isClick === "1" && text.value!=="-" ? {"cursor": "pointer"} : null}
              className={classNanes(styles[`classColor${color}`])}
              onClick={isClick === "1" ? ()=>this.thHandle(record,thItem,condition,text) : null}
              title={value}
            >
              {value}
            </div>
          )
        },
      })
    });
    return (
      <div className={styles.tableSubassembly}>
        <Table
          columns={columns}
          dataSource={tbodyData}
          rowClassName={styles.trStyle}
          pagination={false}
          scroll={{y: scrollY}}
        />
      </div>
    );
  }
}

export default TableSubassembly;
