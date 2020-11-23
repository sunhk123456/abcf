import React,{PureComponent} from 'react'
import { connect } from 'dva';
import { Icon, message } from 'antd';
import router from 'umi/router';
import Cookie from '@/utils/cookie';
import ListItem from './ListItem';
import styles from './recentVisit.less';
// import img from "../../../assets/image/search/visit.png";

@connect(({ recentVisitComponentModels, loading }) => ({
  recentVisitComponentModels,
  loading: loading.models.recentVisitComponentModels,
}))
class RecentVisitComponent extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      title:'近期访问',
      downUp: false, // 是否显示搜索提醒
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recentVisitComponentModels/getTypeData',
    });

    dispatch({
      type: 'recentVisitComponentModels/getRecentVisitData',
      payload: {id:"999"}
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

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 跳转页面
   * @method jumpHandle
   * @param data 跳转包含的数据
   */
  jumpHandle = (data) =>{
    const {id, url, dateType, ord} = data;
    if(ord === "4"){
      const {token} = Cookie.getCookie('loginStatus');
      const re=/^http.+/;
      const pre=/^http.+\?.+/;
      // const rfctest=/^http.+(\/rfc)+.*/;
      if(re.test(url)){
        if(pre.test(url)){
          window.open(`${url}&ticket=${token}`)
        }else {
          window.open(`${url}?ticket=${token}`)
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
    }else if(ord === "3"){
      const { dispatch } = this.props;
      dispatch({
        type: 'myReportCardModel/getFetchOnlineViewReport',
        payload: {markType: id},
        callback: (res) => {
          if(res.path){
            const w =window.open('about:blank');
            // eslint-disable-next-line
            w.location.href=`${DownloadUrl.urls[1].url}?file=${res.path}`;
          }else {
            message.error("预览失败，权限不足")
          }
        }
      });
    }else {
      router.push({
        pathname:url,
        state:{
          id,
          dateType
        }
      })
    }
  };

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 显示类型
   * @method showselect
   */
  showselect = () =>{
    this.setState({
      downUp: true
    })
  };

  /**
   * @date: 2019/1/30
   * @author liuxiuqian
   * @Description: 选中类型事件
   * @method handleChange
   * @param item 选中的name 和id
   */
  handleChange(item){
    this.setState({
      downUp: false
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'recentVisitComponentModels/setSelectType',
      payload: item
    });
    dispatch({
      type: 'recentVisitComponentModels/getRecentVisitData',
      payload: {id: item.id}
    });
  }



  render(){
    const {recentVisitComponentModels} = this.props;
    const { downUp, title } = this.state;
    const {selectType, recentVisitData, visitData}=recentVisitComponentModels;
    const downUlDom = recentVisitData.map((item)=><li key={item.id} onClick={()=>this.handleChange(item)}>{item.name}</li>);

    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.title}>{title}</span>
          <div className={styles.dropdown}>
            {selectType.name} <Icon onClick={this.showselect} className={styles.dropdownIcon} type="down" />
            {downUp ? <ul onMouseLeave={()=> this.onMouseLeaveFun()} className={styles.downUl}>{downUlDom}</ul> : null}
          </div>
        </header>
        <div className={styles.line} />
        <main className={styles.content}>
          <ListItem recentVisitList={visitData} />
        </main>
      </div>
    );
  }
}
export default RecentVisitComponent;
