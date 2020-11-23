/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 地图柱状图混合使用方法请参照政企楼宇页面 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: liutong
 * @date: 2019/11/29
 */
import React, { PureComponent } from 'react';
import echarts from 'echarts';
import styles from './buildingMap.less';
import Cookie from '@/utils/cookie';
import FontSizeEchart from '../ProductView/fontSizeEchart';

class BuildingMap extends PureComponent {
  /**
   * 初始化state，声明ref，绑定方法
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.ref = React.createRef(); // 创建ref
  }

  /**
   *组件加载时不调用，组件更新完成后调用
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    const {mapData,provName,GeoJson} = this.props;
    // 地图数据变化逻辑
    if(prevProps.mapData!== undefined && prevProps.mapData !== mapData&& provName!==undefined){
      if(provName!==''&&prevProps.provName!== provName){
        const mapName=mapData.power==='specialCity'?'全国':provName;
          this.getMapData(mapName)
      }else if ( mapData.mapData.length===0||provName===''){
          this.clearMap(); // 若返回的数据中无省分数据，则将地图清除
        }else {
          this.handleData(mapData,GeoJson) // echarts 地图未变则仅处理数据不用重新请求地图
        }
    }
    // echarts地图轮廓变化逻辑
    if(JSON.stringify(GeoJson)!=='{}'){
      if ( mapData.mapData.length===0){
        this.clearMap();
      }else {
        this.handleData(mapData,GeoJson)
      }
    }
  }

  /**
   *组件卸载时将echarts图清除
   * @param prevProps
   */
  componentWillUnmount() {
    this.clearMap();
  }

  /**
   * 获取注册地图所需的json串
   */
  getMapData(name){
    const {changeMap} = this.props
    const mapName = this.makeMatch(name).replace(/(^\s*)|(\s*$)/g, ""); // 去除左右空格
    changeMap(mapName);
    }

  /**
   * 将地图清空
   */
  clearMap=()=>{
    const {containId} = this.props;
    const myMap = echarts.init(document.getElementById(`${containId}Map`));
    const myBar = echarts.init(document.getElementById(`${containId}Bar`));
    myMap.clear();
    myBar.clear();
  }

  /**
   * 绘制地图绘制柱状图
   * @param
   */
  drawEchart = (data,allValue,GeoJson)=> {
    const {provName,containId,changeColor} = this.props;
    const {dataMap,dataBar} = data;
    const maxData = Math.max.apply(null,allValue);
    const mindata = Math.min.apply(null,allValue)
    const minData = (maxData===mindata&&maxData!==0)?maxData/2:mindata; // 若最大值与最小值相同，设置最小值为最大值的一半
    const mapName = this.makeMatch(provName).replace(/(^\s*)|(\s*$)/g, ""); // 去除左右空格
    const myMap = echarts.init(document.getElementById(`${containId}Map`));
    const myBar = echarts.init(document.getElementById(`${containId}Bar`));
    myMap.clear(); // 渲染新的echarts图前将原有的图清除掉
    // echarts 图表的触发的事件
    const hightLightLink = (params, mapOrBar, type) => {
      myMap.dispatchAction({
        type: "downplay",
      });
      if (type === "on") {
        myMap.dispatchAction({
          type: "highlight",
          name: params.name
        });
        myBar.dispatchAction({
          type: "highlight",
          name: params.name
        });
        myMap.dispatchAction({
          type: 'showTip',
          name: params.name,
        });
      }
    };
    echarts.registerMap(mapName,GeoJson); // 注册地图
    let colorList;
    if(changeColor){
      // colorList=["#A7D3A6","#57ACE2","#A9CFF2","#E35F65","#fbdb57"]
      colorList=[
        "#b8df4c",
        "#dcbf26",
        "#D2D284",
        "#A7D3A6",
        "#CFE6D1",
        "#CAE3F5",
        "#A9CFF2",
        "#7FC6E6",
        "#4abec2",
        "#57ACE2",
        "#578CC1",
        ]
    }else {
      colorList=["#57ACE2","#7FC6E6","#A9CFF2","#CAE3F5","#CFE6D1","#A7D3A6"]
    }
    // 设置地图参数
    const options = {
      tooltip: {
        trigger:'item',
        show: true,
        formatter:(params)=> {
          if (!params.value&&params.value!==0) { // 若地图所触发的模块无数据则不不展示图例信息
            return "";
          }
          if (params.data) {
            const res = `${params.marker +
              params.name
              }<br/>` +
              `排名为：${
                params.data.ord
              }<br/>`+
              `数值为：${
                params.data.showValue}`;
            return res
          }
          return null;
        }
      },
      visualMap: {
        show: true,                   // 控制地图颜色根据设定做阶梯渲染
        calculable: true,
        max: maxData,
        min: minData,
        color: colorList,
      },
      series: [
        {
          layoutSize:'98%',
          name: "MAP",
          type: "map",
          mapType: mapName,
          selectedMode: "false", // 是否允许选中多个区域
          label:{
            show:true,
            color:"#404a59"
          },
          itemStyle: {
            areaColor: "#C9C9C9", // 无数据时的颜色
            borderColor: "#5e6267"
          },
          emphasis: { // 高亮状态下展示样式
            itemStyle: {
              borderWidth: 2,
              borderColor: "#BBC2C4",
              areaColor: "#fbdb57"
            },
            label: {
              shadowColor: "#BBC2C4", // 默认透明
              show: true
            }
          },
          data: dataMap,
        }
      ]
    };
    myMap.setOption(options,true);
    myMap.on("mouseover", (params)=> {
      if (!params.value&&params.value!==0) {
        // 判断是否是台湾或其他没有数据的省份
        myMap.dispatchAction({
          type: "downplay",
          name: params.name
        });
      } else {
        // hightLightLink(params, myMap, "on");
      }
    });
    // 鼠标移出柱状图，则地图上所有高亮消失
    myBar.on("globalout", (param)=> {
      if (!param.value) {
        // 判断是否是台湾或其他没有数据的省份
        myMap.dispatchAction({
          type: "downplay",
          name: param.name
        });
      } else {
        hightLightLink(param, myMap, "off");
      }
    });
    myMap.off('click');// 去掉上次的点击事件，防止多次点击
    myMap.on("click", (param)=> {
      if (!param.value) {
        // 判断是否是台湾或其他没有数据的省份
        myMap.dispatchAction({
          type: "downplay",
          name: param.name
        });
      } else{
        myMap.dispatchAction({
          type: 'hideTip',
          name: param.name,
        });
        const {provId,cityId} = this.props;
        // 点击逻辑，若为全国地图则请求省分数据，若为省分地图则请求地市数据
        if(provName==="全国") {
          if(param.data!==undefined&&param.data.provId!==provId){
            const { callback } = this.props;
            const params = {
              provId: param.data.provId,
              provName: param.data.name,
              cityId: '',
              cityName: '',
            }
            callback(params);
          }
        }else {
          if(param.data.provId!==cityId){
            const { callback } = this.props;
            const params = {
              provId,
              provName,
              cityId: param.data.provId,
              cityName: param.data.name,
            }
            callback(params);
          }
          hightLightLink(param, myMap, "off");
          myMap.dispatchAction({
            type: "highlight",
            name: param.name
          });

        }
      }
    });
    // 柱子的宽度、x轴坐标label字体大小
    const sw = window.screen.width;
    let barWidth = 13;
    if(sw <= 1200){
      barWidth = 8;
    }
    let fontSize = 12;
    if(sw <= 1000){
      fontSize = 10;
    }
    // 设置柱形图的参数
    const barOptions = {
      tooltip: {
        trigger: "axis",
        show: true,
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            opacity:0.3
          }
        },
        position: (point) => [point[0] + 20, "5%"],
        formatter: (params)=> {
          hightLightLink(params[0], myBar, "on");
          return null;
        }
      },
      backgroundColor: '#F7F8FC',
      visualMap: {
        show: false,
        splitNumber: 2,
        pieces: [
          {max: 0},
          {min: 0}
        ],
        color: ["#5CACE0", "#A6D2A4"]
      },
      grid: {
        containLabel:true,
        top: '30%',
        bottom: '1%',
        left: 'left',
        right: 70,
        borderWidth: 0 // 把背景边框的宽度设置为0，从而不显示边框
      },
      yAxis: {
        boundaryGap: true,
        data: dataBar.xData,// 由大到小
        axisLine: {
          show: false, // 显示y坐标轴线
          lineStyle: {
            color: "#999999"
          }
        },
        axisTick: {
          show: false // 不显示x轴分割线
        },
        splitLine: {
          show: false // 不显示网格线
        },
        axisLabel: {
          interval: 0, // x轴标注全部显示
          margin: 3,
          textStyle: {
            fontSize
          },
          formatter: (yAxisData,index)=> `${dataBar.showData.length-index}.${dataBar.showData[index]}` // 展示各地域的排名
        }
      },
      xAxis: {
        type: "value",
        show: false,
        splitLine: {
          show: false // 不显示网格线
        }
      },
      series: {
        type: "bar",
        barWidth,
        label:{
          show:true,
          position:'right',
          formatter:(item)=>item.data.showValue,
          textStyle:{
            color:'#999999',
            fontSize
          }
        },
        emphasis: {
          itemStyle: {
            color: "#FDDD31"
          }
        },
        data: dataBar.yData,
        itemStyle:{
          barBorderRadius:5
        }
      }
    };
    myBar.setOption(barOptions);
  };

  /**
   * 对数据地图的处理
   * @param data
   * @param GeoJson
   */
  handleData =(data,GeoJson) => {
    const { mapData,provName} = data;
    if (
      JSON.stringify(data) !== "{}" &&
      provName!== undefined &&
      mapData.length > 0
    ) {
      // 绘制地图用到的数据
      const dataMap = [];
      // 绘制柱状图用到的数据
      const dataBar = {};
      const xData = [];
      const yData = [];
      // 柱状图要展示的名称
      const showData = [];
      const allValue= [];
      mapData.forEach((item,order) =>{
        if(item.value!=='-'){
          const value = this.dataFormat(item.value);
          const valueMap = this.dataFormatMap(item.value);
          allValue.push(valueMap);
          dataMap.push({
            ord:order+1,
            name: item.name,
            showValue:item.value,
            value:valueMap,
            provId: item.id
          });
          // 柱形图仅取top10，按照顺序放到数组中
          if(order<10){
            xData.unshift(item.name);
            showData.unshift(item.showName);
            yData.unshift({
              value,
              provId: item.id,
              showValue:item.value
            });
          }
        }
      });
      dataBar.xData = xData;
      dataBar.yData = yData;
      dataBar.showData = showData;
      const mapBarData = {};
      mapBarData.dataBar = dataBar;
      mapBarData.dataMap = dataMap;
      this.drawEchart(mapBarData,allValue,GeoJson);
    }
  };

  /**
   * 数据格式化：去掉逗号，数据格式
   * @param value
   * @returns {*}
   */
  dataFormatMap = (value)=>{
    if(value==='-'){
      return '0';
    }
    return value.replace(/,/g,'');
  };

  /**
   * 数据格式化：去逗号，数据格式化
   * @param value
   * @returns {*}
   */
  dataFormat = (value)=>value.replace(/,/g,'');

  /**
   工具函数，省份汉字转换拼音
   str表示,输入的省份汉字
   */
  makeMatch = (str)=> {
    let pName = "";
    switch (str) {
      case "全国":
        pName = "china";
        break;
      case "安徽":
        pName = "anhui";
        break;
      case "北京":
        pName = "beijing";
        break;
      case "重庆":
        pName = "chongqing";
        break;
      case "福建":
        pName = "fujian";
        break;
      case "甘肃":
        pName = "gansu";
        break;
      case "广东":
        pName = "guangdong";
        break;
      case "广西":
        pName = "guangxi";
        break;
      case "贵州":
        pName = "guizhou";
        break;
      case "海南":
        pName = "hainan";
        break;
      case "河北":
        pName = "hebei";
        break;
      case "黑龙江":
        pName = "heilongjiang";
        break;
      case "河南":
        pName = "henan";
        break;
      case "湖北":
        pName = "hubei";
        break;
      case "湖南":
        pName = "hunan";
        break;
      case "江苏":
        pName = "jiangsu";
        break;
      case "江西":
        pName = "jiangxi";
        break;
      case "吉林":
        pName = "jilin";
        break;
      case "辽宁":
        pName = "liaoning";
        break;
      case "内蒙古":
        pName = "neimenggu";
        break;
      case "宁夏":
        pName = "ningxia";
        break;
      case "青海":
        pName = "qinghai";
        break;
      case "山西":
        pName = "shanxi";
        break;
      case "山东":
        pName = "shandong";
        break;
      case "上海":
        pName = "shanghai";
        break;
      case "陕西":
        pName = "shanxi1";
        break;
      case "四川":
        pName = "sichuan";
        break;
      case "天津":
        pName = "tianjin";
        break;
      case "新疆":
        pName = "xinjiang";
        break;
      case "西藏":
        pName = "xizang";
        break;
      case "云南":
        pName = "yunnan";
        break;
      case "浙江":
        pName = "zhejiang";
        break;
      case "香港":
        pName = "xianggang";
        break;
      case "澳门":
        pName = "aomen";
        break;
      case "台湾":
        pName = "taiwan";
        break;
      case "南海":
        pName = "nanhai";
        break;
      default:
        pName = "china";
        break;
    }
    return pName;
  };

  /**
   * 返回上一级
   * @param showProv
   * @param showId
   */
  reservePro = (showProv,showId)=> {
    if(showProv!==''&&showId!==''){
      const {callback} = this.props;
      const params = {
        provId: showId,
        provName: showProv,
        cityId: '',
        cityName: '',
      }
      callback(params);
    }
  }

  changeInd = ()=>{
    const {changeIndex} = this.props;
    changeIndex();
  }

  render() {
    const {provOrCityId,power} = Cookie.getCookie('loginStatus');
    const fontsize = FontSizeEchart();
    const { titleSize } = fontsize;
    const { provName,provId,mapData,cityName,hasButton,containId} = this.props;
    const {title,allValue,unit} = mapData;
    const allName = mapData.power==="city"?cityName:provName;
    let proNameItem; // 全国，省分，地市切换组件
    if(provOrCityId==="111"&&mapData.power==='city'){
       proNameItem =
         <div className={styles.changeMark} style={{fontSize:`${titleSize}px`}}>
           <span className={styles.china} onClick={() => this.reservePro("全国", "111")}>中国</span>
           <span className={styles.china}>&gt;</span>
           <span className={styles.china} onClick={() => this.reservePro(provName, provId)}>{provName}</span>
           <span className={styles.china}>&gt;</span>
           <span className={styles.prov}>{cityName}</span>
         </div>;
    }else if(provOrCityId==="111"&&(mapData.power==='prov'||mapData.power==='specialCity')){
       proNameItem =
         <div className={styles.changeMark} style={{fontSize:`${titleSize}px`}}>
           <span className={styles.china} onClick={() => this.reservePro("全国", "111")}>中国</span>
           <span className={styles.china}>&gt;</span>
           <span className={styles.prov}>{provName}</span>
         </div>;
    }else if(power==='prov'&&mapData.power==='city'){
      proNameItem =
        <div className={styles.changeMark} style={{fontSize:`${titleSize}px`}}>
          <span className={styles.china} onClick={() => this.reservePro(provName, provId)}>{provName}</span>
          <span className={styles.china}>&gt;</span>
          <span className={styles.prov}>{cityName}</span>
        </div>;
    }else{
       proNameItem = null;
    }
      const hasChange = hasButton==='1'?<span className={styles.changeButton} style={{fontSize:`${titleSize}px`}} onClick={this.changeInd}>[切换]</span>:null;
    return (
      <div className={styles.outer}>
        {proNameItem}
        <div className={styles.title} style={{fontSize:`${titleSize}px`}}>
          <span>{title}</span>
          {hasChange}
        </div>
        <div className={styles.allShow} style={{fontSize:`${titleSize}px`}}>
          <span>{allName}</span>
          <div>
            <span className={styles.allValue}>{allValue}</span>
            <span className={styles.unit}>{unit}</span>
          </div>
        </div>
        <div className={styles.map} id={`${containId}Map`} />
        <div className={styles.bar} id={`${containId}Bar`} />
      </div>
    );
  }
}

export default BuildingMap;
