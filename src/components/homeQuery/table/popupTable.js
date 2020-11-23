/**
 * @Description: 弹出层情况概览表格
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import { Table, Pagination } from 'antd';

import styles from './popupTable.less'



class PopupTable extends PureComponent {
  static defaultProps = {
    pageSize: 10,
    isPaging: true,
    tableData:{
      title:"用户感知",
      tbodyData:[
        {
          key:"1",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"2",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        }
      ],
      thData: [
        {
          title: "号码",
          id: "telNumber",
          unit: "",
        },
        {
          title: "时间",
          id: "time",
          unit: "",
        },
        {
          title: "投诉/咨询",
          id: "complaint",
          unit: "",
        },
      ],
      total: "15",
      currentPage: "1",
      totalPage: "3",
    }
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 页码改变的方法，
   * @method 方法名
   * @param {参数类型} 参数： 参数描述：参数是改变后的页码及每页条数
   */
  pageSizeChange=(current)=>{
    const {callBackRequestTable} = this.props;
    console.log(current.toString())
    callBackRequestTable(current.toString());
  };

  render() {
    const {tableData:{tbodyData,thData,total,currentPage},pageSize,isPaging} = this.props;
    const handleThData = thData.map((item)=>({
        title:item.title,
        dataIndex:item.id,
        width:`${100/thData.length}%`,
        className:styles.tableItem,
        key:item.id,
        render:(text)=>(<div className={styles.renderText} title={text}>{text}</div>)
      }));
    return (
      <div className={styles.popupTable}>
        <div className={styles.table}>
          <Table
            columns={handleThData}
            dataSource={tbodyData}
            rowClassName={styles.trStyle}
            bordered
            scroll={{y:330}}
            pagination={false}
          />
        </div>
        {isPaging && (
          <div className={styles.paginCon}>
            <div className={styles.pagin}>
              <Pagination
                hideOnSinglePage
                size="small"
                total={parseInt(total,10)}
                showQuickJumper
                pageSize={pageSize}
                current={parseInt(currentPage,10)}
                onChange={this.pageSizeChange}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default PopupTable;
