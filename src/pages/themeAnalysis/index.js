/**
 *
 * title: productFeatures.js
 *
 * description: 移动业务计费收入分析专题
 *
 * author: xingxiaodong
 *
 * date 2019/3/14
 *
 */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Icon,DatePicker } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './index.less';
import IndexScreen from '../../components/themeAnalysis/indexScreen';
import AnalysisChart from '../../components/themeAnalysis/analysisChart';
import AnalysisTimeChart from '../../components/themeAnalysis/timeChart';
import AnalysisAreaChart from '../../components/themeAnalysis/areaChart';
import AnalysisTable from '../../components/themeAnalysis/analysisTable';
import IndexExplain from '../../components/Common/indexExplainPop'
import Cookie from '@/utils/cookie';
import CollectComponent from '../../components/myCollection/collectComponent'
// import BackTopComponent from '../../components/Common/backTop'


@connect(
  ({
     themeAnalysisModels,
     loading
   }) => ({
    themeAnalysisModels,
    loading
  })
)
class ThemeAnalysis extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      title:"移动业务计费收入分析专题",
      iconIssueContent:false,
      iconExplainContent:false,
      showIndexExplain:false,
      indexType: [
        {"id": "001", "name": "计费收入"},
        {"id": "002", "name": "净增计费收入"},
      ],// 指标类型
      indexTypeIdAndName: {
        name: "计费收入",
        id: "001",
      },// 记录选中的指标类型的 id name

      date:null,
      maxDate:null,
      proId:'' ,
      selectPro:'',// 省份Id
      selectCityId:"",// 地市Id
      titleNamePro:"",
      titleNameCity:"",
      isClick:"0",
      anaIndex:"0",// 省份趋势图点击的是第几个数据地市
      anClick:"",// 点击第几次
      citySelect:"",// 用于传参
      numX: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      numXs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],

      peopleId:'',// 用户群点击的某个数据的id
      peopleName:'',
      incomeId:'',// 费用项点击的某个数据的id
      incomeName:'',
      productId:'',// 产品结构点击的某个数据的id\
      productName:'',
      channelId:'',// 渠道结构点击的某个数据的id
      channelName:'',
      businessId:'',// 业务结构点击的某个数据的id
      businessName:'',
      selectType:[],
      contentProvince:null,
      contentCity:null,
      contentPeople:null,
      contentIncome:null,
      contentProduct:null,
      contentChannel:null,
      contentBusiness:null,
      time:30, // 时间分布
    }
  }


  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {themeAnalysisModels}=nextProps;
    const {maxDate}=themeAnalysisModels;
    if (maxDate && !prevState.maxDate && maxDate.date !== prevState.maxDate) {
      return {
        maxDate:maxDate.date,
        selectPro:maxDate.selectProId ,
        selectCityId:maxDate.selectCityId,
      };
    }
    return null;
  }

  componentDidMount() {
    const {location}=this.props;
    const {power} = Cookie.getCookie('loginStatus');
    // var loginStatus=Cookie.get("loginStatus");
    if(power !== "all"){
     this.setState({
       isClick:"1",
     })
    }
    // console.log("location")
    // console.log(location)
    const {date}=location;
    if(date){
        this.setState({
          "date":date
        },()=>{
          const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
          this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
        })
    }
    this.getMaxDate();
    const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
  }

  componentDidUpdate(prevProps, prevState) {
    const {time,date,indexTypeIdAndName,selectPro,selectCityId}=this.state;
    if(date!== prevState.date){
      // console.log("日期改变重新发请求")
      this.getChartData(indexTypeIdAndName.id,date,selectPro,selectCityId,'','','','','');
      this.getAreaData(indexTypeIdAndName.id,date,selectPro,'','','','','');
      this.getTimeData(indexTypeIdAndName.id,time,date,selectPro,selectCityId,'','','','','');
      this.getTableData(indexTypeIdAndName.id,date,selectPro,selectCityId,[])
    }
    if(indexTypeIdAndName.id !== prevState.indexTypeIdAndName.id){
      this.getChartData(indexTypeIdAndName.id,date,selectPro,selectCityId,'','','','','');
      this.getAreaData(indexTypeIdAndName.id,date,selectPro,'','','','','');
      this.getTimeData(indexTypeIdAndName.id,time,date,selectPro,selectCityId,'','','','','');
      this.getTableData(indexTypeIdAndName.id,date,selectPro,selectCityId,[])
    }
  }

  //  指标解释按钮被点击
indexExplain=()=>{
  // console.log("指标解释按钮被点击");
  this.setState({
    showIndexExplain:true
  })
};

// 指标解释回调，关闭弹窗
callbackCloseIndexExplain=()=>{
  // console.log("指标解释回调");
  this.setState({
    showIndexExplain:false,
  })
};

  //  鼠标移入指标Icon
  mouseOverIconIndex=()=>{
    this.setState({
      iconExplainContent:true,
    })

  };

  //  鼠标移出指标Icon
  mouseLeaveIconIndex=()=>{
    this.setState({
      iconExplainContent:false,
    })
  };

  //  鼠标移入问号Icon
  mouseOverIconIssue=()=>{
    this.setState({
      iconIssueContent:true,
    })

  };

  //  鼠标移出问号Icon
  mouseLeaveIconIssue=()=>{
    this.setState({
      iconIssueContent:false,
    })
  };

  // 观察指标回调
  callBackIndexScreen=(data)=>{
    const{indexTypeIdAndName}=this.state;
    const {power} = Cookie.getCookie('loginStatus');
    let isclick = "0";
    if(power !== "all"){
      isclick = "1"
    }
    if(indexTypeIdAndName.name!==data.name){
      this.setState({
        indexTypeIdAndName: {
          name: data.name,
          id:data.id,
        },// 记录选中的指标类型的 id name
        peopleId:'',
        incomeId:'',
        productId:'',
        channelId:'',
        businessId:'',
        contentProvince:false,
        contentCity:null,
        contentPeople:null,
        contentIncome:null,
        contentProduct:null,
        contentChannel:null,
        contentBusiness:null,
        isClick:isclick,
        anaIndex:"0",
        citySelect:'',
        selectType:[],
        time:"30",
        proId:'' ,
        selectPro:'111',// 省份Id
        selectCityId:"",// 地市Id
        titleNamePro:"",
        titleNameCity:"",
        anClick:"",// 点击第几次
      },()=>{
        const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
        this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
      })
    }
  };

  // 日期改变功能
  onChangeDate=(date, dateString)=>{
    this.setState({
      date:dateString
    })
  };

  // 设置最大账期
  disabledEndDate=(current)=>{
    const {maxDate}=this.state;
    return current && current > moment(maxDate).valueOf();
  };

  // 重置
  reset=()=>{
   // console.log("重置")

    const {power} = Cookie.getCookie('loginStatus');
   // var loginStatus=Cookie.get("loginStatus");
    let isclick = "0";
    if(power !== "all"){
      isclick = "1"
    }
    this.setState({
      indexTypeIdAndName: {
        name: "计费收入",
        id: "001",
      },// 记录选中的指标类型的 id name
      peopleId:'',// 用户群点击的某个数据的id
      peopleName:'',
      incomeId:'',// 费用项点击的某个数据的id
      incomeName:'',
      productId:'',// 产品结构点击的某个数据的id\
      productName:'',
      channelId:'',// 渠道结构点击的某个数据的id
      channelName:'',
      businessId:'',// 业务结构点击的某个数据的id
      businessName:'',
      contentProvince:false,
      contentCity:null,
      contentPeople:null,
      contentIncome:null,
      contentProduct:null,
      contentChannel:null,
      contentBusiness:null,
      isClick:isclick,
      anaIndex:"0",
      citySelect:'',
      selectType:[],
      time:30,
      proId:'' ,
      selectPro:'111',// 省份Id
      selectCityId:"",// 地市Id
      titleNamePro:"",
      titleNameCity:"",
      anClick:"",// 点击第几次

    },()=>{
      const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    });
  };

  // 获取最大账期
  getMaxDate=()=>{
    const {dispatch}=this.props;
    dispatch({
      type: 'themeAnalysisModels/fetchMaxData',
      payload: {
        "dateType":"1",
        "markType":"013",
      },
      callback:()=>{
        // console.log('请求最大账期回调')
        const {themeAnalysisModels,location}=this.props;
        const {maxDate}=themeAnalysisModels;
        const {date}=this.state;
        if(!date&&!location.date){
          this.setState({
            date:maxDate.date
          },
            ()=>{
            const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
            this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
          })
        }
      }
    });
  };

  // 获取地域分布数据
  getAreaData=(selectedIndex,date,proId,peopleId,incomeId,productId,channelId,businessId)=>{
    const {dispatch}=this.props;
    if(selectedIndex==="001"){
      dispatch({
        type: `themeAnalysisModels/fetchAreaData`,
        payload: {
          peopleBardata: peopleId,
          productdata: productId,
          businessBar: businessId,
          channeldata:channelId,
          incomeBar: incomeId,
          chartType: " cityBardata",
          "date":date,
          dateType: "1",
          markType: "013",
          provId: proId
        }
      });
    }else{
      dispatch({
        type: `themeAnalysisModels/fetchAreaDataNet`,
        payload: {
          peopleBardata: peopleId,
          productdata: productId,
          businessBar: businessId,
          channeldata:channelId,
          incomeBar: incomeId,
          chartType: " cityBardata",
          date,
          dateType: "1",
          markType: "013",
          provId: proId
        }
      });
    }
  };

  // 获取5张chart图的数据
  getChartData=(selectedIndex,date,proId,cityId,peopleId,incomeId,productId,channelId,businessId)=>{
    const {dispatch}=this.props;
    // const chartTypes=['peopleBardata','incomeBar','businessBar','channeldata','productdata'];
    if(selectedIndex==="001"){
      ['peopleBardata','incomeBar','businessBar','channeldata','productdata'].map((item,index)=>{
        dispatch({
          type: `themeAnalysisModels/fetchConditionChart${index}`,
          payload: {
            peopleBardata: peopleId,
            productdata: productId,
            businessBar: businessId,
            channeldata:channelId,
            incomeBar: incomeId,
            chartType: item,
            "date":date,
            dateType: "1",
            markType: "013",
            "cityId":cityId,
            provId: proId,
          }
        });
        return null
      })
    } else{
      ['peopleBardata','incomeBar','businessBar','channeldata','productdata'].map((item,index)=>{
        dispatch({
          type: `themeAnalysisModels/fetchConditionChartNet${index}`,
          payload: {
            peopleBardata: peopleId,
            productdata: productId,
            businessBar: businessId,
            channeldata:channelId,
            incomeBar: incomeId,
            chartType: item,
            date,
            dateType: "1",
            markType: "013",
            cityId,
            provId: proId,
          }
        });
        return null
      })
    }
  };

  // 获取时间分布数据
  getTimeData=(selectedIndex,time,date,proId,cityId,peopleId,incomeId,productId,channelId,businessId)=>{
    const {dispatch}=this.props;
    if(selectedIndex==="001"){
      dispatch({
        type: `themeAnalysisModels/fetchTimeData`,
        payload: {
          dateType: "1",
          markType: "013",
          "date":date,
          incomeBar:incomeId,
          businessBar: businessId,
          channeldata: channelId,
          peopleBardata:peopleId,
          productdata:productId,
          "cityId":cityId,
          provId: proId,
          "time":time,
        }
      });
    } else{
      dispatch({
        type: `themeAnalysisModels/fetchTimeDataNet`,
        payload: {
          dateType: "1",
          markType: "013",
          "date":date,
          incomeBar:incomeId,
          businessBar: businessId,
          channeldata: channelId,
          peopleBardata:peopleId,
          productdata:productId,
          "cityId":cityId,
          provId: proId,
          "time":time,
        }
      });
    }

  };

  // 获取表格数据
  getTableData=(indexTypeId,date,proId,cityId,selectType)=>{
    const {dispatch}=this.props;
    dispatch({
        type: `themeAnalysisModels/fetchTableData`,
        payload:{
          indexTypeId,
          params:{
            dateType: "1",
            markType: "013",
            moduleId: "0110",
            "cityId":cityId,
            provId: proId,
            "date":date,
            "selectType":selectType,
          }
        }
      });
  };

  clickFetch=(selectType,proId,cityId,peopleId,incomeId,productId,channelId,businessId,fetCity)=>{
    const{indexTypeIdAndName,date,time}=this.state;
    this.getChartData(indexTypeIdAndName.id,date,proId,cityId,peopleId,incomeId,productId,channelId,businessId);
    if(fetCity!=="1"){
      this.getAreaData(indexTypeIdAndName.id,date,proId,peopleId,incomeId,productId,channelId,businessId)
    }
    this.getTimeData(indexTypeIdAndName.id,time,date,proId,cityId,peopleId,incomeId,productId,channelId,businessId);
    this.getTableData(indexTypeIdAndName.id,date,proId,cityId,selectType)
  };

  // 回调函数
  // 1. chartData0 用户群分布回调函数
  chartData0=(name,id,index)=>{
     // console.log("主页面用户群分布回调函数")
     const {selectType}=this.state;
     selectType.push({'peopleBardata':[id]});
     this.setState({
       select0:index,
       peopleId:id,
       peopleName:name,
       selectType,
       contentPeople:true,
     });
    const{selectPro,selectCityId,incomeId,productId,channelId,businessId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,id,incomeId,productId,channelId,businessId,null)
  };

  // 1. chartData1 费用项分布回调函数
  chartData1=(name,id,index)=>{
    // console.log("主页面费用项分布回调函数")
    const {selectType}=this.state;
    selectType.push({'incomeBar':[id]});
    this.setState({
      select1:index,
      incomeId:id,// 费用项点击的某个数据的id
      incomeName:name,
      selectType,
      contentIncome:true,
    });
    const{selectPro,selectCityId,peopleId,productId,channelId,businessId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,peopleId,id,productId,channelId,businessId,null)
  };

  // 1. chartData2 业务结构回调函数
  chartData2=(name,id,index)=>{
    // console.log("主页面业务结构回调函数")
    const {selectType}=this.state;
    selectType.push({'businessBar':[id]});
    this.setState({
      select2:index,
      businessId:id,
      businessName:name,
      selectType,
      contentBusiness:true,
    });
    const{selectPro,selectCityId,peopleId,incomeId,productId,channelId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,id,null)
  };

  // 1. chartData3 渠道结构回调函数
  chartData3=(name,id,index)=>{
    // console.log("主页面渠道结构回调函数")
    const {selectType}=this.state;
    selectType.push({'channeldata':[id]});
    this.setState({
      select3:index,
      channelId:id,
      channelName:name,
      selectType,
      contentChannel:true,
    });
    const{selectPro,selectCityId,peopleId,incomeId,productId,businessId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,id,businessId,null)
  };

  // 1. chartData4 产品结构回调函数
  chartData4=(name,id,index)=>{
    // console.log("主页面产品结构回调函数")
    const {selectType}=this.state;
    selectType.push({'productdata':[id]});
    this.setState({
      select4:index,
      productId:id,
      productName:name,
      selectType,
      contentProduct:true,
    });
    const{selectPro,selectCityId,peopleId,incomeId,channelId,businessId}=this.state;
    this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,id,channelId,businessId,null)
  };

  // 时间折线图回调函数
  callBackTime=(number)=>{
    const{indexTypeIdAndName,date,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
    this.setState({
      time:number*30,
    },()=>{
      this.getTimeData(indexTypeIdAndName.id,number*30,date,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId)
    });
  };

  contentPeopleClicked=()=>{
    const {selectType}=this.state;
    selectType.map( (data,index)=>{
      if(data.peopleBardata){selectType.splice(index,1)}
      return null
    });
    this.setState({
      contentPeople:false,
      selectType,
      peopleId:'',
      peopleName:'',
    },()=>{
      const{selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentIncomeClicked=()=>{
    const {selectType}=this.state;
    selectType.map( (data,index)=>{
      if(data.incomeBar){selectType.splice(index,1)}
      return null
    });
    this.setState({
      contentIncome:false,
      selectType,
      incomeId:'',
      incomeName:'',
    },()=>{
      const{selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentProductClicked=()=>{
    const {selectType}=this.state;
    selectType.map( (data,index)=>{
      if(data.productdata){selectType.splice(index,1)}
      return null
    });
    this.setState({
      contentProduct:false,
      selectType,
      productId:'',
      productName:'',
    },()=>{
      const{selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentChannelClicked=()=>{
    const {selectType}=this.state;
    selectType.map( (data,index)=>{
      if(data.channeldata){selectType.splice(index,1)}
      return null
    });
    this.setState({
      contentChannel:false,
      selectType,
      channelId:'',
      channelName:'',
    },()=>{
      const{selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentBusinessClicked=()=>{
    const {selectType}=this.state;
    selectType.map( (data,index)=>{
      if(data.businessBar){selectType.splice(index,1)}
      return null
    });
    this.setState({
      contentBusiness:false,
      selectType,
      businessId:'',
      businessName:'',
    },()=>{
      const{selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentProvinceClicked=()=>{
    const {power} = Cookie.getCookie('loginStatus');
    // var loginStatus=Cookie.get("loginStatus");
    let isclick = "0";
    if(power !== "all"){
      isclick = "1"
    }
    this.setState({
      contentProvince:false,
      contentCity:false,
      selectPro:'111',
      selectCityId:'',
      isClick:isclick,
      anaIndex:"0",
      titleNameCity:"",
      titleNamePro:"",
    },()=>{
      const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  contentCityClicked=()=>{
    this.setState({
      contentCity:false,
      selectCityId:'',
      citySelect:"",
      isClick:'1',
      anaIndex:"0",
      titleNameCity:"",
    },()=>{
      const{selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    })
  };

  callBackPro=(name,x,proId)=>{
    const{selectPro}=this.state;
    if(selectPro !== '111'){ // 2018.04.16,renlulu,判断全国和省份用户来判断点击触发的方法
      this.callBackCity(name,x,proId);
    }else{
      this.setState({
        contentProvince:true,
        titleNamePro:name,
        selectPro:proId[x],
        isClick:"1",
        anaIndex:"0",
      },()=>{
        const{selectType,peopleId,incomeId,productId,channelId,businessId}=this.state;
        this.clickFetch(selectType,proId[x],"",peopleId,incomeId,productId,channelId,businessId,null)
      })
    }
  };

  callBackCity=(name, x,proId)=>{
    // console.log("地域地市回调函数")
    // console.log(name)
    // console.log(x)
    // console.log(proId)
    const selectCityId=proId[x];
    this.setState({
      contentCity:true,
      titleNameCity:name,
      selectCityId,
      isClick:"2",
      citySelect:name,
      anaIndex:"0",
    },()=>{
      const{selectType,selectPro,peopleId,incomeId,productId,channelId,businessId}=this.state;
      this.clickFetch(selectType,selectPro,selectCityId,peopleId,incomeId,productId,channelId,businessId,null)
    });
  };

  // 下载函数
  download=(type)=>{
    // console.log(`${type}下载按钮被点击`)
    switch (type) {
      case "area":
        DownloadFile(this.jsonHandle(type),"themeAnalysisAreaChart");
        break;
      case "users":
        DownloadFile(this.jsonHandle(type),"themeAnalysisUsersChart");
        break;
      case "income":
        DownloadFile(this.jsonHandle(type),"themeAnalysisIncomeChart");
        break;
      case "product":
        DownloadFile(this.jsonHandle(type),"themeAnalysisProductChart");
        break;
      case "channel":
        DownloadFile(this.jsonHandle(type),"themeAnalysisChannelChart");
        break;
      case "business":
        DownloadFile(this.jsonHandle(type),"themeAnalysisBusinessChart");
        break;
      case "time":
        DownloadFile(this.jsonHandle(type),"themeAnalysisTimeChart");
        break;
      case "table":
        DownloadFile(this.jsonHandle(type),null);
        break;
      default:
        return null
    }
    return null
  };

  jsonHandle=(type)=>{
    const {themeAnalysisModels}=this.props;
    const {areaData,chartData0,chartData1,chartData2,chartData3,chartData4,timeData,tableData}=themeAnalysisModels;
    const {date,title,indexTypeIdAndName,titleNameCity,titleNamePro,peopleName,incomeName,productName,channelName,businessName}=this.state;
    let newJson={};
    if(type==="users"){
      const data=chartData0.chart;
      const xxdValue=[];
      if(data.length>0){
       data.map((item)=> xxdValue.push([item.name,item.value,item.percent])
        )
      }
      const condition = {
        name: `${indexTypeIdAndName.name}用户群分布`,
        value: [
          ["专题名称:", title, `(${chartData0.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["产品结构", "业务值", "百分比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}用户群分布`,
        condition,
        table
      }
    }
    else if(type==="income"){
      const data=chartData1.chart;
      const xxdValue=[];
      if(data.length>0){
        data.map((item)=> xxdValue.push([item.name,item.value,item.percent])
        )
      }
      const condition = {
        name: `${indexTypeIdAndName.name}费用项分布`,
        value: [
          ["专题名称:", title, `(${chartData1.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["产品结构", "业务值", "百分比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}费用项分布`,
        condition,
        table
      }
    }
    else if(type==="product"){
      const data=chartData4.chart;
      const xxdValue=[];
      if(data.length>0){
        data.map((item)=> xxdValue.push([item.name,item.value,item.percent])
        )
      }
      const condition = {
        name: `${indexTypeIdAndName.name}产品项分布`,
        value: [
          ["专题名称:", title, `(${chartData4.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["产品结构", "业务值", "百分比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}产品项分布`,
        condition,
        table
      }
    }
    else if(type==="channel"){
      const data=chartData3.chart;
      const xxdValue=[];
      if(data.length>0){
        data.map((item)=> xxdValue.push([item.name,item.value,item.percent])
        )
      }
      const condition = {
        name: `${indexTypeIdAndName.name}渠道项分布`,
        value: [
          ["专题名称:", title, `(${chartData3.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["产品结构", "业务值", "百分比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}渠道项分布`,
        condition,
        table
      }
    }
    else if(type==="business"){
      const data=chartData2.chart;
      const xxdValue=[];
      if(data.length>0){
        data.map((item)=> xxdValue.push([item.name,item.value,item.percent])
        )
      }
      const condition = {
        name: `${indexTypeIdAndName.name}业务项分布`,
        value: [
          ["专题名称:", title, `(${chartData2.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["产品结构", "业务值", "百分比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}业务项分布`,
        condition,
        table
      }
    }
    else if(type==="area"){
      // console.log('地域下载在被点击');
      const data=areaData.chart["0"];
      const xxdValue=[];
      if(data.chartX.length>0){
        for(let i=0;i<data.chartX.length;i+=1){
          if(data.chartX[i]){ // 去除省市为“”空字符串的情况
            xxdValue.push([data.chartX[i],data.totalData[i],data.proPercent[i]])
          }
        }
      }
      const condition = {
        name: `${indexTypeIdAndName.name}地域分析`,
        value: [
          ["专题名称:", title, `(${data.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          [data.chartX.length===31?"省份":"地市", "月累计值", "日均环比"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}地域分析`,
        condition,
        table
      }
    }
    else if(type==="time"){
      const data=timeData["0"];
      const xxdValue=[];
      if(data.chartX.length>0){
        for(let i=0;i<data.chartX.length;i+=1){
          xxdValue.push([data.chartX[i],data.data[i]])
        }
      }
      const condition = {
        name: `${indexTypeIdAndName.name}时间分布`,
        value: [
          ["专题名称:", title, `(${data.unit})`],
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          ["日期", "累计值"]
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-${indexTypeIdAndName.name}时间分布`,
        condition,
        table
      }
    }
    else if(type==="table"){
      const data=tableData;
      const xxdValue=[];
      if(data.tbodyData.length>0){
        for(let i=0;i<data.tbodyData.length;i+=1){
          xxdValue.push([data.tbodyData[i].kpiName,data.tbodyData[i].unit,...data.tbodyData[i].kpiValues])
        }
      }
      const condition = {
        name: `相关指标数据表`,
        value: [
          ["筛选条件:"],
          ["日期:", date],
          ["省分:", titleNamePro],
          ["地市:", titleNameCity],
          ["用户群:", peopleName],
          ["费用项:", incomeName],
          ["产品项:", productName],
          ["渠道项:", channelName],
          ["业务项:", businessName]
        ],
      };
      const table = {
        title: [
          data.thData
        ],
        value:xxdValue,
      };
      newJson= {
        fileName: `${title}-相关指标数据表`,
        condition,
        table
      }
    }
    return newJson
  };

  render(){
    const {showIndexExplain}=this.state;
    const {iconIssueContent,iconExplainContent}=this.state;
    const {title,indexTypeIdAndName,indexType,date}=this.state;
    const {contentProvince,contentCity,contentPeople,contentIncome,contentProduct,contentChannel,contentBusiness}=this.state;
    const {themeAnalysisModels}=this.props;
    const {newAreaData,areaData,chartData0,chartData1,chartData2,chartData3,chartData4,timeData,tableData}=themeAnalysisModels;
    const {select0,select1,select2,select3,select4,}=this.state;
    const {peopleName,incomeName,productName,channelName,businessName,proId,numX,numXs,citySelect,anClick,isClick,anaIndex}=this.state;
    const {titleNamePro,titleNameCity}=this.state;
    const {time}=this.state;
    // const triangle = <i className={styles.dateTriangle} />
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      width: '30px',
    };
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.page}>
            {/* <BackTopComponent /> */}
            <div className={styles.header}>
              <div className={styles.title}>
                {title}
                <div className={styles.iconIcon}>
                  <div className={styles.iconIssue} onMouseOver={this.mouseOverIconIssue} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIssue}>
                    <Icon type="question-circle" theme="filled" />
                    {iconIssueContent?<div className={styles.iconIssueContent}>计费收入专题分析内点击对应  维度均可进行下钻维度操作</div>:null}
                  </div>
                  <div className={styles.icon} onClick={this.indexExplain} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex}>
                    <Icon type="file-text" />
                    {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
                  </div>
                  <IndexExplain show={showIndexExplain} callback={this.callbackCloseIndexExplain} markId="013" />
                </div>
                <CollectComponent key='013' markType='013' searchType='2' imgStyle={collectStyle} />
              </div>

              <div className={styles.headerItem}>
                <div className={styles.options}>
                  观察指标
                </div>
                <div className={styles.selectItem}>
                  <IndexScreen
                    indexType={indexType}
                    indexTypeIdAndName={indexTypeIdAndName}
                    callBackIndexScreen={this.callBackIndexScreen}
                  />
                </div>
              </div>
              <div className={styles.headerItem}>
                <div className={styles.options}>
                  日期
                </div>
                <div className={styles.selectItem}>
                  {date?<DatePicker
                    disabledDate={this.disabledEndDate}
                    onChange={this.onChangeDate}
                    locale={moment.locale('zh-cn')}
                    allowClear={false}
                    defaultValue={moment(date, 'YYYY-MM-DD')}
                    // suffixIcon={triangle}
                    showToday={false}
                  />:null}
                </div>
              </div>
              <div className={styles.reset}>
                <span onClick={this.reset}>重置</span>
              </div>
            </div>
            <div className={styles.filter}>
              <div>当前结果</div>
              <div className={styles.filterContent}>
                {(contentProvince||contentPeople||contentIncome||contentProduct||contentChannel||contentBusiness)?null:<div>: 默认</div>}
                {contentProvince?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>地域：</span>
                      <span>{titleNamePro}</span>
                      <span className={styles.contentClose} onClick={this.contentProvinceClicked}>x</span>
                    </span>
                    {contentCity?
                      <span className={`${styles.contentWrapper} ${styles.contentWrapperLeft}`}>
                        <span>{titleNameCity}</span>
                        <span className={styles.contentClose} onClick={this.contentCityClicked}>x</span>
                      </span>:null}
                  </div> :null}
                {contentPeople?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>用户群：</span>
                      <span>{peopleName}</span>
                      <span className={styles.contentClose} onClick={this.contentPeopleClicked}>x</span>
                    </span>
                  </div>:null}
                {contentIncome?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>费用项：</span>
                      <span>{incomeName}</span>
                      <span className={styles.contentClose} onClick={this.contentIncomeClicked}>x</span>
                    </span>
                  </div>:null}
                {contentProduct?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>产品项：</span>
                      <span>{productName}</span>
                      <span className={styles.contentClose} onClick={this.contentProductClicked}>x</span>
                    </span>
                  </div>:null}
                {contentChannel?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>渠道项：</span>
                      <span>{channelName}</span>
                      <span className={styles.contentClose} onClick={this.contentChannelClicked}>x</span>
                    </span>
                  </div>:null}
                {contentBusiness?
                  <div>
                    <span className={styles.contentLeft}>{">"}</span>
                    <span className={styles.contentWrapper}>
                      <span>业务项：</span>
                      <span>{businessName}</span>
                      <span className={styles.contentClose} onClick={this.contentBusinessClicked}>x</span>
                    </span>
                  </div>:null}
              </div>
            </div>
            <div id="themeAnalysisAreaChart" className={styles.chartPlace}>
              <div className={styles.topLine} />
              <div className={styles.chart1}>
                <div className={styles.download} onClick={()=>{this.download("area")}}>
                  <div><Icon type="download" /></div>
                  <div>下载</div>
                </div>
                <AnalysisAreaChart
                  chartData={areaData}
                  initChartData={newAreaData}
                  titleName={`${indexTypeIdAndName.name}地域分析`}
                  callbackPro={this.callBackPro}
                  callbackCity={this.callBackCity}
                  proId={proId}
                  numX={numX}
                  numXs={numXs}
                  anclick={anClick}
                  isClick={isClick}
                  citySelect={citySelect}
                  anaIndex={anaIndex}
                  provinceName={isClick===0?"全国":"全省"}
                />
              </div>
            </div>
            <div className={styles.chartRow1}>
              <div id="themeAnalysisUsersChart" className={styles.chartUser}>
                <div className={styles.topLine} />
                <div className={styles.chart}>
                  <div className={styles.download} onClick={()=>{this.download("users")}}>
                    <div><Icon type="download" /></div>
                    <div>下载</div>
                  </div>
                  <AnalysisChart chartData={chartData0} titleName={`${indexTypeIdAndName.name}用户群分布`} selects={select0} callBackChart={this.chartData0} />
                </div>
              </div>
              <div id="themeAnalysisIncomeChart" className={styles.chartUser}>
                <div className={styles.topLine} />
                <div className={styles.chart}>
                  <div className={styles.download} onClick={()=>{this.download("income")}}>
                    <div><Icon type="download" /></div>
                    <div>下载</div>
                  </div>
                  <AnalysisChart chartData={chartData1} titleName={`${indexTypeIdAndName.name}费用项分布`} selects={select1} callBackChart={this.chartData1} />
                </div>
              </div>
              <div id="themeAnalysisProductChart" className={styles.chartUserRight}>
                <div className={styles.topLine} />
                <div className={styles.chart}>
                  <div className={styles.download} onClick={()=>{this.download("product")}}>
                    <div><Icon type="download" /></div>
                    <div>下载</div>
                  </div>
                  <AnalysisChart chartData={chartData4} titleName={`${indexTypeIdAndName.name}产品结构`} selects={select4} callBackChart={this.chartData4} />
                </div>
              </div>
            </div>
            <div className={styles.chartRow2}>
              <div id="themeAnalysisChannelChart" className={styles.chartUser}>
                <div className={styles.topLine} />
                <div className={styles.chart}>
                  <div className={styles.download} onClick={()=>{this.download("channel")}}>
                    <div><Icon type="download" /></div>
                    <div>下载</div>
                  </div>
                  <AnalysisChart chartData={chartData3} titleName={`${indexTypeIdAndName.name}渠道结构`} selects={select3} callBackChart={this.chartData3} />
                </div>
              </div>
              <div id="themeAnalysisBusinessChart" className={styles.chartUserRight}>
                <div className={styles.topLine} />
                <div className={styles.chart}>
                  <div className={styles.download} onClick={()=>{this.download("business")}}>
                    <div><Icon type="download" /></div>
                    <div>下载</div>
                  </div>
                  <AnalysisChart chartData={chartData2} titleName={`${indexTypeIdAndName.name}业务结构`} selects={select2} callBackChart={this.chartData2} />
                </div>
              </div>
            </div>
            <div id="themeAnalysisTimeChart" className={styles.chartRow3}>
              <div className={styles.topLine} />
              <div className={styles.chart7}>
                <div className={styles.download} onClick={()=>{this.download("time")}}>
                  <div><Icon type="download" /></div>
                  <div>下载</div>
                </div>
                <AnalysisTimeChart time={time} chartData={timeData} titleName={`${indexTypeIdAndName.name}时间分布`} callBackTime={this.callBackTime} />
              </div>
            </div>
            <div id="themeAnalysisTableChart" className={styles.chartRow4}>
              <div className={styles.download} onClick={()=>{this.download("table")}}>
                <div><Icon type="download" /></div>
                <div>下载</div>
              </div>
              <div className={styles.chartRow4Title}>
                <span>相关指标数据表</span>
                <div className={styles.line} />
              </div>
              <AnalysisTable tableData={tableData} />
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default ThemeAnalysis;
