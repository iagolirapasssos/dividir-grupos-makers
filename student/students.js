const JSON_BIN_URL = process.env.JSON_BIN_URL;
const MASTER_KEY = process.env.MASTER_KEY;

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
    
    // Pega apenas 8 perguntas (2 de cada categoria)
    const selectedQuestions = {
        artistic_scientific_curiosity: [],
        creative_intention: [],
        collaborative_construction: [],
        complex_thinking: []
    };
    
    shuffledQuestions.forEach(question => {
        if (selectedQuestions[question.category].length < 2) {
            selectedQuestions[question.category].push(question);
        }
    });
    
    // Junta todas as perguntas selecionadas e embaralha novamente
    const finalQuestions = shuffleArray(Object.values(selectedQuestions).flat());
    
    // Insere as perguntas antes do botão submit
    finalQuestions.forEach(question => {
        const label = document.createElement('label');
        label.textContent = question.text;
        
        const select = document.createElement('select');
        select.id = question.id;
        select.required = true;
        
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

// Chama a função quando a página carregar
document.addEventListener('DOMContentLoaded', renderQuestions);

document.getElementById('studentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const studentName = document.getElementById('studentName').value.trim();
    const teacherCode = document.getElementById('teacherCode').value.trim();

    // Coleta as respostas das perguntas
    const answers = {
        artistic_scientific_curiosity: (
            parseInt(document.getElementById('question1').value) +
            parseInt(document.getElementById('question2').value)
        ) / 2,
        creative_intention: (
            parseInt(document.getElementById('question3').value) +
            parseInt(document.getElementById('question4').value)
        ) / 2,
        collaborative_construction: (
            parseInt(document.getElementById('question5').value) +
            parseInt(document.getElementById('question6').value)
        ) / 2,
        complex_thinking: (
            parseInt(document.getElementById('question7').value) +
            parseInt(document.getElementById('question8').value)
        ) / 2,
    };

    if (!studentName || !teacherCode) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Calcula o perfil do aluno
    const profile = calculateStudentProfile(answers);

    // Mostrar barra de progresso
    const progress = document.getElementById('progress');
    const progressBar = document.querySelector('.progress-bar');
    progress.classList.remove('hidden');
    progressBar.style.width = '50%';

    // Obter os dados existentes e distribuir em grupos
    axios.get(`${JSON_BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY },
    })
        .then((response) => {
            let data = response.data.record;

            // Garante que a estrutura de grupos e perfis do professor exista
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
                name: studentName,
                profile: profile,
            });

            // Envia os dados atualizados
            axios.put(JSON_BIN_URL, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY,
                },
            })
                .then(() => {
                    progressBar.style.width = '100%';
                    document.getElementById('studentForm').classList.add('hidden');
                    document.getElementById('result').classList.remove('hidden');
                    document.getElementById('result').innerHTML = "Obrigado! Suas respostas foram registradas.";
                })
                .catch((error) => {
                    console.error("Erro ao atualizar os dados:", error);
                    alert("Erro ao salvar os dados. Por favor, tente novamente.");
                });
        })
        .catch((error) => {
            console.error("Erro ao carregar os dados existentes:", error);
            alert("Erro ao carregar os dados. Por favor, tente novamente.");
        });
});

// Calcula o perfil do aluno com base nas respostas
function calculateStudentProfile(answers) {
    return {
        artistic_scientific_score: answers.artistic_scientific_curiosity,
        creative_intention_score: answers.creative_intention,
        collaborative_score: answers.collaborative_construction,
        complex_thinking_score: answers.complex_thinking,
        raw_answers: answers,
    };
}

// Função para distribuir alunos nos grupos de forma heterogênea
function assignStudentToGroup(teacherData) {
    const groups = teacherData.groups;
    const maxStudentsPerGroup = 6;

    // Primeiro, encontra o grupo com menos alunos
    let leastCrowdedGroup = 'group1';
    let minStudents = groups['group1'] ? groups['group1'].length : 0;

    for (let i = 1; i <= 6; i++) {
        const groupName = `group${i}`;
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        if (groups[groupName].length < minStudents) {
            minStudents = groups[groupName].length;
            leastCrowdedGroup = groupName;
        }
    }

    return leastCrowdedGroup;
}
