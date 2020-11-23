import React,{Component,Fragment} from "react";
import { Icon } from 'antd';
import { connect } from 'dva';
import styles from './SingleScreen.less';

@connect(
  ({
     singleIndicatorsDataModels
   }) => ({
    singleIndicatorsDataModels
  })
)
class SingleScreen extends Component{
  constructor(props){
    super(props)
    this.state={
      listShow:false,
      showDelete:false,
      indexData:[],
      inputValue:null,
    }
  }

  componentWillMount() {
    const {indexData}=this.props;
    this.setState({
      indexData,
    })
  }

  componentWillReceiveProps(nextProps) {
    const {indexData,}=this.state;
    if(nextProps.indexData !== indexData && nextProps.indexData.length>0){
      this.setState({
        indexData:nextProps.indexData,
      })
    }
    if (nextProps.singleIndicatorsDataModels.isFirst===true
      && nextProps.singleIndicatorsDataModels.indexData.length>0
      && indexData !== nextProps.singleIndicatorsDataModels.indexData) {
      this.setState({
        inputValue: nextProps.singleIndicatorsDataModels.indexData[0].indexName,
      });
    }
  }

  isShowList=()=>{
    const {listShow}=this.state
    this.setState({
      listShow:!listShow
    })
  }

  mouseoutNone=()=>{
      this.setState({
        listShow:false,
      })
  }

  onChangeInputValue=(e)=>{

    let selectName=e.currentTarget.value;
    if(selectName){
      this.showDelete()
    }else{
      this.hiddenDelete()
    }
    selectName = selectName.slice(0,selectName.indexOf(".")=== -1 ? selectName.length:selectName.indexOf("."));
    this.setState({ inputValue:selectName })
    const {dispatch} = this.props;
    dispatch({
      type: 'singleIndicatorsDataModels/fetchIndexListData',
      payload: {
        markType: "016",
        search: selectName,
        isFirst:false,
      }
    });

    this.setState({
      listShow:true
    })
  }

  liOnClicked=(e)=>{
    this.setState({
      inputValue:e.currentTarget.innerHTML,
      listShow:false,
      showDelete:false,
    })
    const {callbackIndexData}=this.props
    const {id}=e.currentTarget
    const name=e.currentTarget.innerHTML
    callbackIndexData(id,name)
  }

  /**
   * 点击删除按钮删除搜索框中的内容
   */
  deleteContent=()=>{
    this.setState({
      inputValue:""
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'singleIndicatorsDataModels/fetchIndexListData',
      payload: {
        markType: "016",
        search: "",
      }
    });
    this.setState({
      listShow:true
    })
  }

  /**
   * 显示删除按钮
   */
  showDelete=()=>{
    this.setState({
      showDelete:true,
    })
  }

  /**
   * 隐藏删除按钮
   */
  hiddenDelete=()=>{
    this.setState({
      showDelete:false,
    })
  }


  render(){
    const {listShow,indexData,inputValue,showDelete}=this.state;
    let singleList=null;
    if(indexData.length>0){
       singleList=indexData.map((item)=> (<li key={item.indexId} id={item.indexId} onClick={this.liOnClicked}>{item.indexName}</li>))
    }
    return(
      <Fragment>
        <div className={styles.item}>
          <div>
            <div className={styles.singleContentName}>
              <input
                type="text"
                className={styles.singleInput}
                value={inputValue}
                onChange={this.onChangeInputValue}
                onFocus={this.showDelete}
              />
              <div className={showDelete?styles.singleDelete:styles.none} onClick={this.deleteContent}>
                <Icon type="close"  />
              </div>
            </div>
            <div className={styles.singleIconCon} onClick={this.isShowList}>
              <div className={styles.triangle} />
            </div>
          </div>
          <div className={listShow?styles.singleList:styles.none} onMouseLeave={this.mouseoutNone}>
            <ul className={styles.singleUl}>
              {singleList}
            </ul>
          </div>
        </div>
      </Fragment>
    )
  }
}
export default SingleScreen
