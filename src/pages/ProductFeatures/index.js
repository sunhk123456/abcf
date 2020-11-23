import React, {Fragment,PureComponent } from 'react';
import { connect } from 'dva/index';
import moment from 'moment';
import isEqual from "lodash/isEqual"; // 产品总览表格组件
import {Button, Icon} from "antd";
import router from 'umi/router';
import Cookie from '@/utils/cookie';
import {getRouterState} from "@/utils/tool"; // 工具方法

import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ProductViewTimeEchart from '../../components/ProductView/TimeEchart';
import ProductFeaturesLineBarEchart from '../../components/ProductFeatures/ProductFeaturesLineBarEchart';
import ProductFeaturesTwoLineEchart from '../../components/ProductFeatures/ProductFeaturesTwoLineEchart';
import ProductViewAreaEchart from '../../components/ProductView/AreaEchart';
import ProductViewTerminalEchart from '../../components/ProductView/TerminalEchart';
import IndexConfiguration from '../../components/ProductView/indexConfiguration';

import ProductTable from "@/components/ProductView/productTable";
import iconFont from "../../icon/Icons/iconfont";


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({ productViewModels,productFeaturesModels,proCityModels}) => ({
  productViewModels,productFeaturesModels,proCityModels
}))
class ProductFeatures extends PureComponent {

  constructor(props){
    super(props);
    this.state={
      tab:1,
      productIndexName:"", // 已选产品、指标名称
    //   flag:false,
    }
  }

  componentDidMount() {
    const{dispatch, location}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    dispatch({
      type:"productViewModels/fetchIndexConfig",
      payload:{
        markType:"productView"
      },
    }); // 指标配置
    if(state){
      this.getProductViewTable("init");
      this.getDevelopTable("1");
    }
    this.initEchart(); // 初始化8个图表
    this.getBasicInfoData() // 请求基本信息

  }

  componentDidUpdate(pevProps){
    const {productViewModels,productFeaturesModels} = this.props;
    const {saveIndexConfig} = productViewModels;
    const {developTableData} = productFeaturesModels;
    if(!isEqual(saveIndexConfig, pevProps.productViewModels.saveIndexConfig)){
      this.getProductViewTable("config");
    }
    // 判断表格数据是否改变 改变后重新获取默认名称
    if(!isEqual(developTableData,pevProps.productFeaturesModels.developTableData)){
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
    const{productFeaturesModels}=this.props;
    const {developTableData} = productFeaturesModels;
    const {thData, tbodyData} = developTableData
    if(tbodyData.length > 0){
      this.setState({productIndexName: `${tbodyData[0].developMonth }、${thData[1].name}`})
    }

  }

  // 指标切换
  setTab=(num)=>{
    this.setState({
      tab:num,
    })
  };

  // 请求基本信息 productFeaturesBasicInfoData
  getBasicInfoData=()=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    // const params = {
    //
    //   // 16个conditionValue中参数
    //   markType:"productView",
    //   date: "", // 日期
    //   proId: "", // 省份
    //   cityId: "", // 地市
    //   productClass: [], // 产品分类
    //   productId: "", // 产品编码
    //   productName: "", // 产品名称
    //   clientType: [],  // 客户类型
    //   channelType: [], // 渠道类型
    //   fusion: [], // 是否融合
    //   goodNum: [], // 是否靓号
    //   mainAssociate: [], // 主副卡
    //   associateNum: [], // 福卡数量
    //   feeLevel: [], // 费用分档
    //   monthFee: [], // 月费
    //   indexType: [],// 指标类型
    //
    //   indexId:"kpi_prd0004",
    //   productList:[],
    //
    //   chartType:"", // 图表类型
    // };
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"",});
    dispatch({
      type: `productFeaturesModels/fetchBasicInfoData`,
      payload:  chartParams
    });
  };

  // 出账收入频次图接口
  getLineBarEchart=()=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    // const params = {
    //
    //   // 16个conditionValue中参数
    //   markType:"productView",
    //   date: "", // 日期
    //   proId: "", // 省份
    //   cityId: "", // 地市
    //   productClass: [], // 产品分类
    //   productId: "", // 产品编码
    //   productName: "", // 产品名称
    //   clientType: [],  // 客户类型
    //   channelType: [], // 渠道类型
    //   fusion: [], // 是否融合
    //   goodNum: [], // 是否靓号
    //   mainAssociate: [], // 主副卡
    //   associateNum: [], // 福卡数量
    //   feeLevel: [], // 费用分档
    //   monthFee: [], // 月费
    //   indexType: [],// 指标类型
    //
    //   indexId:"kpi_prd0004",
    //   productList:[],
    //
    //   chartType:"", // 图表类型
    // };
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"",});
    dispatch({
      type: `productFeaturesModels/fetchLineBarEchartData`,
      payload:  chartParams
    });
  };

  // 2. 出账收入变化分布
  getTwoLineEchart=(dateString)=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    let benchmarkingDate='';
     if(params.date){
       benchmarkingDate=moment(params.date).subtract(1,'months').format('YYYY-MM');
     }
    let chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"",benchmarkingDate});
    if(dateString){
      chartParams=Object.assign(chartParams,{benchmarkingDate:dateString});
    }
    dispatch({
      type: `productFeaturesModels/fetchTwoLineEchartData`,
      payload: chartParams
    });
  };

  // 3.流量频次图
  getFlowFrequency=()=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"flow",});
    dispatch({
      type: `productFeaturesModels/fetchFlowFrequencyData`,
      payload: chartParams
    });
  };

  // 4.语音频次图
  getVoiceFrequency=()=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"voice",});
    dispatch({
      type: `productFeaturesModels/fetchVoiceFrequencyData`,
      payload: chartParams
    });
  };

  // 5.合计趋势图
  getTotalTrend=(object)=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"developQualityTime",},object);
    dispatch({
      type: `productFeaturesModels/fetchTotalTrendData`,
      payload: chartParams
    });
  };

  // 6.合计地域分布图
  getTotalArea=(object)=>{
    let flag=false; // flag 判断地市用户标志
    if(object){
      const {proId,cityId}=object;
      const {power} = Cookie.getCookie('loginStatus');
      if(power === 'city' || power === 'specialCity'){
        flag=false
      }else  if(proId==='011'|| proId==='013'|| proId==='031'|| proId==='083'){ // 判断筛筛选条件的省份
        flag=false;
      }else if(cityId === '-1' || cityId===undefined || cityId===""){ //
        flag=true;
      }
      // this.setState({
      //   flag
      // });
    }
    console.log("xxd发请求flag")
    console.log(flag)
    if (!flag){
      return null
    }
    console.log("发送请求")
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"developQuality",},object);
    dispatch({
      type: `productFeaturesModels/fetchTotalAreaData`,
      payload: chartParams
    });
    return null
  };

  // 7.渠道分布图
  getChannelEchart=(object)=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"channel",},object);
    dispatch({
      type: `productFeaturesModels/fetchChannelEchartData`,
      payload: chartParams
    });
  };

  // 8.客户分布图
  getPeopleEchart=(object)=>{
    const {dispatch}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,paramsEChart} = state;
    const chartParams=Object.assign(params,paramsEChart,{markType:"productView", chartType:"client",},object);
    dispatch({
      type: `productFeaturesModels/fetchPeopleEchartData`,
      payload: chartParams
    });
  };



  // 产品总览表格（上部带指标配置的表格）
  getProductViewTable(make){
    const {dispatch, location, productViewModels}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params,saveIndexConfig} = state;
    const indexConfingId = [];
    let IndexConfigData = saveIndexConfig;
    if(make === "config"){
      IndexConfigData = productViewModels.saveIndexConfig
    }
    IndexConfigData.forEach((item)=>{
      indexConfingId.push(item.indexId)
    })
    const paramsTable = Object.assign({indexConfingId},params,{markType:"productView", num:"1", pageNum:"1"})
    dispatch({
      payload: paramsTable,
      type: `productFeaturesModels/fetchProductViewTable`
    });
  }



  /**
  * @date: 2019/6/12
  * @author liuxiuqian
  * @Description: 发展质量表格请求
  * @method getDevelopTable
  * @param {string} 参数：num 参数描述：当前页码
  * @param {string} 参数：type 参数描述：排序方式 asc是指定列按升序排列，desc则是指定列按降序排列
  * @param {string} 参数：kpiId 参数描述：指标id
  */
  getDevelopTable(num="1",type="", kpiId=""){
    const {dispatch, location}=this.props;
    const state = getRouterState(this.props,"productFeaturesState");
    const {params} = state;

    const paramsTable = Object.assign({markType:"productView", num,sorter: type, sorterIndex: kpiId, pageNum:"10"},params)
    dispatch({
      payload: paramsTable,
      type: `productFeaturesModels/fetchDevelopTable`
    });
  }

  callbackMonth=(dateString)=>{
    console.log("设置标杆日期")
    console.log(dateString)
    this.getTwoLineEchart(dateString);
  };

  // 请求8个echart图
  initEchart=()=>{
    this.getLineBarEchart();
    this.getTwoLineEchart();
    this.getFlowFrequency();
    this.getVoiceFrequency();
    this.getTotalTrend();
   //  this.getTotalArea();
    this.getChannelEchart();
    this.getPeopleEchart();
  };

  // 表格点击触发查询
  initTableEchart=(params)=>{
    if(params){
      console.log(params);
      const {indexName, developMonth} = params
      this.setState({
        productIndexName:`${developMonth}、${indexName}`,

      })
    }
    this.getTotalTrend(params);
   //  this.getTotalArea(params);
    this.getChannelEchart(params);
    this.getPeopleEchart(params);
  };

  goBackPage(){
    router.goBack();
  }


  render() {
    const state = getRouterState(this.props,"productFeaturesState");
    const {saveIndexConfig} = state;
    // const {flag}=this.state;  // 有合计的时候再说
    const flag=false;
    const {tab,productIndexName}=this.state;
    const{productFeaturesModels}=this.props;
    const{
      lineBarEchartData,
      twoLineEchartData,
      flowFrequencyData,
      voiceFrequencyData,
      totalTrendData,
      totalAreaData,
      channelEchartData,
      peopleEchartData,
      productViewTableData, // 产品总览表格数据（上部带指标配置的表格）
      developTableData, // 发展表格
      basicInfoData, // 产品基本信息
    }=productFeaturesModels;

    const basicInfo=basicInfoData.list.map(
      (item,index)=>(
        <div className={index===5?styles.basicInfoItem5:styles.basicInfoItem} key={item.name}><div className={styles.itemName}>{item.name}:</div><div className={styles.itemValue} title={item.value}>{item.value}</div></div>
      )
    );
    return(
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.topTable}>
            <div className={styles.indexConfig}>
              <span onClick={()=>this.goBackPage()}>
                <IconFont className={styles.iconFont} type="icon-fanhuianniu" />
              </span>
              <span>
                <IndexConfiguration saveIndexConfig={saveIndexConfig} />
              </span>
            </div>
            <div className={styles.tableTitle}>产品指标</div>
            <div className={styles.indexConfigTable}>
              <ProductTable
                tableData={productViewTableData}
                markType="productView"
              />
            </div>
            <section className={styles.basicInfo}>
              <div className={styles.basicInfoTitle}>{basicInfoData.title}</div>
              <div className={styles.basicInfoContent}>
                {basicInfo}
              </div>
            </section>
          </div>
          <div className={styles.tabs}>
            <div className={styles.buttonWrapper}>
              <div className={tab===1?styles.active:styles.button} onClick={()=>this.setTab(1)}>产品特征</div>
              <div className={tab===2?styles.active:styles.button} onClick={()=>this.setTab(2)}>发展质量</div>
            </div>
          </div>
          <div className={styles.chart}>
            {
              tab===1
              ?
                (
                  <Fragment>
                    <div className={styles.chartRow}>
                      <div className={styles.item}><ProductFeaturesLineBarEchart chartData={lineBarEchartData} /></div>
                      <div className={styles.interval} />
                      <div className={styles.item}><ProductFeaturesTwoLineEchart callbackMonth={this.callbackMonth} chartData={twoLineEchartData} /></div>
                    </div>
                    <div className={styles.chartRow}>
                      <div className={styles.item}><ProductViewTimeEchart chartData={flowFrequencyData} /></div>
                      <div className={styles.interval} />
                      <div className={styles.item}><ProductViewTimeEchart chartData={voiceFrequencyData} /></div>
                    </div>
                  </Fragment>
                )
              :
                (
                  <Fragment>
                    <div>
                      <ProductTable
                        tableData={developTableData}
                        markType="developTable"
                        openFunction
                        JumpPage
                        refreshMake
                        frontEndSorter // 暂时注释
                        callBackRefreshEchart={(params)=>{this.initTableEchart(params)}}
                        callBackNum={(num, type, kpiId)=>{this.getDevelopTable(num, type, kpiId)}}
                      />
                    </div>
                    <div style={{fontSize:window.screen.width>1870?16:14}}>
                      <span className={styles.selectNameTitle}>已选发展月、指标：</span>{productIndexName}
                    </div>
                    <div className={styles.chartRow}>
                      {flag ?
                        (
                          <Fragment>
                            <div className={styles.item}><ProductViewTimeEchart chartData={totalTrendData} /></div>
                            <div className={styles.interval} />
                            <div className={styles.item}><ProductViewAreaEchart chartData={totalAreaData} /></div>
                          </Fragment>)
                        : (<div className={styles.item}><ProductViewTimeEchart chartData={totalTrendData} /></div>)
                      }
                    </div>
                    <div className={styles.chartRow}>
                      <div className={styles.item}><ProductViewTerminalEchart chartData={channelEchartData} chartType="channel" /></div>
                      <div className={styles.interval} />
                      <div className={styles.item}><ProductViewTerminalEchart chartData={peopleEchartData} chartType="client" /></div>
                    </div>
                  </Fragment>
                )
            }
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }

}
export default ProductFeatures
