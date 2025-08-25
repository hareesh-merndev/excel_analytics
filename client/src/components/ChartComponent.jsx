// src/components/ChartComponent.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const ChartComponent = ({ data, xKey, yKey, chartType, twoDType, threeDType, fullTable }) => {
  const toNumberArray = (arr) =>
    arr.map((v) => {
      const num = Number(v);
      return isNaN(num) ? 0 : num;
    });

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data to visualize.</div>;
  }

  // Full-table mode
  if (fullTable) {
    const z = data.map((row) =>
      Object.values(row).map((v) => (isNaN(Number(v)) ? null : Number(v)))
    );

    if (chartType === '3D') {
      return (
        <Plot
          data={[{ z, type: 'surface', colorscale: 'Viridis' }]}
          layout={{
            width: 700,
            height: 500,
            title: '3D Surface (Full Table)',
            paper_bgcolor: '#0d1117',
            plot_bgcolor: '#0d1117',
            font: { color: '#00fff7' },
          }}
        />
      );
    }

    return (
      <Plot
        data={[{ z, type: 'heatmap', colorscale: 'Viridis' }]}
        layout={{
          width: 700,
          height: 500,
          title: '2D Heatmap (Full Table)',
          paper_bgcolor: '#0d1117',
          plot_bgcolor: '#0d1117',
          font: { color: '#00fff7' },
        }}
      />
    );
  }

  if (!xKey || !yKey) {
    return <div>Please select both X and Y columns.</div>;
  }

  const x = data.map((row) => row[xKey]);
  const y = toNumberArray(data.map((row) => row[yKey]));

  // === 3D Charts ===
  if (chartType === '3D') {
    const columns = Object.keys(data[0] || {});
    const zKey = columns.find((col) => col !== xKey && col !== yKey) || yKey;
    const z = toNumberArray(data.map((row) => row[zKey]));

    switch (threeDType) {
      case 'scatter3d':
        return (
          <Plot
            data={[
              {
                x: toNumberArray(x),
                y,
                z,
                type: 'scatter3d',
                mode: 'markers',
                marker: { size: 5, color: z, colorscale: 'Viridis' },
              },
            ]}
            layout={{
              width: 700,
              height: 500,
              title: `3D Scatter: ${xKey}, ${yKey}, ${zKey}`,
              paper_bgcolor: '#0d1117',
              plot_bgcolor: '#0d1117',
              font: { color: '#00fff7' },
            }}
          />
        );

      case 'bar3d':
        return (
          <Plot
            data={[
              {
                x: toNumberArray(x),
                y,
                z,
                type: 'mesh3d',
                opacity: 0.8,
                color: '#00bfff',
              },
            ]}
            layout={{
              width: 700,
              height: 500,
              title: `3D Bar Chart (Mesh): ${xKey}, ${yKey}, ${zKey}`,
              paper_bgcolor: '#0d1117',
              plot_bgcolor: '#0d1117',
              font: { color: '#00fff7' },
            }}
          />
        );

      case 'heatmap3d':
        return (
          <Plot
            data={[
              {
                x: toNumberArray(x),
                y,
                z,
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                  size: 5,
                  color: z,
                  colorscale: 'Jet',
                  opacity: 0.8,
                },
              },
            ]}
            layout={{
              width: 700,
              height: 500,
              title: `3D Heatmap Style: ${xKey}, ${yKey}, ${zKey}`,
              paper_bgcolor: '#0d1117',
              plot_bgcolor: '#0d1117',
              font: { color: '#00fff7' },
            }}
          />
        );

      case 'surface':
      default:
        const surfaceData = data.map((row) =>
          Object.values(row).map((v) => (isNaN(Number(v)) ? null : Number(v)))
        );
        return (
          <Plot
            data={[{ z: surfaceData, type: 'surface', colorscale: 'Viridis' }]}
            layout={{
              width: 700,
              height: 500,
              title: '3D Surface Plot',
              paper_bgcolor: '#0d1117',
              plot_bgcolor: '#0d1117',
              font: { color: '#00fff7' },
            }}
          />
        );
    }
  }

  // === 2D Charts ===
  const chartMap = {
    scatter: { type: 'scatter', mode: 'markers', title: `Scatter: ${xKey} vs ${yKey}` },
    line: { type: 'scatter', mode: 'lines+markers', title: `Line: ${xKey} vs ${yKey}` },
    bar: { type: 'bar', title: `Bar: ${xKey} vs ${yKey}` },
    area: { type: 'scatter', mode: 'lines', fill: 'tozeroy', title: `Area: ${xKey} vs ${yKey}` },
    histogram: { type: 'histogram', title: `Histogram: ${yKey}` },
    heatmap: { type: 'heatmap', title: `Heatmap: ${xKey} vs ${yKey}` },
    pie: { type: 'pie', title: `Pie: ${yKey} by ${xKey}` },
    donut: { type: 'pie', hole: 0.4, title: `Donut: ${yKey} by ${xKey}` },
  };

  const selected = chartMap[twoDType] || chartMap.bar;
  let plotData = [];

  if (twoDType === 'pie' || twoDType === 'donut') {
    plotData = [
      {
        labels: x,
        values: y,
        type: 'pie',
        hole: twoDType === 'donut' ? 0.4 : 0,
        textinfo: 'label+percent',
        insidetextorientation: 'radial',
      },
    ];
  } else if (twoDType === 'heatmap') {
    plotData = [
      {
        z: [y],
        x,
        type: 'heatmap',
        colorscale: 'Viridis',
      },
    ];
  } else if (twoDType === 'histogram') {
    plotData = [
      {
        x: y,
        type: 'histogram',
        marker: { color: '#00bfff' },
      },
    ];
  } else {
    plotData = [
      {
        x,
        y,
        type: selected.type,
        mode: selected.mode,
        fill: selected.fill,
        marker: { color: y, colorscale: 'Viridis', size: 8 },
      },
    ];
  }

  return (
    <Plot
      data={plotData}
      layout={{
        width: 700,
        height: 500,
        title: selected.title,
        paper_bgcolor: '#0d1117',
        plot_bgcolor: '#0d1117',
        font: { color: '#00fff7' },
      }}
    />
  );
};

export default ChartComponent;
