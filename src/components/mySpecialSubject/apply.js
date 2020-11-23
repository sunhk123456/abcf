/**
 * @Description: 我的工作台我的专题总部应用、省份应用组件
 *
 * @author: xingxiaodong
 *
 * @date: 2020/4/20
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Icon, DatePicker, Modal , Input, message} from 'antd';
import Cookie from '@/utils/cookie';
import moment from 'moment';
// import SelectType from "@/components/mySpecialSubject/selectType"; // 专题类型选择组件
import IndexSearch from './indexSearch'
import OutTip from '@/components/Until/outTip'; // 页面离开提示
import IndexExplain from "@/components/Common/indexExplainPop/index"; // 指标解释
import SelectType from "@/components/mySpecialSubject/selectType"; // 专题类型选择组件
import TableLayout from '@/components/mySpecialSubject/tableLayout/tableLayout'; // 表格布局组件
import CockpitLayout from '@/components/mySpecialSubject/cockpitLayout/index'; // 驾驶舱布局

import styles from './apply.less';
import ProCity from '../Until/proCity';
import iconFont from '@/icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

const { Option } = Select;
const {MonthPicker} = DatePicker;

// selectPro: {
//   // "proId": "111",
//   // "proName": "全国"
// }, // 选中省数据
// selectCity: {
//   // "cityId": "-1",
//   // "cityName": "全国"
// }, // 选中地市数据

@connect(
  (
    {mySpecialSubjectModels,proCityModels}
  )=>(
    {
      // mySpecialSubjectModels,
      proCityModels,
      mySpecialList:mySpecialSubjectModels.mySpecialList,
      maxDate:mySpecialSubjectModels.maxDate,
      date:mySpecialSubjectModels.date,
      selectSpecial:mySpecialSubjectModels.selectSpecial,
      dateType:mySpecialSubjectModels.selectSpecial.dateType,
      markType:mySpecialSubjectModels.selectSpecial.id,
      status:mySpecialSubjectModels.status,
      selectPro:proCityModels.selectPro,
      selectCity:proCityModels.selectCity,
      moduleId:mySpecialSubjectModels.moduleId,
      queryCondition:mySpecialSubjectModels.queryCondition,
      areaData: proCityModels.areaDate, // 地域组件数据
    }
  )
)
class MySpecialSubjectApply extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      deletePopVisible:false, // 删除专题弹出层
      savePopVisible:false, // 保存专题弹出层
      inputValue:"",
      tabList: [
        { name: '新增专题', id: 'addButton' },
        { name: '编辑专题', id: 'editButton' },
        { name: '保存专题', id: 'saveButton' },
        { name: '删除专题', id: 'deleteButton' },
      ],
      SelectTypeShow:false, // 是否显示选择类型组件
      IndexSearchShow:false,
      showIndexExplain: false, // 指标解释
      iconExplainContent: false, //
      changePopVisible:false, // 切换专题时提示弹出层
      changeValue:"", // 切换专题id备份
    };
  }

  componentDidMount() {
    // 请求我的专题列表数据
    this.getMySpecialData()

  }

  componentDidUpdate(prevProps) {
    const {selectPro,selectCity,dispatch,areaData}=this.props;
    if(
      (!prevProps.selectPro.proId && selectPro.proId) ||
      (areaData.length > 0 && prevProps.selectPro.proId !== selectPro.proId && selectPro.proId === areaData[0].proId)){
      const {queryCondition}=this.props;
      const queryParams=Object.assign({},queryCondition,{selectCity,selectPro});
      dispatch({
        type:"mySpecialSubjectModels/setQueryCondition",
        payload:queryParams
      })
    }

  }


  // 请求最大账期
  getMaxDate=(params)=>{
    const {dispatch,selectSpecial,moduleId}=this.props;
    const defaultParams={
      dateType:selectSpecial.dateType,
      markType:selectSpecial.id,
      specialType:selectSpecial.specialType,
      moduleId
    };
    dispatch({
      type:"mySpecialSubjectModels/fetchMaxDate",
      payload:params || defaultParams,
      callback:(response)=>{
        const {queryCondition}=this.props;
        const queryParams=Object.assign({},queryCondition,{date:response.date});
        dispatch({
          type:"mySpecialSubjectModels/setQueryCondition",
          payload:queryParams
        })
      }
    });
  };

  // 专题增删改查按钮被点击
  buttonOnclick=(buttonId)=>{
    const {dispatch,selectSpecial,status}=this.props;
    if(buttonId==="deleteButton") {
      this.setState({
        deletePopVisible: true  // 打开删除专题弹框
      })
    } else if(buttonId==="saveButton"){
      this.setState({
        inputValue:selectSpecial.name,
        savePopVisible: true  // 打开保存专题弹框
      })
    } else if(buttonId==="addButton"){
      if(status!=="current"){
        message.error("此时无法新增专题，请先保存当前专题。")
      }else {
        // 新增按钮被点击 切换为新增状态
        dispatch({
          type:"mySpecialSubjectModels/setStatus",
          payload:"add"
        });
        this.isShowSelectTypeShow(true);
      }

    } else if(buttonId==="editButton"){
      // 编辑按钮被点击 切换为编辑状态
      dispatch({
        type:"mySpecialSubjectModels/setStatus",
        payload:"edit"
      });
      // 表格专题时，打开指标配置弹出层
      if(selectSpecial.specialType === "table"){
        this.showIndexConfig(true);
      }
    }

  };

  /**
   * @date: 2020/4/30
   * @author 风信子
   * @Description: 方法说明 是否显示选择类型组件
   * @method 方法名 isShowSelectTypeShow
   * @param {boolean} 参数名 type 参数说明 显示或隐藏
   */
  isShowSelectTypeShow = (type) =>{
    this.setState({
      SelectTypeShow:type
    })
  };

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = (currentDate) => {
    const {maxDate} = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  /**
   * 请求我的专题列表
   */
  getMySpecialData=()=>{
    const {dispatch,moduleId}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/getMySpecialData",
      payload:{moduleId},
      callback:()=>{
        this.getMaxDate()
      }
    })
  };

  /**
   * 选择账期
   */
  handleChangeDate=(date,dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/fetchDate",
      payload:dateString
    })
  };

  // 切换专题后重新请求最大账期和表格
  handleChangeSpecialName=(value,status)=>{

    // setSelectSpecial
    const {dispatch,mySpecialList,moduleId,proCityModels,date}=this.props;

    if(status!=="current"){
      this.setState({
        changeValue:value,
        changePopVisible:true
      })
    }else {

      const{areaDate}=proCityModels;
      const {power} = Cookie.getCookie('loginStatus');
      const selectPro = {
        proId: areaDate[0].proId,
        proName: areaDate[0].proName
      };
      let selectCity={};
      if(power === "city"){
        selectCity = {
          cityId: areaDate[0].city[0].cityId,
          cityName: areaDate[0].city[0].cityName
        }
      }else {
        selectCity = {
          cityId: "-1",
          cityName: areaDate[0].proName
        }
      }
      console.log('切换专题selectCity');
      console.log(selectCity);
      // 清除地域条件为默认
      dispatch({
        type:"mySpecialSubjectModels/setQueryCondition",
        payload:{
          date,
          selectPro,
          selectCity
        }
      });

      let params={};
      mySpecialList.forEach((item)=>{
        if(item.id===value){
          params=item
        }
      });


      // 切换专题清除当前选中
      dispatch({
        type:"mySpecialSubjectModels/setSelectSpecialHandle",
        payload:params,
        callback:()=>{
          // 请求最大账期
          const dateParams={
            dateType:params.dateType,
            markType:params.id,
            specialType:params.specialType,
            moduleId
          };
          this.getMaxDate(dateParams);
        }
      })



    }



  };

  // 打开指标配置淡出层
  showIndexConfig=(boolean,fetchTable)=>{
    this.setState({
      IndexSearchShow:boolean
    });
    if(fetchTable){
      // 不管新增还是编辑状态，保存指标配置成功后都必须请求表格
      const {dateType,markType,moduleId,status}=this.props;
      const params={
        dateType,
        markType,
        moduleId,
        status,
        specialType: "table",
        date:"",
        provId:"",
        cityId:"",
      };
      this.getTableData(params)
    }
  };

  /**
   * @date: 2020/4/29
   * @author 喵帕斯
   * @Description: 方法说明:切换专题提示保存专题弹出层函数
   * @method 方法名 changeButtonFun
   * @param {string}  buttonType 参数说明
   * @return {返回值类型} 返回值说明
   */
  changeButtonFun=(buttonType)=>{
    const {changePopVisible}=this.state;
    const {dispatch}=this.props;
    // 当点击弹窗的确定按钮时
    if(buttonType==='ok'){
      // 关闭弹窗
      this.setState({
        changePopVisible:!changePopVisible  // 关闭弹窗
      });
      dispatch({
        type:"mySpecialSubjectModels/setStatus",
        payload:"current"
      });
      const {changeValue}=this.state;
      this.handleChangeSpecialName(changeValue,"current")
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      this.setState({
        changePopVisible:!changePopVisible  // 关闭弹窗
      })
    }
  };


  /**
   * @date: 2020/4/29
   * @author 喵帕斯
   * @Description: 方法说明:删除专题弹出层函数
   * @method 方法名 modalButtonFun
   * @param {string}  buttonType 参数说明
   * @return {返回值类型} 返回值说明
   */
  deleteButtonFun = (buttonType) =>{
    const { dispatch, markType, moduleId, selectSpecial: { specialType } } = this.props;
    const { deletePopVisible } = this.state;
    // 当点击弹窗的确定按钮时
    if(buttonType==='ok'){
      const params = {
        markType,
        moduleId,
        specialType
      };
      //  请求删除接口
      dispatch({
        type:"mySpecialSubjectModels/fetchDelete",
        payload:params,
        callback:(res) => {
          if(res.code === '200') {
            message.success('删除成功!');
            // 切换为当前状态
            dispatch({
              type:"mySpecialSubjectModels/setStatus",
              payload:"current"
            });
            // 请求我的专题列表数据
            this.getMySpecialData();
          } else {
            message.error('删除失败,请重试！');
          }
        }
      });
      // 关闭弹窗
      this.setState({
        deletePopVisible:!deletePopVisible  // 关闭弹窗
      });
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      this.setState({
        deletePopVisible:!deletePopVisible  // 关闭弹窗
      })
    }
  };

  /**
   * @date: 2020/4/29
   * @author 喵帕斯
   * @Description: 方法说明保存专题弹出层
   * @method 方法名 modalButtonFun
   * @param {string}  buttonType 参数说明
   * @return {返回值类型} 返回值说明
   */
  saveButtonFun = (buttonType) =>{
    const {dispatch,selectSpecial,moduleId,status}=this.props;
    const { savePopVisible,inputValue } = this.state;
    if(buttonType==='ok'){ // 当点击弹窗的确定按钮时
      if(inputValue === "") {
        message.error("请输入专题名称")
      }else {
        // 关闭弹窗
        this.setState({
          savePopVisible:!savePopVisible  // 关闭弹窗
        });
        // 保存专题，切换为当前状态
        dispatch({
          type:"mySpecialSubjectModels/setStatus",
          payload:"current"
        });

        const selectSpecialName=selectSpecial.name;
        // 更新选中的我的专题对象
        dispatch({
          type:"mySpecialSubjectModels/setSelectSpecial",
          payload:{
            "name":inputValue,
            "id":selectSpecial.id,
            "dateType":selectSpecial.dateType,
            "specialType":selectSpecial.specialType
          }
        });



        dispatch({
          type:"mySpecialSubjectModels/fetchSaveSpecial",
          payload:{
            dateType:selectSpecial.dateType,
            markType:selectSpecial.id,
            moduleId,
            "name":inputValue,
            status: status === "current" ? "edit" : status,
            "specialType": selectSpecial.specialType ,
          },
          callback:(response)=>{
            if(response.code==="200"){
              message.success(response.message);

              // 请求我的专题列表数据
              this.getMySpecialData();

              if(selectSpecial.specialType==="table"){
                this.getTableData()
              }

              // // 不管新增还是编辑状态，保存指标配置成功后都必须请求表格
              // const {dateType,markType}=this.props;
              // const params={
              //   dateType,
              //   markType,
              //   moduleId,
              //   status,
              //   specialType: "table",
              //   date:"",
              //   provId:"",
              //   cityId:"",
              // };
              // this.getTableData(params)

            }else {
              message.error(response.message);
              // 保存专题失败重置为原先转态
              dispatch({
                type:"mySpecialSubjectModels/setStatus",
                payload:status
              });
              // 更新选中的我的专题对象
              dispatch({
                type:"mySpecialSubjectModels/setSelectSpecial",
                payload:{
                  "name":selectSpecialName,
                  "id":selectSpecial.id,
                  "dateType":selectSpecial.dateType,
                  "specialType":selectSpecial.specialType
                }
              });
            }

          }
        });
      }
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      this.setState({
        savePopVisible:!savePopVisible  // 关闭弹窗
      })
    }
  };


  // 保存专题时，修改专题名称
  saveSpecialTitle=(e)=>{
    const value = e.currentTarget.value.replace(/^\s*|\s*$/g,"");
    this.setState({
      inputValue:value
    })
  };

  // 查询按钮被点击
  queryButtonHandle=()=>{
    const{dispatch,selectSpecial,selectPro,selectCity,date}=this.props;
    if(selectSpecial.specialType==="table"){
      // 请求我的表格数据
      this.getTableData()
    }else if(selectSpecial.specialType==="cockpit"){
      this.childCockpit.fetchLayout();
    }
    // setQueryCondition
    dispatch({
      type:"mySpecialSubjectModels/setQueryCondition",
      payload:{
        date,
        selectPro, // 选中省数据
        selectCity, // 选中地市数据
      }
    })
  };

  // 请求表格专题表格数据
  getTableData=(params)=>{
    const {dateType,markType,date,selectPro,selectCity,moduleId,status}=this.props;
    const defaultParams={
      dateType,
      markType,
      status,
      date,
      moduleId,
      specialType: "table",
      "provId":selectPro.proId,
      "cityId":selectCity.cityId
    };
    const chartParams=params || defaultParams;
    this.child.getTableData(chartParams)
  };

  // 指标解释回调，关闭弹窗
  callbackIndexExplain=()=>{
    this.setState({
      showIndexExplain:false,
    })
  };

  // 挂载表格子组件的this
  onRef = (ref) => {
    this.child = ref
  };

  onRefCockpit=(ref)=>{
    this.childCockpit = ref
  };

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
      showIndexExplain:true
    })
  };

  /**
   * @date: 2020/4/23
   * @author 风信子
   * @Description: 方法说明 选中的类型关闭 回调
   * @method 方法名 SelectTypeCallBackBtn
   * @param {boolean} 参数名 type 参数说明 取消或确定
   * @param {boolean} 参数名 radioValue 参数说明 选中的类型
   */
  SelectTypeCallBackBtn(type,radioValue){
    const {dispatch} = this.props;
    this.isShowSelectTypeShow(false);
    if(type){
      // 请求专题id
      dispatch({
        type:"mySpecialSubjectModels/fetchMarkType",
        payload:{specialType:radioValue},
        callback:()=>{
          if(radioValue === "table"){
            // 打开指标搜索弹出层
            this.showIndexConfig(true);
          }else {
            // 布局弹出层
            dispatch({
              type:"cockpitLayoutModels/updatelayoutData",
              payload:[]
            })
          }
        }
      })
    }else {
      dispatch({
        type:"mySpecialSubjectModels/setStatus",
        payload:"current"
      })
    }
  }

  outTipOnOk(){
    const {dispatch} = this.props;
    // 切换为当前状态
    dispatch({
      type:"mySpecialSubjectModels/setStatus",
      payload:"current"
    });
  }

  render() {
    const {mySpecialList,date,dateType,selectSpecial,markType,status}=this.props;
    const {tabList, SelectTypeShow,IndexSearchShow,deletePopVisible,savePopVisible,inputValue,showIndexExplain,iconExplainContent,changePopVisible}=this.state;
    const tabDom=tabList.map((item)=>(<div className={styles.button} key={item.id} onClick={()=>this.buttonOnclick(item.id)}>{item.name}</div>));
    const mySpecialDom=mySpecialList.map((item)=>(<Option key={item.id}>{item.name}</Option>));
    const dateComponent= dateType==='D'
      ?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.handleChangeDate}  />
      :<MonthPicker value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.handleChangeDate} />;
    let layoutDom = null;
    if(selectSpecial.specialType === "table"){
      layoutDom = ( <TableLayout onRef={this.onRef} />);
    }else if(selectSpecial.specialType === "cockpit"){
      layoutDom = ( <CockpitLayout onRef={this.onRefCockpit} />);
    }
    return (
      <div className={styles.apply}>
        {/* 离开当前专题时提示保存专题弹出层 */}
        <Modal
          title="提示"
          visible={changePopVisible}
          onOk={()=>this.changeButtonFun('ok')}
          onCancel={()=>this.changeButtonFun('cancel')}
          centered
          className={styles.modelClass}
        >
          <div className={styles.confirmText}>
            <span>专题未保存，是否离开？</span>
          </div>
        </Modal>
        {/* 删除专题弹出层挂载 */}
        <Modal
          title="删除专题"
          visible={deletePopVisible}
          onOk={()=>this.deleteButtonFun('ok')}
          onCancel={()=>this.deleteButtonFun('cancel')}
          centered
          className={styles.modelClass}
        >
          <div className={styles.confirmText}>
            <span>确定要删除专题吗？</span>
          </div>
        </Modal>
        {/* 保存专题弹出层挂载 */}
        <Modal
          title="保存专题"
          visible={savePopVisible}
          onOk={()=>this.saveButtonFun('ok')}
          onCancel={()=>this.saveButtonFun('cancel')}
          centered
          className={styles.modelClass}
        >
          <div className={styles.confirmText}>
            <div className={styles.saveInputWrapper}>
              <div>专题名：</div>
              <Input
                className={styles.saveInput}
                onChange={this.saveSpecialTitle}
                value={inputValue}
                placeholder="输入专题名"
                maxLength={1000}
              />
            </div>
          </div>
        </Modal>
        {/* 选择指标弹出层挂载 */}
        {IndexSearchShow&&<IndexSearch callback={this.showIndexConfig} />}
        <div className={styles.header}>
          <div className={styles.buttonWrapper}>
            {tabDom}
          </div>
          <div className={styles.conditionWrapper}>
            <div className={styles.condition}>
              <div className={styles.label}>我的专题：</div>
              <Select
                value={selectSpecial.name}
                dropdownClassName={styles.mySpecialSelect}
                onChange={(value)=>this.handleChangeSpecialName(value,status)}
                suffixIcon={<Icon type="caret-down" />}
              >
                {mySpecialDom}
              </Select>
            </div>
          </div>
        </div>
        <div className={styles.headerSecond}>
          <div key={selectSpecial.id} className={styles.buttonWrapper}>
            <div className={styles.buttonWrapperName}>{selectSpecial.name}</div>
            <div style={{display:'inline-block',position:"relative"}} onMouseOver={this.mouseOverIconIndex} onFocus={this.mouseOverIconIssue} onMouseLeave={this.mouseLeaveIconIndex}>
              <IconFont
                type="icon-wenzhang"
                className={styles.titleIcon}
                onClick={this.seeDetail}
              />
              {iconExplainContent?<div className={styles.iconContent}>点击查看该专题内指标解释</div>:null}
            </div>
            {showIndexExplain &&<IndexExplain show={showIndexExplain} callback={this.callbackIndexExplain} status={status} specialType={selectSpecial.specialType} moduleApi="mySubject" markId={selectSpecial.id} />}
          </div>
          {
            status==="current" && (
              <div className={styles.conditionWrapper}/* style={{display: status==="current"?"flex":"none"}} */>
                <div className={styles.condition}>
                  <ProCity markType={markType} />
                </div>
                <div className={styles.condition}>
                  <div className={styles.label}>时间：</div>
                  {date && dateComponent}
                </div>
                <div className={styles.condition}>
                  <div className={styles.query} onClick={this.queryButtonHandle}>查询</div>
                </div>
              </div>
            )
          }
        </div>
        <div className={styles.layout}>
          {layoutDom}
        </div>
        {SelectTypeShow && (<SelectType callBackBtn={(type,radioValue)=>this.SelectTypeCallBackBtn(type,radioValue)} />)}
        {status !== "current" && (<OutTip OnOk={()=>this.outTipOnOk()} message="专题未保存，是否确定离开？" />)}
      </div>
    );
  }
}

export default MySpecialSubjectApply;
