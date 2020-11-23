import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Table } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper'
import styles from "./inde.less"

@connect(
  ({
     downloadAllListModels,
   }) => ({
    downloadAllListModels,
  })
)
class DownloadAllList extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      tableData:[]
    }
    const {dispatch}=this.props;
    dispatch({
      type: 'downloadAllListModels/fetchDownloadTableData',
      payload: {},
    }).then((response)=>{
      this.setState({
        tableData:response
      })
    })

  }

   handleTableData=(tableData)=>{
     if(tableData.length>0){
       // console.log("tableData")
       // console.log(tableData)
       const newData=[];
       tableData.map((item,index)=>{
         let dataItem={}
         if(item.state==="0"){
            dataItem={
             key:index,
             number:index+1,
             specialName:item.specialName,
             accountPeriod:item.accountPeriod,
             downloadTime:item.downloadTime,
             downloadId:item["downloadId "],
             state:item.state,
             expiring:"已过期",
             download:"下载",
           }
         }
         else if(item.state==="1"){
           dataItem={
             key:index,
             number:index+1,
             specialName:item.specialName,
             accountPeriod:item.accountPeriod,
             downloadTime:item.downloadTime,
             downloadId:item["downloadId "],
             state:item.state,
             expiring:"下载中",
             download:"下载中",
           }
         }
         else{
           dataItem={
             key:index,
             number:index+1,
             specialName:item.specialName,
             accountPeriod:item.accountPeriod,
             downloadTime:item.downloadTime,
             downloadId:item["downloadId "],
             state:item.state,
             expiring:"已就绪",
             download:"下载",
           }
         }

         return newData.push(dataItem)
       })
       return newData
     }
     return null
   }

  // 让表格隔行变色
  changeRowColor = (record,index) => {
    let className = styles.lightRow;
    if (index % 2 === 1) className = styles.darkRow;
    return className;
  };

  downloadOnClicked=(text,record)=>{
    // console.log("text,record")
    // console.log(text)
    // console.log(record)
    const {dispatch}=this.props;
    dispatch({
      type: 'downloadAllListModels/fetchDownloadItem',
      payload: {
        // date: "2019-01",
        // excelId: "ac75fcf0-78e0-4158-941e-bf99798e8331"
        date:record.accountPeriod,
        excelId: record.downloadId
      },
      callback:(e)=>{
        window.open(e.path,"_self");
      }
    })

}





  render() {
    const{tableData}=this.state;
    const data =this.handleTableData(tableData)
    const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '专题名称',
      dataIndex: 'specialName',
      key: 'specialName',
    }, {
      title: '账期',
      dataIndex: 'accountPeriod',
      key: 'accountPeriod',
    }, {
      title: '下载时间',
      key: 'downloadTime',
      dataIndex: 'downloadTime',
    }, {
      title: '状态',
      key: 'expiring',
      dataIndex: 'expiring',
    }, {
      title: '下载',
      key: 'download',
      dataIndex: 'download',
        render: (text, record) =>
            (<span className={record.state==="2"?styles.downLoad:styles.textFontSize} onClick={()=>record.state==="2"?this.downloadOnClicked(text,record):null}>{text}</span>)
    }
    ];
    return(
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.page}>
            <div className={styles.title}>全量下载列表</div>
            <div className={styles.table}>
              <Table
                bordered
                columns={columns}
                dataSource={data}
                pagination={false}
                rowClassName={this.changeRowColor}
              />
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default DownloadAllList;
