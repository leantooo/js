export class Paddle {
    private _width: number = 200;
    private _height: number = 50;
    private speed: number = 50;
    private intervalId: number | undefined= undefined;

    constructor(private _left: number, private _top: number = 900, private _color: string = 'blue') {
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public get left() {
        return this._left;
    }

    public get top() {
        return this._top;
    }

    public get color() {
        return this._color;
    }
    
    validateAndFixPosition(borderThickness: number) : void {
        if (this.left < borderThickness) {
            this._left = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if ((this.left + this.width) > (1000 - borderThickness)) {
            this._left = (1000 - borderThickness) - this.width;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    startMove(step: number, borderThickness: number): void {
        if (this.intervalId !== undefined) return;

        const updateInterval = 16;
        this.intervalId = setInterval(() => {
            this._left += step * this.speed * updateInterval;
            this.validateAndFixPosition(borderThickness);
        }, updateInterval);
    }

    stopMove(borderThickness: number) : void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }

}

export class Ball {
    x: number = 500;
    y: number = 800;
    private _speed: number = 7;
    dx: number = 0;
    dy: number = 0;
    
    constructor(private _radius: number, private _color: string) {
        this.dx = this.speed * (Math.random() * 2 - 1);
        this.dy = -this.speed;
    }

    public get color() {
        return this._color;
    }

    public get speed() : number {
        return this._speed;
    }

    public get radius() {
        return this._radius;
    }
}

export class Brick {
    width: number = 80;
    height: number = 30;
    broken: boolean = false;
    left: number = 0;
    top: number = 0;

    constructor(private health: number, private _color: string) {
    }

    public get color() {
        return this._color;
    }

    decreaseHealth(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.break();
            return this.getPoints();
        }
        return 0;
    }

    getPoints() {
        switch (this.color) {
            case 'yellow':
                return 1;
            case 'green':
                return 3;
            case 'orange':
                return 5;
            case 'red':
                return 7;
            default:
                return 0;
        }
    }

    break() {
        this.broken = true;
    }
}

export default class Brain {
    width: number = 1000;
    height: number = 1000;
    borderThickness: number = 10;
    bricks: Brick[] = [];
    balls: Ball[] = [];
    topScores: number[] = [];
    points: number = 0;
    paddle: Paddle = new Paddle(400, 900, 'green');
    ball: Ball = new Ball(15, 'red');
    brick: Brick = new Brick(1, 'brown')
    previousBallDx: number = 0;
    previousBallDy: number = 0;
    paused:boolean = false;
    lives: number = 3;


    constructor() {
        this.createBricks();
        // this.balls.push(this.ball);
    }


    resetGame() :void {
        this.lives = 3;
        this.points = 0;
        this.newRound();
        this.moveBallToStart(this.ball);

        const resumeButton = document.getElementById('resume-button');
        resumeButton!.style.display = 'inline';
        this.waitForSpaceToStart();
    }

    newRound() : void {
        this.bricks = [];
        this.createBricks();
    }

    resultToDesk(points: number) :void {
        if (!this.topScores.includes(points)) {
            this.topScores.push(points);
            this.topScores.sort((a, b) => b - a);
            this.topScores = this.topScores.slice(0, 5);
        }
    }

    getBestResults() {
        return this.topScores;
    }

    pause() {
        this.previousBallDx = this.ball.dx;
        this.previousBallDy = this.ball.dy;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.paused = true;
    }

    resume() {
        this.ball.dx = this.previousBallDx;
        this.ball.dy = this.previousBallDy;
        this.paused = false;
    }

    updatePoints(amount: number) {
        this.points += amount;
    }

    createBricks() {
        const brickColors = ['red', 'orange', 'green', 'yellow'];
        const brickColumns = 12;
        const brickRows = 8;
        const brickWidth = this.brick.width;
        const brickHeight = this.brick.height;
        const padding = 0;

        const totalBricksWidth = brickColumns * (brickWidth + padding) - padding;

        const initialLeft = (this.width - totalBricksWidth) / 2;
        const initialTop = 100;

        for (let row = 0; row < brickRows; row++) {
            for (let col = 0; col < brickColumns; col++) {
                const colorIndex = Math.floor(row / 2) % brickColors.length;
                const color = brickColors[colorIndex];
                const brick = new Brick(1, color);

                const brickLeft = initialLeft + col * (brickWidth + padding);
                const brickTop = initialTop + row * (brickHeight + padding);

                brick.left = brickLeft;
                brick.top = brickTop;

                this.bricks.push(brick);
            }
        }
    }

    startMovePaddle(paddle: Paddle, step: number) {
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle: Paddle) {
        paddle.stopMove(this.borderThickness);
    }

    checkBricksLeft() {
        return this.bricks.some(brick => !brick.broken);
    }


    moveBallToStart(ball: Ball) {
        ball.x = this.paddle.left + this.paddle.width / 2;
        ball.y = this.paddle.top - ball.radius;
        ball.dx = 0;
        ball.dy = 0;
    }

    waitForSpaceToStart() {
        this.paused = true;
        const startMessage = document.getElementById('start-message');
        startMessage!.style.display = 'block';

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                this.pause();
                startMessage!.style.display = 'none';
                document.removeEventListener('keydown', handleKeyPress);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
    }

    startBall() {
        this.ball.dx = this.ball.speed * (Math.random() * 2 - 1);
        this.ball.dy = -this.ball.speed;
    }
    
    checkWin() {
        if (this.bricks.length === 0) {
            this.win();
        }
    }

    win() {
        this.paused = true;
        const pauseMenu = document.getElementById('pause-menu');
        const pauseTitle = document.getElementById('pause-title');
        const resumeButton = document.getElementById('resume-button');
        const newgameButton = document.getElementById('newgame-button');

        pauseTitle!.innerText = 'Congratulations!';
        resumeButton!.style.display = 'none';
        newgameButton!.innerText = 'New Game';

        pauseMenu!.style.display = 'block';
    }

    gameOver() {
        this.paused = true;
        const pauseMenu = document.getElementById('pause-menu');
        const pauseTitle = document.getElementById('pause-title');
        const resumeButton = document.getElementById('resume-button');
        const newgameButton = document.getElementById('newgame-button');
        
        pauseTitle!.innerText = 'Game Over!';
        resumeButton!.style.display = 'none';
        newgameButton!.innerText = 'New Game';

        pauseMenu!.style.display = 'block';
    }

    moveBall() {
        const ball = this.ball;
    
        // Move the ball
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        // Walls collision
        if (ball.x + ball.radius > this.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }
        if (ball.x - ball.radius < this.borderThickness || ball.x + ball.radius > this.width - this.borderThickness) {
            ball.dx *= -1;
        }
    
        // Paddle collision
        if (
            ball.y + ball.radius >= this.paddle.top &&
            ball.y - ball.radius <= this.paddle.top + this.paddle.height &&
            ball.x + ball.radius >= this.paddle.left &&
            ball.x - ball.radius <= this.paddle.left + this.paddle.width
        ) {
            const paddleCenter = this.paddle.left + this.paddle.width / 2;
            const impactPoint = (ball.x - paddleCenter) / (this.paddle.width / 2);
            const angle = impactPoint * (Math.PI / 4);
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);

            const paddleCenterX = this.paddle.left + this.paddle.width / 2;
            if (ball.x <= paddleCenterX) {
                ball.dx = -Math.abs(ball.dx);
            } else {
                ball.dx = Math.abs(ball.dx);
            }
        }

        // Bricks collision
    this.bricks.forEach((brick, index) => {
        if (!brick.broken) {
            if (
                ball.x + ball.radius >= brick.left &&
                ball.x - ball.radius <= brick.left + brick.width &&
                ball.y + ball.radius >= brick.top &&
                ball.y - ball.radius <= brick.top + brick.height
            ) {
                // Collision detected with this brick
                brick.decreaseHealth(1); // Decrease health of the brick
                this.updatePoints(brick.getPoints()); // Update points
                if (brick.broken) {
                    // Brick is broken, remove it from the array
                    this.bricks.splice(index, 1);
                }

                // Reflect the ball
                ball.dy *= -1;
            }
        }
    });

    
        // Check if bottom line crossed
        if (ball.y + ball.radius > this.height - this.borderThickness) {
            this.lives -= 1;
            if (this.lives <= 0) {
                this.resultToDesk(this.points);
                this.resetGame();
            } else {
                this.moveBallToStart(ball);
                this.waitForSpaceToStart();
            }
        }
    }
}