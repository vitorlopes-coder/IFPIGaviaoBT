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