const canvas = document.getElementById("wrestlingCanvas");
const ctx = canvas.getContext("2d");

const p1ScoreEl = document.getElementById("p1Score");
const p2ScoreEl = document.getElementById("p2Score");

let p1Score = 0;
let p2Score = 0;

// خصائص المصارع الأول (الأحمر)
let player1 = {
    x: 150,
    y: 240,
    width: 40,
    height: 70,
    color: "#ff007f",
    vx: 0,
    isPunching: false
};

// خصائص المصارع الثاني (الأزرق)
let player2 = {
    x: 510,
    y: 240,
    width: 40,
    height: 70,
    color: "#00ffcc",
    vx: 0,
    isPunching: false
};

let keys = {};

window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function update() {
    // حركة اللاعب الأول (A, D)
    if (keys["a"] || keys["A"]) player1.vx = -4;
    else if (keys["d"] || keys["D"]) player1.vx = 4;
    else player1.vx = 0;

    // ضربة اللاعب الأول (W)
    player1.isPunching = keys["w"] || keys["W"];

    // حركة اللاعب الثاني (الأسهم يمين ويسار)
    if (keys["ArrowLeft"]) player2.vx = -4;
    else if (keys["ArrowRight"]) player2.vx = 4;
    else player2.vx = 0;

    // ضربة اللاعب الثاني (سهم لفوق)
    player2.isPunching = keys["ArrowUp"];

    // تحديث الأماكن
    player1.x += player1.vx;
    player2.x += player2.vx;

    // حدود الحلبة
    if (player1.x < 20) player1.x = 20;
    if (player1.x > canvas.width - 60) player1.x = canvas.width - 60;
    if (player2.x < 20) player2.x = 20;
    if (player2.x > canvas.width - 60) player2.x = canvas.width - 60;

    // فحص التصادم والضربات
    if (player1.isPunching && Math.abs(player1.x - player2.x) < 50) {
        p1Score++;
        p1ScoreEl.innerText = p1Score;
        player2.x += 30; // رجوع للخلف من قوة الضرب
        keys["w"] = false; // منع استمرار النقاط السريع
    }

    if (player2.isPunching && Math.abs(player1.x - player2.x) < 50) {
        p2Score++;
        p2ScoreEl.innerText = p2Score;
        player1.x -= 30;
        keys["ArrowUp"] = false;
    }
}

function draw() {
    // مسح الشاشة (الحلبة)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم أرضية الحلبة
    ctx.fillStyle = "#222244";
    ctx.fillRect(0, 280, canvas.width, 70);

    // رسم المصارع الأول
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    // إيد للضرب
    if (player1.isPunching) {
        ctx.fillRect(player1.x + player1.width, player1.y + 20, 25, 10);
    }

    // رسم المصارع الثاني
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    // إيد للضرب
    if (player2.isPunching) {
        ctx.fillRect(player2.x - 25, player2.y + 20, 25, 10);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();