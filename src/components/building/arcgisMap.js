import React,{PureComponent,Fragment} from 'react';
import { message } from 'antd';
import Icon from 'antd/es/icon';
import { connect } from 'dva';
import pointImg from '../../assets/image/governmentMap/point.png';
import styles from './arcgisMap.less';
import * as jsapi from './jsapi';
import Loading from "../PageLoading/loading";

let Map;
let ArcMap;
let Query;
let QueryTask;
let ArcGISTiledMapServiceLayer;
let GraphicsLayer;
let Point;
let webMercatorUtils;
let PictureMarkerSymbol;
let Graphic;
@connect(
  ({ buildingModels }) => ({buildingModels})
)
class ArcgisMap extends PureComponent{
    constructor(props){
        super(props);
        this.state={
          loadReady:false,
          renderfist:true,
          tiledMapServiceUrl:'http://10.249.216.52:9010/HHHLT/rest/services/China_Community_BaseMap/MapServer',
          graphicLayerUrl:
            'http://10.244.6.82:9058/lydemot/arcgis/rest/services/SHANDONG/QD_SWLY_JFCS/MapServer/0?Authorization=Basic ODI4YzBhNTAtNTIyZS00OTkzLWI5N2QtOTUxNDEwMjExZWM0OjkwYTU3M2FmOWVhZjNkYzRiNTkzMDNkZDViYmRlODU4',
          pointPopShow:false,
          centerPoint:[120.39629, 36.30744], // 青岛中心点经纬度
          loadingState:false
        };
    };

  componentDidMount() {
    // 加载模块
    // this.moduleLoad();
    this.initMap();

  }

  componentDidUpdate() {
    const {loadReady,renderfist}=this.state;
    const self = this;
    if(loadReady&&renderfist) {
      this.drawMap();
      self.setState({
        renderfist:false
      })
    }
  }




  /**
   * gis模块加载方法
   */
  moduleLoad = () => {
    window.AMDRequire(
      [
        'esri/map',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Point',
        'esri/geometry/webMercatorUtils',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/TextSymbol',
        'esri/graphic',
        'esri/symbols/Font',
        'esri/Color',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'dojo/domReady!',
      ],
      (
        MapAlias,
        ArcGISTiledMapServiceLayerAlias,
        ArcGISDynamicMapServiceLayerAlias,
        GraphicsLayerAlias,
        PointAlias,
        webMercatorUtilsAlias,
        PictureMarkerSymbolAlias,
        TextSymbolAlias,
        GraphicAlias,
        FontAlias,
        ColorAlias,
        QueryAlias,
        QueryTaskAlias,
      ) => {
        Map = MapAlias;
        ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayerAlias;
        GraphicsLayer = GraphicsLayerAlias;
        Point = PointAlias;
        webMercatorUtils = webMercatorUtilsAlias;
        PictureMarkerSymbol = PictureMarkerSymbolAlias;
        Graphic = GraphicAlias;
        Query = QueryAlias;
        QueryTask = QueryTaskAlias;
        const that =this;
        const {tiledMapServiceUrl,centerPoint}=this.state;
        ArcMap = new Map('arcGisMap', {
          zoom: 10,
          minZoom: 10,
          center: centerPoint,
          slider:false // 隐藏地图缩放按钮
        });
        ArcMap.disableDoubleClickZoom();
        // 电子地图，坐标系是102100，投影坐标
        const TiledMapServiceLayer = new ArcGISTiledMapServiceLayer(tiledMapServiceUrl);
        ArcMap.addLayer(TiledMapServiceLayer); // 添加世界地图的电子地图
        that.setState({ loadReady: true });
      },
    );
  };

  /**
   * 绘制地图
   */
  drawMap = () => {
    const that =this;
    const {graphicLayerUrl}=this.state;
    const graphicLayer = new GraphicsLayer(graphicLayerUrl, {
      id: 'graphicLayer',
    });
    ArcMap.addLayer(graphicLayer); // 添加楼宇点图层
    // 创建地图查询事件
    const query = new Query();
    const queryTask = new QueryTask(graphicLayerUrl);
    query.where = `1=1 `;
    query.outFields = ['*'];
    query.returnGeometry = true;
    query.geometry = ArcMap.extent;
    queryTask.execute(query).then(results => {
      this.queryGraphicPoint(results.features);
    });
    // 在点图层上设置点击事件，获取点的信息
    graphicLayer.on('click', (evt) => {
      that.stopBubble(evt);
      that.setState({
        loadingState:true,
      });
      this.getPointData(evt.graphic.attributes.id)
    });
  };

  /**
   * 获取图层查询的数据，对数据进行处理
   * @param results
   */
  queryGraphicPoint = (results) =>{
    const graphicLayer = ArcMap.getLayer('graphicLayer');
    results.forEach(data => {
      const {
        attributes: { X,Y, BUILDINGID },
      } = data;
      const pms = new PictureMarkerSymbol(pointImg, 20, 30);
      const pt = new Point(X, Y);
      const geom = webMercatorUtils.geographicToWebMercator(pt);
      const graphic = new Graphic(geom, pms);
      graphic.setAttributes({ id: `${BUILDINGID}` });
      graphicLayer.add(graphic);
    });
  };

  /**
   * 组装弹出层楼宇信息
   * @param data
   * @returns {*}
   */
  domCreated = (data) =>data.map((item)=>(
    <div key={item.name} className={styles.item}>
      <span>{item.name}（{item.unit}）：</span>
      <span>{item.value}</span>
    </div>
      ));

  // 阻止事件冒泡
  stopBubble = e => {
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  };

  /**
   * 关闭弹出层
   */
  closePop=()=>{
    this.setState({
      pointPopShow:false,
    })
  };

  /**
   * 获取点击的点的数据信息
   * @param id 楼宇id
   */
  getPointData = (id) =>{
    const { buildingModels:{markType,provId,cityId,dateType}, dispatch} = this.props;
    const that =this;
    dispatch({
      type: 'buildingModels/getArcgisData',
      payload: {
        markType,
        provId,
        cityId,
        dateType,
        buildingId:id,
      },
      callback:(res)=>{
        if(res){
          that.setState({
            loadingState:false,
            pointPopShow:true,
          });
        }else{
          that.setState({
            loadingState:false,
          });
          message.error('获取信息失败')
        }
      }
    })
  };

  /**
   * 返回地图组件，获取地图数据
   * @param showProv
   * @param showId
   */
  reservePro = (showProv,showId)=> {
    if(showProv!==''&&showId!==''){
      const { buildingModels:{markType, dateType, date}, dispatch} = this.props;
      dispatch({
        type: 'buildingModels/getMapData',
        payload: {
          markType,
          dateType,
          date,
          provId: showId,
          provName: showProv,
          cityId: '',
          cityName: '',
        }
      })
    }
  };

  async initMap(){
    // 必须为一一对应关系
    [
      Map,
      ArcGISTiledMapServiceLayer,
      GraphicsLayer,
      Point,
      webMercatorUtils,
      PictureMarkerSymbol,
      Graphic,
      Query,
      QueryTask,
    ] = await jsapi.load(
      [
        'esri/map',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Point',
        'esri/geometry/webMercatorUtils',
        'esri/symbols/PictureMarkerSymbol',
        'esri/graphic',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'dojo/domReady!',
      ]);
    const that =this;
    const {tiledMapServiceUrl,centerPoint}=this.state;
    ArcMap = new Map('arcGisMap', {
      zoom: 10,
      minZoom: 10,
      center: centerPoint,
      slider:false // 隐藏地图缩放按钮
    });
    ArcMap.disableDoubleClickZoom();
    // 电子地图，坐标系是102100，投影坐标
    const TiledMapServiceLayer = new ArcGISTiledMapServiceLayer(tiledMapServiceUrl);
    ArcMap.addLayer(TiledMapServiceLayer); // 添加世界地图的电子地图
    that.setState({ loadReady: true });
  }

  render(){
      const {pointPopShow,loadingState}=this.state;
      const {buildingModels:{inform}} = this.props;
      const {buildingName,buildingUser,address,data} = inform;
      const head =
        <div key={address} className={styles.item}>
          <span>楼宇地址：</span>
          <span>{address}</span>
        </div>;
      const middle = this.domCreated(data.slice(0,Math.floor(data.length/2)-1));
      const end = this.domCreated(data.slice(Math.floor(data.length/2)-1,data.length));
      const loadingCss = {
        width: '66.6%',
        height:`${500}px`,
        position: 'absolute',
        top:'unset',
        left:'unset',
      };
      const proNameItem = (
        <div className={styles.changeMark}>
          <span className={styles.china} onClick={()=>this.reservePro("全国","111")}>中国</span>
          <span className={styles.china}>&gt;</span>
          <span
            className={styles.prov}
            onClick={()=>this.reservePro("山东","017")}
          >
            山东
          </span>
          <span className={styles.china}>&gt;</span>
          <span className={styles.prov} style={{color: "#52A5D1"}}>青岛</span>
        </div>);
      return (
        <Fragment>
          {proNameItem}
          {pointPopShow?(
            <div className={styles.pop}>
              <div className={styles.title}>
                {buildingName}（{buildingUser}）
                <Icon type="close" className={styles.Icon} onClick={this.closePop} />
              </div>
              <div className={styles.head}>
                {head}
              </div>
              <div className={styles.middle}>
                {middle}
              </div>
              <div className={styles.end}>
                {end}
              </div>
            </div>):null}
          {pointPopShow?<div className={styles.cover} onClick={this.closePop} />:null}
          {loadingState?<Loading cssStyle={loadingCss} />:null}
          <div id="arcGisMap" className={styles.map} />
        </Fragment>
      )
  }
}
export default ArcgisMap;
