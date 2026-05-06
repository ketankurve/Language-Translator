const langOption = document.querySelectorAll('select');
const fromText = document.querySelector('.fromText');
const transText = document.querySelector('.toTranslate');
const translateBtn = document.getElementById('translateBtn');

// Populate target languages from language.js[cite: 1]
for (let countryCode in language) {
    let option = `<option value="${countryCode}">${language[countryCode]}</option>`;
    langOption[1].insertAdjacentHTML('beforeend', option);
}

/**
 * Professional Dynamic Typewriter Effect
 * Automatically speeds up for longer text to save time.
 */
function typeEffect(element, text) {
    element.value = "";
    let i = 0;
    
    // Logic: If the text is long, increase the number of characters per "tick"
    // Short text: 1 char/tick | Long text: up to 5 chars/tick
    let charsPerTick = Math.max(1, Math.floor(text.length / 100)); 
    let speed = text.length > 200 ? 5 : 15; // Faster interval for long text
    
    function type() {
        if (i < text.length) {
            // Append a chunk of text instead of a single character for long strings
            element.value += text.substring(i, i + charsPerTick);
            i += charsPerTick;
            setTimeout(type, speed);
        } else {
            // Ensure the exact text is set at the end (corrects any substring rounding)
            element.value = text; 
        }
    }
    type();
}

/**
 * Main Translation Logic
 */
translateBtn.addEventListener('click', () => {
    let content = fromText.value.trim();
    let transContent = langOption[1].value.split("-")[0]; 

    if (!content) return;
    if (!langOption[1].value) {
        alert("Please select a target language!");
        return;
    }

    translateBtn.innerText = "Processing...";
    translateBtn.disabled = true;
    transText.placeholder = "Translating...";

    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${transContent}&dt=t&q=${encodeURIComponent(content)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const result = data[0].map(item => item[0]).join("");
            
            // Trigger the optimized animation
            typeEffect(transText, result);
            
            translateBtn.innerText = "Translate Now";
            translateBtn.disabled = false;
        })
        .catch(err => {
            console.error("API Error:", err);
            transText.value = "Translation failed. Please try again.";
            translateBtn.innerText = "Translate Now";
            translateBtn.disabled = false;
        });
});

/**
 * Voice Synthesis Logic
 * Dynamically speaks the text based on the selected language[cite: 1]
 */
const volumeIcons = document.querySelectorAll('.bx-volume-full');
volumeIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        let text = (index === 0) ? fromText.value : transText.value;
        let lang = (index === 0) ? langOption[0].value : langOption[1].value;
        
        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang; 
            speechSynthesis.speak(utterance);
        }
    });
});