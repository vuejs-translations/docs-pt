# Vinculações de Classe e Estilo

Uma necessidade comum para vinculação de dados é a manipulação de uma lista de classe do elemento e estilos em linha. Já que `class` e `style` são ambos atributos, podemos utilizar a `v-bind` para atribuí-los um valor de sequência de caracteres dinamicamente, muito parecido com outros atributos. No entanto, a tentativa de gerar estes valores utilizando concatenação de sequência de caracteres pode ser irritante e estar propenso a erro. Por esta razão, a Vue fornece otimizações especiais quando a `v-bind` é utilizada com a `class` e `style`. Além das sequências de caracteres, as expressões também podem avaliar para objetos ou arranjos.

## Vinculando Classes de HTML

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Aula Gratuita Sobre Classes de CSS Dinâmicas na Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Aula Gratuita Sobre Classes de CSS Dinâmicas na Vue.js"/>
</div>

### Vinculando aos Objetos

Nós podemos passar um objeto para `:class` (abreviação para `v-bind:class`) para alternar classes dinamicamente:

```vue-html
<div :class="{ active: isActive }"></div>
```

A sintaxe acima significa que a presença da classe `active` será determinada pela [veracidade](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) da propriedade de dados `isActive`.

Tu podes ter várias classes alternadas tendo mais campos no objeto. Além disto, a diretiva `:class` também pode coexistir com um atributo `class` simples. Assim dado o seguinte estado:

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

Ela interpretará:

```vue-html
<div class="static active"></div>
```

Quando `isActive` ou `hasError` mudar, a lista de classe será atualizada de acordo. Por exemplo, se `hasError` tornar-se `true`, a lista de classe tornar-se-á `"static active text-danger"`.

O objeto vinculado não tem de estar em linha:

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

Isto interpretará o mesmo resultado. Nós também podemos vincular a uma [propriedade computada](./computed) que retorna um objeto. Isto é um padrão poderoso e comum:

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

### Vinculando aos Arranjos

Nós podemos vincular `:class` a um arranjo para aplicar uma lista de classes:

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

Qual interpretará:

```vue-html
<div class="active text-danger"></div>
```

Se gostarias também de alternar condicionalmente uma classe na lista, podes fazer isto com uma expressão ternário:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Isto sempre aplicará `errorClass`, mas `activeClass` só será aplicada quando `isActive` for verdadeiro.

No entanto, isto pode ser um pouco verboso se tiveres várias classes condicionais. É por isto que também é possível utilizar uma sintaxe de objeto dentro da sintaxe de arranjo:

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### Com Componentes

> Esta secção presume conhecimento de [Componentes](/guide/essentials/component-basics). Esteja a vontade para ignorá-la e voltar mais tarde.

Quando utilizares o atributo `class` sobre um componente com um único elemento de raiz, aquelas classes serão adicionadas ao elemento de raiz do componente, e combinados com qualquer classe já existente nele.

Por exemplo, se tivermos um componente nomeado `MyComponent` com o seguinte modelo de marcação:

```vue-html
<!-- modelo de marcação do componente filho -->
<p class="foo bar">Hi!</p>
```

Então adicionamos algumas classes quando estivermos utilizando-o:

```vue-html
<!-- quando estivermos utilizando o componente -->
<MyComponent class="baz boo" />
```

O HTML interpretado será:

```vue-html
<p class="foo bar baz boo">Hi</p>
```

O mesmo é verdadeiro para vinculações de classe:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Quando `isActive` é verdadeiro, o HTML interpretado será:

```vue-html
<p class="foo bar active">Hi</p>
```

Se o teu componente tiver vários elementos de raiz, precisarias definir qual elemento receberá esta classe. Tu podes fazer isto utilizando a propriedade `$attrs` de componente:

```vue-html
<!-- modelo de marcação de MyComponent utilizando $attrs -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

Interpretará

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

Tu podes aprender mais a respeito da herança de atributo de componente na secção [Atributos](/guide/components/attrs.html)

## Vinculando Estilos Em Linha

### Vinculando aos Objetos

O `:style` suporta a vinculação à valores de objeto de JavaScript - ele corresponde a uma [propriedade `style` do elemento HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

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

Ainda que as chaves em "camelCase" sejam recomendadas, `:style` também suporta as chaves de propriedade de CSS em "kebab-case" (corresponde a como elas são utilizadas de fato na CSS) - por exemplo:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

Frequentemente é uma boa ideia vincular a um objeto de estilo diretamente para que o modelo de marcação esteja mais limpo:

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

Novamente, a vinculação de objeto de estilo é com frequência utilizado em conjunto com as propriedades computadas que retornam objetos.

### Vinculando aos Arranjos

Nós podemos vincular o `:style` a um arranjo de vários objetos de estilo. Estes objetos serão combinados e aplicados ao mesmo elemento:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Prefixação Automática

Quando utilizares uma propriedade de CSS que exija um [prefixo](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) no `:style`, a Vue adicionará automaticamente o prefixo apropriado. A Vua faz isto verificando no tempo de execução para ver quais propriedades de estilo são suportadas no atual navegador. Se o navegador não suportar uma propriedade em particular então várias variantes prefixadas serão testadas para tentar encontrar uma que é suportada.

### Vários Valores

Tu podes fornecer um arranjo de vários valores (prefixados) para uma propriedade de estilo, por exemplo:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Isto interpretará o último valor no arranjo que o navegador suportar. Neste exemplo, interpretará `display: flex` para navegadores que suportam a versão sem prefixo da caixa flexível ("flexbox").
