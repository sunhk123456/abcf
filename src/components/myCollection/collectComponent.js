/**
 * @Description: 收藏组件
 *
 * @author: yinlingyun
 *
 * @date: 2020/03/09
 */
import React,{PureComponent,Fragment} from 'react';
import { message, Modal } from 'antd';
import {connect} from "dva";
import checked from '@/assets/image/search/checked.png';
import unchecked from '@/assets/image/search/unchecked.png';
import styles from './collectComponent.less';

@connect(
  ({ myCollectionModels }) => ({
    myCollectionModels,
  }))

class CollectComponent extends PureComponent{
  constructor(props){
      super(props);
      this.state={
        collectId:'',
        isCollected:false,
        popVisible:false,
        showUp:true,
        type:''
      };
  };

  componentDidMount() {
    const {searchType,markType,dispatch,isCollect,collectId}=this.props;
    let type;
    switch(searchType){
      case '专题':
        type = '2';
        break;
      case '指标':
        type = '1';
        break;
      case '报告':
        type = '3';
        break;
      case '报表':
        type = '4';
        break;
      case '其他':
        type = '5';
        break;
      default:
        type = searchType;
    }
    this.setState({
      type
    });
    if(markType!=='' && searchType!==''){
      if(isCollect){
        this.setState({
          collectId,
          isCollected:isCollect !== '0'
        });
      }else{
        dispatch({
          type: `collectionComponentModels/getCollectionState`,
          payload: {
            markType,
            searchType:type,
            moduleId:'111'
          },
          callback: (res) => {
            if(res){
              // 替换collectId
              this.setState({
                collectId:res.collectId,
                showUp:res.collectable!=='0',
                isCollected:res.collectId !== ''
              });
            }
          }
        });
      }
    }

  }

  updateCollectState=(collectId,type,markType)=>{
    const { dispatch }=this.props;
    const { isCollected,popVisible } = this.state;
    // 若想要取消收藏就弹出弹窗
    if(isCollected){
      this.setState({
        popVisible:!popVisible
      })
    }else{
      const params={
        type,// 类型
        collectId,
        markType, // 收藏的专题/指标/报告/报表id
        isCollectId:isCollected?'0':'1', // 表明是收藏还是取消收藏,收藏传0，取消收藏传1
        moduleId:'111'
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        callback: (res) => {
          // 收藏接口正常返回
          if(res.code==='200'){
            this.setState({
              isCollected:!isCollected, // 更新收藏状态
              collectId:res.collectId // 更新条目的collectId
            });
            message.success(res.message);
          }else{
            message.error(res.message);
          }
        }
      })
    }
  };

  modalButtonFun = (buttonType) =>{
    const { dispatch,markType }=this.props;
    const { isCollected,popVisible,collectId,type } = this.state;
    // 当点击弹窗的确定按钮时
    if(buttonType==='ok'){
      const params = {
        type,// 类型
        collectId,
        markType, // 收藏的专题/指标/报告/报表id
        isCollectId:isCollected?'0':'1', // 表明是收藏还是取消收藏,收藏传0，取消收藏传1
        moduleId:'111'
      };
      dispatch({
        type: 'searchPageModels/getCollectionData',
        payload: params,
        callback: (res) => {
          // 收藏接口正常返回
          if(res.code==='200'){
            this.setState({
              isCollected:!isCollected, // 更新收藏状态
              collectId:res.collectId, // 更新条目的collectId
              popVisible:!popVisible  // 关闭弹窗
            });
            message.success(res.message);
          }
          // 返回不正常弹出警示信息
          else{
            message.error(res.message);
            this.setState({
              popVisible:!popVisible  // 关闭弹窗
            })
          }
        },
      });
    }
    // 当点击取消按钮的时候
    else{
      // 关闭弹窗
      this.setState({
        popVisible:!popVisible  // 关闭弹窗
      })
    }
  };

  render(){
    const { imgStyle,markType}=this.props;
    const { isCollected,collectId,popVisible,showUp,type } = this.state;
    return (
      <Fragment>
        <Modal
          title="取消收藏"
          visible={popVisible}
          onOk={()=>this.modalButtonFun('ok')}
          onCancel={()=>this.modalButtonFun('cancel')}
          centered
        >
          <div className={styles.confirmText}>
            <span>确定要取消收藏吗？</span>
          </div>
        </Modal>
        {showUp?<img src={isCollected?checked:unchecked} alt="..." onClick={()=>this.updateCollectState(collectId,type,markType)} className={styles.imgCss} style={imgStyle} />:null}
      </Fragment>
    )
  }
}
export default CollectComponent;
