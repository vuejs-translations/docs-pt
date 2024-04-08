# Vínculos de Classe e Estilo {#class-and-style-bindings}

Um necessidade comum de vínculo de dados é a manipulação da lista de classe e estilos em linha dum elemento. Uma vez que `class` e `style` são ambos atributos, podemos usar a `v-bind` para atribuí-las um valor de sequência de caracteres dinamicamente, da mesma maneira que podemos fazer com os outros atributos. No entanto, tentar gerar estes valores usando a concatenação de sequência de caracteres pode ser aborrecido e propenso a erros. Por esta razão, a Vue fornece otimizações especiais quando `v-bind` é usada com `class` e `style`. Além das sequências de caracteres, as expressões também podem avaliar-se para objetos e vetores.

## Vinculando Classes de HTML {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Aula Gratuita Sobre Classes de CSS Dinâmicas na Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Aula Gratuita Sobre Classes de CSS Dinâmicas na Vue.js"/>
</div>

### Vinculando aos Objetos {#binding-to-objects}

Nós podemos passar um objeto à `:class` (abreviação para `v-bind:class`) para alternar classes dinamicamente:

```vue-html
<div :class="{ active: isActive }"></div>
```

A sintaxe acima significa que a presença da classe `active` será determinada pela [veracidade](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) da propriedade de dados `isActive`.

Nós podemos ter várias classes alternadas tendo mais campos no objeto. Além disto, a diretiva `:class` também pode coexistir com um atributo `class` simples. Então dado o seguinte estado:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

E o seguinte modelo de marcação:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Esta interpretará:

```vue-html
<div class="static active"></div>
```

Quando `isActive` ou `hasError` mudar, a lista de classe será atualizada de acordo. Por exemplo, se `hasError` tornar-se `true`, a lista de classe tornar-se-á `"static active text-danger"`.

O objeto vinculado não precisa de estar em linha:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Isto produzirá:

```vue-html
<div class="active"></div>
```

Nós também podemos vincular à uma [propriedade computada](./computed) que retorna um objeto. Isto é um padrão comum e poderoso:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Vinculando aos Vetores {#binding-to-arrays}

Nós podemos vincular `:class` à um vetor para aplicar uma lista de classes:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

O que interpretará:

```vue-html
<div class="active text-danger"></div>
```

Se também gostaríamos de alternar condicionalmente uma classe na lista, podemos fazer isto com uma expressão ternária:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Isto sempre aplicará `errorClass`, mas `activeClass` só será aplicada quando `isActive` for verdadeira.

No entanto, isto pode ser um pouco verboso se tivermos várias classes condicionais. É por isto que também é possível usar a sintaxe de objeto dentro da sintaxe de vetor:

```vue-html
<div :class="[{ activeClass: isActive }, errorClass]"></div>
```

### Com os Componentes {#with-components}

> Esta secção pressupõe o conhecimento de [Componentes](/guide/essentials/component-basics). Não precisamos hesitar em saltá-la e voltar mais tarde.

Quando usamos o atributo `class` sobre um componente com um único elemento de raiz, estas classes serão adicionadas ao elemento de raiz do componente, e combinados com qualquer classe já existente neste.

Por exemplo, se tivermos um componente nomeado `MyComponent` com o seguinte modelo de marcação:

```vue-html
<!-- modelo de marcação do componente filho -->
<p class="foo bar">Hi!</p>
```

Então adicionamos algumas classes quando o usamos:

```vue-html
<!-- quando usamos o componente -->
<MyComponent class="baz boo" />
```

O HTML interpretado será:

```vue-html
<p class="foo bar baz boo">Hi</p>
```

O mesmo é verdadeiro para os vínculos de classe:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Quando `isActive` for verdadeiro, o HTML interpretado será:

```vue-html
<p class="foo bar active">Hi</p>
```

Se o nosso componente tiver vários elementos de raiz, precisaríamos de definir qual elemento receberá esta classe. Nós podemos fazer isto usando a propriedade de componente `$attrs`:

```vue-html
<!-- modelo de marcação de MyComponent usando $attrs -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

Interpretará:

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

Nós podemos aprender mais sobre a herança de atributo do componente na seção [Atributos de Herança](/guide/components/attrs).

## Vinculando Estilos Em Linha {#binding-inline-styles}

### Vinculando aos Objetos {#binding-to-objects-1}

O `:style` suporta a vinculação à valores de objeto de JavaScript - este corresponde à uma [propriedade `style` do elemento de HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Embora as chaves de "caixaDeCamelo" sejam recomendadas, `:style` também suporta as chaves de propriedades de CSS em "caixa-espetada" (que corresponde à como são usadas na CSS real) - por exemplo:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

Muitas vezes é uma boa ideia vincular diretamente à um objeto de estilo para o modelo de marcação estar mais limpo:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

Novamente, o vínculo de estilo de objeto é muitas vezes usado em conjunto com as propriedades computadas que retornam objetos.

### Vinculando aos Vetores {#binding-to-arrays-1}

Nós podemos vincular o `:style` à um vetor de vários objetos de estilo. Estes objetos serão combinados e aplicados ao mesmo elemento:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Prefixação Automática {#auto-prefixing}

Quando usarmos uma propriedade de CSS que requer um [prefixo fornecedor](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) no `:style`, a Vue adicionará automaticamente o prefixo apropriado. A Vue faz isto verificando durante a execução quais propriedades de estilo são suportadas no navegador atual. Se o navegador não suportar uma propriedade em especial então várias variantes prefixadas serão testadas para tentar encontrar uma que seja suportada.

### Vários Valores {#multiple-values}

Nós podemos fornecer um vetor de vários valores (prefixados) à uma propriedade de estilo, por exemplo:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Isto apenas interpretará o último valor do vetor que o navegador suporta. Neste exemplo, interpretará `display: flex` para os navegadores que suportam a versão sem prefixo de caixa flexível, ou melhor dizendo `flexbox`.
