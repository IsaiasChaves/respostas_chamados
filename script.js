const SENHA_CORRETA = "suporte123";
    let currentSystem = 'sei';
    let currentModel = '';

    /* ===================== MODO NOTURNO ===================== */
    function applyTheme() {
        const saved = localStorage.getItem('tema') || 'dark'; // modo escuro é o padrão
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeButton(saved);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
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



    /* ===================== MENU MOBILE ===================== */
    function toggleMenu() {
        const nav = document.querySelector('nav');
        const overlay = document.getElementById('menu-overlay');
        const isOpen = nav.classList.contains('open');
        
        if(isOpen) {
            closeMenu();
        } else {
            nav.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        const nav = document.querySelector('nav');
        const overlay = document.getElementById('menu-overlay');
        nav.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleSubmenu(event, submenuId) {
        event.stopPropagation();
        const submenu = document.getElementById(submenuId);
        if (!submenu) return;
        const submenuItems = document.querySelectorAll('.submenu-item');
        submenuItems.forEach(item => item.classList.toggle('hidden'));
    }

    // Fechar menu ao clicar em um botão
    document.addEventListener('DOMContentLoaded', function() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Aguarda o showSystem ser executado (onclick do HTML)
                // antes de fechar o menu
                setTimeout(closeMenu, 100);
            });
        });
    });
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
                fn: (v) => `Prezado(a),\n\nPermissão ativa até o próximo dia útil às 23h59, caso o usuário não efetue a desanexação no prazo, por favor abrir outro chamado solicitando liberação novamente.\n\n${v[0]}\n\nPROCEDIMENTOS PARA DESANEXAÇÃO:\n\n1 - Sair do SEI e entrar novamente;\n2 - Pesquisar o processo principal informado;\n3 - Clicar no processo anexado;\n4 - Clicar no ícone "desanexar processo" , que está localizado ao lado do ícone de "Ciência";\n5 - Expor o motivo e clicar em salvar.` 
            },
            restrito: { inputs: [], fn: () => `Prezado(a),\n\nO processo informado encontra-se restrito. Por favor, anexar o print do andamento do processo para continuidade do atendimento.\n\nProcedimentos:\n1 - Consultar o processo\n2 - Clicar no botão "consultar andamento"` },
            sem_resposta: { inputs: [], fn: () => `Prezado(a),\n\nDevido à falta de retorno, estamos finalizando este chamado.\n\nCaso necessite prosseguir, por favor, faça uma nova solicitação.` },
			solicitacao: { inputs: [], fn: () => `Prezado(a),\n\nSua solicitação foi atendida.\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.`  
            },
            criacao_estrutura: { inputs: [], fn: () => `Prezado(a),\n\nPara a criação, alteração ou atualização de estruturas/unidades nos sistemas GRP, eTurmalina e SEI, deverá ser encaminhado processo SEI à unidade ITAC/PRES, instruído com Ofício assinado pelo titular da pasta (Secretário de Estado, Presidente ou autoridade máxima do órgão ou entidade) e com a documentação prevista na Instrução Normativa SEAD nº 25, de 5 de dezembro de 2023:\n\nOfício de solicitação;\nDecreto, Portaria ou Ata que formalize a alteração;\nOrganograma visual da estrutura (quando disponível);

\nPlanilha De/Para, contendo o mapeamento das alterações de unidades e estruturas.\n\nAs solicitações que impliquem criação, alteração ou atualização de estruturas/unidades nos sistemas corporativos somente serão analisadas quando encaminhadas na forma acima.

As solicitações registradas por meio do Sistema de Chamados destinam-se exclusivamente a atendimentos de baixa complexidade, tais como liberação ou revogação de acesso aos sistemas, criação e atualização de cadastro de usuários, redefinição de senha, vinculação de usuários a unidades, ajustes cadastrais e demais demandas operacionais que não envolvam alterações na estrutura organizacional.\n\nPermanecemos à disposição para eventuais esclarecimentos.` },
            assinatura_terceirizados: { inputs: [], fn: () => `Prezado(a),

Verificamos que o(a) servidor(a) mencionado(a) possui cadastro ativo na condição de terceirizado(a).

Informamos que, conforme as regras de acesso vigentes, apenas servidores efetivos e ocupantes de cargos comissionados podem ser vinculados a unidades com permissão para assinatura de documentos.

Caso haja necessidade de conceder acesso à unidade em questão sem a permissão de assinatura, solicitamos a gentileza de nos informar para que possamos adotar as providências necessárias.

Permanecemos à disposição para quaisquer esclarecimentos adicionais.` },
            senha_servidor: { inputs: [], fn: () => `Prezado(a),

Informo que a redefinição de senha de servidores efetivos e comissionados é realizada diretamente pelo setor de Recursos Humanos (RH) do respectivo órgão de lotação do servidor.

O suporte técnico realiza a redefinição de senha apenas para servidores terceirizados. Excepcionalmente, poderão ser analisados casos envolvendo servidores efetivos ou comissionados quando houver indícios de falha sistêmica, devidamente comprovados por meio de evidências (prints de tela, mensagens de erro, entre outros) e mediante autorização do servidor envolvido.

Permanecemos à disposição para quaisquer esclarecimentos adicionais.` },
            acesso_chamados: { inputs: [], fn: () => `Prezado(a),

Em atenção à solicitação apresentada, informo que a concessão de acesso ao Sistema de Chamados e Demandas para abertura de solicitações deverá ser requerida por meio de Ofício encaminhado em processo SEI, acompanhado da Portaria Específica de designação do servidor, publicada no Diário Oficial do Estado, conforme disposto no art. 9º, § 1º, da Instrução Normativa SEAD nº 8, de 17 de fevereiro de 2023.

Ressalta-se que o servidor designado deverá ocupar cargo efetivo ou Cargo em Comissão (CAS), observados os critérios estabelecidos na referida norma.

Após o encaminhamento da documentação pertinente, a solicitação será analisada para as providências cabíveis.

Permanecemos à disposição para quaisquer esclarecimentos adicionais.` },
            criacao_documento: { inputs: [], fn: () => `Prezado(a),

Informamos que a criação de novos Tipos de Documento no SEI deve observar os padrões e diretrizes da Redação Oficial e da padronização documental institucional.

Esclarecemos que documentos oficiais já existentes no sistema, tais como Ofício, Despacho, Memorando e demais expedientes administrativos, não se caracterizam como modelos passíveis de criação como novos Tipos de Documento, uma vez que possuem estrutura, finalidade e formatação padronizadas conforme as normas de comunicação oficial vigentes.

A criação de novos Tipos de Documento é recomendada apenas para documentos específicos que demandem estrutura própria e padronização diferenciada, tais como:

Formulários;
Requerimentos específicos;
Fichas;
Checklists;
Termos;
Declarações;
Outros documentos operacionais com características próprias.

Destacamos, ainda, que muitos documentos de uso recorrente podem ser padronizados pelos próprios usuários por meio da funcionalidade Texto Padrão do SEI, proporcionando maior agilidade, uniformidade e eficiência na elaboração dos documentos institucionais, sem a necessidade de criação de novos tipos documentais.

Por fim, informamos que todas as solicitações de criação de novos Tipos de Documento serão analisadas quanto à sua finalidade, necessidade institucional, aderência às normas vigentes e conformidade com as diretrizes da Redação Oficial.

Permanecemos à disposição para eventuais esclarecimentos.` },
            modelo_documento: { inputs: [], fn: () => `Prezado(a),

Para dar prosseguimento à sua solicitação, solicitamos o encaminhamento do modelo desejado nos formatos .DOCX (Microsoft Word) ou HTML, contendo todas as informações, formatações e ajustes necessários.

Ressaltamos que a elaboração e a adequação do conteúdo do modelo são de responsabilidade da unidade solicitante, cabendo à equipe técnica apenas a parametrização e disponibilização do documento no sistema.

Informamos ainda que a inclusão ou alteração do modelo no SEI será realizada após a validação prévia pelo usuário no ambiente de testes (SEI Treinar), mediante o recebimento do arquivo devidamente revisado e aprovado pela área demandante.

Permanecemos no aguardo do envio da documentação para dar continuidade ao atendimento da solicitação.` },
            unidade: { inputs: [], fn: () => `Prezado(a),\n\nInformo que o(a) servidor(a) informado(a) já possui acesso com permissão de assinatura (Básico) em outra unidade.\n\nPara a concessão de assinatura em mais de um setor (unidade), é necessário anexar, no chamado, cópia da Portaria publicada no Diário Oficial, de forma explícita, citando "cumulativamente" ou "sem prejuízo das demais funções".\n\nCaso não haja Portaria, recomendamos a utilização da funcionalidade "Bloco de Assinatura", disponibilizada no SEI.\n\nPermanecemos à disposição para quaisquer esclarecimentos.` },
            planilha: { inputs: [], fn: () => `Prezado(a),\n\nPara cadastro e acesso ao SEI, é necessário anexar a planilha de cadastro devidamente preenchida com os dados do(a) servidor(a).` },
            abertura_bd: { 
                inputs: ['Chamado nº', 'Tipo de Relatório', 'Órgão/Unidade/Usuário'], 
                fn: (v) => `Em atenção ao chamado nº ${v[0]}, que solicita relatório ${v[1]} ${v[2]}.` 
            },
            demanda_user: { 
                inputs: [], 
                fn: () => `Prezado,\n\nPara atender à sua solicitação, foi necessária a abertura de uma demanda junto ao setor de Infraestrutura e Banco de Dados, com previsão de conclusão em até 7 dias úteis.\nApós a finalização, os relatórios serão anexados a este chamado.\n\nFicamos à disposição para quaisquer esclarecimentos.` 
            },
            lgpd_externo: { inputs: [], fn: () => `Prezado(a),

Informamos que, para a realização do cadastro como Usuário Externo no SEI/AC, é obrigatória a apresentação da documentação prevista no procedimento de credenciamento, incluindo a selfie segurando o documento oficial de identificação.

Essa exigência tem como finalidade confirmar a identidade do solicitante e garantir a segurança do processo de credenciamento, prevenindo o uso indevido de dados por terceiros.

Conforme as normas que regulamentam o Sistema Eletrônico de Informações do Estado do Acre, o cadastro como Usuário Externo implica a aceitação das disposições estabelecidas no Decreto nº 8.478, de 10 de fevereiro de 2018, e na Instrução Normativa Conjunta SGA/CGE nº 001, de 22 de fevereiro de 2018. Além disso, o usuário assume a responsabilidade pelo uso da assinatura eletrônica na modalidade cadastrada (login e senha), respondendo civil, penal e administrativamente pelas ações realizadas em seu acesso.

Dessa forma, não é possível efetuar o cadastro sem o envio da selfie segurando o documento de identificação, por se tratar de um requisito obrigatório do procedimento de credenciamento.

Permanecemos à disposição para quaisquer esclarecimentos.` }
        },
        eturmalina: {
            criacao_acesso: { inputs: [], fn: () => `Prezado(a),\n\nO acesso ao sistema eTurmalina foi concedido.\n\nUsuário: CPF do servidor sem pontos ou traço.\nSenha: CPF do servidor sem pontos ou traço.\n\nO próprio sistema orientará o usuário quanto à troca de senha no primeiro acesso.\n\nLink de acesso: https://sigrh.ac.gov.br/eturmalina` },
            reset_senha: { inputs: [], fn: () => `Prezado(a),\n\nInformo que foi realizado o reset de senha do acesso ao sistema eTurmalina.\n\nUsuário: CPF do servidor sem pontos ou traço.\nSenha: CPF do servidor sem pontos ou traço.\n\nO próprio sistema orientará o usuário quanto à troca de senha no primeiro acesso após o reset.\nLink de acesso: https://sigrh.ac.gov.br/eturmalina` },
            reset_autorizacao: { inputs: [], fn: () => `Prezado(a),

Solicito, por gentileza, autorização para a realização de uma nova redefinição de senha, a fim de possibilitar a execução de testes de acesso e a verificação do funcionamento da conta.

Permaneço à disposição para quaisquer esclarecimentos.` },
            acesso_contracheque: { inputs: ['Usuário', 'Senha'], fn: (v) => `Prezado(a),\n\nInformamos que sua solicitação foi atendida e o acesso ao sistema de Contracheque foi restabelecido.\n\nDados de acesso:\n\nUsuário: ${v[0]}\nSenha provisória: ${v[1]}\n\nImportante: A senha provisória deve ser digitada manualmente. Recomendamos não utilizar os recursos de copiar e colar durante o primeiro acesso.\n\nApós o login, o(a) servidor(a) deverá acessar o portal (https://minhaconta.ac.gov.br/) para realizar a alteração da senha provisória e definir uma nova senha de sua preferência.\n\nEm caso de dúvidas ou necessidade de suporte adicional, permanecemos à disposição.` },
            correcao_lotacao: { inputs: [], fn: () => `Prezado(a),\n\nInformamos que foi identificado que a inconsistência nos acessos aos sistemas Contracheque e PontoWeb decorre de divergências nas lotações cadastradas no sistema e-Turmalina.\n\nA regularização da situação depende da atualização das lotações pelo setor de Recursos Humanos (RH) do respectivo órgão. Após a conclusão das correções cadastrais no sistema e-Turmalina, deverá ser aberto um processo para ITAC - PRES informando que as lotações foram regularizadas, para que seja realizada a atualização geral dos sistemas e, consequentemente, a normalização dos acessos.\n\nEnquanto a regularização não for concluída, caso o servidor necessite de informações financeiras mensais ou anuais, orientamos que procure o setor de Recursos Humanos (RH) de seu órgão, onde poderá ser emitida a respectiva ficha financeira.\n\nCaso seja identificada a inexistência da unidade administrativa no sistema e-Turmalina, deverá ser instaurado processo no SEI, por meio de ofício, solicitando sua criação. O processo deverá ser encaminhado à unidade ITAC - PRES, acompanhado da portaria publicada no Diário Oficial do Estado que comprove a criação ou alteração da estrutura organizacional do órgão e a vinculação da unidade à sua estrutura administrativa.\n\nPermanecemos à disposição para prestar os esclarecimentos que se fizerem necessários.` },
            abaco: { inputs: ['Número do Chamado'], fn: (v) => `Prezado(a),\n\nInformo que foi aberto chamado junto à empresa Ábaco (${v[0]}). Assim que obtivermos um retorno, entraremos em contato.` },
            solicitacao: { inputs: [], fn: () => `Prezado(a),\n\nSua solicitação foi atendida.\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` }
        },
        integracao: {
            criacao_email: { inputs: ['Login', 'Senha Provisória'], fn: (v) => `Prezado(a),\n\nUsuário(s) cadastrado(s) conforme solicitado.\n\nLogin: ${v[0]}\nSenha Provisória: ${v[1]}\nO servidor(a) deve acessar o https://minhaconta.ac.gov.br/ para realizar a alteração de sua senha.\nUsar a senha provisória de forma escrita (não copiar e colar)\n\nEstamos à disposição para quaisquer dúvidas ou informações adicionais.` },
            reset_senha: { inputs: ['Usuário', 'Senha Provisória'], fn: (v) => `Prezado(a),\n\nSenha do servidor(a) redefinida!\nUsuário: ${v[0]}\nUsar a senha provisória de forma escrita (não copiar e colar): ${v[1]}\nO servidor(a) deve acessar o https://minhaconta.ac.gov.br/ para realizar a alteração de sua senha.` },
            alteracao_nivel: { inputs: ['Usuário'], fn: (v) => `Prezado(a),\n\nInformamos que a alteração do nível de acesso foi devidamente processada e concluída.\nUsuário: ${v[0]}\n\nAproveitamos a oportunidade para reforçar as diretrizes de segurança da informação quanto ao uso de ferramentas de terceiros para fins institucionais:\n\n- Monitoramento e Privacidade: A autorização de sessões em navegadores expõe o conteúdo das mensagens a softwares instalados na máquina. Caso o computador esteja comprometido por malwares (softwares espiões), as conversas podem ser armazenadas sem a necessidade de interação do usuário.\n\n- Encerramento de Sessões: Ressaltamos que o fechamento do navegador não encerra a sessão do WhatsApp Web. É obrigatório que o usuário finalize a conexão através das configurações do aplicativo no celular para evitar que terceiros acessem a conta indevidamente.` }
        },
        grp: {
            criacao_acesso: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: quarenta e lá vai pancada",
                fn: (v) => `Prezado(a),\n\nInformamos que o cadastro da servidor(a) foi realizado com sucesso, conforme solicitado.\n\nDados de acesso:\n\nUsuário(s):\n${v[0]}\nSenha inicial: 123\n\nO usuário(a) foi vinculado(a) ao módulo Almoxarifado, com o perfil de Requisitante.\n\nSolicitamos que o acesso seja realizado utilizando as credenciais acima. Conforme as políticas de segurança do sistema, será necessário realizar a alteração da senha após o primeiro acesso.\n\nPermanecemos à disposição para quaisquer esclarecimentos ou solicitações adicionais.\n\nAtenciosamente,\n\nSuporte GRP`
            },
            reset_senha: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: R-HIV",
                fn: (v) => `Prezado(a),\n\nInformamos que a redefinição da senha do servidor(a) foi realizada com sucesso, conforme solicitado.\n\nDados de acesso:\n\nUsuário(s):\n${v[0]}\nSenha inicial: 123\n\nSolicitamos que o acesso seja realizado utilizando as credenciais acima. Conforme as políticas de segurança do sistema, será necessário realizar a alteração da senha após o primeiro acesso.\n\nPermanecemos à disposição para quaisquer esclarecimentos ou solicitações adicionais.\n\nAtenciosamente,\n\nSuporte GRP`
            },
            resumida: { 
                inputs: ['Usuário'], 
                placeholder: "Ex: T-Croks",
                fn: (v) => `Prezado(a),\nSua solicitação foi atendida.\n\nUsuário(s): \n${v[0]}\nSenha: 123\n\nFicamos à disposição para quaisquer esclarecimentos.`
            },
            anulacao_empenho: {
                inputs: [],
                fn: () => `Prezados,\n\nInformamos que a solicitação foi atendida e que o procedimento de anulação do empenho foi realizado.\n\nPermanecemos à disposição para eventuais dúvidas ou solicitações adicionais.\n\nAtenciosamente,\nSuporte GRP`
            },
            chamado_link: {
                noGreeting: true, // não recebe a saudação automática
                inputs: ['Serviço Executado','Referência','Servidor','UG'],
                fn: (v) => `ATENDIMENTO REALIZADO\n\nServiço Executado: ${v[0]}\nReferência: Chamado Interno da SEAD nº ${v[1]}\nServidor: ${v[2]}\nUG: ${v[3]}\nSituação: Atendimento realizado conforme solicitado.`
            }
        }, 
            // Novo modelo: Chamado Link (GRP)
            // Formato solicitado:
            // ATENDIMENTO REALIZADO
            // Serviço Executado: (opção)
            // Referência: Chamado Interno da SEAD nº (input)
            // Servidor: (input)
            // UG: (input)
            // Situação: Atendimento realizado conforme solicitado.
        
            // Definição do modelo
            // Nota: inputs são usados apenas para manter compatibilidade com a renderização padrão;
            // a criação dos campos é feita no selectModel quando identificado o modelo.
        
            // adiciona em grp abaixo (mantemos a estrutura para busca)
        
            // o objeto real é inserido dentro do objeto 'grp' para evitar redefinição, então:
        
            // (inserido na definição existente do banco de dados 'grp' acima)
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
                checkboxes: ['Solicitante', 'Servidor', 'Gestor de Compras', 'Ordenador', 'Jurídico de Compras', 'Controle Interno', 'Financeiro', 'SEPLAN'],
                fn: (v, checkedTypes) => {
                    let tiposTexto = '';
                    if(checkedTypes && checkedTypes.length > 0) {
                        tiposTexto = '\n\nTipos de cadastro criados:\n' + checkedTypes.map(tipo => '• ' + tipo).join('\n');
                    }
                    return `Prezado(a),\n\nCriado o acesso ao Sistema de Compras conforme o solicitado.\n\nUsuário: ${v[0]}\nSenha: Mesma utilizada no SEI, webmail e internet.${tiposTexto}\n\nSiga as orientações do manual em anexo para a configuração.`;
                }
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
            askAttendant(false);
        } else {
            document.getElementById('error-msg').innerText = "Senha incorreta!";
        }
    }

    function checkLoginState() {
        if(localStorage.getItem('acessoPermitido') === 'true') {
            document.getElementById('login-overlay').style.display = 'none';
            askAttendant(false);
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
            notas: 'Bloco de Notas Pessoal',
            historico: 'Histórico (últimos 90 dias)'
        };
        document.getElementById('system-title').innerText = titles[sys];
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${sys}`).classList.add('active');
        
        document.querySelectorAll('.model-selector, #notas-models, #historico-models').forEach(div => div.classList.add('hidden'));
        const target = document.getElementById(`${sys}-models`);
        if(target) target.classList.remove('hidden');
        if (sys === 'historico') loadHistory(true);
        if (sys !== 'notas') flushNotesNow(); // ao sair do bloco de notas, salva na hora

        const workspace = document.getElementById('workspace-area');
        if (['notas', 'documentos', 'utilidades', 'historico'].includes(sys)) {
            workspace.classList.add('hidden');
        } else {
            workspace.classList.remove('hidden');
        }

        document.getElementById('input-area').classList.add('hidden');
        document.getElementById('preview').value = "";

        // Auto-seleciona o primeiro modelo do sistema
        if (!['notas', 'documentos', 'utilidades', 'historico'].includes(sys)) {
            setTimeout(() => {
                const firstModelBtn = document.querySelector(`#${sys}-models .model-btn`);
                if (firstModelBtn) {
                    firstModelBtn.click();
                }
            }, 0);
        }
    }

    function selectModel(sys, mod, btn) {
        if (['utilidades', 'documentos', 'notas'].includes(sys)) return;
        currentModel = mod;
        const config = database[sys][mod];
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        if (btn && btn.classList) {
            btn.classList.add('active');
        } else {
            // fallback: tentar localizar o botão pelo atributo onclick
            const modelBtns = document.querySelectorAll(`#${sys}-models .model-btn`);
            for (const b of modelBtns) {
                const attr = b.getAttribute('onclick') || '';
                if (attr.includes(`'${mod}'`) || attr.includes(`\"${mod}\"`)) { b.classList.add('active'); break; }
            }
        }
        const container = document.getElementById('fields-container');
        container.innerHTML = '';

        // Tratamento especial para modelo 'chamado_link' do GRP
        if (sys === 'grp' && mod === 'chamado_link') {
            document.getElementById('input-area').classList.remove('hidden');
            // Serviço Executado (select)
            const label0 = document.createElement('label');
            label0.innerText = 'Serviço Executado:';
            container.appendChild(label0);
            const select = document.createElement('select');
            select.className = 'input-text';
            select.id = 'input-0';
            ['Redefinição de Senha','Criação de Acesso','Dúvidas','Apoio Técnico'].forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.innerText = opt;
                select.appendChild(o);
            });
            select.onchange = updatePreview;
            container.appendChild(select);

            // Referência: Chamado Interno
            container.innerHTML += `<label>Referência: Chamado Interno da SEAD nº</label><input type="text" class="input-text" id="input-1" oninput="updatePreview()">`;

            // Servidor
            container.innerHTML += `<label>Servidor:</label><input type="text" class="input-text" id="input-2" oninput="updatePreview()">`;

            // UG com datalist
            container.innerHTML += `<label>UG:</label><input type="text" class="input-text" id="input-3" list="lista-orgaos" oninput="updatePreview()">`;
            updatePreview();
            return;
        }
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
                    if((sys === 'sei' && ['criacao', 'lotacao', 'reabertura', 'desanexar'].includes(mod)) || (sys === 'grp' && ['criacao_acesso', 'reset_senha'].includes(mod))) {
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
        } else if(!config.checkboxes || config.checkboxes.length === 0) { 
            document.getElementById('input-area').classList.add('hidden'); 
        } else {
            document.getElementById('input-area').classList.remove('hidden');
        }
        
        // Adicionar checkboxes se existirem
        if(config.checkboxes && config.checkboxes.length > 0) {
            const checkboxLabel = document.createElement('label');
            checkboxLabel.innerText = "Tipos de Cadastro:";
            checkboxLabel.style.marginTop = "15px";
            checkboxLabel.style.fontWeight = "bold";
            container.appendChild(checkboxLabel);
            
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkboxes-group';
            
            config.checkboxes.forEach((tipo, idx) => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `checkbox-${idx}`;
                checkbox.className = 'tipo-checkbox';
                checkbox.onchange = updatePreview;
                
                const checkboxLabel = document.createElement('label');
                checkboxLabel.htmlFor = `checkbox-${idx}`;
                checkboxLabel.innerText = tipo;
                
                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(checkboxLabel);
                checkboxContainer.appendChild(checkboxDiv);
            });
            
            container.appendChild(checkboxContainer);
        }
        
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
        
        // Coletar checkboxes marcados
        let checkedTypes = [];
        if(config.checkboxes) {
            config.checkboxes.forEach((_, idx) => {
                const checkbox = document.getElementById(`checkbox-${idx}`);
                if(checkbox && checkbox.checked) {
                    checkedTypes.push(config.checkboxes[idx]);
                }
            });
        }
        
        const text = config.fn(values, checkedTypes);
        document.getElementById('preview').value = config.noGreeting ? text : applyGreeting(text);
    }

    // Respostas com campos de entrada só são registradas quando ao menos um campo de texto foi preenchido
    function inputsFilled() {
        if (!currentModel || !database[currentSystem] || !database[currentSystem][currentModel]) return false;
        const inputs = database[currentSystem][currentModel].inputs || [];
        if (inputs.length === 0) return true; // resposta sem campos: registra sempre
        return inputs.some((_, i) => {
            const el = document.getElementById(`input-${i}`);
            // campos de lista (select) sempre têm valor, então não contam como "preenchidos"
            return el && el.tagName !== 'SELECT' && el.value.trim() !== '';
        });
    }

    function copyText() {
        const text = document.getElementById('preview').value;
        if(!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const status = document.getElementById('status');
            if (inputsFilled()) {
                registerUse(currentSystem, currentModel, text);
                status.innerText = "Copiado com sucesso!";
            } else {
                status.innerText = "Copiado! (não registrado: preencha os campos)";
            }
            setTimeout(() => { status.innerText = ""; }, 2500);
        });
    }

    function clearAll() {
        if(!currentModel) return;
        const config = database[currentSystem][currentModel];
        config.inputs.forEach((_, i) => {
            const el = document.getElementById(`input-${i}`);
            if(el) el.value = '';
        });
        // Desmarcar checkboxes
        if(config.checkboxes) {
            config.checkboxes.forEach((_, i) => {
                const checkbox = document.getElementById(`checkbox-${i}`);
                if(checkbox) checkbox.checked = false;
            });
        }
        updatePreview();
    }

    /* ===================== SAUDAÇÃO AUTOMÁTICA ===================== */
    function isGreetingOn() {
        try { return localStorage.getItem('saudacao_auto') === 'on'; } catch (e) { return false; }
    }

    function getGreeting() {
        const h = new Date().getHours();
        if (h >= 5 && h < 12) return 'bom dia';
        if (h >= 12 && h < 18) return 'boa tarde';
        return 'boa noite';
    }

    // "Prezado(a)," -> "Prezado(a), bom dia!"; textos sem "Prezado" recebem "Bom dia!" no início
    function applyGreeting(text) {
        if (!isGreetingOn() || !text) return text;
        const greeting = getGreeting();
        const re = /^(Prezad[oa]s?(?:\(a\)|\(as\))?),/;
        if (re.test(text)) return text.replace(re, `$1, ${greeting}!`);
        return greeting.charAt(0).toUpperCase() + greeting.slice(1) + '!\n\n' + text;
    }

    function updateGreetingButton() {
        const btn = document.getElementById('greeting-toggle');
        if (!btn) return;
        const on = isGreetingOn();
        btn.classList.toggle('on', on);
        btn.setAttribute('aria-pressed', on);
        btn.title = on
            ? `Saudação automática LIGADA (agora: "${getGreeting()}")`
            : 'Saudação automática DESLIGADA';
    }

    function toggleGreeting() {
        try { localStorage.setItem('saudacao_auto', isGreetingOn() ? 'off' : 'on'); } catch (e) {}
        updateGreetingButton();
        updatePreview();
    }

    document.addEventListener('DOMContentLoaded', updateGreetingButton);

    /* ===================== BUSCA DE RESPOSTAS ===================== */
    const SYSTEM_NAMES = {
        sei: 'SEI', eturmalina: 'e-Turmalina', integracao: 'Integração',
        grp: 'GRP', vpn: 'VPN', compras: 'Compras'
    };
    let searchIndex = null;
    let searchMatches = [];
    let searchActive = -1;

    function normalizeText(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    // Monta o índice a partir dos botões existentes: novas respostas entram na busca automaticamente
    function buildSearchIndex() {
        const seen = new Set();
        searchIndex = [];
        document.querySelectorAll('.model-btn[onclick*="selectModel("]').forEach(btn => {
            const m = btn.getAttribute('onclick').match(/selectModel\('([^']+)',\s*'([^']+)'/);
            if (!m) return;
            const sys = m[1], mod = m[2];
            const key = sys + '|' + mod;
            if (seen.has(key) || !database[sys] || !database[sys][mod]) return;
            seen.add(key);
            const config = database[sys][mod];
            let body = '';
            try { body = config.fn(config.inputs.map(() => ''), []); } catch (e) {}
            const label = btn.textContent.trim();
            searchIndex.push({
                sys, mod, label,
                labelNorm: normalizeText(label),
                textNorm: normalizeText(label + ' ' + (SYSTEM_NAMES[sys] || sys) + ' ' + body)
            });
        });

        // Links da aba Utilidades: ao escolher, abrem em outra aba
        document.querySelectorAll('#utilidades-models .model-btn').forEach(el => {
            const a = el.querySelector('a[href]');
            if (!a) return;
            const label = (el.firstChild && el.firstChild.textContent || '').trim();
            if (!label) return;
            const url = a.href;
            searchIndex.push({
                url, label,
                labelNorm: normalizeText(label),
                textNorm: normalizeText(label + ' link ' + url)
            });
        });
    }

    function searchResponses() {
        if (!searchIndex) buildSearchIndex();
        const input = document.getElementById('search-input');
        const list = document.getElementById('search-results');
        const terms = normalizeText(input.value).split(/\s+/).filter(Boolean);
        list.innerHTML = '';
        searchActive = -1;

        if (terms.length === 0) { list.classList.add('hidden'); searchMatches = []; return; }

        // Resultados com o termo no nome aparecem primeiro
        const score = item => terms.filter(t => item.labelNorm.includes(t)).length;
        searchMatches = searchIndex
            .filter(item => terms.every(t => item.textNorm.includes(t)))
            .sort((a, b) => score(b) - score(a));

        if (searchMatches.length === 0) {
            const li = document.createElement('li');
            li.className = 'search-empty';
            li.textContent = 'Nenhuma resposta encontrada.';
            list.appendChild(li);
        } else {
            searchMatches.forEach((item, i) => {
                const li = document.createElement('li');
                li.className = 'search-item';
                const name = document.createElement('span');
                name.textContent = item.label;
                const tag = document.createElement('span');
                tag.className = 'search-tag';
                if (item.url) {
                    tag.textContent = 'Link ↗';
                    tag.classList.add('search-tag-link');
                    li.title = item.url;
                } else {
                    tag.textContent = SYSTEM_NAMES[item.sys] || item.sys;
                }
                li.append(name, tag);
                li.onmousedown = (e) => { e.preventDefault(); openSearchResult(i); };
                list.appendChild(li);
            });
        }
        list.classList.remove('hidden');
    }

    function searchKeydown(e) {
        const items = document.querySelectorAll('#search-results .search-item');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (!items.length) return;
            e.preventDefault();
            searchActive = (searchActive + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
            items.forEach((li, i) => li.classList.toggle('active', i === searchActive));
            items[searchActive].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (searchMatches.length) openSearchResult(searchActive >= 0 ? searchActive : 0);
        } else if (e.key === 'Escape') {
            closeSearch(true);
        }
    }

    function closeSearch(clear) {
        document.getElementById('search-results').classList.add('hidden');
        if (clear) document.getElementById('search-input').value = '';
        searchActive = -1;
    }

    function openSearchResult(i) {
        const item = searchMatches[i];
        if (!item) return;
        closeSearch(true);
        document.getElementById('search-input').blur();
        if (item.url) {
            window.open(item.url, '_blank', 'noopener');
            return;
        }
        closeMenu();
        showSystem(item.sys);
        // showSystem auto-seleciona o primeiro modelo com setTimeout; selecionamos o escolhido depois dele
        setTimeout(() => {
            const btn = document.querySelector(`#${item.sys}-models .model-btn[onclick*="'${item.mod}'"]`);
            if (btn && btn.classList.contains('submenu-item') && btn.classList.contains('hidden')) {
                document.querySelectorAll('.submenu-item').forEach(el => el.classList.remove('hidden'));
            }
            selectModel(item.sys, item.mod, btn);
            if (btn) btn.scrollIntoView({ block: 'nearest' });
        }, 10);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-box')) closeSearch(false);
    });

    // Atalho: Ctrl+K (ou "/" fora de campos de texto) foca a busca
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
        if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
            const input = document.getElementById('search-input');
            if (!input) return;
            e.preventDefault();
            input.focus();
            input.select();
        }
    });

    /* ===================== EQUIPE / USUÁRIO ===================== */
    // Login do SEI -> nome usado nos registros. Para incluir alguém, adicione uma linha aqui.
    const TEAM = [
        { login: 'jessicamaria.campos', nome: 'Jéssica Campos' },
        { login: 'isaias.chaves',       nome: 'Isaias Chaves' },
        { login: 'lucas.veiga',         nome: 'Lucas Veiga' },
        { login: 'lucas.diuare',        nome: 'Lucas Diuare' },
        { login: 'gabriel.rodrigues',   nome: 'Gabriel Sol' },
        { login: 'elissandra.santos',   nome: 'Elissandra Teles' },
        { login: 'tassio.assis',        nome: 'Tassio Assis' },
        { login: 'marilou.acacio',      nome: 'Marilou Acacio' },
        { login: 'andre.magalhaes',     nome: 'André Magalhaes' },
        { login: 'andre.medeiros',      nome: 'André Medeiros' },
        { login: 'hudson.medina',       nome: 'Hudson Medina' },
        { login: 'william.rocha',       nome: 'William Rocha' }
    ];
    const TEAM_NAMES = TEAM.map(t => t.nome);
    const ATTENDANT_KEY = 'atendente_nome';

    function findByLogin(login) {
        const l = String(login || '').trim().toLowerCase().replace(/@.*$/, '');
        return l ? TEAM.find(t => t.login && t.login === l) : null;
    }

    function getAttendant() {
        try {
            const n = localStorage.getItem(ATTENDANT_KEY) || '';
            return TEAM_NAMES.includes(n) ? n : '';
        } catch (e) { return ''; }
    }

    function updateAttendantButton() {
        const el = document.getElementById('attendant-name');
        if (el) el.textContent = getAttendant() || 'Identificar-se';
    }

    // force = true: abre mesmo que a pessoa já esteja identificada (para trocar)
    function askAttendant(force) {
        updateAttendantButton();
        if (!force && getAttendant()) { loadNotes(); return; }
        const input = document.getElementById('sei-login-input');
        input.value = '';
        document.getElementById('sei-login-error').textContent = '';
        document.getElementById('name-cancel').classList.toggle('hidden', !getAttendant());
        document.getElementById('name-overlay').classList.remove('hidden');
        setTimeout(() => input.focus(), 50);
    }

    function closeNameOverlay() {
        if (!getAttendant()) return; // primeira vez: identificação obrigatória
        document.getElementById('name-overlay').classList.add('hidden');
    }

    // Entrada pelo login do SEI: validação local, sem consultar a planilha (instantâneo)
    function submitSeiLogin() {
        const input = document.getElementById('sei-login-input');
        const member = findByLogin(input.value);
        if (!member) {
            document.getElementById('sei-login-error').textContent = 'Login não encontrado na equipe. Verifique e tente de novo.';
            input.select();
            return;
        }
        const anterior = getAttendant();
        if (anterior && anterior !== member.nome) flushNotesNow(); // salva as notas da pessoa anterior
        try { localStorage.setItem(ATTENDANT_KEY, member.nome); } catch (e) {}
        document.getElementById('name-overlay').classList.add('hidden');
        updateAttendantButton();
        const st = document.getElementById('status');
        if (st) { st.innerText = `Bem-vindo(a), ${member.nome}!`; setTimeout(() => { st.innerText = ''; }, 2500); }
        if (anterior !== member.nome) {
            loadNotes(); // carrega em segundo plano, não trava a entrada
            if (currentSystem === 'historico') loadHistory(true);
        }
    }

    /* ===================== PLANILHA (Apps Script) ===================== */
    const METRICS_URL = 'https://script.google.com/macros/s/AKfycbyHQUUJoH3yS_Hw1dufKwMUBHw0pBj6EshswbxtubycJI59zZOP7zOmwODn7dacAVV5AA/exec';

    async function apiGet(params) {
        const url = METRICS_URL + '?' + new URLSearchParams(params).toString();
        const r = await fetch(url);
        const data = await r.json();
        if (!data.ok) throw new Error(data.erro || 'erro');
        return data;
    }

    function apiPost(body) {
        // text/plain + no-cors: o Apps Script aceita sem bloqueio de CORS
        return fetch(METRICS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(body)
        });
    }

    /* ===================== REGISTRO DE USO (métricas) ===================== */
    // Cada cópia vira uma linha na planilha. Respostas sem campos não enviam texto (só contam o uso).
    // Respostas com campos enviam o texto com as senhas escondidas.
    const METRICS_QUEUE_KEY = 'metricas_pendentes';
    let metricsSending = false;
    let lastCopy = null; // evita registrar a mesma resposta, sem alteração, em menos de 15s

    function getModelLabel(sys, mod) {
        const btn = document.querySelector(`#${sys}-models .model-btn[onclick*="'${mod}'"]`);
        return btn ? btn.textContent.trim() : mod;
    }

    // Esconde senhas: valores digitados em campos "Senha" e o restante de linhas "...senha...: valor"
    function maskPasswords(text, sys, mod) {
        let out = text;
        const config = database[sys] && database[sys][mod];
        if (config && config.inputs) {
            config.inputs.forEach((label, i) => {
                if (!/senha/i.test(label)) return;
                const el = document.getElementById(`input-${i}`);
                const v = el && el.value.trim();
                if (v && v.length >= 3) out = out.split(v).join('••••');
            });
        }
        return out.replace(/(senha[^:\n]*:[ \t]*)([^\n]+)/gi, '$1••••');
    }

    function registerUse(sys, mod, text) {
        const now = Date.now();
        if (lastCopy && lastCopy.sys === sys && lastCopy.mod === mod && lastCopy.text === text && now - lastCopy.ts < 15000) return;
        lastCopy = { sys, mod, text, ts: now };
        const config = database[sys] && database[sys][mod];
        const hasInputs = !!(config && config.inputs && config.inputs.length);
        const q = loadMetricsQueue();
        q.push({
            id: now.toString(36) + Math.random().toString(36).slice(2, 7),
            ts: new Date(now).toISOString(),
            sistema: SYSTEM_NAMES[sys] || sys,
            resposta: getModelLabel(sys, mod),
            chave: sys + '|' + mod,
            atendente: getAttendant() || 'Não identificado',
            texto: hasInputs ? maskPasswords(text, sys, mod) : ''
        });
        saveMetricsQueue(q);
        flushMetrics();
    }

    function loadMetricsQueue() {
        try { const a = JSON.parse(localStorage.getItem(METRICS_QUEUE_KEY) || '[]'); return Array.isArray(a) ? a : []; }
        catch (e) { return []; }
    }
    function saveMetricsQueue(a) {
        try { localStorage.setItem(METRICS_QUEUE_KEY, JSON.stringify(a.slice(-2000))); } catch (e) {}
    }

    // Envia a fila; se estiver sem internet, tenta de novo depois (nada se perde)
    async function flushMetrics() {
        if (!METRICS_URL || metricsSending) return;
        const q = loadMetricsQueue();
        if (!q.length) return;
        metricsSending = true;
        try {
            await apiPost(q);
            saveMetricsQueue(loadMetricsQueue().slice(q.length)); // remove só o que foi enviado
        } catch (e) {
            // falha de rede: mantém na fila
        } finally {
            metricsSending = false;
        }
    }

    window.addEventListener('online', flushMetrics);

    /* ===================== HISTÓRICO (Eu / Equipe, últimos 90 dias) ===================== */
    const HIST_DAYS = 90;
    let histScope = 'eu';        // 'eu' | 'equipe'
    let histFilter = 'todos';    // sistema selecionado
    let histResumo = null;
    let histSearchTimer = null;
    let histRequest = 0;         // descarta respostas antigas quando outra requisição já foi feita

    function histParams(extra) {
        const p = Object.assign({ dias: HIST_DAYS }, extra);
        if (histScope === 'eu') p.nome = getAttendant() || '-';
        return p;
    }

    function setHistScope(scope) {
        histScope = scope;
        document.querySelectorAll('.hist-scope-btn').forEach(b => b.classList.toggle('active', b.dataset.scope === scope));
        loadHistory(true);
    }

    function setHistMessage(msg) {
        const listEl = document.getElementById('hist-list');
        listEl.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'hist-empty';
        p.textContent = msg;
        listEl.appendChild(p);
    }

    function formatDateTime(ts) {
        const d = new Date(ts);
        const p = n => String(n).padStart(2, '0');
        return `${p(d.getDate())}/${p(d.getMonth() + 1)} às ${p(d.getHours())}:${p(d.getMinutes())}`;
    }

    function updateHistoryStats(stats) {
        const s = stats || {};
        document.getElementById('hist-today').textContent = s.hoje != null ? s.hoje : '–';
        document.getElementById('hist-7d').textContent = s.d7 != null ? s.d7 : '–';
        document.getElementById('hist-30d').textContent = s.d30 != null ? s.d30 : '–';
        document.getElementById('hist-90d').textContent = s.d90 != null ? s.d90 : '–';
    }

    // reset = true ao entrar na aba / trocar Eu-Equipe: limpa a busca e o filtro
    async function loadHistory(reset) {
        if (reset) {
            histFilter = 'todos';
            const s = document.getElementById('hist-search');
            if (s) s.value = '';
        }
        const searchVal = (document.getElementById('hist-search').value || '').trim();
        if (searchVal.length >= 2) return runHistorySearch();

        const req = ++histRequest;
        setHistMessage('Carregando...');
        updateHistoryStats(null);
        await flushMetrics(); // envia o que estiver pendente antes de consultar
        try {
            const data = await apiGet(histParams({ acao: 'resumo' }));
            if (req !== histRequest) return;
            histResumo = data;
            updateHistoryStats(data.stats);
            renderHistoryGroups();
        } catch (e) {
            if (req !== histRequest) return;
            setHistMessage('Não foi possível carregar o histórico. Verifique a conexão e clique em "Atualizar".');
        }
    }

    function renderHistoryFilters(grupos) {
        const filtersEl = document.getElementById('hist-filters');
        filtersEl.innerHTML = '';
        if (!grupos.length) return;
        const totals = {};
        grupos.forEach(g => { totals[g.sistema] = (totals[g.sistema] || 0) + g.total; });
        const all = grupos.reduce((a, g) => a + g.total, 0);
        const mkChip = (key, text, count) => {
            const b = document.createElement('button');
            b.className = 'hist-chip' + (histFilter === key ? ' active' : '');
            b.textContent = `${text} (${count})`;
            b.onclick = () => { histFilter = key; renderHistoryGroups(); };
            filtersEl.appendChild(b);
        };
        mkChip('todos', 'Todos', all);
        orderedSystems(Object.keys(totals)).forEach(s => mkChip(s, s, totals[s]));
    }

    // Ordena os sistemas na mesma ordem do menu
    function orderedSystems(list) {
        const order = Object.values(SYSTEM_NAMES);
        return list.slice().sort((a, b) => {
            const ia = order.indexOf(a), ib = order.indexOf(b);
            return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        });
    }

    function renderHistoryGroups() {
        const grupos = (histResumo && histResumo.grupos) || [];
        if (histFilter !== 'todos' && !grupos.some(g => g.sistema === histFilter)) histFilter = 'todos';
        renderHistoryFilters(grupos);
        const listEl = document.getElementById('hist-list');
        listEl.innerHTML = '';
        if (!grupos.length) {
            setHistMessage(histScope === 'eu'
                ? 'Você não tem respostas registradas nos últimos 90 dias.'
                : 'Nenhuma resposta registrada pela equipe nos últimos 90 dias.');
            return;
        }
        const bySys = {};
        grupos.forEach(g => (bySys[g.sistema] = bySys[g.sistema] || []).push(g));

        orderedSystems(Object.keys(bySys)).filter(s => histFilter === 'todos' || s === histFilter).forEach(sys => {
            const section = document.createElement('section');
            section.className = 'hist-system';
            const h2 = document.createElement('h2');
            h2.className = 'hist-system-title';
            h2.textContent = sys + ' ';
            const cnt = document.createElement('span');
            cnt.className = 'hist-count';
            cnt.textContent = bySys[sys].reduce((a, g) => a + g.total, 0);
            h2.appendChild(cnt);
            section.appendChild(h2);

            bySys[sys].forEach(g => {
                const det = document.createElement('details');
                det.className = 'hist-model';
                const sum = document.createElement('summary');
                sum.textContent = g.resposta;
                const c = document.createElement('span');
                c.className = 'hist-count';
                c.textContent = g.total;
                c.title = 'Vezes usada';
                sum.appendChild(c);
                det.appendChild(sum);
                // As respostas do grupo são carregadas só quando ele é aberto
                det.addEventListener('toggle', () => { if (det.open && !det.dataset.loaded) loadGroupItems(det, g.chave); });
                section.appendChild(det);
            });
            listEl.appendChild(section);
        });
    }

    async function loadGroupItems(det, chave) {
        det.dataset.loaded = '1';
        const box = document.createElement('div');
        box.className = 'hist-loading';
        box.textContent = 'Carregando...';
        det.appendChild(box);
        try {
            const data = await apiGet(histParams({ acao: 'itens', chave }));
            box.remove();
            data.itens.forEach(it => det.appendChild(renderHistoryItem(it, false)));
            if (data.total > data.itens.length) det.appendChild(moreNote(data.total - data.itens.length));
        } catch (e) {
            box.textContent = 'Não foi possível carregar. Feche e abra o grupo para tentar de novo.';
            delete det.dataset.loaded;
        }
    }

    function moreNote(n) {
        const p = document.createElement('p');
        p.className = 'hist-more';
        p.textContent = `+ ${n} resposta(s) mais antiga(s). Use a busca para encontrar uma específica.`;
        return p;
    }

    // Texto exibido: o salvo na planilha ou, nas respostas sem campos, o modelo padrão
    function itemText(it) {
        if (it.texto) return it.texto;
        const [sys, mod] = String(it.chave).split('|');
        const config = database[sys] && database[sys][mod];
        if (!config) return it.resposta;
        try { return config.fn(config.inputs.map(() => '____'), []); } catch (e) { return it.resposta; }
    }

    function renderHistoryItem(it, showTag) {
        const entry = document.createElement('div');
        entry.className = 'hist-entry';

        const meta = document.createElement('div');
        meta.className = 'hist-meta';
        const left = document.createElement('span');
        left.textContent = 'Último uso: ' + formatDateTime(it.ultimo);
        const uses = document.createElement('span');
        uses.className = 'hist-uses';
        uses.textContent = it.vezes === 1 ? 'Usada 1 vez' : `Usada ${it.vezes} vezes`;
        meta.append(left, uses);
        entry.appendChild(meta);

        if (showTag) {
            const tag = document.createElement('div');
            tag.className = 'hist-tag';
            tag.textContent = `${it.sistema} › ${it.resposta}`;
            entry.appendChild(tag);
        }

        const text = document.createElement('div');
        text.className = 'hist-text';
        const full = itemText(it);
        text.textContent = full;
        text.title = 'Clique para expandir/recolher';
        text.onclick = () => text.classList.toggle('expanded');
        entry.appendChild(text);

        const footer = document.createElement('div');
        footer.className = 'hist-footer';
        const who = document.createElement('span');
        who.className = 'hist-who';
        if (histScope === 'equipe') {
            who.textContent = 'Por: ' + Object.entries(it.atendentes || {})
                .sort((a, b) => b[1] - a[1])
                .map(([n, c]) => c > 1 ? `${n} (${c})` : n).join(', ');
        }
        const copy = document.createElement('button');
        copy.className = 'hist-btn hist-btn-copy';
        copy.textContent = 'Copiar';
        copy.onclick = () => navigator.clipboard.writeText(full).then(() => {
            copy.textContent = 'Copiado!';
            setTimeout(() => { copy.textContent = 'Copiar'; }, 1500);
        });
        footer.append(who, copy);
        entry.appendChild(footer);
        return entry;
    }

    // Busca nas respostas (texto, sistema, tipo e pessoa)
    function onHistorySearch() {
        clearTimeout(histSearchTimer);
        histSearchTimer = setTimeout(() => {
            const v = document.getElementById('hist-search').value.trim();
            if (v.length >= 2) runHistorySearch();
            else if (v.length === 0) loadHistory(false);
        }, 450);
    }

    async function runHistorySearch() {
        const q = document.getElementById('hist-search').value.trim();
        const req = ++histRequest;
        document.getElementById('hist-filters').innerHTML = '';
        setHistMessage('Buscando...');
        try {
            const data = await apiGet(histParams({ acao: 'buscar', q }));
            if (req !== histRequest) return;
            const listEl = document.getElementById('hist-list');
            listEl.innerHTML = '';
            if (!data.itens.length) { setHistMessage(`Nenhuma resposta encontrada para "${q}".`); return; }
            const info = document.createElement('p');
            info.className = 'hist-search-info';
            info.textContent = `${data.total} resultado(s) para "${q}"` + (data.total > data.itens.length ? ` — mostrando os ${data.itens.length} mais recentes` : '');
            listEl.appendChild(info);
            data.itens.forEach(it => listEl.appendChild(renderHistoryItem(it, true)));
        } catch (e) {
            if (req !== histRequest) return;
            setHistMessage('Não foi possível buscar. Verifique a conexão e tente de novo.');
        }
    }

    /* ===================== BLOCO DE NOTAS (por pessoa, salvo na planilha) ===================== */
    const NOTES_DEBOUNCE = 1500;
    let notesTimer = null;
    let notesOwner = '';      // de quem é o texto que está na tela
    let notesDirty = false;

    function notesKey(nome) { return 'notas_' + nome; }

    function readLocalNotes(nome) {
        try { const o = JSON.parse(localStorage.getItem(notesKey(nome)) || 'null'); return o && typeof o.texto === 'string' ? o : null; }
        catch (e) { return null; }
    }
    function writeLocalNotes(nome, texto, ts) {
        try { localStorage.setItem(notesKey(nome), JSON.stringify({ texto, ts })); } catch (e) {}
    }

    function setNotesStatus(msg) {
        const el = document.getElementById('notes-status');
        if (el) el.textContent = msg;
    }

    async function loadNotes() {
        const nome = getAttendant();
        const area = document.getElementById('notes-area');
        if (!nome || !area) return;
        notesOwner = nome;
        notesDirty = false;
        let local = readLocalNotes(nome);

        // Migra o bloco antigo (antes de existir usuário) para a primeira pessoa que entrar neste computador
        try {
            const antigo = localStorage.getItem('rascunho_notas');
            if (antigo && (!local || !local.texto)) {
                local = { texto: antigo, ts: Date.now() };
                writeLocalNotes(nome, antigo, local.ts);
                apiPost({ acao: 'nota', nome, texto: antigo, ts: local.ts });
            }
            if (antigo) localStorage.removeItem('rascunho_notas');
        } catch (e) {}

        area.value = local ? local.texto : '';
        setNotesStatus('Sincronizando...');
        try {
            const data = await apiGet({ acao: 'nota', nome });
            if (notesOwner !== nome) return;
            const localTs = local ? local.ts : 0;
            if (data.ts > localTs && !notesDirty) {
                area.value = data.texto;
                writeLocalNotes(nome, data.texto, data.ts);
            } else if (localTs > data.ts) {
                await apiPost({ acao: 'nota', nome, texto: local.texto, ts: localTs }); // envia o que só estava aqui
            }
            setNotesStatus('Salvo na nuvem ✓');
        } catch (e) {
            setNotesStatus('Sem conexão — salvo apenas neste computador por enquanto.');
        }
    }

    function saveNotes() {
        const nome = getAttendant();
        if (!nome || nome !== notesOwner) return;
        const texto = document.getElementById('notes-area').value;
        notesDirty = true;
        writeLocalNotes(nome, texto, Date.now());
        setNotesStatus('Salvando...');
        clearTimeout(notesTimer);
        notesTimer = setTimeout(flushNotesNow, NOTES_DEBOUNCE);
    }

    async function flushNotesNow() {
        clearTimeout(notesTimer);
        if (!notesDirty || !notesOwner) return;
        const local = readLocalNotes(notesOwner);
        if (!local) return;
        notesDirty = false;
        try {
            await apiPost({ acao: 'nota', nome: notesOwner, texto: local.texto, ts: local.ts });
            setNotesStatus(local.texto.length > 49000
                ? '⚠ Nota muito grande: só os primeiros 49.000 caracteres são salvos na nuvem.'
                : 'Salvo na nuvem ✓');
        } catch (e) {
            notesDirty = true;
            setNotesStatus('Sem conexão — salvo neste computador. Será enviado quando a conexão voltar.');
        }
    }

    window.addEventListener('online', () => { if (notesOwner) { notesDirty = true; flushNotesNow(); } });
    window.addEventListener('pagehide', () => { if (notesDirty) flushNotesNow(); });

    /* ===================== INICIALIZAÇÃO ===================== */
    document.addEventListener('DOMContentLoaded', () => {
        updateAttendantButton();
        flushMetrics();
        setInterval(flushMetrics, 60000); // reenvia registros pendentes
    });
