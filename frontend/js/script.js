const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
  // Passing a random 1 - 30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // Clearing the timer and reloading the page on game over
  clearInterval(setIntervalId);

  scoreElement.innerText = "Game Over! Press Enter to replay...";
  //todo: send information to the backend 
  //
  sendSCores()
};

const sendSCores=()=>{
    // Define the URL of the API endpoint
const apiUrl = 'http://localhost:3000/recordScore';

// Data to send in the POST request (in this case, a JSON object)
const postData = {
  score: score,
  level: speed,
};

// Options for the POST request, including the HTTP method, headers, and the request body
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Set the content type to JSON
  },
  body: JSON.stringify(postData), // Convert the data to a JSON string
};

// Make the POST request using the Fetch API
fetch(apiUrl, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response body as JSON
  })
  .then(data => {
    console.log('POST request was successful:', data);
  })
  .catch(error => {
    console.error('There was a problem with the POST request:', error);
  });

 // location.reload();
}

const changeDirection = (e) => {
  // Changing velocity value based on key press
  if (e.key === "Enter") {
    location.reload();
    init();
    scoreElement.innerText = `Score: ${score}`;
  }

  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
    score++; // increment score by 1
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }
  // Updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Shifting forward the values of the elements in the snake body by one
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

  // Checking if the snake's head is out of wall, if so setting gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of the snake's body
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Checking if the snake head hit the body, if so set gameOver to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

let speed =
  localStorage.getItem("speed") != null ? localStorage.getItem("speed") : 300;
const updateLevel = (e) => {
  speed = e.value;
  setIntervalId = setInterval(initGame, speed);
  localStorage.setItem("speed", speed);
  location.reload();
};

const init = () => {
  var selectElement = document.getElementById("selct_level");

  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === speed) {
      selectElement.selectedIndex = i;
      break; // Exit the loop once the option is found
    }
  }

  console.log(speed);
  //selectElement.selectedIndex = 2;
  updateFoodPosition();
  setIntervalId = setInterval(initGame, speed);
  document.addEventListener("keyup", changeDirection);
};

init();
