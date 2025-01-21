import { JSON_BIN_URL, MASTER_KEY } from './config.js';

function openTeacherModal() {
    document.getElementById('teacherModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('teacherModal').classList.add('hidden');
}

function enterTeacherRoom() {
    const teacherCode = document.getElementById('teacherCodeInput').value.trim();
    if (!teacherCode) {
        alert("Por favor, insira um código válido.");
        return;
    }
    localStorage.setItem('teacherCode', teacherCode);
    window.location.href = './teacher/teachers.html';
}

// Função atualizada para criar nova sala
async function createTeacherRoom() {
    try {
        const oldTeacherCode = localStorage.getItem('teacherCode');
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

        const teacherCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newResponse = await axios.get(`${JSON_BIN_URL}/latest`, {
            headers: { "X-Master-Key": MASTER_KEY }
        });

        let newData = newResponse.data.record;
        newData[teacherCode] = {
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

        localStorage.setItem('teacherCode', teacherCode);
        alert(`Nova sala criada com sucesso!\nSeu novo código é: ${teacherCode}`);
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