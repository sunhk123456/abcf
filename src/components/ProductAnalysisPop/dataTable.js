/* eslint-disable array-callback-return,no-useless-concat,prefer-template,prefer-const,no-unused-vars,no-unused-vars,react/no-unused-state */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: dataTable/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/1/18/018
 */
import React, {PureComponent} from 'react';
import {Table, Spin,Button} from 'antd';
import {connect} from 'dva';
import DownloadAll from "../DownloadAll/downloadAll"
import style from "./dataTable.less"

@connect(({productAnalysisPopData, loading}) => ({productAnalysisPopData, loading}))

class DataTable extends PureComponent {
  constructor(props) {
    super(props)
    this.tableScrollRef=React.createRef()
    this.state = {
      proId: "111",// 省份id
      regionType: 1,
      pageSize: 1,
      tableProductCategory:"",
      isDownloadShow:false
    }
  }

  componentDidMount() {
    const {regionType} = this.state;
    const {dispatch, state, tableProductCategory, tableState} = this.props;
    const {param} = state;
    let tableCategory;
    const {markType, date, indexType, indexId, productSeries, productCategory, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = state
    const {prov} = state
    console.log(tableState)
    if (tableState === 1) {
      tableCategory = productCategory
    }
    else {
      tableCategory = tableProductCategory
    }
    dispatch({
      type: 'productAnalysisPopData/infoTable',
      payload: {
        "markType": markType,
        "provId": prov,
        "cityId": city,
        "date": date,
        "indexType": indexType,
        "indexId": indexId,
        "productCategory": tableCategory,
        "productSeries": productSeries,
        "productName": productName,
        "parentName": parentName,
        "classifyTop": classifyTop,
        "seriesTop": seriesTop,
        "indexTypeIdAndName": indexTypeIdAndName,
        "regionType": regionType,
        "numStart": "1",
        "num": 10
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {tableProductCategory} = this.props
    if (nextProps.tableProductCategory !== tableProductCategory) {
      this.setState({
        tableProductCategory:nextProps.tableProductCategory
      });
      const {regionType} = this.state;
      const {dispatch, state} = this.props;
      const {param} = state;
      const {markType, date, indexType, indexId, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
      const {city} = state
      const {prov} = state
      dispatch({
        type: 'productAnalysisPopData/infoTable',
        payload: {
          "markType": markType,
          "provId": prov,
          "cityId": city,
          "date": date,
          "indexType": indexType,
          "indexId": indexId,
          "productCategory": nextProps.tableProductCategory,
          "productSeries": productSeries,
          "productName": productName,
          "parentName": parentName,
          "classifyTop": classifyTop,
          "seriesTop": seriesTop,
          "indexTypeIdAndName": indexTypeIdAndName,
          "regionType": regionType,
          "numStart": "1",
          "num": 10
        }
      });
    }
  }

  handleThdata = thdata => {
    const columns = [];
    thdata.map((item, index) => {
      if (index === 0) {
        const th = {title: `${item}`, width: 100, dataIndex: 'pro', key: 'pro', fixed: 'left', align: "center"}
        columns.push(th)
      }
      else if (index === 1) {
        const th = {
          title: `${item}`,
          width: 100,
          dataIndex: 'type',
          key: 'type',
          fixed: 'left',
          align: "center",
          render: text => (<span title={text}>{text}</span>),
        }
        columns.push(th)
      }
      else if (index === 2) {
        const th = {
          title: `${item}`,
          width: 100,
          dataIndex: 'series',
          key: 'series',
          fixed: 'left',
          align: "center",
          className: style.column2,
          render: text => (<span title={text}>{text}</span>),
        };
        columns.push(th)
      }
      else {
        const th = {title: `${item}`, dataIndex: `value${index - 2}`, key: index, align: "center"};
        columns.push(th)
      }
    });
    return columns
  };

  // 处理表格数据
  handleTDdata = (TDdata) => {
    const tddata = []
    TDdata.map((item, index) => {
      const {name} = item
      const {values} = item
      const td = {key: `${index}`, pro: `${name[0]}`, type: `${name[1]}`, series: `${name[2]}`}
      for (let i = 0; i < values.length; i += 1) {
        td[`value${i + 1}`] = String(values[i])
      }
      tddata.push(td)
    })
    return tddata
  }

  provOrcityFun = sign => {
    const {regionType, pageSize,tableProductCategory} = this.state;
    const {dispatch, state} = this.props;
    let tableCategory
    const {param} = state
    const {markType, date, indexType, indexId, productCategory, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = state
    const {prov} = state
    if (regionType !== sign) {
      if(tableProductCategory!==""){
        tableCategory=tableProductCategory
      }
      else {
        tableCategory=productCategory
      }
      this.setState(({
        regionType: sign,
        pageSize: 1
      }))
      dispatch({
        type: 'productAnalysisPopData/infoTable',
        payload: {
          "markType": markType,
          "provId": prov,
          "cityId": city,
          "date": date,
          "indexType": indexType,
          "indexId": indexId,
          "productCategory": tableCategory,
          "productSeries": productSeries,
          "productName": productName,
          "parentName": parentName,
          "classifyTop": classifyTop,
          "seriesTop": seriesTop,
          "indexTypeIdAndName": indexTypeIdAndName,
          "regionType": sign,
          "numStart": "1",
          "num": 10
        }
      });
    }
  }

  // 下一页
  pageNext = () => {
    const {regionType, pageSize,tableProductCategory} = this.state
    let tableCategory
    const {dispatch, state} = this.props;
    const {param} = state
    const {markType, date, indexType, indexId, productCategory, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = state
    const {prov} = state
    if(tableProductCategory!==""){
      tableCategory=tableProductCategory
    }
    else {
      tableCategory=productCategory
    }
    this.setState({
      pageSize: pageSize + 1
    },()=>{
      dispatch({
        type: 'productAnalysisPopData/infoTable',
        payload: {
          "markType": markType,
          "provId": prov,
          "cityId": city,
          "date": date,
          "indexType": indexType,
          "indexId": indexId,
          "productCategory": tableCategory,
          "productSeries": productSeries,
          "productName": productName,
          "parentName": parentName,
          "classifyTop": classifyTop,
          "seriesTop": seriesTop,
          "indexTypeIdAndName": indexTypeIdAndName,
          "regionType": regionType,
          "numStart": 1+pageSize*10,
          "num": 10
        }
      });
    })
  }

  // 上一页
  pageLast = () => {
    const {regionType,pageSize,tableProductCategory} = this.state
    let tableCategory
    const {dispatch, state} = this.props;
    const {param} = state
    const {markType, date, indexType, indexId, productCategory, productSeries, productName, parentName, classifyTop, seriesTop, indexTypeIdAndName} = param
    const {city} = state
    const {prov} = state
    if(tableProductCategory!==""){
      tableCategory=tableProductCategory
    }
    else {
      tableCategory=productCategory
    }
    this.setState({
      pageSize: pageSize - 1
    },()=>{
      dispatch({
        type: 'productAnalysisPopData/infoTable',
        payload: {
          "markType": markType,
          "provId": prov,
          "cityId": city,
          "date": date,
          "indexType": indexType,
          "indexId": indexId,
          "productCategory": tableCategory,
          "productSeries": productSeries,
          "productName": productName,
          "parentName": parentName,
          "classifyTop": classifyTop,
          "seriesTop": seriesTop,
          "indexTypeIdAndName": indexTypeIdAndName,
          "regionType": regionType,
          "numStart": 1+(pageSize - 2)*10,
          "num": 10
        }
      });
    })
  }

  download=()=>{
    this.setState({
      isDownloadShow:true
    })
  }

  downloadClose=()=>{
    this.setState({
      isDownloadShow:false
    })
  }

  render() {
    if(this.tableScrollRef.current){
      const Dom2=document.querySelector(".ant-table-body");
      Dom2.scrollLeft=100000;
    }
    let {productAnalysisPopData,markType,markTypeName} = this.props;
    if (!productAnalysisPopData) {
      productAnalysisPopData = {
        infoTableData: {}
      }
    }
    const downloadParam={
      name:markTypeName,
      dateType:2,
      markType,
      // moduleId:"",
    }
    let {infoTableData} = productAnalysisPopData
    if (!infoTableData || !infoTableData.thData) {
      infoTableData = {
        thData: {
          dataValues: [],
          nameValues: []
        },
        tbodyData: [
          {
            name: [],
            values: []
          },
          {
            name: [],
            values: []
          }]
      }
    }
    const {thData,nextFlag} = infoTableData;
    const {tbodyData} = infoTableData;
    const {dataValues} = thData;
    const mycolumns = this.handleThdata(dataValues);
    const mydata = this.handleTDdata(tbodyData);
    const {regionType, pageSize,isDownloadShow} = this.state;
   // const {loading} = this.props;
   // const isShowTable = loading.effects["productAnalysisPopData/infoTable"]
    return (
      <div className={style.infoTable}>
        <DownloadAll
          downloadParam={downloadParam}
          visible={isDownloadShow}
          indexTypeVisible={false}
          onCancel={this.downloadClose}
        />
        <div className={style.infoTableTitle}>
          <span className={style.titleName}>数据表</span>
          <div className={style.provOrcityBtn}>
            <span className={regionType === 1 ? `${style.choose}` : `${style.nochoose}`} onClick={(e) => {this.provOrcityFun(1)}}>省分</span>
            <span className={regionType === 2 ? `${style.choose}` : `${style.nochoose}`} onClick={(e) => {this.provOrcityFun(2)}}>地市</span>
            <span className={style.downloadName}><Button size="small" icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></span>
          </div>
        </div>
        <Table ref={this.tableScrollRef} columns={mycolumns} dataSource={mydata} scroll={{x: (150 * dataValues.length)}} pagination={false} />
        <div className={style.page}>
          <span className={pageSize === 1 ? `${style.none}` : `${style.pageLast}`} onClick={(e) => {this.pageLast()}}>上一页</span>
          <span className={style.pageNext} style={{display:nextFlag==="0"?"none":"inline-block"}} onClick={(e) => {this.pageNext()}}>下一页</span>
        </div>
      </div>)
  }
}

export default DataTable
