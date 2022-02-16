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

  let isFirstStart = true;

  function startGame() {
    movePlatform();
    moveBall(isFirstStart);
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

  function moveBall(isFirstStart) {
    let extremeStartingPositionBallOnLeft = 1;
    let extremeStartingPositionBallOnRight = widthField - widthBall;
    let directionLeft = -1;
    let directionRight = 1;
    let correctionPositionBall = 3;

    if (isFirstStart) {
      let startPositionBall = getRandomIntInclusive(
        extremeStartingPositionBallOnLeft,
        extremeStartingPositionBallOnRight
      );
      ball.style.top = extremeStartingPositionBallOnLeft + "px";
      ball.style.left = startPositionBall + "px";
    }

    let directionBall = getRandomIntInclusive(directionLeft, directionRight);
    let ballDownDirection = true;

    let move = setInterval(() => {
      if (ballDownDirection) {
        downMoveBall();
      } else {
        upMoveBall();
      }
    }, 10);

    function downMoveBall() {
      let positionBallX = ball.offsetLeft;
      let positionBallY = ball.offsetTop;
      let positionPlatformY = platform.offsetTop;
      let positionPlatformX = platform.offsetLeft;

      //направление сверху вниз
      if (directionBall == 1) {
        ball.style.top = positionBallY + speedBall + "px";
        ball.style.left = positionBallX + speedBall + "px";
      } else if (directionBall == 0) {
        ball.style.top = positionBallY + speedBall + "px";
      } else if (directionBall == -1) {
        ball.style.top = positionBallY + speedBall + "px";
        ball.style.left = positionBallX - speedBall + "px";
      }


      //отбивание от левой и правой стенки
      if (positionBallX >= widthField - widthBall) {
        directionBall = -1;
      } else if (positionBallX <= 0) {
        directionBall = 1;
      } else if (
        //удар о платформу
        positionBallY + heightBall >= positionPlatformY &&
        positionBallX >= positionPlatformX &&
        positionBallX <= positionPlatformX + widthPlatform
      ) {
        ballDownDirection = false;
      } else if (
        //остановка мяча внизу, удар о нижнюю стенку
        positionBallY >=
        heightField - heightBall - correctionPositionBall
      ) {
        ball.style.background = "red";
        speedBall = 0;
      }
    }

    function upMoveBall() {
      // Обновляем координаты мяча и ракетки
      let positionBallX = ball.offsetLeft;
      let positionBallY = ball.offsetTop;
      let positionPlatformY = platform.offsetTop;
      let positionPlatformX = platform.offsetLeft;

      // Определяем зоны ракетки касание мяча к которым задает соответсвующее направление полета
      let leftPartPlatformLeftBorder = positionPlatformX;
      let centralPartPlatformLeftBorder =
        leftPartPlatformLeftBorder + widthPlatform / 3;
      let centralPartPlatformLRightBorder =
        centralPartPlatformLeftBorder + widthPlatform / 3;
      let rightPartPlatformLRightBorder =
        centralPartPlatformLRightBorder + widthPlatform / 3;

      // Определяем направление полета
      if (
        positionBallY + heightBall >= positionPlatformY &&
        positionBallX + widthBall >= leftPartPlatformLeftBorder &&
        positionBallX + widthBall < centralPartPlatformLeftBorder
      ) {
        directionBall = -1;
      } else if (
        positionBallY + heightBall >= positionPlatformY &&
        positionBallX + widthBall >= centralPartPlatformLeftBorder &&
        positionBallX + widthBall <= centralPartPlatformLRightBorder
      ) {
        directionBall = 0;
      } else if (
        positionBallY + heightBall >= positionPlatformY &&
        positionBallX > centralPartPlatformLRightBorder &&
        positionBallX <= rightPartPlatformLRightBorder
      ) {
        directionBall = 1;
      }

      // Двигаем мячик в соответствии с направлением
      if (directionBall == -1) {
        ball.style.top = ball.offsetTop - speedBall + "px";
        ball.style.left = ball.offsetLeft - speedBall + "px";
      } else if (directionBall == 0) {
        ball.style.top = ball.offsetTop - speedBall + "px";
        ball.style.left = ball.offsetLeft + "px";
      } else if (directionBall == 1) {
        ball.style.top = ball.offsetTop - speedBall + "px";
        ball.style.left = ball.offsetLeft + speedBall + "px";
      }

      // Обрабатываем касание мячом стенок
      if (positionBallX >= widthField - widthBall) {
        directionBall = -1;
      } else if (positionBallX <= 0) {
        directionBall = 1;
      } else if (positionBallY <= 0) {
        clearInterval(move);
        ballDownDirection = true;
        isFirstStart = false;
        moveBall(isFirstStart);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", squash);
