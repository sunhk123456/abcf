/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/11/6
 */

import React, {PureComponent} from 'react';
import echarts from "echarts";
import isEqual from 'lodash/isEqual';
import {Icon} from "antd";
import DownloadFile from "@/utils/downloadFile";
import styles from "./transverseBar.less";
import FontSizeEchart from '../ProductView/fontSizeEchart';



class TransverseBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
    this.refEchart = React.createRef();
  }

  componentDidMount() {
    this.initEchart();
  }

  componentDidUpdate(prevProps) {
    const {data} = this.props;
    if(!isEqual(data, prevProps.data)){
      this.initEchart();
    }
  }

  dataFormat = (value)=>value.replace(/%/g, "").replace(/,/g,'');

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle());
  };

  jsonHandle=()=>{
    const {downloadData, data} = this.props;
    if(!data){return null}
    const {title,unit,download}=data;
    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
      ],
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table:download
    };
  };

  initEchart(){
    const {data} = this.props;
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize}=fontsize;
    const {chartX, chart, unit, title} =  data;
    const chartData = chart.map((item)=>({
        value:this.dataFormat(item),
        commaValue:item
      }))
    const option = {
      title:{
        text:title,
        left:10,
        top:10,
        textStyle:{
          fontSize: titleSize,
          fontWeight:titleWeight,
          fontFamily:titleFamily,
          textAlign:"center",
        },
      },
      grid: {
        left: 300,
        top: 80,
        right: 30,
        bottom: 20,
      },
      color:["#7BACD6"],
      tooltip:{
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
        textStyle:{
          fontSize: tooltipSize
        },
        formatter(params) {
          const {marker,dataIndex, data:{commaValue}} = params[0];
          return `${marker} ${chartX[dataIndex]}: ${commaValue} ${unit} `;
        }
      },
      xAxis:{
        show: true,
        position:"top",
        axisLine:{
          show:false,
        },
        axisTick:{
          show:false,
        },
        axisLabel: {
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
        }
      },
      yAxis: {
        textStyle: {
          fontSize:yAxisSize
        },
        axisTick:{
          show:false,
        },
        axisLine:{
          show:false,
        },
        data: chartX.map((item)=> item.length > 25 ? `${item.substring(0,25)}...` : item)
      },
      series:{
        type: 'bar',
        yAxisIndex: 0,
        barMaxWidth: 10,
        data: chartData,
        markLine:{
          show:false,
          symbol: "none",
          silent: true,
          label:{
            formatter(params){
              let value = null;
              chartData.forEach(item =>{
                if(parseInt(item.value,10) === params.value){
                  value = item.commaValue
                }
              })
              return value;
            }
          },
          lineStyle:{
            color:"red",
            type:"solid"
          },
          data:[{
            name:"最大值",
            type:"max"
          }]
        }
      }
    };

    const myChart = echarts.init(this.refEchart.current); // 初始化当日趋势图所需dom
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
  }


  render() {
    const {data, downloadData} = this.props;
    const {chartX} =  data;
    return (
      <div className={styles.transverseBar}>
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
        <div style={{height: 30*chartX.length+80}} ref={this.refEchart} />
      </div>
    )
  }
}

export default TransverseBar;
