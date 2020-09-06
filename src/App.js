import React, { useState, useEffect, useRef } from 'react';
import './index.css'

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
  const [obstacles, setObstacles] = useState(() => generateObstacles(3, snake))
  const [grid, setGrid] = useState(() => generateGrid(snake, obstacles))

  const [direction, setDirection] = useState('')
  const [gameOver, setGameOver] = useState(false)  

  const focusRef = useRef(snake)

  const snakeRef = useRef(snake)
  const lastDirRef = useRef(direction)

  const initialRef = useRef(null)

  useEffect(()=>{
    focusRef.current.focus()
    initialRef.current = snakeRef.current
  }, [])

  useEffect(()=>{
    if (!gameOver && direction !== "") {
      const interval = setInterval(()=> {
        const newSnake = snakeRef.current
        const currentDir = direction
        const [x, y] = moveSnake(newSnake, currentDir)
        // insert new element to the beginning of the array.
        newSnake.unshift({x,y})
        // remove the last element.
        newSnake.pop()
        // if value of square in grid at x, y equals one, game is over.
        console.log(x, y)

        if (grid[x][y] === 1) {
          console.log("gg")
          setGameOver(true)
          return
        }
        lastDirRef.current = currentDir
        setSnake(newSnake)
        snakeRef.current = newSnake

        const newGrid = generateGrid(snake, obstacles)
        setGrid(newGrid)
      }, 100)
      
      return () => {
        clearInterval(interval)
      }
    }
  })

  const handleKeyDown = (e) => {
    console.log("clicked!", e.key)
    switch (e.key) {
      case "ArrowLeft":
        if (lastDirRef.current === "right")
          return
        setDirection("left")
        break;
      case "ArrowRight":
        if (lastDirRef.current === "left")
          return
        setDirection("right")
        break;
      case "ArrowUp":
        if (lastDirRef.current === "down")
          return
        setDirection("up")
        break;
      case "ArrowDown":
        if (lastDirRef.current === "up")
          return
        setDirection("down")
        break;
      default:
        break;
    }
  }

  const resetGame = () => {
    if (!gameOver && direction === "") {
      setDirection("right")
    }
    if (gameOver) {
      setGameOver(!gameOver)
      const newSnake = generateSnake(5)
      const newObstacles = generateObstacles(3, newSnake)
      setGrid(generateGrid(newSnake, newObstacles))
      snakeRef.current = newSnake
      setSnake(newSnake)
      setObstacles(newObstacles)
      setDirection('')
      // snakeRef.current = initialRef.current
    }

  }

  return (
    <div tabIndex={0} ref={focusRef} onKeyDown={handleKeyDown} className="flex flex-col justify-center items-center w-screen h-screen focus:outline-none">
      <>
      <Grid grid={grid} />
      <div className="flex flex-row">
        <div role="button" onClick={resetGame} className="mx-2 px-4 py-2 mt-2 bg-red-500 rounded text-white text-lg hover:bg-red-600 active:bg-red-700">
          Start
        </div>
      </div>
      </>
    </div>
  );
}

const calculateDirection = (dir) => {
  let dx = 0
  let dy = 0 
  switch (dir) {
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
  return [dx, dy]
}
const moveSnake = (snake, dir) => {
  const [dx, dy] = calculateDirection(dir)
  console.log(dir)
  let x = snake[0].x + dx
  let y = snake[0].y + dy
  if (x > gridHeight - 1)
  x = 0
  if (x < 0)
    x = gridHeight - 1
  if (y > gridWidth - 1) 
    y = 0
  if (y < 0)
    y = gridWidth - 1
  
  return [x, y]
}

function generateSnake(len) {
  let snake = []
  for(let i=0; i<len; i++) {
    snake.push({x: gridWidth/2, y: (gridHeight/2)-i})
  }


  return snake
}

function generateObstacles(count, snake) {
  let obstacles = []
  let x = 0
  let y = 0
  for (let i=0; i< count; i++) {
    do {
      x = Math.floor(Math.random() * gridWidth)
      y = Math.floor(Math.random() * gridHeight)
    }
    while (snake.includes({x: x, y: y}))
    obstacles.push({x: x, y: y})
  }

  return obstacles
}

function generateGrid(snake, obstacles) {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  
  
  for(let i=0; i<snake.length; i++) {
    let x = snake[i].x
    let y = snake[i].y
    newGrid[x][y] = 1
  }
  for (let i=0; i<obstacles.length; i++) {
    let x = obstacles[i].x
    let y = obstacles[i].y
    newGrid[x][y] = 2
  }
  


  return newGrid
}


export default App;
