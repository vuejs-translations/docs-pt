---
outline: deep
---

# Guia de Estilo {#style-guide}

:::warning AVISO DO ESTADO
O guia de estilo está atualmente um pouco desatualizado. A maioria dos exemplos estão apenas na API de Opções, e não existem quaisquer regras relativamente a `<script setup>` e a API de Composição. Nós estamos a planear melhorá-lo no futuro.
:::

Este é o guia de estilo oficial para o código específico de Vue. Se usas a Vue num projeto, é uma grande referência para evitar erros, ciclismo, e anti-padrões. No entanto, não acreditamos que qualquer guia de estilo seja ideal para todas as equipas ou projetos, então desvios cuidadosos são encorajados baseados na experiência passada, a pilha tecnológica circundante, e valores pessoais.

Geralmente, também evitamos sugestões sobre JavaScript ou HTML em geral. Nós não importamos-nos se usas pontos e vírgulas ou vírgulas finais. Nós não importamos-nos se o teu HTML usa aspas simples ou aspas duplas para valores de atributo. No entanto, algumas exceções existirão, onde encontramos este padrão em particular é útil no contexto da Vue.

Finalmente, separamos as regras em quatro categorias:

## Categorias de Regra {#rule-categories}

### Prioridade A: Essencial (Prevenção de Erro) {#priority-a-essential-error-prevention}

Estas regras ajudam prevenir os erros, assim aprenda e acate-os a todo custo. As exceções podem existir, mas devem ser muito raro e apenas ser feitos por aqueles com conhecimento especialista de ambas JavaScript e Vue.

- [Consulte todas as regras de prioridade A](./rules-essential)

### Prioridade B: Fortemente Recomendado {#priority-b-strongly-recommended}

Estas regras tem sido encontradas para melhorar legibilidade ou experiência de programação na maioria dos projetos. O teu código continuarão a executar se violá-los, mas violações devem ser raras e bem justificados.

- [Consulte todas as regras de prioridade B](./rules-strongly-recommended)

### Prioridade C: Recomendado {#priority-c-recommended}

Onde vários, opções igualmente boas existem, uma escolha arbitrária pode ser feita para garantir consistência. Nestas regras, descrevemos cada opção de aceitação e sugerimos uma escolha padrão. Isto significa que podes sentires-te livre para fazer uma escolha diferente na tua própria base de código, enquanto fores consistente e teres uma boa razão. Mesmo assim por favor tenha uma boa razão! Ao adaptar ao padrão da comunidade, tu:

1. Treinarás o teu cérebro para analisar facilmente a maior parte do código da comunidade que encontras.
2. Serás capaz de copiar e colar a maior parte dos exemplos de código da comunidade sem modificação.
3. Frequentemente encontrarás novos contratos que já estão acostumados ao teu estilo de codificação preferido, pelo menos no que diz respeito a Vue.

- [Consulte todas as regras de prioridade C](./rules-recommended)

### Prioridade D: Use com Cautela {#priority-d-use-with-caution}

Algumas funcionalidades da Vue existem para acomodar casos extremos raros ou suavizar as migrações duma base de código legada. Quando usado em excesso, podem tornar o teu código mais difícil de manter ou mesmo tornar-se uma fonte de erros de programação. Estas regras fazem brilhar um luz sobre funcionalidades potencialmente arriscadas, descrevendo quando e o porquê deveriam ser evitadas.

- [Consulte todas as regras de prioridade D](./rules-use-with-caution)
