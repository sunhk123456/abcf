// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
import path from 'path';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/loading',
      },
      pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          importWorkboxFrom: 'local',
        },
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
/*if (process.env.APP_TYPE === 'site') {
 plugins.push([
 'umi-plugin-ga',
 {
 code: 'UA-72788897-6',
 },
 ]);
 }*/
let productionExternals = {};
if (process.env.APP_TYPE !== 'site') {
  productionExternals = {
    'html2canvas': 'html2canvas',
    'echarts': 'echarts',
    // 'react':'react',
    // 'react-dom':"react-dom",
    // 'react-router':'react-dom',
    // 'moment':'moment',
    // "antd":"antd"
  }
}

export default {
  // add for transfer to umi
  plugins,
  base:"/", // 指定 react-router 的 base，部署到非根目录时需要配置。
  hash: true, // 开启 hash 文件后缀。
  exportStatic: true, // 打包多个html
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  // theme: {
  //   'primary-color': defaultSettings.primaryColor, // 配置主题
  // },
  externals: {
    '@antv/data-set': 'DataSet',
    ...productionExternals
  },
  copy: [
    {
      from: path.resolve(__dirname, '../node_modules/html2canvas/dist/html2canvas.min.js'),
      to: path.resolve(__dirname, '../dist/resource'),
    },
    {
      from: path.resolve(__dirname, '../src/resource/echarts.min.js'),
      to: path.resolve(__dirname, '../dist/resource'),
    }
  ],
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸。
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  treeShaking: true,// 配置是否开启 treeShaking，默认关闭。
  uglifyJSOptions(opts) {
    opts.uglifyOptions.compress.drop_console = true; // 生产模式不打印console，
    opts.uglifyOptions.compress.drop_debugger = true; // 删除debugger;
    opts.uglifyOptions.compress.dead_code = true; // 删除无法访问的代码
    return opts;
  },
  // chainWebpack: webpackPlugin,
  // treeShaking:true,
  // ignoreMomentLocale: true,
};

