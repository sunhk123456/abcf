/**
 * @Description:  echart 不同分辨率字体大小库
 *
 * @author: xingxiaodong
 *
 * @date: 2019/6/6
 */

const FontSizeEchart = ()=> {
  const screenWidth = window.screen.width;
  const color30=[
    "#85abd2",
    "#7D94F2",
    "#8484D2",
    "#AB84D2",
    "#B361E5",
    "#D284D2",
    "#D284AB",
    "#F27D94",
    "#EC9296",
    "#D28484",
    "#E35F65",
    "#D2AB84",
    "#ECE793",
    "#D6E561",
    "#D2D284",
    "#ABD284",
    "#84D284",
    "#61E571",
    "#2BDAD1",
    "#1EA9A2",
    "#84D2D2",
    "#578CC1",
    "#3B6EA0",
    "#1D55AF",
    "#A06E3B",
    "#DD992C",
    "#C18C57",
    "#ECBB93",
    "#E5B262",
    "#F2DB7E",
  ];
  const pieEchartColor=[
    "#5CD5E3",
    "#DC69AB",
    "#61ADDD",
    "#DE9462",
    "#91C7AE",
    "#919BC6",
    "#C391C6",
    "#DC6868",
    "#B6DC6B",
    "#D0C862"
  ];
  let titleSize = 18;       // 标题
  const titleWeight="normal";  // 标题
  const titleFamily="Microsoft YaHei";  // 标题
  const titleColor="#333"; // 颜色
  let xAxisSize = 12;       // x轴
  let legendSize = 12;      // 图例
  let yAxisSize = 12;       // y轴
  let tooltipSize = 12;     // tooltip
  let pietextSize = 12;     // 饼图的文字
  if(screenWidth > 760 &&  screenWidth < 960 ){ // 800
    titleSize = 12;
    xAxisSize = 12;
    legendSize = 10;
    yAxisSize = 12;
    tooltipSize = 12;
    pietextSize = 12;
  }else if(screenWidth > 961 && screenWidth < 1100){ // 1024
    titleSize = 14;
    xAxisSize = 12;
    legendSize = 12;
    yAxisSize = 12;
    tooltipSize = 12;
    pietextSize = 12;
  }else if(screenWidth > 1101 && screenWidth < 1315){ // 1280
    titleSize = 16;
    xAxisSize = 12;
    legendSize = 12;
    yAxisSize = 12;
    tooltipSize = 14;
    pietextSize = 12;
  }else if(screenWidth > 1316 && screenWidth < 1389){ // 1366
    titleSize = 18;
    xAxisSize = 12;
    legendSize = 12;
    yAxisSize = 12;
    tooltipSize = 14;
    pietextSize = 12;
  }else if(screenWidth > 1390 && screenWidth < 1869){ // 1440
    titleSize = 18;
    xAxisSize = 12;
    legendSize = 12;
    yAxisSize = 12;
    tooltipSize = 14;
    pietextSize = 12;
  }else if(screenWidth > 1870){ // 1920
    titleSize = 23;
    xAxisSize = 14;
    legendSize = 12;
    yAxisSize = 14;
    tooltipSize = 20;
    pietextSize = 15;
  }
  return {titleColor,color30,titleSize,titleWeight,titleFamily, xAxisSize, legendSize, yAxisSize, tooltipSize, pietextSize,pieEchartColor};
};
export default FontSizeEchart;
