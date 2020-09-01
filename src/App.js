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

  const focusRef = useRef(null)

  useEffect(()=>{
    focusRef.current.focus()
  })

  useEffect(()=>{
    if (!gameOver) {
      let newGrid = []      
      const interval = setInterval(()=> {
        console.log(sPos)
        setSPos(prevPos => {
          let x = prevPos.x
          let y = prevPos.y
          if (x > gridWidth)
            x = 0
          if (x < 0)
            x = gridWidth-1
          if (y > gridHeight) 
            y = 0
          if (y < 0)
            y = gridHeight - 1
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
  
          return {x: x+dx, y: y+dy}
        })
        newGrid = generateGrid(sPos, sLength)
        

        setGrid(newGrid)
      },200)
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
  newGrid[position.x][position.y] = 1

  return newGrid
}


export default App;
