//students.js

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

// Array com todas as perguntas e suas opções
const questions = [
    // Curiosidade Artístico-Científica
    {
        id: 'question1',
        category: 'artistic_scientific_curiosity',
        text: 'Quando você vê algo interessante (objeto, experiência ou arte), você:',
        options: [
            { value: 1, text: 'Prefiro não mexer para não estragar' },
            { value: 2, text: 'Observo com atenção como funciona' },
            { value: 3, text: 'Pesquiso mais sobre o assunto' },
            { value: 4, text: 'Faço testes e experimentos para entender melhor' }
        ]
    },
    {
        id: 'question2',
        category: 'artistic_scientific_curiosity',
        text: 'Em uma feira de ciências, o que você mais gosta de fazer?',
        options: [
            { value: 1, text: 'Prefiro só assistir as apresentações' },
            { value: 2, text: 'Gosto de fazer anotações sobre o que vejo' },
            { value: 3, text: 'Faço perguntas sobre os projetos' },
            { value: 4, text: 'Adoro criar e apresentar experimentos' }
        ]
    },
    {
        id: 'question9',
        category: 'artistic_scientific_curiosity',
        text: 'Quando descobre uma nova tecnologia, você:',
        options: [
            { value: 1, text: 'Espero outros testarem primeiro' },
            { value: 2, text: 'Leio o manual básico antes de usar' },
            { value: 3, text: 'Exploro todas as funcionalidades' },
            { value: 4, text: 'Tento descobrir como funciona por dentro' }
        ]
    },

    // Intenção Criativa
    {
        id: 'question3',
        category: 'creative_intention',
        text: 'Quando precisa resolver um problema novo, você:',
        options: [
            { value: 1, text: 'Espero alguém me mostrar como fazer' },
            { value: 2, text: 'Tento copiar soluções que já vi antes' },
            { value: 3, text: 'Procuro diferentes maneiras de resolver' },
            { value: 4, text: 'Crio minha própria forma de resolver' }
        ]
    },
    {
        id: 'question4',
        category: 'creative_intention',
        text: 'Se algo não dá certo na primeira tentativa, você:',
        options: [
            { value: 1, text: 'Desisto e faço outra coisa' },
            { value: 2, text: 'Peço ajuda para alguém' },
            { value: 3, text: 'Tento de novo de um jeito diferente' },
            { value: 4, text: 'Faço vários testes até conseguir' }
        ]
    },
    {
        id: 'question10',
        category: 'creative_intention',
        text: 'Ao enfrentar um desafio criativo, você prefere:',
        options: [
            { value: 1, text: 'Seguir um tutorial passo a passo' },
            { value: 2, text: 'Adaptar ideias já existentes' },
            { value: 3, text: 'Misturar diferentes referências' },
            { value: 4, text: 'Criar algo totalmente original' }
        ]
    },

    // Construção Colaborativa
    {
        id: 'question5',
        category: 'collaborative_construction',
        text: 'Durante um trabalho em grupo, você geralmente:',
        options: [
            { value: 1, text: 'Prefiro fazer sua parte sozinho' },
            { value: 2, text: 'Aceita as ideias dos outros' },
            { value: 3, text: 'Contribui com suas próprias ideias' },
            { value: 4, text: 'Ajuda a juntar as ideias de todos' }
        ]
    },
    {
        id: 'question6',
        category: 'collaborative_construction',
        text: 'Quando um colega tem uma ideia diferente da sua:',
        options: [
            { value: 1, text: 'Prefiro manter minha ideia original' },
            { value: 2, text: 'Escuto, mas sigo com minha ideia' },
            { value: 3, text: 'Tento misturar as duas ideias' },
            { value: 4, text: 'Conversamos para criar algo melhor juntos' }
        ]
    },
    {
        id: 'question11',
        category: 'collaborative_construction',
        text: 'Em um projeto de equipe, você costuma:',
        options: [
            { value: 1, text: 'Esperar os outros tomarem a iniciativa' },
            { value: 2, text: 'Seguir as orientações do grupo' },
            { value: 3, text: 'Sugerir novas abordagens' },
            { value: 4, text: 'Coordenar e integrar as contribuições' }
        ]
    },

    // Pensamento Complexo
    {
        id: 'question7',
        category: 'complex_thinking',
        text: 'Ao criar algo novo, você:',
        options: [
            { value: 1, text: 'Prefiro usar apenas um tipo de material' },
            { value: 2, text: 'Misturo alguns materiais diferentes' },
            { value: 3, text: 'Gosto de combinar várias coisas' },
            { value: 4, text: 'Adoro misturar materiais e técnicas diferentes' }
        ]
    },
    {
        id: 'question8',
        category: 'complex_thinking',
        text: 'Quando está construindo um projeto:',
        options: [
            { value: 1, text: 'Sigo apenas um caminho do início ao fim' },
            { value: 2, text: 'Faço pequenas mudanças no plano original' },
            { value: 3, text: 'Experimento diferentes possibilidades' },
            { value: 4, text: 'Combino várias ideias de formas diferentes' }
        ]
    },
    {
        id: 'question12',
        category: 'complex_thinking',
        text: 'Ao analisar um problema complexo, você:',
        options: [
            { value: 1, text: 'Procuro a solução mais simples possível' },
            { value: 2, text: 'Considero algumas variáveis principais' },
            { value: 3, text: 'Analiso diversos aspectos do problema' },
            { value: 4, text: 'Busco conexões entre diferentes fatores' }
        ]
    },
    {
        id: 'question13',
        category: 'complex_thinking',
        text: 'Quando precisa tomar uma decisão importante:',
        options: [
            { value: 1, text: 'Decido rapidamente com o que sei' },
            { value: 2, text: 'Considero os prós e contras básicos' },
            { value: 3, text: 'Analiso diferentes perspectivas' },
            { value: 4, text: 'Crio mapas mentais com todas as possibilidades' }
        ]
    },
    // Letramento Tecnológico
    {
        id: 'question14',
        category: 'technological_literacy',
        text: 'Ao aprender a usar uma nova tecnologia ou software, você:',
        options: [
            { value: 1, text: 'Prefiro que alguém me mostre apenas o básico' },
            { value: 2, text: 'Sigo tutoriais passo a passo' },
            { value: 3, text: 'Exploro diferentes funcionalidades por conta própria' },
            { value: 4, text: 'Busco entender como a tecnologia funciona por dentro' }
        ]
    },
    {
        id: 'question15',
        category: 'technological_literacy',
        text: 'Quando encontra um erro ou problema em um sistema:',
        options: [
            { value: 1, text: 'Peço ajuda imediatamente' },
            { value: 2, text: 'Tento algumas soluções básicas' },
            { value: 3, text: 'Pesquiso diferentes formas de resolver' },
            { value: 4, text: 'Analiso o erro e desenvolvo soluções próprias' }
        ]
    },
    {
        id: 'question16',
        category: 'technological_literacy',
        text: 'Em relação ao processo de aprendizado de máquina:',
        options: [
            { value: 1, text: 'Prefiro usar sistemas já prontos' },
            { value: 2, text: 'Entendo o básico do funcionamento' },
            { value: 3, text: 'Consigo adaptar sistemas existentes' },
            { value: 4, text: 'Crio e modifico sistemas conforme necessário' }
        ]
    }
];

// Função para embaralhar array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

// Função para renderizar as perguntas
// Função para renderizar as perguntas
function renderQuestions() {
    const form = document.getElementById('studentForm');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Remove as perguntas existentes
    const existingQuestions = form.querySelectorAll('select[id^="question"]');
    existingQuestions.forEach(q => {
        const label = q.previousElementSibling;
        label.remove();
        q.remove();
    });
    
    // Embaralha as perguntas
    const shuffledQuestions = shuffleArray([...questions]);
    
    // Pega apenas 10 perguntas (2 de cada categoria)
    const selectedQuestions = {
        artistic_scientific_curiosity: [],
        creative_intention: [],
        collaborative_construction: [],
        complex_thinking: [],
        technological_literacy: [] // Adicionada nova categoria
    };
    
    shuffledQuestions.forEach(question => {
        if (selectedQuestions[question.category] && selectedQuestions[question.category].length < 2) {
            selectedQuestions[question.category].push(question);
        }
    });
    
    // Junta todas as perguntas selecionadas e embaralha novamente
    const finalQuestions = shuffleArray(Object.values(selectedQuestions).flat());
    
    // Insere as perguntas antes do botão submit
    finalQuestions.forEach((question, index) => {
        const label = document.createElement('label');
        // Adiciona número da questão dinamicamente
        label.textContent = `${index + 1}. ${question.text}`;
        
        const select = document.createElement('select');
        select.id = question.id;
        select.required = true;

        // Adiciona opção vazia inicial
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Selecione uma opção";
        select.appendChild(defaultOption);
        
        question.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            select.appendChild(optionElement);
        });
        
        submitButton.parentNode.insertBefore(label, submitButton);
        submitButton.parentNode.insertBefore(select, submitButton);
    });
}
// Calcula o perfil do aluno com base nas respostas
function calculateStudentProfile(answers) {
    return {
        artistic_scientific_score: answers.artistic_scientific_curiosity,
        creative_intention_score: answers.creative_intention,
        collaborative_score: answers.collaborative_construction,
        complex_thinking_score: answers.complex_thinking,
        technological_literacy_score: answers.technological_literacy, // Nova pontuação
        raw_answers: answers,
    };
}

// Função para distribuir alunos nos grupos de forma heterogênea
function assignStudentToGroup(teacherData, studentProfile) {
    const groups = teacherData.groups;
    const maxStudentsPerGroup = 6;

    // Inicializa estrutura para armazenar as médias de habilidades por grupo
    const groupAverages = Object.keys(groups).reduce((acc, groupName) => {
        const students = groups[groupName];
        const totalStudents = students.length;

        const averageSkills = totalStudents
            ? calculateGroupSkills(students)
            : { artistic: 0, creative: 0, collaborative: 0, complex: 0, tech: 0 };

        acc[groupName] = { totalStudents, averageSkills };
        return acc;
    }, {});

    // Ordena os grupos: primeiro os com menos de 6 alunos, depois os demais
    const sortedGroups = Object.keys(groupAverages).sort((a, b) => {
        const groupA = groupAverages[a];
        const groupB = groupAverages[b];

        // Prioriza grupos com menos de 6 alunos
        if (groupA.totalStudents < maxStudentsPerGroup && groupB.totalStudents >= maxStudentsPerGroup) {
            return -1;
        } else if (groupA.totalStudents >= maxStudentsPerGroup && groupB.totalStudents < maxStudentsPerGroup) {
            return 1;
        }

        // Caso ambos estejam na mesma faixa (< ou >= 6), prioriza menor quantidade total
        return groupA.totalStudents - groupB.totalStudents;
    });

    // Encontra o grupo mais adequado com base na heterogeneidade das habilidades
    let bestGroup = sortedGroups[0];
    let bestDiversityScore = Infinity;

    sortedGroups.forEach((groupName) => {
        const groupData = groupAverages[groupName];
        const groupSize = groupData.totalStudents;

        // Calcula a diferença média entre as habilidades do grupo e o novo aluno
        const diversityScore = calculateDiversityScore(groupData.averageSkills, studentProfile);

        // Atualiza o melhor grupo se a pontuação for menor
        if (diversityScore < bestDiversityScore || (diversityScore === bestDiversityScore && groupSize < maxStudentsPerGroup)) {
            bestDiversityScore = diversityScore;
            bestGroup = groupName;
        }
    });

    return bestGroup;
}

// Função para calcular a diversidade de um grupo com base nas habilidades
function calculateDiversityScore(students) {
    if (!Array.isArray(students) || students.length === 0) {
        return 0; // Retorna 0 se o grupo estiver vazio ou não for um array
    }

    // Define os totais iniciais para as habilidades
    const totals = {
        artistic: 0,
        creative: 0,
        collaborative: 0,
        complex: 0,
        tech: 0
    };

    // Soma as habilidades de cada estudante
    students.forEach(student => {
        if (student.profile) { // Verifica se o perfil do aluno existe
            totals.artistic += student.profile.artistic_scientific_score || 0;
            totals.creative += student.profile.creative_intention_score || 0;
            totals.collaborative += student.profile.collaborative_score || 0;
            totals.complex += student.profile.complex_thinking_score || 0;
            totals.tech += student.profile.technological_literacy_score || 0;
        }
    });

    // Calcula a diversidade como a média das diferenças entre habilidades
    const average = {
        artistic: totals.artistic / students.length,
        creative: totals.creative / students.length,
        collaborative: totals.collaborative / students.length,
        complex: totals.complex / students.length,
        tech: totals.tech / students.length
    };

    // Retorna um escore de diversidade baseado na variação das habilidades
    return Object.values(average).reduce((sum, value) => sum + value, 0).toFixed(2);
}


// Função para calcular a média das habilidades de um grupo
function calculateGroupSkills(students) {
    if (!Array.isArray(students) || students.length === 0) {
        return {
            artistic: 0,
            creative: 0,
            collaborative: 0,
            complex: 0,
            tech: 0
        };
    }

    // Soma todas as habilidades de cada aluno no grupo
    const totalSkills = students.reduce((totals, student) => {
        return {
            artistic: totals.artistic + (student.profile?.artistic_scientific_score || 0),
            creative: totals.creative + (student.profile?.creative_intention_score || 0),
            collaborative: totals.collaborative + (student.profile?.collaborative_score || 0),
            complex: totals.complex + (student.profile?.complex_thinking_score || 0),
            tech: totals.tech + (student.profile?.technological_literacy_score || 0)
        };
    }, {
        artistic: 0,
        creative: 0,
        collaborative: 0,
        complex: 0,
        tech: 0
    });

    // Calcula a média de cada habilidade
    return {
        artistic: (totalSkills.artistic / students.length).toFixed(1),
        creative: (totalSkills.creative / students.length).toFixed(1),
        collaborative: (totalSkills.collaborative / students.length).toFixed(1),
        complex: (totalSkills.complex / students.length).toFixed(1),
        tech: (totalSkills.tech / students.length).toFixed(1)
    };
}

// Inicialização assíncrona
async function initializeApp() {
    try {
        const config = await waitForConfig();
        JSON_BIN_URL = config.JSON_BIN_URL;
        MASTER_KEY = config.MASTER_KEY;

        // Renderiza as perguntas
        renderQuestions();

        // Configura o formulário
        document.getElementById('studentForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            const studentName = document.getElementById('studentName').value.trim();
            const teacherCode = document.getElementById('teacherCode').value.trim();

            if (!studentName || !teacherCode) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            // Coleta todas as perguntas selecionadas
            const selectedQuestions = document.querySelectorAll('select[id^="question"]');
            
            // Agrupa as respostas por categoria
            const answersByCategory = {
                artistic_scientific_curiosity: [],
                creative_intention: [],
                collaborative_construction: [],
                complex_thinking: [],
                technological_literacy: [] // Nova categoria
            };

            // Percorre todas as perguntas selecionadas e agrupa suas respostas
            selectedQuestions.forEach(select => {
                const questionId = select.id;
                const question = questions.find(q => q.id === questionId);
                if (question) {
                    answersByCategory[question.category].push(parseInt(select.value));
                }
            });

            // Calcula a média para cada categoria
            const answers = {
                artistic_scientific_curiosity: answersByCategory.artistic_scientific_curiosity.reduce((a, b) => a + b, 0) / 2,
                creative_intention: answersByCategory.creative_intention.reduce((a, b) => a + b, 0) / 2,
                collaborative_construction: answersByCategory.collaborative_construction.reduce((a, b) => a + b, 0) / 2,
                complex_thinking: answersByCategory.complex_thinking.reduce((a, b) => a + b, 0) / 2,
                technological_literacy: answersByCategory.technological_literacy.reduce((a, b) => a + b, 0) / 2
            };

            const profile = calculateStudentProfile(answers);

            // Mostrar barra de progresso
            const progress = document.getElementById('progress');
            const progressBar = document.querySelector('.progress-bar');
            progress.classList.remove('hidden');
            progressBar.style.width = '50%';

            try {
                // Obter os dados existentes e distribuir em grupos
                const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY },
                });
                
                let data = response.data.record;

                // Garante que a estrutura de grupos e perfis do professor exista
                // E use o código criptografado nas operações
                if (!data[teacherCode]) {
                    data[teacherCode] = {
                        groups: {
                            group1: [],
                            group2: [],
                            group3: [],
                            group4: [],
                            group5: [],
                            group6: []
                        },
                    };
                }

                // Distribui o aluno em um grupo
                const assignedGroup = assignStudentToGroup(data[teacherCode]);

                // Adiciona o aluno ao grupo designado
                data[teacherCode].groups[assignedGroup].push({
                    name: encryptData(studentName, MASTER_KEY),
                    profile: profile,
                });

                // Envia os dados atualizados
                await axios.put(JSON_BIN_URL, data, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": MASTER_KEY,
                    },
                });

                progressBar.style.width = '100%';
                document.getElementById('studentForm').classList.add('hidden');
                document.getElementById('result').classList.remove('hidden');
                document.getElementById('result').innerHTML = "Obrigado! Suas respostas foram registradas.";
            } catch (error) {
                console.error("Erro ao processar formulário:", error);
                alert("Erro ao salvar os dados. Por favor, tente novamente.");
                progress.classList.add('hidden');
                progressBar.style.width = '0';
            }
        });

    } catch (error) {
        console.error('Erro ao inicializar:', error);
    }
}

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);