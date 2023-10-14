// Initial snake position
let snakeX = 2;
let snakeY = 2;
let snakeDirection = "right";

// Initial food position
let foodX;
let foodY;

// Initialize game container
const gameContainer = document.getElementById("game-container");

// Initialize snake and food elements
const snakeElement = document.getElementById("snake");
const foodElement = document.getElementById("food");

// Function to generate random coordinates for food
function generateFoodPosition() {
  foodX = Math.floor(Math.random() * 15) * 20;
  foodY = Math.floor(Math.random() * 15) * 20;
  foodElement.style.left = foodX + "px";
  foodElement.style.top = foodY + "px";
}

// Initialize game
generateFoodPosition();

function endGame() {
  alert("Game Ended");
  return;
}
// Function to update game state
function updateGame() {
  if (snakeDirection === "right") {
    snakeX += 20;
  } else if (snakeDirection === "left") {
    snakeX -= 20;
  } else if (snakeDirection === "up") {
    snakeY -= 20;
  } else if (snakeDirection === "down") {
    snakeY += 20;
  }

  //todo: get the direction of the box
  const containerWidth = document.getElementById("game-container").offsetWidth;
  const containerHeight = document.getElementById("game-container").offsetHeight;
  

  console.log("container width : " + containerWidth);
  console.log("snake x : " + snakeX);
  console.log("snake y : " + snakeY);

  if (snakeX >= containerWidth || snakeY >= containerHeight || snakeX< 0 || snakeY < 0) endGame();
  else {
    snakeElement.style.left = snakeX + "px";
    snakeElement.style.top = snakeY + "px";

    // Check if snake eats food
    if (snakeX === foodX && snakeY === foodY) {
      generateFoodPosition();
    }

    // Repeat the update every 200ms
    // repeat is the speed 200 
    setTimeout(updateGame, 200);
  }
}

// Handle keyboard input to change snake direction
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && snakeDirection !== "down") {
    snakeDirection = "up";
  } else if (event.key === "ArrowDown" && snakeDirection !== "up") {
    snakeDirection = "down";
  } else if (event.key === "ArrowLeft" && snakeDirection !== "right") {
    snakeDirection = "left";
  } else if (event.key === "ArrowRight" && snakeDirection !== "left") {
    snakeDirection = "right";
  }
});

// Start the game loop
updateGame();
