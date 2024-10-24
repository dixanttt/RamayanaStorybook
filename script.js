let storyData = []; // fetched data 
let currentSection = 0;
let currentPanel = 0;

function showStory(sectionIndex, panelIndex) {
    const section = storyData.sections[sectionIndex];
    const panel = section.panels[panelIndex];

    document.getElementById('story-title').textContent = storyData.title;
    document.getElementById('section-title').textContent = section.title;
    document.getElementById('section-description').textContent = section.description;
    document.getElementById('combined-image').style.backgroundImage = `url(${panel.combinedImage})`;

    showDialogue('speech1', 'character1-name', 'character1-dialogue', panel.character1);
    setTimeout(() => { showDialogue('speech2', 'character2-name', 'character2-dialogue', panel.character2);}, 500);
}

function showDialogue(speechId, nameId, dialogueId, character) {
    const speechBubble = document.getElementById(speechId);
    const nameElement = document.getElementById(nameId);
    const dialogueElement = document.getElementById(dialogueId);

    speechBubble.style.opacity = 1;
    nameElement.textContent = `${character.nameEnglish} (${character.nameSanskrit})`;
    typeText(dialogueElement, character.dialogue, () => {
        
      if (speechId === 'speech2') {
            setTimeout(nextPanel, 2000);
        }
    });
}

function typeText(element, text, onComplete) {
    element.innerHTML = '';
    let index = 0;
    function addNextLetter() {
        if (index < text.length) {
            element.innerHTML += text[index];
            index++;
            setTimeout(addNextLetter, 30);
        } else if (onComplete) {
            setTimeout(onComplete, 500);
        }
    }
    addNextLetter();
}

function nextPanel() {
    currentPanel++;
    if (currentPanel >= storyData.sections[currentSection].panels.length) {
        currentPanel = 0;
        currentSection++;
        if (currentSection >= storyData.sections.length) {
            currentSection = 0;
            console.log("Story restarted");
        }
    }
    showStory(currentSection, currentPanel);
}

function createNavMenu() {
    const navList = document.getElementById('story-sections');
    storyData.sections.forEach((section, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = section.title;
        listItem.onclick = () => {
            currentSection = index;
            currentPanel = 0;
            showStory(currentSection, currentPanel);
        };
        navList.appendChild(listItem);
    });
}

function fetchStoryData() {
    fetch('ramayana.json')
        .then(response => response.json())
        .then(jsonData => {
            storyData = jsonData;
            createNavMenu();
            showStory(currentSection, currentPanel);
        })
        .catch(error => console.error('Error fetching the JSON:', error));
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

themeToggle.onclick = () => {
    body.classList.toggle('dark-theme');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
};

fetchStoryData();