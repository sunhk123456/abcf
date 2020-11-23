import React,{PureComponent} from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import router from 'umi/router';
import Cookie from '@/utils/cookie';
import { message } from 'antd';
import DownloadUrl from '@/services/downloadUrl.json';
import report from '@/assets/image/homePage/baogao.png';
import statement from '@/assets/image/homePage/baobiao.png';
import index from '@/assets/image/homePage/zhibiao.png';
import special from '@/assets/image/homePage/zhuanti.png';
import styles from './ListItem.less';
import checked from '../../../assets/image/search/checked.png';
import unchecked from '../../../assets/image/search/unchecked.png';

@connect(({ myReportCardModel,recentVisitComponentModels,searchPageModels }) => ({
  myReportCardModel,recentVisitComponentModels,searchPageModels
}))

class ListItem extends PureComponent{
  constructor(props){
    super(props);
    this.state={}
  }

  // // 判断当收藏按钮被点击的时候，触发重新渲染
  // shouldComponentUpdate(nextProps, nextState) {
  //   const{checkList}=this.state;
  //   return !(nextState.checkList !== checkList)
  // }

  itemClicked=(item)=>{
   const {detailId, detailUrl, detailFlag, classId, detailName} = item;
   const {token} = Cookie.getCookie('loginStatus');
   const re=/^http.+/;
   const pre=/^http.+\?.+/;
    if(detailId === "D0203" || detailId === "basestationview" || detailId === "baseStation"){// 基站跳转
      this.JumpBaseStation(detailUrl);
    }else if(classId === "4"){
     if(re.test(detailUrl)){
       const {dispatch}=this.props;
       dispatch({
         type: 'logModels/reportTableLogFetch',
         payload: {
           markType: detailId,
           requestUrlPath: detailUrl,
           hot: "0"
         },
       });
       if(pre.test(detailUrl)){
         window.open(`${detailUrl}&ticket=${token}&source=cloud&token=${token}`)
       }else {
         window.open(`${detailUrl}?ticket=${token}&source=cloud&token=${token}`)
       }
     }
   }else if(classId === "3"){
     const { dispatch } = this.props;
     dispatch({
       type: 'myReportCardModel/getFetchOnlineViewReport',
       payload: {markType: detailId},
       callback: (res) => {
         if(res.path){
           const w =window.open('about:blank');
           w.location.href=`${DownloadUrl.urls[1].url}?file=${res.path}`
         }else {
           message.error("预览失败，权限不足")
         }
       }
     });
   }else {
     const {dispatch}=this.props;
     if(re.test(detailUrl)){
       if(classId === "2"){
         // 日志记录
         dispatch({
           type: 'logModels/specialReportLogFetch',
           payload: {
             markType: detailId,
             requestUrlPath: detailUrl,
             hot: "0"
           },
         });
       }else {
         dispatch({
           type: 'logModels/indexDetailsFetch',
           payload: {
             markType: detailId,
             requestUrlPath: detailUrl,
             hot: "0"
           },
         });
       }
       if(pre.test(detailUrl)){
         window.open(`${detailUrl}&ticket=${token}&source=cloud&token=${token}`)
       }else {
         window.open(`${detailUrl}?ticket=${token}&source=cloud&token=${token}`)
       }
     }else {
       router.push({
         pathname:detailUrl,
         state:{
           id: detailId,
           title: detailName,
           dateType:detailFlag
         }
       })
     }
   }
  };


  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  // 点击收藏按钮触发该方法
  collectClickFun = (inx,type,id) =>{
    const { recentVisitComponentModels ,dispatch,searchPageModels } = this.props;
    const { visitCollect,visitCollectIdList } = recentVisitComponentModels;
    const { modalVisible } = searchPageModels;
    let isCollectId;
    if(visitCollect[inx]){
      isCollectId = 0; // 取消收藏该项传0
      const collectParam = {
        itemIndex:inx, // 收藏项的次序
        itemType:type, // 项的类型
        id, // 项的Id
        isCollectId, // 是收藏还是取消收藏
        modelName:'recentVisitComponentModels', // 要运行哪个model下的dispatch操作
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
        collectId:visitCollectIdList[inx],
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
            // 改变当前按钮选中状态，true为收藏，false为未收藏
            visitCollect[inx] = !visitCollect[inx];
            // 替换对应collectId
            visitCollectIdList[inx] = res.collectId;
            dispatch({
              type: 'recentVisitComponentModels/upDateCollectState',
              payload: visitCollect,
            });
            dispatch({
              type: 'recentVisitComponentModels/upDateCollectId',
              payload: visitCollectIdList,
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

  render(){
    const {recentVisitList,recentVisitComponentModels}=this.props;
    const{ visitCollect }=recentVisitComponentModels;
    const listItems = recentVisitList.map(
      (item,inx) =>{
        let image;
        let color;
        if(item.class==="专题"){
          image=special;
          color= "zhuanti";
        }else if(item.class==="指标"){
          image=index;
          color= "zhibiao";
        }else if(item.class==="报告"){
          image=report;
          color= "baogao";
        }else if(item.class==="报表"){
          image=statement;
          color= "baobiao";
        }
        return(
          <li key={item.detailId}>
            <span className={classNames(styles.listTitleName, styles[color])}>{item.class}</span>
            <span className={styles.listRight}>
              <img className={styles.listImg} src={image} alt="..." />
              <p className={styles.listText} title={item.detailName} onClick={()=>{this.itemClicked(item)}}>{item.detailName}</p>
            </span>
            <span className={styles.listCollect}>
              <img className={styles.listImg} src={visitCollect[inx]?checked:unchecked} alt="..." onClick={()=>{this.collectClickFun(inx,item.classId,item.detailId)}} />
            </span>
          </li>
        )
      }
    );
    return(
      <ul className={styles.listItemUl}>
        {listItems}
      </ul>
    )
  }
}
export default ListItem
