/**
 * @Description:  分析类专题页面
 *
 * @author: 风信子
 *
 * @date: 2019/7/23
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Icon,message}from 'antd';
import {getRouterState} from "@/utils/tool"; // 工具方法
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import FoldTable from "@/components/analyseSpecial/foldTable"; // 折叠表格组件
import SpecialConditons from "@/components/analyseSpecial/specialConditions";
import IndexExplain from '../../components/Common/indexExplainPop'
import iconFont from '../../icon/Icons/iconfont';
import styles from "./index.less";
import chartPop from '../../assets/image/productAnalysisPop/chartPop.png';
import PopUp from '../../components/analyseSpecial/popUp';
import DrillDownTable from "../../components/analyseSpecial/drillDownTable";
import IndexConfiguration from "@/components/Until/indexConfiguration";
import CollectComponent from '../../components/myCollection/collectComponent'

// import isEqual from "lodash/isEqual";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(
  ({
     analyseSpecialModel,
     analyseSpecialPopModels,
     IndexConfigModels,
     loading
   }) => ({
    analyseSpecialPopModels,
    loading,
    analyseSpecialTitle:analyseSpecialModel.analyseSpecialTitle,
    foldTableData:analyseSpecialModel.foldTableData, // 表格一与表格二数据
    conditionName: analyseSpecialModel.conditionName, //  模板筛选条件
    conditionNameList: analyseSpecialModel.conditionNameList, // 中文筛选条件用于下载
    indexConfigData:IndexConfigModels.indexConfigData, // 指标配置数据
    saveIndexConfig:IndexConfigModels.saveIndexConfig, // 选中指标数据
    isIndexDispose: analyseSpecialModel.isIndexDispose, // 是否显示指标配置
    conditionValue: analyseSpecialModel.conditionValue, // 查询时，用户输入筛选条件
  })
)
class AnalyseSpecial extends PureComponent {
  constructor(props) {
    super(props);
    this.popClass=React.createRef();
    this.state = {
      iconExplainContent:false,// 指标解释hover
      isIndexExplainShow:false,// 指标解释弹出层
      isPopShow: false, // 弹出层是否显示
      markType:"", // 专题编码id   YQ_SUBJECT
      dateType: "", // 账期类型。 1表示日，2表示月。
      firstName:'',
      lastName:'',
      hasNanBei:"false", // 否返回北十南二十一的标志（0表示不添加1表示添加）
    }
  }

  static getDerivedStateFromProps(props, state){
    const routerState = getRouterState(props);
    const {markType} = state;
    const {dateType,id} = routerState;
    if(markType !== id || dateType !== state.dateType){
      return {
        markType:id,
        dateType
      }
    }
    return null;
  }

  componentDidMount() {
    this.getSpecialDesc();
    // this.getSpecialConditions();
  }

  componentDidUpdate(prevProps, prevState) {
    const {markType,dateType} = this.state;
    if(markType !== prevState.markType || dateType !== prevState.dateType){
      this.getSpecialDesc();
      // this.getSpecialConditions();
    }
  }

  // 获取专题描述
  getSpecialDesc=()=>{
    const {dispatch,location:{state}}=this.props;
    const {markType} = this.state;
    console.log("==============");
    console.log(markType,state);
    const params={
      markType,
    };
    dispatch({
      type: `analyseSpecialModel/getSpecailDesc`,
      payload:params,
      callback:()=>{
        this.getSpecialConditions();
      }
    });
  };

  // 若筛选条件有账期则请求最大账期
  getMaxDate=()=>{
    const {dispatch}=this.props;
    const {markType, dateType} = this.state;
    const params={
      markType,
      dateType
    };
    dispatch({
      type: `analyseSpecialModel/fetchMaxDate`,
      payload:params,
    });
  };


  // 获取筛选条件
  getSpecialConditions=()=>{
    const {dispatch}=this.props;
    const {markType, dateType} = this.state;
    const params={
      // markType:"NET_GZ_D", // xxd
      markType,
      dateType
    };
    dispatch({
      payload:params,
      type: `analyseSpecialModel/getSpecailConditions`,
      callback:res=>{
        if(res.length!==0){
          res.forEach((item)=>{
            if(item.type==="date"){
              this.getMaxDate();
            }else if(item.type==="region"){
              this.setState({hasNanBei:item.value.hasNanBei})
            }
          });
          // 10-10 加判断 表格类型不等于2的时候在发请求
          const { analyseSpecialTitle:{tableType} } = this.props;
          if(tableType === "1" || tableType === "0" ){ // xxd
            //  console.log('请求表格一');
            this.getFoldTableData();
          }else if(tableType === "2"){
            // console.log('请求表格三');
            this.childTable2.initFetch()
          }

        }
      }
    });

  };

  // 绑定子组件pop的this
  onRef = (ref) => {
    this.child = ref
  };

  /**
   * @date: 2019/8/5
   * @author 风信子
   * @Description: 获取表格数据（表格一表格二）
   * @method getFoldTableData
   */
  getFoldTableData(values=false){
    // 10-18 加判断 表格类型不等于2的时候在发请求
    const { analyseSpecialTitle:{tableType} } = this.props;
    const {dispatch, conditionValue } = this.props;
    const {markType, dateType} = this.state;
    if(tableType === "1" || tableType === "0") { // xxd

      const params = {
        markType, // 专题编码id
        dateType, // 账期类型。 1表示日，2表示月。
        condition: values || conditionValue
      };
      dispatch({
        payload:params,
        type: `analyseSpecialModel/getFoldTableData`,
      })
    }else {
      console.log("xxdlll");
      console.log(values);
      this.childTable2.initFetch(values)
      // if(conditionValue.length>0){
      //   // {ACCT_DATE: Array(0)}
      //   // 1: {index_type: Array(0)}
      //   // 2: {PROV_ID: Array(0)}
      //   // 3: {AREA_NO: Array(0)}
      //   // 4: {ISSUE_TYPE: Array(0)}
      //   // 5: {KPI_CODE: Array(0)}
      //   //   [{...},{...},{...},{...},{...},{...}]
      //   tableLayout=<DrillDownTable markType={markType} dateType={dateType} condition={conditionValue} /> // xxd
    }

  }
  
  
  // 打开弹出层
  openPop=(condition,tableId,download,popTitle)=>{
    const {markType,dateType}=this.state;
    const {dispatch}=this.props;
    const params={condition,markType,dateType,tableId};
    dispatch({
      type: `analyseSpecialPopModels/fetchChartTypeData`,
      payload:params,
      callback:(response)=>{
        // console.log("图表类型数据收到");
        // console.log(response);
        // let number=0;
        // let height="100%";
        // response.forEach((item)=>{
        //   number+=Number(item.span);
        // });
        // if(number<=4){
        //   height="100%";
        // }else if(number>4&&number<=8) {
        //   height = "50%";
        // }else if(number>8){
        //   height = "33.3%";
        // }
        // this.setState({
        //   rowHeight:height
        //         // });
        if(response.length>0){
          this.setState({
            isPopShow: true,
            firstName:popTitle.dimensionName,
            lastName:popTitle.indexName
          },()=>{
            response.map((item,index, arr)=> this.child.getEchartData(item,arr,params,download))
          });
       
        }else {
          message.error("暂无弹出层数据")
        }
      
      }
    });
    
  };

  // 弹出层收回
  closePop = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    this.setState({isPopShow:false});
    // this.popClass.current.className=styles.closePop
  };

  /**
   * 鼠标移入指标Icon
   */
  mouseOverIconIndex=()=>{
    this.setState({
      iconExplainContent:true,
    })

  };

  /**
   *  鼠标移出指标Icon
   */
  mouseLeaveIconIndex=()=>{
    this.setState({
      iconExplainContent:false,
    })
  };

  /**
   * 指标解释按钮被点击
   */
  indexExplain=()=>{
    //  console.log("指标解释按钮被点击")
    this.setState({
      isIndexExplainShow:true
    })
  };

  /**
   * 指标解释回调，关闭弹窗
   */
  callbackCloseIndexExplain=()=>{
    this.setState({
      isIndexExplainShow:false,
    })
  };

  // 下载要用
  productTableRef = (ref) => {
    this.childTable = ref;
  };

  tableRef = (ref) => {
    this.childTable2 = ref;
  };

  /**
   * @date: 2019/8/13
   * @author 风信子
   * @Description: 指标配置确定按钮
   * @method indexConfigOk
   * @param {arr} 参数：saveData 参数描述：选中的name id
   * @return {返回值类型} 返回值说明
   */
  indexConfigOk(saveData){
    const {dispatch,conditionValue, conditionNameList} = this.props;
    const values = [];
    const valueList = [];
    const indexId = [];
    const indexName = [];
    let indexConfigId = "";
    saveData.forEach((itemIndex)=>{
      indexId.push(itemIndex.indexId);
      indexName.push(itemIndex.indexName);
    });
    conditionNameList.forEach((item)=>{
      if(item.type === "indexConfig"){
        indexConfigId = item.id;
        valueList.push({...item,value:indexName})
      }else {
        valueList.push(item)
      }
    });

    conditionValue.forEach((item)=>{
      if(Object.keys(item).includes(indexConfigId)){
        values.push({[indexConfigId]:indexId});
      }else {
        values.push(item);
      }
    });

    dispatch({
      type: `analyseSpecialModel/getSearchCondition`,
      payload:{
        conditionNameList:valueList,
        values
      },
    });
    this.getFoldTableData(values);
  }

  /**
   * @date: 2019/8/7
   * @author 风信子
   * @Description: 下载表格数据
   * @method tableDownload
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  tableDownload(tableType){
   // console.log("下载111")
    if(tableType==="2"){
      this.childTable2.handleDownload();
    }else {
      this.childTable.handleDownload();
    }

  }

  render() {
    const {
      analyseSpecialTitle:{titleName,tableType},
      foldTableData,
      indexConfigData,
      isIndexDispose
    } = this.props;
    const {
      iconExplainContent,
      isIndexExplainShow,
      isPopShow,
      firstName,
      lastName,
      markType,
      hasNanBei,
      dateType
    } = this.state;
    let tableLayout;
    if(tableType === "2"){ // xxd
      const { conditionValue } = this.props;
      if(conditionValue.length>0){
        // {ACCT_DATE: Array(0)}
        // 1: {index_type: Array(0)}
        // 2: {PROV_ID: Array(0)}
        // 3: {AREA_NO: Array(0)}
        // 4: {ISSUE_TYPE: Array(0)}
        // 5: {KPI_CODE: Array(0)}
        //   [{...},{...},{...},{...},{...},{...}]


        tableLayout=<DrillDownTable
          onRef={this.tableRef}
          markType={markType}
          dateType={dateType}
          titleName={titleName}
          condition={conditionValue}
          callBackTableCondition={(condition,download,popTitle)=>this.openPop(condition,tableType,download,popTitle)}
        /> // xxd
      }

    }else {
      tableLayout = (
        <FoldTable
          tableType={tableType}
          onRef={this.productTableRef}
          tableData={foldTableData}
          titleName={titleName}
          callBackTableCondition={(condition,download,popTitle)=>this.openPop(condition,tableType,download,popTitle)}
        />)
    }
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      paddingBottom:'5px'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.analyseSpecial}>
          <div className={styles.titleDiv}>{titleName}</div>
          <div style={{display:'inline-block',position:"relative"}} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIndex} onMouseLeave={this.mouseLeaveIconIndex}>
            <IconFont
              type="icon-wenzhang"
              className={styles.titleIcon}
              onClick={this.indexExplain}
            />
            {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
          </div>
          <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
          {/* 指标解释 */}
          <IndexExplain moduleApi="analyseSpecial" show={isIndexExplainShow} callback={this.callbackCloseIndexExplain} markId={markType} />
          <div className={styles.conditions}>
            <SpecialConditons
              markType={markType}
              dateType={dateType}
              hasNanBei={hasNanBei}
              callBackQuery={(values)=>this.getFoldTableData(values)}
              callBackHandleDownload={()=>this.tableDownload(tableType)}
            />
          </div>
          <div className={styles.indexConfig}>
            <span className={styles.iconRed} />
            <div className={styles.tableName}>
              数据表
            </div>
            {isIndexDispose && (
              <div className={styles.indexConfigCom}>
                <IndexConfiguration callBcakOk={(saveData)=>{this.indexConfigOk(saveData)}} indexConfigData={indexConfigData} />
              </div>
            )}
          </div>
          <div className={styles.table}>
            {tableLayout}
          </div>
          {
            isPopShow && (
              <div className={styles.openPop} ref={this.popClass}>
                <div className={styles.chartPop}>
                  <img src={chartPop} alt="" className={styles.chartPopImg} onClick={(e)=>this.closePop(e)} />
                </div>
                {/* 弹出层 */}
                <div className={styles.popPageWrapper}>
                  <div className={styles.popTitle}>
                    <div className={styles.popTitleContent}>
                      <div>{firstName}</div>
                      <div>&nbsp; &gt; &nbsp;</div>
                      <div>{lastName}</div>
                    </div>
                  </div>
                  <div className={styles.popPage}>
                    <PopUp onRef={this.onRef} />
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </PageHeaderWrapper>
    )
  }
}


export default AnalyseSpecial;
