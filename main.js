let langOption = document.querySelectorAll('select');
let fromText = document.querySelector('.fromText');
let transText = document.querySelector('.toTranslate');

langOption.forEach((get, con) => {
    if (con === 0) {
        let option = `<option value="en-GB" selected>English</option>`;
        get.innerHTML = option;
       
    } else if (con === 1) {
        for (let countryCode in language) {
            if (countryCode !== "en-GB") {
                let option = `<option value="${countryCode}">${language[countryCode]}</option>`;
                get.insertAdjacentHTML('beforeend', option);
            }
        }
    }
});

fromText.addEventListener('input', function() {
    let content = fromText.value;
    fromContent = langOption[0].value;
    transContent = langOption[1].value;

    let transLink = `https://api.mymemory.translated.net/get?q=${content}&langpair=${fromContent}|${transContent}`;

    fetch(transLink).then(translate => translate.json()).then(data =>{
        transText.value = data.responseData.translatedText;
    });

    const volumeIcon = document.querySelector('.bx-volume-full');

    volumeIcon.addEventListener('click', function () {
        const translatedText = transText.value; // Get the translated text from your textarea
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = 'hi-IN'; // Replace with the appropriate language code
        speechSynthesis.speak(utterance);
    });    

});
