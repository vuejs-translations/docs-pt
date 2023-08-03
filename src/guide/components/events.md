<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  const hashes = [
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ]

  if (hashes.includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Eventos de Componente {#component-events}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Aula Gratuita Sobre a Definição de Eventos Personalizados na Vue.js"/>
</div>

## Emitindo e Ouvindo Eventos {#emitting-and-listening-to-events}

Um componente pode emitir eventos personalizados diretamente nas expressões de modelo de marcação (por exemplo, num manipulador de `v-on`) utilizando o método `$emit` embutido:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

<div class="options-api">

O método `$emit()` também está disponível na instância do componente como `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('submit')
    }
  }
}
```

</div>

O componente pai pode então ouvi-lo utilizando a `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

O modificador `.once` também é suportado nos ouvintes de evento do componente:

```vue-html
<MyComponent @some-event.once="callback" />
```

Tal como os componentes e propriedades, os nomes de eventos fornecem uma transformação de caixa automática. Repara que nós emitimos um evento em "camelCase", mas podemos ouvir ele utilizando um ouvinte em "kebab-case" no componente pai. De acordo com a [caixa dos caracteres das propriedades](/guide/components/props#prop-name-casing), recomendamos a utilização de ouvintes de evento em "kebab-case" nos modelos de marcação.

:::tip DICA
Ao contrário os eventos de DOM nativos, os eventos emitidos do componente **não** transbordam. Tu só podes ouvir os eventos emitidos por um componente filho direto.
:::

## Argumentos de Evento {#event-arguments}

Algumas vezes é útil emitir um valor especifico com um evento. Por exemplo, podemos desejar que o componente `<BlogPost>` esteja encarregado do por quanto aumentar o texto. Naqueles casos, podemos passar argumentos adicionais para a `$emit` para fornecer este valor:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Então, quando ouvirmos o evento no componente pai, podemos utilizar uma função em flecha em linha como ouvinte, que permite-nos acessar o argumento do evento:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Ou, se o manipulador de evento for um método:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Então o valor será passado como primeiro parâmetro daquele método:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Todos os argumentos adicionais passados para o `$emit()` depois do nome do evento serão enviados para o ouvinte. Por exemplo, com `$emit('foo', 1, 2, 3)` a função ouvinte receberá três argumentos.
:::

## Declarando Eventos Emitidos {#declaring-emitted-events}

Um componente pode declarar explicitamente os eventos que ele emitirá usando a <span class="composition-api">macro [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">opção [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

O método `$emit` que utilizamos no `<template>` não é acessível dentro da secção `<script setup>` de um componente, mas a `defineEmits()` retorna uma função equivalente que podemos utilizar no lugar daquela:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

A macro `defineEmits()` **não pode** ser utilizada dentro de uma função, ela deve ser colocada diretamente dentro da `<script setup>`, conforme está no exemplo acima.

Se estiveres utilizando um função `setup` explícita ao invés de `<script setup>`, os eventos devem ser declarados utilizando a opção [`emits`](/api/options-state#emits), e a função `emit` é exposta no contexto de `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Tal como com outras propriedades do contexto de `setup()`, `emit` pode ser desestruturada com segurança:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

A opção `emits` também suporta uma sintaxe de objeto, que permite-nos realizar validação de tempo de execução da carga dos eventos emitidos:

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  submit(payload) {
    // retorna `true` ou `false` para indicar
    // que a validação passou ou falhou
  }
})
</script>
```

Se estiveres utilizando a TypeScript com a `<script setup>`, também é possível declarar eventos emitidos utilizando as puras anotações de tipo:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Mais detalhes: [Atribuindo Tipos as Emissões de Componente](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload) {
      // retorna `true` ou `false` para indicar
      // que a validação passou ou falhou
    }
  }
}
```

Consulte também: [Atribuindo Tipos as Emissões de Componente](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Ainda que opção, é recomendado definir todos eventos emitidos em ordem para documentar melhor como um componente deveria funcionar. Também permite a Vue excluir ouvintes conhecidos dos [atributos que caiem](/guide/components/attrs#v-on-listener-inheritance).

:::tip DICA
Se um evento nativo (por exemplo, `click`) for definido na opção `emits`, o ouvinte agora apenas ouvirá os eventos `click` emitidos pelo componente e não mais responderá aos outros eventos `click` nativos.
:::

## Validação de Eventos {#events-validation}

Semelhante a validação de tipo de propriedade, um evento emitido pode ser validado se for definido com a sintaxe de objeto no lugar da sintaxe de arranjo.

Para adicionar a validação, o evento é atribuído à uma função que recebe os argumentos passados para chamada de <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> e retorna um booleano para indicar se o evento é válido ou não.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Sem validação
  click: null,

  // Valida o evento "submit"
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Sem validação
    click: null,

    // Valida o evento "submit"
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
