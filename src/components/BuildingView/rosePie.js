/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React,{ PureComponent} from "react";
import echarts from "echarts";
import isEqual from "lodash/isEqual";
import { Icon } from 'antd';
import echartFontSize from '../ProductView/fontSizeEchart';
import styles from './rosePie.less';
import DownloadFile from '@/utils/downloadFile';

class RosePie extends PureComponent {

  static defaultProps={
    colors:[
      "#5CD5E3",
      "#DC69AB",
      "#61ADDD",
      "#DE9462",
      "#91C7AE",
      "#919BC6",
      "#C391C6",
      "#DC6868",
      "#B6DC6B",
      "#D0C862"
    ]
  }

  constructor(props) {
    super(props);
    this.rosePieRef = React.createRef(); // 创建玫瑰饼图ref
    this.state={
      echartId:'buildingViewRosePie',
      maxValue:""
    }
  }

  componentDidMount(){
    const { rosePieData,colors } = this.props;
    if( JSON.stringify(rosePieData) !== "{}" ){
      this.initRosePieChart(rosePieData,colors);
    }
  }

  componentDidUpdate(prevProps){
    const { rosePieData,colors } = this.props;
    if( JSON.stringify(rosePieData) !== "{}" && !isEqual(rosePieData,prevProps.rosePieData)){
      this.initRosePieChart(rosePieData,colors);
    }
  }

  /*
  * 绘制折线图
  * */
  initRosePieChart=(rosePieData,colors)=> {
    // const self =this;
    const myFontSzie=echartFontSize();
    const rosePie = echarts.init(this.rosePieRef.current); // 初始化折线图所需dom
    const rosePieOption = {
      title : {
        text: '产品结构',
        left: "center",
        top: 10,
        textStyle: {
          fontSize: myFontSzie.titleSize,
          color: "#333333", // 主标题文字颜色
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei"
        }
      },
      tooltip: {
        trigger: 'item',
        // formatter: "{b} : {d}% <br/> {c}"+rosePieData.chart[0].unit,
        formatter(params) {
         // let showTip = '';
         //  const useValue = self.cutNumber(params.data.value);
         //  showTip += `${params.data.name}:${params.percent}%<br/>${useValue}${params.data.value === '-' ? '' : params.data.unit}`;
         //  return `${showTip}`;
          return `${params.marker}${params.name}:${params.data.normalData}${params.data.normalData === '-' ? '' : params.data.unit}`;
        },
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      grid: {
        top: 500,
      },
      color: colors,
      polar: {
        // radius: ['50%', '50%'],
        center: ['50%', '60%'],
      },
      angleAxis: {
        interval: 1,
        type: 'category',
        data: [],
        z: 1,
        axisLine: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          show: false,
          color: "#C6F9F2",
          margin: 8,
          fontSize: 16
        },
      },
      radiusAxis: {
        min: 60,
        max:120,
        interval: 5,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick:{
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#C6F9F2",
            width: 1,
            type: "solid"
          }
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['20%', '60%'],
          center: ['50%', '60%'],
          roseType: 'radius',
          width: "40%", // for funnel
          max: 40, // for funnel
          data: this.createPieData(rosePieData.chartX,rosePieData.chart[0].value,rosePieData.chart[0].unit),
          label: {
            normal: {
              padding: [-22,-50,0,-50],
              height: 70,
              fontSize: myFontSzie.pietextSize,
              align: 'center',
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 55
            },
            // emphasis: {
            //   show: false
            // }
          },
          itemStyle: {
            // normal: {
            //   shadowBlur: 30,
            //   shadowColor: 'rgba(0, 0, 0, 0.4)'
            // }
          },
          // animationType: 'scale',
          // animationEasing: 'elasticOut',
          // animationDelay: 200
        },
      ]
    };
// 检测屏幕宽度发生变化时,重新渲染
    rosePie.clear();
    rosePie.resize();
    rosePie.setOption(rosePieOption);
    // window.addEventListener('resize', () => {
    //   rosePie.resize();
    // });
  };

  /**
   * 为数字增加千分号
   * @param value，原来的数字
   * @returns newArray，返回一个新的字符串数组（由于仅仅要进行的是展示操作，无需再转化回number类型）
   */
  cutNumber = (value) => {
    const oldArray = value
      .toString()
      .split('')
      .reverse(); // 先将原有数字转化为字符串类型，并按单个字符切割，再头尾反转
    const newArray = []; // 新的数组来存放带有逗号分隔符的数据
    oldArray.forEach((item, index) => {
      newArray.push(item);
      // 每三个字符进行一次分割（由于已经是逆转顺序的数组，即是从个位数开始计算，并且首尾是不允许出现分割符的）
      if (index % 3 === 2 && index !== 0 && index !== oldArray.length - 1) {
        newArray.push(',');
      }
    });
    newArray.reverse(); // 将新数组再次逆转回来
    let finalString=''; // 最终需要的字符串
    newArray.forEach((item)=>{
      finalString+=item;
    })
    return finalString;
  };

/**
   * 刻画饼图所需的数据格式类型
   * @param nameArray,名称数组
   * @param valueArray,值数组
   * @returns {XML},返回需要的数组格式
   */
   createPieData=(nameArray,valueArray,unit)=>{
     const {handleMaximum} = this.props;
     const pieData =[];
     if(handleMaximum){
       const valuearr = valueArray.map((item) => item !== "-" ? this.formatData(item) : 0)
       const maxValue = valueArray[valuearr.indexOf(Math.max(...valuearr))];
       valueArray.forEach((item,index)=>{
         if(item !== maxValue){
           pieData[index] = {
             "name":nameArray[index],
             "value": this.formatData(item),
             'normalData': item,
             'unit': unit,
           }
         }
       });
       this.setState({maxValue:maxValue+unit})
     }else {
       valueArray.forEach((item,index)=>{
         pieData[index] = {
           "name":nameArray[index],
           "value": this.formatData(item),
           'normalData': item,
           'unit': unit,
         }
       });
     }
     return pieData;
   };

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  jsonHandle=()=>{
    const {rosePieData,downloadData} = this.props;
    const {title,chartX,chart}=rosePieData;
    const {specialName,conditionValue} = downloadData;
    let unitCopy = ""
    const tableValue = chart.map((item)=>{
      unitCopy = item.unit;
      const value = item.value.map((itemValue)=>`${itemValue}`);
      return  [item.name,...value]
    });
    const table={
      title: [
        ["维度",...chartX]
      ],
      value: tableValue

    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unitCopy],...conditionValue],
      },
      table
    };
  };

  download = (e) => {
    const {echartId} = this.state;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  render() {
    const {echartId,maxValue} = this.state;
    const {rosePieData,downloadData,handleMaximum} = this.props;
    if (JSON.stringify(rosePieData) !== "{}") {
      return (
        <div className={styles.rosePieDiv} id={echartId}>
          <div ref={this.rosePieRef} className={styles.rosePieChart} />
          {downloadData&&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
          {
            handleMaximum &&
              <div className={styles.handleMaximum}>其他：{maxValue}</div>
          }
        </div>
      )
    } else {
      return null;
    }
  }
}
export default RosePie;
