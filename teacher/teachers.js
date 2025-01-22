// Função para aguardar o CONFIG
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

let JSON_BIN_URL = "";
let MASTER_KEY = "";
let lastUpdate = null;
let updateInterval = null;
let cachedData = null;

const teacherCode = localStorage.getItem('teacherCode');
const groupMap = document.getElementById('groupMap');
const modal = document.getElementById('modal');
const groupSelect = document.getElementById('groupSelect');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');

// Funções de criptografia
function encryptData(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
}

function decryptData(encryptedText, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Erro ao descriptografar:', error);
        return 'Protegido';
    }
}

// Função para calcular a média das habilidades do grupo
function calculateGroupSkills(students) {
    if (students.length === 0) return null;
    
    const totalScores = students.reduce((acc, student) => {
        acc.artistic += student.profile.artistic_scientific_score || 0;
        acc.creative += student.profile.creative_intention_score || 0;
        acc.collaborative += student.profile.collaborative_score || 0;
        acc.complex += student.profile.complex_thinking_score || 0;
        acc.tech += student.profile.technological_literacy_score || 0;
        return acc;
    }, { artistic: 0, creative: 0, collaborative: 0, complex: 0, tech: 0 });

    return {
        artistic: (totalScores.artistic / students.length).toFixed(1),
        creative: (totalScores.creative / students.length).toFixed(1),
        collaborative: (totalScores.collaborative / students.length).toFixed(1),
        complex: (totalScores.complex / students.length).toFixed(1),
        tech: (totalScores.tech / students.length).toFixed(1)
    };
}

// Função para verificar se os dados mudaram
function dataHasChanged(newData, oldData) {
    if (!oldData) return true;
    return JSON.stringify(newData) !== JSON.stringify(oldData);
}

// Função para atualizar os dados com throttle
async function updateGroups() {
    try {
        // Limita as requisições a no mínimo 5 segundos de intervalo
        const now = Date.now();
        if (lastUpdate && now - lastUpdate < 5000) {
            return;
        }

        const response = await axios.get(`${JSON_BIN_URL}/latest`, {
            headers: { "X-Master-Key": MASTER_KEY },
        });
        

        const record = response.data.record;
        lastUpdate = now;

        // Só atualiza o DOM se houver mudanças
        if (dataHasChanged(record[teacherCode], cachedData)) {
            cachedData = record[teacherCode];
            console.log(`cachedData: ${cachedData}`);
            renderGroupsFromData(record, teacherCode);
        }
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        clearInterval(updateInterval);
        updateInterval = setInterval(updateGroups, 10000);
    }
}

// Função para renderizar os grupos a partir dos dados
function renderGroupsFromData(record, teacherCode) {
    if (record[teacherCode] && record[teacherCode].groups) {
        const groups = record[teacherCode].groups;
        groupMap.innerHTML = Object.keys(groups)
            .map((group) => {
                const skills = calculateGroupSkills(groups[group]);
                const skillsHtml = skills ? `
                    <div class="skills-summary">
                        <div class="skill-item" title="Curiosidade Artístico-Científica">
                            <i class="fas fa-microscope"></i>
                            <span>${skills.artistic}</span>
                        </div>
                        <div class="skill-item" title="Intenção Criativa">
                            <i class="fas fa-lightbulb"></i>
                            <span>${skills.creative}</span>
                        </div>
                        <div class="skill-item" title="Construção Colaborativa">
                            <i class="fas fa-users"></i>
                            <span>${skills.collaborative}</span>
                        </div>
                        <div class="skill-item" title="Pensamento Complexo">
                            <i class="fas fa-brain"></i>
                            <span>${skills.complex}</span>
                        </div>
                        <div class="skill-item" title="Letramento Tecnológico">
                            <i class="fas fa-laptop-code"></i>
                            <span>${skills.tech}</span>
                        </div>
                    </div>` : '';

                return `
                    <div class="group-card">
                        <h3>${group.toUpperCase()}</h3>
                        ${skillsHtml}
                        <ul>
                            ${groups[group]
                            .map(
                                (student, index) => `
                                <li>
                                    <span class="student-name">${decryptData(student.name, MASTER_KEY)}</span>
                                    <div class="action-buttons">
                                        <button class="action-btn remove-btn" onclick="removeUser('${group}', ${index})" title="Remover">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                        <button class="action-btn rename-btn" onclick="renameUser('${group}', ${index})" title="Renomear">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn migrate-btn" onclick="openMigrationModal('${group}', ${index})" title="Migrar">
                                            <i class="fas fa-exchange-alt"></i>
                                        </button>
                                    </div>
                                </li>`
                            )
                            .join('')}
                        </ul>
                    </div>`;
            })
            .join("");
    } else {
        groupMap.innerHTML = "<p>Nenhum grupo foi criado ainda.</p>";
    }
}

// Função para lidar com mudanças de visibilidade da página
function handleVisibilityChange() {
    if (document.hidden) {
        clearInterval(updateInterval);
    } else {
        updateGroups(); // Atualiza imediatamente quando voltar
        updateInterval = setInterval(updateGroups, 5000);
    }
}

// Inicializa as funções para manipulação dos grupos
async function initializeGroupFunctions() {
    // Função para remover usuário
    window.removeUser = async function (group, index) {
        try {
            const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY },
            });
            let data = response.data.record;

            // Acesse diretamente os grupos do professor
            const teacherData = data[teacherCode];
            teacherData.groups[group].splice(index, 1);

            // Atualize os dados sem adicionar outra chave "record"
            await axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            });

            cachedData = teacherData;
            renderGroupsFromData(data, teacherCode);
        } catch (error) {
            console.error("Erro ao remover usuário:", error);
            alert("Erro ao remover aluno. Tente novamente.");
        }
    };

    // Função para renomear usuário
    window.renameUser = async function (group, index) {
        const newName = prompt("Digite o novo nome:");
        if (!newName) return;

        try {
            const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY },
            });
            let data = response.data.record;

            // Acesse diretamente os grupos do professor
            const teacherData = data[teacherCode];
            teacherData.groups[group][index].name = encryptData(newName, MASTER_KEY);

            // Atualize os dados sem adicionar outra chave "record"
            await axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            });

            cachedData = teacherData;
            renderGroupsFromData(data, teacherCode);
        } catch (error) {
            console.error("Erro ao renomear usuário:", error);
            alert("Erro ao renomear aluno. Tente novamente.");
        }
    };

    // Função para abrir modal de migração
    window.openMigrationModal = async function (group, index) {
        try {
            const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY },
            });
            const groups = response.data.record[teacherCode].groups;

            // Preenche as opções do modal de migração
            groupSelect.innerHTML = Object.keys(groups)
                .filter((g) => g !== group)
                .map((g) => `<option value="${g}">${g.toUpperCase()}</option>`)
                .join("");

            window.migrationData = {
                group,
                index,
                student: groups[group][index],
            };
            modal.classList.remove("hidden");
        } catch (error) {
            console.error("Erro ao abrir modal:", error);
        }
    };
}

// Inicialização assíncrona
async function initializeApp() {
    try {
        const config = await waitForConfig();
        JSON_BIN_URL = config.JSON_BIN_URL;
        MASTER_KEY = config.MASTER_KEY;

        document.getElementById('teacherCode').textContent = teacherCode || "Código não encontrado.";

        // Inicializa funções dos grupos
        await initializeGroupFunctions();

        // Configuração inicial de atualização
        await updateGroups();
        updateInterval = setInterval(updateGroups, 5000);

        // Adiciona listener para visibilidade da página
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Configurar o botão de submissão da migração
        document.getElementById('submitMigration').addEventListener('click', async () => {
            const newGroup = groupSelect.value;
            if (!newGroup) return;

            progress.classList.remove('hidden');
            progressBar.style.width = '50%';

            try {
                const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY },
                });
                 let data = response.data.record;

                const student = data[teacherCode].groups[window.migrationData.group]
                    .splice(window.migrationData.index, 1)[0];
                data[teacherCode].groups[newGroup].push(student);

                await axios.put(JSON_BIN_URL, data, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": MASTER_KEY,
                    },
                });

                cachedData = data[teacherCode];
                renderGroupsFromData(data, teacherCode);

                progressBar.style.width = '100%';
                setTimeout(() => {
                    progress.classList.add('hidden');
                    progressBar.style.width = '0';
                    modal.classList.add('hidden');
                }, 1000);
            } catch (error) {
                console.error("Erro ao migrar usuário:", error);
                alert("Erro ao realizar a migração. Tente novamente.");
            }
        });

        // Configura botão de cancelar migração
        document.getElementById('cancelMigration').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

    } catch (error) {
        console.error('Erro ao inicializar:', error);
    }
}

// Quando a página for fechada ou ocultada
window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
});

// Chama a inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    modal.classList.add('hidden');
    progress.classList.add('hidden');
    initializeApp();
});