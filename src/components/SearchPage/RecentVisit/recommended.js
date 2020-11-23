/**
 * @Description: 推荐内容组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/30
 */
import React,{PureComponent} from 'react'
import { Icon, message, Tag } from 'antd';
import router from 'umi/router';
import Cookie from '@/utils/cookie';
import { connect } from 'dva';
import DownloadUrl from '@/services/downloadUrl.json';
import checked from '../../../assets/image/search/checked.png';
import unchecked from '../../../assets/image/search/unchecked.png';

import styles from './recommended.less';


@connect(({ recommendedModels, loading,searchPageModels }) => ({
  recommendedModels,
  loading: loading.models.recommendedModels,
  searchPageModels
}))
class Recommended extends PureComponent{
  constructor(props){
    super(props);
    this.state= {
      downUp: false, // 是否显示搜索提醒
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recommendedModels/getTypeData',
    });

    dispatch({
      type: 'recommendedModels/getRecentVisitData',
      payload: {searchType:"999"}
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
    const { recommendedModels ,dispatch,searchPageModels } = this.props;
    const { recommendCollect,recommendCollectIdList } = recommendedModels;
    const { modalVisible } = searchPageModels;
    let isCollectId;
    if(recommendCollect[index]){
      isCollectId = 0; // 取消收藏该项传0
      const collectParam = {
        itemIndex:index, // 收藏项的次序
        itemType:type, // 项的类型
        id, // 项的Id
        isCollectId, // 是收藏还是取消收藏
        modelName:'recommendedModels', // 要运行哪个model下的dispatch操作
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
        collectId:recommendCollectIdList[index],
        markType:id, // 收藏的专题/指标/报告/报表id
        isCollectId, // 表明是收藏还是取消收藏
        moduleId:'111', // 用于区分省分应用和总部应用
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        // 收藏接口正常返回
        callback: (res) => {
          if(res.code==='200'){
            // 改变当前按钮选中状态，true为收藏，false为未收藏
            recommendCollect[index] = !recommendCollect[index];
            // 替换对应collectId
            recommendCollectIdList[index] = res.collectId;
            dispatch({
              type: 'recommendedModels/upDateCollectState',
              payload: recommendCollect,
            });
            dispatch({
              type: 'recommendedModels/upDateCollectId',
              payload: recommendCollectIdList,
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

  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 跳转页面
   * @method jumpHandle
   * @param data 跳转包含的数据
   * @param dateType
   */
  jumpHandle(data, dateType){
    const {id, url, markType} = data;
    const {title} = data.data;
    const { dispatch } = this.props;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre=/^http.+\?.+/;
    if(id === "D0203" || id === "basestationview" || id === "baseStation"){// 基站跳转
      this.JumpBaseStation(url);
    }else if(markType === "4"){
      // const rfctest=/^http.+(\/rfc)+.*/;
      if(re.test(url)){
        dispatch({
          type: 'logModels/reportTableLogFetch',
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
        router.push({
          pathname:url,
          state:{
            id,
            dateType
          }
        })
      }
    }else if(markType === "3"){
      dispatch({
        type: 'myReportCardModel/getFetchOnlineViewReport',
        payload: {markType: id},
        callback: (res) => {
          if(res.path){
            const w =window.open('about:blank');
            w.location.href=`${DownloadUrl.urls[1].url}?file=${res.path}`;
          }else {
            message.error("预览失败，权限不足")
          }
        }
      });
    }else {
      // eslint-disable-next-line
      if(re.test(url)){
        if(markType === "2"){
          // 日志记录
          dispatch({
            type: 'logModels/specialReportLogFetch',
            payload: {
              markType: id,
              requestUrlPath: url,
              hot: "0"
            },
          });
        }else {
          dispatch({
            type: 'logModels/indexDetailsFetch',
            payload: {
              markType: id,
              requestUrlPath: url,
              hot: "0"
            },
          });
        }
        if(pre.test(url)){
          window.open(`${url}&ticket=${token}&source=cloud&token=${token}`)
        }else {
          window.open(`${url}?ticket=${token}&source=cloud&token=${token}`)
        }
      }else {
        router.push({
          pathname:url,
          state:{
            id,
            title,
            dateType: dateType === "日" ? "1" : "2"
          }
        })
      }
    }
  }

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
    dispatch({
      type: 'recommendedModels/getRecentVisitData',
      payload: {searchType: item.id}
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
    const {recommendedModels} = this.props;
    const { downUp } = this.state;
    const colorArr = ["","#7184A8","#96B18B","#C099A9","#ce7b7b"];
    const {selectType, recentVisitData, recommendVisitData,recommendCollect}=recommendedModels;
    const downUlDom = recentVisitData.map((item)=><li key={item.id} onClick={()=>this.handleChange(item)}>{item.name}</li>);
    const listItemDom = recommendVisitData.map((item,index)=>{
      const { data, id, markType} = item;
      let type1 = "";
      let tabName1 = "";
      let date1 = "";
      if(markType === "1"){
        type1 = data.markName;
        tabName1 = data.dayOrMonth;
        date1 = data.date;
      }else if(markType === "2"){
        type1 = data.type;
        tabName1 = item.data.tabName;
      }else{
        type1 = data.type;
        tabName1 = data.tabName;
        date1 = `${data.issueTime} · ${data.issue}`;
      }
      const dateDom = markType !== "2" ? <div className={styles.date}>{date1}</div> : null;
      return(
        <div key={id} className={styles.listItem}>
          <div className={styles.listTitle}>
            <span className={styles.listTitleName} onClick={() => this.jumpHandle(item, tabName1)} title={data.title}>{data.title}</span>
            <img className={styles.listImg} src={recommendCollect[index]?checked:unchecked} alt="..." onClick={() => this.itemCollectFun(index,item.markType,item.id)} />
          </div>
          {dateDom}
          <div className={styles.bottomDom}>
            <span>
              <Tag color={colorArr[markType]}>{type1}</Tag>
              <Tag color="#999999">{tabName1}</Tag>
            </span>
          </div>
        </div>);
    });

    return (
      <div className={styles.recommended}>
        <header className={styles.header}>
          <span className={styles.title}>推荐内容</span>
          <div className={styles.dropdown}>
            {selectType.name} <Icon onClick={()=>this.showselect()} className={styles.dropdownIcon} type="down" />
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
export default Recommended;
