/* eslint-disable no-plusplus,prefer-const */
/**
 *用户发展真实性测试弹出组件:趋势分析折线图
 *by:CaoRuining
 */
import React, { PureComponent } from 'react';
import echarts from "echarts";
import {connect} from 'dva'
import { Button } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import yangshi from './trendLine.less';


const ButtonGroup = Button.Group;


@connect(
  ({developingUserCom}) => ({
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
  })
)

@connect(({ IceCream,proCityModels }) => ({
  IceCream,
  indexDate:IceCream.currentDate,
  comStatus:IceCream.comStatus,
  trendLineData:IceCream.trendLineData,
  barShow:IceCream.barShow,
  title:IceCream.title,
  selectPro:proCityModels.selectPro,
  selectCity:proCityModels.selectCity,
}))

class TrendLine extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {};
    // 创建趋势分析折线图ref
    this.trendLineRef = React.createRef();
  }

  componentWillMount(){

  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    const {trendLineData} = this.props;
    if(nextProps !== undefined){
      if (nextProps.trendLineData !== trendLineData) {
        this.initLine(nextProps.trendLineData)
      }
    }
  }

  /**
   * 切换组件
   * @returns {*}
   */
  changeComponent = ()=>{
    const {dispatch} = this.props;
    const params = {
      barStatus:'none',
      lineStatus:'none',
      tableStatus:'block'
    };

    dispatch({
      type:'IceCream/fetchChangeCom',
      payload:params
    })
  };


  initLine(data) {
    if(data!==undefined&&data.length !== 0){
      let realData=[];
      let p=0;
      let q=0;
      let color=["#E9A23E","#B0D666","#43BBEA"];
      let realSeries=[];
      for(p=0;p<data.chart.length;p++){
        realData[p]=data.chart[p].map((el)=>{
          if(el === "-"){
            return "-"
          }
          return parseFloat(el.replace(/,/g, ''));
        });
      }
      for(q=0;q<realData.length;q++){
        realSeries[q]= {
          name:data.example[q],
          type:'line',
          smooth:true,
          symbolSize:1,
          lineStyle:{
            normal:{
              width:1,
              color:color[q]
            }
          },
          data:realData[q]
        }
      }
      const sw= window.screen.width; // 获取屏幕宽度
      let titleFontSize=18;
      let titleLeft = '';
      let fontSize = 12;
      if(sw >= 700 && sw < 960){
        titleFontSize=14;
        titleLeft="1%";
      }else if(sw >= 961 && sw < 1300){
        titleFontSize=16;
        titleLeft="1%";
      }else if(sw>1870){
        fontSize = 14;
        titleLeft="2%";
      }else{
        titleLeft="2%";
      }

      const option = {
        title: {
          text: '趋势分析图',
          textStyle:{
            color:"#333",
            fontSize:titleFontSize,
            fontWeight:400
          },
          left:titleLeft,
          top:"5%"
        },
        tooltip:{
          trigger: 'axis',
          formatter:(param) =>{
            let dataValue=`${param[0].name}<br />`;
            for(let i=0;i<param.length;i+=1){
              for(let j=0;j<data.example.length;j+=1){
                if(param[i].seriesName === data.example[j]){
                  dataValue += (`${param[i].seriesName}：${data.chart[j][param[i].dataIndex]+data.unit[j]}<br />`);
                }
              }

            }
            return dataValue
          }
        },
        color:["#E9A23E","#B0D666","#43BBEA"],
        legend: {
          show:true,
          icon:"bar",
          align: 'left',
          left: "13%",
          top:"6%",
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 10,
          textStyle:{
            fontSize,
            color:'#999',
          },
          data:data.example,
        },
        backgroundColor:"#fff",
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine:{
            show:false
          },
          axisLabel:{
            fontSize,
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
          data: data.chartX
        },
        yAxis: {
          type: 'value',
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          },
          splitLine:{
            show:false
          },
          axisLabel:{
            show:false,
            color: '#333',
            formatter: '{value} '
          }
        },
        series:realSeries
      };

      const myChart = echarts.init(this.trendLineRef.current); // 初始化趋势分析折线图所需dom
      // 使用刚指定的配置项和数据显示图表
      myChart.resize();
      myChart.clear();
      myChart.setOption(option);

    }
  }

  // 下载
  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"trendLineDownload");
  }

  jsonHandle(){
    const {title,indexDate,trendLineData,selectPro,selectCity,indexType,indexType1} = this.props;
    const {chart, chartX, example, unit} = trendLineData;
    let indexTypeName="";
    indexType.map((item)=>{
      if(item.id===indexType1){
        indexTypeName=item.name
      }
      return null
    })
    const tableValue = [];
    if(chart[1]){
      chartX.forEach((item,index)=>{
        tableValue.push([item,chart[0][index],chart[1][index]])
      })
    }else{
      chartX.forEach((item,index)=>{
        tableValue.push([item,chart[0][index]])
      })
    }

    const condition = {
      name:  title,
      value: [
        ["专题名称:", title, ""],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", indexDate],
        ["指标类型:", indexTypeName],
      ],
    }
    const  table = {
      title: [
        ["日期", `${example[0]}(${unit[0]})`, example[1]?`${example[1]}(${unit[1]})`:'']
      ],
      value: [
        ...tableValue
      ]
    }


    const newJson = {
      fileName: "冰激凌漫游产品分析-趋势分析图",
      condition,
      table
    }
    return newJson;
  }

  render() {
    const {comStatus,barShow} = this.props;
    const sw= window.screen.width; // 获取屏幕宽度
    let chartHeight;
    if(sw<850){
      chartHeight = barShow==='true'?150:320
    }else if(sw>851 && sw<1070){
      chartHeight = barShow==='true'?220:460
    }else if(sw>1071 && sw<1290){
      chartHeight = barShow==='true'?210:440
    }else if(sw>1291 && sw<1389){
      chartHeight = barShow==='true'?220:460
    }else if(sw>1390 && sw<1450){
      chartHeight = barShow==='true'?260:540
    }else if(sw>1451){
      chartHeight = barShow==='true'?270:560
    }
    return (
      <div id="trendLineDownload" className={yangshi.lineOuter} style={{display:comStatus.lineStatus,height:barShow==='true'?'44%':'88%',top:barShow==='true'?'2%':'0'}}>
        <span className={yangshi.chartTitle}>
          趋势分析图
        </span>
        <div className={yangshi.changeButton}>
          <ButtonGroup>
            <Button type="primary">图标</Button>
            <Button type="normal" onClick={()=>this.changeComponent()}>数据</Button>
          </ButtonGroup>
          <Button type="normal" icon="download" className={yangshi.downBtn} onClick={(e)=>{this.download(e)}}>下载</Button>
        </div>
        <div className={yangshi.echart} ref={this.trendLineRef} style={{height:chartHeight}} />
      </div>
    );
  }

}

export  default TrendLine;
