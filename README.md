# Beleza em Dia

Protótipo web responsivo do MVP de gestão para uma profissional de maquiagem.

## Fluxo principal

1. Painel inicial
2. Novo agendamento
3. Resultado de sucesso ou conflito de horário

## Tecnologias

- HTML5
- CSS3
- JavaScript puro

## Como executar

Você pode abrir `index.html` diretamente no navegador.

Para testar com um servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Recursos implementados

- Layout mobile-first e responsivo
- Dashboard com próximos atendimentos
- Formulário de novo agendamento
- Validação de campos obrigatórios
- Cálculo automático do horário final conforme o serviço
- Detecção de conflito de horário
- Resultado com mensagem de sucesso ou erro
- Registro demonstrativo de pagamento
- Cadastro rápido demonstrativo de cliente
- Estados informados por texto + símbolo + cor
- Áreas de toque adequadas e foco visível
- Sem dependências externas

## Observação

Este projeto é um protótipo front-end. Os dados ficam apenas em memória durante a execução e não substituem a implementação posterior em Java/Spring Boot + PostgreSQL definida na arquitetura acadêmica do MVP.
