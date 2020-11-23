/* eslint-disable no-unused-vars,no-plusplus,prefer-const */
/**
 *   xingxiaodong 20190227
 *   移动业务计费收入分析专题echarts图组件
 * */
import React, { PureComponent, Fragment } from 'react';
import echarts from "echarts";
import {Icon} from 'antd';
import iconFont from '../../icon/Icons/iconfont';
import styles from './areaChart.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

let currentChart12138=null;

class AnalysisAreaChart extends PureComponent{
  constructor(props){
    super(props);
    this.chartLine=React.createRef();
    this.chartBar=React.createRef();
    this.state={
      chartData:null,
      initChartData:null,
      sortSelectData: [
        { id: "001", type: 1, name: "默认排序" },
        { id: "002", type: 1, name: "环比升序" },
        { id: "003", type: 0, name: "环比降序" },
        { id: "004", type: 1, name: "绝对值升序" },
        { id: "005", type: 0, name: "绝对值降序" }
      ],
      guoduChar:null,
      selectSortIndex: 0, // 选中的索引
      selectShow: false, // 是否显示下拉
      // toolTipShow:true,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData,initChartData}=nextProps;
    currentChart12138=chartData;
    if (chartData && chartData !== prevState.chartData) {
      console.log("charData变化")
      return {
        chartData,
        guoduChar:chartData,
        initChartData,  // 不起作用
        selectSortIndex:0, // xingxiaodong 4.29增加，重新渲染数据时回复为默认排序
      };
    }
    return null;
  }


  componentDidUpdate(prevProps, prevState) {
    const {chartData}=this.state;
    const {isClick,citySelect,provinceName}=this.props;
    if(chartData !== prevState.chartData){
      this.createChart(chartData,provinceName,isClick,citySelect)
    }
  }

  indexOf=(arr,item)=>{
    for( let i=0;i<arr.length;i+=1){
      if(arr[i]===item){
        return i;
      }
    }
    return null
  };

  createChart=(chartData,proName,isclick,citySelect)=>{
    if(!chartData.chart){return;}
    const data=chartData.chart[0];

    // data : 传入的echart 数据
    // proname : 全国
    // isClick: 第几次点击
    // citySelect：选择的地市的名字
    const {titleName}=this.props; // echart图名
    const thcolor={
      provinceBar:["#5CACE0", "#A6D2A4", "#D7D7D7"], // 蓝 绿 灰 3色
      provinceLine:"#ccc", // 省份折线颜色
      tipBackcolor:"rgba(108,109,111,0.7)", // 提示框背景色
      xAxisColor:"#999" // x轴字体颜色
    };

    const provinceName=data.chartX; // 各个省市的名字
    const themeColor=thcolor.provinceBar; // 切换主题变换柱子颜色
    const xAais=thcolor.xAxisColor; // 切换主题变换x轴字体颜色
    const {provinceLine}=thcolor ;// 切换主题变换折线图颜色
    const {tipBackcolor}=thcolor ;// 切换主题变换提示框背景颜色
    const {example,allProId} = data;// 图例名称，所以城市ID


    const proArr=[];
    for(let i=0;i<provinceName.length;i+=1){
      proArr.push(this.indexOf(data.chartX, provinceName[i]))
    }
    // console.log("proArr")
    // console.log(proArr) // [0,1,2,3,4......,30,31]
    // console.log("provinceName")
    // console.log(provinceName) // ["北京","天津",..."新疆"]
    // console.log("-----")
    const colors = [];
    // // 对数组进行排序
    // proArr.sort((a,b)=> a - b)
    const Numb=data.totalData.map((el)=>{ // 把value值处理成数字
      if (Number.isNaN(el)) {
        if(el==='-'){
          return el
        }
        return "-"
      }
      const els = el.toString();
      if (els.indexOf(",") === -1) {
        return parseFloat(els)
      }
      return parseFloat(el.replace(/,/g, ''));
    });

    for(let i=0; i<proArr.length; i+=1){
      if(Numb[i]>0){
        colors.push(themeColor[0]);
      }else{
        colors.push(themeColor[1]);
      }
    }

    let chartHeight=260;
    const sw=window.screen.width
    if(sw>1870){
      chartHeight=380;
    }
    const titleSize=20;
    const barwidth=16;
    const lengSizeX='75%';
    const lengSizeY='7%';
    const legendX=26;
    const lengthSize=100;

    const barFontSize=10;
    const proPercent=data.proPercent.map((el)=>{
      if(el!==''){
        const els = el.toString();
        if (els.indexOf("%") === -1){
          return parseFloat(els)
        }
        if (els.replace('%','').indexOf(",") === -1){
          return parseFloat(els.replace('%',''))
        }
        return parseFloat(els.replace('%','').replace(',',''));
      }
      return null
    });

    const barNum=data.totalData.map((el)=>{
      const els = el.toString();
      if (els.indexOf(",") === -1) {
        if(els ==='-'){
          return "-";
        }
        return parseFloat(els);
      }
      return parseFloat(els.replace(/,/g, ''));
    });

    let peng
    if(isclick==='0') {
      peng='全国'
    }else{
      peng='全省'
    }
    const axisData =data.chartX;
    const myChart3 = echarts.init(this.chartBar.current);
    const myChart3s = echarts.init(this.chartLine.current);

    if(isclick==="2"){
      const option2X= data.chartX;
      let cityNum;
      for(let i=0;i<option2X.length;i+=1){
        if(option2X[i]===citySelect){
          cityNum=i
        }
      }
      for(let i=0;i<data.chartX.length;i+=1){
        if(i===cityNum){
          option2X[i] = data.chartX[cityNum];
        }else{
          option2X[i] = "";
        }
      }
      let whichCor;
      const themeColor0=themeColor[0]
      const themeColor1=themeColor[1]
      if(Numb[cityNum]>0){
        whichCor=themeColor0
      }else{
        whichCor=themeColor1
      }
      const ys=proPercent.map( (el,index1)=>{
        if(index1===cityNum){
          return  {
            value: el,
            symbol:'emptyCircle',
            symbolSize : 12/4,
            barWidth : barwidth*2,// 柱图宽度
            itemStyle: {        // 数据级个性化折线样式
              normal: {
                color: xAais,
                label : {
                  show: true,
                  position: 'top',
                  textStyle : {
                    fontSize : 12
                  },
                  formatter: (p)=> (`${p.value}%`)
                }
              },
              emphasis: {
                label : {
                  show: false,
                  position: 'top',
                  textStyle : {
                    fontSize : 12
                  }
                }
              }
            }
          };
        }
        return  {
            value: '-',
            symbol:'',
            symbolSize : 12/4,
            itemStyle: {        // 数据级个性化折线样式
              normal: {
                color: 'rgba(36,41,44,0)',
                label : {
                  show: false,
                  padding:[-15,10,0,10,],
                  position: 'top',
                  textStyle : {
                    fontSize : 12,
                  }
                }
              },
              emphasis: {
                color: 'rgba(36,41,44,0)',
                label : {
                  show: false,
                  position: 'top',
                  textStyle : {
                    fontSize : 12,
                  }
                }
              }
            }
          }
      });
      const y=Numb.map( (el,index2)=>{
        if(index2===cityNum){
          if(parseFloat(el)>0){
            return  {
              value: el,
              symbol: '',
              symbolSize : 12/4,
              barWidth : barwidth,// 柱图宽度
              itemStyle: {        // 数据级个性化折线样式
                normal: {
                  color:whichCor ,
                },
              },
              label : {
                show: true,
                position: 'top',
                textStyle : {
                  fontSize : 12,
                  color:xAais
                }
              },
              emphasis: {
                label : {
                  show: false,
                  position: 'top',
                  textStyle : {
                    fontSize : 12,
                    color:'#C0B298'
                  }
                }
              }
            }
          }
          return  {
              value: el,
              symbol: '',
              symbolSize : 12/4,
              barWidth : barwidth,// 柱图宽度
              itemStyle: {        // 数据级个性化折线样式
                normal: {
                 color:whichCor ,
                },
              },
              label:{
                show:true,
                position: 'bottom',
                textStyle : {
                  fontSize : 12,
                  color:xAais
                }
              },
              emphasis: {
              label : {
                show: false,
                position: 'bottom',
                textStyle : {
                  fontSize : 12
                }
              }
            }
            }
        }
        return  {
            value: 1.5*el,
            symbol: '',
            symbolSize : 12/4,
            itemStyle: {        // 数据级个性化折线样式
              normal: {
                color: 'rgba(36,41,44,0)', // rgba(36,41,44,0)
                label : {
                  show: false,
                  padding:[-15,10,0,10,],
                  position: 'top',
                  textStyle : {
                    fontSize : 12,
                  }
                }
              },
              emphasis: {
                color: 'rgba(36,41,44,0)',
                label : {
                  show: false,
                  position: 'top',
                  textStyle : {
                    fontSize : 12,
                  }
                }
              }
            },
            label:{
              show:false,
            }
          }
      });

      const option2={ // 柱状图
        backgroundColor:'#F7F8FC',
        tooltip : {
          trigger: 'axis',
          confine:true,
          triggerOn:'mousemove',
          showContent:false,
          show:false,
          axisPointer: {
            type: 'line',
            show:true,
            z:1,
            lineStyle: {
              color: 'rgba(86,84,86,0.2)'
            },
          },
          position:  (point)=> [point[0], lengthSize],
          backgroundColor:tipBackcolor,
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
       // color: [themeColor[0],themeColor[1]],// 设置legend的颜色
        legend: {
          x: 'right',
          y:legendX,
          show:false,
          selectedMode:false,
          textStyle: {
           // color: '#90979c',
            fontSize:12,
          },
          data:example[0]
        },
        grid: { // 柱状图
          z:3,
          top:20,
          height:chartHeight*0.45,// 设置图的高度
        },
        xAxis : [
          {
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CCCCCC'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0,
              margin:20,
              textStyle : {
                fontSize :12,
                color: xAais,
              },
              formatter:(xAxisData)=>(xAxisData.split("").join("\n"))// 使x轴字体竖向显示
            },
            data : option2X
          }
        ],
        animation:false,
        yAxis : [
          {
            type : 'value',
            show:true,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#CCCCCC'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // interval: 15,
              show:true,
              textStyle: {
                color: "#B2B3B4",
                fontSize:barFontSize
              },
            },
            splitArea: {
              show: false
            },
          }
        ],
        series : [
          {
            name:example[0],
            type:'bar',
            symbol: 'none',
            barWidth : barwidth*2,// 柱图宽度
            data:y
          },
        ]
      };
      const option2s={
        backgroundColor:'#F7F8FC',
        title: {
          text: titleName,
          x: '30',
          textStyle: {
            color: '#333333',
            fontWeight:'normal',
            fontFamily:'Microsoft YaHei',
            fontSize: titleSize
          },
        },
        tooltip : {
          trigger: 'axis',
          confine:true,
          triggerOn:'mousemove',
          showContent:false,
          show:false,
          axisPointer: {
            type: 'line',
            show:true,
            z:1,
            lineStyle: {
              color: 'rgba(86,84,86,0.2)'
            },
          },
          position:  (point)=> [point[0], lengthSize],
          backgroundColor:tipBackcolor,
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        color: [themeColor[0],themeColor[1]],// 设置legend的颜色
        legend: {
          x:lengSizeX,
          y:lengSizeY,
          show:true,
          selectedMode:false,
          textStyle: {
            color: '#90979c',
            fontSize:12,
          },
          data:[example[1],example[0]]
        },
        grid: { // 折线图
          bottom:20,
          z:3,
          height:chartHeight*0.35,// 设置图的高度
        },
        xAxis : [
          {
            type: 'category',
            show:false,
            axisLabel:{
              interval:0,
            },
            data : option2X
          }
        ],
        animation:false,
        yAxis : [
          {
            type : 'value',
            show:true,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#CCCCCC'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // interval: 15,
              show:true,
              textStyle: {
                color: "#B2B3B4",
                fontSize:barFontSize
              },
            },
            splitArea: {
              show: false
            },
          }
        ],
        series : [
          {
            name:example[1],
            type:'line',
            symbol:'emptyCircle',
            // barGap: '7%',
            lineStyle: {
              color: provinceLine,
            },
            barWidth : barwidth,// 柱图宽度
            itemStyle: {
              normal: {
                color: provinceLine,
                barBorderRadius: 0,
                label: {
                  show: true,
                  formatter:(param)=>`${param.value}%`,
                }
              },
              emphasis:{
                barBorderRadius: 0,
                label: {
                  show: false,
                  margin:0,
                  textStyle: {
                    color: provinceLine,
                    fontSize:12
                  },
                  formatter: (params)=>
                     `${params.value}%`
                }
              }
            },
            data:ys
          },
          {
            name:example[0],
            type:'bar',
            data:[]
          }
        ]
      };
      myChart3s.setOption(option2s);
      myChart3.setOption(option2);
    }
    else {
      const option3 = {
        backgroundColor:'#F7F8FC',
        tooltip : {
          trigger: 'axis',
          triggerOn:'mousemove',
          confine:true,
          showContent:false,
          show:true,
          axisPointer: {
            type: 'line',
            show:true,
            z:1,
            lineStyle: {
              color: 'rgba(86,84,86,0.2)'
            },
          },
          position:  (point)=> [point[0], lengthSize],
          backgroundColor:tipBackcolor,
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        color: [themeColor[0],themeColor[1]],// 设置legend的颜色
        legend: {
          x: 'right',
          y:legendX,
          show:false,
          selectedMode:false,
          textStyle: {
            color: '#90979c',
            fontSize:12,
          },
          data:example[0]
        },
        grid: { // 柱状图
          top:20,
          z:3,
        },
        xAxis : [
          {
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CCCCCC'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0,
              margin:20,
              textStyle : {
                fontSize :12,
                color: xAais,
              },
              formatter:(xAxisData)=> xAxisData.split("").join("\n")// 使x轴字体竖向显示
            },
            data : data.chartX
          }
        ],
        animation:false,
        yAxis : [
          {
            type : 'value',
            show:true,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#B2B3B4'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show:true,
              textStyle: {
                color: "#B2B3B4",
                fontSize:barFontSize
              },
            },
            splitArea: {
              show: false
            },
          }
        ],
        series : [
          {
            name:example[0],
            type:'bar',
            symbol: 'none',
            barGap: '7%',
            barWidth : barwidth,// 柱图宽度
            itemStyle: {
              normal: {
                color: (params)=> colors[params.dataIndex],
                barBorderRadius: 0,
                label: {
                  show: false,
                }
              },
              emphasis:{
                barBorderRadius: 0,
                label: {
                  show: false,
                  margin:0,
                  textStyle: {
                    color: "#C0B298",
                    fontSize:10
                  },
                  formatter: (params)=>
                    (params.value)
                }
              }
            },
            markLine : {
              symbol: 'none',
              silent:true,
              data: [{
                type: 'average',
                name: '平均值'
              }],
              itemStyle: {
                normal: {
                  color: provinceLine,
                  label: {
                    textStyle: {
                      color: provinceLine,
                      fontSize:barFontSize
                    },
                    formatter:  ()=>peng
                  }
                }
              }
            },
            data:barNum
          },
        ]
      };
      const option3s = {
        backgroundColor:'#F7F8FC',
        title: {
          text: titleName,
          x: '30',
          textStyle: {
            color: '#333333',
            fontWeight:'normal',
            fontFamily:'Microsoft YaHei',
            fontSize: titleSize
          },
        },
        tooltip : {
          trigger: 'axis',
          confine:true,
          triggerOn:'mousemove',
          showContent:true,
          // show:toolTipShow,
          show:true,
          axisPointer: {
            type: 'line',
            show:true,
            z:1,
            lineStyle: {
              color: 'rgba(86,84,86,0.2)'
            },
          },
          formatter: (params)=>{
            if(Number.isNaN(proPercent[params[0].dataIndex])){
              if(Number.isNaN(barNum[params[0].dataIndex])){
                return `${example[1]}：- %<br />${example[0]}：- ${data.unit}`;
              }
              return `${example[1]}：- %<br />${example[0]}：${data.totalData[params[0].dataIndex]}${data.unit}`;
            }
            if(Number.isNaN(barNum[params[0].dataIndex])){
                return(`${example[1]}：${proPercent[params[0].dataIndex]}%<br />${example[0]}：-${data.unit}`)
              }
            return (`${example[1]}：${proPercent[params[0].dataIndex]}%<br />${example[0]}：${data.totalData[params[0].dataIndex]}${data.unit}`);
          },
          position:  (point)=> [point[0]-80, lengthSize],
          backgroundColor:tipBackcolor,
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        color: [themeColor[0],themeColor[1]],// 设置legend的颜色
        legend: {
          x: lengSizeX,
          y: lengSizeY,
          show:true,
          selectedMode:false,
          textStyle: {
            color: '#90979c',
            fontSize:12,
          },
          data:[example[1],example[0]]
        },
        grid: { // 折线图
          bottom:20,
          height:chartHeight*0.35,// 设置图的高度
        },
        xAxis : [
          {
            type: 'category',
            show:false,
            axisLabel:{
              interval:0,
            },
            data : axisData

          }
        ],
        animation:false,
        yAxis : [
          {
            type : 'value',
            show:true,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#B2B3B4'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show:true,
              formatter: '{value} %',
              textStyle: {
                color: "#B2B3B4",
                fontSize:barFontSize
              },
            },
            splitArea: {
              show: false
            },
          }
        ],
        series : [
          {
            name:example[1],
            type:'line',
            symbol:'emptyCircle',
            lineStyle: {
              normal: {
                color: provinceLine,
              }
            },
            axisLabel: {
              interval: 0,
            },
            itemStyle: {
              normal: {
                color: provinceLine,
                label: {
                  show: false, // 显示折线图节点数据
                }
              },
              emphasis:{
                label: {
                  show: false, // 悬浮显示数据
                  margin:0,
                  textStyle: {
                    color: provinceLine,
                    fontSize:10
                  },
                  formatter: (params)=>
                    // let dataIndex
                    // for (let i = 0; i < axisData.length; i+=1)
                    // {
                    //   if (axisData[i] === params.name)
                    //   {
                    //     dataIndex=i
                    //   }
                    // }
                     (params.value)

                }
              }
            },
            markLine : {
              symbol: 'none',
              silent:true,
              data: [{
                type: 'average',
                name: '平均值'
              }],
              itemStyle: {
                normal: {
                  color: '#CFD0D2',
                  label: {
                    textStyle: {
                      color: "#CFD0D2",
                      fontSize:barFontSize
                    },
                    formatter:  ()=> peng
                  }
                }
              }
            },
            data:proPercent
          },
          {
            name:example[0],
            type:'bar',
            data:[]
          }
        ]
      };
      myChart3s.setOption(option3s);
      myChart3.setOption(option3);
    }
    if(data.totalData.length>1){
      myChart3.off('click');
      myChart3s.off('click');
      myChart3.on('click',  (param)=>{
        // console.log("图像被点击")
        // console.log("this.state.chatData")
        // console.log(this.state)
        // console.log(param)
        // console.log(allProId)
        // console.log("isclick")
        // console.log(isclick)
        const {callbackPro,callbackCity}=this.props;
        if (isclick==="0") {
          // this.setState({
          //   toolTipShow:true,
          // })
          callbackPro(param.name, param.dataIndex,allProId);
        }
        else if(isclick==="1"){
         callbackCity(param.name,param.dataIndex,allProId);
        }
      });
    }
    echarts.connect([myChart3s,myChart3]);
    window.onresize = myChart3.resize;
  };

  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  };

  handleData() {
    const { guoduChar } = this.state; // 请求到的数据
    const {isClick,citySelect,provinceName}=this.props;
    let newChart=guoduChar;
    const regionSituationData = guoduChar;

    const chartData = []; // 数据组合到一起排序用
    // 环比数据 x轴数据  累计值数据 图例类型
    const { chartX, totalData, proPercent,allProId } = regionSituationData.chart[0];
    const dataLen = chartX.length;
    for (let i = 0; i < dataLen; i += 1) {
      const obj = {
        allProId:allProId[i],
        chartX: chartX[i],
        total: totalData[i],
        YoYData: proPercent ? proPercent[i] : null
      };
      chartData.push(obj);
    }
    const sortdata = this.sortData(chartData);
    for(let i=0;i<sortdata.length;i++){
      newChart.chart[0].chartX[i]=sortdata[i].chartX;
      newChart.chart[0].totalData[i]=sortdata[i].total;
      newChart.chart[0].proPercent[i]=sortdata[i].YoYData;
      newChart.chart[0].allProId[i]=sortdata[i].allProId;
    }
    // this.setState({
    //   chartData:newChart,
    // });
    this.createChart(newChart,provinceName,isClick,citySelect)
  }

  HandleSelectShow(e) {
    this.setState({
      selectShow: true
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  sortData(chartData12138) {
    const { selectSortIndex} = this.state; // 排序方式
    const {initChartData}=this.state;
    // a - b 小到大
    const sortNumber = (a, b) => {
      const Avalue = a.YoYData;
      const Bvalue = b.YoYData;
      if (selectSortIndex === 0) {
        return null;
      }
      if (selectSortIndex === 1) {
        // 环比升序
        return this.formatData(Avalue) - this.formatData(Bvalue);
      }
      if (selectSortIndex === 2) {
        // 环比降序
        return this.formatData(Bvalue) - this.formatData(Avalue);
      }
      if (selectSortIndex === 3) {
        // 绝对值降序
        return (
          Math.abs(this.formatData(a.total)) -
          Math.abs(this.formatData(b.total))
        );
      }
      if (selectSortIndex === 4) {
        // 绝对值降序
        return (
          Math.abs(this.formatData(b.total)) -
          Math.abs(this.formatData(a.total))
        );
      }
      return null;
    };
    if(selectSortIndex === 0){
      const chartData = []; // 数据组合到一起排序用
      // 环比数据 x轴数据  累计值数据 图例类型
      const { chartX, totalData, proPercent,allProId } = initChartData.chart[0];
      const dataLen = chartX.length;
      for (let i = 0; i < dataLen; i += 1) {
        const obj = {
          allProId:allProId[i],
          chartX: chartX[i],
          total: totalData[i],
          YoYData: proPercent ? proPercent[i] : null
        };
        chartData.push(obj);
      }
      console.log("默认排序")
      console.log(initChartData)
      return chartData
    }

    return chartData12138.sort(sortNumber);
  }

  handleListHide(e) {
    this.setState({
      selectShow: false
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  HandleSelect(index) {
    this.setState(
      {
        selectSortIndex: index,
        selectShow: false
      },
      () => {
        this.handleData();
      }
    );
  }

  render() {
    const{sortSelectData,selectShow, selectSortIndex}=this.state;
    const sortLi = sortSelectData.map((item, index) =>{
      const liItem = (
        <li
          key={item.id}
          onClick={e => {
            this.HandleSelect(index);
            e.stopPropagation(); // 阻止事件向上传播
          }}
        >
          {item.type === 0
            ? <IconFont className={styles.sortIcon} type="icon-paixu-jiang" />
            : <IconFont className={styles.sortIcon} type="icon-paixu-sheng" />}
          {/* {index > 0 && index < 3 ? `${item.name.slice(-2)}` : item.name} */}
          {item.name}
        </li>
      );
      return liItem;
    });

    return(
      <Fragment>
        <div className={styles.page}>
          <div id="regionSituation" className={styles.regionSituationCss}>
            <div className={styles.selectContent}>
              <div
                className={styles.selectContent2}
                onClick={(e) => this.HandleSelectShow(e)}
              >
                <div className={styles.selectTitle}>
                  {sortSelectData[selectSortIndex].name}
                  <i className={styles.triangle} />
                </div>
                {selectShow ? (
                  <ul
                    className={styles.selectContentUl}
                    onMouseLeave={(e) => this.handleListHide(e)}
                  >
                    {sortLi}
                  </ul>) : null}
              </div>
            </div>
          </div>
          <div className={styles.chartLine} ref={this.chartLine} />
          <div className={styles.chartBar} ref={this.chartBar} />
        </div>
      </Fragment>
    )
  }
}
export default AnalysisAreaChart
