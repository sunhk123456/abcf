/**
 *发展用户真实性测试页面
 * by:CaoRuining
 */

import React, { PureComponent, Fragment } from 'react';
import {connect} from 'dva';
import { Card, Row, Col, Button, Table, Checkbox,DatePicker,Select } from 'antd';
import moment from 'moment';
import yangshi from './index.less';
import tipsIcon from './tips.png'
import PageHeaderWrapper from '../../components/PageHeaderWrapper'
import IndexDetails from '../../components/DevelopingUser/indexDetails'
import ProCity from '../../components/Until/proCity'
import DevelopPop from '../../components/DevelopingUser/developingPop'
import DownloadAll from '../../components/DownloadAll/downloadAll'
import CollectComponent from '../../components/myCollection/collectComponent'; // 收藏图标

const dateFormat = 'YYYY-MM-DD';
const {Option} = Select; // 选择器

@connect(
  ({developingUserCom,proCityModels}) => ({
    indexDate:developingUserCom.indexDate,
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
    tableData:developingUserCom.tableData,
    tableHData:developingUserCom.tableHData,
    selectPro:proCityModels.selectPro,
    selectCity:proCityModels.selectCity,
    regionalBarData:developingUserCom.regionalBarData,
    trendLineData:developingUserCom.trendLineData,
  })
)



class DevelopingUser extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableState: {
        bordered: false,
        pagination: false,
      },
      date:'',// 暂存已选日期
      indexType1:'td',// 暂存已选类型
      expandedRowKeys:[],// 表格展开项
      tableKey:[], // 暂存表格所有的key
      tableAllOpen:false,// 表格是否已经全部展开
      isDownloadShow:false, // 下载弹窗是否展示
      iconExplainContent:false,// 指标解释浮窗
    };


  }

  componentWillMount(){
    this.fetchIndexDetailsData();
    this.fetchMaxDateData();
    this.fetchIndexTypeData();
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    const {indexDate,tableData} = this.props;
    if(nextProps !== undefined){
      if (nextProps.indexDate !== indexDate && nextProps.indexDate !== '') {
        this.setState({
          date:nextProps.indexDate
        },()=>{
          this.fetTable();
        })
      }
    }
    // 请求一次全部展开所需要的key并存入state留用
    if(nextProps !== undefined && nextProps.tableData !== undefined){
      if(nextProps.tableData !== tableData && nextProps.tableData !== []){
        const temp = nextProps.tableData.map((item)=>item.dimensionId);
        this.setState({
          tableKey:temp,
        });
      }
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
        obj[`value${i+1}`]=values[i]
      }
      return Object.assign(data,obj);
    };
    for(let i=0;i<array.length;i+=1){
      getValueData(array[i]);
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
    let tableWidth = 250;
    if(sw >= 1400){
      tableWidth = 250
    }else if(sw < 1400){
      tableWidth = 220
    }
     if(!oldThData){return {}}
    const columns=oldThData.map((item,index)=> (
        {
          title:item.name,
          unit:item.unit,
          indexId:item.indexId,
          dataIndex: index===0?"name":`value${index}`,
          className: index===0 ? yangshi.column0 : yangshi.column1,
          key:item.name,
          width: index===0?tableWidth:null,
          fixed: index===0?'left':null,
          sorter: index===0?null:(a,b) => this.tableSort(a,b,index) ,
          sortDirections: ['descend', 'ascend'],
          children:[ {
            className: index===0 ? yangshi.column0 : yangshi.column1,
            title:index===0?null:item.unit,
            unit:item.unit,
            indexId:item.indexId,
            dataIndex: index===0?"name":`value${index}`,
            key:item.name,
            width: index===0?200:null,
            fixed: index===0?'left':null,
            render: text => (
              <span title={text} className={yangshi.clickSpan} onClick={this.tableClicked} data-column-name={item.name} data-column-indexid={item.indexId}>
                {text}
              </span>
            ),
          }],
        }
      )
    );
    this.addKey(oldTbodyData);
    this.newTbodyData(oldTbodyData);
    const topTbodyData=[];
    oldTbodyData.map((item) => {

      if(item.parentId !=="-1"){
        return null
      }
      topTbodyData.push(item);
      return item
    });
    for(let i=0;i<topTbodyData.length;i+=1){
      const childrenItem=[];
      oldTbodyData.map((item)=>{
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
   *请求指标类型
   */
  fetchIndexTypeData = ()=> {
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchIndexType',
      payload:{
        markType: "USER_SUBJECT"
      }
    })
  };

  /**
   *请求最大日期
   */
  fetchMaxDateData = ()=> {
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchIndexDate',
      payload:{
        markType: "USER_SUBJECT"
      }
    })
  };

  /**
   *请求指标解释数据
   */
  fetchIndexDetailsData = ()=> {
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchIndexDetails',
      payload:{
        markType: "USER_SUBJECT"
      }
    })
  };

  /**
   * 点击表格显示弹出层
   */
  tableClicked = (e)=>{
    const {dispatch,tableData} = this.props;
    const {indexType1,date,} = this.state;
    const node=e.currentTarget;
    const nodeParent=e.currentTarget.parentNode.parentNode;
    const dimensionId=nodeParent.getAttribute("data-row-key");
    const columnIndexId=node.getAttribute("data-column-indexid");
    const columnName=node.getAttribute("data-column-name");
    let obj={};
    tableData.map((tbodyDataItem)=>{
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
      comKind:columnName,
      comRegional:obj.name
    };
    const params = {
      date,
      indexType: indexType1,
      markType: "USER_SUBJECT",
      indexId: columnIndexId,
      provId:categoryId,
      cityId: seriesId,
    };
    dispatch({
      type:'developingUserCom/changePopKind',
      payload:params1
    });
    dispatch({
      type:'developingUserCom/fetchRegionalBarData',
      payload:params
    });
    dispatch({
      type:'developingUserCom/fetchLineTableData',
      payload:params
    });

    // xingxiaodong 2019.5.8 点击表格时重置为当日趋势图
    const params12 = {
      barStatus:'block',
      lineStatus:'block',
      tableStatus:'none'
    };

    dispatch({
      type:'developingUserCom/fetchChangeCom',
      payload:params12
    });
    this.showPop();
  };


  /**
   *请求表格数据
   */
  fetTable = ()=> {
    const {dispatch,selectPro,selectCity} = this.props;
    const {date,indexType1} = this.state;
      const params = {
        markType: "USER_SUBJECT",
        date,
        indexType:indexType1,
        provId: selectPro.proId,
        cityId: selectCity.cityId,
      };
      dispatch({
        type: 'developingUserCom/fetchIndexTableData1',
        payload: params
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
    const {tableData} = this.props;
    const {expandedRowKeys} = this.state;
    const willExpandRows = tableData.filter((item)=>item.parentId===obj.dimensionId);// 得到要进行操作的子行的数组
    if(expanded){
      for (let i=0;i<willExpandRows.length;i+=1){
        expandedRowKeys.push(willExpandRows[i].parentId)
      }
      this.setState({
        expandedRowKeys
      })
    }else {
      const arr = [];
      for(let i=0;i<willExpandRows.length;i+=1){
        arr.push(willExpandRows[i].parentId)
      }
      this.setState({
        expandedRowKeys:this.diffArray(expandedRowKeys,arr)
      })
    }
  };

  /**
   * 全部展开
   */
  allOpen=()=> {
    const {tableKey,tableAllOpen} = this.state;
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
    })
  };


  /**
   * 功能：选择指标类型
   */
  onChangeType = (value)=>{
    this.setState({
      indexType1:value,
    })
  };

  /**
   * 显示图表组件
   * @returns {*}
   */
  showPop = ()=>{
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchPopStatus',
      payload:{
        chartsStatus:'block'
      }
    })
  };

  // 下载按钮被点击
  download=()=>{
    this.setState({
      isDownloadShow:true
    })
  };

  downloadClose=()=>{
    this.setState({
      isDownloadShow:false
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


  render(){
    const {tableState,tableAllOpen,expandedRowKeys,isDownloadShow,indexType1} = this.state;
    const {indexDetailsShow,indexDate,indexType,tableHData,tableData} = this.props;
    const {columns,topTbodyData}=this.handleData(tableHData,tableData);
    if (indexDate === ''){
      return null;
    }

    const disabledStartDate=(current)=>current && current > moment(indexDate);
    const Type = indexType.map((item)=>{
      const res =(
        <Option value={item.id} key={item.id}>{item.name}</Option>
      );
      return res;
    });

    const sw= window.screen.width; // 获取屏幕宽度
    let tableWidth = 250;
    if(sw >= 1400){
      tableWidth = 250
    }else if(sw < 1400){
      tableWidth = 220
    }

    const downloadParam={
      name:"用户发展真实性预测",
      dateType:1,
      markType:"USER_SUBJECT",
      // moduleId:"",
    };
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      width: '30px',
      height: '30px'
    };
    const{iconExplainContent}=this.state;
    const triangle = <i className={yangshi.dateTriangle} />
    return(
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false} bodyStyle={{ padding:'0'}}>
            <Row>
              <Col md={24}>
                <div style={{display:indexDetailsShow}}>
                  <IndexDetails />
                </div>
                <div className={yangshi.mainTitle}>
                  用户发展真实性预测
                  <span className={yangshi.icon} onClick={this.indexExplain} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex}>
                    <img src={tipsIcon} alt="" className={yangshi.tipsIcon} onClick={()=>this.showDetails()} />
                    {iconExplainContent?<div className={yangshi.iconContent}>点击查看该专题内指标解释</div>:null}
                  </span>
                  <CollectComponent key="USER_SUBJECT" markType="USER_SUBJECT" searchType='2' imgStyle={collectStyle} />
                </div>
                <div className={yangshi.menu}>
                  <div className={yangshi.citySelect}>
                    <ProCity />
                  </div>
                  <div className={yangshi.dateSelector}>
                    <span className={yangshi.menuTitle}>
                      日期：
                    </span>
                    <DatePicker
                      format={dateFormat}
                      onChange={this.onChangeDate}
                      disabledDate={disabledStartDate}
                      showToday={false}
                      defaultValue={moment(indexDate,dateFormat)}
                      allowClear={false}
                      suffixIcon={triangle}
                    />
                  </div>
                  <div className={yangshi.analysisKindSelector}>
                    <span className={yangshi.menuTitle}>
                      指标类型：
                    </span>
                    <Select
                      defaultValue='td'
                      onChange={(e)=>this.onChangeType(e)}
                    >
                      {Type}
                    </Select>
                    <i className={yangshi.triangle} />
                  </div>
                  <Button className={yangshi.button} onClick={this.download}>下载</Button>
                  <Button className={yangshi.button} onClick={()=>this.fetTable()}>查询</Button>
                </div>
                <div className={yangshi.mainContent}>
                  <div className={yangshi.mainTop}>
                    <div className={yangshi.tableTitle}>数据情况概览</div>
                    <Checkbox onChange={this.allOpen} className={yangshi.allOpen} checked={tableAllOpen}>全部展开</Checkbox>
                  </div>
                  <Table
                    {...tableState}
                    onExpand={this.onExpend}
                    className={yangshi.table}
                    columns={columns}
                    dataSource={topTbodyData}
                    expandedRowKeys={expandedRowKeys}
                    scroll={{ x: (tableWidth*tableHData.length) }}
                  />
                </div>
                <DevelopPop indexType1={indexType1} />
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

export default DevelopingUser;
