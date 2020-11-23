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
 *   frontEndSorter                   // 是否具有前端排序功能  true/false  sorter与frontEndSorter同时存在使用sorter排序
 *\/>
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Table, Icon, message } from 'antd';
// import router from 'umi/router';
import {routerState} from "@/utils/tool"; // 工具方法
import className from "classnames";
import DownloadFile from "@/utils/downloadFile"
import styles from "./productTable.less";


@connect(({ productViewModels,proCityModels, loading }) => ({
  productViewModels,
  proCityModels,
  loading: loading.models.productViewModels,
}))
class ProductTable extends PureComponent {
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
      frontEndDataIndex: "", // 数据列前端排序记录
      frontEndType: "", // 排序类型前端排序记录
    }
  }

  componentDidMount(){
    const {onRef, tableData} = this.props;
    if(onRef){
      onRef(this);
    }
    if(tableData.thData.length > 0 ){
      this.handleTableDataFun(tableData.tbodyData);
    }
  }


  componentDidUpdate(prevProps){
    const {tableData} = this.props;
    if(!isEqual(prevProps.tableData,tableData) && tableData.thData.length > 0 ){
      this.handleTableDataFun(tableData.tbodyData);
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

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  }

  defaultNullData = (value) =>{
    if(typeof value === "string"){
      return value === "" ? ["全部"]: [value];
    }if(value instanceof Array){
      if(value.length > 0){
        const arrValue = [];
        value.forEach((item)=>{
          arrValue.push(item === "" ? ["全部"]: item);
        })
        return arrValue;
      }
      return  ["全部"];
    }
    return [value];
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 刷新数据表
   * @method refreshEchart
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  refreshEchart(record,index, fixedColumn){
    const {callBackRefreshEchart, markType} = this.props;
    const {cityId,classifyId,provId,productId,productName,thData,channelId,developMonth,channelName, sourceSystemId } = record;
    let params = {
    }
    if(markType ==="productView"){
      params = {
        cityId,
        productList:productId,
        productClass:[classifyId],
        productName,
        productId:productId.join(','),
        provId,
        indexId:thData[index].kpiId,
        indexName: thData[index].name,
        sourceSystem: [sourceSystemId], // 系统来源
      }
    }else if(markType === "developTable"){
      params = {
        developMonth,
        indexId:thData[index].kpiId,
        indexName: thData[index].name
      }
    }else if(markType === "channelView"){
      params = {
        indexId:thData[index].kpiId,
        channelClass: channelId,
        channelName,
        provId,
        cityId,
        indexName: thData[index].name
      }
    }
    if(record[`value${index-fixedColumn}`] !== "-"){
      callBackRefreshEchart(params);
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
      sorterTableData:[], // 前端排序表格数据记录
      frontEndDataIndex: "", // 数据列前端排序记录
      frontEndType: "", // 排序类型前端排序记录
    })
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 跳转下以页面
   * @method JumpPage
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  JumpPage(record){
    const {JumpPage, productViewModels} = this.props;
    const {saveIndexConfig, conditionValue} = productViewModels;
    const {cityId,classifyId,provId,productId,productName,sourceSystemId} = record;
    const indexConfingId = [];
    saveIndexConfig.forEach((item)=>{
      indexConfingId.push(item.indexId)
    })
    let params = {}
    // 表格中自带参数
    const params2 = {
      cityId,
      productClass:[classifyId],
      productName,
      provId,
      productId:productId.join(','),
      sourceSystem: [sourceSystemId], // 系统来源
    }
    // echart 专用
    const params3 = {
      indexId:"",
      productList:productId
    }
    if(Object.keys(conditionValue).length > 0){
      const conditionValue2 = {...conditionValue};
      params = Object.assign(conditionValue2,params2)
    }else {
      const defaultParams = {
        date: "",
        provId: "",
        cityId: "",
        productClass: [],
        productId: "",
        productName: "",
        clientType: [],
        channelType: [],
        fusion: [],
        goodNum: [],
        mainAssociate: [],
        associateNum: [],
        feeLevel: [],
        monthFee: [],
        indexType: []
      }
      params = Object.assign(defaultParams,params2)
    }
    // 是否具备跳转页面功能
    if(JumpPage){
      const state={
        params,
        paramsEChart:params3,
        saveIndexConfig
      }
      routerState("/productFeatures",state,"productFeaturesState")
      // router.push({
      //   pathname: '/productFeatures',
      //   state: {
      //     params,
      //     paramsEChart:params3,
      //     saveIndexConfig
      //   },
      // });
    }
  }

  /**
   * @date: 2019/6/4
   * @author liuxiuqian
   * @Description: 处理后台的表格数据格式
   * @method handleTableDataFun
   */
  handleTableDataFun(tbodyData){
    const {openShow,sortType,sortKpiId,frontEndType,frontEndDataIndex} = this.state;
    const {openFunction, markType, tableData, refreshMake,sorter, frontEndSorter} = this.props;
    const { thData, currentNum} = tableData;
    const handleTableData = [];
    const tdWidth = 180; // 正常的td宽度
    const minTdWidth = 150; // 省份 产品分类的宽度
    const smallTdWidth = 100;
    const productWidth = 300; // 产品的宽度
    const tdPadding = 21; // td的左右pdding和boder之和
    let fixedColumn = 0; // 除values之外的列数
    let tableWidth = 0; // 表格宽度
    tbodyData.forEach((item, index)=>{
      const trObj = {
        ...item,
        proAndCityName:`${item.proName}-${item.cityName}`,
        thData
      }
      item.values.forEach((itemValues, indexValues)=>{
        trObj[`value${indexValues}`] = itemValues;
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
    let columns = [];
    if(markType ==="productView"){
      fixedColumn = 4;
      columns = [
        {
          title:()=><div className={styles.thStyle}>{thData[0].name}</div>,
          dataIndex: 'proAndCityName',
          width: minTdWidth,
          fixed:true,
          key:`proAndCityName${currentNum}`,
          render:(text)=><div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        },
        {
          title: ()=><div className={styles.thStyle}>{thData[1].name}</div>,
          dataIndex: 'classifyName',
          width: minTdWidth,
          fixed:true,
          key:`classifyName${currentNum}`,
          render:(text)=><div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        },
        {
          title: ()=><div className={styles.thStyle}>{thData[2].name}</div>,
          dataIndex: 'productName',
          width: productWidth,
          fixed:true,
          key:`productName${currentNum}`,
          render:(text, record)=><div style={{width: `${productWidth-tdPadding}px`}} className={styles.JumpPageDom} title={text} onClick={()=>this.JumpPage(record)}>{text}</div>
        },
        {
          title: thData[3].name,
          dataIndex: 'sourceSystemName',
          width: smallTdWidth,
          fixed:true,
          key:`productNum${currentNum}`,
          render:(text)=><div style={{width: `${smallTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        },
        // {
        //   title: thData[3].name,
        //   dataIndex: 'productNum',
        //   width: tdWidth,
        //   key:`productNum${currentNum}`,
        //   render:(text)=><div style={{width: `${tdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        // }
      ];
      tableWidth = minTdWidth*2+smallTdWidth+tdWidth*(thData.length-fixedColumn)+productWidth;
    }else if(markType === "developTable"){
      fixedColumn = 1;
      columns = [
        {
          title:()=><div className={styles.thStyle}>{thData[0].name}</div>,
          dataIndex: 'developMonth',
          width: minTdWidth,
          fixed:true,
          key:`developMonth${currentNum}`,
          render:(text)=><div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        }
      ];
      tableWidth = minTdWidth+tdWidth*(thData.length-fixedColumn);
    }else if(markType === "channelView"){
      fixedColumn = 2;
      columns = [
        {
          title:()=><div className={styles.thStyle}>{thData[0].name}</div>,
          dataIndex: 'proAndCityName',
          width: minTdWidth,
          fixed:true,
          key:`proAndCityName${currentNum}`,
          render:(text)=><div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        },
        {
          title:()=><div className={styles.thStyle}>{thData[1].name}</div>,
          dataIndex: 'channelName',
          width: minTdWidth,
          fixed:true,
          key:`channelName${currentNum}`,
          render:(text)=><div style={{width: `${minTdWidth-tdPadding}px`}} className={styles.trDiv} title={text}>{text}</div>
        }
      ];
      tableWidth = minTdWidth*2+tdWidth*(thData.length-fixedColumn);
    }
    thData.forEach((item, index)=>{
      if(index > (fixedColumn-1)){
        columns.push({
          title: () => {
            if(item.unit !== ""){
              return (
                <div className={styles.thStyle}>
                  <div className={styles.thContent} style={{width: `${tdWidth-tdPadding-((sorter && (!item.noIndex || item.noIndex !== "true")) || frontEndSorter ? 20 : 0)}px`}}>
                    <div className={styles.tableTitleName} title={item.name}>{item.name}</div>
                    <div className={styles.thUnit}>{item.unit}</div>
                  </div>
                  {/* 后端排序功能 */}
                  {
                    sorter && (!item.noIndex || item.noIndex !== "true") && (
                      <div className={styles.sort}>
                        <Icon style={{color:sortType === "asc" && sortKpiId === item.kpiId && "#e80c0c"}} onClick={()=>{this.sorterTable("asc", item.kpiId)}} className={styles.sortIcon} type="caret-up" />
                        <Icon style={{color:sortType === "desc" && sortKpiId === item.kpiId && "#e80c0c"}} onClick={()=>{this.sorterTable("desc", item.kpiId)}} className={styles.sortIcon} type="caret-down" />
                      </div>
                    )
                  }
                  {/* 前端排序功能 */}
                  {
                    !sorter && frontEndSorter && (
                      <div className={styles.sort}>
                        <Icon style={{color:frontEndType === "asc" && frontEndDataIndex === index-fixedColumn && "#e80c0c"}} onClick={()=>{this.frontEndSorterTable("asc", index-fixedColumn)}} className={styles.sortIcon} type="caret-up" />
                        <Icon style={{color:frontEndType === "desc" && frontEndDataIndex === index-fixedColumn && "#e80c0c"}} onClick={()=>{this.frontEndSorterTable("desc", index-fixedColumn)}} className={styles.sortIcon} type="caret-down" />
                      </div>
                    )
                  }
                </div>
              )
            }
            return (<div className={styles.thStyle}>{item.name}</div>)
          },
          dataIndex: `value${index-fixedColumn}`,
          width: tdWidth,
          key: `value${index-fixedColumn}${currentNum}`,
          sortOrder: true,
          render:(text, record)=>{
            const {markJump} = record.thData[index];
            if(markJump === "true" && refreshMake){
              return (<div style={{width: `${tdWidth-tdPadding}px`}} className={className(styles.refreshEchartDom,styles.alignRight)} title={text} onClick={()=>{this.refreshEchart(record, index, fixedColumn)}}>{text}</div>)
            }
            return <div style={{width: `${tdWidth-tdPadding}px`}} className={className(styles.trDiv,styles.alignRight)} title={text}>{text}</div>;
          }
        })
      }
    })

    this.setState({handleTableData, columns, tableWidth,pageValue:""});
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 处理展开与折叠
   * @method handleOpen
   * @param  openShow 展开合并标志
   */
  handleOpen(openShow){
    const {frontEndSorter, tableData:{tbodyData}} = this.props;
    const {frontEndDataIndex, sorterTableData} = this.state;
    this.setState({openShow},()=>{
      if(frontEndSorter&& frontEndDataIndex !== "" && sorterTableData.length > 0){
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
    const {callBackNum, tableData,frontEndSorter} = this.props;
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
    if(frontEndSorter){
      this.setState({frontEndDataIndex:"",frontEndType:""})
    }
  }

  /**
   * @date: 2019/6/5
   * @author liuxiuqian
   * @Description: 表格下载当前
   * @method handleDownload
   */
  handleDownload(){
    DownloadFile(this.jsonHandle());
  }

  /**
   * @date: 2019/8/1
   * @author 风信子
   * @Description: 下载数据处理
   * @method jsonHandle
  */
  jsonHandle(){
    const { tableData, productViewModels, proCityModels, defaultParams, markType, frontEndSorter}=this.props;
    const {sorterTableData} = this.state;
    const {selectPro, selectCity} = proCityModels;
    const {title,tableName,params} = defaultParams;
    const {saveIndexConfig, conditionName, date} = productViewModels;
    const {tbodyData, thData} = tableData;
    const arrConditionValue = [];
    const saveIndexConfigName =  saveIndexConfig.map((item)=>item.indexName);
    if(markType === "productView"){
      if(Object.keys(conditionName).length > 5){
        // eslint-disable-next-line
        for(const key in conditionName){
          const conditionValue = conditionName[key];
          const defaultConditionValue = this.defaultNullData(conditionValue);
          arrConditionValue.push([key,...defaultConditionValue]);
        }
        if(saveIndexConfigName.length > 0){
          arrConditionValue.push(["指标配置",...saveIndexConfigName]);
        }else {
          arrConditionValue.push(["指标配置", "全部"]);
        }

      }else {
        params.unshift(...[{
          name: "账期",
          value: date
        },{
          name: "省分",
          value: selectPro.proName
        },{
          name: "地市",
          value: selectCity.cityName
        }])
        params.forEach((item)=>{
          const defaultConditionValue = this.defaultNullData(item.value);
          arrConditionValue.push([item.name,...defaultConditionValue]);
        })
        if(saveIndexConfigName.length > 0){
          arrConditionValue.push(["指标配置",...saveIndexConfigName]);
        }else {
          arrConditionValue.push(["指标配置", "全部"]);
        }

      }
    }else if(markType === "channelView"){
      params.forEach((item)=>{
        const defaultConditionValue = this.defaultNullData(item.value);
        arrConditionValue.push([item.name,...defaultConditionValue]);
      })
    }

    const condition = {
      name:  tableName,
      value: [
        ["筛选条件"],
        ...arrConditionValue
      ],
    };

    const arrThName = [];// 表头数组
    const arrTbodyValue = [];// 表体数据

    thData.forEach((item)=>{
      if(item.unit !== ""){
        arrThName.push(`${item.name}(${item.unit})`);
      }else {
        arrThName.push(item.name);
      }
    })
    if(frontEndSorter && sorterTableData.length > 0){
      sorterTableData.forEach((item)=>{
        const arrTdValue = [];
        const {proName,cityName,classifyName,productName,channelName,sourceSystemName,values} = item;
        if(markType === "productView"){
          arrTdValue.push(`${proName}-${cityName}`);
          arrTdValue.push(classifyName);
          arrTdValue.push(productName);
          arrTdValue.push(sourceSystemName);
        }else if(markType === "channelView"){
          arrTdValue.push(`${proName}-${cityName}`);
          arrTdValue.push(channelName);
        }
        arrTdValue.push(...values);
        arrTbodyValue.push(arrTdValue)
      })
    }else {
      tbodyData.forEach((item)=>{
        const arrTdValue = [];
        const {proName,cityName,classifyName,productName,channelName,sourceSystemName,values} = item;
        if(markType === "productView"){
          arrTdValue.push(`${proName}-${cityName}`);
          arrTdValue.push(classifyName);
          arrTdValue.push(productName);
          arrTdValue.push(sourceSystemName);
        }else if(markType === "channelView"){
          arrTdValue.push(`${proName}-${cityName}`);
          arrTdValue.push(channelName);
        }
        arrTdValue.push(...values);
        arrTbodyValue.push(arrTdValue)
      })
    }

    const  table = {
      title: [
        arrThName
      ],
      value: arrTbodyValue
    }
    const newJson = {
      fileName: `${title}-${tableName}`,
      condition,
      table
    }
    return newJson;
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

  /**
   * @date: 2019/8/1
   * @author 风信子
   * @Description: 前端排序
   * @method frontEndSorterTable
   * @param {string} 参数：type 参数描述：排序方式 asc是指定列按升序排列，desc则是指定列按降序排列
   * @param {int} 参数：index 参数描述：数据索引值
  */
  frontEndSorterTable(type, index){
    const {tableData:{tbodyData}} = this.props;
    const sorterTableData = tbodyData.sort((a,b)=>{
      const A = this.formatData(a.values[index]);
      const B = this.formatData(b.values[index]);
      if(type === "asc"){
        return A - B;
      }
      return B - A;
    })
    this.setState({sorterTableData,frontEndType:type,frontEndDataIndex:index},()=>{
      this.handleTableDataFun(sorterTableData)
    });
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
export default ProductTable;
