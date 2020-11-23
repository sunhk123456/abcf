/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React, { PureComponent } from 'react';
import echarts from 'echarts';
import { Icon, Tooltip } from 'antd';
import isEqual from 'lodash/isEqual';
import echartFontSize from '../ProductView/fontSizeEchart';
import styles from './cutPie.less';
import DownloadFile from '@/utils/downloadFile';
import waSai from './pic/ganTan.png';

class RosePie extends PureComponent {

  static defaultProps = {
    cutPieData:{
      title:"保存本网/异网通话次数对比",
      totalList:{
        name:"",
        value:"",
        unit:""
      },
      description:'就tm你叫夏洛啊',
      chartX:["大于7个","5-7个","3-4个","1-2个","无"],
      chart:[
        {
          name:"保存本网/异网通话次数对比",
          value:['2,536','536','536','536','536',],
          unit:"万",
          type:"pie"
        },
      ]
    },
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
      "#D0C862"],
    hasBorder:false,
    hasLegend:true,
    titlePosition:"left",
    centerData:['50%','50%'],
    hasClockWise:true,// 是否顺时针布局
    hasPercent:true, // 展示是否显示百分比
  };

  constructor(props) {
    super(props);
    this.rosePieRef = React.createRef(); // 创建玫瑰饼图ref
    this.state={}
  }

  componentDidMount(){
    const { cutPieData,colors,hasBorder,hasLegend,markType,centerData,hasClockWise,hasPercent } = this.props;
    if( JSON.stringify(cutPieData) !== "{}"
      &&(markType==="HOME_SUB_M" || markType === "HOME_QUERY_M")
    ){
      this.initCutPieChart(cutPieData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent);
    }
  }

  componentDidUpdate(prevProps){
    const { cutPieData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent} = this.props;
    // console.log("++++++++++++++++++++++")
    // console.log(cutPieData)
    // console.log(prevProps.cutPieData)
    if( JSON.stringify(cutPieData) !== "{}" && !isEqual(cutPieData,prevProps.cutPieData) ){
      // console.log("ssssssss")
      this.initCutPieChart(cutPieData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent);
    }
  }

  /*
  * 绘制折线图
  * */
  initCutPieChart=(cutPieData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent)=> {
    const myFontSzie=echartFontSize();
    const {isRosePie}=this.props;
    const rosePie = echarts.init(this.rosePieRef.current); // 初始化折线图所需dom
    const rosePieOption = {
      // title : {
      //   text: cutPieData.title,
      //   left: "center",
      //   top: 10,
      //   textStyle: {
      //     fontSize: myFontSzie.titleSize,
      //     color: "#333333", // 主标题文字颜色
      //     fontWeight: "normal",
      //     fontFamily: "Microsoft YaHei"
      //   }
      // },
      // backgroundColor: '#F7F7F7',
      tooltip: {
        trigger: 'item',
        // formatter: "{b} : {d}% <br/> {c}"+cutPieData.chart[0].unit,
        formatter(params) {
          // const useValue = self.cutNumber(params.data.value);
          return `${params.marker}${params.name}:${params.data.normalData}${params.data.normalData === '-' ? '' : params.data.unit}`;
        },
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      legend: {
        show:hasLegend||false,
        data: cutPieData.chartX,
        icon: 'rect',
        bottom: '5%',
        textStyle:{
          fontSize:myFontSzie.legendSize
        }
      },
      color: colors,
      series: [{
        type: 'pie',
        roseType: isRosePie?"radius":"",
        radius: [ isRosePie?"20%":'35%', '55%'],
        center: centerData, // 圆心位置
        clockwise:hasClockWise, // 是否顺时针分布
        itemStyle:{
          borderWidth: hasBorder?10:0,
          borderColor: "#FFFFFF"
        },
        data: this.createPieData(cutPieData.chartX,cutPieData.chart[0].value,cutPieData.chart[0].unit),
        labelLine: {
          show: true,
          length: 10,
          length2: 30,
          lineStyle: {
            width: 1
          }
        },
        label: {
          height: 70,
          fontSize: myFontSzie.pietextSize,
          align: 'center',
          // eslint-disable-next-line no-nested-ternary,no-unused-expressions
          formatter:(data) =>{
            const name= hasLegend?'':data.name+"\n";
            const percent= hasPercent?data.percent.toFixed(2)+"%":data.value;
            return name + percent
          }
        },
      }

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
   * 刻画饼图所需的数据格式类型
   * @param nameArray,名称数组
   * @param valueArray,值数组
   * @returns {XML},返回需要的数组格式
   */
    createPieData=(nameArray,valueArray,unit)=>{
      const pieData =[];
      valueArray.forEach((item,index)=>{
        pieData[index] = {
              "name":nameArray[index],
              "value": this.formatData(item),
              'normalData': item,
              'unit': unit,
         }
      });
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
    const {cutPieData,downloadData} = this.props;
    const {title,chartX,chart}=cutPieData;
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
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  render() {
    const {cutPieData,downloadData,titlePosition,totalList,noSubtitle} = this.props;
    const {echartId} = this.props;
    const myFontSize=echartFontSize();
    if (JSON.stringify(cutPieData) !== "{}") {
      return (
        <div className={styles.rosePieDiv} id={echartId}>
          {cutPieData&&cutPieData.title&&
          <div
            className={styles.titleDiv}
            style={{
              fontSize:myFontSize.titleSize,
              fontWeight:myFontSize.titleWeight,
              fontFamily:myFontSize.titleFamily,
              textAlign:titlePosition==='center'?'center':'left',
              marginLeft:titlePosition==='center'?0:5,
            }}
          >
            {cutPieData.title}
            {
              cutPieData&&cutPieData.subtitle&&!noSubtitle&&
              <Tooltip
                title={cutPieData.subtitle?cutPieData.subtitle:''}
                trigger='hover'
                placement='bottom'
                overlayClassName={styles.toolTip}
                // defaultVisible
              >
                <img
                  src={waSai}
                  alt=''
                  style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
                />
              </Tooltip>
            }
          </div>
          }
          <div ref={this.rosePieRef} className={styles.rosePieChart} />
          {totalList&&cutPieData&&cutPieData.totalList&&cutPieData.totalList.value!=="-"&&
            <div className={styles.totalList}>
              <div>{cutPieData.totalList.name}</div>
              <div>{cutPieData.totalList.value+cutPieData.totalList.unit}</div>
            </div>
          }
          {downloadData&&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
      )
    } else {
      return null;
    }
  }
}
export default RosePie;
