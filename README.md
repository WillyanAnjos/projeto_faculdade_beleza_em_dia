# Beleza em Dia — MVP

Aplicação web estática em HTML, CSS e JavaScript para gestão simplificada de uma profissional de maquiagem.

## Fluxos implementados
- Painel com indicadores e próximos atendimentos
- Agenda com filtro por data e status
- Cadastro e busca de clientes
- Cadastro e listagem de serviços
- Novo agendamento
- Validação de conflito de horários
- Tela de resultado do agendamento
- Registro de pagamento
- Painel de pagamentos
- Persistência local com localStorage
- Acessibilidade: alto contraste, tamanho de fonte, foco visível e redução de animações
- Layout responsivo para celular e desktop
- Testes automatizados das regras centrais

## Como executar
Como o projeto usa módulos ES, abra por um servidor HTTP simples.

### Python
```bash
python3 -m http.server 8080
```

Depois abra:
```text
http://localhost:8080
```

### Node
Se tiver um servidor estático:
```bash
npx serve .
```

## Testes
```bash
npm test
```

Cobertura:
```bash
npm run coverage
```

## Observação
Esta versão usa `localStorage` para persistência. O backend Java/Spring Boot/PostgreSQL continua como evolução futura prevista na arquitetura acadêmica.
