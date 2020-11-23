import React ,{ Component, Fragment } from 'react';
import styles from './nameListButton.less'

class NameListButton extends Component {
  static defaultProps={
    arrayData:[{id:"D",name:"日"},{id:"M",name:"月"}],
    selectIndex:"M",
    callback:(item)=>{
      console.log(item)
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  
  itemClicked=(item)=>{
    const {callback} = this.props;
    callback(item)
  };
  
  
  render() {
    const { arrayData,selectIndex} = this.props;
    const liItem = arrayData.map((item) => (
      <div className={selectIndex===item.id?styles.itemSelected:styles.item} key={item.id} onClick={()=>this.itemClicked(item)}>{item.name}</div>
    ));
    return (
      <Fragment>
        <div className={styles.page}>
          {liItem}
        </div>
      </Fragment>
    );
  }
}

export default NameListButton;
