/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: componentLayout/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/1/28/028
 */
import React, {Component} from "react"
import { Row, Col } from 'antd';

export default class ComponentLayout extends Component {
  /**
   * 点击布局中的某一个图片时获取点击的图片的index值并返回给上一层组件
   * @param index
   * @param e
   */
  // onClickPic=(index, e)=> {
  //   const {callbackParent} = this.props;
  //   callbackParent(index);
  //   if (!e) window.event.cancelBubble = true;
  //   if (e.stopPropagation) e.stopPropagation();
  // }

  render() {
    const {children} = this.props; // 包含在布局器组件开始和结束标签之间的组件
    // var arr = this.props.params; // 布局器中每一个图片所占的列数的数组
    // const sw = window.screen.width;
    // let claN;
    // if (sw >= 700 && sw < 970) {
    //   claN = "sm"
    // } else if (sw >= 970 && sw < 1170) {
    //   claN = "md"
    // } else if (sw >= 1170) {
    //   claN = "lg"
    // }
    // console.log("children,com的key")
    // console.log(children)
    const cols = children.map((com,index) => {
      if (com !== undefined && com !== null && com !== "") {

        return (
          // sunrui 添加key
          <Col key={`colKey${index}`} span={com.ref} style={{height: "auto", paddingRight: "5px", paddingLeft: "5px", marginBottom: "10px"}}>
            {com}
          </Col>
            );
      }
      return com
    });
    return (
      <Row>
        {cols}
      </Row>
    );
  }
}
