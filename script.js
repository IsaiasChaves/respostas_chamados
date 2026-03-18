const SENHA_CORRETA = "suporte123";
    let currentSystem = 'sei';
    let currentModel = '';

    /* ===================== MODO NOTURNO ===================== */
    function applyTheme() {
        const saved = localStorage.getItem('tema') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeButton(saved);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('tema', next);
        updateThemeButton(next);
    }

    function updateThemeButton(theme) {
        const icon = document.getElementById('theme-icon');
        const label = document.getElementById('theme-label');
        if (theme === 'dark') {
            icon.textContent = '☀️';
            label.textContent = 'Modo Claro';
        } else {
            icon.textContent = '🌙';
            label.textContent = 'Modo Escuro';
        }
    }
    /* ======================================================== */

    const database = {
        sei: {
            criacao: { 
                inputs: ['Dados do Usuário'], 
                placeholder: "Ex: elis.asandra / SEC\tSEC - SECSINC / SEC\tBásico",
                fn: (v) => `Prezado(a),\n\nUsuário(s) cadastrado(s) conforme solicitado.\n\n${v[0]}\nSenha: é a mesma de acesso ao webmail, internet.\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` 
            },
            lotacao: { 
                inputs: ['Dados'], 
                placeholder: "Ex: salve.engano / SEC\tSEC - SECSINC / SEC\tBásico",
                fn: (v) => `Prezado(a),\n\nSua solicitação foi atendida.\n${v[0]}\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` 
            },
            desligamento: { inputs: [], fn: () => `Prezado(a),\n\nSua solicitação foi atendida. As permissões de acesso SEI, expiram hoje, às 23h59.\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` },
            reabertura: { 
                inputs: ['Dados'], 
                placeholder: "Ex: traumatismo.ucraniano / SEC\tSEC - SECSINC / SEC\tReabreProcesso",
                fn: (v) => `Prezado(a),\n\nPermissão de reabertura de processo concedida para o último usuário a finalizar o processo.\nPermissão ativa até o próximo dia útil às 23h59, caso o usuário não efetue a reabertura no prazo, por favor abrir outro chamado solicitando liberação novamente.\n\n${v[0]}\n\n1 - Sair do SEI e entrar novamente;\n2 - Pesquisar o processo informado;\n3 - Clicar no ícone "Reabrir processo" que está localizado ao lado do ícone de "anotações".` 
            },
            desanexar: { 
                inputs: ['Dados'], 
                placeholder: "Ex: eitu.deoculos / SEC\tSEC - SECSINC / SEC\tDesanexaProcesso",
                fn: (v) => `Prezado(a),\n\nPermissão ativa até o próximo dia útil às 23h59, caso o usuário não efetue a desanexação no prazo, por favor abrir outro chamado solicitando liberação novamente.\n\n${v[0]}\n\nPROCEDIMENTOS PARA DESANEXAÇÃO:\n\n1 - Pesquisar o processo principal informado;\n2 - Clicar no processo anexado;\n3 - Clicar no ícone "desanexar processo" , que está localizado ao lado do ícone de "Ciência";\n4 - Expor o motivo e clicar em salvar.` 
            },
            restrito: { inputs: [], fn: () => `Prezado(a),\n\nO processo informado encontra-se restrito. Por favor, anexar o print do andamento do processo para continuidade do atendimento.\n\nProcedimentos:\n1 - Consultar o processo\n2 - Clicar no botão "consultar andamento"` },
            sem_resposta: { inputs: [], fn: () => `Prezado(a),\n\nDevido à falta de retorno, estamos finalizando este chamado.\n\nCaso necessite prosseguir, por favor, faça uma nova solicitação.` },
			solicitacao: { inputs: [], fn: () => `Prezado(a),\n\nSua solicitação foi atendida.\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.`  
            },
            unidade: { inputs: [], fn: () => `Prezado(a),\n\nInformo que o(a) servidor(a) informado(a) já possui acesso com permissão de assinatura (Básico) em outra unidade.\n\nPara a concessão de assinatura em mais de um setor (unidade), é necessário anexar, no chamado, cópia da Portaria publicada no Diário Oficial, de forma explícita, citando "cumulativamente" ou "sem prejuízo das demais funções".\n\nCaso não haja Portaria, recomendamos a utilização da funcionalidade "Bloco de Assinatura", disponibilizada no SEI.\n\nPermanecemos à disposição para quaisquer esclarecimentos.` },
            planilha: { inputs: [], fn: () => `Prezado(a),\n\nPara cadastro e acesso ao SEI, é necessário anexar a planilha de cadastro devidamente preenchida com os dados do(a) servidor(a).` },
            abertura_bd: { 
                inputs: ['Chamado nº', 'Tipo de Relatório', 'Órgão/Unidade/Usuário'], 
                fn: (v) => `Em atenção ao chamado nº ${v[0]}, que solicita relatório ${v[1]} ${v[2]}.` 
            },
            demanda_user: { 
                inputs: [], 
                fn: () => `Prezado,\n\nPara atender à sua solicitação, foi necessária a abertura de uma demanda junto ao setor de Infraestrutura e Banco de Dados, com previsão de conclusão em até 7 dias úteis.\nApós a finalização, os relatórios serão anexados a este chamado.\n\nFicamos à disposição para quaisquer esclarecimentos.` 
            }
        },
        eturmalina: {
            criacao_acesso: { inputs: [], fn: () => `Prezado(a),\n\nO acesso ao sistema eTurmalina foi concedido.\n\nUsuário: CPF do servidor\nSenha: CPF do servidor\n\nO próprio sistema orientará o usuário quanto à troca de senha no primeiro acesso.\n\nLink de acesso: https://sigrh.ac.gov.br/eturmalina` },
            reset_senha: { inputs: [], fn: () => `Prezado(a),\n\nInformo que foi realizado o reset de senha do acesso ao sistema eTurmalina.\n\nUsuário: CPF do servidor\nSenha: CPF do servidor\n\nO próprio sistema orientará o usuário quanto à troca de senha no primeiro acesso após o reset.\nLink de acesso: https://sigrh.ac.gov.br/eturmalina` },
            abaco: { inputs: ['Número do Chamado'], fn: (v) => `Prezado(a),\n\nInformo que foi aberto chamado junto à empresa Ábaco (${v[0]}). Assim que obtivermos um retorno, entraremos em contato.` }
        },
        integracao: {
            criacao_email: { inputs: ['Login', 'Senha Provisória'], fn: (v) => `Prezado(a),\n\nUsuário(s) cadastrado(s) conforme solicitado.\n\nLogin: ${v[0]}\nSenha Provisória: ${v[1]}\nO servidor(a) deve acessar o minhaconta.ac.gov.br\nUsar a senha provisória de forma escrita (não copiar e colar)\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` },
            reset_senha: { inputs: ['Senha Provisória'], fn: (v) => `Prezado(a),\n\nSenha do servidor(a) redefinida!\nO servidor(a) deve acessar o https://minhaconta.ac.gov.br\nUsar a senha provisória de forma escrita (não copiar e colar): ${v[0]}` }
        },
        grp: {
            criacao_acesso: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: quarenta e lá vai pancada",
                fn: (v) => `Prezado(a),\nSua solicitação foi atendida.\n\nUsuário(s): \n${v[0]}\nSenha: 123\n\nFicamos à disposição para quaisquer esclarecimentos.`
            }
        }, 
        vpn: {
            acesso_vpn: { 
                inputs: ['Usuário'], 
                fn: (v) => `Prezado(a),\n\nCriado o acesso a VPN conforme o solicitado.\n\nUsuário: ${v[0]}\nSenha: Mesma utilizada no SEI, webmail e internet.\n\nSiga as orientações do manual em anexo para a configuração.` 
            }
        
        },
        compras: {
            criacao_compras: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: que mal lhe pergunte",
                fn: (v) => `Prezado(a),\n\nCriado o acesso ao Sistema de Compras conforme o solicitado.\n\nUsuário: ${v[0]}\nSenha: Mesma utilizada no SEI, webmail e internet.\n\nSiga as orientações do manual em anexo para a configuração.` 
            },
            solicitacao: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: que mal lhe pergunte",
                fn: (v) => `Prezado(a),\n\nCriado o acesso ao Sistema de Compras conforme o solicitado.\n\nUsuário: ${v[0]}\nSenha: Mesma utilizada no SEI, webmail e internet.\n\nSiga as orientações do manual em anexo para a configuração.` 
            }
        
        },
    

    };

    function checkPass() {
        const input = document.getElementById('pass-input').value;
        if(input === SENHA_CORRETA) {
            localStorage.setItem('acessoPermitido', 'true');
            document.getElementById('login-overlay').style.display = 'none';
        } else {
            document.getElementById('error-msg').innerText = "Senha incorreta!";
        }
    }

    function checkLoginState() {
        if(localStorage.getItem('acessoPermitido') === 'true') {
            document.getElementById('login-overlay').style.display = 'none';
        }
    }

    function toggleLink(btn) {
        const isOpen = btn.classList.contains('open');
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('open'));
        if (!isOpen) btn.classList.add('open');
    }

    function copyLink(url) {
        navigator.clipboard.writeText(url);
        const st = document.getElementById('status');
        st.innerText = "Link copiado!";
        setTimeout(() => st.innerText = "", 2000);
    }

    function showSystem(sys) {
        currentSystem = sys;
        currentModel = '';
        const titles = { 
            sei: 'SEI - Sistema Eletrônico de Informações', 
            eturmalina: 'e-Turmalina', 
            integracao: 'Integração', 
            grp: 'GRP', 
            vpn: 'VPN - Acesso Remoto',
            compras: 'Sistema de Compras AC',
            documentos: 'Documentos e Modelos',
            utilidades: 'Utilidades e Links Importantes',
            notas: 'Bloco de Notas Pessoal'
        };
        document.getElementById('system-title').innerText = titles[sys];
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${sys}`).classList.add('active');
        
        document.querySelectorAll('.model-selector, #notas-models').forEach(div => div.classList.add('hidden'));
        const target = document.getElementById(`${sys}-models`);
        if(target) target.classList.remove('hidden');

        const workspace = document.getElementById('workspace-area');
        if (['notas', 'documentos', 'utilidades'].includes(sys)) {
            workspace.classList.add('hidden');
        } else {
            workspace.classList.remove('hidden');
        }

        document.getElementById('input-area').classList.add('hidden');
        document.getElementById('preview').value = "";
    }

    function selectModel(sys, mod) {
        if (['utilidades', 'documentos', 'notas'].includes(sys)) return;
        currentModel = mod;
        const config = database[sys][mod];
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        const container = document.getElementById('fields-container');
        container.innerHTML = '';
        if(config.inputs && config.inputs.length > 0) {
            document.getElementById('input-area').classList.remove('hidden');
            if (mod === 'abertura_bd') {
                container.innerHTML += `<label>Chamado nº:</label>
                <input type="text" class="input-text" id="input-0" oninput="updatePreview()">`;
                container.innerHTML += `<label>Tipo de Relatório:</label>
                <select class="input-text" id="input-1" onchange="updatePreview(); toggleBDField()">
                    <option value="contendo os usuários que possuem acesso ao órgão">Acesso ao órgão</option>
                    <option value="contendo os usuários que possuem acesso à unidade">Acesso à unidade</option>
                    <option value="contendo os usuários que iniciaram processos na unidade">Iniciaram processos na unidade</option>
                    <option value="contendo histórico de acessos do usuário">Histórico de acessos do usuário</option>
                </select>`;
                container.innerHTML += `<label id="label-dinamico">Órgão:</label>
                <input type="text" class="input-text" id="input-2" list="lista-orgaos" oninput="updatePreview()">`;
            } else {
                config.inputs.forEach((labelTxt, index) => {
                    const label = document.createElement('label');
                    label.innerText = labelTxt + ":";
                    container.appendChild(label);
                    if((sys === 'sei' && ['criacao', 'lotacao', 'reabertura', 'desanexar'].includes(mod)) || (sys === 'grp' && mod === 'criacao_acesso')) {
                        const area = document.createElement('textarea');
                        area.id = `input-${index}`;
                        area.placeholder = config.placeholder || "Digite os dados...";
                        area.oninput = updatePreview;
                        container.appendChild(area);
                    } else {
                        const input = document.createElement('input');
                        input.className = 'input-text';
                        input.id = `input-${index}`;
                        input.placeholder = config.placeholder || "";
                        input.oninput = updatePreview;
                        container.appendChild(input);
                    }
                });
            }
        } else { document.getElementById('input-area').classList.add('hidden'); }
        updatePreview();
    }

    function toggleBDField() {
        const tipo = document.getElementById('input-1').value;
        const label = document.getElementById('label-dinamico');
        const input = document.getElementById('input-2');
        if (tipo.includes('órgão')) { label.innerText = "Órgão:"; input.setAttribute('list', 'lista-orgaos');
        } else if (tipo.includes('unidade')) { label.innerText = "Unidade:"; input.removeAttribute('list');
        } else { label.innerText = "Usuário:"; input.removeAttribute('list'); }
    }

    function updatePreview() {
        if(!currentModel) return;
        const config = database[currentSystem][currentModel];
        const values = config.inputs.map((_, i) => document.getElementById(`input-${i}`).value || "____");
        document.getElementById('preview').value = config.fn(values);
    }

    function copyText() {
        const text = document.getElementById('preview').value;
        if(!text) return;
        const textToCopy = text.split('\n').map(line => line === '' ? '⠀' : line).join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const status = document.getElementById('status');
            status.innerText = "Copiado com sucesso!";
            setTimeout(() => { status.innerText = ""; }, 2000);
        });
    }

    function clearAll() {
        if(!currentModel) return;
        database[currentSystem][currentModel].inputs.forEach((_, i) => {
            const el = document.getElementById(`input-${i}`);
            if(el) el.value = '';
        });
        updatePreview();
    }

    /* BLOCO DE NOTAS */
    function saveNotes() {
        localStorage.setItem('rascunho_notas', document.getElementById('notes-area').value);
    }
    function loadNotes() {
        const saved = localStorage.getItem('rascunho_notas');
        if(saved) document.getElementById('notes-area').value = saved;
    }