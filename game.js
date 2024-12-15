const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const batSprite = new Image();
batSprite.src = './bat.png';

const spriteWidth = 32;
const spriteHeight = 32;
const framesPerRow = 4;
let currentFrame = 0;

let batX = canvas.width / 2 - spriteWidth / 2;
let batY = canvas.height - spriteHeight - 10;
const batSpeed = 10;

const walls = [
    { x: 0, y: canvas.height - 5, width: canvas.width , height: 5 }, //BAWAH SENDIRI NAIK KE ATAS JUN
    { x: 370, y: canvas.height -30, width: 5 , height: 30 },
    { x: 75, y: canvas.height -48, width: 5 , height: 48 },
    { x: 40, y: canvas.height -48, width: 40 , height: 5 },
    { x: 120, y: canvas.height -48, width: 210 , height: 5 },
    { x: canvas.width -65, y: canvas.height -48, width: 210 , height: 5 },
    { x: 325, y: canvas.height -72, width: 5 , height: 28 },
    { x: 60, y: canvas.height -90, width: 220 , height: 5 },
    { x: canvas.width -175, y: canvas.height -77, width: 60 , height: 5 },
    { x: 55, y: canvas.height -90, width: 5 , height: 45 },
    { x: 435, y: canvas.height -90, width: 5 , height: 45 },
];

let directionX = 0;
let directionY = 0;
let frameRow = 0;

let touchedSides = { top: false, bottom: false, left: false, right: false };
let gameFinished = false;

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            directionX = 0;
            directionY = -1;
            frameRow = 2;
            break;
        case 'ArrowDown':
            directionX = 0;
            directionY = 1;
            frameRow = 0;
            break;
        case 'ArrowLeft':
            directionX = -1;
            directionY = 0;
            frameRow = 3;
            break;
        case 'ArrowRight':
            directionX = 1;
            directionY = 0;
            frameRow = 1;
            break;
    }
});

window.addEventListener('keyup', () => {
    directionX = 0;
    directionY = 0;
});

function isCollidingWithWalls() {
    return walls.some(wall => (
        batX < wall.x + wall.width &&
        batX + spriteWidth > wall.x &&
        batY < wall.y + wall.height &&
        batY + spriteHeight > wall.y
    ));
}

function updatebatPosition() {
    if (gameFinished) return;

    const prevX = batX;
    const prevY = batY;

    batX += directionX * batSpeed;
    batY += directionY * batSpeed;

    batX = Math.max(0, Math.min(canvas.width - spriteWidth, batX));
    batY = Math.max(0, Math.min(canvas.height - spriteHeight, batY));

    if (isCollidingWithWalls()) {
        batX = prevX;
        batY = prevY;
    }

    if (batY <= 0) touchedSides.top = true;
    if (batY >= canvas.height - spriteHeight) touchedSides.bottom = true;
    if (batX <= 0) touchedSides.left = true;
    if (batX >= canvas.width - spriteWidth) touchedSides.right = true;

    if (touchedSides.top && touchedSides.bottom && touchedSides.left && touchedSides.right) {
        gameFinished = true;
        drawGameOver();
        return;
    }

    drawScene();
}

function drawWalls() {
    ctx.fillStyle = 'brown';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawbat() {
    const frameX = currentFrame * spriteWidth;
    const frameY = frameRow * spriteHeight;

    ctx.drawImage(batSprite, frameX, frameY, spriteWidth, spriteHeight, batX, batY, spriteWidth, spriteHeight);

    if (directionX !== 0 || directionY !== 0) {
        currentFrame = (currentFrame + 1) % framesPerRow;
    }
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawbat();
}

function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tamat', canvas.width / 2, canvas.height / 2);
}

batSprite.onload = () => {
    setInterval(updatebatPosition, 100);
    drawScene();
};



