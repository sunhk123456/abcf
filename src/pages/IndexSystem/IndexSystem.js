/* eslint-disable react/button-has-type,import/no-duplicates,react/destructuring-assignment,global-require,prefer-template,import/no-dynamic-require,arrow-body-style,import/order,react/no-array-index-key,no-else-return,prefer-const,no-param-reassign,no-unused-vars,array-callback-return,react/no-unused-state,prefer-destructuring,no-plusplus,no-restricted-syntax,react/jsx-boolean-value,jsx-a11y/mouse-events-have-key-events,no-loop-func */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 指标体系页面/p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author wangjian
 * @date 2019/1/17
 */

import React,{ PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Pagination, Icon,Tree,Button,Input,Form,Select,Table,Row,Col,Menu,Dropdown,Checkbox } from 'antd';
import { connect } from 'dva/index';
import iconFont from '../../icon/Icons/iconfont';
import styles from './IndexSystem.less';
import Cookie from '../../utils/cookie';
import Urls from '@/services/urls.json';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
let parentTreeData=[];
let menu;
let CheckBoxOfColumn;
let currentCheck;

@connect(({ indexSystemData, loading }) => ({
  indexSystemData,
  loading: loading.models.indexSystemData,
}))

@Form.create()
class Exception extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: 'Expand to load', key: '0' },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true },
      ],
      stateTreeData:[],
      versionData:[],
      currentType:"versionSearch",
      column:[],
      dataForTable:[], // 正序表格数据
      dataForTableEndOrder:[], // 逆序表格数据
      firstPayload:{
        token: "abc",
        userId: "000013770",
        markType:"",
        Rtype:"M03",
        type:"indexTree",
        id:"mo_indexTree",
        difference:"all",
        versionId:"",
        uniqueCode:"",
        kpiCode:"",
        kpiOrDimName:"",
        versionName:"",
        num:20,
        numStart:1
      },
      loading:false,
      choosingNode:{},
      tableNextFlag:0,
      thLength:0,
      showTree:true, // 目录树的收起或展开标志（横向隐藏）
      sorter:'up',
      thDatas:[],
      tableDatas:[],
      options:[],
      defaultOption:[],
      checkBoxVisible:false,
      expandedKeysTest:["M03","M03_MO"],
      expendTest:false
    };
  }

  componentWillMount() {
    this.setState({
      loading:true,
      expandedKeysTest:["M03","M03_MO"]
    });
    let thTitle;
    let tableList;
    const { dispatch,
      form: { getFieldDecorator },location
    } = this.props;
    const {firstPayload}=this.state;
    dispatch({
      type: 'indexSystemData/fetchLeftTree',
      payload: {
        token: "abc",
        userId: "000013770",
        markType: ""
      },
      callback: e => {
          let anotherData=e;
          e.map((item,index)=>{
             item.children=[];
            anotherData.map((itemChild,indexChild)=>{
              if(itemChild.parentId===item.id){
                item.children.push(itemChild);
              }
            })
            if(item.level==='0'){
              parentTreeData.push(item);
            }
          })
          this.setState({
            stateTreeData:parentTreeData,
            treeData:e
          })
        parentTreeData=[];
      },
    });
    dispatch({
      type: 'indexSystemData/fetchVersionSelect',
      payload: {
        token: "abc",
        userId: "000013770",
      },
      callback: e => {
        this.setState({
          versionData:e
        })
      },
    });
    dispatch({
      type: 'indexSystemData/fetchTableData',
      payload: firstPayload,
      callback: e => {
        thTitle=e.thData;
        tableList=e.tbodyData;
        this.createOptions(thTitle);
        this.createColumn(thTitle);
        this.createTableList(tableList);
        this.setState({
          loading:false,
          tableNextFlag:e.nextFlag,
          thLength:thTitle.length,
          sorter:'up',
          thDatas:thTitle,
          tableDatas:tableList,
        });
      },
    });
    // menu = (
    //   <div className={styles.menuDiv}>
    //     <Menu onClick={this.onClickMenu}>
    //       <Menu.Item key="up">升序</Menu.Item>
    //       <Menu.Item key="down">降序</Menu.Item>
    //     </Menu>
    //   </div>
    // );
  }

  onChangeCheckBox=(checkedValues)=>{
    currentCheck=checkedValues;
  }

  /**
   * 处理表格表头--弹出框可选列数据
   * @param thTitle
   * @returns {{}}
   */
  createOptions=(thTitle)=>{
    let all={}
    let option=[];
    let defaultOptions=[];
    let i=0;
    for (i=0;i<thTitle.length;i++){
      option[i]={label:thTitle[i],value:thTitle[i]}
      defaultOptions[i]=thTitle[i];
    }
    all.option=option;
    all.defaultOptions=defaultOptions;
    this.setState({
      defaultOption:defaultOptions,
      options:option
    })
    return all;
  }

  onClickMenu=(key)=>{
    this.setState({
      loading:true
    });
    if(key.key==='up'){
      this.setState({
        sorter:'up',
        loading:false
      })
    }
    else if(key.key==='down'){
      this.setState({
        sorter:'down',
        loading:false
      })
    }
  }

  orderClick=(order)=>{
    this.setState({
      loading:true
    });
    if(order==='up'){
      this.setState({
        sorter:'up',
        loading:false
      })
    }
    else if(order==='down'){
      this.setState({
        sorter:'down',
        loading:false
      })
    }
  }

  onClickCheckButton=()=>{
    this.setState({
      checkBoxVisible:false
    })
    this.setState({
      loading:true
    });
    const {thDatas}=this.state;
    this.createColumn(thDatas,currentCheck);
    this.setState({
      loading:false
    });
  }

  /**
   * 功能：下载
   */
  downLoad=(record)=>{
    const key = "1table";
    // console.log(record[key])
    const pathName = record[key];
    let loginStatus = Cookie.getCookie("loginStatus");
    let userId = loginStatus.userId;
    let token = loginStatus.token;
    let reourcesId = "";
    let moudleId = "indexSystem";
    let parameter = "?token="+token+"&userId="+userId+"&moudleId="+moudleId+"&reourcesId="+reourcesId;//
    let path = pathName.replace(/\s+/g,"");// 去除空格
    let url = Urls.urls[6].url;

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
        window.open(path+parameter,"");
      }
    })
  }

  // 创建表格的列数据
  createColumn=(thTitle,checkValues)=>{
    let screen = window.innerWidth;
    let columnWidth=130;
    if(screen>=1920){
      columnWidth=160;
    }
    const columns=[];
    let i=0;
    let j=0;
    let state=false;
    if(checkValues!==undefined){
      for(i=0;i<thTitle.length;i++){
        for (j=0;j<checkValues.length;j++){
          if(thTitle[i]===checkValues[j]){
            state=true
          }
        }
        if(state===true){
          for(i=0;i<thTitle.length;i++){
            if(thTitle[i]==="下载"){
              columns.push({
                title: thTitle[i],
                dataIndex: i+"table",
                width:state===true?columnWidth:0,
                key:i+"table",
                align: 'center',
                ...this.getColumnSearchProps(i+"table"),
                render: (text,record,index) => (
                  <span className={styles.colSql} title={text}>
                    <Icon type="download" onClick={()=>{this.downLoad(record)}} />
                  </span>)
              });
            }else{
              columns.push({
                title: thTitle[i],
                dataIndex: i+"table",
                width:state===true?columnWidth:0,
                key:i+"table",
                align: 'center',
                ...this.getColumnSearchProps(i+"table"),
                render: (text,record,index) =>(
                  <span className={styles.colSql} title={text}>{text}</span>)
              });
            }}
        }
        state=false;
      }
    } else if(checkValues===undefined){
      for(i=0;i<thTitle.length;i++){
        if(thTitle[i]==="下载"){
         columns.push({
            title: thTitle[i],
            dataIndex: i+"table",
            width:columnWidth,
            key:i+"table",
            align: 'center',
            ...this.getColumnSearchProps(i+"table"),
            render: (text,record,index) => (
              <span className={styles.colSql} title={text}>
                <Icon type="download" onClick={()=>{this.downLoad(record)}} />
              </span>)
          });
        }else{
          columns.push({
            title: thTitle[i],
            dataIndex: i+"table",
            width:columnWidth,
            key:i+"table",
            align: 'center',
            ...this.getColumnSearchProps(i+"table"),
            render: (text,record,index) =>(
              <span className={styles.colSql} title={text}>
                {text}
              </span>)
          });
        }
        ;
      }
}
    this.setState({
      column:columns,
      thLength:columns.length,
    })
  }

  // 创建表格内的表数据
  createTableList=(tableList)=>{
    let i=0;
    let j=0;
    let dataSource=[];
    let dataSourceEndOrder=[];
    let test={};
    let testEndOrder={};
    for(i=0;i<tableList.length;i++){
      test.key=tableList[i].data[1];
      testEndOrder.key=tableList[tableList.length-i-1].data[1];
      for(j=0;j<tableList[i].data.length;j++){
        test[j+"table"]=tableList[i].data[j];
        testEndOrder[j+"table"]=tableList[tableList.length-i-1].data[j];
      }
      dataSource.push(test);
      dataSourceEndOrder.push(testEndOrder);
       test={};
      testEndOrder={};
    }
    this.setState({
      dataForTable:dataSource,
      dataForTableEndOrder:dataSourceEndOrder
    })
  }

  // 点击目录树的叶子节点时回收节点的数据并进行相关请求
  onSelect = (selectKeys, e) => {
    const {form} = this.props;
    form.setFieldsValue({
      uniqueCode: "",
      kpiCode: "",
      kpiOrDimName: ""
    })
    // 展开的节点
    const { expandedKeysTest }= this.state;
    const { eventKey,children } = e.node.props;
    // 不是叶子节点
    if(children.length>0){
      // 已经展开，收缩
      if(expandedKeysTest.indexOf(eventKey)>-1){
        const index = expandedKeysTest.indexOf(e.node.props.eventKey);
        expandedKeysTest.splice(index,1);
      }else{
        expandedKeysTest.push(eventKey);
      }

      this.setState({
        expandedKeysTest,
        expendTest:true
      });
    }

    if(e.selected && e.node.props.children.length===0){
      // const input  = document.getElementsByTagName("input");
      // console.log("----------",input);
      this.setState({
        loading:true
      });
      const {dispatch}=this.props;
      const {treeData}=this.state;
      let i=0;
      let chooseNode;
      for(i=0;i<treeData.length;i++){
        if(treeData[i].id===selectKeys[0]){
          chooseNode=treeData[i];
          break;
        }
      }
      const newPayLoad={
        token: "abc",
        userId: "000013770",
        markType:"",
        Rtype:chooseNode.Rtype,
        type:chooseNode.type,
        id:selectKeys[0],
        difference:"",
        versionId:"",
        uniqueCode:"",
        kpiCode:"",
        kpiOrDimName:"",
        versionName:"",
        num:20,
        numStart:1
      };
      if(e.node.props.children.length===0){
        const typeLevel=e.node.props.pos.substr(2, 1);
        switch (typeLevel){
          case "0":
            this.setState({
              currentType:"versionManage"
            });
            break;
          case "1":
            this.setState({
              currentType:"difference"
            });
            break;
          case "2":
            this.setState({
              currentType:"versionSearch"
            });
            break;
          default:
            break;
        }
        dispatch({
          type: 'indexSystemData/fetchTableData',
          payload: newPayLoad,
          callback: e1 => {
            let thTitle=e1.thData;
            let tableList=e1.tbodyData;
            this.createColumn(thTitle);
            this.createTableList(tableList);
            this.createOptions(thTitle);
            this.setState({
              loading:false,
              choosingNode:chooseNode,
              firstPayload:newPayLoad,
              tableNextFlag:e1.nextFlag,
              thLength:thTitle.length,
              sorter:'up',
              thDatas:thTitle,
              tableDatas:tableList,
            });
          },
        });
      } else{
        this.setState({
          loading:false
        });
      }
    }
  };

// 点击筛选条件查询按钮的表单数据回收和相关请求
  handleSearch=(e)=>{
    e.preventDefault();
    this.setState({
      loading:true
    });
    const {form,dispatch}=this.props;
    const {firstPayload,choosingNode}=this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for(let item in fieldsValue) {
        if (fieldsValue[item] === null) {
          fieldsValue[item] = '';
        }else if (fieldsValue[item]!==undefined){
          fieldsValue[item] = fieldsValue[item].trim().toUpperCase();
        }else if(fieldsValue[item]===undefined){
          fieldsValue[item] =  "";
        }
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
    let newPayLoad;
    if(JSON.stringify(choosingNode) === "{}"){
      newPayLoad={
        token: "abc",
        userId: "000013770",
        markType:"",
        Rtype:"M03",
        type:"indexTree",
        id:"mo_indexTree",
        difference:"all",
        versionId:"",
        uniqueCode:"",
        kpiCode:"",
        kpiOrDimName:"",
        versionName:"",
        num:20,
        numStart:1,
        ...fieldsValue,
      }
    }else {
      newPayLoad={
        token: "abc",
        userId: "000013770",
        markType:"",
        Rtype:choosingNode.Rtype,
        type:choosingNode.type,
        id:choosingNode.id,
        difference:"",
        versionId:"",
        uniqueCode:"",
        kpiCode:"",
        kpiOrDimName:"",
        versionName:"",
        num:12,
        numStart:1,
        ...fieldsValue,
      };
    }
      dispatch({
        type: 'indexSystemData/fetchTableData',
        payload: newPayLoad,
        callback: e1 => {
          let thTitle=e1.thData;
          let tableList=e1.tbodyData;
          this.createColumn(thTitle);
          this.createTableList(tableList);
          this.createOptions(thTitle);
          this.setState({
            loading:false,
            firstPayload:newPayLoad,
            tableNextFlag:e1.nextFlag,
            thLength:thTitle.length,
            sorter:'up',
            thDatas:thTitle,
            tableDatas:tableList,
          });
        },
      });
    });
  }

  // 点击表格的上一页或下一页按钮，更新请求中numberStart的值，以更新表格数据内容
  changePage=(direction)=>{
    const { dispatch } = this.props;
    const {firstPayload,tableNextFlag}=this.state;
    this.setState({
      loading:true
    });
    let newPayLoad=firstPayload;
    let currentNumberStart=firstPayload.numStart;
    if(direction==='left'){
      newPayLoad.numStart=currentNumberStart-20;
    }
    else if(direction==='right'){
      newPayLoad.numStart=currentNumberStart+20-0;
    }
    dispatch({
      type: 'indexSystemData/fetchTableData',
      payload: newPayLoad,
      callback: e => {
        let thTitle=e.thData;
        let tableList=e.tbodyData;
        this.createColumn(thTitle);
        this.createTableList(tableList);
        this.setState({
          loading:false,
          firstPayload:newPayLoad,
          tableNextFlag:e.nextFlag,
          thLength:thTitle.length
        });
      },
    });
  }

  hiddenTree=()=>{
    const {showTree}=this.state;
    this.setState({
      showTree:!showTree
    })
  }

  // 表格的onChange
  onChange=(pagination, filters, sorter)=>{
    console.info(sorter);
  }

  seeCheckBox=()=>{
    const {checkBoxVisible}=this.state;
    this.setState({
      checkBoxVisible:!checkBoxVisible
    })
  }

  notSeeCheckBox=()=>{
    this.setState({
      checkBoxVisible:false
    })
  }

  getColumnSearchProps = (dataIndex) => {
    const {defaultOption,options,checkBoxVisible}=this.state;
    if(defaultOption.length>0){
      const checkBoxOfColumn=(
        <div className={styles.checkBoxDiv} onMouseLeave={this.notSeeCheckBox} style={{display:checkBoxVisible===true?'block':'none',width:180,height:150,overflowY:'auto',zIndex:2,position:'absolute',backgroundColor:'white'}}>
          <CheckboxGroup options={options} defaultValue={defaultOption} onChange={this.onChangeCheckBox} />
          <Button onClick={this.onClickCheckButton}>确定</Button>
          <Button onClick={this.notSeeCheckBox} style={{marginLeft:'5px'}}>取消</Button>
        </div>
      );
    }
    else {
      const checkBoxOfColumn=null;
    }
    const filter=({
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters,}) => (
        <div style={{padding: 8}}>
          <Button onClick={() => this.orderClick("up")} size="small" style={{width: 90, marginRight: 8}}>
            <IconFont type="icon-paixu-sheng" />升序
          </Button>
          <br />
          <Button onClick={() => this.orderClick("down")} size="small" style={{width: 90, marginTop: 5}}>
            <IconFont type="icon-paixu-jiang" />降序
          </Button>
          <br />
          <Button
            onClick={this.seeCheckBox}
            size="small"
            style={{width: 90, marginTop: 5}}
          >
            <IconFont type="icon-fankui" />展示列
          </Button>
          {CheckBoxOfColumn}
        </div>
      ),
      filterIcon: filtered => <Icon type="caret-down" style={{color: filtered ? '#1890ff' : undefined}} />,
      onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      // onFilterDropdownVisibleChange: (visible) => {
      //   if (visible) {
      //   }
      // },
    });
    return filter;
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeysTest:expandedKeys,
      expendTest:true
    });
  }

  render() {
    const {expendTest,expandedKeysTest,stateTreeData,versionData,currentType,column,dataForTable,dataForTableEndOrder,loading,tableNextFlag,firstPayload,thLength,showTree,sorter,thDatas,defaultOption,options,checkBoxVisible}=this.state;
    const {form: { getFieldDecorator }} = this.props;
    let fontSizeCurrent;
    let inputWidth=160; // input框的宽度
    let buttonLeft=71;
    let buttonTop=3;
    let bigFontSize='26px'; // 大标题的字体大小
    let tableDivVh='85vh';
    let columnWidth=130;
    let screen = window.innerWidth;
    if(screen<1024&&screen>=800){
      fontSizeCurrent='10px';
      inputWidth=100;
      buttonLeft=28;
      buttonTop=7;
      bigFontSize='22px';
      tableDivVh='84vh'
    }
    if(screen<1280&&screen>=1024){
      inputWidth=120;
      buttonLeft=28;
      buttonTop=7;
      bigFontSize='22px';
      tableDivVh='84vh'
    }
    if(screen>=1920){
      inputWidth=190;
      columnWidth=160;
    }
    if(defaultOption.length>0){
      CheckBoxOfColumn=(
        <div className={styles.checkBoxDiv} onMouseLeave={this.notSeeCheckBox} style={{display:checkBoxVisible===true?'block':'none',width:180,height:150,overflowY:'auto',zIndex:2,position:'absolute',backgroundColor:'white'}}>
          <CheckboxGroup options={options} defaultValue={defaultOption} onChange={this.onChangeCheckBox} />
          <Button onClick={this.onClickCheckButton}>
            确定
          </Button>
          <Button onClick={this.notSeeCheckBox} style={{marginLeft:'5px'}}>
            取消
          </Button>
        </div>
      );
    }
    let tableWidth; // 包裹表格的div宽度
    let displayOfTree; // 包裹目录树的div的可见性
    let arrowDirection; // 收起或展开（横向隐藏）目录的切换按钮的方向
    if(showTree===true){
      tableWidth='78%';
      displayOfTree='inline-block';
      arrowDirection='left';
    }
    else if(showTree===false){
      tableWidth='97%';
      displayOfTree='none';
      arrowDirection='right';
    }
    let displayOfLeftBtn='none';
    let displayOfRightBtn='none';
    if(tableNextFlag===1){
      displayOfRightBtn='inline-block';
    }
    if(firstPayload.numStart!==1){
      displayOfLeftBtn='inline-block';
    }
    let condition="12138";
    let table=null;
    let versionManage=null;
    let test=(
      <Form onSubmit={this.handleSearch}>
        <Row justify="start">
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator("uniqueCode", {
            })(<Input placeholder="按唯一码查询" style={{width:inputWidth}}  />)}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator("kpiCode", {
              })(<Input placeholder="按指标编码查询" style={{width:inputWidth}}  />)}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator("kpiOrDimName", {
              })(<Input placeholder="按指标名查询" style={{width:inputWidth}}  />)}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 14 }}
              label="差异管理"
              style={{ width: '100%' }}
            >
              {getFieldDecorator("difference", {
              initialValue: "all",
            })(
              <Select placeholder="请选择" initialValue="all">
                <Option key={1} valueId={1} value="all">
                  全部
                </Option>
                <Option key={2} valueId={2} value="add">
                  新增
                </Option>
                <Option key={3} valueId={3} value="del">
                  删除
                </Option>
                <Option key={4} valueId={4} value="revise">
                  修改
                </Option>
              </Select>
            )}
            </Form.Item>
          </Col>
          <Col span={2}>
            <Button htmlType="submit" style={{marginLeft:buttonLeft,marginTop:buttonTop}}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      );
    versionManage=(
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              style={{ width: '100%' }}
              label="版本名称"
            >
              {getFieldDecorator("versionName", {
              })(<Input placeholder="按唯一码查询" style={{width:inputWidth}}  />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button htmlType="submit" style={{marginLeft:buttonLeft,marginTop:buttonTop}}>
            查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
    let difference=null;
    let versionSearch=null;
    if(versionData.length!==0){
      versionSearch=(
        <Form onSubmit={this.handleSearch}>
          <Row justify="start">
            <Col span={5}>
              <Form.Item>
                {getFieldDecorator("uniqueCode", {
                })(<Input placeholder="按唯一码查询" style={{width:inputWidth}} />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                {getFieldDecorator("kpiCode", {
                })(<Input placeholder="按指标编码查询" style={{width:inputWidth}} />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                {getFieldDecorator("kpiOrDimName", {
                })(<Input placeholder="按指标名查询" style={{width:inputWidth}} />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 14 }}
                label="版本号"
                style={{ width: '100%' }}
              >
                {getFieldDecorator("versionId", {
                 initialValue: versionData.data[0].id,
               })(
                 <Select placeholder="请选择">
                   {versionData.data.map((item, index) => (
                     <Option key={index} valueId={index} value={item.id}>
                       {item.name}
                     </Option>
                   ))}
                 </Select>
               )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Button htmlType="submit" style={{marginLeft:buttonLeft,marginTop:buttonTop}}>
               查询
              </Button>
            </Col>
          </Row>
        </Form>
     );
    }
    switch (currentType){
      case "versionManage":
        condition=versionManage;
        break;
      case "difference":
        condition=test;
        break;
      case "versionSearch":
        condition=versionSearch;
        break;
      default:
        condition=test;
        break;
    }
    const loop = gdata => gdata.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.id} title={item.name}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.name} />;
      });
    table=(<Table
      loading={loading}
      dataSource={sorter==="up"?dataForTable:dataForTableEndOrder}
      bordered={true}
      columns={column}
      scroll={{x:columnWidth*(thLength+1-0)<900?'auto':columnWidth*(thLength+1-0)}}
      pagination={false}
      onChange={this.onChange}
    />)
    return (
      <div>
        <div style={{fontSize:bigFontSize}}>
          指标版本信息
        </div>
        <div style={{ height: '100%',display:'flex' }}>
          <div className={styles.overflowDiv} style={{width:'18%',display:displayOfTree,height: '75vh',overflowY:'auto',backgroundColor:'#F7F7F7',paddingTop:15}}>
            <div className={styles.treeDiv} style={{width:'100%',height:'65vh',display:'inline-block'}}>
              <i className={styles.redI}>&nbsp;</i>
              <span className={styles.fontSize} style={{marginLeft:8}}>指标体系</span>
              <Tree onSelect={this.onSelect} expandedKeys={expendTest===true?expandedKeysTest:["M03", "M03_MO"]} onExpand={this.onExpand}>
                {stateTreeData? loop(stateTreeData) : null}
              </Tree>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <span
              style={{backgroundColor:'#F7F7F7',cursor:'pointer',color:"#C91717",}}
              onClick={this.hiddenTree}
            >
              <Icon type={arrowDirection} />
            </span>
          </div>
          <div className={styles.tableDiv} style={{width:tableWidth,display:'inline-block',height: tableDivVh}}>
            <div className={styles.conditionDiv} style={{width:'100%',backgroundColor:'#F7F7F7',paddingLeft:5}}>
              {condition}
            </div>
            <i className={styles.redI}>&nbsp;</i>
            <span className={styles.fontSize} style={{marginLeft:8}}>
              信息列表
            </span>
            {table}
            <span style={{float:'right'}}>
              <Button style={{margin:8,display:displayOfLeftBtn}} onClick={()=>this.changePage("left")}>
                上一页
              </Button>
              <Button style={{margin:8,display:displayOfRightBtn}} onClick={()=>this.changePage("right")}>
                下一页
              </Button>
            </span>
          </div>
        </div>
      </div>
      );
  }
}

export default Exception;
