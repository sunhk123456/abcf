/**
 *用户发展真实性测试弹出组件主体
 *by:CaoRuining
 */
import React, { PureComponent } from 'react';
import {connect} from 'dva'
import yangshi from './developingPop.less';
import clickIcon from './charts.png';
import TrendLine from './trendLine';
import AnalysisTable from './analysisTable';


@connect(
  ({developingUserCom}) => ({
    indexType:developingUserCom.indexType,
    indexDetailsShow:developingUserCom.indexDetailsShow,
  })
)

@connect(({ IceCream, loading }) => ({
  IceCream,
  loading: loading.models.IceCream,
  indexDate:IceCream.indexDate,
  comStatus:IceCream.comStatus,
  analysisTableData:IceCream.analysisTableData,
  chartsStatus:IceCream.chartsStatus,
  comKind:IceCream.comKind,
  comRegional:IceCream.comRegional,
}))

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
      type:'IceCream/fetchPopStatus',
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
            <h2>
              {`${comKind} > ${comRegional}`}
            </h2>
          </div>
          <TrendLine indexType1={indexType1} />
          <AnalysisTable />
        </div>
        <div className={yangshi.clickButton} onClick={()=>this.hiddenPop()}>
          <img src={clickIcon} alt="" />
        </div>
      </div>
    );
  }

}

export  default DevelopingPop;
