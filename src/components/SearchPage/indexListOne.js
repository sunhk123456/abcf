/**
 * @Description: 指标轮播图列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/12
 */
import React, { PureComponent } from 'react';
// import router from 'umi/router';
import { Row, Col, Tag, Carousel, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import Cookie from '@/utils/cookie';
import styles from './indexListOne.less';
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
import indexMark from "@/assets/image/search/indexMark.png"
import { routerState } from '@/utils/tool';


const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

@connect(({ dayTrendEchartModels, loading }) => ({
  dayTrendEchartModels,
  loading: loading.models.dayTrendEchartModels,
}))
class IndexListOne extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {

    };

    this.carouselRef = React.createRef();
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
  jumpHandle = (data) =>{
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
        layoutFlag: 1,
        dateType: dayOrMonth === "日报" ? "1" : "2"
      })
      // router.push({
      //   pathname:url,
      //   state:{
      //     dimension,
      //     id,
      //     title,
      //     screenConditionTags,
      //     layoutFlag: 1,
      //     dateType: dayOrMonth === "日报" ? "1" : "2"
      //   }
      // })
    }

  }

  handlePrev() {
    this.carouselRef.current.prev();
  }

  handleNext() {
    this.carouselRef.current.next();
  }

  render() {
    const { data } = this.props;
    const {showEarlyWarning, warningLevel, desc} = data;
    if(!data.dataName){return null;}
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
        <Col md={6} key={item} className={styles.colList}>
          <div className={styles.name}>{item}{index === 0 || index === dayOrMonthSign ? <span className={styles.unit}>({data.unit})</span>  : ""}</div>
          {totalValue}
          {/* <div className={styles.value} title={data.dataValue[index]}>{data.dataValue[index]}</div> */}
        </Col>
      )
    });
    
    const bigEchart = data.chartData && data.chartData.map((item) => {
      let echartDom = "";
      const { chartType, chart, unit } = item;
      // const { dayTrendEchartModels } = this.props;
      // const { selectTime,  dayTrendEchartData } = dayTrendEchartModels;
      if (chartType === "line") {
        const { id, date, dayOrMonth } = data
        const dataEchart = {
          data:[{
            chart: chart[0].data,
            unit
          }],
          chartX: chart[0].chartX
        }
        const lineParams = {
          markType:id,
          dateType: dayOrMonth === "日报" ? "1" : "2" ,
          date,
          provId: "",
          cityId: "",
          selectType: [],
          hot: "",
          unitId: "",
        };
        // const dayTrendEchartData2 =  Object.assign(dayTrendEchartData,{id, markType, date})
        echartDom = <DayTrendEchart data={dataEchart} pattern="big" lineParams={lineParams} />;
      } else if (chartType === "monthBar") {
        const dataEchart = {
          data:[{
            unit,
            chart
          }]
        }
        echartDom = <MonthTotal data={dataEchart} pattern="big" />;
      } else if (chartType === "cityBar") {
        const dataEchart = {
          isMinus: data.isMinus, // xingxiaodong 19.5.7改动
          isPercentage: data.isPercentage,
          data:[
            {
              chartType,
              unit,
              chart
            }
          ]
        }
        echartDom = <RegionSituation data={dataEchart} pattern="big" searchPage="1" />;
      } else if (chartType === "cityRank") {
        const dataEchart = {
          data:[{chartType, chart, unit}]
        }
        echartDom = <CityRank pattern="big" data={dataEchart} />;
      } else if (chartType === "channel") {
        const dataEchart = {
          isMinus: data.isMinus, // xingxiaodong 19.5.7改动
          isPercentage: data.isPercentage,
          data:[
            {
              chartType,
              unit,
              chart
            }
          ]
        }
        echartDom = <NightingalePie data={dataEchart} pattern="big" />;
      } else if (chartType === "product") {
        const dataEchart = {
          isMinus: data.isMinus, // xingxiaodong 19.5.7改动
          isPercentage: data.isPercentage,
          data:[
            {
              chartType,
              unit,
              chart
            }
          ]
        }
        echartDom = <ProductStructure data={dataEchart} pattern="big" />;
      } else if (chartType === "businessPie") {
        const dataEchart = {
          isMinus: data.isMinus, // xingxiaodong 19.5.7改动
          isPercentage: data.isPercentage,
          data:[
            {
              chartType,
              unit,
              chart
            }
          ]
        }
        echartDom = <BusinessStructure data={dataEchart} pattern="big" />;
      } else if (chartType === "yearBar") {
        const dataEchart = {
          data:[{
            unit,
            chart
          }]
        }
        echartDom = <YearTotal data={dataEchart} pattern="big" />;
      }
      return (
        <div key={chartType} className={styles.bannerList}>
          {echartDom}
        </div>
      );
    });

    return (
      <div className={styles.indexListOne}>
        <div className={styles.titleContent}>
          {data.showException === "0"
            ?
            null
            :
            <Tooltip placement="bottomLeft" title={data.excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}>
              <Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} />
            </Tooltip>
          }
          <img className={styles.indexMark} src={indexMark} alt="" />
          <span className={styles.title} onClick={() => this.jumpHandle(data)}>{data.title}</span>
          <Tag color="#7184A8">{data.markName}</Tag>
          <Tag color="#999999">{data.dayOrMonth.slice(0,-1)}</Tag>
        </div>
        <div className={styles.date}>{data.area} · {data.date}</div>
        <Row>
          {colDom}
        </Row>
        {/* 轮播走马灯 */}
        <div className={styles.bannerContent}>
          <div className={styles.banner}>
            <div className={styles.bannerBtn}>
              <span onClick={()=>{this.handlePrev()}}><IconFont type="icon-shangyiye" /></span>
              <span onClick={()=>{this.handleNext()}}><IconFont type="icon-xiayiye" /></span>
            </div>
            <Carousel vertical ref={this.carouselRef}>
              {bigEchart}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexListOne;
