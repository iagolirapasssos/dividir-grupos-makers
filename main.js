import CONFIG from './config.js';

const openTeacherModal = () => {
    document.getElementById('teacherModal').classList.remove('hidden');
};

const closeModal = () => {
    document.getElementById('teacherModal').classList.add('hidden');
};

// Funções de criptografia
function encryptData(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
}


const enterTeacherRoom = () => {
    const teacherCode = document.getElementById('teacherCodeInput').value.trim();
    //const teacherCode = encryptData(teacherCodeValue, MASTER_KEY);

    if (!teacherCode) {
        alert("Por favor, insira um código válido.");
        return;
    }
    localStorage.setItem('teacherCode', teacherCode);
    window.location.href = './teacher/teachers.html';
};

async function waitForConfig() {
    return new Promise((resolve) => {
        const checkConfig = () => {
            if (window.CONFIG) {
                resolve(window.CONFIG);
            } else {
                setTimeout(checkConfig, 100);
            }
        };
        checkConfig();
    });
}

// Função atualizada para criar nova sala com criptografia
async function createTeacherRoom() {
    try {
        const oldTeacherCode = localStorage.getItem('teacherCode');
        const config = await waitForConfig();
        const JSON_BIN_URL = config.JSON_BIN_URL;
        const MASTER_KEY = config.MASTER_KEY;
        
        if (oldTeacherCode) {
            const confirmDelete = confirm(`ATENÇÃO: Você já possui uma sala ativa com o código ${oldTeacherCode}.\n\nAo criar uma nova sala, todos os dados da sala atual serão permanentemente apagados.\n\nDeseja continuar?`);
            
            if (!confirmDelete) {
                return;
            }

            const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY }
            });
            let data = response.data.record;
            
            if (data[oldTeacherCode]) {
                delete data[oldTeacherCode];
                await axios.put(JSON_BIN_URL, data, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": MASTER_KEY
                    }
                });
            }
        }

        // Gera novo código e criptografa
        const newTeacherCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const newResponse = await axios.get(`${JSON_BIN_URL}/latest`, {
            headers: { "X-Master-Key": MASTER_KEY }
        });
        let newData = newResponse.data.record;

        // Cria nova estrutura usando o código criptografado
        newData[newTeacherCode] = {
            groups: {
                group1: [],
                group2: [],
                group3: [],
                group4: [],
                group5: [],
                group6: []
            }
        };

        await axios.put(JSON_BIN_URL, newData, {
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": MASTER_KEY
            }
        });

        localStorage.setItem('teacherCode', newTeacherCode);
        alert(`Nova sala criada com sucesso!\nSeu novo código é: ${newTeacherCode}`);
        window.location.href = './teacher/teachers.html';
    } catch (error) {
        console.error('Erro ao criar nova sala:', error);
        alert('Ocorreu um erro ao criar a nova sala. Por favor, tente novamente.');
    }
}

function redirectTo(role) {
    if (role === 'student') {
        window.location.href = './student/students.html';
    }
}

// Exporta as funções para o objeto `window`
window.openTeacherModal = openTeacherModal;
window.closeModal = closeModal;
window.enterTeacherRoom = enterTeacherRoom;
window.createTeacherRoom = createTeacherRoom;
window.redirectTo = redirectTo;