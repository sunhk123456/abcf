/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import MD5 from 'md5'
import { message } from 'antd';
// import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert,Row,Col } from 'antd';
import router from 'umi/router';
// import Login from '@/components/Login';
import styles from './Login.less';
import Cookie from '@/utils/cookie';
import bottons from '../../layouts/img/button.png'


@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    isRemember:false,
    username: "",
    password: "",
    warnFont:"",
    showWarn:false,
    showLogin:false,
  };

  // 生成第一个展示的验证码
  componentDidMount() {
    if( window.location.search!=''){
      let iscloud=this.GetQueryString("iscloud");
      if(iscloud==1){
        let token= this.GetQueryString("token");
        let userId=this.GetQueryString("userId");
        let ip=this.GetQueryString("ip");
        this.GetCloud(token,userId,ip)
      }else {
        let token= this.GetQueryString("token");
        let resId=this.GetQueryString("resId");
        let source=this.GetQueryString("source");
        this.CommitLgin(token,resId,source)
      }
      // 从旧经分的url中获取用户名及密码进行页面的跳转与重定向
    }else {
      this.setState({
        showLogin:true
      })
      this.getVerificationCode();
    }

  }

  /*
   * 功能：从旧经分跳转时，获取其用户名密码
   * */
  GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);  // 获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  }

  // 验证uuid和验证码
  uuidCommit= (uuid,captcha) =>{
    const { dispatch } = this.props;
    // var url="http://192.168.110.31:8021/captcha"
    const params={
      "uuid":uuid,
      "captcha":captcha
    }
    dispatch({
      type: 'login/getCaptcha',
      payload: params,
    });
  }

  // 生成uuid
  uuid = (len, radix)=> {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    let i;
    radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  handleSubmit = () => {
    const { code,uuid,username ,password} = this.state;
      const { dispatch } = this.props;
      const  md5_password = MD5(password);
      const passwords = md5_password.toLocaleUpperCase();
      if(username===""){
        this.setState({
          warnFont:"用户名不能为空",
          showWarn:true
        })
        this.getVerificationCode();
      }else if(password===""){
        this.setState({
          warnFont:"密码不能为空",
          showWarn:true
        })
        this.getVerificationCode();
      }else if(this.refs.validateCode.value===""){
        this.setState({
          warnFont:"验证码不能为空",
          showWarn:true
        })
        this.getVerificationCode();
      }else{
        if(this.refs.validateCode.value.toLowerCase() === code.toLowerCase()){
          dispatch({
            type: 'login/login',
            payload: {
              username:username,
              password:passwords,
              captcha:code,
              uuid
            },
            callback: e=>{
              if(e.code==='200') {
                // message.success("登录成功",2);
                const { isRemember } = this.state;
                const loginData = {
                  token: e.token,
                  userId: e.userId,
                  realName:e.realName,
                  power:e.power,
                  provOrCityName:e.provOrCityName,
                  provOrCityId:e.provOrCityId,
                  deptName:e.deptName,
                  deptId:e.deptId,
                  homePage:e.homePage,
                  isRemember
                };
                Cookie.setCookie("loginStatus", loginData, null); // 如果用户选择"记住我"，则设置cookie过期时间
                if(e.userId==='yufabu1'){
                  router.push('/DayDateChange')
                }else {
                  // 2018/01/30 刘彤修改，默认首页跳转到运营总览页面
                  // router.push('/dayOverview')
                  router.push(e.homePage)
                }
              }else if(e.code==="206"){
                // history.push({
                //   pathname: "/unauthorized",
                // })
                /*  // 测试本窗口打开url
                  self.setState({message: ''});
                  alert("该用户未授权")
                  self.createCode();//刷新验证码
                  self.refs.validateCode.value=""; */
				//warnFont:"用户不存在或未授权",
				this.setState({
				  warnFont:e.message,
				  showWarn:true
			    })
              }else {
                this.setState({
                  // warnFont:"用户名或密码错误",
                  warnFont:e.message,
                  showWarn:true
                })
                // message.error(e.message,2);
                this.getVerificationCode();
              }
            }
          });
        } else {
          this.setState({
            warnFont:"验证码错误",
            showWarn:true
          })
          this.getVerificationCode();
        }
      }

  };

  /**
   * 从云门户跳转时，获取登录的用户名密码
   */
  GetCloud(token,userId,ip){
    const { dispatch } = this.props;
    dispatch({
      type: 'login/GetCloud',
      payload: {
        token,userId,ip
      },
      callback: e=>{
        if(e.code==='200') {
          const { isRemember } = this.state;
          const loginData = {
            token: e.token,
            userId: e.userId,
            realName:e.realName,
            power:e.power,
            provOrCityName:e.provOrCityName,
            provOrCityId:e.provOrCityId,
            deptName:e.deptName,
            deptId:e.deptId,
            homePage:e.homePage,
            isRemember
          };
          Cookie.setCookie("loginStatus", loginData, null); // 如果用户选择"记住我"，则设置cookie过期时间
          if(e.userId=='yufabu1'){
            router.push('/DayDateChange')
          }else {
            router.push(e.homePage)
          }
        }else{
          message.error(e.message)
        }
      }
    })

  }

  /**
   * 功能：单点登录接口
   * @param token
   * @param resId
   * @param source
   * @constructor
   */
  CommitLgin (token,resId,source){
    const { dispatch } = this.props;
    dispatch({
      type: 'login/GetSsoLogin',
      payload: {
        token,resId,source
      },
      callback: e=>{
        if(e.code==='200') {
          const { isRemember } = this.state;
          const loginData = {
            token: e.token,
            userId: e.userId,
            realName:e.realName,
            power:e.power,
            provOrCityName:e.provOrCityName,
            provOrCityId:e.provOrCityId,
            deptName:e.deptName,
            deptId:e.deptId,
            homePage:e.homePage,
            isRemember
          };
          Cookie.setCookie("loginStatus", loginData, null); // 如果用户选择"记住我"，则设置cookie过期时间
          if(e.userId=='yufabu1'){
            router.push('/DayDateChange')
          }else {
            router.push(e.homePage)
          }
        }else{
          message.error(e.message)
        }
      }
    })
  }

  handleChange=(e)=> {
    const newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  // 随机生成验证码
  getVerificationCode = () => {
    const random = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    let code = '';
    for (let i = 0; i < 4; i+=1) {
      const index = Math.floor(Math.random() * 36);
      code = code + random[index];
    }
    const uuid = this.uuid(16,16)
    this.setState({
      code,
      uuid,
    });
    this.uuidCommit(uuid,code)
  };

  keyDown =(event)=>{
    const x = event.which ||event.keyCode;
    if (x === 13) {
      this.handleSubmit();
      // 当用户触发Enter键时，提交表单
      // this.handleCommit();
    }
  };


  render() {
    // const { submitting } = this.props;
    const { code,warnFont,showWarn,showLogin } = this.state;
    if(!showLogin){
      return (<div>稍等</div>)
    }else {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.main} onKeyDown={this.keyDown.bind(this)}>
              <div className={styles.mainInput}>
                <Row type="flex" align="middle" className={styles.rowUp}>
                  <Col span={4} className={styles.titleFont}>用户名:</Col>
                  <Col span={12}>
                    <input className={styles.inputLong} type="text" name="username" onChange={this.handleChange.bind(this)} required="required" />
                    <span className={styles.inputSpan}>&nbsp;*</span>&nbsp;
                  </Col>
                  <Col span={8} className={showWarn?styles.warnFont:styles.noWarn}>{warnFont}</Col>
                </Row>
                <Row type="flex" align='middle' className={styles.rowUp}>
                  <Col span={4}>
                    <span className={styles.titleFont}>密&nbsp;&nbsp;码:</span>
                  </Col>
                  <Col span={12}>
                    <input className={styles.inputLong} type="password" name="password" onChange={this.handleChange.bind(this)} required="required" />
                    <span className={styles.inputSpan}>&nbsp;*</span>
                  </Col>
                </Row>
                <Row type="flex" align='middle' className={styles.rowUp}>
                  <Col span={4}>
                    <span className={styles.titleFont}>验证码:</span>
                  </Col>
                  <Col span={20} className={styles.codes}>
                    <div className={styles.codeTitle}>
                      <input className={styles.codeLong} type="text" id="ws-login-code" ref="validateCode" />
                      <span className={styles.inputSpan}>&nbsp;*</span>
                    </div>
                    <div className={styles.codeBack} onClick={this.getVerificationCode.bind(this)}>
                      <span>{code}</span>
                    </div>
                    <div className={styles.loginButton}>
                      <img id="submitId" src={bottons} onClick={this.handleSubmit.bind(this)} alt="" />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default LoginPage;
