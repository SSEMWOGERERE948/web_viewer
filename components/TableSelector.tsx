import React, { useState } from "react";

interface TableSelectorProps {
  onSelect: (rows: number, cols: number) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onSelect }) => {
  const [selectedRows, setSelectedRows] = useState(1);
  const [selectedCols, setSelectedCols] = useState(1);

  return (
    <div className="absolute bg-white border border-gray-300 shadow-md p-2 rounded-md text-xs">
      <p className="text-gray-700 font-medium mb-1">{selectedRows} × {selectedCols}</p>
      <div className="grid grid-cols-6 gap-[2px]">
        {[...Array(6)].map((_, row) => (
          <div key={row} className="flex">
            {[...Array(6)].map((_, col) => (
              <div
                key={col}
                className={`w-5 h-5 border cursor-pointer transition-all ${
                  row < selectedRows && col < selectedCols ? "bg-blue-500" : "bg-gray-200"
                }`}
                onMouseEnter={() => {
                  setSelectedRows(row + 1);
                  setSelectedCols(col + 1);
                }}
                onClick={() => onSelect(selectedRows, selectedCols)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelector;
