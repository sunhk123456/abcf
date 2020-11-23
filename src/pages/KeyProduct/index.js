/* eslint-disable no-plusplus,prefer-destructuring,react/jsx-boolean-value */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 专题页面 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong/liuxiuqian
 * @date 2019/4/23
 */
import React,{ PureComponent } from 'react';
import moment from 'moment';
import {connect} from 'dva';
// import isEqual from 'lodash/isEqual';
import {Icon, DatePicker, Checkbox, Dropdown, Menu  } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProvinceCity from '@/components/Until/proCity';
import SelectType from "@/components/Until/selectType"; // 筛选条件组件
import IndexExplain from "@/components/Common/indexExplainPop"; // 指标解释
import SpecialReportTable from "@/components/KeyProduct/specialReportTable"; // 表格组件
import DownloadAll from '../../components/DownloadAll/downloadAll'; // 下载全部
import CollectComponent from "@/components/myCollection/collectComponent"; // 收藏按钮组件
import DownloadFile from "@/utils/downloadFile"; // 下载当前
import iconFont from '../../icon/Icons/iconfont';
import styles from './index.less';


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});
const dayFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@connect(({ proCityModels,specialReport,selectTypeModels,specialReportTableModels}) => ({
  proCityModels,
  specialReport,
  selectTypeModels,
  specialReportTableModels
  // KeyProductData
}))

class SpecialReport extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      seeDetail:false, // 控制详细解释表格弹窗的可见性
      showScreenCondition:true, // 显示或隐藏筛选条件
      requestMake: true, // 请求标志
      DownloadAllVisible:false, // “下载全部”组件的可见性
      iconExplainContent:false,
  }
  }

  componentDidMount(){
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'specialReport/setModule',
    //   payload: ""
    // });
    // 关闭筛选条件请求成功标志
    dispatch({
      type:'selectTypeModels/requestfalse',
    });
    const { location,specialReport:{ markId, dateType, date} } = this.props;
    if(!location.state){
      this.initSpecial(true);
    }else if(markId !== location.state.id){
      this.initSpecial(true);
    }else if(date === "" && dateType !== "" &&  markId !== ""){ // 判断在指标页面返回时加载账期和tab 接口
      this.intQequest();
    }
  }

  componentDidUpdate(prevProps){
    const {dispatch, specialReport, location, selectTypeModels,} = this.props;
    const { markId, dateType, date, moduleId} = specialReport;
    const {requestMake } = this.state;
    const {requestSuccess} = selectTypeModels; // requestSuccess true 表示筛选条件加载完成
    // const {selectCity, selectPro} = proCityModels;
    if(markId && dateType && markId !== prevProps.specialReport.markId){
      this.intQequest();
    }
    const specialState =JSON.parse(sessionStorage.getItem("specialState"));
    const state = location.state ? location.state : specialState;
    if(markId !== state.id){
      dispatch({
        type: 'specialReport/setModule',
        payload: ""
      });
      this.initSpecial(true);
    }
      if(moduleId && date && moduleId === prevProps.specialReport.moduleId  && requestSuccess && requestMake){
      this.fetchSpecialTable();
      dispatch({
        type:'selectTypeModels/requestfalse',
      })
    }

  }

  componentWillUnmount() {
    const {dispatch} =  this.props;
    // 清空日期
    dispatch({
      type: 'specialReport/setDate',
      payload: ""
    });
  }

  onChangeCheckbox(e){
    const {dispatch} = this.props;
    dispatch({
      type: 'specialReportTableModels/checkboxSignUpdtate',
      payload: e.target.checked
    });
  }

  //  鼠标移入指标Icon
  mouseOverIconIndex=()=>{
    this.setState({
      iconExplainContent:true,
    })

  };

  //  鼠标移出指标Icon
  mouseLeaveIconIndex=()=>{
    this.setState({
      iconExplainContent:false,
    })
  };



    // 设置详细解释表格弹窗的可见性
  seeDetail=()=>{
    this.setState({
      seeDetail:true
    })
  };

  notSeeDetail=()=>{
    this.setState({
      seeDetail:false
    })
  };

  /**
   * 功能：改变筛选条件时间
   * */
  changeConditionDate = (date, dateString) =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'specialReport/setDate',
      payload: dateString
    });
  };


  /**
   * 功能：点击查询按钮
   * */

  screenConditionClick = () =>{
    this.fetchSpecialTable();
  };

  /**
   * 功能：显示隐藏筛选条件
   * */

  showScreenCondition = () =>{
    const {showScreenCondition} = this.state;
    this.setState({
      showScreenCondition:!showScreenCondition
    })
  };

  // 下载数据处理
  handleTbodyDataFun = (handleTbodyData) =>{
    const downArr = [];
    const forTree = (data) =>{
      data.forEach((dataItem)=>{
        const {kpiName, unit, kpiValues, children, areaName} = dataItem;
        const itemTrArr = ["downArrowState" in dataItem ? areaName : kpiName,unit,...kpiValues];
        downArr.push(itemTrArr);
        if(children){
          forTree(children);
        }
      })
    };
    forTree(handleTbodyData);
    return downArr;
  };

  // 点击表格切换Tab的函数
  tabChange(item){
    const tab=item.tabId;
    const { dispatch} = this.props;
    dispatch({
      type:"specialReport/setModule",
      payload:tab,
    });
    this.setState({requestMake: true})
    // this.fetchSpecialTable("", tab);
  }

  initSpecial(dataMake = false){
    const {dispatch,location}=this.props;
    const {state}=location;
    const specialState =JSON.parse(sessionStorage.getItem("specialState"));
    let specialType="1";
    let markId = "EX0101001";
    if(state){
      const {id,dateType}=state;
      specialType=dateType;
      markId=id;
      sessionStorage.setItem("specialState",JSON.stringify(state));// 由于生产版本刷新后state丢失 做一下持久性
    }else if(specialState){
      const {id,dateType} = specialState;
      specialType=dateType;
      markId=id;
    }
    dispatch({
      type:'specialReport/initSpecial',
      payload:{
        dateType:specialType,
        markId,
        date: dataMake
      }
    })
  }

  /**
   * 请求表格数据
   */
  fetchSpecialTable(unit = "", tabId){
    const {dispatch,proCityModels, specialReport, selectTypeModels}=this.props;
    const {selectPro,selectCity}= proCityModels;
    const {selectNameData} = selectTypeModels;
    const {date,moduleId,markId,dateType}=specialReport;
    const {selectIdData} = selectTypeModels;
    this.setState({requestMake: false});
    dispatch({
      type:"specialReport/setDownloadParames",
      payload:{
        selectPro,
        selectCity,
        date,
        selectNameData
      }
    });
    dispatch({
      type: 'specialReport/fetchTable',
      payload: {
        markType:markId,
        provinceId:selectPro.proId,
        cityId:selectCity.cityId,
        date,
        moduleId: tabId || moduleId,
        dateType,
        dimension:selectIdData,
        unitLevel:unit
      },
    });
  }

  intQequest(){
    const {dispatch,specialReport} = this.props;
    const {markId,dateType} =specialReport;
    dispatch({
      type: 'specialReport/fetchMaxDate',
      payload: {markType:markId,dateType,tabId:''}
    });
    dispatch({
      type: 'specialReport/fetchModule',
      payload: {markType:markId}
    });
    this.setState({requestMake: true})
  }

  /**
   * @date: 2019/5/7
   * @author liuxiuqian
   * @Description: 下载事件处理
   * @method handleMenuClick
   * @param {参数类型} 参数名：e 参数说明： 选中项
   * @return {返回值类型} 返回值说明
   */
  handleMenuClick(e){
    if(e.key === "0"){
      DownloadFile(this.downLoadCurrent());
    }else {
      this.clickDownLoadAll(); // 全量下载触发
    }
  }

  // 全量下载开启
  clickDownLoadAll(){
    this.setState({
      DownloadAllVisible:true
    })
  }

  // 全量下载关闭
  clickDownLoadAllClose(){
    this.setState({
      DownloadAllVisible:false
    })
  }

  // 下载当前
  downLoadCurrent(){
    const {location, specialReportTableModels, specialReport,proCityModels} = this.props;
    // const {selectNameData} = selectTypeModels;
    // const {selectCity, selectPro} = proCityModels;
    const {tableData, moduleData, moduleId,downloadParames} = specialReport;
    const {date, selectPro, selectCity, selectNameData} = downloadParames;
    const {handleTbodyData} = specialReportTableModels;
    const specialState =JSON.parse(sessionStorage.getItem("specialState"));
    const {state}=location;
    let specialName='';
    if(state){
      const {title}=state;
      specialName = title;
    }else if(specialState){
      const {title}=specialState;
      specialName = title;
    }
    const conditionVlue = [];
  

    selectNameData.forEach((item)=>{
      const valeItemName = [];
      item.value.forEach((valeItem)=>{
        valeItemName.push(valeItem.sname)
      });
      conditionVlue.push([item.screenTypeName, ...valeItemName]);
    });

    let titleName = "";
    moduleData.forEach((itme)=>{
      if(itme.tabId === moduleId){
        titleName = itme.tabName;
      }
    });
    const condition = {
      name: titleName,
      value: [
        ["专题名称:", specialName, `(${tableData.tbodyData[0].unit})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName || proCityModels.selectPro.proName],
        ["地市:", selectCity.cityName || proCityModels.selectCity.cityName],
        ["日期:", date],
        ...conditionVlue,
      ],
    };

    const  table = {
      title: [
        tableData.thData
      ],
      value: this.handleTbodyDataFun(handleTbodyData)
    };

    const newJson = {
      fileName: `${specialName}-${titleName}`,
      condition,
      table
    };
 
    return newJson;
  }



  render(){
    const {location,specialReport,selectTypeModels,specialReportTableModels}= this.props;
    const specialState =JSON.parse(sessionStorage.getItem("specialState"));
    const state = location.state ? location.state : specialState;
    let specialName='';
    let markId ="EX0101001";
    let specialType = "1";
    let selectedIdCopy = "2";
    if(state){
      const {title,dateType,id,selectedId}=state;
      specialName = title;
      markId = id;
      specialType = dateType;
      if(selectedId){
        selectedIdCopy = selectedId;
      }
    }
    const {date,maxDate,moduleData,moduleId,tableData} = specialReport;
    // console.log("---------",date)
    const {checkboxSign} = specialReportTableModels;
    const {iconExplainContent,seeDetail,showScreenCondition,DownloadAllVisible}= this.state;
        // 日期
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }else {
      disabledDate=null;
    }
    let screenConditionDate;
    const triangle = <i className={styles.dateTriangle} />;
    if(specialType === "1"){
      screenConditionDate = <DatePicker value={moment(date, dayFormat)} disabledDate={disabledDate} allowClear={false} format={dayFormat} onChange={this.changeConditionDate} suffixIcon={triangle} showToday={false} />
    }else {
      screenConditionDate = <MonthPicker value={moment(date, monthFormat)} disabledDate={disabledDate} allowClear={false} format={monthFormat} onChange={this.changeConditionDate} suffixIcon={triangle}  showToday={false} /> // eslint-disable-line
    }

   // 功能模块展示
    const tabModuleTable = moduleData.map((item)=>
      <span className={item.tabId===moduleId?styles.tabForTable:styles.tabForTableNotChoose} key={item.tabId} onClick={()=>this.tabChange(item)}>{item.tabName}</span>
    );
    const {conditionData} = selectTypeModels;
    const downDom = (
      <Menu onClick={(e)=>this.handleMenuClick(e)} className={styles.specialReportMenu}>
        <Menu.Item key="0">
          下载当前
        </Menu.Item>
        <Menu.Item key="1">
          下载全部
        </Menu.Item>
      </Menu>
    );
    // 全量下载参数
    const downloadParam={
      name: specialName,
      dateType: specialType,
      markType: markId,
      moduleId
    };
    // let tip = null;
    // if(markId === "5G_D_ZD" ){
    //   tip = "备注：*5G终端日指标发布时间为每日14时，因数据处理压力，发布可能延迟";
    // } else if(markId === "5G_D") {
    //   // tip = "备注：5G套餐用户口径中暂未包含5G升级包及通过主副卡关系关联的副卡用户"
    //   tip="备注：2020年3月31日起将5G升级包用户纳入5G套餐用户统计范围；5G套餐受理类指标的渠道类型按受理渠道统计，其余指标仍按用户发展渠道统计"
    // }else if(markId === "5G_M"){
    //   tip="备注：2020年3月账期起将5G升级包用户纳入5G套餐用户统计范围；5G套餐受理类指标的渠道类型按受理渠道统计，其余指标仍按用户发展渠道统计"
    // }
    let position="bottom";
    let explain=null;
    if(moduleData.length>0){
      position=moduleData[0].position;
      explain=moduleData[0].explain;
    }
    const imgStyle = {
      width: '30px',
      height: '30px',
      marginLeft:'10px'
    };

    return(
      <PageHeaderWrapper>
        <div className={styles.specialReport}>
          <div className={styles.headTitle}>
            <div className={styles.titleDiv}>专题 &gt; {specialName}</div>
            <div style={{display:'inline-block',position:"relative"}} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex}>
              <IconFont
                type="icon-wenzhang"
                className={styles.titleIcon}
                onClick={this.seeDetail}
              />
              {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
            </div>
            <CollectComponent markType={markId} searchType={selectedIdCopy} imgStyle={imgStyle} />
          </div>
          {/* 指标解释 */}
          <IndexExplain show={seeDetail} callback={this.notSeeDetail} markId={markId} />
          <div className={styles.checkBoxDiv}>
            <div>
              <div className={styles.ProCityDiv}>
                <ProvinceCity className={styles.ProCityDiv} markType={markId} />
              </div>
              <div className={styles.dateSpan}>
                <span className={styles.commonFontSize}>日期：</span>
                {screenConditionDate}
              </div>
            </div>
            <div className={styles.screenConditionContet}>
              <div className={!showScreenCondition || conditionData.length === 0 ? styles.screenConditionNone : ""}>
                <SelectType type="specialReport" tabId={moduleId} markType={markId} />
              </div>
              <div className={styles.showScreenCondition}>
                {conditionData.length>0 ? <span className={styles.showText} onClick={this.showScreenCondition}>{showScreenCondition ? "收起" : "更多选项"}<Icon className={styles.showTextIcon} type={showScreenCondition ? "up" : "down"} style={{color:'#c91917'}} /></span> : null}
                <span className={styles.screenConditionButton} onClick={this.screenConditionClick}>查询</span>
                <Dropdown overlay={downDom} trigger={['click']}>
                  <span className={styles.downClassName}><Icon className={styles.downIcon} type="download" />下载</span>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className={styles.Checkbox}>
            <Checkbox defaultChecked={true} value={checkboxSign} onChange={(e)=>this.onChangeCheckbox(e)}>展开全部</Checkbox>
          </div>

          <div className={styles.tabDiv}>
            {tabModuleTable}
          </div>
          {position==="top"&&<div className={styles.tip}>{explain}</div>}
          <div className={styles.foldTable}>
            <SpecialReportTable tableData={tableData} callBackUnit={(unit)=>this.fetchSpecialTable(unit)} />
          </div>
          {position==="bottom"&&<div className={styles.tip}>{explain}</div>}
        </div>
        <DownloadAll
          downloadParam={downloadParam}
          visible={DownloadAllVisible}
          indexTypeVisible={true}
          onCancel={()=>this.clickDownLoadAllClose()}
        />
      </PageHeaderWrapper>
    )
  }
}
export default SpecialReport;
