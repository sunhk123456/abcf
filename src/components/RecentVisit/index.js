import React,{Component} from 'react'
import { Menu, Dropdown, Icon } from 'antd';
import ListItem from './ListItem';
import recentVisit from './recentVisit.less';


class RecentVisitComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'近期访问',
      currentType :'全部',
      selectList: [
        {"id": "1","name": "全部"},
        {"id": "2","name": "指标"},
        {"id": "3","name": "专题"},
        {"id": "4","name": "报告"}
      ],
      recentVisitList: [
        {
          "class": "专题",
          "classId": "2",
          "detailId": "01",
          "detailName": "线下实体渠道发展用户",
          "detailUrl": "/special",
          "detailFlag": "1"
        },
        {
          "class": "指标",
          "classId": "1",
          "detailId": "02",
          "detailName": "20M及以上速率发展用户数",
          "detailUrl": "/index",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "03",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "专题",
          "classId": "2",
          "detailId": "04",
          "detailName": "线下实体渠道发展用户",
          "detailUrl": "/special",
          "detailFlag": "1"
        },
        {
          "class": "指标",
          "classId": "1",
          "detailId": "05",
          "detailName": "20M及以上速率发展用户数",
          "detailUrl": "/index",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "06",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "专题",
          "classId": "2",
          "detailId": "07",
          "detailName": "线下实体渠道发展用户",
          "detailUrl": "/special",
          "detailFlag": "1"
        },
        {
          "class": "指标",
          "classId": "1",
          "detailId": "08",
          "detailName": "20M及以上速率发展用户数",
          "detailUrl": "/index",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "09",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "10",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "11",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "12",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "13",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "14",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "15",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "16",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "17",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "18",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },
        {
          "class": "报告",
          "classId": "3",
          "detailId": "19",
          "detailName": "移动业务发展用户",
          "detailUrl": "/report",
          "detailFlag": "1"
        },

      ]
    }
  }

  menuItemClicked=(e)=>{
    // 最近访问菜单被点击
    this.setState({
      currentType : e.item.props.children
    })
  };

  render(){
    const {title,currentType,selectList,recentVisitList}=this.state;
    const menuItem=selectList.map((item)=>(<Menu.Item key={item.id} onClick={this.menuItemClicked}>{item.name}</Menu.Item>));
    const menu = (<Menu>{menuItem}</Menu>);
    return (
      <div className={recentVisit.wrapper}>
        <div className={recentVisit.page}>
          <header className={recentVisit.header}>
            <span className={recentVisit.title}>{title}</span>
            <Dropdown overlay={menu} trigger={['click']} className={recentVisit.dropdown}>
              <a className="ant-dropdown-link" href="#">
                {currentType}<Icon type="down" />
              </a>
            </Dropdown>
          </header>
          <div className={recentVisit.line} />
          <main className={recentVisit.content}>
            <ListItem recentVisitList={recentVisitList} />
          </main>
        </div>
      </div>
    );
  }
}
export default RecentVisitComponent;
