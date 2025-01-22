// crypto-tools.js
const CryptoJS = require('crypto-js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para criptografar texto
function encryptAES(text, password) {
    return CryptoJS.AES.encrypt(text, password).toString();
}

// Função para descriptografar (para teste)
function decryptAES(encryptedText, password) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Função para gerar nova chave
function generateKey() {
    const key = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
    console.log('\nNova chave gerada:', key);
    return key;
}

// Função principal para criptografar
function encryptValue() {
    rl.question('\nDigite o texto para criptografar: ', (text) => {
        rl.question('Digite a chave de criptografia: ', (password) => {
            try {
                const encrypted = encryptAES(text, password);
                const decrypted = decryptAES(encrypted, password);
                
                console.log('\n=== Resultados ===');
                console.log('Texto Original:', text);
                console.log('Texto Criptografado:', encrypted);
                console.log('Teste de Descriptografia:', decrypted);
                console.log('Verificação:', text === decrypted ? 'OK ✅' : 'Falhou ❌');
                console.log('\nCódigo para config.js:');
                console.log(`const decryptionPassword = '${password}';`);
                console.log(`const ENCRYPTED_VALUE = '${encrypted}';`);
                
                rl.close();
            } catch (error) {
                console.error('Erro:', error);
                rl.close();
            }
        });
    });
}

// Menu principal
console.log('=== Ferramenta de Criptografia ===');
console.log('1. Gerar nova chave');
console.log('2. Criptografar valor');

rl.question('\nEscolha uma opção (1 ou 2): ', (option) => {
    switch(option) {
        case '1':
            generateKey();
            rl.close();
            break;
        case '2':
            encryptValue();
            break;
        default:
            console.log('Opção inválida');
            rl.close();
    }
});
