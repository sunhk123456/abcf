/**
 *
 * title: productFeatures.js
 *
 * description: 移动业务产品分析专题和宽带业务产品分析专题公用组件
 *
 * author: xingxiaodong
 *
 * date 2019/3/14
 *
 */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DatePicker, Icon, Table } from 'antd';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import IndexScreen from '../../components/ProductAnalysis/PointerType';
import ProductScreen from '../../components/ProductAnalysis/ProductScreen';
import ProCity from '../../components/Until/proCity';
import Treemap from '../../components/ProductAnalysisPop/treemap';
import ProductRankingTop from '../../components/ProductAnalysisPop/productRankingTop';
import ProductRankingLast from '../../components/ProductAnalysisPop/productRankingLast';
import ProvinceBar from '../../components/ProductAnalysisPop/provinceBar';
import ProductTimeLine from '../../components/ProductAnalysisPop/productTimeLine';
import chartPop from '../../assets/image/productAnalysisPop/chartPop.png';
import ComponentLayout from '../../components/ProductAnalysisPop/componentLayout';
import IndexExplain from '../../components/Common/indexExplainPop'
import DownloadAll from '../../components/DownloadAll/downloadAll'

@connect(
  ({
     productAnalysisTableDataModels,
     productAnalysisPopData,
     proCityModels,
     loading
   }) => ({
    productAnalysisTableDataModels,
    productAnalysisPopData,
    proCityModels,
    loading
  })
)
class ProductAnalysis extends PureComponent {

  constructor(props) {
    super(props);
    this.popClass=React.createRef();
    this.state = {
      isDownloadShow:false, // 全量下载弹窗是否展示
      isIndexExplainShow:false,
      columnName:"单元格列名",
      rowName:"单元格行名",
      indexType: [
        {"id": "tm", "name": "本月"},
        {"id": "hb", "name": "环比"},
      ],// 指标类型
      indexTypeIdAndName: {
        name: "本月",
        id: "tm",
      },// 记录选中的指标类型的 id name
      indexTypeId: "tm",// 记录选中的指标类型id
      classify: {
        name: "全部",
        id: "-1",
      },// 记录选中的分类的 id  name
      series: {
        name: "全部",
        id: "-1",
      },// 记录选中的系列的id name
      productClass:[],// 筛选条件分类系列
      markType:"PRODUCT_YD",// 专题标识
      markTypeName:"移动业务产品分析专题",
      date:undefined,// 账期
      layOut: {
        layout_5: [12,6,6,12,12],
        layout_4_01: [12,12,12,12],// 缺面积图
        layout_4_02: [12,6,6,24],// 缺地域分布
        layout_3: [12,12,24],// 缺排名图或者缺面积图和地域分布
        layout_2: [12,12],// 缺面积图和排名图或者缺排名图和地域分布
        layout_1: [24],// 只有时间趋势图
      },// 布局
      paramObject:{},// 显示图表要用到的参数
      expandedRowKeys:[],// 表格展开项
      tableKey:[], // 暂存表格所有的key
      tableAllOpen:false,// 表格是否已经全部展开
      thData:[],
      tbodyData:[],
      iconExplainContent:false,// 指标解释hover
    };
  }

  componentWillMount() {
    const {location} = this.props;
    if(location.state!== undefined){
      const {id,name,title} = location.state;
      this.setState({
        markType:id,// 专题标识
        markTypeName:name || title,
      },()=>{
        this.initRequest();
      })
    }else{
      this.initRequest();
    }

  }

  componentWillReceiveProps(nextProps) {
    const {productClass, indexType} = this.state;
    if (nextProps.productAnalysisTableDataModels.productClass && productClass !== nextProps.productAnalysisTableDataModels.productClass) {
      this.setState({
        productClass: nextProps.productAnalysisTableDataModels.productClass,
      });
    }
    // s设置指标类型的更新
    if (nextProps.productAnalysisTableDataModels.indexType && indexType !== nextProps.productAnalysisTableDataModels.indexType) {
      this.setState({
        indexType: nextProps.productAnalysisTableDataModels.indexType,
      });
    }
    // 设置日期更新
    const {date} = this.state;
    if (nextProps.productAnalysisTableDataModels.date && date !== nextProps.productAnalysisTableDataModels.date) {
      this.setState({
        date: nextProps.productAnalysisTableDataModels.date,
      });
    }

    // 请求一次全部展开所需要的key并存入state留用
    const {productAnalysisTableDataModels}=this.props;
    const   tableData =productAnalysisTableDataModels.tbodyData;
    if(nextProps !== undefined){
      if(nextProps.productAnalysisTableDataModels.tbodyData &&nextProps.productAnalysisTableDataModels.tbodyData !== tableData && nextProps.productAnalysisTableDataModels.tbodyData !== []){
        const  { thData, tbodyData}=nextProps.productAnalysisTableDataModels;
        const {columns,topTbodyData}=this.handleData(thData,tbodyData);
        const tableKey=[];
        topTbodyData.forEach((item)=>{
          if(item.children){
            tableKey.push(item.key)
          }
        });
        this.setState({
          "tableKey":tableKey,
          thData:columns,
          tbodyData:topTbodyData
        });
      }
    }

    // 存储页面跳转时带的参数
     const {location}=this.props
    if(nextProps.location.state && nextProps.location.state!==location.state){
        this.setState({
          markType:nextProps.location.state.id,
          markTypeName:nextProps.location.state.name || nextProps.location.state.title,
          indexTypeId:"tm", //
          productClass:[],
          classify:{
            name:"全部",
            id:"-1",
          },// 记录选中的分类的 id  name
          series:{
            name:"全部",
            id:"-1",
          },
          indexTypeIdAndName:{
            name:"本月",
            id:"tm",
          },
        },()=>{
          console.log("存储页面跳转时带的参数");
          const {dispatch} = this.props;
          const {markType, classify, series, indexTypeId} = this.state;
          const {cityId} = '-1';
          const {proId} = "111";
          const params = {
            markType,
            provId: proId,
            cityId,
            date,
            productCategory: classify.id,
            productSeries: series.id,
            indexType: indexTypeId
          };
          dispatch({
            type: 'productAnalysisTableDataModels/fetchTableData',
            payload: params
          });
          dispatch({
            type: 'productAnalysisTableDataModels/fetchProductScreen',
            payload: {
              "markType": markType,
            }
          });
          dispatch({
            type: 'productAnalysisTableDataModels/fetchMaxData',
            payload: {
              "markType": markType,
            }
          });
        })
     }
  }

  // 根据参数请求数据渲染echarts
  getChart = (paramObject) => {
    const {markType, date, indexType, indexId, productCategory, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = paramObject;
    // const {productCategory}=this.state
    const {proCityModels}=this.props;
    const {cityId}=proCityModels.selectCity;
    const {proId}=proCityModels.selectPro;
    const {dispatch} = this.props;
    dispatch({
      type: 'productAnalysisPopData/fetch',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexType,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName
      }
    });
    dispatch({
      type: 'productAnalysisPopData/productRankTop',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexType,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName,
        "topOrLast": "top"
      }
    });
    dispatch({
      type: 'productAnalysisPopData/productRankLast',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexType,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName,
        "topOrLast": "last"
      }
    });
    dispatch({
      type: 'productAnalysisPopData/provinceBar',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexType,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName,
        "topOrLast": "last"
      }
    });
    dispatch({
      type: 'productAnalysisPopData/productTimeline',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexTypeIdAndName.id,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName,
        "topOrLast": "last"
      }
    });
    dispatch({
      type: 'productAnalysisPopData/charttypes',
      payload: {
        "markType": markType,
        "provId": proId,
        "cityId": cityId,
        "date":date,
        "indexType":indexType,
        "indexId": indexId,
        "productCategory":productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName
      }
    });
  }

  /**
   *  返回布局器组件里面需要写入的所有组件的数组
   * @param layoutArr 具有组件名称和组价所占列数的布局对象的数组
   * @param colWidth 每一列的宽度
   * @param titleNames 图表的title
   * @returns {Array} 布局器组件里面需要写入的所有组件的数组
   */
  getComponentItems(layoutArr, colWidth, titleNames, indexType) {
    const items = [];
    const {length} = layoutArr;
    for (let i = 0; i < length; i += 1) {
      const item = this.getLayoutItem(layoutArr[i], colWidth, titleNames, indexType, length);
      items.push(item);
    }
    return items;
  }

  /**
   * 处理数据格式，把 {"values": ["9999","1000","2325"]}
   * 变成
   * {value1:"9999", value2:"9999",value3:"9999"}
   * */
   newTbodyData=(array)=>{
    const getValueData=(data)=>{
      const {values}=data;
      const  obj={};
      for (let i=0;i<values.length; i+=1){
       // const string1=values[i].replace(/,/g,'');
        obj[`value${i+1}`]=values[i]
      }
      return Object.assign(data,obj);
    };
    for(let i=0;i<array.length;i+=1){
      getValueData(array[i]);
    }
  };

  /**
   * 处理数据格式
   * 为每行数据加上key属性
   * */
  addKey=(array)=>{
    if(!array){return array}
    for (let i=0;i<array.length; i+=1){
      if(array[i].dimensionId){
        Object.assign(array[i],{key:array[i].dimensionId})
      }
    }
    return array
  };

  // 表格排序
  tableSort=(a,b,index)=>{
    let stringB=b[`value${index}`];
    if(stringB==="-"){stringB="-10000"}
    let stringA=a[`value${index}`];
    if(stringA==="-"){stringA="-10000"}
      const bb=Number(stringB.replace(/,/g,''));
      const aa=Number(stringA.replace(/,/g,''));
      return(bb -aa)
    };

  // 把请求到的数据处理成table想要的数据格式
  handleData=(oldThData,oldTbodyData)=>{
    // if(!oldThData){return {}}
    const columns=oldThData.map((item,index)=> (
        {
          title:item.name,
          unit:item.unit,
          indexId:item.indexId,
          dataIndex: index===0?"name":`value${index}`,
          className: index===0 ? styles.column0 : styles.column1,
          key:item.name,
          width: index===0?200:null,
          fixed: index===0?'left':null,
          sorter: index===0?null:(a,b) => this.tableSort(a,b,index) ,
          sortDirections: ['descend', 'ascend'],
          children:[ {
            className: index===0 ? styles.column0 : styles.column1,
            title:index===0?null:item.unit,
            unit:item.unit,
            indexId:item.indexId,
            dataIndex: index===0?"name":`value${index}`,
            key:item.name,
            width: index===0?200:null,
            fixed: index===0?'left':null,
            render: text => (
              <span title={text} onClick={this.tableClicked} data-column-name={item.name} data-column-indexid={item.indexId}>
                {text}
              </span>
            ),
          }],
        }
      )
    );
    this.addKey(oldTbodyData);

    this.newTbodyData(oldTbodyData);
    const topTbodyData=[];
    oldTbodyData.map((item) => {

      if(item.parentId !=="-1"){
        return null
      }
      topTbodyData.push(item);
      return item
    });
    for(let i=0;i<topTbodyData.length;i+=1){
      const childrenItem=[];
      oldTbodyData.map((item)=>{
        if(item.parentId===topTbodyData[i].dimensionId){
          // 加缩进
          Object.assign(item,{name:`  ${item.name}`});
          childrenItem.push(item)
        }
        return null
      });
      if(childrenItem.length>0){
        topTbodyData[i].children=childrenItem
      }
    }
    return {columns,topTbodyData}
  };

  // 查询按钮被点击
  query=()=>{
    // console.log("查询按钮被点击");
    const { dispatch } = this.props;
    const {markType,date,classify,series,indexTypeId}=this.state;
    const {proCityModels}=this.props;
    const {cityId}=proCityModels.selectCity;
    const {proId}=proCityModels.selectPro;
    const params = {
      markType,
      provId:proId,
      cityId,
      date,
      productCategory:classify.id,
      productSeries:series.id,
      indexType:indexTypeId
    };
    dispatch({
      type: 'productAnalysisTableDataModels/fetchTableData',
      payload: params,
      callback:()=>{
        if(classify.id!=="-1"||classify.id!=="-1"){
          const {tableKey} = this.state;
          this.setState({
            expandedRowKeys:tableKey,
            tableAllOpen:true
          })
        }else {
          this.setState({
            expandedRowKeys:[],
            tableAllOpen:false
          })
        }
      }
    });
  };

  //  指标解释按钮被点击
  indexExplain=()=>{
     //  console.log("指标解释按钮被点击")
    this.setState({
      isIndexExplainShow:true
    })
  };

  // 指标解释回调，关闭弹窗
  callbackCloseIndexExplain=()=>{
    console.log("指标解释回调")
    this.setState({
      isIndexExplainShow:false,
    })
  };

  // 下载按钮被点击
  download=()=>{
    this.setState({
      isDownloadShow:true
    })
  };

  downloadClose=()=>{
    this.setState({
      isDownloadShow:false
    })
};

  // 表格中单元格被点击
  tableClicked=(e)=>{
    const node=e.currentTarget;
    const columnName=node.getAttribute("data-column-name");
    const {productAnalysisTableDataModels}=this.props;
    const  {tbodyData,thData}=productAnalysisTableDataModels;
    if(columnName===thData[0].name){
      return null
    }
    const columnIndexId=node.getAttribute("data-column-indexid");
    const nodeParent=e.currentTarget.parentNode.parentNode;
    const dimensionId=nodeParent.getAttribute("data-row-key");

    let obj={};
    tbodyData.map((tbodyDataItem)=>{
        if(dimensionId === tbodyDataItem.dimensionId){
          obj=tbodyDataItem;
          return obj
        }
        return obj
    });
    let seriesId = "";
    let categoryId = "";
    if(obj.parentId === "-1"){
      if(obj.dimensionId === "00" || obj.dimensionId === "10"){
        categoryId = "-1";
      }else{
        categoryId = obj.dimensionId;
      }
      seriesId = "-1";
    }else{
      categoryId = obj.parentId;
      seriesId = obj.dimensionId;
    }
    // console.log("表格中单元格被点击")
    // console.log("obj")
    // console.log(obj)
    const {date,markType, indexTypeId, classify, series, indexTypeIdAndName,markTypeName} = this.state;
    const {proCityModels} = this.props;
    const {cityId} = proCityModels.selectCity;
    const {proId} = proCityModels.selectPro;

    const paramObject = {
      "markType": markType,
      "provId": proId,
      "cityId": cityId,
      "date": date,
      "indexType": indexTypeId,
      "indexId": columnIndexId,
      "productCategory": categoryId,
      "productSeries":seriesId,
      "productName": obj.name,
      "parentName": obj.parentId,
      "classifyTop": classify,
      "seriesTop": series,
      "indexTypeIdAndName": indexTypeIdAndName,
      "markTypeName":markTypeName
    };
    this.getChart(paramObject);
    this.popClass.current.className=styles.pop;
    const param = paramObject;
    this.setState({
      paramObject: param,
      columnName,
      rowName:obj.name
    });
    return null
  };

  // 弹出层收回
  popNone = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    this.popClass.current.className=styles.popNone
  };

  // 产品分类回调
  callBackSeriesAndClassify=(classify,series)=>{
    this.setState({
      series,
      classify
    });

  };

  // 产品系列回调
  callBackClassify=(classify,series)=>{
    this.setState({
      series,
      classify
    });
  };

  // 指标类型回调
  callBackIndexScreen=(selectIdAndName)=>{
    // console.log("指标类型改变触发事件");
    this.setState({
      indexTypeId:selectIdAndName.id,
      indexTypeIdAndName:selectIdAndName
    });
  };

  onExpend = (expanded,obj) => {
    // expanded是当前点击行是否展开的状态  obj是当前点击的行信息
    const {dimensionId}=obj;
    const {expandedRowKeys} = this.state;
    const spliceArr = [...expandedRowKeys];
    if(expanded){
      spliceArr.push(dimensionId);
    }else if(!expanded && spliceArr.indexOf(dimensionId) !== -1){
      spliceArr.splice(spliceArr.indexOf(dimensionId),1);
    }
    this.setState({expandedRowKeys: spliceArr});
  };


  // 展开全部功能
  inputClicked=()=>{
    const {tableKey,tableAllOpen} = this.state;
    if(tableAllOpen === false){
      this.setState({
        expandedRowKeys:tableKey,
        tableAllOpen:true
      })
    }else if(tableAllOpen === true){
      this.setState({
        expandedRowKeys:[],
        tableAllOpen:false
      })
    }
  };

  // 日期控件日期改变触发函数
  onChangeDate=(date, dateString)=>{
    this.setState({
      date:dateString
    })
  };

   // 设置最大账期
  disabledEndDate=(current)=>{
    const {productAnalysisTableDataModels}=this.props;
    const {date}=productAnalysisTableDataModels;
      return current && current > moment(date).valueOf();
    };

  /**
   * 返回组件名和组件所占列数的布局对象数组
   * @param data 后台返回的所有图表类型的数据
   * @param cols 几条数据对应哪个布局样式，如data为3条数据时，则cols为layout_3
   * @returns {Array} 返回组件名和组件所占列数的布局对象数组
   */
  getLayouts = (data, cols) => {
    const layouts = [];
    for (let i = 0; i < data.length; i += 1) {
      layouts.push({"itemName": data[i], "layoutCols": cols[i]});
    }
    return layouts;
  };

  /**
   * 返回组件名称和组件所占列数的布局对象数组，
   * 结构为 layout_7: [
   {"itemName": "div1", "layoutCols": 6},
   {"itemName": "div2", "layoutCols": 6},
   {"itemName": "div3", "layoutCols": 8},
   {"itemName": "div4", "layoutCols": 4},
   {"itemName": "div5", "layoutCols": 4},
   {"itemName": "div6", "layoutCols": 4},
   {"itemName": "div7", "layoutCols": 4}
   ],
   * @param data 后台返回的所有图表类型的数据
   * @param layoutCols 日布局组或月布局组
   */
  getComponentLayoutArr = (data, layoutCols) => {
    let cols = [];
    let layouts = [];
    switch (data.length) {
      case 1:
        cols = layoutCols.layout_1;
        layouts = this.getLayouts(data, cols);
        break;
      case 2:
        cols = layoutCols.layout_2;
        layouts = this.getLayouts(data, cols);
        break;
      case 3:
        cols = layoutCols.layout_3;
        layouts = this.getLayouts(data, cols);
        break;
      case 4:
        if (data[0] === 'treeMap') {
          cols = layoutCols.layout_4_02;
        } else {
          cols = layoutCols.layout_4_01;
        }
        layouts = this.getLayouts(data, cols);
        break;
      default :
        cols = layoutCols.layout_5;
        layouts = this.getLayouts(data, cols);
        break;
    }
    return layouts;
  };



  /**
   *
   * @param obj 具有组件名称和组件所占列数的布局对象
   * @param colWidth  每一列的宽度
   * @param titleNames 图表的title
   * @returns {XML} 返回对应的组件
   */
  getLayoutItem = (obj, colWidth, titleNames, indexType, length) => {
    const {productAnalysisPopData} = this.props;
    const {rowName}=this.state;
    let {treeMapData} = productAnalysisPopData;
    let {productRankingTop} = productAnalysisPopData;
    let {productRankingLast} = productAnalysisPopData;
    let {provinceBarData} = productAnalysisPopData;
    let {productTimeLineData} = productAnalysisPopData;
    if (!treeMapData || !treeMapData.treeData) {
      treeMapData = {
        treeData: {
          treeChart: []
        },
        example: "",
        unit: "",
      }
    }
    if (!productRankingTop || !productRankingTop.chart) {
      productRankingTop = {
        "chartX": [],
        "chart": [],
        "example": "",
        "unit": ""
      }
    }
    if (!productRankingLast || !productRankingLast.chart) {
      productRankingLast = {
        "chartX": [],
        "chart": [],
        "example": "",
        "unit": ""
      }
    }
    if (!provinceBarData || !provinceBarData.chart) {
      provinceBarData = {
        example: [],
        unit: "",
        chart: [],
        chartX: []
      }
    }
    if (!productTimeLineData[0]) {
      productTimeLineData = [{
        chart: [],
        chartX: [],
        example: "",
        unit: ""
      }]
    }
    // const mywidth = colWidth * obj.layoutCols - 10;
    const mywidth ="100%";
    let myheight;
    const sw = window.screen.width;
    if ((sw >= 1316) && (sw < 1389)) {
      myheight = 195;
    } else if ((sw >= 1390) && (sw < 1869)) {
      myheight = 240;
    } else if ((sw >= 1280) && (sw < 1315)) {
      myheight = 217;
    } else if ((sw >= 1001) && (sw < 1279)) {
      myheight = 238;
    } else if ((sw >= 750) && (sw < 1000)) {
      myheight = 170;
    } else if ((sw >= 1870) && (sw < 2159)) {
      myheight = 320;
    }
    // 只有一行
    if (length === 2 || length ===1) {
      if ((sw >= 1316) && (sw < 1389)) {
        myheight = 390 *0.8;
      } else if ((sw >= 1390) && (sw < 1869)) {
        myheight = 480*0.8;
      } else if ((sw >= 1280) && (sw < 1315)) {
        myheight = 434*0.8 ;
      } else if ((sw >= 1001) && (sw < 1279)) {
        myheight = 476*0.8;
      } else if ((sw >= 750) && (sw < 1000)) {
        myheight = 340*0.8 ;
      } else if ((sw >= 1870) && (sw < 2159)) {
        myheight = 708*0.8;
      }
    }

    switch (obj.itemName) {
      case "treeMap":
        return <Treemap treeChartData={treeMapData} divHeight={myheight} divWidth={mywidth} ref={obj.layoutCols} />;
      case "topBar":
        return <ProductRankingTop productRankingTop={productRankingTop} titleName={rowName} divHeight={myheight} divWidth={mywidth} className={styles.ProductRankingTop} ref={obj.layoutCols} />
      case "lastBar":
        return <ProductRankingLast productRankingLast={productRankingLast} titleName={rowName} divHeight={myheight} divWidth={mywidth} className={styles.ProductRankingTop} ref={obj.layoutCols} />
      case "provinceBar":
        return <ProvinceBar provinceBarData={provinceBarData} divHeight={myheight} divWidth={mywidth} ref={obj.layoutCols} />
      default :
        return <ProductTimeLine productTimeLineData={productTimeLineData[0]} titleName={rowName} divHeight={myheight} divWidth={mywidth} ref={obj.layoutCols} />
    }
  };

// 跳转到详情页面
  goToPop=(data)=>{
    router.push({
      pathname: '/ProductAnalysisPop/index',
      data,
    })
  };

  //  鼠标移入指标Icon
  mouseOverIconIndex=()=>{
    this.setState({
      iconExplainContent:true,
    })

  };

  //  鼠标移出指标Icon
  mouseLeaveIconIndex=()=>{
    this.setState({
      iconExplainContent:false,
    })
  };

  initRequest(){
    const {dispatch,proCityModels:{selectCity,selectPro}} = this.props;
    const {markType, date, classify, series, indexTypeId} = this.state;
    const {cityId} = selectCity;
    const {proId} = selectPro;
    const params = {
      markType,
      provId: proId,
      cityId,
      date,
      productCategory: classify.id,
      productSeries: series.id,
      indexType: indexTypeId
    };
    dispatch({
      type: 'productAnalysisTableDataModels/fetchTableData',
      payload: params
    });
    dispatch({
      type: 'productAnalysisTableDataModels/fetchProductScreen',
      payload: {
        markType
      }
    });
    dispatch({
      type: 'productAnalysisTableDataModels/fetchMaxData',
      payload: {
        markType
      }
    });
  };

  render(){
    const {productAnalysisPopData}=this.props;
    const {thData,tbodyData}=this.state;
    const {indexType,indexTypeIdAndName}=this.state; // 指标类型
    const {productClass,classify,series,markType}=this.state; // 产品分类
    const { MonthPicker } = DatePicker;
    let {treeMapData} = productAnalysisPopData;
    let {productRankingTop} = productAnalysisPopData;
    let {productRankingLast} = productAnalysisPopData;
    let {provinceBarData} = productAnalysisPopData;
    let {productTimeLineData} = productAnalysisPopData;
    if (!treeMapData || !treeMapData.treeData) {
      treeMapData = {
        treeData: {
          treeChart: []
        },
        example: "",
        unit: "",
      }
    }
    if (!productRankingTop || !productRankingTop.chart) {
      productRankingTop = {
        "chartX": [],
        "chart": [],
        "example": "",
        "unit": ""
      }
    }
    if (!productRankingLast || !productRankingLast.chart) {
      productRankingLast = {
        "chartX": [],
        "chart": [],
        "example": "",
        "unit": ""
      }
    }
    if (!provinceBarData || !provinceBarData.chart) {
      provinceBarData = {
        example: [],
        unit: "",
        chart: [],
        chartX: []
      }
    }
    if (!productTimeLineData[0]) {
      productTimeLineData = [{
        chart: [],
        chartX: [],
        example: "",
        unit: ""
      }]
    }
    const {paramObject} = this.state;
    let {chartTypesData} = productAnalysisPopData;
    if (!chartTypesData) {
      chartTypesData = []
    }
    const {layOut} = this.state;
    let contentWidth; // contentWidth会影响到子组件的显示效果
    const sw = window.screen.width;
    if ((sw >= 1316) && (sw < 1389)) {
      contentWidth = !window.chrome ? 1137 : 1151;
    }
    else if ((sw >= 1390) && (sw < 1869)) {
      contentWidth = !window.chrome ? 1200 : 1213;
    }
    else if ((sw >= 1280) && (sw < 1315)) {
      contentWidth = !window.chrome ? 1046 : 1046;
    }
    else if ((sw >= 750) && (sw < 1000)) {
      contentWidth = !window.chrome ? 648 : 647;
    }
    else if ((sw >= 1001) && (sw < 1279)) {
      contentWidth = !window.chrome ? 834 : 848;
    }
    else if ((sw >= 1870) && (sw < 2159)) {
      contentWidth = !window.chrome ? 1566 : 1580;
    }
    let items = [];
    const titleNames = {};
    if (chartTypesData !== undefined) {
      if (chartTypesData.length > 0) {
        const componentLayoutArr = this.getComponentLayoutArr(chartTypesData, layOut); // 返回组件名称和组件所占列数的布局对象数组
        const colWidth = contentWidth / 24;
        items = this.getComponentItems(componentLayoutArr, colWidth, titleNames, indexType);
       // console.log(items)
      }
    }
    const chartLayOut = <ComponentLayout>{items}</ComponentLayout>;
    const {proCityModels} = this.props;
    const {cityId,cityName} = proCityModels.selectCity;
    const {proId,proName} = proCityModels.selectPro;
    const {isIndexExplainShow}=this.state;
    const {date}=this.state;
    const defaultValueDate=moment(date);
    const {columnName,rowName}=this.state;
    const data={
      param:paramObject,
      city:cityId,
      prov:proId,
      cityname:cityName,
      provname:proName,
      title:rowName,
      titleName:columnName
    };
    const {tableAllOpen,expandedRowKeys,iconExplainContent} = this.state;
    let {markTypeName} = this.state;
    const {isDownloadShow}=this.state;
    const downloadParam={
      name:markTypeName,
      dateType:2,
      markType,
    };
    if(markTypeName==="产品分析"){
      markTypeName="移动业务产品分析专题"
    }else if(markTypeName==="宽带业务产品分析"){
      markTypeName="宽带业务产品分析专题"
    }
    const triangle = <i className={styles.dateTriangle} />
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.page}>
            <div className={styles.title}>
              <p>{markTypeName}</p>
              <div className={styles.icon} onClick={this.indexExplain} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex}>
                <Icon type="file-text" />
                {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
              </div>
            </div>
            <header>
              <div className={styles.row}>
                <div className={styles.item}><ProCity markType={markType} /></div>
                <div className={styles.item}>
                  <div className={styles.option}>日期：</div>
                  <div className={styles.selected}>
                    {date?  <MonthPicker
                      suffixIcon={triangle}
                      disabledDate={this.disabledEndDate}
                      defaultValue={defaultValueDate}
                      locale={moment.locale('zh-cn')}
                      allowClear={false}
                      onChange={this.onChangeDate}
                      placeholder="Select month"
                      monthCellContentRender={(current) =>
                        (
                          <div title={`${current.month()+1}月`}>
                            {`${current.month()+1}月`}
                          </div>
                        )
                      }
                    />:null}
                  </div>
                </div>
              </div>
              <div className={markTypeName==="移动业务产品分析专题"?styles.row:styles.row2}>
                <div className={styles.item}>
                  <ProductScreen
                    productClass={productClass}
                    classify={classify}
                    series={series}
                    callBackSeriesAndClassify={this.callBackSeriesAndClassify}
                    callBackClassify={this.callBackClassify}
                    markType={markType}
                  />
                </div>
                <div className={styles.item}>
                  <div className={styles.option}>指标类型：</div>
                  <div className={styles.selected}>
                    <IndexScreen
                      indexType={indexType}
                      indexTypeIdAndName={indexTypeIdAndName}
                      callBackIndexScreen={this.callBackIndexScreen}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.button}>
                <div onClick={this.query}>查询</div>
                <div onClick={this.download}>下载</div>
              </div>
            </header>
            <div className={styles.disable} onClick={()=>this.goToPop(data)} ref={this.popClass}>
              <div className={styles.chartPop}>
                <img src={chartPop} alt="" className={styles.chartPopImg} onClick={this.popNone.bind(this)} />
              </div>
              <div className={styles.popTitle}>
                <div>{columnName}</div>
                <div>&nbsp; &gt; &nbsp;</div>
                <div>{rowName}</div>
              </div>
              {/* 弹出层 */}

              {chartLayOut}

            </div>
            <div className={styles.formTitle}>
              数据表
              <div className={styles.line} />
              {markTypeName==="移动业务产品分析专题"?
                <div className={styles.checked}>
                  <input type="checkbox" checked={tableAllOpen} onChange={this.inputClicked} />
                  <span>展开全部</span>
                </div>:null}
            </div>
            {/* 表格 */}
            <div className={styles.form}>
              <Table
                onExpand={this.onExpend}
                columns={thData}
                pagination={false}
                dataSource={tbodyData}
                expandedRowKeys={expandedRowKeys}
                scroll={{ x: (200*thData.length) }}
              />
            </div>

            {/* 指标解释 */}
            <IndexExplain show={isIndexExplainShow} callback={this.callbackCloseIndexExplain} markId="PRODUCT_YD" />
          </div>
          <DownloadAll
            downloadParam={downloadParam}
            visible={isDownloadShow}
            indexTypeVisible={false}
            onCancel={this.downloadClose}
          />
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default ProductAnalysis;
