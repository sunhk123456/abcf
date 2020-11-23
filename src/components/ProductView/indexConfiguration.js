/* eslint-disable no-param-reassign,arrow-body-style,react/no-unused-state,no-else-return,prefer-template,react/destructuring-assignment,no-unused-vars,no-plusplus,array-callback-return,no-lonely-if,consistent-return,prefer-const,object-shorthand,prefer-destructuring,react/jsx-no-bind,react/jsx-tag-spacing,jsx-a11y/mouse-events-have-key-events */
/**
 *
 * title: productOvewView
 *
 * description:  产品总览-指标配置
 *
 * @author: guoshengxiang
 *
 * @date 2019/06/05
 *
 */
import React, { PureComponent } from 'react';
import { Modal,Icon,Input,Form,Button } from 'antd';
import { connect } from 'dva/index';
import isEqual from 'lodash/isEqual';
import styles from './indexConfiguration.less';

const Search = Input.Search;

@connect(({productViewModels}) =>({
  productViewModels,
}))

@Form.create()
class IndexConfiguration extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      visible:false, // 是否显示弹框
      mockData:props.productViewModels.mockData, // 所有指标
      dataSource:props.productViewModels.mockData, // 左侧展示待选指标
      targetKeys:[], // 右侧展示已选指标
      saveData:[], // 每次显示弹窗的已选指标
    }
  };

  componentDidMount() {
    const { saveIndexConfig} = this.props;
    if(saveIndexConfig){
      this.setState({saveData:saveIndexConfig})
    }
  }

  componentDidUpdate(pevProps,pevState){
    const{visible,saveData}=this.state;
    if(!pevState.visible&&visible){
      this.setState({
        targetKeys:saveData,
        mockData:this.props.productViewModels.mockData, // 所有指标
        dataSource:this.props.productViewModels.mockData, // 左侧展示待选指标
      })
    }
  }

  componentWillUnmount(){
    const {dispatch}=this.props;
    dispatch({
      type:"productViewModels/getIndexConfig",
      payload:[]
    })
  }

  handleClickLeft=(e)=>{
    const {dataSource,targetKeys}=this.state;
    dataSource.map(item=>{
      if(item.indexId===e&&targetKeys.filter(list=>list.indexId===e).length===0){
        this.setState({
          targetKeys:[
            ...targetKeys,
            item
          ]
        })
      }
    })
  };

  handleDelete=(e)=>{
    const {targetKeys}=this.state;
    this.setState({
      targetKeys:targetKeys.filter(item=>item.indexId!==e)
    })
  };

  handleSearch=(value)=>{
    const {mockData}=this.state;
    if(value){
      this.setState({
        dataSource:mockData.filter(item=>item.indexName.toLowerCase().includes(value.toLowerCase()))
      })
    }else {
      this.setState({
        dataSource:mockData
      })
    }
  };

  handleOk=()=>{
    const {dispatch}=this.props;
    const {targetKeys}=this.state;
    dispatch({
      type:"productViewModels/getIndexConfig",
      payload:targetKeys
    });
    this.setState({
      visible:false,
      saveData:targetKeys,
    })
  };

  render(){
    const {visible,dataSource,targetKeys}=this.state;
    const leftList=dataSource.map(item=>{
      return (
        <div className={styles.listItem} key={item.indexId} onClick={()=>this.handleClickLeft(item.indexId)}>{item.indexName}</div>
      )
    });
    const rightList=targetKeys.map(item=>{
      return (
        <div className={styles.listItem} key={item.indexId}>
          {item.indexName}
          <Icon
            type="close-circle"
            style={{position:"absolute",right:0}}
            onClick={()=>this.handleDelete(item.indexId)}
          />
        </div>
      )
    });
    return (
      <div className={styles.indexConfiguration}>
        <Button onClick={()=>this.setState({visible:true})} className={styles["productView-indexConfiguration"]}>
          指标配置
        </Button>
        <Modal
          destroyOnClose
          closable={false}
          centered
          width={window.screen.width>1869?"50%":"55%"}
          visible={visible}
          footer={null}
          onCancel={()=>this.setState({visible:false})}
        >
          <div>
            <div className={styles.modalTitle}>
              <span className={styles.font}><div className={styles.corn} />指标配置</span>
              <Search
                onSearch={this.handleSearch}
                style={{width:200,marginRight:18,backgroundColor: "rgba(241, 241, 241, 1)"}}
              />
            </div>
            <div className={styles.modalTransfer}>
              <div className={styles.transferList}>
                <div className={styles.transferTitle}>选择指标</div>
                <div className={styles.leftList}>
                  {leftList}
                </div>
              </div>
              <div className={styles.transferList}>
                <div className={styles.transferTitle}>已选指标</div>
                <div className={styles.rightList}>{rightList}</div>
                <div className={styles.bottomButton}>
                  <Button onClick={this.handleOk}>确认</Button>
                  <Button onClick={()=>{this.setState({visible:false})}}>取消</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default IndexConfiguration;
