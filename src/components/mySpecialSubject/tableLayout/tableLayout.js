/**
 * @Description: 表格型布局
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/23
 */

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import isEqual from 'lodash/isEqual';
import { connect } from 'dva';
import {handleDownloadTableObjectValue} from "@/utils/tool"; // 工具方法
import TableSubassembly from "./tableSubassembly";
import FontSizeEchart from '@/components/ProductView/fontSizeEchart';

import styles from "./tableLayout.less";
import TableAreaEchart from './tableAreaEchart';
import DownloadFile from '@/utils/downloadFile';
import MySpecialLineEchart from './tableLineEchart';

const fontsize = FontSizeEchart();

@connect(
  (
    {mySpecialSubjectModels,proCityModels}
  )=>(
    {
      mySpecialSubjectModels,
      proCityModels,
      date:mySpecialSubjectModels.date,
      selectSpecial:mySpecialSubjectModels.selectSpecial,
      dateType:mySpecialSubjectModels.selectSpecial.dateType,
      markType:mySpecialSubjectModels.selectSpecial.id,
      selectPro:proCityModels.selectPro,
      selectCity:proCityModels.selectCity,
      tableData:mySpecialSubjectModels.tableData,
      tableTimeEchartOne:mySpecialSubjectModels.tableTimeEchartOne,
      tableAreaEchartOne:mySpecialSubjectModels.tableAreaEchartOne,
      moduleId:mySpecialSubjectModels.moduleId,
      queryCondition:mySpecialSubjectModels.queryCondition,
      chartCondition:mySpecialSubjectModels.chartCondition,
      status:mySpecialSubjectModels.status,

    }
  )
)
class TableLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    const {onRef}=this.props;
    onRef(this); // 把子组件this传给父组件
  }

  componentWillMount() {

  }

  componentDidMount() {
    const {selectSpecial,moduleId,status}=this.props;
    const tableParams={
      "specialType":"table",
      dateType:selectSpecial.dateType,
      markType:selectSpecial.id,
      moduleId,
      date:"",
      status,
      provId:"",
      cityId:""
    };
    this.getTableData(tableParams)
  }

  componentDidUpdate(prevProps) {
    const {selectSpecial,moduleId,status}=this.props;
    if(!isEqual(selectSpecial.id,prevProps.selectSpecial.id)){
      // 更新我的表格
      const tableParams={
        "specialType":"table",
        dateType:selectSpecial.dateType,
        markType:selectSpecial.id,
        moduleId,
        date:"",
        status,
        provId:"",
        cityId:""
      };
      this.getTableData(tableParams)
    }
  }

  // 请求表格数据
  // 注意在该组件的父组件中，也有调用此方法，改动时需注意考虑。
  getTableData=(params)=>{
    const {dispatch,dateType,markType,date,selectPro,selectCity,moduleId,status}=this.props;
    const defaultParams={
      "specialType":"table",
      dateType,
      markType,
      date,
      status,
      moduleId,
      "provId":selectPro.proId,
      "cityId":selectCity.cityId
    };
    dispatch({
      type:"mySpecialSubjectModels/getTableData",
      payload:params || defaultParams,
      callback:(response)=>{
        const {thData,tbodyData}=response;
        let thName="";
        let indexName="";
        if(thData&&thData.length>2){
          thName=thData[2].title
        }
        if(tbodyData&&tbodyData.length>0){
          indexName=tbodyData[0].kpiName.value
        }

        dispatch({
          type:"mySpecialSubjectModels/setChartCondition",
          payload:{
            indexName,
            thName,
          },
        });
      }
    });
    const chartParams=params || defaultParams;
    const  thId=chartParams.dateType==="D"?"":"";
    const newChartParams=Object.assign({},chartParams,{
      "specialType":"table",
      "indexId":"",
      "valueType":thId,
      status,
    });
    this.child.getTableTimeEchartData(newChartParams,thId);
    this.child.getTableAreaEchartData(newChartParams,thId);
  };

  onRef = (ref) => {
    this.child = ref
  };

  /**
   * @date: 2020/4/27
   * @author 风信子
   * @Description: 方法说明 处理下载任务
   * @method 方法名 editHandle
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  download =()=>{
    DownloadFile(this.jsonHandle());
  };

  jsonHandle=()=>{
    const {selectSpecial,queryCondition,tableData:{thData,tbodyData}} = this.props;
    const {date,selectPro,selectCity}=queryCondition;
    const downloadTbodyKey=thData.map((item)=>(item.id));
    const tableTitle=thData.map((item)=>(item.title));
    const tableValue=handleDownloadTableObjectValue(tbodyData,downloadTbodyKey);
    const table = {
      title: [
        tableTitle
      ],
      value: tableValue

    };
    const condition = {
      name: `数据指标分析`,
      value: [
        ["专题名称:", selectSpecial.name],
        ["账期", date],
        ["省分", selectPro.proName],
        ["地市", selectCity.cityName],
      ],
    };
    return {
      fileName: `${selectSpecial.name}--数据指标分析`,
      condition,
      table
    };
  };

  render() {
    const {tableData,tableTimeEchartOne,tableAreaEchartOne,queryCondition,chartCondition,status,selectSpecial}=this.props;
    const {titleSize}=fontsize;
    const {date,selectPro,selectCity}=queryCondition;
    const {indexName,thName}=chartCondition;
    const downloadData={
      specialName: selectSpecial.name,
      conditionValue:[
         ["账期", date],
         ["省分", selectPro.proName],
         ["地市", selectCity.cityName],
         ["指标名称", indexName],
         ["维度", thName],
      ]
    };
    return (
      <div className={styles.tableLayout}>
        <div className={styles.tableContent}>
          <div className={styles.tableTitle}>
            <span className={styles.tableTitleName} style={{fontSize:`${titleSize}px`}}>数据指标分析</span>
            {
              status==="current" && (
                <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
                  <div><Icon type="download" /></div>
                  <div>下载</div>
                </div>
              )
            }

          </div>
          <TableSubassembly tableData={tableData} onRef={this.onRef} />
        </div>
        <div className={styles.ecahrtContent}>
          <div className={styles.region}>
            <div className={styles.chartWrapper}>
              {tableAreaEchartOne.chartX && <TableAreaEchart chartData={tableAreaEchartOne} downloadData={status==="current"&&downloadData} />}
            </div>
          </div>
          <div className={styles.time}>
            <div className={styles.chartWrapper}>
              {tableTimeEchartOne.chartX && <MySpecialLineEchart newDownload background="rgba(247, 248, 252, 1)" chartData={tableTimeEchartOne} downloadData={status==="current"&&downloadData} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TableLayout;
