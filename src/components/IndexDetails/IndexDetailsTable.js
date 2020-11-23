/* eslint-disable */
/**
 * @Description: 指标页面表格组件
 *
 * @author: sunrui
 *
 * @date: 2019/2/19
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Table,DatePicker,Tooltip,Icon,Button} from 'antd';
import DownloadFile from "@/utils/downloadFile"
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import styles from './IndexDetailsTable.less';
import EarlyWarning from '../DayOverView/earlyWarning';
import iconFont from '../../icon/Icons/iconfont';

const {MonthPicker} = DatePicker;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

@connect(({indexDetailsTableModels,indexDetails,proCityModels,selectTypeModels}) =>({
  indexDetailsTableModels,
  indexDetails,
  proCityModels,
  selectTypeModels
}))
class IndexDetailsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.indexDteailsTableRef=React.createRef()
  }

  componentDidMount(){
    // this.tableDate();
  }

  componentDidUpdate(prveProps){
    // const {selectTypeModels,proCityModels,indexDetails,indexDetailsTableModels } = this.props;
    // const {requestSuccess} = selectTypeModels;
    // const {selectPro,selectCity} = proCityModels;
    // const {markType,selectUnit} = indexDetails;
    // const {endDate, regionType, startDate} = indexDetailsTableModels;
    //
    // if(requestSuccess
    //     && markType!==""
    //     && startDate!==""
    //     && endDate !== ""
    //     && selectPro.proId !== undefined
    //     && selectCity.cityId !== undefined
    //     && selectUnit.unitId !== undefined
    //     && (
    //       regionType !== prveProps.indexDetailsTableModels.regionType
    //   || endDate !== prveProps.indexDetailsTableModels.endDate
    //   || startDate !== prveProps.indexDetailsTableModels.startDate)
    // ){
    //   console.log( "子组件请求表格", regionType, prveProps.indexDetailsTableModels.regionType
    //     , endDate ,prveProps.indexDetailsTableModels.endDate
    //     ,startDate , prveProps.indexDetailsTableModels.startDate)
    //   this.fetchTableData();
    // }
  }

  // 表格间隔变色
  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  };

  // 表格排序
  tableSort=(a,b,index)=>{
    let stringB=b[`items${index}`];
    if(stringB==="-"){stringB="-10000"}
    let stringA=a[`items${index}`];
    if(stringA==="-"){stringA="-10000"}
    const bb=Number(stringB.replace(/,/g,''));
    const aa=Number(stringA.replace(/,/g,''));
    return(bb -aa)
  };

  /**
   * 功能：选择日期
   */
  onChange1 = (date, dateString)=>{
    const {dispatch, indexDetailsTableModels} = this.props;
    const {endDate,regionType} = indexDetailsTableModels;
    dispatch({
      type:'indexDetailsTableModels/setDate',
      payload:{endDate,startDate: dateString},
    });
    this.fetchTableData(dateString, endDate, regionType);
  };

  onChange2 = (date, dateString)=>{
    const {dispatch, indexDetailsTableModels} = this.props;
    const {startDate,regionType} = indexDetailsTableModels;
    dispatch({
      type:'indexDetailsTableModels/setDate',
      payload:{endDate:dateString,startDate},
    });
    this.fetchTableData(startDate, dateString, regionType);
  };

  // 切换省市按钮
  conditionHandle (index) {
    const {dispatch,indexDetailsTableModels} = this.props;
    const {startDate, endDate} = indexDetailsTableModels;
    dispatch({
      type:'indexDetailsTableModels/proCityHandle',
      payload:{regionType: index+1,selectIndex: index},
    });
    this.fetchTableData(startDate, endDate, index+1);
  }

  // 请求日期方法
  tableDate(){
    const {dispatch,indexDetails } = this.props;
    const {date, markType, dateType} = indexDetails;
    // 请求表格的日期
    dispatch({
      type:'indexDetailsTableModels/fetchDateSection',
      payload:{dateType,markType,date},
    })
  }

  fetchTableData(startDate, endDate, regionType){
    const {dispatch,selectTypeModels,proCityModels,indexDetails } = this.props;
    const {selectIdData} = selectTypeModels;
    const {selectCity,selectPro} = proCityModels;
    const {markType,dateType,selectUnit} = indexDetails;
    dispatch({
      type:'indexDetailsTableModels/fetchIDTableData',
      payload:{
        cityId: selectCity.cityId || "",
        dateType,
        dimension: selectIdData,
        endDate,
        startDate,
        markType,
        provinceId: selectPro.proId || "",
        regionType,
        unitId:selectUnit.unitId || "",
      }
    })
  }

  // 下载
  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle()); // id"indexDetailTable"
  }

  jsonHandle(){
    const {downloadData, indexDetailsTableModels} = this.props;
    const {IDTableData,endDate, startDate}=indexDetailsTableModels;
    const {title, selectUnit, selectCity, selectPro, selectNameData} = downloadData;
    const conditionVlue = [];
    selectNameData.forEach((item)=>{
      conditionVlue.push([item.screenTypeName, item.value[0].sname]);
    });
    const tableData = IDTableData ;
    const tableValue = [];
    const chartY = tableData.tbodyData;
    chartY.forEach((item)=>{
      tableValue.push([item.regionName,...item.items])
    });
    const condition = {
      name: "省份逐日分省数据表",
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        // ["地域",selectPro.proName, selectCity.cityName],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", startDate,endDate],
        ...conditionVlue,
      ],
    };
    const  table = {
      title: [
        tableData.thData
      ],
      value: [
        ...tableValue
      ]
    };


    const newJson = {
      fileName: `${title}-省份逐日分省数据表`,
      condition,
      table
    };
    return newJson;
  }

  render(){

    const {indexDetailsTableModels,indexDetails } = this.props;
    const {dateType, date} = indexDetails;
    const {startDate, endDate, regionType,selectIndex,IDTableData} = indexDetailsTableModels;
    if(IDTableData.thData === undefined || startDate === ''){
      return null;
    }

    // 表头
    let columns;
    if(regionType === 1) {
      columns = [{title: '省分', width: 130, dataIndex: 'regionName', key: 'regionName', fixed: 'left',align: 'center',}];
      IDTableData.thData.forEach((data,index) =>{
        if(index>0){
            columns.push({
              title: data,
              dataIndex: `items${index}`,
              key: index ,
              width: 150,
              sorter: (a,b) => this.tableSort(a,b,index) ,
              align: 'center',
              render: (text,record) => {
                if(record[`level${index}`] !== undefined){
                const warning = <EarlyWarning warningLevel={record[`level${index}`]} desc={record[`desc${index}`]} />;
                  return <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}><span className={styles.monthSumNum}>{text}</span><IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" /></Tooltip>
                }
                return  text
              }
            })
        }
      })
    }else {
      columns = [
        {title: '省分', width: 130, dataIndex: 'regionName', key: 'regionName', fixed: 'left',align: 'center',},
        {title: '地市', width: 150, dataIndex: 'items1', key: 'items1', fixed: 'left',align: 'center',}];
      IDTableData.thData.forEach((data,index) =>{
        if(index>1){
          columns.push({ title: data, dataIndex: `items${index}`, key: index , width: 150, sorter: (a,b) => this.tableSort(a,b,index) , align: 'center',})
        }
      })
    }




    // 表数据
    const tableWidth = IDTableData.tbodyData[0].items.length * 150 + 130;
    const dataSource  = [];
    IDTableData.tbodyData.forEach((proData) =>{
      const tableData = {};
      const key = 'key';
      const regionName = 'regionName';
      tableData[key] = proData.regionId;
      tableData[regionName] = proData.regionName;
      proData.items.forEach((itemsData,itemsIndex) =>{
        tableData[`items${itemsIndex+1}`]=itemsData
      });
      if(proData.warning !== undefined && proData.warning.length !== 0){
        proData.warning.forEach((warningData) =>{
          tableData[`desc${warningData.warningIndex}`]=warningData.desc;
          tableData[`level${warningData.warningIndex}`]=warningData.warningLevel;
        });
      }
      dataSource.push(tableData)
     });


    // 日期相关
    const dateFormat = 'YYYY-MM-DD';
    const monthFormat = 'YYYY-MM';
    let disabledStartDate;
    if(endDate !== ''){
      disabledStartDate=(current)=>current && current >= moment(endDate);
    }
    let disabledEndDate;
    if(startDate !== ''){
      disabledEndDate=(current)=>current > moment(date) || current <= moment(startDate)
    }
    const triangle = <i className={styles.dateTriangle} />;
    const startDateComponent = dateType==='1'?
      <DatePicker
        format={dateFormat}
        onChange={this.onChange1}
        disabledDate={disabledStartDate}
        allowClear={false}
        showToday={false}
        value={moment(startDate, dateFormat)}
        suffixIcon={triangle}
      />
      :
      <MonthPicker
        format={monthFormat}
        onChange={this.onChange1}
        disabledDate={disabledStartDate}
        allowClear={false}
        showToday={false}
        value={moment(startDate, monthFormat)}
        suffixIcon={triangle}
      />;

    const endDateComponent = dateType==='1'?
      <DatePicker
        format={dateFormat}
        onChange={this.onChange2}
        disabledDate={disabledEndDate}
        allowClear={false}
        showToday={false}
        value={moment(endDate, dateFormat)}
        suffixIcon={triangle}
      />
      :
      <MonthPicker
        format={monthFormat}
        onChange={this.onChange2}
        allowClear={false}
        disabledDate={disabledEndDate}
        showToday={false}
        value={moment(endDate, monthFormat)}
        suffixIcon={triangle}
      />;

    // 切换省市
    const condition = ["省分", "地市"];
    const conditionDom = condition.map((data, index) => {
      let select = "";
      if (selectIndex === index) {
        select = "select";
      }
      return (
        <li
          key={data}
          className={styles[select]}
          onClick={() => this.conditionHandle(index)}
        >
          {data}
        </li>
      );
    });
    const {downloadData}=this.props;
    if(this.indexDteailsTableRef.current){
      const Dom2=document.querySelector(".ant-table-body");
      Dom2.scrollLeft=100000;
    }
    return(
      <div className={styles.IDTable} id="indexDetailTable">
        {downloadData ? <div className={styles.downloadName}><Button size="small" icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
        <div className={styles.provCityButton}>
          <ul className={styles.btnUl}>{conditionDom}</ul>
        </div>
        <div className={styles.IDTDateSelector}>
          日期： {startDateComponent}
          &nbsp;&nbsp;&nbsp;&nbsp;———&nbsp;&nbsp;&nbsp;&nbsp;
          {endDateComponent}
        </div>
        <Table ref={this.indexDteailsTableRef} dataSource={dataSource} columns={columns} scroll={{ x: tableWidth }} pagination={false} rowClassName={this.changeRowColor} />
      </div>

    )
  }
}

export default IndexDetailsTable
