# Sintaxe do Modelo de Marcação {#template-syntax}

A Vue usa uma sintaxe de modelo de marcação baseada na HTML que permite-nos vincular declarativamente o DOM interpretado aos dados da instância do componente subjacente. Todos os modelos de marcação da Vue são HTML sintaticamente válidas que podem ser analisados sintaticamente por navegadores e analisadores sintáticos de HTML compatíveis com a especificação.

Nos bastidores, a Vue compila os modelos de marcação para um código de JavaScript altamente otimizado. Aliada ao sistema de reatividade, a Vue é capaz de descobrir inteligentemente o número mínimo de componentes a reinterpretar e aplicar a quantidade mínima de manipulações do DOM quando o estado da aplicação mudar. 

Se estivermos familiarizados com os conceitos do DOM virtual e preferirmos o poder puro da JavaScript, também podemos [escrever diretamente funções de interpretação](/guide/extras/render-function) ao invés dos modelos de marcação, com suporte opcional de JSX. No entanto, nota que estas não gozam do mesmo nível de otimizações no momento da compilação como os modelos de marcação.

## Interpolação de Texto {#text-interpolation}

A forma mais básica de vinculação de dados é a interpolação de texto usando a sintaxe de "Bigodes" (chaves duplas):

```vue-html
<span>Message: {{ msg }}</span>
```

O marcador do bigode será substituído pelo valor da propriedade `msg` [da instância do componente correspondente](/guide/essentials/reactivity-fundamentals#declaring-reactive-state). Este também será atualizado sempre que a propriedade `msg` mudar.

## HTML Puro {#raw-html}

Os bigodes duplos interpretam os dados como texto simples, e não como HTML. No sentido de produzirmos HTML de verdade, precisaremos de usar a [diretiva `v-html`](/api/built-in-directives#v-html):

```vue-html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">This should be red.</span>'
</script>

<div class="demo">
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</div>

Eis que encontramos algo novo. O atributo `v-html` que vemos é chamado de **diretiva**. As diretivas são prefixadas com `v-` para indicar que são atributos especiais fornecidos pela Vue, como podemos ter imaginado, estas aplicam comportamento especial reativo ao DOM interpretado. Eis, que estamos basicamente dizendo para "manter este HTML interno do elemento atualizado com a propriedade `rawHtml` sobre a atual instância ativa".

Os conteúdos do `span` serão substituídos pelo valor da propriedade `rawHtml`, interpretados como HTML simples - os vínculos de dados são ignorados. Nota que não podemos usar `v-html` para compor os parciais do modelo de marcação, porque a Vue não é um motor de modelagem de marcação de hipertexto baseado em sequência de caracteres. No lugar disto, os componentes são preferenciais como unidade fundamental para reutilização e composição da interface.

:::warning AVISO DE SEGURANÇA
Interpretar dinamicamente HTML arbitrário na nossa aplicação pode ser muito perigoso porque pode facilmente conduzir à [vulnerabilidades de XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Apenas usamos `v-html` em conteúdo de confiança e **nunca** no conteúdo fornecido pelo utilizador.
:::

## Vínculos de Atributo {#attribute-bindings}

Os bigodes não podem ser usados dentro dos atributos de HTML. No lugar destes, usamos a [diretiva `v-bind`](/api/built-in-directives#v-bind):

```vue-html
<div v-bind:id="dynamicId"></div>
```

A diretiva `v-bind` instrui a Vue para manter o atributo `id` do elemento em sincronia com a propriedade `dynamicId` do componente. Se o valor vinculado for `null` ou `undefined`, então o atributo será removido do elemento interpretado.

### Abreviação {#shorthand}

Uma vez que a `v-bind` é comummente usa, esta tem uma sintaxe abreviada dedicada:

```vue-html
<div :id="dynamicId"></div>
```

Os atributos que começa com os `:` podem parecer um pouco diferentes da HTML normal, mas é de fato um carácter válido para nomes de atributo e todos os navegadores suportados pela Vue podem analisá-lo sintaticamente corretamente. Além disto, estes não aparecerem na marcação desenhada final. A sintaxe abreviada é opcional, mas possivelmente a apreciaremos quando aprendermos mais sobre o seu uso mais tarde.

> Para o resto do guia, estaremos usando a sintaxe abreviada nos exemplos de código, já que é o uso mais comum para os programadores de Vue.

### Atributos Booleanos {#boolean-attributes}

Os [atributos booleanos](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) são atributos que podem indicar valores verdadeiros ou falsos com sua presença sobre um elemento. Por exemplo, [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) é um dos atributos booleanos mais comummente usados.

A `v-bind` funciona de maneira um pouco diferente neste caso:

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

O atributo `disabled` será incluído se `isButtonDisabled` tiver um [valor verdadeiro](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). Este também será incluído se o valor for uma sequência de caracteres vazia, mantendo a consistência com `<button disabled="">`. Para os outros [valores falsos](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) o atributo será omitido.

### Vinculando Dinamicamente Vários Atributos {#dynamically-binding-multiple-attributes}

Se tivermos um objeto de JavaScript representando vários atributos que se parece com este:

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

Nós podemos vinculá-los (os atributos) a um único elemento usando a `v-bind` sem um argumento:

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## Usando as Expressões da JavaScript {#using-javascript-expressions}

De momento apenas estivemos vinculando às chaves de propriedade simples nos nossos modelos de marcação. Mas a Vue de fato suporta o poder total das expressões de JavaScript dentro de todos os vínculos de dados:

```vue-html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

Estas expressões serão avaliadas como JavaScript no âmbito da aplicação dos dados da instância do componente atual.

Nos modelos de marcação da Vue, as expressões de JavaScript podem ser usadas nas seguintes posições:

- Dentro das interpolações de texto (bigodes)
- No valor do atributo de quaisquer diretivas da Vue (atributos especiais que começam com `v-`)

### Somente Expressões {#expressions-only}

Cada vínculo apenas pode conter **uma única expressão**. Uma expressão é um pedaço de código que pode ser avaliada para um valor. Um verificação simples é se pode ser usada depois de `return`.

Portanto, as seguintes **não** funcionarão:

```vue-html
<!-- isto é uma declaração, e não uma expressão: -->
{{ var a = 1 }}

<!-- controlo de fluxo também não funcionará, use expressões ternárias -->
{{ if (ok) { return message } }}
```

### Chamando Funções {#calling-functions}

É possível chamar um método exposto pelo componente dentro duma expressão de vínculo:

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip NOTA
As funções chamadas dentro das expressões de vínculo serão chamadas todas as vezes que o componente atualizar, então estas **não** devem possuir quaisquer efeitos colaterais, tais como alterar dados ou acionar operações assíncronas.
:::

### Acesso Global Restrito {#restricted-globals-access}

As expressões do modelo de marcação são isoladas e apenas têm acesso a uma [lista restrita de globais](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3). A lista expõe os globais embutidos comummente usados tais como `Math` e `Date`.

Os globais que não são explicitamente incluídos na lista, por exemplo, propriedades anexadas pelo utilizador sobre `window`, não estarão acessíveis nas expressões do modelo de marcação. Nós podemos, no entanto, definir explicitamente os globais adicionais para todas as expressões da Vue adicionado-os à [`app.config.globalProperties`](/api/application#app-config-globalproperties).

## Diretivas {#directives}

As diretivas são atributos especiais com o prefixo `v-`. A Vue fornece um número de [diretivas embutidas](/api/built-in-directives), incluindo `v-html` e `v-bind` que introduzimos acima.

Os valores do atributo da diretiva são esperados serem expressões de JavaScript únicas (com a exceção de `v-for`, `v-on`, e `v-slot`, as quais serão discutidas nas suas respetivas seções adiante). O trabalho duma diretiva é aplicar atualizações de maneira reativa ao DOM quando o valor da sua expressão mudar. Consideremos [`v-if`](/api/built-in-directives#v-if) como um exemplo:

```vue-html
<p v-if="seen">Now you see me</p>
```

Neste exemplo, a diretiva `v-if` removeria ou inseriria o elemento `<p>` baseada na veracidade do valor da expressão `seen`.

### Argumentos {#arguments}

Algumas diretivas podem receber um "argumento", denotado por um sinal de dois-pontos depois do nome da diretiva. Por exemplo, a diretiva `v-bind` é usada para atualizar um atributo de HTML de maneira reativa:

```vue-html
<a v-bind:href="url"> ... </a>

<!-- abreviação -->
<a :href="url"> ... </a>
```

Neste exemplo, `href` é o argumento, o qual diz à diretiva `v-bind` para vincular o atributo `href` do elemento ao valor da expressão `url`. Em resumo, tudo que estiver antes do argumento (isto é, `v-bind`) é condensado a um único carácter, `:`.

Um outro exemplo é a diretiva `v-on`, a qual ouve os eventos do DOM:

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- abreviação -->
<a @click="doSomething"> ... </a>
```

Neste exemplo, o argumento é o nome do evento a ouvir: `click`. A `v-on` tem uma abreviação correspondente, nomeadamente o carácter `@`. Nós também falaremos sobre a manipulação de evento em mais detalhes.

### Argumentos Dinâmicos {#dynamic-arguments}

Também é possível usar uma expressão de JavaScript num argumento de diretiva envolvendo-a entre colchetes:

```vue-html
<!--
Nota que existem algumas restrições à expressão de argumento,
como explicado nas seções "restrições do valor de argumento dinâmico"
e "restrições da sintaxe do argumento dinâmico" abaixo.
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- abreviação -->
<a :[attributeName]="url"> ... </a>
```

Neste exemplo, o `attributeName` será avaliado dinamicamente como uma expressão de JavaScript, e o seu valor avaliado será usado como valor final para o argumento. Por exemplo, se a instância do nosso componente tiver uma propriedade de dados `attributeName`, cujo valor é `"href"`, então este vínculo será equivalente à `v-bind:href`.

De maneira semelhante, podemos usar os argumentos dinâmicos para vincular um manipulador a um nome de evento dinâmico:

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- abreviação -->
<a @[eventName]="doSomething">
```

Neste exemplo, quando o valor do `eventName` for `"focus"`, `v-on:[eventName]` será equivalente à `v-on:focus`.

#### Restrições do Valor do Argumento Dinâmico {#dynamic-argument-value-constraints}

Os argumentos dinâmicos são esperados serem avaliados a uma sequência de caracteres, com a exceção de `null`. O valor especial `null` pode ser usado para remover explicitamente o vínculo. Qualquer outro valor que não for sequência de caracteres acionará um aviso.

#### Restrições da Sintaxe do Argumento Dinâmico {#dynamic-argument-syntax-constraints}

As expressões de argumento dinâmico têm algumas restrições de sintaxe porque certos caracteres, tais como espaços e aspas, são inválidos dentro dos nomes de atributo de HTML. Por exemplo, o seguinte é inválido:

```vue-html
<!-- Isto acionará um aviso de compilação. -->
<a :['foo' + bar]="value"> ... </a>
```

Se precisarmos de passar um argumento dinâmico complexo, é possivelmente melhor usar uma [propriedade computada](./computed), a qual cobriremos brevemente.

Quando usamos os modelos de marcação no DOM (modelos de marcação escritos diretamente num ficheiro de HTML), também devemos evitar nomear as chaves com caracteres maiúsculos, já que os navegadores coagirão os nomes de atributo para minúsculas:

```vue-html
<a :[someAttr]="value"> ... </a>
```

O exemplo acima será convertido à `:[someattr]` nos modelos de marcação no DOM. Se o nosso componente tiver uma propriedade `someAttr` ao invés de `someattr`, o nosso código não funcionará. Os modelos de marcação dentro dos componentes de ficheiro único **não** estão sujeitos a esta restrição. 

### Modificadores {#modifiers}

Os modificadores são sufixos especiais denotados por um ponto, os quais indicam que uma diretiva deve ser vinculada duma maneira especial. Por exemplo, o modificador `.prevent` diz a diretiva `v-on` para chamar `event.preventDefault()` sobre o evento acionado:

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

Depois veremos outros exemplos de modificadores, [para a `v-on`](./event-handling#event-modifiers) e [para a `v-model`](./forms#modifiers), quando explorarmos estas funcionalidades.

E finalmente, eis a sintaxe completa da diretiva visualizada:

![gráfico da sintaxe de diretiva](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->
