/**
 * @Description: 产品总览的表格组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/6/4
 *
 *<ProductTable
 *   tableData={tableData}            // 表格数据 Object
 *   defaultParams={defaultParams}    // 下载时的默认参数  Object
 *   markType="productView"           // 专题id标识  string
 *   onRef={this.productTableRef}     // 父组件绑定ProductTable的this
 *   openFunction                     // 是否具有展开和收起功能  true/false
 *   JumpPage                         // 是否具有跳转页面功能 true/false
 *   refreshMake                      // 否具有刷新echaer组件功能 true/false
 *   callBackRefreshEchart={}         // 刷新echaer组件参数返回
 *   callBackNum={}                   // 下一页页码返回 排序类型 排序指标 三个参数
 *   sorter                           // 是否具有后端排序功能  true/false
 *\/>
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Table, Icon, message } from 'antd';
// import router from 'umi/router';
// import {routerState} from "@/utils/tool"; // 工具方法
import className from "classnames";
// import DownloadFile from "@/utils/downloadFile"
// eslint-disable-next-line
import styles from './buildingViewTable.less';


@connect(({ buildingViewModels,proCityModels, loading }) => ({
  buildingViewModels,
  proCityModels,
  loading: loading.models.buildingViewModels,
}))
class BuildingViewTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      handleTableData:[], // 处理后的表格数据
      openShow: false, // 是否展开，默认不展开
      pageValue:"", // 输入框的页码值
      columns: [], // 表头数据
      sortType: "", // 排序类型
      sortKpiId: "", // 记录排序的指标id
      sorterTableData:[], // 前端排序表格数据记录
      tableWidth:0, // 表格的宽度
    }
  }

  componentDidMount(){
    const {onRef, tableData} = this.props;
    if(onRef){
      onRef(this);
    }
    if(tableData.thData.length > 0 ){
      this.handleTableDataFun(tableData.tbodyData);
      this.handleThData();
    }
  }


  componentDidUpdate(prevProps){
    const {tableData} = this.props;
    if(!isEqual(prevProps.tableData,tableData) && tableData.thData.length > 0 ){
      this.handleTableDataFun(tableData.tbodyData);
      this.handleThData();
    }
  }


  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 输的页码处理
   * @method onChangeValue
   * @param {参数类型} e 获取输入的值
   */
  onChangeValue(e){
    const inputValue = e.target.value;
    const reg = /^[0-9]*$/;
    if(reg.test(inputValue)){
      this.setState({pageValue:inputValue})
    }else {
      message.open({
        content:"输入格式有误请重新输入！",
        duration:2,
        icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
      })
    }
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 刷新数据表
   * @method refreshEchart
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  refreshEchart(record,th,text){
    const {callBackRefreshEchart} = this.props;
    const {provId,cityId,cityName,proName} = record;
    const {tableData:{thData}} = this.props;
    const {name,kpiId,levelPId} = th;
    let thPName = "";
    thData.forEach((item)=>{
      if(item.levelId === levelPId){
        thPName = item.name
      }
    })
    if(text !== "-"){
      const params = {
        provId,
        cityId,
        indexId:[kpiId]
      }
      const tip = {
        cityName,
        proName,
        name,
        thPName
      }
      callBackRefreshEchart(params,tip);
    }

  }

  /**
   * @date: 2019/8/1
   * @author 风信子
   * @Description: 点击查询的时候 父组件调用 清空所有排序状态
   * @method searchReset
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  searchReset(){
    this.setState({
      sortType: "", // 排序类型
      sortKpiId: "", // 记录排序的指标id
    })
  }

  /**
   * @date: 2019/6/4
   * @author liuxiuqian
   * @Description: 处理后台的表格数据格式
   * @method handleTableDataFun
   */
  handleTableDataFun(tbodyData){
    const {openShow} = this.state;
    const {openFunction} = this.props;
    const handleTableData = [];

    tbodyData.forEach((item, index)=>{
      const trObj = {
        ...item
      }
      item.values.forEach((itemValues, indexValues)=>{
        trObj[`value${indexValues+1}`] = itemValues;
      })
      if(openFunction){
        if(openShow){
          handleTableData.push(trObj);
        }else if(index < 2){
          handleTableData.push(trObj);
        }
      }else {
        handleTableData.push(trObj);
      }
    })
    const tableWidth = 2*150+tbodyData[0].values.length*180;
    this.setState({handleTableData,tableWidth,pageValue:""});
  }

  /**
   * @date: 2019/12/9
   * @author 风信子
   * @Description: 处理表头数据
   * @method handleThData
   */
  handleThData(){
    const {tableData:{thData}} = this.props;
    /**
     * 利用递归格式化每个节点
     */
    const formatTree = ((items, parentId) =>{
      const result = [];
      if (!items[parentId]) {
        return result;
      }
      for (const t of items[parentId]) {
        t.title = t.unit === "" ? t.name : `${t.name}（${t.unit}）`;
        const children = formatTree(items, t.levelId);
        if(children.length > 0 ){
          t.children = children;
        }
        // 判断是否有子元素，如果没有关联表格数据字段
        if(!t.children){
          const thObg = this.handleThTitle(t);
          Object.assign(t,thObg);
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
    const columns = getTrees(thData2,"-1");

    this.setState({columns})
  }

  /**
   * @date: 2019/12/9
   * @author 风信子
   * @Description: 处理表头内容
   * @method handleThTitle
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  handleThTitle(th){
    const {sorter,refreshMake} = this.props;
    const {sortType,sortKpiId} = this.state;
    const {id,name,noIndex,unit,kpiId,markJump} = th;
    let isFixed = false; // 是否固定列
    let width = 190; // 正常的td宽度
    // let fixedColumn = 2; // 除values之外的列数
    const minTdWidth = 150; // 省份 地市
    const tdPadding = 21; // td的左右pdding和boder之和
    let title = (<div className={styles.thStyle}>{name}</div>);
    // 判断是否需要固定列
    if(id === "proName" || id === "cityName"){
      isFixed = true;
    }
    // 使用最小列宽的列
    if(id === "proName" || id === "cityName"){
      width = minTdWidth;
    }
    // 是否有排序功能
    if(sorter){
      title = (
        <div className={styles.thStyle}>
          <div className={styles.thContent} style={{width: `${width-tdPadding-(noIndex !== "true" ? 20 : 0)}px`}}>
            <div className={styles.tableTitleName} title={name}>{name}</div>
            <div className={styles.thUnit}>{unit}</div>
          </div>
          {/* 后端排序功能 */}
          {
            noIndex !== "true" && (
              <div className={styles.sort}>
                <Icon style={{color:sortType === "asc" && sortKpiId === kpiId && "#e80c0c"}} onClick={()=>{this.sorterTable("asc", kpiId)}} className={styles.sortIcon} type="caret-up" />
                <Icon style={{color:sortType === "desc" && sortKpiId === kpiId && "#e80c0c"}} onClick={()=>{this.sorterTable("desc", kpiId)}} className={styles.sortIcon} type="caret-down" />
              </div>
            )
          }
        </div>
      )
    }
    const columnsObj = {
      title:()=>title,
      dataIndex: id,
      width,
      fixed:isFixed,
      key:id,
      render:(text,record)=>{
        if(refreshMake && markJump === "true"){
          return (<div style={{width: `${width-tdPadding}px`}} className={className(styles.refreshEchartDom,styles.alignRight)} title={text} onClick={()=>{this.refreshEchart(record,th,text)}}>{text}</div>)
        }
        return (<div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>);
      }
    }
    return columnsObj;
  }


  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 处理展开与折叠
   * @method handleOpen
   * @param  openShow 展开合并标志
   */
  handleOpen(openShow){
    const {tableData:{tbodyData}} = this.props;
    const {sorterTableData} = this.state;
    this.setState({openShow},()=>{
      if(sorterTableData.length > 0){
        this.handleTableDataFun(sorterTableData);
      }else {
        this.handleTableDataFun(tbodyData);
      }
    });
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 处理分页请求
   * @method handlePagination
   * @param {参数类型} make 区分上页下页和跳转页
   * @return {返回值类型} 返回值说明
   */
  handlePagination(make){
    const {pageValue, sortKpiId, sortType } = this.state;
    const {callBackNum, tableData} = this.props;
    const {currentNum, totalPageNum } = tableData;
    let currentNum2 = parseInt(currentNum,10);
    const  totalPageNum2 = parseInt(totalPageNum,10);
    if(make === "left"){
      if(currentNum2 > 1){
        currentNum2 -= 1;
      }else {
        message.open({
          content:"没有上一页了！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }else if(make === "right"){
      if(currentNum2 < totalPageNum2){
        currentNum2 += 1;
      }else {
        message.open({
          content:"没有下一页了！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }else {
      if(pageValue === ""){
        message.open({
          content:"请输入页码！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
      if( parseInt(pageValue,10) > 0 && parseInt(pageValue,10) <= totalPageNum2){
        currentNum2 = pageValue;
      }else {
        message.open({
          content:"页码超出总页数！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }
    callBackNum(currentNum2,sortType, sortKpiId);
  }

  /**
   * @date: 2019/7/31
   * @author 风信子
   * @Description: 后端排序
   * @method sorterTable
   * @param {string} 参数：type 参数描述：排序方式 asc是指定列按升序排列，desc则是指定列按降序排列
   * @param {string} 参数：kpiId 参数描述：指标id
  */
  sorterTable(type, kpiId){
    const {callBackNum} = this.props;
    this.setState({sortType:type,sortKpiId:kpiId});
    callBackNum("1", type, kpiId);
  }

  render() {
    const {handleTableData, openShow, pageValue, columns, tableWidth} = this.state;
    const {openFunction,tableData} = this.props;
    const { totalNum, currentNum, totalPageNum } = tableData;

    // 处理展开折叠
    let bottomContent = null;
    if(openShow){
      bottomContent =  (
        <div className={styles.bottomContent}>
          <div className={styles.pageContent}>
            <span className={styles.leftBtn} onClick={()=>{this.handlePagination("left")}}><Icon type="left-square" /></span>
            <span className={styles.pageText}>{currentNum}/{totalPageNum}</span>
            <span className={styles.rightBtn} onClick={()=>{this.handlePagination("right")}}><Icon type="right-square" /></span>
            <span> <input type="text" value={pageValue} onChange={(e)=>{this.onChangeValue(e)}} className={styles.pageInput} /> </span>
            <span className={styles.btnJump} onClick={()=>{this.handlePagination("Jump")}}>跳转</span>
            <span className={styles.totalNumText}>共{totalNum}记录</span>
          </div>
          <div className={styles.foldContent}><span className={styles.flodBtn} onClick={()=>{this.handleOpen(false)}}>收起<Icon className={styles.foldIcon} type="up-circle" /></span></div>
        </div>)
    }else {
      bottomContent = (
        <div className={styles.bottomContent}>
          <div className={styles.foldContent}><span className={styles.flodBtn} onClick={()=>{this.handleOpen(true)}}>展开<Icon className={styles.foldIcon} type="down-circle" /></span></div>
        </div>)
    }
    return (
      <div className={styles.productTable}>
        <Table
          dataSource={handleTableData}
          rowClassName={styles.trStyle}
          columns={columns}
          scroll={{x:tableWidth}}
          pagination={false}
        />
        {openFunction ? bottomContent : null}
      </div>
    )
  }
}
export default BuildingViewTable;
