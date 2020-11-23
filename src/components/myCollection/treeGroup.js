import { connect } from 'dva';
import React, { PureComponent } from 'react';
import isEqual from 'lodash/isEqual';
import { Tree } from 'antd';

// const { TreeNode } = Tree;

@connect(
  ({myCollectionModels}) => (
    {
      myCollectionModels,
    })
)

class TreeGroup extends PureComponent {


  // treeData 树形数据
  constructor(props) {
    super(props);
    this.state = {
      treeData:[],
    }
  }

  componentDidMount() {
    // 引入父组件数据
    // const {downData}=this.props;
    // this.formatTree(downData,"-1")
  }

  // 控制组件更新 比对数据前后变化
  componentDidUpdate(prevProps) {
    const {downData} = this.props;

    if(!isEqual(downData,prevProps.downData)){
      this.formatTree(downData,"newquery")
    }
  }

  // 获取树状数据,key值集合
  onCheck(checkedKeys){
    const {callbackCheckedKeys} =  this.props;
    const collect = checkedKeys.map(val=>JSON.parse(val))
    callbackCheckedKeys(collect);
  };

  /**
   * @date: 2020/3/12
   * @author liuxiuqian
   * @Description: 方法说明 处理树数据
   * @method formatTree
   * @param {array} 参数名 obj 参数说明 待处理数据
   * @param {string} 参数名 rootId 参数说明 顶级父id
   */

  // 处理返回数据
  formatTree(obj,rootId){
    const treeData = obj.filter(parent=>{
      const parentCopy = parent;
      const findChildren = obj.filter(child=>parentCopy.id === child.pId);
      if(findChildren.length>0){
        parentCopy.key=JSON.stringify({markType:parentCopy.id,searchType:parentCopy.searchType});
        parentCopy.checkable = false;
        parentCopy.disableCheckbox = true;
        parentCopy.children = findChildren;
      }else{
        parentCopy.key=JSON.stringify({markType:parentCopy.id,searchType:parentCopy.searchType});
        parentCopy.children = []
      }
      return parentCopy.pId === rootId   // 返回顶层，依据实际情况判断这里的返回值
    })
    this.setState({treeData})
  }



  render() {
    const {treeData} = this.state;
    return (
      <Tree
        checkable
        onCheck={(checkedKeys)=>this.onCheck(checkedKeys)}
        treeData={treeData}
      />
    );
  }
}
export default TreeGroup;
