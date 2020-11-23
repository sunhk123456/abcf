import React, { Component } from 'react';
import { Row, Col } from 'antd';
import autoHeight from '../autoHeight';
import styles from './index.less';

/* eslint react/no-danger:0 */
@autoHeight()
class Radar extends Component {
  state = {
    legendData: [],
  };

  componentDidMount() {
    this.getLegendData();
  }

  componentDidUpdate(preProps) {
    const { data } = this.props;
    if (data !== preProps.data) {
      this.getLegendData();
    }
  }

  getG2Instance = chart => {
    this.chart = chart;
  };

  // for custom lengend view
  getLegendData = () => {
    if (!this.chart) return;
    const geom = this.chart.getAllGeoms()[0]; // 获取所有的图形
    if (!geom) return;
    const items = geom.get('dataArray') || []; // 获取图形对应的

    const legendData = items.map(item => {
      // eslint-disable-next-line
      const origins = item.map(t => t._origin);
      const result = {
        name: origins[0].name,
        color: item[0].color,
        checked: true,
        value: origins.reduce((p, n) => p + n.value, 0),
      };

      return result;
    });

    this.setState({
      legendData,
    });
  };

  handleRef = n => {
    this.node = n;
  };

  handleLegendClick = (item, i) => {
    const newItem = item;
    newItem.checked = !newItem.checked;

    const { legendData } = this.state;
    legendData[i] = newItem;

    const filteredLegendData = legendData.filter(l => l.checked).map(l => l.name);

    if (this.chart) {
      this.chart.filter('name', val => filteredLegendData.indexOf(val) > -1);
      this.chart.repaint();
    }

    this.setState({
      legendData,
    });
  };

  render() {

    const {
      height = 0,
      title,
      hasLegend = false,
    } = this.props;

    const { legendData } = this.state;


    return (
      <div className={styles.radar} style={{ height }}>
        {title && <h4>{title}</h4>}
        {hasLegend && (
          <Row className={styles.legend}>
            {legendData.map((item, i) => (
              <Col
                span={24 / legendData.length}
                key={item.name}
                onClick={() => this.handleLegendClick(item, i)}
              >
                <div className={styles.legendItem}>
                  <p>
                    <span
                      className={styles.dot}
                      style={{
                        backgroundColor: !item.checked ? '#aaa' : item.color,
                      }}
                    />
                    <span>{item.name}</span>
                  </p>
                  <h6>{item.value}</h6>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  }
}

export default Radar;
