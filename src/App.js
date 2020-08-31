import React, { useState, useEffect, useRef } from 'react';
import './index.css'

const gridWidth = 20;
const gridHeight = 20;

function Box(props) {
  let color = "bg-gray-200"
  if (props.value === 1) 
    color = "bg-gray-600"

  return (
    <div className={`w-4 h-4 ${color} border`}>
    </div>
  );
}

function Grid(props) {
  return (
    <div className="">
      {props.grid.map((v,i) => {
        return (
          <div key={i} className="flex">
            {v.map((element, j) => {
              return <Box value={element} key={j}/>
            })}
          </div>
        )
      })}
    </div>
  );
}

function App() {
  const [grid, setGrid] = useState(() => generateGrid())
  const [snake, setSnake] = useState(3)
  const [direction, setDirection] = useState('right')
  const [gameOver, setGameOver] = useState(true)

  const focusRef = useRef(null)

  useEffect(()=>{
    focusRef.current.focus()
  })

  useEffect(()=>{
    if (!gameOver) {
      const newGrid = [...grid]
      const interval = setInterval(()=> setGrid(newGrid),1000)
      console.log(direction)
      return () => clearInterval(interval)
    }
  })

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        setDirection("left")
        break;
      case "ArrowRight":
        setDirection("right")
        break;
      case "ArrowUp":
        setDirection("up")
        break;
      case "ArrowDown":
        setDirection("down")
        break;
      default:
        break;
    }
  }

  const handleClick = () => {
    setGameOver(!gameOver)
  }

  return (
    <div ref={focusRef} onKeyDown={handleKeyDown} className="flex flex-col justify-center items-center w-screen h-screen">
      <>
      <Grid grid={grid}/>
      <div role="button" onClick={handleClick} className="px-4 py-2 mt-2 bg-red-600 rounded text-white text-lg">
        {gameOver ? "Start":"Reset"}
      </div>
      </>
    </div>
  );
}

function generateGrid() {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  for(let i=0; i<3; i++) {
    newGrid[gridWidth/2][(gridHeight/2)-i] = 1
  }

  return newGrid
}


export default App;
