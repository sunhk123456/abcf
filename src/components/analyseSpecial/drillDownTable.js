/* eslint-disable */
/**
 * desctiption 下钻型表格组件

 * created by mengyajing

 * date 2019/7/25
 */

import React,{ PureComponent} from "react";
import {connect} from "dva";
import classNames from "classnames";
import {Table,Tooltip,Icon} from "antd";
import DownloadFile from "@/utils/downloadFile"; // 下载当前
import EarlyWarning from "../DayOverView/earlyWarning";
import styles from "./drillDownTable.less";
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
@connect(({
            drillDownTableModel,
            loading,
            proCityModels,
            analyseSpecialModel,
            IndexConfigModels
})=>({
  loading,
  ...drillDownTableModel,
  proCityModels,
  conditionValue: analyseSpecialModel.conditionValue, // 查询时，用户输入筛选条件
  conditionName: analyseSpecialModel.conditionName, // 查询时，用户输入筛选条件
  conditionNameList: analyseSpecialModel.conditionNameList, // 查询时，用户输入筛选条件
  saveIndexConfig:IndexConfigModels.saveIndexConfig, // 指标配置选中的指标
  date: analyseSpecialModel.date, // 日期
  maxDate:analyseSpecialModel.maxDate, // 最大日期
}))
class DrillDownTable extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      // originBodyData:[], // 请求回来的表格体数据
      tBodyData:[],// 处理好的表格数据
      thData:[], // 表格头
      expandedRowKeys:[], // 展开行
      allOpenKey:[],// 展开全部：展开所有指标和下钻无关
      noChildrenKey:[], // 记录非下钻数据没有子元素的id
      drilltBodyData:{},// 存放下钻的数据,key是下钻的kpiId，value是下钻返回的数据
    }
  }

  /**
   *  请求表格的时期    各时期对应的参数
   *  初始化组件时      默认参数：那model里存的
   *  点查询按钮时      获取model里存的参数
   *  点单个指标的下钻  一部分是model里的参数，一部分是点击表格时的参数
   */
  /**
   * 1、初始化和点查询按钮，请求回来数据，对数据做处理，处理成层级（树状）的格式，给Table组件
   * 2、下钻请求的数据不需要做处理，直接存到下钻的对象里。
   */
  componentDidMount(){
    const {onRef} = this.props;
    if(onRef){
      onRef(this);
    }
    // this.initFetch();
  }

  initFetch=(values)=>{
    const {dispatch,condition,markType,dateType} = this.props;
    // const params= {
    //   date: '',
    //   proId: '111',
    //   cityId: ''
    // };

    // console.log('请求表格三参数condition')
    // console.log(this.props)
    // console.log(condition)
    const params= {
      markType,
      dateType,
      condition:values || condition,
      isDrill:false,
      space: "",
    };
    dispatch({
      type:"drillDownTableModel/getDrillDownTableData",
      payload:params,
      callback:(res)=>{
        const treeData = this.handleData(res);
        const tempKeys = this.makeAllOpenKey(treeData);
        const {allOpenKey,noChildrenKey} = tempKeys;
        this.setState({
        //  originBodyData:res.tBodyData,
          thData:res.thData,
          tBodyData:treeData,
          allOpenKey,
          expandedRowKeys:allOpenKey,
          noChildrenKey
        })
      }
    })
  };

  /**
   * 处理表格数据
   * @param resource 原始表格数据
   * @returns {Array} 处理好的，Table组件可接收的数据
   */
  handleData=(resource)=>{
    const tBodyData2 = resource.tBodyData;
    const tBodyData = [...tBodyData2];
    if(!tBodyData){ console.log('tBodyData不存在'); return null}
    const result = {};
    for(let i=0;i<tBodyData.length;i+=1){
      tBodyData[i].key=tBodyData[i].kpiId;// 设置每一行的key值
      // 可能从参数中获取省分id和地市id
      tBodyData[i].realKey = `${tBodyData[i].kpiId}${tBodyData[i].proId}${tBodyData[i].cityId}`;// 用于后续下钻，设置唯一标识
      tBodyData[i].haveExpanded=false; // 设置默认下钻状态为未展开 //xxd 下钻箭头上下方向
      tBodyData[i].drill = false;// 是否为下钻的标志
      const key = tBodyData[i].pId ; // pId 父级ID
      const {kpiValues} = tBodyData[i];
      for(let j=0;j<kpiValues.length;j+=1){
        tBodyData[i][`value${j}`] = kpiValues[j];
      }
      // kpiValues: [{type: "0", value: "-"}, {type: "0", value: "-"}, {type: "0", value: "-"}]
      // 变为
      // value0: {type: "0", value: "-"}
      // value1: {type: "0", value: "-"}
      // value2: {type: "0", value: "-"}
      if(key in result){
        result[key].push(tBodyData[i]);
      }else{
        result[key] = [];
        result[key].push(tBodyData[i]);
      }
    }
    // console.log("result")
    //  console.log(result)
    // {-1:[{pId: "-1"},{pId: "-1"},{pId: "-1"}]}
    return this.tableTreeData(result,'-1');
  };


  /**
   * 递归处理数据为Table可接收的数据
   * @param resource
   * @param parentId
   * @returns {Array}
   */
  tableTreeData=(resource,parentId)=>{
    // {-1:[{pId: "-1"},{pId: "-1"},{pId: "-1"}]}  parentId:-1
    const result = [];
    if(!resource[parentId]){
      return result;
    }
    for(const item of resource[parentId]){
      let space = "";
      for (let i = 0; i < item.space; i+=1) {
        space = `${space}\u3000`; // 加全角空格 增加缩进
      }
      item.space2 = space;
      const childrenData = this.tableTreeData(resource, item.kpiId);
      if (childrenData.length > 0) {
        item.children = childrenData;
      }
      result.push(item);
    }
    return result;
  };

  /**
   * 展开全部
   * @param tbodyData
   * @returns {Array}
   */
  makeAllOpenKey=(tbodyData)=>{
    let k=0;
    let i=0;
    const allOpenKey=[];
    const noChildrenKey = [];
    for(k=0;k<tbodyData.length;k+=1){
      if(tbodyData[k].children!==undefined&&tbodyData[k].children.length>0){
        const oneKey=tbodyData[k].kpiId; // kpiId 指标id
        allOpenKey.push(oneKey);
        const tempKey=this.makeAllOpenKey(tbodyData[k].children);
        const {allOpenKey:secondKey,noChildrenKey:secondNoChildenKey} = tempKey;
        if(secondKey.length>0){
          for(i=0;i<secondKey.length;i+=1){
            allOpenKey.push(secondKey[i]);
          }
        }
        if(secondNoChildenKey.length>0){
          for(i=0;i<secondNoChildenKey.length;i+=1){
            noChildrenKey.push(secondNoChildenKey[i]);
          }
        }
      }else{
        noChildrenKey.push(tbodyData[k].kpiId)
      }
    }
    return {allOpenKey,noChildrenKey};
  };

  /**
   * 处理展开行
   * @param e
   */
  handleExpand=(expanded,record)=>{
    const {expandedRowKeys} = this.state;
    const newExpandedRowKeys = [].concat(expandedRowKeys);
    const {key} = record;
    if(expanded){
      newExpandedRowKeys.push(key);
    }else{
      const index = newExpandedRowKeys.indexOf(key);
      newExpandedRowKeys.splice(index,1);
    }
    this.setState({
      expandedRowKeys: newExpandedRowKeys,
    });
  };

  /**
   * 点击表格内的向下展开箭头图标：下钻
   * @param record
   */
  clickDownShow=(record,event)=> {
    /**
     * 下钻状态默认是未展开 haveExpanded字段为false,标识未展开下钻
     * 先判断是展开下钻，还是收起下钻：
     * 展开下钻: 请求数据
     *           从model中取数
     *           并将此行的haveExpanded字段设为true
     * 收起下钻：删除此指标下的下钻数据，并将此行的haveExpanded字段设为false
      */
    const {haveExpanded,realKey,kpiId,proId,cityId,key,dimensionId,space} = record;
    // 拼接parentKey：指标id+省分id+地市id，赋给下钻的所有行数据
    const parentKey = `${kpiId}${proId}${cityId}`;
    const {dispatch} = this.props;
    const {drilltBodyData,tBodyData,expandedRowKeys,allOpenKey} = this.state;
    let treeData;
    if(!haveExpanded){
      console.log("展开下钻");

      // 展开下钻
      // 已存在下钻数据
      if(drilltBodyData[realKey]){
        console.log("已存在下钻数据");
        // 处理表格数据
        const handledDrillData = drilltBodyData[realKey];
        treeData = this.handleDrillAndTableData(tBodyData,handledDrillData,parentKey,true);
        if(expandedRowKeys.indexOf(kpiId)===-1){
          expandedRowKeys.push(kpiId);
          this.setState({
            tBodyData:treeData,
            expandedRowKeys:[key].concat(expandedRowKeys) // xxd 加了key
          })
        }else{
          this.setState((prevState) =>{
            delete prevState.tBodyData;
            return prevState;
          });
          this.setState({
            tBodyData:treeData,
            expandedRowKeys:[key].concat(expandedRowKeys) // xxd 加了key
          })
        }
      }
      else{
        console.log("不存在下钻数据");
        const drillLevel = key !== realKey?"first":"second";
        const {condition,markType,dateType} = this.props;
        // console.log(condition)
        //  [{…}, {…}, {…}, {…}, {…}, {…}]
        const obj={};
        condition.map((item)=>{
          Object.assign(obj,item);
          return item
        });
        Object.assign(obj,dimensionId);
        const  arr = [];
        for (const  i in obj) {
          const o = {};
          o[i] = obj[i].id?obj[i].id:obj[i];
          arr.push(o)
        }
        const params={
          // drill:true,
          // kpiId,
          // drillLevel,
          // proId:record.proId,
          // cityId:record.cityId
          markType,
          dateType,
          condition:arr,
          isDrill:true,
          space
        };
        dispatch({
          type:"drillDownTableModel/getDrillDownTableData",
          payload:params,
          callback:(res)=>{
            // 对下钻返回的数据做处理
            const handledDrillData = this.handleDrillData(res.tBodyData,parentKey,drillLevel);
            drilltBodyData[realKey]=handledDrillData;
            // 对表格数据做处理
            // 当前展示的表格数据
            treeData = this.handleDrillAndTableData(tBodyData,handledDrillData,parentKey,true);
            if(expandedRowKeys.indexOf(kpiId)===-1){
              expandedRowKeys.push(kpiId);
              this.setState({
               //  originBodyData:res.tBodyData,
                drilltBodyData,
                tBodyData:treeData,
                expandedRowKeys:[key].concat(expandedRowKeys) // xxd 加了key
              })
            }else{
              this.setState({
                drilltBodyData,
                tBodyData:treeData,
                expandedRowKeys:[key].concat(expandedRowKeys) // xxd 加了key
              })
            }
          }
        })
      }

    }else{
      // 收起下钻
      // 处理表格数据
      const handledDrillData = drilltBodyData[realKey];
      treeData = this.handleDrillAndTableData(tBodyData,handledDrillData,parentKey,false);
      // const index = expandedRowKeys.indexOf(kpiId);
      // expandedRowKeys.splice(index,1);
      this.setState((prevState) =>{
        delete prevState.tBodyData;
        return prevState;
      });
      this.setState({
        tBodyData:treeData,
        // expandedRowKeys:[].concat(expandedRowKeys)
      });
    }
    // console.log("drilltBodyData111")
    // console.log(drilltBodyData)
    // console.log("tBodyData111")
    // console.log(tBodyData)
    // console.log("expandedRowKeys111")
    // console.log(expandedRowKeys)
    // console.log("allOpenKey111")
    // console.log(allOpenKey)
    event.stopPropagation();
  };

  /**
   * 处理下钻请求返回的数据，并处理表格数据
   * @param tBodyData
   * @returns {Array}
   */
  handleDrillData=(resource,parentKey)=>{
    const tBodyData = resource;
    for(let i=0;i<tBodyData.length;i+=1){
      const {kpiId,proId,cityId,areaName,kpiName} = tBodyData[i];
      const realKey = `${kpiId}${proId}${cityId}`;
      tBodyData[i].key=realKey; // 设置每一行的key值:应该用kpiId+proId+areaId
      tBodyData[i].parentkey=parentKey; //  父级的指标id+省分id+地市id
      tBodyData[i].realKey=realKey; //  返回的下钻数据取 指标id+省分id+地市id
      tBodyData[i].haveExpanded=false; // 设置默认下钻状态为未展开 // xxd 二级的下钻标志 上下
      tBodyData[i].drill = true; // xxd 不清楚有什么作用
      let space = "";
      for (let i = 0; i < tBodyData[i].space; i+=1) {
        space = `${space}\u3000`; // 加全角空格 增加缩进
      }
      tBodyData[i].space2 = space;
      tBodyData[i].kpiName=areaName;
      tBodyData[i].indexName=kpiName;
      const {kpiValues} = tBodyData[i];
      for(let j=0;j<kpiValues.length;j+=1){
        tBodyData[i][`value${j}`] = kpiValues[j];
      }
    }
    return tBodyData;
  };

  /**
   * 添加下钻数据到当前表格
   * @param handledDrillData
   * @param parentKey
   */
  handleDrillAndTableData=(originData,handledDrillData,parentKey,expanded)=>{
    const tBodyData = originData;
    // 结束递归
    if(originData===undefined || originData.length===0){
      return 0;
    }
    // 需要添加的下钻数据
    for(let i=0;i<tBodyData.length;i+=1){
      const {children,realKey} = tBodyData[i];
      // 找到了父级，将下钻的数据加到当前行的children对象中
      if(parentKey === realKey){
        if(expanded){
          tBodyData[i].haveExpanded = true;
          // 本来就有子级
          if(children!==undefined && children.length>0){
            tBodyData[i].children = handledDrillData.concat(children);
          }else{
            // 没有子级
            const newChildren = [].concat(handledDrillData);
            tBodyData[i].children = newChildren;
          }
        }else{
          tBodyData[i].haveExpanded = false;
          if(children!==undefined && children.length>0){
            handledDrillData.forEach(item=>{
              const index =children.indexOf(item);
              if(index>-1){
                children.splice(index,1);
              }
            })
          }
        }
        break;
      }else{
        // 递归查找
        this.handleDrillAndTableData(tBodyData[i].children,handledDrillData,parentKey,expanded);
      }
    }
    return tBodyData;
  };

  // 判断浏览器
  IEVersion=()=>{
    const {userAgent} = navigator; // 取得浏览器的userAgent字符串
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
    const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
      const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      const fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion == 7) {
        return 7;
      } else if(fIEVersion == 8) {
        return 8;
      } else if(fIEVersion == 9) {
        return 9;
      } else if(fIEVersion == 10) {
        return 10;
      } else {
        return 6;// IE版本<=7
      }
    } else if(isEdge) {
      return 'edge';// edge
    } else if(isIE11) {
      return 11; // IE11
    }else{
      return -1;// 不是ie浏览器
    }
  };

  // 鼠标放上去 下钻显示或隐藏
  onMouseEnter=(onMouse,record,event)=>{
   //  console.log("鼠标划到每一行",event)
    const downDom = event.currentTarget.firstElementChild.querySelector('span[class^="antd-pro-components-analyse-special-drill-down-table-drillDown"]');
    window.event? window.event.cancelBubble = true : event.stopPropagation();
    if(downDom){
        if(onMouse === "onMouseEnter"){
            const classVal = "antd-pro-components-analyse-special-drill-down-table-drillDown";
            downDom.setAttribute("class",classVal );
        }else {
          const classVal = "antd-pro-components-analyse-special-drill-down-table-drillDown antd-pro-components-analyse-special-drill-down-table-downArrowNoneStyle";
          downDom.setAttribute("class",classVal);
        }
    }
  };

  /**
   * 判断每一行前面是否显示展开符
   * @param record
   * @returns {string}
   */
  rowClassNameHandle=(record)=>{
    // console.log("判断每一行前面是否显示展开符");
    const {noChildrenKey} = this.state;
    const drillDownTable = styles;
    let expandIcon = "";
    // 永远都不展示展开、收起
    if(noChildrenKey.indexOf(record.key) !== -1){
       expandIcon = ` ${drillDownTable.expandIcon} `  // xxd 去除加减号
    }
    if(record.drill===true){ // 下钻数据永远都不展示展开、收起
      expandIcon = ` ${drillDownTable.expandIcon} `  // xxd 去除加减号
    }
    return  styles.trStyle  +expandIcon ;
  };

  // 点击某一行，将这一行的参数传给图表
  clickRow=(record,event)=>{
    console.log("点击表格的某一行",record,event);
    // this.clickfun(text, record, t.id, indexName, dimensionId)
  };





  jsonHandle=()=>{
    // console.log("jsonHandle")
    const {conditionNameList,titleName,maxDate,proCityModels} = this.props;
    // console.log("conditionNameList")
    // console.log(conditionNameList)
    const {selectCity:{cityName},selectPro:{proName}} = proCityModels;
    const { thData,tBodyData} = this.state;
    const conditionValue = [];
    conditionNameList.forEach((item)=>{
      if(item.type === "date" && item.value.length === 0){
        conditionValue.push([item.key,maxDate])
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
    thData.forEach((item)=>{
      if(item.children && item.children.length > 0){
        item.children.forEach((childrenItem)=>{
          arrHeader.push({id:childrenItem.id,name:item.name})
        })
      }else {
        arrHeader.push({id:item.id,name:item.name})
      }
    });
    arrHeader.forEach((item)=>{
      headerName.push(item.name)
    });

    const table = {
      title: [
        headerName
      ],
      value: this.handleTbodyDataFun(tBodyData,arrHeader)
    };
    return {
      fileName: `${titleName}-数据表`,
      condition,
      table
    };
  };

  // 下载数据处理
  handleTbodyDataFun = (handleTbodyData,arrHeader) =>{
    const {tBodyData} = this.state;
    const downArr = [];
    const forTree = (data) =>{
      data.forEach((dataItem)=>{
        const itemTrArr = [];
        arrHeader.forEach((headerItem,index)=>{
          if(index===0){
            itemTrArr.push(dataItem.kpiName)
          }else if(index===1){
            itemTrArr.push(dataItem.unit)
          }else if(index>1){
            itemTrArr.push(dataItem.kpiValues[index-2].value)
          }
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
   * @date: 2019/8/7
   * @author 风信子
   * @Description: 表格下载
   * @method handleDownload
   */
  handleDownload(){
    DownloadFile(this.jsonHandle());
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
  clickfun(text, record, indexText, index){
    if(text.value !== "-"){
      const {conditionValue,date,conditionName,conditionNameList,callBackTableCondition} = this.props;
      const {dimensionId} = record;
      const indexName=indexText.name;
      const indexNameType=indexText.type?indexText.type:'';
      const indexId=record.kpiId;
      // const conditionNameListHandle = [];
      let indexConfigId = ""; // 记录指标配置的id
      const popTitle = {
        indexName,
        dimensionName: record.indexName?`${record.indexName} > ${record.kpiName}`:record.kpiName
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
            itemValue[itemKey] = dimensionId[itemKey] ? [dimensionId[itemKey].id[0]] : itemValue[itemKey];
            if(indexConfigId === itemKey){
              itemValue[indexConfigId] = [indexId];
            }
            if(indexNameType === itemKey){
              itemValue[indexNameType] = [indexText.id];
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
          itemName.value = dimensionId[itemName.id] ? ([dimensionId[itemName.id].name[0] !== "" ? dimensionId[itemName.id].name[0] : dimensionId[itemName.id].id[0]])  : itemName.value;
          if(indexConfigId === itemName.id){
            itemName.value = [indexName];
          }
          if(indexNameType === itemName.id){
            itemName.value = [indexText.id];
          }
        }

        return itemName;
      });
      callBackTableCondition(conditionValueHandle,conditionNameListHandle,popTitle);
    }
  }

  render(){
    const {thData,tBodyData,expandedRowKeys,loading} = this.state;
    if(tBodyData.length === 0 || thData.length === 0)return null;
    // const valueColumnsNum = thData.length - tBodyData[0].kpiValues.length;
      let columns;
    if (thData.length>0) {
      columns = [
        {
          title:thData[0].name,
          dataIndex: "kpiName",
          // align:'left',// 默认是left
          key: "kpiName",// 当有唯一的dataIndex时，key可以忽略
          // 生成复杂数据的渲染函数，参数：当前行的值，当前行数据，行索引
          // 按钮：展开或收起；下钻按钮；点击整行更细图表；鼠标划上去展示指标解释；
          render: (text, record) =>{
            let downArrow = "false";
            let downIcon = "icon-xiazai";
            // 是否可以下钻来展示下钻按钮
            if(record.downArrowState){
              downArrow = record.downArrowState;
              if(!record.haveExpanded){
                downIcon = "icon-xiazai";
              }else{
                downIcon = "icon-xiazai-up";
              }
            }
            let iconDom = <IconFont className={styles.IconColor} type={downIcon} />;
            if(this.IEVersion() !== -1){
              iconDom = <img className={styles.iconImg} src={require(`../KeyProduct/${downIcon}.png`)} alt="" />
            }
            return (
              <div className={styles.titleContent}>
                <Tooltip placement="bottom" title={record.kpiDetail} overlayClassName={styles.titleKpiDetail}>
                  <span className={styles.nameStyle}>{record.space2+text}</span>
                </Tooltip>
                {downArrow === "true" ? <span className={classNames(styles.drillDown,styles.downArrowNoneStyle)} onClick={(event)=>this.clickDownShow(record,event)}> {iconDom} </span>: null }
              </div>);
          }
        },
        {
          title: thData[1].name,
          dataIndex: "unit",
          key: "unit",
        }
      ];
      thData.forEach((data, index)=>{
        if (index > 1) {
            // 当月值有预警
            if(index===2){
              columns.push({
                title: data.name,
                dataIndex: `value${index - 2}`,
                key: `value${index - 2}`,
                render: (text,record) => (
                  <Tooltip placement="bottom" overlayClassName={styles.warningTip} title={record.showEarlyWarning!=="1"?null:(<EarlyWarning warningLevel={record.warningLevel} desc={record.desc}  />)}>
                    <span className={text.value==="-"?null:styles.pointer} title={text.value} onClick={()=>this.clickfun(text, record,data,index)}>
                      {text.value}
                      <span style={{color:'#C91717',display:record.showEarlyWarning==="1"?'inline-block':'none'}}>*</span>
                    </span>
                  </Tooltip>
                ),
              });
            } else {
              columns.push({
                title: data.name,
                dataIndex: `value${index - 2}`,
                key: `value${index - 2}`,
                render:(text,record) =>(<span title={text.value} onClick={()=>this.clickfun(text, record,data,index)} className={styles[`classColor${text.type}`]}>{text.value}</span>)
              });
            }
          }
      });
    } else {
      columns= null;
    }

    return(
      <div className={styles.drillDownTable}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={tBodyData}
          pagination={false}
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded,record)=>{this.handleExpand(expanded,record)}}
          rowClassName={record => this.rowClassNameHandle(record)}
          onRow={record => {
            return{
              onClick:event=>{this.clickRow(record,event)},
              onMouseEnter: (event) => {this.onMouseEnter("onMouseEnter",record,event)},  // 鼠标移入行
              onMouseLeave: (event) => {this.onMouseEnter("onMouseLeave",record,event)},  // 鼠标移出行
            };
          }}
        />
      </div>
    )
  }
}
export default DrillDownTable;
