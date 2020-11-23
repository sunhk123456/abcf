/*
*
* name：全部产品合计地域分布图 echart折线柱状混合图
* time：2019/6/4
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import echarts from "echarts";
import {Icon} from "antd";
import isEqual from 'lodash/isEqual';
import FontSizeEchart from '../ProductView/fontSizeEchart';
import DownloadFile from "@/utils/downloadFile";
import iconFont from '../../icon/Icons/iconfont';
import styles from './AreaEchart.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

class BuildingViewAreaEchart extends PureComponent {

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      handlEchartData:[], // 处理后的数据
      echartData:[], // 处理后默认数据
      sortSelectData: [
        { id: "001", type: 1, name: "默认排序" },
        { id: "002", type: 1, name: "升序" },
        { id: "003", type: 0, name: "降序" },
      ],
      selectSortIndex: 0, // 选中的索引
      selectShow: false, // 是否显示下拉
    }
  }

  componentDidMount() {
    // const {chartData}=this.props;
    // if( JSON.stringify(chartData) !== "{}"){
    //   this.handleData();
    // }
  }

  componentDidUpdate(prevProps) {
    const {chartData}=this.props;
    if( JSON.stringify(chartData) !== "{}" && !isEqual(chartData,prevProps.chartData)){
      this.handleData();
      // eslint-disable-next-line
      this.setState({selectSortIndex:0})
    }
  }


  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  };

  createChart=()=>{
    const {chartData} = this.props;
    const color=["#61B6DA"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    const {title,unit,example}=chartData;
    const {handlEchartData} = this.state;
    const chartX = [];
    const newChart=handlEchartData.map((item)=>{
      chartX.push(item.xData)
      return  {
        "value":this.formatData(item.yData),
        "normalData":item,
        "unit":unit,
      }
    });
    let strOrient = "horizontal";
    const wScreen = window.screen.width;
    if( wScreen < 1315){
      strOrient = "vertical";
    }
    let gridLeft=85;
    if(newChart.length>0){
      // 获取最大值
      const maxValue=newChart.reduce((prev,cur)=>prev.value>cur.value?prev:cur);
      if(maxValue.normalData.yData.length>10){
        gridLeft= 95
      }else if(maxValue.normalData.yData.length>6){
        gridLeft=85
      }else {
        gridLeft=70
      }
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
        top:40,
        right:10,
        show:false,
        orient: strOrient,
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
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData.yData}  ${ par.data.normalData.yData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      grid: {
        // left: wScreen > 1866 ? gridLeft+15 : gridLeft,
        // top: 80,
        // right: 10,
        // bottom: wScreen > 1866 ? 60 : 50,
        top: 80,
        right: "5%",
        left: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis:{
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
          // show:false,
          name:`单位：${unit}`,
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
        {
          type: 'value',
          show:false,
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
          // boundaryGap: [0.2, 0.2]
        },
      ],
      series: [{
        name:example[0],
        type:'bar',
        yAxisIndex: 0,
        data:newChart,
        barWidth: '70%',
        barMaxWidth:10,
        itemStyle:{ barBorderRadius:5, },
      }]
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
    return null
  };

  // 处理排序
  handleData(){
    const {chartData} = this.props;
    const {chartX,chart} = chartData
    const handlEchartData = chartX.map((item,index)=>({
        xData:item,
        yData:chart[index]
      }))
    this.setState({handlEchartData,echartData:[...handlEchartData]},()=>this.createChart());
  }

  /**
   * @date: 2019/12/12
   * @author 风信子
   * @Description: 方法描述 下载
   * @method download
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  download(){
    const {chartData,downloadData} = this.props;
    const {title,unit} = chartData;
    const {specialName,conditionValue} = downloadData;
    const {handlEchartData} = this.state;

    const tableValue = handlEchartData.map((item)=>[item.xData,item.yData]);

    const table={
      title: [
        ["地域","数据"]
      ],
      value: tableValue

    };
    const jsonDown = {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unit],...conditionValue],
      },
      table
    };
    DownloadFile(jsonDown,"areaEchartBar");
  }

  /*
   * 点击下拉显示
   *
   * */
  HandleSelectShow(e) {
    this.setState({
      selectShow: true
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  /*
   *  选中排序方式initEchart
   *  index 索引
   * */
  HandleSelect(index) {

    this.setState({
        selectSortIndex: index,
        selectShow: false,
        handlEchartData: this.sortData(index)
      },
      () => {
        this.createChart();
      }
    );
  }

  /*
     * 排序数据
     * */
  sortData(selectSortIndex) {
    const { echartData,handlEchartData } = this.state; // selectSortIndex排序方式0-4
    // a - b 小到大
    const sortNumber = (a, b) => {
      const Avalue = a.yData;
      const Bvalue = b.yData;
      let data = null;
      if (selectSortIndex === 1) {
        // 升序
        data = (Avalue === "-" ? Infinity : this.formatData(Avalue) ) - (Bvalue === "-" ? Infinity : this.formatData(Bvalue));
      }else if (selectSortIndex === 2) {
        // 降序
        data = (Bvalue === "-" ? -Infinity : this.formatData(Bvalue) ) - (Avalue === "-" ? -Infinity : this.formatData(Avalue));
      }
      return data;
    };
    return selectSortIndex === 0 ? [...echartData] : handlEchartData.sort(sortNumber);
  }

  /**
   * @date: 2019/12/13
   * @author 风信子
   * @Description: 方法描述 关闭排序
   * @method handleListHide
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  handleListHide(e) {
    this.setState({
      selectShow: false
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  render() {
    const {downloadData,sort} = this.props;
    // 是否显示下拉  选中索引 排序数据
    const { sortSelectData, selectSortIndex,selectShow  } = this.state;

    const sortLi = sortSelectData.map((item, index) =>{
      const liItem = (
        <li
          key={item.id}
          onClick={e => {
            this.HandleSelect(index);
            e.stopPropagation(); // 阻止事件向上传播
          }}
        >
          {item.type === 0 ? <IconFont className={styles.sortIcon} type="icon-paixu-jiang" /> : <IconFont className={styles.sortIcon} type="icon-paixu-sheng" />}
          {item.name}
        </li>
      )
      return liItem;
    });
    return(
      <div className={styles.page} id="areaEchartBar">
        {
          sort && (
            (
              <div className={styles.selectContent}>
                <div
                  className={styles.selectContent2}
                  onClick={(e) => this.HandleSelectShow(e)}
                >
                  <div className={styles.selectTitle}>
                    {sortSelectData[selectSortIndex].name}
                    <i className={styles.triangle} />
                  </div>
                  {selectShow && (
                    <ul
                      className={styles.selectContentUl}
                      onMouseLeave={(e) => this.handleListHide(e)}
                    >
                      {sortLi}
                    </ul>)}
                </div>
              </div>
            )
          )
        }
        <div ref={this.chartDom} className={styles.chartWrapper} />
        {downloadData&&
        <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
      </div>
    )
  }

}
export default BuildingViewAreaEchart
