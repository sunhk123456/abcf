/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/7/19
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import { Table, Tooltip } from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"; // 下载当前
import EarlyWarning from "../DayOverView/earlyWarning";

import styles from "./foldTable.less"

@connect(
  ({
     analyseSpecialModel,
     IndexConfigModels,
     proCityModels
   }) => ({
    proCityModels,
    conditionValue: analyseSpecialModel.conditionValue, // 查询时，用户输入筛选条件
    conditionName: analyseSpecialModel.conditionName, // 查询时，用户输入筛选条件
    conditionNameList: analyseSpecialModel.conditionNameList, // 查询时，用户输入筛选条件
    saveIndexConfig:IndexConfigModels.saveIndexConfig, // 指标配置选中的指标
    date: analyseSpecialModel.date, // 日期
  })
)
class FoldTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thIdArr:[], // 存表头的id  方便记录列顺序  下载使用
      tableWidth:0,   // 表格的宽度
      handleColumns:[],
      handleTableData:[],
    };
    this.refFoldTable = React.createRef();
  }


  componentDidMount() {
    const {onRef, tableData} = this.props;
    if(onRef){
      onRef(this);
    }
    if(Object.keys(tableData).length > 0){
      this.handleThData();
      this.handleTbodyData();
    }
  }

  componentDidUpdate(prevProps) {
    const {tableData} = this.props;
    if(!isEqual(tableData,prevProps.tableData) && Object.keys(tableData).length > 0){
      this.handleThData();
      this.handleTbodyData();
    }
  }

  jsonHandle=()=>{
    const {conditionNameList,titleName,date,proCityModels} = this.props;
    const {handleColumns, handleTableData} = this.state;
    const {selectCity:{cityName},selectPro:{proName}} = proCityModels;
    const conditionValue = [];
    conditionNameList.forEach((item)=>{
      if(item.type === "date" && item.value.length === 0){
        conditionValue.push([item.key,date])
      }else if(item.type === "provId"  && item.value.length === 0){
        conditionValue.push([item.key,proName])
      } else if(item.type === "cityId" && item.value.length === 0){
        conditionValue.push([item.key,cityName])
      } else {
        conditionValue.push([item.key,...item.value])
      }

    });
    // const IndexConfig = [];
    // saveIndexConfig.forEach((item)=>{
    //   IndexConfig.push(item.indexName);
    // });
    // conditionValue.push(["指标配置",...IndexConfig])
    const condition = {
      name: `${titleName}`,
      value: [
        ["专题名称:", titleName],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const arrHeader = [];  // 表头内容 包含关联表格的id 单位
    const headerName = []; // 表头名称
    handleColumns.forEach((item)=>{
      if(item.children && item.children.length > 0){
        item.children.forEach((childrenItem)=>{
          arrHeader.push({id:childrenItem.id,name:`${item.title}/${childrenItem.nameTitle}`,unit: childrenItem.unit})
        })
      }else {
        arrHeader.push({id:item.id,name:item.nameTitle,unit: item.unit})
      }
    });
    arrHeader.forEach((item)=>{
      headerName.push(`${item.name}${item.unit==="-"?"":`(${item.unit})`}`)
    });

    const table = {
      title: [
        headerName
      ],
      value: this.handleTbodyDataFun(handleTableData,arrHeader)
    };
    return {
      fileName: `${titleName}-数据表`,
      condition,
      table
    };
  };

  // 下载数据处理
  handleTbodyDataFun = (handleTbodyData,arrHeader) =>{
    const downArr = [];
    const forTree = (data) =>{
      data.forEach((dataItem)=>{
        const itemTrArr = [];
        arrHeader.forEach((headerItem)=>{
          itemTrArr.push(dataItem[headerItem.id])
        });
        downArr.push(itemTrArr);
        if(dataItem.children){
          forTree(dataItem.children);
        }
      })
    };
    forTree(handleTbodyData);
    return downArr;
  };


  /**
   * @date: 2019/7/24
   * @author 风信子
   * @Description: 表体数据处理
   * @method handleThData
   */
  handleTbodyData(){
    const {tableData:{tBodyData}} = this.props;
    /**
     * 利用递归格式化每个节点
     */
    const formatTree = ((items, parentId) =>{
      const result = [];
      if (!items[parentId]) {
        return result;
      }

      for (const t of items[parentId]) {
        t.key = `${t.pId}${t.id}`;
        const children = formatTree(items, t.id);
        t.isChildren = false;
        if(children.length > 0 ){
          t.isChildren = true;
          t.children = children;
        }
        result.push(t);
      }
      return result;
    });
    const getTrees = ((list, parentId) =>{
      const items= {};
      // 获取每个节点的直属子节点，记住是直属，不是所有子节点
      for (let i = 0; i < list.length; i += 1) {
        const key = list[i].pId;
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
      }
      return  formatTree(items, parentId);
    });
    const tBodyData2 = [...tBodyData];
    const handleTableData = getTrees(tBodyData2,"#root#");
    this.setState({handleTableData})
  }

  /**
   * @date: 2019/7/24
   * @author 风信子
   * @Description: 表头数据处理
   * @method handleThData
   */
  handleThData(){
    const {tableType, tableData:{thData}} = this.props;
    const thIdArr = [];
    let dimensionId = ""; // 记录维度id  用于获取维度名称
    const dimensionWidth = 250; // 维度宽度
    let dimensionNum = 0; // 维度个数
    let tdWidth = 200;  // 表格td宽
    const substrLen = 13; // 截取字体长度 和维度宽度有关联

    const thColumns = thData.filter((item)=>item.levelPId !== "-1");
    const foldTableDivWidth = this.refFoldTable.current.clientWidth;
    const isTableX = (thColumns.length*tdWidth+dimensionWidth) > foldTableDivWidth;
    /**
     * 利用递归格式化每个节点
     */
    const formatTree = ((items, parentId) =>{
      const result = [];
      if (!items[parentId]) {
        return result;
      }
      for (const t of items[parentId]) {
        const children = formatTree(items, t.levelId);
        if(children.length !== 0){
          t.children = children;
        }
        // 判断是否有子元素，如果没有关联表格数据字段
        if(!t.children){
          t.dataIndex = t.id;
          t.key = t.id;
          thIdArr.push(t.id);
          t.nameTitle = t.title;
          if(t.isDimension === "1"){ // 判断是否为首列
            t.fixed = 'left';
            if(isTableX){
              t.width = dimensionWidth;
            }else if(foldTableDivWidth - (thColumns.length*tdWidth)-17 > 350) {
              t.width = dimensionWidth;
              tdWidth = (foldTableDivWidth - dimensionWidth)/thColumns.length
            }else {
              t.width = foldTableDivWidth - (thColumns.length*tdWidth)-17;
            }
            dimensionId = t.id;
            dimensionNum += 1;
            t.render =(text,record)=>{
              if(isTableX){
                let substrLenCopy = substrLen;
                if(record.pId === "#root#"){
                  if(record.isChildren){
                    substrLenCopy = substrLen;
                  }else {
                    substrLenCopy = substrLen+2;
                  }
                }else if(record.isChildren){
                  substrLenCopy = substrLen-4;
                }else {
                  substrLenCopy = substrLen-2;
                }
                let textCopy = text;
                if(text.length > substrLenCopy){
                  textCopy = `${text.substr(0,substrLenCopy)}...`
                }
                return (
                  <Tooltip title={text} placement="bottomLeft" overlayClassName={styles.titleSpecialDetail}>
                    <span className={styles.columns1}>{textCopy}</span>
                  </Tooltip>
                )
              }
              return (<span className={styles.columns1}>{text}</span>)
            }
          }else {
            let indexName = t.title;
            if(tableType === "0"){
              thData.forEach((itemTh)=>{
                if(itemTh.id === t.id && itemTh.levelPId !== t.id){
                  indexName = itemTh.title
                }
              })
            }
            t.title = tableType === "0" ? t.title : `${t.title}(${t.unit})`;
            t.width = tdWidth;
            // eslint-disable-next-line
            t.render = (text, record) => {
              const {warning} = record;
              let warningDom = (<span className={t.isClick === "1" && text !== "-"  ? styles.textPointer : ""} onClick={()=> t.isClick === "1" && this.clickfun(text, record, t.id, indexName, dimensionId)}>{text}</span>);
              // 添加预警信息
              warning.forEach((item) =>{
                if(item.warningId === t.id){
                  warningDom = (
                    <Tooltip placement="bottom" title={(<EarlyWarning warningLevel={item.warningLevel} desc={item.desc} />)} overlayClassName={styles.warningTip}>
                      <span className={t.isClick === "1" && text !== "-" ? styles.textPointer : ""} onClick={()=> t.isClick === "1" && this.clickfun(text, record, t.id, indexName, dimensionId)}>{text}</span>
                      <span className={styles.classColorName}>*</span>
                    </Tooltip>
                  )
                }
              });
              return warningDom;
            }
          }
        }
        result.push(t);
      }
      return result;
    });
    const getTrees = ((list, parentId) =>{
      const items= {};
      // 获取每个节点的直属子节点，记住是直属，不是所有子节点
      for (let i = 0; i < list.length; i += 1) {
        const key = list[i].levelPId;
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
      }
      return  formatTree(items, parentId);
    });
    const thData2 = [...thData];
    const handleColumns = getTrees(thData2,"-1");
    this.setState({handleColumns,thIdArr,tableWidth:isTableX ? (thIdArr.length-dimensionNum)*tdWidth+dimensionWidth : "100%"})
  }


  /**
   * @date: 2019/7/24
   * @author 风信子
   * @Description: 表格点击事件
   * @method clickfun
   * @param {text} 参数： 选中的内容
   * @param {record} 参数： 行数据
   * @param {indexId} 参数： 指标id
   * @return {返回值类型} 返回值说明
   */
  clickfun(text, record, indexId, indexName,dimensionThId){
    if(text !== "-"){
      const {conditionValue,date,conditionName,conditionNameList,callBackTableCondition} = this.props;
      const {dimensionId} = record;
      // const conditionNameListHandle = [];
      let indexConfigId = ""; // 记录指标配置的id
      const popTitle = {
        indexName,
        dimensionName: record[dimensionThId]
      };
      conditionName.forEach((item)=>{
        if(item.idMold === "indexConfig"){
          indexConfigId = item.id;
        }
      });
      // 处理筛选条件值 表格中的条件覆盖 控件中的筛选条件
      const conditionValueHandle = conditionValue.map((item)=>{
        const itemValue = {...item};
        for(const itemKey in itemValue){
          if(Object.prototype.hasOwnProperty.call(itemValue, itemKey)){ // 判断是否是对象自身的属性，而不包含继承自原型链上的属性
            // 请求数据条件同步
            itemValue[itemKey] = dimensionId[itemKey] ? [dimensionId[itemKey].id] : itemValue[itemKey];
            if(indexConfigId === itemKey){
              itemValue[indexConfigId] = [indexId];
            }
          }
        }
        return itemValue;
      });
      const conditionNameListHandle = conditionNameList.map((item)=>{
        const itemName = {...item};
        // 下载数据条件同步
        if(itemName.type === "date" && itemName.value.length === 0){
          itemName.value = [date];
        }else {
          itemName.value = dimensionId[itemName.id] ? ([dimensionId[itemName.id].name !== "" ? dimensionId[itemName.id].name : dimensionId[itemName.id].id]) : itemName.value;
          if(indexConfigId === itemName.id){
            itemName.value = [indexName];
          }
        }

        return itemName;
      });
      callBackTableCondition(conditionValueHandle,conditionNameListHandle,popTitle);
    }
  }

  /**
   * @date: 2019/8/7
   * @author 风信子
   * @Description: 表格下载
   * @method handleDownload
   */
  handleDownload(){
    DownloadFile(this.jsonHandle());
  }

  render() {
    const {handleColumns, handleTableData, tableWidth} = this.state;
    return (
      <div className={styles.foldTable} ref={this.refFoldTable}>
        <Table
          bordered
          columns={handleColumns}
          rowClassName={styles.trStyle}
          dataSource={handleTableData}
          scroll={{ x: tableWidth, y: "55vh" }}
          pagination={false}
        />
      </div>
    )
  }
}


export default FoldTable;
