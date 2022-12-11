# Propriedades {#props}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Aula Gratuita Sobre Propriedades de Vue.js"/>
</div>

## Declaração de Propriedades {#props-declaration}

Os componentes de Vue requerem declaração de propriedades explícita para que a Vue saiba quais propriedades externas passadas para o componente devem ser tratadas como atributos que caiem (os quais discutiremos na [sua secção dedicada](/guide/components/attrs)).

<div class="composition-api">

Nos componentes de ficheiro único utilizando `<script setup>`, as propriedades podem ser declaradas utilizando a macro `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

Nos componentes quem não utilizam `<script setup>`, as propriedades são declaradas utilizando a opção [`props`](/api/options-state.html#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() recebe as propriedades como primeiro argumento.
    console.log(props.foo)
  }
}
```

Repara que o primeiro argumento passado para `defineProps()` é o mesmo valor fornecido para as opções `props`: a mesma API de opções de propriedades é partilhada entre os dois estilos de declaração.

</div>

<div class="options-api">

As propriedades são declaradas utilizando a opção [`props`](/api/options-state.html#props):

```js
export default {
  props: ['foo'],
  created() {
    // as propriedades são expostas no `this`
    console.log(this.foo)
  }
}
```

</div>

Além disto para declarar propriedades utilizando um arranjo de sequências de caracteres, também podemos utilizar a sintaxe de objetos:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// com <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// sem <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

Para cada propriedade na sintaxe de declaração de objeto, a chave é o nome da propriedade, enquanto o valor deve ser a função construtora do tipo esperado.

Isto não apenas documenta o teu componente, mas também avisará outros programadores utilizando o teu componente na consola do navegador caso eles passarem o tipo errado. Nós discutiremos mais em detalhes a respeito da [validação de propriedade](#validação-de-propriedade) mais adiante nesta página.

<div class="options-api">

Consulte também: [Atribuindo Tipos as Propriedades de Componente](/guide/typescript/options-api.html#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Se estiveres utilizando TypeScript com `<script setup>`, também é possível declarar as propriedades utilizando as anotações de tipo puras:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Mais detalhes: [Atribuindo Tipos as Propriedades de Componente](/guide/typescript/composition-api.html#typing-component-props) <sup class="vt-badge ts" />

</div>

## Propriedade Passando Detalhes {#prop-passing-details}

### Caixa do Nome de Propriedade {#prop-name-casing}

Nós declaramos nomes de propriedade longos utilizando "camelCase" porque isto evita ter que utilizar aspas quando estivermos utiliza-os como chaves de propriedade, e permite-nos referenciá-los diretamente nas expressões de modelo de marcação porque são identificadores de JavaScript válidos:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```
Tecnicamente, também podemos utilizar a "camelCase" quando estamos passando propriedades para um componente filho (exceto nos [modelos de marcação de DOM](/guide/essentials/component-basics.html#dom-template-parsing-caveats)). No entanto, a convenção é a utilização de "kebab-case" em todos os casos para alinhar com os atributos de HTML:

```vue-html
<MyComponent greeting-message="hello" />
```

Nós utilizamos ["PascalCase" para marcadores de componente](/guide/components/registration.html#component-name-casing) quando possível porque ele melhora a legibilidade do modelo de marcação diferenciando componentes de Vue dos elementos nativos. No entanto, não existe tantos benefícios práticos para utilização de "camelCase" quando estivermos passando propriedades, então escolhemos seguir cada uma das convenções da linguagem.

### Propriedades Estáticas versus Propriedades Dinâmicas {#static-vs-dynamic-props}

Até aqui, vimos propriedades passadas como valores estáticos, desta maneira:

```vue-html
<BlogPost title="My journey with Vue" />
```

Também temos visto propriedades atribuídas dinamicamente com a `v-bind` ou com sua forma abreviada `:`, tal como em:

```vue-html
<!-- Atribui dinamicamente o valor de um variável -->
<BlogPost :title="post.title" />

<!-- Atribui dinamicamente o valor de uma expressão complexa -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### Passando Tipos de Valor Diferentes {#passing-different-value-types}

Nos dois exemplos acima, nós passamos valores de sequência de caracteres, mas _qualquer_ tipo de valor pode ser passado para uma propriedade.

#### Number (Número) {#number}

```vue-html
<!-- Embora `42` seja estático, precisamos de `v-bind` para dizer a Vue que -->
<!-- isto é uma expressão de JavaScript em vez de uma sequência de caracteres. -->
<BlogPost :likes="42" />

<!-- Atribui dinamicamente o valor de uma variável. -->
<BlogPost :likes="post.likes" />
```

#### Boolean (Booleano) {#boolean}

```vue-html
<!-- Incluir a propriedade sem valor implicará o `true`. -->
<BlogPost is-published />

<!-- Embora `false` seja estático, precisamos de `v-bind` para dizer a Vue que -->
<!-- isto é uma expressão de JavaScript em vez de uma sequência de caracteres. -->
<BlogPost :is-published="false" />

<!-- Atribui dinamicamente o valor de uma variável. -->
<BlogPost :is-published="post.isPublished" />
```

#### Array (Arranjo) {#array}

```vue-html
<!-- Embora o arranjo seja estático, precisamos de `v-bind` para dizer a Vue que -->
<!-- isto é uma expressão de JavaScript em vez de uma sequência de caracteres. -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Atribui dinamicamente o valor de uma variável. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Object (Objeto) {#object}

```vue-html
<!-- Embora o objeto seja estático, precisamos de `v-bind` para dizer a Vue que -->
<!-- isto é uma expressão de JavaScript em vez de uma sequência de caracteres. -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Atribui dinamicamente o valor de uma variável. -->
<BlogPost :author="post.author" />
```

### Vinculando Várias Propriedades Utilizando um Objeto {#binding-multiple-properties-using-an-object}

Se quiseres passar todas as propriedades de um objeto como propriedades, podes utilizar a [`v-bind` sem nenhum argumento](/guide/essentials/template-syntax.html#vincular-vários-atributos-dinamicamente) (`v-bind` no lugar de `:prop-name`). Por exemplo, dado um objeto `post`:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

O seguinte modelo de marcação:

```vue-html
<BlogPost v-bind="post" />
```

Será equivalente a:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Fluxo de Dados de Uma Via {#one-way-data-flow}

Todas as propriedades criam uma **vinculação de uma via para baixo** entre a propriedade do componente filho e a propriedade do componente pai: quando a propriedade do componente pai atualiza, ela afluirá para baixo para o componente filho, mas não ao contrário. Isto impedi os componentes filho de acidentalmente alterar o estado do componente pai, o que pode tornar o fluxo de dados da tua aplicação muito mais difícil de entender.

Além disto, toda vez que o componente pai é atualizado, todas as propriedades no componente filho serão atualizadas com o valor mais recente. Isto significa que **não** deves tentar alterar uma propriedade dentro de um componente filho. Se o fizeres, a Vue avisar-te-á na consola:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ aviso, "props" sõo para leitura apenas!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ aviso, "props" sõo para leitura apenas!
    this.foo = 'bar'
  }
}
```

</div>

Existem normalmente dois casos onde é tentador alterar uma propriedade:

1. **A propriedade é utilizada para passar um valor inicial; o componente filho deseja utilizá-la como uma propriedade de dados local mais tarde.** Neste caso, é melhor definir uma propriedade de dados local que utiliza a propriedade como seu valor inicial:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // "counter" apenas utiliza "props.initialCounter" como valor inicial;
   // ela está desconectada das futuras atualizações da propriedade.
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // "counter" apenas utiliza "props.initialCounter" como valor inicial;
         // ela está desconectada das futuras atualizações da propriedade.
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **A propriedade é passada como um valor bruto que precisa ser transformado.** Neste caso, é melhor definir uma propriedade computada utilizando o valor da propriedade:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // propriedade computada que atualiza-se quando a propriedade muda
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // propriedade computada que atualiza-se quando a propriedade muda
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### Alterando Propriedades de Objeto / Arranjo {#mutating-object-array-props}

Quando objetos e arranjos são passados como propriedades, embora o componente filho não possa alterar a vinculação da propriedade, ele **será** capaz de alterar o objeto ou propriedades encaixadas do arranjo. Isto é porque na JavaScript os objetos e arranjos são passados por referência, e é exorbitantemente dispendioso para a Vue impedir tais mutações.

A principal desvantagem de tais mutações é que ela permite ao componente filho afetar o estado do componente pai de uma maneira que não é óbvia para o componente pai, potencialmente tornando mais difícil raciocinar a respeito do fluxo de dados no futuro. Como uma boa prática, deves evitar tais mutações a menos que o componente pai e componente filho estejam fortemente atrelados de propósito. Na maioria dos casos, o componente filho deve [emitir um evento](/guide/components/events.html) para deixar o componente pai realizar a mutação.

## Validação de Propriedade {#prop-validation}

Os componentes podem especificar requisitos para suas propriedades, tais como os tipos que já viste. Se um requisito não for cumprido, a Vue avisar-te-á na consola de JavaScript do navegador. Isto é especialmente útil quando estamos programando um componente que está destinado a ser utilizado por outros.

Para especificar validações de propriedade, podes fornecer um objeto com os requisitos de validação para a <span class="composition-api">macro `defineProps()`</span><span class="options-api">opção `props`</span>, no lugar de um arranjo de sequências de caracteres. Por exemplo:

<div class="composition-api">

```js
defineProps({
  // Verificação de tipo básica
  //  (valores `null` e `undefined` permitirão qualquer tipo)
  propA: Number,
  // Vários tipos possíveis
  propB: [String, Number],
  // Sequência de caracteres (ou string) obrigatória
  propC: {
    type: String,
    required: true
  },
  // Número com um valor predefinido
  propD: {
    type: Number,
    default: 100
  },
  // Objeto com um valor predefinido
  propE: {
    type: Object,
    // Os valores predefinidos de Objeto ou Array devem ser retornados de
    // uma função de fabricação. A função recebe as propriedades brutas
    // recebidas pelo componente como argumento.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Função de validação personalizada
  propF: {
    validator(value) {
      // O valor deve corresponder a uma destas sequências de caracteres
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Função com um valor predefinido
  propG: {
    type: Function,
    /*
      Ao contrário do valor predefinido de objeto ou arranjo,
      isto não é uma função de fabricação - isto é uma função
      que serve como um valor predefinido.
    */
    default() {
      return 'Default function'
    }
  }
})
```

:::tip Dica
O código dentro argumento de `defineProps()` **não pode acessar outras variáveis declaradas na `<script setup>`**, porque a expressão inteira é movida para um escopo da função externa quando compilado.
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // Verificação de tipo básica
    //  (valores `null` e `undefined` permitirão qualquer tipo)
    propA: Number,
    // Vários tipos possíveis
    propB: [String, Number],
    // Sequência de caracteres (ou string) obrigatória
    propC: {
      type: String,
      required: true
    },
    // Número com um valor predefinido
    propD: {
      type: Number,
      default: 100
    },
    // Objeto com um valor predefinido
    propE: {
      type: Object,
      // Os valores predefinidos de Objeto ou Array devem ser retornados de
      // uma função de fabricação. A função recebe as propriedades brutas
      // recebidas pelo componente como argumento.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Função de validação personalizada
    propF: {
      validator(value) {
        // O valor deve corresponder a uma destas sequências de caracteres
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Função com um valor predefinido
    propG: {
      type: Function,
      /*
        Ao contrário do valor predefinido de objeto ou arranjo,
        isto não é uma função de fabricação - isto é uma função
        que serve como um valor predefinido.
      */
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

Detalhes adicionais:

- Todas propriedades são opcionais por padrão, a menos que `required: true` seja especificado.

- Uma propriedade opcional ausente outra senão `Boolean` terá o valor `undefined`.
  
- As propriedades ausentes de `Boolean` serão fundidas ao `false`. Tu deves definir um valor `default` para ela para teres o comportamento desejado.

- Se um valor `default` for especificado, ele será utilizado se o valor da propriedade resolvida for `undefined` - isto inclui ambos quando a propriedade está ausente, ou quando valor `undefined` explícito for passado.

Quando a validação da propriedade falhar, a Vue produzirá um aviso de consola (se estiveres utilizando a construção de desenvolvimento).

<div class="composition-api">

Se estiveres utilizando [declarações de propriedades baseadas em tipo](/api/sfc-script-setup.html#typescript-only-features), a Vue se esforçará em compilar as anotações de tipo para declarações de propriedade de tempo de execução equivalentes. Por exemplo, `defineProps<{ msg: string }>` serão compiladas para `{ msg: { type: String, required: true } }`.

</div>
<div class="options-api">

:::tip Nota
Nota que as propriedades são validadas **antes** da instância do componente ser criada, assim as propriedades da instância (por exemplo, `data`, `computed`, etc) não estarão disponíveis dentro das funções `default` ou `validator`.
:::

</div>

### Verificações de Tipo de Tempo de Execução {#runtime-type-checks}

Os `type` podem ser um dos seguintes construtores nativos:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

Além disto, `type` também pode ser uma classe ou função construtora personalizada e a asserção será feita com uma verificação de `instanceof`. Por exemplo, dada a seguinte classe:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Tu poderias utilizá-la como tipo da propriedade:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

para validar aquele valor da propriedade `author` que foi criado com `new Person`.

## Fundição de Booleano {#boolean-casting}

As propriedades com tipo `Boolean` têm regras de fundição especiais para imitarem o comportamento dos atributos booleanos nativos. Dado o `<MyComponent>` com a seguinte declaração:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

O componente pode ser utilizado desta maneira:

```vue-html
<!-- equivalente a passagem :disabled="true" -->
<MyComponent disabled />

<!-- equivalente a passagem :disabled="false" -->
<MyComponent />
```

Quando uma propriedade é declarada para permitir vários tipos, por exemplo:

<div class="composition-api">

```js
defineProps({
  disabled: [Boolean, Number]
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: [Boolean, Number]
  }
}
```

</div>

As regras de fundição para o `Boolean` aplicar-se-ão independentemente da ordem de aparência de tipo.