import { JSON_BIN_URL, MASTER_KEY } from './config.js';

const teacherCode = localStorage.getItem('teacherCode');
document.getElementById('teacherCode').textContent = teacherCode || "Código não encontrado.";

const groupMap = document.getElementById('groupMap');
const modal = document.getElementById('modal');
const groupSelect = document.getElementById('groupSelect');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');

// Garante que o modal e a barra de progresso estejam ocultos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    modal.classList.add('hidden');
    progress.classList.add('hidden');
});

// Renderiza os grupos do professor
// Função para calcular a média das habilidades do grupo
function calculateGroupSkills(students) {
    if (students.length === 0) return null;
    
    const totalScores = students.reduce((acc, student) => {
        acc.artistic += student.profile.artistic_scientific_score || 0;
        acc.creative += student.profile.creative_intention_score || 0;
        acc.collaborative += student.profile.collaborative_score || 0;
        acc.complex += student.profile.complex_thinking_score || 0;
        return acc;
    }, { artistic: 0, creative: 0, collaborative: 0, complex: 0 });

    return {
        artistic: (totalScores.artistic / students.length).toFixed(1),
        creative: (totalScores.creative / students.length).toFixed(1),
        collaborative: (totalScores.collaborative / students.length).toFixed(1),
        complex: (totalScores.complex / students.length).toFixed(1)
    };
}

// Função para renderizar os grupos
function renderGroups() {
    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            const record = response.data.record;

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
                                                <span class="student-name">${student.name}</span>
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
        })
        .catch((error) => {
            groupMap.innerHTML = `
                <p>
                    <span class="error-message">Erro ao carregar os dados.</span>
                    <br>Por favor, tente novamente.
                </p>`;
            console.error("Erro ao carregar os dados:", error);
        });
}

// Remove um aluno de um grupo
function removeUser(group, index) {
    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            const data = response.data;

            // Remove do grupo
            data.record[teacherCode].groups[group].splice(index, 1);

            axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            }).then(() => renderGroups());
        })
        .catch((error) => console.error("Erro ao remover usuário:", error));
}

// Renomeia um aluno
function renameUser(group, index) {
    const newName = prompt("Digite o novo nome:");
    if (!newName) return;

    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            const data = response.data;

            // Atualiza o nome no grupo
            data.record[teacherCode].groups[group][index].name = newName;

            axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            }).then(() => renderGroups());
        })
        .catch((error) => console.error("Erro ao renomear usuário:", error));
}

// Abre o modal para migração de aluno
function openMigrationModal(group, index) {
    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            const groups = response.data.record[teacherCode].groups;

            groupSelect.innerHTML = Object.keys(groups)
                .filter((g) => g !== group)
                .map((g) => `<option value="${g}">${g.toUpperCase()}</option>`)
                .join("");

            migrationData = {
                group,
                index,
                student: groups[group][index]
            };
            modal.classList.remove('hidden');
        });
}

// Confirma a migração de aluno
document.getElementById('submitMigration').addEventListener('click', () => {
    const newGroup = groupSelect.value;
    if (!newGroup) return;

    progress.classList.remove('hidden');
    progressBar.style.width = '50%';

    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            const data = response.data;

            // Remove do grupo atual e adiciona no novo grupo
            const student = data.record[teacherCode].groups[migrationData.group].splice(migrationData.index, 1)[0];
            data.record[teacherCode].groups[newGroup].push(student);

            axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            }).then(() => {
                progressBar.style.width = '100%';
                setTimeout(() => {
                    progress.classList.add('hidden');
                    progressBar.style.width = '0';
                    modal.classList.add('hidden');
                    renderGroups();
                }, 1000);
            });
        })
        .catch((error) => {
            console.error("Erro ao migrar usuário:", error);
            alert("Erro ao realizar a migração. Tente novamente.");
        });
});

// Renderiza os grupos ao carregar a página
renderGroups();
