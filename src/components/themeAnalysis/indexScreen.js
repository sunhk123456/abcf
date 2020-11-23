/**
*   xingxiaodong 20190225
 *   移动业务计费收入分析专题观察指标组件
* */

import React, { PureComponent, Fragment } from 'react';
import xxdStyle from './indexScreen.less'



class IndexScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      indexListShow:false,// 判断指标是否隐藏
      indexType: [],// 指标类型数据
      selectIdAndName:props.indexType[0],// 默认选中第一个

    }
  }

  componentWillMount() {
    const self = this;
    this.setState({
      indexType:self.props.indexType
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
  indexListLiFun=(id,name)=>{
    const {callBackIndexScreen}=this.props;
    const selectIdAndName = {
      id,
      name
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
    // console.log(indexListShow);
    if(indexType.length > 0){
      const {name} = selectIdAndName;
      const indexTypeList = indexType.map(
        (data)=> (<li key={data.id} onClick={this.indexListLiFun.bind(this,data.id,data.name)}>{data.name}</li>)
      );
      return (
        <Fragment>
          <div className={xxdStyle.indexScreen} onClick={this.indexShowFun}>
            <span>{name}</span>
            <span className={xxdStyle.productIconCon}>
              <i className={xxdStyle.triangle} />
            </span>
            <div className={indexListShow?xxdStyle.indexList:xxdStyle.indexListNone} onMouseLeave={this.mouseLeaveNone}>
              <ul className={xxdStyle.indexListUl}>
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

