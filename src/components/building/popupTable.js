/**
 * @Description: 弹出层情况概览表格
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import { Table, Pagination, message } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './popupTable.less'
import { getDownPath } from '@/services/download';
import { Downer } from '@/utils/downloadFile'


class PopupTable extends PureComponent {
  static defaultProps = {
    pageSize: 10,
    sizeOptions:["5","10","20"], // 每页要选择的个数
  }

  constructor(props) {
    super(props);
    this.state = {
      isState :"matching", // matching 已匹配楼宇, carding 已梳理楼宇
      handleThData:[],
      pageSize: props.pageSize
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const {tableData:{thData}} = this.props;
    if(!isEqual(thData,prevProps.tableData.thData)){
      this.handleThData();
    }
  }


  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 切换出路事件
   * @method handleSwitch
  */
  handleSwitch = ()=>{
    const {isState,pageSize} = this.state;
    const {tableData:{currentPage},callBackRequestTable} = this.props;
    const type = isState === "matching" ? "carding": "matching";
    this.setState({isState: type});
    callBackRequestTable(currentPage,pageSize.toString(),type,"false");
  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 改变每页条数
   * @method ShowSizeChange
   * @param {参数类型} 参数： 参数描述：参数是改变后的页码及每页条数
  */
  ShowSizeChange = (page,pageSize)=>{
    const {isState} = this.state;
    const {callBackRequestTable} = this.props;
    this.setState({pageSize});
    callBackRequestTable(page.toString(),pageSize.toString(),isState,"false");
  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 页码改变的方法，
   * @method 方法名
   * @param {参数类型} 参数： 参数描述：参数是改变后的页码及每页条数
   */
  pageSizeChange=(current, size)=>{
    const {isState} = this.state;
    const {callBackRequestTable} = this.props;
    callBackRequestTable(current.toString(),size.toString(),isState,"false");
  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 处理表头数据
   * @method handleThData
  */
  handleThData(){
    const {tableData:{thData}} = this.props;
    /**
     * 利用递归格式化每个节点
     */
    const formatTree = ((items, parentId) =>{
      const result = [];
      if (!items[parentId]) {
        return result;
      }

      for (const t of items[parentId]) {
        // t.title = t.unit === "" ? t.title : `${t.title}（${t.unit}）`;
        const children = formatTree(items, t.levelId);
        if(children.length > 0 ){
          t.children = children;
        }
        // 判断是否有子元素，如果没有关联表格数据字段
        if(!t.children){
          const tdKey = t.id;
          t.dataIndex = tdKey;
          t.key= tdKey;
        }
        result.push(t);
      }
      return result;
    });
    const getTrees = ((list, parentId) =>{
      const items= {};
      // 获取每个节点的直属子节点，记住是直属，不是所有子节点
      for (let i = 0; i < list.length; i += 1) {
        const key = list[i].levelPId;
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
      }
      return  formatTree(items, parentId);
    });
    const thData2 = [...thData];
    const handleThData = getTrees(thData2,"-1");

    this.setState({handleThData})
  }

  download(){
    const { downloadParam} = this.props;
    const params = downloadParam;
    getDownPath(params).then((res)=>{
      if(Object.keys(res).length === 1 && res.path){
        // Downer(`${downloadUrl.urls[3].url}${res.path}`)
        Downer(res.path)
      }else {
        message.error("下载失败！")
      }
    })
  }


  render() {
    const {handleThData,pageSize} = this.state;
    const {tableData:{tBodyData,title,total,currentPage},sizeOptions} = this.props;
    console.log("handleThData")
    console.log(handleThData)
    console.log(this.props.tableData)
    console.log(tBodyData,title,total,currentPage)
    return (
      <div className={styles.popupTable}>
        <div className={styles.tableTitle}>
          <div className={styles.line} />
          <div className={styles.title}>
            {title}
            <span className={styles.switchBtn} onClick={this.handleSwitch}>
              [切换]
            </span>
          </div>
          <div className={styles.download}>
            <div className={styles.text} onClick={()=>this.download()}>下载</div>
          </div>
        </div>
        <div className={styles.table}>
          <Table
            columns={handleThData}
            dataSource={tBodyData}
            rowClassName={styles.trStyle}
            bordered
            pagination={false}
          />
        </div>
        <div className={styles.paginCon}>
          <div className={styles.Notes}>注明：宽带：不含互联网专线及数据元;&nbsp;&nbsp;云业务：主要是公有云和私有云业务</div>
          <div className={styles.pagin}>
            <Pagination
              size="small"
              total={parseInt(total,10)}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={sizeOptions}
              pageSize={pageSize}
              current={parseInt(currentPage,10)}
              onShowSizeChange={this.ShowSizeChange}
              onChange={this.pageSizeChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default PopupTable;
