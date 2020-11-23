import React,{PureComponent} from 'react';
import {connect} from "dva";
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './5gRealtimeMonitor.less'
import Section5G from '../../components/5gRealtimeMonitor/section';
import SectionTotle from '../../components/5gRealtimeMonitor/sectionTotle';
import CollectComponent from '../../components/myCollection/collectComponent'; // 收藏组件


@connect(
  ({
     RealtimeModel,
   }) => ({
     RealtimeModel,
  })
)
class RealTimeMonitor extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      'markType':'5G_REALTIME_D',
      'selectIndex':0,
      'tabId':'',
      'refresh':'页面实时数据刷新频率:1分钟/次',
    };
  }

  componentDidMount() {
    this.initRequest()
  }

  initRequest = () => {
    const { dispatch } = this.props;
    const { markType } = this.state;
    const params = {
      markType,
    };
    dispatch({
      type: `RealtimeModel/getTitleData`,
      payload: params,
      callback:(res)=>{
        if(res.list[0]){
          this.setState({tabId:res.list[0].id})
        }
      }
    });
  };

  setTable=(index,item)=>{
    console.log('tab被点击');
    console.log(item);
    this.setState({
      selectIndex:index,
      refresh:item.refresh,
      tabId:item.id
    })
  };

  render(){
    const {RealtimeModel}=this.props;
    const {titleData}=RealtimeModel;
    if(!titleData){return null}
    const {titleName,list}=titleData;
    const {selectIndex,refresh,tabId,markType}=this.state;
    const tab=list.map((item,index)=>
      (<div key={item.id} className={selectIndex===index?styles.active:styles.tableItem} onClick={()=>this.setTable(index,item)}>{item.name}</div>)
    );
    let contentDom = null;
    if(tabId !== "" && selectIndex === 0){
      contentDom = (<Section5G titleName={titleName} tabId={tabId} />)
    }else if(tabId !== "" && selectIndex === 1){
      console.log(SectionTotle)
      console.log(tabId)
      contentDom = (<SectionTotle titleName={titleName} tabId={tabId} />)
    }
    // 收藏图标样式
    const collectStyle ={
      marginLeft: '10px',
      paddingBottom:'3px',
      width:'30px'
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.titleName}>
            {titleName}
            <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
          </div>
          <div className={styles.content}>
            <div className={styles.table}>
              {tab}
            </div>
            <div className={styles.details}>{refresh}</div>
          </div>
          <div className={styles.main}>
            {contentDom}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default RealTimeMonitor
