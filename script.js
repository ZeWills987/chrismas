// === GESTION DES FLOCONS DE NEIGE ===
function createSnowflakes() {
    const snowfall = document.getElementById('snowfall');
    const snowflakeCount = 80;

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';

        // Position horizontale aléatoire
        snowflake.style.left = Math.random() * 100 + '%';

        // Taille aléatoire
        const size = Math.random() * 0.8 + 0.5;
        snowflake.style.fontSize = size + 'em';

        // Durée de chute aléatoire
        const duration = Math.random() * 10 + 10;
        snowflake.style.animationDuration = duration + 's';

        // Dérive latérale aléatoire
        const drift = (Math.random() - 0.5) * 100;
        snowflake.style.setProperty('--drift', drift + 'px');

        // Délai aléatoire
        snowflake.style.animationDelay = Math.random() * 10 + 's';

        snowfall.appendChild(snowflake);
    }
}

// === GESTION DU CANVAS (SAPIN ANIMÉ) ===
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Ajustement responsive du canvas
function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth - 40, 400);
    canvas.width = maxWidth;
    canvas.height = maxWidth * 1.25;
}

// Structure du sapin avec boules
class Ornament {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 8 + 5;
        this.hue = Math.random() * 360;
        this.hueSpeed = Math.random() * 2 + 0.5;
    }

    update() {
        // Changement de teinte progressif
        this.hue = (this.hue + this.hueSpeed) % 360;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${this.hue}, 80%, 40%)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reflet
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y - 2, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }
}

const ornaments = [];

function drawTree() {
    const centerX = canvas.width / 2;
    const treeHeight = canvas.height * 0.7;
    const treeWidth = canvas.width * 0.6;

    // Tronc
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(centerX - 20, treeHeight, 40, canvas.height - treeHeight);

    // Triangle du sapin
    ctx.fillStyle = '#1B4D3E';
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX - treeWidth / 2, treeHeight);
    ctx.lineTo(centerX + treeWidth / 2, treeHeight);
    ctx.closePath();
    ctx.fill();

    // Étoile au sommet
    drawStar(centerX, 40, 5, 20, 10, '#FFD700');
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function initOrnaments() {
    const centerX = canvas.width / 2;
    const treeHeight = canvas.height * 0.7;
    const treeWidth = canvas.width * 0.6;

    // Génération de boules positionnées sur le sapin
    for (let i = 0; i < 20; i++) {
        const yRatio = Math.random();
        const y = 100 + yRatio * (treeHeight - 100);
        const maxX = (treeWidth / 2) * (1 - yRatio * 0.8);
        const x = centerX + (Math.random() - 0.5) * maxX * 1.5;

        ornaments.push(new Ornament(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTree();

    ornaments.forEach(ornament => {
        ornament.update();
        ornament.draw();
    });

    requestAnimationFrame(animate);
}

// === GESTION DE LA PERSONNALISATION ===
function saveName() {
    const input = document.getElementById('friendName');
    const name = input.value.trim();

    if (name) {
        // Stockage en localStorage
        localStorage.setItem('friendName', name);
        updateMessage(name);
        input.value = '';
    }
}

function updateMessage(name) {
    const messageEl = document.getElementById('christmasMessage');
    messageEl.innerHTML = `
                Joyeux Noël <span class="friend-name">Opura, Raihere et Kea</span> ! 🎅<br>
                Que cette période des fêtes vous apporte joie, bonheur et plein de moments magiques ! ✨🎄
            `;
}

// === PARTAGE DU LIEN ===
function shareLink() {
    const url = window.location.href;

    // Copie dans le presse-papier
    navigator.clipboard.writeText(url).then(() => {
        showNotification();
    }).catch(err => {
        console.error('Erreur de copie:', err);
        alert('Lien: ' + url);
    });
}

function showNotification() {
    const notif = document.getElementById('notification');
    notif.classList.add('show');

    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// === INITIALISATION ===
window.addEventListener('load', () => {
    createSnowflakes();
    resizeCanvas();
    initOrnaments();
    animate();

    // Chargement du nom sauvegardé
    const savedName = localStorage.getItem('friendName');
    if (savedName) {
        updateMessage(savedName);
    }
});

// Redimensionnement responsive
window.addEventListener('resize', () => {
    resizeCanvas();
    ornaments.length = 0;
    initOrnaments();
});

// Validation au clavier (Enter)
document.getElementById('friendName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveName();
    }
});