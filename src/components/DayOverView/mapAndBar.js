/* eslint-disable arrow-body-style,global-require,import/no-dynamic-require,prefer-template,no-else-return,react/no-array-index-key,no-unused-vars */
import React,{PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import { Icon,Tooltip } from 'antd'
import echarts from 'echarts';
import isEqual from 'lodash/isEqual';
import classNames from  'classnames';
import router from 'umi/router';
import styles from './mapAndBar.less';
import EarlyWarning from './earlyWarning';
import iconFont from '../../icon/Icons/iconfont';
import Cookie from '@/utils/cookie';
import {queryMapData}  from "@/services/dayOverView"

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

@connect(({dayOverViewHeader,billingRevenue,overviewIndexDetail})=>({
  date:dayOverViewHeader.selectedDate,
  tabId:dayOverViewHeader.tabId,
  dateType:dayOverViewHeader.dateType,
  mapAndBar:billingRevenue.mapAndBar,
  proId:billingRevenue.proId,
  proName:billingRevenue.proName,
}))
class MapAndBar extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      nationalData:[],
      showEarlyWarning:"",
      desc:"",
      warningLevel:"",
      GeoJson: {}
    }
    const {provOrCityId,provOrCityName} = Cookie.getCookie('loginStatus');
    // 初始化先赋值model里的省份和name
    props.dispatch({
      type:"billingRevenue/changeProv",
      payload:{
        proId:provOrCityId,
        proName:provOrCityName,
        selectProAndCity:{
          proId:provOrCityId,
          proName:provOrCityName,
          cityId: "-1",
          cityName:provOrCityName
        }
      }
    })
  }


  componentDidMount(){
    this.getMapData();
    const { date,tabId,dateType } = this.props;
    if(date !== "" && tabId !== ""&& dateType !== ""){
      this.initRequest();
    }
  }




  componentDidUpdate(prevProps,prevState){
    // 账期、切换标签变化去请求
    const { date,tabId,mapAndBar } = this.props;
    const {GeoJson} = this.state;
    if(prevProps.date !== date && tabId !== "" && date !== ""){
      this.initRequest();
    }
    if(JSON.stringify(GeoJson) !== "{}" && mapAndBar.nationalData !== undefined && !isEqual(prevProps.mapAndBar,mapAndBar)){
      // 处理数据
      this.handleData(mapAndBar);
    }
    // 优化地图请求返回慢这个报错 南海诸岛问题
    if(!isEqual(prevState.GeoJson, GeoJson) && !isEqual({},mapAndBar)  && isEqual(prevProps.mapAndBar,mapAndBar)){
      this.handleData(mapAndBar);
    }
  }
  /*
  获取注册地图所需的json串
   */

  getMapData(){
    const {provOrCityName} = Cookie.getCookie('loginStatus');
    const mapName = this.makeMatch(provOrCityName).replace(/(^\s*)|(\s*$)/g, ""); // 去除左右空格
    queryMapData({mapName}).then((data)=>{
        this.setState({
          GeoJson: data
        })
      }
    )}

  /*
  * 处理数据格式
  *
  * */
  handleData =(data) => {
    const { provinceData,nationalData,showEarlyWarning,desc,warningLevel } = data;
    if (
      JSON.stringify(data) !== "{}" &&
      provinceData !== undefined &&
      provinceData.length > 0
    ) {
      // 绘制地图用到的数据
      const dataMap = [];
      // 绘制柱状图用到的数据
      const dataBar = {};
      const xData = [];
      const yData = [];
      const newMonthErlier = [];
      provinceData.forEach((item,order) =>{
        const value = this.dataFormat(item.monthErlier);
        const valueMap = this.dataFormatMap(item.monthErlier);
        newMonthErlier.push(item.order);
        dataMap.push({
          order:item.order,
          name: item.name,
          value:item.order,
          proId: item.proId
        });
        xData.push(item.name);
        yData.push({
          value,
          proId: item.proId
        });
      });
      dataBar.xData = xData;
      dataBar.yData = yData;
      const mapBarData = {};
      mapBarData.dataBar = dataBar;
      mapBarData.dataMap = dataMap;
      this.drawEchart(mapBarData,newMonthErlier);
      this.setState({nationalData,showEarlyWarning,desc,warningLevel});
    }
  };

  /**
   * 数据格式化：去百分号
   * @param value
   * @returns {*}
   */
  dataFormatMap = (value)=>{
    if(value==='-'){
      return '0';
    }
    return value.replace(/%/g, "").replace(/,/g,'');
  };

  /**
   * 数据格式化：去百分号
   * @param value
   * @returns {*}
   */
  dataFormat = (value)=>{
    return value.replace(/%/g, "").replace(/,/g,'');
  };

  /*
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
   * 绘制地图绘制柱状图
   * @param
   */
  drawEchart = (data,newMonthErlier)=> {
    const {power,provOrCityId,provOrCityName} = Cookie.getCookie('loginStatus');
    const { mapAndBar:{provinceData},dispatch } = this.props;
    const powerName = power === "all" ? "全国" : "全省";
    // 各省份的数据
    const {dataMap,dataBar} = data;
    const mapName = this.makeMatch(provOrCityName).replace(/(^\s*)|(\s*$)/g, ""); // 去除左右空格
    const myMap = echarts.init(document.getElementById("map"));
    const myBar = echarts.init(document.getElementById("bar"));
    const hightLightLink = (params, mapOrBar, type) => {
      myMap.dispatchAction({
        type: "downplay",
        dataIndex: [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35
        ]
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
          type: "showTip",
          name: params.name
        });
        // 联动显示某省的数据
        const {nationalData} = this.state;
        const nationalDataNew = [];
        const {totalValue,monthErlier,yearErlier,proId,name,showEarlyWarning,desc,warningLevel} = provinceData[params.dataIndex];
        nationalData.forEach( (item,index) => {
          switch (index){
            case 0 :{
              nationalDataNew.push({name: item.name, value: totalValue});break;
            }
            case 1 :{
              nationalDataNew.push({name: item.name, value: monthErlier});break;
            }
            case 2 :{
              nationalDataNew.push({name: item.name, value: yearErlier});break;
            }
            default:break
          }
        });
        this.setState({
          nationalData: nationalDataNew,
          showEarlyWarning,
          desc,
          warningLevel
        });
        let selectProAndCity = {
          proId,
          proName:name,
          cityId: "-1",
          cityName:name
        };
        if(power !== "all"){
          selectProAndCity = {
            proId:provOrCityId,
            proName:provOrCityName,
            cityId: proId,
            cityName:name
          }
        }
        dispatch({
          type:"billingRevenue/changeProv",
          // payload:{proId,proName:name}
          payload:{
            proId,
            proName:name,
            selectProAndCity
          }
        })
      }
    };
    const {GeoJson} = this.state;
    echarts.registerMap(mapName, GeoJson); // 注册地图
    const options = {
      tooltip: {
        show: false,
        formatter:(params)=> {
          if (!params.value) {
            return "";
          }
          if (params.data) {
            return `${params.name}:${params.data.value}`;
          }
          return null;
        }
      },
      visualMap: {
        show: false,                   // 控制地图颜色根据设定做阶梯渲染
        calculable: false,
        max: Math.max.apply(null,newMonthErlier),
        min: Math.min.apply(null,newMonthErlier),
        color: ["#A7D3A6","#CFE6D1","#CAE3F5","#A9CFF2","#7FC6E6","#57ACE2"],
      },
      series: [
        {
          left:"3%",
          name: "MAP",
          type: "map",
          mapType: mapName,
          selectedMode: "false", // 是否允许选中多个区域
          itemStyle: {
            areaColor: "#404a59",
            borderColor: "#5e6267"
          },
          emphasis: {
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
          data: dataMap
        }
      ]
    };
    myMap.setOption(options);
    myMap.on("mouseover", (params)=> {
      if (!params.value) {
        // 判断是否是台湾或其他没有数据的省份
        myMap.dispatchAction({
          type: "downplay",
          name: params.name
        });
      } else {
        // hightlightLink(params, myMap, "on");
      }
    });
    myMap.on("mouseout", (param)=> {
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
    const barOptions = {
      tooltip: {
        trigger: "axis",
        show: true,
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            shadowColor: "#fff",
            shadowBlur: 5
          }
        },
        position: (point) => {
          return [point[0] + 20, "30%"];
        },
        formatter: (params)=> {
          hightLightLink(params[0], myBar, "on");
          const index = params[0].dataIndex + 1; // 省分排名
          const res = params[0].marker +
            params[0].name +
            "<br/>排名：" +
            index +
            "<br/>" +
            "日均环比：" +
            params[0].value +
            "%";
          return res;
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
      legend: {
        show: false,
        data: "."
      },
      grid: {
        top: 0,
        bottom: 55,
        left: 0,
        right: 40,
        borderWidth: 0 // 把背景边框的宽度设置为0，从而不显示边框
      },
      xAxis: {
        boundaryGap: true,
        data: dataBar.xData,
        axisLine: {
          show: true, // 显示x坐标轴线
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
          formatter: (xAxisData)=> {
            return xAxisData
              .substr(0, 4)
              .split("")
              .join("\n");
          } // 使x轴字体竖向显示
        }
      },
      yAxis: {
        type: "value",
        show: false,
        splitLine: {
          show: false // 不显示网格线
        }
      },
      series: {
        type: "bar",
        barWidth,
        emphasis: {
          itemStyle: {
            color: "#FDDD31"
          }
        },
        markLine: {
          show:false,
          symbol: "none",
          silent: true,
          label: {
            show: true,
            position: "end",
            formatter: ()=> {
              return powerName;
            }
          },
          lineStyle: {
            color: "#999999"
          },
          data: [{
            name:"平均值",
            type:"average"
          }]
        },
        data: dataBar.yData
      }
    };
    myBar.setOption(barOptions);
  };

  // 返回全国
  backChinaHandle=()=> {
    const {provOrCityId,provOrCityName} = Cookie.getCookie('loginStatus');
    const {mapAndBar:{nationalData,showEarlyWarning,warningLevel,desc},dispatch} = this.props;
    this.setState({
      nationalData,
      showEarlyWarning,
      warningLevel,
      desc
    });
    const myMap = echarts.init(document.getElementById('map'));
    myMap.dispatchAction({
      type: "downplay"
    });
    dispatch({
      type:"billingRevenue/changeProv",
      payload:{
        proId:provOrCityId,
        proName:provOrCityName,
        selectProAndCity:{
          proId:provOrCityId,
          proName:provOrCityName,
          cityId: "-1",
          cityName:provOrCityName
        }
      }
    })
  };

  ratioDataColor =(data)=>{
    let color;
    if(data === '-'){
      // 正常灰色
      color =  'dataBlank';
    }else{
      const res = data.replace(/,/g,"");
      color = parseFloat(res)>=0?'dateGreen':'dataRed';
    }
    return color;
  };

  initRequest =()=>{
    const { dispatch,date,tabId,dateType} = this.props;
    dispatch({
      type:"billingRevenue/fetchMapAndBar",
      payload:{
        date,
        tabId,
        dateType
      }
    });
  };




  /**
   * 弹出层
   * @param kpiCode
   */
  popUpShow = (kpiCode) =>{
    const {dispatch,proId,proName} = this.props;
    dispatch({
      type:"overviewIndexDetail/setKpiCode",
      payload:kpiCode
    });
    // dispatch({
    //   type:"proCityModels/setSelectData",
    //   payload:{
    //     selectPro:{
    //       proId,
    //       proName
    //     },
    //     selectCity: {
    //       cityId: "-1",
    //       cityName: proName
    //     },
    //     selectIndex:"",
    //   }
    // });
    dispatch({
      type:"overviewIndexDetail/setPopUpShow",
      payload:true
    });
  }

  /**
   * 跳转到新专题页面
   */
  goToThemePage(){
    const {date,dispatch} = this.props;
    // router.push({
    //   pathname: '/themeAnalysis',
    //   state: {
    //     date
    //   }
    // })
    dispatch({
      type:'cityLine/fetchSpecialAuthentication',
      payload:{
        specialId: "subject_basic_total"
      }
    }).then((res)=>{
      if (res.haveAuthority === "true"){
        router.push({
          pathname: '/themeAnalysis',
          date,
        })
      } else {
        alert("本用户没有访问该专题权限！")
      }
    })
  };

  render(){
    const {power} = Cookie.getCookie('loginStatus');
    const {mapAndBar,mapAndBar:{unit,titleData,showException,excepDiscription,kpiCode}} = this.props;
    const {nationalData,warningLevel,showEarlyWarning,desc} = this.state;
    const {tabId} = this.props;
    let widthDiv;
    let isShow;
    if (tabId !== "TAB_101"){
      widthDiv = "100%";
      isShow = "none";
    }
    if (
      JSON.stringify(mapAndBar) !== "{}" &&
      nationalData !== undefined
    ){
      const nationalDom = nationalData.map((data, index) => {
        if (index === 0) {
          // const showEarlyWarning = "1";
          // const desc = "测试测试测试测试测试测试测试测试测试";
          // const warningLevel = "一级";
          const warning = showEarlyWarning === "0" || showEarlyWarning === undefined ?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
          const totalValue = showEarlyWarning === "0"|| showEarlyWarning === undefined?
            <span className={classNames(styles.totalValue,styles.totalValueRight)}>{data.value}</span>:
            <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
              <span className={styles.totalValue}>{data.value}</span>
              <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
            </Tooltip>

          return (
            <div key={"national"+index} className={styles.dataTop}>
              <div className={styles.totalName}>{data.name}</div>
              {totalValue}
              <span className={styles.unit}>{unit}</span>
            </div>
          );
        } else {
          const valueColor = this.ratioDataColor(data.value);
          return (
            <div key={"national"+index} className={styles.dataBottom}>
              <div className={styles.name}>{data.name}</div>
              <span className={classNames(styles.value,styles[valueColor])}>{data.value}</span>
            </div>
          );
        }
      });
      const powerName = power === "all" ? "返回全国" : "返回全省";
      const exception = showException === "0" || showException=== undefined? null : <Tooltip placement="bottomLeft" title={excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}><Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} /></Tooltip>;
      return (
        <Fragment>
          <div className={styles.containerTop} style={{width:widthDiv}}>
            <div className={styles.text}>
              <div className={styles.title}>
                <span className={styles.titleData} onClick={()=>{this.popUpShow(kpiCode)}}>
                  {exception}
                  {titleData}
                </span>
              </div>
              {nationalDom}
            </div>
            <div className={styles.map} id="map" />
            <div className={styles.backChina} onClick={this.backChinaHandle}>
              <IconFont className={styles.backImg} type="icon-fanhuianniu" />
              <span className={styles.backName}>{powerName}</span>
            </div>
          </div>
          <div className={styles.bar} id="bar" style={{width:widthDiv}} />
          <div className={styles.fenxi} style={{display:isShow}}>
            <div className={styles.fenxiSpann} onClick={()=>this.goToThemePage()}>计费收入分析专题&gt;&gt;</div>
          </div>
        </Fragment>
      )
    }else{
        return null;
    }
  }
}
export default MapAndBar;
