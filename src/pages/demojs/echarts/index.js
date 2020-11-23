import React from 'react';
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar"
import "echarts/lib/chart/line"
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { connect } from 'dva';

@connect(
  (
    {clothingModels}
  )=>(
    {
      clothingdata:clothingModels.clothingdata

    }
  )
)
class Echarts extends React.PureComponent {


  constructor(porps) {
    super(porps);
    this.mainstyle= React.createRef();
    if (porps.style){
      this.changestyle();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.style){
      this.changestyle();
    }else {
      this.recoverestyle();

    }
    this.initmychart();
  }

  // 修改样式
  changestyle=()=>{
    this.mainstyle.current.style.cssText=`background:pink`
    console.log(this.props);
  }

  recoverestyle=()=>{
    this.mainstyle.current.style.cssText=``
  }

  // eslint-disable-next-line react/sort-comp
    componentDidMount() {
      const {dispatch} =this.props;
      dispatch({
        type:`clothingModels/fetchModuleClothing`,
        payload:{
          id:"2"
        }
      })
      this.initmychart();
    }


  initmychart=()=>{
    const {clothingdata}=this.props;
    console.log("clothingdata",clothingdata);
    const MyChart =echarts.init(document.getElementById("main"))
    MyChart.setOption({
      tooltip:{},
      legend:{
        data:['销量']
      },
      xAxis:{
        data:clothingdata.map(ele=>ele.name)
      },
      yAxis:{},
      series:[  {
        name:'百分比',
        type:'line',
        data:clothingdata.map(ele=>ele.num+10),
        itemStyle:{


         color(params) {

            // build a color map as your need.

            const colorList = [

              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',

              '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',

              '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'

            ];

            return colorList[params.dataIndex]

          },

          label: {

            show: true,

            position: 'top',

//                             formatter: '{c}'

            formatter: '{b}\n{c}'

          }

        }

      },{
        name:'销量',
        barWidth:46,
        type:'bar',
        data:clothingdata.map(ele=>ele.num),

      },

      ]

    });
  }

    render() {
      const {clothingdata}=this.props;
      const div=  <div id="main" style={{width:400,height:400}} ref={this.mainstyle} />;
      return (
        // eslint-disable-next-line react/destructuring-assignment
        <div onClick={this.props.changeback}>
          {clothingdata?div:''}

          {/* eslint-disable-next-line react/button-has-type */}
        </div>
        );
    }
}
export default Echarts;
