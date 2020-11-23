/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  智能分析页面</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/21
 */

import React,{Fragment} from 'react';
import {connect} from 'dva';
import isEqual from 'lodash/isEqual';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ReasonAnalysis from '../../components/IntelligenceAnalysis/reasonAnalysis'
import AreaDistributeChart from '../../components/IntelligenceAnalysis/areaDistributeChart'
import IntelligenceChart from '../../components/IntelligenceAnalysis/intelligenceChart';
import { getRouterState } from '../../utils/tool';
import styles from './index.less';


@connect(
  ({
     intelligenceAnalysisModels
   })=>({
     intelligenceAnalysisModels,
     areaData:intelligenceAnalysisModels.areaData,
    })
)
class IntelligenceAnalysis extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      reasonData:[null,null,null,null,null,null],  //  原因分析
      echartDom:[], // pop 的echartDom
      commonCondition:[], // 公共condition
      chartTypeData:[],
      dimensionArray:[], // 地域图上方的维度值列表
      downloadArray:[
        // {id:"",name:"",value:""}
      ], // 下载条件列表
      saveIndex:{}, // 点击图柱子时index
      click:0, // 展示的地域图的权限 全国 0  省份 1 地市 2
      provIdName:"", // 省份维度字段名称
      cityIdName:"", // 地市维度名称
      titleNamePro:'', // 面包屑上显示的地域的省份名称
      titleNameCity :'', // 面包屑上显示的地域的地市名称
    };
  }

  componentDidMount() {
     this.init()
  }

  componentDidUpdate(prevProps){
    const routerStateOld=getRouterState(prevProps,"xiaoZhiState");
    const routerState=getRouterState(this.props,"xiaoZhiState");
    if(!isEqual(routerState,routerStateOld)){
      this.init()
    }

  }

  componentWillUnmount() {
    this.echartNum = 0; // 清除累计的个数
    this.saveChartData = {}; // 保存的echart图数据
  }
  
  // 初始化 重置state数据 重新请求页面所有接口
  init=()=>{
    this.echartNum = 0; // 记录请求echart个数
    this.saveChartData = {}; // 保存的echart图数据
    const routerState=getRouterState(this.props,"xiaoZhiState");
    const {dateType,upOrDown,condition,markType,power}=routerState;
    const clickArray={ "all":0, "prov":1, "city":2 };
    this.setState({
      click:clickArray[power],
      reasonData:[null,null,null,null,null,null],  //  原因分析
      echartDom:[], // pop 的echartDom
      commonCondition:[], // 公共condition
      chartTypeData:[],
      dimensionArray:[], // 地域图上方的维度值列表
      downloadArray:[
        // {id:"",name:"",value:""}
      ], // 下载条件列表
      saveIndex:{}, // 点击图柱子时index
      provIdName:"", // 省份维度字段名称
      cityIdName:"", // 地市维度名称
      titleNamePro:'', // 面包屑上显示的地域的省份名称
      titleNameCity :'', // 面包屑上显示的地域的地市名称
    });
    const otherParams={ markType, dateType,upOrDown,condition };
    this.getChartTypeData(otherParams);
  };

   // 请求图表和维度类型接口
  getChartTypeData=(params)=>{
    const {dispatch}=this.props;
    const {condition}=getRouterState(this.props,"xiaoZhiState");
    dispatch({
      type: 'intelligenceAnalysisModels/getChartTypeData',
      payload: params,
      callback:(response)=>{
        if(response&&response.length>0){
          const newDownloadArray=response.map((item)=>({name:item.name,id:item.typeId,value:"全部"}));
          // 保存chartType本身 公共请求参数 筛选条件
          const routerState=getRouterState(this.props,"xiaoZhiState");
          const text=routerState.area && routerState.area.slice(3);
          const areaDownloadArray=[
            {
              name:"地域",
              id:"areaId",
              value:text||"",
            }
          ];
          this.setState({
            commonCondition:condition,
            chartTypeData:response,
            downloadArray:newDownloadArray.concat(areaDownloadArray),
          });
          // 根据请求到的图表类型请求具体的图表接口
          this.echartNum = 0;
          response.map((item,index,arr)=>(this.getEchartData(item,arr,params,condition,true)))
        }
      }
    })
  };

  getEchartData=(item,arrTypeData,oldParams,condition,isDesc)=>{
    const {dispatch}=this.props;
    const {type,typeId} = item;
    const params={
      ...oldParams,
      type,
      typeId,
      condition
    };
    switch (type) {
      // 1
      case "area":
        dispatch({
          type: `intelligenceAnalysisModels/getAreaData`,
          payload:params,
          callback:(response)=>{
            if(response){
              this.setState({
                provIdName:response.provId,
                cityIdName:response.cityId
              });
              this.callback(item,response,arrTypeData,isDesc);
            }
          }
        });
        break;
      // 2
      case "bar":
        dispatch({
          type: `intelligenceAnalysisModels/getBarData`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,isDesc);
          }
        });
        break;
      default:
        return null
    }
    return null;
  };

  // echart图数据回调
  callback=(item,response,arrTypeData,isDesc)=>{

    this.saveChartData[`${item.type}${item.typeId}`]=response;
    this.echartNum += 1;
    if(arrTypeData.length === this.echartNum){
      const echartDom = arrTypeData.map((itemType,index)=>this.getItemCol(itemType,index,this.saveChartData[`${itemType.type}${itemType.typeId}`],isDesc));
      this.setState({echartDom})
    }
    return null
  };

  // 获取echarts图数据
  getItemCol=(item,index,echartData,isDesc)=>{
    if(isDesc){
      const {reasonData}=this.state;
      const newReasonData=[...reasonData];
      newReasonData[index]=echartData.desc;
      this.setState({
        reasonData:newReasonData
      })
    }
    const routerState=getRouterState(this.props,"xiaoZhiState");
    const {downloadArray}=this.state;
    const {markName,date}=routerState;

    const handleDownloadArray=downloadArray.map((itemDown)=>([itemDown.name,itemDown.value]));
    const downloadData={
      specialName: markName,
      conditionValue:[
        ["日期:", date],
        ...handleDownloadArray
      ]
    };
    if (item.type==="bar") {
      const {saveIndex}=this.state;
      const chartWidth=item.span/6*100;

      return  echartData === null ?  null :
        (
          <div key={`${item.type}${item.typeId}`} className={styles.chartWrapper} style={{width:`${chartWidth}%`}}>
            <div className={styles.chartWrapperNext}>
              {this.handleDom(item.typeId,this.handleChartData(echartData),downloadData,saveIndex[`${item.typeId}Index`],item)}
            </div>
          </div>)
    }
    return null
  };


  callBackChart=(name,id,index,typeId,chartTypeItem)=>{

    const { commonCondition ,dimensionArray,downloadArray}=this.state;
    const newCondition=[];
    const dimensionArrayCopy=[...dimensionArray];
    const downloadArrayCopy=[...downloadArray];
    // 再次点击相同的柱子，使其无效化。
    let flag=false;
    dimensionArrayCopy.forEach((item)=>{
       if(item.typeId===chartTypeItem.typeId){
         flag=true;
       }
    });
    if(flag){return null}


    const newDimensionArray=[...dimensionArrayCopy,{...chartTypeItem,selectValue:name}];
    const newDownloadArrayCopy=downloadArrayCopy.map((downCopyItem)=>{
       if(downCopyItem.id===typeId){
         return ({id:downCopyItem.id,name:downCopyItem.name,value:name})
       }
       return downCopyItem
    });
    commonCondition.map(
      (item)=>{
        if(Object.keys(item).includes(typeId)){
          newCondition.push({[typeId]:[id]});
        }else {
          newCondition.push(item);
        }
        return null
      }
    );
    const {saveIndex} = this.state;
    const newSaveIndex=Object.assign({},saveIndex,{[`${typeId}Index`]:index});
    this.setState({
      saveIndex:newSaveIndex,
      commonCondition:newCondition,
      dimensionArray:newDimensionArray, // 地域图上方的维度值列表
      downloadArray:newDownloadArrayCopy
    });
    
    this.chartTypeToEchart(newCondition);
    return null
  };


  // 面包写小组件叉号被点击
  contentClicked=(params)=>{
    const {downloadArray}=this.state;
    const downloadArrayCopy=[...downloadArray];
    const newDownloadArrayCopy=downloadArrayCopy.map((downCopyItem)=>{
      if(downCopyItem.id===params.typeId){
        return ({id:downCopyItem.id,name:downCopyItem.name,value:"全部"})
      }
      return downCopyItem
    });

    const { commonCondition ,dimensionArray}=this.state;
    const dimensionArrayCopy=[...dimensionArray];
    // 地域图上方的维度值列表 筛选点击去掉点击叉号去掉的那一项
    const newDimensionArray=dimensionArrayCopy.filter((item)=>(item.typeId!==params.typeId));
    const newCondition=[];
    commonCondition.map(
      (item)=>{
        if(Object.keys(item).includes(params.typeId)){
          newCondition.push({[params.typeId]:[]});
        }else {
          newCondition.push(item);
        }
        return null
      }
    );
    this.setState({
      commonCondition:newCondition, // 公共筛选条件
      dimensionArray:newDimensionArray, // 地域图上方的维度值列表
      downloadArray:newDownloadArrayCopy // 下载条件
    });
    this.chartTypeToEchart(newCondition);
  };

  handleDom = (typeId, chartData, downloadData ,selectIndex,item) => (
    <Fragment>
      <div className={styles.topLine} />
      <div className={styles.chart}>
        <IntelligenceChart
          chartTypeItem={item}
          echartId={typeId}
          chartData={chartData}
        //   downloadData={downloadData}
          selects={selectIndex}
          callBackChart={this.callBackChart}
        />
      </div>
    </Fragment>
  );

  handleChartData=(chartData)=>{
    let percentName="";
    let barName="";
    const {title,chart,subtitle,chartX,chartId}=chartData;
    let unitCopy="";
    const newChart=[];
    chart.forEach((item)=>{
      if(item.type==="bar"){
        barName=item.name;
        unitCopy=item.unit;
        item.value.forEach((itemValue)=>{
          newChart.push({value:itemValue})
        })
      }
    });
    chart.forEach((item)=>{
      if(item.type==="percent"){
        percentName=item.name;
        const percentUnit=item.unit;
        item.value.forEach((itemValue,index)=>{
          newChart[index].percent=itemValue+percentUnit;
          newChart[index].id=chartId[index];
          newChart[index].name=chartX[index];
        })
      }
    });
    return ({
      title,
      chartX,
      chart:newChart,
      unit:unitCopy,
      subtitle,
      percentName,
      barName
    })
  };

  callBackArea=(click,name,id,typeId)=>{
    const { commonCondition ,downloadArray}=this.state;
    const downloadArrayCopy=[...downloadArray];
    if(click===1){
      this.setState({
        titleNamePro:name,
        click,
      });

    }else if(click===2){
      this.setState({
        titleNameCity:name,
        click,
      })
    }
    const newDownloadArrayCopy=downloadArrayCopy.map((downCopyItem)=>{
      if(downCopyItem.id==='areaId'){
        return ({id:downCopyItem.id,name:downCopyItem.name,value:name})
      }
      return downCopyItem
    });
    const newCondition=[];
    commonCondition.map(
      (item)=>{
        if(Object.keys(item).includes(typeId)){
          newCondition.push({[typeId]:[id]});
        }else {
          newCondition.push(item);
        }
        return null
      }
    );
    this.setState({
      commonCondition:newCondition,
      downloadArray:newDownloadArrayCopy
    });
  
    this.chartTypeToEchart(newCondition);
  };

  contentAreaClicked=(flag)=>{
    // 改变下载筛选条件
    const {downloadArray,commonCondition,provIdName,cityIdName,titleNamePro}=this.state;
    const downloadArrayCopy=[...downloadArray];
    let newDownloadArrayCopy=[];
    const newCondition=[];
    if(flag==='prov'){
      newDownloadArrayCopy=downloadArrayCopy.map((downCopyItem)=>{
        if(downCopyItem.id==='areaId'){
          return ({id: downCopyItem.id,name:downCopyItem.name,value:"全国"})
        }
        return downCopyItem
      });

      commonCondition.map(
        (item)=>{
          if(Object.keys(item).includes(provIdName)) {
            newCondition.push({ [provIdName]: ['111'] });
          }else if(Object.keys(item).includes(cityIdName)){
            newCondition.push({ [cityIdName]: ['-1'] });
          }else {
            newCondition.push(item);
          }
          return null
        }
      );
      this.setState({
        titleNameCity:"",
        titleNamePro:"",
        click:0
      })

    }else if(flag==='city'){
      newDownloadArrayCopy=downloadArrayCopy.map((downCopyItem)=>{
        if(downCopyItem.id==='areaId'){
          const routerState=getRouterState(this.props,"xiaoZhiState");
          const text=routerState.area && routerState.area.slice(3);
          return ({id: downCopyItem.id,name:downCopyItem.name,value:titleNamePro || text})
        }
        return downCopyItem
      });
      commonCondition.map(
        (item)=>{
         if(Object.keys(item).includes(cityIdName)){
            newCondition.push({ [cityIdName]: ['-1'] });
          }else {
            newCondition.push(item);
          }
          return null
        }
      );
      this.setState({
        titleNameCity:"",
        click:1
      })

    }
    this.setState({
      commonCondition:newCondition, // 公共筛选条件
      downloadArray:newDownloadArrayCopy // 下载条件
    });
    
    this.chartTypeToEchart(newCondition);
  };
  
  // 根据布局请求图表数据
  chartTypeToEchart=(newCondition)=>{
    const {chartTypeData}=this.state;
    const { markType, dateType,upOrDown}=getRouterState(this.props,"xiaoZhiState");;
    const otherParams={ markType, dateType, upOrDown };
    this.echartNum = 0;
    chartTypeData.map((item1,index1,arr1)=>(this.getEchartData(item1,arr1,otherParams,newCondition,false)));
  };

  render() {
    const {areaData}=this.props;
    const routerState=getRouterState(this.props,"xiaoZhiState");
    const {echartDom,dimensionArray,reasonData}=this.state;
   // const {downloadArray}=this.state;
   // const handleDownloadArray=downloadArray.map((itemDown)=>([itemDown.name,itemDown.value]));
    const {date,markName,phenomenon,desc}=routerState;
    const {titleNamePro,titleNameCity,click}=this.state;
    const typeId = { provId: areaData && areaData.provId, cityId: areaData && areaData.cityId};
    // const downloadData={
    //   specialName: markName,
    //   conditionValue:[
    //     ["日期:", date],
    //     ...handleDownloadArray
    //   ]
    // };
    const dimensionArrayDom=dimensionArray.map((item)=>(
      <div>
        <span className={styles.contentLeft}>{'>'}</span>
        <span className={styles.contentWrapper}>
          <span>{item.name}</span>
          <span>{item.selectValue}</span>
          <span className={styles.contentClose} onClick={()=>this.contentClicked(item)}>x</span>
        </span>
      </div>
    ));

    return (
      <PageHeaderWrapper>
        <div className={styles.intelligenceAnalysis}>
          <div className={styles.title}>{markName}</div>
          <div className={styles.condition}>
            <span>账期：{date}</span>
            <span>现象：{phenomenon}</span>
            <span>{routerState && routerState.area}</span>
          </div>
          <div className={styles.reason}><ReasonAnalysis data={reasonData} desc={desc} /></div>
          <div className={styles.filter}>
            <div style={{width:75,minWidth:60}}>当前结果</div>
            <div className={styles.filterContent}>
              {dimensionArray.length>0 ||titleNamePro || titleNameCity ? "" :<div>: 默认</div>}
              {titleNamePro || titleNameCity?
                <div>
                  <span className={styles.contentLeft}>{">"}</span>
                  {titleNamePro &&
                  <span className={styles.contentWrapper}>
                    <span>地域：</span>
                    <span>{titleNamePro}</span>
                    <span className={styles.contentClose} onClick={()=>this.contentAreaClicked("prov")}>x</span>
                  </span>}
                  {titleNameCity?
                    <span className={`${styles.contentWrapper} ${styles.contentWrapperLeft}`}>
                      <span>{titleNameCity}</span>
                      <span className={styles.contentClose} onClick={()=>this.contentAreaClicked('city')}>x</span>
                    </span>:null}
                </div> :null}
              {dimensionArrayDom}
            </div>
          </div>
          <div className={styles.oneColumn}>
            <div className={styles.topLine} />
            <div className={styles.chart}>
              <AreaDistributeChart
                click={click}
                chartData={areaData}
                typeId={typeId}
                echartId="area"
               //  downloadData={downloadData}
                callBack={this.callBackArea}
              />
            </div>
          </div>
          <div className={styles.rowWrapper}>
            {echartDom}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default IntelligenceAnalysis;

