const JSON_BIN_URL = process.env.JSON_BIN_URL;
const MASTER_KEY = process.env.MASTER_KEY;

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
                // Pega o código anterior do localStorage
                const oldTeacherCode = localStorage.getItem('teacherCode');
                
                // Se existir um código anterior, pede confirmação
                if (oldTeacherCode) {
                    const confirmDelete = confirm(`ATENÇÃO: Você já possui uma sala ativa com o código ${oldTeacherCode}.\n\nAo criar uma nova sala, todos os dados da sala atual serão permanentemente apagados.\n\nDeseja continuar?`);
                    
                    if (!confirmDelete) {
                        return; // Cancela a criação se o usuário não confirmar
                    }
                    
                    // Busca os dados atuais
                    const response = await axios.get(`${JSON_BIN_URL}/latest`, {
                        headers: { "X-Master-Key": MASTER_KEY }
                    });
                    
                    let data = response.data.record;
                    
                    // Remove os dados da sala antiga
                    if (data[oldTeacherCode]) {
                        delete data[oldTeacherCode];
                        
                        // Atualiza o JSONBin sem os dados da sala antiga
                        await axios.put(JSON_BIN_URL, data, {
                            headers: {
                                "Content-Type": "application/json",
                                "X-Master-Key": MASTER_KEY
                            }
                        });
                    }
                }
                
                // Cria novo código para a sala
                const teacherCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                
                // Busca os dados novamente para adicionar a nova sala
                const newResponse = await axios.get(`${JSON_BIN_URL}/latest`, {
                    headers: { "X-Master-Key": MASTER_KEY }
                });
                
                let newData = newResponse.data.record;
                
                // Adiciona a estrutura da nova sala
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
                
                // Atualiza o JSONBin com a nova sala
                await axios.put(JSON_BIN_URL, newData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": MASTER_KEY
                    }
                });
                
                // Atualiza o localStorage com o novo código
                localStorage.setItem('teacherCode', teacherCode);
                
                // Notifica o usuário e redireciona
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