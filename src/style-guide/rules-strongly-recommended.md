# Regras Prioridade B: Fortemente Recomendado {#priority-b-rules-strongly-recommended}

Estas regras foram verificadas para melhorar a legibilidade e/ou a experiência do desenvolvedor na maioria dos projetos. Seu código ainda funcionará se você violá-las, mas as violações devem ser raras e bem justificadas.

## Arquivos de componente {#component-files}

**Quando houver um sistema de compilação disponível para concatenar arquivos, cada componente deve estar em seu próprio arquivo.**

Isto ajuda você a encontrar mais rapidamente um componente quando precisar editá-lo ou verificar como usá-lo.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Notação de nomes de Componentes de Arquivo Único {#single-file-component-filename-casing}

**Nomes de arquivo de [Componentes de Arquivo Único](/guide/scaling-up/sfc) devem ser sempre PascalCase ou kebab-case.**

A notação com PascalCase funciona melhor com o preenchimento automático de editores de código, pois é consistente com a forma que referenciamos componentes em JS(X) e modelos, onde possível. Entretanto, diferentes tipos de nomes de arquivo podem às vezes causar problemas em sistemas de arquivo insensíveis a maiúsculas e minúsculas, é a razão de o kebab-case ser perfeitamente aceitável.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Nomes de componentes base {#base-component-names}

**Componentes base (também conhecidos como componentes de apresentação, burros, ou puros) que aplicam estilos e convenções específicos da aplicação devem começar com um prefixo específico, como `Base`, `App` ou `V`.**

::: details Explicação Detalhada
Estes componentes estabelecem a base para o estilo e o comportamento consistentes na sua aplicação. Eles podem conter **somente**:

- Elementos HTML,
- outros componentes base, e
- componentes UI de terceiros.

Mas eles **nunca** irão conter um estado global (ex.: de uma store [Pinia](https://pinia.vuejs.org/)).

Seus nomes frequentemente incluem o nome do elemento que eles envolvem (ex.: `BaseButton`, `BaseTable`), a não ser que nenhum elemento exista para seu propósito específico (ex.: `BaseIcon`). Se você construir componentes similares para um contexto mais específico, eles quase sempre consumirão estes componentes (ex.: `BaseButton` será usado em `ButtonSubmit`)..

Algumas vantagens desta convenção:

- Quando organizado alfabeticamente em editores, os componentes base da aplicação serão listados em conjunto, tornando-os mais fáceis de identificar.

- Como nomes de componente sempre possuem multipalavras, esta convenção previne que você tenha que escolher um prefixo arbitrário para simples componentes envoltórios (ex.: `MyButton`, `VueButton`).

- Como estes componentes são frequentemente usados, você pode simplesmente torná-los globais ao invés de importá-los em todos os lugares. Um prefixo torna isto possível com o Webpack:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Nomes de componentes de instância única {#single-instance-component-names}

**Componentes que devem ter somente uma única instância ativa devem começar com o prefixo `The`, para denotar que poderá existir somente um.**

Isto não significa que o componente é usado apenas em uma única página, mas que será usado uma vez _por página_. Estes componentes nunca aceitam quaisquer propriedades, pois são específicos à sua aplicação, e não ao contexto dentro da sua aplicação. Se você encontrar a necessidade de adicionar propriedades, é uma boa indicação de que este na verdade é um componente reutilizável que é usado uma vez por página _por ora_.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- Heading.vue
|- MySidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

</div>

## Nomes de componentes estreitamente acoplados {#tightly-coupled-component-names}

**Componentes filho que são estreitamente acoplados com seus pais devem incluir o nome do componente pai como prefixo.**

Se um componente fizer sentido apenas no contexto de um único componente pai, este relacionamento deve ser evidente em seu nome. Como editores tipicamente organizam os arquivos alfabeticamente, isto irá ajudar a manter estes arquivos relacionados próximos uns dos outros.

::: details Explicação Detalhada
Você pode ser tentado a resolver este problema aninhando componentes filho em diretórios nomeados com base em seu pai. Por exemplo:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

ou:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Isto não é recomendado, pois resulta em:

- Muitos arquivos com nomes similares, fazendo com que trocas de arquivos rápidas em editores de código tornem-se mais difíceis.
- Muitos subdiretórios aninhados, o que aumenta o tempo para procurar componentes na barra lateral do editor.
  :::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Ordem das palavras em nomes de componente {#order-of-words-in-component-names}

**Nomes de componente devem começar com palavras de nível mais alto (muitas vezes a mais geral) e terminar com palavras modificadoras descritivas.**

::: details Explicação Detalhada
Você pode estar se perguntando:

> "Por que forçamos nomes de componentes a usar uma linguagem menos natural?"

No inglês natural, adjetivos e outros descritores aparecem geralmente antes dos substantivos, enquanto exceções exigem palavras conectoras. Por exemplo:

- Café _com_ leite
- Sopa _do_ dia
- Visitante _do_ museu

Você definitivamente pode incluir estas palavras conectoras no nome dos componentes se quiser, mas a ordem ainda é importante.

Também note que **o que é considerado "nível mais alto" será contextual à sua aplicação**. Por exemplo, imagine uma aplicação com um formulário de busca. Ele pode incluir componentes como este:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Como você pode perceber, é difícil ver quais componentes são específicos da busca. Agora vamos renomear os componentes de acordo com a regra:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Como editores tipicamente organizam os arquivos alfabeticamente, todas as relações importantes entre componentes agora estão evidentes à vista.

Você pode ser tentado a resolver este problema diferentemente, aninhando todos os componentes de busca em um diretório "search", e todos os componentes de configuração em um diretório "settings". Recomendamos considerar esta abordagem apenas em aplicações muito grandes (ex.: mais de 100 componentes), pelas seguintes razões:

- Geralmente leva mais tempo navegar por subdiretórios aninhados, do que percorrer um único diretório `components`.
- Conflitos com nomes (ex.: múltiplos componentes `ButtonDelete.vue`) tornam mais difícil navegar rapidamente para um componente específico no editor de código.
- Refatorar torna-se mais difícil, já que buscar-e-substituir nem sempre será suficiente para alterar as referências relativas para um componente deslocado.
  :::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Componentes com autofechamento {#self-closing-components}

**Componentes sem conteúdo devem se autofechar em [Componentes de Arquivo Único](/guide/scaling-up/sfc), modelos string, e [JSX](/guide/render-function#jsx) - mas nunca em modelos DOM.**

Componentes que se fecham automaticamente informam não apenas que não possuem conteúdo, mas são **feitos** para não terem conteúdo. É a diferença entre uma página em branco em um livro e uma rotulada "Esta página foi intencionalmente deixada em branco". Seu código também é mais limpo sem a etiqueta de fechamento desnecessária.

Infelizmente, HTML não permite que elementos customizados tenham fechamento próprio - somente [elementos "void" oficiais](https://www.w3.org/TR/html/syntax.html#void-elements). É por isso que a estratégia só é possível quando o compilador de modelos do Vue pode alcançar o modelo antes do DOM, e então servir o HTML conforme especificado ao DOM.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<!-- Em Componentes de Arquivo Único, modelos string, e JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- Em modelos DOM -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<!-- Em Componentes de Arquivo Único, modelos string, e JSX -->
<MyComponent/>
```

```vue-html
<!-- Em modelos DOM -->
<my-component></my-component>
```

</div>

## Notação de nomes de componente em modelos {#component-name-casing-in-templates}

**Na maioria dos projetos, os nomes de componente devem ser sempre PascalCase em [Componentes de Arquivo Único](/guide/scaling-up/sfc) e modelos em string - e kebab-case em templates DOM.**

PascalCase possui algumas vantagens sobre kebab-case:

- Editores podem autocompletar nomes de componentes em modelos, pois o PascalCase também é utilizado no JavaScript.
- `<MyComponent>` é mais distintivo visualmente do que um simples elemento HTML de palavra única como `<my-component>`, pois há duas diferenças em caracteres (duas maiúsculas), ao invés de só uma (um hífen).
- Se você usar qualquer elemento personalizado em seus modelos que não do Vue, como um Web Component, PascalCase garante que seus componentes Vue permaneçam distintamente visíveis.

Infelizmente, devido à insensibilidade do HTML em relação a maiúsculas e minúsculas, modelos DOM ainda precisam utilizar kebab-case.

Também note que se você já investiu bastante em kebab-case, a consistência de convenções HTML e ser capaz de usar o mesmo padrão pelos seus projetos pode ser mais importante do que as vantagens listadas acima. Nestes casos, **utilizar kebab-case em todo lugar também é aceitável.**

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<!-- Em Componentes de Arquivo Único e modelos string -->
<mycomponent/>
```

```vue-html
<!-- Em Componentes de Arquivo Único e modelos string -->
<myComponent/>
```

```vue-html
<!-- Em modelos DOM -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<!-- Em Componentes de Arquivo Único e modelos string -->
<MyComponent/>
```

```vue-html
<!-- Em modelos DOM -->
<my-component></my-component>
```

OU

```vue-html
<!-- Em todo lugar -->
<my-component></my-component>
```

</div>

## Notação de nomes de componentes em JS/JSX {#component-name-casing-in-js-jsx}

**Nomes de componentes em JS/[JSX](/guide/render-function#jsx) devem ser sempre PascalCase, apesar de que podem ser kebab-case dentro de strings para aplicações mais simples, que usam apenas registros globais de componentes  através de `app.component`.**

::: details Explicação Detalhada
No JavaScript, PascalCase é a convenção para classes e construtores - essencialmente, qualquer coisa que possa ter instâncias diferentes. Componentes Vue também possuem instâncias, então faz sentido também usar PascalCase. Como um benefício extra, usar PascalCase com JSX (e modelos) permite que os leitores do código consigam distinguir mais facilmente entre componentes e elementos HTML. 

Entretanto, para aplicações que usam **apenas** definições globais de componente via `app.component`, recomendamos que kebab-case seja usado. Os motivos são:

- É raro que componentes globais sejam referenciados no JavaScript, então seguir a convenção para o JavaScript faz menos sentido.
- Essas aplicações sempre incluem muito modelos dentro do DOM, onde [kebab-case **deve** ser usado](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Palavras completas em nomes de componente {#full-word-component-names}

**Nomes de componente devem preferir palavras completas ao invés de abreviações.**

O preenchimento automático em editores torna o custo de escrever nomes maiores muito baixo, enquanto a clareza que eles fornecem é inestimável. Abreviações incomuns, em particular, devem sempre ser evitadas.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Notação do nome de propriedades {#prop-name-casing}

**Nomes de propriedade devem sempre usar camelCase durante a declaração. Quando usadas dentro de modelos DOM, propriedades devem utilizar kebab-case. Modelos em Componentes de Arquivo Único e [JSX](/guide/extras/render-function#jsx-tsx) podem usar props tanto kebab-case ou camelCase. A notação deve ser consistente - se você escolher props com camelCase, certifique-se de não usar outras com kebab-case em sua aplicação**

<div class="style-example style-example-bad">
<h3>Ruim</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// para modelos DOM
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// para SFC - por favor certifique-se de que sua notação é consistente em seu projeto
// você pode usar qualquer convenção mas não recomendamos misturar os dois estilos diferentes de notação
<WelcomeMessage greeting-text="hi"/>
// ou
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// para modelos DOM
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Elementos com múltiplos atributos {#multi-attribute-elements}

**Elementos com múltiplos atributos devem sempre ocupar múltiplas linhas, com um atributo por linha.**

No JavaScript, dividir objetos com múltiplas propriedades por múltiplas linhas é considerada uma boa convenção, pois é muito mais fácil de se ler. Nossos modelos e [JSX](/guide/render-function#jsx) merecem a mesma consideração.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Expressões simples em modelos {#simple-expressions-in-templates}

**Modelos de componentes devem incluir apenas expressões simples, com expressões mais complexas sendo refatoradas em propriedades computadas ou métodos.**

Expressões complexas em seus templates os tornam menos declarativos. Devemos nos esforçar para descrever _o quê_ deve aparecer, não _como_ estamos computando aquele valor. Propriedades computadas e métodos também permitem que o código seja reutilizado.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<!-- In a template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// A expressão complexa foi movida para uma propriedade computada
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// A expressão complexa foi movida para uma propriedade computada
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Propriedades computadas simples {#simple-computed-properties}

**Propriedades computadas complexas devem ser divididas em propriedades computadas mais simples sempre que possível.**

::: details Explicação Detalhada
Propriedades computadas mais simples e bem nomeadas são:

- **Mais fáceis de testar**

  Quando cada propriedade computada contém somente uma expressão muito simples, com poucas dependências, é muito mais fácil escrever testes confirmando que elas funcionam corretamente.

- **Mais fáceis de ler**

  Simplificar propriedades computadas força você a dar a cada valor um nome descritivo, mesmo que não seja reutilizado. Isso torna mais fácil para outros desenvolvedores (e você no futuro) a focarem no código que manipulam e no que está acontecendo.

- **Mais adaptáveis a novas exigências**

  Qualquer valor que possa ser nomeado pode ser útil para a visualização. Por exemplo, podemos decidir mostrar a mensagem informando ao usuário quanto dinheiro ele economizou. Também podemos decidir como calcular taxas das vendas, mas talvez mostrá-los separadamente, ao invés de uma parte do preço final.

  Propriedades computadas pequenas e focadas fazem menos pressuposições sobre como a informação será usada, e portanto exigem menos refatoramento conforme as exigências mudam.
  :::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Aspas em valores de atributos {#quoted-attribute-values}

**Valores de atributos HTML não vazios devem sempre estar dentro de aspas (simples ou duplas, a qual não for usada no JS).**

Enquanto valores de atributo sem qualquer espaço não exigem aspas no HTML, esta prática frequentemente leva a _evitar_ espaços, tornando os valores dos atributos menos legíveis.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Abreviação de diretrizes {#directive-shorthands}

**Abreviações de diretrizes (`:` para `v-bind:`, `@` para `v-on:` e `#` para `v-slot`) devem ser usadas sempre ou nunca.**

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Aqui pode ser um título de página</h1>
</template>

<template v-slot:footer>
  <p>Aqui alguma informação de contato</p>
</template>
```

```vue-html
<template #header>
  <h1>Aqui pode ser um título de página</h1>
</template>

<template #footer>
  <p>Aqui alguma informação de contato</p>
</template>
```

</div>
