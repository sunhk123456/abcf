/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 重点产品攻坚月考核/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/2/25/025
 */
import React, { Fragment, PureComponent } from 'react';
import {DatePicker} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import PercentBar from "../../components/ThemeMonthCheck/percentBar"
import indicatorsDetails from '../../assets/image/ThemeMonthCheck/u161.png'
import ProRankTable from "../../components/ThemeMonthCheck/proRankTable"
import CityCompRanking from '../../components/ThemeMonthCheck/cityCompRanking'
import MarkSelect from '../../components/ThemeMonthCheck/markSelect'
import CityRankTable from '../../components/ThemeMonthCheck/cityRankTable'
import ProSelect from "../../components/Until/ProSelect"
import styles from './index.less'
import IndexExplain from '../../components/Common/indexExplainPop'
import CollectComponent from '../../components/myCollection/collectComponent';

@connect(({ThemeMonthCheckModels}) => ({ThemeMonthCheckModels}))
class ThemeAnalysis extends PureComponent {

  constructor(props){
    super(props);
    this.specialDetails=React.createRef();
    this.state= {
      showIndexExplain:false,
      title: "专题>重点产品攻坚月考核",
      tab: 1,// 1为考核预览页面，2为分项对标
      date: undefined,// 账期,
      dateChange:"",
      indexType: [],
      indexTypeIdAndName: {},// 记录选中的指标类型的 id name
      BarTitle: "",
      bardata: [
        {
          "prov": "全国"
          ,
          "items":
            [
              "14,580,000.00"
              ,
              "14,084,717.98"
              ,
              "96.60%"

            ]

        }
        ,
        {
          "prov": "北十省"
          ,
          "items":
            [
              "6,260,000.00"
              ,
              "5,971,520.56"
              ,
              "95.39%"

            ]

        }
        ,
        {
          "prov": "南二十一省"
          ,
          "items":
            [
              "8,320,000.00"
              ,
              "7,928,627.22"
              ,
              "95.30%"

            ]

        }
        ,
        {
          "prov": "北京"
          ,
          "items":
            [
              "800,000.00"
              ,
              "722,094.32"
              ,
              "90.26%"

            ]

        }
        ,
        {
          "prov": "天津"
          ,
          "items":
            [
              "320,000.00"
              ,
              "298,131.03"
              ,
              "93.17%"

            ]

        }
        ,
        {
          "prov": "河北"
          ,
          "items":
            [
              "690,000.00"
              ,
              "663,685.55"
              ,
              "96.19%"

            ]

        }
        ,
        {
          "prov": "山西"
          ,
          "items":
            [
              "400,000.00"
              ,
              "386,432.21"
              ,
              "96.61%"

            ]

        }
        ,
        {
          "prov": "内蒙古"
          ,
          "items":
            [
              "330,000.00"
              ,
              "298,310.17"
              ,
              "90.40%"

            ]

        }
        ,
        {
          "prov": "辽宁"
          ,
          "items":
            [
              "610,000.00"
              ,
              "573,005.87"
              ,
              "93.94%"

            ]

        }
        ,
        {
          "prov": "吉林"
          ,
          "items":
            [
              "370,000.00"
              ,
              "357,379.79"
              ,
              "96.59%"

            ]

        }
        ,
        {
          "prov": "黑龙江"
          ,
          "items":
            [
              "380,000.00"
              ,
              "335,305.00"
              ,
              "88.24%"

            ]

        }
        ,
        {
          "prov": "山东"
          ,
          "items":
            [
              "1,230,000.00"
              ,
              "1,253,408.70"
              ,
              "101.90%"

            ]

        }
        ,
        {
          "prov": "河南"
          ,
          "items":
            [
              "1,130,000.00"
              ,
              "1,083,767.93"
              ,
              "95.91%"

            ]

        }
        ,
        {
          "prov": "上海"
          ,
          "items":
            [
              "460,000.00"
              ,
              "446,505.95"
              ,
              "97.07%"

            ]

        }
        ,
        {
          "prov": "江苏"
          ,
          "items":
            [
              "660,000.00"
              ,
              "650,632.86"
              ,
              "98.58%"

            ]

        }
        ,
        {
          "prov": "浙江"
          ,
          "items":
            [
              "510,000.00"
              ,
              "492,553.70"
              ,
              "96.58%"

            ]

        }
        ,
        {
          "prov": "安徽"
          ,
          "items":
            [
              "380,000.00"
              ,
              "366,373.61"
              ,
              "96.41%"

            ]

        }
        ,
        {
          "prov": "福建"
          ,
          "items":
            [
              "430,000.00"
              ,
              "421,554.07"
              ,
              "98.04%"

            ]

        }
        ,
        {
          "prov": "江西"
          ,
          "items":
            [
              "180,000.00"
              ,
              "168,904.37"
              ,
              "93.84%"

            ]

        }
        ,
        {
          "prov": "湖北"
          ,
          "items":
            [
              "610,000.00"
              ,
              "588,990.89"
              ,
              "96.56%"

            ]

        }
        ,
        {
          "prov": "湖南"
          ,
          "items":
            [
              "680,000.00"
              ,
              "655,195.63"
              ,
              "96.35%"

            ]

        }
        ,
        {
          "prov": "广东"
          ,
          "items":
            [
              "1,660,000.00"
              ,
              "1,521,859.70"
              ,
              "91.68%"

            ]

        }
        ,
        {
          "prov": "广西"
          ,
          "items":
            [
              "330,000.00"
              ,
              "295,260.21"
              ,
              "89.47%"

            ]

        }
        ,
        {
          "prov": "海南"
          ,
          "items":
            [
              "110,000.00"
              ,
              "107,471.98"
              ,
              "97.70%"

            ]

        }
        ,
        {
          "prov": "重庆"
          ,
          "items":
            [
              "310,000.00"
              ,
              "298,023.09"
              ,
              "96.14%"

            ]

        }
        ,
        {
          "prov": "四川"
          ,
          "items":
            [
              "480,000.00"
              ,
              "458,624.28"
              ,
              "95.55%"

            ]

        }
        ,
        {
          "prov": "贵州"
          ,
          "items":
            [
              "280,000.00"
              ,
              "272,119.88"
              ,
              "97.19%"

            ]

        }
        ,
        {
          "prov": "云南"
          ,
          "items":
            [
              "160,000.00"
              ,
              "156,542.08"
              ,
              "97.84%"

            ]

        }
        ,
        {
          "prov": "西藏"
          ,
          "items":
            [
              "20,000.00"
              ,
              "19,832.67"
              ,
              "99.16%"

            ]

        }
        ,
        {
          "prov": "陕西"
          ,
          "items":
            [
              "380,000.00"
              ,
              "369,223.24"
              ,
              "97.16%"

            ]

        }
        ,
        {
          "prov": "甘肃"
          ,
          "items":
            [
              "170,000.00"
              ,
              "138,664.22"
              ,
              "81.57%"

            ]

        }
        ,
        {
          "prov": "青海"
          ,
          "items":
            [
              "100,000.00"
              ,
              "86,385.06"
              ,
              "86.39%"

            ]

        }
        ,
        {
          "prov": "宁夏"
          ,
          "items":
            [
              "60,000.00"
              ,
              "66,784.29"
              ,
              "111.31%"

            ]

        }
        ,
        {
          "prov": "新疆"
          ,
          "items":
            [
              "350,000.00"
              ,
              "347,125.44"
              ,
              "99.18%"

            ]

        }

      ],
      proSelect: "",
    }
  }

  componentDidMount(){
    const {dispatch} = this.props;
    const params={markType: "03201"};
    const targetDetail={"month":"","markType":"03201","indexId":""};
    const provTotalRanking={"month":"","markType":"03201"};
    dispatch({
      type: 'ThemeMonthCheckModels/fetchMarkData',
      payload: params
    });
    dispatch({
      type: 'ThemeMonthCheckModels/fetchCurrentDate',
      payload: params
    });
    dispatch({
      type: 'ThemeMonthCheckModels/fetchTargetDetail',
      payload: targetDetail
    });
    dispatch({
      type: 'ThemeMonthCheckModels/fetchProvTotalRanking',
      payload: provTotalRanking
    });
  }

  componentWillReceiveProps(nextProps){
    const {date} = this.state;
    if (nextProps.ThemeMonthCheckModels.currentDate && date !== nextProps.ThemeMonthCheckModels.currentDate) {
      if (nextProps.ThemeMonthCheckModels.currentDate.data !== undefined) {
        this.setState({
          date: nextProps.ThemeMonthCheckModels.currentDate.data.month,
        });
      }
    }
  }

// 指标解释按钮被点击
indexExplain=()=>{
  // console.log("指标解释按钮被点击")
  this.setState({
    showIndexExplain:true
  })
};

// 指标解释回调，关闭弹窗
callbackIndexExplain=()=>{
  // console.log("指标解释回调")
  this.setState({
    showIndexExplain:false,
  })
};

  tabChange=(num)=>{
    const {tab}=this.state
    if(num!==tab){
      this.setState({
        tab:num
      })
    }
  };

  // 观察指标回调
  callBackIndexScreen=(data)=>{
    const{indexTypeIdAndName}=this.state
    if(indexTypeIdAndName.indexName!==data.indexName){
      this.setState({
        indexTypeIdAndName: {
          indexName: data.indexName,
          indexId:data.indexId,
        },// 记录选中的指标类型的 id name
        BarTitle:data
      })
      const {dispatch} = this.props;
      const targetDetail={"month":"","markType":"03201","indexId":data.indexId}
      dispatch({
        type: 'ThemeMonthCheckModels/fetchTargetDetail',
        payload: targetDetail
      });
    }
  }

// 日期改变
  onChangeDate=(date, dateString)=>{
    const{indexTypeIdAndName}=this.state
    this.setState({
      dateChange:dateString
    })
    const {dispatch} = this.props;
    const targetDetail={"month":dateString,"markType":"03201","indexId":indexTypeIdAndName.indexId}
    const provTotalRanking={"month":dateString,"markType":"03201"}
    dispatch({
      type: 'ThemeMonthCheckModels/fetchTargetDetail',
      payload: targetDetail
    });
    dispatch({
      type: 'ThemeMonthCheckModels/fetchProvTotalRanking',
      payload: provTotalRanking
    });
  }

// 设置最大账期
  disabledEndDate=(current)=>{
    const {ThemeMonthCheckModels}=this.props;
    const {currentDate}=ThemeMonthCheckModels;
    return current && current > moment(currentDate.data.month).valueOf();
  };

  ProSelect = (data) => {
    this.setState({
      proSelect: data
    })
  };

  showDetails(){
    this.specialDetails.current.style.display='inline'
  }

  nshowDetails(){
    this.specialDetails.current.style.display='none'
  }



  render(){
    const {showIndexExplain}=this.state
    const {ThemeMonthCheckModels}=this.props;
    const {markData,targetDetail,provTotalRanking}=ThemeMonthCheckModels
    const {title,tab,date,indexType,indexTypeIdAndName,BarTitle,bardata,proSelect,}=this.state
    const {dateChange}=this.state
    if(!dateChange){
      // console.log('进来了')
      // dateChange=date
      this.setState({
        dateChange:date
      })
    }
    // console.log("dateChange")
    // console.log(dateChange)
    // console.log("date")
    // console.log(date)
    if(proSelect===""){
      this.setState({
        proSelect:{
          proId: "111",
          proName: "全国"
        }
      })
    }
    if (markData.data !== undefined) {
      if (indexType.length === 0) {
        this.setState({
          indexType: markData.data,
          indexTypeIdAndName: markData.data[0],
          BarTitle: markData.data[0]
        })
      }
    }
    if(targetDetail.data!==undefined){
     this.setState({
       bardata:targetDetail.data
     })
    }
    const {MonthPicker} = DatePicker;
    const defaultValueDate = moment(date);
    let tabBody;
    if(tab===1){
      tabBody=
        <div className={styles.tabBody}>
          <div className={styles.item}>
            <ProSelect callback={this.ProSelect} />
          </div>
          <div className={styles.item1}>
            <div className={styles.option}>日期</div>
            <div className={styles.selected}>
              {date?<MonthPicker
                disabledDate={this.disabledEndDate}
                defaultValue={defaultValueDate}
                locale={moment.locale('zh-cn')}
                allowClear={false}
                onChange={this.onChangeDate}
                placeholder="Select month"
                monthCellContentRender={(current) =>
                  (
                    <div title={`${current.month() + 1}月`}>
                      {`${current.month() + 1}月`}
                    </div>
                  )
                }
              /> :null}
            </div>
          </div>
          <div className={styles.clear} />
          <CityCompRanking
            className={styles.CityCompRanking}
            disabledDate={this.disabledEndDate}
            provTotalRankingData={provTotalRanking}
            selectPro={proSelect}
          />
          <CityRankTable
            date={dateChange}
          />
        </div>
    }
    else{
      tabBody=
        <div className={styles.tabBody}>
          <div className={styles.item0}>
            <div className={styles.option}>日期</div>
            <MonthPicker
              disabledDate={this.disabledEndDate}
              defaultValue={defaultValueDate}
              locale={moment.locale('zh-cn')}
              allowClear={false}
              onChange={this.onChangeDate}
              placeholder="Select month"
              monthCellContentRender={(current) =>
                  (
                    <div title={`${current.month() + 1}月`}>
                      {`${current.month() + 1}月`}
                    </div>
                  )
                }
            />
          </div>
          <div className={styles.item1}>
            <div className={styles.option}>指标</div>
            <MarkSelect
              indexType={indexType}
              indexTypeIdAndName={indexTypeIdAndName}
              callBackIndexScreen={this.callBackIndexScreen}
            />
          </div>
          <div className={styles.clear} />
          <PercentBar BarData={bardata} title={BarTitle.indexName} />
          <div className={styles.clear} />
          <ProRankTable ProRankTableData={targetDetail} BarTitle={BarTitle} />
        </div>
    }
    const collectStyle ={
      marginLeft:'1%'
    };
    const markType = "03201";
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div className={styles.page}>
            <span className={styles.header}>
              <span className={styles.title}>{title}</span>
              <span><img className={styles.analysisImgs} src={indicatorsDetails} alt="" onClick={this.indexExplain} onMouseOver={this.showDetails.bind(this)} onFocus={() => 0} onMouseLeave={this.nshowDetails.bind(this)} /></span>
              <span ref={this.specialDetails} className={styles.titleDetail} style={{display:'none'}}>点击查看该专题内指标解释</span>
              <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
              <IndexExplain show={showIndexExplain} callback={this.callbackIndexExplain} markId="03201" />
            </span>
            <div className={styles.tabClassName}>
              <table className={styles.tableClassName}>
                <tbody>
                  <tr>
                    <td><div className={tab===1?styles.bottomLine:null} onClick={()=>this.tabChange(1)}>考核总览</div></td>
                    <td><div className={tab===2?styles.bottomLine:null} onClick={()=>this.tabChange(2)}>分项对标</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {tabBody}
          </div>
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default ThemeAnalysis;
