/**
 * @Description: 弹出层情况概览表格
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import { Table } from 'antd';
import FontSizeEchart from '../../ProductView/fontSizeEchart';
import styles from './userTable.less';

class UserTable extends PureComponent {

  static defaultProps = {
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
        },
        {
          key:"3",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"4",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"5",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"6",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"7",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉投诉诉投诉投诉",
        },
        {
          key:"8",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"9",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },
        {
          key:"1",
          telNumber:"1589621xxxx",
          time:"2020-01-01 15:30:20",
          complaint:"投诉",
        },

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
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      widthTable: 0
    }
    this.tableDiv = React.createRef();
  }

  componentDidMount() {
    const widthTable =  this.tableDiv.current ? this.tableDiv.current.clientWidth : 0;
    this.setState({widthTable})
  }

  render() {
    const {tableData:{tbodyData,title,thData}} = this.props;
    const{titleSize}=FontSizeEchart();
    const {widthTable} = this.state;
    const handleThData = thData.map((item,index)=>{
      if(index === thData.length-1){
        return {
          title:item.title,
          dataIndex:item.id,
          key:item.id,
          width:widthTable-(thData.length-1)*250,
          render:(value) => (
            <div title={value} style={{width:`${widthTable-(thData.length-1)*250-12}px`}} className={styles.lastTd}>
              {value}
            </div>
          )
        }
      }
      return {
        title:item.title,
        dataIndex:item.id,
        key:item.id,
        width: 250,
      }
    })
    return (
      <div className={styles.userTable}>
        <div className={styles.tableTitle}>
          <div className={styles.title} style={{fontSize:titleSize}}>
            {title}
          </div>
        </div>
        <div className={styles.table} ref={this.tableDiv}>
          <Table
            columns={handleThData}
            dataSource={tbodyData}
            rowClassName={styles.trStyle}
            bordered
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

export default UserTable;
