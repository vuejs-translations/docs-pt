# Propriedades {#props}

> Neste material assume-se conhecimento dos [Fundamentos dos Componentes](/guide/essentials/component-basics). Precisamos entender o básico de componentes para acompanhar este material.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Aula Gratuita de Propriedades de Vue.js"/>
</div>

## Declaração das Propriedades {#props-declaration}

Os componentes da Vue exigem a declaração explícita das propriedades para que a Vue saiba quais propriedades externas passadas ao componente deve ser tratadas como atributos de passagem (que serão discutidos na [sua secção dedicada](/guide/components/attrs)).

<div class="composition-api">

Nos componentes de ficheiro único que usam `<script setup>`, as propriedades podem ser declaradas com o uso da macro `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

Nos componentes que não usam `<script setup>`, as propriedades são declaradas com o uso da opção [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() recebe as propriedades como primeiro argumento.
    console.log(props.foo)
  }
}
```

Precisamos notar que o argumento passado à `defineProps()` é o mesmo valor fornecido às opções da `props`: a mesma API de opções é partilhada entre os dois estilos de declaração.

</div>

<div class="options-api">

As propriedades são declaradas com o uso da opção [`props`](/api/options-state#props):

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

Para além de declararmos as propriedades com o uso de um vetor de sequências de caracteres, também podemos usar a sintaxe de objeto:

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

Isto não apenas documenta o nosso componente, mas também avisará outros programadores que usam o nosso componente na consola do navegador caso estes passarem o tipo errado. Nós discutiremos mais detalhes sobre [validação de propriedade](#prop-validation) mais adiante nesta página.

<div class="options-api">

Consultar também: [Tipificação das Propriedades do Componente](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Se usarmos a TypeScript com `<script setup>`, é possível também declarar as propriedades com o uso de anotações de tipo puras:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Mais detalhes: [Tipificação das Propriedades do Componente](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

## Detalhes da Passagem de Propriedade {#prop-passing-details}

### Caixa do Nome de Propriedade {#prop-name-casing}

Nós declaramos nomes de propriedades longos usando a caixaDeCamelo porque isto evita ter de usar aspas quando os usamos como chaves de propriedade e permite-nos referenciá-los diretamente em expressões do modelo de marcação porque são identificadores de JavaScript válidos:

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

Tecnicamente, também podemos usar a caixaDeCamelo ao passar propriedades a um componente filho, (exceto nos [modelos de marcação do modelo de objeto do documento incorporado](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). No entanto, a convenção é usar a caixa-espetada em todos os casos para alinhar com os atributos de HTML:

```vue-html
<MyComponent greeting-message="hello" />
```

Nós usamos a [CaixaPascal para os marcadores de componente](/guide/components/registration#component-name-casing) quando possível porque melhora a legibilidade do modelo de marcação ao diferenciar os componentes de Vue dos elementos nativos. No entanto, não existe muito benefícios práticos em usar caixaDeCamelo ao passar propriedades, por isto optamos por seguir as seguintes convenções de cada linguagem.

### Propriedades Estáticas vs Propriedades Dinâmicas {#static-vs-dynamic-props}

Por enquanto, vimos propriedades passadas como valores estáticos, como em:

```vue-html
<BlogPost title="My journey with Vue" />
```

Também vimos propriedades atribuídas dinamicamente com a `v-bind` ou seu atalho `:`, como em:

```vue-html
<!-- Atribuir dinamicamente o valor duma variável -->
<BlogPost :title="post.title" />

<!-- Atribuir dinamicamente o valor duma expressão complexa -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### Passagem de Diferentes Tipos de Valores {#passing-different-value-types}

Nos dois exemplos acima, passamos valores de sequência de caracteres, mas _qualquer_ tipo de valor pode ser passado a uma propriedade.

#### `Number` (Número) {#number}

```vue-html
<!-- Embora `42` seja estático, precisamos de `v-bind` para dizer -->
<!-- a Vue que isto é uma expressão de JavaScript em vez duma -->
<!-- sequência de caracteres. -->
<BlogPost :likes="42" />

<!-- Atribuir dinamicamente ao valor duma variável. -->
<BlogPost :likes="post.likes" />
```

#### `Boolean` (Booleano) {#boolean}

```vue-html
<!-- A inclusão da propriedade sem valor implicará `true`. -->
<BlogPost is-published />

<!-- Embora `false` seja estático, precisamos de `v-bind` para dizer -->
<!-- a Vue que isto é uma expressão de JavaScript em vez duma -->
<!-- sequência de caracteres. -->
<BlogPost :is-published="false" />

<!-- Atribuir dinamicamente ao valor duma variável. -->
<BlogPost :is-published="post.isPublished" />
```

#### `Array` (Vetor) {#array}

```vue-html
<!-- Embora o vetor seja estático, precisamos de `v-bind` para dizer -->
<!-- a Vue que isto é uma expressão de JavaScript em vez duma -->
<!-- sequência de caracteres. -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Atribuir dinamicamente ao valor duma variável. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### `Object` (Objeto) {#object}

```vue-html
<!-- Embora o objeto seja estático, precisamos de `v-bind` para dizer -->
<!-- a Vue que isto é uma expressão de JavaScript em vez duma -->
<!-- sequência de caracteres. -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Atribuir dinamicamente ao valor duma variável. -->
<BlogPost :author="post.author" />
```

### Vínculo de Várias Propriedades Usando um Objeto {#binding-multiple-properties-using-an-object}

Se quisermos passar todas as propriedades dum objeto como propriedades, podemos usar a [`v-bind` sem um argumento](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` em vez de `:prop-name`). Por exemplo, dado um objeto `post`:

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

## Fluxo de Dados Unidirecional {#one-way-data-flow}

Todas as propriedades formam um **vínculo unidirecional descendente** entre a propriedade filha e a propriedade pai: quando a propriedade pai é atualizada, esta passa à propriedade filha, mas não o contrário. Isto evita que os componentes filhos alterem acidentalmente o estado do pai, o que pode tornar o fluxo de dados da nossa aplicação mais difícil de compreender.

Para além disto, sempre que o componente pai for atualizado, todas as propriedades no componente filho serão atualizadas com valor mais recente. Isto significa que não devemos tentar alterar uma propriedade dentro dum componente filho. Se o fizermos, a Vue avisar-nos-á na consola:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ aviso, "props" são só de leitura!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ aviso, "props" são só de leitura!
    this.foo = 'bar'
  }
}
```

</div>

Normalmente, existem dois casos em que é tentar alterar uma propriedade:

1. **A propriedade é usada para passar um valor inicial; o componente filho pretende usá-la posteriormente como uma propriedade de dados local.** Neste caso, é melhor definir uma propriedade de dados local que usa uma propriedade como seu valor inicial: 

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // "counter" só usa "props.initialCounter" como valor inicial;
   // é desligada de futuras atualizações de propriedade.
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // "counter" só usa "props.initialCounter" como valor inicial;
         // é desligada de futuras atualizações de propriedade.
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **A propriedade é passada como um valor bruto que precisa de ser transformado.** Neste caso,é melhor definir uma propriedade computada usando o valor da propriedade:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // propriedade computada que se atualiza automaticamente
   // quando a propriedade for alterada
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // propriedade computada que se atualiza automaticamente
       // quando a propriedade for alterada
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### Alteração de Propriedades de Objeto ou Vetor {#mutating-object-array-props}

Quando os objetos e os vetores são passados como propriedades, embora o componente filho não possa alterar o vínculo da propriedade, **será** capaz de alterar as propriedades encaixadas do objeto ou do vetor. Isto acontece porque na JavaScript os objetos e vetores são passados por referência, e é excessivamente dispendioso para a Vue evitar tais mutações.

A principal desvantagem de tais mutações é que permite que o componente filho afete o estado do componente pai duma maneira que não é óbvia para o componente pai, tornando potencialmente mais difícil raciocinar sobre o fluxo de dados no futuro. Como boa prática, devemos evitar essas mutações a menos que o pai e o filho estejam fortemente acoplados por natureza. Na maioria dos casos, o filho deve [emitir um evento](/guide/components/events) para permitir que o pai realize a mutação.

## Validação de Propriedade {#prop-validation}

Os componentes podem especificar requisitos para suas propriedades, como os tipos que já vimos. Se um requisito não for cumprido, a Vue avisar-nos-á na consola de JavaScript do navegador. Isto é especialmente útil quando desenvolvemos um componente que se destina a ser usado por outros.

Para especificar as validações de propriedade, podemos fornecer um objeto com os requisitos de validação a <span class="composition-api">macro `defineProps()`</span><span class="options-api">opção `props`</span>, no lugar dum vetor de sequências de caracteres. Por exemplo:

<div class="composition-api">

```js
defineProps({
  // Verificação de tipo básica
  //  (valores `null` e `undefined` permitirão qualquer tipo)
  propA: Number,
  // Vários tipos possíveis
  propB: [String, Number],
  // Sequência de caracteres obrigatória
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
    // Os valores predefinidos de objeto ou vetor devem
    // ser retornados duma função de fábrica. A função
    // recebe as propriedades brutas recebidas pelo 
    // componente como argumento.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Função de validação personalizada
  // propriedades completas passadas como
  // segundo argumento na 3.4+
  propF: {
    validator(value, props) {
      // O valor deve corresponder uma destas
      // sequências de caracteres
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Função com um valor predefinido
  propG: {
    type: Function,
    // Ao contrário do objeto ou vetor predefinidos, 
    // não se trata duma função de fábrica - esta é uma
    // função que serve de valor predefinido.
    default() {
      return 'Default function'
    }
  }
})
```

:::tip DICA
O código dentro do argumento da `defineProps()` **não pode acessar outras variáveis declaradas no `<script setup>`**, porque a expressão inteira é movida para um contexto de função externa quando compilada.
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
    // Sequência de caracteres obrigatória
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
      // Os valores predefinidos de objeto ou vetor devem
      // ser retornados duma função de fábrica. A função
      // recebe as propriedades brutas recebidas pelo 
      // componente como argumento.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Função de validação personalizada
    // propriedades completas passadas como
    // segundo argumento na 3.4+
    propF: {
      validator(value) {
        // O valor deve corresponder uma destas
        // sequências de caracteres
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Função com um valor predefinido
    propG: {
      type: Function,
      // Ao contrário do objeto ou vetor predefinidos, 
      // não se trata duma função de fábrica - esta é uma
      // função que serve de valor predefinido.
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

Detalhes adicionais:

- Todas as propriedades são opcionais por padrão, a menos que `required: true` seja especificado.

- Uma propriedade opcional ausente que não seja `Boolean` terá o valor `undefined`.
  
- As propriedades ausentes de `Boolean` serão convertidas para `false`. Nós podemos mudar isto definindo um `default: undefined` a esta — isto é, `default: undefined` para comportar-se como uma propriedade não Booleana.

- Se um valor `default` for especificado, esta será usada se o valor da propriedade resolvida for `undefined` — isto inclui tanto quando a propriedade está ausente, ou quando um valor `undefined` explícito é passado.

Quando a validação da propriedade falhar, a Vue produzirá um aviso na consola (se estivermos usando a construção de desenvolvimento).

<div class="composition-api">

Se estivermos usando [declarações de propriedades baseadas em tipos](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />, a Vue tentará o seu melhor para compilar as anotações de tipos em declarações de propriedades equivalentes em execução. Por exemplo, `defineProps<{ msg: string }>` será compilada para `{ msg: { type: String, required: true }}`.

</div>
<div class="options-api">

:::tip NOTA
É necessário notar que as propriedades são validadas **antes** da instância dum componente ser criada, portanto as propriedades da instância (por exemplo, `data`, `computed`, etc.) não estarão disponíveis dentro das funções `default` ou `validator`.
:::

</div>

### Verificações de Tipo da Execução {#runtime-type-checks}

O `type` pode ser um dos seguintes construtores nativos:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

Além disto, `type` também pode ser uma classe personalizada ou função construtora e a asserção será feita com uma verificação de `instanceof`. Por exemplo, dada a seguinte classe:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Nós poderíamos usá-la como um tipo de propriedade:

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

A Vue usará `instanceof Person` para validar se o valor da propriedade `author` é de fato uma instância da classe `Person`.

## Conversão Booleana {#boolean-casting}

As propriedades do tipo `Boolean` possuem regras especiais de conversão para imitarem o comportamento dos atributos booleanos nativos. Dado um `<MyComponent>` com a seguinte declaração:

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

O componente pode ser usado da seguinte maneira:

```vue-html
<!-- equivalente à passagem de :disabled="true" -->
<MyComponent disabled />

<!-- equivalente à passagem de :disabled="false" -->
<MyComponent />
```

Quando uma propriedade é declarada para permitir vários tipos, as regras de conversão para `Boolean` também serão aplicadas. No entanto, existe uma vantagem quando ambos `String` e `Boolean` são permitidos — a regra de conversão de `Boolean` só se aplica se `Boolean` aparecer antes de `String`:

<div class="composition-api">

```js
// `disabled` será convertido para `true`
defineProps({
  disabled: [Boolean, Number]
})
  
// `disabled` será convertido para `true`
defineProps({
  disabled: [Boolean, String]
})
  
// `disabled` será convertido para `true`
defineProps({
  disabled: [Number, Boolean]
})
  
// `disabled` será analisado sintaticamente como
// uma sequência de caracteres vazia (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// `disabled` será convertido para `true`
export default {
  props: {
    disabled: [Boolean, Number]
  }
}
  
// `disabled` será convertido para `true`
export default {
  props: {
    disabled: [Boolean, String]
  }
}
  
// `disabled` será convertido para `true`
export default {
  props: {
    disabled: [Number, Boolean]
  }
}
  
// `disabled` será analisado sintaticamente como
// uma sequência de caracteres vazia (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
