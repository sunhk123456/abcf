/* eslint-disable */
/**
 * @Description: 专题表格组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/4/28
 */

import React,{ PureComponent } from 'react';
import {Table, Icon, Tooltip } from 'antd';
import {connect} from 'dva';
import isEqual from 'lodash/isEqual';
import router from 'umi/router';
import classNames from 'classnames';

import EarlyWarning from "../DayOverView/earlyWarning";
import EmbedLineChart from "@/components/Echart/specialTableEmbedLineChart/specialTableEmbedLineChart";
import EmbedHistogram from "@/components/Echart/specialTableEmbedHistogram/specialTableEmbedHistogram";

import styles from './specialReportTable.less';
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

@connect(({ proCityModels,specialReportTableModels,specialReport,selectTypeModels}) => ({
  proCityModels,
  specialReportTableModels,
  specialReport,
  selectTypeModels,
}))
class SpecialReportTable extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      // tableAllOpen:true, // 表格展开全部标志
      // handleTbodyData: [], // 处理后的数据
      defaultExpandedRowKeys: [], // 需要默认展开的表格
      downArrowShow:[], // 下钻显示的指标id
      onMouseKey:"", // 鼠标滑上去显示下钻按钮
      noChildrenKey:[], // 记录非下钻数据没有子元素的id
    }
  }

  componentDidMount() {
    this.handleData();
  }

  componentDidUpdate(prevProps){
    const {tableData, specialReportTableModels} = this.props;
    const {downArrowData, checkboxSign} = specialReportTableModels;
    if(!isEqual(tableData, prevProps.tableData) || !isEqual(downArrowData, prevProps.specialReportTableModels.downArrowData)){
      if(!isEqual(tableData, prevProps.tableData)){
        this.emptyData();
      }
      this.handleData();
    }
    if(checkboxSign !== prevProps.specialReportTableModels.checkboxSign){
      this.handleData("checkboxSign");
    }
  }

  // shouldComponentUpdate(nextProps,nextState){
  //   if(nextState.onMouseKey !== this.state.onMouseKey){
  //     return false
  //   }
  //   return true;
  // }

  /**
   * @date: 2019/4/30
   * @author liuxiuqian
   * @Description: 数组去重
   * @method uniq
   * @param {参数类型： array} 参数名array 参数说明 待处理数据
   * @return {返回值类型} 返回值说明
   */
  uniq = (array) =>{
    const temp = []; // 一个新的临时数组
    array.forEach((item)=>{
      if(temp.indexOf(item) === -1){
        temp.push(item)
      }
    })
    return temp;
  }

  // 清空数据
  emptyData(){
    const {dispatch} = this.props;
    // 空下钻数据金和下载id 标记
    dispatch({
      type: 'specialReportTableModels/emptyDataAndId',
    });
    this.setState({defaultExpandedRowKeys:[],downArrowShow:[]}); // 当表格数据变化后清空展开key,
  }

  /**
   * @date: 2019/4/29
   * @author liuxiuqian
   * @Description:
   * @method getTrees
   * @param {array} list 待处理所有数据
   * @param {string} parentId 顶层父id值
   * @return {array} 处理后数据
   */


  /**
   * @date: 2019/4/29
   * @author liuxiuqian
   * @Description: 方法说明
   * @method rowClassNameHandle
   * @param {参数类型: obj} 参数名:record 参数说明: 返回的当前tr数据
   * @return {返回值类型} 匹配后的样式
   */
  rowClassNameHandle(record){
    const {downArrowShow, noChildrenKey} = this.state;
    const foldTableCss = styles;
    let downArrowNoneStyle = " ";
    let expandIcon = " ";
    if("downArrowState" in record){
      if( downArrowShow.indexOf(record.kpiId) !== -1){
        downArrowNoneStyle = " ";
      }else {
        downArrowNoneStyle = ` ${foldTableCss.downArrowNoneStyle} `
      }
    }
    if(noChildrenKey.indexOf(record.kpiId) !== -1){
      expandIcon = ` ${foldTableCss.expandIcon} `
    }
    return  styles.trStyle + downArrowNoneStyle +expandIcon ;
  }

  /**
   * @date: 2019/4/28
   * @author liuxiuqian
   * @Description: 处理表格数据
   * @method handleData
   */
  handleData(checkbox = false){
    const {tableData, specialReportTableModels, proCityModels, dispatch} = this.props;
    const {downArrowShow, defaultExpandedRowKeys} = this.state;
    const {checkboxSign} = specialReportTableModels;
    const downArrowTableData = specialReportTableModels.downArrowData;
    const {selectPro} = proCityModels;
    const {tbodyData} = tableData; // 表格数据体数据
    if(!tbodyData)return null;
    if(tbodyData.length === 0)return null;
    const mergeArr = downArrowTableData.concat(tbodyData);
    const expandedRow = [];
    const noChildrenKey = []; // 记录非下钻数据没有子元素的id
    const formatTree = (items, parentId) =>{
      const result = [];
      if (!items[parentId]) {
        return result;
      }
      for(const t of items[parentId]) {
        // 把数组中的数据遍历出来
        t.kpiValues.forEach((data, index)=>{
          t[`value${index}`] = data;
        });
        let space = "";
        for (let i = 0; i < t.space; i +=1) {
          space = `${space}\u3000`; // 加全角空格 增加缩进
        }
        t.space2 = space;
        // 创建一个children字段
        let childrenData = []
        if("downArrowState" in t){ // 判断是否为下钻 数据
          if(checkbox){
            downArrowShow.length = 0;
          }else {
            if(t.isShow !== "0"){
              expandedRow.push(`${t.kpiId}_${t.parentId}_${t.areaNo}`);
            }
          }
          t.key = `${t.kpiId}_${t.parentId}_${t.areaNo}`;
          childrenData = formatTree(items, `${t.kpiId}_${t.areaNo}`);
        }else {
          if(checkboxSign){
            expandedRow.push(t.kpiId);
          }else {
            if(checkbox){ // 如果为全选标志触发的 需清空之前选中的
              defaultExpandedRowKeys.length = 0;
            }
            if(t.isShow !== "0"){
              expandedRow.push(t.kpiId);
            }
          }
          t.key = t.kpiId;
          childrenData = formatTree(items, t.kpiId);
        }
        if (childrenData.length > 0) {
          t.children = childrenData;
          // 以下处理子元素都是下钻数据的时候标记没有指标子元素
          if(!("downArrowState" in t)){
            let sumMake = 0;
            childrenData.forEach((itemChildrenData)=>{
              if(!("downArrowState" in itemChildrenData)){
                sumMake ++;
              }
            })
            if(sumMake === 0){
              noChildrenKey.push(t.kpiId)
            }
          }
        }else {
           // 处理非下钻数据没有子元素标记
          if(!("downArrowState" in t)){
            noChildrenKey.push(t.kpiId)
          }
        }
        result.push(t);
      }
      return result;
    }
    const getTrees = (list, parentId) =>{
      const items = {};
      // 获取每个节点的直属子节点，记住是直属，不是所有子节点
      for (let i = 0; i < list.length; i +=1) {
        let key = "";
        if("downArrowState" in list[i]){ // 判断是否为下钻 数据
          // 判断当前查询的是否为全国级别的
          if(selectPro.proId === "111" || selectPro.proId === "113" || selectPro.proId === "112"){
            if(list[i].parentId === "111" || list[i].parentId === "112" || list[i].parentId === "113"){ // 下钻省标记
              key =  list[i].kpiId;
            }else {             // 下钻地市标记
              key =  `${list[i].kpiId}_${list[i].parentId}`;
            }
          }else {
            key =  list[i].kpiId;
          }
        }else {
          key = list[i].ElderId;
        }
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
      }
      return formatTree(items, parentId);
    }
    const handleTbodyData = getTrees(mergeArr, "-1");
    const ExpandedRowKeys = downArrowShow.concat(expandedRow, defaultExpandedRowKeys);
    this.setState({defaultExpandedRowKeys: this.uniq(ExpandedRowKeys), noChildrenKey})
    dispatch({
      type: 'specialReportTableModels/handleTbodyDataUpdate',
      payload: handleTbodyData
    })
    return false; // 不加这个语法检测器老是提示   智障玩意
  }

  /**
   * @date: 2019/4/29
   * @author liuxiuqian
   * @Description: 切换单位
   * @method switchUnit
   * @param {参数类型: string} 参数名:strMake 参数说明: 标记左右
   */
  switchUnit(strMake){
    const {tableData, callBackUnit} = this.props;
    const {unitSwitch} = tableData;
    const {maxUnit, minUnit, useUnit} = unitSwitch;
    let unit = useUnit;
    if(strMake === "left"){
      if(minUnit >= useUnit){
        unit = minUnit
      }else {
        unit = useUnit - 1;
        callBackUnit(unit); // 回调到上一级页面 请求数据
      }
    }else if(strMake === "right"){
      if(maxUnit <= useUnit){
        unit = maxUnit;
      }else {
        unit = parseInt(useUnit,10)+ 1;
        callBackUnit(unit); // 回调到上一级页面 请求数据
      }
    }

  }

  /**
   * @date: 2019/4/29
   * @author liuxiuqian
   * @Description: 展开合并事件
   * @method changeExpandedRowKeys
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  changeExpandedRowKeys(expanded, record) {
    const {defaultExpandedRowKeys} = this.state;
    const spliceArr = [...defaultExpandedRowKeys];
    if(expanded){
      spliceArr.push(record.key);
    }else if(!expanded && spliceArr.indexOf(record.key) !== -1){
      spliceArr.splice(spliceArr.indexOf(record.key),1);
    }
    this.setState({defaultExpandedRowKeys: spliceArr});
  }

  /**
   * @date: 2019/4/29
   * @author liuxiuqian
   * @Description: 下钻请求处理
   * @method handleDrillDown
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型}
   */
  handleDrillDown(record){
    const {downArrowShow, defaultExpandedRowKeys} = this.state;
    const {dispatch, proCityModels, selectTypeModels, specialReport, specialReportTableModels} = this.props;
    const {markId, date, moduleId, dateType, tableData} = specialReport;
    const {selectCity, selectPro} = proCityModels;
    const {selectIdData} = selectTypeModels;
    const {unitSwitch} = tableData;
    const {useUnit} = unitSwitch;
    const {downArrowFetchId} = specialReportTableModels;
    let provinceId = selectPro.proId;
    let {cityId} = selectCity;
    const downArrowShow2 = [...downArrowShow];
    const ExpandedRowKeys = [...defaultExpandedRowKeys];
    if(!("downArrowState" in record)){ // 判断是否wi下钻
      if(downArrowShow2.indexOf(record.kpiId) === -1){
        downArrowShow2.push(record.kpiId);
      }else {
        downArrowShow2.splice(downArrowShow2.indexOf(record.kpiId),1);
      }
    }else if(ExpandedRowKeys.indexOf(record.key) === -1){
      ExpandedRowKeys.push(record.key);
    }else  {
      ExpandedRowKeys.splice(ExpandedRowKeys.indexOf(record.key), 1);
    }
    this.setState({downArrowShow:downArrowShow2,defaultExpandedRowKeys:this.uniq(ExpandedRowKeys.concat(downArrowShow2))});

    if(record.parentId){
      provinceId = record.areaNo;
      cityId = "-1"
    }
    const downArrowItemMake = record.kpiId + provinceId + cityId;
    if(downArrowFetchId.indexOf(downArrowItemMake) === -1){ // 判断是否已请求过数据
      const params = {
        markType:markId,
        provinceId,
        cityId,
        date,
        moduleId,
        dateType,
        dimension:selectIdData,
        unitLevel:useUnit,
        kpiId: record.kpiId
      }
      dispatch({
        type: 'specialReportTableModels/downArrowFetch',
        payload: {params,downArrowItemMake}
      });
    }

  }

  /**
   * @date: 2019/5/5
   * @author liuxiuqian
   * @Description: 跳转到指标页面
   * @method JumpIndexPage
   */
  JumpIndexPage(record){
    const {proCityModels, selectTypeModels, specialReport} = this.props;
    const { date, dateType} = specialReport;
    const {selectCity, selectPro} = proCityModels;
    const {selectIdData} = selectTypeModels;
    const {kpiId, parentId, areaNo} = record;
    let provId = selectPro.proId;
    let {cityId} = selectCity;
    if("downArrowState" in record){
      if(parentId === "111"){
        provId = areaNo;
        cityId = "-1";
      }else {
        provId = parentId;
        cityId = areaNo;
      }
    }
    const params = {
      dateType,
      id:kpiId,
      specialReportMake:true,
      dimension:[
        {
          selectType:selectIdData,
          date,
          provId,
          cityId
        }
      ],
    }
    router.push({
      pathname: '/indexDetails',
      state: params
    })

  }

  // 鼠标放上去 下钻显示或隐藏
  onMouseEnter(onMouse,record,event){
    const downDom = event.currentTarget.firstElementChild.getElementsByClassName("antd-pro-components-key-product-special-report-table-drillDown");
    window.event? window.event.cancelBubble = true : event.stopPropagation();
    if(downDom.length !== 0){
      if(onMouse === "onMouseEnter"){
        const classVal = "antd-pro-components-key-product-special-report-table-drillDown";
        downDom[0].setAttribute("class",classVal );
        // downDom[0].classList.toggle("antd-pro-components-key-product-special-report-table-downArrowNoneStyle", false);
        // this.setState({onMouseKey:record.key})
      }else {
        const classVal = "antd-pro-components-key-product-special-report-table-downArrowNoneStyle antd-pro-components-key-product-special-report-table-drillDown";
        downDom[0].setAttribute("class",classVal);
        // downDom[0].classList.toggle("antd-pro-components-key-product-special-report-table-downArrowNoneStyle", true);
        // this.setState({onMouseKey:""});
      }
    }
  }

  // 判断浏览器
  IEVersion(){
    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
      const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      const fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion === 7) {
        return 7;
      } else if(fIEVersion === 8) {
        return 8;
      } else if(fIEVersion === 9) {
        return 9;
      } else if(fIEVersion === 10) {
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
  }

  render() {
    const {tableData, specialReportTableModels} = this.props;
    const {handleTbodyData} = specialReportTableModels;
    const {defaultExpandedRowKeys, downArrowShow} = this.state;
    const {thData, unitSwitch, tbodyData} = tableData; // 表格表头数据
    const screenWidth = window.screen.width; // 屏幕宽度
    let addTdWidth = 0
    if(screenWidth > 961 && screenWidth < 1100){
      addTdWidth = -30;
    }else if(screenWidth > 700 && screenWidth < 960){
      addTdWidth = -15;
    }else if(screenWidth >= 1920){
      addTdWidth = 45;
    }
    if(!thData)return null;
    if(thData.length === 0)return null;
    const formatTd = tbodyData[0].format; // 判断是否带有图表
    // 表头数据处理
    const columns = [
      {
        title: thData[0],
        dataIndex: 'kpiName',
        key: 'kpiName',
        className: styles.nameStyle,
        render: (text, record) => {
          let titleText = "";
          let downArrow = "true";
          let downIcon = "icon-xiazai";
          if("downArrowState" in record){
            titleText = record.space2 + record.areaName;
            downArrow = record.downArrowState;
            if(record.parentId === "111"){ // 地市图标判断
              if(defaultExpandedRowKeys.indexOf(record.key) === -1){
                downIcon = "icon-xiazai"; //
              }else {
                downIcon = "icon-xiazai-up";
              }
            }
          }else {
            titleText = record.space2 + text;
            if(downArrowShow.indexOf(record.kpiId) === -1){
              downIcon = "icon-xiazai";
            }else {
              downIcon = "icon-xiazai-up";
            }
          }
          let iconDom = <IconFont className={styles.IconColor} type={downIcon} />
          if(this.IEVersion() !== -1){
            iconDom = <img className={styles.iconImg} src={require(`./${downIcon}.png`)} alt=""/>
          }
          return (
            <div className={styles.titleContent}>
              <Tooltip title={record.kpiDetail} placement="bottomLeft" overlayClassName={styles.titleKpiDetail}>
                <span className={styles.title} onClick={()=>this.JumpIndexPage(record)}>{titleText}</span>
              </Tooltip>

              {downArrow === "true" ? <span className={classNames(styles.drillDown,styles.downArrowNoneStyle)} onClick={()=>this.handleDrillDown(record)}> {iconDom} </span>: null }
            </div>)
        }
      },
      {
        dataIndex: 'unit',
        key: 'unit',
        width: screenWidth >= 1900 ? 100 : 80,
        title: () => {
          const {maxUnit, minUnit, useUnit} = unitSwitch;
          let leftColor = ""; // 左侧选中颜色
          let rightColor = ""; // 右侧选中颜色
          if(minUnit >= useUnit){
            leftColor = "noUnit";
          }
          if(maxUnit <= useUnit){
            rightColor = "noUnit";
          }
          return (
            <div className={styles.titleContent}>
              <span onClick={()=>this.switchUnit("left")} className={styles.caretLeft}><Icon className={styles[leftColor]} type="caret-left" /></span>
              <span>{thData[1]}</span>
              <span onClick={()=>this.switchUnit("right")} className={styles.caretRigh}><Icon className={styles[rightColor]} type="caret-right" /></span>
            </div>)
        }
      }
    ]
    thData.forEach((item, index) =>{
      if(index > 1){
        columns.push({
          title: item,
          dataIndex: `value${index-2}`,
          key: `value${index-2}`,
          width: formatTd.length >0 ? (formatTd[index-2].type[0] === "ratio" ? 95+addTdWidth : 170+addTdWidth) : 95+addTdWidth,
          render: (text, record) => {
            const {format,key} = record;
            // index-2 < format.length 修复报type 错误问题
            if(format.length !== 0 && index-2 < format.length && format[index-2].type ){
              const {type, ratio, lineChartData, histogramData} = format[index-2];
              let ecahetDom = "";
              let classColorName = "";
              let makeEchart = false;
              if(type && type.length > 0){
                ecahetDom = type.map((typeItem)=>{
                  if(typeItem === "ratio"){
                    if(ratio === -1){
                      classColorName = "tdRed";
                    }else {
                      classColorName = "tdGreen";
                    }
                    makeEchart = false;
                    return null;
                  }else if(typeItem === "lineChart"){
                    makeEchart = true;
                    return (<EmbedLineChart key={key} data={lineChartData} />)
                  }else {
                    makeEchart = true;
                    return (<EmbedHistogram key={key} data={histogramData} />)
                  }
                })
              }else {
                ecahetDom = null;
              }
              return (
                <div className={styles.valueContent}>
                  {
                    item === "当日值" ?
                      <Tooltip placement="bottom" title={record.showEarlyWarning !== "1" ? null : (<EarlyWarning warningLevel={record.warningLevel} desc={record.desc} />)} overlayClassName={styles.warningTip}>
                        <span className={styles[classColorName]}>{text}</span>
                        <span style={{color:'#C91717',display:record.showEarlyWarning==="1"?'inline-block':'none'}}>*</span>
                      </Tooltip>
                      :
                      <span className={styles[classColorName]}>{text}</span>
                  }

                  {
                    makeEchart
                      ?
                    <span className={styles.echartCon} style={{width: `${type.length*40}px`}}>
                      <span className={styles.conEChart}>
                        {ecahetDom}
                      </span>
                    </span>
                      :
                      null
                  }
                </div>)
            }else {
              return (
                <div className={styles.valueContent}>
                  <span>{text}</span>
                </div>
              );
            }
          }
        })
      }
    })
    return (
      <div className={styles.specialReportTable}>
        <Table
          columns={columns}
          rowClassName={record => this.rowClassNameHandle(record)}
          dataSource={handleTbodyData}
          expandedRowKeys={defaultExpandedRowKeys}
          onExpand={(expanded, record) => this.changeExpandedRowKeys(expanded, record)}
          pagination={false}
          scroll={{y:'60vh'}}
          onRow={(record) => ({
              onMouseEnter: (event) => {this.onMouseEnter("onMouseEnter",record,event)},  // 鼠标移入行
              onMouseLeave: (event) => {this.onMouseEnter("onMouseLeave",record,event)},  // 鼠标移出行
            })
          }
        />
      </div>
    )
  }
}

export default SpecialReportTable;
