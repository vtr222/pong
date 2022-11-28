"use strict";
let canvas = document.querySelector("canvas");

let p = canvas.getContext("2d");

p.canvas.height = 600;
p.canvas.width = 800;
p.fillStyle = "white";
let gameOn;
let id;
let pausaAposGol = 0;
let PtsP1 = 0;
let PtsP2 = 0;
let SetsP1 = 0;
let SetsP2 = 0;
let ponto = document.createElement("audio");
ponto.src = "ponto.wav";
let pong = document.createElement("audio");
pong.src = "pong.wav";

class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 0;
  }
}

let player1 = new Raquete(74, 280, 12, 70);
let player2 = new Raquete(714, 280, 12, 70);

let bola = {
  x: 400,
  y: 300,
  size: 11,
  speed: -12,
  angle: 0,
  hitted: false,
};

bola.hitPoint = Math.ceil(bola.size / 2);

function desenhaPlacar() {
  p.font = "24px Monospace";
  p.fillText(SetsP1, 240, 40);
  p.fillText(SetsP2, 550, 40);
  p.font = "60px Monospace";
  p.fillText(PtsP1, 320, 50);
  p.fillText(PtsP2, 450, 50);
}

function desenhaRaquete(r) {
  r.y += r.speed;
  if (r.y <= 5 || r.y >= 592 - r.h) {
    r.y -= r.speed;
  }
  p.fillRect(r.x, r.y, r.w, r.h);
}

function Start() {
  p.drawImage(background, 0, 0, 800, 600);
  gameOn = false;
  desenhaRaquete(player1);
  desenhaRaquete(player2);
  p.font = "20px Monospace";
  p.fillText("Spacebar to Start", 305, 300);
  desenhaPlacar();
  if (SetsP1 === 3) {
    p.fillText("Winner!", 90, 460);
    SetsP1 = 0;
    SetsP2 = 0;
  }
  if (SetsP2 === 3) {
    p.fillText("Winner!", 480, 480);
    SetsP1 = 0;
    SetsP2 = 0;
  }
  PtsP1 = 0;
  PtsP2 = 0;
}

function end() {
  cancelAnimationFrame(id);
  player1.y = 280;
  player2.y = 280;
  Start();
}

let background = document.createElement("img");
background.src = "background.png";
background.onload = Start;

function hitL() {
  let hit =
    bola.x <= player1.x + player1.w &&
    bola.x + bola.size >= player1.x &&
    bola.y >= player1.y - bola.size &&
    bola.y <= player1.y + player1.h;

  let top =
    bola.y + bola.size <= player1.y + player1.w &&
    bola.x < player1.x + player1.w;
  let bottom =
    bola.y >= player1.y + player1.h && bola.x < player1.x + player1.w;

  if (hit && bola.hitted === false) {
    calculaAngulo(player1, top, bottom);
  }
}

function hitR() {
  let hit =
    bola.x + bola.size >= player2.x &&
    bola.x <= player2.x + player2.w &&
    bola.y >= player2.y - bola.size &&
    bola.y <= player2.y + player2.h;

  let top = bola.y + bola.size <= player2.y && bola.x > player2.x;
  let bottom = bola.y >= player2.y + player2.h && bola.x > player2.x;

  if (hit && bola.hitted === false) {
    calculaAngulo(player2, top, bottom);
  }
}

function calculaAngulo(r, top, bottom) {
  pong.play();
  bola.hitted = true;
  bola.speed *= -1;

  if (top) {
    bola.angle = -11;
    return;
  }
  if (bottom) {
    bola.angle = 11;
    return;
  }

  let Min = r.y - bola.hitPoint;
  let Max = r.y + r.h + bola.hitPoint;
  let HpY = bola.hitPoint + bola.y;
  let angDiv = (Max - Min) / 6;

  if (HpY >= Min) {
    bola.angle = -9;
  }
  if (HpY >= Min + angDiv * 1) {
    bola.angle = -7;
  }
  if (HpY >= Min + angDiv * 2) {
    bola.angle = -5;
  }
  if (HpY >= Min + angDiv * 3) {
    bola.angle = 5;
  }
  if (HpY >= Min + angDiv * 4) {
    bola.angle = 7;
  }
  if (HpY >= Min + angDiv * 5) {
    bola.angle = 9;
  }
}

function jogo() {
  p.drawImage(background, 0, 0, 800, 600);
  desenhaRaquete(player1);
  desenhaRaquete(player2);
  bola.x > 401 ? hitR() : hitL();
  if (bola.x > 380 && bola.x < 420) {
    bola.hitted = false;
  }

  p.fillRect(bola.x, bola.y, bola.size, bola.size);
  bola.x += bola.speed;
  bola.y += bola.angle;

  if (bola.y + bola.size >= 595 || bola.y <= 0) {
    bola.angle *= -1;
  }

  if (bola.x > 800 || bola.x < 0) {
    if (pausaAposGol === 0 && bola.x > 800) {
      PtsP1++;
      ponto.play();
    }
    if (pausaAposGol === 0 && bola.x < 0) {
      PtsP2++;
      ponto.play();
    }
    pausaAposGol++;
    if (pausaAposGol > 60) {
      bola.x = 400;
      bola.y = 300;
      bola.angle = 0;
      pausaAposGol = 0;
    }

    if (PtsP1 === 5) {
      SetsP1++;
      end();
      return;
    }
    if (PtsP2 === 5) {
      SetsP2++;
      end();
      return;
    }
  }

  desenhaPlacar();

  id = window.requestAnimationFrame(jogo);
}

function keyboard(e) {
  if (e.key === " ") {
    if (gameOn != true) {
      id = window.requestAnimationFrame(jogo);
      gameOn = true;
    }
  }

  if (e.type === "keydown") {
    switch (e.key) {
      case "ArrowUp":
        keys2["up"] = 1;
        player2.speed = -newSpeed;
        break;
      case "ArrowDown":
        keys2["down"] = 1;
        player2.speed = newSpeed;
        break;
      case "W":
      case "w":
        keys1["w"] = 1;
        player1.speed = -newSpeed;
        break;
      case "S":
      case "s":
        keys1["s"] = 1;
        player1.speed = newSpeed;
        break;
    }
  }

  if (e.type === "keyup") {
    switch (e.key) {
      case "ArrowUp":
        keys2["up"] = 0;
        if (keys2["down"] === 1) {
          player2.speed = newSpeed;
        } else {
          player2.speed = 0;
        }
        break;
      case "ArrowDown":
        keys2["down"] = 0;
        if (keys2["up"] === 1) {
          player2.speed = -newSpeed;
        } else {
          player2.speed = 0;
        }
        break;
      case "W":
      case "w":
        keys1["w"] = 0;
        if (keys1["s"] === 1) {
          player1.speed = newSpeed;
        } else {
          player1.speed = 0;
        }
        break;
      case "S":
      case "s":
        keys1["s"] = 0;
        if (keys1["w"] === 1) {
          player1.speed = -newSpeed;
        } else {
          player1.speed = 0;
        }
        break;
    }
  }
}

let newSpeed = 10;
let keys1 = { w: 0, s: 0 };
let keys2 = { up: 0, down: 0 };
document.addEventListener("keydown", keyboard);
document.addEventListener("keyup", keyboard);
