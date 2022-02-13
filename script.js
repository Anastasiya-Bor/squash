function squash() {
  let platform = document.getElementById("platform");
  let field = document.getElementById("field");
  let startButton = document.getElementById("btn");
  let ball = document.getElementById("ball");

  let widthField = field.getBoundingClientRect().width;
  let widthPlatform = platform.getBoundingClientRect().width;
  let widthBall = ball.getBoundingClientRect().width;
  let heightField = field.getBoundingClientRect().height;
  let heightBall = ball.getBoundingClientRect().height;
  let speedBall = 1;

  startButton.addEventListener("click", startGame);

  function startGame() {
    movePlatform();
    downMoveBall();
  }

  function movePlatform() {
    let speedPlatform = 10;
    document.addEventListener("keydown", (keyboardEvent) => {
      if (
        keyboardEvent.key == "ArrowLeft" ||
        keyboardEvent.key == "ArrowRight"
      ) {
        let positionPlatform = platform.offsetLeft;
        let acceleration = setInterval(() => ++speedPlatform, 1000);
        document.addEventListener("keyup", () => {
          clearInterval(acceleration);
          speedPlatform = 7;
        });
        if (keyboardEvent.key == "ArrowLeft") {
          platform.style.left = positionPlatform - speedPlatform + "px";
          if (positionPlatform <= 0) {
            platform.style.left = 0 + "px";
          }
        } else if (keyboardEvent.key == "ArrowRight") {
          platform.style.left = positionPlatform + speedPlatform + "px";
          if (positionPlatform >= widthField - widthPlatform) {
            platform.style.left = widthField - widthPlatform + "px";
          }
        }
      }
    });
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function downMoveBall() {
    let possibleBallAppearancePositionLeft = 1;
    let possibleBallAppearancePositionRight = widthField - widthBall;
    let directionLeft = -1;
    let directionRight = 1;
    let stopCorrectionBall = 3;

    let startPositionBall = getRandomIntInclusive(
      possibleBallAppearancePositionLeft,
      possibleBallAppearancePositionRight
    );
    ball.style.top = possibleBallAppearancePositionLeft + "px";
    ball.style.left = startPositionBall + "px";

    let directionBall = getRandomIntInclusive(directionLeft, directionRight);
    let ballDownDirection = true;

    let move = setInterval(() => {
      let positionBallX = ball.offsetLeft;
      let positionBallY = ball.offsetTop;

      if (ballDownDirection) {
        if (directionBall == 1) {
          //направление сверху вниз
          ball.style.top = positionBallY + speedBall + "px";
          ball.style.left = positionBallX + speedBall + "px";
        } else if (directionBall == 0) {
          ball.style.top = positionBallY + speedBall + "px";
        } else if (directionBall == -1) {
          ball.style.top = positionBallY + speedBall + "px";
          ball.style.left = positionBallX - speedBall + "px";
        }

        let positionPlatformY = platform.offsetTop;
        let positionPlatformX = platform.offsetLeft;

        if (positionBallX >= widthField - widthBall) {
          //отбивание от левой и правой стенки
          directionBall = -1;
        } else if (positionBallX <= 0) {
          directionBall = 1;
        } else if (
          //удар о платформу
          positionBallY + heightBall >= positionPlatformY &&
          positionBallX >= positionPlatformX &&
          positionBallX <= positionPlatformX + widthPlatform
        ) {
          upMoveBall();
          ballDownDirection = false;
        } else if (
          //остановка мяча внизу, удар о нижнюю стенку
          positionBallY >=
          heightField - heightBall - stopCorrectionBall
        ) {
          ball.style.background = "red";
          speedBall = 0;
        }
      } else {
        //полет вверх
        upMoveBall();
      }
    }, 10);
  }

  function upMoveBall() {
    // let positionPlatformX = platform.offsetLeft;
    let firstPartPlatform = platform.offsetLeft + widthPlatform / 2;
    let secondPartPlatform =
      platform.offsetLeft + widthPlatform / 2 - widthPlatform;

    if ((ball.offsetLeft = firstPartPlatform)) {
      ball.style.top = ball.offsetTop - speedBall + "px";
      ball.style.left = ball.offsetLeft - speedBall + "px";
      console.log("полет влево");
    } else if ((ball.offsetLeft = secondPartPlatform)) {
      ball.style.top = ball.offsetTop - speedBall + "px";
      ball.style.left = ball.offsetLeft + speedBall + "px";
      console.log("полет вправо");
    }

    if (ball.offsetTop <= 0) {
      ballDownDirection = true;
      clearInterval(move);
      downMoveBall();
    }
  }
}

document.addEventListener("DOMContentLoaded", squash);
