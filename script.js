const adjectives = [
    'Sparkly', 'Grumpy', 'Wobbly', 'Fuzzy', 'Squishy',
    'Bouncy', 'Giggly', 'Snazzy', 'Wacky', 'Zany',
    'Bubbly', 'Cranky', 'Dizzy', 'Fluffy', 'Goofy',
    'Jumpy', 'Loopy', 'Nutty', 'Quirky', 'Silly',
    'Wiggly', 'Zippy', 'Bonkers', 'Dorky', 'Funky',
    'Kooky', 'Peppy', 'Snappy', 'Spunky', 'Groovy',
    'Chunky', 'Twirly', 'Sassy', 'Nifty', 'Jazzy',
    'Perky', 'Rowdy', 'Screwy', 'Tacky', 'Wonky',
    'Freaky', 'Giddy', 'Lanky', 'Moody', 'Nerdy',
    'Pudgy', 'Rusty', 'Sleepy', 'Sneaky', 'Soggy',
    'Flamboyant', 'Discombobulated', 'Rambunctious', 'Preposterous', 'Flabbergasted'
];

const nouns = [
    'Banana', 'Waffle', 'Penguin', 'Pickle', 'Noodle',
    'Muffin', 'Pancake', 'Nugget', 'Biscuit', 'Pretzel',
    'Walrus', 'Potato', 'Turnip', 'Goblin', 'Wombat',
    'Taco', 'Burrito', 'Cheese', 'Dumpling', 'Cupcake',
    'Narwhal', 'Llama', 'Platypus', 'Badger', 'Otter',
    'Sprocket', 'Widget', 'Doodle', 'Bobble', 'Trinket',
    'Snorkel', 'Pebble', 'Crumpet', 'Nougat', 'Truffle',
    'Gopher', 'Ferret', 'Hamster', 'Sloth', 'Koala',
    'Avocado', 'Cabbage', 'Radish', 'Coconut', 'Pumpkin',
    'Wizard', 'Pirate', 'Ninja', 'Robot', 'Unicorn',
    'Sasquatch', 'Blobfish', 'Dingleberry', 'Kerfuffle', 'Shenanigan'
];

const titles = [
    'Sir', 'Lord', 'Captain', 'Baron', 'Princess',
    'Doctor', 'Professor', 'Count', 'Admiral', 'Duke',
    'Emperor', 'Grand Wizard', 'Supreme Commander', 'His Majesty', 'The Honorable'
];

const suffixes = [
    'III', 'Jr.', 'Esquire', 'the Great', 'the Magnificent',
    'PhD', 'DDS', 'Supreme', 'the Brave', 'the Magnificent',
    'of Doom', 'the Unstoppable', 'McSillypants', 'von Wafflestein', 'the Unhinged'
];

const HISTORY_KEY = 'sillyNameHistory';
const MAX_HISTORY = 10;

let currentName = '';
let confettiPieces = [];
let confettiCanvas, confettiCtx;

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateName() {
    const format = Math.floor(Math.random() * 5);
    const adj1 = getRandomItem(adjectives);
    const adj2 = getRandomItem(adjectives.filter(a => a !== adj1));
    const noun = getRandomItem(nouns);

    switch(format) {
        case 0: // Simple: Adjective Noun
            currentName = `${adj1} ${noun}`;
            break;
        case 1: // Double adj: Adjective Adjective Noun
            currentName = `${adj1} ${adj2} ${noun}`;
            break;
        case 2: // Title: Title Adjective Noun
            currentName = `${getRandomItem(titles)} ${adj1} ${noun}`;
            break;
        case 3: // The format: Adjective Noun the Suffix
            currentName = `${adj1} ${noun} ${getRandomItem(suffixes)}`;
            break;
        case 4: // Full royal: Title Adjective Noun Suffix
            currentName = `${getRandomItem(titles)} ${adj1} ${noun} ${getRandomItem(suffixes)}`;
            break;
    }

    const nameDisplay = document.getElementById('generated-name');
    nameDisplay.textContent = currentName;
    nameDisplay.classList.remove('bounce', 'rainbow-text');
    void nameDisplay.offsetWidth;
    nameDisplay.classList.add('bounce', 'rainbow-text');

    // Screen shake!
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);

    // Confetti explosion!
    launchConfetti();

    addToHistory(currentName);
    return currentName;
}

// Confetti system
function initConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
    animateConfetti();
}

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
    const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0077ff', '#8800ff', '#ff00ff'];
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1
        });
    }
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces = confettiPieces.filter(p => p.life > 0);

    confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= 0.01;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation * Math.PI / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.globalAlpha = p.life;
        confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        confettiCtx.restore();
    });

    requestAnimationFrame(animateConfetti);
}

function copyToClipboard() {
    if (!currentName || currentName === 'Click to generate!') {
        return;
    }

    navigator.clipboard.writeText(currentName).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '🎉 Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 1500);
    });
}

function addToHistory(name) {
    let history = getHistory();

    history = history.filter(item => item !== name);
    history.unshift(name);

    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function getHistory() {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = getHistory();

    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty">No names yet!</li>';
        return;
    }

    history.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = name;
        li.style.animationDelay = `${index * 0.05}s`;
        li.addEventListener('click', () => {
            currentName = name;
            document.getElementById('generated-name').textContent = name;
            copyToClipboard();
        });
        historyList.appendChild(li);
    });
}

function init() {
    document.getElementById('generate-btn').addEventListener('click', generateName);
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
    document.getElementById('generated-name').addEventListener('click', generateName);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            generateName();
        }
    });

    initConfetti();
    renderHistory();
}

document.addEventListener('DOMContentLoaded', init);
