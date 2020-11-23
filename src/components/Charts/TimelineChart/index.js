import React from 'react';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class TimelineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        },
      ],
    } = this.props;

    data.sort((a, b) => a.x - b.x);

    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length - 1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.y2] = row.y2;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.y2], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });



    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <div style={{ marginRight: -20 }}>
            图表
          </div>
        </div>
      </div>
    );
  }
}

export default TimelineChart;
