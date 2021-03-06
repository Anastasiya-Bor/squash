function squash() {
  let timerShow = document.getElementById("timer");
  let sec;
  let min;
  let hrs;
  let t;
  let message = document.getElementById("message");
  let platform = document.getElementById("platform");
  let field = document.getElementById("field");
  let startButton = document.getElementById("btn");
  startButton.disabled = false;
  let ball = document.getElementById("ball");

  let widthField = field.getBoundingClientRect().width;
  let widthPlatform = platform.getBoundingClientRect().width;
  let widthBall = ball.getBoundingClientRect().width;
  let heightField = field.getBoundingClientRect().height;
  let heightBall = ball.getBoundingClientRect().height;
  let speedBall;

  startButton.addEventListener("click", startGame);

  let isFirstStart = true;

  function startGame() {
    sec = 0;
    min = 0;
    hrs = 0;
    timerShow.textContent = "00" + ":" + "00" + ":" + "00";
    timer();
    movePlatform();
    moveBall(isFirstStart);
    startButton.disabled = true;
    message.textContent = '';
  }

  function timer() {

    t = setTimeout(add, 1000);

    function tick() {
      sec++;
      if (sec >= 60) {
        sec = 0;
        min++;
      }
      if (min >= 60) {
        min = 0;
        hrs++;
      }
    }

    function add() {
      tick();
      timerShow.textContent =
        (hrs > 9 ? hrs : "0" + hrs) +
        ":" +
        (min > 9 ? min : "0" + min) +
        ":" +
        (sec > 9 ? sec : "0" + sec);
      timer();
    }
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

  function saveRecord() {
    if (localStorage.length === 0) {
      localStorage.setItem("record", timerShow.textContent);
      showRecord();
    } else if (localStorage.getItem("record") < timerShow.textContent) {
      localStorage.setItem("record", timerShow.textContent);
      showRecord();
    } else {
      showTimeSession();
    }
  }

  function showRecord() {
    message.textContent = `This is a new record! ${timerShow.textContent}`;
  }

  function showTimeSession() {
    message.textContent = `You can do better! ${timerShow.textContent}`;
  }

  function _getRandomIntInclusive(min, max) {
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
    speedBall = 1;

    ball.style.background = "rgb(255, 255, 0)";

    if (isFirstStart) {
      let startPositionBall = _getRandomIntInclusive(
        extremeStartingPositionBallOnLeft,
        extremeStartingPositionBallOnRight
      );
      ball.style.top = extremeStartingPositionBallOnLeft + "px";
      ball.style.left = startPositionBall + "px";
    }

    let directionBall = _getRandomIntInclusive(directionLeft, directionRight);
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

      //?????????????????????? ???????????? ????????
      if (directionBall == 1) {
        ball.style.top = positionBallY + speedBall + "px";
        ball.style.left = positionBallX + speedBall + "px";
      } else if (directionBall == 0) {
        ball.style.top = positionBallY + speedBall + "px";
      } else if (directionBall == -1) {
        ball.style.top = positionBallY + speedBall + "px";
        ball.style.left = positionBallX - speedBall + "px";
      }

      //?????????????????? ???? ?????????? ?? ???????????? ????????????
      if (positionBallX >= widthField - widthBall) {
        directionBall = -1;
      } else if (positionBallX <= 0) {
        directionBall = 1;
      } else if (
        //???????? ?? ??????????????????
        positionBallY + heightBall >= positionPlatformY &&
        positionBallX >= positionPlatformX &&
        positionBallX <= positionPlatformX + widthPlatform
      ) {
        ballDownDirection = false;
      } else if (
        //?????????????????? ???????? ??????????, ???????? ?? ???????????? ????????????
        positionBallY >=
        heightField - heightBall - correctionPositionBall
      ) {
        ball.style.background = "red";
        speedBall = 0;
        clearInterval(t);
        clearInterval(move);
        saveRecord();
        startButton.disabled = false;
        isFirstStart = true;
      }
    }

    function upMoveBall() {
      // ?????????????????? ???????????????????? ???????? ?? ??????????????
      let positionBallX = ball.offsetLeft;
      let positionBallY = ball.offsetTop;
      let positionPlatformY = platform.offsetTop;
      let positionPlatformX = platform.offsetLeft;

      // ???????????????????? ???????? ?????????????? ?????????????? ???????? ?? ?????????????? ???????????? ???????????????????????????? ?????????????????????? ????????????
      let leftPartPlatformLeftBorder = positionPlatformX;
      let centralPartPlatformLeftBorder =
        leftPartPlatformLeftBorder + widthPlatform / 3;
      let centralPartPlatformLRightBorder =
        centralPartPlatformLeftBorder + widthPlatform / 3;
      let rightPartPlatformLRightBorder =
        centralPartPlatformLRightBorder + widthPlatform / 3;

      // ???????????????????? ?????????????????????? ????????????
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

      // ?????????????? ?????????? ?? ???????????????????????? ?? ????????????????????????
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

      // ???????????????????????? ?????????????? ?????????? ????????????
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
