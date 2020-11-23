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

import React from 'react';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller'
import { List } from 'antd';
import Report from '@/components/SearchPage/report'; // 报告组件
import CollectComponent from '../../components/myCollection/collectComponent'
import styles from './reportPreview.less';

@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
}))

class reporPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

  componentDidMount() {
    this.handleInfiniteOnLoad(1,false);
  }

  handleInfiniteOnLoad= (page=1,sign=true) =>{
    const { dispatch } = this.props;
    const params = {
      num: "10",
      numStart: 1+(page-1)*10,
      search: "",
      searchType: "3",
    }
    dispatch({
      type: 'report/fetchReportPreview',
      payload: params,
      sign, // 是否为滚动
    });
  };

    render() {
      const {loading, report} = this.props;
      const { reportPreviewData, rpHasMore } = report;
      const { data } = reportPreviewData;
      const collectStyle={
        width: '30px',
        height: '30px'
      };

        return (
          <div className={styles.reporPreviewContent}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={1}
              threshold={50}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!loading && rpHasMore}
              // useWindow={false}
            >
              <List
                size="large"
                rowKey="id"
                loading={loading}
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <div className={styles.itemContent}><Report data={item} index={index} />
                      <CollectComponent
                        key={item.id}
                        markType={item.id}
                        searchType={item.type}
                        imgStyle={collectStyle}
                        isCollect={item.isCollect}
                        collectId={item.collectId}
                      />
                    </div>
                  </List.Item>
                )}
              />
              <div className={styles.wholeTip}>{!rpHasMore && !loading ? "已加载全部" : "加载更多"}</div>
            </InfiniteScroll>
          </div>
        )
    }
}

export default reporPreview
