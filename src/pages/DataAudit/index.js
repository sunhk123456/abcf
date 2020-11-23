/**
 * @Description: 数据稽核
 *
 * @author: sunrui
 *
 */

import React, {Component} from 'react';
import {connect} from 'dva';
import {Tabs, Select,DatePicker,Table } from 'antd';
import moment from 'moment';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import DaProSelect from '../../components/DataAudit/DaProSelect';

@connect(
  ({dataAudit}) => ({
    tabId:dataAudit.tabId,
    indexList:dataAudit.indexList,
    auditDate:dataAudit.auditDate,
    selectorTabId:dataAudit.selectorTabId,
    selectorProId:dataAudit.selectorProId,
    auditTable:dataAudit.auditTable,
    selectorIndexId:dataAudit.selectorIndexId,
    selectorIndexName:dataAudit.selectorIndexName,
    selectorIndexUnit:dataAudit.selectorIndexUnit
  })
)
class DataAudit extends Component{
  constructor(props){
    super(props);
    this.state={
      // moduleTab:props.moduleTab,
      // selectorTabId:'0101', // 默认为波动性id
      auditDate:'',
      maxDate:''
    };
  }


  componentDidMount(){
    const {dispatch} = this.props;

    // 首次先请求标签信息和最大账期
      dispatch({
        type:'dataAudit/fetchModuleTab',
        payload:{},

      })
    dispatch({
      type:'dataAudit/fetchIndexName',
      payload:{tabId:''}
    })

  }

  componentDidUpdate(prveProps){
    const {auditDate} = this.state;
    const {dispatch,selectorTabId,selectorIndexId,selectorIndexUnit} = this.props;
    if ((selectorTabId !== prveProps.selectorTabId || selectorIndexId !== prveProps.selectorIndexId ) && selectorTabId !=='' && selectorIndexId !== '' && auditDate === ''){
      dispatch({
        type:'dataAudit/fetchMaxDate',
        payload:{
          dateType:selectorIndexUnit,
          specialId:selectorIndexId,
          tabId:selectorTabId
        }
      }).then((auditDate1)=>{
        this.setState({
          auditDate:auditDate1.date,
          maxDate:auditDate1.date
        })
        this.fetcheTableData()

      })
    }

    if (selectorTabId !== prveProps.selectorTabId && selectorTabId !== ''){
      this.fetcheTableData()
    }
  }
  /**
   * 切换专题
   * */

  handleSelectorIndex= (id) =>{
    const {dispatch,selectorTabId,indexList} = this.props;
      const selectorIndex = [];
      indexList.forEach((data) => {
        if (data.indexId === id){
          selectorIndex.push(data)
        }
      });
      dispatch({
        type:'dataAudit/getSelectorIndex',
        payload:{
          selectorIndexId:selectorIndex[0].indexId,
          selectorIndexName:selectorIndex[0].indexName,
          selectorIndexUnit:selectorIndex[0].indexUnit
        }
      })
      dispatch({
        type:'dataAudit/fetchMaxDate',
        payload:{
          dateType:selectorIndex[0].indexUnit,
          specialId:selectorIndex[0].indexId,
          tabId:selectorTabId
        }
      }).then((auditDate1)=>{
        this.setState({
          auditDate:auditDate1.date
        })
        // 标签信息和专题发生变化时重新请求
        this.fetcheTableData()
      })

  }

  /**
   * 获取表格数据
   * */
  fetcheTableData = () =>{
    const {auditDate} = this.state;
    const {dispatch,selectorTabId,selectorProId,selectorIndexId,selectorIndexUnit,selectorIndexName} = this.props;
    const params = {
      "date":auditDate,
      "dateType":selectorIndexUnit,
      "specialId":selectorIndexId,
      "specialName":selectorIndexName,
      "provId":selectorProId,
      "tabId":selectorTabId,
    }
    dispatch({
      type:'dataAudit/fetchAuditTable',
      payload:params
    })
  }


  /**
   * 切换标签页
   * */
  changeTabs = (key) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'dataAudit/getChangeModule',
      payload:key
    })
    // this.fetcheTableData()
  }


  /**
   * 点击查询按钮
   * */
  handleClickBtn = () =>{
    const {auditDate} = this.state;
    const {dispatch,selectorTabId,selectorProId,selectorIndexId,selectorIndexUnit,selectorIndexName} = this.props;
    const params = {
      "dateType":selectorIndexUnit,
      "specialId":selectorIndexId,
      "specialName":selectorIndexName,
      "provId":selectorProId,
      "tabId":selectorTabId,
      "date":auditDate,
    }
    dispatch({
      type:'dataAudit/fetchAuditTable',
      payload:params
    })
  }




  onChangeDatePicker = (date,dateString) =>{
    this.setState({
      auditDate:dateString
    })
  }

  onChangeMonthPicker = (date,dateString) =>{
    this.setState({
      auditDate:dateString
    })
  }

  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  }

  render(){
    const {auditDate,maxDate} = this.state
    const {tabId,indexList,auditTable,selectorIndexUnit,selectorTabId} = this.props;
    const { MonthPicker } = DatePicker;
    if (tabId.length === 0 || indexList.length === 0 || auditTable.thData === undefined || auditTable.thData.length === 0 || auditDate === ""){
        return null;
    }
    const {Option} = Select;
    const {TabPane} = Tabs;
    const indexOption = indexList.map((data) =>(
      <Option value={data.indexId} key={data.indexId} className={styles.indexOption}>{data.indexName}</Option>
      ))

    const dateFormat = 'YYYY-MM-DD';
    const monthFormat = 'YYYY-MM';
    let auditTitle = '';
    let dateSelect ;
    let disabledDate ;
    let indexColumns;
    const indexData =[];
    if(selectorIndexUnit === '1'){

      auditTitle = '(日专题)';
      disabledDate = (current) => current && current > moment(maxDate)
      dateSelect = (
        <DatePicker value={moment(auditDate, dateFormat)} format={dateFormat} allowClear={false} onChange={this.onChangeDatePicker} disabledDate={disabledDate} />
      );

    }else {

      auditTitle = '(月专题)';
      disabledDate = (current) => current && current >= moment(maxDate)
      dateSelect = (
        <MonthPicker value={moment(auditDate, monthFormat)} format={monthFormat} allowClear={false} onChange={this.onChangeMonthPicker} disabledDate={disabledDate} />
      );
    }
    if(selectorTabId === tabId[0].tabId){
      if (auditTable.thData.length === 1){
        // 波动性表头
        indexColumns = [
          {
            title: auditTable.thData[0][0],
            dataIndex: 'indexId',
            key: 'indexId',
            colSpan: 2,
            align: 'left',
            width:'13%',
          },
          {
            title: auditTable.thData[0][0],
            dataIndex: 'indexName',
            key: 'indexName',
            colSpan: 0,
            align: 'center',
          }, {
            title: auditTable.thData[0][1],
            dataIndex: 'indexUnit',
            key: 'indexUnit',
            align: 'center',
            width:'9%',
          }, {
            title: auditTable.thData[0][2],
            dataIndex: 'indexDay',
            key: 'indexDay',
            align: 'center',
            width:'13%',
          }, {
            title: auditTable.thData[0][3],
            dataIndex: 'indexMonth',
            key: 'indexMonth',
            align: 'center',
            width:'13%',
          },
          {
            title: auditTable.thData[0][4],
            dataIndex: 'indexRing',
            key: 'indexRing',
            align: 'center',
            width:'13%',
          },
          {
            title: auditTable.thData[0][5],
            dataIndex: 'indexLevel',
            key: 'indexLevel',
            align: 'center',
            width:'13%',
          },
        ];
        // 波动性表体
        auditTable.tbodyData.forEach((data,index) => {
          indexData.push({
            key:index,
            indexId:data[0],
            indexName:data[1],
            indexUnit:data[2],
            indexDay:data[3],
            indexMonth:data[4],
            indexRing:data[5],
            indexLevel:data[6]
          })
        })
      }
    }else if (auditTable.thData.length === 2) {
        // 一致性表头
        indexColumns = [
          {
            title: auditTable.thData[0][0],  // 指标名称
            dataIndex: 'indexName',
            key: 'indexName',
            align: 'center',
          },
          {
            title: auditTable.thData[0][1],  // 单位
            dataIndex: 'indexUnit',
            key: 'indexUnit',
            align: 'center',
          }, {
            title: auditTable.thData[0][2], // dw3.0。。。
            align: 'center',
            children: [
              {
                title: auditTable.thData[1][0],  // 当日值
                dataIndex: 'indexDay',
                key: 'indexDay',
                align: 'center',
              }, {
                title: auditTable.thData[1][1],  // 本月累计
                dataIndex: 'indexMonth',
                key: 'indexMonth',
                align: 'center',
              },
            ]
          },
          {
            title: auditTable.thData[0][3],  // 旧经分指标
            align: 'center',
            children: [
              {
                title: auditTable.thData[1][2],  // 当日值
                dataIndex: 'indexOldDay',
                key: 'indexOldDay',
                align: 'center',
              },
              {
                title: auditTable.thData[1][3], // 本月累计
                dataIndex: 'indexOldMonth',
                key: 'indexOldMonth',
                align: 'center',
              },
            ]
          },
          {
            title: auditTable.thData[0][4],  // 对比结果
            align: 'center',
            children: [
              {
                title: auditTable.thData[1][4],  // 当日值
                dataIndex: 'indexComDay',
                key: 'indexComDay',
                align: 'center',
              },
              {
                title: auditTable.thData[1][5], // 本月累计
                dataIndex: 'indexComMonth',
                key: 'indexComMonth',
                align: 'center',
              },
            ]
          },
        ];
        // 一致性表体
        auditTable.tbodyData.forEach((data, index) => {
          indexData.push({
            key: index,
            indexName: data[0],
            indexUnit: data[1],
            indexDay: data[2],
            indexMonth: data[3],
            indexOldDay: data[4],
            indexOldMonth: data[5],
            indexComDay: data[6],
            indexComMonth: data[7]
          })
        })
      }
    const sw = window.screen.width;
    let selectorWidth;
    if (sw > 1300) {
      selectorWidth = 300
    } else{
      selectorWidth = 220
    }

    return(
      <PageHeaderWrapper>
        <div className={styles.dataAudit}>
          <div className={styles.auditTopTitle}>
            <h2>数据稽核</h2><span className={styles.auditTitleSpan}>{auditTitle}</span>
          </div>
          <div className={styles.auditTabs}>
            <Tabs onChange={this.changeTabs} size='small'>
              <TabPane tab={tabId[0].tabName} key={tabId[0].tabId}>
                {/* 1 */}
              </TabPane>
              <TabPane tab={tabId[1].tabName} key={tabId[1].tabId}>
                {/* 1 */}
              </TabPane>
            </Tabs>
          </div>
          <div className={styles.dataAuditHeader}>
            <div className={styles.daIndexList}>
              专题：
              <Select defaultValue={indexList[0].indexName} style={{ width: selectorWidth }} onChange={this.handleSelectorIndex}>
                {indexOption}
              </Select>
            </div>
            <div className={styles.daProName}>
              <DaProSelect />
            </div>
            <div className={styles.daDateTime}>
              日期：
              {dateSelect}
            </div>
            <div className={styles.daBtn} onClick={this.handleClickBtn.bind(this)}>
              查询
            </div>
          </div>
          <br />
          <Table columns={indexColumns} dataSource={indexData} rowClassName={this.changeRowColor} bordered size="small" pagination={false} />
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default DataAudit
