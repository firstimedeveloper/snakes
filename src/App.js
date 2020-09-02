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
  const [snake, setSnake] = useState(() => generateSnake(5))
  const [grid, setGrid] = useState(() => generateGrid(snake))
  const [direction, setDirection] = useState('right')
  const [gameOver, setGameOver] = useState(true)

  const focusRef = useRef(snake)

  const snakeRef = useRef(snake)

  useEffect(()=>{
    focusRef.current.focus()
  }, [])

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
        console.log(snake[0])
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
        
        setSnake(newSnake)

        const newGrid = generateGrid(snake)
        setGrid(newGrid)
      }, 150)
      
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
