/**
 * @Description: 我的收藏总部应用、省份应用组件
 *
 * @author: xingxiaodong
 *
 * @date: 2020/3/6
 */

import React, { PureComponent } from 'react';
import {connect} from "dva";
// import isEqual from 'lodash/isEqual';
import { Row, Col, List, Checkbox, Modal, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import IndexList from '@/components/SearchPage/indexList'; // 指标组件
import Report from '@/components/SearchPage/report'; // 报告组件
import ReportForms from '@/components/SearchPage/reportForms'; // 报表组件
import SpecialProject from '@/components/SearchPage/specialProject'; // 报表组件
import RecentVisit from '@/components/myCollection/visitRecent'; // 推荐近期访问
import RecentUpdate from '@/components/myCollection/recentUpdate'
import DisplayItem from './displayItem';
import NewCollection from '@/components/myCollection/newCollection'; // 新增收藏

import styles from "./apply.less"



@connect(({ myCollectionModels,searchPageModels,loading,recentVisitComponentModels}) => ({
  recentVisitComponentModels,
  myCollectionModels,
  searchPageModels,
  loading: loading.models.myCollectionModels,
  hasMore:myCollectionModels.hasMore, // 加载更多标识
  searchData:myCollectionModels.searchData, // 收藏列表数据
  specialName:myCollectionModels.specialName, // 专题名称
  selectIndex:myCollectionModels.selectIndex, // 一级菜单index
  moduleId:myCollectionModels.moduleId, // 一级菜单id
  titleData:myCollectionModels.titleData, // 页签数据
  tabIndex:myCollectionModels.tabIndex, // 二级菜单index
  tabId:myCollectionModels.tabId, // 二级菜单Id 指标，报告，专题，报表，其他
  currentPage:myCollectionModels.currentPage,
  deleteAllVisible:myCollectionModels.deleteAllVisible


}))

class MyCollectionApply extends PureComponent {
  static defaultProps = {
    // 加需要假接的数
    contentData : [
      {
        id:"01",
        list:[
          {
            "id": "021",
            "name": "总体业务111",
            "jumpType": "self",
            "url": "",
            "dateType": "1",
            "searchType": "index"
          },
          {
            "id": "022",
            "name": "总体",
            "jumpType": "self",
            "url": "",
            "dateType": "1",
            "searchType": "index"
          }
        ]
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = {
      collectIdArray:[] // 删除全部 收藏Id列表
    };
  }

  componentDidMount() {
    this.setTable(0,{tabId:''})

  }


  //  点击页签函数。
  setTable=(index,item)=>{
    this.clearCollectId(); // 清除删除数组数据
    const {dispatch}=this.props;
    dispatch({
      type: `myCollectionModels/getTabId`,
      payload: {
        tabIndex:index,
        tabId:item.tabId
      },
      callback:()=>{
        this.clearSearchData();
        this.firstRequest(item.tabId)
      }
    });

  };


  // 清空state中的删除数组
  clearCollectId=()=>{
    this.setState({
      collectIdArray:[]
    });
  };

  clearSearchData=()=>{
    const {dispatch}=this.props;
    dispatch({
      type: `myCollectionModels/clearSearchData`,
      payload: [],
    });

  };

  /**
   * @date: 2019/3/11
   * @author xingxiaodong
   * @Description: 触发批量删除单选框被选中或者取消选中
   * @method checkboxOnChange
   *
   */
  checkboxOnChange=(e,collectId)=>{
    const {checked}=e.target;
    // 数组里写入或者删除元素
    const {collectIdArray}=this.state;
    let array=Object.assign([],collectIdArray);
    if(checked){
      // 被选中
      array.push(collectId)
    }else {
      // 去掉对勾
      array=array.filter(item=>item!==collectId)
    }
    this.setState({
      collectIdArray:array
    })

  };

  /**
   * @date: 2019/1/17
   * @author liuxiuqian
   * @Description: 判断加载组件
   * @method judgeComponent
   * @param {object} data 列表元素值
   * @param {int} index 列表索引
   * @return  jsx dom
   */
  judgeComponent = (data) => {
    const moreBtnShow = false; // 不显示‘更多>>’字样
    let listDom = '';
    const { tabId } = this.props;
    const { collectId } = data;
    const allData = Object.assign({}, data);
    if (tabId === '1') {
      listDom = <IndexList data={allData} moreBtnShow={moreBtnShow} />;
    } else if (tabId === '2' || tabId === '') {
      listDom = <SpecialProject data={allData} moreBtnShow={moreBtnShow} />;
    } else if (tabId === '3') {
      listDom = <Report data={allData} moreBtnShow={moreBtnShow} />;
    } else if (tabId === '4') {
      listDom = <ReportForms data={allData} moreBtnShow={moreBtnShow} />;
    } else if (tabId === '5') {
      listDom = <DisplayItem data={allData} />;
    }

    return (
      <div className={styles.itemContent}>
        <div className={styles.deleteAll}>
          <Checkbox
            defaultChecked={false}
            onChange={(e) => this.checkboxOnChange(e, collectId)}
          />
        </div>
        {listDom}
      </div>
    );
  };

  /**
   * @date: 2019/1/17
   * @author liuxiuqian
   * @Description: 用户请求更多项目时的回调
   * @method handleInfiniteOnLoad
   *
   */
  handleInfiniteOnLoad= () =>{
    const { dispatch, tabId, moduleId,currentPage} = this.props;
    const params = {
      'moduleId': moduleId,
      'searchType': tabId,
      'currentPage': (Number(currentPage)+1).toString(),
      'num': '10',
    };
    dispatch({
      type: 'myCollectionModels/getSearchData',
      payload: params,
    });
  };

  firstRequest=(id)=>{
    const { dispatch,moduleId } = this.props;
    const params = {
      'moduleId': moduleId,
      'searchType': id ,
      'currentPage': '1',
      'num': '10',
    };
    dispatch({
      type: 'myCollectionModels/getSearchData',
      payload: params,
      sign: true, // 若为非滚动时间都需要传这个标志
    });
  };

  // 点击删除全部按钮,显示弹出层
  deleteAllCollection=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'myCollectionModels/openDeleteAllPopup',
      payload: true,
    });
  };

  // 删除全部弹出层
  deleteAllButton=(type)=>{
    const {dispatch,moduleId,tabId}=this.props;
    const{collectIdArray}=this.state;
    if(type==="ok"){
      const params = {
        'moduleId': moduleId,
        'collectId':collectIdArray
      };
      dispatch({
        type: 'myCollectionModels/getDeleteAll',
        payload: params,
        callback: (res) => {
          // 删除全部接口正常返回
          if(res.code==='200'){
            message.success(res.message);
            this.clearCollectId();
            // 关闭弹窗
            dispatch({
              type: 'myCollectionModels/openDeleteAllPopup',
              payload: false,
            });


            // 刷新近期访问
            const{recentVisitComponentModels}=this.props;
            dispatch({
              type: 'recentVisitComponentModels/getRecentVisitData',
              payload: {id:recentVisitComponentModels.selectType.id}
            });

            dispatch({
              type: `myCollectionModels/clearSearchData`,
              payload: [],
            });
            this.firstRequest(tabId)
          } else{
            // 返回不正常弹出警示信息
            message.error(res.message || '收藏失败');
          }
        },
      });
    }else if(type==="cancel"){
      // 关闭弹窗
      dispatch({
        type: 'myCollectionModels/openDeleteAllPopup',
        payload: false,
      });
    }
  };

  // 此事件接收子对象
  childEvevnt = childDate => {
    this.$child = childDate;
  };

  onNew = () =>{
    this.$child.showModal();
  }

  render() {
    const {contentData} = this.props;
    const {tabData,tabIndex,loading,searchData,hasMore,deleteAllVisible}=this.props;
    const{collectIdArray}=this.state;
    if(!tabData){return null}
    let tab=null;
    const {tabValue}=tabData;
    if(tabValue){
      tab=tabValue.map((item,index)=>
        (
          <div
            key={item.tabId}
            className={tabIndex === index ? styles.active : styles.tableItem}
            onClick={() => this.setTable(index, item)}
          >
            {item.tabName}
          </div>
        )
      );
    }
    return (
      <div className={styles.apply}>
        <Modal
          title="删除条目"
          visible={deleteAllVisible}
          onOk={()=>this.deleteAllButton('ok')}
          onCancel={()=>this.deleteAllButton('cancel')}
          centered
        >
          <div className={styles.confirmText}>
            <span>{collectIdArray.length ? `你已选中${collectIdArray.length}条，确定要取消收藏吗？`:'请选择删除条目'}</span>
          </div>
        </Modal>
        <Row gutter={16}>
          <Col span={16}>
            <div className={styles.main}>
              <div className={styles.tabWrapper}>
                {tab}
                <div className={styles.handle}>
                  <div className={styles.handleItem} onClick={this.deleteAllCollection}>删除收藏</div>
                  <div
                    className={styles.handleItem}
                    onClick={() => this.onNew()}
                  >新增收藏
                  </div>
                  <NewCollection childEvevnt={this.childEvevnt} contentData={contentData} />
                </div>
              </div>
              <div className={styles.mainList}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={1}
                  threshold={50}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!loading && hasMore}
                  // useWindow={false}
                >
                  <List
                    size="large"
                    rowKey="key"
                    // loading={loading}
                    dataSource={searchData}
                    renderItem={(item, index) => (
                      <List.Item key={item.id + item.ord}>
                        {this.judgeComponent(item, index)}
                      </List.Item>
                    )}
                  />
                  <div className={styles.wholeTip}>{!hasMore ? '已加载全部' : '加载更多'}</div>
                </InfiniteScroll>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.sidebar}>
              <div className={styles.recentVisit}>
                <RecentVisit />
              </div>
              <div className={styles.recentUpdate}>
                <RecentUpdate />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MyCollectionApply;
