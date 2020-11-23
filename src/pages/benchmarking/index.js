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
 * @author  liutong
 * @date 2019/4/28
 */
/* eslint-disable */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DatePicker, Button, Table, message,Icon,Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {getRouterState} from "@/utils/tool"; // 工具方法
import iconFont from "../../icon/Icons/iconfont";
import BenchmarkArea from '@/components/benchmarking/benchmarkArea';
import CompositeIndexList from '../../components/benchmarking/compositeIndexList';
import styles from './index.less';
import RegionalArea from '../../components/benchmarking/regionalArea';
import TableData from '../../components/benchmarking/tableData';
import downLoad from '../../components/benchmarking/img/u1632.png';
import DayAndMonth from '../../components/Common/dayAndMonth';
import CollectComponent from '../../components/myCollection/collectComponent';

const { MonthPicker } = DatePicker;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({ benchMarking, regionalArea, benchmarkArea, compositeIndexList }) => ({
  dateType:benchMarking.dateType,
  date: benchMarking.date,
  maxDate: benchMarking.maxDate,
  markType: benchMarking.markType,
  thData: benchMarking.thData,
  tbodyData: benchMarking.tbodyData,
  templateId: benchMarking.templateId,
  backDisplay: regionalArea.backDisplay, // 省份回显
  benchmarkProId: benchmarkArea.benchmarkProId,
  benchmarkCityId: benchmarkArea.benchmarkCityId,
  selected: compositeIndexList.selected, // 指标回显
}))
class BenchMarking extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeToTemplate: false, // 切换到模板管理
      tableBtn: false, // 控制横向对标表格上的按钮
      tableTitle: '', // 表格上的标题
      takeUp: false, //  是否收起标杆
      tableSort: '0', // 默认为0  点击查询按钮之后为1   点击表格列排序之后为2
      currentDataSource: [], // 当前页面排序后的table数据
     // dayAndMonth:"2", // 日月切换标签
    };
    this.downLoadRef =React.createRef();
  }

  // 因为模板跳转到横向对标页面时，通过模板id向指标，地域，日期，标杆请求回来的回显数据
  // 作为table的查询条件，要依次请求并且返回数据了才进行下一个请求
  // 顺序  先请求复合指标，然后标杆，地域，最大账期
  componentDidMount() {
    this.requestCompositeList();
  }

  // (currentDate: moment) => boolean
  // 限制最大选择日期
  disabledDate = (currentDate) => {
    const { maxDate } = this.props;
    let defaultMaxDate;
    if (maxDate) {
      defaultMaxDate = maxDate;
    } else {
      defaultMaxDate = '2019-03';
    }
    return currentDate && currentDate > moment(defaultMaxDate);
  };

  // 更新日期
  handleDateChange = (date, dateString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'benchMarking/setSelectedDate',
      payload: dateString,
    });
  };

  // 查询列表
  searchList = (click) => {
    const {dispatch,markType,date,backDisplay, benchmarkProId, benchmarkCityId, selected,dateType} = this.props;
    const marks =[];
    selected.forEach((item) => {
      marks.push(item.id)
    });
    const provId = [];
    backDisplay.forEach((item) => {
      if(item.selectAreaId === "-1"){
        provId.push(item.selectProId);
      }else {
        provId.push(item.selectAreaId);
      }
    });
    const benchmarkProvId = benchmarkCityId === "-1" ? benchmarkProId: benchmarkCityId;
    if(provId.length<1){
      message.error('请选择地域');
      return null
    }
    dispatch({
      type: 'tableData/fetchTableData',
      payload: {
        markType,
        provId,
        benchmarkProvId,
        date,
        marks,
        dateType
      }
    });
    if(click){
      this.setState({
        tableSort: '1',
        currentDataSource: [],
      })
    }
  };

  onRef = (ref) => {
    this.TableData = ref
  };

  // 点击下载按钮
  downLoadList = () => {
    this.TableData.download()
  };

  // 模板跳转
  pushToTemplate = () => {
    const { dispatch, markType,dateType } = this.props;
    dispatch({
      type: 'benchMarking/fetchTemplatesTable',
      payload: {
        markType,
        dateType
      }
    });
    this.setState({
      changeToTemplate: true
    })
  };

  // 跳转回横向对标
  pushToBenchMark = record=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'benchMarking/setTemplateId',
      payload: record.id
    });
    this.setState({
      changeToTemplate: false,
      tableBtn: true,
      tableTitle: record["1table"]
    });
    // 带参请求复合指标接口，以防templateid更新慢于接口请求导致templateid无参数
    this.requestList(record.id);
  };

  // 删除模板
  delTemplate = record => {
    const { dispatch, markType,dateType } = this.props;
    dispatch({
      type: 'benchMarking/fetchTemplatesTableDelete',
      payload: {
        markType,
        deleteId: record.id,
        dateType
      }
    }).then((res) => {
      if(res.state === "success"){
        // 删除成功后重新调用接口刷新页面数据
        dispatch({
          type: 'benchMarking/fetchTemplatesTable',
          payload: {
            markType,
            dateType
          }
        });
        // message.info("删除成功！");
        message.open({
          content:"删除成功",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
      }else {
        // message.info("删除失败！");
        message.open({
          content:"删除失败",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
      }
    })
  };

  //  收起标杆
  takeUpCompare = event => {
    if(event.target.checked) {
      this.setState({
        takeUp: true
      })
    }else {
      this.setState({
        takeUp: false
      })
    }
  };

  // table中表格排序之后触发
  sortTableData = (tableSort,currentDataSource) =>{
    this.setState({
      tableSort,
      currentDataSource,
    })
  };

  // 模板管理返回按钮
  goBackPage=()=>{
    this.requestCompositeList();
    this.setState({
      changeToTemplate: false,
      tableBtn: false,
    });
  };

  // 生成模板表格数据
  createTableData = (arr) => {
    const dataSource = [];
    arr.forEach((item,ind) => {
      const dataObject={};
      dataObject.id = item.id;
      dataObject.key = item.id;
      item.data.forEach((e, index) => {
        if(index>0){
          dataObject[`${index}table`] = e;
        }else {
          dataObject[`${index}table`] = ind+1;
        }
      });
      dataSource.push(dataObject);
    });
    return dataSource;
  };

  // 生成模板表头
  createTableHeader(arr) {
    const column = [];
    arr.forEach((item, index) => {
      if(item === "模板名称") {
        column.push({
          title: item,
          dataIndex: `${index }table`,
          key: `${index }table`,
          align: 'center',
          render: (text, record) => <span className={styles.tableName} onClick={() => this.pushToBenchMark(record)}>{text}</span>
        })
      }else if(index === arr.length-1) {
        column.push({
          title: item,
          dataIndex: `${index }table`,
          key: `${index }table`,
          align: 'center',
          render: (text, record) =>
            <span>
              <span className={styles.tableAction} onClick={() => this.pushToBenchMark(record)}>查看</span>
              {/* <span className={styles.tableAction} onClick={() =>this.delTemplate(record)}>删除</span> */}
              <Popconfirm title="是否删除?" onConfirm={() => this.delTemplate(record)}>
                <span href="" className={styles.tableAction}>删除</span>
              </Popconfirm>
            </span>
        })
      }else {
        column.push({
          title: item,
          dataIndex: `${index }table`,
          key: `${index }table`,
          align: 'center',
          render: (text) => {
            let textOverflow;
            if(text.length > 12){
              textOverflow = `${text.slice(0,12)}...`;
            }else {
              textOverflow = text;
            }
            return (
              <span title={text}>{textOverflow}</span>
            )}
        })
      }
    });
    return column;
  }

  // 请求最大账期之后请求table数据
  requestMaxDate(){
    // 请求最大账期
    const { dispatch, templateId, markType,dateType } = this.props;
    dispatch({
      type: 'benchMarking/fetchMaxDate',
      payload: {
        markType,
        templateId,
        dateType
      },
    }).then(() => {
      // 请求table数据
      this.searchList();
    });
  }

  // 请求地域按钮数据
  requestArea(){
    const { dispatch, templateId ,dateType} = this.props;
    dispatch({
      type: 'regionalArea/fetchCityData',
      payload: {
        templateId,
        dateType
      },
    }).then((result) => {
      const {areaData, backDisplay, perType, permissions} = result;
      if(backDisplay.length === 0) {
        // 通过区分权限赋值默认选中的省份或地市
        if(perType === "0"){
          areaData[0].forEach((item) => {
            backDisplay.push({
              selectProId: item.areaId,
              selectAreaId: '-1',
              selectName: item.areaName,
            })
          })
        }else if(perType === "1") {
          areaData[0].forEach((item) => {
            backDisplay.push({
              selectProId: permissions[0].perId,
              selectAreaId: item.areaId,
              selectName: item.areaName,
            })
          })
        }
        const len = backDisplay.length;
        let areaTitle = '';
        if (len) {
          for (let i = 0; i < len; i+=1) {
            const { selectName } = backDisplay[i];
            areaTitle += selectName;
          }
        } else {
          areaTitle = '请选择';
        }
        // 通过dispatch发送数据到store去更新
        dispatch({
          type: 'regionalArea/setCheckList',
          payload: { backDisplay, areaTitle },
        })
      }
      this.requestMaxDate();
    });
  }

  // 请求标杆地域
  requestBenchArea(){
    const { dispatch, templateId,dateType } = this.props;
    dispatch({
      type: 'benchmarkArea/fetchArea',
      payload: {
        templateId,
        dateType
      },
    }).then(() => {
      this.requestArea();
    })
  }

  // 请求复合对标数据
  requestCompositeList(id) {
    const { dispatch,templateId,markType,dateType } = this.props;
    dispatch({
      type:"compositeIndexList/fetchIndexList",
      payload: {
        templateId,
        markType:id==="1"?"HXDB_D":markType,
        dateType:id||dateType
      }
    }).then(() => {
      this.requestBenchArea();
    })
  }

  // 带参数请求复合对标数据
  requestList(templateId){
    const { dispatch,markType,dateType } = this.props;
    dispatch({
      type:"compositeIndexList/fetchIndexList",
      payload: {
        templateId,
        markType,
        dateType
      }
    }).then(() => {
      this.requestBenchArea();
    })
  }


  // 生成模板管理
  drawTemplate() {
    const {thData, tbodyData} = this.props;
    const columns = this.createTableHeader(thData);
    const data = this.createTableData(tbodyData);
    return (
      <div className={styles.template}>
        <div className={styles.templateTitle}>
          <span>模板管理</span>
          <span onClick={()=>this.goBackPage()}>
            <IconFont className={styles.iconFont} type="icon-fanhuianniu" />
          </span>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          size="middle"
          rowClassName={(record,index) => index % 2 === 0 ? styles.rowSingle:styles.rowDouble}
        />
      </div>
    )
  }

  // 日月切换回调 2019.8.16
  dayAndMonth=(id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'benchMarking/setDateType',
      payload: id,
    });
    // setTemplateId 日月切换清空模板ID
    dispatch({
      type: 'benchMarking/setTemplateId',
      payload: "",
    });
    // 重新请求筛选条件，然后请求表格数据。
    this.requestCompositeList(id); // 请求复合指标数据

  };

  // 生成横向对标
  drawBenchMark() {
    const { date ,dateType,markType} = this.props;
    const routerState = getRouterState(this.props);
    const {id} = routerState;
    const {tableBtn, tableTitle, takeUp, tableSort, currentDataSource} = this.state;
    let defaultDate;
    if (date) {
      defaultDate = date;
    } else {
      defaultDate = '2019-03';
    }
	const collectStyle ={
      marginLeft:'10px',
      marginTop:'7px'
    };
    return (
      <div className={styles.benchMarking}>
        <div className={styles.markTitle}>
          <div>{tableBtn ? tableTitle:'横向对标'}</div>
          <div className={styles.dayAndMonth}>
            {
              tableBtn?
              null:
              <div>
                <DayAndMonth
                  arrayData={[{ id: '1', name: '日' }, { id: '2', name: '月' }]}
                  selectIndex={dateType}
                  callback={this.dayAndMonth}
                />
              </div>
            }
          </div>
          <CollectComponent markType={id} searchType='5' imgStyle={collectStyle} />
        </div>
        <div className={styles.screen}>
          <CompositeIndexList />
          <RegionalArea />
          <BenchmarkArea />
          <div className={styles.monthDate}>
            日期：
            {dateType === '2' ?
              <MonthPicker
                allowClear={false}
                value={moment(defaultDate, 'YYYY-MM')}
                disabledDate={this.disabledDate}
                onChange={this.handleDateChange}
              /> :
              <DatePicker
                allowClear={false}
                value={moment(defaultDate, 'YYYY-MM-DD')}
                disabledDate={this.disabledDate}
                onChange={this.handleDateChange}
              />
            }
          </div>
          <div className={styles.btn}>
            <Button className={styles.search} onClick={() => this.searchList("click")}>查询</Button>
            <Button className={styles.downLoad} onClick={this.downLoadList}>
              <img src={downLoad} className={styles.downloadImg} alt="" />
              <span className={styles.downloadWord}>下载</span>
            </Button>
          </div>
        </div>
        <TableData
          onRef={this.onRef}
          pushToTemplate={this.pushToTemplate}
          takeUpCompare={this.takeUpCompare}
          sortTableData={this.sortTableData}
          tableBtn={tableBtn}
          tableTitle={tableTitle}
          takeUp={takeUp}
          tableSort={tableSort}
          currentDataSource={currentDataSource}
        />
      </div>
    )
  }

  render() {
    const {changeToTemplate} = this.state;
    return (
      <PageHeaderWrapper>
        {changeToTemplate ? this.drawTemplate() : this.drawBenchMark()}
      </PageHeaderWrapper>
    );
  }
}

export default BenchMarking;
