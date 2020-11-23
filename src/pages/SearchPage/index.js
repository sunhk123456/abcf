import React from 'react';
import { connect } from 'dva';
import {Card, Row, Col, List, message, Modal} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import IndexList from '@/components/SearchPage/indexList'; // 指标组件
import IndexListOne from '@/components/SearchPage/indexListOne'; // 带轮播图的指标组件
import Report from '@/components/SearchPage/report'; // 报告组件
import ReportForms from '@/components/SearchPage/reportForms'; // 报表组件
import SpecialProject from '@/components/SearchPage/specialProject'; // 报表组件
import ShowKeyword from '@/components/SearchPage/showKeyword'; // 报表组件
import RecentVisit from '@/components/SearchPage/RecentVisit/recentVisitComponent'; // 推荐近期访问
import Recommended from '@/components/SearchPage/RecentVisit/recommended'; // 近期访问
import isEqual from 'lodash/isEqual';
import { getRouterState } from '@/utils/tool';
// import ProCity from '@/components/Until/proCity';

import styles from './index.less';
import checked from '../../assets/image/search/checked.png';
import unchecked from '../../assets/image/search/unchecked.png';

@connect(({ searchPageModels, searchModels, loading,recentVisitComponentModels,recommendedModels }) => ({
  searchPageModels,
  searchModels,
  loading: loading.models.searchPageModels,
  recentVisitComponentModels,
  recommendedModels
}))
class SearchIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedId: "",
      searchValue:"",
      type: "",// 判断是否由菜单跳转，若为从菜单跳转，不用展示关键词 (20190520风信子 废除 改为searchModels下的searchType判断)
    };

  }

  componentDidMount() {
    // const {dispatch, searchModels, location } = this.props;
    const {dispatch, searchModels } = this.props;
    const state = getRouterState(this.props);
    // const { state }  = location;
    const { selectType, typeData} = searchModels;
    // 清理数据
    dispatch({
      type: 'searchPageModels/getCleanData',
    });
    if(state !== undefined && state !==null && Object.keys(state).length > 1 && typeData.length > 0){
      const {selectedId,searchValue,id,type} = state;
      const selectData = {};
      typeData.forEach((item)=>{
        if(selectedId === item.id){
          selectData.id = item.id;
          selectData.name = item.name;
        }
      });
      dispatch({
        type: 'searchModels/setSelectType',
        payload: selectData,
      });
      dispatch({
        type: 'searchModels/setSelectName',
        payload: id,
      });
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name: searchValue, searchType: 1},
      });
      this.setState({
        selectedId ,
        searchValue,
        type,
      })
      this.firstRequest(selectData,id);
    }else if(state !== undefined && state !==null  &&  Object.keys(state).length === 1) {
      const {value} = state;
      this.firstRequest(selectType,value);
    }else {
      this.firstRequest(selectType,"");
    }

  }

  static getDerivedStateFromProps(props,state2){
    const state = getRouterState(props);
    const propsSelectedId = state !== undefined && state !==null ? state.selectedId : "999";
    const propsSearchValue = state !== undefined && state !==null ? state.id : "";
    const propsType = state !== undefined && state !==null ? state.type : "";
    if(state && (propsSelectedId !== state2.selectedId || propsSearchValue !==  state2.searchValue)){
      return {
        selectedId : propsSelectedId,
        searchValue : propsSearchValue,
        type : propsType
      }
    }
    return null;
  }


  shouldComponentUpdate(nextProps){
    // const {searchModels}= nextProps;
    const nextData=nextProps.searchPageModels.searchData;
    const nextModalVisible = nextProps.searchPageModels.modalVisible;
    const {searchPageModels}=this.props;
    const {searchData,modalVisible}=searchPageModels;
    return !isEqual(nextData,searchData) || !isEqual(nextModalVisible,modalVisible)
  }


  componentDidUpdate(prevProps,prevState){
    const { selectedId,searchValue } = this.state;
    const { dispatch, searchModels } = this.props;
    const {selectType} = searchModels;
    // const {typeData,selectName,selectType,searchType} = searchModels;
    // 20191009 解决点击菜单是多次请求问题
    // if(prevState.selectedId !== selectedId&&searchType!==3){
    //   const selectData = {};
    //   typeData.forEach((item)=>{
    //     if(selectedId === item.id){
    //       selectData.id = item.id;
    //       selectData.name = item.name;
    //     }
    //   });
    //   // 清理数据
    //   dispatch({
    //     type: 'searchPageModels/getCleanData',
    //   });
    //   dispatch({
    //     type: 'searchModels/setSelectType',
    //     payload: selectData,
    //   });
    //   console.log("上")
    //   this.firstRequest(selectData,selectName);
    // } else
      if(prevState.selectedId === selectedId &&prevState.searchValue!==searchValue){
      dispatch({
        type: 'searchModels/setSelectName',
        payload: searchValue,
      });
      this.firstRequest(selectType,searchValue);
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'searchPageModels/setCleanData',
    });
  }


  /**
   * @date: 2019/1/17
   * @author liuxiuqian
   * @Description: 判断加载组件
   * @method judgeComponent
   * @param {object} data 列表元素值
   * @param {int} index 列表索引
   * @return  jsx dom
   */
  judgeComponent = (data, index) => {
    const { searchModels } = this.props;
    // const { searchCollect } = searchPageModels;
    const { selectType } = searchModels;
    let moreBtnShow = false;
    let listDom = "";
    const {id, markType, isMinus, ord, url,isCollect} = data;
    if(selectType.id === "999"){
       moreBtnShow = index < 7;

      const ojb1 = {
        id, markType, isMinus, ord, url
      };

      const allData = Object.assign(ojb1, data.data,);
      if(markType === "1"){
        listDom = <IndexList data={allData} moreBtnShow={moreBtnShow} />;
      }else if(markType === "2"){
        listDom = <SpecialProject data={allData} moreBtnShow={moreBtnShow} />;
      }else if(markType === "3"){
        listDom = <Report data={allData} moreBtnShow={moreBtnShow} />;
      }else if(markType === "4"){
        listDom = <ReportForms data={allData} moreBtnShow={moreBtnShow} />;
      }
    }else if(selectType.id === "1"){
      if(index === 0){
        listDom = <IndexListOne data={data} moreBtnShow={moreBtnShow} />;
      }else {
        listDom = <IndexList data={data} moreBtnShow={moreBtnShow} />;
      }
    }else if(selectType.id === "2"){
      listDom = <SpecialProject data={data} moreBtnShow={moreBtnShow} />;
    }else if(selectType.id === "3"){
      listDom = <Report data={data} moreBtnShow={moreBtnShow} />;
    }else if(selectType.id === "4"){
      listDom = <ReportForms data={data} moreBtnShow={moreBtnShow} />;
    }
    let type;
    if(markType===undefined){
      type=selectType.id;
    }else{
      type=markType;
    }
    return (
      <div className={styles.itemContent}>
        {listDom}
        <img className={styles.listImg} src={isCollect !== '0' ?checked:unchecked} alt="..." onClick={() => this.itemCollectFun(ord-1,type,id,isCollect)} />
      </div>);
  };

  /**
   * @date: 2019/1/17
   * @author liuxiuqian
   * @Description: 用户请求更多项目时的回调
   * @method handleInfiniteOnLoad
   *
   */
  handleInfiniteOnLoad= (page) =>{
    const { dispatch, searchModels } = this.props;
    const { selectName, selectType, maxDate } = searchModels;
    let params = {};
    if(selectType.id !== "1"){
      params = {
        searchType: selectType.id,
        search: selectName,
        tabId:"-1",
        numStart:1+(page-1)*10,
        num:"10"
      }
    }else {
      params = {
        area: "",
        date: maxDate,
        dayOrmonth: "-1",
        num: "10",
        numStart: 1+(page-1)*10,
        search: selectName,
        searchType: selectType.id,
      }
    }
    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
    });
  };

  /**
   * @date: 2019/2/10
   * @author yinlingyun
   * @Description: 触发收藏接口，收藏或取消收藏
   * @method itemCollectFun
   *
   */
  itemCollectFun=(index,type,id,isCollect)=>{
    const { searchPageModels ,dispatch } = this.props;
    const { searchCollectIdList,searchData,modalVisible } = searchPageModels;
    let isCollectId;
    if(isCollect !== "0" ){
      isCollectId = 0; // 取消收藏该项传0
      // 暂存参数到searchPageModels，方便再次获取
      const collectParam = {
        itemIndex:index, // 收藏项的次序
        itemType:type, // 项的类型
        id, // 项的Id
        isCollectId, // 是收藏还是取消收藏
        modelName:'searchPageModels', // 要运行哪个model下的dispatch操作
      };
      // 存储数据
      dispatch({
        type: 'searchPageModels/collectParamChange',
        payload: collectParam,
      });
      // 弹出确认弹窗
      dispatch({
        type: 'searchPageModels/popConfirmModal',
        payload: !modalVisible,
      });
    }else{
      isCollectId = 1;// 收藏该项传1
      const searchDataCopy = searchData.map(item=>{
        const objItem = {...item};
        if(item.id === id){
          objItem.isCollect = isCollectId.toString();
        }
        return objItem
      });
      const params = {
        type,
        collectId:searchCollectIdList[index],
        markType:id, // 收藏的专题/指标/报告/报表id
        isCollectId, // 表明是收藏还是取消收藏
        moduleId:'111', // 用于区分省分应用和总部应用
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        callback: (res) => {
          // 收藏接口正常返回
          if(res.code==='200'){
            // 替换对应collectId
            searchCollectIdList[index] = res.collectId;
            dispatch({
              type: 'searchPageModels/setCleanData',
              payload: [...searchDataCopy],
            });
            dispatch({
              type: 'searchPageModels/upDateCollectId',
              payload: searchCollectIdList,
            });
            message.success(res.message);
          }
          // 返回不正常弹出警示信息
          else{
            message.error(res.message);
          }
        },
      });
    }
  };

  modalButtonFun = (type) =>{
    const { searchPageModels ,dispatch,recentVisitComponentModels,recommendedModels } = this.props;
    const { modalVisible,searchCollectIdList,searchData,collectParam } = searchPageModels;
    const { visitCollect,visitCollectIdList } = recentVisitComponentModels;
    const { recommendCollect,recommendCollectIdList } = recommendedModels;
    const {itemIndex,itemType,id,isCollectId,modelName} = collectParam;
    // 当点击弹窗的确定按钮时
    if(type==='ok'){
      const searchDataCopy = searchData.map(item=>{
        const objItem = {...item};
        if(item.id === id){
          objItem.isCollect = isCollectId.toString();
        }
        return objItem
      });
      const params = {
        type:itemType,
        collectId:searchCollectIdList[itemIndex],
        markType:id, // 收藏的专题/指标/报告/报表id
        isCollectId, // 表明是收藏还是取消收藏
        moduleId:'111', // 用于区分省分应用和总部应用
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        callback: (res) => {
          // 收藏接口正常返回
          if(res.code==='200'){
            // 替换对应collectId,当取消收藏的操作发生在搜索区域时
            if(modelName==='searchPageModels'){
              searchCollectIdList[itemIndex] = res.collectId;
              dispatch({
                type: 'searchPageModels/setCleanData',
                payload: [...searchDataCopy],
              });
              dispatch({
                type: 'searchPageModels/upDateCollectId',
                payload: searchCollectIdList,
              });
            }
            // 当取消收藏操作发生在近期访问区域时
            else if(modelName==='recentVisitComponentModels'){
              // 改变当前按钮选中状态，true为收藏，false为未收藏
              visitCollect[itemIndex] = !visitCollect[itemIndex];
              // 替换对应collectId
              visitCollectIdList[itemIndex] = res.collectId;
              dispatch({
                type: 'recentVisitComponentModels/upDateCollectState',
                payload: visitCollect,
              });
              dispatch({
                type: 'recentVisitComponentModels/upDateCollectId',
                payload: visitCollectIdList,
              });
            }
            // 当取消收藏操作发生在推荐内容区域时
            else if(modelName==='recommendedModels'){
              // 改变当前按钮选中状态，true为收藏，false为未收藏
              recommendCollect[itemIndex] = !recommendCollect[itemIndex];
              // 替换对应collectId
              recommendCollectIdList[itemIndex] = res.collectId;
              dispatch({
                type: 'recommendedModels/upDateCollectState',
                payload: recommendCollect,
              });
              dispatch({
                type: 'recommendedModels/upDateCollectId',
                payload: recommendCollectIdList,
              });
            }
            // 关闭弹窗
            dispatch({
              type: 'searchPageModels/popConfirmModal',
              payload: !modalVisible,
            });
            message.success(res.message);
          }
          // 返回不正常弹出警示信息
          else{
            message.error(res.message);
            // 关闭弹窗
            dispatch({
              type: 'searchPageModels/popConfirmModal',
              payload: !modalVisible,
            });
          }
        },
      });
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      dispatch({
        type: 'searchPageModels/popConfirmModal',
        payload: !modalVisible,
      });
    }
  };

  firstRequest(selectType,search){
    const { dispatch, searchModels } = this.props;
    const { maxDate } = searchModels;
    let params = {};

    if(selectType.id !== "1"){
      params = {
        searchType: selectType.id,
        search,
        tabId:"-1",
        numStart:1,
        num:"10"
      }
    }else {
      params = {
        area: "",
        date: maxDate,
        dayOrmonth: "-1",
        num: "10",
        numStart: 1,
        search,
        searchType: selectType.id,
      }
    }

    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
      sign:true, // 若为非滚动时间都需要传这个标志
    });
  }



  render() {
    const { searchPageModels, searchModels,loading} = this.props;
    // eslint-disable-next-line
    const {type} = this.state;
    const { searchData, hasMore, keyword,modalVisible } = searchPageModels;
    const {searchType} = searchModels;
    // const showKeyWords = type !== "menu"?  <ShowKeyword data={keyword} />:null;
    const showKeyWords = searchType === 0?  <ShowKeyword data={keyword} />:null; // 20190520风信子改
    return (
      <PageHeaderWrapper>
        <Modal
          title="取消收藏"
          visible={modalVisible}
          onOk={()=>this.modalButtonFun('ok')}
          onCancel={()=>this.modalButtonFun('cancel')}
          centered
        >
          <div className={styles.confirmText}>
            <span>确定要取消收藏吗？</span>
          </div>
        </Modal>
        <Card bordered={false} bodyStyle={{ padding:'6px 12px 12px 0'}}>
          <Row>
            <Col md={16} className={styles.list}>
              {/* 关键词组件 */}
              {showKeyWords}
              <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                threshold={50}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={loading && hasMore}
                // useWindow={false}
              >
                <List
                  size="large"
                  rowKey="key"
                  // loading={loading}
                  dataSource={searchData}
                  renderItem={(item, index) => (
                    <List.Item key={item.id+item.ord}>
                      {this.judgeComponent(item, index)}
                    </List.Item>
                  )}
                />
                <div className={styles.wholeTip}>{ !hasMore ? "已加载全部" : "加载更多"}</div>
              </InfiniteScroll>
            </Col>
            <Col md={8} className={styles.rightContent}>
              <RecentVisit />
              <Recommended />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SearchIndex;
