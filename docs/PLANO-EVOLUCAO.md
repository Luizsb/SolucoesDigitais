# Plano de evolução — Portfólio de Soluções Digitais

Documento **vivo** dentro do repositório: reflete o estado do produto e do processo de governança. A versão narrativa e de apresentação continua no ficheiro Word/PDF da raiz (`1. Plano de Evolução - Portfólio de Soluções Digitais.*`); **sincroniza** os marcos importantes entre os dois quando houver mudança de fase ou de critério.

**Última revisão deste ficheiro:** 2026-05-14  

---

## Como manter este plano atualizado (fluxo acordado)

1. **Depois de entregas que mudem fase ou critérios** (ex.: novo destino de dados, fim de piloto): editar este ficheiro no mesmo PR ou no PR seguinte, atualizando a secção **Estado atual** e a data no topo.
2. **Descrição para o PR:** incluir uma linha do tipo `docs: atualiza PLANO-EVOLUCAO — Fase X` quando só houver mudança documental.
3. **Palavras longas ou stakeholders:** atualizar também o `.docx` / PDF de arquivo quando precisarem do documento formal; aqui ficam o **truth operacional** e o roadmap técnico resumido.
4. **Revisão periódica sugerida:** a cada **trimestre**, reler apenas **Estado atual** + meta da fase corrente; ajustar se o processo mudou.

---

## Mapeamento com o roadmap original (documento estratégico)

O arquivo Word descrevia **cinco** fases de produto (1 a 5). Para separar bem **“governança de entrada de dados”** de **“testes / validação com o time responsável”**, este repositório adopta uma fase dedicada à **validação**. A numeração abaixo **insere uma fase nova** entre a antiga 2 e 3:

| Documento estratégico (original) | Este ficheiro (repo) |
|-----------------------------------|----------------------|
| Fase 1 Base funcional | Fase 1 — igual |
| Fase 2 Governança de dados | **Fase 2 — MVP governança de entrada** (concluída; ver critérios) |
| — | **Fase 3 — Validação da base com responsáveis** *(nova)* |
| Fase 3 Adoção e descoberta | **Fase 4 — Adoção e descoberta** |
| Fase 4 Reutilização | **Fase 5 — Reutilização** |
| Fase 5 Escala | **Fase 6 — Escala** |

Assim **testes operacionais e conferência de fichas não ficam “dentro” da Fase 2**: a Fase 2 fecha o **circuito técnico e de processo de pedidos**; a Fase 3 é onde se **corre o piloto humano** (time vê soluções, valida campo a campo e dá feedback da plataforma).

---

## Estado atual

| Fase | Situação | Notas breves |
|------|----------|--------------|
| 1 Base funcional | Concluída | Planilha + catálogo + busca/filtros. |
| 2 MVP governança de entrada | **Concluída** | Campos modelo alinhados à planilha; fluxos «Nova solução» / «Sugerir atualização»; destino prioritário **Supabase** (`revisao_solicitacoes`) quando variáveis `VITE_SUPABASE_*` estão configuradas (ver `scripts/README-SUPABASE.md`). Publicação visível ao utilizador **continua** após revisão manual na planilha. |
| 3 Validação com responsáveis | **Em curso / a planear** | Rodada piloto: conferir fichas próprias, links, status, lacunas na base e feedback da UX. |

---

## Fases (detalhe)

### Fase 1 — Base funcional (concluída)

Objetivo: um único lugar para consultar soluções.

Entregas: estrutura da app, CSV da planilha, visualização, busca inicial.

---

### Fase 2 — Governança de entrada MVP (concluída)

Objetivo: **entrada estruturada** e rastreável de cadastros/atualizações, sem soltar dados directamente na planilha sem passo de revisão.

Inclui (critérios de encerramento desta fase):

- Definição de campos e leitura coerente no front (CSV + formulários).
- Fluxo dedicado para **nova solução** e **pedido de atualização**.
- Persistência dos pedidos em **Supabase** (quando configurado) ou fallback (Apps Script / Form) conforme `src/lib/revisaoSubmitMode.ts`.
- Regra de negócio explícita: **revisão humana antes de atualizar** a versão «oficial» publicada na planilha.

O que **não** faz parte obrigatória desta fase (foi sempre outro momento): correr piloto ampla com vários responsáveis a validar todas as fichas face a face ao produto — isso está na **Fase 3** abaixo.

---

### Fase 3 — Validação da base com responsáveis (piloto)

Objetivo: **quality gate** social e funcional antes de escalar divulgação.

Actividades típicas (adaptar conforme tempo do time):

- Cada responsável filtra/exporta suas soluções e confere: nome, categoria, **status**, **links** (acesso/demo/documentação), «O que é», quando usar.
- Registrar gaps: usar **Nova solução** / **Sugerir atualização** para tudo que deva entrar na fila Supabase/processos de revisão.
- Feedback curto sobre uso da plataforma (busca, clareza, formulários).

Critérios de saída sugeridos (ajustável):

- [ ] Taxa combinada das fichas revisadas pelo responsável declarado OU lista explícita de pendências entrada como pedidos.
- [ ] Registo sumarizado de feedback UX (interno/nota).

Saída desta fase autoriza comunicar resultado e passar forte energia para **Adoção e descoberta (Fase 4)**.

---

### Fase 4 — Adoção e descoberta (ex-Fase 3)

Objetivo: aumentar uso espontâneo.

Entregas: melhor texto nas fichas, casos de uso em destaque, divulgação para times, campanhas de cadastro seguro.

---

### Fase 5 — Reutilização (ex-Fase 4)

Objetivo: uso como ativo contra retrabalho.

Entregas: exemplos concretos, «quando usar» consistente nos conteúdos, histórias de reaproveitamento.

---

### Fase 6 — Escala (ex-Fase 5)

Objetivo: outros grupos da organização, governança por área, evolução contínua da plataforma.

---

## Ligações úteis no repositório

- README raiz (`README.md`) — como correr e arquitectura.
- Supabase: `scripts/README-SUPABASE.md`, `scripts/supabase-revisao.sql`.
- Modo de envio de revisões: `src/lib/revisaoSubmitMode.ts`.

---

## Changelog deste documento

| Data | Alteração |
|------|-----------|
| 2026-05-14 | Primeira inclusão em `docs/`; Fase 2 como concluída (MVP entrada); nova Fase 3 (validação com responsáveis); renumeração 4–6. |
