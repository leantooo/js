export default class UI {
    width = -1;
    height = -1;

    brain = null;
    appContainer = null;

    scaleX = 1;
    scaleY = 1;

    constructor(brain, appContainer) {
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions();

        console.log(this);
    }

    setScreenDimensions(width, height) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    calculateScaledX(x) {
        return x * this.scaleX | 0;
    }

    calculateScaledY(y) {
        return y * this.scaleY | 0;
    }

    drawBorderSingle(left, top, width, height, color) {
        let border = document.createElement('div');

        border.style.zIndex = 10;
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawBorder() {
        this.drawBorderSingle(0, 0, this.width, this.calculateScaledY(this.brain.borderThickness), 'grey');
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'grey');
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'grey');
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'grey');
    }

    drawPaddle(paddle) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';

        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';

        div.style.backgroundColor = paddle.color;

        this.appContainer.append(div);
    }

    drawBall(ball) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(ball.x - ball.radius) + 'px';
        div.style.top = this.calculateScaledY(ball.y - ball.radius) + 'px';

        div.style.width = this.calculateScaledX(ball.radius * 2) + 'px';
        div.style.height = this.calculateScaledY(ball.radius * 2) + 'px';

        div.style.borderRadius = '100%';
        div.style.backgroundColor = ball.color;

        this.appContainer.append(div);
    }

    drawBricks(bricks) {
        bricks.forEach(brick => {
            let outerDiv = document.createElement('div');
            let innerDiv = document.createElement('div');
    
            const borderWidth = 1;
    
            outerDiv.style.zIndex = '10';
            outerDiv.style.position = 'fixed';
            outerDiv.style.left = this.calculateScaledX(brick.left) + 'px';
            outerDiv.style.top = this.calculateScaledY(brick.top) + 'px';
            outerDiv.style.width = this.calculateScaledX(brick.width) + 'px';
            outerDiv.style.height = this.calculateScaledY(brick.height) + 'px';
            outerDiv.style.backgroundColor = 'grey';

            innerDiv.style.position = 'absolute';
            innerDiv.style.left = borderWidth + 'px';
            innerDiv.style.top = borderWidth + 'px';
            innerDiv.style.width = this.calculateScaledX(brick.width) - 2 * borderWidth + 'px';
            innerDiv.style.height = this.calculateScaledY(brick.height) - 2 * borderWidth + 'px';
            innerDiv.style.backgroundColor = brick.color;
    
            outerDiv.appendChild(innerDiv);
            this.appContainer.append(outerDiv);
        });
    }

    updateBestResults() {
        const bestResultsElement = document.getElementById('best-results');
        if (bestResultsElement) {
            bestResultsElement.innerHTML = '';
            this.brain.topScores.forEach((score, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${score}`;
                bestResultsElement.appendChild(listItem);
            });
        }
        console.log("updated");
    }

    draw() {
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();
    
        this.drawBorder();
        this.drawPaddle(this.brain.paddle);
        this.drawBall(this.brain.ball);
        this.drawBricks(this.brain.bricks);
    
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.innerText = '$ ' + `${this.brain.points}`;
        }
    
        const livesLeft = document.getElementById('lives');
        if (livesLeft) {
            livesLeft.innerText = '❤ ' + `${this.brain.lives}`;
        }
    
        this.updateBestResults();
    }
}
