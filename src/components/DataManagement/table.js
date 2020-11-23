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
 * @author: 喵帕斯
 * @date: 2020/7/17
 */


import React, {PureComponent} from 'react';
import { Table, Pagination } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './table.less';


class DataManagementTable extends PureComponent {
  static defaultProps = {
    tableData:{
      "thData": [
        {
          "title": "指标名称",
          "dataIndex": "aa",
          "hasSort": "true"

        },
        {
          "title": "指标名称",
          "dataIndex": "bb",
          "hasSort": "true"

        },
        {
          "title": "指标名称",
          "dataIndex": "cc",
          "hasSort": "true"

        }
      ],
      "tbodyData": [
        {
          "key":"01",
          "aa": "ckp2323",
          "bb": "xx11",
          "cc": "xx21",
        },
        {
          "key":"02",
          "aa": "ckp233",
          "bb": "xx2",
          "cc": "xx3",
        }
      ],
      "total":"100",
      "currentPage":"1",
      "totalPage":"10",
    },
    pageSize: 10,
    sizeOptions:["5","10","20"], // 每页要选择的个数
  };

  constructor(props) {
    super(props);
    this.state = {
      handleThData:[],
      pageSize: props.pageSize
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const {tableData} = this.props;
    if(!isEqual(tableData,prevProps.tableData)){
      this.handleThData();
    }
  }




  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 改变每页条数
   * @method ShowSizeChange
   * @param {参数类型} 参数： 参数描述：参数是改变后的页码及每页条数
   */
  ShowSizeChange = (page,pageSize)=>{
    const {callBackRequestTable} = this.props;
    this.setState({pageSize});
    callBackRequestTable(page.toString(),pageSize.toString(),'','');
  };

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 页码改变的方法，
   * @method 方法名
   * @param {参数类型} 参数： 参数描述：参数是改变后的页码及每页条数
   */
  pageSizeChange=(current, size)=>{
    console.log('页码改变的方法被点击');
    console.log(current.toString(),size.toString());
    const {callBackRequestTable} = this.props;
    callBackRequestTable(current.toString(),size.toString(),'','');
  };


  tableOnchange=(pagination, filters, sorter,)=>{
    console.log(sorter)
    console.log('排序被点击')
    const sortId=sorter.column?sorter.column.dataIndex:"";
    let order='';
    if(sorter.order==="ascend"){
      order="asc"
    }else if(sorter.order==="descend"){
      order="desc"
    }
    const {callBackRequestTable,pageSize} = this.props;
    callBackRequestTable("1",pageSize.toString(),sortId,order);
  };


  // 让表格隔行变色
  changeRowColor = (record,index) => {
    let className = styles.lightRow;
    if (index % 2 === 1) className = styles.darkRow;
    return className;
  };

  /**
   * @date: 2019/7/17
   * @author 喵帕斯
   * @Description: 处理表头数据
   * @method handleThData
   */
  handleThData =() =>{
    const {tableData:{thData}} = this.props;

    const handleThData = thData.map(
      (item)=>(
        {
          title:item.title,
          dataIndex:item.dataIndex,
          sorter:item.hasSort==="true",
          render:(text)=>(<div title={text} className={styles.tableTh}>{text}</div>)

        }
      )
    );

    this.setState({handleThData})
  }


  showTotal=(total)=> (`共 ${total} 条`);


  render() {
    const {handleThData,pageSize} = this.state;
    const {tableData:{tbodyData,title,total,currentPage},sizeOptions} = this.props;
    // console.log("handleThData");
    // console.log(handleThData);
    // console.log(tbodyData);
    // console.log(title,total,currentPage);
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableTitle}>
          <div className={styles.line} />
          <div className={styles.title}>
            {title}
          </div>
        </div>
        <div className={styles.table}>
          <Table
            onChange={this.tableOnchange}
            columns={handleThData}
            dataSource={tbodyData}
            rowClassName={this.changeRowColor}
            bordered
            pagination={false}
            scroll={{ x: 1800 }}
          />
        </div>
        <div className={styles.paginationWrapper}>
          <Pagination
            showTotal={this.showTotal}
            size="small"
            total={parseInt(total||1,10)}
           // showSizeChanger
            showQuickJumper
            pageSizeOptions={sizeOptions}
            pageSize={pageSize}
            current={parseInt(currentPage||1,10)}
            onShowSizeChange={this.ShowSizeChange}
            onChange={this.pageSizeChange}
          />
        </div>
      </div>
    )
  }
}

export default DataManagementTable;

