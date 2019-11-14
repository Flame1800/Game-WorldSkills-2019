'use strict'

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 70,
    xVelosity: 1.6,
    yVelosity: 1.6,
    isJump: false
}

const controllObj = {
    right: false,
    left: false,
    up: false,
    down: false,
    keyListener: function (evt) {
        let keyPressed = (evt.type === 'keydown') ? true : false;
        switch (evt.code) {
            case 'KeyW':
                controllObj.up = keyPressed;
                break;
            case 'KeyA':
                controllObj.left = keyPressed;
                break;
            case 'KeyD':
                controllObj.right = keyPressed;
                break;
        }

    }
}

const drawObj = (obj, img) => {
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

    if (img) {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height)
    }
}

const objBehaviors = (obj) => {

    if (controllObj.right) {
        obj.xVelosity += 1.5;
    }
    if (controllObj.left) {
        obj.xVelosity -= 1.5;
    }
    if (controllObj.up && obj.isJump === false) {
        obj.yVelosity -= 100;
        obj.isJump = true;
    }
    obj.yVelosity += 5;

    obj.x += obj.xVelosity;
    obj.y += obj.yVelosity;
    
    obj.xVelosity *= 0.9;
    obj.yVelosity *= 0.9;

    if (obj.y + obj.height >= CANVAS_HEIGHT) {
        obj.y = CANVAS_HEIGHT - obj.height;
        obj.isJump = false;
    }
}




const render = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    objBehaviors(player);
    drawObj(player);

    requestAnimationFrame(render);
}


render();

document.addEventListener('keydown', controllObj.keyListener);
document.addEventListener('keyup', controllObj.keyListener);