/**
 *用户发展真实性测试弹出组件:分析数据表格
 *by:CaoRuining
 */
import React, { PureComponent } from 'react';
import {connect} from 'dva'
import { Button,Table } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import yangshi from './analysisTable.less';


const ButtonGroup = Button.Group;


@connect(
  ({developingUserCom,proCityModels}) => ({
    indexDate:developingUserCom.indexDate,
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
    comStatus:developingUserCom.comStatus,
    analysisTableData:developingUserCom.analysisTableData,
    barShow:developingUserCom.barShow,
    selectPro:proCityModels.selectPro,
    selectCity:proCityModels.selectCity,
  })
)
class AnalysisTable extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      tableState:{
        pagination:false,
        bordered:false
      },
    };
  }

  componentWillMount(){
  }

  componentDidMount(){
  }

  /**
   * 切换组件
   * @returns {*}
   */
  changeComponent = ()=>{
    const {dispatch} = this.props;
    const params = {
      barStatus:'block',
      lineStatus:'block',
      tableStatus:'none'
    };

    dispatch({
      type:'developingUserCom/fetchChangeCom',
      payload:params
    })
  };

  // 下载
  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle());
  }

  jsonHandle(){
    const {indexDate,analysisTableData,selectPro,selectCity,indexType,indexType1} = this.props;
    const {tbodyData,thData} = analysisTableData;
    let indexTypeName="";
    indexType.map((item)=>{
      if(item.id===indexType1){
        indexTypeName=item.name
      }
      return null
    });
    const tableValue = [];
    tbodyData.forEach((item)=>{
      tableValue.push([item[0],item[1],item[2],item[3]])
    });
    const condition = {
      name:  "用户发展真实性预测",
      value: [
        ["专题名称:", "用户发展真实性预测", ""],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", indexDate],
        ["指标类型:", indexTypeName],
      ],
    };
    const  table = {
      title: [
        [thData[0], thData[1], thData[2], thData[3]]
      ],
      value: [
        ...tableValue
      ]
    }


    const newJson = {
      fileName: "用户发展真实性预测",
      condition,
      table
    }
    return newJson;
  }

  render() {
    const {comStatus,analysisTableData} = this.props;
    const {tableState} = this.state;

    if(analysisTableData.thData === undefined || analysisTableData.tbodyData === undefined){
      return null;
    }
    const columns = [
      {
        title: analysisTableData.thData[0],
        dataIndex: 'leftDate',
        key: 'leftDate',
        width:'18%',
        align:'center',
        className:yangshi.tableRow
      },
      {
        title: analysisTableData.thData[1],
        dataIndex: 'Data1',
        key: 'Data1',
        width:'27.5%',
        align:'center',
        className:yangshi.tableRow
      },
      {
        title: analysisTableData.thData[2],
        dataIndex: 'Data2',
        key: 'Data2',
        width:'27.5%',
        align:'center',
        className:yangshi.tableRow
      },
      {
        title: analysisTableData.thData[3],
        dataIndex: 'Data3',
        key: 'Data3',
        width:'27%',
        align:'center',
        className:yangshi.tableRow
      },
    ];

    const data1 = analysisTableData.tbodyData.slice(0,16).map((item)=>{
      const res = {
        key:item[0],
        leftDate:item[0],
        Data1:item[1],
        Data2:item[2],
        Data3:item[3]
      };
      return res;
    });
    const data2 = analysisTableData.tbodyData.slice(16).map((item)=>{
      const res = {
        key:item[0],
        leftDate:item[0],
        Data1:item[1],
        Data2:item[2],
        Data3:item[3]
      };
      return res;
    });


    return (
      <div className={yangshi.tableOuter} style={{display:comStatus.tableStatus}}>
        <span className={yangshi.chartTitle}>
          趋势分析图
        </span>
        <div className={yangshi.changeButton}>
          <ButtonGroup>
            <Button type="normal" onClick={()=>this.changeComponent()}>图表</Button>
            <Button type="primary">数据</Button>
          </ButtonGroup>
          <Button type="normal" icon="download" className={yangshi.downBtn} onClick={(e)=>{this.download(e)}}>下载</Button>
        </div>
        <div className={yangshi.leftTable}>
          <Table {...tableState} className={yangshi.table} columns={columns} dataSource={data1} />
        </div>
        <div className={yangshi.rightTable}>
          <Table {...tableState} className={yangshi.table} columns={columns} dataSource={data2} />
        </div>
      </div>
    );
  }

}

export  default AnalysisTable;
