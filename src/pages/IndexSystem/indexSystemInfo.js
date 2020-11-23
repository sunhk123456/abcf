import React, { Component, Fragment } from 'react';
import { connect } from 'dva/index';
import { Button, Form, Icon, message, Input, Select, Table, Tree } from 'antd';
import styles from './indexSystemInfo.less';
import down from './img/u186.png';
import up from './img/u187.png';
import onUp from './img/u206.png';
import onDown from './img/u207.png';
import Cookie from '../../utils/cookie';
import Urls from '@/services/urls.json';

/* eslint-disable */
const { TreeNode } = Tree;
const { Option } = Select;

@connect(({ indexSystemData }) => ({
  treeData: indexSystemData.treeData,
  versionSelectData: indexSystemData.versionSelectData,
  nextFlag: indexSystemData.nextFlag,
  tbodyData: indexSystemData.tbodyData,
  currentNum: indexSystemData.currentNum, // 当前页
  totalNum: indexSystemData.totalNum, // 总个数
  totalPageNum: indexSystemData.totalPageNum, // 总页数
  thData: indexSystemData.thData,
  markType: indexSystemData.markType,
  indexNavData: indexSystemData.indexNavData
}))
@Form.create()
class IndexSystemInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expendTreeNode: [], // 左侧tree展开得节点
      loading: false, // table切换时加载页面
      indexType: 'versionSearch', // 指标类型，有三种 版本管理versionManagement，版本查询versionSearch，版本差异versionDifference
      currentPayload: {
        Rtype: '',
        type: '',
        id: '',
        difference: '',
        versionId: '',
        uniqueCode: '',
        kpiCode: '',
        kpiOrDimName: '',
        versionName: '',
        num: 12,
        currentNum: 1,
      }, // 存储当前dispatch所需payload的一些信息
      showTree: true, // 显示左侧树结构
      option: [], // checkbox的被选中选项
      defaultOptions: [], // checkbox默认可选中的项
      upImg: true, // table列表筛选条件控制升序图标
      downImg: false, // table列表筛选条件控制降序图标
      showCheckBox: false, // 控制下拉checkbox
      sortTable: 'up', // 用于表格升序降序
      defaultSelectedKeys: [], // 默认选中的节点
      pageValue:"", // 跳转输入的页数
    };
  }

  componentDidMount() {
    this.requestData();
  }

  // 请求页面数据
  requestData = () => {
    const { dispatch, markType } = this.props;
    const { currentPayload } = this.state;
    dispatch({
      type: 'indexSystemData/fetchLeftTree',
      payload: {
        markType,
      },
    }).then(res => {
      // 处理返回数据，首先获取所有子节点并且获取第一个
      const childNode = [];
      const parentNode = [];
      const loop = data =>{
        data.map((item, index) => {
          if(index === 0){
            // 取第一个子节点，用于树结构展开节点
            parentNode.push(item.id);
            if(item.children.length !== 0){
              return loop(item.children);
            }
            childNode.push(item)
          }
          return item;
        })
      }
      loop(res);
      const {Rtype, type, id} = childNode[0];
      const expendTreeNode = [...parentNode];
      const defaultSelectedKeys = [];
      defaultSelectedKeys.push(expendTreeNode.pop());
      // expendTreeNode.splice(expendTreeNode.length-1 , 1);
      // 默认节点的请求payload
      const payload = {
        ...currentPayload,
        Rtype:"M03",
        type:"indexTree",
        id:"mo_indexTree"
      }
      // 刘彤2019/7/19修改，默认展开指标版本查询-企业管理域-指标树
      this.setState({
        currentPayload: payload,
        expendTreeNode:["M03","M03_MO"],
        defaultSelectedKeys:["mo_indexTree"]
      })
      this.requestTableData(payload);
    });
  };

  requestTableData = (payload) => {
    const { dispatch, markType } = this.props;
    const newPayLoad = {
      ...payload,
      markType
    }
    dispatch({
      type: 'indexSystemData/fetchTableData',
      payload: newPayLoad,
    }).then(response => {
      // 生成用于展示列的checkbox选项
      this.createChooseTableHeader(response.thData);
    });
    dispatch({
      type: 'indexSystemData/fetchVersionSelect',
      payload: {
        markType,
        id: payload.id
      }
    })
  }

  // 点击左侧树结构树节点
  onSelect = (selectKeys, e) => {
    const { expendTreeNode ,currentPayload} = this.state;
    const { eventKey, children, pos } = e.node.props;
    const defaultSelectedKeys=[];
    defaultSelectedKeys.push(selectKeys[0]);
    // 不是叶节点时
    if (children.length > 0) {
      // 已经展开的收缩，没展开的展开
      if (expendTreeNode.indexOf(eventKey) > -1) {
        const index = expendTreeNode.indexOf(eventKey);
        expendTreeNode.splice(index, 1);
      } else {
        expendTreeNode.push(eventKey);
      }
      this.setState({
        expendTreeNode,
      });
    }
    if (e.selected && children.length === 0) {
      this.setState({
        loading: true,
      });
      const level = pos.substr(2, 1);
      switch (level) {
        case '0':
          this.setState({
            indexType: 'versionManagement',
          });
          break;
        case '1':
          this.setState({
            indexType: 'versionDifference',
          });
          break;
        case '2':
          this.setState({
            indexType: 'versionSearch',
          });
          break;
        default:
          break;
      }
      // 置空form文本框
      const { form } = this.props;
      const { dispatch, indexNavData, markType } = this.props;
      form.setFieldsValue({
        versionName: '',
        uniqueCode: '',
        kpiCode: '',
        kpiOrDimName: '',
        difference: 'all',
        // versionId: response.data.length === 0 ? '全部' : response.data[0].id,
      });
      if(level === '2') {
        dispatch({
          type: 'indexSystemData/fetchVersionSelect',
          payload: {
            markType,
            id: selectKeys[0],
          }
        }).then((response) => {
          form.setFieldsValue({
            versionId: response.data.length === 0 ? '全部' : response.data[0].id,
          });
        });
      }
      // indexNavData请求返回，未作处理的数据
      let chooseTreeNode = {};
      // 用选中点的id取匹配整个节点的数据
      indexNavData.forEach(item => {
        if (item.id === selectKeys[0]) {
          chooseTreeNode = item;
        }
      });
      const { Rtype, type } = chooseTreeNode;
      // 每次点击树节点请求数据重置num和numStart，用于控制显示上一页下一页
      const payload = {
        ...currentPayload,
        markType,
        Rtype,
        type,
        id: selectKeys[0],
        num: 12,
        currentNum: 1,
        difference: '',
        versionId: '',
        uniqueCode: '',
        kpiCode: '',
        kpiOrDimName: '',
        versionName: '',
      };
      dispatch({
        type: 'indexSystemData/fetchTableData',
        payload,
      }).then(response => {
        this.createChooseTableHeader(response.thData);
        this.setState({
          currentPayload: payload,
          loading: false,
          defaultSelectedKeys,
          upImg: true,
          downImg: false,
          pageValue:"",
        });
      });
    }
    this.setState({
      loading: false,
    });
  };

  // 左侧树结构展开节点时触发
  onExpand = (expandedKeys) => {
    this.setState({
      expendTreeNode: expandedKeys,
    });
  };

  // 左侧树的显示隐藏
  shrinkTree = () => {
    const { showTree } = this.state;
    this.setState({
      showTree: !showTree,
    });
  };

  // 表格条件的查询按钮
  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
      pageValue:""
    });
    const {form,dispatch}=this.props;
    const { currentPayload }=this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for(const key in fieldsValue) {
        if (fieldsValue[key] === null) {
          fieldsValue[key] = '';
        }else if (fieldsValue[key]!==undefined){
          fieldsValue[key] = fieldsValue[key].trim();
        }else if(fieldsValue[key]===undefined){
          fieldsValue[key] =  "";
        }
      }
      const {indexType} = this.state;
      const  newPayLoad = {...currentPayload};
      if(indexType === 'versionManagement'){
        newPayLoad.versionName = fieldsValue.versionName;
      }else if(indexType === 'versionDifference'){
        newPayLoad.uniqueCode = fieldsValue.uniqueCode;
        newPayLoad.kpiCode = fieldsValue.kpiCode;
        newPayLoad.kpiOrDimName = fieldsValue.kpiOrDimName;
        newPayLoad.difference = fieldsValue.difference;
      }else if(indexType === 'versionSearch'){
        newPayLoad.uniqueCode = fieldsValue.uniqueCode;
        newPayLoad.kpiCode = fieldsValue.kpiCode;
        newPayLoad.kpiOrDimName = fieldsValue.kpiOrDimName;
        newPayLoad.versionId = fieldsValue.versionId === '全部' ? '-1' : fieldsValue.versionId;
      }
      newPayLoad.currentNum = 1;
      dispatch({
        type: 'indexSystemData/fetchTableData',
        payload: newPayLoad,
      }).then(() => {
        this.setState({
          loading: false,
          upImg: true,
          downImg: false,
          currentPayload: newPayLoad
        })
      });
    });
  };

  // 生成可选择的表头数据
  createChooseTableHeader = thData => {
    const option = [];
    const defaultOptions = [];
    thData.forEach(item => {
      option.push(item);
      defaultOptions.push(item);
    });
    this.setState({
      option,
      defaultOptions,
    });
  };

  // 生成表头选项按钮
  getColumnSearchProps = () => {
    const {upImg, downImg } = this.state;
    return ({
      filterDropdown: () => (
        <div className={styles.dropOption}>
          <span
            id="upImg"
            className={styles.tableUp}
            onFocus={this.noting}
            // onMouseOver={() => this.dropBtnOver('up')}
            // onMouseLeave={() => this.dropBtnLeave('up')}
            onClick={() => this.dropBtnSort('up')}
            style={{background: upImg ? '#C91717': '#FFFFFF', color: upImg ? '#FFFFFF' : '#666666' }}
          >
            <img src={upImg ? onUp : up} alt="升序" className={styles.orderImg} />升序
          </span>
          <span
            id="downImg"
            className={styles.tableDown}
            onFocus={this.noting}
            // onMouseOver={() => this.dropBtnOver('down')}
            // onMouseLeave={() => this.dropBtnLeave('down')}
            onClick={() => this.dropBtnSort('down')}
            style={{background: downImg ? '#C91717': '#FFFFFF', color: downImg ? '#FFFFFF' : '#666666'}}
          >
            <img src={downImg ? onDown : down} alt="降序" className={styles.orderImg} />降序
          </span>
        </div>
      ),
      filterIcon: filtered => <Icon type="caret-down" />,
    });
  };

  // 占位nothing
  noting = () => {

  };

  // 点击列设置
  showColumnCheckBox = () => {
    this.setState({
      showCheckBox: true,
    });
  }

  // 离开列设置
  hideColumnCheckBox = () => {
    this.setState({
      showCheckBox: false,
    });
  }

  // 生成列checkbox列
  createCheckBox = () => {
    const { option, defaultOptions, showCheckBox } = this.state;
    return(
      <div
        className={styles.checkBoxGroup}
        style={{display: showCheckBox ? '': 'none'}}
        onFocus={this.noting}
      >
        {
          defaultOptions.map((item, index) => {
            const res = option.find(data => data === item);
            return (
              <div key={`${item+index}check`} className={styles.dropCheckBox}>
                <input type="checkBox" className={styles.checkBox} checked={res !== undefined} onChange={(event) => this.changeCheckBox(event, item)} />
                <span title={item}>{item}</span>
              </div>
            )}
          )
        }
      </div>
    )
  }

  // 点击展示列中单项的checkbox
  changeCheckBox = (event, item) => {
    if(event.target.checked){
      const { option } = this.state;
      option.push(item);
      this.setState({
        option
      })
    } else {
      const {option} = this.state;
      let delIndex;
      option.forEach((items, index) => {
        if(items === item){
          delIndex = index;
        }
      })
      option.splice(delIndex, 1);
      this.setState({
        option
      })
    }
  }

  // 点击表格表头下拉框按钮中升序或降序
  dropBtnSort = name => {
    if (name === 'up') {
      this.setState({
        upImg: true,
        downImg: false,
        sortTable: name
      });
    } else if (name === 'down') {
      this.setState({
        downImg: true,
        upImg: false,
        sortTable: name
      });
    }
  };

  // 生成table表头
  createColumn = thData => {
    const { option } = this.state;
    const thColumn = [];
    const column = [];
    const screen = window.innerWidth;
    const len = option.length;
    let columnWidth='130';
    // 根据不同分辨率以及列数的不同定义列宽
    if(screen>=1870){
      if(len > 7){
        columnWidth='130';
      }else if(len > 5 && len <= 7){
        columnWidth='170';
      }else if(len >3 && len <= 5){
        columnWidth='240';
      }else if(len === 3){
        columnWidth='400';
      }else if(len === 2){
        columnWidth='620';
      }else if(len ===1 ){
        columnWidth='1250';
      }
    }
    else if(screen > 1390 && screen< 1870){
      if(len > 4) {
        columnWidth='130';
      }else if(len === 4){
        columnWidth='220';
      }else if(len === 3){
        columnWidth='300';
      }else if(len === 2){
        columnWidth='460';
      }else if(len === 1){
        columnWidth='940';
      }
    }
    else if(screen > 1100 && screen <= 1390){
      if(len > 4) {
        columnWidth='130';
      }else if(len === 4){
        columnWidth='188';
      }else if(len === 3){
        columnWidth='258';
      }else if(len === 2){
        columnWidth='390';
      }else if(len === 1){
        columnWidth='800';
      }
    }
    else if(screen > 960 && screen <= 1100){
      if(len > 3) {
        columnWidth='130';
      }else if(len === 3){
        columnWidth='190';
      }else if(len === 2){
        columnWidth='290';
      }else if(len === 1){
        columnWidth='600';
      }
    }
    else if(screen > 700 && screen <= 960){
      if(len > 3) {
        columnWidth='130';
      }else if(len === 3){
        columnWidth='150';
      }else if(len === 2){
        columnWidth='230';
      }else if(len === 1){
        columnWidth='470';
      }
    }
    thData.forEach((item, index) => {

      if (item === '下载') {
        thColumn.push({
          title: item,
          dataIndex: `${index}table`,
          align: 'center',
          ...this.getColumnSearchProps(),
          render: (text, record) => (
            <span className={styles.colSql} title={text} style={{width: `${columnWidth}px`}}>
              <Icon type="download" onClick={() => {this.downLoad(record)}} />
            </span>),
        });
      } else if(item === '指标名称'){
        thColumn.push({
          title: item,
          dataIndex: `${index}table`,
          align: 'center',
          ...this.getColumnSearchProps(),
          render: (text) => (
            <span className={styles.colSql} title={text} style={{width: `${Number(columnWidth)+50}px`}}>{text}</span>),
        });
      } else if(item === '指标解释'){
        thColumn.push({
          title: item,
          dataIndex: `${index}table`,
          align: 'center',
          ...this.getColumnSearchProps(),
          render: (text) => (
            <span className={styles.colSql} title={text} style={{width: `${Number(columnWidth)+50}px`}}>{text}</span>),
        });
      }else{
        thColumn.push({
          title: item,
          dataIndex: `${index}table`,
          align: 'center',
          ...this.getColumnSearchProps(),
          render: (text) => (
            <span className={styles.colSql} title={text} style={{width: `${columnWidth}px`}}>{text}</span>),
        });
      }
    });
    thColumn.forEach(item => {
      const res = option.find(data => data === item.title)
      if(res !== undefined){
        column.push(item);
      }
    })
    return column;
  };

  // 生成table数据
  createDataSource = tbodyData => {
    const { sortTable } = this.state;
    const dataSource = [];
    tbodyData.forEach((item, index0) => {
      const data = {};
      if(item.data.length > 2){
        data.key = index0+item.data[0]+item.data[1];
      }
      item.data.forEach((items, index) => {
        data[`${index}table`] = items;
      });
      dataSource.push(data);
    });
    const sortData = sortTable === 'up' ? dataSource : dataSource.reverse();
    return sortData;
  };

  // 翻页
  pageTurning = (currentNum) => {
    const { dispatch, markType } = this.props;
    const { currentPayload } = this.state;
    const { form } = this.props;
    const { versionName, uniqueCode, kpiCode, kpiOrDimName, difference, versionId} = currentPayload;

    form.setFieldsValue({
      versionName,
      uniqueCode,
      kpiCode,
      kpiOrDimName,
      difference: difference === '' ? 'all' : difference,
      versionId: versionId === '' ? '全部': versionId,
    })
    this.setState({
      loading: true,
    });
    const copyPayload = { ...currentPayload };
    const payload = {
      ...copyPayload,
      currentNum,
      markType,
    };
    dispatch({
      type: 'indexSystemData/fetchTableData',
      payload,
    }).then(() => {
      // 翻页时不需要重新生成显示列选项
      // this.createChooseTableHeader(response.thData);
      this.setState({
        currentPayload: copyPayload,
        loading: false,
        pageValue:"",
      });
    });
  };

  /**
   * 功能：下载
   */
  downLoad=(record)=>{
    const key = "1table";
    const pathName = record[key];
    const loginStatus = Cookie.getCookie("loginStatus");
    const {userId} = loginStatus;
    const {token} = loginStatus;
    const reourcesId = "";
    const moudleId = "indexSystem";
    const parameter = `?token=${token}&ticket=${token}&userId=${userId}&moudleId=${moudleId}&reourcesId=${reourcesId}`;//
    const path = pathName.replace(/\s+/g,"");// 去除空格
    const {url} = Urls.urls[6];

    fetch(url+parameter, {
      credentials: 'include',// 表示发送请求附带域10.244.4.182:8096下cookie
      mode: 'cors',// 跨域请求
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "Cache-control":"no-cache",
        "If-Modified-Since":"0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
      }
    }).then((response) => {
      if(response.status === 403){
        alert("权限不够下载失败");
      }else if(response.status === 200){
        window.open(path+parameter,"_self");
      }
    })
  }

  /**
   * @date: 2019/10/14
   * @author liuxiuqian
   * @Description: 输的页码处理
   * @method onChangeValue
   * @param {参数类型} e 获取输入的值
   */
  onChangeValue(e){
    const inputValue = e.target.value;
    const reg = /^[0-9]*$/;
    if(reg.test(inputValue)){
      this.setState({pageValue:inputValue})
    }else {
      message.open({
        content:"输入格式有误请重新输入！",
        duration:2,
        icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
      })
    }
  }

  /**
   * @date: 2019/10/15
   * @author liuxiuqian
   * @Description: 处理分页请求
   * @method handlePagination
   * @param {参数类型} make 区分上页下页和跳转页
   * @return {返回值类型} 返回值说明
   */
  handlePagination(make){
    const {pageValue} = this.state;
    const {currentNum, totalPageNum} = this.props;
    let currentNum2 = parseInt(currentNum,10);
    const  totalPageNum2 = parseInt(totalPageNum,10);
    if(make === "left"){
      if(currentNum2 > 1){
        currentNum2 -= 1;
      }else {
        message.open({
          content:"没有上一页了！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }else if(make === "right"){
      if(currentNum2 < totalPageNum2){
        currentNum2 += 1;
      }else {
        message.open({
          content:"没有下一页了！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }else {
      if(pageValue === ""){
        message.open({
          content:"请输入页码！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
      if( parseInt(pageValue,10) > 0 && parseInt(pageValue,10) <= totalPageNum2){
        currentNum2 = pageValue;
      }else {
        message.open({
          content:"页码超出总页数！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
        return;
      }
    }
    this.pageTurning(currentNum2);
  }

  render() {
    const {expendTreeNode, showTree, indexType, loading, currentPayload, defaultSelectedKeys, showCheckBox, pageValue } = this.state;
    const { treeData, form: { getFieldDecorator }, versionSelectData, thData, tbodyData, nextFlag, currentNum, totalNum, totalPageNum } = this.props;
    const column = this.createColumn(thData);
    const dataSource = this.createDataSource(tbodyData);
    // 小图标箭头
    let arrowDirection;
    if (showTree) {
      arrowDirection = 'left';
    } else {
      arrowDirection = 'right';
    }
    // 右侧盒子宽度
    let rightBexWidth;
    const wid = window.screen.width;
    if(wid > 1101 && wid < 1390){
      rightBexWidth = '78%';
    } else if(wid > 700 && wid < 1100){
      rightBexWidth = '74%';
    }else{
      rightBexWidth = '82%';
    }
    // 控制下一页上一页显示与隐藏
    let leftBtn = 'none';
    let rightBtn = 'none';
    if (nextFlag === 1) {
      rightBtn = '';
    }
    if (currentPayload.numStart !== 1) {
      leftBtn = '';
    }
    // 左侧指标信息树
    const loop = data => data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
    // 表格查询条件
    let condition;
    // 版本管理
    const versionManagement = (
      <Form onSubmit={this.handleSearch}>
        <Form.Item
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          label="版本名称"
        >
          {getFieldDecorator('versionName', {})(<Input placeholder="" className={styles.formManagementInput} />)}
        </Form.Item>
        <Button htmlType="submit" className={styles.manageSearchBtn}>
          查询
        </Button>
      </Form>
    );
    // 版本查询
    const versionSearch = (
      <Form onSubmit={this.handleSearch}>
        <Form.Item>
          {getFieldDecorator('uniqueCode', {})(<Input placeholder="按唯一码查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('kpiCode', {})(<Input placeholder="按指标编码查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('kpiOrDimName', {})(<Input placeholder="按指标名查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          label="版本号"
        >
          {getFieldDecorator('versionId', {
            initialValue: versionSelectData.length === 0 ? '全部' : versionSelectData[0].id,
          })(
            <Select placeholder="请选择">
              {versionSelectData.map((item, index) => (
                <Option key={item.id} valueid={index} value={item.id} title={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Button htmlType="submit" className={styles.versionSearchBtn}>
          查询
        </Button>
      </Form>
    );
    // 版本差异
    const versionDifference = (
      <Form onSubmit={this.handleSearch}>
        <Form.Item>
          {getFieldDecorator('uniqueCode', {})(<Input placeholder="按唯一码查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('kpiCode', {})(<Input placeholder="按指标编码查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('kpiOrDimName', {})(<Input placeholder="按指标名查询" className={styles.formInput} />)}
        </Form.Item>
        <Form.Item
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 14 }}
          label="差异管理"
        >
          {getFieldDecorator('difference', {
            initialValue: 'all',
          })(
            <Select placeholder="请选择" initialValue="all">
              <Option key={1} valueid={1} value="all" title="全部">
                全部
              </Option>
              <Option key={2} valueid={2} value="add" title="新增">
                新增
              </Option>
              <Option key={3} valueid={3} value="del" title="删除">
                删除
              </Option>
              <Option key={4} valueid={4} value="revise" title="修改">
                修改
              </Option>
            </Select>,
          )}
        </Form.Item>
        <Button htmlType="submit" className={styles.diffSearchBtn}>
          查询
        </Button>
      </Form>
    );
    switch (indexType) {
      case 'versionManagement':
        condition = versionManagement;
        break;
      case 'versionSearch':
        condition = versionSearch;
        break;
      case 'versionDifference':
        condition = versionDifference;
        break;
      default:
        condition = versionManagement;
        break;
    }
    return (
      <Fragment>
        {/*<div className={styles.title}>指标版本信息</div>*/}
        <div className={styles.indexSystem}>
          <div className={styles.leftBox} style={{ display: showTree ? '' : 'none' }}>
            <div className={styles.treeBox}>
              <span className={styles.redBac}>&nbsp;</span>
              <span className={styles.littleTitle}>指标体系</span>
              <Tree
                onSelect={this.onSelect}
                expandedKeys={expendTreeNode}
                onExpand={this.onExpand}
                selectedKeys={defaultSelectedKeys}
              >
                {treeData ? loop(treeData) : null}
              </Tree>
            </div>
          </div>
          <div className={styles.centerBox} style={{ display: showTree ? '' : 'none' }}>
            <div className={styles.direction} onClick={this.shrinkTree}>
              <Icon type={arrowDirection} />
            </div>
          </div>
          <div className={styles.rightBox} style={{ width: showTree ? rightBexWidth : '100%' }}>
            <div className={styles.direction} onClick={this.shrinkTree} style={{ display: showTree ? 'none' : '' }}>
              <Icon type={arrowDirection} />
            </div>
            <div className={styles.searchCondition}>
              {condition}
            </div>
            <div className={styles.thTitle}>
              <span className={styles.redBac}>&nbsp;</span>
              <span className={styles.fontSize}>信息列表</span>
              <span
                className={styles.checkColumn}
                onClick={this.showColumnCheckBox}
                onMouseLeave={this.hideColumnCheckBox}
                style={{background: showCheckBox ? '#C91717': '#FFFFFF',color: showCheckBox ? '#FFFFFF': '#666666'}}
              >
                列设置
                <Icon type="caret-down" style={{color: showCheckBox ? '#FFFFFF': '#666666'}} />
                {this.createCheckBox()}
              </span>
            </div>
            <div className={styles.indexTable}>
              <Table
                loading={loading}
                columns={column}
                dataSource={dataSource}
                rowClassName={(record, index) => index % 2 === 0 ? styles.rowDouble : styles.rowSingle}
                pagination={false}
                scroll={{ x: rightBexWidth }}
                size="small"
              />
            </div>
            <div className={styles.pageBtn}>
              {tbodyData.length >0 && (<div className={styles.pageContent}>
                <span className={styles.leftBtn} onClick={()=>{this.handlePagination("left")}}><Icon type="left-square" /></span>
                <span className={styles.pageText}>{currentNum}/{totalPageNum}</span>
                <span className={styles.rightBtn} onClick={()=>{this.handlePagination("right")}}><Icon type="right-square" /></span>
                <span> <input type="text" value={pageValue} onChange={(e)=>{this.onChangeValue(e)}} className={styles.pageInput} /> </span>
                <span className={styles.btnJump} onClick={()=>{this.handlePagination("Jump")}}>跳转</span>
                <span className={styles.totalNumText}>共{totalNum}记录</span>
              </div>)}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default IndexSystemInfo;
