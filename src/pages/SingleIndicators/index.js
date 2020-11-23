/**
 *
 * title: productFeatures.js
 *
 * description: 单指标趋势分析首页
 *
 * author: xingxiaodong
 *
 * date 2019/2/13
 *
 */
import React, { Fragment, PureComponent } from 'react';
import {  Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import SingleScreen from '../../components/SingleIndicators/SingleScreen';

@connect(
  ({
     singleIndicatorsDataModels
   }) => ({
    singleIndicatorsDataModels
  })
)
class SingleIndicators extends PureComponent {
  constructor(props){
    super(props)
    this.ulRef=React.createRef()
    this.state={
      selectIndexName:"",// 当前指标名字: 移动业务网上用户
      selectIndexId:"", //  当前指标ID: CKP_24673

      search:"",
      selectDataindex:0,// 本月年累计等选中的索引值
      selectDataId:[],  // 指标选中id
      dataType:"month",// 本月年累计选中标识默认month
      selectName:"本月",
      selectDataType:[
      {// 本月年累计等
        typeId:"month",
        typeName:"本月"
      },{
        typeId:"year",
        typeName:"本年累计"
      },{
        typeId:"sequentialData",
        typeName:"环比"
      },{
        typeId:"totalData",
        typeName:"累计同比"
      }
      ],

      date:"",// 账期
      dimensionTable:{},// 筛选条件选中id --表格
      provinceId:"false",// 省份id没有省分传false

    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {search}=this.state
    dispatch({
      type: 'singleIndicatorsDataModels/fetchTrendConditionData',
      payload: {  "markType":"016"}
    });
    dispatch({
      type: 'singleIndicatorsDataModels/fetchIndexListData',
      payload: {
        markType: "016",
        search,
        isFirst:true,
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {indexData} = this.state;
      if (nextProps.singleIndicatorsDataModels.isFirst===true
        && nextProps.singleIndicatorsDataModels.indexData.length>0
        && indexData !== nextProps.singleIndicatorsDataModels.indexData) {
        this.setState({
          selectIndexName: nextProps.singleIndicatorsDataModels.indexData[0].indexName,
          selectIndexId: nextProps.singleIndicatorsDataModels.indexData[0].indexId,
        });
      }
  }

  query=()=>{
    console.log('查询按钮被点击')
  }

  liItemClicked=(e,data)=>{
    const  lis= e.currentTarget.parentNode.children
    for(let i=0;i<lis.length;i+=1){
      lis[i].className=null;
    }
    e.currentTarget.className=styles.active;
    const {dispatch} = this.props;
    dispatch({
      type: 'singleIndicatorsDataModels/fetchChangePaperType',
      payload: {
        currentPaperId: data.paperId,// 筛选条件选中id --折线图
        currentPaperName:data.paperName
      }
    })
  }

  /*
  * 指标回调函数
  * */
  callbackIndexData=(id,name)=>{
      this.setState({
        selectIndexId:id,
        selectIndexName:name,
      })
  }

  // 获取表格数据
  fetchTableData=()=>{
    const {selectName}=this.state
    const{selectDataId,date,dataType}=this.state
    const {singleIndicatorsDataModels}=this.props;
    const {currentPaperId}=singleIndicatorsDataModels
    const params = {
      marks:selectDataId.join(","),
      date,
      selectType:currentPaperId,
      dataType,
      subjectId:"016"
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'singleIndicatorsDataModels/fetchSingleTableData',
      payload: {
        params,
      }
    })
  }

  // 获取折线和柱状图数据
  fetchEchartsData=()=>{
    const {selectName}=this.state
    const{provinceId,selectDataId,date,dimensionTable,dataType}=this.state
    const params = {
      provId:provinceId,
      marks:selectDataId,
      date,
      dimension:dimensionTable,
      dataType,
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'singleIndicatorsDataModels/fetchSingleEchartsData',
      payload: {
        params
      }
    })
  }

  onSelectData=(index,typeId,typeName)=>{
    this.setState({
      selectDataindex:index,
      dataType:typeId,
      selectName:typeName
    },()=>{
      this.fetchTableData();
      this.fetchEchartsData();
    })


  }



  render(){
    const {selectIndexId}=this.state
    const {selectIndexName}=this.state
    const {singleIndicatorsDataModels}=this.props;
    const {currentPaperId,currentPaperName}=singleIndicatorsDataModels
    const screenCondition=singleIndicatorsDataModels["0"];
    const {indexData}=singleIndicatorsDataModels;
    const {selectDataType,selectDataindex}=this.state
    const selectDataSpan = selectDataType.map((data,index) =>
       (
         <span key={data.typeId} className={selectDataindex===index?styles.selectedType:null} onClick={()=>this.onSelectData(index,data.typeId,data.typeName)}>{data.typeName}</span>
      )
    )
   // console.log(indexData)
    let screens
    if(screenCondition && screenCondition.values.length>0){
         screens = screenCondition.values.map((data,index)=>{
           if(index===0){
             return (
               <li key={data.paperId} className={styles.active} onClick={e=>{this.liItemClicked(e,data); e.stopPropagation();}}>
                 <div className={styles.liLine} />
                 <div className={styles.liText}>
                   {data.paperName}
                 </div>
               </li>
             )
           }
           return  (
             <li key={data.paperId} onClick={e=>{this.liItemClicked(e,data); e.stopPropagation();}}>
               <div className={styles.liLine} />
               <div className={styles.liText}>
                 {data.paperName}
               </div>
             </li>
           )
         }

      )
    }
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.page}>
            <div className={styles.title}>
              <p> 移动业务趋势分析专题（单指标）</p>
              <div className={styles.icon} onClick={this.indexExplain}>
                <Icon type="file-text" />
              </div>
            </div>
            <header>
              <div className={styles.row1}>
                <div className={styles.item}>
                  <div className={styles.option}>指标：</div>
                  <div className={styles.selected}>
                    <SingleScreen indexData={indexData} selectIndexName={selectIndexName} callbackIndexData={this.callbackIndexData} />
                  </div>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.rowTitle}>关注角度：</div>
                <ul className={styles.rowContent} ref={this.ulRef}>
                  {screens}
                </ul>
              </div>
              <div className={styles.button}>
                <div onClick={this.query}>查询</div>
              </div>
            </header>
            <div className={styles.echartsTitle}>
              <div className={styles.line} />
              <div className={styles.name}>逐月趋势</div>
              <div className={styles.singleEchartsSelect}>
                {selectDataSpan}
              </div>
            </div>
            <div className={styles.echarts}>echarts 图</div>
            <div className={styles.tableTitle}>
              <div className={styles.line} />
              <div className={styles.name}>数据表</div>
            </div>
            <div className={styles.table}>表格</div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default SingleIndicators;
