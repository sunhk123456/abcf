/**
 * 系统运营页面（所有问题反馈）
 * by:CaoRuining
 */


import React, { PureComponent, Fragment } from 'react';
import {connect} from 'dva';
import {Card,Row,Col,Tabs,DatePicker,Select,Button,Table,message } from 'antd';
import moment from 'moment';
import yangshi from './index.less';
import ProblemReply from  '../../components/ProblemFeedback/ProblemReply';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import yanjingImg from '../../components/ProblemFeedback/u1999.png';




const {TabPane} = Tabs; // 标签页
const dateFormat = 'YYYY-MM-DD';
const {Option} = Select; // 选择器


@connect(
  ({systemOperator,systemOperatorCom}) => ({
    tableData:systemOperator.tableData,
    componentStatus:systemOperator.componentStatus,
    problemId:systemOperatorCom.problemId,
    problemType:systemOperatorCom.problemType,
    dateRange:systemOperatorCom.dateRange,
    moduleTab:systemOperator.moduleTab
  })
)


class SystemOperator extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableState:{
        bordered:true, // 表格边框
        pagination:false
      },
      startDate: '',
      endDate: '',
      problemType: "-1",
    };

  }

  componentWillMount(){
    const {dispatch} = this.props;

    dispatch({
      type:'systemOperator/fetchTableData',
      payload:{}
    });

    dispatch({
      type:'systemOperatorCom/fetchDateRange',
      payload:{}
    });

    dispatch({
      type:'systemOperatorCom/fetchProblemType',
      payload:{}
    });

    dispatch({
      type:'systemOperator/fetchModuleTab',
      payload:{}
    })
  }

  componentDidMount() {

  }




  /**
   * 功能：选择一个问题类型
   * @param value
   */
  handleChange = (value)=> {// 选择器选择
    this.setState({
      problemType:value
    })
  };


  /**
   * 点击查询充新请求表格数据
   */
  searchTableData = ()=>{
    const {dispatch,dateRange} = this.props;
    const {startDate,endDate,problemType} = this.state;
    let params = {};
    if (startDate === '' && endDate === ''){
      params = {
        markType:'',
        tabId: "1",
        startDate:dateRange.start,
        endDate:dateRange.endDate,
        problemType,
        num: 20,
        numStart: 1,
      };
    } else if(startDate === '' && endDate !== ''){
      params = {
        markType:'',
        tabId: "1",
        startDate:dateRange.start,
        endDate,
        problemType,
        num: 20,
        numStart: 1,
      };
    } else if(startDate !== '' && endDate === ''){
      message.warning("请选择截止日期");
    } else {
      params = {
        markType:'',
        tabId: "1",
        startDate,
        endDate:dateRange.end,
        problemType,
        num: 20,
        numStart: 1,
      };
    }
    dispatch({
      type:'systemOperator/fetchSearchTableData',
      payload: params
    });
  };


  /**
   * 请求回复数据
   * @returns {*}
   */
  fetchInfo = (proId)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'systemOperatorCom/fetchReplyInfo',
      payload:{
        problemId:proId
      }
    });
    this.showReplyComponent()
  };

  /**
   * 显示组件
   * @returns {*}
   */
  showReplyComponent = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type:'systemOperator/fetchComponentStatus',
      payload:{
        componentStatus:'block'
      }
    })
  };


  /**
   * 功能：选择日期
   */
  onChange1 = (date, dateString)=>{
    this.setState({
      startDate:dateString,
    })
  };

  onChange2 = (date, dateString)=>{
    this.setState({
      endDate:dateString,
    })
  };


  // 隔行变色
  changeRowColor = (record,index) => {
    let className = 'lightRow';
    if (index % 2 === 1) className = 'darkRow';
    return className;
  };



  render() {
    const {tableState,startDate,endDate} = this.state;
    const {tableData,problemType,moduleTab,dateRange} = this.props;
    if (dateRange === ''){
      return null;
    }
    let disabledStartDate;
    if (endDate === '') {
      disabledStartDate=(current)=>current && current > moment(dateRange.end);
    }else if(endDate !== ''){
      disabledStartDate=(current)=>current && current > moment(endDate);
    }
    let disabledEndDate;
    if (startDate === '') {
      disabledEndDate=(current)=>current && current > moment(dateRange.end);
    }else if(startDate !== ''){
      disabledEndDate=(current)=>current > moment(dateRange.end) || current < moment(startDate)
    }
    const columns = [
      {
      title: '编号',
      dataIndex: 'Id',
      key: 'Id',
      width:'8%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
    }, {
      title: '问题反馈时间',
      dataIndex: 'time',
      key: 'time',
      width:'8%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    }, {
      title: '相关页面',
      dataIndex: 'forPage',
      key: 'forPage',
      width:'8%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    }, {
      title: '问题类型',
      key: 'proKind',
      dataIndex: 'proKind',
      width:'9.4%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    }, {
      title: '问题描述',
      key: 'proExp',
      dataIndex: 'proExp',
      width:'14.1%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '反馈人',
      key: 'name',
      dataIndex: 'name',
      width:'5.5%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '部门',
      key: 'dept',
      dataIndex: 'dept',
      width:'6%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '帐号',
      key: 'account',
      dataIndex: 'account',
      width:'7%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '电话',
      key: 'phone',
      dataIndex: 'phone',
      width:'8%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
      width:'9%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '浏览器',
      key: 'browser',
      dataIndex: 'browser',
      width:'7.5%',
      align:'center',
      className:yangshi.tableTd,
      render(text) {
        return <span title={text}>{text}</span>
      }
    },{
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width:'5.5%',
      align:'center',
      render(text) {
        let res;
        if (text === '0'){
          res = <span title='未处理' className={yangshi.weichuli}>未处理</span>
        }else {
          res = <span title='已处理' className={yangshi.yichuli}>已处理</span>
        }
        return res;
      }
    },{
      title: '操作',
      key: 'actions',
      dataIndex: 'actions',
      align:'center',
      render: (text) => (
        <img
          className={yangshi.yanjingImg}
          src={yanjingImg}
          alt=""
          onClick={()=>{this.fetchInfo(text)}}
        />
      ),
    }
    ];
    const data = tableData.map((item,index) => {
      const res = {
        key: index,
        Id: item[0],
        time: item[1],
        forPage: item[2],
        proKind: item[3],
        proExp:item[4],
        name:item[5],
        dept:item[6],
        account:item[7],
        phone:item[8],
        email:item[9],
        browser:item[10],
        status:item[11],
        actions:item[0]
      };
      return res;
    });
    const proType = problemType.map((item)=>{
      const res =(
        <Option value={item.id} key={item.id}>{item.name}</Option>
      );
      return res;
    });

    const sw= window.screen.width; // 获取屏幕宽度
    let selectWidth = 200;
    if(sw < 850){
      selectWidth = 100
    }else if(sw>=850&&sw<1300){
      selectWidth = 140
    }

    let heng = (<span>&nbsp;&nbsp;&nbsp;&nbsp;———&nbsp;&nbsp;&nbsp;&nbsp;</span>);
    if(sw < 850){
      heng = (<span>&nbsp;—&nbsp;</span>)
    }else if(sw>=850&&sw<1100){
      heng = (<span>&nbsp;—-&nbsp;</span>)
    }

    const tab = moduleTab.map((item)=>{
      let page = (<div>a</div>);
      if (item.tabId === '1'){
        page =  (
          <TabPane tab={item.name} key={item.tabId}>
            <div className={yangshi.conditions}>
              <div className={yangshi.time}>
                <span className={yangshi.spann}>时间范围：</span>
                <DatePicker
                  format={dateFormat}
                  onChange={this.onChange1}
                  disabledDate={disabledStartDate}
                  showToday={false}
                  defaultValue={moment(dateRange.start, dateFormat)}
                  allowClear={false}
                />
                {heng}
                <DatePicker
                  format={dateFormat}
                  onChange={this.onChange2}
                  disabledDate={disabledEndDate}
                  showToday={false}
                  defaultValue={moment(dateRange.end, dateFormat)}
                  allowClear={false}
                />
              </div>
              <div className={yangshi.proKind}>
                <span className={yangshi.spann}>问题类型：</span>
                <Select
                  style={{ width: selectWidth }}
                  placeholder="选择一个类型"
                  onChange={this.handleChange}
                  defaultValue='-1'
                >
                  {proType}
                </Select>
                <i className={yangshi.triangle} />
              </div>
              <Button className={yangshi.button}>下载</Button>
              <Button className={yangshi.button} onClick={()=>{this.searchTableData()}}>查询</Button>
            </div>
            <div className={yangshi.feedBackCon}>
              <div className={yangshi.conTitle}>
                <div className={yangshi.icon} />
                问题反馈概览
              </div>
              <div className={yangshi.conCon}>
                <Table {...tableState} className={yangshi.table} rowClassName={this.changeRowColor} columns={columns} dataSource={data} scroll={{ x: 1540 }} />
              </div>
            </div>
            <ProblemReply />
          </TabPane>
        )
      }else {
        page = (<div>页面找不到了</div>)
      }
      return page
    });
    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <Row>
              <Col md={24}>
                <Tabs defaultActiveKey="1" className={yangshi.tabsStyle}>
                  {tab}
                </Tabs>
              </Col>
            </Row>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default SystemOperator;
