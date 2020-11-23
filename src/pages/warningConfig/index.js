import React,{PureComponent} from 'react';
// import {Badge } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
// import MyWarning from '../../components/warningConfig/myWarning';
import styles from './index.less';
// import AddWarningImage from '../../components/warningConfig/addWarningImage';
// import MyWarningImage from '../../components/warningConfig/myWarningImage';

@connect(({ warningModels }) => ({
  warningModels,
  visible:warningModels.visible,
}))
class WarningConfig extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      // list: [
      //   {
      //     "id": "01",
      //     "name": "运营总览",
      //     "subtitle": ["日关注", "月关注"],
      //     "jumpType": "0", // 无法跳转
      //     "treeList": {
      //       "show": "false",
      //       "searchBox": "false",
      //       "hot": "false",
      //       "hotContent": [],
      //       "treeListContent": []
      //     }
      //   },
      //   {
      //     "id": "02",
      //     "name": "业务专题",
      //     "subtitle": ["5G", "携号入网", "宽带"],
      //     "jumpType": "0", // 无法跳转
      //     "treeList": {
      //       "show": "true",
      //       "searchBox": "true",
      //       "hot": "true",
      //       "hotContent": [
      //         {
      //           "id": "0201",
      //           "name": "运营总览",
      //           "jumpType": "1", // 跳转内部页面
      //           "dateType": "1",
      //           "url": "/dayOverview",
      //         },
      //         {
      //           "id": "0202",
      //           "name": "重点产品攻坚行动",
      //           "jumpType": "1", // 跳转内部页面
      //           "dateType": "1",
      //           "url": "/specialReport",
      //         },
      //       ],
      //       "treeListContent": [
      //         {
      //           "id": "021",
      //           "name": "总体业务",
      //           "jumpType": "0", // 无跳转
      //           "secondList": [
      //             {
      //               "id": "0210",
      //               "name": "",
      //               "jumpType": "0", // 无跳转
      //               "thirdList": [
      //                 {
      //                   "id": "02100",
      //                   "name": "运营关注(日)",
      //                   "jumpType": "1",
      //                   "dateType": "1",
      //                   "url": "/xxx",
      //                 },
      //                 {
      //                   "id": "02101",
      //                   "name": "运营关注(月)",
      //                   "jumpType": "1",
      //                   "dateType": "1",
      //                   "url": "/xxx",
      //                 },
      //               ]
      //             },
      //           ]
      //         },
      //         {
      //           "id": "022",
      //           "name": "移动业务",
      //           "jumpType": "0",
      //           "url": "",
      //           "secondList": [
      //             {
      //               "id": "0220",
      //               "name": "",
      //               "jumpType": "0",
      //               "url": "",
      //               "thirdList": [
      //                 {
      //                   "id": "02200",
      //                   "name": "产品画像",
      //                   "jumpType": "1",
      //                   "dateType": "1",
      //                   "url": "/xxx",
      //                 }
      //               ]
      //             },
      //             {
      //               "id": "0221",
      //               "name": "日关注",
      //               "jumpType": "0",
      //               "url": "",
      //               "thirdList": [
      //                 {
      //                   "id": "02210",
      //                   "name": "运营概况",
      //                   "jumpType": "1",
      //                   "dateType": "1",
      //                   "url": "/xxx",
      //                 },
      //                 {
      //                   "id": "02211",
      //                   "name": "渠道运营",
      //                   "jumpType": "1",
      //                   "dateType": "1",
      //                   "url": "/xxx",
      //                 },
      //               ]
      //             },
      //           ]
      //         },
      //         {
      //           "id": "023",
      //           "name": "CBSS套餐",
      //           "jumpType": "0", // 无跳转
      //           "url": "",
      //           "secondList": []
      //         },
      //       ]
      //     }
      //   },
      //   {
      //     "name": "统计报表"
      //   },
      //   {
      //     "name": "自助探索"
      //   },
      //   {
      //     "name": "知识库"
      //   },
      //   {
      //     "name": "数据管理"
      //   },
      //   {
      //     "name": "系统管理"
      //   },
      //
      // ],
      // myWarning: false,
      // dotShow: false,
      // lis2t: [
      //   {
      //     "id": "01",
      //     "name": "运营总览",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["日关注", "月关注"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   },
      //   {
      //     "id": "02",
      //     "name": "业务专题",
      //     "jumpType": "selfSearch",
      //     "url": "/search",
      //     "subtitle": ["5G", "携号入网", "宽带"],
      //     "searchBox": "true",
      //     "isHot": "true",
      //     "children": [
      //       {
      //         "id": "021",
      //         "name": "总体业务",
      //         "jumpType": "no",
      //         "url": "",
      //         "dateType": "",
      //         "searchType": "",
      //         "children": [{
      //           "id": "0210",
      //           "name": "",
      //           "jumpType": "no",
      //           "url": "",
      //           "dateType": "",
      //           "searchType": "",
      //           "children": [
      //             {
      //               "id": "02100",
      //               "name": "运营关注(日)",
      //               "jumpType": "self",
      //               "url": "/specialReport",
      //               "dateType": "1",
      //               "searchType": "special",
      //               "children": []
      //             },
      //             {
      //               "id": "02101",
      //               "name": "运营关注(月)",
      //               "jumpType": "self",
      //               "url": "/specialReport",
      //               "dateType": "2",
      //               "searchType": "special",
      //               "children": []
      //             }
      //           ]
      //         }]
      //       },
      //       {
      //         "id": "022",
      //         "name": "移动业务",
      //         "jumpType": "no",
      //         "url": "",
      //         "dateType": "",
      //         "searchType": "",
      //         "children": [
      //           {
      //             "id": "0220",
      //             "name": "",
      //             "jumpType": "no",
      //             "url": "",
      //             "dateType": "",
      //             "searchType": "",
      //             "children": [{
      //               "id": "02200",
      //               "name": "产品画像",
      //               "jumpType": "self",
      //               "url": "/productView",
      //               "dateType": "2",
      //               "searchType": "special",
      //               "children": []
      //             }]
      //           },
      //           {
      //             "id": "0221",
      //             "name": "日关注",
      //             "jumpType": "no",
      //             "url": "",
      //             "dateType": "",
      //             "searchType": "",
      //             "children": [
      //               {
      //                 "id": "02210",
      //                 "name": "运营概况",
      //                 "jumpType": "self",
      //                 "url": "/specialReport",
      //                 "dateType": "2",
      //                 "searchType": "special",
      //                 "children": []
      //               },
      //               {
      //                 "id": "02211",
      //                 "name": "渠道运营",
      //                 "jumpType": "self",
      //                 "url": "/specialReport",
      //                 "dateType": "2",
      //                 "searchType": "special",
      //                 "children": []
      //               }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         "id": "023",
      //         "name": "CBSS套餐",
      //         "jumpType": "no",
      //         "url": "",
      //         "dateType": "",
      //         "searchType": "",
      //         "children": [
      //           {
      //             "id": "0230",
      //             "name": "cBSS套餐（日）",
      //             "jumpType": "no",
      //             "url": "",
      //             "dateType": "",
      //             "searchType": "",
      //             "children": [{
      //               "id": "02300",
      //               "name": "用户规模（日）",
      //               "jumpType": "self",
      //               "url": "/specialReport",
      //               "dateType": "2",
      //               "searchType": "special",
      //               "children": []
      //             }]
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     "id": "03",
      //     "name": "统计报表",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["基础", "专业", "渠道"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   },
      //   {
      //     "id": "04",
      //     "name": "自助探索",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["自助", "对标", "测试"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   },
      //   {
      //     "id": "05",
      //     "name": "知识库",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["指标体系", "报告"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   },
      //   {
      //     "id": "06",
      //     "name": "数据管理",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["运维", "问题列表"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   },
      //   {
      //     "id": "07",
      //     "name": "系统管理",
      //     "jumpType": "self",
      //     "url": "/dayOverview",
      //     "subtitle": ["权限", "公告", "发布"],
      //     "searchBox": "false",
      //     "isHot": "false",
      //     "children": []
      //   }
      // ],
      // hotContent: [
      //   {
      //     id: "二级菜单id",
      //     list: [
      //       {
      //         "id": "021",
      //         "name": "总体业务",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       },
      //       {
      //         "id": "022",
      //         "name": "总体",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       }
      //
      //     ]
      //   },
      //   {
      //     id: "二级菜单id",
      //     list: [
      //       {
      //         "id": "023",
      //         "name": "总体业务1",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       },
      //       {
      //         "id": "024",
      //         "name": "总体2",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       }
      //     ]
      //   },
      // ]


    }
  }

  componentDidMount() {
  }

  // myWarningOut=()=>{
  //   this.setState({
  //     myWarning:true,
  //     dotShow:true
  //   })
  // };

  // warningClose=(params)=>{
  //   this.setState({
  //     myWarning:params ,
  //     dotShow:false
  //   });
  // };

  render(){
   // const {myWarning,dotShow}=this.state;
   //  const {warningModels}=this.props;
   //  const {dataCount} = warningModels;
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          {/* <div className={styles.popOut} onClick={this.myWarningOut}> */}
          {/* <Badge count={dataCount} dot={dotShow} offset={[-5,0]} /> */}
          {/* </div> */}
          <div className={styles.addPicture}>
            {/* <MyWarningImage /> */}
          </div>
          {/* {visible && <AddWarning onClose={() => {this.handleClick(false);}} />} */}
          {/* <MyWarning visible={myWarning} onClose={() => {this.warningClose(false);}} /> */}
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default WarningConfig
