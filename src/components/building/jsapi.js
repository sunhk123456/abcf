
import esriLoader from 'esri-loader';

window.apiRoot = 'https://js.arcgis.com/3.28/';
 // 可以写在项目的配置文件里
window.dojoConfig = {
  async: true,
  // for jsapi ver. >= 4.9 兼容浏览器
  // deps: ['@dojo/framework/shim/main'],

  deps:false,

  // for jsapi ver. <= 4.8
  // deps: ['@dojo/shim/main'],
  packages: [
    {
      // name: 'sample',
      // location: 'sample/demo'
    },
  ],
  has: {
    'esri-promise-compatibility': 1, // Use native Promises by default
    'esri-featurelayer-webgl': 1, // Enable FeatureLayer WebGL capabilities
  }
};

function configEsriLoader() {
  esriLoader.utils.Promise = Promise;
}

// eslint-disable-next-line import/prefer-default-export
export function load(modules) {
  configEsriLoader();
  esriLoader.loadCss ('https://js.arcgis.com/3.28/esri/css/esri.css');
  return esriLoader.loadModules(modules, {
    dojoConfig: window.dojoConfig,
    url: window.apiRoot,
  });
}
