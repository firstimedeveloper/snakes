import React, { useState } from 'react';
import './index.css'

const gridWidth = 20;
const gridHeight = 20;

function Box(props) {
  return (
    <div className="w-4 h-4 bg-gray-200 border">
      {props.value}
    </div>
  );
}

function Grid(props) {
  return (
    <div className="container">
      {props.grid.map((v,i) => {
        return (
          <div className="flex">
            {v.map((element, j) => {
              return <Box value={v} key={i}/>
            })}
          </div>
        )
      })}
    </div>
  );
}

function App() {
  const [grid, setGrid] = useState(() => generateGrid())

  return (
    <Grid grid={grid}/>
  );
}

function generateGrid() {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  console.log(newGrid)
  return newGrid
}


export default App;
