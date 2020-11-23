import React, { PureComponent } from 'react';
import PieEchart3 from '../../components/Echart/analyseSpecial/pieEchart3';
import styles from './index.less'
import PieEchart2 from '../../components/Echart/analyseSpecial/pieEchart2';
import PieEchart from '../../components/Echart/analyseSpecial/pieEchart';
import Top10 from '../../components/Echart/analyseSpecial/top10';
import Top5 from '../../components/Echart/analyseSpecial/top5';
import TreeMap from '../../components/Echart/analyseSpecial/treeMap';
import TimeEchart1 from '../../components/Echart/analyseSpecial/timeEchart1';
import TimeEchart2 from '../../components/Echart/analyseSpecial/timeEchart2';
import TimeEchart3 from '../../components/Echart/analyseSpecial/timeEchart3';
import StackBar from '../../components/Echart/analyseSpecial/stackBar';
import AreaEchart2 from '../../components/Echart/analyseSpecial/areaEchart2';
import AreaEchart1 from '../../components/Echart/analyseSpecial/barEchart';


class Demo extends PureComponent {
  constructor(props){
    super(props);
    this.state={};
  }

  render() {
    const echartData={
        title:"全部产品合计4G网络用户占比",
        chart: ["20000000", "20000000", "20000000"],
        chartX: ["2G", "3G", "4G"],
        example: ["2G", "3G", "4G"],
        unit:"户",
    };
    const top10={
      title:"top10",
      unit:"户",
      yName:"",
      xName:"",
      chartX:["小兵神卡", "芝麻冰激凌", "陌陌冰激凌", "超值特惠冰激凌", "畅爽全国冰激凌套餐", "辽宁", "吉林", "黑龙江", "山东", "河南"],
      chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021"],
      example:['出账用户数'],};
    const top5={
      title:"top5",
      unit:"户",
      yName:"",
      xName:"",
      chartX:["小兵神卡", "芝麻冰激凌", "陌陌冰激凌", "超值特惠冰激凌", "畅爽全国冰激凌套餐"],
      chart:["820", "932", "901", "934", "1290"],
      example:['出账用户数'],};
    const treeMap={
      "title":"树形图",
        "treeChart": [
        {
          "id": "1",
          "name": "6M≤速率<18M",
          "value": "2001",
          'example': "[10,20]"
      },
        {
          "id": "2",
          "name": "4M≤速率<10M ",
          "value": "8,001",
          'example': "[30,20]"
        },
        {
          "id": "3",
          "name": "1M≤速率<4M ",
          "value": "5001",
          'example': "[40,20]"
        }
      ],
        "itemName": "当期值",
        "unit": "万元"
    };
    const time={
        'title': '全国合计时间趋势图',
        'chartX': ['201803', '201804', '201805', '201806', '201807'],
        'chart': ['100', '200', '100', '400', '600'],
        'warning': [
          { 'warningIndex': '0', 'warningLevel': 'nn', 'desc': 'mm' },
          { 'warningIndex': '2', 'warningLevel': 'nnn', 'desc': 'mmm' },
          { 'warningIndex': '3', 'warningLevel': 'nnnn', 'desc': 'mmmm' },
        ],
        'unit': '万元',
        'xName': '账期',
        'yName': '出账用户数',
      'example':['出账用户数'],
        'tableData': {
          thData: ['日期', '本年累计值'],
          tbodyData: [
            { 'date': '7月', 'value': '22', 'warningLevel': '1级', 'desc': '预警信息预警信息' },
            { 'date': '8月', 'value': '22', 'warningLevel': '', 'desc': '' },
            { 'date': '9月', 'value': '22', 'warningLevel': '', 'desc': '' },
            { 'date': '10月', 'value': '22', 'warningLevel': '', 'desc': '' },
          ],
        },
    };
    const stackBar={
      "title":"柱形堆积图",
      "chartX": ["2019年1月", "2019年02月",],
      "chart": [
        {
          name:"邮件营销",
          data:[ "230", "210"],
          "unit":"%"
        },
        {
          name:"联盟广告",
          data:[ "330", "1,310"],
          "unit":"%"
        },
        {
          name:"邮件营销1",
          data:[ "230", "210"],
          "unit":"%"
        },
        {
          name:"联盟广告1",
          data:[ "330", "310"],
          "unit":"%"

        },
      ],
      "example": ["邮件营销","联盟广告","邮件营销1","联盟广告1"],
    };
    const area1={
        title:"全部产品合计地域分布图",
        unit:"户",
        yName:"单位：户",
        xName:"省市",
        chartX:["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "山东", "河南", "上海", "江苏", "浙江", "安徽",
          "福建", "江西", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"],
        chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021","820", "932", "901", "934", "1290", "1330",
          "820", '932', '901', '934', '1290', '1330', '1320','1100','1001','1021','820', '932', '901', '934', '1290'],
        example:['出账用户数',"发展真实录平均值"],
        average:"870",
    };
    const downloadData={};
    return (
      <div className={styles.page}>
        <div className={styles.chart}>
          <PieEchart3 chartData={echartData} downloadData={downloadData} />
        </div>
        <div className={styles.chart}>
          <PieEchart2 chartData={echartData} downloadData={downloadData} />
        </div>
        <div className={styles.chart}>
          <PieEchart chartData={echartData} downloadData={downloadData} />
        </div>
        <div className={styles.chart}>
          <Top10 chartData={top10} downloadData={downloadData} />
        </div>
        <div className={styles.chart}>
          <Top5 chartData={top5} downloadData={downloadData} />
        </div>
        <div className={styles.chart}>
          <TreeMap chartData={treeMap} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <TimeEchart1 chartData={time} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <TimeEchart2 chartData={time} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <TimeEchart3 chartData={time} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <AreaEchart1 chartData={area1} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <AreaEchart2 chartData={area1} downloadData={downloadData} />
        </div>
        <div className={styles.chart1}>
          <StackBar chartData={stackBar} downloadData={downloadData} />
        </div>

      </div>
    );
  }
}
export default Demo
