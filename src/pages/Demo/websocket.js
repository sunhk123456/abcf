/* eslint-disable */
/**
 * @Description:
 *
 * @author: 风信子
 *
 * @date: 2019/11/6
 */

import React, {PureComponent} from 'react';
import Websocket from 'react-websocket';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class WebsocketFile  extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      count: 90
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  handleData(data) {
    const {count} = this.state;
    // console.log(data);
    let result = JSON.parse(data);
    console.log(result)
    // this.setState({count: count + result.movement});
  }

  handleOpen(){
    console.log("websocket open");
    // console.log(data)
  }

  handleClose(){
    console.log("websocket close");
    // console.log(e)
  }

  btn(){
    this.sendMessage(JSON.stringify({id:1252,name:"sssss"}));
  }

  /**
   *webscoket 发送数据
   * * */
  sendMessage = message => {
    console.log(this)
    this.refWebSocket.sendMessage(message);
  };

  render() {
    const {count} = this.state;
    return (
      <PageHeaderWrapper>
        <div>
          Count: <strong>{count}</strong>
          <Websocket
            url='ws://192.168.110.79:8079/socket/webSocket'
            onMessage={this.handleData.bind(this)}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            ref={socket => {
              this.refWebSocket = socket;
            }}
          />
          <button onClick={()=>this.btn()}>点击</button>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default WebsocketFile;
