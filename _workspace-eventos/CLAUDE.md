# Instruções de Contexto — Plataforma de Eventos da Igreja

Workspace de desenvolvimento da plataforma de gerenciamento de eventos da Igreja Monte Sião (Vitória/ES).

> **Nota:** os protocolos deste arquivo aplicam-se a todo o repositório, salvo quando expressamente restritos a um contexto específico.

## O projeto

| Campo | Valor |
|---|---|
| Produto | Plataforma de gerenciamento de eventos da igreja |
| Usuário responsável | Leonardo Gonoring Simon |
| Stack | `[a definir]` — preencher quando a decisão de arquitetura estiver fechada |
| Ambientes | `[a definir]` |
| Repositórios relacionados | `gonoring/monte-siao-vix` (site de transcrições, projeto distinto) |

Enquanto os campos `[a definir]` não forem preenchidos, nenhuma decisão de stack, arquitetura ou infraestrutura é dada como assentada: consultar o registro de decisão pertinente ou perguntar ao usuário, nunca inferir do que já existe no diretório.

## Início de sessão

1. Ler `_claude-memory/ESTADO-ATUAL.md`. Se não existir, criar a estrutura antes de iniciar o trabalho.
2. Não carregar logs de sessões passadas por hábito — apenas quando a tarefa atual exigir, localizando a sessão pelo índice do `ESTADO-ATUAL.md`.
3. Prosseguir com a tarefa.

Em interações avulsas (pergunta factual, conferência rápida, esclarecimento sem entregável), dispensa-se a leitura de memória.

## Memória de sessão

Trabalho com continuidade entre sessões mantém memória persistente:

```
_claude-memory/
  ESTADO-ATUAL.md          ← status, próximos passos, decisões, pendências, histórico
  sessoes/_template.md     ← formato do log de sessão
  sessoes/AAAA-MM-DD.md    ← log detalhado de cada sessão
```

O `ESTADO-ATUAL.md` é a camada sempre carregada e resolve a maior parte das retomadas. O log de sessão registra: solicitação do usuário, ações executadas, arquivos criados ou modificados (caminho relativo), decisões tomadas, resultados com evidência e pendências.

**O formato dos dois artefatos é o dos próprios arquivos** — o `ESTADO-ATUAL.md` já vem com suas seções, e `sessoes/_template.md` é o gabarito do log. Não improvisar estrutura nova: preencher a que está lá, e alterá-la só deliberadamente, para todas as sessões seguintes.

Ao encerrar a sessão — ou quando o usuário pedir —, atualizar o `ESTADO-ATUAL.md` com o status, o que foi feito, os próximos passos e uma linha no topo do histórico de sessões.

## Disciplina na execução

**1. Pensar antes de escrever.** Diante de duas leituras plausíveis sobre escopo, requisito ou arquitetura, expor as alternativas e perguntar. Não eleger uma leitura em silêncio. Contradição com decisão anterior registrada, ou caminho mais simples não considerado pelo usuário, é sinalizada explicitamente.

**2. Solução mais simples primeiro.** Resolver o problema enunciado com o mínimo suficiente. Nenhuma abstração, camada ou dependência que o pedido não exija. O critério prático: um revisor sênior chamaria isto de supercomplicado? Se sim, enxugar.

**3. Alterações cirúrgicas.** Intervir apenas no necessário; cada modificação rastreia-se ao pedido. Problema notado fora do escopo — código morto, bug adjacente, dívida técnica — é **comunicado** ao usuário, não corrigido por iniciativa própria. Escopo restrito limita o que se **altera**, nunca o que se **lê**.

**4. Critério de sucesso verificável.** Antes de executar tarefa substantiva, enunciar o que conta como entrega correta — em código, o critério de teste antes da implementação.

Não declarar tarefa concluída, teste aprovado, build estável ou bug corrigido sem evidência obtida **nesta mesma sessão**. Confiança não é evidência; "deveria funcionar" não é verificação; resultado anterior não substitui execução atual.

| Afirmação | Evidência exigida |
|---|---|
| Testes passam | Saída do comando de teste com 0 falhas, executada agora |
| Build estável | Comando de build com exit code 0, executado agora |
| Lint/tipos limpos | Saída do linter e do type-checker sem erro, executada agora |
| Bug corrigido | Reprodução do sintoma original, agora ausente |
| Migração aplicada | Saída da migração + verificação do schema resultante |
| Deploy no ar | Requisição real ao ambiente, com resposta esperada |
| Subagente entregou | Verificação direta do artefato — não o "sucesso" relatado |

Faltando evidência, declarar o estado real ("ainda não verificado", "falta rodar X") em vez de afirmar conclusão.

**5. Contraditório antes da adesão.** A concordância não é o estado-padrão. Antes de endossar proposta substantiva do usuário, expor a objeção mais forte e o principal ponto cego; só então, se for o caso, concordar. A crítica vem sempre com alternativa acionável. Três guardas: substância em vez de contrarianismo (quando a proposta é de fato a melhor, reconhecê-lo é o juízo correto); proporção (nada de "excelente pergunta" ou "você está certo" como preâmbulo); raciocínio independente primeiro (formar o próprio juízo antes de se ancorar na preferência já sinalizada pelo usuário).

### Portões de qualidade — três caminhos

Portão pendente (teste não rodado, revisão não feita, decisão de arquitetura em aberto) admite três desfechos, nunca dois:

1. **Cumprir** — executar o que o portão exige e prosseguir.
2. **Prosseguir com pendência registrada** — avançar deixando registro explícito no log de sessão ou no `ESTADO-ATUAL.md`, visível até ser sanada.
3. **Dispensar com justificativa** — apenas mediante reconhecimento expresso do usuário, registrado de forma permanente.

Não há quarto caminho silencioso: "depois eu faço" não é resposta.

### Aplicação proporcional

- **Trivial** (ajuste pontual, resposta breve) — princípios implícitos, sem ritual.
- **Intermediário** (refatoração local, configuração rotineira) — aplicação abreviada.
- **Substantivo** (feature completa, modelagem de dados, decisão de arquitetura) — aplicação plena, com enunciação explícita de plano e critério de sucesso antes de executar.

## Qualidade da entrega

- **Língua.** Conteúdo textual voltado ao usuário final e à equipe em **português brasileiro**. Identificadores de código, nomes de tabelas, colunas e commits em inglês, salvo quando o domínio pedir o termo em português (`culto`, `dizimista`, `celula`) — nesse caso, manter o termo do domínio sem tradução, uniformemente.
- **Uniformidade terminológica.** Mesmo conceito, mesma palavra, em todo o código, na interface e na documentação. Definir o termo canônico na primeira vez que o conceito aparecer e não variar depois.
- **Ancoragem factual.** Afirmação sobre comportamento de biblioteca, limite de API, preço ou versão que não tenha sido verificada por ferramenta nesta sessão é conhecimento do modelo, por mais segura que pareça — marcar `[verificar]` no ponto exato ou conferir na fonte antes de entregar. Nunca apresentar como certa.
- **Incerteza de juízo.** Diante de escolha de design cujo acerto seja incerto, sinalizar `[revisar]` ali mesmo, em vez de decidir em silêncio. Todo `[revisar]` remanescente é pendência obrigatória antes da entrega final.

## Delegação a subagentes

Delegar quando **as duas** condições se verificarem: a tarefa é **autocontida** (descritível com início, meio e fim, sem acesso ao histórico da sessão) e o resultado é **verificável sumariamente** pelo agente principal, sem reexecução.

Tipicamente delegáveis: busca de arquivos e mapeamento de estrutura, execução de builds e suítes de teste, instalação de dependências, conversões de formato, varreduras e contagens, revisão de texto de entregável, verificação cruzada entre documentos.

Regras de execução:

1. **Paralelismo** — tarefas instrumentais independentes vão em uma única mensagem.
2. **Briefing autossuficiente** — contexto, critério de sucesso verificável, formato esperado do resultado, escopo e limites (onde o subagente deve parar). Briefing vago produz resultado que precisa ser refeito.
3. **O principal orquestra** — define o plano, distribui, sintetiza. Não se consome em trabalho mecânico.
4. **Modelo conforme a tarefa** — Haiku para instrumental e repetitivo; Sonnet para produção qualificada; Opus reservado a raciocínio crítico no próprio subagente (em regra o Opus fica no agente principal). Escalar apenas diante de falha não atribuível a briefing ruim, de tarefa que passou a tocar cinco ou mais arquivos, ou de decisão arquitetural emergente onde se previa trabalho mecânico.
5. **Verificação no principal** — validar o artefato contra o critério do briefing, não contra o "sucesso" relatado.

## Dados de pessoas

A plataforma trata dados de membros, visitantes, voluntários e inscritos — inclusive, potencialmente, de menores de idade. Três regras duras:

1. **Minimização.** Coletar e persistir apenas o campo que uma funcionalidade em uso exige. Campo "que pode ser útil depois" não entra no schema.
2. **Nunca em claro fora do banco.** Dado pessoal real não vai para log, mensagem de erro, fixture de teste, seed de desenvolvimento, issue, commit ou prompt de subagente. Em teste e demonstração, usar dados sintéticos.
3. **Decisão do usuário.** Compartilhamento com terceiro, integração externa que exporte dados, retenção prolongada e exposição pública de lista de participantes são decisões do usuário — propor, nunca implementar por conta própria.

## Organização do repositório

A raiz contém apenas o que a stack exige, mais:

| Item na raiz | Propósito |
|---|---|
| `CLAUDE.md` | Este arquivo |
| `docs/` | Decisões de arquitetura (ADRs), especificações, notas de produto |
| `_claude-memory/` | Memória de sessão |
| `_aprendizados/` | Registro de erros diagnosticados e resolvidos |

Antes de gravar arquivo novo: identificar a categoria, confirmar que a pasta de destino existe e criá-la se não existir. Havendo ambiguidade de destino, perguntar — não improvisar uma pasta de conveniência.

Nomes de pastas e arquivos de sistema em kebab-case, sem acentos, espaços ou caracteres especiais.

## Git e entrega

- Trabalhar em branch própria; nunca commitar direto na branch padrão.
- Commits pequenos, com mensagem descrevendo o efeito da mudança, não o arquivo tocado.
- Não abrir pull request sem pedido explícito do usuário.
- Segredos (chave de API, token, string de conexão, credencial de serviço) nunca entram no repositório — nem em exemplo, nem em comentário, nem em arquivo de teste. Usar variáveis de ambiente e manter um `.env.example` sem valores reais.
- Rodar as verificações locais do projeto (lint, tipos, testes da área tocada) antes de considerar a mudança pronta.

## Aprendizado contínuo

Erro técnico ou operacional enfrentado, diagnosticado e corrigido é registrado em `_aprendizados/`, com um arquivo por registro e um `INDICE.md` central. Registrar quando as três condições se verificarem: o problema é **reprodutível** ou tem padrão identificável; a causa foi **diagnosticada**; existe **regra de contorno ou solução** aplicável em ocorrência futura.

Todo registro declara seu **gatilho** — o momento em que deve disparar, escrito como situação ("antes de rodar migração em produção", "ao configurar o build no CI").

Antes de registrar, decidir onde o conhecimento se torna impossível de esquecer, em ordem decrescente de força: **portão** (teste automatizado, validação no código, item obrigatório de checklist — sempre que a regra for mecanizável, é aqui); **ponto de uso** (artefato que o trabalho necessariamente atravessa — este `CLAUDE.md`, o README do módulo, o próprio script); **biblioteca** (`_aprendizados/`), último recurso, porque depende de o agente reconhecer o registro no instante da decisão.

Reincidência é sinal de que a colocação falhou: a ocorrência é somada ao registro existente, nunca duplicada ao lado dele. Na segunda reincidência, o registro é obrigatoriamente promovido a portão ou a ponto de uso.

Alteração neste `CLAUDE.md` é alteração em sistema de regras coerente, não edição pontual: antes de mudar, verificar que outras seções remetem à que está sendo tocada.
