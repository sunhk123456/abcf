/**
 * @Description: 近期更新组件
 *
 * @author: yinlingyun
 *
 * @date: 2020/03/09
 */
import React,{PureComponent} from 'react'
import { Icon, message, Tag } from 'antd';
import { connect } from 'dva';
// import checked from '../../assets/image/search/checked.png';
// import unchecked from '../../assets/image/search/unchecked.png';
import styles from './recentUpdate.less';


@connect(({ recommendedModels, loading,searchPageModels,myCollectionModels }) => ({
  recommendedModels,
  loading: loading.models.recommendedModels,
  searchPageModels,
  myCollectionModels,
}))
class RecentUpdate extends PureComponent{
  constructor(props){
    super(props);
    this.state= {
      downUp: false, // 是否显示搜索提醒
    }
  }

  componentDidMount() {
    const { dispatch,recommendedModels } = this.props;
    const { selectType } = recommendedModels;
    dispatch({
      type: 'myCollectionModels/getRecentUpdate',
      payload: {
        typeId:selectType.id
      }
    });
    dispatch({
      type: 'recommendedModels/getTypeData',
    });
  }

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 隐藏类型
   * @method onMouseLeaveFun
   */
  onMouseLeaveFun(){
    this.setState({
      downUp: false
    })
  }

  // 点击收藏按钮触发该方法
  itemCollectFun=(index,type,id)=>{
    const { dispatch,searchPageModels,myCollectionModels } = this.props;
    const { recentUpdateState,recentUpdateIdList } = myCollectionModels;
    const { modalVisible } = searchPageModels;
    let isCollectId;
    if(recentUpdateState[index]){
      isCollectId = 0; // 取消收藏该项传0
      const collectParam = {
        collectId:recentUpdateIdList[index], // 收藏项的collectId
        itemType:type, // 项的类型
        id, // 项的Id
        isCollectId, // 是收藏还是取消收藏
        itemIndex:index, // 收藏项的次序
        modelName:'myCollectionModels', // 要运行哪个model下的dispatch操作
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
      isCollectId = 1; // 收藏该项传1
      const params = {
        type,
        collectId:recentUpdateIdList[index],
        markType:id, // 收藏的专题/指标/报告/报表id
        isCollectId, // 表明是收藏还是取消收藏
        moduleId:'111', // 用于区分省分应用和总部应用
      };
      // 触发搜索页面下的收藏接口
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        // 收藏接口正常返回
        callback: (res) => {
          if(res.code==='200'){
            // 改变当前按钮选中状态，true为收藏，false为未收藏
            recentUpdateState[index] = !recentUpdateState[index];
            // 替换对应collectId
            recentUpdateIdList[index] = res.collectId;
            dispatch({
              type: 'myCollectionModels/upDateRecentUpdateState',
              payload: recentUpdateState,
            });
            dispatch({
              type: 'myCollectionModels/upDateRecentUpdateCollectId',
              payload: recentUpdateIdList,
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

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 选中类型事件
   * @method handleChange
   * @param item 选中的name 和id
   * @return {返回值类型} 返回值说明
   */
  handleChange(item){
    this.setState({
      downUp: false
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'recommendedModels/setSelectType',
      payload: item
    });
    // 重新获取近期访问内容
    dispatch({
      type: 'myCollectionModels/getRecentUpdate',
      payload: {
        typeId:item.id
      }
    });
  }

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 显示类型
   * @method showselect
   */
  showselect(){
    this.setState({
      downUp: true
    })
  }

  render(){
    const {recommendedModels,myCollectionModels} = this.props;
    const { recentUpdate } = myCollectionModels;
    const { downUp } = this.state;
    const colorArr = ["","#7184A8","#96B18B","#C099A9","#ce7b7b"];
    const {selectType, recentVisitData}=recommendedModels;
    const downUlDom = recentVisitData.map((item)=><li key={item.id} onClick={()=>this.handleChange(item)}>{item.name}</li>);
    const listItemDom = recentUpdate.map((item)=>{
      const { title, typeId,typeName,dateType,markType} = item;
      let dateName = "";
      if(dateType==='1'){
        dateName = "日";
      }else if(dateType==='2'){
        dateName = "月";
      }else if(dateType==='5'){
        dateName = "周";
      }
      return(
        <div key={markType} className={styles.listItem}>
          <div className={styles.listTitle}>
            <span
              className={styles.listTitleName}
              title={title}
            >
              {title}
            </span>
            {/* <img className={styles.listImg} src={recentUpdateState[index]?checked:unchecked} alt="..." onClick={() => this.itemCollectFun(index,item.markType,item.typeId)} /> */}
          </div>
          <div className={styles.bottomDom}>
            <span>
              <Tag color={colorArr[typeId]}>{typeName}</Tag>
              <Tag color="#999999">{dateName}</Tag>
            </span>
          </div>
        </div>);
    });

    return (
      <div className={styles.recommended}>
        <header className={styles.header}>
          <span className={styles.title}>近期更新</span>
          <div className={styles.dropdown} onClick={()=>this.showselect()}>
            {selectType.name} <Icon className={styles.dropdownIcon} type="down" />
            {downUp ? <ul onMouseLeave={()=> this.onMouseLeaveFun()} className={styles.downUl}>{downUlDom}</ul> : null}
          </div>
        </header>
        <div className={styles.line} />
        <main className={styles.content}>
          {listItemDom}
        </main>
      </div>
    );
  }
}
export default RecentUpdate;
