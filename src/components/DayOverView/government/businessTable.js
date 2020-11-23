/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  政企总览-创新业务表格</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/19
 */

import React from 'react';
import { Table } from 'antd';
import Tooltip from "antd/es/tooltip";
import styles from './businessTable.less'

class BusinessTable extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};

  }


  componentDidMount() {

  }

  //  处理表头数据
  creatColumn = data => data && data.map(item => {
    let itemData;
    if(item.dataIndex === 'kpiName') {
      itemData = {
        title: item.title,
        dataIndex: item.dataIndex,
        onCell: () => ({
          style: {
            maxWidth: 150,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer",
          }
        }),
        render: text => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>)
      }
    } else if(item.dataIndex === 'momValue'){
      itemData = {
        title: `${item.title} (${item.unit})`,
        width: 120,
        dataIndex: item.dataIndex,
      }
    } else if(item.dataIndex === 'kpiValue'){
      itemData = {
        title: `${item.title} (${item.unit})`,
        width: '25%',
        dataIndex: item.dataIndex,
      }
    }
    return itemData
  })


  render() {
    const { data } = this.props;
    return (
      <div className={styles.businessTable}>
        <div className={styles.triangle} />
        <div className={styles.tableTitle}>{data.title}</div>
        <Table
          bordered
          pagination={false}
          columns={this.creatColumn(data.thData)}
          dataSource={data.tbodyData}
          scroll={{ y: 114 }}
        />
      </div>
    );
  }
}

export default BusinessTable;
