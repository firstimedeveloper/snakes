import React, { useState, useEffect, useRef } from 'react';
import './index.css'
import { getNodeText } from '@testing-library/react';

const gridWidth = 20;
const gridHeight = 20;

function Box(props) {
  let color = "bg-gray-200"
  if (props.value === 1) 
    color = "bg-gray-600"
  if (props.value === 2)
    color = "bg-red-600"

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
  const [snake, setSnake] = useState(() => generateSnake(5))
  const [grid, setGrid] = useState(() => generateGrid(snake))
  const [direction, setDirection] = useState('right')
  const [gameOver, setGameOver] = useState(false)
  const [gamePause, setGamePause] = useState(true)
  

  const focusRef = useRef(snake)

  const snakeRef = useRef(snake)

  useEffect(()=>{
    focusRef.current.focus()
  }, [])

  useEffect(()=>{
    if (!gameOver && !gamePause) {
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
        let x = snakeRef.current[0].x + dx
        let y = snakeRef.current[0].y + dy
        let newSnake = snakeRef.current
        if (x > gridHeight - 1)
        x = 0
        if (x < 0)
          x = gridHeight - 1
        if (y > gridWidth - 1) 
          y = 0
        if (y < 0)
          y = gridWidth - 1
        newSnake.unshift({x,y})
        newSnake.pop()
        if (grid[x][y] === 1) {
          setGameOver(true)
          setGamePause(false)
          return
        }
        
        setSnake(newSnake)

        const newGrid = generateGrid(snake)
        setGrid(newGrid)
      }, 150)
      
      return () => clearInterval(interval)
    }
  })

  const handleKeyDown = (e) => {
    if (gamePause) 
      return
    switch (e.key) {
      case "ArrowLeft":
        if (direction === "right")
          return
        setDirection("left")
        break;
      case "ArrowRight":
        if (direction === "left")
          return
        setDirection("right")
        break;
      case "ArrowUp":
        if (direction === "down")
          return
        setDirection("up")
        break;
      case "ArrowDown":
        if (direction === "up")
          return
        setDirection("down")
        break;
      default:
        break;
    }
  }

  const pauseGame = () => {
    setGamePause(!gamePause)

  }

  const resetGame = () => {
    setGameOver(!gameOver)    
  }

  return (
    <div tabIndex={0} ref={focusRef} onKeyDown={handleKeyDown} className="flex flex-col justify-center items-center w-screen h-screen focus:outline-none">
      <>
      <Grid grid={grid}/>
      <div className="flex flex-row">
        {gameOver ? 
          <div role="button" onClick={resetGame} className="mx-2 px-4 py-2 mt-2 bg-red-600 rounded text-white text-lg">
          Reset
        </div> :
          <div role="button" onClick={pauseGame} className="mx-2 px-4 py-2 mt-2 bg-red-600 rounded text-white text-lg">
          {gamePause ? "Start":"Pause"}
        </div>}
      </div>
      </>
    </div>
  );
}

function generateSnake(len) {
  let snake = []
  for(let i=0; i<len; i++) {
    snake.push({x: gridWidth/2, y: (gridHeight/2)-i})
  }


  return snake
}

function generateGrid(snake) {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  
  
  for(let i=0; i<snake.length; i++) {
    let x = snake[i].x
    let y = snake[i].y
    newGrid[x][y] = 1
  }
  


  return newGrid
}


export default App;
