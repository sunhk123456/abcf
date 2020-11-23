import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, message, Icon, Tag } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import TrendChart from './trendChart';
import styles from './tableData.less';
import templateImg from './img/u1916.png';
import saveImg from './img/u1912.png';
import outImg from './img/u1043.png';
import succImg from './img/u1900.png';
/* eslint-disable */
const { CheckableTag } = Tag;

@connect(({ tableData, benchMarking, regionalArea, compositeIndexList, benchmarkArea }) => ({
  dateType: benchMarking.dateType,
  markType: benchMarking.markType,
  thData: tableData.thData,
  tbodyData: tableData.tbodyData,
  benchMarkData: tableData.benchMarkData,
  benchMarkContrastData: tableData.benchMarkContrastData,
  date: benchMarking.date,
  templateId: benchMarking.templateId,
  benchmarkName: benchmarkArea.benchmarkName,
  selected: compositeIndexList.selected,  // 指标回显
  backDisplay: regionalArea.backDisplay, // 省份回显
  benchmarkProId: benchmarkArea.benchmarkProId, // 标杆省份id
  benchmarkCityId: benchmarkArea.benchmarkCityId, // 标杆地市id
  permissions: regionalArea.permissions,
  perType: regionalArea.perType,
  areaData: regionalArea.areaData,
}))


class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proShow: false, // 是否显示省下拉
      visible: false, // 显示弹出框
      benchMark: true,  // 趋势对标
      contrast: false, // 趋势对比
      selectProvince: {
        proId: [],
        proName: '',
      }, // 存储弹出框中趋势对标省份的数据
      selectProList: [], // 趋势对标省份列表
      contrastProvince: {
        proId: [],
        proName: '',
      }, // 存储趋势对比省份的数据
      contrastProList: [], // 存储趋势对比省份列表
      benchMarkPro: '', // 点击表格 弹窗的标杆省份
      trendName: '', // 表格弹出框的标题
      chartType: '', // 区分环比还是当月值
      benchmarkProvId: '', // 标杆省份id
      indexId: '', // 弹窗指标编码
      saveTemplate: false, // 是否显示模板保存
      savePro: "", // 保存模板显示的省份
      areaNameSingle: "", // 保存模板显示单行的地域名
      areaName: "", // 完整的地域名
      compositeNameSingle: "", // 保存模板显示单行的指标
      compositeName: "", // 保存模板完整的指标
      areaNameSwitch: false, // 控制保存模板地域名是否显示全部
      compositeNameSwitch: false, // 控制保存模板指标名称是否显示全部
      inputTemplateName: '', // 输入文本框中的模板名称
      saveType: "1", // 模板保存形式 1保存 2另存
      selectType: 0, // 地域按钮权限切换
      cityVisible: false,// 地市弹出框是否展示
      cityList: [], // 存储areadata中的每个省份的子城市
      provId: '',// 选中的省份id
      successModal: false, // 保存成功后的提示框
      sortedInfo: null,
    };
  }

  componentDidMount() {
    const {  onRef } = this.props;
    if(onRef){
      onRef(this);
    }
  }

  componentDidUpdate(prevProps,prevState){
    if( this.props.tableSort === '1'){
      this.setState({
        sortedInfo: null,
      });
      this.props.sortTableData('0',[]);
    }
  }

  // 设置多选选中后的省份框内的文本
  setProText() {
    const { selectProList, contrastProList, benchMark } = this.state;
    const proList =benchMark ? selectProList : contrastProList;
    const id = [];
    let name;
    let addName = '';
    proList.forEach((item) => {
      if(item.selectAreaId === -1 ){
        id.push(item.selectProId);
      }else {
        id.push(item.selectAreaId);
      }
    });
    for (let i = 0; i < proList.length; i+=1) {
      name = proList[i].areaName;
      addName += name;
    }
    const selectPro = {
      proId: id,
      proName: addName,
    };
    if(benchMark){
      this.setState({
        selectProvince: selectPro,
      });
    }else {
      this.setState({
        contrastProvince: selectPro,
      });
    }
  }

  // 多选省份框
  handleChangeProChecked = (event, data) => {
    const { selectProList, benchMark, contrastProList } = this.state;
    const len = selectProList.length;
    const cLen = contrastProList.length;

    // 选中某个省
    if (event.target.checked) {
      if(benchMark) {
        if (len < 3) {
          selectProList.push({
            selectProId: data.areaId,
            selectAreaId: -1,
            areaName: data.areaName,
          });
        } else {
          message.open({
            content:"对标省市最多选择三个！",
            duration:2,
            icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
          })
        }
      }else if (cLen < 1) {
          contrastProList.push({
            selectProId: data.areaId,
            selectAreaId: -1,
            areaName: data.areaName,
          });
        } else {
          message.open({
            content:"对标省市最多选择一个！",
            duration:2,
            icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
          })
        }
    } else {
      const removeIndex = [];
      if(benchMark){
        selectProList.forEach((item, index) => {
          if (item.selectProId === data.areaId) {
            removeIndex.push(index);
          }
        });
        const reIndex = removeIndex.reverse();
        for (let j = 0; j < reIndex.length; j+=1) {
          selectProList.splice(reIndex[j], 1);
        }
      }else {
        contrastProList.forEach((item, index) => {
          if (item.selectProId === data.areaId) {
            removeIndex.push(index);
          }
        });
        const reIndex = removeIndex.reverse();
        for (let j = 0; j < reIndex.length; j+=1) {
          contrastProList.splice(reIndex[j], 1);
        }
      }
    }
    this.setState({
      selectProList,
      contrastProList
    }, this.setProText);
  };

  // 地域权限切换
  changePermissions = (checked, index) => {
    if (checked) {
      this.setState({
        selectType: index,
        cityVisible: false,
      });
    }
  };

  /**
   * 显示地市弹窗
   * @param data
   */
  showCityModal = (data) => {
    if (data.cities !== '') {
      if(data.cities.length !== 0){
        this.setState({
          provId: data.areaId,
          cityList: data.cities,
          cityVisible: true,
        });
      }
    }
  };

  /**
   * 关闭地市弹窗
   */
  closeCityModal = () => {
    this.setState({
      cityVisible: false,
    });
  };

  /**
   * 选中或取消选中某个地市
   * @param checkedValue
   */
  handleChangeCityChecked = (event, data) => {
    const { selectProList, contrastProList, provId, benchMark } = this.state;
    const len = selectProList.length;
    const cLen = contrastProList.length;
    // 选中某个地市
    if (event.target.checked) {
      if(benchMark){
        if(len<3){
          selectProList.push({
            selectProId: provId,
            selectAreaId: data.areaId,
            areaName: data.areaName,
          });
        }else {
          // message.info('');
          message.open({
            content:"对标省市最多选择三个！",
            duration:2,
            icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
          })
        }
      }else if(cLen < 1){
          contrastProList.push({
            selectProId: provId,
            selectAreaId: data.areaId,
            areaName: data.areaName,
          });
        }else {
          // message.info('对标省市最多选择一个！');
          message.open({
            content:"对标省市最多选择一个！",
            duration:2,
            icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
          })
        }
    } else {
      let removeIndex;
      if(benchMark){
        selectProList.forEach((item, index) => {
          if (item.selectProId === provId && item.selectAreaId === data.areaId) {
            removeIndex = index;
          }
        });
        selectProList.splice(removeIndex, 1);
      }else {
        contrastProList.forEach((item, index) => {
          if (item.selectProId === provId && item.selectAreaId === data.areaId) {
            removeIndex = index;
          }
        });
        contrastProList.splice(removeIndex, 1);
      }

    }
    this.setState({
      selectProList,
      contrastProList
    }, this.setProText);
  };

  // 点击趋势对比
  contrastClick = () => {
      this.setState({
        contrast: true,
        benchMark: false,
      });
  };

  // 点击趋势对标
  benchMarkClick = () => {
    this.setState({
      benchMark: true,
      contrast: false,
    });
  };

  // 弹出框关闭
  modalClose = () => {
    // 清空弹出框查询数据
    const selectPro = {
      proId: [],
      proName: '',
    };
    // 还原默认值
    this.setState({
      visible: false,
      selectProvince: selectPro,
      contrastProvince: selectPro,
      selectProList: [],
      contrastProList: [],
      benchMark: true,
      contrast: false,
    });
  };

  // 点击表格当月值弹出曲线图
  tableClick = (record, index, j, item) => {
    // 判断是不是比较的行
    if (record.benchmarkProvId) {
      const { dispatch, date, markType, benchmarkProId, benchmarkCityId, benchmarkName ,dateType} = this.props;
      let benchmarkProvId;
      if(benchmarkCityId !== "-1"){
        benchmarkProvId =benchmarkCityId;
      }else {
        benchmarkProvId = benchmarkProId;
      }
      if(benchmarkProvId===record.benchmarkProvId){
         return null // 拦截点击表格标杆行，标杆省份和对标省份相同时拦截弹出层
      }
      const params = {
        dateType,
        markType,
        date,
        provId: [record.benchmarkProvId],
        benchmarkProvId,
        indexId: record[`${index  }indexId${  j}`],
        chartType: '0',
      };
      const selectProvince = {
        proId: [record.benchmarkProvId],
        proName: record[`${0}table${0}`],
      };
      const selectProList = [];
      // 判断record.markCity标记,若存在其为省份id，benchmarkProvId为地市id
      if(record.markCity !== undefined){
        selectProList.push({
          selectProId: record.markCity,
          selectAreaId: record.benchmarkProvId,
          areaName: record[`${0}table${0}`],
        })
      }else {
        selectProList.push({
          selectProId: record.benchmarkProvId,
          selectAreaId: -1,
          areaName: record[`${0}table${0}`],
        })
      }
      const contrastProvince = {...selectProvince}; // 浅拷贝，防止指针指向相同
      const contrastProList = [...selectProList];
      // 请求趋势对标数据
      dispatch({
        type: 'tableData/fetchBenchmarkingTrend',
        payload: params,
      });
      // 请求趋势对比数据
      dispatch({
        type: 'tableData/fetchCompareTrend',
        payload: params,
      });

      this.setState({
        visible: true,
        benchMarkPro: benchmarkName,
        chartType: '0',
        trendName: item.name[0],
        benchmarkProvId,
        indexId: record[`${index  }indexId${  j}`],
        selectProvince,
        contrastProvince,
        selectProList,
        contrastProList,
      });
    }
    return null
  };

  // 点击表格环比弹出曲线图
  tableTypeClick = (record, index, j, item) => {
    // 判断是不是比较的行
    if (record.benchmarkProvId) {
      const { dispatch, date, markType, benchmarkProId, benchmarkCityId, benchmarkName,dateType } = this.props;
      let benchmarkProvId;
      if(benchmarkCityId !== "-1"){
        benchmarkProvId =benchmarkCityId;
      }else {
        benchmarkProvId = benchmarkProId;
      }
      if(benchmarkProvId===record.benchmarkProvId){
        return null // 拦截点击表格标杆行，标杆省份和对标省份相同时拦截弹出层
      }
      const selectProvince = {
        proId: [record.benchmarkProvId],
        proName: record[`${0}table${0}`],
      };
      const selectProList = [];
      // 判断record.markCity标记,若存在其为省份id，benchmarkProvId为地市id
      if(record.markCity !== undefined){
        selectProList.push({
          selectProId: record.markCity,
          selectAreaId: record.benchmarkProvId,
          areaName: record[`${0}table${0}`],
        });
      }else {
        selectProList.push({
          selectProId: record.benchmarkProvId,
          selectAreaId: -1,
          areaName: record[`${0}table${0}`],
        });
      }
      const contrastProvince = {...selectProvince}; // 浅拷贝，防止指针指向相同
      const contrastProList = [...selectProList];
      const params = {
        dateType,
        markType,
        date,
        provId: [record.benchmarkProvId],
        benchmarkProvId,
        indexId: record[`${index  }indexId${  j}`],
        chartType: '1',
      };
      // 请求趋势对标数据
      dispatch({
        type: 'tableData/fetchBenchmarkingTrend',
        payload: params,
      });
      // 请求趋势对比数据
      dispatch({
        type: 'tableData/fetchCompareTrend',
        payload: params,
      });
      this.setState({
        visible: true,
        benchMarkPro: benchmarkName,
        trendName: item.name[0] + item.name[1],
        chartType: '1',
        benchmarkProvId,
        indexId: record[`${index  }indexId${  j}`],
        selectProvince,
        contrastProvince,
        selectProList,
        contrastProList,
      });
    }
    return null
  };


  // 折线图数据查询按钮
  chartSearchBtn = () => {
    const { dispatch, markType, date ,dateType} = this.props;
    const { benchmarkProvId, indexId, chartType, selectProvince, benchMark, contrastProvince } = this.state;
    const provId = benchMark ? selectProvince.proId : contrastProvince.proId;
    const params = {
      dateType,
      markType,
      date,
      provId,
      benchmarkProvId,
      chartType,
      indexId,
    };
    if (benchMark) {
      // 请求趋势对标数据
      dispatch({
        type: 'tableData/fetchBenchmarkingTrend',
        payload: params
      });
    } else {
      // 请求趋势对比数据
      dispatch({
        type: 'tableData/fetchCompareTrend',
        payload: params
      });
    }

  };

  // 点击保存模板按钮
  saveTemplate = saveType => {
    const {benchmarkName, selected, backDisplay} = this.props;
    const len = selected.length;
    const leng = backDisplay.length;
     if(benchmarkName && len && leng && benchmarkName !== "请选择"){
    // if(benchmarkName && leng && benchmarkName !== "请选择"){  // xxd 2019.8.28 跳过指标名的检查
      let area; // 存放每次循环地区名
      let areaName = "";  // 拼接地区名
      let composite; // 存放每次循环指标名
      let compositeName = ""; // 拼接指标名

      for(let i=0; i<len; i+=1){
        composite = selected[i].name;
        if(i !== len-1){
          compositeName += `${composite}、`;
        }else {
          compositeName += composite;
        }
      }
      for(let j=0; j<leng; j+=1){
        area = backDisplay[j].selectName;
        if(j !== leng-1) {
          areaName += `${area}、`;
        }else {
          areaName += area;
        }
      }
      const areaNameSingle = areaName.length > 27 ? areaName.slice(0,27): areaName;
      const compositeNameSingle = compositeName.length > 27 ? compositeName.slice(0,27) :compositeName;
      this.setState({
        saveTemplate: true,
        savePro: benchmarkName,
        areaName,
        compositeName,
        areaNameSingle,
        compositeNameSingle,
        saveType,
      })
    }else {
      // message.info("");
      message.open({
        content:"请选择指标、地域、标杆等查询条件！",
        duration:2,
        icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
      })
    }

  };

  // 保存模板数据,需要输入模板名验证
  saveTemplateData= () => {
    // 首先校验模板名称
    const {inputTemplateName} = this.state;
    if(inputTemplateName){
      const {dispatch,dateType} = this.props;
      dispatch({
        type: 'tableData/fetchNameCheck',
        payload: {
          templateName: inputTemplateName,
          dateType
        }
      }).then((res) => {
        if(res.state === "false"){
          const {markType, templateId, date, selected,backDisplay, benchmarkProId, benchmarkCityId,dateType} = this.props;
          const {saveType } = this.state;
          const index =[];
          const selectData = [];
          selected.forEach((item) => {
            index.push(item.id)
          });
          backDisplay.forEach((items) => {
           const tempObj = {};
           tempObj.selectProId = items.selectProId;
           tempObj.selectAreaId = items.selectAreaId;
           selectData.push(tempObj);
          });
          dispatch({
            type: 'tableData/fetchSaveModule',
            payload: {
              dateType,
              markType,
              templateId: saveType === "2" ? "" : templateId,
              // modulId: saveType === "2" ? "" : templateId,
              index,
              moduleDate: date,
              selectData,
              templateName: inputTemplateName,
              benchmarkProvId: benchmarkProId,
              benchmarkCityId,
              saveType
            }
          }).then((result) => {
            if(result.result === "success"){
              // message.info("保存成功！");
              this.showSucModal();
              this.saveTemplateClose();
            }else {
              // message.info("保存失败！");
              message.open({
                content:"保存失败！",
                duration:2,
                icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
              })
            }
          })
        }else{
          // message.info(res.tipInfo);
          message.open({
            content:res.tipInfo,
            duration:2,
            icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
          })
        }
      })
    }else {
      // message.info("！");
      message.open({
        content:"请输入模板名称！",
        duration:2,
        icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
      })
    }
  };


  // 跳转到模板id点击保存，无需验证模板名
  withoutCheckSave = () => {
    const {dispatch, tableTitle, markType, templateId,date, selected, backDisplay, benchmarkProId, benchmarkCityId,dateType} = this.props;
    const index =[];
    const selectData = [];
    selected.forEach((item) => {
      index.push(item.id)
    });
    backDisplay.forEach((items) => {
      const tempObj = {};
      tempObj.selectProId = items.selectProId;
      tempObj.selectAreaId = items.selectAreaId;
      selectData.push(tempObj);
    });
    dispatch({
      type: 'tableData/fetchSaveModule',
      payload: {
        dateType,
        markType,
        templateId,
        // modulId: templateId,
        index,
        moduleDate: date,
        selectData,
        templateName: tableTitle,
        benchmarkProvId: benchmarkProId,
        benchmarkCityId,
        saveType: "1"
      }
    }).then((result) => {
      if(result.result === "success"){
        // message.info("保存成功！");
        this.showSucModal();
        this.saveTemplateClose();
      }else {
        // message.info("！");
        message.open({
          content:"保存失败！",
          duration:2,
          icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
        })
      }
    })
 };


  // 显示更多地域数据
  moreAreaData = () => {
    const {areaNameSwitch} = this.state;
    this.setState({
      areaNameSwitch: !areaNameSwitch
    })
  };

  // 显示更多指标数据
  moreCompositeData = () => {
    const {compositeNameSwitch} = this.state;
    this.setState({
      compositeNameSwitch: !compositeNameSwitch
    })
  };

  // 更改模板名称
  inputTemplateNameChange = e => {
    this.setState({
      inputTemplateName: e.target.value
    })
  };

  // 关闭模板
  saveTemplateClose = () => {
    this.setState({
      saveTemplate: false,
      compositeNameSwitch: false,
      areaNameSwitch: false,
      inputTemplateName: '',
    })
  };

  // 关闭成功提示框
  successClose = () => {
    this.setState({
      successModal: false
    })
  };

  // 生成折线图的数据
  createTrendData = (arr) => {
    let trendData = {};
    // 趋势对标线条颜色
    const benchColor = ["#FDB984","#59B0ED","#D8787E","#B6A3DC"];
    // 趋势对比线条颜色
    const compareColor =["#3DA3D8","#3DA3D7","#D8787E","#D8786E"];
    if (arr.length) {
      arr.forEach((item) => {
        trendData.unit = item.unit;
        trendData.xData = item.chartX;
        const seriesData = [];
         // 全局替换逗号
        const reg = new RegExp(",","g");
        if (item.example) {
          item.chart.forEach((e,index) => {
            // 对带有逗号数据去除逗号
            const xData = e.data.map((items) => items.replace(reg,""));
            seriesData.push({
              name: e.name,
              type: 'line',
              smooth: false,
              itemStyle: {
                color: benchColor[index],
              },
              data: xData,
            });
          });
        } else {
          item.chart.forEach((e, index) => {
            const xData = e.data.map((items) => items.replace(reg,""));
            if (e.name.search('今年') > 0) {
              seriesData.push({
                name: e.name,
                type: 'line',
                itemStyle: {
                  color: compareColor[index],
                },
                data: xData,
              });
            } else {
              seriesData.push({
                name: e.name,
                type: 'line',
                symbol:"triangle",
                smooth: false,
                itemStyle: {
                  normal: {
                    color: compareColor[index],
                    lineStyle: {
                      width: 2,
                      type: 'dotted',
                      color: compareColor[index],
                    },
                  },
                },
                data: xData,
              });
            }
          });
        }
        trendData.seriesData = seriesData;
      });
    } else {
      trendData = {
        unit: '',
        xData: '',
        seriesData: [],
      };
    }
    return trendData;
  };

  // 用于数据表省份的默认排序
  sortDataSource = (a, b) => a.proSort - b.proSort;

  // 当前table数据
  onChange =(pagination, filters, sorter, extra) =>{
    const {currentDataSource} = extra;
    const newCurrentDataSource=Object.assign([],currentDataSource.map((item,index)=>{
      if(item.proSort==="-100"){return null}
        return item
    })
    );
    const { sortTableData } = this.props;
    sortTableData('2',newCurrentDataSource);
    this.setState({
      sortedInfo: sorter,
    });
  };

  // 生成table的column
  createColumn=(arr)=> {
    let {sortedInfo}=this.state;
    sortedInfo = sortedInfo || {};
    const columns = [];
    arr.forEach((item, index) => {
      const itemLength = item.name.length;
      for (let j = 0; j < itemLength; j+=1) {
        if (index === 0 && j === 0) {
          columns.push({
            title: item.name[j],
            dataIndex: `${index}table${j}`,
            key: `${index}table${j}`,
            align: 'center',
            sorter: (a, b) =>{
              const sortA = a.proSort;
              let compare = NaN;
              if(a.proSort !== "-10" && b.proSort !== "-10"){
                compare = sortA - b.proSort;
              }
              return compare
            } ,
            sortOrder: sortedInfo.columnKey ===  `${index}table${j}` && sortedInfo.order,
            fixed: 'left',
            width: 64,
            className: styles.tablePro,
          });
        } else if (index > 0 && j === 0) {
          columns.push({
            title: item.name[j],
            dataIndex: `${index}table${j}`,
            key: `${index}table${j}`,
            align: 'center',
            sorter: (a, b) => {
              const sortA = a[`${index  }value${  j}`];
              let compare = NaN;
              if(a.proSort !== "-10" && b.proSort !== "-10"){
                compare = sortA - b[`${index  }value${  j}`];
              }
              return compare
            },
            sortOrder: sortedInfo.columnKey ===  `${index}table${j}` && sortedInfo.order,
            render: (text, record) => record.noClick === undefined ?
              <span className={styles.tableClass} onClick={() => this.tableClick(record, index, j, item)}>{text}</span> :
              <span>{text}</span>,
          });
        } else if (index > 0 && j === itemLength-1) {
          columns.push({
            title: item.name[j],
            dataIndex: `${index}table${j}`,
            key: `${index}table${j}`,
            align: 'center',
            sorter: (a, b) => {
              const sortA = a[`${index  }value${  j}`];
              let compare = NaN;
              if(a.proSort !== "-10" && b.proSort !== "-10"){
                compare = sortA - b[`${index  }value${  j}`];
              }
              return compare
            },
            sortOrder: sortedInfo.columnKey ===  `${index}table${j}` && sortedInfo.order,
            className: styles.tablePro,
          });
        } else if (index > 0 && j%2 === 1) {

          columns.push({
            title: item.name[j],
            dataIndex: `${index}table${j}`,
            key: `${index}table${j}`,
            align: 'center',
            sorter: (a, b) => {
              const sortA = a[`${index  }value${  j}`];
              let compare = NaN;
              if(a.proSort !== "-10" && b.proSort !== "-10"){
                compare = sortA - b[`${index  }value${  j}`];
              }
              return compare
            },
            sortOrder: sortedInfo.columnKey ===  `${index}table${j}` && sortedInfo.order,
            render: (text, record) => record[`${index  }value${  j}`] > 0 ?
              <span className={styles.greenFont} onClick={() => this.tableTypeClick(record, index, j, item)}>{text}</span>:
              <span className={styles.redFont} onClick={() => this.tableTypeClick(record, index, j, item)}>{text}</span>
          });
        } else {
          columns.push({
            title: item.name[j],
            dataIndex: `${index}table${j}`,
            key: `${index}table${j}`,
            align: 'center',
            sorter: (a, b) => {
              const sortA = a[`${index  }value${  j}`];
              let compare = NaN;
              if(a.proSort !== "-10" && b.proSort !== "-10"){
                compare = sortA - b[`${index  }value${  j}`];
              }
              return compare
            },
            sortOrder: sortedInfo.columnKey ===  `${index}table${j}` && sortedInfo.order,
          });
        }
      }
    });
    return columns;
  };

  // 生成table data列
  createData(arr, arr1) {
    const {takeUp} = this.props;
    const dataSource = [];
    const dataUnit = {};
    arr.forEach((item, index) => {
      for (let j = 0; j < item.name.length; j+=1) {
        if (index > 0 && j === 0) {
          dataUnit[`${index}table${j}`] = item.unit;
        } else {
          dataUnit[`${index}table${j}`] = '';
        }
      }
      dataUnit.key = 'unit';
    });

   //  dataSource.push(dataUnit);
    let benchMarkingData={};
    arr1.forEach((lists) => {
      const data = {};
      const dataContrast = {};
      data[`${0}table${0}`] = lists.proName;
      data.key = lists.proId;
      data.proSort = lists.proSort;
      data.benchmarkProvId = lists.proId;
      // 判断查询的地域条件是否为地市id，若为地市id，写入地市标记
      if(lists.prov !== "-1"){
        data.markCity = lists.prov;
      }
      if(lists.benchMarkingName !== ""){
        dataContrast[`${0}table${0}`] = lists.benchMarkingName;
        dataContrast.key = 0 + lists.proId;
        dataContrast.proSort = lists.proSort;
        dataContrast.noClick = 'yes';
      }
      lists.values.forEach((e, index) => {
        for (let k = 0; k < e.items.length; k+=1) {
          if (k%2 === 1) {
            data[`${index + 1}table${k}`] = e.items[k] ? e.items[k] + e.itemUnit : '';
          } else {
            data[`${index + 1}table${k}`] = e.items[k];
          }
          data[`${index + 1  }indexId${  k}`] = e.indexId;
          if(e.items[k].indexOf(",")>0){
            const reg = new RegExp(",","g");
            data[`${index+1}value${k}`] = e.items[k].replace(reg,"");
            dataContrast[`${index+1}value${k}`] = e.items[k].replace(reg,"");
          }else {
            data[`${index+1}value${k}`] = e.items[k];
            dataContrast[`${index+1}value${k}`] = e.items[k];
          }
        }
        if(lists.benchMarkingName !== ""){
          for (let l = 0; l < 3; l+=1) {
            if(e.benchMarkingValues[l] === undefined){
              dataContrast[`${index + 1}table${l}`] = "";
            }else if (l === 1) {
              dataContrast[`${index + 1}table${l}`] = e.benchMarkingValues[l] ? e.benchMarkingValues[l] + e.itemUnit : '';
            } else {
              dataContrast[`${index + 1}table${l}`] = e.benchMarkingValues[l];
            }
          }
        }
      });
      if(lists.benchMarkingName === ""){
        // data.proSort="-100"
        benchMarkingData=Object.assign({},data)
      }else {
        dataSource.push(data);
      }
      if(!takeUp){
        // 相同地域的值比较无意义，所以不写入总table数据
        if(lists.benchMarkingName !== "") {
          dataSource.push(dataContrast);
        }
      }
    });
    const sortDataSource = dataSource.sort(this.sortDataSource);
    if(JSON.stringify(benchMarkingData)!=="{}"){
      sortDataSource.unshift(benchMarkingData);
    }
    sortDataSource.unshift(dataUnit);
    return sortDataSource;
  }

  // 保存成功后显示的modal，并且5s后自动隐藏
  showSucModal() {
    this.setState({
      successModal: true
    });
    setTimeout(this.successClose, 3000);
  }

  /*
* 鼠标移出隐藏
* */
  handleListHide() {
    this.setState({
      proShow: false,
      cityVisible: false,
      selectType: 0
    });
  }

  /*
* 处省显示下拉事件
* */
  handlePro() {
    this.setState({
      proShow: true,
    });
  }

  // 下载
  download(){
    const { takeUp, benchmarkName, selected, date,backDisplay,thData ,tbodyData,tableSort ,currentDataSource} = this.props;
    const title = "横向对标";
    const selectedArr = [];//  接收指标名称
    selected.forEach((item)=>{//  获取指标名称存入数组
      selectedArr.push(item.name);
    });
    const backDisplayArr=[];//  接收地域名称
    backDisplay.forEach((item)=>{//  获取地域名称存入数组
      backDisplayArr.push(item.selectName)
    });
    const condition = {
      name: "横向对标数据表",
      value: [
        ["专题名称:", title],
        ["筛选条件:"],
        ["指标:", ...selectedArr],
        ["地域:",...backDisplayArr],
        ["标杆:",benchmarkName],
        ["日期:", date],
      ],
    };

    const tableTitleDataArr=[];// 存储表格标题数据
    thData.forEach((item)=>{
      item.name.forEach((item2,index)=>{
        if(index===0){
          if(item.unit){
            tableTitleDataArr.push(`${item2}(${item.unit})`);
          }else{
            tableTitleDataArr.push(item2);
          }
        }
        else{
          tableTitleDataArr.push(item2);
        }
      })
    });

    const tableData = []; // 表格内部数据
    if(tableSort === '2'){
      currentDataSource.forEach((item, index) => {
        const rowData = [];
        if(index > 0) {
          rowData.push(item[`${0}table${0}`]);
          for(let i=1; i <= selected.length; i+=1){
            for(let j=0; j < thData[1].name.length; j+=1){
              rowData.push(item[`${i}table${j}`]);
            }
          }
        }
        tableData.push(rowData);
      })
    }else {
      // 用于数据表省份的默认排序
      const tbodyData2 = tbodyData.sort((a, b) => a.proSort - b.proSort);
      tbodyData2.forEach((item) => {
        const tableProvData = []; // 表格内部省市数据
        const tableCompareData = []; // 表格内部比较数据
        tableProvData.push(item.proName);

        if(item.benchMarkingName !== ""){
          tableCompareData.push(item.benchMarkingName);
        }
        item.values.forEach((item1) => {
          // 判断单位 加单位
          item1.items.forEach((item2, index) => {
            if(index%2 === 1 && item2){
              tableProvData.push(item2 + item1.itemUnit);
            }else{
              tableProvData.push(item2);
            }
          });
          if(item.benchMarkingName !== ""){
            // item : 所有3大列表格 item.items 指的是每一大列有几个小列
            for(let i=0; i< item1.items.length; i+=1) {
              if(i%2 === 1 && item1.benchMarkingValues[i]){
                tableCompareData.push(item1.benchMarkingValues[i] + item1.itemUnit);
              }else if(item1.benchMarkingValues[i] === undefined){
                // 空值用空字符串拼接进去
                const string = "";
                tableCompareData.push(string);
              }else {
                tableCompareData.push(item1.benchMarkingValues[i]);
              }
            }
          }
        });
        if(item.benchMarkingName !== ""){
          tableData.push(tableProvData);
        }else {
          tableData.unshift(tableProvData);
        }
        // // 区分是否收起标杆
        if(tableCompareData.length > 0 && !takeUp){
          tableData.push(tableCompareData);
        }
      })
    }
    const  table = {
      title: [[...tableTitleDataArr]],
      value: [...tableData]
    };
    const newJson = {
      fileName: `横向对标数据表`,
      condition,
      table
    };
    DownloadFile(newJson);
  }


  render() {
    const { date, tbodyData, thData, benchMarkContrastData, benchMarkData, pushToTemplate, takeUpCompare, tableBtn,
       areaData, permissions } = this.props;
    const { visible, benchMark, contrast, proShow, selectProvince, selectProList,contrastProvince, contrastProList, benchMarkPro, benchmarkProvId, saveTemplate,
      compositeNameSwitch, areaNameSwitch, savePro, areaName, compositeName, areaNameSingle, compositeNameSingle, inputTemplateName,
      selectType, cityVisible, cityList, successModal, trendName} = this.state;
    const proCityData = JSON.parse(JSON.stringify(areaData));
    let delIndex;
    // 当地域列表和弹窗标杆省市存在时，删除地域列表中的标杆省市
    if(proCityData[selectType] && benchmarkProvId){
      proCityData[selectType].forEach((item, index) => {
        if(item.areaId === benchmarkProvId) {
          delIndex = index;
        }
        if(item.cities && item.cities.length){
          item.cities.forEach((items, inde) => {
            if(items.areaId === benchmarkProvId){
              item.cities.splice(inde,1);
            }
          })
        }
      });
      if(delIndex !== undefined) {
        proCityData[selectType].splice(delIndex,1);
      }
    }
    const columns = this.createColumn(thData); // 根据thdata生成表头
    const dataSource = this.createData(thData, tbodyData); // 先根据thData生成第一行单位，在生成后边的数据
    const trendData = benchMark ? this.createTrendData(benchMarkData) : this.createTrendData(benchMarkContrastData); // 对传过来的折线图数据进行处理
    const proList = benchMark ? selectProList: contrastProList; // 弹出框选中的地市省份列表
    // 多选地域列表
    const loop = proCityData[selectType].map((item) => {
      const res = proList.find(data => data.selectProId === item.areaId);
      return (
        <div className={styles.provItem} key={`area${item.areaId}`}>
          <input
            type="checkbox"
            ref={`area${item.areaId}`}
            checked={!(res === undefined)}
            onChange={(event) => this.handleChangeProChecked(event, item)}
          />
          <span onClick={() => this.showCityModal(item)}>{item.areaName}</span>
        </div>
      );
    });
    // 权限切换标签
    const permissionsOuter = permissionsParam => permissionsParam.map((item, index) => (
      <CheckableTag
        key={item.perId}
        checked={selectType === index}
        onChange={(checked) => this.changePermissions(checked, index)}
      >
        {item.perName}
      </CheckableTag>
    ));
    // 全国用户时：展示地市列表
    const cityOuter = () => cityList.map(item => {
      const res = proList.find(data => data.selectAreaId === item.areaId);
      return (
        <span key={item.areaId}>
          <input
            type="checkbox"
            className={styles.cityCheckBox}
            checked={!(res === undefined)}
            onChange={(event) => this.handleChangeCityChecked(event, item)}
          />
          <span>{item.areaName}</span>
        </span>
      );
    });
    let chartWidth=1200;
    const wid=window.screen.width; // document.body.clientWidth 浏览器可见宽度
    if( wid > 700 && wid < 961 ){
      chartWidth=670;
    }
    else if(wid > 961 &&  wid<=1100){
      chartWidth=860;
    }
    const saveType1="1";
    const saveType2="2";
    // 对标省份显示的地名
    const provName = benchMark ? selectProvince.proName : contrastProvince.proName;
    return (
      <Fragment>
        <div className={styles.tableHeader}>
          <div className={styles.tableBtn}>
            {tableBtn ? (
              <span className={styles.buttons}>
                <div className={styles.modelBtn} onClick={pushToTemplate}><img alt="模板" className={styles.templateImg} src={templateImg} />模板</div>
                <div className={styles.saveBtn} onClick={this.withoutCheckSave}><img alt="保存" className={styles.saveImg} src={saveImg} />保存</div>
                <div className={styles.outerBtn} onClick={() =>this.saveTemplate(saveType2)}><img alt="另存" src={outImg} className={styles.outerImg} />另存</div>
              </span>
            ): (
              <span className={styles.buttons}>
                <div className={styles.modelBtn} onClick={pushToTemplate}><img alt="模板" className={styles.templateImg} src={templateImg} />模板</div>
                <div className={styles.saveBtn} onClick={()=> this.saveTemplate(saveType1)}><img alt="保存" className={styles.saveImg} src={saveImg} />保存</div>
              </span>
            )}
            <span className={styles.takeUp}>
              <input type="checkbox" className={styles.takeUpBox} onChange={(event) => takeUpCompare(event)} />
                收起标杆
            </span>
          </div>
          <div className={styles.tableTitle}><span className={styles.redBac} />数据表</div>
        </div>
        <div className={styles.tableData}>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={(record, index) => {
              let rowClass;
              if(index === 1){
                rowClass = styles.rowClass1;
              }else if (index > 1) {
                if (index % 2 === 0) {
                  rowClass = styles.rowDouble;
                } else {
                  rowClass = styles.rowSingle;
                }
              } else {
                rowClass = styles.rowHeader;
              }
              return rowClass;
            }}
            size="middle"
            scroll={{x:true}}
            onChange={this.onChange}
          />
        </div>
        <Modal
          visible={visible}
          title={null}
          footer={null}
          width={chartWidth}
          onCancel={this.modalClose}
        >
          <div className={styles.trendHeader}>
            {date} {benchMarkPro} {trendName} 趋势图
          </div>
          <div className={styles.tableTrend}>
            <div className={benchMark ? styles.selectBenchMark : styles.benchMark} onClick={this.benchMarkClick}>趋势对标
            </div>
            <div className={contrast ? styles.selectBenchMark : styles.benchMark} onClick={this.contrastClick}>趋势对比
            </div>
            <div className={styles.benchMarkBlank} />
          </div>
          <div className={styles.trendOption}>
            <span className={styles.benchMarkProv}>
              <span className={styles.benchTitle}>标杆省分：</span>
              <div className={styles.prov}>{benchMarkPro}</div>
            </span>
            <span className={styles.benchMarkProv}>
              <span className={styles.benchTitle}>对标省分：</span>
              <div
                className={styles.prov}
                onClick={() => {
                  this.handlePro();
                }}
                onMouseLeave={() => {
                  this.handleListHide();
                }}
              >
                <div
                  className={styles.areaName}
                >{ provName === '' ? '请选择' : provName }
                </div>
                <i className={styles.triangle} style={{ visibility: provName ? 'hidden' : '' }} />
                <span style={{ display: proShow ? '' : 'none' }}>
                  <div className={styles.modalLeft}>
                    <div className={styles.modalLeftTop}>
                      <div className={styles.permissionsOuter}>
                        {permissionsOuter(permissions)}
                      </div>
                    </div>
                    <div className={styles.modalLeftBottom}>
                      {loop}
                      <div className={styles.cityOuter} style={{ display: cityVisible ? '' : 'none' }}>
                        <div className={styles.closeCityModal}>
                          <Icon type="close" onClick={this.closeCityModal} />
                        </div>
                        <div className={styles.cityBox}>
                          {cityOuter(cityList)}
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </span>
            <span className={styles.clickBtn}><Button onClick={this.chartSearchBtn}>查询</Button></span>
          </div>
          <TrendChart trendData={trendData} />
        </Modal>
        <Modal
          visible={saveTemplate}
          title="模板保存"
          footer={[
            <Button key="back" className={styles.closeTemplate} onClick={this.saveTemplateClose}>取消</Button>,
            <Button key="submit" type="primary" className={styles.saveTemplate} onClick={this.saveTemplateData}>保存</Button>,
          ]}
          width={530}
          onCancel={this.saveTemplateClose}
        >
          <div className={styles.templateTitle}><span className={styles.title}>地域：</span>
            <span className={styles.templateValue}>{areaNameSwitch ? areaName : areaNameSingle}</span>
            <span className={styles.more} onClick={this.moreAreaData}>更多</span>
          </div>
          <div className={styles.templateTitle}><span className={styles.title}>指标：</span>
            <span className={styles.templateValue}>{compositeNameSwitch ? compositeName : compositeNameSingle}</span>
            <span className={styles.more} onClick={this.moreCompositeData}>更多</span>
          </div>
          <div className={styles.templateTitle}><span className={styles.title}>标杆：</span>
            <span className={styles.templateValue}>{savePro}</span>
          </div>
          <div className={styles.inputTitle}>模板名称：
            <input className={styles.inputTemplateName} value={inputTemplateName} onChange={this.inputTemplateNameChange} type="text" placeholder="例：201804 北京 本月主营收入" />
          </div>
        </Modal>
        <Modal
          visible={successModal}
          closable={false}
          title={null}
          footer={null}
          width={160}
          style={{top: 220}}
          onCancel={this.successClose}
        >
          <img alt="" src={succImg} className={styles.sucImg} />保存成功
        </Modal>
      </Fragment>
    );
  }
}

export default TableData;
