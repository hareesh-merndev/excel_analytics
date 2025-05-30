import React from 'react';
import Plot from 'react-plotly.js';

const ChartComponent = ({ data, xKey, yKey, chartType, twoDType, fullTable }) => {
  const toNumberArray = arr => arr.map(v => (isNaN(Number(v)) ? 0 : Number(v)));

  // Full table chart (heatmap or surface)
  if (fullTable) {
    const z = data.map(row => Object.values(row).map(v => (isNaN(Number(v)) ? null : Number(v))));
    if (chartType === '3D') {
      return (
        <Plot
          data={[
            {
              z,
              type: 'surface',
              colorscale: 'Viridis'
            }
          ]}
          layout={{ width: 700, height: 500, title: '3D Surface Plot (Full Table)' }}
        />
      );
    }
    // 2D full-table: only heatmap makes sense
    return (
      <Plot
        data={[
          {
            z,
            type: 'heatmap',
            colorscale: 'Viridis'
          }
        ]}
        layout={{ width: 700, height: 500, title: '2D Heatmap (Full Table)' }}
      />
    );
  }

  // X/Y chart (scatter, line, bar, heatmap)
  if (xKey && yKey) {
    const x = toNumberArray(data.map(row => row[xKey]));
    const y = toNumberArray(data.map(row => row[yKey]));

    if (chartType === '3D') {
      const columns = Object.keys(data[0] || {});
      const zKey = columns.find(col => col !== xKey && col !== yKey) || yKey;
      const z = toNumberArray(data.map(row => row[zKey]));
      return (
        <Plot
          data={[
            {
              x,
              y,
              z,
              mode: 'markers',
              type: 'scatter3d',
              marker: { size: 5, color: z, colorscale: 'Viridis' }
            }
          ]}
          layout={{ width: 700, height: 500, title: `3D Scatter (${xKey}, ${yKey}, ${zKey})` }}
        />
      );
    }

    // 2D chart types
    if (twoDType === 'scatter') {
      return (
        <Plot
          data={[
            {
              x,
              y,
              mode: 'markers',
              type: 'scatter',
              marker: { size: 8, color: y, colorscale: 'Viridis' }
            }
          ]}
          layout={{ width: 700, height: 500, title: `2D Scatter (${xKey} vs ${yKey})` }}
        />
      );
    }
    if (twoDType === 'line') {
      return (
        <Plot
          data={[
            {
              x,
              y,
              mode: 'lines+markers',
              type: 'scatter',
              marker: { size: 8, color: y, colorscale: 'Viridis' }
            }
          ]}
          layout={{ width: 700, height: 500, title: `2D Line (${xKey} vs ${yKey})` }}
        />
      );
    }
    if (twoDType === 'bar') {
      return (
        <Plot
          data={[
            {
              x,
              y,
              type: 'bar',
              marker: { color: y, colorscale: 'Viridis' }
            }
          ]}
          layout={{ width: 700, height: 500, title: `2D Bar (${xKey} vs ${yKey})` }}
        />
      );
    }
    if (twoDType === 'heatmap') {
      // For heatmap, you need z as a 2D array. Here, just use y as a single row.
      return (
        <Plot
          data={[
            {
              z: [y],
              x,
              type: 'heatmap',
              colorscale: 'Viridis'
            }
          ]}
          layout={{ width: 700, height: 500, title: `2D Heatmap (${xKey} vs ${yKey})` }}
        />
      );
    }
  }

  return <div>No data to display.</div>;
};

export default ChartComponent;