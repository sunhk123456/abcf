/**
 * 月指标账期修改页面
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

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';


@connect(
  ({RangeRelease}) => ({
    indexTableData:RangeRelease.indexTableData
  })
)

class MonthDateChange extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableState:{
        bordered:true, // 表格边框
        pagination:false
      },
      rangeDate:moment(moment().subtract(1,'months')).format(monthFormat), // 暂存已选日期，默认当前月
      selIndex:[],// 已选数据
      selSpecial:[],// 多选专题框已选专题
      pageSizeOptions:["50","100","300","500"], //
      pageSize: "500", // 一页的个数
      page:"1", // 当前页
      columns: [
        {
          title: '指标Id',
          dataIndex: 'indicatorsID',
          key: 'indicatorsID',
          width:'13%',
          align:'center',
          className:yangshi.tableTd,
          render(text) {
            return <span title={text}>{text}</span>
          }
        },
        {
          title: '指标名称',
          dataIndex: 'indicatorsName',
          key: 'indicatorsName',
          width:'62%',
          align:'center',
          className:yangshi.tableTd,
          render(text) {
            return <span title={text}>{text}</span>
          }
        },
        {
          title: '专题名称',
          dataIndex: 'specialName',
          key: 'specialName',
          width:'62%',
          align:'center',
          className:yangshi.tableTd,
          render(text) {
            return <span title={text}>{text}</span>
          }
        },
        {
          title: '预发布账期',
          key: 'PreRelease',
          dataIndex: 'PreRelease',
          width:'10%',
          align:'center',
          className:yangshi.tableTd,
          render(text) {
            return <span title={text}>{text}</span>
          }
        },
        {
          title: '当前账期',
          key: 'Release',
          dataIndex: 'Release',
          width:'10%',
          align:'center',
          className:yangshi.tableTd,
          render(text) {
            return <span title={text}>{text}</span>
          }
        }
      ]
    };

  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch({
      type:'RangeRelease/fetchCheckboxList',
      payload: { dateType:'2',mark:"index" }
    });
    this.getIndexTableData();
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type:'RangeRelease/getIndexTableData',
      payload:{
        indexList:[],
        currentNum:"1",
        totalNum:"1",
        totalPageNum:"1",
        dateType:"2"
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
      dateType:'2',
      selSpecial,
      pageNum: pageSize,
      num
    };
    dispatch({
      type:'RangeRelease/fetchIndexTableData',
      payload:params,
      callBack:(res)=>{
        console.log(res);
        if(res.indexList){
          const allIndex= [];
          res.indexList.map((item)=>
            allIndex.push(`${item.kpiId}&&${item.isTransfer}&&${item.ROW_ID}`)
          );
          // console.log(allIndex)
          this.setState({
            selIndex:allIndex,
          })
        }
      }
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

  disabledDate=(current)=>current && current > moment().subtract(1,'months');

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
        kpiId:arrIdIsTransfer[0],
        isTransfer:arrIdIsTransfer[1]
      }
    });
    const params = {
      date: type === "init" ? '' : rangeDate,
      dateType:'2',
      selIndex:selIndexCopy,
      publishType: type
    };
    dispatch({
      type:'RangeRelease/fetchIndexDate',
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
    const {indexTableData} = this.props;
    const {tableState, pageSizeOptions, pageSize,selIndex,columns} = this.state;

    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <Row>
              <Col md={24}>
                <div className={yangshi.mainTitle}>月指标账期列表</div>
                <div className={yangshi.menu}>
                  <div className={yangshi.time}>
                    <span className={yangshi.spann}>日期</span>
                    <MonthPicker
                      format={monthFormat}
                      onChange={this.onChange}
                      disabledDate={this.disabledDate}
                      showToday={false}
                      defaultValue={moment(moment().subtract(1,"months"), monthFormat)}
                      allowClear={false}
                    />
                  </div>
                  <div className={yangshi.specialList}>
                    <span className={yangshi.specialListTitle}>涉及专题</span>
                    <MultiCheckbox callbackSpecial={this.callbackSpecial} />
                  </div>
                  <div className={yangshi.options}>
                    <Button className={yangshi.button} onClick={()=>this.preReleaseClick()}>预账期发布</Button>
                    <Button className={yangshi.button} onClick={()=>this.releaseClick()}>月账期发布</Button>
                  </div>
                </div>
                <ChangeTable
                  tableState={tableState}
                  pageSizeOptions={pageSizeOptions}
                  pageSize={pageSize}
                  selIndex={selIndex}
                  indexTableData={indexTableData}
                  columns={columns}
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

export default MonthDateChange;
