import React, { Component,Fragment} from 'react';
import { Icon } from 'antd';
import xxdStyle from './ProductScreen.less';

class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.seriesRef=React.createRef();
    this.trendIndexSelectDelete=React.createRef();
    this.seriesListRef=React.createRef();
    this.state={
      classifyListShow:false,// 判断分类是否隐藏
      seriesListShow:false,// 判断系列是否隐藏
      markType:props.markType,// 获取markType判断是否显示产品系列
      classify:{
        name: "全部",
        id: "-1"
      },// 记录选中的分类id  和  名称
      series:{
        name: "全部",
        id: "-1"
      },// 记录选中的系列id 和 name
      seriesSearchName:"全部",// 搜索展示name
      productClass: [
        {
          "name": "全部",
          "id": "121",
          "productSeries": [
            {
              "seriersName": "芝麻冰淇凌xx",
              "seriersId": "283"
            }
          ]
        },
        {
          "name": "全国冰淇凌1",
          "id": "33",
          "productSeries": [
            {
              "seriersName": "小冰神卡",
              "seriersId": "123"
            },
            {
              "seriersName": "芝麻冰淇凌",
              "seriersId": "13"
            },
            {
              "seriersName": "芝麻冰淇凌",
              "seriersId": "23"
            }
          ]
        },
        {
          "name": "全国冰淇凌2",
          "id": "23",
          "productSeries": [
            {
              "seriersName": "小冰神卡",
              "seriersId": "123"
            },
            {
              "seriersName": "芝麻冰淇凌1",
              "seriersId": "213"
            },
            {
              "seriersName": "芝麻冰淇凌2",
              "seriersId": "231"
            },
            {
              "seriersName": "芝麻冰淇凌3",
              "seriersId": "203"
            },
            {
              "seriersName": "芝麻冰淇凌4",
              "seriersId": "223"
            }
          ]
        }
      ],
      productSeries:[
        {
          "seriersName": "芝麻冰淇凌11",
          "seriersId": "23"
        }
      ],// 默认获取第一个
      searchSeries:[],// 搜索专用系列
    };
  }

  componentWillMount() {
    const {productClass,classify,series,markType}=this.props;
    this.setState({
      productClass,
      classify,
      series,
      markType
    })
  }

  componentWillReceiveProps(nextProps) {
    const {productClass,classify,series}=this.state;
    if( nextProps.productClass.length > 0 && productClass !== nextProps.productClass){
      this.setState({
        productClass:nextProps.productClass,
        productSeries:nextProps.productClass[0].productSeries,
        searchSeries:nextProps.productClass[0].productSeries,
        markType:nextProps.markType,
        classify:nextProps.classify,
        series:nextProps.series,
        seriesSearchName:nextProps.series.name
      });
    }
    if(nextProps.classify!==classify){
      this.setState({
        classify:nextProps.classify,
      })
    }
    if(nextProps.series!==series){
      this.setState({
        series:nextProps.series,
        seriesSearchName:nextProps.series.name
      })
    }
  }

  // 数据没有改变阻止render
  shouldComponentUpdate(newProps, newState) {
    return (JSON.stringify(newState) !== JSON.stringify(this.state));
  }

  componentDidUpdate(){
    this.seriesListRef.current.scrollTop = 0;
  }
  /*
  * 分类点击显示或隐藏事件
  * */

  classifyShowFun=()=>{
    const {classifyListShow}=this.state;
    this.setState({
      classifyListShow:!classifyListShow
    })
  };

  /*
  * 系列点击显示或隐藏事件
  * */
  seriesShow=()=>{
    const {productSeries,seriesListShow}=this.state;
    if(productSeries.length!==0){
      this.setState({
        seriesListShow:!seriesListShow
      })
    }
  };

  /*
  * 点击分类列表事件
  *
  * id  分类值
  * name  分类名称
  * */
  classifyListLiFun=(id,name)=>{
    const {productClass} = this.state;
    const productSeries = [];
    for(let i = 0;i<productClass.length;i+=1){
      if(productClass[i].id === id){
        Object.assign(productSeries,productClass[i].productSeries);
        // productSeries=productClass[i].productSeries;
      }
    }
    const classify = {
      id,
      name
    };
    this.setState({
      classify,
      productSeries,
      searchSeries:productSeries,
      seriesSearchName:"全部",
      classifyListShow:false
    });
    const series = {
      id:"-1",
      name:"全部"
    };
    const {callBackClassify}=this.props;
    callBackClassify(classify,series);// 返回给父级id 和 name值
  };

  /*
  * 点击系列列表事件
  * id 系列id值
  * name 系列名称
  * */

  seriesListLiFun=(id,name)=>{
    let showSeriesName = name;
    if(name.length>8){
      showSeriesName= `${name.substr(0,6)}...`
    }
    const series = {
      id,
      name
    };
    this.setState({
      series,
      seriesSearchName:showSeriesName,
      seriesListShow:false
    });
    this.noneDelete();// 隐藏删除图标
    const {callBackSeriesAndClassify}=this.props;
    const {classify}=this.state;
    callBackSeriesAndClassify(classify,series);// 返回给父级id 和 name值
  };

  /*
  * 隐藏列表
  * index  判断是分类还是系列
  * */
  mouseoutNone=(index)=>{
    if(index === 1){
      this.setState({
        classifyListShow:false
      })
    }else {
      this.seriesRef.current.blur();
      this.noneDelete();
      let {series,seriesSearchName} = this.state;
      if(seriesSearchName === ""){
        series = {
          id:"-1",
          name:"全部"
        };
        seriesSearchName = "全部";
        const {callBackSeriesAndClassify}=this.props;
        const {classify}=this.state;
        callBackSeriesAndClassify(classify,series);// 返回给父级id 和 name值
      }
      this.setState({
        series,
        seriesListShow:false,
        seriesSearchName,
      })
    }


  };

  /**
   * 监控搜索框中内容的改变
   */
  watchDivChange=()=>{
    const self = this;
    const selectName = self.seriesRef.current.value;
    const {searchSeries} = self.state;
    let searchArr = [];// 检索出的list
    if(selectName === ""){
      self.noneDelete();
    }else {
      self.trendIndexSelectDelete.current.className = xxdStyle.productSelectDelete;
    }
    if(searchSeries === ""){
      searchArr = searchSeries;
    }else {
      for(let j = 0,len=searchSeries.length; j < len; j+=1) {
        if(searchSeries[j].seriersName.toLowerCase().indexOf(selectName.toLowerCase()) >= 0){
          searchArr.push(searchSeries[j]);
        }
      }
    }
    this.setState({
      seriesSearchName:selectName,
      productSeries:searchArr,
    })

  };
  // 显示删除图标

  showDelete=()=>{
    this.trendIndexSelectDelete.current.className =  xxdStyle.productSelectDelete;
    this.setState({
      seriesListShow:true
    })
  };

  // 隐藏删除图标
  noneDelete=()=>{
    this.trendIndexSelectDelete.current.className =  xxdStyle.none;
  };

  // 清空搜素内容
  deleteContent=()=>{
    const {searchSeries} = this.state;
    this.setState({
      seriesSearchName:"",
      productSeries:searchSeries
    })
  };

  render() {
    const {productClass,productSeries} = this.state;
    const classifyList = productClass.map((data)=>
       (<li key={data.id} onClick={this.classifyListLiFun.bind(this,data.id,data.name)}>{data.name}</li>)
    );
    if(productSeries.length > 0 && productSeries[0].seriersId !== "-1"){
      productSeries.unshift({seriersId:"-1",seriersName:"全部"})
    }
    const seriesList = productSeries.map((data)=>
       (<li key={data.seriersId} onClick={this.seriesListLiFun.bind(this,data.seriersId,data.seriersName)}>{data.seriersName}</li>)
    );

    // 判断系列是否显示
    const {markType}=this.state;
    const seriesNone = markType === "PRODUCT_YD" ? "":"none";
    const {classifyListShow,seriesListShow,classify,seriesSearchName}=this.state;
    return (
      <Fragment>
        {/* 产品分类 */}
        <div className={xxdStyle.item}>
          <span className={xxdStyle.option}>产品分类：</span>
          <div className={xxdStyle.selected} onClick={this.classifyShowFun} onMouseLeave={this.mouseoutNone.bind(this,1)}>
            <span className={xxdStyle.classifyContentName}>{classify.name}</span>
            <span className={xxdStyle.productIconCon}>
              <i className={xxdStyle.triangle} />
            </span>
            <div className={classifyListShow?xxdStyle.seriesList:xxdStyle.classifyListNone}>
              <ul className={xxdStyle.classifyListUl}>
                {/* <li onClick={this.classifyListLiFun.bind(this,"-1","全部")}>全部</li> */}
                {classifyList}
                <div className={xxdStyle.clear} />
              </ul>
            </div>
          </div>
        </div>
        {/* 产品系列 */}
        <div className={xxdStyle.item} style={{display:seriesNone}}>
          <span className={xxdStyle.option}>产品系列：</span>
          <div className={xxdStyle.selected} onMouseLeave={this.mouseoutNone.bind(this,2)}>
            <span className={xxdStyle.seriesContentName}>
              <input
                type="text"
                className={xxdStyle.seriesInput}
                ref={this.seriesRef}
                onChange={this.watchDivChange}
                onFocus={this.showDelete}
                value={seriesSearchName}
              />
              <div className={xxdStyle.none} ref={this.trendIndexSelectDelete} onClick={this.deleteContent}>
                <Icon type="close" />
              </div>

              {/* <img className={xxdStyle.none} ref={this.trendIndexSelectDelete} src="" alt="delete" onClick={this.deleteContent.bind(this)} /> */}
            </span>

            <span className={xxdStyle.productIconCon} onClick={this.seriesShow}>
              <i className={xxdStyle.triangle} />
            </span>
            <div ref={this.seriesListRef} className={seriesListShow?xxdStyle.classifyList:xxdStyle.classifyListNone}>
              <ul className={xxdStyle.seriesListUl}>
                {seriesList}
                <div className={xxdStyle.clear} />
              </ul>
            </div>
          </div>
        </div>
      </Fragment>)
  }
}

export default ProductScreen
