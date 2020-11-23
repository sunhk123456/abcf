/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: markSelect/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/3/1/001
 */


import React, { PureComponent, Fragment } from 'react';
import styles from './markSelect.less'



class IndexScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      indexListShow:false,// 判断指标是否隐藏
      indexType:[],// 指标类型数据
      selectIdAndName:{},// 默认选中第一个

    }
  }

  componentWillMount() {
    const self = this;
    this.setState({
      indexType:self.props.indexType,
      selectIdAndName:self.props.indexTypeIdAndName
    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const {indexType,selectIdAndName}=this.state;
    if(nextProps.indexType.length > 0 && indexType !== nextProps.indexType){
      this.setState({
        indexType:nextProps.indexType,
        /* selectIdAndName:nextProps.indexType[0] */
      });
    }
    if(nextProps.indexTypeIdAndName!==selectIdAndName){
      this.setState({
        selectIdAndName:nextProps.indexTypeIdAndName
      })
    }
  }
  /*
   * 指标点击显示或隐藏事件
   * */

  indexShowFun=()=>{
    // console.log("点击");
    const {indexListShow}=this.state;
    this.setState({
      indexListShow:!indexListShow
    });
  };

  /*
  * 指标选中事件
  * id  选中id
  * name 选中name
  *
  * */
  indexListLiFun=(indexId,indexName,indexUnit)=>{
    const {callBackIndexScreen}=this.props;
    const selectIdAndName = {
      indexId,
      indexName,
      indexUnit
    };
    this.setState({
      indexListShow:false,
      selectIdAndName
    });
    callBackIndexScreen(selectIdAndName);
  };


  mouseLeaveNone=()=>{
    this.setState({
      indexListShow:false
    })
  };

  render() {
    const {indexListShow,indexType,selectIdAndName}=this.state;
    if(indexType.length > 0){
      const {indexName} = selectIdAndName;
      const indexTypeList = indexType.map(
        (data)=> (<li key={data.indexId} title={data.indexName} onClick={this.indexListLiFun.bind(this,data.indexId,data.indexName,data.indexUnit)}>{data.indexName}</li>)
      );
      return (
        <Fragment>
          <div className={indexListShow?styles.click:styles.indexScreen} onClick={this.indexShowFun}>
            <div className={styles.selected}>
              <span title={indexName}>{indexName}</span>
              <span className={styles.productIconCon}>
                <i className={styles.triangle} />
              </span>
            </div>
            <div className={indexListShow?styles.indexList:styles.indexListNone} onMouseLeave={this.mouseLeaveNone}>
              <ul className={styles.indexListUl}>
                {indexTypeList}
              </ul>
            </div>
          </div>
        </Fragment>
      )
    }
    return null;
  }
}
export default IndexScreen

