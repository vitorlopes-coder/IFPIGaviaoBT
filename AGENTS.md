# Arquitetura Frontend: MVVM no React

Este projeto adota o padrão **MVVM (Model-View-ViewModel)** adaptado para React, garantindo desacoplamento estrito entre renderização de interface e regras de negócio/estado.

---

## 1. Princípios e Responsabilidades

### 🔹 Model (Domínio e Dados)
Camada responsável pelos dados e fontes de integração externas.
- **Entidades:** Tipos, interfaces TypeScript e regras de validação puras do domínio.
- **Data Sources:** Clientes de API, storage local ou SDKs externos (ex: Supabase, fetch, axios).
- **Services:** Casos de uso e orquestração de chamadas assíncronas aos Data Sources. Não possuem conhecimento de componentes de UI.

### 🔹 View (`.tsx` / Render)
Camada estritamente declarativa e burra (*presentational*).
- **Responsabilidade única:** Renderizar o layout baseado no estado recebido da ViewModel e disparar eventos.
- **Regra de Ouro:** A View **NÃO possui lógica de negócio**, chamadas de API ou manipulação direta de regras de domínio.
- **Comunicação:** Usa **Actions** para notificar a ViewModel sobre interações do usuário (ex: cliques, submissão de formulário).

### 🔹 ViewModel (Custom Hook / Estado e Ações)
O elo intermediário entre a View e a Model. No React, é implementada preferencialmente como um **Custom Hook** (ex: `useUserViewModel`).
- **Controlar Estado (`State`):** Mantém e gerencia o estado observável consumido pela View (ex: `loading`, `data`, `error`).
- **Ações (`Actions`):** Expõe funções de callback disparadas pela View para orquestrar fluxos de negócio através dos Services/Models.
- **Roteamento / Navegação:** Gerencia efeitos colaterais de navegação e redirecionamento de rotas com base no resultado das ações.
- **Elo de Ligação:** Converte dados do Model em formato pronto para consumo visual pela View.

---

## 2. Fluxo Unidirecional de Dados

```text
[ Usuário ]
    │
    ▼ (interação)
[  View (.tsx)  ] ─── (1. dispara Action) ───► [ ViewModel (Hook) ]
        ▲                                          │            ▲
        │                               (2. chama) │            │ (3. retorna dados)
        │                                          ▼            │
        │                                      [     Model     ]
        │                               (Entidades / Services / DataSources)
        │
        └──────── (4. consome State atualizado) ───┘
```


1. O usuário interage com a **View**.
2. A **View** dispara uma **Action** exposta pela **ViewModel**.
3. A **ViewModel** executa a lógica, aciona os **Services/Data Sources** da camada **Model** e decide regras (incluindo roteamento se aplicável).
4. A **ViewModel** atualiza o **State**.
5. A **View** reage à mudança de estado e renderiza a interface atualizada.

---

## 3. Padrão Estrutural de Pastas (Exemplo por Feature)

```text
feature-name/
├── model/
│   ├── types.ts          # Entidades e interfaces
│   ├── dataSource.ts     # Integrações externas/APIs
│   └── service.ts        # Regras de negócio da feature
├── view/
│   └── FeatureView.tsx   # Componente .tsx (somente render e eventos)
├── viewModel/
│   └── useFeatureVM.ts   # Custom Hook (State, Actions, Roteamento)
└── index.ts              # Ponto de entrada conectando View + ViewModel
```

---

## 4. Diretrizes de Implementação para o Agente IA

Ao gerar ou refatorar código neste projeto:
1. **Nunca insira lógica assíncrona ou chamadas de API dentro de arquivos `.tsx` da View.**
2. Sempre extraia o estado, efeitos colaterais e funções de manipulação para o hook `use[Nome]ViewModel`.
3. A ViewModel deve retornar obrigatoriamente:
   - Objeto `state` (ou propriedades de estado legíveis pela UI).
   - Objeto `actions` (funções de gatilho para o usuário).
4. Mantenha os serviços do Model puros e desacoplados do ciclo de vida dos componentes React.
