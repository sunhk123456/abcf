import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import Cookie from '@/utils/cookie';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';
import iconFont from '../../../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});


class AreaEchart2 extends Component {

  constructor(props) {
    super(props);
    this.chartDom = React.createRef();
    this.state = {
      chartData: null,
      selectSortIndex: 0, // 选中的索引
      selectShow: false, // 是否显示下拉
      sortSelectData: [
        { id: "001", type: 1, name: "默认排序" },
        { id: "002", type: 1, name: "升序" },
        { id: "003", type: 0, name: "降序" },
      ],
      sortChartData:null,
    };
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { chartData } = nextProps;
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,
        sortChartData:chartData,
        selectSortIndex:0,
      };
    }
    return null;
  }

  componentDidMount() {
    const { chartData } = this.state;
    this.createChart(chartData);
  }

  componentDidUpdate(prevProps, prevState) {
    const { chartData } = this.state;
    if (chartData && chartData !== prevState.chartData) {
      this.createChart(chartData);
    }
  }


  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  createChart=(chartData)=>{
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    // console.log("全部产品合计地域分布图");
    // console.log(chartData);
    const color=["#61B6DA"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计地域分布图",
    //   unit:"户",
    //   yName:"单位：户",
    //   xName:"省市",
    //   chartX:["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "山东", "河南", "上海", "江苏", "浙江", "安徽",
    //     "福建", "江西", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"],
    //   chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021","820", "932", "901", "934", "1290", "1330",
    //     "820", '932', '901', '934', '1290', '1330', '1320','1100','1001','1021','820', '932', '901', '934', '1290'],
    //   example:['出账用户数'],
    // };
    const {title,unit,chartX,chart,example,yName,xName,average}=chartData;
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    let gridLeft=85;
    if(newChart.length>0){
      // 获取最大值
      const maxValue=newChart.reduce((prev,cur)=>prev.value>cur.value?prev:cur);
      if(maxValue.normalData.length>10){
        gridLeft= 95
      }else if(maxValue.normalData.length>6){
        gridLeft=85
      }else {
        gridLeft=70
      }
    }
    const { power} = Cookie.getCookie('loginStatus');
    let provinceName = ["北京"];
    const proName = "全国";
    if(proName==="北十省"){
      provinceName=["北京","天津","辽宁","内蒙古","河南","吉林","山西","河北","黑龙江","山东"]
    }else if(proName === "南二十一省"){
      provinceName=["上海","江苏","浙江","安徽","福建","江西","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"]
    }else if(proName === "全国" || power!=="all"){
      provinceName=chartX;
    }else{
      provinceName=[proName];
    }
    const option = {
      "color":color, // 柱状图颜色
      title:{
        text:title,
        x:"center",
        top:10,
        textStyle:{
          fontSize: titleSize,
          fontWeight:titleWeight,
          fontFamily:titleFamily,
          textAlign:"center",
        },
      },
      legend: {
        top:10,
        left:5,
        textStyle:{
          color:"#999999",
          fontSize:legendSize
        },
        data:example,
      },
      tooltip: {
        trigger: "axis",
        show: true,
        textStyle:{
          fontSize: tooltipSize
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        formatter(params) {
          let showTip = "";
          params.forEach((par,) => {
            if (par.axisDim === "x") {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${ par.data.normalData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      grid: {
        left:  gridLeft,
        top: 80,
        right: 70,
        bottom: 70,
      },
      xAxis:{
        name:xName,
        type: 'category',
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          interval: 0,
          margin: 2,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
          formatter(xAxisData) {
            if (xAxisData.length > 4) {
              return xAxisData
                .substr(0, 4)
                .split("")
                .join("\n");
            }
            return xAxisData.split("").join("\n");
          } // 使x轴字体竖向显示
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
          splitNumber:3,
          // show:false,
          name:yName || unit,
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:false, // x轴坐标轴线不展示
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:true, // x轴坐标标签展示
            fontSize:yAxisSize,
          },

        },

      ],

      series: [{
        name:example[0],
        type:'bar',
        yAxisIndex: 0,
        data:newChart,
        barWidth: 10,
        // barWidth: '70%',
        barMaxWidth:20,
        itemStyle:{
          color(params){
            let colorTsyle = "#D7D7D7"
            provinceName.forEach((item) =>{
              if(item === params.name){
                colorTsyle  = params.data.value > 0 ?  "#5AB7E0" : "#A6D2A4"
              }
            })
            return colorTsyle;
          } ,
          barBorderRadius:5,
        },
        markLine:average? {
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
                formatter:()=> average
              }
            }
          },
          data: [
            {
              yAxis: 870,
              name: '平均值',
            }
          ]
        } :null,
      }]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
    return null
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"areaEchart2");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    const {sortChartData}=this.state;
    if(!chartData){return null}
    const {title,unit,example}=sortChartData;
    const thData=["地域",example[0]];
    const tbodyData=sortChartData.chartX.map((item,index)=>([item,sortChartData.chart[index]]));
    const conditionValue=[];
    downloadData.condition.forEach((item)=>{
      conditionValue.push([item.key,...item.value])
    });
    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const table = {
      title: [
        thData
      ],
      value: [
        ...tbodyData
      ]
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  sortData=(chartData)=>{
    const { selectSortIndex} = this.state; // 排序方式
    const newChart=chartData;
    let sortData = []; // 数据组合到一起排序用
    // 环比数据 x轴数据  累计值数据 图例类型
    const { chartX, chart } = chartData;
    const dataLen = chartX.length;
    for (let i = 0; i < dataLen; i += 1) {
      const obj = {
        chart:chart[i],
        chartX: chartX[i],
      };
      sortData.push(obj);
    }
    // a - b 小到大
    const sortNumber = (a, b) => {
      if (selectSortIndex === 1) {
        // 环比升序
        return   this.formatData(a.chart==="-"?"0":a.chart) - this.formatData(b.chart==="-"?'0':b.chart)
      }
      if (selectSortIndex === 2) {
        // 环比降序

        return   this.formatData(b.chart==="-"?'0':b.chart) - this.formatData(a.chart==="-"?'0':a.chart)

      }
      return null;
    };
    if (selectSortIndex !== 0) {
      sortData=sortData.sort(sortNumber);
    }

    for(let i=0;i<sortData.length;i+=1){
      newChart.chartX[i]=sortData[i].chartX;
      newChart.chart[i]=sortData[i].chart;
    }
    return newChart
  };

  HandleSelectShow(e) {
    this.setState({
      selectShow: true
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
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

  handleData() {
    const { chartData } = this.state;
    const newChart=JSON.parse(JSON.stringify(chartData));
    const sortData = this.sortData(newChart);
    this.setState({
      sortChartData:sortData
    });
    this.createChart(sortData);
  }



  render() {
    const {downloadData}=this.props;
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
    return (
      <div id="areaEchart2" className={styles.page}>
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
        <div ref={this.chartDom} className={styles.chart} />
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
      </div>
    );
  }

}

export default AreaEchart2;

