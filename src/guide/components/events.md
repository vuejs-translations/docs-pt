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

Tal como os componentes e propriedades, os nomes de eventos fornecem uma transformação de caixa automática. Repara que nós emitimos um evento em "camelCase", mas podemos ouvir ele utilizando um ouvinte em "kebab-case" no componente pai. De acordo com a [caixa dos caracteres das propriedades](/guide/components/props.html#prop-name-casing), recomendamos a utilização de ouvintes de evento em "kebab-case" nos modelos de marcação.

:::tip Dica
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

Um componente pode declarar explicitamente os eventos que ele emitirá usando a <span class="composition-api">macro [`defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)</span><span class="options-api">opção [`emits`](/api/options-state.html#emits)</span>:

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

Se estiveres utilizando um função `setup` explícita ao invés de `<script setup>`, os eventos devem ser declarados utilizando a opção [`emits`](/api/options-state.html#emits), e a função `emit` é exposta no contexto de `setup()`:

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

Mais detalhes: [Atribuindo Tipos as Emissões de Componente](/guide/typescript/composition-api.html#typing-component-emits) <sup class="vt-badge ts" />

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

Consulte também: [Atribuindo Tipos as Emissões de Componente](/guide/typescript/options-api.html#typing-component-emits) <sup class="vt-badge ts" />

</div>

Ainda que opção, é recomendado definir todos eventos emitidos em ordem para documentar melhor como um componente deveria funcionar. Também permite a Vue excluir ouvintes conhecidos dos [atributos que caiem](/guide/components/attrs.html#v-on-listener-inheritance).

:::tip Dica
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

## Utilização com `v-model` {#usage-with-v-model}

Os eventos personalizados também podem ser utilizados para criar entradas personalizadas que funcionam com a `v-model`. Lembra-te de que:

```vue-html
<input v-model="searchText" />
```

faz a mesma coisa que:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Quando utilizado sobre um componente, a `v-model` faz isto:

```vue-html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

Para isto de fato funcionar, o `<input>` dentro do componente deve:

- Vincular o atributo `value` à propriedade `modelValue`
- No `input`, emitir um evento `update:modelValue` com o novo valor

Cá está aquilo em ação:

<div class="options-api">

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>
<div class="composition-api">

```vue
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>

Agora a `v-model` deve funcionar perfeitamente com este componente:

```vue-html
<CustomInput v-model="searchText" />
```

<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDdXN0b21JbnB1dCBmcm9tICcuL0N1c3RvbUlucHV0LnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IEN1c3RvbUlucHV0IH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdoZWxsbydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxDdXN0b21JbnB1dCB2LW1vZGVsPVwibWVzc2FnZVwiIC8+IHt7IG1lc3NhZ2UgfX1cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkN1c3RvbUlucHV0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ21vZGVsVmFsdWUnXSxcbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnXVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGlucHV0XG4gICAgOnZhbHVlPVwibW9kZWxWYWx1ZVwiXG4gICAgQGlucHV0PVwiJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAvPlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBDdXN0b21JbnB1dCBmcm9tICcuL0N1c3RvbUlucHV0LnZ1ZSdcbiAgXG5jb25zdCBtZXNzYWdlID0gcmVmKCdoZWxsbycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8Q3VzdG9tSW5wdXQgdi1tb2RlbD1cIm1lc3NhZ2VcIiAvPiB7eyBtZXNzYWdlIH19XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDdXN0b21JbnB1dC52dWUiOiI8c2NyaXB0IHNldHVwPlxuZGVmaW5lUHJvcHMoWydtb2RlbFZhbHVlJ10pXG5kZWZpbmVFbWl0cyhbJ3VwZGF0ZTptb2RlbFZhbHVlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aW5wdXRcbiAgICA6dmFsdWU9XCJtb2RlbFZhbHVlXCJcbiAgICBAaW5wdXQ9XCIkZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gIC8+XG48L3RlbXBsYXRlPiJ9)

</div>

Um outra maneira de implementar a `v-model` dentro deste componente é utilizar uma propriedade `computed` gravável com ambos um recuperador e um definidor. O método `get` deve retornar a propriedade `modelValue` e o método `set` deve emitir o evento correspondente:

<div class="options-api">

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>
<div class="composition-api">

```vue
<!-- CustomInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

### Argumentos de `v-model` {#v-model-arguments}

Por padrão, a `v-model` sobre um componente utiliza `modelValue` como propriedade e `update:modelValue` como evento. Nós podemos modificar estes nomes passando um argumento para a `v-model`:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

Neste caso, o componente filho deve esperar uma propriedade `title` e emitir um evento `update:title` para atualizar o valor do componente pai:

<div class="composition-api">

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbiAgXG5jb25zdCB0aXRsZSA9IHJlZigndi1tb2RlbCBhcmd1bWVudCBleGFtcGxlJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoMT57eyB0aXRsZSB9fTwvaDE+XG4gIDxNeUNvbXBvbmVudCB2LW1vZGVsOnRpdGxlPVwidGl0bGVcIiAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiTXlDb21wb25lbnQudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmRlZmluZVByb3BzKFsndGl0bGUnXSlcbmRlZmluZUVtaXRzKFsndXBkYXRlOnRpdGxlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aW5wdXRcbiAgICB0eXBlPVwidGV4dFwiXG4gICAgOnZhbHVlPVwidGl0bGVcIlxuICAgIEBpbnB1dD1cIiRlbWl0KCd1cGRhdGU6dGl0bGUnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gIC8+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="options-api">

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IE15Q29tcG9uZW50IH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAndi1tb2RlbCBhcmd1bWVudCBleGFtcGxlJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGgxPnt7IHRpdGxlIH19PC9oMT5cbiAgPE15Q29tcG9uZW50IHYtbW9kZWw6dGl0bGU9XCJ0aXRsZVwiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJNeUNvbXBvbmVudC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wczogWyd0aXRsZSddLFxuICBlbWl0czogWyd1cGRhdGU6dGl0bGUnXVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGlucHV0XG4gICAgdHlwZT1cInRleHRcIlxuICAgIDp2YWx1ZT1cInRpdGxlXCJcbiAgICBAaW5wdXQ9XCIkZW1pdCgndXBkYXRlOnRpdGxlJywgJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAvPlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

### Várias Vinculações de `v-model` {#multiple-v-model-bindings}

Com a influência da habilidade para apontar uma propriedade e um evento particular conforme aprendemos antes com [argumentos de `v-model`](#v-model-arguments), podemos agora criar várias vinculações de `v-model` sobre uma única instância de componente.

Cada `v-model` se sincronizará a uma propriedade diferente, sem a necessidade de opções adicionais no componente:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBVc2VyTmFtZSBmcm9tICcuL1VzZXJOYW1lLnZ1ZSdcblxuY29uc3QgZmlyc3QgPSByZWYoJ0pvaG4nKVxuY29uc3QgbGFzdCA9IHJlZignRG9lJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoMT57eyBmaXJzdCB9fSB7eyBsYXN0IH19PC9oMT5cbiAgPFVzZXJOYW1lXG4gICAgdi1tb2RlbDpmaXJzdC1uYW1lPVwiZmlyc3RcIlxuICAgIHYtbW9kZWw6bGFzdC1uYW1lPVwibGFzdFwiXG4gIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiLFxuICAgIFwidnVlL3NlcnZlci1yZW5kZXJlclwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy9zZXJ2ZXItcmVuZGVyZXIuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiVXNlck5hbWUudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmRlZmluZVByb3BzKHtcbiAgZmlyc3ROYW1lOiBTdHJpbmcsXG4gIGxhc3ROYW1lOiBTdHJpbmdcbn0pXG5cbmRlZmluZUVtaXRzKFsndXBkYXRlOmZpcnN0TmFtZScsICd1cGRhdGU6bGFzdE5hbWUnXSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxpbnB1dFxuICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICA6dmFsdWU9XCJmaXJzdE5hbWVcIlxuICAgIEBpbnB1dD1cIiRlbWl0KCd1cGRhdGU6Zmlyc3ROYW1lJywgJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAvPlxuICA8aW5wdXRcbiAgICB0eXBlPVwidGV4dFwiXG4gICAgOnZhbHVlPVwibGFzdE5hbWVcIlxuICAgIEBpbnB1dD1cIiRlbWl0KCd1cGRhdGU6bGFzdE5hbWUnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gIC8+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBVc2VyTmFtZSBmcm9tICcuL1VzZXJOYW1lLnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IFVzZXJOYW1lIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpcnN0OiAnSm9obicsXG4gICAgICBsYXN0OiAnRG9lJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGgxPnt7IGZpcnN0IH19IHt7IGxhc3QgfX08L2gxPlxuICA8VXNlck5hbWVcbiAgICB2LW1vZGVsOmZpcnN0LW5hbWU9XCJmaXJzdFwiXG4gICAgdi1tb2RlbDpsYXN0LW5hbWU9XCJsYXN0XCJcbiAgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ2dWUvc2VydmVyLXJlbmRlcmVyXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3NlcnZlci1yZW5kZXJlci5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJVc2VyTmFtZS52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wczoge1xuXHQgIGZpcnN0TmFtZTogU3RyaW5nLFxuICBcdGxhc3ROYW1lOiBTdHJpbmdcblx0fSxcbiAgZW1pdHM6IFsndXBkYXRlOmZpcnN0TmFtZScsICd1cGRhdGU6bGFzdE5hbWUnXVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGlucHV0XG4gICAgdHlwZT1cInRleHRcIlxuICAgIDp2YWx1ZT1cImZpcnN0TmFtZVwiXG4gICAgQGlucHV0PVwiJGVtaXQoJ3VwZGF0ZTpmaXJzdE5hbWUnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gIC8+XG4gIDxpbnB1dFxuICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICA6dmFsdWU9XCJsYXN0TmFtZVwiXG4gICAgQGlucHV0PVwiJGVtaXQoJ3VwZGF0ZTpsYXN0TmFtZScsICRldmVudC50YXJnZXQudmFsdWUpXCJcbiAgLz5cbjwvdGVtcGxhdGU+In0=)

</div>

### Manipulando modificadores de `v-model` {#handling-v-model-modifiers}

Quando estávamos aprendendo a respeito de vinculações de entrada de formulário, vimos que a `v-model` tem [modificadores embutidos](/guide/essentials/forms.html#modifiers) - `.trim`, `.number`, e `.lazy`. Em alguns casos, no entanto, também podes desejar adicionar os teus próprios modificadores personalizados.

Vamos criar um exemplo de modificador personalizado, `capitalize`, que escreve em maiúsculas a primeira letra da sequência de caracteres fornecida pela vinculação de `v-model`:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

Os modificadores adicionados à uma `v-model` de componente serão fornecidos ao componente através da propriedade `modelModifiers`. No exemplo abaixo, temos criado um componente que contém uma propriedade `modelModifiers` que padroniza para um objeto vazio:

<div class="composition-api">

```vue{4,9}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

defineEmits(['update:modelValue'])

console.log(props.modelModifiers) // { capitalize: true }
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>
<div class="options-api">

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>

Repara que a propriedade `modelModifiers` do componente contém `capitalize` e o seu valor é `true` - devido a isto ser definido sobre a vinculação `v-model.capitalize="myText"` de `v-model`.

Agora que temos a nossa propriedade definida, podemos consultar as chaves do objeto `modelModifiers` e escrever um manipulador para mudar o valor emitido. No código abaixo escreveremos em maiúsculas a primeira letra da sequência de caracteres sempre que o elemento `<input />` disparar um evento `input`.

<div class="composition-api">

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbiAgXG5jb25zdCBteVRleHQgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICBUaGlzIGlucHV0IGNhcGl0YWxpemVzIGV2ZXJ5dGhpbmcgeW91IGVudGVyOlxuICA8TXlDb21wb25lbnQgdi1tb2RlbC5jYXBpdGFsaXplPVwibXlUZXh0XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIk15Q29tcG9uZW50LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5jb25zdCBwcm9wcyA9IGRlZmluZVByb3BzKHtcbiAgbW9kZWxWYWx1ZTogU3RyaW5nLFxuICBtb2RlbE1vZGlmaWVyczogeyBkZWZhdWx0OiAoKSA9PiAoe30pIH1cbn0pXG5cbmNvbnN0IGVtaXQgPSBkZWZpbmVFbWl0cyhbJ3VwZGF0ZTptb2RlbFZhbHVlJ10pXG5cbmZ1bmN0aW9uIGVtaXRWYWx1ZShlKSB7XG4gIGxldCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlXG4gIGlmIChwcm9wcy5tb2RlbE1vZGlmaWVycy5jYXBpdGFsaXplKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpXG4gIH1cbiAgZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB2YWx1ZSlcbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxpbnB1dCB0eXBlPVwidGV4dFwiIDp2YWx1ZT1cIm1vZGVsVmFsdWVcIiBAaW5wdXQ9XCJlbWl0VmFsdWVcIiAvPlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="options-api">

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgTXlDb21wb25lbnQgfSxcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXlUZXh0OiAnJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgVGhpcyBpbnB1dCBjYXBpdGFsaXplcyBldmVyeXRoaW5nIHlvdSBlbnRlcjpcbiAgPE15Q29tcG9uZW50IHYtbW9kZWwuY2FwaXRhbGl6ZT1cIm15VGV4dFwiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJNeUNvbXBvbmVudC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wczoge1xuICAgIG1vZGVsVmFsdWU6IFN0cmluZyxcbiAgICBtb2RlbE1vZGlmaWVyczoge1xuICAgICAgZGVmYXVsdDogKCkgPT4gKHt9KVxuICAgIH1cbiAgfSxcbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnXSxcbiAgbWV0aG9kczoge1xuICAgIGVtaXRWYWx1ZShlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgaWYgKHRoaXMubW9kZWxNb2RpZmllcnMuY2FwaXRhbGl6ZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSlcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdmFsdWUpXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aW5wdXQgdHlwZT1cInRleHRcIiA6dmFsdWU9XCJtb2RlbFZhbHVlXCIgQGlucHV0PVwiZW1pdFZhbHVlXCIgLz5cbjwvdGVtcGxhdGU+In0=)

</div>

Para as vinculações de `v-model` com ambos argumento e modificadores, o nome da propriedade gerada será `arg + "Modifiers"`. Por exemplo:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

As declarações correspondentes devem ser:

<div class="composition-api">

```js
const props = defineProps(['title', 'titleModifiers'])
defineEmits(['update:title'])

console.log(props.titleModifiers) // { capitalize: true }
```

</div>
<div class="options-api">

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>
