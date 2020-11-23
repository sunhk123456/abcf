/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: percentBar/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/3/1/001
 */
import React, {PureComponent} from "react"
import echarts from "echarts"
import styles from "./percentBar.less"

class PercentBar extends PureComponent{

  constructor(props){
    super(props)
    this.state={
    }
  }


componentDidMount(){
  const {BarData,title}=this.props
  this.setBar(title,BarData.detail)
}

  componentWillReceiveProps(nextProps) {
    const {BarData,title}=nextProps
    this.setBar(title,BarData.detail)
  }

// echarts柱状图
  setBar=(title,barData)=>{
    const xData = []
    const yData = []; // x,y轴数据
    barData.map((item)=>{
      xData.push(item.prov);
      yData.push(parseFloat(item.items[2]));
      return xData
    });
    let yMax = 100
    let splitNum = 20;  // max用来设置阴影长度，yMax和splitNum用来设置y轴分割段数
    for(let i=0;i<yData.length;i+=1){
      if(yData[i]>yMax){
        yMax = Math.ceil(yData[i]/10)*10;
      }
    }
    if(yMax>100 && yMax<150){
      splitNum = 15;
    }else if(yMax>250 && yMax<300){
      splitNum = 15;
    }else if(yMax>0 && yMax<=50){
      splitNum = 20;
    }else if(yMax>50 && yMax<=100){
      splitNum = 20;
    }

    const bar = echarts.init(document.getElementById("bar"));
    const dataShadow=[]; // 柱状图阴影数据
    for(let j=0;j<yData.length;j+=1){
      let shadowMax = 100;
      if (yData[j]<0){
        shadowMax = -100;
      }
      const shadow = {value:shadowMax,tooltip:{show:false}};
      dataShadow.push(shadow);
    }
    const yNum=yData.map((el) =>{
      if(el===""){
        return "-"
      }
        return  el
    });
    const sw= window.screen.width;
    let fontsize;
    let legendX=850;
    let legendSize=14;
    if((sw>=700)&&(sw<961)) {
      fontsize=15;
      legendX=500;
      legendSize=12;
    }else if((sw>=962)&&(sw<1100)){
      fontsize=18;
      legendX=650;
      legendSize=12;
    }else if((sw>=1000)&&(sw<1316)){
      fontsize=18;
      legendX=800;
      legendSize=12;
    }else if((sw>=1316)&&(sw<1438)){
      fontsize=20;
    }else if((sw>=1390)&&(sw<1869)){
      fontsize=22;
    }else if((sw>=1870)){
      fontsize=24;
    }
    const option = {
      title : {
        text: title,
        x:'center',
        textStyle:{
          color:'#495667',
          fontFamily:'Microsoft YaHei',
          fontSize:fontsize,
          fontWeight:400,
          fontStyle:'normal'
        }
      },
      tooltip : {
        trigger: 'axis',
        formatter: '完成率：{c}%',
        position: (point)=>[point[0]-70, point[1]-40],
        textStyle:{
          fontFamily: 'Microsoft YaHei',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: 10
        },
        axisPointer:{
          type:"line",
          lineStyle:{
            color:"#32495a",
            width: 1,
            type:"solid"
          }
        }
      },
      legend: {
        x:legendX,
        textStyle:{
          fontFamily: 'Microsoft YaHei',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: legendSize,
          color: '#96A0AC'
        },
        selectedMode:false,
        data:['完成率']
      },
      grid:{
        y2:80,
        borderWidth:0
      },
      xAxis : [
        {
          type : 'category',
          axisTick:{
            show:false
          },
          axisLine:{
            show:true,
            lineStyle:{
              color:'#0F0F0F',
              width:1
            }
          },
          // splitLine:{
          //     show:false
          // },
          // splitArea:{
          //     show:false
          // },
          axisLabel:{
            interval:0,
            formatter:(xAxisData)=>xAxisData.split("").join("\n")// 使x轴字体竖向显示
          },
          data:xData,

        }
      ],
      yAxis : [
        {
          type : 'value',
          splitNumber:splitNum,
          axisLabel : {
            formatter: '{value}%'
          },
          axisLine:{
            show:true,
            lineStyle:{
              // red:'#0F0F0F',
              width:1
            }
          },
          splitLine:{
            show:false
          },
          // symbolPosition:'center',
          // splitArea:{
          //     show:false
          // },
          z:4,
          axisTick:{
            show:false,
            // length:splitNum
            //     // inside:true,
            //     // length:900,
            //     lineStyle:{
            //         red:'#FFFFFF',
            //         width:3
            //     }
          }
        }
      ],
      series : [
        {
          name:'完成率',
          type:'pictorialBar',
          barGap:'-100%',
          symbol:'rect',
          symbolRepeat: true,
          symbolClip:true,
          symbolSize:['100%','80%'],
          z:3,
          data:yNum,
          itemStyle: {
            normal: {color: '#7cb7e0'},
            emphasis:{color:'#7cb7e0'}
          },
        },
        { // For shadow
          name:'阴影',
          type: 'pictorialBar',
          symbol:'rect',
          symbolRepeat: true,
          symbolClip:true,
          symbolSize:['100%','80%'],
          itemStyle: {
            normal: {color: 'rgba(0,0,0,0.05)'},
            emphasis:{color:'rgba(0,0,0,0)'}
          },
          data:dataShadow,
          animation: false
        }
      ]
    };

    bar.setOption(option);


  }

  render(){
    return(
      <div>
        <div id="bar" className={styles.myBar} />
      </div>
    )
  }

}

export default PercentBar
