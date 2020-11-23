/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/11/27
 */

import React, {PureComponent} from 'react';

import {Table} from "antd";
import styles from "./changeTable.less";

class ChangeTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  onShowSizeChange = (current, size)=>{
    const {callbackPageSize} = this.props;
    callbackPageSize("1",size.toString());
  };

  onChangeSize=(page)=>{
    const {callbackPageSize} = this.props;
    callbackPageSize(page.toString());
  };

  // 隔行变色
  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  };


  render() {
    const {tableState, pageSizeOptions,type, pageSize,selIndex,indexTableData,columns,callBackSelectId} = this.props;
    const {indexList,currentNum,totalNum,specialList} = indexTableData;
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        callBackSelectId(selectedRowKeys)
      },
      selectedRowKeys:selIndex,
      // getCheckboxProps: record => ({
      //   // selectedRowKeys:record.key,
      //   // defaultChecked: record.key,
      //   // disabled: record.name === 'Disabled User',
      //   // name: record.name,
      // }),
    };
    let data = [];
    if(type==="special"){
      data = specialList.map((item) => {
        const res = {
          key: `${item.specialId}&&${item.istransfer}&&${item.tabId}&&${item.ROW_ID}`,
          specialId: item.specialId,
          tabId:item.tabId,
          specialName: item.specialName,
          tabName:item.tabName,
          PreRelease: item.preDate,
          Release: item.currentDate,
        };
        return res;
      });
    }else {
      data = indexList.map((item) => {
        const res = {
          key: `${item.kpiId}&&${item.isTransfer}&&${item.ROW_ID}`,
          indicatorsID: item.kpiId,
          indicatorsName: item.kpiName,
          specialName: item.specialName,
          PreRelease: item.preDate,
          Release: item.currentDate,
        };
        return res;
      });
    }
    return (
      <div className={styles.changeTable}>
        <Table
          {...tableState}
          className={styles.table}
          rowClassName={this.changeRowColor}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{
            current: parseInt(currentNum,10),
            pageSize: parseInt(pageSize,10),
            pageSizeOptions,
            showSizeChanger: true,
            total: parseInt(totalNum,10) ,
            showQuickJumper: true, // 快速跳转至某页
            onChange:(page, size)=>this.onChangeSize(page, size),
            onShowSizeChange:(current, size)=>this.onShowSizeChange(current, size),
          }}
        />
      </div>
    )
  }
}

export default ChangeTable;
