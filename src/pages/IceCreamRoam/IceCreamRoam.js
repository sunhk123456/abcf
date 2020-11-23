/* eslint-disable no-plusplus,array-callback-return,no-loop-func,prefer-const,no-unused-vars */
/**
 *冰激凌专题页面
 * by:wangjian
 * 2019/3/22
 */

import React, { PureComponent, Fragment } from 'react';
import {connect} from 'dva';
import { Card, Row, Col, Button, Table, Checkbox,DatePicker,Select,Tooltip } from 'antd';
import moment from 'moment';
import styles from './IceCreamRoam.less';
import tipsIcon from './tips.png'
import EarlyWarning from "../../components/DayOverView/earlyWarning";
import PageHeaderWrapper from '../../components/PageHeaderWrapper'
import IndexDetails from '../../components/DevelopingUser/indexDetails'
import ProCity from '../../components/Until/proCity'
import DevelopPop from '../../components/IceCream/developingPop'
import DownloadAll from '../../components/DownloadAll/downloadAll'
import DownloadFile from "@/utils/downloadFile";
import {getRouterState} from "@/utils/tool"; // 工具方法


@connect(
  ({developingUserCom,proCityModels}) => ({
    indexDetailsShow:developingUserCom.indexDetailsShow,
    selectPro:proCityModels.selectPro,
    selectCity:proCityModels.selectCity,
  })
)

@connect(({ IceCream, loading }) => ({
  IceCream,
  loading: loading.models.IceCream,
  tableHData:IceCream.iceTableData.thData,
  tableData:IceCream.iceTableData,
  indexDate:IceCream.indexDate,
  currentDate:IceCream.currentDate,
  regionalBarData:IceCream.regionalBarData,
  trendLineData:IceCream.trendLineData,
}))

class IceCreamRoam extends PureComponent {

  constructor(props) {
    super(props);
    const { location} = this.props;
    this.state = {
      tableState: {
        bordered: false,
        pagination: false,
      },
      date:null,// 暂存已选日期
      // dateType:location.state===undefined?"":location.state.dateType, // 区分日报月报
      // markId:location.state===undefined?"":location.state.id,// 当前的专题id
      // indexType1:'td',// 暂存已选类型
      expandedRowKeys:[],// 表格展开项
      tableKey:[], // 暂存表格所有的key
      tableAllOpen:false,// 表格是否已经全部展开
      isDownloadShow:false, // 下载弹窗是否展示
      dateFormat:null,
      dateType:"1",
      titleGet:"空标题",
      markTypeGet:"",
      iconExplainContent:false, // 指标解释hover是否显示
    };


  }

  componentWillMount(){

    const state = getRouterState(this.props);
    if(state!== undefined){
      const {dateType,title,id} = state;
      let dateFormatPre = 'YYYY-MM';
      if(state.dateType==="1"){dateFormatPre = 'YYYY-MM-DD';}
      else if(state.dateType==="2"){dateFormatPre = 'YYYY-MM';}
      this.setState({
        "dateType":dateType,
        titleGet:title,
        markTypeGet:id,
        dateFormat:dateFormatPre,
      },()=>{
        this.fetchIndexDetailsData(); // 请求页面指标详细解释接口
        this.fetchMaxDateData(); // 请求最大账期
        this.fetchTitle(); // 请求标题
      })
    }else{
      this.fetchIndexDetailsData(); // 请求页面指标详细解释接口
      this.fetchMaxDateData(); // 请求最大账期
      this.fetchTitle(); // 请求标题
    }
  }

  componentDidMount(){
    const state = getRouterState(this.props);
    let dateFormatPre = 'YYYY-MM';
    if(state.dateType==="1"){
      dateFormatPre = 'YYYY-MM-DD';
    }
    else if(state.dateType==="2"){
      dateFormatPre = 'YYYY-MM';

    }
    else {
      dateFormatPre = 'YYYY-MM';
    }
    this.setState({
      dateFormat:dateFormatPre,
    })


  }

  componentWillReceiveProps(nextProps){
    const {tableData} = this.props;
    const {date}=this.state;
     const {location}=this.props;
    const state = getRouterState(this.props);
    // 20191014 风信子注释 解决弹出层账期不变的问题
    // if(nextProps !== undefined){ // 第一次日期 渲染
    //   // 之前是 indexDate
    //   if (nextProps.indexDate !== date && date) {
    //       this.setState({
    //         date:nextProps.indexDate
    //       })
    //   }
    // }


    // 请求一次全部展开所需要的key并存入state留用
    if(nextProps.tableData !== undefined&&nextProps.tableData.tbodyData !== undefined){
      // console.info(nextProps.tableData);
      if(nextProps.tableData.tbodyData !== tableData.tbodyData && nextProps.tableData.tbodyData !== []&& nextProps.tableData.tbodyData.length>0){
        const temp = nextProps.tableData.tbodyData.map((item)=>item.dimensionId);
        this.setState({
          tableKey:temp,
        });
      }
    }

    // 日月切换
    if(nextProps.location&&nextProps.location.state &&nextProps.location.state.dateType&& nextProps.location.state.dateType!==state.dateType){
      // console.log('日月切换');
      // console.log('nextProps.location.state');
      // console.log(nextProps.location.state);
      // console.log('state');
      // console.log(state);
      const {dateType,title,id} = nextProps.location.state;
      let dateFormatPre = 'YYYY-MM';
      if(nextProps.location.state.dateType==="1"){dateFormatPre = 'YYYY-MM-DD';}
      else if(nextProps.location.state.dateType==="2"){dateFormatPre = 'YYYY-MM';}
      this.setState({
        "dateType":dateType,
        titleGet:title,
        markTypeGet:id,
        dateFormat:dateFormatPre,
        date:null,
      },()=>{
        this.fetchIndexDetailsData(); // 请求页面指标详细解释接口
        this.fetchMaxDateData(); // 请求最大账期
        this.fetchTitle(); // 请求标题
      })
    };

    if(nextProps.location.state&&!location.state){
      const {dateType,title,id} = nextProps.location.state;
      let dateFormatPre = 'YYYY-MM';
      if(nextProps.location.state.dateType==="1"){dateFormatPre = 'YYYY-MM-DD';}
      else if(nextProps.location.state.dateType==="2"){dateFormatPre = 'YYYY-MM';}
      this.setState({
        "dateType":dateType,
        titleGet:title,
        markTypeGet:id,
        dateFormat:dateFormatPre,
        date:null,
      },()=>{
        this.fetchIndexDetailsData(); // 请求页面指标详细解释接口
        this.fetchMaxDateData(); // 请求最大账期
        this.fetchTitle(); // 请求标题
      })
    }
  }



  /**
   * 处理数据格式，把 {"values": ["9999","1000","2325"]}
   * 变成
   * {value1:"9999", value2:"9999",value3:"9999"}
   * */
  newTbodyData=(array)=>{
    const getValueData=(data)=>{
      const {values}=data;
      const  obj={};
      for (let i=0;i<values.length; i+=1){
        // const string1=values[i].replace(/,/g,'');
        obj[`value${i}`]=values[i]
      }
      return Object.assign(data,obj);
    };
    if(array!==undefined) {
      for (let i = 0; i < array.length; i += 1) {
        getValueData(array[i]);
      }
    }
  };

  /**
   * 处理数据格式
   * 为每行数据加上key属性
   * */
  addKey=(array)=>{
    if(!array){return array}
    for (let i=0;i<array.length; i+=1){
      Object.assign(array[i],{key:array[i].dimensionId})
    }
    return array
  };

  // 表格排序
  tableSort=(a,b,index)=>{
    let stringB=b[`value${index}`];
    if(stringB==="-"){stringB="-10000"}
    let stringA=a[`value${index}`];
    if(stringA==="-"){stringA="-10000"}
    const bb=Number(stringB.replace(/,/g,''));
    const aa=Number(stringA.replace(/,/g,''));
    return(bb -aa)
  };

  // 把请求到的数据处理成table想要的数据格式
  handleData=(oldThData,oldTbodyData)=>{
    const sw= window.screen.width; // 获取屏幕宽度
    let tableWidth = 180;
    let newChildren=[];
    if(sw >= 1400){
      tableWidth = 180
    }else if(sw < 1400){
      tableWidth = 160
    }
    // if(!oldThData){return {}}
    let columns=[];
    let number=0;
    let thDataForLine={};
    if(oldThData!==undefined){
      oldThData.thDataAll.map((item, index) => {
        thDataForLine[`${item.indexId}`]=item.name;
      })
      oldThData.thParent.map((item, index) => {
        thDataForLine[`${item.id}`]=item.name;
      })
    }

   if(oldThData!==undefined) {
     oldThData.thDataAll.map((item, index) => {
       if ((item.parentId === "-1"||item.parentId === "-")&&index===1) {
         columns.push({
           title: <div style={{height:60,display:'flex',alignItems:'center'}}>{`${item.name}(${item.unit})`}</div>,
           indexId: item.indexId,
           parentId:index === 0?"-1":item.parentId,
           dataIndex: index === 0 ? "name" : `value${number}`,
           className:  index === 0?styles.column0:styles.column2,
           width: index===0 ? tableWidth : null,
           fixed: index===0 ? 'left' : null,
           // width: item.parentId === "-"||item.parentId === "-1" ? tableWidth : null,
           // fixed: item.parentId === "-"||item.parentId === "-1"? 'left' : null,
           render: (text,record) => (
             <Tooltip placement="bottom" title={record.showEarlyWarning!=="1"?null:(<EarlyWarning warningLevel={record.warningLevel} desc={record.desc} />)} overlayClassName={styles.warningTip}>
               <span
                 title={text}
                 className={styles.clickSpan}
                 onClick={text!=='-'?this.tableClicked:null}
                 data-column-name={item.name}
                 data-column-parentid={index === 0?"-1":item.parentId}
                 data-column-indexid={item.indexId}
               >
                 {text}
                 <span style={{color:'#C91717',display:record.showEarlyWarning==="1"?'inline-block':'none'}}>*</span>
               </span>
             </Tooltip>
           ),
         });
         if (index !== 0) {
           number++;
         }
       }
       else if(item.parentId === "-1"||item.parentId === "-"){
         columns.push({
           title: <div style={{height:60,display:'flex',alignItems:'center'}}>{item.unit?`${item.name}(${item.unit})`:item.name}</div>,
           indexId: item.indexId,
           parentId:index === 0?"-1":item.parentId,
           dataIndex: index === 0 ? "name" : `value${number}`,
           className: index === 0?styles.column0:styles.column2,
           width: index===0 ? tableWidth : null,
           fixed: index===0 ? 'left' : null,
           // width: item.parentId === "-"||item.parentId === "-1" ? tableWidth : null,
           // fixed: item.parentId === "-"||item.parentId === "-1"? 'left' : null,
           render: text => (
             <span
               title={text}
               className={styles.clickSpan}
               onClick={text!=='-'?this.tableClicked:null}
               data-column-name={item.name}
               data-column-parentid={index === 0?"-1":item.parentId}
               data-column-indexid={item.indexId}
             >
               {text}
             </span>
           ),
         });
         if (index !== 0) {
           number++;
         }
       }
     });
     oldThData.thParent.map((item, index) => {
       columns.push({
         title: `${item.name}`, // 表头第一行
         indexId: item.id,
         parentId:item.parentId,
         dataIndex: `parent${index}`,
         className:  styles.column1,
         width: 2* tableWidth,
         children: []
       });
     });
     for (let i = 0; i < columns.length; i++) {
       oldThData.thDataAll.map((item, index) => {
         if (item.parentId === columns[i].indexId&&item.parentId!=="-") {
           newChildren.push({
             title: `${item.name}(${item.unit})`,
             indexId: item.indexId,
             parentId:item.parentId,
             dataIndex: `value${number}`,
             className: index === 0 ? styles.column0 : styles.column1,
             width: tableWidth ,
             render: text => (
               <span
                 title={text}
                 className={styles.clickSpan}
                 onClick={text!=='-'?this.tableClicked:null}
                 data-column-name={item.name}
                 data-column-parentid={item.parentId}
                 data-column-parentname={thDataForLine[item.parentId]}
                 data-column-indexid={item.indexId}
               >{text}
               </span>
             ),
           });
           columns[i]={
             ...columns[i],
             children:newChildren}
           number++
         }
       });
       newChildren=[];
     }
   }
    this.addKey(oldTbodyData.tbodyData);
    // console.info(oldTbodyData.tbodyData);
    this.newTbodyData(oldTbodyData.tbodyData);
    const topTbodyData=[];
   if(oldTbodyData.tbodyData!==undefined) {
     oldTbodyData.tbodyData.map((item) => {

       if (item.parentId !== "-1") {
         return null
       }
       topTbodyData.push(item);
       return item
     });
   }
    for(let i=0;i<topTbodyData.length;i+=1){
      const childrenItem=[];
      oldTbodyData.tbodyData.map((item)=>{
        if(item.parentId===topTbodyData[i].dimensionId){
          // 加缩进
          Object.assign(item,{name:`  ${item.name}`});
          childrenItem.push(item)
        }
        return null
      });
      if(childrenItem.length>0){
        topTbodyData[i].children=childrenItem
      }
    }
    return {columns,topTbodyData}
  };


  /**
   *请求最大日期
   */
  fetchMaxDateData = ()=> {
    const {dispatch} = this.props;
  const {markTypeGet,dateType}=this.state;
    dispatch({
      type:'IceCream/fetchIndexDate',
      payload:{
        markType: markTypeGet,
        dateType
      },
      callback:(e)=>{
        this.setState({
          date:e.date
        },()=>{
           this.fetTable("init");
        })
      }
    })
  };

  // 请求存储当前专题的标题名字
  fetchTitle = ()=> {
    const {dispatch} = this.props;
    const {titleGet}=this.state;
    dispatch({
      type:'IceCream/title',
      payload:{
        title: titleGet
      }
    })
  };

  /**
   *请求指标解释数据
   */
  fetchIndexDetailsData = ()=> {
    const {dispatch} = this.props;
    const {markTypeGet}=this.state;
    dispatch({
      type:'developingUserCom/fetchIndexDetails',
      payload:{
        markType:markTypeGet
      }
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

  /**
   * 点击表格显示弹出层
   */
  tableClicked = (e)=>{
    const {dispatch,tableData} = this.props;
    const {date,dateType,markTypeGet} = this.state;
    const node=e.currentTarget;
    const nodeParent=e.currentTarget.parentNode.parentNode;
    const dimensionId=nodeParent.getAttribute("data-row-key");
    const columnIndexId=node.getAttribute("data-column-indexid");
    const columnParentId=node.getAttribute("data-column-parentid");
    const columnParentName=node.getAttribute("data-column-parentname");
    const columnName=node.getAttribute("data-column-name");
    let obj={};
    tableData.tbodyData.map((tbodyDataItem)=>{
      if(dimensionId === tbodyDataItem.dimensionId){
        obj=tbodyDataItem;
        return obj
      }
      return obj
    });
    let seriesId = "";
    let categoryId = "";
    if(obj.parentId === "-1"){
      if(obj.dimensionId === "00" || obj.dimensionId === "10"){
        categoryId = "-1";
      }else{
        categoryId = obj.dimensionId;
      }
      seriesId = "-1";
    }else{
      categoryId = obj.parentId;
      seriesId = obj.dimensionId;
    }
    const params1 = {
      comKind:columnParentName===undefined||columnParentName===null?columnName:columnParentName,
      comRegional:obj.name
    };
    const params = {
      date,
      markType: markTypeGet,
      indexId: columnIndexId,
      parentId:columnParentId,
      provId:categoryId,
      cityId: seriesId,
      "dateType":dateType
    };
    dispatch({
      type:'IceCream/changePopKind',
      payload:params1
    });
    //  不让地域分布图发请求，未引用地域分布图组件。
    // dispatch({
    //   type:'IceCream/fetchRegionalBarData',
    //   payload:params
    // });
    dispatch({
      type:'IceCream/fetchLineTableData',
      payload:params
    });

    // xingxiaodong 2019.5.8 点击表格时重置为当日趋势图
    const params12 = {
      barStatus:'block',
      lineStatus:'block',
      tableStatus:'none'
    };
    dispatch({
      type:'IceCream/fetchChangeCom',
      payload:params12
    });
    this.showPop();
  };


  /**
   *请求表格数据
   */
  fetTable = (e)=> {
    const {dispatch,selectPro,selectCity} = this.props;
    const {date,dateType,markTypeGet} = this.state;
    const params =
      {
        "markType":markTypeGet,
        provId: e==="init"?'111':selectPro.proId,
        cityId: e==="init"?'':selectCity.cityId,
        "date":date,
        "indexType":"td",
        "dateType":dateType};
    dispatch({
      type: 'IceCream/fetchIceTable',
      payload: params,
      callback: (el) => {
       // console.info(el);
      },
    })
  };

  // 比较出2个数组中不一样的元素
  diffArray = (arr1, arr2) => {
    const arr3 = [];
    for (let i = 0; i < arr1.length; i+=1) {
      if (arr2.indexOf(arr1[i]) === -1)
        arr3.push(arr1[i]);
    }
    for (let j = 0; j < arr2.length; j+=1) {
      if (arr1.indexOf(arr2[j]) === -1)
        arr3.push(arr2[j]);
    }
    return arr3;
  };

  onExpend = (expanded,obj) => {
    // expanded是当前点击行是否展开的状态  obj是当前点击的行信息
    // const {tableData} = this.props;
    // const {expandedRowKeys} = this.state;
    // const willExpandRows = tableData.tbodyData.filter((item)=>item.parentId===obj.dimensionId);// 得到要进行操作的子行的数组
    // if(expanded){
    //   for (let i=0;i<willExpandRows.length;i+=1){
    //     expandedRowKeys.push(willExpandRows[i].parentId)
    //   }
    //   this.setState({
    //     expandedRowKeys
    //   })
    // }else {
    //   const arr = [];
    //   for(let i=0;i<willExpandRows.length;i+=1){
    //     arr.push(willExpandRows[i].parentId)
    //   }
    //   this.setState({
    //     expandedRowKeys:this.diffArray(expandedRowKeys,arr)
    //   })
    // }

    const {dimensionId}=obj;
    const {expandedRowKeys} = this.state;
    const spliceArr = [...expandedRowKeys];
    if(expanded){
      spliceArr.push(dimensionId);
    }else if(!expanded && spliceArr.indexOf(dimensionId) !== -1){
      spliceArr.splice(spliceArr.indexOf(dimensionId),1);
    }
    this.setState({expandedRowKeys: spliceArr});
  };

  /**
   * 全部展开
   */
  allOpen=()=> {
    const {tableKey,tableAllOpen} = this.state;
    // console.info(tableKey);
    if(tableAllOpen === false){
      this.setState({
        expandedRowKeys:tableKey,
        tableAllOpen:true
      })
    }else if(tableAllOpen === true){
      this.setState({
        expandedRowKeys:[],
        tableAllOpen:false
      })
    }
  };

  /**
   * 打开指标解释
   */
  showDetails = ()=>{
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchIndexDetailsStatus',
      payload:{
        indexDetailsShow:'inline'
      }
    })
  };

  /**
   * 功能：选择日期
   */
  onChangeDate = (date, dateString)=>{
    this.setState({
      date:dateString,
    });
    const {dispatch} = this.props;

    dispatch({
      type:'IceCream/fetchChooseDate',
      payload:{
        currentDate:dateString
      }
    })
  };

  /**
   * 功能：选择指标类型
   */
  onChangeType = (value)=>{
    // this.setState({
    //   indexType1:value,
    // })
    console.info(value);
  };

  /**
   * 显示图表组件
   * @returns {*}
   */
  showPop = ()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'IceCream/fetchPopStatus',
      payload:{
        chartsStatus:'block'
      }
    })
  };

  downloadClose=()=>{
    this.setState({
      isDownloadShow:false
    })
  };

  // 下载按钮被点击
  download=()=>{
    // this.setState({
    //   isDownloadShow:true
    // })
    DownloadFile(this.jsonHandle());
  };

  // 下载当前调用函数
  jsonHandle=()=>{

    const {selectPro,selectCity,tableHData,tableData} = this.props;
    const {topTbodyData}=this.handleData(tableHData,tableData);
    const {date,titleGet} = this.state;
    const oldThData=tableData.thData.thDataAll;
    const oldThParent=tableData.thData.thParent;
    // const {tbodyData}=tableData;
    let newThData=['省份',"地市"];
    oldThData.map((item)=>{
      if(item.parentId==="-1"){
        newThData.push(item.name);
      }
      for(let i=0;i<oldThParent.length;i++){
        if(item.parentId===oldThParent[i].id){
          newThData.push(`${oldThParent[i].name}-${item.name}`);
        }
      }
      return null
    });
    // 拼表体
    const  tableValues = [];

    topTbodyData.map((item)=>{
      const  tableValue = [];
      tableValue[0] =item.name;
      tableValue[1] =item.name;
      for(let k=0;k<item.values.length;k+=1){
        tableValue[k+2] = item.values[k]
      }
      tableValues.push(tableValue);

      if(item.children&&item.children.length>0){
        item.children.map((children)=>{
          const  tableValueChild = [];
          tableValueChild[0] =item.name;
          tableValueChild[1] =children.name.replace(/(^\s*)|(\s*$)/g,'');
          for(let k=0;k<children.values.length;k+=1){
            tableValueChild[k+2] = children.values[k]
          }
          tableValues.push(tableValueChild)
        })
      }
    });
    // console.log("tableValues")
    // console.log(tableValues)

    const condition = {
      name: titleGet,
      value: [
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
      ],
    };
    const table = {
      title: [
        newThData
      ],
      value:tableValues
    };
    const newJson= {
     fileName: titleGet,
     condition,
     table
    };
    return newJson
  };

  // 设置最大账期
  disabledEndDate=(current)=>{

    const {indexDate}=this.props;

    return current && current > moment(indexDate).valueOf();
  };

  render(){
    const {date,markTypeGet,titleGet,dateType,dateFormat,isDownloadShow,tableState,tableAllOpen,expandedRowKeys} = this.state;
    const {indexDetailsShow,tableHData,tableData} = this.props;
    const {columns,topTbodyData}=this.handleData(tableHData,tableData);
    if (date === ''){
      return null;
    }

    const disabledStartDate=(current)=>current && current > moment(date);

    const sw= window.screen.width; // 获取屏幕宽度
    let tableWidth = 180;
    // let tableWidth = 180; // 1870
    // if(sw >= 700 && sw<960){// 800
    //   tableWidth = 150
    // }else if(sw >= 961 && sw<1100){ // 1024
    //   tableWidth = 150
    // }else if(sw >= 1101 && sw<1315){ // 1240
    //   tableWidth = 160
    // }else if(sw >= 1316 && sw<1389){// 1366
    //   tableWidth = 170
    // }else if(sw >= 1390 && sw<1869){// 1440
    //   tableWidth = 170
    // }
    const downloadParam={
      name:titleGet,
      "dateType":dateType,
      markType:markTypeGet,
      // moduleId:"",
    };
    const { MonthPicker } = DatePicker;
    const {iconExplainContent}=this.state;
    let dateComponent=null;
    const triangle = <i className={styles.dateTriangle} />
    if(date){
      if(dateFormat==='YYYY-MM-DD'){
        dateComponent= <DatePicker
          format={dateFormat}
          onChange={this.onChangeDate}
          // disabledDate={disabledStartDate}
          disabledDate={this.disabledEndDate}
          showToday={false}
          defaultValue={moment(date,dateFormat)}
          allowClear={false}
          // suffixIcon={triangle}
        />
      }else{
        dateComponent=   <MonthPicker
          suffixIcon={triangle}
          disabledDate={this.disabledEndDate}
          defaultValue={moment(date)}
          locale={moment.locale('zh-cn')}
          allowClear={false}
          onChange={this.onChangeDate}
          placeholder="Select month"
          monthCellContentRender={(current) =>
            (
              <div title={`${current.month()+1}月`}>
                {`${current.month()+1}月`}
              </div>
            )
          }
        />
      }
    }
    return(
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <Row>
              <Col md={24}>
                <div style={{display:indexDetailsShow}}>
                  <IndexDetails />
                </div>
                <div className={styles.mainTitle}>
                  {titleGet}
                  <span className={styles.tipsIcon}>
                    <img src={tipsIcon} alt="" onClick={()=>this.showDetails()} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex} />
                    {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
                  </span>
                </div>
                <div className={styles.menu}>
                  <div className={styles.citySelect}>
                    <ProCity markType={markTypeGet} />
                  </div>
                  <div className={styles.dateSelector}>
                    <span className={styles.menuTitle}>
                      日期：
                    </span>
                    {dateComponent}
                  </div>
                  <Button className={styles.button} onClick={this.download}>下载</Button>
                  <Button className={styles.button} onClick={()=>this.fetTable()}>查询</Button>
                </div>
                <div className={styles.mainContent}>
                  <div className={styles.mainTop}>
                    <div className={styles.tableTitle}>数据情况概览</div>
                    <Checkbox onChange={this.allOpen} className={styles.allOpen} checked={tableAllOpen}>全部展开</Checkbox>
                  </div>
                  <Table
                    {...tableState}
                    onExpand={this.onExpend}
                    className={styles.table}
                    columns={columns}
                    dataSource={topTbodyData}
                    expandedRowKeys={expandedRowKeys}
                    scroll={{ x: (tableWidth*(tableHData===undefined?5:tableHData.thDataAll.length))  }}
                  />
                </div>
                <DevelopPop />
              </Col>
            </Row>
          </Card>
          <DownloadAll
            downloadParam={downloadParam}
            visible={isDownloadShow}
            indexTypeVisible={false}
            onCancel={this.downloadClose}
          />
        </Fragment>
      </PageHeaderWrapper>
    )
  }

}

export default IceCreamRoam;
