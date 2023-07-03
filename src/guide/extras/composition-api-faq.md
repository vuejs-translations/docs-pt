---
outline: deep
---

# Questões Frequentes sobre API de Composição {#composition-api-faq}

:::tip DICA
Esta seção de questões frequentes presume experiência prévia com a Vue - em particular, experiência com a Vue 2 ainda que primariamente usando a API de Opções.
:::

## O Que é a API de Composição? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Aula Gratuita Sobre a API de Composição"/>

A API de Composição é um conjunto de APIs que permitem-nos escrever componentes de Vue usando funções importadas ao invés de declarar opções. É um termo abrangente que cobre as seguintes APIs:

- [API de Reatividade](/api/reactivity-core), por exemplo, `ref()` e `reactive()`, que permite-nos criar diretamente estado reativo, estado computado, e observadores.

- [Gatilhos do Ciclo de Vida](/api/composition-api-lifecycle), por exemplo, `onMounted()` e `onUnmounted()`, que permitem-nos ligar programaticamente no ciclo de vida do componente.

- [Injeção de Dependência](/api/composition-api-dependency-injection), por exemplo, `provide()` e `inject()`, que permitem-nos influenciar o sistema de injeção de dependência da Vue ainda que usando as APIs de Reatividade.

A API de Composição é uma funcionalidade embutida da Vue 3 e [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Para versões mais antigas da Vue 2, use a extensão [`@vue/composition-api`](https://github.com/vuejs/composition-api) mantida oficialmente. Na Vue 3, é também primariamente usada juntamente com a sintaxe de [`<script setup>`](/api/sfc-script-setup) nos Componentes de Ficheiro Único. Cá está um exemplo básico de um componente usando a API de Composição:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// estado reativo
const count = ref(0)

// funções que alteram o estado e acionam atualizações
function increment() {
  count.value++
}

// gatilhos do ciclo de vida
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

Apesar de um estilo de API baseado na composição de função, **API de Composição NÃO é programação funcional**. A API de Composição é baseada no mutável paradigma de reatividade finamente ajustado da Vue, ao passo que a programação funcional enfatiza a imutabilidade.

Se estiveres interessado em aprender como usar a Vue com a API de Composição, podes definir a preferência de API da documentação toda para API de Composição usando interruptor no cimo da barra lateral esquerda, e depois rever o guia desde o início.

## Porquê API de Composição {#why-composition-api}

### Melhor Reutilização da Lógica {#better-logic-reuse}

A primeira vantagem da API de Composição é que possibilita clara, eficiente reutilização da lógica na forma de [funções de Composição](/guide/reusability/composables). Isto soluciona [todas as desvantagens das misturas](/guide/reusability/composables#vs-mixins), o mecanismo primário de reutilização de lógica para API de Opções.

A capacidade de reutilização de lógica da API de Composição tem dado origem a impressionantes projetos de comunidade tais como [VueUse](https://vueuse.org/), uma coleção em constante crescimento de utilitários de funções de composição. Ela também serve como um mecanismo claro para integrar facilmente serviços ou bibliotecas de terceiros com estado no sistema de reatividade da Vue, por exemplo [dados imutáveis](/guide/extras/reactivity-in-depth#immutable-data), [máquinas de estado](/guide/extras/reactivity-in-depth#state-machines), e [RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Organização de Código Mais Flexível {#more-flexible-code-organization}

Muitos utilizadores amam que escrevamos código organizados por padrão com API de Opções: tudo tem o seu lugar baseado na opção em que se insere. No entanto, a API de Opções coloca sérias limitações quando a lógica de um único componente cresce além de um certo limiar de complexidade. Esta limitação é particularmente proeminente nos componentes que precisam de lidar com vários **interesses lógicos**, o que temos testemunhado em primeira mão em muitas aplicações de Vue 2 de produção.

Tome o componente explorador de pasta da interface de utilizador gráfico da interface da linha de comando da Vue como um exemplo: este componente é responsável pelos seguintes interesses lógicos:

- Rastrear o estado da pasta atual e exibir o seu conteúdo
- Lidar com a navegação da pasta (abrir, fechar, atualizar...)
- Lidar com a criação de uma nova pasta
- Alternar para mostrar apenas as pastas favoritas
- Alternar para mostrar as pastas ocultas
- Lidar com as mudanças do diretório de trabalho atual

A [versão original](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) do componente foi escrita na API de Opções. Se dermos para cada linha de código uma cor baseada no interesse lógico com qual lida, isto é como se pareceria:

<img alt="componente de pasta antes" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Repara como o código lidando com o mesmo interesse lógico é forçado a ser separado sob diferentes opções, localizado em diferentes partes do ficheiro. Num componente com várias centenas de linhas, entender e navegar um único interesse lógico exige deslocar-se constantemente para cima e para baixo no ficheiro, tornando-o muito mais difícil do que deveria ser. Além disto, se alguma vez tencionamos extrair um interesse lógico para um utilitário reutilizável, daria um pouco mais de trabalho encontrar e extrair os pedaços de código corretos de diferentes partes do ficheiro.

Cá está o mesmo componente, antes e depois de ser [refeito com a API de Composição](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e):

![componente de pasta depois](./images/composition-api-after.png)

Repara como o código relacionado ao mesmo interesse lógico pode agora ser agrupado junto: não precisamos mais de saltar entre blocos de opções diferentes enquanto trabalhamos num interesse lógico específico. Ainda por cima, agora podemos mover um grupo de código para um ficheiro externo com mínimo esforço, já que não precisamos mais de remexer o código à volta para extraí-los. Esta fricção reduzida para refazer é chave para sustentabilidade de longo prazo em bases de código grandes.

### Melhor Inferência de Tipo {#better-type-inference}

Nos anos recentes, mais e mais programadores de frontend estão a adotar a [TypeScript](https://www.typescriptlang.org/) visto que ajuda-nos a escrever código mais robusto, fazer mudanças com mais confiança, e fornece uma excelente experiência de desenvolvimento com suporte de IDE. No entanto, a API de Opções, concebida originalmente em 2013, foi desenhada sem inferência de tipo em mente. Nós tínhamos que implementar alguma [ginástica de tipo absurdamente complexa](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165) para fazer inferência de tipo funcionar com a API de Opções. Mesmo com todo este esforço, a inferência de tipo para API de Opções pode continuar a avariar para injeção de misturas e dependência.

Isto tinha conduzido muitos programadores que queriam usar a Vue com a TypeScript a inclinarem-se para API de Classe alimentada pela `vue-class-component`. No entanto, uma API baseada em Classe depende profundamente de decoradores de ECMAScript, uma funcionalidade de linguagem que era apenas uma proposta de estágio 2 quando a Vue 3 começou a ser desenvolvida em 2019. Nós sentimos que era muito arriscado basear uma API oficial numa proposta instável. Desde então, o proposta de decoradores passou por uma outra revisão completa, e finalmente chegou aos estágio 3 em 2022. Além disto, API baseada em classe sofre de limitações de reutilização de lógica e organização parecidos com os da API de Opções.

Em comparação, a API de Composição utiliza na maior parte das vezes variáveis e funções simples, que são naturalmente amigáveis a tipo. O código escrita na API de Composição pode desfrutar da inferência de tipo completa com pouca necessidade para sugestões de tipo manual. A maior parte das vezes, o código da API de Composição parecerão em grade parte idênticas na TypeScript e JavaScript simples. Isto também torna possível para utilizadores de JavaScript simples beneficiarem-se da inferência de tipo parcial.

### Pacote de Produção Mais Pequeno e Menos Despesas Gerais {#smaller-production-bundle-and-less-overhead}

O código escrito na API de Composição e `<script setup>` é também mais eficiente e amigável a minificação do que o equivalente da API de Opções. Isto porque o modelo de marcação num componente de `<script setup>` é compilado como uma função embutida no mesmo âmbito do código de `<script setup>`. Ao contrário do acesso de propriedade de `this`, o código do modelo de marcação compilado pode acessar diretamente as variáveis declaradas dentro de `<script setup>`, sem uma delegação de instância no meio. Isto também conduz para melhor minificação porque todas os nomes de variável podem ser abreviados com segurança.

## Relação com a API de Opções {#relationship-with-options-api}

### Compromissos {#trade-offs}

Alguns utilizadores saindo da API de Opções acharam o seu código de API de Composição menos organizado, e concluíram que a API de Composição é "pior" em termos de organização de código. Nós recomendamos que os utilizadores com tais opiniões a olhar naquele problema a partir duma perspetiva diferente.

É verdade que a API de Composição não mais fornece as "barreiras de proteção" que orientam-te a colocar o teu código nos seus respetivos baldes. Em troca, começas a escrever o código do componente como escreverias JavaScript normal. Isto significa que **podes e deves aplicar quaisquer boas práticas de organização de código ao código da tua API de Composição como farias quando escreves JavaScript normal**. Se podes escrever código de JavaScript bem-organizado, deves também ser capaz de escrever código de API de Composição bem-organizado.

A API de Opções permite-te "pensar menos" quando escreves o código do componente, daí o porquê muitos utilizadores amá-la. No entanto, na redução de custos mental, também fecha-te num padrão de organização de código pré-escrito sem escotilha de fuga, o que tornar difícil refatorar ou melhorar a qualidade do código em projetos de grande porte. Nesta consideração, a API de Composição fornece melhor escalabilidade a longo prazo.

### A API de Composição sobre todos casos de uso? {#does-composition-api-cover-all-use-cases}

Sim em termos de lógica com estado. Quando usas a API de Composição, existem apenas algumas opções que podem ainda ser necessárias: `props`, `emits`, `name`, e `inheritAttrs`. Se usas `<script setup>`, então `inheritAttrs` é normalmente a única opção que pode exigir um bloco normal de `<script>` separado.

Se tencionas usar a exclusivamente a API de Composição (juntamente com as opções listadas acima), podes rapar alguns kbs do teu pacote de produção através duma [opção de tempo de compilação](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) que reduz o código relacionado a API de Opções da Vue. Nota que isto também afeta os componentes de Vue nas tuas dependências.

### Posso usar ambas APIs juntas? {#can-i-use-both-apis-together}

Sim. Tu podes usar a API de Composição através da opção [`setup()`](/api/composition-api-setup) num componente de API dde Opções.

No entanto, apenas recomendados fazer isto se tiveres uma base de código de API de Opções existente que precisa integrar com funcionalidades novas ou bibliotecas externas escritas com a API de Composição.

### A API de Opções será depreciada? {#will-options-api-be-deprecated}

Não, não temos qualquer plano de o fazer. A API de Opções é uma parte integral da Vue e a razão de muitos programadores a amar. Nós também apercebemos-nos de que muitos dos benefícios da API de Composição apenas manifestam-se em projetos de grande porte, e a API de Opções continua a ser uma escolha sólida para muitos cenários baixa ou média complexidade.

## Relação com a API de Classe {#relationship-with-class-api}

Nós não recomendamos mais usar a API de Classe com a Vue 3, dado que a API de Composição fornece uma excelente integração de TypeScript com benefícios de reutilização de lógica e organização de código adicionais.

## Comparação com os Gatilhos de React {#comparison-with-react-hooks}

A API de Composição fornece o mesmo nível de capacidades de composição lógica que os Gatilhos de React, mas com algumas diferenças importantes.

Os Gatilhos de React são invocados repetidamente toda vez que um componente for atualizado. Isto cria um número de advertências que podem confundir até mesmo programadores de React experientes. Também conduz a problemas de otimização do desempenho que podem severamente afetar a experiência de programação. Cá estão alguns exemplos:

- Os gatilhos são sensíveis a ordem de chamada e não podem ser condicionais.

- As variáveis declaradas num componente de React pode ser capturada por um encerramento de gatilho e tornar-se "ultrapassada" se o programador falhar em passar o arranjo de dependências correto. Isto leva os programadores de React a dependerem de regras de ESLint para garantir que as dependências corretas são passadas. No entanto, a regra não é muitas vezes inteligente o suficiente e sobrecompensa por exatidão, o que conduz a invalidação desnecessária e dores de cabeça quando casos extremos são encontrados.

- Cálculos dispendiosos exigem o uso de `useMemo`, o que novamente exige passar manualmente o arranjo de dependência correto.

- Os manipuladores de evento passados para os componentes filho causam atualizações filho desnecessárias por padrão, e exigem `useCallback` explícito como uma otimização. Isto é quase sempre necessário, e novamente exige um arranjo de dependências correto. Negligenciar isto conduz ao desenho excessivo de aplicações por padrão por padrão e pode causar problemas de desempenho sem aperceber-se disto.

- O problema de encerramento ultrapassado, combinado com funcionalidades simultâneas, torna difícil racionalizar sobre quando um pedaço de código do gatilho é executado, e torna o trabalho com estado mutável que deveria persistir através das interpretações (através de `useRef`) desconfortável.

Em comparação, a API de Composição da Vue:

- Invoca o código do `setup()` ou `<script setup>` apenas uma vez. Isto faz o código alinhar-se melhor com as intuições de uso da JavaScript idiomática visto que não existem fechos ultrapassados para preocupar-se. As chamadas da API de Composição também não são sensíveis a ordem de chamada e podem ser condicionais.

- O sistema de reatividade do executor da Vue reuni as dependências reativas usadas nas propriedades computadas e observadores, assim não existe necessidade de manualmente declarar as dependências.

- Não precisa de manualmente fazer o armazenamento de consulta imediata de funções de resposta para evitar atualizações filho desnecessárias. Em geral, o sistema de reatividade finamente ajustado da Vue garante que os componentes filho apenas atualizem quando precisarem. As otimizações da atualização de filho são raramente uma preocupação para os programadores de Vue.

Nós reconhecemos a criatividade dos Gatilhos de React, e é uma das principais fonte de inspiração para a API de Composição. No entanto, os problemas mencionados acima existem no desenho e notamos que o modelo de reatividade da Vue acontece para fornecer um caminho à volta deles.
