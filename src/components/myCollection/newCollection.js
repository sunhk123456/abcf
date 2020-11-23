import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Input, message } from 'antd';
import styles from "./newCollection.less"
import TreeGroup from '@/components/myCollection/treeGroup'; // 新增收藏
import img from "../../assets/image/leftMenu/u1635.png"

const { Search } = Input;
// 进入返回参数
@connect(
  ({myCollectionModels,recentVisitComponentModels}) => (
    {
      myCollectionModels,
      downData:myCollectionModels.downData,
      recentVisitComponentModels
    })
)

class NewCollection extends PureComponent {

  // visible 控制弹出
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      requestData:[],
      value: ''
    }
  }

  // 获取子组件方法
  componentDidMount() {
    const { childEvevnt } = this.props;
    childEvevnt(this);
  }

  // 弹出对话窗
  showModal = () => {
    this.setState({
      visible: true,
      collect:[],
    });
  };

  // 提交收藏请求
  handleOk = () => {
    const {collect} = this.state;
    if(collect.length === 0) {
      message.error("请选择要添加的内容")
    }else {
      this.addCollect();
      this.setState({
        visible: false,
        value:''
      });
    }

  };

  // 关闭对话框
  handleCancel = () => {
    this.setState({
      visible: false,
      requestData : [],
      value:''
    });
  };

  // 点击搜索按钮
  handelChange = val =>{
    // 发请求
    const {dispatch} = this.props;
    if(val){
      dispatch({
        type: 'myCollectionModels/getDownData',
        payload: {moduleId:"111",search:val},
        callback:(response)=>{
          this.setState({
            requestData:response
          })
        }
      });
    }else{
      message.error("请输入搜索内容");
    }
  }

  /**
   * @date: 2020/3/13
   * @author liuxiuqian
   * @Description: 方法说明 记录选中的内容
   * @method 方法名 callbackCheckedKeys
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */

  // 返回请求状态
  callbackCheckedKeys(collect){
    this.setState({collect})
  }

  /**
   * @date: 2020/3/13
   * @author liuxiuqian
   * @Description: 方法说明 添加收藏请求
   * @method 方法名addCollect
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */

  // 新增收藏
  addCollect(){
    const {myCollectionModels:{moduleId},dispatch} = this.props;
    const {collect} = this.state;
    dispatch({
      type: 'myCollectionModels/getAddRequest',
      payload: {
        collect,
        moduleId
      },
      callback:(response)=>{
        if(response.code === "200"){
          this.setState({
            requestData : []
          })
          this.upDateCollecdList();
          message.success(response.message)
        }else {
          message.error(response.message)
        }
      }
    });
  }

  /**
   * @date: 2020/3/20
   * @author liuxiuqian
   * @Description: 方法说明 更新收藏列表
   * @method 方法名 upDateCollecdList
   */
  upDateCollecdList(){
    const { dispatch,myCollectionModels:{moduleId,tabId},recentVisitComponentModels} = this.props;
    const { selectType } = recentVisitComponentModels;
    const params = {
      moduleId,
      searchType: tabId ,
      currentPage: '1',
      num: '10',
    };
    dispatch({
      type: `myCollectionModels/clearSearchData`,
      payload: [],
    });
    dispatch({
      type: 'myCollectionModels/getSearchData',
      payload: params,
      // sign: true, // 若为非滚动时间都需要传这个标志
    });
    // 新增收藏,刷新近期访问
    dispatch({
      type: 'recentVisitComponentModels/getRecentVisitData',
      payload: selectType
    });
  };

  render() {
    const { visible,requestData,value} = this.state;
    const {downData}=this.props;

    return (
      <div>
        <Modal
          title="内容检索"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.modalMain}
        >
          <div className={styles.pageQuery}>
            <Search className={styles.input} value={value} placeholder="请输入关键字搜索系统应用,可按搜索结果添加收藏" onChange={e => this.setState({value:e.target.value})} onSearch={val=>this.handelChange(val)} />
            <div>
              <img className={styles.img} src={img} alt="" />
            </div>
          </div>
          <p className={styles.textP}>备注:检索结果中不包含已收藏内容</p>
          <div className={styles.card}>
            <TreeGroup className={styles.treeList} callbackCheckedKeys={(collect)=>this.callbackCheckedKeys(collect)} downData={requestData} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default NewCollection;
