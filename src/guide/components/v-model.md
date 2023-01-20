# v-model do Componente {#component-v-model}

A `v-model` pode ser usada sobre um componente para implementar uma vínculo de duas vias.

Primeiro vamos revisitar como a `v-model` é usada sobre um elemento nativo:

```vue-html
<input v-model="searchText" />
```

Nos bastidores, o compilador do modelo de marcação expande a `v-model` para o equivalente mais verboso por nós. Então o código acima faz o mesmo que o seguinte:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Quando usado sobre um componente, a `v-model` expande para isto:

```vue-html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

Mas para isto realmente funcionar, o componente `<CustomInput>` deve fazer duas coisas:

1. Vincular o atributo `value` de um elemento `<input>` nativo à propriedade `modelValue`
2. Quando um evento `input` nativo é acionado, emite um evento `update:modelValue` personalizado com o novo valor

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

Um outra maneira de implementar a `v-model` dentro deste componente é usar uma propriedade `computed` graváveis com ambos um recuperador e um definidor. O método `get` deve returnar a propriedade `modelValue` e o método `set` deve emitir o evento correspondente:

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

## Argumentos de `v-model` {#v-model-arguments}

Por padrão, a `v-model` em um componente usa `modelValue` como a propriedade e o `update:modelValue` como o evento. Nós podemos modificar estes nomes passando um argumento para `v-model`:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

Neste caso, o componente filho deve esperar uma propriedade `title` e emitr um evento `update:title` para atualizar o valor do componente pai:

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

Ao incluenciar a habilidade de escolher uma propriedade e evento em particular como alvo conforme aprendemos antes com os [argumentos de `v-model`](#v-model-arguments), podemos agora criar várias vinculações de `v-model` sobre uma única instância de componente.

Cada `v-model` se sincronizará à uma propriedade diferente, sem a necessidade para opções adicionais em um componente:

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

### Manipulando Modificadores de `v-model` {#handling-v-model-modifiers}

Quando estavámos a aprender a respeito das vinculações de entrada do formulário, vimos que a `v-model` tem [modificadores embutidos](/guide/essentials/forms.html#modifiers) - `.trim`, `.number`, e `.lazy`. Em alguns casos, também podes querer que a `v-model` no teu compontente de entrada personalizado suportar modificadores personalizados.

Vamos criar um exemplo de modificador personalizado, `capitalize`, que escreve com maiúsculas a primeira letra da sequência de caracteres fornecidos pelo vinculo da `v-model`:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

Os modificadores adicionados para uma `v-model` do componente serão fornecidos ao componente através da propriedade `modelModifiers`. No exemplo abaixo, criamos um componente que contém de uma propriedade `modelModifiers` que predefine para um objeto vazio:

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

Repara que a propriedade `modelModifiers` do componente contém `capitalize` e seu valor é `true` - devido a ela estar definida no `v-model.capitalize="myText"` do vinculo da `v-model`. 

Agora que temos a nossa propriedade definida, podemos verificar as chaves do objeto `modelModifiers` e escrever um manipulador para mudar o valor emitido. No código abaixo escreveremos com maiúsculas a primeira letra da sequência de caracteres sempre que o elemento `<input />` disparar um evento de `input`.

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

Para os vinculos de `v-model` com ambos argumento e modificadores, o nome da propriedade gerada será `arg + "Modifiers"`. Por exemplo:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

As declarações correspondente devem ser:

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
