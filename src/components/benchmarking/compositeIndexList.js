/**
 * desctiption 横向对标复合指标组件

 * created by mengyajing

 * date 2019/4/29
 */

import React, {Component} from 'react';
import { Tree, Input,Modal, Button,Icon,message } from "antd";
import { connect } from "dva";
import styles from './compositeIndexList.less';


const {Search} = Input;
const {TreeNode} = Tree;
@connect(({compositeIndexList, benchMarking })=>({
  markType:benchMarking.markType,
  templateId:benchMarking.templateId,
  tree:compositeIndexList.tree,
  treeData:compositeIndexList.treeData,
  selected:compositeIndexList.selected,
}))
 class CompositeIndexList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false, // 是否显示弹出框
			      selected:[], // 被选中项
            expandedKeys: [], // tree组件 展开指定树节点
            autoExpandParent: true, // tree组件属性，是否默认展开
        }
    }

  componentDidUpdate(){
         // 选中的指标
          const {selected} = this.state;
          selected.forEach((item)=>{
              if(this.refs[`checkbox${item.id}`]){
                  this.refs[`checkbox${item.id}`].checked = true;
              }
          })
      }

  /**
   * 展开/收缩回掉函数
   * @param expandedKeys
   * @param enent
   */
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

  /**
   * 搜索
   * @param value
   */
    onSearch = (value) => {
      const {tree} = this.props;
      const expandedKeys =[];
        if(value!==""){
            tree.forEach((item)=>{
                if(item.name.indexOf(value)>-1){
                    expandedKeys.push(item.id);
                }
            })
        }
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    }
    // 选择
    // onSelect=(selectedKeys,e)=>{
    //     console.log("-----------",selectedKeys,e)
    //     const {hasChildren,eventKey,title} = e.node.props;
    //     const {selected} = this.state;
        // selected集合新增key
//   if(e.selected){
//      selected.push[{value:eventKey,name:title}];
//   }else{
//      const removeIndex = selected.find((item,index)=>{if(item.value=== eventKey){return index}});
//      selected.splice(removeIndex,1);
//   }
//   this.setState({
//    selected:selected
//   })

    // 改变节点前input框的状态
    //     if(!hasChildren){
    //         if(e.selected){
    //             if( this.refs["checkbox"+eventKey].checked !== true){
    //                 this.refs["checkbox"+eventKey].checked = true
    //             }
    //         }else{
    //             this.refs["checkbox"+eventKey].checked = false;
    //         }
    //
    //     }
    // }
    // 点击子项checkbox的事件
    inputClick=(event,node)=>{
        const {selected} = this.state;
        const {id} = node;
        if(this.refs[`checkbox${id}`].checked){
          if(selected.length<20){
            selected.push(node);
          }else {
            message.open({
              content:"同时选择指标数不能超过20！",
              duration:2,
              icon:<Icon type="info-circle" style={{color:"#e80c0c"}} theme="filled" />
            })
          }

        }else{
            let removeIndex;
            selected.forEach((item,index)=>{
                if(item.id=== id){
                    removeIndex = index
                }
            });
            selected.splice(removeIndex,1);
        }
        this.setState({
            selected
        })
        // event.preventDefault();//  不阻止默认选中、删除事件，执行onSelect
        event.stopPropagation();// 阻止冒泡事件，不执行onSelect
    }

    // 显示弹出模块
    showModal=()=>{
      const {selected} = this.props;
      const selectedItem = [...selected];

      this.setState({
        visible:true,
        selected: selectedItem
      })
    }

    // 移除选中项
    removeSelected=(data)=>{
     const {selected} = this.state;
     if(this.refs[`checkbox${data.id}`]){
       this.refs[`checkbox${data.id}`].checked = false;
     }
     let removeIndex;
     selected.forEach((item,index)=>{
       if(item.id=== data.id){
         removeIndex = index
       }
     });
     selected.splice(removeIndex,1);
     this.setState({
       selected
     })
   }

  /**
   * 确定选中的指标
   */
    isSureSelected=()=>{
        const {dispatch} = this.props;
        const {selected} = this.state;
        dispatch({
          type:"compositeIndexList/setSelected",
          payload:selected,
        });
      this.setState({
        expandedKeys: [], // 2019.8.21
        visible:false
      })
    };

  /**
   * 取消选中的指标
   */
    closeModal=()=>{
      this.setState({
        expandedKeys: [], // 2019.8.21
        visible:false
      })
    };

    render(){
        const {treeData} = this.props;
        const wid = window.screen.width;
        let widthModal = 800;
        if(wid > 700 && wid < 961 ){
          widthModal = 600;
        }else if(wid > 961 &&  wid<1100)
          widthModal = 800;
        const {expandedKeys, autoExpandParent,visible,selected } = this.state;
        const loop = data => data.map((item) => {
            if (item.children  && item.children.length) {
                return (
                  <TreeNode selectable={false} key={item.id} title={item.name} hasChildren>
                    {loop(item.children)}
                  </TreeNode>
                );
            }
            const nodeParam = {
                name:item.name,
                id:item.id
            };
            const res = selected.find((e) =>e.id ===item.id);
            // const isChecked = selected.some((selectInput)=>selectInput.value===item.key)
            const noChild = <span className={styles.lastLevel}><input type="checkbox" checked={!(res === undefined)} key={`checkbox${item.id}`} ref={`checkbox${item.id}`} onClick={(event)=>{this.inputClick(event,nodeParam)}} readOnly="readonly" /> {item.name}</span>;
            return <TreeNode key={item.id} title={noChild} hasChildren={false} />;
        });
        const selectedLayOut = data => data.map(item =>
          (
            <div className={styles.selectedItem} key={`selected${item.id}`}>
              <span>{item.name}</span>
              <Icon type="close-circle" style={{float:"right",paddingBottom:"1%"}} onClick={()=>this.removeSelected(item)} />
            </div>
          )
        );
        return(
          <div className={styles.bmIndexList}>
            <span className={styles.bmIndexListTitle}>指标：</span>
            <Button onClick={this.showModal}>
              复合指标
              <Icon type="caret-down" className={styles.iconCaretDown} />
            </Button>
            <Modal width={widthModal} visible={visible} bodyStyle={{ height:500,backgroundColor:'#F7F7F7' }} footer={null} closable={false}>
              <div className={styles.content}>
                <div className={styles.contentLeft}>
                  <div className={styles.indexSearch}>
                    <Search allowClear placeholder="搜索" onSearch={(value)=>{this.onSearch(value)}} />
                  </div>
                  <div className={styles.indexMenu}>
                    <div>复选指标</div>
                    <Tree
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                    >
                      {loop(treeData)}
                    </Tree>
                  </div>
                </div>
                <div className={styles.contentCenter}>
                  <p className={styles.centerTitle}>指标选择</p>
                  <Icon className={styles.rightIcon} type="right"  />
                </div>
                <div className={styles.contentRight}>
                  <div className={styles.rightList}>
                    <div>已选指标</div>
                    <div className={styles.divList}>
                      {selectedLayOut(selected)}
                    </div>
                    <div className={styles.bottom}>
                      <Button className={styles.menuBtn} type="primary" onClick={this.isSureSelected}>确定</Button>
                      <Button className={styles.menuBtn} type="primary" onClick={this.closeModal}>取消</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )
    }
}
export default CompositeIndexList;
