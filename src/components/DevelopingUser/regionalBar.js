/**
 *用户发展真实性测试弹出组件:地域分布柱状图
 *by:CaoRuining
 */
import React, { PureComponent } from 'react';
import echarts from "echarts";
import {connect} from 'dva'
import { Button } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import yangshi from './regionalBar.less';


@connect(
  ({developingUserCom,proCityModels}) => ({
    indexDate:developingUserCom.indexDate,
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
    comStatus:developingUserCom.comStatus,
    regionalBarData:developingUserCom.regionalBarData,
    barShow:developingUserCom.barShow,
    selectPro:proCityModels.selectPro,
    selectCity:proCityModels.selectCity,
  })
)

class RegionalBar extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {};
    // 创建地域分布柱状图ref
    this.regionalBarRef = React.createRef();
  }

  componentWillMount(){

  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    const {regionalBarData} = this.props;
    if(nextProps !== undefined){
      if (nextProps.regionalBarData !== regionalBarData) {
        this.initBar(nextProps.regionalBarData)
      }
    }
  }

  initBar(data) {
    if(data.length !== 0){
      const data1 = data.chart.map((el)=>{
        if(el === "-"){
          return "-"
        }
        return parseFloat(el.replace(/,/g,''));
      });
      const chartX = data.chartX.map((dataX)=>{
        const daTa = dataX.slice(0,3);
        return daTa;
      });
      const sw= window.screen.width; // 获取屏幕宽度
      let gridLeft = '';
      let gridRight = '';
      let gridBottom = '';
      let gridFongSize = '';
      let tittleLeft = "2%";
      let fontSize = 12;
      if(sw >= 700 && sw < 960){
        gridLeft = "1%";
        gridRight="6%";
        gridBottom="1%";
        gridFongSize=14;
        tittleLeft="1%";
      }else if(sw >= 961 && sw < 1100){
        gridLeft = "1%";
        gridRight="6%";
        gridBottom="1%";
        gridFongSize=14;
        tittleLeft="1%";
      }else if(sw >= 1101 && sw < 1300){
        gridLeft = "3%";
        gridRight="5%";
        gridBottom="3%";
        gridFongSize=16;
      }else if(sw >= 1301 && sw < 1600){
        gridLeft = "3%";
        gridRight = "5%";
        gridBottom="3%";
        gridFongSize=18;
      }else{
        gridLeft = "3%";
        gridRight = "5%";
        gridBottom="3%";
        gridFongSize=18;
        fontSize = 14;
      }
      const option = {
        title: {
           // text: '地域分布图' ,
          textStyle:{
            color:"#333",
            fontSize:gridFongSize,
            fontWeight:400
          },
          left:tittleLeft,
          top:"5%"
        },
        tooltip:{
          trigger: 'axis',
          formatter:(param) =>{
            let dataValue=`${data.chartX[param[0].dataIndex]}<br />`;
            for(let i=0;i<param.length;i+=1){
              dataValue += (`${param[i].seriesName}：${data.chart[param[i].dataIndex]+data.unit}<br />`);
            }
            return dataValue
          }
        },
        color:['#ccc'],
        backgroundColor:"#fff",
        legend: {
          left: "13%",
          top: "5%",
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 10,
          selectedMode:false,
          data:[
            {
              name:data.example[0],
              textStyle:{
                color:'#999',
                fontSize,
              },

            },
            {
              name:data.example[1],
              textStyle:{
                color:'#999',
                fontSize,
              },
              icon:'line',

            }
          ]
        },
        grid: {
          left:"3%",
          right:"8%",
          bottom:"5%",
          top:"8%",
          containLabel: true
        },
        xAxis: {
          axisLine:{
            show:true,
            lineStyle:{
              color: '#ccc',
            }
          },
          data:chartX,

          axisTick:{

            show:false,// 不显示刻度
          },
          axisLabel:{
            interval:0,// 强制显示x轴所有标签
            color: '#333',// 设置标签颜色
            fontSize,
            formatter:(param) =>{
              const da =(param.split("").join("\n"));
              return da;
            }
          },

        },
        yAxis: {
          axisTick:{
            show:false,// 不显示刻度
          },
          axisLine:{
            show:false,
          },
          splitLine:{
            show:false
          },
          axisLabel:{
            fontSize,
            color: '#333',
            formatter: '{value} '// y轴%的显示
          }
        },
        series: [{
          name: data.example[0],
          type: 'bar',
          data:data1,
          barWidth : 10,// 柱图宽度
          itemStyle:{
            normal:{
              color:'#4ad2ff',
              barBorderRadius:[10, 10, 10, 10],// 柱状图样

              //     formatter: '{b}\n{c}%'
            }
          },
          markLine: {
            symbol:"none",// 去掉平均线箭头
            lineStyle:{
              normal: {
                color:'#ccc',
                type:'dashed',
              },

            },
            itemStyle: {
              normal: {
                label: {
                  formatter:()=>{
                    const daav = data.average;
                    return daav;
                  }
                }
              }
            },
            data: [
              {
                yAxis: data.average,
                name: '平均值',
              }
            ]
          }
        },{
          name:data.example[1],
          type:'line',

        }]
      };
      const myChart = echarts.init(this.regionalBarRef.current); // 初始化地域趋势分布图所需dom
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option);
    }
  }

  // 下载
  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"regional");
  }

  jsonHandle(){
    const {indexDate,regionalBarData,selectPro,selectCity,indexType,indexType1} = this.props;
    const {chart, chartX,  unit} = regionalBarData;
    let indexTypeName="";
    indexType.map((item)=>{
      if(item.id===indexType1){
        indexTypeName=item.name
      }
      return null
    })
    const tableValue = [];
    chartX.forEach((item,index)=>{
      tableValue.push([item,chart[index]])
    })
    const condition = {
      name:  "用户发展真实性预测",
      value: [
        ["专题名称:", "用户发展真实性预测", `(${unit})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", indexDate],
        ["指标类型:", indexTypeName],
      ],
    }
    const  table = {
      title: [
        ["日期", indexTypeName]
      ],
      value: [
        ...tableValue
      ]
    }


    const newJson = {
      fileName: "用户发展真实性预测-地域分布图",
      condition,
      table
    }
    return newJson;
  }

  render() {
    const {comStatus,barShow} = this.props;
    let isShow = '';
    if(barShow === 'true' && comStatus.barStatus === 'block'){
      isShow = 'block'
    }else if(barShow === 'true' && comStatus.barStatus === 'none'){
      isShow = 'none'
    }else if(barShow === 'false'){
      isShow = 'none'
    }
    return (
      <div id="regional" className={yangshi.barOuter} style={{display:isShow}}>
        <span className={yangshi.chartTitle}>
          地域分布图
        </span>
        <div className={yangshi.button}>
          <Button type="normal" icon="download" onClick={(e)=>{this.download(e)}}>下载</Button>
        </div>
        <div className={yangshi.echart} ref={this.regionalBarRef} />
      </div>
    );
  }

}

export  default RegionalBar;
