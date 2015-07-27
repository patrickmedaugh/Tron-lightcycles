var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 675;
context.fillStyle = "black";
context.fillRect(0,0,1200,675);
document.body.appendChild(canvas);

function Cycle(x, y, color, speed, player) {
  this.x = x;
  this.y = y;
  this.player = player;
  this.width = 10;
  this.height = 10;
  this.color = color;
  this.speed = speed;
  this.crashed = false;
}

Cycle.prototype.draw = function () {
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
}

function getNextPixels (x, y, direction) {
  directions = {
    "vertical": context.getImageData(x + 10, y, 1, 1).data,
    "horizontal": context.getImageData(x, y + 10, 1, 1).data
  }
  return [context.getImageData(x, y, 1, 1).data, directions[direction]]
};

function detectCollision (nextSquare) {
  return (nextSquare[0] !== 0 || nextSquare[1] !== 0 || nextSquare[2] !== 0)
};


function detectEdge (cycle) {
  if (cycle.x < 0 || cycle.y < 0 || cycle.x > canvas.width - 10 || cycle.y > canvas.height - 10) {
    console.log("edge collide");
    return true;
  } else {
    return false;
  }
};

Cycle.prototype.edgeCrash = function () {
  if (detectEdge(this)) {
    this.crashed = true;
  };
};

Cycle.prototype.move = function (direction) {
  var _this = this;
  directions = {
    "up" : function () {
      var nextSquare = getNextPixels(_this.x, _this.y - 1, "vertical");
      _this.stopped = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.crashed = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.y -= _this.speed;
    },
    "down" : function () {
      var nextSquare = getNextPixels(_this.x, _this.y + 10, "vertical");
      _this.stopped = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.crashed = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.y += _this.speed;
    },
    "left" : function () {
      var nextSquare = getNextPixels(_this.x - 1, _this.y, "horizontal");
      _this.stopped = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.crashed = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.x -= _this.speed;
    },
    "right" : function () {
      var nextSquare = getNextPixels(_this.x + 10, _this.y, "horizontal");
      _this.stopped = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.crashed = detectCollision(nextSquare[0]) || detectCollision(nextSquare[1]);
      _this.x += _this.speed;
    }
  };
  directions[direction]();
};

var keysDownOne = { 39 : true };
var keysDownTwo = { 65 : true };

var playerOneControls = function () {
  cycles[1].edgeCrash();
  addEventListener("keydown", function (e) {
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39 ) {
      keysDownOne = {};
      keysDownOne[e.keyCode] = true;
    };
  }, false);

  if (cycles[0].crashed === false) {
    if (38 in keysDownOne) {
      cycles[0].move("up");
    };
    if (40 in keysDownOne) {
      cycles[0].move("down");
    };
    if (37 in keysDownOne) {
      cycles[0].move("left");
    };
    if (39 in keysDownOne) {
      cycles[0].move("right");
    };
  } else {
    keysDownOne = {};
  };
};

var playerTwoControls = function () {
  cycles[1].edgeCrash();
  addEventListener("keydown", function (e) {
    if (e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 65 || e.keyCode === 68 ) {
    keysDownTwo = {};
    keysDownTwo[e.keyCode] = true;
    };
  }, false);

  if (cycles[1].crashed === false) {
    if (87 in keysDownTwo) {
      cycles[1].move("up");
    };
    if (83 in keysDownTwo) {
      cycles[1].move("down");
    };
    if (65 in keysDownTwo) {
      cycles[1].move("left");
    };
    if (68 in keysDownTwo) {
      cycles[1].move("right");
    };
  } else {
    keysDownTwo = {};
  };
};

var cycles = [];

cycles.push(new Cycle(50, 300, "red", 5, 1));
cycles.push(new Cycle(1140, 300, "#1B82E6", 5, 2));

var keyCodeSpeeds = {
  49: 4,
  50: 5,
  51: 7,
  52: 9,
}

addEventListener("keydown", function(e) {
  if(keyCodeSpeeds[e.keyCode]) {
    context.fillStyle = "black";
    context.fillRect(0,0,1200,675);
    keysDownOne = { 39 : true };
    keysDownTwo = { 65 : true };
    cycles[0].x = 50;
    cycles[0].y = 300;
    cycles[0].crashed = false;
    cycles[0].speed = keyCodeSpeeds[e.keyCode];
    cycles[1].x = 1140;
    cycles[1].y = 300;
    cycles[1].crashed = false;
    cycles[1].speed = keyCodeSpeeds[e.keyCode];
}
});

    requestAnimationFrame(function gameLoop() {
      playerOneControls();
      playerTwoControls();
      cycles.forEach(function (cycle) {
        cycle.draw();
      });
      requestAnimationFrame(gameLoop);
    });



