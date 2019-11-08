

// созздание канваса
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let CANVAS_WIDTH = 3000;
let CANVAS_HEIGHT = 600;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const wrapper = document.querySelector('.wrapper');

// гшрафические элементы игры
const bg = new Image();
bg.src = './img/bg.jpg';

const playerImg = new Image();
playerImg.src = './img/hero.png';

const landTop = new Image();
landTop.src = './img/land-top.png';

const bonusImg = new Image();
bonusImg.src = './img/bonus.png'

// параметры элементов
const background = {
    x: 0,
    y: 0,
    width:  CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
}

let spawnX = 860;
let spawnY = 495;

const player = {
    sprite: playerImg,
    xFrame: 21.6,
    yFrame: 16,

    frame: 1,

    x: spawnX,
    y: spawnY,

    xPrew: 0,
    yPrew: 0,

    Xvelosity: 0,
    Yvelosity: 0,

    width: 50,
    height: 60,

    widthF: 20,
    heightF: 32,
    jumping: false
}

const lands = [
    {
        x: 1200,
        y: 500,
        width: 100,
        height: 20
    },
    {
        x: 1350,
        y: 450,
        width: 120,
        height: 25
    },
    {
        x: 1580,
        y: 400,
        width: 50,
        height: 25
    },
    {
        x: 1700,
        y: 360,
        width: 200,
        height: 15
    },
    {
        x: 1900,
        y: 500,
        width: 100,
        height: 20
    },
    {
        x: 2000,
        y: 400,
        width: 50,
        height: 10
    },
    {
        x: 2300,
        y: 500,
        width: 50,
        height: 30
    },
    {
        x: 2400,
        y: 450,
        width: 50,
        height: 30
    },
    {
        x: 2360,
        y: 320,
        width: 50,
        height: 30
    },
    {
        x: 2500,
        y: 360,
        width: 150,
        height: 20
    },
    {
        x: 2500,
        y: 220,
        width: 150,
        height: 20
    },
]



// const bonuses = [
//     {
//         x: 1780,
//         y: 320,
//         width: 40,
//         height: 40
//     },
//     {
//         x: 2000,
//         y: 550,
//         width: 40,
//         height: 40
//     },
    
//     {
//         x: 2500,
//         y: 300,
//         width: 40,
//         height: 40
//     },
// ]


// контроллер клавищ
const controll = {
    right: false,
    left: false,
    up: false,
    keyListener: function(evt) {
        const keyState = (evt.type == 'keydown') ? true : false;
        switch (evt.code) {
            case 'KeyW':
                controll.up = keyState;
                break;
            case 'KeyA':
                controll.left = keyState;
                break;
            case 'KeyD':
                controll.right = keyState;
                break;
            
        }
    }
};


// создание обьекта
const drawObject = (obj, img) => {
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

    if (img) {
        ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
    }
}

const drawSprite = (obj) => {
    ctx.drawImage(obj.sprite, obj.xFrame * obj.frame, obj.yFrame, obj.widthF, obj.heightF, obj.x, obj.y, obj.width, obj.height);
}


function getRandom(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

const drawBonuses = (i) => {
    ctx.drawImage(bonusImg, lands[i].x, lands[i].y - 40, 40, 40);
}

// создание рендера
const FPS = 60;
let then, now, elapsed, fpsInterval;

const startAnimation = (fps) => {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animate(then);
}

const animate = (newTime) => {
    window.requestAnimationFrame(animate);
    now = newTime;
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        draw()
    }
    
}

// поведение камеры
const camera = () => {
    if (controll.right) {
        wrapper.scrollLeft += 5.6;
    }
    if (controll.left && player.x < 2190) {
        wrapper.scrollLeft -= 4.0;
    }
}

const moveScreen = () => {
    if (player.x >= spawnX + 600) {
        console.log('move');
        camera();
    }
}


// обработка столкновений

const isCollided = (obj, obst) => {
    if (obj.x + obj.width >= obst.x
        && obj.x <= obst.x + obst.width
        && obj.y + obj.height >= obst.y
        && obj.y <= obst.y + obst.height) {
            return true;
        } else {
            return false;
        }
}

const collideHandler = (obj, obst) => {
    if (isCollided(obj, obst)) {
        if (obj.xPrew >= obst.x + obst.width ) {
            obj.x = obst.x + obst.width;
            obj.Xvelosity = 0;
        }
        if (obj.xPrew + obj.width <= obst.x) {
            obj.x = obst.x - obj.width;
            obj.Xvelosity = 0;
        }
        if (obj.yPrew >= obst.y + obst.height) {
            obj.y = obst.y + obst.height;
            obj.Yvelosity = 0;
        }
        if (obj.yPrew + obj.height <= obst.y) {
            obj.y = obst.y - obj.height;
            obj.Yvelosity = 0;
            obj.jumping = false;
        }
    }
}

const bonusHandler = (obj, obst) => {
    if (isCollided(obj, obst)) {
        obst.x = -1;
    }
}

let tickCount = 0;

const tick = () => {
    if (tickCount > 4) {
        controllMoves();
        tickCount = 0;
    }

    tickCount++;
    requestAnimationFrame(tick);
}

const controllMoves = () => {
    player.yFrame = 16;
    player.xFrame = 21.6;
    player.frame ++;
    if (player.frame > 10) {
        player.frame = 1;
    }

    if (controll.right) {
        player.Xvelosity += 3;

        player.frame ++;
        player.yFrame = 157;
        player.xFrame = 31.6;
        if (player.frame > 9) {
            player.frame = 1;
        }
    }
    if (controll.left) {
        player.Xvelosity -= 2;

        player.frame ++;
        player.yFrame = 110;
        player.xFrame = 31.6;
        if (player.frame > 9) {
            player.frame = 1;
        }

    }
    if (controll.up && player.jumping == false) {
        player.Yvelosity -= 30;
        player.jumping = true;
    }    
}



// рендер
const draw = () => {

    // логика движений

    

    player.xPrew = player.x;
    player.yPrew = player.y;

    player.Yvelosity += 1.5
    player.x += player.Xvelosity;
    player.y += player.Yvelosity;

    player.Xvelosity *= 0.9;
    player.Yvelosity *= 0.9;

    // гравитация и границы
    if (player.y + player.height >= CANVAS_HEIGHT ) {
        player.y = CANVAS_HEIGHT - player.height;
        player.Yvelosity = 0;
        player.jumping = false;
    }
    
    if (player.x < spawnX - 60) {
        player.x = spawnX - 60;
    }
    if (player.xPrew > CANVAS_WIDTH - player.width) {
        player.x = CANVAS_WIDTH - player.width ;
        player.Xvelosity = 0;
    }

    // отображение и логика обьектов на канвасе
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    let fon = ctx.createPattern(bg, 'repeat');
    ctx.fillRect(background.x, background.y, background.width, background.height);
    ctx.fillStyle = fon;

    drawSprite(player);

    for (key in lands) {
        drawObject(lands[key], landTop);
        collideHandler(player, lands[key]);
    }

    drawBonuses(1);
    let randInt = [];
    randInt.push = getRandom(0, lands.length);
    
    
    // for (key in bonuses) {
    //     bonusHandler(player, bonuses[key]);
    // }
    moveScreen();
    
    // шкала жизней
   

}

// запуск процесса

window.onload = startAnimation(FPS);
tick();
document.addEventListener('keydown', controll.keyListener);
document.addEventListener('keyup', controll.keyListener);