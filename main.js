const langOption = document.querySelectorAll('select');
const fromText = document.querySelector('.fromText');
const transText = document.querySelector('.toTranslate');
const translateBtn = document.getElementById('translateBtn');

// Populate target languages from language.js
for (let countryCode in language) {
    let option = `<option value="${countryCode}">${language[countryCode]}</option>`;
    langOption[1].insertAdjacentHTML('beforeend', option);
}

/**
 * Optimized Typewriter Effect
 * Speed scales based on text length to ensure fast delivery.
 */
function typeEffect(element, text) {
    element.value = "";
    let i = 0;
    let charsPerTick = Math.max(1, Math.floor(text.length / 100)); 
    let speed = text.length > 200 ? 5 : 15; 
    
    function type() {
        if (i < text.length) {
            element.value += text.substring(i, i + charsPerTick);
            i += charsPerTick;
            setTimeout(type, speed);
        } else {
            element.value = text; 
        }
    }
    type();
}

/**
 * Translation Logic
 * Uses the stable Google Translate mirror.
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
            typeEffect(transText, result);
            translateBtn.innerText = "Translate Now";
            translateBtn.disabled = false;
        })
        .catch(err => {
            console.error("API Error:", err);
            transText.value = "Translation failed.";
            translateBtn.innerText = "Translate Now";
            translateBtn.disabled = false;
        });
});

/**
 * Robust Voice Synthesis
 * Fixes the issue where the output text wasn't being picked up correctly.
 */
const volumeIcons = document.querySelectorAll('.bx-volume-full');

volumeIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        // Stop any ongoing speech to prevent overlap
        window.speechSynthesis.cancel();

        // Get fresh values directly from the textareas at the moment of click
        let text = (index === 0) ? fromText.value.trim() : transText.value.trim();
        let lang = (index === 0) ? langOption[0].value : langOption[1].value;
        
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Clean the language code for the speech engine (e.g., "hi" from "hi-IN")[cite: 1]
        utterance.lang = lang; 

        // Ensure voices are loaded (some browsers need this extra step)
        let voices = window.speechSynthesis.getVoices();
        
        // Try to find a voice that matches the language
        const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.pitch = 1;
        utterance.rate = 0.9; // Slightly slower for better clarity in regional languages
        
        window.speechSynthesis.speak(utterance);
    });
});

// Fix for Chrome: voices are loaded asynchronously
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};