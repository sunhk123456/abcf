/**
 * 我的消息，问题反馈页面
 * by:CaoRuining
 */

import React, { PureComponent, Fragment } from 'react';
import {connect} from 'dva';
import { Card, Row, Col, Tabs, Select, Button, Table, DatePicker } from 'antd';
import moment from 'moment';
import yangshi from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper'


const {TabPane} = Tabs;
const dateFormat = 'YYYY-MM-DD';
const {Option} = Select;// 选择器

@connect(
  ({problemFeedback,systemOperatorCom}) => ({
      tableData:problemFeedback.tableData,
      problemType:systemOperatorCom.problemType,
      dateRange:systemOperatorCom.dateRange,
      replyInfo:systemOperatorCom.replyInfo
  })
)


class ProblemFeedback extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableState:{
        bordered:true,
        pagination:false
      },
      startDate: '',
      endDate: '',
      problemType: "-1", // 问题类型默认-1全部
    };


  }

  componentWillMount(){
    const {dispatch} = this.props;

    dispatch({
      type:'systemOperatorCom/fetchReplyInfo',
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
  }

  componentDidMount() {
    const {dispatch,dateRange} = this.props;
    const {problemType} = this.state;


    const params = {
      startDate:dateRange.start,
      endDate:dateRange.end,
      problemType,
    };
    dispatch({
      type:'problemFeedback/fetchUserTable',
      payload:params
    })
  }


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
        startDate:dateRange.start,
        endDate:dateRange.end,
        problemType,
      };
    } else if(startDate === '' && endDate !== ''){
      params = {
        startDate:dateRange.start,
        endDate,
        problemType,
      };
    } else if(startDate !== '' && endDate === ''){
      params = {
        startDate,
        endDate:dateRange.end,
        problemType,
      };
    }else {
      params = {
        startDate,
        endDate,
        problemType,
      };
    }
    dispatch({
      type:'problemFeedback/fetchUserTable',
      payload: params
    });
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
    const {tableData,problemType,replyInfo,dateRange} = this.props;
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
      width:'6%',
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
      width:'13.1%',
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
      width:'6%',
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
      title: '回复信息',
      key: 'replyInfo',
      dataIndex: 'replyInfo',
      width:'9.5%',
      className:yangshi.tableTd,
      align:'center',
      render(text) {
        return <span title={text}>{text}</span>
      }
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
        replyInfo:item[12]
      };
      return res;
    });
    const dealStatus = replyInfo.status === '1'?
      (<div className={yangshi.yuanLabel11}>已处理</div>):
      (<div className={yangshi.yuanLabel12}>未处理</div>);

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
    }else if(sw>=850&&sw<1100){
      selectWidth = 140
    }

    let heng = (<span>&nbsp;&nbsp;&nbsp;&nbsp;———&nbsp;&nbsp;&nbsp;&nbsp;</span>);
    if(sw < 850){
      heng = (<span>&nbsp;—&nbsp;</span>)
    }

    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <Row>
              <Col md={24}>
                <Tabs defaultActiveKey="1" className={yangshi.tabsStyle}>
                  <TabPane tab="提出问题" key="1">
                    <div className={yangshi.submitProblem_nav}>
                      <div id={yangshi.u12} />
                      <form className={yangshi.firForm}>
                        <span>最新问题</span> <br /><br />
                        <span>问题编号:</span><div className={yangshi.yuanLabel}>{replyInfo.problemId}</div><br /><br />
                        <span>提出时间:</span><div className={yangshi.yuanLabel}>{replyInfo.submitDate}</div><br /><br />
                        相关页面:<div className={yangshi.yuanLabel}>{replyInfo.pageName}</div><br /><br />
                        问题类型:<div className={yangshi.yuanLabel}>{replyInfo.problemType}</div><br /><br />
                        问题具体描述:<br />
                        <textarea name="" id={yangshi.textA} cols="80" rows="4" value={replyInfo.problemDesc} readOnly /><br /><br />
                      </form>
                      <div id={yangshi.u13} />
                      <form className={yangshi.secForm}>
                        <span>处理信息</span> <br /><br />
                        <span>处理状态:</span>
                        {dealStatus}
                        <br />
                        <span className={yangshi.dealReply}>处理回复:</span><br />
                        <textarea name="" id={yangshi.textB} cols="80" rows="4" value={replyInfo.replyContent} readOnly /><br /><br />
                      </form>
                    </div>
                  </TabPane>
                  <TabPane tab="历史问题" key="2">
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
                          optionFilterProp="children"
                          onChange={this.handleChange}
                          defaultValue='-1'
                        >
                          {proType}
                        </Select>
                        <i className={yangshi.triangle} />
                      </div>
                      <Button className={yangshi.button} onClick={()=>{this.searchTableData()}}>查询</Button>
                    </div>
                    <div className={yangshi.feedBackCon}>
                      <div className={yangshi.conTitle}>
                        <div className={yangshi.icon} />
                        历史问题明细
                      </div>
                      <div className={yangshi.conCon}>
                        <Table {...tableState} className={yangshi.table} rowClassName={this.changeRowColor} columns={columns} dataSource={data} scroll={{ x: 1545 }} />
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default ProblemFeedback;
