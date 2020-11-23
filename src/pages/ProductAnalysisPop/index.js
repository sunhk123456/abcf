/* eslint-disable react/self-closing-comp */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: index/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/1/16/016
 */
import React, {PureComponent} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import {Icon} from 'antd';
import Treemap from "../../components/ProductAnalysisPop/treemap"
import ProductRankingTop from "../../components/ProductAnalysisPop/productRankingTop"
import ProductRankingLast from "../../components/ProductAnalysisPop/productRankingLast"
import ProvinceBar from "../../components/ProductAnalysisPop/provinceBar"
import ProductTimeLine from "../../components/ProductAnalysisPop/productTimeLine"
import DataTable from "../../components/ProductAnalysisPop/dataTable"
import style from "./index.less"
import PageHeaderWrapper from "../../components/PageHeaderWrapper"
import ComponentLayout from "../../components/ProductAnalysisPop/componentLayout";
import iconFont from '../../icon/Icons/iconfont'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({productAnalysisPopData}) => ({productAnalysisPopData}))

class ProductAnalysisPop extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      layOut: {
        layout_5: [12, 6, 6, 12, 12],
        layout_4_01: [12, 12, 12, 12],// 缺面积图
        layout_4_02: [12, 6, 6, 24],// 缺地域分布
        layout_3: [12, 12, 24],// 缺排名图或者缺面积图和地域分布
        layout_2: [12, 12],// 缺面积图和排名图或者缺排名图和地域分布
        layout_1: [24],// 只有时间趋势图
        layout_10: [24, 24, 24, 24, 24],
        layout_11: [24, 24, 24, 24],
        layout_8: [24, 24, 24],
        layout_9: [24, 24],
      },// 布局
      tableProductCategory: "",// 点击树形图获取产品种类
      tableState: 1,
      tableTitle: "",
    }
  }

  componentDidMount() {
    // const {productCategory}=this.state
    const {location, dispatch} = this.props;
    const {data} = location;
    const {param} = data;
    const {markType, date, indexType, indexId, productCategory, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = data;
    const {prov} = data;

    dispatch({
      type: 'productAnalysisPopData/fetch',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
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
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
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
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
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
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName
      }
    });
    dispatch({
      type: 'productAnalysisPopData/productTimeline',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName
      }
    });
    dispatch({
      type: 'productAnalysisPopData/charttypes',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
      }
    });
  }

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
    const wiw = window.innerWidth;
    // console.log("window.innerWidth")
    // console.log(wiw)
    switch (data.length) {
      case 1:
        cols = layoutCols.layout_1;
        layouts = this.getLayouts(data, cols);
        break;
      case 2:
        if (wiw >= 1200) {
          cols = layoutCols.layout_2;
          layouts = this.getLayouts(data, cols);
        }
        else {
          cols = layoutCols.layout_9;
          layouts = this.getLayouts(data, cols);
        }
        break;
      case 3:
        if (wiw >= 1200) {
          cols = layoutCols.layout_3;
          layouts = this.getLayouts(data, cols);
        }
        else {
          cols = layoutCols.layout_8;
          layouts = this.getLayouts(data, cols);
        }
        break;
      case 4:
        if (wiw >= 1200) {
          if (data[0] === 'treeMap') {
            cols = layoutCols.layout_4_02;
          } else {
            cols = layoutCols.layout_4_01;
          }
          layouts = this.getLayouts(data, cols);
        }
        else {
          cols = layoutCols.layout_11;
          layouts = this.getLayouts(data, cols);
        }

        break;
      default :
        if (wiw >= 1200) {
          cols = layoutCols.layout_5;
          layouts = this.getLayouts(data, cols);
        }
        else {
          cols = layoutCols.layout_10;
          layouts = this.getLayouts(data, cols);
        }
        break;
    }
    return layouts;
  };

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

  // 点击矩形树状图图例重新请求数据

  treemapClick = (productCategory, title) => {
    const {location, dispatch} = this.props;
    // const {tableProductCategory, tableState, tableTitle} = this.state;
    this.setState({
      tableProductCategory: productCategory,
      tableState: 0,
      tableTitle: title
    });
    // console.log(tableProductCategory);
    // console.log(tableState);
    // console.log(tableTitle);
    const {data} = location;
    const {param} = data;
    const {markType, date, indexType, indexId, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = data;
    const {prov} = data;
    dispatch({
      type: 'productAnalysisPopData/productRankTop',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
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
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
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
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName
      }
    });
    dispatch({
      type: 'productAnalysisPopData/productTimeline',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": productCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName
      }
    });
  };

  /**
   *
   * @param obj 具有组件名称和组件所占列数的布局对象
   * @param colWidth  每一列的宽度
   * @param titleNames 图表的title
   * @returns {XML} 返回对应的组件
   */
  getLayoutItem = (obj, colWidth, titleNames, indexType, length) => {

    const {productAnalysisPopData, location} = this.props;
    const {data} = location;
    const {title} = data;
    const {tableTitle} = this.state;
    if (tableTitle === "") {
      this.setState({
        tableTitle: title
      })
    }
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
    const mywidth = "100%";
    let myheight;
    const sw = window.innerWidth;
    // 只有一行
    if (length === '2' || length === '1') {
      if ((sw >= 1316) && (sw < 1389)) {
        myheight = 390 * 0.8;
      } else if ((sw >= 1390) && (sw < 1869)) {
        myheight = 480 * 0.8;
      } else if ((sw >= 1280) && (sw < 1315)) {
        myheight = 434 * 0.8;
      } else if ((sw >= 1001) && (sw < 1279)) {
        myheight = 476 * 0.8;
      } else if ((sw >= 750) && (sw < 1000)) {
        myheight = 340 * 0.8;
      } else if ((sw >= 1870) && (sw < 2159)) {
        myheight = 708 * 0.8;
      }
    }
    if ((sw >= 1316) && (sw < 1389)) {
      myheight = 195;
    }
    else if ((sw >= 1390) && (sw < 1869)) {
      myheight = 240;
    } else if ((sw >= 1280) && (sw < 1315)) {
      myheight = 217;
    } else if ((sw >= 1001) && (sw < 1279)) {
      myheight = 238;
    } else if ((sw >= 750) && (sw < 1000)) {
      myheight = 170;
    } else if ((sw >= 1870) && (sw < 2159)) {
      myheight = 354;
    }
    switch (obj.itemName) {
      case "treeMap":
        return <Treemap treeChartData={treeMapData} divHeight={myheight} divWidth={mywidth} treemapClick={this.treemapClick} ref={obj.layoutCols} />;
      case "topBar":
        return <ProductRankingTop productRankingTop={productRankingTop} titleName={tableTitle} divHeight={myheight} divWidth={mywidth} className={style.ProductRankingTop} ref={obj.layoutCols} />;
      case "lastBar":
        return <ProductRankingLast productRankingLast={productRankingLast} titleName={tableTitle} divHeight={myheight} divWidth={mywidth} className={style.ProductRankingTop} ref={obj.layoutCols} />;
      case "provinceBar":
        return <ProvinceBar provinceBarData={provinceBarData} divHeight={myheight} divWidth={mywidth} ref={obj.layoutCols} />;
      default :
        return <ProductTimeLine productTimeLineData={productTimeLineData[0]} titleName={tableTitle} divHeight={myheight} divWidth={mywidth} ref={obj.layoutCols} />
    }
  };


  // 详情页title
  popTitle = (data) => {
    const {param, cityname, titleName} = data
    let {provname} = data
    const {date, indexTypeIdAndName} = param
    const day = date.split("-");
    if (provname === "全国") {
      provname = ""
    }
    return `${day[0]}年${day[1]}月${cityname}${provname}${titleName}${indexTypeIdAndName.name}`
  };

  // 返回按钮
  returnButton = () => {
    const {location} = this.props;
    const {data} = location;
    const {param} = data;
    const {markTypeName,markType} = param;
    router.push({
      pathname: '/ProductAnalysis',
      state: {
        id: markType,
        name: markTypeName,
        title:markTypeName,
      }
    })
  };

  render() {
    let {productAnalysisPopData} = this.props;
    const {location} = this.props;
    const {data} = location;
    const {param} = data;
    const {indexType,markTypeName,markType} = param;
    if (!productAnalysisPopData) {
      productAnalysisPopData = {
        treeMapData: {},
        productRankingTop: {},
        productRankingLast: {},
        provinceBarData: {},
        productTimeLineData: []
      }
    }
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
    // const {treeMap, topBar, lastBar, provinceBar, line} = this.state
    let {chartTypesData} = productAnalysisPopData
    if (!chartTypesData) {
      chartTypesData = []
    }
    const {layOut, tableProductCategory, tableState} = this.state;
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
      }
    }
    const chartLayOut = <ComponentLayout>{items}</ComponentLayout>;
    let markTypeNameTitle='';
    if(markTypeName==="产品分析"){
      markTypeNameTitle="移动业务产品分析专题"
    }else if(markTypeName==="宽带业务产品分析"){
      markTypeNameTitle="宽带业务产品分析专题"
    }
    return (
      <PageHeaderWrapper>
        <div className={style.productAnalysisPop}>
          <div className={style.popUpTitle}>
            <div>{markTypeNameTitle}</div>
            <div>&nbsp; &gt; &nbsp;</div>
            <div>{this.popTitle(data)}</div>
            <div className={style.fanhui} onClick={this.returnButton}>
              <IconFont className={style.iconFont} type="icon-fanhuianniu" />
            </div>
          </div>
          <div className={style.charts}>
            {chartLayOut}
          </div>
          <DataTable state={data} tableProductCategory={tableProductCategory} tableState={tableState} markTypeName={markTypeName} markType={markType} />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ProductAnalysisPop;
