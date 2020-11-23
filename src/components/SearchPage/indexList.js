/**
 * @Description: 指标列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/12
 */
import React, { PureComponent } from 'react';
// import router from 'umi/router';
import { routerState } from '@/utils/tool';
import { Row, Col, Tag, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import Cookie from '@/utils/cookie';

import styles from './indexList.less';
import DayTrendEchart from "@/components/Echart/dayTrendEchart"; // 当日趋势图
import MonthTotal from "@/components/Echart/monthTotal"; // 月累计趋势图
import YearTotal from "@/components/Echart/yearTotal"; // 年累计趋势图
import RegionSituation from "@/components/Echart/regionSituation"; // 分地域情况图
import BusinessStructure from "@/components/Echart/businessStructure"; // 业务结构图
import ProductStructure from "@/components/Echart/productStructure"; // 产品结构图
import NightingalePie from "@/components/Echart/nightingalePie"; // 渠道运营
import CityRank from "@/components/Echart/cityRank"; // 地市排名
import EarlyWarning from '@/components/DayOverView/earlyWarning'; // 预警组件
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

@connect(({ searchModels, loading }) => ({
  searchModels,
  loading: loading.models.searchModels,
}))
@connect(({ searchPageModels, loading }) => ({
  searchPageModels,
  loading: loading.models.searchPageModels,
}))
class IndexList extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {

    };

  }

  componentDidMount() {

  }

  /**
   * @date: 2019/1/21
   * @author liuxiuqian
   * @Description: 跳转指标页面
   * @method jumpHandle
   * @param data 跳转包含的数据
   */
  jumpHandle = (data,chartType) =>{
    const {dispatch, screenConditionTags, id, dimension, url, title, dayOrMonth} = data;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre=/^http.+\?.+/;
    if(re.test(url)){
      // 日志记录
      dispatch({
        type: 'logModels/indexDetailsFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "0"
        },
      });
      if(pre.test(url)){
        window.open(`${url}&ticket=${token}&source=cloud&token=${token}`)
      }else {
        window.open(`${url}?ticket=${token}&source=cloud&token=${token}`)
      }
    }else {
      routerState(url,{
        dimension,
          id,
          title,
          screenConditionTags,
          dateType: dayOrMonth === "日报" ? "1" : "2",
          layoutFlag: 1,
          chartType,
      })
      // router.push({
      //   pathname:url,
      //   state:{
      //     dimension,
      //     id,
      //     title,
      //     screenConditionTags,
      //     dateType: dayOrMonth === "日报" ? "1" : "2",
      //     layoutFlag: 1,
      //     chartType,
      //   }
      // })
    }
  }

  /**
   * @date: 2019/1/21
   * @author liuxiuqian
   * @Description: 跳转指标页面  带定位功能
   * @method jumpSmallHandle
   * @param data 跳转包含的数据
   */
  jumpSmallHandle = (data,chartType) => {
    const {dispatch, screenConditionTags, id, dimension, url, title, dayOrMonth} = data;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre=/^http.+\?.+/;
    if(re.test(url)){
      // 日志记录
      dispatch({
        type: 'logModels/indexDetailsFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "0"
        },
      });
      if(pre.test(url)){
        window.open(`${url}&ticket=${token}&source=cloud&token=${token}`)
      }else {
        window.open(`${url}?ticket=${token}&source=cloud&token=${token}`)
      }
    }else {
      // router.push({
      //   pathname:url,
      //   state:{
      //     dimension,
      //     id,
      //     title,
      //     screenConditionTags,
      //     dateType: dayOrMonth === "日报" ? "1" : "2",
      //     layoutFlag: 2,
      //     chartType,
      //   }
      // })
      routerState(url,{
        dimension,
        id,
        title,
        screenConditionTags,
        dateType: dayOrMonth === "日报" ? "1" : "2",
        layoutFlag: 2,
        chartType,
      })
    }
  }

  /**
   * @date: 2019/1/29
   * @author liuxiuqian
   * @Description: 处理更多事件
   * @method moreHandle
   */
  moreHandle(){
    const { dispatch, searchModels } = this.props;
    const { selectName, maxDate } = searchModels;
    // 清理数据
    dispatch({
      type: 'searchPageModels/getCleanData',
    });
    dispatch({
      type: 'searchModels/setSelectType',
      payload: {
        id: "1",
        name: "指标"
      },
    });
    const params = {
      area: "",
      date: maxDate,
      dayOrmonth: "-1",
      num: "10",
      numStart: 1,
      search: selectName,
      searchType: "1",
    }
    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
      sign: true, // 是否为点击查询
    });
  }

  render() {
    const { data, moreBtnShow } = this.props;
    const {showEarlyWarning, warningLevel, desc} = data;
    if(!data.dataName) return null;
    const colDom = data.dataName.map((item, index) =>{
      const warning = showEarlyWarning === "0" || showEarlyWarning === undefined || index !== 0 ?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
      const totalValue = showEarlyWarning === "0" || showEarlyWarning === undefined || index !== 0?
        <div className={styles.value} title={data.dataValue[index]}>{data.dataValue[index]}</div>:
        <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
          <span className={styles.value} title={data.dataValue[index]}>{data.dataValue[index]}</span>
          <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
        </Tooltip>
      const dayOrMonthSign = data.dayOrMonth === "月报" ? 2 : 1;
      return (
        <Col md={6} key={`${item+index}`} className={styles.colList}>
          <div className={styles.name}>{item}{index === 0 || index === dayOrMonthSign ? <span className={styles.unit}>({data.unit})</span> : ""}</div>
          {totalValue}
          {/* <div className={styles.value} title={data.dataValue[index]}>{data.dataValue[index]}</div> */}
        </Col>
      )
    });


    let echartDom = "";
    const { chartType, unit, chart } = data;
    if (chartType === "line") {
      const dataEchart = {
        data:[{
          chart: chart[0].data,
          unit
        }],
        chartX: chart[0].chartX,
      }
      echartDom = <DayTrendEchart data={dataEchart} pattern="small" />;
    } else if (chartType === "monthBar") {
      const dataEchart = {
        data:[{
          unit,
          chart
        }]
      }
      echartDom = <MonthTotal data={dataEchart} pattern="small" />;
    } else if (chartType === "cityBar") {
      const dataEchart = {
        isMinus: data.isMinus,
        isPercentage: data.isPercentage,
        data:[
          {
            chartType,
            unit,
            chart
          }
        ]
      }
      echartDom = <RegionSituation data={dataEchart} pattern="small" searchPage="1" />;
    } else if (chartType === "cityRank") {
      const dataEchart = {
        data:[{chartType, chart, unit}]
      }
      echartDom = <CityRank pattern="small" data={dataEchart} />;
    } else if (chartType === "channel") {
      const dataEchart = {
        isMinus: data.isMinus,
        isPercentage: data.isPercentage,
        data:[
          {
            chartType,
            unit,
            chart
          }
        ]
      }
      echartDom = <NightingalePie data={dataEchart} pattern="small" />;
    } else if (chartType === "product") {
      const dataEchart = {
        isMinus: data.isMinus,
        isPercentage: data.isPercentage,
        data:[
          {
            chartType,
            unit,
            chart
          }
        ]
      }
      echartDom = <ProductStructure data={dataEchart} pattern="small" />;
    } else if (chartType === "businessPie") {
      const dataEchart = {
        isMinus: data.isMinus,
        isPercentage: data.isPercentage,
        data:[
          {
            chartType,
            unit,
            chart
          }
        ]
      }
      echartDom = <BusinessStructure data={dataEchart} pattern="small" />;
    } else if (chartType === "yearBar") {
      const dataEchart = {
        data:[{
          unit,
          chart
        }]
      }
      echartDom = <YearTotal data={dataEchart} pattern="small" />;
    }
    return (
      <div className={styles.indexList}>
        <Row className={styles.Row}>
          <Col md={6} className={styles.leftContent}>
            <div className={styles.echartPic} onClick={()=>this.jumpSmallHandle(data,chartType)}>
              {echartDom}
            </div>
          </Col>
          <Col md={18}>
            <div className={styles.titleContent}>
              {data.showException === "0"
                ?
                null
                :
                <Tooltip placement="bottomLeft" title={data.excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}>
                  <Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} />
                </Tooltip>
              }
              <span className={styles.title} onClick={() => this.jumpHandle(data,chartType)}>{data.title}</span>
              <Tag color="#7184A8">{data.markName}</Tag>
              <Tag color="#999999">{data.dayOrMonth.slice(0,-1)}</Tag>
            </div>
            <div className={styles.date}>{data.area} · {data.date}</div>
            <Row>
              {colDom}
            </Row>
          </Col>
          {moreBtnShow ? <div onClick={()=>{this.moreHandle()}} className={styles.moreBtn}>更多&gt;&gt;</div> : null }
        </Row>
      </div>
    );
  }
}

export default IndexList;
