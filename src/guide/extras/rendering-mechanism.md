---
outline: deep
---

# Mecanismo de Interpretação {#rendering-mechanism}

Como é que a Vue pega um modelo de marcação e transforma-o em nós de DOM reais? Como é que a Vue atualiza estes nós de DOM de maneira efetiva? Nós tentaremos lançar alguma luz sobre estas questões nesta seção mergulhando para dentro do mecanismo interno de interpretação da Vue.

## DOM Virtual {#virtual-dom}

Tu provavelmente tens ouvido o termo "DOM virtual" ou "virtual DOM", que é sobre o qual o sistema de interpretação da Vue é baseado.

O DOM virtual é um conceito de programação onde uma representação ideal, ou “virtual” de uma Interface de Utilizador é mantida em memória e sincronizada com o DOM “real”. O conceito foi explorado pela [React](https://reactjs.org/), e tem sido adaptado em muitas outras abstrações com diferentes implementações, incluindo a Vue.

O DOM virtual é mais um padrão do que uma tecnologia específica, assim não existe uma implementação canónica. Nós podemos ilustrar a ideia usando um exemplo simples:

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* mais vnodes */
  ]
}
```

Aqui, o `vnode` é um objeto simples de JavaScript (um "nó virtual") representando um elemento `<div>`. Ele contém todas as informações que precisamos para criar o elemento verdadeiro. Ele também contém `vnodes` filhos, o que o torna a raiz de uma árvore de DOM virtual.

Um interpretador de tempo de execução pode percorrer uma árvore de DOM virtual e construir um árvore de DOM real a partir dela. Este processo é chamado de **montagem**.

Se tiveres duas copias de árvores de DOM virtual, o interpretador também pode percorrer e comparar as duas árvores descobrindo as diferenças, e aplicar estas mudanças ao DOM real. Este processo é chamado de **remendo**, também conhecido como "diferenciação" ou "reconciliação".

O principal benefício do DOM virtual é que dá ao programador a habilidade de criar, inspecionar e compor programaticamente as estruturas de Interface de Utilizador desejadas de uma maneira declarativa, enquanto deixa a manipulação direta do DOM por conta do interpretador.

## Conduta de Interpretação {#render-pipeline}

Em alto nível, isto é o que acontece quando um componente de Vue é montado:

1. **Compilação**: Os modelos de marcação de Vue são compilado em **funções de interpretação**: funções que retornam árvores de DOM virtual. Esta etapa pode ser feita ou antecipadamente através de uma etapa de construção, ou durante o despacho usando o compilador do tempo de execução.

2. **Montagem**: O interpretador do momento da execução invoca as funções de interpretação, percorre a árvore de DOM virtual retorna e cria os nós de DOM real baseado nela. Esta etapa é realizada como [efeito reativo](./reactivity-in-depth), assim preserva todos as dependências reativas que foram usadas.

3. **Remendo**: Quando uma dependência usada durante a montagem mudar, o efeito é executado novamente. Desta vez, uma nova, árvore de DOM virtual atualizada é criada. O interpretador do momento da execução percorre a nova árvore, compara-a com a antiga, e aplica as atualizações necessárias ao DOM real.

![conduta de interpretação](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## Modelos de Marcação vs. Funções de Interpretação {#templates-vs-render-functions}

Os modelos de marcação são compilados para as funções de interpretação do DOM virtual. A Vue também fornece APIs que permitem-nos ignorar a etapa de compilação do modelo de marcação e escrever diretamente as funções de interpretação. As funções de interpretação são mais flexíveis do que os modelos de marcação quando lidamos com lógica altamente dinâmica, porque podes trabalhar com `vnodes` usando o poder máximo da JavaScript.

Então porquê que a Vue recomenda os modelos de marcação por padrão? Existem um número de razões:

1. Os modelos de marcação estão mais próximo do HTML real. Isto torna-o muito mais fácil de reutilizar trechos de HTML existentes, aplicar boas práticas de acessibilidade, estilizar com a CSS, e para os desenhadores entenderem e modificarem.

2. Os modelos de marcação são muito mais fáceis de analisar estaticamente devido a sua sintaxe mais determinística. Isto permite o compilador de modelo de marcação da Vue aplicar muitas otimizações no momento da compilação para melhorar o desempenho do DOM virtual (o qual discutiremos abaixo).

Na prática, os modelos de marcação são suficientes para maioria dos casos de uso nas aplicações. As funções de interpretação são normalmente apenas usadas em componentes reutilizáveis que precisam de lidar com lógica de apresentação altamente dinâmica. O uso da função de interpretação é discutido em mais detalhes na seção [Funções de Interpretação & JSX](./render-function).

## DOM Virtual Informado Pelo Compilador {#compiler-informed-virtual-dom}

A implementação do DOM virtual em React e a maioria das outras implementações do DOM virtual são puramente de tempo de execução: o algoritmo de reconciliação não pode fazer quaisquer suposições sobre a futura árvore do DOM virtual, assim tem de atravessar completamente a árvore e diferenciar as propriedades de cada `vnode` para assegurar correção. Além disto, mesmo se uma parte da árvore nunca mudar, os novos `vnodes` sempre serão criados para eles em cada re-interpretação, resultando em pressão de memória desnecessária. Isto é, um dos aspetos mais criticados do DOM virtual: o um tanto de processo de reconciliação de força bruta sacrifica a eficiência em troca da declaritividade e correção.

Mas isto não tem de ser desta maneira. Na Vue, a abstração controla tanto o compilador quanto o tempo de execução. Isto permite-nos implementar várias otimizações em tempo de compilação que apenas um interpretador emparelhado com firmeza pode tirar partido. O compilador pode analisar estaticamente o modelo de marcação e deixar sugestões no código gerado para que o tempo de execução possa pegar atalhos sempre que possível. Ao mesmo tempo, continuamos a preserver a capacidade do utilizador de largar para a camada da função de interpretação para controlo mais direto em casos extremos. Nós chamamos disto abordagem híbrida **DOM Virtual Informado Pelo Compilador**.

Abaixo, discutiremos algumas das otimizações principais feitas pelo compilador de modelo de marcação da Vue para melhorar o desempenho de tempo de execução do DOM virtual.

### Içamento Estático {#static-hoisting}

Muito frequentemente existirão partes num modelo de marcação que não contém quaisquer vínculos dinâmicos:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- içado -->
  <div>bar</div> <!-- içado -->
  <div>{{ dynamic }}</div>
</div>
```

[Inspecionar no Explorador de Modelo de Marcação](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PlxuICA8ZGl2PmJhcjwvZGl2PlxuICA8ZGl2Pnt7IGR5bmFtaWMgfX08L2Rpdj5cbjwvZGl2PiIsInNzciI6ZmFsc2UsIm9wdGlvbnMiOnsiaG9pc3RTdGF0aWMiOnRydWV9fQ==)

Os divisores `foo` e `bar` são estáticos - a recriação de `vnodes` e a diferenciação deles em cada reinterpretação é desnecessária. O compilador da Vue iça automaticamente as chamadas de criação de seus `vnode` fora da função de interpretação, e reutiliza os mesmos `vnodes` em toda interpretação. O interpretador também é capaz de ignorar complemente a diferenciação deles quando notar que o antigo `vnode` e o novo `vnode` o mesmo.

Além disto, quando existirem elementos estáticos consecutivos suficientes, serão condensados em um único "`vnode` estático" que contém a sequência de caracteres de HTML simples para todos estes nós ([Exemplo](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). Estes `vnodes` estáticos são montados definindo `innerHTML` diretamente. Eles também armazenam os seus nós de DOM correspondentes para consulta imediata na montagem inicial - se o pedaço de conteúdo for reutilizado noutro lado na aplicação, novos nós de DOM são criados usando `cloneNode()` nativo, o qual é extremamente eficiente.

### Opções de Remendo {#patch-flags}

Para um único elemento com vínculos dinâmicos, também podemos inferir muita informação a partir deste em tempo de compilação:

```vue-html
<!-- apenas vinculação de classe -->
<div :class="{ active }"></div>

<!-- apenas vínculos de identificador e valor -->
<input :id="id" :value="value">

<!-- apenas filhos de texto -->
<div>{{ dynamic }}</div>
```

[Inspecionar no Explorador de Modelo de Marcação](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

Quando estiveres a gerar o código da função de interpretação para estes elementos, a Vue codifica o tipo de atualização que cada uma delas precisa diretamente na chamada de criação de `vnode`:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

O último argumento, `2`, é uma [opção de remendo](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts). Um elemento pode ter várias opções de remendo, as quais serão combinadas em um único número. O interpretador de tempo de execução pode então verificar contra as opções usando [operações de bitwise](https://en.wikipedia.org/wiki/Bitwise_operation) para determinar se precisa de fazer certo trabalho:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // atualiza a classe do elemento
}
```

As verificações de bitwise são extremamente rápida. Com as opções de remendo, a Vue é capaz de fazer a quantidade mínima de trabalho necessário quando estiveres a atualizar os elementos com vínculos dinâmicos.

A Vue também codifica o tipo de filhos que um `vnode` tem. Por exemplo, um modelo de marcação que tem vários nós de raiz é representado como um fragmento. Na maioria dos casos, sabemos com certeza que a ordem destes nós de raiz nunca mudarão, assim esta informação também pode ser fornecida para o executor como opção de remendo:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

O executor pode assim ignorar complemente a reconciliação de ordem do filho para o fragmento de raiz.

### Aplainamento de Árvore {#tree-flattening}

Dando uma outra vista de olhos no código gerado pelo exemplo anterior, notarás que a raiz da árvore de DOM virtual retornada é criada usando uma chamada especial de `createElementBlock()`:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Conceitualmente, um "bloco" é uma parte do modelo de marcação que tem estrutura interna estável. Neste caso, modelo de marcação inteiro tem um único bloco porque não contém quaisquer diretivas estruturais como `v-if` e `v-for`.

Cada bloco rastreia quaisquer nós descendente (não apenas filhos diretos) que têm opções de remendo. Por exemplo:

```vue-html{3,5}
<div> <!-- bloco de raiz -->
  <div>...</div>         <!-- não rastreado -->
  <div :id="id"></div>   <!-- rastreado -->
  <div>                  <!-- não rastreado-->
    <div>{{ bar }}</div> <!-- rastreado -->
  </div>
</div>
```

O resultado é um arranjo aplanado que contém apenas os nós descendentes dinâmicos:

```
div (raiz do bloco)
- div com vínculo de :id
- div com vínculo de {{ bar }}
```

Quando este componente precisa de re-apresentar, apenas precisa de atravessar a árvore aplanada ao invés da árvore completa. Isto é chamado de **Aplainamento de Árvore**, e reduz grandemente o número de nós que precisa ser atravessado durante a reconciliação do DOM virtual. Quaisquer partes estáticas do modelo de marcação são efetivamente ignoradas.

As diretivas `v-if` e `v-for` criarão novos nós de bloco:

```vue-html
<div> <!-- bloco de raiz -->
  <div>
    <div v-if> <!-- bloco if -->
      ...
    <div>
  </div>
</div>
```

Um bloco filho é rastreado dentro do arranjo de descendentes dinâmicos do bloco pai. Isto conserva uma estrutura estável para o bloco pai.

### Impacto na Hidratação de SSR {#impact-on-ssr-hydration}

Tanto as opções de remendo quanto o aplainamento de árvore também melhoram grandemente o desempenho da [Hidratação de SSR](/guide/scaling-up/ssr#client-hydration) da Vue:

- A hidratação de um único elemento pode pegar caminhos rápidos baseado na opção de remendo do `vnode` correspondente.

- Apenas nós de bloco e seus descendentes dinâmicos precisam de ser atravessados durante a hidratação, alcançando efetivamente a hidratação parcial no nível do modelo de marcação.
