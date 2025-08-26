// script.js

const { PDFDocument, rgb, StandardFonts } = PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE ELEMENTOS HTML ---
    const partesContainer = document.getElementById('partes-container');
    const addParteBtn = document.getElementById('addParteBtn');
    const veiculosContainer = document.getElementById('veiculos-container');
    const addVeiculoBtn = document.getElementById('addVeiculoBtn');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const generateCleanPdfBtn = document.getElementById('generateCleanPdfBtn');
    const form = document.getElementById('occurrenceForm');

    // --- 2. VARIÁVEIS DE CONTROLE ---
    let parteCount = 1;
    let veiculoCount = 1;

    // --- 3. LÓGICA PARA PARTES ENVOLVIDAS DINÂMICAS ---
    if (partesContainer.querySelector('.parte-item')) {
        partesContainer.querySelector('.parte-item').dataset.id = 1;
        addRemoveParteListener(partesContainer.querySelector('.parte-item'));
    }

    addParteBtn.addEventListener('click', () => {
        if (parteCount < 5) {
            parteCount++;
            const newParte = createParteElement(parteCount);
            partesContainer.appendChild(newParte);
            addRemoveParteListener(newParte);
        } else {
            alert('Você pode adicionar no máximo 5 partes envolvidas.');
        }
    });

    function createParteElement(id) {
        const parteDiv = document.createElement('div');
        parteDiv.className = 'parte-item';
        parteDiv.dataset.id = id;
        parteDiv.innerHTML = `
            <h3>Parte ${id}</h3>
            <div class="form-group radio-group type-selector">
                <label>TIPO:</label>
                <input type="radio" id="parte${id}Vitima" name="parte${id}Tipo" value="VÍTIMA">
                <label for="parte${id}Vitima">VÍTIMA</label>
                <input type="radio" id="parte${id}Autor" name="parte${id}Tipo" value="AUTOR">
                <label for="parte${id}Autor">AUTOR</label>
                <input type="radio" id="parte${id}Indiciado" name="parte${id}Tipo" value="INDICIADO">
                <label for="parte${id}Indiciado">INDICIADO</label>
                <input type="radio" id="parte${id}Sindicado" name="parte${id}Tipo" value="SINDICADO">
                <label for="parte${id}Sindicado">SINDICADO</label>
                <input type="radio" id="parte${id}Solicitante" name="parte${id}Tipo" value="SOLICITANTE">
                <label for="parte${id}Solicitante">SOLICITANTE</label>
                <input type="radio" id="parte${id}NaoDefinida" name="parte${id}Tipo" value="PARTE NÃO DEFINIDA">
                <label for="parte${id}NaoDefinida">NÃO DEFINIDA</label>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="parte${id}Nome">NOME:</label>
                    <input type="text" id="parte${id}Nome" name="parte${id}Nome">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="parte${id}Nasc">NASC:</label>
                    <input type="date" id="parte${id}Nasc" name="parte${id}Nasc">
                </div>
                <div class="form-group">
                    <label for="parte${id}RG">RG:</label>
                    <input type="text" id="parte${id}RG" name="parte${id}RG" placeholder="__________-____">
                </div>
                <div class="form-group">
                    <label for="parte${id}CPF">CPF:</label>
                    <input type="text" id="parte${id}CPF" name="parte${id}CPF" placeholder="___.___.___-__">
                </div>
                <div class="form-group">
                    <label for="parte${id}UF">UF:</label>
                    <input type="text" id="parte${id}UF" name="parte${id}UF" maxlength="2">
                </div>
                <div class="form-group radio-group">
                    <label>SEXO:</label>
                    <input type="radio" id="parte${id}SexoM" name="parte${id}Sexo" value="M">
                    <label for="parte${id}SexoM">M</label>
                    <input type="radio" id="parte${id}SexoF" name="parte${id}Sexo" value="F">
                    <label for="parte${id}SexoF">F</label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="parte${id}Mae">MÃE:</label>
                    <input type="text" id="parte${id}Mae" name="parte${id}Mae">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="parte${id}Pai">PAI:</label>
                    <input type="text" id="parte${id}Pai" name="parte${id}Pai">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="parte${id}Logradouro">LOGRADOURO:</label>
                    <input type="text" id="parte${id}Logradouro" name="parte${id}Logradouro">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="parte${id}Bairro">BAIRRO:</label>
                    <input type="text" id="parte${id}Bairro" name="parte${id}Bairro">
                </div>
                <div class="form-group">
                    <label for="parte${id}Cidade">CIDADE:</label>
                    <input type="text" id="parte${id}Cidade" name="parte${id}Cidade">
                </div>
                <div class="form-group">
                    <label for="parte${id}Natural">NATURAL:</label>
                    <input type="text" id="parte${id}Natural" name="parte${id}Natural">
                </div>
                <div class="form-group">
                    <label for="parte${id}Nacional">NACIONAL:</label>
                    <input type="text" id="parte${id}Nacional" name="parte${id}Nacional">
                </div>
            </div>
            <button type="button" class="remove-item-btn" data-target="parte">Remover Parte</button>
        `;
        return parteDiv;
    }

    function addRemoveParteListener(element) {
        const removeBtn = element.querySelector('.remove-item-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                element.remove();
                parteCount--;
                updatePartesHeadings();
            });
        }
    }

    function updatePartesHeadings() {
        const partes = partesContainer.querySelectorAll('.parte-item');
        partes.forEach((parte, index) => {
            parte.querySelector('h3').textContent = `Parte ${index + 1}`;
            parte.dataset.id = index + 1;
        });
    }

    // --- 4. LÓGICA PARA VEÍCULOS ENVOLVIDOS DINÂMICOS ---
    if (veiculosContainer.querySelector('.veiculo-item')) {
        veiculosContainer.querySelector('.veiculo-item').dataset.id = 1;
        addRemoveVeiculoListener(veiculosContainer.querySelector('.veiculo-item'));
        addReboqueToggleListener(veiculosContainer.querySelector('.veiculo-item'));
    }

    addVeiculoBtn.addEventListener('click', () => {
        if (veiculoCount < 2) {
            veiculoCount++;
            const newVeiculo = createVeiculoElement(veiculoCount);
            veiculosContainer.appendChild(newVeiculo);
            addRemoveVeiculoListener(newVeiculo);
            addReboqueToggleListener(newVeiculo);
        } else {
            alert('Você pode adicionar no máximo 2 veículos envolvidos.');
        }
    });

    function createVeiculoElement(id) {
        const veiculoDiv = document.createElement('div');
        veiculoDiv.className = 'veiculo-item';
        veiculoDiv.dataset.id = id;
        veiculoDiv.innerHTML = `
            <h3>Veículo ${id}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="veiculo${id}Placa">PLACA:</label>
                    <input type="text" id="veiculo${id}Placa" name="veiculo${id}Placa" placeholder="___-____">
                </div>
                <div class="form-group">
                    <label for="veiculo${id}Renavam">RENAVAM:</label>
                    <input type="text" id="veiculo${id}Renavam" name="veiculo${id}Renavam">
                </div>
                <div class="form-group full-width">
                    <label for="veiculo${id}Proprietario">PROPRIETÁRIO:</label>
                    <input type="text" id="veiculo${id}Proprietario" name="veiculo${id}Proprietario">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="veiculo${id}CNH">CNH:</label>
                    <input type="text" id="veiculo${id}CNH" name="veiculo${id}CNH">
                </div>
                <div class="form-group">
                    <label for="veiculo${id}Municipio">MUNICÍPIO:</label>
                    <input type="text" id="veiculo${id}Municipio" name="veiculo${id}Municipio">
                </div>
                <div class="form-group">
                    <label for="veiculo${id}UF">UF:</label>
                    <input type="text" id="veiculo${id}UF" name="veiculo${id}UF" maxlength="2">
                </div>
            </div>
            <div class="reboque-section">
                <input type="checkbox" id="veiculo${id}HasReboque" name="veiculo${id}HasReboque">
                <label for="veiculo${id}HasReboque">Possui REBOQUE?</label>
                <div class="reboque-details" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="veiculo${id}ReboquePlaca">PLACA REBOQUE:</label>
                            <input type="text" id="veiculo${id}ReboquePlaca" name="veiculo${id}ReboquePlaca" placeholder="___-____">
                        </div>
                        <div class="form-group">
                            <label for="veiculo${id}Chassi">CHASSI:</label>
                            <input type="text" id="veiculo${id}Chassi" name="veiculo${id}Chassi">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="veiculo${id}MarcaModelo">MARCA / MODELO:</label>
                            <input type="text" id="veiculo${id}MarcaModelo" name="veiculo${id}MarcaModelo" placeholder="___________-_____">
                        </div>
                        <div class="form-group">
                            <label for="veiculo${id}Ano">ANO:</label>
                            <input type="number" id="veiculo${id}Ano" name="veiculo${id}Ano" min="1900" max="2100">
                        </div>
                        <div class="form-group">
                            <label for="veiculo${id}Categoria">CATEGORIA:</label>
                            <input type="text" id="veiculo${id}Categoria" name="veiculo${id}Categoria">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="veiculo${id}Cor">COR:</label>
                            <input type="text" id="veiculo${id}Cor" name="veiculo${id}Cor">
                        </div>
                        <div class="form-group">
                            <label for="veiculo${id}QtdePassageiros">QTDE PASSAGEIROS:</label>
                            <input type="number" id="veiculo${id}QtdePassageiros" name="veiculo${id}QtdePassageiros" min="1">
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="remove-item-btn" data-target="veiculo">Remover Veículo</button>
        `;
        return veiculoDiv;
    }

    function addRemoveVeiculoListener(element) {
        const removeBtn = element.querySelector('.remove-item-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                element.remove();
                veiculoCount--;
                updateVeiculosHeadings();
            });
        }
    }

    function updateVeiculosHeadings() {
        const veiculos = veiculosContainer.querySelectorAll('.veiculo-item');
        veiculos.forEach((veiculo, index) => {
            veiculo.querySelector('h3').textContent = `Veículo ${index + 1}`;
            veiculo.dataset.id = index + 1;
        });
    }

    function addReboqueToggleListener(element) {
        const reboqueCheckbox = element.querySelector('input[type="checkbox"][id$="HasReboque"]');
        const reboqueDetails = element.querySelector('.reboque-details');

        if (reboqueCheckbox && reboqueDetails) {
            reboqueCheckbox.addEventListener('change', () => {
                reboqueDetails.style.display = reboqueCheckbox.checked ? 'block' : 'none';
            });
        }
    }

    // --- 5. FUNÇÃO PARA COLETAR DADOS DO FORMULÁRIO (REUTILIZÁVEL) ---
    function collectFormData() {
        const formData = {};
        
        for (let i = 0; i < form.elements.length; i++) {
            const element = form.elements[i];
            if (element.name && !element.closest('.parte-item') && !element.closest('.veiculo-item')) {
                if (element.type === 'radio') {
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                } else if (element.type === 'checkbox') {
                    formData[element.name] = element.checked;
                } else {
                    formData[element.name] = element.value;
                }
            }
        }

        formData.partes = [];
        const partesItems = partesContainer.querySelectorAll('.parte-item');
        partesItems.forEach((parteItem) => {
            const parteId = parteItem.dataset.id;
            const parteData = {};
            parteData.id = parteId;
            parteData.tipo = parteItem.querySelector(`input[name="parte${parteId}Tipo"]:checked`)?.value || '';
            parteData.nome = parteItem.querySelector(`[name="parte${parteId}Nome"]`)?.value || '';
            parteData.nasc = parteItem.querySelector(`[name="parte${parteId}Nasc"]`)?.value || '';
            parteData.rg = parteItem.querySelector(`[name="parte${parteId}RG"]`)?.value || '';
            parteData.cpf = parteItem.querySelector(`[name="parte${parteId}CPF"]`)?.value || '';
            parteData.uf = parteItem.querySelector(`[name="parte${parteId}UF"]`)?.value || '';
            parteData.sexo = parteItem.querySelector(`input[name="parte${parteId}Sexo"]:checked`)?.value || '';
            parteData.mae = parteItem.querySelector(`[name="parte${parteId}Mae"]`)?.value || '';
            parteData.pai = parteItem.querySelector(`[name="parte${parteId}Pai"]`)?.value || '';
            parteData.logradouro = parteItem.querySelector(`[name="parte${parteId}Logradouro"]`)?.value || '';
            parteData.bairro = parteItem.querySelector(`[name="parte${parteId}Bairro"]`)?.value || '';
            parteData.cidade = parteItem.querySelector(`[name="parte${parteId}Cidade"]`)?.value || '';
            parteData.natural = parteItem.querySelector(`[name="parte${parteId}Natural"]`)?.value || '';
            parteData.nacional = parteItem.querySelector(`[name="parte${parteId}Nacional"]`)?.value || '';
            formData.partes.push(parteData);
        });

        formData.veiculos = [];
        const veiculosItems = veiculosContainer.querySelectorAll('.veiculo-item');
        veiculosItems.forEach((veiculoItem) => {
            const veiculoId = veiculoItem.dataset.id;
            const veiculoData = {};
            veiculoData.id = veiculoId;
            veiculoData.placa = veiculoItem.querySelector(`[name="veiculo${veiculoId}Placa"]`)?.value || '';
            veiculoData.renavam = veiculoItem.querySelector(`[name="veiculo${veiculoId}Renavam"]`)?.value || '';
            veiculoData.proprietario = veiculoItem.querySelector(`[name="veiculo${veiculoId}Proprietario"]`)?.value || '';
            veiculoData.cnh = veiculoItem.querySelector(`[name="veiculo${veiculoId}CNH"]`)?.value || '';
            veiculoData.municipio = veiculoItem.querySelector(`[name="veiculo${veiculoId}Municipio"]`)?.value || '';
            veiculoData.uf = veiculoItem.querySelector(`[name="veiculo${veiculoId}UF"]`)?.value || '';
            
            const hasReboque = veiculoItem.querySelector(`[name="veiculo${veiculoId}HasReboque"]`)?.checked;
            veiculoData.hasReboque = hasReboque;
            if (hasReboque) {
                veiculoData.reboque = {
                    placa: veiculoItem.querySelector(`[name="veiculo${veiculoId}ReboquePlaca"]`)?.value || '',
                    chassi: veiculoItem.querySelector(`[name="veiculo${veiculoId}Chassi"]`)?.value || '',
                    marcaModelo: veiculoItem.querySelector(`[name="veiculo${veiculoId}MarcaModelo"]`)?.value || '',
                    ano: veiculoItem.querySelector(`[name="veiculo${veiculoId}Ano"]`)?.value || '',
                    categoria: veiculoItem.querySelector(`[name="veiculo${veiculoId}Categoria"]`)?.value || '',
                    cor: veiculoItem.querySelector(`[name="veiculo${veiculoId}Cor"]`)?.value || '',
                    qtdePassageiros: veiculoItem.querySelector(`[name="veiculo${veiculoId}QtdePassageiros"]`)?.value || ''
                };
            }
            formData.veiculos.push(veiculoData);
        });
        return formData;
    }

    // --- 6. FUNÇÃO PARA GERAR O PDF DO FORMULÁRIO (EXISTENTE) ---
    generatePdfBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await generatePdf();
    });

    async function generatePdf() {
        const formData = collectFormData();
        console.log("Dados do Formulário Coletados para PDF do Formulário:", formData);

        try {
            const existingPdfBytes = await fetch('TO-GCM.pdf').then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const textSize = 10;
            const textColor = rgb(0, 0, 0);

            // --- Preenchimento dos campos (COORDENADAS DO SEU FORMULÁRIO ORIGINAL) ---
            firstPage.drawText(formData.dataOcorrencia || '', { x: 90, y: 733, font, size: textSize, color: textColor });
            firstPage.drawText(formData.protocolo || '', { x: 195, y: 733, font, size: textSize, color: textColor });
            firstPage.drawText(formData.togcm || '', { x: 330, y: 733, font, size: textSize, color: textColor });
            firstPage.drawText(`${formData.folha1 || ''}`, { x: 440, y: 733, font, size: textSize, color: textColor });
            firstPage.drawText(`${formData.folha2 || ''}`, { x: 452, y: 733, font, size: textSize, color: textColor });
            firstPage.drawText(formData.bopcRdo || '', { x: 485, y: 733, font, size: textSize, color: textColor });

            firstPage.drawText(formData.horaOcorrencia || '', { x: 80, y: 680, font, size: textSize, color: textColor });
            firstPage.drawText(formData.solicitacao || '', { x: 230, y: 680, font, size: textSize, color: textColor });
            firstPage.drawText(formData.solicitante || '', { x: 140, y: 658, font, size: textSize, color: textColor });
            firstPage.drawText(formData.envolvido || '', { x: 445, y: 658, font, size: textSize, color: textColor });
            firstPage.drawText(formData.logradouroOcorrencia || '', { x: 90, y: 638, font, size: textSize, color: textColor });
            firstPage.drawText(formData.numeroOcorrencia || '', { x: 400, y: 638, font, size: textSize, color: textColor });
            firstPage.drawText(formData.bairroOcorrencia || '', { x: 480, y: 638, font, size: textSize, color: textColor });

            firstPage.drawText(formData.naturezaOcorrencia || '', { x: 100, y: 597, font, size: textSize, color: textColor });
            firstPage.drawText(formData.logradouroOcorrencia || '', { x: 100, y: 560, font, size: textSize, color: textColor });
            firstPage.drawText(formData.bairroOcorrencia || '', { x: 100, y: 578, font, size: textSize, color: textColor });
            firstPage.drawText(formData.numeroOcorrencia || '', { x: 400, y: 560, font, size: textSize, color: textColor });

            let currentParteY = 515;
            const parteSpacing = 85;

            formData.partes.forEach((parte, index) => {
                if (index >= 5) return;
                const yOffset = index * parteSpacing;
                firstPage.drawText(parte.nome || '', { x: 90, y: currentParteY - yOffset, font, size: textSize, color: textColor });
                firstPage.drawText(parte.nasc || '', { x: 90, y: currentParteY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(parte.rg || '', { x: 230, y: currentParteY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(parte.cpf || '', { x: 340, y: currentParteY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(parte.uf || '', { x: 450, y: currentParteY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(parte.sexo || '', { x: 90, y: currentParteY - yOffset - 24, font, size: textSize, color: textColor });
                firstPage.drawText(parte.mae || '', { x: 170, y: currentParteY - yOffset - 24, font, size: textSize, color: textColor });
                firstPage.drawText(parte.pai || '', { x: 380, y: currentParteY - yOffset - 24, font, size: textSize, color: textColor });
                firstPage.drawText(parte.logradouro || '', { x: 150, y: currentParteY - yOffset - 36, font, size: textSize, color: textColor });
                firstPage.drawText(parte.bairro || '', { x: 400, y: currentParteY - yOffset - 36, font, size: textSize, color: textColor });
                firstPage.drawText(parte.cidade || '', { x: 90, y: currentParteY - yOffset - 48, font, size: textSize, color: textColor });
                firstPage.drawText(parte.natural || '', { x: 250, y: currentParteY - yOffset - 48, font, size: textSize, color: textColor });
                firstPage.drawText(parte.nacional || '', { x: 420, y: currentParteY - yOffset - 48, font, size: textSize, color: textColor });
            });
            
            let currentVeiculoY = 120;
            const veiculoSpacing = 100;

            formData.veiculos.forEach((veiculo, index) => {
                if (index >= 2) return;
                const yOffset = index * veiculoSpacing;
                firstPage.drawText(veiculo.placa || '', { x: 90, y: currentVeiculoY - yOffset, font, size: textSize, color: textColor });
                firstPage.drawText(veiculo.renavam || '', { x: 230, y: currentVeiculoY - yOffset, font, size: textSize, color: textColor });
                firstPage.drawText(veiculo.proprietario || '', { x: 380, y: currentVeiculoY - yOffset, font, size: textSize, color: textColor });
                firstPage.drawText(veiculo.cnh || '', { x: 90, y: currentVeiculoY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(veiculo.municipio || '', { x: 230, y: currentVeiculoY - yOffset - 12, font, size: textSize, color: textColor });
                firstPage.drawText(veiculo.uf || '', { x: 400, y: currentVeiculoY - yOffset - 12, font, size: textSize, color: textColor });

                if (veiculo.hasReboque && veiculo.reboque) {
                    firstPage.drawText(veiculo.reboque.placa || '', { x: 90, y: currentVeiculoY - yOffset - 24, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.reboque.chassi || '', { x: 230, y: currentVeiculoY - yOffset - 24, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.reboque.marcaModelo || '', { x: 90, y: currentVeiculoY - yOffset - 36, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.reboque.ano || '', { x: 280, y: currentVeiculoY - yOffset - 36, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.reboque.categoria || '', { x: 380, y: currentVeiculoY - yOffset - 36, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.reboque.cor || '', { x: 90, y: currentVeiculoY - yOffset - 48, font, size: textSize, color: textColor });
                    firstPage.drawText(veiculo.qtdePassageiros || '', { x: 280, y: currentVeiculoY - yOffset - 48, font, size: textSize, color: textColor });
                }
            });

            const historicoText = formData.historicoOcorrencia || 'Nenhum histórico detalhado foi informado.';
            const historicoX = 50;
            let historicoY = 60;
            const historicoMaxWidth = 500;
            const historicoLineHeight = 12;

            const words = historicoText.split(' ');
            let line = '';
            let lines = [];
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                const width = font.widthOfTextAtSize(testLine, textSize);
                if (width > historicoMaxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            lines.forEach((l, i) => {
                firstPage.drawText(l, { x: historicoX, y: historicoY - (i * historicoLineHeight), font, size: textSize, color: textColor });
            });

            firstPage.drawText(formData.encarregado || '', { x: 100, y: 22, font, size: textSize, color: textColor });
            firstPage.drawText(formData.posto || '', { x: 280, y: 22, font, size: textSize, color: textColor });
            firstPage.drawText(formData.prefixoVtr || '', { x: 100, y: 10, font, size: textSize, color: textColor });
            firstPage.drawText(formData.apoioVtr || '', { x: 280, y: 10, font, size: textSize, color: textColor });
            
            const gcmsText = formData.gcmsIntegrantes || '';
            const gcmsX = 300;
            let gcmsY = 740;
            const gcmsMaxWidth = 200;
            const gcmsLineHeight = 12;

            const gcmsWords = gcmsText.split(' ');
            let gcmsLine = '';
            let gcmsLines = [];
            for (let n = 0; n < gcmsWords.length; n++) {
                let testLine = gcmsLine + gcmsWords[n] + ' ';
                const width = font.widthOfTextAtSize(testLine, textSize);
                if (width > gcmsMaxWidth && n > 0) {
                    gcmsLines.push(gcmsLine);
                    gcmsLine = gcmsWords[n] + ' ';
                } else {
                    gcmsLine = testLine;
                }
            }
            gcmsLines.push(gcmsLine);

            gcmsLines.forEach((l, i) => {
                firstPage.drawText(l, { x: gcmsX, y: gcmsY - (i * gcmsLineHeight), font, size: textSize, color: textColor });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'TO_GCM_Preenchido.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('PDF do Formulário gerado com sucesso! Lembre-se que você precisará ajustar as coordenadas no script.js para que as informações se alinhem perfeitamente no seu formulário PDF.');

        } catch (error) {
            console.error('Erro ao gerar o PDF do Formulário:', error);
            alert('Ocorreu um erro ao gerar o PDF do Formulário. Por favor, verifique se o arquivo "TO-GCM.pdf" está na mesma pasta do seu projeto e se há alguma mensagem de erro no console do navegador.');
        }
    }

    // --- HELPER PARA QUEBRA DE LINHA (WORD WRAP) ---
    // Esta função lida com quebras de linha existentes e quebra palavras para caber na largura
    const wrapText = (text, font, fontSize, maxWidth) => {
        const paragraphs = text.split(/\r?\n/); // Divide por quebras de linha existentes
        let allWrappedLines = [];

        for (const paragraph of paragraphs) {
            const words = paragraph.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
                const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (textWidth <= maxWidth) {
                    currentLine = testLine;
                } else {
                    allWrappedLines.push(currentLine);
                    currentLine = word;
                }
            }
            allWrappedLines.push(currentLine); // Adiciona a última linha do parágrafo
        }

        // Filtra linhas vazias resultantes de múltiplas quebras de linha ou palavras vazias
        // E remove espaços extras no início/fim das linhas
        return allWrappedLines.map(line => line.trim()).filter(line => line !== '');
    };

    // --- 7. NOVA FUNÇÃO PARA GERAR O RELATÓRIO LIMPO ---
    generateCleanPdfBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await generateCleanPdf();
    });

    async function generateCleanPdf() {
        const formData = collectFormData(); // Reutiliza a coleta de dados
        console.log("Dados do Formulário Coletados para Relatório Limpo:", formData);

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman); // Fonte padrão para o relatório limpo
        const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold); // Fonte negrito

        const { width, height } = page.getSize();
        const margin = 50; // Margem padrão
        const cardPadding = 15; // Espaçamento interno dos cards
        const cardMarginBottom = 15; // Espaço entre os cards
        const cardBgColor = rgb(0.95, 0.95, 0.95); // Cor de fundo dos cards (cinza claro)
        const sectionTitleColor = rgb(0.1, 0.1, 0.4); // Cor do título da seção (azul escuro)

        let currentY = height - margin; // Posição Y inicial (do topo da página, descendo)
        const lineHeight = 12; // Espaçamento básico entre linhas de texto
        const fieldIndent = 20; // Recuo para os campos dentro das seções
        const textFontSize = 10; // Tamanho da fonte para o texto normal
        const titleFontSize = 12; // Tamanho da fonte para títulos de seção

        // Função auxiliar para adicionar texto e controlar quebra de página
        // Retorna a nova posição Y após desenhar o texto
        const addText = (text, x, yPos, options = {}) => {
            page.drawText(text, { 
                x, 
                y: yPos, 
                font: options.font || font, 
                size: options.size || textFontSize, 
                color: options.color || rgb(0, 0, 0),
                // align: options.align || 'left', // Removido para usar cálculo manual de X para centralização
            });
            return yPos - (options.size || textFontSize) * 1.2; // Avança Y baseado no tamanho da fonte + um pouco de espaçamento
        };

        // Função para centralizar texto na página
        const getCenteredX = (text, fontRef, size, pageWidthRef) => {
            const textWidth = fontRef.widthOfTextAtSize(text, size);
            return (pageWidthRef - textWidth) / 2;
        };

        // Função para desenhar o cabeçalho do relatório limpo (sempre na primeira página de cada página)
        const drawCleanPdfHeader = (currentPageRef, pageWidthRef, pageHeightRef, marginRef, boldFontRef, regularFontRef) => {
            // "SECRETARIA MUNICIPAL DE SEGURANÇA PÚBLICA E DEFESA CIVIL"
            let headerText1 = 'SECRETARIA MUNICIPAL DE SEGURANÇA PÚBLICA E DEFESA CIVIL';
            let headerSize1 = 14;
            let headerX1 = getCenteredX(headerText1, boldFontRef, headerSize1, pageWidthRef);
            currentPageRef.drawText(headerText1, {
                x: headerX1,
                y: pageHeightRef - marginRef,
                font: boldFontRef,
                size: headerSize1,
                color: sectionTitleColor,
            });

            // "Guarda Civil Municipal de Limeira"
            let headerText2 = 'Guarda Civil Municipal de Limeira';
            let headerSize2 = 12;
            let headerX2 = getCenteredX(headerText2, regularFontRef, headerSize2, pageWidthRef);
            currentPageRef.drawText(headerText2, {
                x: headerX2,
                y: pageHeightRef - marginRef - 18,
                font: regularFontRef,
                size: headerSize2,
                color: sectionTitleColor,
            });

            currentPageRef.drawLine({
                start: { x: marginRef, y: pageHeightRef - marginRef - 35 },
                end: { x: pageWidthRef - marginRef, y: pageHeightRef - marginRef - 35 },
                thickness: 1,
                color: rgb(0.5, 0.5, 0.5),
            });
            
            // "RELATÓRIO DE OCORRÊNCIA" - Centralizado
            let reportTitle = 'RELATÓRIO DE OCORRÊNCIA';
            let reportTitleSize = 18;
            let reportTitleX = getCenteredX(reportTitle, boldFontRef, reportTitleSize, pageWidthRef);
            currentPageRef.drawText(reportTitle, {
                x: reportTitleX,
                y: pageHeightRef - marginRef - 60,
                font: boldFontRef,
                size: reportTitleSize,
                color: rgb(0, 0, 0),
            });
        };

        // Função para verificar e adicionar nova página se necessário
        // Calcula se o espaço necessário para a próxima seção cabe na página atual
        const checkPageBreak = (requiredHeightForNextSection) => {
            if (currentY - requiredHeightForNextSection < margin) {
                page = pdfDoc.addPage();
                currentY = height - margin; // Reinicia Y no topo da nova página
                drawCleanPdfHeader(page, width, height, margin, boldFont, font);
                currentY -= (lineHeight * 6); // Ajusta Y após o cabeçalho da nova página
                return true;
            }
            return false;
        };

        // NOVO: Função para desenhar uma seção como um "card"
        // Retorna a nova posição Y após o card
        const drawSectionAsCard = (title, contentLines, estimatedContentLinesCount) => {
            // Calcular altura aproximada do conteúdo do card
            const estimatedContentHeight = (estimatedContentLinesCount * lineHeight) + (contentLines.length * (lineHeight * 0.2)); // Mais preciso para estimar altura
            const cardHeight = estimatedContentHeight + (cardPadding * 2) + titleFontSize * 1.5; // Título da seção + padding

            // Verificar quebra de página antes de desenhar o card
            checkPageBreak(cardHeight + cardMarginBottom); // Considera a altura do card + margem inferior

            // Desenhar o fundo do card
            const cardRectX = margin;
            const cardRectY = currentY - cardHeight;
            const cardRectWidth = width - (2 * margin);

            page.drawRectangle({
                x: cardRectX,
                y: cardRectY,
                width: cardRectWidth,
                height: cardHeight,
                color: cardBgColor,
                borderColor: rgb(0.8, 0.8, 0.8), // Borda sutil
                borderWidth: 0.5,
            });

            // Adicionar o título da seção dentro do card
            currentY -= cardPadding; // Padding do topo do card
            currentY = addText(title, margin + cardPadding, currentY, { font: boldFont, size: titleFontSize, color: sectionTitleColor });
            currentY -= (lineHeight * 0.5); // Espaço após o título

            // Adicionar o conteúdo da seção
            for (const line of contentLines) {
                currentY = addText(line, margin + cardPadding + fieldIndent, currentY);
            }

            currentY -= cardPadding; // Padding da base do card
            currentY -= cardMarginBottom; // Espaço entre cards
            return currentY; // Retorna a nova posição Y
        };


        drawCleanPdfHeader(page, width, height, margin, boldFont, font);
        currentY -= (lineHeight * 6); // Ajusta Y após o cabeçalho inicial

        // --- Seção: Identificação da Ocorrência ---
        let section1Content = [
            `Data: ${formData.dataOcorrencia || 'N/A'}`,
            `Protocolo: ${formData.protocolo || 'N/A'}`,
            `T.O.GCM: ${formData.togcm || 'N/A'}`,
            `BOPC/RDO: ${formData.bopcRdo || 'N/A'}`,
            `Folha: ${formData.folha1 || 'N/A'}/${formData.folha2 || 'N/A'}`
        ];
        currentY = drawSectionAsCard('Identificação da Ocorrência', section1Content, section1Content.length);

        // --- Seção: Comunicação da Ocorrência ---
        let section2Content = [
            `Hora: ${formData.horaOcorrencia || 'N/A'}`,
            `Solicitação: ${formData.solicitacao || 'N/A'}`,
            `Solicitante: ${formData.solicitante || 'N/A'}`,
            `Envolvido: ${formData.envolvido || 'N/A'}`,
            `Endereço da Ocorrência: ${formData.logradouroOcorrencia || 'N/A'}, Nº ${formData.numeroOcorrencia || 'N/A'}`,
            `Bairro da Ocorrência: ${formData.bairroOcorrencia || 'N/A'}`
        ];
        currentY = drawSectionAsCard('Comunicação da Ocorrência', section2Content, section2Content.length);

        // --- Seção: Natureza da Ocorrência ---
        let section3Content = [`Natureza: ${formData.naturezaOcorrencia || 'N/A'}`];
        currentY = drawSectionAsCard('Natureza da Ocorrência', section3Content, section3Content.length);

        // --- Seção: Partes Envolvidas ---
        if (formData.partes && formData.partes.length > 0) {
            let sectionPartesContent = [];
            for (const parte of formData.partes) {
                sectionPartesContent.push(`Parte ${parte.id} (${parte.tipo || 'N/A'}):`);
                sectionPartesContent.push(`  Nome: ${parte.nome || 'N/A'}`);
                sectionPartesContent.push(`  Nasc: ${parte.nasc || 'N/A'} | RG: ${parte.rg || 'N/A'} | CPF: ${parte.cpf || 'N/A'} | UF: ${parte.uf || 'N/A'}`);
                sectionPartesContent.push(`  Sexo: ${parte.sexo || 'N/A'} | Mãe: ${parte.mae || 'N/A'} | Pai: ${parte.pai || 'N/A'}`);
                sectionPartesContent.push(`  Endereço: ${parte.logradouro || 'N/A'} | Bairro: ${parte.bairro || 'N/A'}`);
                sectionPartesContent.push(`  Cidade: ${parte.cidade || 'N/A'} | Natural: ${parte.natural || 'N/A'} | Nacional: ${parte.nacional || 'N/A'}`);
                sectionPartesContent.push(''); // Linha vazia para espaçamento
            }
            currentY = drawSectionAsCard('Partes Envolvidas', sectionPartesContent, formData.partes.length * 7); // Estimar linhas por parte
        }

        // --- Seção: Veículos Envolvidos ---
        if (formData.veiculos && formData.veiculos.length > 0) {
            let sectionVeiculosContent = [];
            for (const veiculo of formData.veiculos) {
                sectionVeiculosContent.push(`Veículo ${veiculo.id}:`);
                sectionVeiculosContent.push(`  Placa: ${veiculo.placa || 'N/A'} | Renavam: ${veiculo.renavam || 'N/A'}`);
                sectionVeiculosContent.push(`  Proprietário: ${veiculo.proprietario || 'N/A'} | CNH: ${veiculo.cnh || 'N/A'}`);
                sectionVeiculosContent.push(`  Município: ${veiculo.municipio || 'N/A'} | UF: ${veiculo.uf || 'N/A'}`);

                if (veiculo.hasReboque && veiculo.reboque) {
                    sectionVeiculosContent.push(`  Detalhes do Reboque:`);
                    sectionVeiculosContent.push(`    Placa Reboque: ${veiculo.reboque.placa || 'N/A'} | Chassi: ${veiculo.reboque.chassi || 'N/A'}`);
                    sectionVeiculosContent.push(`    Marca/Modelo: ${veiculo.reboque.marcaModelo || 'N/A'} | Ano: ${veiculo.reboque.ano || 'N/A'}`);
                    sectionVeiculosContent.push(`    Categoria: ${veiculo.reboque.categoria || 'N/A'} | Cor: ${veiculo.reboque.cor || 'N/A'}`);
                    sectionVeiculosContent.push(`    Qtde Passageiros: ${veiculo.reboque.qtdePassageiros || 'N/A'}`);
                }
                sectionVeiculosContent.push(''); // Linha vazia para espaçamento
            }
            currentY = drawSectionAsCard('Veículos Envolvidos', sectionVeiculosContent, formData.veiculos.length * (veiculos.hasReboque ? 10 : 6)); // Estimar linhas
        }

        // --- Seção: Histórico da Ocorrência ---
        const historicoText = formData.historicoOcorrencia || 'Nenhum histórico detalhado foi informado.';
        const historicoLines = wrapText(historicoText, font, textFontSize, width - (2 * margin) - (2 * cardPadding) - (2 * fieldIndent));
        currentY = drawSectionAsCard('Histórico da Ocorrência', historicoLines, historicoLines.length);

        // --- Seção: Composição ---
        let sectionComposicaoContent = [
            `Encarregado: ${formData.encarregado || 'N/A'} | Posto: ${formData.posto || 'N/A'}`,
            `Prefixo VTR: ${formData.prefixoVtr || 'N/A'} | Apoio VTR: ${formData.apoioVtr || 'N/A'}`,
            '', // Linha vazia para separar
            'GCMS (integrantes da viatura):'
        ];
        const gcmsText = formData.gcmsIntegrantes || 'N/A';
        const gcmsLines = wrapText(gcmsText, font, textFontSize, width - (2 * margin) - (2 * cardPadding) - (2 * fieldIndent));
        sectionComposicaoContent = sectionComposicaoContent.concat(gcmsLines.map(line => `  ${line}`)); // Adiciona GCMS com recuo
        
        currentY = drawSectionAsCard('Composição', sectionComposicaoContent, sectionComposicaoContent.length);

        // --- Assinaturas (Centralizadas) ---
        // Verificar quebra de página antes das assinaturas
        checkPageBreak(lineHeight * 6); // Espaço para 3 assinaturas

        currentY -= cardMarginBottom * 2; // Espaço antes das assinaturas

        const sigLine = '______________________________________';
        const sigLineSize = 10;

        let sigX = getCenteredX(sigLine, font, sigLineSize, width);
        currentY = addText(sigLine, sigX, currentY, { font: font, size: sigLineSize });
        sigX = getCenteredX('ASSINATURA', font, sigLineSize, width);
        currentY = addText('ASSINATURA', sigX, currentY, { font: font, size: sigLineSize });
        currentY -= lineHeight;

        sigX = getCenteredX(sigLine, font, sigLineSize, width);
        currentY = addText(sigLine, sigX, currentY, { font: font, size: sigLineSize });
        sigX = getCenteredX('SUPERVISOR GERAL', font, sigLineSize, width);
        currentY = addText('SUPERVISOR GERAL', sigX, currentY, { font: font, size: sigLineSize });
        currentY -= lineHeight;

        sigX = getCenteredX(sigLine, font, sigLineSize, width);
        currentY = addText(sigLine, sigX, currentY, { font: font, size: sigLineSize });
        sigX = getCenteredX('DIRETOR OPERACIONAL', font, sigLineSize, width);
        currentY = addText('DIRETOR OPERACIONAL', sigX, currentY, { font: font, size: sigLineSize });

        // Salva o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Relatorio_GCM_Limpo.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Relatório Limpo gerado com sucesso!');
    }
});