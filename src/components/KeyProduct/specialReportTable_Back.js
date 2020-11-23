/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/4/25
 */
import React,{ PureComponent } from 'react';
import {Table,Checkbox,Tooltip,Button } from 'antd';
import {connect} from 'dva';
import router from 'umi/router';
import EarlyWarning from "../DayOverView/earlyWarning";
import EmbedLineChart from "../Echart/specialTableEmbedLineChart/specialTableEmbedLineChart";
import EmbedHistogram from "../Echart/specialTableEmbedHistogram/specialTableEmbedHistogram";
import styles from './KeyProduct.less';
import foldTableCss from "./another.less";

@connect(({KeyProductData,specialReport,proCityModels,selectTypeModels}) =>({
  KeyProductData,
  specialReport,
  proCityModels,
  selectTypeModels
}))
class SpecialReportTable extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      tableAllOpen:true, // 表格展开全部标志
    }
  }
  componentDidMount(){

  }

  componentDidUpdate(prevProps){
  }

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

  // 在展开全部操作时，把表格的是否已展开标志expend置为false
  changeExpend=(tableData)=>{
    let k=0;
    let i=0;
    const OldTable=tableData;
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

  // 在展开全部收起时，将下钻按钮的隐藏机制还原
  showDownArrow=(tableData)=>{
    let k=0;
    let i=0;
    const OldTable=tableData;
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

  // 展开全部
  allOpen=()=> {
    const {KeyProductData} = this.props;
    const {tableAllOpen,allOpenKeys,OldData}=KeyProductData;
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

  // 辅助于dataHandleFun函数用来讲请求到的数据进行处理，得到适用于antDesign表格的数据形式
  getTrees=(list, parentId)=> {
    const items = {};
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

  // 将经过处理的表格数据的孩子进行递归处理，得到相应的数据格式（服务于呈现折线图）
  createChartDataForChildren=(oldData)=>{
    const newData=oldData;
    if(newData.children!==undefined){
      for(let i=0;i<newData.children.length;i++){
        const OneData=newData.children[i];
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

  // 将表格数据处理得到适用于antDesign表格的数据形式
  dataHandleFun=(tableData)=> {
    /**
     * 树状的算法
     * @params list     代转化数组
     * @params parentId 起始节点
     * 利用递归格式化每个节点
     */
    const tbodyData = tableData.tbodyData; // 表格数据体数据
    let allOpenKey=[];
    let HandleTableData = this.getTrees(tbodyData, -1);
    for(let i=0;i<HandleTableData.length;i++){
      const OneData=HandleTableData[i];
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
    const {dispatch} = this.props;
    dispatch({
      type: 'KeyProductData/initTableData',
      payload: {
        HandleTableData,
        OldData:HandleTableData,
        defaultExpandedRowKeys:allOpenKey,
        allOpenKeys:allOpenKey
      },
    });
    HandleTableData=this.hideDownArrow(HandleTableData);
    return HandleTableData;
  }

  // 为当前数据拼接新的kpiId
  makeNewKpiId=(data)=>{
    const {areaId}=this.state;
    let i=0;
    const newData=data;
    for(i=0;i<data.length;i++){
      newData[i].kpiId=newData[i].kpiId+areaId;
      newData[i].key=newData[i].key+areaId;
      if(newData[i].children!==undefined&&newData[i].children.length>0){
        newData[i].children=this.makeNewKpiId(newData[i].children);
      }
    }
    return newData;
  }

  // 拼接默认的key值
  makeAllOpenKey=(tbodyData)=>{
    const allOpenKey=[];
    for(let k=0;k<tbodyData.length;k++){
      if(tbodyData[k].children!==undefined&&tbodyData[k].children.length>0){
        const oneKey=tbodyData[k].kpiId;
        allOpenKey.push(oneKey);
        const secondKey=this.makeAllOpenKey(tbodyData[k].children);
        if(secondKey.length>0){
          for(let i=0;i<secondKey.length;i++){
            allOpenKey.push(secondKey[i]);
          }
        }
      }
    }
    return allOpenKey;
  }

  // 拼接单元格内特殊位置的样式，（值为正或负，相应为绿色增长，或是红色下降）

  rowClassNameHandle=(record)=> {
    const format = record.format; // 判断颜色
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

  // 递归寻找收起箭头的kpiId所在处，并对数据进行相应处理
  makeUpData=(oldData,newData,ID)=>{
    let num=0;
    let i=0;
    let j=0;
    let k=0;
    const final=newData; // 处理后的最终返回值
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

  // 改变表格的默认展开行
  changeExpandedRowKeys=(expanded, record)=> {
    const {defaultExpandedRowKeys,testNum,HandleTableData}=this.state;
    let newHandleTableData=HandleTableData;
    const key = record.kpiId;
    const expandedRowKeys = defaultExpandedRowKeys;
    if(expanded===true){
      newHandleTableData=this.makeUpData(newHandleTableData,newHandleTableData,key)
      newHandleTableData=this.changeExpendState(key,newHandleTableData,true);
    }
    else if(expanded===false){
      newHandleTableData=this.changeExpendState(key,newHandleTableData,false);
    }
    if (expandedRowKeys.length > 0 && !expanded) {
      if (record.children !== undefined) {
        const res = this.getChildrenRowKeys(record.children);
        res.map(item => {
          const index = expandedRowKeys.indexOf(item);
          if (index !== -1) {
            expandedRowKeys.splice(index, 1);
          }
        });
      }
      const index = expandedRowKeys.indexOf(key);
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

  // 点击表格的指标名字，或者是下钻表格的地市名字时，向指标详细信息页面的跳转
  clickForJump=(kpiId, dateType,proId,cityId)=>{
    const {proCityModels,specialReport}=this.props;
    const {date}=specialReport;
    const currentDate = date;
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
        dateType,
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

  // 单位切换按钮（区分左右）点击，得到并生成新的表格
  unitButtonClick=(direction)=>{
    const {specialReport,KeyProductData,proCityModels}=this.props;
    const {dateType,markId,date,moduleId}=specialReport;
    const {selectPro,selectCity}=proCityModels;
    const {currentLevel}=KeyProductData;
    const currentDate = date;
    const currentTab = moduleId;
    const areaId = selectPro.proId?selectPro.proId:"";
    const cityId = selectCity.cityId?selectCity.cityId:"";
    const { dispatch} = this.props;
    const buttonCon=this.createButtonConditionForSearch();
    if(direction==="left"){
      dispatch({
        type: 'KeyProductData/fetchTable',
        payload: {
          markType:markId,
          provinceId:areaId,
          cityId,
          date:currentDate,
          moduleId:currentTab,
          dateType,
          dimension:buttonCon,
          unitLevel:(Number(currentLevel)-1).toString()
        },
      });
    }
    if(direction==="right"){
      dispatch({
        type: 'KeyProductData/fetchTable',
        payload: {
          markType:markId,
          provinceId:areaId,
          cityId,
          date:currentDate,
          moduleId:currentTab,
          dateType,
          dimension:buttonCon,
          unitLevel:(Number(currentLevel)+1).toString()
        },
      });
    }
  }

  render(){
    const {tableAllOpen}= this.state;
    const {KeyProductData}= this.props;
    const {tableData,currentLevel,minLevel,maxLevel,HandleTableData,defaultExpandedRowKeys}= KeyProductData;
    this.dataHandleFun(tableData);
    const foldTableData = tableData;
    let columns=null;
    if (foldTableData.thData.length>0) {
      const thData = foldTableData.thData; // 表头数据
      const ratioData = HandleTableData[0].format; // 判断format ratio在第几列
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
                render: (text) => (
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
                render: (text) => (
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
    return(
      <div>
        <Checkbox onChange={this.allOpen} className={styles.allOpen} checked={tableAllOpen}>展开全部</Checkbox>
        <div className={foldTableCss.foldTable} style={{paddingTop:30}}>
          {tableData.thData.length>0&&
          <Table
            columns={columns}
            rowClassName={record => {
              return this.rowClassNameHandle(record);
            }}
            expandedRowKeys={defaultExpandedRowKeys}
            onExpand={(expanded, record) => {
              this.changeExpandedRowKeys(expanded, record);
            }}
            pagination={false}
            dataSource={HandleTableData}
            scroll={{y:'60vh'}}
          />
          }
        </div>
      </div>
    )
  }
}
export default SpecialReportTable;
