/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 指标体系页面/p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author guoshengxiang
 * @date 2019/06/07
 */

import React,{PureComponent} from "react";
import { Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import "./index.less";
import IndexSystemInfo from "./IndexSystem";
import IndexTransparent from "./indexTransparent";
import SystemInfo from './indexSystemInfo';

const { TabPane } = Tabs;

class IndexSystem extends PureComponent{
  constructor(props){
    super(props);
    this.state={}
  }

  render(){
    return(
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" size={window.screen.width>1869?"large":window.screen.width>1100?"default":"small"}>
          <TabPane tab="指标版本信息" key="1">
            {/*<IndexSystemInfo />*/}
            <SystemInfo />
          </TabPane>
          <TabPane tab="指标透明展示" key="2">
            <IndexTransparent />
          </TabPane>
        </Tabs>
      </PageHeaderWrapper>
    )
  }
}
export default IndexSystem
