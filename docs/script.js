$(function() {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');

    var snake = [
        {x:200, y:100, oldX:0, oldY:0},
        {x:200, y:90, oldX:0, oldY:0},
        {x:200, y:80, oldX:0, oldY:0},
    ];
    var food = {x:100, y:100, eaten:false};
    movableFood = {x:-50, y:-50, state:"right", count:0};

    var snakeWidth = snakeHeight = 10;
    var blockSize = 10;
    var snakeColor;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const a = 65;
    const b = 66;
    const ENTER = 13;

    var keyPressed = DOWN;
    var score = 0;
    var game;

    var konamiCode = [UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, b, a, ENTER];
    var konamiCodePos = 0;
    var cheats = false;
    var rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

    var pinkCode = [48, 57, 49, 53, 50, 49, 13];
    pinkCodePos = 0;
    cheatsPink = false;
    
    const HIGH_SCORES = "highScores";
    const highScoreString = localStorage.getItem(HIGH_SCORES);
    const highScores = JSON.parse(highScoreString) ?? [];

    $("#greenButton").on("click", function() {
        snakeColor = 'green';
        game = setInterval(gameLoop, 100);
        $("#selectionMenu").css("display", "none");
    });

    $("#blueButton").on("click", function() {
        snakeColor = 'blue';
        game = setInterval(gameLoop, 100);
        $("#selectionMenu").css("display", "none");
    });

    $("#yellowButton").on("click", function() {
        snakeColor = 'yellow';
        game = setInterval(gameLoop, 100);
        $("#selectionMenu").css("display", "none");
    });

    $("#purpleButton").on("click", function() {
        snakeColor = 'purple';
        game = setInterval(gameLoop, 100);
        $("#selectionMenu").css("display", "none");
    });

    $("#playAgainButton").on("click", function() {
        if (cheats == false) {
            $("#selectionMenu").css("display", "block");
        }
        $("#gameOverScreen").css("display", "none");
        $("#highScores").css("display", "none");
        score = 0;
        $("#score").text(score);
        snake = [
            {x:200, y:100, oldX:0, oldY:0},
            {x:200, y:90, oldX:0, oldY:0},
            {x:200, y:80, oldX:0, oldY:0},
        ];
        keyPressed = DOWN;
        movableFood = {x:-50, y:-50, state:"right", count:0};
        if (cheats == true) {
            game = setInterval(gameLoop, 100);
        }
    });

    function gameLoop() {
        clearCanvas();
        if (score % 10 == 0 && score != 0) {
            drawMovableFood();
        }
        else {
            drawFood();
        }
        moveSnake();
        drawSnake();
    }

    function moveSnake() {
        $.each(snake, function(index, value) {
            snake[index].oldX = value.x;
            snake[index].oldY = value.y;
            if (index == 0) {
                if(keyPressed == DOWN) {
                    snake[index].y = value.y + blockSize;
                }
                else if(keyPressed == UP) {
                    snake[index].y = value.y - blockSize;
                }
                else if(keyPressed == RIGHT) {
                    snake[index].x = value.x + blockSize;
                }
                else if(keyPressed == LEFT) {
                    snake[index].x = value.x - blockSize;
                }
            }
            else {
                snake[index].x = snake[index - 1].oldX;
                snake[index].y = snake[index - 1].oldY;
            }
        });
    }

    function drawSnake() {
        $.each(snake, function(index, value) {
            if (cheats == true) {
                ctx.fillStyle = rainbow[index % 7];
            }
            else if (cheatsPink == true) {
                ctx.fillStyle = "pink";
            }
            else {
                ctx.fillStyle = snakeColor;
            }
            ctx.fillRect(value.x, value.y, snakeWidth, snakeHeight);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(value.x, value.y, snakeWidth, snakeHeight);
            if (index == 0) {
                if (collide(value.x,value.y)) {
                    gameOver();
                }
                if (eatFood(value.x,value.y)) {
                    score++;
                    $("#score").text(score);
                    increaseSnakeSize();
                    food.eaten = true;
                }
                if (eatMovableFood(value.x,value.y,snake[1].x,snake[1].y)) {
                    score+=5;
                    $("#score").text(score);
                    increaseSnakeSize();
                    increaseSnakeSize();
                    increaseSnakeSize();
                    increaseSnakeSize();
                    increaseSnakeSize();
                    movableFood = {x:-50, y:-50, state:"right", count:0};
                }
            }
        });
    }

    function increaseSnakeSize() {
        snake.push({
            x: snake[snake.length - 1].oldX,
            y: snake[snake.length - 1].oldY
        })
        if (score % 10 == 0 && score != 0) {
            movableFood = getNewPositionForFood();
        }
    }

    function collide(x, y) {
        return snake.filter(function(value,index) {
            return index != 0 && value.x == x && value.y == y;
        }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height;
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        if (food.eaten == true) {
            food = getNewPositionForFood();
        }
        ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
    }

    function drawMovableFood() {
        ctx.fillStyle = 'gold';
        if(movableFood.state == "right") {
            movableFood.x += blockSize;
            movableFood.count++
            if(movableFood.count == 4) {
                movableFood.state = "down";
                movableFood.count = 0;
            }
        }
        else if(movableFood.state == "down") {
            movableFood.y += blockSize;
            movableFood.count++
            if(movableFood.count == 4) {
                movableFood.state = "left";
                movableFood.count = 0;
            }
        }
        else if(movableFood.state == "left") {
            movableFood.x -= blockSize;
            movableFood.count++
            if(movableFood.count == 4) {
                movableFood.state = "up";
                movableFood.count = 0;
            }
        }
        else if(movableFood.state == "up") {
            movableFood.y -= blockSize;
            movableFood.count++
            if(movableFood.count == 4) {
                movableFood.state = "right";
                movableFood.count = 0;
            }
        }
        ctx.fillRect(movableFood.x, movableFood.y, snakeWidth, snakeHeight);
    }

    function eatFood(x, y) {
        return food.x == x && food.y == y;
    }

    function eatMovableFood(x, y, x2, y2) {
        return (movableFood.x == x && movableFood.y == y) || (movableFood.x == x2 && movableFood.y == y2);
    }

    function getRandomNumber(max, multipleOf) {
        let result = Math.floor(Math.random() * max);
        result = (result % 10 == 0) ? result : result + (multipleOf - result % 10);
        return result;
    }

    function clearCanvas() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    $(document).on("keydown", function(e) {
        if ($.inArray(e.keyCode, [DOWN, UP, LEFT, RIGHT]) != -1) {
            keyPressed = checkKeyIsAllowed(e.keyCode);
        }
        if (score == 0 && $.inArray(e.keyCode, [DOWN, UP, LEFT, RIGHT, a, b, ENTER]) != -1) {
            checkKonamiCode(e.keyCode);
        }
        if (score == 0 && $.inArray(e.keyCode, [48, 57, 53, 50, 49, 13]) != -1) {
            checkPinkCode(e.keyCode);
        }
    })

    function checkKeyIsAllowed(tempKey) {
        let key;
        if(tempKey == DOWN) {
            key = (keyPressed != UP) ? tempKey : keyPressed;
        }
        else if(tempKey == UP) {
            key = (keyPressed != DOWN) ? tempKey : keyPressed;
        }
        else if(tempKey == RIGHT) {
            key = (keyPressed != LEFT) ? tempKey : keyPressed;
        }
        else if(tempKey == LEFT) {
            key = (keyPressed != RIGHT) ? tempKey : keyPressed;
        }
        return key;
    }

    function checkKonamiCode(keyEntered) {
        if (keyEntered == konamiCode[konamiCodePos]) {
            konamiCodePos++;
        }
        else {
            konamiCodePos = 0;
        }
        if (konamiCodePos == konamiCode.length) {
            cheats = true;
            game = setInterval(gameLoop, 100);
            $("#selectionMenu").css("display", "none");
        }
    }

    function checkPinkCode(keyEntered) {
        if (keyEntered == pinkCode[pinkCodePos]) {
            pinkCodePos++;
        }
        else {
            pinkCodePos = 0;
        }
        if (pinkCodePos == pinkCode.length) {
            cheatsPink = true;
            game = setInterval(gameLoop, 100);
            $("#selectionMenu").css("display", "none");
        }
    }

    function getNewPositionForFood() {
        let xArr = yArr = [] , xy;
        $.each(snake, function(index,value) {
            if($.inArray(value.x, xArr) == -1) {
                xArr.push(value.x);
            }
            if($.inArray(value.y, yArr) == -1) {
                yArr.push(value.y);
            }
        })
        if (score % 10 == 0 && score != 0) {
            xy = getEmptyXY2(xArr, yArr);
        }
        else {
            xy = getEmptyXY(xArr, yArr);
        }
        return xy;
    }

    function getEmptyXY(xArr, yArr) {
        let newX, newY;
        newX = getRandomNumber(canvas.width - 10, 10);
        newY = getRandomNumber(canvas.height - 10, 10);
        if ($.inArray(newX,xArr) == -1 && $.inArray(newY,yArr) == -1) {
            return {
                x: newX,
                y: newY,
                eaten: false
            }
        }
        else {
            return getEmptyXY(xArr, yArr);
        }
    }

    function getEmptyXY2(xArr, yArr) {
        let newX, newY;
        newX = getRandomNumber(canvas.width - 70, 10);
        newY = getRandomNumber(canvas.height - 70, 10);
        if ($.inArray(newX,xArr) == -1 && $.inArray(newY,yArr) == -1) {
            return {
                x: newX,
                y: newY,
                state: "right",
                count:0,
            }
        }
        else {
            return getEmptyXY2(xArr, yArr);
        }
    }

    function gameOver() {
        clearInterval(game);
        $("#gameOverScreen").css("display", "block");
        for(var i = 0; i < 5; i++) {
            if(score > highScores[i] && highScores.length == 5) {
                highScores.pop();
                highScores.splice(i, 0, score);
                break;
            }
        }
        if(highScores.length < 5) {
            highScores.push(score);
            highScores.sort(function(a,b) {
                return b-a;
            })
        }
        $("#score1").html(highScores[0]);
        $("#score2").html(highScores[1]);
        $("#score3").html(highScores[2]);
        $("#score4").html(highScores[3]);
        $("#score5").html(highScores[4]);
        localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
        $("#highScores").css("display", "block");
    }
})