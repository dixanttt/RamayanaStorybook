let storyData = []; // Fetched data to be stored here
let currentSection = 0; 
let currentPanel = 0; 

// display current story section 
function showStory(sectionIndex, panelIndex) {
    const section = storyData.sections[sectionIndex];
    const panel = section.panels[panelIndex];

    document.getElementById('story-title').textContent = storyData.title;
    document.getElementById('section-title').textContent = section.title;
    document.getElementById('section-description').textContent = section.description;

    const combinedImage = document.getElementById('combined-image');

    // for good transitions
    combinedImage.style.opacity = '0';
    setTimeout(() => {
        combinedImage.style.backgroundImage = `url(${panel.combinedImage})`;
        combinedImage.style.opacity = '1';
    }, 500); 

    // dialogue for the first character
    showDialogue('speech1', 'character1-name', 'character1-dialogue', panel.character1);
    
    // dialogue for the second character after a delay
    setTimeout(() => {
        showDialogue('speech2', 'character2-name', 'character2-dialogue', panel.character2);
    }, 500);
}

// display character dialogue with typing effect
function showDialogue(speechId, nameId, dialogueId, character) {
    const speechBubble = document.getElementById(speechId);
    const nameElement = document.getElementById(nameId);
    const dialogueElement = document.getElementById(dialogueId);

    speechBubble.style.opacity = 1; // Make speech bubble visible
    nameElement.textContent = `${character.nameEnglish} (${character.nameSanskrit})`;
    
    // Type out the dialogue text
    typeText(dialogueElement, character.dialogue, () => {
        if (speechId === 'speech2') {
            setTimeout(nextPanel, 2000); 
        }
    });
}

// create typing effect for text
function typeText(element, text, onComplete) {
    element.innerHTML = ''; 
    let index = 0;

    function addNextLetter() {
        if (index < text.length) {
            element.innerHTML += text[index]; // Add next letter
            index++;
            setTimeout(addNextLetter, 30); 
        } else if (onComplete) {
            setTimeout(onComplete, 500); 
        }
    }
    
    addNextLetter(); 
}

// to move to the next section
function nextPanel() {
    currentPanel++;
    
    // Reset panel and move to next if necessary
    if (currentPanel >= storyData.sections[currentSection].panels.length) {
        currentPanel = 0;
        currentSection++;
        
        // Restart story if at the end of sections
        if (currentSection >= storyData.sections.length) {
            currentSection = 0;
            console.log("Story restarted");
        }
    }
    
    showStory(currentSection, currentPanel); // Update display with new section and panel
}

// create navigation menu for sections
function createNavMenu() {
    const navList = document.getElementById('story-sections');
    
    storyData.sections.forEach((section, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = section.title;
        
        // Set up click event to show selected section
        listItem.onclick = () => {
            currentSection = index;
            currentPanel = 0; 
            showStory(currentSection, currentPanel); // Display selected section
        };
        
        navList.appendChild(listItem); // Add item to navigation menu
    });
}

// fetch story data from JSON file
function fetchStoryData() {
    fetch('ramayana.json')
        .then(response => response.json())
        .then(jsonData => {
            storyData = jsonData; // Store fetched data
            createNavMenu(); // Create navigation menu
            showStory(currentSection, currentPanel); // Display the first section
        })
        .catch(error => console.error('Error fetching the JSON:', error)); 
}

// dark/light mode
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

themeToggle.onclick = () => {
    body.classList.toggle('dark-theme'); 
    icon.classList.toggle('fa-moon'); 
    icon.classList.toggle('fa-sun');
};

fetchStoryData();