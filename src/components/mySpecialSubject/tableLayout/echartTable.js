import React, { Component } from 'react';
import { Table,Tooltip } from 'antd';
import styles from "./tableLineEchart.less"
import EarlyWarning from '../../DayOverView/earlyWarning';
import FontSizeEchart from '../../ProductView/fontSizeEchart';

class MySpecialTimeEchartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  // 让详细解释表格隔行变色
  changeRowColor = (record,index) => {
    let className = styles.lightRow;
    if (index % 2 === 1) className = styles.darkRow;
    return className;
  };
  
  // 处理表格数据
  handleTableData=(thData=[],tbodyData=[])=>{
    if(thData.length < 1) return { columns:[] ,data:[]};
    const columns = [
      {
        title: thData[0],
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: thData[1],
        dataIndex: 'value',
        key: 'value',
        render:(text,record)=>{
          if(record.warningLevel){
            return(
              <Tooltip placement="bottom" title={(<EarlyWarning warningLevel={record.warningLevel} desc={record.desc} />)} overlayClassName={styles.warningTip}>
                <span>{text}</span>
                <span className={styles.classColorName}>*</span>
              </Tooltip>
            )
          }
          return(
            <div>
              {text}
            </div>
          )
        }
      },
    ];
    const data=tbodyData.map((item,index)=>
      ({
        key:index,
        ...item,
        
      })
    );
    
    return { columns ,data}
  };
  
  render() {
    const {tableData}=this.props;
    if(!tableData){return null}
    if(!tableData.tableData && !tableData.thData){return null}
    const {thData,tbodyData=[]}=tableData.tableData;
    const {title}=tableData;
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily}=fontsize;
    const {columns=[],data=[]}= this.handleTableData(thData,[...tbodyData].reverse());
    let tbodyData1=[];
    let tbodyData2=[];
    if(data.length>0){
      const middle=Math.ceil(data.length/2);
      tbodyData1=data.slice(0,middle);
      tbodyData2=data.slice(middle);
    }
    return (
      <div className={styles.tablePage}>
        <div className={styles.tableTitle} style={{fontSize:titleSize,fontWeight:titleWeight,fontFamily:titleFamily}}>{title}</div>
        <div className={styles.table}>
          <Table
            bordered
            columns={columns}
            dataSource={tbodyData1}
            rowClassName={this.changeRowColor}
            pagination={false}
          />
        </div>
        <div className={styles.table}>
          <Table
            bordered
            columns={columns}
            dataSource={tbodyData2}
            rowClassName={this.changeRowColor}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default MySpecialTimeEchartTable;
