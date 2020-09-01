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
  const [sLength, setSLength] = useState(3)
  const [sPos, setSPos] = useState({x:gridWidth/2, y:gridHeight/2})
  const [grid, setGrid] = useState(() => generateGrid(sPos, sLength))
  const [direction, setDirection] = useState('right')
  const [gameOver, setGameOver] = useState(true)

  const focusRef = useRef(sPos)

  const posRef = useRef(sPos)

  useEffect(()=>{
    focusRef.current.focus()
  })

  useEffect(()=>{
    if (!gameOver) {
      const interval = setInterval(()=> {
        let dx = 0
        let dy = 0 
        switch (direction) {
          case "right":
            dy = 1
            break;
          case "left":
            dy = -1
            break;
          case "up":
            dx = -1
            break;
          case "down":
            dx = 1
            break;
          default:
            break;
        }
        
        setSPos((prevPos) => {
          let x = prevPos.x + dx
          let y = prevPos.y + dy
          if (x > gridHeight - 1)
          x = 0
          if (x < 0)
            x = gridHeight - 1
          if (y > gridWidth - 1) 
            y = 0
          if (y < 0)
            y = gridWidth - 1

          return {x: x, y: y}
        })

        const newGrid = generateGrid(sPos, sLength)
        setGrid(newGrid)
      }, 50)
      
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
    <div tabIndex={0} ref={focusRef} onKeyDown={handleKeyDown} className="flex flex-col justify-center items-center w-screen h-screen focus:outline-none">
      <>
      <Grid grid={grid}/>
      <div role="button" onClick={handleClick} className="px-4 py-2 mt-2 bg-red-600 rounded text-white text-lg">
        {gameOver ? "Start":"Reset"}
      </div>
      </>
    </div>
  );
}

function generateGrid(position, len) {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  // for(let i=0; i<len; i++) {
  //   newGrid[position.x][(position.y)-i] = 1
  // }
  let x = position.x
  let y = position.y
  

  newGrid[x][y] = 1

  return newGrid
}


export default App;
