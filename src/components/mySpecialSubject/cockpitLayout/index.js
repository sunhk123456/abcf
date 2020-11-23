/**
 * @Description: 驾驶舱布局页面
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/6
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Icon, message } from 'antd';
import isEqual from 'lodash/isEqual';
import LayoutModel from '@/components/mySpecialSubject/cockpitLayout/layoutModel'; // 布局选着组件
import CriterionSearchPopup from './criterionSearchPopup'
import DimensionConfigurePopup from './dimensionConfigurePopup'
import TemplatePopup from './templatePopup';
// import isEqual from 'lodash/isEqual';
import iconFont from '@/icon/Icons/iconfont';

import styles from "./index.less"
import TableAreaEchart from '../tableLayout/tableAreaEchart';
import CutPie from '@/components/BuildingView/cutPie';
import TreeMap from '../../Echart/analyseSpecial/treeMap';
import MySpecialTimeEchart from '../../Echart/mySpecialSubject/timeEchart';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({cockpitLayoutModels,loading,mySpecialSubjectModels,proCityModels}) =>({
  date:mySpecialSubjectModels.date,
  selectPro:proCityModels.selectPro,
  selectCity:proCityModels.selectCity,
  layoutData:cockpitLayoutModels.layoutData, // 布局数据
  status:mySpecialSubjectModels.status, // 工作专题 新增、编辑、展示
  selectSpecial:mySpecialSubjectModels.selectSpecial, // 选中的专题信息
  criterionPopupData:cockpitLayoutModels.criterionPopupData,  //  指标检索弹窗数据
  dimensionPopupData:cockpitLayoutModels.dimensionPopupData,  //  指标维度配置弹窗数据
  templatePopupData:cockpitLayoutModels.templatePopupData,  //  模板选择弹窗数据
  moduleId:mySpecialSubjectModels.moduleId, //  模块ID
  queryCondition:mySpecialSubjectModels.queryCondition, // 查询条件 账期 省分地市
  loading
}))

class CockpitLayout extends PureComponent {

  constructor(props) {
    super(props);
    const {onRef}=this.props;
    onRef(this); // 把子组件this传给父组件
    this.state = {
      rowDom:[], // 行布局处理后的dom
      echartAllData:{}, // 请求的echart 所有数据
      signRequestNum:0, // 标记请求个数 判断是否完成
      layoutModelShow: false, // 布局选着弹出框
      rowOrColumn: "", // 默认为空 处于行布局添加 row 列布局添加 column
      criterionPopupShow: false, // 指标检索弹出框
      dimensionPopupShow: false, //  指标维度配置弹框
      templatePopupShow: false,  //  模板选择弹框
      popupData: {
        dateType: '',  //  指标检索弹框  日月维度
        indexId: '',      //  指标检索弹框  指标ID
        indexType: '',    //  指标维度配置弹框  指标类型
        demensionType: '',  //  指标维度配置弹框  维度ID
        chartType: '', //  模板类型弹框  模板类型
      },
      addColumnItem:{}, // 保存要添加图的元素信息
    };
  }

  componentDidMount() {
    this.fetchLayout();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {echartAllData,signRequestNum} = this.state;
  //   if(echartAllData !== nextState.echartAllData || signRequestNum !== nextState.signRequestNum){
  //     return false;
  //   }
  //   return true;
  // }

  componentDidUpdate(prevProps) {
    const {moduleId,selectSpecial,loading,layoutData,status,selectSpecial:{id},dispatch} = this.props;
    const {signRequestNum,rowOrColumn} = this.state;
    // 只有默认状态的时候集体触发接口完成渲染 dom
    if(layoutData.length > 0 && !loading.global && signRequestNum === [].concat(...layoutData).length || ( status !== prevProps.status)){
      this.layoutHandle();
    }else if(rowOrColumn === "column" && signRequestNum === 1){ // 添加单个图 请求到数据后 进行渲染
      this.layoutHandle();
    }
    // 布局数据发生改变，重新请求渲染
    if(!isEqual(layoutData,prevProps.layoutData)){

      console.log(layoutData);
      this.layoutDataHandle();
    }
    // 专题发生改变 重新请求布局接口
    if(id !== prevProps.selectSpecial.id){
      if(status === "add"){
        dispatch({
          type: `cockpitLayoutModels/updatelayoutData`,
          payload: [],
        });
      }else {
  
        const otherParams={
          "specialType":"cockpit",
          // dateType:selectSpecial.dateType,
          markType:selectSpecial.id,
          moduleId,
          date:"",
          status,
          provId:"",
          cityId:""
        };
        this.fetchLayout(otherParams);
      }
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: `cockpitLayoutModels/updatelayoutData`,
      payload: [],
    });
  }

  fetchLayout =(otherParams)=>{
    const {status,dispatch,moduleId,selectSpecial:{id},date,selectPro:{proId},selectCity:{cityId}} = this.props;
    const params = {
      specialType:"cockpit",
      markType:id,
      date,
      cityId,
      provId:proId,
      moduleId,
      status
    };
    dispatch({
      type:"cockpitLayoutModels/fetchLayout",
      payload:otherParams||params,
    })
  };

  /**
   * @date: 2020/5/7
   * @author 风信子
   * @Description: 方法说明 处理数据格式 扁平化数组 减少循环
   * @method 方法名 layoutDataHandle
   */
  layoutDataHandle = ()=>{
    const {layoutData,status} = this.props;
    const {rowOrColumn} = this.state;
    const  flattenLayoutData = [].concat(...layoutData); // 数组扁平化 只限于本数组
    console.log("处理数据");
    console.log(layoutData);
    console.log(status);
    console.log(rowOrColumn);
    // 只有默认状态的时候才会集体触发接口
    if(status === "current"){
      this.setState({
        echartAllData:{}, // 请求的echart 所有数据
        signRequestNum:0, // 标记请求个数 判断是否完成
      },()=>{
        flattenLayoutData.forEach((item)=>{
          this.getEchaerHandle(item);
        })
      })
    }else if(rowOrColumn === "row" || rowOrColumn === "delete" || status === "add") {
      // 添加行布局的时候渲染  行布局不需要请求接口
      this.layoutHandle();
    }
  };

  /**
   * @date: 2020/5/7
   * @author 风信子
   * @Description: 方法说明 请求数据
   * @method 方法名 getEchaerHandle
   * @param {object} 参数名 item 参数说明 布局中的每项数据
   */
  getEchaerHandle = (item) =>{
    // area: 地域分布图
    // timeEchartLine:时间折线图
    // timeEchartArea:时间面积图
    // pieEchart:普通饼图）
    // pieEchartRose:南丁格尔玫瑰图
    // pieEchartBorder:带边框的饼图
    // treeMap:矩形树图
    const {moduleId,status,dispatch} = this.props;
    const {echartAllData} = this.state;
    const echartData = {}; // 请求的 echart 返回的所有数据
    console.log(item);
    const {chartType,provId,span,cityId,date,dateType,demensionType,indexId,indexType,markType,position} = item;
    const params = {
      moduleId,
      status,
      chartType,
      provId,
      span,
      cityId,
      date,
      dateType,
      demensionType,
      indexId,
      indexType,
      markType,
      specialType:"cockpit",
      positionX: position[0],
      positionY: position[1]
    };
    console.log(params);
    switch (chartType) {
      // 地域分布图
      case "area":
        dispatch({
          type: `cockpitLayoutModels/fetchTimeEchartArea`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 时间折线图
      case "timeEchartLine":
        dispatch({
          type: `cockpitLayoutModels/fetchTimeEchartArea`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 时间面积图
      case "timeEchartArea":
        dispatch({
          type: `cockpitLayoutModels/fetchTimeEchartArea`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 普通饼图
      case "pieEchart":
        dispatch({
          type: `cockpitLayoutModels/fetchPieEchart`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 南丁格尔玫瑰图
      case "pieEchartRose":
        dispatch({
          type: `cockpitLayoutModels/fetchPieEchart`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 带边框的饼图
      case "pieEchartBorder":
        dispatch({
          type: `cockpitLayoutModels/fetchPieEchart`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      // 矩形树图
      case "treeMap":
        dispatch({
          type: `cockpitLayoutModels/fetchTreeMap`,
          payload:params,
          callback:(response)=>{
            const {signRequestNum} = this.state;
            echartData[`${chartType}_${position.join("")}`] = response;
            this.setState({
              echartAllData:Object.assign(echartAllData,echartData),
              signRequestNum:signRequestNum + 1
            });
          }
        });
        break;
      default:{
        // eslint-disable-next-line no-new
        // 此处为了实现同步更新 setState 值
        new Promise((resolve) => {
          resolve();
        }).then((()=>{
          const {signRequestNum} = this.state;
          this.setState({
            signRequestNum:signRequestNum + 1
          });
        }));

      }
    }
  };

  /**
   * @date: 2020/5/7
   * @author 风信子
   * @Description: 方法说明 引入组件
   * @method 方法名 componentsIntroduce
   * @param {Object} 参数名 itemColumn 参数说明 当前位置元素信息
   * @param {Object} 参数名 echartData 参数说明 组件数据
   */
  componentsIntroduce =(itemColumn,echartData)=>{
    const {chartType,span} = itemColumn;
    const {queryCondition,status,selectSpecial}=this.props;
    const {date,selectPro,selectCity}=queryCondition;
   
    let downloadData;
    // 当不为编辑状态的时候才显示下载图标
    if(status==='current'){
      downloadData = {
        specialName: selectSpecial.name,
        conditionValue:[
          ["账期", date],
          ["省分", selectPro.proName],
          ["地市", selectCity.cityName],
        ]
      };
    }else{
      downloadData = false
    }
    let componentDom = null;
    let newData={};
    switch (chartType) {
      // 地域分布图
      case "area":
        console.log(echartData);
        newData=Object.assign({},echartData,{
          chart:echartData.chart[0].value,
          unit:echartData.chart[0].unit,
          example:[echartData.chart[0].name],
        });
        componentDom =
          <TableAreaEchart
            cockpit
            titlePosition="center"
            chartData={newData}
            downloadData={downloadData}
            widthInfo={span}
          />;
        break;
      // 时间折线图
      case "timeEchartLine":
        componentDom =
          <MySpecialTimeEchart
            chartData={echartData}
            downloadData={downloadData}
            echartId="timeEchartLine"
            titlePosition="center"
          />;
        console.log("时间折线图");
        console.log(echartData);
        break;
      // 时间面积图
      case "timeEchartArea":
        componentDom =
          <MySpecialTimeEchart
            timeEchartArea
            chartData={echartData}
            downloadData={downloadData}
            echartId="timeEchartArea"
            titlePosition="center"
          />;
        console.log("时间面积图");
        console.log(echartData);
        break;
      // 普通饼图
      case "pieEchart":
        componentDom =
          <CutPie
            cutPieData={echartData}
            noSubtitle
            // colors={["#F8636D","#FA8D94","#FCB1B6"]}
            colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
            downloadData={downloadData}
            hasBorder={false}
            markType="HOME_SUB_M"
            hasLegend
            titlePosition="center"
            echartId="pieEchart"
          />;
        break;
      // 南丁格尔玫瑰图
      case 'pieEchartRose':
        componentDom =
          <CutPie
            cutPieData={echartData}
            noSubtitle
            // colors={["#F8636D","#FA8D94","#FCB1B6"]}
            colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
            downloadData={downloadData}
            isRosePie
            markType="HOME_SUB_M"
            hasLegend
            titlePosition="center"
            echartId="pieEchartRose"
          />;
        break;
      // 带边框的饼图
      case "pieEchartBorder":
        componentDom =
          <CutPie
            cutPieData={echartData}
            noSubtitle
            // colors={["#F8636D","#FA8D94","#FCB1B6"]}
            colors={['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7']}
            downloadData={downloadData}
            hasBorder
            markType="HOME_SUB_M"
            hasLegend
            titlePosition="center"
            echartId="pieEchartBorder"
          />;
        break;
      // 矩形树图
      case "treeMap":
        componentDom =
          <TreeMap
            newCondition
            chartData={echartData}
            backGroundColor='#F7F8FC'
            colors={[
              '#8DC9EB',
              '#A5D3BC',
              '#CFE7D1',
              '#AFD3F3',
              '#9DBAE6',
              '#F08EAB',
              '#F0AC93',
              '#E07E7E',
              '#F4CFD0',
              '#EEB8B7'
            ]}
            downloadData={downloadData}
            titlePosition="center"
            fromHotInfo
          />;
        break;
      default:{
        componentDom = status !== "current" && (
          <div className={styles.addColumn}>
            <IconFont
              className={styles.add}
              type="icon-jiashang"
              onClick={()=>this.addColumnHandle(itemColumn)}
            />
            <div className={styles.red}>点击‘+’添加图</div>
          </div>
        )
      }
    }
    return componentDom;
  };

  /**
   * @date: 2020/5/7
   * @author 风信子
   * @Description: 方法说明 处理布局Dom
   * @method 方法名 layoutHandle
   */
  layoutHandle = () =>{
    const {layoutData,status} = this.props;
    console.log(layoutData);
    const {echartAllData} = this.state;
    const rowDom = layoutData.map((item)=>{
      const columnDom = item.map((itemColumn)=>{
        const {span,position,chartType} = itemColumn;
        const widthColumn = (parseInt(span,10)/6)*100;
        console.log(echartAllData);
        const echartData = echartAllData[`${chartType}_${position.join("")}`];
        return (
          <div key={`${chartType}_${position.join("")}`} className={styles.column} style={{width:`${widthColumn}%`}}>
            <div className={styles.echartWrapper}>
              {/* <div className={styles.echartHeader}> */}
              {/* <div className={styles.echartHeaderText}>{echartData&&echartData.subtitle}</div> */}
              {/* </div> */}
              {status !== "current" && chartType &&
              <IconFont
                className={styles.delete}
                type="icon-shanchu"
                onClick={()=>this.deleteColumnHandle(itemColumn)}
              />}
              <div className={styles.echartMain}>
                {this.componentsIntroduce(itemColumn,echartData)}
              </div>
            </div>
          </div>
        )
      });
      return (
        <div className={styles.row} key={item[0].position[0]}>
          {columnDom}
        </div>
      )
    });
    this.setState({rowDom,signRequestNum:0,rowOrColumn:""})
  };

  /**
   * @date: 2020/5/7
   * @author 风信子
   * @Description: 方法说明 添加行布局
   * @method 方法名 addRowHandle
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  addRowHandle = ()=>{
    // 添加行
    this.setState({layoutModelShow:true})
  };

  /**
   * @date: 2020/5/8
   * @author 风信子
   * @Description: 方法说明 添加图
   * @method 方法名 addColumnHandle
   * @param {Object} 参数名 itemColumn 参数说明 添加位置信息
   * @return {返回值类型} 返回值说明
   */
  addColumnHandle =(itemColumn)=>{
    const {span,position,chartType} = itemColumn;
    // 显示指标添加
    this.setState({
      criterionPopupShow: true,
      addColumnItem:{span,position,chartType}
    })
  };

  /**
   * @date: 2020/6/16
   * @author yzh
   * @Description: 方法说明 删除图
   * @method 方法名 deleteColumnHandle
   * @param {Object} 参数名 itemColumn 参数说明 删除位置信息
   * @return {返回值类型} 返回值说明
   */
  deleteColumnHandle = itemColunm => {
    const {layoutData, dispatch, moduleId, selectSpecial} = this.props;
    const newLayoutData = JSON.parse(JSON.stringify(layoutData));
    newLayoutData[itemColunm.position[0]-1][itemColunm.position[1]-1].chartType = '';
    dispatch({
      type: 'cockpitLayoutModels/fetchDeleteEchart',
      payload: {
        moduleId,
        markType: selectSpecial.id,
        positionX: itemColunm.position[0],
        positionY: itemColunm.position[1],
        span: itemColunm.span,
      },
      callback: res => {
        if(res.code === "200") {
          this.setState({rowOrColumn: 'delete'});
          dispatch({
            type: `cockpitLayoutModels/updatelayoutData`,
            payload: newLayoutData
          });
          message.success(res.message)
        } else {message.error(res.message)}

      }
    })
  };

  //  指标检索弹框确定
  criterionHandleOk = (indexId, dayAndMonth, selectName) => {
    console.log(selectName);
    const { popupData } = this.state;
    const { dispatch, moduleId, selectSpecial } = this.props;
    //  请求指标维度配置弹框数据
    const params = {
      moduleId,
      markType: selectSpecial.id,
      dateType: dayAndMonth,
      specialType:selectSpecial.specialType,
      indexId
    };
    dispatch({
      type: `cockpitLayoutModels/fetchIndexDemension`,
      payload: params,
      callback: ()=>{
        //  保存指标配置弹窗选择的数据
        this.setState({
          popupData: {
            ...popupData,
            indexId,
            dateType: dayAndMonth
          },
          criterionPopupShow: false,
          dimensionPopupShow: true
        })
      }
    });

  };

  //  指标检索弹框取消
  criterionHandleCancel = () => {
    this.setState({
      criterionPopupShow: false
    })
  };

  //  点击指标检索弹框搜索按钮
  handleSearch = (value,dateType) => {
    const { dispatch, moduleId, selectSpecial } = this.props;
    const params = {
      search: value,
      moduleId,
      markType: selectSpecial.id,
      dateType,
      specialType:selectSpecial.specialType
    };
    dispatch({
      type: `cockpitLayoutModels/fetchIndexConfig`,
      payload: params,
    });
  };

  /**
   * @date: 2020/5/8
   * @author 风信子
   * @Description: 方法说明 处理行布局并添加
   * @method 方法名 callBackSelectLayout
   * @param {boolean} 参数名 type 参数说明 取消还是确定
   * @param {array} 参数名 layoutArr 参数说明 选中行的信息
   */
  callBackSelectLayout =(type,layoutArr)=>{
    if(type){
      const {dispatch,layoutData,selectSpecial,moduleId} = this.props;
      let positionX = 1;
      const layoutDataLen = layoutData.length;
      // console.log("添加行");
      // console.log(layoutArr);
      // console.log(layoutData)
      // console.log(layoutData[layoutDataLen-1][0].position[0])

      if( layoutDataLen > 0){
        positionX = parseInt(layoutData[layoutDataLen-1][0].position[0] ,10) + 1
      }
      const addRowArr = layoutArr.map((item)=>{
        const {column, span} = item;
        return {
          "position":[(positionX).toString(),column],
          span,
          "chartType":"",
        }
      });
      // console.log(addRowArr);
      const addRowLayout = addRowArr.map(item => ({
          positionX: item.position[0],
          positionY: item.position[1],
          span: item.span,
          chartType:"",
        }));
      dispatch({
        type: `cockpitLayoutModels/fetchAddLayout`,
        payload: {
          moduleId,
          specialType: selectSpecial.specialType,
          markType: selectSpecial.id,
          dateType: selectSpecial.dateType,
          addRowArr: addRowLayout
        },
        callback: res => {
          if(res.code === '200') {
            this.setState({layoutModelShow:false,rowOrColumn:"row"});
            dispatch({
              type: `cockpitLayoutModels/updatelayoutData`,
              payload: layoutData.concat([addRowArr]),
            });
          } else {
            message.error(res.message)
          }
        }
      });
    } else {
      this.setState({layoutModelShow:false,rowOrColumn:""})
    }
  };

  //  指标维度配置弹框确定
  dimensionHandleOk = (dimensionId, indexType) => {
    const { popupData } = this.state;
    const { dispatch, moduleId, selectSpecial } = this.props;
    //  请求指标维度配置弹框数据
    const params = {
      moduleId,
      markType: selectSpecial.id,
      dateType: popupData.dateType,
      specialType: selectSpecial.specialType,
      indexId: popupData.indexId,
      demensionType: dimensionId,
      indexType
    };
    dispatch({
      type: `cockpitLayoutModels/fetchChartType`,
      payload: params,
      callback: ()=>{
        //  保存指标维度配置弹窗选择的数据
        this.setState({
          popupData: {...popupData, indexType, demensionType: dimensionId},
          dimensionPopupShow: false,
          templatePopupShow: true
        })
      }
    });

  };

  //  指标维度配置弹框取消
  dimensionHandleCancel = () => {
    this.setState({
      dimensionPopupShow: false
    })
  };

  //  模板选择弹框确定
  templateHandleOk = chartType => {
    const { popupData,addColumnItem } = this.state;
    const {position} = addColumnItem;
    const {dispatch,layoutData} = this.props;
    const layoutDataCopy = [...layoutData];
    const popupDataConcat = {
      ...popupData,
      chartType
    };

    layoutDataCopy.forEach((item)=>{
      if(item[0].position[0] === position[0]){
        // eslint-disable-next-line no-param-reassign
        item[position[1]-1].chartType = chartType;
      }
    });
    dispatch({
      type: `cockpitLayoutModels/updatelayoutData`,
      payload: layoutDataCopy,
    });
    this.setState({
      popupData: popupDataConcat,
    },()=>{
      this.fetchIndexDemensionSave();
    })
  };

  //  模板选择弹框取消
  templateHandleCancel = () => {
    this.setState({
      templatePopupShow: false
    })
  };

  /**
   * @date: 2020/5/15
   * @author 风信子
   * @Description: 方法说明 echart图保存接口
   * @method 方法名 fetchIndexDemensionSave
   */
  fetchIndexDemensionSave = ()=>{
    const { popupData ,addColumnItem} = this.state;
    const {span,position} = addColumnItem;
    const {moduleId,status,selectSpecial:{id},dispatch,queryCondition} = this.props;
    const params = {
      markType:id,
      specialType:"cockpit",
      moduleId,
      status,
      positionX:position[0],
      positionY:position[1],
      span,
      ...popupData,
    };
    dispatch({
      type: `cockpitLayoutModels/fetchIndexDemensionSave`,
      payload: params,
      callback:(response)=>{
        if(response.code === "200"){
          const {date, selectPro: { proId }, selectCity: { cityId }} = queryCondition;
          const params2 = {
            moduleId,
            status,
            provId:proId,
            cityId,
            date,
            markType:id,
            specialType:"cockpit",
            position,
            // positionX:position[0],
            // positionY:position[1],
            span,
            ...popupData
          };
          this.setState({
            templatePopupShow: false,
            rowOrColumn: "column", // 触发列布局
          });
          console.log(params2);
          this.getEchaerHandle(params2); // 请求单个图数据
        }else {
          message.error(response.message);
        }
      }
    });
  };

  render() {

    const {rowDom, criterionPopupShow, dimensionPopupShow, layoutModelShow, templatePopupShow} = this.state;
    const {status, criterionPopupData, dimensionPopupData, templatePopupData} = this.props;
    return (
      <div className={styles.cockpitLayout}>
        {rowDom}
        { status !== "current" &&
        <div className={styles.row2}>
          <div className={styles.add}>
            <IconFont
              type="icon-jiashang"
              onClick={()=>this.addRowHandle()}
            />
          </div>
          <div className={styles.red}>点击‘+’添加行布局</div>
        </div>
        }
        {
          criterionPopupShow && <CriterionSearchPopup
            handleOk={this.criterionHandleOk}
            handleCancel={this.criterionHandleCancel}
            handleSearch={this.handleSearch}
            data={criterionPopupData}
          />
        }
        {
          dimensionPopupShow &&  <DimensionConfigurePopup
            handleOk={(id, type) => {
              this.dimensionHandleOk(id, type);
            }}
            handleCancel={this.dimensionHandleCancel}
            data={dimensionPopupData}
          />
        }
        {
          templatePopupShow && <TemplatePopup
            handleOk={id => {this.templateHandleOk(id)}}
            handleCancel={this.templateHandleCancel}
            data={templatePopupData}
          />
        }
        {
          layoutModelShow && <LayoutModel
            callBackSelectLayout={(type,layoutArr)=>this.callBackSelectLayout(type,layoutArr)}
          />
        }

      </div>
    );
  }
}

export default CockpitLayout;
