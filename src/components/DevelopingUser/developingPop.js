/**
 *用户发展真实性测试弹出组件主体
 *by:CaoRuining
 */
import React, { PureComponent } from 'react';
import {connect} from 'dva'
import yangshi from './developingPop.less';
import clickIcon from './charts.png';
import RegionalBar from './regionalBar';
import TrendLine from './trendLine';
import AnalysisTable from './analysisTable';


@connect(
  ({developingUserCom}) => ({
    indexDate:developingUserCom.indexDate,
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
    chartsStatus:developingUserCom.chartsStatus,
    analysisTableData:developingUserCom.analysisTableData,
    comKind:developingUserCom.comKind,
    comRegional:developingUserCom.comRegional,
  })
)


class DevelopingPop extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){

  }

  componentDidMount(){

  }


  /**
   * 功能：关闭组件
   */
  hiddenPop = ()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'developingUserCom/fetchPopStatus',
      payload:{
        chartsStatus:'none'
      }
    });
  };


  render() {
    const {chartsStatus,comKind,comRegional,indexType1} = this.props;
    return (
      <div className={yangshi.popOuter} style={{display:chartsStatus}}>
        <div className={yangshi.popInner}>
          <div className={yangshi.content}>
            {`${comKind} > ${comRegional}`}
          </div>
          <RegionalBar indexType1={indexType1} />
          <TrendLine indexType1={indexType1} />
          <AnalysisTable indexType1={indexType1} />
        </div>
        <div className={yangshi.clickButton} onClick={()=>this.hiddenPop()}>
          <img src={clickIcon} alt="" />
        </div>
      </div>
    );
  }

}

export  default DevelopingPop;
