/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  zhai_
 * @date 2019/1/17 0017
 */

import React,{ PureComponent }  from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Tabs } from 'antd';
import styles from './index.less';
import ReportPreview from './reportPreview';
import MyReport from './myReport';
import PptEdit from './pptEdit';
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import emptyPage from '@/assets/image/empty.png'
import RecentVisit from '@/components/SearchPage/RecentVisit/recentVisitComponent'; // 推荐近期访问
import Recommended from '@/components/SearchPage/RecentVisit/recommended'; // 近期访问

const {TabPane} = Tabs;

@connect(({ report, loading }) => ({
  report,
  reportModuleData:report.reportModuleData,
  loading: loading.models.report,
}))

class index extends PureComponent {

  // static defaultProps={
  //   reportModuleData:[
  //     {
  //       id:"1",
  //       name:"报告共享"
  //     },
  //     {
  //       id:"2",
  //       name:"我的报告"
  //     },
  //     {
  //       id:"3",
  //       name:"报告生成"
  //     }
  //   ]
  // };

  constructor(props) {
      super(props);
      this.state = {}
  }

  componentDidMount() {
      this.getReportModuleData()
  }

  /**
   * @date: 2019/4/9
   * @author xingxiaodong
   * @Description: 页签数据
   * @method 展示页签面包屑
   * @param {} 参数
   */
  getReportModuleData=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getReportModuleData',
      payload: {},
    });
  };

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 页签切换方法
   * @method handleChangeTabs
   * @param {key} 页签标志
   */
  handleChangeTabs = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/setTabKey',
      payload: key,
    });
    if(key === "my_report"){
      const params = {
        num: 10,
        numStart: 1,
      };
      dispatch({
        type: 'myReportModel/fetchMyReport',
        payload: params,
      });
    }else if(key === "report_view") {
      const params = {
        num: "10",
        numStart: 1,
        search: "",
        searchType: "3",
      };
      dispatch({
        type: 'report/fetchReportPreview',
        payload: params,
      });
    }
  };



  render() {
    const { report, reportModuleData} = this.props;
    const { tabKey } = report;
    let leftColMd = 16; let rightColMa = 8;
    if (tabKey === "report_view"){
      leftColMd = 16;
      rightColMa = 8
    }else {
      leftColMd = 24;
      rightColMa = 0
    }
    const reportModuleDom = reportModuleData.map((item)=>{
      const {id, name} = item;
      let itemDom = null;
      switch (id) {
        case "report_view":
          itemDom = <ReportPreview />;
          break;
        case "my_report":
          itemDom = <MyReport />;
          break;
        case "report_product":
          itemDom = <PptEdit />;
          break;
        default:
          itemDom = null;
      }

      return (
        <TabPane
          tab={name}
          key={id}
        >
          {itemDom}
        </TabPane>
      )
    });


    return (
      <PageHeaderWrapper>
        <div className={styles.reportTabs}>
          {
            reportModuleData.length > 0 ? (
              <Card bordered={false} bodyStyle={{ padding:'6px 12px 12px 0'}}>
                <Row>
                  <Col md={leftColMd} className={styles.list}>
                    <Tabs
                      activeKey={tabKey}
                      onChange={this.handleChangeTabs}
                      animated={false}
                      tabBarGutter={1}
                    >
                      {reportModuleDom}
                    </Tabs>
                  </Col>
                  <Col md={rightColMa} className={styles.rightContent}>
                    <RecentVisit />
                    <Recommended />
                  </Col>
                </Row>
              </Card>
            ) : (
              <div className={styles.emptyDiv}>
                <img src={emptyPage} alt='emptyPage' />
                <div>该用户暂无权限</div>
              </div>
            )
          }
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default index;
