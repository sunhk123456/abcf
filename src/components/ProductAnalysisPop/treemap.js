/* eslint-disable prefer-template */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: treemap/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/1/17/017
 */
import React, {PureComponent} from 'react';
import echarts from "echarts"
import style from "./treemap.less"

// import {Card, Row, Col } from 'antd';

class Treemap extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // getProductCategory:"01"
    };

  }

  componentDidMount() {
    const {treeChartData}=this.props
    let result={}
    if(!treeChartData){
      result = this.sort(treeChartData);
    }
    else{
      result = this.sort(treeChartData);
    }
    this.tree(result)
  }

  componentWillReceiveProps(nextProps){
    const {treeChartData}=nextProps
    let result={}
    if(!treeChartData){
      result = this.sort(treeChartData);
    }
    else{
      result = this.sort(treeChartData);
    }
    this.tree(result)
  }

  // 数据排序

  sort=(data) =>{
     const {treeData}=data
    const items = treeData.treeChart.map((item) => {
      const temp = {};
      temp.name = item.name;
      temp.productCategory = item.productCategory;
      temp.value = item.value;
      temp.legendName = item.legendName;
      if (typeof temp.value === 'string' && temp.value.constructor === String) {
        if (temp.value.indexOf(",") !== "-1") {
          temp.value = parseFloat(temp.value.replace(/,/g, ''));
        } else if (temp.value === "-") {
          temp.value = "0";
        } else {
          temp.value = parseFloat(temp.value);
        }
      }
      return temp;
    });
    // data.items数值排序
    for (let i = 0; i < items.length - 1; i += 1) {
      for (let j = 0; j < items.length - 1 - i; j += 1) {
        let temp;
        if (items[j].value > items[j + 1].value) {
          temp = items[j];
          items[j] = items[j + 1];
          items[j + 1] = temp;
        }
      }
    }
    const result = treeData;
    result.items = items.reverse();
    // data.chart排序
    const chart = [];
    for (let i = 0; i < result.items.length; i += 1) {
      for (let j = 0; j < treeData.treeChart.length; j += 1) {
        if (items[i].productCategory === treeData.treeChart[j].productCategory) {
          chart.push(treeData.treeChart[j]);
          break;
        }
      }
    }
    result.treeChart = chart;
    return result;
  }

// 处理数据格式
  formatData=(data)=> {
    // const dataA = data.indexOf(",") === "-1"
    //   ? parseFloat(data)
    //   : parseFloat(data.replace(/,/g, ""));
   const dataA = data.replace(/,/g, "");
    return dataA;
  }

  // 矩形树状图

  tree=(data) =>{
    const {treeChartData}=this.props
    const treemap = echarts.init(document.getElementById("treemap"))
    const lengendColor = ['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB'];
    const {example} = treeChartData;
    const {unit} = treeChartData;
    const res = data.treeChart.map((item, index) => {
        const temp = item;
        temp.itemStyle = {
          normal: {
            color: lengendColor[index],
          }
        }
      temp.value=this.formatData(temp.value)
        return temp;
      })
    ;
    treemap.setOption({
      tooltip: {
        textStyle: {
          fontSize: 14
        },
        formatter: (param) => {
          if (data.treeChart[param.dataIndex - 1] !== undefined) {
            return `${param.name} <br/> ${example} : ${data.treeChart[param.dataIndex - 1].value}  ${unit}`;
          }
          return `${param.name} <br/> ${example}  :  -  ${unit}`;
        }
      },
      series: [{
        type: 'treemap',
        name: "",
        width:"100%",
        height:"100%",
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        data: res,
        label: {
          show: true,
          normal: {
            position: 'insideTopLeft',
            // fontSize:labelSize,
            offset: [5, 5],
            formatter: (param) => param.name
          }
        },
      }]
    })
    treemap.resize();
  }

  getProductCategory=(index)=>{
    const {treeChartData}=this.props
    const {treemapClick}=this.props
    let res={}
    res = this.sort(treeChartData);
    // this.setState({
    //   getProductCategory:res.treeChart[index].productCategory
    // })
    treemapClick(res.treeChart[index].productCategory,res.treeChart[index].name)
    return index
  }

  render() {
    const {treeChartData,divWidth,divHeight}=this.props
    let res={}
    res = this.sort(treeChartData);
    const lengendColor = ['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB'];
    // console.log("res.treeChart,kkkey");
    // console.log(res.treeChart);
    const lengendLayOut = res.treeChart.map((item, index) => {
      const itemColor = lengendColor[index % 9];
      return <div key={item.legendName} className={style.item}><span className={style.img} style={{backgroundColor: itemColor}} onClick={this.getProductCategory.bind(this,index)} /><span className={style.name}>{item.legendName}</span></div>
    });
    return (
      <div className={style.myTreemap} style={{width:divWidth,height:divHeight}}>
        <div className={style.treemap} id="treemap" />
        <div className={style.legend}>
          {lengendLayOut}
        </div>
      </div>
    );
  }
}

export default Treemap;
