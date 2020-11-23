/**
 * @Description:  分析类专题页面弹出层
 *
 * @author: 喵帕斯
 *
 * @date: 2019/7/23
 */
import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from "./popUp.less";
import StackBar from '../Echart/analyseSpecial/stackBar';
import TimeEchart1 from '../Echart/analyseSpecial/timeEchart1';
import TimeEchart2 from '../Echart/analyseSpecial/timeEchart2';
import TimeEchart3 from '../Echart/analyseSpecial/timeEchart3';
// import AreaEchart1 from '../Echart/analyseSpecial/areaEchart1';
import AreaEchart2 from '../Echart/analyseSpecial/areaEchart2';
import PieEchart from '../Echart/analyseSpecial/pieEchart';
import TreeMap from '../Echart/analyseSpecial/treeMap';
import BarEchart from '../Echart/analyseSpecial/barEchart';
import Top5 from '@/components/Echart/analyseSpecial/top5/index'; // top 图
import Top10 from '../Echart/analyseSpecial/top10';
import PieEchart2 from '../Echart/analyseSpecial/pieEchart2';
import PieEchart3 from '../Echart/analyseSpecial/pieEchart3';

@connect(
  ({analyseSpecialPopModels,analyseSpecialModel, loading}) => ({
    analyseSpecialPopModels,
    analyseSpecialModel,
    loading
  })
)

class PopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        // saveChartData:{},
      rowHeight:"50%",
      popEchartDom:[], // pop 的echartDom
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    // this传给子组件
    onRef(this);
    this.echartNum = 0; // 记录请求echart个数
    this.saveChartData = {}; //
  }

  componentWillUnmount() {
    this.echartNum = 0; // 清除累计的个数
    this.saveChartData = {}; //
  }

  // 获取echarts图数据
  getItemCol=(item,echartData,download)=>{
    const {analyseSpecialModel}=this.props;
    const {analyseSpecialTitle}=analyseSpecialModel;
    const {titleName}=analyseSpecialTitle;
    const downloadData={
      specialName:titleName,
      condition:download,
    };
     const  {rowHeight}=this.state;
    switch (item.type) {
      // 1
      case "stackBar":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><StackBar chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 2
      case "timeEchartLine":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><TimeEchart1 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 3
      case "timeEchartArea":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><TimeEchart2 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 4
      case "timeEchartBar":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><TimeEchart3 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 5
      case "areaEchartAverage":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><AreaEchart2 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 6
      case "areaEchart":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><AreaEchart2 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 7
      case "pieEchart":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><PieEchart chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 8
      case "treeMap":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><TreeMap chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 9
      case "barEchart":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><BarEchart chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 10
      case "top5":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><Top5 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 11
      case "top10":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><Top10 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 12
      case "pieEchartRose":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><PieEchart2 chartData={echartData} downloadData={downloadData} /></div></Col>);
      // 13
      case "pieEchartBorder":
        return echartData === null ?  null : (<Col key={`${item.type}${item.typeId}`} className={styles.col} style={{height:rowHeight}} span={item.span*6}><div className={styles.chartWrapper}><PieEchart3 chartData={echartData} downloadData={downloadData} /></div></Col>);
      default:
        return null
    }
  };

   callback=(item,response,arrTypeData,download)=>{
     const {analyseSpecialPopModels} = this.props;
     const {chartTypeData} = analyseSpecialPopModels;
     this.saveChartData[`${item.type}${item.typeId}`]=response;
     this.echartNum += 1;
     if(chartTypeData.length === this.echartNum){
       const popEchartDom = arrTypeData.map((itemType)=>this.getItemCol(itemType,this.saveChartData[`${itemType.type}${itemType.typeId}`],download));
       this.setState({popEchartDom})
     }
   } ;

  // 获取echarts图数据
  getEchartData=(item, arrTypeData,condition,download)=>{
    const {dispatch}=this.props;
    const {type,typeId} = item;
    const params={
      type,
      typeId,
      ...condition
    };
    switch (type) {
      // 1
      case "stackBar":
        dispatch({
          type: `analyseSpecialPopModels/fetchStackBarData`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 2
      case "timeEchartLine":
        dispatch({
          type: `analyseSpecialPopModels/fetchTimeEchart1Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 3
      case "timeEchartArea":
        dispatch({
          type: `analyseSpecialPopModels/fetchTimeEchart2Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 4
      case "timeEchartBar":
        dispatch({
          type: `analyseSpecialPopModels/fetchTimeEchart3Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 5
      case "areaEchartAverage":
        dispatch({
          type: `analyseSpecialPopModels/fetchAreaEchart1Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 6
      case "areaEchart":
        dispatch({
          type: `analyseSpecialPopModels/fetchAreaEchart2Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 7
      case "pieEchart":
        dispatch({
          type: `analyseSpecialPopModels/fetchPieEchartData`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 7
      case "pieEchartRose":
        dispatch({
          type: `analyseSpecialPopModels/fetchPieEchart2Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 7
      case "pieEchartBorder":
        dispatch({
          type: `analyseSpecialPopModels/fetchPieEchart3Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 8
      case "treeMap":
        dispatch({
          type: `analyseSpecialPopModels/fetchTreeMapData`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 9
      case "barEchart":
        dispatch({
          type: `analyseSpecialPopModels/fetchBarEchartData`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 10
      case "top5":
        dispatch({
          type: `analyseSpecialPopModels/fetchTop5Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      // 11
      case "top10":
        dispatch({
          type: `analyseSpecialPopModels/fetchTop10Data`,
          payload:params,
          callback:(response)=>{
            this.callback(item,response,arrTypeData,download);
          }
        });
        break;
      default:
        return null
    }
    return null;
  };

  // 获取图表类型数据
  // getChartTypeData=(params,download)=>{
  //   const {dispatch}=this.props;
  //   dispatch({
  //     type: `analyseSpecialPopModels/fetchChartTypeData`,
  //     payload:params,
  //     callback:(response)=>{
  //       // console.log("图表类型数据收到");
  //       // console.log(response);
  //       // let number=0;
  //       // let height="100%";
  //       // response.forEach((item)=>{
  //       //   number+=Number(item.span);
  //       // });
  //       // if(number<=4){
  //       //   height="100%";
  //       // }else if(number>4&&number<=8) {
  //       //   height = "50%";
  //       // }else if(number>8){
  //       //   height = "33.3%";
  //       // }
  //       // this.setState({
  //       //   rowHeight:height
  //       //         // });
  //       response.map((item,index, arr)=> this.getEchartData(item,arr,params,download))
  //     }
  //   });
  // };


  render() {
    // const {analyseSpecialPopModels}=this.props;
    const {popEchartDom}=this.state;
    return (
      <div className={styles.page}>
        <Row className={styles.row} gutter={10}>
          {popEchartDom}
        </Row>
      </div>
    );
  }
}

export default PopUp;
