/**
 * respostasmetrica — backend do Gerador de Respostas (Planilha Google + Apps Script).
 *
 * Abas (criadas automaticamente):
 *   Registros: Data/Hora | Data | Hora | Sistema | Resposta | Atendente | Chave | ID | Texto
 *              (uma linha por uso; "Texto" só é preenchido em respostas com campos, com as senhas escondidas)
 *   Notas:     Nome | Texto | Atualizado em (ms)
 *
 * Publicação: feita com clasp a partir da pasta apps-script (clasp push + clasp update-deployment).
 * Ao alterar pelo editor: Implantar > Gerenciar implantações > Editar > "Nova versão" (mantém a URL).
 *
 * API:
 *   POST [registros...]                          -> grava usos
 *   POST {acao:'nota', nome, texto, ts}          -> salva o bloco de notas da pessoa
 *   GET  ?acao=resumo&dias=90[&nome=]            -> totais por sistema/resposta + contadores
 *   GET  ?acao=itens&chave=sys|mod&dias=90[&nome=] -> respostas do grupo, agrupadas por texto igual
 *   GET  ?acao=buscar&q=texto&dias=90[&nome=]    -> busca nas respostas
 *   GET  ?acao=nota&nome=                        -> bloco de notas da pessoa
 */

const SHEET_NAME = 'Registros';
const HEADERS = ['Data/Hora', 'Data', 'Hora', 'Sistema', 'Resposta', 'Atendente', 'Chave', 'ID', 'Texto'];
const NOTES_SHEET = 'Notas';
const NOTES_HEADERS = ['Nome', 'Texto', 'Atualizado em'];
const MAX_ITENS = 150;      // máximo de itens devolvidos por grupo/busca
const MAX_TEXTO = 5000;     // tamanho máximo do texto de uma resposta
const MAX_NOTA = 49000;     // limite de uma célula do Sheets é 50.000 caracteres
const DAY_MS = 24 * 60 * 60 * 1000;

// Execute UMA vez no editor para autorizar o script e criar as abas
function configurar() {
  getSheet_();
  getNotesSheet_();
  Logger.log('Pronto! Abas configuradas.');
}

// Apaga TODOS os registros do histórico (mantém o cabeçalho). Executar manualmente no editor.
function limparRegistros() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last >= 2) sh.deleteRows(2, last - 1);
  Logger.log('Registros apagados: ' + Math.max(0, last - 1));
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  } else if (sh.getLastColumn() < HEADERS.length) {
    // planilhas antigas: adiciona a coluna "Texto"
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  return sh;
}

function getNotesSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NOTES_SHEET);
  if (!sh) {
    sh = ss.insertSheet(NOTES_SHEET);
    sh.appendRow(NOTES_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, NOTES_HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function clean_(v, max) {
  return String(v == null ? '' : v).replace(/^[=+\-@]/, "'").slice(0, max || 120);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ============================== ESCRITA ============================== */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data && !Array.isArray(data) && data.acao === 'nota') return json_(salvarNota_(data));
    return json_(gravarRegistros_(Array.isArray(data) ? data : [data]));
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function gravarRegistros_(items) {
  items = items.slice(0, 2000);
  const sh = getSheet_();
  const tz = Session.getScriptTimeZone();

  // Evita duplicar registros reenviados (compara com os IDs mais recentes)
  const last = sh.getLastRow();
  const start = Math.max(2, last - 3000);
  const existing = new Set(
    last >= 2 ? sh.getRange(start, 8, last - start + 1, 1).getValues().map(r => String(r[0])) : []
  );

  const rows = [];
  items.forEach(it => {
    const id = clean_(it.id, 40);
    if (!id || existing.has(id)) return;
    existing.add(id);
    const d = new Date(it.ts);
    const when = isNaN(d) ? new Date() : d;
    rows.push([
      when,
      Utilities.formatDate(when, tz, 'dd/MM/yyyy'),
      Utilities.formatDate(when, tz, 'HH:mm:ss'),
      clean_(it.sistema, 40),
      clean_(it.resposta, 80),
      clean_(it.atendente, 60),
      clean_(it.chave, 80),
      id,
      clean_(it.texto, MAX_TEXTO)
    ]);
  });

  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
  return { ok: true, gravados: rows.length };
}

function salvarNota_(d) {
  const nome = clean_(d.nome, 60);
  if (!nome) return { ok: false, erro: 'nome vazio' };
  const ts = Number(d.ts) || Date.now();
  const texto = String(d.texto == null ? '' : d.texto).slice(0, MAX_NOTA);
  const sh = getNotesSheet_();
  const last = sh.getLastRow();
  const nomes = last >= 2 ? sh.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0])) : [];
  const idx = nomes.indexOf(nome);
  if (idx >= 0) {
    const row = idx + 2;
    const atual = Number(sh.getRange(row, 3).getValue()) || 0;
    if (ts < atual) return { ok: true, ignorado: true }; // já existe versão mais nova
    sh.getRange(row, 2, 1, 2).setValues([[texto, ts]]);
  } else {
    sh.appendRow([nome, texto, ts]);
  }
  return { ok: true };
}

/* ============================== LEITURA ============================== */

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    switch (p.acao) {
      case 'nota': return json_(lerNota_(p.nome));
      case 'itens': return json_(itens_(p));
      case 'buscar': return json_(buscar_(p));
      case 'resumo':
      default: return json_(resumo_(p));
    }
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  }
}

function lerNota_(nome) {
  nome = clean_(nome, 60);
  const sh = getNotesSheet_();
  const last = sh.getLastRow();
  if (!nome || last < 2) return { ok: true, texto: '', ts: 0 };
  const values = sh.getRange(2, 1, last - 1, 3).getValues();
  const row = values.find(r => String(r[0]) === nome);
  return row ? { ok: true, texto: String(row[1]), ts: Number(row[2]) || 0 } : { ok: true, texto: '', ts: 0 };
}

// Lê os registros dos últimos N dias (as linhas são gravadas em ordem cronológica)
function lerRegistros_(dias, nome) {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const corte = Date.now() - Math.min(Math.max(Number(dias) || 90, 1), 3650) * DAY_MS;

  // Busca binária pela primeira linha dentro do período
  const datas = sh.getRange(2, 1, last - 1, 1).getValues();
  let lo = 0, hi = datas.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const t = datas[mid][0] instanceof Date ? datas[mid][0].getTime() : 0;
    if (t < corte) lo = mid + 1; else hi = mid;
  }
  if (lo >= datas.length) return [];

  const values = sh.getRange(lo + 2, 1, datas.length - lo, HEADERS.length).getValues();
  const out = [];
  values.forEach(r => {
    const ts = r[0] instanceof Date ? r[0].getTime() : 0;
    if (ts < corte) return;
    if (nome && String(r[5]) !== nome) return;
    out.push({ ts, sistema: String(r[3]), resposta: String(r[4]), atendente: String(r[5]), chave: String(r[6]), texto: String(r[8] || '') });
  });
  return out;
}

function resumo_(p) {
  const regs = lerRegistros_(p.dias, p.nome);
  const tz = Session.getScriptTimeZone();
  const hoje = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const now = Date.now();
  const stats = { hoje: 0, d7: 0, d30: 0, d90: 0 };
  const grupos = {};
  regs.forEach(r => {
    if (Utilities.formatDate(new Date(r.ts), tz, 'yyyy-MM-dd') === hoje) stats.hoje++;
    if (now - r.ts < 7 * DAY_MS) stats.d7++;
    if (now - r.ts < 30 * DAY_MS) stats.d30++;
    if (now - r.ts < 90 * DAY_MS) stats.d90++;
    const g = grupos[r.chave] || (grupos[r.chave] = { chave: r.chave, sistema: r.sistema, resposta: r.resposta, total: 0, ultimo: 0 });
    g.total++;
    if (r.ts > g.ultimo) { g.ultimo = r.ts; g.resposta = r.resposta; }
  });
  return { ok: true, stats, grupos: Object.values(grupos).sort((a, b) => b.ultimo - a.ultimo) };
}

// Junta usos com o mesmo texto: devolve uma linha por texto, com quantas vezes foi usado
function agrupar_(regs) {
  const map = {};
  regs.forEach(r => {
    const k = r.chave + '\u0001' + r.texto;
    const g = map[k] || (map[k] = { chave: r.chave, sistema: r.sistema, resposta: r.resposta, texto: r.texto, vezes: 0, ultimo: 0, atendentes: {} });
    g.vezes++;
    if (r.ts > g.ultimo) g.ultimo = r.ts;
    g.atendentes[r.atendente] = (g.atendentes[r.atendente] || 0) + 1;
  });
  return Object.values(map).sort((a, b) => b.ultimo - a.ultimo);
}

function itens_(p) {
  const regs = lerRegistros_(p.dias, p.nome).filter(r => r.chave === p.chave);
  const itens = agrupar_(regs);
  return { ok: true, total: itens.length, itens: itens.slice(0, MAX_ITENS) };
}

function normalizar_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function buscar_(p) {
  const termos = normalizar_(p.q).split(/\s+/).filter(Boolean);
  if (!termos.length) return { ok: true, total: 0, itens: [] };
  const regs = lerRegistros_(p.dias, p.nome).filter(r => {
    const alvo = normalizar_([r.texto, r.sistema, r.resposta, r.atendente].join(' '));
    return termos.every(t => alvo.indexOf(t) >= 0);
  });
  const itens = agrupar_(regs);
  return { ok: true, total: itens.length, itens: itens.slice(0, MAX_ITENS) };
}
