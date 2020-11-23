import React, { PureComponent } from 'react';
import { Icon, Table } from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import { handleDownloadTableValue } from '../../utils/tool';

import styles from './table.less';


class BuildingTable extends PureComponent {
  
  static defaultProps = {
    'specialName': '政企楼宇转交情况',
    'provName': '全国',
    'cityName': '全国',
    'date': '2019-11-20',
    tableData: {
      'title': '省分公司已匹配楼宇业务看板',
      'thData': [
        {
          'title': '楼长匹配情况',
          'levelId': '1',
          'levelPId': '-1',
          'id': 'xkey1',
        },
        {
          'title': '已匹配楼宇对应业务规模（户）',
          'levelId': '2',
          'levelPId': '-1',
          'id': 'xkey2',
        },
        {
          'title': '已匹配楼宇对应业务收入（户）',
          'levelId': '3',
          'levelPId': '-1',
          'id': 'xkey3',
        },
        {
          'title': '上传楼宇数',
          'levelId': '11',
          'levelPId': '1',
          'id': 'xkey11',
        },
        {
          'title': '已匹配楼长楼宇数',
          'levelId': '12',
          'levelPId': '1',
          'id': 'xkey12',
        },
        {
          'title': '宽带',
          'levelId': '21',
          'levelPId': '2',
          'id': 'xkey21',
        },
        {
          'title': '互联网专线',
          'levelId': '22',
          'levelPId': '2',
          'id': 'xkey22',
        },
      ],
      'tbodyData': [
        {
          'key': '2',
          'dimensionId': '111',
          'parentId': '-1',
          'xkey11': '对应列名称11',
          'xkey12': '对应列名称12',
          'xkey21': '对应列名称21',
          'xkey22': '对应列名称22',
          'xkey3': '对应列名称3',
        },
        {
          'key': '1',
          'dimensionId': '235',
          'parentId': '111',
          'xkey11': '对应列名称11',
          'xkey12': '对应列名称12',
          'xkey21': '对应列名称21',
          'xkey22': '对应列名称22',
          'xkey3': '对应列名称3',
        },
      ],
    },
    callback: () => {},
  };
  
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],// 表格展开项
      thData: [],
      tbodyData: [],
      tableWidth: [],
      downloadTbodyItem:[],// 下载数据表头item
      downloadTbodyData:[] // 下载数据表格体
    };
  };
  
  componentDidMount() {
    const { tableData } = this.props;
    const { thData, tbodyData } = tableData;
    if(thData.length<1){return null}
    this.handleThData(thData);
    this.handleTbodyData(tbodyData);
    return null
  }
  
  componentDidUpdate(prevProps) {
    const { tableData } = this.props;
    if (!isEqual(tableData, prevProps.tableData)) {
      // eslint-disable-next-line
      this.setState({
        tableWidth: [],
        downloadTbodyItem:[],
        downloadTbodyData:[] // 下载数据表格体
      },()=>{
        console.log('componentDidUpdate');
        console.log(tableData);
        const { thData, tbodyData } = tableData;
        this.handleThData(thData);
        this.handleTbodyData(tbodyData);
      });
  
    }
    
  }
  
  
  /**
   *  处理表头递归函数
   * */
  getTrees = (items, parentId) => {
    const newThData = [];
    if (!items[parentId]) {
      return newThData;
    };
    const { tableWidth,downloadTbodyItem } = this.state;
    let minTdWidth = 150; // 省份 产品分类的宽度
    items[parentId].map((item) => {
      // eslint-disable-next-line
      if(parentId==='-1'){ item.downloadTitle=item.title;}  // 为表头第一层添加downloadTitle
      
      if (items[item.levelId] && items[item.levelId].length > 0) {
        this.getTrees(items, items[item.levelId][0].levelPId);
        // eslint-disable-next-line
        item.children = items[item.levelId];
        
        item.children.forEach((itemChildren)=>{
          // eslint-disable-next-line
          itemChildren.downloadTitle=`${item.downloadTitle}-${itemChildren.title}` // 为表头其它层层添加downloadTitle
        })
      }
      // 判断是否有子元素，如果没有关联表格数据字段
      if (!item.children) {
        if (item.title.length > 8) {
          minTdWidth = 200;
        }
        tableWidth.push(minTdWidth);
        downloadTbodyItem.push(item);
        // eslint-disable-next-line
        item.width = minTdWidth;
        // eslint-disable-next-line
        item.key = item.id;
        // eslint-disable-next-line
        item.dataIndex = item.id;
        // eslint-disable-next-line
        item.align = 'center';
        // eslint-disable-next-line
        item.render=(text)=><span title={text}>{text}</span>
      }
      newThData.push(item);
      return null;
    });
    return newThData;
    
  };
  
  
  handleThData = (thData) => {
    const thData2 = JSON.parse(JSON.stringify(thData));
    const items = {};
    thData2.forEach((item) => {
      if (!item.levelPId) {return null;}
      if (!items[item.levelPId]) {
        items[item.levelPId] = [];
      }
      items[item.levelPId].push(item);
      return null;
    });
    const newThData = this.getTrees(items, '-1');
    newThData[0].fixed=true;
    newThData[0].align="left";
    newThData[0].className=styles.trDiv;
    console.log("newThData");
    console.log(newThData);
    this.setState({
      thData: newThData,
    });
  };
  
  
  /**
   *  处理表格体递归函数
   * */
  getTbodyDataTrees = (items, parentId) => {
    const newTbodyData = [];
    if (!items[parentId]) {
      return newTbodyData;
    };
    const { downloadTbodyData } = this.state;
   
    items[parentId].map((item) => {
      downloadTbodyData.push(item); // 排好序的下载表格体数据
      if (items[item.dimensionId] && items[item.dimensionId].length > 0) {
        this.getTbodyDataTrees(items, items[item.dimensionId][0].parentId);
        // eslint-disable-next-line
        item.children = items[item.dimensionId];
      }
      newTbodyData.push(item);
      return null;
    });
    return newTbodyData;
    
  };
  
  handleTbodyData = (tbodyData) => {
    if(tbodyData.length<1){   this.setState({ tbodyData: [] });return null}
    const tbodyData2 = JSON.parse(JSON.stringify(tbodyData));
    const items = {};
    tbodyData2.forEach((item) => {
      if (!item.parentId) {return null;}
      if (!items[item.parentId]) {
        items[item.parentId] = [];
      }
      items[item.parentId].push(item);
      return null;
    });
    const newTbodyData = this.getTbodyDataTrees(items, '-1');
    console.log("表格体递归处理后数据")
    console.log(newTbodyData)
    this.setState({
      tbodyData: newTbodyData,
    });
    return null;
  };
  
  onExpend = (expanded, obj) => {
    // expanded是当前点击行是否展开的状态  obj是当前点击的行信息
    const { dimensionId } = obj;
    const { expandedRowKeys } = this.state;
    const spliceArr = [...expandedRowKeys];
    if (expanded) {
      spliceArr.push(dimensionId);
    } else if (!expanded && spliceArr.indexOf(dimensionId) !== -1) {
      spliceArr.splice(spliceArr.indexOf(dimensionId), 1);
    }
    this.setState({ expandedRowKeys: spliceArr });
  };
  
  onRow = (record) => {
    const { callback } = this.props;
    return {
      onClick: event => {
        callback(event, record);
      }, // 点击行
      onMouseEnter: event => {
        const {popType} = record;
       if( popType !== "notPop"){
         // eslint-disable-next-line
         event.currentTarget.style.cursor="pointer";
       }
      }, // 鼠标移入行
    };
  };
  
  download=(e)=>{
    e.stopPropagation();
    DownloadFile(this.jsonHandle());
  };
  
  jsonHandle=()=>{
    const {specialName,date,tableData} = this.props;
    const {title}=tableData;
    const { downloadTbodyItem,downloadTbodyData } = this.state;
    const downloadTbodyKey=downloadTbodyItem.map((item)=>(item.id));
    const tableTitle=downloadTbodyItem.map((item)=>(item.downloadTitle));
    const tableValue=handleDownloadTableValue(downloadTbodyData,downloadTbodyKey);
    const table = {
      title: [
        tableTitle
      ],
      value: tableValue
      
    };
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName],
        //  表格不联动去掉省份地市筛选条件
        // ["省份",provName],
        // ["地市",cityName],
        ["日期",date]
      ],
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };
  
  render() {
    const { tableData } = this.props;
    const { title } = tableData;
    const { thData, tbodyData, tableWidth } = this.state;
    let width = 100;
    if (tableWidth.length > 2) {
      width = tableWidth.reduce((x, y) => (x + y));
    }
    console.log("tableWidth")
    console.log(tableWidth)
    let height = 600;
    const sw = window.screen.width;
    if ((sw >= 750) && (sw < 1299)) {
      height = 500;
    } else if ((sw >= 1300) && (sw < 1869)) {
      height = 510;
    } else if ((sw >= 1870) && (sw < 2159)) {
      height = 710;
    }
    // 确保scroll的x的长度
    return (
      <div className={styles.page}>
        <div className={styles.title}>
          <div className={styles.titleText}>{title}</div>
          <div className={styles.line} />
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        </div>
        <div className={styles.content}>
          <Table
            bordered
            className={styles.table}
            pagination={false}
            rowClassName={styles.trStyle}
            onExpand={this.onExpend}
            onRow={this.onRow}
            columns={thData}
            dataSource={tbodyData}
            scroll={{ y: height, x: width }}
          />
        </div>
      </div>
    );
  }
}

export default BuildingTable;
