/**
 * @Description: 家庭视图情况页面
 *
 * @author: 王健
 *
 * @date: 2019/12/9
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './index.less';
import HomeViewSecondTab from '../../components/HomeView/secondTab';
import HomeViewFirstTab from '../../components/HomeView/firstTab';
import CollectComponent from '../../components/myCollection/collectComponent';

@connect(({ homeViewModels }) => ({
  homeViewModels,
  specialName:homeViewModels.specialName,
  selectIndex:homeViewModels.selectIndex,
  tabId:homeViewModels.tabId,
  markType:homeViewModels.markType,
  dateType:homeViewModels.dateType,
  titleData:homeViewModels.titleData,
}))

class HomeView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.getTitleData();
  }

  // 获取页签数据
  getTitleData=()=>{
    const { dispatch,markType,dateType} = this.props;
    const params={
      markType,
      dateType,
    };
    dispatch({
      type: `homeViewModels/getTitleData`,
      payload: params,
    });
  };

  setTable=(index,item)=>{
    const {dispatch}=this.props;
    dispatch({
      type: `homeViewModels/getTabId`,
      payload: {
        selectIndex:index,
        tabId:item.id
      },
    });

  };

  render() {
    const {titleData,selectIndex,markType}=this.props;
    const {titleName,list}=titleData;
    let tab=null;
    if(list){
      tab=list.map((item,index)=>
        (<div key={item.id} className={selectIndex===index?styles.active:styles.tableItem} onClick={()=>this.setTable(index,item)}>{item.name}</div>)
      );
    }
	const collectStyle ={
      marginLeft:'1%',
	  marginBottom:'10px'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
		  <span>
			<span className={styles.titleName}>{titleName}</span>
		    <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
		  </span>
          <div className={styles.content}>
            <div className={styles.table}>
              {tab}
            </div>
          </div>
          <div className={styles.main}>
            {
              selectIndex === 0 &&
              <HomeViewFirstTab />
            }
            {
              selectIndex === 1 &&
              <HomeViewSecondTab />
            }
          </div>
        </div>
      </PageHeaderWrapper>




    )
  }
}

export default HomeView;
