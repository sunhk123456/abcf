import React, { Component } from 'react';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import classNames from 'classnames';
import autoHeight from '../autoHeight';
import styles from './index.less';

/* eslint no-underscore-dangle: 0 */
/* eslint no-param-reassign: 0 */

const imgUrl = 'https://gw.alipayobjects.com/zos/rmsportal/gWyeGLCdFFRavBGIDzWk.png';

@autoHeight()
class TagCloud extends Component {
  state = {
    dv: null,
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.initTagCloud();
      this.renderChart();
    });
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentDidUpdate(preProps) {
    const { data } = this.props;
    if (JSON.stringify(preProps.data) !== JSON.stringify(data)) {
      this.renderChart(this.props);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    window.cancelAnimationFrame(this.requestRef);
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.requestRef = requestAnimationFrame(() => {
      this.renderChart();
    });
  };

  saveRootRef = node => {
    this.root = node;
  };

  initTagCloud = () => {

  };

  @Bind()
  @Debounce(500)
  renderChart(nextProps) {
    // const colors = ['#1890FF', '#41D9C7', '#2FC25B', '#FACC14', '#9AE65C'];
    const { data, height } = nextProps || this.props;

    if (data.length < 1 || !this.root) {
      return;
    }

    const h = height;
    const w = this.root.offsetWidth;

    const onload = () => {
      const dv = new DataSet.View().source(data);
      const range = dv.range('value');
      const [min, max] = range;
      dv.transform({
        type: 'tag-cloud',
        fields: ['name', 'value'],
        imageMask: this.imageMask,
        font: 'Verdana',
        size: [w, h], // 宽高设置最好根据 imageMask 做调整
        padding: 0,
        timeInterval: 5000, // max execute time
        rotate() {
          return 0;
        },
        fontSize(d) {
          // eslint-disable-next-line
          return Math.pow((d.value - min) / (max - min), 2) * (17.5 - 5) + 5;
        },
      });

      if (this.isUnmount) {
        return;
      }

      this.setState({
        dv
      });
    };

    if (!this.imageMask) {
      this.imageMask = new Image();
      this.imageMask.crossOrigin = '';
      this.imageMask.src = imgUrl;

      this.imageMask.onload = onload;
    } else {
      onload();
    }
  }

  render() {
    const { className, height } = this.props;
    const { dv } = this.state;

    return (
      <div
        className={classNames(styles.tagCloud, className)}
        style={{ width: '100%', height }}
        ref={this.saveRootRef}
      >
        {dv
        }
      </div>
    );
  }
}

export default TagCloud;
