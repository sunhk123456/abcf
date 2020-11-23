import React,{PureComponent} from 'react';
import { connect } from 'dva';
import { Badge } from 'antd';
import styles from './myWarningImage.less';
import MyWarning from './myWarning';

@connect(({ warningModels }) => ({
  warningModels,
  visible:warningModels.visible,
}))
class MyWarningImage extends PureComponent{

  static defaultProps={};

  constructor(props){
    super(props);
    this.state={
      myWarning:false,
      dotShow:false,

    };
  }

  componentDidMount() {
    this.getWarningNumber()
  }

  // 获取我的预警数子
  getWarningNumber = () => {
    const {dispatch} = this.props;
    const params = {};
    dispatch({
      type: `warningModels/getWarningNumber`,
      payload: params,
    });
  };

  myWarningOut=()=>{
    this.setState({
      myWarning:true,
      dotShow:true
    })
  };

  warningClose=(params)=>{
    this.setState({
      myWarning:params ,
      dotShow:false
    });
  };

  render(){
    const {myWarning,dotShow}=this.state;
    const {warningModels}=this.props;
    const {dataCount} = warningModels;
    // console.log("dataCount");
    // console.log(dataCount);
    // console.log("dotShow");
    // console.log(dotShow);
    return (
      <div className={styles.page}>
        <div className={styles.popOut} onClick={this.myWarningOut}>
          <Badge count={Number(dataCount)} dot={dotShow} offset={[-5,0]} />
        </div>
        {myWarning&&
        <MyWarning visible={myWarning} onClose={() => {this.warningClose(false);}} />
        }
      </div>

    );
  }
}
export default MyWarningImage
