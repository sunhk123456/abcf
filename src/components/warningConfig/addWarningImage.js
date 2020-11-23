import React,{PureComponent} from 'react';
import { connect } from 'dva';
import picture from "../../assets/image/warningConfig/addWarning.png";
import styles from './addWarningImage.less';

@connect(({ warningModels }) => ({
  warningModels,
  visible:warningModels.visible,
}))
class AddWarningImage extends PureComponent{
  
  static defaultProps={
    condition:{
      warnId:"", // 编辑预警的id
      dateType: '2', // 日月标识
      markType: '', // 专题id
      indexId: 'CKP_12783', // 指标Id
      provId:"111",
      cityId:"-1",
      IsSubKpi:"1", // 指标专题标识，1：指标；2：专题
    }
  };
  
  constructor(props){
    super(props);
    this.state={};
  }
  
  componentDidMount() {
  }
  
  handleClick=(params)=>{
    // 设置请求弹出层数据筛选条件
    const {dispatch,condition} = this.props;
    dispatch({
      type: `warningModels/setCondition`,
      payload: condition,
    });
    // 显示弹出层
    dispatch({
      type: `warningModels/setVisible`,
      payload: {visible:params},
    });
  };
  
  render(){
    return (
      <div className={styles.addPicture} onClick={() => {this.handleClick(true);}}>
        <img src={picture} alt="添加预警图片" />
      </div>
    );
  }
}
export default AddWarningImage
