import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva/index';
import isEqual from 'lodash/isEqual';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ProductViewTimeEchart from '../../components/ProductView/TimeEchart';
import ProductViewAreaEchart from '../../components/ProductView/AreaEchart';
import ProductViewPieEchart from '../../components/ProductView/PieEchart';
import ProductViewTerminalEchart from '../../components/ProductView/TerminalEchart';
import ProductViewTableEchart from '../../components/ProductView/TableEchart';
import ProductViewTrafficEchart from '../../components/ProductView/TrafficEchart';
import Cookie from '@/utils/cookie';

import ProductCondition from "@/components/ProductView/productCondition"; // 产品总览筛选条件组件
import IndexConfiguration from "@/components/ProductView/indexConfiguration"; // 产品总览指标配置组件
import ProductTable from "@/components/ProductView/productTable"; // 产品总览表格组件
import CollectComponent from '../../components/myCollection/collectComponent'

@connect(({ productViewModels, loading,proCityModels }) => ({
  productViewModels,proCityModels,
  loading: loading.models.productViewModels,
}))
class ProductView extends PureComponent {

  constructor(props){
    super(props);
    const {dispatch}=props;
    dispatch({
      type:"productViewModels/fetchMaxDate",
      payload:{
        dateType: "2",
        markType: "productView",
      }
    });// 最大账期
    dispatch({
      type:"productViewModels/fetchCondition",
      payload:{
        markType:"productView"
      },
    }); // 筛选条件
    dispatch({
      type:"productViewModels/fetchIndexConfig",
      payload:{
        markType:"productView"
      },
    }); // 指标配置
    this.state={
      productIndexName:"", // 已选产品、指标名称
      // provId:"", //
      // cityIdTable: "-1", //
      flag: !(Cookie.getCookie('loginStatus').power === "specialCity" || Cookie.getCookie('loginStatus').power === "city"),
    }
  }

  componentDidMount() {
    // this.initEchart();
    this.getProductViewTable("1");
  }

  // shouldComponentUpdate(nextProps) {
  //   const {proCityModels}=this.props;
  //   const {selectCity,selectPro} = proCityModels;
  //   const {cityId}=selectCity;
  //   const {proId}=selectPro;
  //   if (cityId!==nextProps.proCityModels.selectCity.cityId) {
  //     return false
  //   }
  //   if (proId!==nextProps.proCityModels.selectPro.proId) {
  //     return false
  //   }
  //   return true
  // }

  componentDidUpdate(prevProps){
    const {productViewModels} = this.props;
    const {saveIndexConfig, tableData} = productViewModels;
    if(!isEqual(saveIndexConfig, prevProps.productViewModels.saveIndexConfig)){
      this.getProductViewTable("1");
    }

    // 判断表格数据是否改变 改变后重新获取默认名称
    if(!isEqual(tableData,prevProps.productViewModels.tableData)){
      this.getInitProductIndexName();
    }
  }

  /**
  * @date: 2019/6/20
  * @author 风信子
  * @Description: 获取默认的产品名称和指标名称
  * @method getInitProductIndexName
  * @param {参数类型} 参数： 参数描述：
  * @return {返回值类型} 返回值说明
  */
  getInitProductIndexName(){
    const{productViewModels}=this.props;
    const{ tableData }=productViewModels;
    const {thData, tbodyData} = tableData;
    const{productIndexName}=this.state;
    if(productIndexName==="" && tbodyData.length > 0){
      this.setState({
        productIndexName: `${tbodyData[0].productName}、${thData[4].name}`,
      })
    }
    this.setState({
      provId:"",
      cityIdTable:"-1"
    })
  }

  // 获取时间分布图数据
  getTimeData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {
        indexId:"",
        productList:[],

        chartType:"time", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"time", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchTimeEchartData`,
      payload: params
    });
  };

  // 获取地域分布图数据
  getAreaData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"product", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"product", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchAreaEchartData`,
      payload: params,
    });
    return null
  };

  // 获取4G网络用户占比饼图数据
  getPieData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchPieEchartData`,
      payload: params,
    });
  };

  // 获取终端使用情况图数据
  getTerminalBarData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"terminal", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"terminal", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchTerminalBarEchartData`,
      payload: params
    });
  };

  // 获取渠道分布情况图数据
  getChannelBarData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"channel", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"channel", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchChannelBarEchartData`,
      payload: params
    });
  };

  // 获取客户情况图数据
  getPeopleBarData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"client", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"client", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchPeopleBarEchartData`,
      payload: params
    });
  };

  // 获取上网流量偏好数据
  getFlowBarData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"flow", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"flow", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchFlowBarEchartData`,
      payload:params,
    });
  };

  // 获取APP使用偏好-top10数据
  getTop10TableData=(tableParams)=>{
    const {dispatch, productViewModels}=this.props;
    const {conditionValue} = productViewModels;
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {

        indexId:"",
        productList:[],

        chartType:"", // 图表类型

        ...conditionValue
      };
    }else {
      params = {

        // 16个conditionValue中参数
        markType:"productView",
        date: "", // 日期
        provId: "", // 省份
        cityId: "", // 地市
        productClass: [], // 产品分类
        productId: "", // 产品编码
        productName: "", // 产品名称
        clientType: [],  // 客户类型
        channelType: [], // 渠道类型
        fusion: [], // 是否融合
        goodNum: [], // 是否靓号
        mainAssociate: [], // 主副卡
        associateNum: [], // 福卡数量
        feeLevel: [], // 费用分档
        monthFee: [], // 月费
        indexType: [],// 指标类型
        sourceSystem:[],

        indexId:"",
        productList:[],

        chartType:"", // 图表类型
      }
    }
    if(tableParams){
      Object.assign(params,tableParams)
    }
    dispatch({
      type: `productViewModels/fetchTableEchartData`,
      payload:params,
    });
  };




  /**
   * @date: 2019/6/7
   * @author liuxiuqian
   * @Description: 获取数据情况表格接口
   * @method getProductViewTable
   * @param {string} 参数：num 参数描述：当前页码
   * @param {string} 参数：type 参数描述：排序方式 asc是指定列按升序排列，desc则是指定列按降序排列
   * @param {string} 参数：kpiId 参数描述：指标id
   */
  getProductViewTable(num="1",type="desc", kpiId=""){
    const {dispatch, productViewModels}=this.props;
    const {saveIndexConfig, conditionValue} = productViewModels;
    const indexConfingId = [];
    saveIndexConfig.forEach((item)=>{
      indexConfingId.push(item.indexId)
    });
    let params = {};
    if(Object.keys(conditionValue).length > 5){
      params = {
        num,
        sorter: type === "" ? "desc" : type,
        sorterIndex: kpiId,
        indexConfingId,
        markType:"productView",
        pageNum:"10",
        ...conditionValue
      }
    }else {
      params = {
        indexConfingId,
        markType:"productView",
        num,
        sorter: type === "" ? "desc" : type,
        sorterIndex: kpiId,
        pageNum:"10",
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
        indexType: [],
        sourceSystem:[],
      }
    }

    dispatch({
      payload: params,
      type: `productViewModels/fetchProductViewTable`,
      // eslint-disable-next-line consistent-return
      callback:(response)=>{
        if(num !== "1") return null;
        const { tbodyData,thData} = response;
        if(tbodyData.length > 0 ){
          const {cityId,provId,productId,productName,classifyId,sourceSystemId} = tbodyData[0];
          const params2 = {
            cityId,
            productList:productId,
            productClass:[classifyId],
            productName,
            productId,
            provId,
            indexId:thData[4].kpiId,
            indexName: thData[4].name,
            sourceSystem: [sourceSystemId], // 系统来源
          };
          this.initEchart("callBackTable",params2);
        }else {
          this.cleanEchartData();// 清空图数据
        }

      }
    });
  }

  /**
   * @date: 2020/4/28
   * @author 风信子
   * @Description: 方法说明 清空图数据
   * @method 方法名 cleanEchartData
   */
  cleanEchartData=()=>{
    const {dispatch}=this.props;
    // 全部产品合计时间趋势图
    dispatch({
      type: `productViewModels/getTimeEchartData`
    });
    // 全部产品合计地域分布图
    dispatch({
      type: `productViewModels/getAreaEchartData`
    });
    // 全部产品合计4G网络用户占比
    dispatch({
      type: `productViewModels/getPieEchartData`
    });
    // 全部产品合计终端使用情况
    dispatch({
      type: `productViewModels/getTerminalBarEchartData`
    });
    // 全部产品合计终端使用情况
    dispatch({
      type: `productViewModels/getChannelBarEchartData`
    });
    // 全部产品合计终端使用情况
    dispatch({
      type: `productViewModels/getPeopleBarEchartData`
    });
    // 上网流量偏好
    dispatch({
      type: `productViewModels/getFlowBarEchartData`
    });
    // APP使用偏好-top10
    dispatch({
      type: `productViewModels/getTableEchartData`
    })

  };

  // 请求6个echart图
  initEchart=(callBackTable,params)=>{
    if(params){
      const {productName,indexName,provId,cityId} = params;
      this.setState({
        productIndexName: `${productName}、${indexName}`,
        // provId,
        // cityIdTable:cityId,
        flag:this.flagCityEcahrt({provId, cityIdTable:cityId})
      })
    }
    this.getTop10TableData(params);
    this.getFlowBarData(params);
    this.getPieData(params);
    this.getTimeData(params);
    this.getAreaData(params);
    this.getTerminalBarData(params);
    this.getChannelBarData(params);
    this.getPeopleBarData(params);
  };

  // 下载要用
  productTableRef = (ref) => {
    this.child = ref;
  };

  /**
  * @date: 2019/6/20
  * @author 风信子
  * @Description: 点击查询触发
  * @method HandleSearch
  * @param {参数类型} 参数： 参数描述：
  * @return {返回值类型} 返回值说明
  */
  HandleSearch(){
    this.setState({
      // provId:"",
      // cityIdTable:"-1",
      productIndexName:"",
      flag:this.flagCityEcahrt({provId:"", cityIdTable:"-1"})
    });
    // this.initEchart();
    this.child.searchReset();// 调用表格子组件
    this.getProductViewTable();
  }

  handleDownload(){
    this.child.handleDownload();
  }

  flagCityEcahrt(proAndCityId){
    const {power} = Cookie.getCookie('loginStatus');
    const {proCityModels}=this.props;
    const {provId, cityIdTable} = proAndCityId;
    const {selectCity,selectPro} = proCityModels;
    const {proId}=selectPro;
    const {cityId}=selectCity;
    let flag=false; // flag 判断地市用户标志
    if(power === 'city' || power === 'specialCity'){
      flag=false
    }else  if(proId==='011'|| proId==='013'|| proId==='031'|| proId==='083'){ // 判断筛筛选条件的省份
      flag=false;
    }else if(provId==='011'|| provId==='013'|| provId==='031'|| provId==='083'){ // 判断表格传过来的
      flag=false;
    }else if(cityIdTable !== "-1"){ // 判断是否点击过来的地市
      flag=false;
    }else if(cityId === '-1' || cityId===undefined || cityId===""){ // 判断省权限的
      flag=true;
    }
    return flag;
  }

  render() {
    const {productIndexName, flag} = this.state;
    const{productViewModels}=this.props;
    const{
      timeEchartData,   // 全部产品合计时间趋势图
      areaEchartData,   // 全部产品合计地域分布图
      pieEchartData,    // 全部产品合计4G网络用户占比
      flowBarData,      // 上网流量偏好
      terminalBarData,  // 全部产品合计终端使用情况
      tableEchartData,  // APP使用偏好-top10
      tableData,        // 表格数据
      channelBarData,   // 2019.8.12新增全部产品合计渠道分布图
      peopleBarData   // 2019.8.12新增全部产品合计客户分布图
    }=productViewModels;

    // 下载默认参数
    const defaultParams = {
      title:"产品总览",
      tableName:"数据情况概览",
      params: [
       {
          name: "产品分类",
          value: []
        },{
          name: "产品编码",
          value: ""
        },{
          name: "产品名称",
          value: ""
        },{
          name: "客户类型",
          value: []
        },{
          name: "渠道类型",
          value: []
        },{
          name: "是否融合",
          value: []
        },{
          name: "是否靓号",
          value: []
        },{
          name: "主副卡",
          value: []
        },{
          name: "副卡数量",
          value: []
        },{
          name: "费用分档",
          value: []
        },{
          name: "套餐月费",
          value: []
        },{
          name: "指标类型",
          value: []
        },{
          name: "指标配置",
          value: []
        }
      ]
    };
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      paddingBottom:'10px',
      width:'30px'
    };
    return(
      <PageHeaderWrapper>
        <div className={styles.page}>
          <span className={styles.title}>产品总览</span>
          <CollectComponent key='productView' markType='productView' searchType='2' imgStyle={collectStyle} />
          <ProductCondition callBackHandleSearch={()=>{this.HandleSearch()}} callBackHandleDownload={()=>{this.handleDownload()}} />
          <div className={styles.tableContent}>
            <div className={styles.tableTop}>
              <span className={styles.iconRed} />
              <span className={styles.tableName}>数据情况概览</span>
              <span className={styles.indexConfig}> <IndexConfiguration /></span>
            </div>
            <div className={styles.notes}>注：页面数据每月15日左右发布；点击产品名称进入产品详情页；点击表格数据，下方图形联动</div>
            <ProductTable
              tableData={tableData}
              defaultParams={defaultParams}
              markType="productView"
              onRef={this.productTableRef}
              openFunction
              JumpPage
              refreshMake
              sorter // 暂时注释
              // frontEndSorter
              callBackRefreshEchart={(params)=>{this.initEchart("callBackTable",params)}}
              callBackNum={(num, type, kpiId)=>{this.getProductViewTable(num, type, kpiId)}}
            />
          </div>
          <div style={{fontSize:window.screen.width>1870?16:14}}>
            <span className={styles.selectNameTitle}>已选产品、指标：</span>{productIndexName}
          </div>
          <div className={styles.chart}>
            <div className={styles.chartRow}>
              {flag &&
                (
                  <Fragment>
                    <div className={styles.item}><ProductViewTimeEchart chartData={timeEchartData} /></div>
                    <div className={styles.interval} />
                    <div className={styles.item}><ProductViewAreaEchart chartData={areaEchartData} /></div>
                  </Fragment>)
              }
              { !flag &&(<div className={styles.item}><ProductViewTimeEchart chartData={timeEchartData} /></div>)}
            </div>
            <div className={styles.chartRow}>
              <div className={styles.item}><ProductViewPieEchart chartData={pieEchartData} /></div>
              <div className={styles.interval} />
              <div className={styles.item}><ProductViewTerminalEchart chartData={terminalBarData} /></div>
            </div>
            <div className={styles.chartRow}>
              <div className={styles.item}><ProductViewTableEchart chartData={tableEchartData} /></div>
              <div className={styles.interval} />
              <div className={styles.item}><ProductViewTrafficEchart chartData={flowBarData} /></div>
            </div>
            <div className={styles.chartRow}>
              <div className={styles.item}><ProductViewTerminalEchart chartData={channelBarData} chartType="channel" />
              </div>
              <div className={styles.interval} />
              <div className={styles.item}><ProductViewTerminalEchart chartData={peopleBarData} chartType="client" />
              </div>
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }

}
export default ProductView
