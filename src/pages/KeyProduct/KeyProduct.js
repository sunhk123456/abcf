/* eslint-disable react/button-has-type,import/no-duplicates,react/destructuring-assignment,global-require,prefer-template,import/no-dynamic-require,arrow-body-style,import/order,react/no-array-index-key,no-else-return,prefer-const,no-param-reassign,no-unused-vars,array-callback-return,react/no-unused-state,prefer-destructuring,no-plusplus,no-restricted-syntax,react/jsx-boolean-value,jsx-a11y/mouse-events-have-key-events,object-shorthand,operator-assignment,dot-notation,no-lonely-if,no-unneeded-ternary,guard-for-in */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 专题-重点产品攻坚页面/p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author wangjian
 * @date 2019/1/24
 */
import React,{ PureComponent } from 'react';
// import {MiniBar,TimelineChart} from '@/components/Charts';
import DownloadFile from "@/utils/downloadFile";
import DownloadAll from '../../components/DownloadAll/downloadAll';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProvinceCity from '../../components/Until/proCity';
import EmbedLineChart from "../../components/Echart/specialTableEmbedLineChart/specialTableEmbedLineChart";
import EmbedHistogram from "../../components/Echart/specialTableEmbedHistogram/specialTableEmbedHistogram";
import EarlyWarning from "../../components/DayOverView/earlyWarning";
import router from 'umi/router';
import { Pagination, Icon, message,Tree,Button,Input,Form,Select,Table,Row,Col,Menu,Dropdown,Checkbox,Radio,Tooltip,DatePicker,Modal } from 'antd';
import { connect } from 'dva/index';
import styles from './KeyProduct.less';
import foldTableCss from "./another.less";
import iconFont from '../../icon/Icons/iconfont';
import moment from 'moment';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});
const FormItem = Form.Item;
let clearLove=0;
let clearLoveTable=[];

@Form.create()
@connect(({ KeyProductData, loading }) => ({
  KeyProductData,
  loading: loading.models.KeyProductData,
  tableDataGet:KeyProductData.tableData,
}))
@connect(({ proCityModels, loading }) => ({
  proCityModels,
  loading: loading.models.proCityModels,
}))

class Exception extends PureComponent {
  constructor(props) {
    super(props);
    const { location} = this.props;
    this.state = {
      areaData:[],
      area1Display:false,
      cityDisplay:false,
      markId:location.state.id,// 当前的专题id
      defaultArea:"", // 省份默认值
      dateType:location.state.dateType, // 区分日报月报
      defaultCity:'', // 地市默认值
      areaId:location.state.dimension!==undefined?location.state.dimension[0].provId:"111", // 省份id值
      cityId:location.state.dimension!==undefined?location.state.dimension[0].cityId:"-1" ,// 地市id值
      maxDate:'',// 日期最大可选值
      currentDate:location.state.dimension!==undefined?location.state.dimension[0].date:"", // 当前日期值
      buttonConditions:[], // 按钮筛选条件
      buttonChoose:[
      ], // 按钮的初始选定状态,二维数组代表呈现在页面中的第几行的第几个按钮
      testNum:1, // 用来解决setState的异步刷新问题
      tableData:{
        thData:[]
      },
      defaultExpandedRowKeys:[], // 默认的表格展开行
      HandleTableData:[],  // 存放经过处理后的表格数据
      currentLevel:'', // 当前的单位列的level值
      maxLevel:'', // 当前单位列的可选择的最大level值
      minLevelL:'', // 当前单位列的可选值的最小level值（最大最小值去控制该列表头按钮的是否禁用）
      loading:false, // 控制表格的加载状态
      showButton:false, // 控制按钮筛选条件的展开与否
      tableTab:[], // 切换当前表格的Tab数据
      currentTab:'',// 表格切换栏的当前tab
      indexDetailData:[], // 专题页面内指标详细解释表格数据
      column:[],  // 详细解释表格列
      dataForTable:[], // 详细解释表格数据
      seeDetail:false, // 控制详细解释表格弹窗的可见性
      DownloadAllVisible:false, // “下载全部”组件的可见性
      tableAllOpen:true,
      OldData:[], // 存放最初的表格数据
      allOpenKeys:[] // 全部展开的所有keys
    }
  }

  componentWillMount() {
    const { dispatch,location} = this.props;
    const {markId,areaId,cityId,currentDate,dateType}=this.state;
    let thTitle;
    let tableList;
    let i=0;
    let NewButtonChoose=[];
    // 请求省份信息
    dispatch({
      type: 'KeyProductData/fetchProvince',
      payload: {
        markType: markId
      },
      callback: e => {
        this.setState({
          areaData:e,
          defaultArea:e[0].proName,
          defaultCity:e[0].proName,
        })
      },
    });
    // 请求最大日期
    dispatch({
      type: 'KeyProductData/fetchMaxDate',
      payload: {
        markType: markId,
        dateType: dateType,
        tabId: ""
      },
      callback: e => {
        this.setState({
          maxDate:e.date,
          currentDate:e.date
        })
      },
    });
    // 请求按钮筛选条件
    dispatch({
      type: 'KeyProductData/fetchButtonCondition',
      payload: {
        markType: markId,
        tabId: ""
      },
      callback: e => {
        if(e.length>0) {
          for (i = 0; i < e.length;i++) {
          NewButtonChoose[i]=[true];
          }
        }
        this.setState({
          buttonConditions:e,
          buttonChoose:NewButtonChoose
        })
      },
    });
    // 请求主表格
    dispatch({
      type: 'KeyProductData/fetchTable',
      payload: {
        markType:markId,
        provinceId:areaId,
        cityId:cityId,
        date:currentDate,
        moduleId:"",
        dateType:dateType,
        dimension:[],
        unitLevel:"",
      },
      callback: e => {
        const guodu=e;
        clearLoveTable=this.dataHandleFun(guodu);
        this.setState({
          tableData:e,
          currentLevel:e.unitSwitch.useUnit,
          minLevel:e.unitSwitch.minUnit,
          maxLevel:e.unitSwitch.maxUnit
        })
      },
    });
    // 请求主表格切换（tab）栏数据
    dispatch({
      type: 'KeyProductData/fetchModule',
      payload: {
        markType: markId,
      },
      callback: e => {
        this.setState({
          tableTab:e,
          currentTab:e[0].tabId
        })
      },
    });
    // 请求指标详细解释弹窗表格数据
    dispatch({
      type: 'KeyProductData/fetchIndexDetail',
      payload: {
        markType: markId,
      },
      callback: e => {
        thTitle=e.thData;
        tableList=e.tbodyData;
        this.createColumn(thTitle);
        this.createTableList(tableList);
      },
    });
  }

  componentWillReceiveProps(nextprops){
    const { location,dispatch} = this.props;
    if(nextprops.location.state!==location.state) {
      let newData = nextprops.location.state;
      const markId = newData.id;
      const areaId = newData.dimension !== undefined ? newData.dimension[0].provId : "111";
      const cityId = newData.dimension !== undefined ? newData.dimension[0].cityId : "-1";
      const currentDate = newData.dimension !== undefined ? newData.dimension[0].date : "";
      const dateType = newData.dateType;
      let thTitle;
      let tableList;
      let i = 0;
      let NewButtonChoose = [];
      // 请求省份信息
      dispatch({
        type: 'KeyProductData/fetchProvince',
        payload: {
          markType: markId
        },
        callback: e => {
          this.setState({
            areaData: e,
            defaultArea: e[0].proName,
            defaultCity: e[0].proName,
          })
        },
      });
      // 请求最大日期
      dispatch({
        type: 'KeyProductData/fetchMaxDate',
        payload: {
          markType: markId,
          dateType: dateType,
          tabId: ""
        },
        callback: e => {
          this.setState({
            markId:markId,
            dateType:dateType,
            maxDate: e.date,
            currentDate: e.date
          })
        },
      });
      // 请求按钮筛选条件
      dispatch({
        type: 'KeyProductData/fetchButtonCondition',
        payload: {
          markType: markId,
          tabId: ""
        },
        callback: e => {
          if (e.length > 0) {
            for (i = 0; i < e.length; i++) {
              NewButtonChoose[i] = [true];
            }
          }
          this.setState({
            markId:markId,
            buttonConditions: e,
            buttonChoose: NewButtonChoose
          })
        },
      });
      // 请求主表格
      dispatch({
        type: 'KeyProductData/fetchTable',
        payload: {
          markType: markId,
          provinceId: areaId,
          cityId: cityId,
          date: currentDate,
          moduleId: "",
          dateType: dateType,
          dimension: [],
          unitLevel: "",
        },
        callback: e => {
         const guodu=e;
          clearLoveTable=this.dataHandleFun(guodu);
          this.setState({
            markId:markId,
            areaId:areaId,
            cityId:cityId,
            currentDate:currentDate,
            dateType:dateType,
            tableData: e,
            currentLevel: e.unitSwitch.useUnit,
            minLevel: e.unitSwitch.minUnit,
            maxLevel: e.unitSwitch.maxUnit
          })
        },
      });
      // 请求主表格切换（tab）栏数据
      dispatch({
        type: 'KeyProductData/fetchModule',
        payload: {
          markType: markId,
        },
        callback: e => {
          this.setState({
            markId:markId,
            tableTab: e,
            currentTab: e[0].tabId
          })
        },
      });
      // 请求指标详细解释弹窗表格数据
      dispatch({
        type: 'KeyProductData/fetchIndexDetail',
        payload: {
          markType: markId,
        },
        callback: e => {
          thTitle = e.thData;
          tableList = e.tbodyData;
          this.createColumn(thTitle);
          this.createTableList(tableList);
        },
      });
    }
  }

  // 创造指标详细解释的列信息
  createColumn=(thTitle,checkValues)=>{
    const columns=[];
    let i=0;
    let j=0;
    let currentWidth="160";
    let state=false;
      for(i=0;i<thTitle.length;i++){
        switch (i){
          case 0:
            currentWidth="10%";
            break;
          case 1:
            currentWidth="20%";
            break;
          case 2:
            currentWidth="20%";
            break;
          case 3:
            currentWidth="50%";
            break;
          default:
            break;
        }
        columns.push({
          title: thTitle[i],
          dataIndex: i+"table",
          width:currentWidth,
          key:i+"table",
          align: 'center',
          render: text => (
            <span title={text}>
              {text}
            </span>
          ),
        });
        state=false;
      }
    this.setState({
      column:columns,
    })
  }

  // 创建指标详细解释表格内的表数据
  createTableList=(tableList)=>{
    let i=0;
    let j=0;
    let dataSource=[];
    let test={};
    for(i=0;i<tableList.length;i++){
      for(j=0;j<tableList[i].length;j++){
        test[j+"table"]=tableList[i][j];
      }
      dataSource.push(test);
      test={};
    }
    this.setState({
      dataForTable:dataSource,
    })
  }

  // 利用给出的按钮筛选条件数据，创造出若干行按钮的样式
  createButtonCondition=(buttonsData,choose)=>{
    let i=0;
    let j=0;
    let buttonChild=[];
    let buttonAll=[];
    for(i=0;i<buttonsData.length;i++){
      for(j=0;j<buttonsData[i].values.length;j++){
        buttonChild.push(
          <span style={{display:'inline-block',cursor:'pointer',textAlign:'center'}} title={i.toString()+j.toString()} className={choose[i][j]===true?styles.btnStyleChoosed:styles.btnStyle} id={buttonsData[i].screenTypeId+buttonsData[i].values[j].sid} onClick={this.onClickButtonCon}>
            {buttonsData[i].values[j].sname}
          </span>
          );
      }
      buttonAll.push(<div className={styles.btnDiv}>{buttonsData[i].screenTypeName+":"}{buttonChild}</div>);
      buttonChild=[];
    }
    return buttonAll;
  }

  // 创造当前选定的文字按钮筛选条件
  createButtonConditionNames=(buttonsData,choose)=>{
    let i=0;
    let j=0;
    let buttonChild=[];
    let buttonAll=[];
    for(i=0;i<buttonsData.length;i++){
      buttonChild.push(buttonsData[i].screenTypeName);
      for(j=0;j<buttonsData[i].values.length;j++){
        if(choose[i][j]===true){
          buttonChild.push(buttonsData[i].values[j].sname);
        }
      }
      buttonAll.push(buttonChild);
      buttonChild=[];
    }
    return buttonAll;
  }

  // 按钮筛选条件点击
  onClickButtonCon=(e)=>{
    const {buttonChoose,testNum}=this.state;
    let newButtonChoose=buttonChoose;
    let allNotChooseState=false; // 除了全部按钮外的所有按钮存在着选中状态标志
    let i=0;
     let lineNumber=Number(e.target.title.substr(0,1));
    let SpanNumber=Number(e.target.title.substr(1,1));
     if(SpanNumber===0){
       for(i=0;i<newButtonChoose[lineNumber].length;i++){
         if(i===0){
           newButtonChoose[lineNumber][i]=true;
         }
         else {
           newButtonChoose[lineNumber][i]=false;
         }
       }
     }
    else {
      newButtonChoose[lineNumber][SpanNumber] = newButtonChoose[lineNumber][SpanNumber] === true ? "" : true;
       newButtonChoose[lineNumber][0]="";
     }
     for(i=1;i<newButtonChoose[lineNumber].length;i++){
       if(newButtonChoose[lineNumber][i]===true){
         allNotChooseState=true;
       }
     }
     if(allNotChooseState===false){
       newButtonChoose[lineNumber][0]=true;
     }
    this.setState({
      buttonChoose:newButtonChoose,
      testNum:testNum+1
    })
  }

  // 创造省份div单选按钮的方法
  createProvince=(areaData)=>{
    let i=0;
    let radioChild=[];
    let radioAll;
    if(areaData.length>0){
      for(i=0;i<areaData.length;i++){
          radioChild.push(
            <Tooltip title={areaData[i].proName} placement="top">
              <Radio.Button value={areaData[i].proId}>{areaData[i].proName}</Radio.Button>
            </Tooltip>
          );
      }
      radioAll=(
        <Radio.Group onChange={this.radioOnChange} defaultValue={areaData[0].proName} buttonStyle="solid">
          {radioChild}
        </Radio.Group>
      );
    }
    return radioAll;
  }

  // 创造地市div单选按钮的方法
  createCity=(province,areaData)=>{
    let i=0;
    let radioChild=[];
    let radioAll;
    let cityData=null;
    for(i=0;i<areaData.length;i++){
      if(areaData[i].proName===province){
        cityData=areaData[i].city;
      }
    }
    if(cityData!==null){
      cityData.map((item,index)=>{
        radioChild.push(
          <Tooltip title={item.cityName} placement="top">
            <Radio.Button onMouseOver={this.test} title={item.cityName} value={item.cityId}>{item.cityName.substr(0,4)}</Radio.Button>
          </Tooltip>
        );
      })
      radioAll=(
        <Radio.Group onChange={this.radioCityOnChange} defaultValue={areaData[0].proName} buttonStyle="solid">
          {radioChild}
        </Radio.Group>
      );
    }
    return radioAll;
  }

  test=()=>{
    console.info("事件触发");
  }

  // 控制省份下拉展示区域的可见性
  seeFirstArea=()=>{
    const {area1Display}=this.state;
    this.setState({
      area1Display:!area1Display
    })
  }

  // 控制地市下拉展示区域的可见性
  seeSecondArea=()=>{
    const {cityDisplay}=this.state;
    this.setState({
      cityDisplay:!cityDisplay
    })
  }

  // 隐藏省市单选按钮div的方法
  notSeeFirstArea=()=>{
    this.setState({
      area1Display:false
    })
  }

  notSeeSecondArea=()=>{
    this.setState({
      cityDisplay:false
    })
  }

  // 省市单选按钮触发事件
  radioOnChange=(e)=> {
    const {areaData}=this.state;
    let i=0;
    let provinceName;
    for(i=0;i<areaData.length;i++){
      if(areaData[i].proId===e.target.value){
        provinceName=areaData[i].proName;
      }
    }
    this.setState({
      defaultArea:provinceName,
      defaultCity:provinceName,
      areaId:e.target.value,
      cityId:'-1' // 地市id值
    });
  }

  // 地区单选按钮触发事件
  radioCityOnChange=(e)=> {
   this.setState({
     defaultCity:e.target.title,
     cityId:e.target.value
   })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  // 不可选定的时间
  disabledDate=(current)=> {
    const {maxDate}=this.state;
    return current && current > moment(maxDate, 'YYYY-MM-DD');
  }

  onDateChange=(date, dateString)=> {
    this.setState({
      currentDate:dateString
    })
  }

  // 利用当前按钮筛选条件的状态生成当前用于请求接口时的筛选条件格式
  createButtonConditionForSearch=()=>{
    const {buttonChoose,buttonConditions}=this.state;
    let i=0;
    let j=0;
    let k=0;
    let condition=[{1:[]},{2:[]},{3:[]}];
   if(buttonConditions.length>0){
     for(i=0;i<buttonChoose.length;i++){
       for(j=0;j<buttonChoose[i].length;j++){
         if(buttonChoose[i][j]===true){
           condition[i][i+1][k]=buttonConditions[i].values[j].sid;
           k++;
         }
       }
       k=0;
     }
   }
else{
     condition=[];
   }
    return condition;
  }

  // 点击查询按钮进行调用，得到并生成新的表格
search=()=>{
    const {
      dateType,markId,areaId,cityId,currentDate,buttonConditions,buttonChoose,currentLevel,currentTab
    }=this.state;
    const{proCityModels}=this.props;
    this.setState({
      loading:true,
      areaId:proCityModels.selectPro.proId,
      cityId:proCityModels.selectCity.cityId,
    });
  const { dispatch} = this.props;
  const buttonCon=this.createButtonConditionForSearch();
  dispatch({
    type: 'KeyProductData/fetchTable',
    payload: {
      markType:markId,
      provinceId:proCityModels.selectPro.proId,
      cityId:proCityModels.selectCity.cityId,
      date:currentDate,
      moduleId:currentTab,
      dateType:dateType,
      dimension:buttonCon,
      unitLevel:""
    },
    callback: e => {
      const guodu=e;
     this.dataHandleFun(guodu);
      this.setState({
        tableData:e,
        currentLevel:e.unitSwitch.useUnit,
        minLevel:e.unitSwitch.minUnit,
        maxLevel:e.unitSwitch.maxUnit,
        loading:false,
      })
    },
  });
}

// 单位切换按钮（区分左右）点击，得到并生成新的表格
unitButtonClick=(direction)=>{
  const {
    dateType,markId,areaId,cityId,currentDate,buttonConditions,buttonChoose,currentLevel,currentTab
  }=this.state;
  this.setState({
    loading:true
  });
  const { dispatch} = this.props;
  const buttonCon=this.createButtonConditionForSearch();
  if(direction==="left"){
    dispatch({
      type: 'KeyProductData/fetchTable',
      payload: {
        markType:markId,
        provinceId:areaId,
        cityId:cityId,
        date:currentDate,
        moduleId:currentTab,
        dateType:dateType,
        dimension:buttonCon,
        unitLevel:(Number(currentLevel)-1).toString()
      },
      callback: e => {
        const guodu=e;
        this.dataHandleFun(guodu);
        this.setState({
          tableData:e,
          currentLevel:e.unitSwitch.useUnit,
          minLevel:e.unitSwitch.minUnit,
          maxLevel:e.unitSwitch.maxUnit,
          loading:false
        })
      },
    });
  }
  if(direction==="right"){
    dispatch({
      type: 'KeyProductData/fetchTable',
      payload: {
        markType:markId,
        provinceId:areaId,
        cityId:cityId,
        date:currentDate,
        moduleId:currentTab,
        dateType:dateType,
        dimension:buttonCon,
        unitLevel:(Number(currentLevel)+1).toString()
      },
      callback: e => {
        const guodu=e;
        this.dataHandleFun(guodu);
        this.setState({
          tableData:e,
          currentLevel:e.unitSwitch.useUnit,
          minLevel:e.unitSwitch.minUnit,
          maxLevel:e.unitSwitch.maxUnit,
          loading:false
        })
      },
    });
  }
}

// 辅助于dataHandleFun函数用来讲请求到的数据进行处理，得到适用于antDesign表格的数据形式
  getTrees=(list, parentId)=> {
    let items = {};
    // 获取每个节点的直属子节点，记住是直属，不是所有子节点
    for (let i = 0; i < list.length; i++) {
      let key = list[i].ElderId;
      if (items[key]) {
        items[key].push(list[i]);
      } else {
        items[key] = [];
        items[key].push(list[i]);
      }
    }
    return this.formatTree(items, parentId);
  }

  // 辅助于dataHandleFun函数用来讲请求到的数据进行处理，得到适用于antDesign表格的数据形式
  formatTree=(items, parentId)=> {
    const {areaId}=this.state;
    let defaultExpandedRowKeys = [];
    let result = [];
    if (!items[parentId]) {
      return result;
    }
    for (let t of items[parentId]) {
      // 把数组中的数据遍历出来
      t.kpiValues.map((data, index) => {
        t["value" + index] = data;
      });
      let space = "";
      for (let i = 0; i < t.space; i++) {
        space = space + "\u3000"; // 加全角空格 增加缩进
      }
      t.space2 = space;
      t.key = t.kpiId;
      // 创建一个children字段
      let childrenData = this.formatTree(items, t.kpiId);
      if (childrenData.length > 0) {
        t.children = childrenData;
      }
      // 判断是否需要默认展开
      if (t.isShow !== 0) {
        defaultExpandedRowKeys.push(t.kpiId+areaId);
      }
      result.push(t);
    }
    return result;
  }

  // 将表格数据处理得到适用于antDesign表格的数据形式
  dataHandleFun=(tableData)=> {
    const {areaId}=this.state;
    let tbodyData = tableData.tbodyData; // 表格数据体数据
    let oldTbodyData=tbodyData;
    let allOpenKey=[];
    let i=0;
    let j=0;
    let k=0;
    /**
     * 树状的算法
     * @params list     代转化数组
     * @params parentId 起始节点
     */

    /**
     * 利用递归格式化每个节点
     */
    let HandleTableData = this.getTrees(tbodyData, -1);
    for(i=0;i<HandleTableData.length;i++){
      const OneData=HandleTableData[i];
      let dataForPicrure=[];
      let dataForZhu=[];
      if(OneData.format.length>0){
        if(OneData.format[0].type.length>0){
          HandleTableData[i]={
            ...HandleTableData[i],
            embedLine:OneData.format[0].lineChartData
          }
        }
        if(OneData.format[1].type.length>0){
          HandleTableData[i]={
            ...HandleTableData[i],
            histogram:OneData.format[1].histogramData
          }
        }
        HandleTableData[i]=this.createChartDataForChildren(HandleTableData[i]);
      }
    }
    HandleTableData=this.makeNewKpiId(HandleTableData);
   allOpenKey=this.makeAllOpenKey(HandleTableData);
    this.setState({
      HandleTableData:HandleTableData,
      OldData:HandleTableData,
      defaultExpandedRowKeys:allOpenKey,
      allOpenKeys:allOpenKey
    });
    HandleTableData=this.hideDownArrow(HandleTableData);
    return HandleTableData;
  }

  // 拼接默认的key值
  makeAllOpenKey=(tbodyData)=>{
    let k=0;
    let i=0;
    let defaultExpandedRowKeys = [];
    let allOpenKey=[];
    for(k=0;k<tbodyData.length;k++){
      if(tbodyData[k].children!==undefined&&tbodyData[k].children.length>0){
        const oneKey=tbodyData[k].kpiId;
        allOpenKey.push(oneKey);
        const secondKey=this.makeAllOpenKey(tbodyData[k].children);
        if(secondKey.length>0){
          for(i=0;i<secondKey.length;i++){
            allOpenKey.push(secondKey[i]);
          }
        }
      }
    }
    return allOpenKey;
  }

  // 为当前数据拼接新的kpiId
  makeNewKpiId=(data)=>{
    const {areaId}=this.state;
    let i=0;
    let newData=data;
    for(i=0;i<data.length;i++){
      newData[i].kpiId=newData[i].kpiId+areaId;
      newData[i].key=newData[i].key+areaId;
      if(newData[i].children!==undefined&&newData[i].children.length>0){
        newData[i].children=this.makeNewKpiId(newData[i].children);
      }
    }
    return newData;
  }

  createDownData=(tableData)=> {
    let tbodyData = tableData.tbodyData; // 表格数据体数据
    let p=0;
    if(tbodyData!==undefined){
      for(p=0;p<tbodyData.length;p++){
        tbodyData[p].ElderId="-1";
      }
    }
    let defaultExpandedRowKeys = [];
    let i=0;
    let j=0;
    let k=0;
    /**
     * 树状的算法
     * @params list     代转化数组
     * @params parentId 起始节点
     */

    /**
     * 利用递归格式化每个节点
     */
    let HandleTableData = this.getTrees(tbodyData, -1);
    for(i=0;i<HandleTableData.length;i++){
      const OneData=HandleTableData[i];
      let dataForPicrure=[];
      let dataForZhu=[];
      if(OneData.format.length>0){
        if(OneData.format[0].type.length>0){
          HandleTableData[i]={
            ...HandleTableData[i],
            embedLine:OneData.format[0].lineChartData
          }
        }
        if(OneData.format[1].type.length>0){
          for(j=1;j<OneData.format[1].histogramData.value.length;j++){
            dataForZhu.push({
              x:j,
              y:OneData.format[0].histogramData.value[j-1]
            })
          }
          HandleTableData[i]={
            ...HandleTableData[i],
            histogram:dataForZhu
          }
        }
        HandleTableData[i]=this.createChartDataForChildren(HandleTableData[i]);
      }
      HandleTableData[i].kpiName=HandleTableData[i].areaName;
    }
    for(i=0;i<HandleTableData.length;i++){
      HandleTableData[i].parentKpiId=HandleTableData[i].kpiId+HandleTableData[i].parentId;
      HandleTableData[i].kpiId=HandleTableData[i].kpiId+HandleTableData[i].areaNo;
      HandleTableData[i].key=HandleTableData[i].key+HandleTableData[i].areaNo;
      if(HandleTableData[i].areaNo!==undefined){
        if(HandleTableData[i].areaNo.length<=3){
          HandleTableData[i].margin='29px';
        }
        else if(HandleTableData[i].areaNo.length>3){
          HandleTableData[i].margin='58px';
        }
      }
      else{
        HandleTableData[i].margin='0px';
      }
    }
    return HandleTableData;
  }
  // 拼接单元格内特殊位置的样式，（值为正或负，相应为绿色增长，或是红色下降）

  rowClassNameHandle=(record)=> {
    let foldTableCss2 = foldTableCss;
    let format = record.format; // 判断颜色
    let classColorName = ""; // classname的拼接
    if (format!==undefined&&format.length > 0) {
      format.map((data, index) => {
        if (data.type.length > 0 && data.type[0] === "ratio") {
          if (data.ratio === -1) {
            let trRed = "trRed" + index;
            classColorName += foldTableCss[trRed] + " ";
          } else {
            let trGreen = "trGreen" + index;
            classColorName += foldTableCss[trGreen] + " ";
          }
        }
      });
    }
    return classColorName + foldTableCss["trStyle"];
  }

  // 将经过处理的表格数据的孩子进行递归处理，得到相应的数据格式（服务于呈现折线图）
  createChartDataForChildren=(oldData)=>{
    let newData=oldData;
    let i=0;
    let j=0;
    if(newData.children!==undefined){
      for(i=0;i<newData.children.length;i++){
        const OneData=newData.children[i];
        let dataForPicrure=[];
        let dataForZhu=[];
        if(OneData.format.length>0){
          if(OneData.format[0].type.length>0){
            newData.children[i]={
              ...newData.children[i],
              embedLine:OneData.format[0].lineChartData
            }
          }
          if(OneData.format[1].type.length>0){
            newData.children[i]={
              ...newData.children[i],
              histogram:OneData.format[1].histogramData
            }
            newData.children[i]=this.createChartDataForChildren(newData.children[i]);
          }
        }
      }
    }
    return newData;
  }

  // 对展开的行进行处理，将已被展开的行数据增加一个标识
  changeExpendState=(key,AllData,state)=>{
    let i=0;
    let newAllData=AllData;
    for(i=0;i<newAllData.length;i++){
      if(newAllData[i].kpiId===key){
        newAllData[i].haveExpended=state;
        break;
      }
      else if(newAllData[i].children!==undefined){
          newAllData[i].children=this.changeExpendState(key,newAllData[i].children,state);
          if(newAllData[i].children!==AllData[i].children){
            break;
          }
        }
    }
    return newAllData;
  }

  // 改变表格的默认展开行
  changeExpandedRowKeys=(expanded, record)=> {
    const {defaultExpandedRowKeys,testNum,HandleTableData}=this.state;
    let newHandleTableData=HandleTableData;
    let key = record.kpiId;
    let expandedRowKeys = defaultExpandedRowKeys;
    if(expanded===true){
      newHandleTableData=this.makeUpData(newHandleTableData,newHandleTableData,key)
      newHandleTableData=this.changeExpendState(key,newHandleTableData,true);
    }
    else if(expanded===false){
      newHandleTableData=this.changeExpendState(key,newHandleTableData,false);
    }
    if (expandedRowKeys.length > 0 && !expanded) {
      if (record.children !== undefined) {
        let res = this.getChildrenRowKeys(record.children);
        res.map(item => {
          let index = expandedRowKeys.indexOf(item);
          if (index !== -1) {
            expandedRowKeys.splice(index, 1);
          }
        });
      }
      let index = expandedRowKeys.indexOf(key);
      expandedRowKeys.splice(index, 1);
    }
    if (expanded) {
      expandedRowKeys.push(key);
    }
    this.setState({
      defaultExpandedRowKeys: expandedRowKeys,
      HandleTableData:newHandleTableData,
      testNum:testNum+1
    });
  }

  // 表格某行的子展开行处理
  getChildrenRowKeys=(children)=> {
    let res = [];
    children.map((item, index) => {
      if (item.children !== undefined) {
        this.getChildrenRowKeys(item.children);
      } else {
        res.push(item.kpiId);
      }
    });
    return res;
  }

  // 控制按钮筛选条件的展示与否
  changeButtonShow=()=>{
    const {showButton}=this.state;
    this.setState({
      showButton:!showButton
    })
  }

  // 点击表格切换Tab的函数
  tabChange=(e)=>{
    const tab=e.target.id;
    const {
      dateType,markId,areaId,cityId,currentDate,buttonConditions,buttonChoose,currentLevel,currentTab
    }=this.state;
    this.setState({
      loading:true
    });
    const { dispatch} = this.props;
    const buttonCon=this.createButtonConditionForSearch();
    dispatch({
      type: 'KeyProductData/fetchTable',
      payload: {
        markType:markId,
        provinceId:areaId,
        cityId:cityId,
        date:currentDate,
        moduleId:e.target.id,
        dateType:dateType,
        dimension:buttonCon,
        unitLevel:""
      },
      callback: e1 => {
        const guodu=e1;
        this.dataHandleFun(guodu);
        this.setState({
          tableData:e1,
          currentLevel:e1.unitSwitch.useUnit,
          minLevel:e1.unitSwitch.minUnit,
          maxLevel:e1.unitSwitch.maxUnit,
          loading:false,
          currentTab:tab
        })
      },
    });
  }

  // 让详细解释表格隔行变色
  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  }

  // 设置详细解释表格弹窗的可见性
  seeDetail=()=>{
    this.setState({
      seeDetail:true
    })
  }

  notSeeDetail=()=>{
    this.setState({
      seeDetail:false
    })
  }

  // 递归寻找请求到的数据的父级所属的kpiId，并对数据进行处理
  makeDownData=(oldData,newData,moreData)=>{
    let i=0;
    let j=0;
    let k=0;
    let final=newData;
    for (i = 0; i < oldData.length; i++) {
      if (moreData.length>0&&oldData[i].kpiId === moreData[0].parentKpiId) {
        final[i].expend=true;
        // 原表格数据向后延伸，留出空挡
        for (j = final.length - 1; j > i; j--) {
          final[j + moreData.length] = final[j];
        }
        // 将新数据插入，填补空挡
        for(k=0;k<moreData.length;k++){
          final[i+1+k]=moreData[k];
        }
        break;
      }
      else if(oldData[i].children!==undefined){
          final[i].children=this.makeDownData(oldData[i].children,oldData[i].children,moreData);
        if(final[i].children!==oldData[i].children){
          break;
        }
        }
    }
    return final;
  }

  // 递归寻找收起箭头的kpiId所在处，并对数据进行相应处理
  makeUpData=(oldData,newData,ID)=>{
    let num=0;
    let i=0;
    let j=0;
    let k=0;
    let final=newData; // 处理后的最终返回值
    for(i=0;i<oldData.length;i++){
      if(final[i].kpiId===ID){
        final[i].expend=false;
        if(final[i].areaNo===undefined){
          for (j=i;j<final.length-1;j++){
            if(final[j+1].areaNo!==undefined){
              num=num+1;
            }
            else {
              break;
            }
          }
        }
        else if(final[i].areaNo!==undefined){
          for (j=i;j<final.length-1;j++){
            if(final[j+1].parentKpiId!==undefined&&final[j+1].parentKpiId===ID){
              num=num+1;
            }
            else {
              break;
            }
          }
        }
        for(k=1;k<num+1;k++){
          final[i+k]=final[i+k+num];
        }
        final.splice(i+1,num);
        break;
      }
      else if(oldData[i].children!==undefined&&oldData[i].children.length>0){
          final[i].children=this.makeUpData(oldData[i].children,oldData[i].children,ID);
          if(final[i].children!==oldData[i].children){
            break;
          }
        }
    }
    return final;
  }

  // 点击表格内的向下展开箭头图标
  clickDownShow=(direction,ID,areaID)=> {
    this.setState({
      loading:true
    });
    let i = 0;
    let j = 0;
    let k=0;
    let p=0;
    let dataOFTable = [];
    const {dateType,HandleTableData, testNum,markId, areaId,cityId,currentDate,currentLevel,currentTab} = this.state;
    let newHandleTableData = HandleTableData;
    const buttonCon=this.createButtonConditionForSearch();
    const {dispatch} = this.props;
    if(direction==="down"){
      const type12138='KeyProductData/fetchDownArrow';
      dispatch({
        type: type12138,
        payload: {
          markType:markId,
          provinceId:areaID,
          cityId:cityId,
          date:currentDate,
          moduleId:currentTab,
          dateType:dateType,
          dimension:buttonCon,
          unitLevel:currentLevel,
          kpiId:ID.substr(0,9)
        },
        callback: e1 => {
          if(JSON.stringify(e1) === "{}"){
            message.info("下钻返回数据为空！");
            this.setState({
              testNum:testNum+1,
              loading:false
            })
          }else if(e1.thData!==undefined&&e1.thData.length>0){
            dataOFTable = this.createDownData(e1);
            newHandleTableData=this.makeDownData(HandleTableData,newHandleTableData,dataOFTable);
            this.setState({
              HandleTableData:newHandleTableData,
              testNum:testNum+1,
              loading:false
            })
          }else if(e1.thData===undefined){
            message.error("请求下钻数据失败！");
            this.setState({
              testNum:testNum+1,
              loading:false
            })
          }

        },
      });
      clearLove=clearLove+1;
    } else if(direction==="up"){
      let num=0;
      newHandleTableData=this.makeUpData(HandleTableData,newHandleTableData,ID);
      this.setState({
        HandleTableData:newHandleTableData,
        testNum:testNum+1,
        loading:false
      })
    }
  }

  // 点击表格的指标名字，或者是下钻表格的地市名字时，向指标详细信息页面的跳转
  clickForJump=(kpiId, dateType,proId,cityId)=>{
    const {markId,currentDate}=this.state;
    const {proCityModels}=this.props;
    const buttonCon=this.createButtonConditionForSearch();
    let newProId=proId;
    let newCityId=cityId;
    if(newCityId!==undefined&&newCityId.length<=3){
      newProId=newCityId;
      newCityId="-1";
    }
    else {
      newCityId=newCityId===undefined?proCityModels.selectCity.cityId:newCityId;
      newProId=newProId===undefined?proCityModels.selectPro.proId:newProId;
    }
    router.push({
      pathname: '/indexDetails',
      state: {
       dateType:dateType,
        id:kpiId,
        dimension:[
          {
            selectType:buttonCon,
            date:currentDate,
            provId:newProId,
            cityId:newCityId
          }
        ],
      },
    });
  }

  createDownLoadCurrent=()=>{
    const {location,proCityModels}=this.props;
    const {tableTab,currentTab,currentDate,buttonConditions,buttonChoose,HandleTableData,tableData}=this.state;
    const table = {
      title: [
        tableData.thData
      ],
      value:[],
    }
    let valueCurrent=[]; // 处理table中value的过渡值
    tableData.tbodyData.map((item,index)=>{
      valueCurrent.push(item.kpiName);
      valueCurrent.push(item.unit);
      if(item.kpiValues!==undefined&&item.kpiValues.length>0){
        for(let p=0;p<item.kpiValues.length;p++){
          valueCurrent.push(item.kpiValues[p]);
        }
      }
      table.value[index]=valueCurrent;
      valueCurrent=[];
    });
    let newJson={};
    let fileNameTab=null;
    for(let i=0;i<tableTab.length;i++){
      if(tableTab[i].tabId===currentTab){
        fileNameTab=tableTab[i].tabName;
      }
    }
    let conName=null;
    for(let k=0;k<tableTab.length;k++){
      if(tableTab[k].tabId===currentTab){
        conName= tableTab[k].tabName;
      }
    }
    let condition = {
      name: `${conName}`,
      value: [
        ["专题名称:",location.state.title ],
        ["筛选条件:"],
        ["日期:",currentDate ],
        ["省分:",proCityModels.selectPro.proName],
        ["地市:",proCityModels.selectCity.cityName ],
      ],
    }
    let buttonAll=this.createButtonConditionNames(buttonConditions,buttonChoose);
    if(buttonAll!==undefined&&buttonAll!==null&&buttonAll.length>0){
      for(let j=0;j<buttonAll.length;j++){
        condition.value.push(buttonAll[j]);
      }
    }
    newJson={
      fileName: location.state.title+"-"+fileNameTab,
      condition,
      table
    }
    return newJson;
  }

  clickDownLoad=()=>{
    DownloadFile(this.createDownLoadCurrent());
  }

  clickDownLoadAll=()=>{
    this.setState({
      DownloadAllVisible:true
    })
  }

  clickDownLoadAllClose=()=>{
    this.setState({
      DownloadAllVisible:false
    })
  }

  // 展开全部
  allOpen=()=> {
const {tableAllOpen,allOpenKeys,OldData}=this.state;
let changeToOldData=[];
let i=0;
changeToOldData=this.makeOldTable(OldData);
changeToOldData=this.changeExpend(changeToOldData);
if(tableAllOpen===true){
  changeToOldData=this.showDownArrow(changeToOldData);
  this.setState({
    tableAllOpen:!tableAllOpen,
    defaultExpandedRowKeys:[],
    HandleTableData:changeToOldData
  })
}
else if(tableAllOpen===false){
  changeToOldData=this.hideDownArrow(changeToOldData);
  this.setState({
    tableAllOpen:!tableAllOpen,
    defaultExpandedRowKeys:allOpenKeys,
    HandleTableData:changeToOldData
  })
}
  };

  // 将表格数据转化为无下钻的最初状态
  makeOldTable=(tableData)=>{
    let k=0;
    let i=0;
   let OldTable=tableData;
   if(OldTable!==undefined&&OldTable.length>0) {
     for (i = 0; i < OldTable.length; i++) {
       if (OldTable[i].areaNo !== undefined) {
         delete OldTable[i];
       }
       else {
         OldTable[i].children = this.makeOldTable(OldTable[i].children);
       }
     }
   }
   OldTable=this.deleteEmpty(OldTable);
    return OldTable;
  }

  // 将数组中删除元素的empty彻底去掉，即让数组的长度恢复
  deleteEmpty=(tableData)=>{
    let k=0;
    let i=0;
    let j=0;
    let first=[];
    let second=[];
    let OldTable=tableData;
    if (OldTable!==undefined) {
      for (i in OldTable) {
        first[k] = OldTable[i];
        k++;
      }
      OldTable = first;
      for (j = 0; j < OldTable.length; j++) {
        if (OldTable[j].children !== undefined) {
          OldTable[j].children = this.deleteEmpty(OldTable[j].children);
        }
      }
    }
    return OldTable;
  }

  // 在展开全部操作时，把表格的是否已展开标志expend置为false
  changeExpend=(tableData)=>{
    let k=0;
    let i=0;
    let OldTable=tableData;
    if(OldTable!==undefined) {
      for (i = 0; i < OldTable.length; i++) {
        if (OldTable[i].expend !== undefined) {
          OldTable[i].expend=false;
          if(OldTable[i].children!==undefined&&OldTable[i].children.length>0){
            OldTable[i].children = this.changeExpend(OldTable[i].children);
          }
        }
      }
    }
    return OldTable;
  }

  // 在展开全部时，将所有非叶子表格行数据的下钻按钮隐藏
  hideDownArrow=(tableData)=>{
    let k=0;
    let i=0;
    let OldTable=tableData;
    if(OldTable!==undefined) {
      for (i = 0; i < OldTable.length; i++) {
          if(OldTable[i].children!==undefined&&OldTable[i].children.length>0){
            OldTable[i].haveExpended=true;
            OldTable[i].children = this.hideDownArrow(OldTable[i].children);
          }
      }
    }
    return OldTable;
  }

  // 在展开全部收起时，将下钻按钮的隐藏机制还原
  showDownArrow=(tableData)=>{
    let k=0;
    let i=0;
    let OldTable=tableData;
    if(OldTable!==undefined) {
      for (i = 0; i < OldTable.length; i++) {
        if(OldTable[i].children!==undefined&&OldTable[i].children.length>0){
          OldTable[i].haveExpended=false;
          OldTable[i].children = this.showDownArrow(OldTable[i].children);
        }
      }
    }
    return OldTable;
  }

  render() {
    const {OldData,tableAllOpen,markId,DownloadAllVisible,dateType,seeDetail,column,dataForTable,tableTab,currentTab,showButton,defaultExpandedRowKeys,HandleTableData,tableData,areaData,area1Display,cityDisplay,defaultArea,defaultCity,areaId,cityId,maxDate,currentDate,buttonConditions,buttonChoose,testNum,loading,currentLevel,minLevel,maxLevel}=this.state;
    const{proCityModels,location}=this.props;
    let foldTableData = tableData; // 获取数据
    let handleTableData = HandleTableData; // 处理后的数据格式
    let columns=null;
    let controlDiv=null;
    let tableModuleTable=[];
    const downloadParam={
      name:location.state.title,
      dateType:dateType,
      markType:markId,
      moduleId:currentTab
    }
    if(!showButton){
      controlDiv=(
        <div className={styles.moreChoiceDiv} style={{display:'inline-block',cursor:buttonConditions.length>0?'pointer':'default',opacity:buttonConditions.length>0?1:0}} onClick={buttonConditions.length>0?this.changeButtonShow:null}>
          更多选项
          <Icon type="down" style={{color:'#C91717',paddingLeft:15,paddingRight:15}} />
        </div>
      )
    }
    else {
      controlDiv=(
        <div className={styles.commonFontSize} style={{display:'inline-block',cursor:'pointer'}} onClick={this.changeButtonShow}>
          收起
          <Icon type="up" style={{color:'#C91717',paddingLeft:15,paddingRight:15}} />
        </div>
      )
    }
    for(let k=0;k<tableTab.length;k++){
      tableModuleTable.push(
        <span className={tableTab[k].tabId===currentTab?styles.tabForTable:styles.tabForTableNotChoose} style={{color:tableTab[k].tabId===currentTab?'#C91717':'black',cursor:'pointer'}} id={tableTab[k].tabId} onClick={this.tabChange}>{tableTab[k].tabName}</span>
      )
    }
    const {
      form: { getFieldDecorator },
    } = this.props;
    const nash=this.createButtonConditionForSearch();
    let tableDown=null;
    let test;
    let firstArea; // 省份区域的组件
    let secondArea; // 地市区域的组件
    let buttonCondition; // 按钮筛选条件

    buttonCondition=this.createButtonCondition(buttonConditions,buttonChoose);
    if (foldTableData.thData.length>0) {
      let thData = foldTableData.thData; // 表头数据
      let ratioData = handleTableData[0].format; // 判断format ratio在第几列
      columns = [
        {
          title: <span style={{width:'100%',textAlign:'center'}}>{thData[0]}</span>,
          dataIndex: "kpiName",
          key: "kpiName",
          width:'35%',
          render: (text, record,xindex) => {
            return <span><span onClick={()=>this.clickForJump(record.kpiId.substr(0,9),"1",record.parentId,record.areaNo)} style={{paddingLeft:record.margin,cursor:'pointer'}} title={record.kpiDetail}>{record.space2 + text}</span><Button size="small" className={styles.clearLoveButton} id={xindex.toString()} style={{display:proCityModels.selectCity.cityId!=="-1"||(record.parentKpiId!==undefined&&record.downArrowState!=="true")||record.haveExpended===true?'none':'inline-block'}} onClick={()=>this.clickDownShow(record.expend===true?"up":"down",record.kpiId,record.parentId===undefined?proCityModels.selectPro.proId:record.areaNo)}><Icon type={record.expend===true?"caret-up":"caret-down"} /></Button></span>;
          }
        },
        {
          title: <span className={styles.btnUnitSpan}><Button size="small" className={styles.btnOfUnit} onClick={()=>this.unitButtonClick("left")} disabled={currentLevel===minLevel?true:false}><Icon type="caret-left" /></Button>{thData[1]}<Button size="small" className={styles.btnOfUnit} onClick={()=>this.unitButtonClick("right")} disabled={currentLevel===maxLevel?true:false}><Icon type="caret-right" /></Button></span>,
          dataIndex: "unit",
          key: "unit",
          align:'center',
          width:'15%',
        }
      ];
      thData.map((data, index) => {
        if (index > 1) {
          if (ratioData!==undefined&&
            ratioData[index - 2] !== undefined &&
            ratioData[index - 2].type[0] === "ratio"
          ) {
            let classColorName = "tdColor" + (index - 2);
            if(index===2){
              columns.push({
                title: data,
                dataIndex: "value" + (index - 2),
                key: "value" + (index - 2),
                align:'center',
                className: foldTableCss[classColorName],
                width:47/thData.length+"%",
                render: (text,record) => (
                  <Tooltip placement="bottom" title={record.showEarlyWarning!=="1"?null:(<EarlyWarning warningLevel={record.warningLevel} desc={record.desc} overlayClassName={styles.warningTip} />)}>
                    <span title={text}>
                      {text}
                      <span style={{color:'#C91717',display:record.showEarlyWarning==="1"?'inline-block':'none'}}>*</span>
                    </span>
                  </Tooltip>
                ),
              });
            }
            else {
              columns.push({
                title: data,
                dataIndex: "value" + (index - 2),
                key: "value" + (index - 2),
                align:'center',
                className: foldTableCss[classColorName],
                width:55/thData.length+"%",
              });
            }
          } else {
            if(index===2){
              columns.push({
                title: data,
                dataIndex: "value" + (index - 2),
                key: "value" + (index - 2),
                align:'center',
                width:55/thData.length+"%",
                render: (text,record) => (
                  <Tooltip placement="bottom" title={record.showEarlyWarning!=="1"?null:(<EarlyWarning warningLevel={record.warningLevel} desc={record.desc} />)} overlayClassName={styles.warningTip}>
                    <span title={text}>
                      {text}
                      <span style={{color:'#C91717',display:record.showEarlyWarning==="1"?'inline-block':'none'}}>*</span>
                    </span>
                  </Tooltip>
                ),
              });
              columns.push({
                title: "",
                dataIndex: "embedLine",
                key: "valueLine",
                align:'center',
                render: (text,record,xindex) => (
                  <div>
                    <EmbedLineChart
                      data={text}
                    />
                  </div>
                ),
              });
            }
            else if(index===3){
              columns.push({
                title: data,
                dataIndex: "value" + (index - 2),
                key: "value" + (index - 2),
                align:'center',
                width:55/thData.length+"%",
                render: text => (
                  <span title={text}>
                    {text}
                  </span>
                ),
              });
              columns.push({
                title: "",
                dataIndex: "histogram",
                key: "valueHistogram",
                align:'center',
                width:55/thData.length+"%",
                render: (text,record,xindex) => (
                  <div style={{height:50,paddingTop:5}}>
                    <EmbedHistogram
                      data={text}
                    />
                  </div>
                ),
              });
            }
            else {
              columns.push({
                title: data,
                dataIndex: "value" + (index - 2),
                key: "value" + (index - 2),
                align:'center',
                width:55/thData.length+"%",
              });
            }
          }
        }
      });
    } else {
      columns= null;
    }
    let dateYYMM=null;
    if(dateType==="1"){
      dateYYMM="YYYY-MM-DD";
    }
    else if(dateType==="2"){
      dateYYMM="YYYY-MM";
    }
    let toolTipTest=(
      <div className={styles.downLoadButtonDiv}>
        <Button className={styles.searchButton} onClick={this.clickDownLoad}>下载当前</Button>
        <br />
        <Button className={styles.searchButton} onClick={this.clickDownLoadAll}>下载全部</Button>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <div style={{height:'90vh'}}>
          <div className={styles.titleDiv}>{location.state.title}</div>
          <div style={{display:'inline-block'}}>
            <IconFont
              type="icon-wenzhang"
              className={styles.titleIcon}
              onClick={this.seeDetail}
            />
          </div>
          <span style={{position:'absolute',display:'none'}}>{testNum}</span>
          <div className={styles.checkBoxDiv} style={{width:'100%',backgroundColor:'#fafafa'}}>
            <div style={{width:'77%',display:showButton===true?'block':'inline-block'}}>
              <div style={{width:'100%',display:'flex'}}>
                <div className={styles.ProCityDiv}>
                  <ProvinceCity className={styles.ProCityDiv} />
                </div>
                <div style={{display:"inline-block"}} className={styles.dateSpan}>
                  <span className={styles.commonFontSize}>日期：</span>
                  {maxDate!==""&&<DatePicker
                    defaultValue={maxDate===""?null:moment(maxDate, dateYYMM)}
                    format={dateYYMM}
                    disabledDate={this.disabledDate}
                    onChange={this.onDateChange}
                  />}
                </div>
              </div>
            </div>
            <div style={{display:showButton===true?'inline-block':'none',width:'77%'}}>
              { buttonCondition}
            </div>
            <div style={{display:'inline-block',position:'absolute',marginTop:5}}>
              {controlDiv}
              <div className={styles.searchButtonDiv} style={{display:'inline-block'}}>
                <Button className={styles.searchButton} onClick={this.search}>
                查询
                </Button>
                <Tooltip title={toolTipTest} placement="bottom" overlayClassName={styles.toolTipDiv}>
                  <Button className={styles.searchButton}>
                  下载
                  </Button>
                </Tooltip>
              </div>
            </div>
            <Checkbox onChange={this.allOpen} className={styles.allOpen} checked={tableAllOpen}>展开全部</Checkbox>
          </div>
          <div className={foldTableCss.foldTable} style={{paddingTop:30}}>
            <div className={styles.tabDiv}>
              {tableModuleTable}
              <hr style={{backgroundColor:'lightgrey',height:1,border:'none'}} />
            </div>
            {foldTableData.thData.length>0&&
            <Table
              loading={loading}
              columns={columns}
              rowClassName={record => {
              return this.rowClassNameHandle(record);
            }}
              expandedRowKeys={defaultExpandedRowKeys}
              onExpand={(expanded, record) => {
                this.changeExpandedRowKeys(expanded, record);
            }}
              pagination={false}
              dataSource={handleTableData}
              scroll={{y:'60vh'}}
            />
          }
          </div>
          <Modal
            visible={seeDetail}
            onCancel={this.notSeeDetail}
            width="80%"
            title="指标解释"
            closable={false}
            centered={true}
            footer={[
              <div className={styles.modalCancelDiv}>
                <Button key="back" onClick={this.notSeeDetail}>
                关闭
                </Button>
              </div>
          ]}
          >
            <div className={styles.tableDiv}>
              <Table
                dataSource={dataForTable}
                bordered={true}
                columns={column}
                pagination={false}
                rowClassName={this.changeRowColor}
              />
            </div>
          </Modal>
        </div>
        <DownloadAll
          downloadParam={downloadParam}
          visible={DownloadAllVisible}
          indexTypeVisible={true}
          onCancel={this.clickDownLoadAllClose}
        />
      </PageHeaderWrapper>
    );
  }
}
export default Exception;
