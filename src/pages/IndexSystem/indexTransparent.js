/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 指标体系页面/p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author guoshengxiang
 * @date 2019/06/07
 */

import React,{PureComponent} from "react";
import { Tree,Input  } from 'antd';
import { connect } from 'dva/index';
import styles from "./indexTransparent.less";

const { TreeNode, DirectoryTree } = Tree;
const {Search} = Input;

@connect(({ indexSystemData, loading }) => ({
  indexSystemData,
  loading: loading.models.indexSystemData,
}))

class IndexTransparent extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      expandedKeys:[], // 展开树节点集合
      selectedKeys:[], // 被选中的树节点
      autoExpandParent: true, // 是否自动展开父节点
      searchValue:'', // 用户输入的值
    }
  }

  componentDidMount(){
    const {dispatch}=this.props;
    const defaultKey=[];
    dispatch({
      type:"indexSystemData/fetchIndexNav",
      payload:{
        markType:""
      },
      callback:tree=>{
        this.getDefaultKey(tree,defaultKey);
        this.setState({
          expandedKeys:defaultKey,
          selectedKeys:defaultKey,
        });
        dispatch({
          type:"indexSystemData/fetchIndexInfo",
          payload:{
            indexId:defaultKey[0]
          }
        });
      }
    });
  }

  /**
   * 获取树中第一个叶子节点
   * @param tree
   * @param defaultKey
   */
  getDefaultKey=(tree,defaultKey)=>tree.map(item=>{
    if(defaultKey.length===0){
      if(item.isleaf==="1"){
        defaultKey.push(item.id)
      }else if(item.children.length>0) {
        this.getDefaultKey(item.children,defaultKey)
      }
    }
    return null
  });

  /**
   * 递归获取要展开的节点
   * @param tree 目录数据
   * @param value 用户输入的值
   * @param expandedKeys 要展开的节点集合
   */
  getKeys = (tree, value,expandedKeys) => {
    tree.map(item => {
     if (item.children) {
       this.getKeys(item.children, value,expandedKeys);
     }
      if(item.name.indexOf(value)>-1){
        expandedKeys.push(item.id)
      }
      return null
   })
  };

  /**
   * 查询树节点
   * @param value 用户输入的值
   */
  handleSearch=value=>{
    const {indexSystemData:{indexNav}}=this.props;
    const expandedKeys = [];
    this.getKeys(indexNav,value,expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: true,
      searchValue:value,
    });
  };

  /**
   * 树节点展开关闭
   * @param expandedKeys 展开的节点集合
   */
  onExpand=expandedKeys=>{
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  };

  /**
   * 指标详细信息渲染
   * @returns {XML}
   */
  handleIndexInfo=()=>{
    const {indexSystemData:{indexInfo}}=this.props;
    return(
      <div>
        <div className={styles.infoTitle}>{indexInfo.name}</div>
        {indexInfo.infoData.map(item=>(
          <div key={item.id} style={{marginBottom:10}}>
            <div className={styles.font}><div className={styles.corn} />{item.title}:</div>
            <div style={{paddingLeft:15}}>
              {item.content.map((ev,index)=>(<div key={`${index+item.id}`} style={{marginBottom:8}}>{ev}</div>))}
            </div>
          </div>
          ))}
      </div>
    )
  };

  /**
   * 点击叶子节点请求指标详细信息
   * @param keys 被选中的节点id
   * @param event
   */
  handleSelectTree= (keys, event)=>{
    if(event.node.props.isLeaf){
      const {dispatch}=this.props;
      dispatch({
        type:"indexSystemData/fetchIndexInfo",
        payload:{
          indexId:event.node.props.eventKey
        }
      });
      this.setState({
        selectedKeys:keys
      })
    }
  };

  handleDownload=()=>{
    window.open("http://10.244.4.182:8097/pptOnlineView/indexTransparent/中国联通集团经分指标透明化下发省份数据接口规范.docx","_self")
  };

  render(){
    const {indexSystemData:{indexNav,indexInfo}}=this.props;
    const{expandedKeys,autoExpandParent,searchValue,selectedKeys}=this.state;
    const loop = gdata => gdata.map(item => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span style={{color:item.isleaf==="1"?null:"rgba(0,0,0,0.65)"}}>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span style={{color:item.isleaf==="1"?null:"rgba(0,0,0,0.65)"}}>{item.name}</span>
        );
      if (item.children) {
        return (
          <TreeNode isLeaf={item.isleaf==="1"} key={item.id} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf={item.isleaf==="1"} key={item.id} title={title} />;
    });
    return(
      <div className={styles.indexTransparent}>
        <div className={styles.leftTree}>
          <Search placeholder="请输入指标名" onSearch={this.handleSearch} />
          <DirectoryTree
            autoExpandParent={autoExpandParent}
            onSelect={this.handleSelectTree}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
          >
            {loop(indexNav)}
          </DirectoryTree>
          <div className={styles.edgpkpisso}>
            <a href="http://10.249.216.52:9014/dgpsso/edgpkpisso" rel="noopener noreferrer" target="_blank">经分系统常规指标</a>
          </div>
        </div>
        <div className={styles.indexInfo}>
          {indexInfo.name?this.handleIndexInfo():""}
          <span onClick={this.handleDownload} className={styles.download}>接口规范下载</span>
        </div>
      </div>
    )
  }
}
export default IndexTransparent;
