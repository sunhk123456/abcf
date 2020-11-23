/**
 * @Description: 导数一致性
 *
 * @author: liutong
 *
 * @date: 2019/03/21
 *
 */

import React, {Component} from 'react';
import {connect} from 'dva';
import {Tabs, DatePicker,Table } from 'antd';
import moment from 'moment';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import MultiCheckbox from "../../components/MultiCheckbox/multiCheckbox"

@connect(
  ({consistent}) => ({
    conformityTable:consistent.conformityTable,
  })
)

class Consistent extends Component{
  constructor(props){
    super(props);
    this.state={
      moduleTab:[{"tabId": "1", "tabName": "日专题"}, {"tabId": "2", "tabName": "月专题"}],
      selectorTabId:'1', // 默认为波动性id
      auditDate:moment().subtract(1, "days"),
      specialId:[]
    };
  }


  componentWillMount(){
    const {dispatch} = this.props;
    const params = {
      "date":moment(moment().subtract(1,'day')).format('YYYY-MM-DD'),
      "dateType":"1",
      "specialId":[],
    }
    dispatch({
      type:'consistent/fetchConformityTable',
      payload:params
    })
    dispatch({
      type:'RangeRelease/fetchCheckboxList',
      payload: { dateType:'1' }
    })
  }



  /**
   * 切换标签页
   * */
  changeTabs = (key) =>{
    const auditDate = key==='2'? moment(moment().subtract(1,'months')).format('YYYY-MM'): moment(moment().subtract(1,'days')).format('YYYY-MM-DD')
    const {dispatch} = this.props;
    const params = {
      "date":auditDate,
      "dateType":key,
      "specialId":[],
    }
    dispatch({
      type:'consistent/fetchConformityTable',
      payload:params
    })
    dispatch({
      type:'RangeRelease/fetchCheckboxList',
      payload: { dateType:key }
    })
   this.setState({
     selectorTabId:key,
     auditDate,
     specialId:[]
   })
  }


  /**
   * 点击查询按钮
   * */
  handleClickBtn = () =>{
    const {auditDate,selectorTabId,specialId} = this.state;
    const {dispatch} = this.props;
    const params = {
      "date":auditDate,
      "dateType":selectorTabId,
      "specialId":specialId,
    }
    dispatch({
      type:'consistent/fetchConformityTable',
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

  callbackSpecial=(data)=>{
    this.setState({
      specialId:data
    })
  }

  render(){
    const {moduleTab,selectorTabId,auditDate} = this.state
    const {conformityTable}= this.props;
    const { MonthPicker } = DatePicker;
    const {TabPane} = Tabs;
    const dateFormat = 'YYYY-MM-DD';
    const monthFormat = 'YYYY-MM';
    const dateSelect=selectorTabId==="1"? <DatePicker value={moment(auditDate,dateFormat)} format={dateFormat} allowClear={false} onChange={this.onChangeDatePicker} disabledDate={(current)=>current && current > moment().subtract(1,'day')} />: <MonthPicker value={moment(auditDate,monthFormat)} format={monthFormat} allowClear={false} onChange={this.onChangeMonthPicker} disabledDate={(current)=>current && current > moment().subtract(1,'months')} />
    const indexColumns=[];
    const indexData =[];
    if(conformityTable.length!==0){
      conformityTable.thData[0].forEach((item,index)=>{
        indexColumns.push({title:item,dataIndex:`items${index}`,key:`colums${index}`,align:'center',with:'10%'})
      })
      conformityTable.tbodyData.forEach((item,index)=>{
        const tableData = {}
        const key = 'key'
        tableData[key] = `body${index}`
        item.forEach((bodyitem,bodyindex)=>{
          tableData[`items${bodyindex}`]=bodyitem
        })
        indexData.push(tableData)
      })
    }
    return(
      <PageHeaderWrapper>
        <div className={styles.dataAudit}>
          <div className={styles.auditTopTitle}>
            <h2>导数一致性</h2>
          </div>
          <div className={styles.auditTabs}>
            <Tabs onChange={this.changeTabs} size='small'>
              <TabPane tab={moduleTab[0].tabName} key={moduleTab[0].tabId} />
              <TabPane tab={moduleTab[1].tabName} key={moduleTab[1].tabId} />
            </Tabs>
          </div>
          <div className={styles.dataAuditHeader}>
            <div className={styles.daIndexList}>
              <span>专题：</span>
              <MultiCheckbox callbackSpecial={this.callbackSpecial} />
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
          <Table className={styles.Table} columns={indexColumns} dataSource={indexData} rowClassName={this.changeRowColor} bordered size="small" pagination={false} />
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default Consistent
