// config.js
let CONFIG = null;

function initializeConfig() {
    const decryptionPassword = 'uTWYpy0xqhGopS7VuIZD3w==';
    
    const ENCRYPTED_JSON_BIN_URL = 'U2FsdGVkX1/ODR6Pic5PoVLxZKgDtGMCC9KR71FvTZcJzA+jiwJqT4MNwyAA7bVxvSFlKFvki6Aq2lgljlFh0O1KTProO83x9JT/1pX9LpY=';
    const ENCRYPTED_MASTER_KEY = 'U2FsdGVkX198EZ8hJavIGTZ4rAfPeRhOGZvCjL/zQ7TPjwHl6Ye3/Bp8kLv45O9I5f4xQ2gE9i7i/kpjWsnGl6yrNPFJMAp5pTUrYIAYnnA=';

    function decryptAES(encryptedText, password) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, password);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Erro ao descriptografar:', error);
            return null;
        }
    }

    CONFIG = {
        JSON_BIN_URL: decryptAES(ENCRYPTED_JSON_BIN_URL, decryptionPassword),
        MASTER_KEY: decryptAES(ENCRYPTED_MASTER_KEY, decryptionPassword)
    };

    window.CONFIG = CONFIG;
    return CONFIG;
}

// Aguarda o carregamento do DOM e do CryptoJS
document.addEventListener('DOMContentLoaded', () => {
    if (typeof CryptoJS !== 'undefined') {
        initializeConfig();
    } else {
        console.error('CryptoJS não está carregado');
    }
});

export default CONFIG;