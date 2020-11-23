import React,{Component} from 'react'
import { Menu, Dropdown, Icon } from 'antd';
 import recommend from './recommend.less';


class RecommendComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'推荐内容',
      currentType :'全部',
      selectList: [
        {"id": "1","name": "全部"},
        {"id": "2","name": "指标"},
        {"id": "3","name": "专题"},
        {"id": "4","name": "报告"},
        {"id": "5","name": "报表"}
      ],
    }
  }

  menuItemClicked=(e)=>{
    // 最近访问菜单被点击
    this.setState({
      currentType : e.item.props.children
    })
  };

  render(){
    const {title,currentType,selectList}=this.state;
    const menuItem=selectList.map((item)=>(<Menu.Item key={item.id} onClick={this.menuItemClicked}>{item.name}</Menu.Item>));
    const menu = (<Menu>{menuItem}</Menu>);
    return (
      <div className={recommend.wrapper}>
        <div className={recommend.page}>
          <header className={recommend.header}>
            <span className={recommend.title}>{title}</span>
            <Dropdown overlay={menu} trigger={['click']} className={recommend.dropdown}>
              <a className="ant-dropdown-link" href="#">
                {currentType}<Icon type="down" />
              </a>
            </Dropdown>
          </header>
          <div className={recommend.line} />
          <main className={recommend.content}>
            {"xx"}

          </main>
        </div>
      </div>
    );
  }
}
export default RecommendComponent;
