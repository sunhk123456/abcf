/**
 * 日专题账期修改页面
 * by:CaoRuining
 */
import React, { PureComponent, Fragment } from 'react';
import {connect} from 'dva';
import {Card, Row, Col, DatePicker, Button, message} from 'antd';
import moment from 'moment';
import yangshi from '../DayDateChange/index.less';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import MultiCheckbox from "../../../components/MultiCheckbox/multiCheckbox"
import ChangeTable from "../../../components/MultiCheckbox/changeTable";

const dateFormat = 'YYYY-MM-DD';


@connect(
  ({RangeRelease}) => ({
    specialTableData:RangeRelease.specialTableData
  })
)

class DaySpecialChange extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableState:{
        bordered:true, // 表格边框
        pagination:false
      },
      rangeDate:moment(moment().subtract(1,'day')).format(dateFormat), // 暂存已选日期,默认今日
      selIndex:[],// 表格已选数据
      selSpecial:[],// 多选专题框已选专题
      pageSizeOptions:["50","100","300","500"], //
      pageSize: "100", // 一页的个数
      page:"1", // 当前页
      columns: [{
        title: '专题Id',
        dataIndex: 'specialId',
        key: 'specialId',
        width:'13%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      }, {
        title: '页签Id',
        dataIndex: 'tabId',
        key: 'tabId',
        width:'13%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      }, {
        title: '专题名称',
        dataIndex: 'specialName',
        key: 'specialName',
        width:'49%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      },  {
        title: '页签名称',
        dataIndex: 'tabName',
        key: 'tabName',
        width:'20%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      },{
        title: '预发布账期',
        key: 'PreRelease',
        dataIndex: 'PreRelease',
        width:'10%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      }, {
        title: '当前账期',
        key: 'Release',
        dataIndex: 'Release',
        width:'10%',
        align:'center',
        className:yangshi.tableTd,
        render(text) {
          return <span title={text}>{text}</span>
        }
      }]
    };

  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch({
      type:'RangeRelease/fetchCheckboxList',
      payload: { dateType:'1',mark:"special" }
    });
    this.getIndexTableData();
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type:'RangeRelease/getSpecialTableData',
      payload:{
        specialList:[],
        currentNum:"1",
        totalNum:"1",
        totalPageNum:"1",
        dateType:"1"
      }
    })
  }

  onChange = (date, dateString)=>{
    this.setState({
      rangeDate:dateString,
    });
  };

  // 查询方法
  getIndexTableData(num="1"){
    const {dispatch} = this.props;
    const {rangeDate,selSpecial,pageSize} = this.state;

    const params = {
      date: rangeDate || "",
      dateType:'1',
      selSpecial,
      pageNum: pageSize,
      num
    };
    dispatch({
      type:'RangeRelease/fetchSpecialTableData',
      payload:params
    });
    this.setState({page:num})
  }

  /**
   * 预发布账期按钮点击
   */
  preReleaseClick=()=>{
    // const {dispatch} = this.props;
    this.addIndexDate("1");
  };

  /**
   * 当前账期按钮点击
   */
  releaseClick=()=>{
    this.addIndexDate("2");
  };

  disabledDate=(current)=>current && current > moment().subtract(1,'day');

  //
  callbackSpecial=(data)=>{
    this.setState({
      selSpecial:data,
      selIndex:[],
    },()=>{
      this.getIndexTableData();
    })
  };

  /**
   * @date: 2019/11/27
   * @author 风信子
   * @Description: 保存选中的id值
   * @method handleCallBackSelectId
   * @param {array} 参数：id 参数描述：选中的id
   * @return {返回值类型} 返回值说明
   */
  handleCallBackSelectId =(id)=>{
    this.setState({
      selIndex:id,
    })
  };

  handleCallbackPageSize=(page,size)=>{
    const {pageSize} = this.state;
    this.setState({
      pageSize:size || pageSize,
      selIndex:[]
    },()=>{
      this.getIndexTableData(page);
    })
  };

  // 修改账期
  addIndexDate(type){
    const {dispatch} = this.props;
    const {rangeDate,selIndex,page} = this.state;
    // 处理selIndex
    const selIndexCopy = selIndex.map((item)=>{
      const arrIdIsTransfer = item.split("&&");
      return{
        subjectId:arrIdIsTransfer[0],
        isTransfer:arrIdIsTransfer[1],
        selTab:arrIdIsTransfer[2]
      }
    });
    const params = {
      date: type === "init" ? '' : rangeDate,
      dateType:'1',
      selSpecial:selIndexCopy,
      publishType: type,
    };
    dispatch({
      type:'RangeRelease/fetchSpecialDate',
      payload:params,
      callBack:(res)=>{
        if(res.code === "success"){
          message.success(res.message);
          this.setState({
            selIndex:[]
          },()=>{
            this.getIndexTableData(page);
          })
        }else {
          message.error(res.message);
        }
      }
    })
  }

  render() {

    const {specialTableData} = this.props;
    const {tableState, pageSizeOptions, pageSize,selIndex,columns} = this.state;

    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <Row>
              <Col md={24}>
                <div className={yangshi.mainTitle}>日专题账期列表</div>
                <div className={yangshi.menu}>
                  <div className={yangshi.time}>
                    <span className={yangshi.spann}>日期</span>
                    <DatePicker
                      format={dateFormat}
                      onChange={this.onChange}
                      disabledDate={this.disabledDate}
                      showToday={false}
                      defaultValue={moment(moment().subtract(1,"days"), dateFormat)}
                      allowClear={false}
                    />
                  </div>
                  <div className={yangshi.specialList}>
                    <span className={yangshi.specialListTitle}>涉及专题</span>
                    <MultiCheckbox callbackSpecial={this.callbackSpecial} />
                  </div>
                  <div className={yangshi.options}>
                    <Button className={yangshi.button} onClick={()=>this.preReleaseClick()}>预账期发布</Button>
                    <Button className={yangshi.button} onClick={()=>this.releaseClick()}>日账期发布</Button>
                  </div>
                </div>
                <ChangeTable
                  tableState={tableState}
                  pageSizeOptions={pageSizeOptions}
                  pageSize={pageSize}
                  selIndex={selIndex}
                  indexTableData={specialTableData}
                  columns={columns}
                  type="special"
                  callBackSelectId={this.handleCallBackSelectId}
                  callbackPageSize={this.handleCallbackPageSize}
                />
              </Col>
            </Row>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }


}

export default DaySpecialChange;
