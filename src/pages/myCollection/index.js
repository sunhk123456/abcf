/**
 * @Description: 我的收藏页面
 *
 * @author: 喵帕斯
 *
 * @date: 2020/03/06
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import { message, Modal } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import MyCollectionApply from '../../components/myCollection/apply';
// import ModuleLog from "../../components/Until/moduleLog"
import styles from './index.less';

@connect(
  ({
     myCollectionModels,
     searchPageModels,
     recentVisitComponentModels,
   }) => ({
     myCollectionModels,
     recentVisitComponentModels,
     searchPageModels,
     markType: myCollectionModels.markType,
     specialName: myCollectionModels.specialName,
     selectIndex: myCollectionModels.selectIndex,
     tabId: myCollectionModels.tabId,
     moduleId: myCollectionModels.moduleId,
     titleData: myCollectionModels.titleData,
     deleteAllVisible: myCollectionModels.deleteAllVisible,
     collectIdArray:myCollectionModels.collectIdArray,
     modalVisible: searchPageModels.modalVisible,

  }))

@connect(
  ({myCollectionModels}) => (
    {
      myCollectionModels,
      downData:myCollectionModels.downData,
    })
)

class MyCollection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.getTitleData();
  }

  // 获取页签数据
  getTitleData=()=>{
    const { dispatch,markType} = this.props;
    const params={
      markType
    };
    dispatch({
      type: `myCollectionModels/getTitleData`,
      payload: params,
    });
  };

  setTable=(index,item)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `myCollectionModels/getModuleId`,
      payload: {
        selectIndex:index,
        moduleId:item.moduleId
      },
    });

  };

  modalButtonFun = (type) =>{
    const that = this;
    const { searchPageModels ,dispatch,recentVisitComponentModels,myCollectionModels} = this.props;
    const { modalVisible,collectParam } = searchPageModels;
    const { visitCollect,visitCollectIdList } = recentVisitComponentModels;
    const { recentUpdateState,recentUpdateIdList } = myCollectionModels;
    const {collectId,itemType,id,isCollectId,modelName,itemIndex} = collectParam;
    // 当点击弹窗的确定按钮时
    if(type==='ok'){
      const params = {
        type:itemType,
        collectId,
        markType:id, // 收藏的专题/指标/报告/报表id
        isCollectId, // 表明是收藏还是取消收藏
        moduleId:"111", // 模块id
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        callback: (res) => {
          // 收藏接口正常返回
          if(res.code==='200'){
            // 当取消收藏操作发生在近期访问区域时
            if(modelName==='recentVisitComponentModels'){
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
            // 当取消收藏操作发生在近期更新区域时
            else if(modelName==='myCollectionModels'){
              // 改变当前按钮选中状态，true为收藏，false为未收藏
              recentUpdateState[itemIndex] = !recentUpdateState[itemIndex];
              // 替换对应collectId
              recentUpdateIdList[itemIndex] = res.collectId;
              dispatch({
                type: 'myCollectionModels/upDateRecentUpdateState',
                payload: recentUpdateState,
              });
              dispatch({
                type: 'myCollectionModels/upDateRecentUpdateCollectId',
                payload: recentUpdateIdList,
              });
            }
            // 关闭弹窗
            dispatch({
              type: 'searchPageModels/popConfirmModal',
              payload: !modalVisible,
            });
            // 更新左侧列表数据
            that.upDateCollecdList();
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

  /**
   * @date: 2020/3/20
   * @author liuxiuqian
   * @Description: 方法说明 更新收藏列表
   * @method 方法名 upDateCollecdList
   */
  upDateCollecdList=()=>{
    const { dispatch,myCollectionModels:{moduleId,tabId} } = this.props;
    const params = {
      moduleId,
      searchType: tabId ,
      currentPage: '1',
      num: '10',
    };
    dispatch({
      type: `myCollectionModels/clearSearchData`,
      payload: [],
    });
    dispatch({
      type: 'myCollectionModels/getSearchData',
      payload: params,
      // sign: true, // 若为非滚动时间都需要传这个标志
    });
  };

  render() {
    const {titleData,selectIndex,specialName,modalVisible}=this.props;
    let tab=null;

    // const moduleLogParams = {
    //   makeId: "专题id",
    //   makeName: "专题名称",
    //   moduleId: selectIndex,
    //   moduleName: "模块name",
    // }
    if(titleData){
      tab=titleData.map((item,index)=>
        (
          <div
            key={item.moduleId}
            className={selectIndex === index ? styles.active : styles.tableItem}
            onClick={() => this.setTable(index, item)}
          >
            {item.moduleName}
          </div>
        )
      );
    }
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
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
          <div className={styles.titleName}>
            {specialName}
          </div>
          <div className={styles.content}>
            <div className={styles.table}>
              {tab}
            </div>
          </div>
          <div className={styles.main}>
            {
              selectIndex===0 && <MyCollectionApply tabData={titleData[selectIndex]} />
            }
            {
              selectIndex===1 && <MyCollectionApply tabData={titleData[selectIndex]} />
            }
          </div>
        </div>
        {/* <ModuleLog moduleLogParams={moduleLogParams} /> */}
      </PageHeaderWrapper>




    )
  }
}

export default MyCollection;
