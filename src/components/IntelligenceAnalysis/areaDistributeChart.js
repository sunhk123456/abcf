/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  地域分配图</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/28
 */

import React from 'react';
import echarts from "echarts";
import isEqual from 'lodash/isEqual';
import { Icon, Select } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './areaDistributeChart.less';
import FontSizeEchart from '../ProductView/fontSizeEchart';



class AreaDistributeChart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      sortSelectData: [
        { id: "01", name: "默认排序" },
        { id: "02", name: "环比升序" },
        { id: "03", name: "环比降序" },
        { id: "04", name: "绝对值升序" },
        { id: "05", name: "绝对值降序" }
      ],
      selectValue: '01',    //  排序下拉框的值,用于下钻时置为默认排序
      chartX: [],           //  X轴数据
      totalData: [],        //  柱状图数据
      percentData: [],       //  折线图数据
    };
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { chartData } = this.props;
    //  注册echarts Dom
    this.myChart = echarts.init(this.chartRef.current);
    //  获取点击位置的坐标
    this.myChart.getZr().on('click', params => {
      const pointInPixel = [params.offsetX, params.offsetY];
      //  判断坐标是否在 所限定的区域内（限定index为0和1的grid区域）
      if (this.myChart.containPixel({gridIndex: [0,1] }, pointInPixel)) {
        //  获取点击位置对应的  index，使用index获取数据 进行后续操作
        const xIndex = this.myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
        this.clickCharts(xIndex);
      }
    });
    //  空数据不渲染
    if(Object.keys(chartData).length === 0) return;
    //  保存数据并渲染
    this.setState({
      chartX: chartData.chart.chartX,
      totalData: chartData.chart.totalData,
      percentData: chartData.chart.percentData,
      selectValue: '01'
    }, () => {
      this.initCharts();
    })


  }

  componentDidUpdate(prevProps) {
    const { chartData } = this.props;
    if (chartData.chart && !isEqual(chartData.chart, prevProps.chartData.chart)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        chartX: chartData.chart.chartX,
        totalData: chartData.chart.totalData,
        percentData: chartData.chart.percentData,
        selectValue: '01'
      }, () => {
        this.initCharts();
      })

    }
  }

  clickCharts = index => {
    const { chartX, totalData } = this.state;
    const { click, callBack, typeId: { provId, cityId}} = this.props;
    if(click !== 2 && totalData[index] !== '-') {
      const typeId = click ? cityId : provId;
      callBack(click +1, chartX[index].name, chartX[index].id, typeId)
    }
  };

  initCharts = () => {
    const { click, chartData: { chart : {title, totalDataUnit, percentDataUnit, totalDataAverage, percentDataAverage, example }}} = this.props;
    const { chartX, totalData, percentData } = this.state;
    const { myChart } = this;
    const { titleSize, tooltipSize}=FontSizeEchart();
    const powerName = click ? "全省" : "全国";


    //  处理X轴数据
    const chartXData = chartX.map(item=> item.name);
    //  处理line数据
    const lineData = percentData.map((item,index) => ({
        id: chartX[index].id,
        value: item
      }));
    //  处理bar数据
    const barData = totalData.map((item,index) => ({
      id: chartX[index].id,
      value: item.replace(/,/g,'')
    }));

    const option = {
      title: {
        text: title,
        padding: [10,30],
        textStyle: {
          fontSize: titleSize,
          color: '#333333', // 主标题文字颜色
          fontWeight:'normal',
          fontFamily:'Microsoft YaHei',
        },
      },
      xAxis: [
        {
          type: 'category',
          show: false,
          gridIndex: 0, // 对应前面grid的索引位置（第一个）
          data : chartXData
        },
        {
          type: 'category',
          gridIndex: 1, // 对应前面grid的索引位置（第一个）
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
              color: '#9F9F9F'
            },
            formatter: xAxisData => (xAxisData.substr(0,4).split("").join("\n"))  // 使x轴字体竖向显示
          },
          data : chartXData
        }
      ],
      legend: {
        data: example,
        left:'75%',
        top: 5,
        textStyle:{
          color:"#999",
        }
      },
      axisPointer: {
        show: true,
        type: "none",
        link: [{ xAxisIndex: [0, 1] }], //  设置轴联动
        label: {
          show: false
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: 'line'
        },
        lineStyle: {
          color: "rgba(86,84,86,0.2)"
        },
        textStyle: {
          fontStyle: tooltipSize
        },
        formatter: (params)=> {
          let showTipOne = '';
          let showTipTwo = '';
          params.forEach((par) => {
            if (par.axisDim === "x") {
              if (par.componentSubType === "line") {
                showTipOne += `${par.marker} ${par.seriesName}: ${percentData[par.dataIndex]} ${percentDataUnit}<br/>`;
              } else {
                showTipTwo += `${par.marker} ${par.seriesName}: ${totalData[par.dataIndex]} ${totalDataUnit}`;
              }
            }
          });
          return `${params[0].name}<br/>${showTipOne}${showTipTwo}`;
        },
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      grid: [
        { top: "15%", height: "30%", left: "55%,", right: "3%" },
        { top: "45%", height: "35%", left: "55%,", right: "3%" }
      ],
      yAxis: [
        {
          type : 'value',
          show:true,
          gridIndex: 0,
          scale: true,
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
            },
            formatter: (value, index) => index === 0 ? null : `${value}${percentDataUnit}`
          },
          splitArea: {
            show: false
          },
          //  设置最大值 防止下钻至地市后 全省平均值高于 坐标最大值时 markline 不显示
          max: value => value.max > percentDataAverage ? value.max : percentDataAverage
        },
        {
          type : 'value',
          show:true,
          gridIndex: 1, // 对应前面grid的索引位置（第一个）
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
            },
          },
          splitArea: {
            show: false
          },
          //  设置最大值 防止下钻至地市后 全省平均值高于 坐标最大值时 markline 不显示
          max: value => value.max > totalDataAverage ? value.max : totalDataAverage
        }
      ],
      series: [
        {
          name: example[1],
          type: "line",
          yAxisIndex: 0, // 对应yAxis的索引位置
          xAxisIndex: 0, // 对应xAxis的索引位置
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          itemStyle: {
            color: "#cccccc"
          },
          data: lineData,
          markLine: {
            symbolSize: 0,
            label: {
              formatter: () => powerName
            },
            data: [{name: '平均值', yAxis: percentDataAverage}]
          }
        },
        {
          name: example[0],
          type: "bar",
          yAxisIndex: 1, // 对应yAxis的索引位置
          xAxisIndex: 1, // 对应xAxis的索引位置
          barMaxWidth: 15,
          itemStyle: {
            normal: { color: params => params.data.value >= 0 ? "#5BACE0" : "#A6D2A4", }
          },
          data: barData,
          markLine: {
            symbolSize: 0,
            label: {
              formatter: () => powerName
            },
            data: [{name: '平均值', yAxis: totalDataAverage}]
          }
        },
      ]
    };
    myChart.setOption(option, true);
  };

  //  改变排序方式
  onChange = value => {
    const { chartData: { chart } } = this.props;
    const { chartX, totalData, percentData } = this.state;
    //  合成之后的数据集用于排序
    const dataList = [];
    //  dataList排序之后拆分的三组数据，用于渲染
    let sortChartX = [];
    let sortTotalData = [];
    let sortPercentData= [];
    //  判断是否为默认顺序，是则从props取原始数据渲染，否则先合成数据，做排序，再拆分数据进行渲染
    if(value === '01') {
      sortChartX = chart.chartX;
      sortTotalData = chart.totalData;
      sortPercentData = chart.percentData;
    } else {
      //  合成数据
      for(let i = 0; i < chartX.length; i += 1) {
        const item = {
          chartX: chartX[i],
          percentData: percentData[i],
          totalData: totalData[i],
          //  去逗号的total数据 用于绝对值排序
          sortData: totalData[i].replace(/,/g,'')
        };
        dataList.push(item);
      }
      //  排序之后的数据 用于替换渲染数据进行排序后的渲染
      let sortData;
      //  数据排序
      switch (value) {
        case '02' : //  环比升序
          sortData = dataList.sort((a,b) => a.percentData - b.percentData);
          break;
        case '03' : //  环比降序
          sortData = dataList.sort((a,b) => b.percentData - a.percentData);
          break;
        case '04' : //  绝对值升序
          sortData = dataList.sort((a,b) => Math.abs(a.sortData) -  Math.abs(b.sortData));
          break;
        case '05' : //  绝对值降序
          sortData = dataList.sort((a,b) => Math.abs(b.sortData) - Math.abs(a.sortData));
          break;
        default:
          break
      }
      //  数据拆分
      sortData.forEach(item => {
        sortChartX.push(item.chartX);
        sortPercentData.push(item.percentData);
        sortTotalData.push(item.totalData);
      })
    }
    this.setState({
      chartX: sortChartX,
      totalData: sortTotalData,
      percentData: sortPercentData,
      selectValue: value
    }, () =>{
      this.initCharts()
    })
  };

  //  点击下载
  download = (e) => {
    const { echartId } = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  jsonHandle = () =>{
    const { chartX, totalData, percentData } = this.state;
    const {chartData: { chart }, downloadData} = this.props;
    const {specialName, conditionValue} = downloadData;
    const {title,totalDataUnit,example,percentDataUnit} = chart;

    const xxdValue=[];
    for(let i = 0; i < chartX.length; i +=1) {
      const item = [chartX[i].name, totalData[i], `${percentData[i]}${percentDataUnit}`];
      xxdValue.push(item);
    }
    const table = {
      title: [
        ["省份", example[0], example[1]]
      ],
      value:xxdValue,
    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,`(${totalDataUnit})`],...conditionValue],
      },
      table
    };
  };

  render() {
    const { downloadData, echartId } = this.props;
    const { sortSelectData, selectValue } = this.state;
    const { Option } = Select;
    const optionDom = sortSelectData.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>));
    const selectTriangle = <i className={styles.selectTriangle} />;
    return (
      <div className={styles.areaDistributeChart} id={echartId}>
        <Select
          dropdownClassName={styles.select}
          className={styles.selectSort}
          defaultValue="01"
          value={selectValue}
          onChange={this.onChange}
          suffixIcon={selectTriangle}
        >
          {optionDom}
        </Select>
        { downloadData &&
        <div className={styles.downLoadBtn} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
        <div className={styles.mycharts} ref={this.chartRef} />
      </div>
    );
  }
}

export default AreaDistributeChart;

