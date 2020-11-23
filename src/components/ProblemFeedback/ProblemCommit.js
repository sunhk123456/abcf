/* eslint-disable prefer-template,react/no-array-index-key */
/**
 *反馈提交组件
 * by:CaoRuining
 */
import React, { PureComponent } from 'react';
import { message, Modal,Tree } from 'antd';
import {connect} from 'dva'
import Cookie from '@/utils/cookie';
import yangshi from './ProblemCommit.less';
import popUpImg from './u3299.png'
import closeImg from './u3711.png'
import search from './search.png';

const {TreeNode} = Tree;
@connect(
  ({systemOperatorCom}) => ({
    pageNavData:systemOperatorCom.pageNavData,
  })
)

class ProblemCommit extends PureComponent{


  constructor(props){
    super(props);
    this.state= {
      warningShow:'block', // 警告框显示状态
      visible1: false,// 组件主体显示状态
      visible2: false,// 页面选择器显示状态
      proKind:[ // 可选问题类型数据
        {
          problemType:'1',
          proName:'数据错误'
        },
        {
          problemType:'2',
          proName:'排版不合理'
        },
        {
          problemType:'3',
          proName:'数据加载速度漫'
        },
        {
          problemType:'4',
          proName:'其他'
        }
      ],
      acProKind:'', // 暂存已选问题类型
      problemContent:'',// 输入的问题描述
      pfSubmitTime:0, // 提交反馈请求接口次数
      menuInfo:{
        id:"pandect",
        name:"运营总览",
        RtypeName:"运营总览"
      }, // 选中的菜单信息
      acPageId:'',// 暂存已选页面编码
      acPageName:'',// 暂存已选页面名称
      searchContentIsShow:false, // 搜索下拉框是否展示
      selected:"",// 监控搜索框内容
      menuListData:[],
    }
    }

  showModal1 = () => { // 组件主体打开
    const {visible1,pfSubmitTime} = this.state;
    const {dispatch} = this.props;
    if (pfSubmitTime === 0) {
      dispatch({
        type:'systemOperatorCom/fetchPageNavData',
        payload:{}
      }).then(()=>{
        if (visible1 === false){
          this.setState({
            visible1: true,
          });
        }else {
          this.setState({
            visible1: false,
            visible2: false,
            problemContent:'', // 邢晓栋2019.5.7反馈组件主体关闭时清空内容

          });
        }
        this.setState({
          pfSubmitTime:1
        })
      })
    }else if(pfSubmitTime === 1){
      if (visible1 === false){
        this.setState({
          visible1: true,
        });
      }else {
        this.setState({
          visible1: false,
          visible2: false,
          problemContent:'', // 邢晓栋2019.5.7反馈组件主体关闭时清空内容
        });
      }
    }
  };

  /**
   * 关闭警告
   * @returns {*}
   */
  closeWarning = ()=>{
    this.setState({
      warningShow:'none'
    })
  };

  /**
   * 打开页面选择器
   * @returns {*}
   */
  openPageSelector = ()=>{
    this.setState({
      visible2: true,
      // 选中的菜单信息
      menuInfo:{
        id:"pandect",
        name:"运营总览",
        RtypeName:"运营总览"
      },
      // 搜索内容
      selected:"",// 搜索框内容
      menuListData:[],// 模糊搜索的内容
      acPageName:"",// 选中的页面名称
      acPageId:"",// 选中的页面id
      searchContent:"",
    })
  };


  /**
   * 页面选择器确定按钮功能
   * @returns {*}
   */
  pageSelectorConfirm = ()=>{
      this.setState({
        visible2: false
      });
  };

  /**
   * 选择一个问题类型
   * @returns {*}
   */
  chooseKind = (proType)=>{
    this.setState({
      acProKind:proType
    })
  };

  /**
   * 修改问题描述
   * @returns {*}
   */
  changeProblemContent = (content)=>{
    this.setState({
      problemContent:content
    })
  };

  /**
   * 提交反馈
   * @returns {*}
   */
  submitFeedback = ()=>{
    const {acProKind,problemContent,acPageId,menuInfo:{id}} = this.state;
    const pageId = acPageId === ''?id:acPageId;
    if (acProKind === ''){
      message.warning("请选择一个问题类型");
    } else if(problemContent === ''){
      message.warning("请输入问题描述");
    }else {
      const {dispatch} = this.props;
      const params ={
        problemType:acProKind,
        id:pageId,
        problemDesc:problemContent
      };
      dispatch({
        type:'systemOperatorCom/fetchSubmitFeedback',
        payload:params
      }).then((submitStatus)=>{
        if(submitStatus.result){
          message.success('提交成功');
          this.setState({
            visible1: false,
            visible2: false,
            acProKind:'', // 暂存已选问题类型
            problemContent:'',// 输入的问题描述
            acPageId:'',// 暂存已选页面ID
          });
        }else {
          message.warning("提交失败！");
        }
      });
    }
  };

  /**
   * 选中一个目录项
   * @param value 节点编码集合
   * @param node 节点信息集合
   */
  selectOneMenu=(values,nodes)=>{
    const {title,RtypeName} = nodes.selectedNodes[0].props;
    this.setState({
      menuInfo:{
        id:values[0],
        name:title,
        RtypeName
      }
    })
  }


  /**
   * 功能：模糊搜索
   */
  fetchSearchMenu = (searchContent,menuId)=> {
    const {dispatch} = this.props;
    const param = {
      searchContent,
      id:menuId
    };
    dispatch({
      type:"systemOperatorCom/fetchSearchMenu",
      payload:param
    }).then((data)=>{
      this.setState({
        menuListData:data,
        acPageName:"",
        acPageId:"",
      },()=>{
        if(data.length>0){
          this.setState({searchContentIsShow:true});
        }
      });
    })
  }

  /**
   * 监控搜索输入框
   */
  handleChange =(event)=>{
    const inputValue = event.target.value;
    const {searchContent} = this.state;
    if(inputValue !== searchContent){
      this.setState({selected:inputValue,searchContent:inputValue});
    }
  }

  /**
   * 处理模糊搜索请求
   * @param event
   */
  handleSearch =(event)=> {
    const inputValue = event.target.value;
    const {searchContent,menuInfo} = this.state;
    if(searchContent !== inputValue){
      this.fetchSearchMenu(searchContent,menuInfo.id);
    }
  }

  /**
   *  选择具体某个指标或专题
   * @param id
   * @param name
   */
  selectOnePage=(name,id)=>{
    const selected = name.length>18?(name.substring(0,18)+'...'):name;
    this.setState({
      acPageName:name,
      acPageId:id,
      selected,
      searchContentIsShow:false
    })

  }

  handleMouseLeave=()=>{
    this.setState({searchContentIsShow:false})
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children && item.children.length>0) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item} selectable={false} RtypeName={item.RtypeName}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });

  render(){
    const info = Cookie.getCookie('loginStatus');
    const {visible1,visible2,warningShow,menuInfo:{RtypeName},proKind,problemContent,menuInfo,searchContentIsShow,acPageName,selected,menuListData} = this.state;
    const name = acPageName === ""?"":">"+acPageName;
    const title = RtypeName + name;
    const {pageNavData} = this.props;
    let mainTop ='';
    let selectorTop = '';
    if(window.screen.height<600){
      mainTop = "-70px";
      selectorTop = warningShow === 'block'?
        '83px':'0px';
    }else if (window.screen.height>=600 && window.screen.height<720){
      mainTop = "0px";
      selectorTop = warningShow === 'block'?
        '127px':'45px';
    }else if (window.screen.height>=720 && window.screen.height<768){
      mainTop = "50px";
      selectorTop = warningShow === 'block'?
        '177px':'95px';
    }else if (window.screen.height>=768 && window.screen.height<800){
      mainTop = "80px";
      selectorTop = warningShow === 'block'?
        '207px':'125px';
    }else if (window.screen.height>=800 && window.screen.height<900){
      mainTop = "130px";
      selectorTop = warningShow === 'block'?
        '257px':'175px';
    }else if (window.screen.height>=900 && window.screen.height<960){
      mainTop = "180px";
      selectorTop = warningShow === 'block'?
        '307px':'225px';
    }else if (window.screen.height>=960 && window.screen.height<1024){
      mainTop = "230px";
      selectorTop = warningShow === 'block'?
        '347px':'270px';
    }else if (window.screen.height>=1024 && window.screen.height<1090){
      mainTop = "230px";
      selectorTop = warningShow === 'block'?
        '347px':'270px';
    }

    const kind = proKind.map((item)=>{
      const res = (
        <td key={item.problemType}>
          <input type="radio" name="radio" onClick={()=>{this.chooseKind(item.problemType)}} />{item.proName}
        </td>
      );
      return res;
    });
    const menuList = menuListData.map((data,index)=>
     (<p key={"searchContent"+index} onClick={this.selectOnePage.bind(this,data.name,data.id)}>{data.name}({data.id})</p>)
    );

    return (
      <div>
        <div onClick={this.showModal1} className={yangshi.clickButton}>
          <img src={popUpImg} alt="" />
        </div>
        <Modal
          width={600}
          style={{
            position:'fixed',
            right:'51px',
            top:mainTop,
          }}
          bodyStyle={{
            padding:'0'
          }}
          footer={null}
          visible={visible1}
          mask={false}
          closable={false}
          maskClosable={false}
        >
          <div className={yangshi.problemFeedback_layout}>
            <div className={yangshi.problemFeedback_nav}>
              <div className={yangshi.problemFeedback_title}>
                  问题反馈
              </div>
              <div className={yangshi.problemFeedback_warning} style={{display:warningShow}}>
                <span>为了更快解决您的问题，请在发生问题是或再次遇到问题时，立即提交反馈。</span>
                <img src={closeImg} alt='' onClick={this.closeWarning} />
              </div>
              <div className={yangshi.problemFeedback_pageChoose} onClick={this.openPageSelector}>
                <span className={yangshi.problemFeedback_pageChoose_one} title={title}>{title}</span>
                <span className={yangshi.problemFeedback_pageChoose_two}>更改&nbsp;&nbsp;</span>
              </div>
              <div className={yangshi.problemFeedback_problemType}>
                <span>问题类型：</span>
                <table className={yangshi.problemFeedback_problemType_table}>
                  <tbody>
                    <tr>
                      {kind}
                    </tr>
                  </tbody>
                </table>
              </div>
              <textarea className={yangshi.problemFeedback_problemContent} placeholder="请详细描述您遇到的问题" value={problemContent||''} onChange={(e) => this.changeProblemContent(e.target.value)} />
              <div className={yangshi.problemFeedback_mesg}>
                <button className={yangshi.problemFeedback_submit} type='button' onClick={()=>this.submitFeedback()}>提交</button>
              </div>
              <div className={yangshi.problemFeedback_authInfo}>
                <span className={yangshi.problemFeedback_authInfo_title}>反馈人</span>
                <span className={yangshi.problemFeedback_authInfo_name}>姓名：{info.realName}</span>
                <span className={yangshi.problemFeedback_authInfo_name}>部门：{info.deptName}</span>
              </div>
              <Modal
                width={600}
                style={{
                  position:'fixed',
                  right:'51px',
                  top:selectorTop,
                }}
                bodyStyle={{
                  padding:'0',
                }}
                footer={null}
                visible={visible2}
                mask={false}
                closable={false}
                maskClosable={false}
              >
                <div className={yangshi.problemFeedback_pages}>
                  <div className={yangshi.problemFeedbackPagesTitle}>
                    <div className={yangshi.menuTitle} title={menuInfo.RtypeName}>{menuInfo.RtypeName}</div>
                    <input className={yangshi.problemFeedbackPageInput} placeholder="请输入搜索内容" value={selected} onChange={this.handleChange} />
                    <img className={yangshi.problemFeedbackSearch} src={search} onClick={this.handleSearch} alt="" />
                    <button type="button" className={yangshi.problemFeedbackPagesButton} onClick={this.pageSelectorConfirm}>确定</button>
                    <div className={yangshi.searchContent} style={{visibility:searchContentIsShow?'visible':"hidden"}} onMouseLeave={this.handleMouseLeave}>{menuList}</div>
                  </div>
                  <div className={yangshi.menuList}>
                    <Tree onSelect={(value,node,extra)=>{this.selectOneMenu(value,node,extra)}}>
                      {this.renderTreeNodes(pageNavData)}
                    </Tree>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}


export  default ProblemCommit;
