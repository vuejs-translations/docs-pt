# Diretivas Embutidas {#built-in-directives}

## v-text {#v-text}

Atualiza o conteúdo de texto do elemento.

- **Espera:** `string`

- **Detalhes**

  `v-text` funciona por definir a propriedade [textContent](https://developer.mozilla.org/pt-BR/docs/Web/API/Node/textContent) do elemento, ela irá sobrescrever qualquer conteúdo dentro do elemento. Se você precisar atualizar parte do `textContent`, você deve usar [interpolações mustache](/guide/essentials/template-syntax.html#text-interpolation).

- **Exemplo**

  ```vue-html
  <span v-text="msg"></span>
  <!-- é o mesmo que -->
  <span>{{msg}}</span>
  ```

- **Veja também:** [Sintaxe do Modelo - Interpolação de Texto](/guide/essentials/template-syntax.html#text-interpolation)

## v-html {#v-html}

Atualiza o [innerHTML](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/innerHTML) do elemento.

- **Espera:** `string`

- **Detalhes:**

  O conteúdo do `v-html` será inserido como HTML puro - a sintaxe de modelos Vue não será processada. Se você está tentando compor templates usando `v-html`, repense a solução tentando usar componentes.

  ::: warning Nota de Segurança
  Interpretar HTML arbitrário de forma dinâmica em seu website pode ser muito perigoso porque isso pode facilmente levar a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Apenas use `v-html` em conteúdo confiável e **nunca** em conteúdo fornecido pelo usuário.
  :::

  Em [Componentes de Arquivo Único](/guide/scaling-up/sfc), estilos `scoped` não serão aplicados ao conteúdo dentro do `v-html`, porque este HTML não é processado pelo compilador de modelos do Vue. Se você quer atingir o conteúdo de `v-html` com CSS escopado, você pode usar então [módulos CSS](./sfc-css-features.html#css-modules) ou um elemento `<style>` global adicional com uma estratégia de escopagem manual como o BEM.

- **Exemplo:**

  ```vue-html
  <div v-html="html"></div>
  ```

- **Veja também:** [Sintaxe do Modelo - HTML Bruto](/guide/essentials/template-syntax.html#raw-html)

## v-show {#v-show}

Alterna a visibilidade do elemento baseado na veracidade do valor da expressão.

- **Espera:** `any`

- **Detalhes**

  `v-show` funciona ao definir a propriedade CSS `display` através de estilos em linha, e tentará respeitar o valor inicial de `display` quando o elemento está visível. Ele também aciona transições quando as suas condições mudam.

- **Veja também:** [Interpretação Condicional - v-show](/guide/essentials/conditional.html#v-show)

## v-if {#v-if}

Apresenta um elemento ou fragmento de um modelo condicionalmente baseado na veracidade do valor da expressão.

- **Espera:** `any`

- **Detalhes**

  Quando um elemento `v-if` é alternado, o elemento e seus componentes/diretivas contidas são destruídas e reconstruídas. Se a condição inicial for falsa, então o conteúdo interno não será interpretado de qualquer forma.

  Pode ser usado no `<template>` para denotar um bloco condicional contando apenas texto ou múltiplos elementos.
  Esta diretiva aciona transições quando sua condição muda.

  Ao usar conjuntamente, o `v-if` tem maior prioridade que o `v-for`. Não recomendamos usar essas duas diretivas juntas no mesmo elemento - veja o [guia de interpretação de lista](/guide/essentials/list.html#v-for-with-v-if) para mais detalhes.

- **Veja também:** [Interpretação Condicional - v-if](/guide/essentials/conditional.html#v-if)

## v-else {#v-else}

Denota um "bloco else" para o `v-if` ou para uma cadeia `v-if` / `v-else-if`.

- **Não espera expressões**

- **Detalhes**

  - Restrição: o elemento irmão anterior precisa ter `v-if` ou `v-else-if`.

  - Pode ser usado no `<template>` para denotar um bloco condicional contendo apenas texto ou múltiplos elementos.

- **Exemplo**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Agora você me vê
  </div>
  <div v-else>
    Agora não
  </div>
  ```

- **Veja também:** [Interpretação Condicional - v-else](/guide/essentials/conditional.html#v-else)

## v-else-if {#v-else-if}

Denota o "bloco else if" para o `v-if`. Pode ser encadeado.

- **Espera:** `any`

- **Detalhes**

  - Restrição: o elemento irmão anterior precisa ter `v-if` ou `v-else-if`.

  - Pode ser usado no `<template>` para denotar um bloco condicional contendo apenas texto ou múltiplos elementos.

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
    Não A/B/C
  </div>
  ```

- **Veja também:** [Interpretação Condicional - v-else-if](/guide/essentials/conditional.html#v-else-if)

## v-for {#v-for}

Apresenta o elemento ou bloco de modelo múltiplas vezes baseado na fonte de dados.

- **Espera:** `Array | Object | number | string | Iterable`

- **Detalhes**

  O valor da diretiva deve usar a sintaxe espcial `variável in expressão` para fornecer uma variável para o atual elemento que está sendo iterado:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativamente, você pode também especificar uma variável para o índice (ou a chave se for usada em um Objeto):

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  O comportamento padrão de `v-for` tentará corrigir os elementos existentes sem movê-los. Para forçar a reordenação de elementos, você deve fornecer uma dica de ordenação com o atributo especial `key`:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` também pode trabalhar com valores que implementam o [Protocolo Iterável](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Iteration_protocols#o_protocolo_iter%C3%A1vel_iterable_protocol), incluindo os nativos `Map` e `Set`.

- **Veja também:**
  - [Interpretação de Lista](/guide/essentials/list.html)

## v-on {#v-on}

Anexa um _event listener_ ao elemento.

- **Atalho:** `@`

- **Espera:** `Function | Inline Statement | Object (sem argumento)`

- **Argumento:** `event` (opcional se estiver usando a sintaxe de Objeto)

- **Modificadores:**

  - `.stop` - chama `event.stopPropagation()`.
  - `.prevent` - chama `event.preventDefault()`.
  - `.capture` - adiciona um _event listener_ no modo de captura.
  - `.self` - dispara o manipulador apenas se o evento foi despachado por este elemento.
  - `.{keyAlias}` - dispara o manipulador apenas com certas teclas.
  - `.once` - dispara o manipulador apenas uma vez.
  - `.left` - dispara o manipulador apenas para eventos com o botão esquerdo do mouse.
  - `.right` - dispara o manipulador apenas para eventos com o botão direito do mouse.
  - `.middle` - dispara o manipulador apenas para eventos com o botão do meio do mouse.
  - `.passive` - anexa um evento DOM com `{ passive: true }`.

- **Detalhes**

  O tipo de evento é denotado pelo argumento. A expressão pode ser o nome de um método, uma declaração em linha, ou omitido se os modificadores estiverem presentes.

  Ao ser usado em um elemento normal, ele escuta apenas à [**eventos nativos do DOM**](https://developer.mozilla.org/pt-BR/docs/Web/Events). Quando usado em um elemento que é um componente personalizado, ele escuta aos **eventos personalizados** emitidos pelo componente filho.

  Ao escutar eventos nativos do DOM, o método recebe o evento nativo como único argumento. Se usar uma declaração alinhada, a declaração tem acesso a propriedade especial `$event`: `v-on:click="handle('ok', $event)"`.

  `v-on` também suporta vincular a pares de _event/listener_ sem um argumento. Note que ao usar a sintaxe de objeto, ele não suporta qualquer modificador.

- **Exemplo:**

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

  <!-- prevenir o padrão -->
  <button @click.prevent="doThis"></button>

  <!-- prevenir o padrão sem expressão -->
  <form @submit.prevent></form>

  <!-- modificadores em cadeia -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificador de tecla usando keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- o evento click será disparado apenas uma vez -->
  <button v-on:click.once="doThis"></button>

  <!-- sintaxe de objeto -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Escutar a eventos personalizados de um componente filho (o manipulador é chamado quando "my-event" é emitido pelo filho):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- declaração em linha -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **Veja também:**
  - [Manipulação de Eventos](/guide/essentials/event-handling.html)
  - [Componentes - Eventos Personalizados](/guide/essentials/component-basics.html#listening-to-events)

## v-bind {#v-bind}

Vincula um ou mais atributos dinamicamente, ou uma propriedade de componente a uma expressão.

- **Atalho:** `:` ou `.` (ao usar o modificador `.prop`)

- **Espera:** `any (com argumento) | Object (sem argumento)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores:**

  - `.camel` - transforma o nome de atributo kebab-case em camelCase.
  - `.prop` - força que a vinculação aconteça como uma propriedade no DOM. <sup class="vt-badge">3.2+</sup>
  - `.attr` - força que a vinculação aconteça como um atributo no DOM. <sup class="vt-badge">3.2+</sup>

- **Uso:**

  Ao usar para vincular os atributos `class` ou `style`, `v-bind` suporta tipos de valores adicionais como Array ou Object. Veja a seção guia mencionada abaixo para mais detalhes.

  Quando configurar uma vinculação em um elemento, o Vue por padrão irá conferir se o elemento tem a chave definida como propriedade usando o operador `in` para realizar a conferência. Se a propriedade for definida, Vue irá definir o valor como uma propriedade DOM ao invés de um atributo. Isto deve acontecer na maioria dos casos, mas você pode sobrepor esse comportamento ao usar explicitamente os modificadores `.prop` ou `.attr`. Isto às vezes é necessário, especialmente ao [trabalhar com elementos personalizados](/guide/extras/web-components.html#passing-dom-properties).

  Ao usar para vincular propriedades aos componentes, a propriedade deve ser adequadamente declarada no componente filho.

  Ao ser usada sem um argumento, pode vincular um objeto contendo pares de atributo nome-valor.

- **Exemplo:**

  ```vue-html
  <!-- vincular um atributo -->
  <img v-bind:src="imageSrc" />

  <!-- nome de atributo dinâmico -->
  <button v-bind:[key]="value"></button>

  <!-- atalho -->
  <img :src="imageSrc" />

  <!-- atalho de nome de atributo dinâmico -->
  <button :[key]="value"></button>

  <!-- com concatenação de string em linha -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- vincular classes -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- vincular estilo -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- vincular um objeto de atributos -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- vincular propriedades. "prop" deve ser declarada no componente filho. -->
  <MyComponent :prop="someThing" />

  <!-- passar propriedades em comum do pai ao componente -->
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

  O modificador `.camel` permite 'camelizar' um nome de atributo `v-bind` ao usar _templates in-DOM_, e.g. o atributo `viewBox` do SVG:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` não é necessário se você está usando _templates string_, ou pré-compilando o modelo com uma fase de build.

- **Veja também:**
  - [Vinculações de Classe e Estilo](/guide/essentials/class-and-style.html)
  - [Componentes - Detalhes ao Passar Proriedades](/guide/components/props.html#prop-passing-details)

## v-model {#v-model}

Cria uma vinculação de dois caminhos em uma entrada de formulário ou em um componente.

- **Espera:** varia de acordo com o valor que as entradas do formulário ou com a saída dos componentes

- **Limitado a:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores:**

  - [`.lazy`](/guide/essentials/forms.html#lazy) - escuta a eventos `change` ao invés de `input`
  - [`.number`](/guide/essentials/forms.html#number) - lança entradas de string válidas para números
  - [`.trim`](/guide/essentials/forms.html#trim) - apara a entrada

- **Veja também:**

  - [Vinculações de Entrada de Formulário](/guide/essentials/forms.html)
  - [Eventos de Componente - Uso com `v-model`](/guide/components/v-model.html)

## v-slot {#v-slot}

Denota encaixes nomeados ou encaixes escopados que esperam receber propriedades.

- **Atalho:** `#`

- **Espera:** Expressão JavaScript que é valida em uma posição de argumento de função, incluindo suporte para desestruturação. Opcional - apenas necessário ao esperar que propriedades sejam passadas ao encaixe.

- **Argumento:** nome do encaixe (opcional, o padrão é `default`)

- **Limitado a:**

  - `<template>`
  - [componentes](/guide/components/slots.html#scoped-slots) (para um encaixe solitário padrão com propriedades)

- **Exemplo:**

  ```vue-html
  <!-- Encaixes nomeados -->
  <BaseLayout>
    <template v-slot:header>
      Conteúdo do Header
    </template>

    <template v-slot:default>
      Conteúdo padrão do encaixe
    </template>

    <template v-slot:footer>
      Conteúdo do Footer
    </template>
  </BaseLayout>

  <!-- Encaixe nomeado que recebe propriedades -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Encaixe padrão que recebe propriedades, com desestruturação -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **Veja também:**
  - [Componentes - Encaixes](/guide/components/slots.html)

## v-pre {#v-pre}

Omite a compilação para este elemento e todos os seus filhos.

- **Não espera expressão**

- **Detalhes**

  Dentro do elemento com `v-pre`, toda a sintaxe de modelo do Vue será preservada e apresentada como está. O caso de uso mais comum para isso é mostrar identificadores mustache.

- **Exemplo:**

  ```vue-html
  <span v-pre>{{ isto não será compilado }}</span>
  ```

## v-once {#v-once}

Apresenta o elemento e componente apenas uma única vez, e omite futuras atualizações.

- **Não espera expressão**

- **Detalhes**

  Em reintepretações subsequentes, o elemento/componente e todos os seus filhos serão tratados como conteúdo estático. Isto pode ser usado para otimizar o desempenho de atualização.

  ```vue-html
  <!-- elemento único -->
  <span v-once>Isso nunca irá mudar: {{msg}}</span>
  <!-- o elemento possui filhos -->
  <div v-once>
    <h1>comentário</h1>
    <p>{{msg}}</p>
  </div>
  <!-- componente -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- diretiva `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Desde a versão 3.2, você também pode 'memoizar' parte do template com condições de invalidação usando o [`v-memo`](#v-memo).

- **Veja também:**
  - [Sintaxe de Vinculação de Dados - Interpolações](/guide/essentials/template-syntax.html#text-interpolation)
  - [v-memo](#v-memo)

## v-memo <sup class="vt-badge" data-text="3.2+" /> {#v-memo}

- **Espera:** `any[]`

- **Detalhes**

  'Memoiza' uma sub-árvore do modelo. Pode ser usado em elementos e componentes. A diretiva espera um _array_ de tamanho fixo com valores de dependência para comparar durante a 'memoização'. Se todo valor no _array_ for o mesmo do da última interpretação, então as atualizações para toda a sub-árvore serão omitidas. Por exemplo:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  Quando o componente é reinterpretado, se ambos os valores `valueA` e `valueB` permanecerem os mesmos, todos as atualizações para este `<div>` e seus filhos serão omitidas. Na verdade, até mesmo a criação do VNode do DOM Virtual será omitida, visto que a cópia 'memoizada' da sub-árvore pode ser reutilizada.

  É importante especificar o _array_ de 'memoização' corretamente, caso contrário nós podemos omitir atualizações que deveriam ser de fato aplicadas. `v-memo` com uma dependência de _array_ vazia (`v-memo="[]"`) deve ser funcionalmente equivalente a `v-once`.

  **Uso com `v-for`**

  `v-memo` é fornecido exclusivamente para micro-otimizações em cenários críticos de desempenho, e raramente devem ser necessários. O caso de uso mais comum onde pode ser útil é ao apresentar grandes listas `v-for` (onde `length > 1000`):

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selecionado: {{ item.id === selected }}</p>
    <p>...mais nódulos filhos</p>
  </div>
  ```

  Quando o estado `selected` do componente muda, uma grande quantidade de VNodes será criada mesmo que a maioria dos itens tenha permanecido exatamente o mesmo. O uso de `v-memo` aqui é essencialmente para dizer "apenas atualize este item se ele for de não selecionado para selecionado, ou o contrário". Isto permite que todo item inalterado reuse seu VNode anterior e pule a comparação inteiramente. Note que não precisamos incluir o `item.id` nas dependências de _array_ memo aqui visto que o Vue automaticamente infere pela `:key` do item.

  :::warning
  Ao usar `v-memo` com `v-for`, tenha certeza que eles são usados no mesmo elemento. **`v-memo` não funciona dentro de `v-for`.**
  :::

  `v-memo` também pode ser usado em componentes para manualmente prevenir atualizações indesejadas em certos casos extremos onde a atualização de um componente filho foi deteriorada. Mas novamente, é responsabilidade do desenvolvedor especificar a dependência de _arrays_ correta para evitar omitir atualizações necessárias.

- **Veja também:**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

Usado para esconder modelo não compilado até que esteja pronto.

- **Não espera expressão**

- **Detalhes**

  **Esta diretiva só é necessária em ambientes sem a fase de build.**

  Ao usar _in-DOM templates_, pode haver um "instante de modelos não compilados": o usuário pode ver identificadores mustache até que o componente montado substitua-os com o conteúdo interpretado.

  `v-cloak` permanecerá no elemento até que a instância do componente associado seja montada. Ao combinar com regras CSS como `[v-cloak] { display: none }`, pode esconder modelos brutos até que o componente esteja pronto.

- **Exemplo:**

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

  O `<div>` não será visível até que a compilação esteja concluída.
