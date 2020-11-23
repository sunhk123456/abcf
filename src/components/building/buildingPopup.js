/**
 * @Description:  楼宇弹出层容器
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Icon} from 'antd';
import PopupTable from './popupTable';
import BuildingTop10 from './buildingTop10';
import styles from './buildingPopup.less';


@connect(
  ({
     buildingModels,
   }) => ({
    buildingModels,
  })
)
class BuildingPopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadParam:{},
    }
  }

  componentDidMount() {
    this.requestTable();
    const {popData:{popType}} = this.props;
    if(popType !== "table"){
      this.getHouseIncomeDataPop();
      this.getNewUserDataPop();
      this.getNewIncomeDataPop();
    }
  }

  getHouseIncomeDataPop=()=>{
    const {dispatch,buildingModels:{date,dateType,markType},popData:{provId,cityId}} = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"houseIncomePop"
    };
    dispatch({
      type: `buildingModels/getHouseIncomePopData`,
      payload: params,
    });
  };

  getNewUserDataPop=()=>{
    const {dispatch,buildingModels:{date,dateType,markType},popData:{provId,cityId}} = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"newUserPop"
    };
    dispatch({
      type: `buildingModels/getNewUserPopData`,
      payload: params,
    });
  };

  getNewIncomeDataPop=()=>{
    const {dispatch,buildingModels:{date,dateType,markType},popData:{provId,cityId}} = this.props;
    const params = {
      markType,
      dateType,
      date,
      provId,
      cityId,
      "chartType":"newIncomePop"
    };
    dispatch({
      type: `buildingModels/getNewIncomePopData`,
      payload: params,
    });
  };

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 获取表格数据
   * @method requestTable
   * @param {string} 参数：page 参数描述：当前页
   * @param {string} 参数：pageSize 参数描述：每页的条数
   * @param {string} 参数：isState 参数描述：matching 已匹配楼宇, carding 已梳理楼宇
   * @return {返回值类型} 返回值说明
  */
  requestTable(page="1",pageSize="10",isState="matching",isDownload="false"){
    const {dispatch,buildingModels:{date,dateType,markType},popData:{provId,cityId}} = this.props;
    const params = {
      provId,
      cityId,
      date,
      dateType,
      markType,
      type:isState,
      pageNum:pageSize,
      num:page,
      isDownload
    }
    dispatch({
      type: `buildingModels/getPopupTable`,
      payload: params
    });
    const downloadParam = {
      provId,
      cityId,
      date,
      dateType,
      markType,
      type:isState,
      pageNum:pageSize,
      num:page,
      isDownload:true
    }
    this.setState(
      {downloadParam,}
    )
  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 关闭弹窗
  */
  closeHandle(){
    const {callBackClose} = this.props;
    callBackClose();
  }

  render() {
    const { downloadParam } = this.state;
    const {buildingModels:{houseIncomePop,newUserPop,newIncomePop,popupTable,specialName,date},popData:{popType,provName,cityName,cityId}} = this.props;
    const topName = cityId === "-1" ? provName : `${provName} > ${cityName}`;
    return (
      <div className={styles.buildingPopup}>
        <div className={styles.container}>
          <div className={styles.title}>
            {`转交情况 > ${topName}` }
            <span className={styles.close} onClick={()=>this.closeHandle()}><Icon type="close-circle" /></span>
          </div>
          {
            popType !== "table" && (
              <div className={styles.top10}>
                <div className={styles.topItem}>
                  <BuildingTop10
                    download
                    echartId='buildingPopup1'
                    specialName={specialName}
                    provName={provName}
                    cityName={cityName}
                    date={date}
                    chartData={houseIncomePop}
                  />
                </div>
                <div className={styles.topItem}>
                  <BuildingTop10
                    download
                    echartId='buildingPopup2'
                    specialName={specialName}
                    provName={provName}
                    cityName={cityName}
                    date={date}
                    chartData={newUserPop}
                  />
                </div>
                <div className={styles.topItem}>
                  <BuildingTop10
                    download
                    echartId='buildingPopup3'
                    specialName={specialName}
                    provName={provName}
                    cityName={cityName}
                    date={date}
                    chartData={newIncomePop}
                  />
                </div>
              </div>
            )
          }

          <div className={styles.tableContainer}>
            <PopupTable
              downloadParam={downloadParam}
              tableData={popupTable}
              pageSize={10} // 每页的个数
              sizeOptions={["10","20","30"]} // 每页要选择的个数
              callBackRequestTable={(page,pageSize,isState,isDownload)=>this.requestTable(page,pageSize,isState,isDownload)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default BuildingPopup;
