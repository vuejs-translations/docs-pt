# Diretivas Embutidas {#built-in-directives}

## `v-text` {#v-text}

Atualiza o conteúdo de texto do elemento.

- **Espera:** `string`

- **Detalhes**

  `v-text` funciona definindo a propriedade [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) do elemento, sobrescreverá qualquer conteúdo existente dentro do elemento. Se precisarmos de atualizar a parte da `textContent`, devemos usar as [interpolações de bigodes](/guide/essentials/template-syntax#text-interpolation).

- **Exemplo**

  ```vue-html
  <span v-text="msg"></span>
  <!-- é o mesmo que -->
  <span>{{msg}}</span>
  ```

- **Consulte também** [Sintaxe do Modelo de Marcação - Interpolação de Texto](/guide/essentials/template-syntax#text-interpolation)

## `v-html` {#v-html}

Atualiza a [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) do elemento.

- **Espera:** `string`

- **Detalhes:**

  Os conteúdos da `v-html` são inseridos como HTML simples - a sintaxe de modelo de marcação da Vue não será processada. Se estivermos a tentar compor modelos de marcação usando  `v-html`, vamos tentar repensar a solução usando componentes.

  :::warning Nota de Segurança
  Interpretar dinamicamente HTML arbitrário na nossa aplicação pode ser muito perigoso porque pode facilmente conduzir à [ataques de XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Só deveríamos usar `v-html` sobre conteúdo confiável e **nunca** sobre conteúdo fornecido pelo utilizador.
  :::

  Nos [Componentes de Ficheiro Único](/guide/scaling-up/sfc), os estilos `scoped` não serão aplicados ao conteúdo dentro de `v-html`, porque este HTML não é processado pelo compilador de modelos de marcação da Vue. Se quisermos mirar o conteúdo de `v-html` com CSS isolada, podemos usar os [módulos de CSS](./sfc-css-features#css-modules) ou elemento `<style>` adicional e global com uma estratégia de isolamento manual, como a BEM.

- **Exemplo**

  ```vue-html
  <div v-html="html"></div>
  ```

- **Consulte também** [Sintaxe do Modelo de Marcação - HTML Puro](/guide/essentials/template-syntax#raw-html)

## `v-show` {#v-show}

Alterna a visibilidade do elemento baseado na veracidade do valor da expressão.

- **Espera:** `any`

- **Detalhes**

  `v-show` funciona definindo a propriedade de CSS `display` através de estilos em linha, e tentará respeitar o valor inicial da `display` quando o elemento estiver visível. Também aciona transições quando sua condição muda.

- **Consulte também** [Interpretação Condicional - `v-show`](/guide/essentials/conditional#v-show)

## `v-if` {#v-if}

Interpreta condicionalmente um elemento ou um fragmento de modelo de marcação baseado na veracidade do valor da expressão.

- **Espera:** `any`

- **Detalhes**

  Quando um elemento de `v-if` é alternado, o elemento e suas diretivas ou componentes contidos são destruídos e construídos novamente. Se a condição inicial for falsa, então o conteúdo interno não será interpretado de todo.

  Pode ser usada no `<template>` para denotar um bloco condicional contendo apenas texto ou vários elementos.

  Esta diretiva aciona transições quando sua condição muda.

  Quando usada em conjunto, a `v-if` tem uma prioridade superior à `v-for`. Não recomendados usar estas duas diretivas ao mesmo tempo sobre um elemento — consulte o [guia de interpretação de lista](/guide/essentials/list#v-for-with-v-if) por mais detalhes.

- **Consulte também** [Interpretação Condicional - `v-if`](/guide/essentials/conditional#v-if)

## `v-else` {#v-else}

Denota um "bloco `else`" para a `v-if` ou para uma cadeia `v-if` / `v-else-if`.

- **Não espera expressões**

- **Detalhes**

  - Restrição: o anterior elemento irmão deve ter a `v-if` ou `v-else-if`.

  - Pode ser usada no `<template>` para denotar um bloco condicional contendo apenas texto ou vários elementos.

- **Exemplo**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **Consulte também** [Interpretação Condicional - `v-else`](/guide/essentials/conditional#v-else)

## `v-else-if` {#v-else-if}

Denota o "bloco `else if`" para a `v-if`. Pode ser encadeada.

- **Espera:** `any`

- **Detalhes**

  - Restrição: o anterior elemento irmão deve ter a `v-if` ou `v-else-if`.

  - Pode ser usada no `<template>` para denotar um bloco condicional contendo apenas texto ou vários elementos.

- **Exemplo**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **Consulte também** [Interpretação Condicional - `v-else-if`](/guide/essentials/conditional#v-else-if)

## `v-for` {#v-for}

Interpreta o elemento ou bloco de modelo de marcação várias vezes baseada na fonte dos dados.

- **Espera:** `Array | Object | number | string | Iterable`

- **Detalhes**

  O valor da diretiva deve usar a sintaxe especial `alias in expression` para fornecer um pseudónimo para o elemento atual a ser iterado:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativamente, também podemos especificar um pseudónimo para o índice (ou a chave se usada sobre um objeto):

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  O comportamento padrão da `v-for` tentará remendar os elementos no lugar sem movê-los. Para forçar a reordenação de elementos, devemos fornecer uma sugestão de ordenação com o atributo especial `key`:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` também pode trabalhar com valores que implementam o [Protocolo Iterável](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), incluindo os `Map` e `Set` nativos.

- **Consulte também**
  - [Interpretação de Lista](/guide/essentials/list)

## `v-on` {#v-on}

Anexa um ouvinte de evento ao elemento.

- **Atalho:** `@`

- **Espera:** `Function | Inline Statement | Object (sem argumento)`

- **Argumento:** `event` (opcional se estivermos usando a sintaxe de Objeto)

- **Modificadores**

  - `.stop` - chama `event.stopPropagation()`.
  - `.prevent` - chama `event.preventDefault()`.
  - `.capture` - adiciona ouvinte de evento no modo de captura.
  - `.self` - apenas aciona o manipulador se o evento fosse despachado a partir deste elemento.
  - `.{keyAlias}` - apenas aciona o manipulador sobre certas teclas.
  - `.once` - aciona o manipulador no máximo uma vez.
  - `.left` - apenas aciona o manipulador para os eventos de rato do botão esquerdo.
  - `.right` - apenas aciona o manipulador para os eventos de rato do botão direito.
  - `.middle` - apenas aciona o manipulador para os eventos de rato do botão do meio.
  - `.passive` - anexa um evento de DOM com `{ passive: true }`.

- **Detalhes**

  O tipo de evento é denotado pelo argumento. A expressão pode ser um nome de método, uma declaração em linha, ou omitida se existirem modificadores presentes.

  Quando usada num elemento normal, apenas ouve os [**eventos de DOM nativos**](https://developer.mozilla.org/en-US/docs/Web/Events). Quando usada num componente de elemento personalizado, ouve os **eventos personalizados** emitidos sobre este componente filho.

  Quando ouvimos os eventos de DOM nativos, o método recebe o evento nativo como único argumento. Se usarmos a declaração em linha, a declaração tem acesso à propriedade `$event` especial: `v-on:click="handle('ok', $event)"`.

  `v-on` também suporta vínculo a um objeto de pares de evento / ouvinte sem um argumento. Nota que quando usamos a sintaxe de objeto, esta não suporta quaisquer modificadores.

- **Exemplo**

  ```vue-html
  <!-- manipulador de método -->
  <button v-on:click="doThis"></button>

  <!-- evento dinâmico -->
  <button v-on:[event]="doThis"></button>

  <!-- declaração em linha -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- atalho -->
  <button @click="doThis"></button>

  <!-- atalho de evento dinâmico -->
  <button @[event]="doThis"></button>

  <!-- parar propagação -->
  <button @click.stop="doThis"></button>

  <!-- impedir o padrão -->
  <button @click.prevent="doThis"></button>

  <!-- impedir o padrão sem expressão -->
  <form @submit.prevent></form>

  <!-- encadear modificadores -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificador de tecla usando pseudónimo de tecla -->
  <input @keyup.enter="onEnter" />

  <!-- o evento de clique será acionado no máximo uma vez -->
  <button v-on:click.once="doThis"></button>

  <!-- sintaxe de objeto -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Ouvindo eventos personalizados dum componente filho (o manipulador é chamado quando "my-event" é emitido sobre o filho):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- declaração em linha -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **Consulte também**
  - [Manipulação de Eventos](/guide/essentials/event-handling)
  - [Componentes - Eventos Personalizados](/guide/essentials/component-basics#listening-to-events)

## `v-bind` {#v-bind}

Vincula dinamicamente um ou mais atributos, ou uma propriedade de componente à uma expressão.

- **Atalho:** `:` ou `.` (quando usamos o modificador `.prop`)

- **Espera:** `any (com argumento) | Object (sem argumento)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores**

  - `.camel` - transforma o nome de atributo em caixa de espetada em caixa de camelo.
  - `.prop` - força um vínculo à ser definido como uma propriedade do DOM. <sup class="vt-badge">3.2+</sup>
  - `.attr` - força um vínculo à ser definido como um atributo de DOM. <sup class="vt-badge">3.2+</sup>

- **Uso**

  Quando usada para vincular o atributo `class` ou `style`, `v-bind` suporta tipos de valores adicionar como Vetor ou Objeto. Consulte a seção do guia ligado abaixo por mais detalhes.

  Quando definimos um vínculo num elemento, a Vue por padrão verifica se o elemento tem a chave definida como uma propriedade usando uma verificação do operador `in`. Se a propriedade for definida, a Vue definirá o valor como uma propriedade de DOM ao invés dum atributo. Isto deve funciona na maioria dos casos, mas podemos sobrepor este comportamento ao usar explicitamente os modificadores `.prop` ou `.attr`. Isto é algumas vezes necessário, especialmente quando [trabalhamos com elementos personalizados](/guide/extras/web-components#passing-dom-properties).

  Quando usada para vínculos de propriedade de componente, a propriedade deve ser declarada apropriadamente no componente filho.

  Quando usada sem um argumento, pode ser usada para vincular um objeto contendo pares de nome-valor de atributo.

- **Exemplo**

  ```vue-html
  <!-- vincular um atributo -->
  <img v-bind:src="imageSrc" />

  <!-- nome de atributo dinâmico -->
  <button v-bind:[key]="value"></button>

  <!-- atalho -->
  <img :src="imageSrc" />

  <!-- atalho de nome de atributo dinâmico -->
  <button :[key]="value"></button>

  <!-- com concatenação de sequência de caracteres em linha -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- vínculos de classe -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- vínculos de estilo -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- vincular um objeto de atributos -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- vincular propriedades. -->
  <!-- "prop" deve ser declarada no componente filho. -->
  <MyComponent :prop="someThing" />

  <!-- passar as propriedades do pai em comum com um componente filho -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  O modificador `.prop` também tem um atalho dedicado `.`:

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- equivalente a -->
  <div .someProperty="someObject"></div>
  ```

  O modificador `.camel` permite a camelização dum nome de atributo de `v-bind` quando usamos modelos de marcação no DOM, por exemplo o atributo `viewBox` de SVG:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` não é necessário se estivermos a usar modelos de marcação de sequência de caracteres, pré-compilar o modelo de marcação com uma etapa de construção.

- **Consulte também**
  - [Vínculos de Classe e Estilo](/guide/essentials/class-and-style)
  - [Componentes - Detalhes da Passagem de Propriedade](/guide/components/props#prop-passing-details)

## `v-model` {#v-model}

Cria um vínculo bidirecional num elemento de entrada de formulário ou um componente.

- **Espera:** variar baseado no valor do elemento de entradas de formulário ou na saída de componentes

- **Limitado a:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores**

  - [`.lazy`](/guide/essentials/forms#lazy) - ouve os eventos de `change` ao invés de `input`
  - [`.number`](/guide/essentials/forms#number) - converte uma sequência de caracteres de entrada válida em números.
  - [`.trim`](/guide/essentials/forms#trim) - apara a entrada

- **Consulte também**

  - [Vínculos de Entrada de Formulário](/guide/essentials/forms)
  - [Eventos de Componente - Uso com `v-model`](/guide/components/v-model)

## `v-slot` {#v-slot}

Denota ranhuras nomeadas ou ranhuras isoladas que esperam receber propriedades.

- **Atalho:** `#`

- **Espera:** expressão de JavaScript que é válido numa posição de argumento de função, incluindo suporte para desestruturação. Opcional - apenas necessário se esperamos propriedades serem passadas para a ranhura.

- **Argumento:** nome da ranhura (opcional, predefinido para `default`)

- **Limitado a:**

  - `<template>`
  - [componentes](/guide/components/slots#scoped-slots) (para única ranhura padrão com propriedades)

- **Exemplo**

  ```vue-html
  <!-- Ranhuras nomeadas -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Ranhura nomeada que recebe propriedades -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Ranhura padrão que recebe propriedades, com desestruturação -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **Consulte também**
  - [Componentes - Ranhuras](/guide/components/slots)

## `v-pre` {#v-pre}

Ignora a compilação para este elemento e todos os seus filhos.

- **Não espera expressão**

- **Detalhes**

  Dentro do elemento com `v-pre`, toda a sintaxe de modelo de marcação da Vue será preservada e desenhada como está. O caso de uso mais comum disto é a exibição de marcadores de bigodes puros.

- **Exemplo**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## `v-once` {#v-once}

Desenha o elemento e o componente apenas uma vez, e ignora as futuras atualizações.

- **Não espera expressão**

- **Detalhes**

  Nos redesenhos subsequentes, o elemento ou componente e todos os seus filhos serão tratados como conteúdo estático e ignorados. Isto pode ser usado para otimizar o desempenho da atualização.

  ```vue-html
  <!-- elemento único -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- o elemento tem filhos -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- componente -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- diretiva `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Desde a 3.2, também podemos memorizar parte do modelo de marcação com condições de invalidação usando a [`v-memo`](#v-memo).

- **Consulte também**
  - [Sintaxe de Vínculo de Dados - Interpolações](/guide/essentials/template-syntax#text-interpolation)
  - [`v-memo`](#v-memo)

## `v-memo` <sup class="vt-badge" data-text="3.2+" /> {#v-memo}

- **Espera:** `any[]`

- **Detalhes**

  Memoriza uma sub-árvore do modelo de marcação. Pode ser usada em ambos elementos e componentes. A diretiva espera um vetor de valores de dependência de comprimento fixo à comparar para a memorização. Se todos os valores no vetor fossem os mesmos que os da última interpretação, então as atualizações para a sub-árvore inteira serão ignoradas. Por exemplo:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  Quando o componente redesenha-se, se ambos `valueA` e `valueB` continuarem os mesmos, todas as atualizações para este `<div>` e seus filhos serão ignoradas. De fato, mesmo a criação nó virtual do DOM virtual também será ignorada uma vez que a cópia memorizada da sub-árvore pode ser usada novamente.

  É importante especificar o vetor de memorização corretamente, de outro modo podemos ignorar atualizações que deveriam de fato ser aplicadas. `v-memo` com um vetor de dependência vazio (`v-memo="[]"`) seria funcionalmente equivalente à `v-once`.

  **Uso com `v-for`**

  `v-memo` é fornecida exclusivamente para micro otimizações em cenários de desempenho crítico e deveriam ser raramente necessários. O caso de uso mais comum onde isto pode ser útil é quando desenhamos grandes listas `v-for` (onde `length > 1000`):

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  Quando o estado `selected` do componente mudar, será criada uma grande quantidade de nós virtuais, embora a maioria dos itens permaneça exatamente igual. O uso de `v-memo` neste contexto está essencialmente a dizer "apenas atualize este item se tiver passado de não selecionado para selecionado, ou o contrário". Isto permite que todos os itens não afetados reusarem seus anteriores nós virtuais e ignorar a diferenciação inteiramente. Nota que não precisamos incluir `item.id` no vetor de dependência da `v-memo` neste contexto, uma vez que a Vue atualmente a infere a partir da `:key` do item.

  :::warning AVISO
  Quando usamos a `v-memo` com a `v-for`, devemos certificar-nos que são usados no mesmo elemento. **`v-memo` não funciona dentro da `v-for`**.
  :::

  `v-memo` também pode ser usada nos componentes para manualmente impedir atualizações indesejadas em certos casos extremos onde a verificação da atualização do componente filho não foi otimizado. Mas novamente, é responsabilidade do programador especificar os vetores de dependência correta para evitar ignorar atualizações necessárias.

- **Consulte também**
  - [`v-once`](#v-once)

## `v-cloak` {#v-cloak}

Usada para esconder o modelo de marcação que ainda não foi compilado até que estiver pronto.

- **Não espera expressão**

- **Detalhes**

  **Esta diretiva apenas é necessária nas configurações sem etapa de construção.**

  Quando usamos os modelos de marcação no DOM, pode existir um "piscar de modelos de marcação não compilados": o utilizador pode ver os marcadores de bigodes puros até o componente montado substituí-los com componente desenhado.

  `v-cloak` permanecerá no elemento até que a instância do componente associado for montada. Combinada com as regras de CSS como `[v-cloak] { display: none }`, pode ser usada para esconder os modelos de marcação puros até o componente estiver pronto.

- **Exemplo**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  O `<div>` não será visível até que a compilação estiver concluída.
