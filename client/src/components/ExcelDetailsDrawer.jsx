import React, { useMemo, useRef } from 'react';
import Draggable from 'react-draggable';
import './ExcelDetailsDrawer.css';

const ExcelDetailsDrawer = ({ data, originalData }) => {
  if (!data || data.length === 0) return null;

  const nodeRef = useRef(null);

  // Detect changed cells
  const diffs = useMemo(() => {
    const changes = [];
    if (!originalData || originalData.length === 0) return changes;

    for (let i = 0; i < Math.min(data.length, originalData.length); i++) {
      const rowChanges = {};
      for (const key of Object.keys(data[i])) {
        if (data[i][key] !== originalData[i][key]) {
          rowChanges[key] = true;
        }
      }
      if (Object.keys(rowChanges).length > 0) {
        changes[i] = rowChanges;
      }
    }
    return changes;
  }, [data, originalData]);

  return (
    <Draggable handle=".drawer-heading" nodeRef={nodeRef}>
      <div ref={nodeRef} className="drawer-neon">
        <h4 className="drawer-heading">📄 Drag Me - Excel Preview</h4>
        <pre className="drawer-pre">
          {data.map((row, rowIndex) => {
            const keys = Object.keys(row);
            const rowChanges = diffs[rowIndex] || {};
            return (
              <div key={rowIndex}>
                {keys.map((key, i) => {
                  const value = row[key];
                  const isChanged = rowChanges[key];
                  return (
                    <span
                      key={i}
                      style={{
                        color: isChanged ? '#ff0' : '#0f0',
                        backgroundColor: isChanged ? '#333' : 'transparent',
                        fontWeight: isChanged ? 'bold' : 'normal'
                      }}
                    >
                      {`${key}: ${value}`}
                      {i < keys.length - 1 ? ' | ' : ''}
                    </span>
                  );
                })}
                <br />
              </div>
            );
          })}
        </pre>
      </div>
    </Draggable>
  );
};

export default ExcelDetailsDrawer;
