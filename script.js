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
    'Pudgy', 'Rusty', 'Sleepy', 'Sneaky', 'Soggy'
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
    'Wizard', 'Pirate', 'Ninja', 'Robot', 'Unicorn'
];

const HISTORY_KEY = 'sillyNameHistory';
const MAX_HISTORY = 10;

let currentName = '';

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateName() {
    const adjective = getRandomItem(adjectives);
    const noun = getRandomItem(nouns);
    currentName = `${adjective} ${noun}`;

    const nameDisplay = document.getElementById('generated-name');
    nameDisplay.textContent = currentName;
    nameDisplay.classList.remove('bounce');
    void nameDisplay.offsetWidth;
    nameDisplay.classList.add('bounce');

    addToHistory(currentName);
    return currentName;
}

function copyToClipboard() {
    if (!currentName || currentName === 'Click to generate!') {
        return;
    }

    navigator.clipboard.writeText(currentName).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
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

    renderHistory();
}

document.addEventListener('DOMContentLoaded', init);
