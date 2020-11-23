/**
 * @Description: 新增异常指标列表
 *
 * @author: sunrui
 *
 */
import React, {Component} from "react";
import {connect} from 'dva';
import styles from './WarnIndexSelected.less';
import pullImg from './pull.png';
import deleteImg from './delete.png';

@connect(({ warnIndexSelected, loading }) => ({
  indexLists:warnIndexSelected.indexLists,
  searchList:warnIndexSelected.indexLists,
  loading: loading.models.warnIndexSelected,
}))
class WarningIndexClass extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected:'',
      searchList:props.indexLists,
      markSelectShow:true,
      closeImg:true,
      indexList:props.indexLists
    }
  }


  componentDidMount() {
    const {dispatch,onRef} = this.props;
    dispatch({
      type:'warnIndexSelected/fetchIndexLists',
      payload:{}
    });
    onRef(this)
  };


  static getDerivedStateFromProps(nextProps,prvstate){
    if (nextProps.indexLists !== prvstate.indexList && nextProps.indexLists.length >0) {
      return {
        searchList:nextProps.indexLists,
        indexList:nextProps.indexLists,
      };
    }
    return null;
  }


  Regx = (str) => {
    // 解析字符串类型，若为全字符串可以完全展示
    const Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(str))
    {
      return str;
    }
    if(str.length>15){                      // 控制数据的显示字数
      return `${str.substring(0,14)}...`;
    }
    return str;
  }

  /**
   *  选择一个指标
   * @param id
   * @param name
   */
  selectMark = (id,name) =>{
    this.setState({
      markSelectShow:true,
      selected:name
    })
    this.hiddenImg();
    this.getSelectIndex(id,name)
  }

    /**
      *  功能：选择一个指标
      * */
  getSelectIndex = (indexId) => {
    // reducers把indexid放到store里
    const {dispatch} = this.props;
    dispatch({
      type:'warnIndexSelected/getIndexId',
      payload:indexId
    })
  }



  /**
   * 展示重置按钮
   */
  showImg = () =>{
    this.setState({
      markSelectShow:false,
      closeImg:false
    })
  }



  /**
   * 重置指标列表和选中内容
   */
  resetMark = () =>{
    const {indexLists} = this.props;
    this.setState({
      selected:"",
      searchList:indexLists
    })
  }

  /**
   * 监控搜索框中内容的改变
   */
  watchDivChange = (e) =>{
    const sel = e.target.value;
    let selected = this.Regx(sel);
    selected = selected.slice(0,selected.indexOf(".") === -1 ? selected.length : selected.indexOf("."));
    const {indexLists} = this.props;
    let searchArr = [];// 检索出的list
    if(selected === "" ){
      searchArr = indexLists;
    }else {
      // console.log("indexLists")
      // console.log(indexLists)
      // console.log("selected")
      // console.log(selected)
      for(let j = 0,len=indexLists.length; j < len; j+=1) {
        // console.log(j)
        if(indexLists[j].indexName.toLowerCase().indexOf(selected.toLowerCase()) >= 0){
          searchArr.push(indexLists[j]);
        }
      }
    }

    this.setState({
      selected,
      searchList:searchArr,
    })
  }

  /**
   * 隐藏重置按钮
   */
  hiddenImg(){
    this.setState({
      closeImg:true
    })
  }

  /**
   * 隐藏指标列表
   */
  hideMark(){
    this.setState({
      markSelectShow:true
    })
  }

  /**
   * 功能：重置input框选中的内容
   */
  resetSelected(){
    this.setState({selected:''});
  }

  /**
   * 按钮点击事件控制指标列表
   */
  btnClick(){
    const {markSelectShow} = this.state;
    this.setState({
      markSelectShow: !markSelectShow
    })
  }

  render(){
    const {markSelectShow,closeImg,searchList,selected} = this.state;
    let show = null;
    if(searchList.length > 0){
      show = searchList.map((d)=> {
        const {indexId,indexName} = d;
        return(
          <p
            key={d.indexId}
            className={styles.manageMarkSelectShowP}
            onClick={() => {this.selectMark(indexId,indexName)}}
          >{d.indexName}({d.indexId})
          </p>)
      })
    }
      return(
        <div className={styles.manageMarkSelect} onMouseLeave={()=>this.hideMark()}>
          <div className={styles.manageMarkSelectHideMain}>
            <input
              type="text"
              className={styles.manageMarkSelectMain}
              placeholder="请输入指标名称"
              value={selected}
              onFocus={()=>this.showImg()}
              onChange={this.watchDivChange.bind(this)}
            />
            <img
              className={styles.manageMarkSelectClose}
              alt=""
              style={{display:closeImg?'none':'inline-block'}}
              src={deleteImg}
              onClick={this.resetMark.bind(this)}
            />
            <img alt="" className={styles.manageMarkSelectHide} src={pullImg} onClick={()=>this.btnClick()} />
          </div>
          <div className={styles.manageMarkSelectShow} style={{visibility:markSelectShow?'hidden':'visible'}}>
            {show}
          </div>

        </div>
      )
  }
};

export default WarningIndexClass
