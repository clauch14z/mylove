const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  setupFallingRows();
});

// Para la cascada en filas completas que bajan juntas:
class FallingRow {
  constructor(y) {
    this.y = y;
    this.speedY = 0.8; // velocidad uniforme para toda la fila
    this.text = "I love you";
    this.color = "#FF1493";
    this.size = 20;
    this.numTexts = Math.ceil(canvas.width / this.textWidth());
  }

  textWidth() {
    // calcular ancho aproximado de "I love you" para spacing
    ctx.font = `${this.size}px Arial`;
    return ctx.measureText(this.text).width + 15; // un poco de espacio extra
  }

  update() {
    this.y += this.speedY;
    if (this.y > canvas.height + this.size) {
      this.y = -this.size; // reaparece arriba sin salto
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px Arial`;
    for (let i = 0; i < this.numTexts; i++) {
      const x = i * this.textWidth();
      ctx.fillText(this.text, x, this.y);
    }
  }
}

class ClickParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 20 + 10;
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8;
    this.alpha = 1;
    this.text = "My Love";
    this.color = "#FF1493";
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.01; // alpha disminuye más lento para durar más
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px Arial`;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

let fallingRows = [];
let clickParticles = [];

const rowHeight = 30;

function setupFallingRows() {
  fallingRows = [];
  const rows = Math.ceil(canvas.height / rowHeight) + 1;
  for (let i = 0; i < rows; i++) {
    fallingRows.push(new FallingRow(i * rowHeight));
  }
}

setupFallingRows();

function handleFallingRows() {
  fallingRows.forEach(row => {
    row.update();
    row.draw();
  });
}

function handleClickParticles() {
  for (let i = clickParticles.length - 1; i >= 0; i--) {
    clickParticles[i].update();
    clickParticles[i].draw();

    if (clickParticles[i].alpha <= 0) {
      clickParticles.splice(i, 1);
    }
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  handleFallingRows();
  handleClickParticles();
  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener('click', (e) => {
  const num = 30;
  for (let i = 0; i < num; i++) {
    clickParticles.push(new ClickParticle(e.clientX, e.clientY));
  }
});
