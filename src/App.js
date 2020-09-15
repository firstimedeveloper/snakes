import React, { useState, useEffect, useRef } from 'react';
import './index.css'

const gridWidth = 20;
const gridHeight = 20;

function Box(props) {
  let color = "bg-gray-200"
  if (props.value === 1) 
    color = "bg-gray-600"
  if (props.value === 2)
    color = "bg-blue-600"
  if (props.value === 3)
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
  const [food, setFood] = useState(() => generateFood(3, snake))
  const [obstacle, setObstacle] = useState(()=> generateObstacle(3, snake, food))
  const [grid, setGrid] = useState(() => generateGrid(snake, food, obstacle))

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

useInterval(()=> {
    if (!gameOver && direction !== "") {
      const newSnake = snakeRef.current
      const newFood = [...food]
      const newObstacle = [...obstacle]
      const currentDir = direction
      const [x, y] = moveSnake(newSnake, currentDir)
      // insert new element to the beginning of the array.
      newSnake.unshift({x,y})
      
      // if value of square in grid at x, y equals one, game is over.
      // console.log(x, y)
      if (grid[x][y] === 1 || grid[x][y] === 3) {
        // console.log("gg")
        setGameOver(true)
        return
      }
      if (grid[x][y] === 2) {
        const idx = newFood.findIndex(val => val.x === x && val.y === y)
        if (idx > -1)
          newFood.splice(idx, 1)
        console.log(idx, newFood)
      } else {
        // remove the last element.
        newSnake.pop()
      }
      lastDirRef.current = currentDir
      setSnake(newSnake)
      snakeRef.current = newSnake
      setFood(newFood)
      setObstacle(newObstacle)
      const newGrid = generateGrid(snake, food, obstacle)
      setGrid(newGrid)
  }
}, 150)

useInterval(() => {
    if (!gameOver && direction !== "") {
      const newFood = [...food]
      let x = 0
      let y = 0
      do {
        x = Math.floor(Math.random() * gridWidth)
        y = Math.floor(Math.random() * gridHeight)
      }
      while (snake.includes({x: x, y: y}) || obstacle.includes({x: x, y: y}))
      newFood.push({x: x, y: y})


      // console.log(newFood)
      setFood(newFood)
    }
}, 5000)

useInterval(() => {
  if (!gameOver && direction !== "") {
    const newObstacle = [...obstacle]
    let x = 0
    let y = 0
    do {
      x = Math.floor(Math.random() * gridWidth)
      y = Math.floor(Math.random() * gridHeight)
    }
    while (snake.includes({x: x, y: y}) || food.includes({x: x, y: y}))
    newObstacle.push({x: x, y: y})

    setObstacle(newObstacle)
  }
}, 5000)

useEffect(() => {
  
})

  const handleKeyDown = (e) => {
    // console.log("clicked!", e.key)
    if (gameOver && e.key === "Enter") {
      resetGame(); 
      return;
    }
    switch (e.key) {
      case "ArrowLeft":
        if (lastDirRef.current === "right" || direction == "")
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
      const newFood = generateFood(3, newSnake)
      const newObstacle = generateObstacle(3, newSnake, newFood)
      setGrid(generateGrid(newSnake, newFood, newObstacle))
      snakeRef.current = newSnake
      setSnake(newSnake)
      setFood(newFood)
      setObstacle(newObstacle)
      setDirection('')
      // snakeRef.current = initialRef.current
    }

  }

  const handleResetKeyDown = (e) => {
    if (e.key == "Enter")
      resetGame();
  }

  return (
    <div tabIndex={0} ref={focusRef} onKeyDown={handleKeyDown} className="flex flex-col justify-center items-center w-screen h-screen focus:outline-none">
      <>
      {gameOver && 
      <div className="flex justify-center w-64 flex-wrap opacity-75 bg-gray-600 border-gray-600 rounded-lg fixed focus:outline-none">
        <div className="text-center text-6xl text-white">
          Game Over
        </div>
        <div className="text-base">
          <div role="button" onClick={resetGame} className="mx-2 px-4 py-2 mt-2 bg-red-500 rounded text-white text-lg hover:bg-red-600 active:bg-red-700">
            Start
          </div>			
        </div>
      </div>  
      }
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
  // console.log(dir)
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

function generateFood(count, snake) {
  let food = []
  let x = 0
  let y = 0
  for (let i=0; i< count; i++) {
    do {
      x = Math.floor(Math.random() * gridWidth)
      y = Math.floor(Math.random() * gridHeight)
    }
    while (snake.includes({x: x, y: y}))
    food.push({x: x, y: y})
  }

  return food
}

function generateObstacle(count, snake, food) {
  let obstacle = []
  let x = 0
  let y = 0
  for (let i=0; i< count; i++) {
    do {
      x = Math.floor(Math.random() * gridWidth)
      y = Math.floor(Math.random() * gridHeight)
    }
    while (snake.includes({x: x, y: y}) || food.includes({x: x,y: y}))
    obstacle.push({x: x, y: y})
  }

  return obstacle
}

function generateGrid(snake, food, obstacle) {
  let newGrid = Array(gridWidth).fill(null).map(x => Array(gridHeight).fill(null))
  
  
  for(let i=0; i<snake.length; i++) {
    let x = snake[i].x
    let y = snake[i].y
    newGrid[x][y] = 1
  }
  for (let i=0; i<food.length; i++) {
    let x = food[i].x
    let y = food[i].y
    newGrid[x][y] = 2
  }
  for (let i=0; i<obstacle.length; i++) {
    let x = obstacle[i].x
    let y = obstacle[i].y
    newGrid[x][y] = 3
  }
  


  return newGrid
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


export default App;
