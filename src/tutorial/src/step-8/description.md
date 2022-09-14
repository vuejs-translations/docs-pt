# Propriedade Computada

Continuaremos construindo sobre a lista de afazeres `todo list` do último passo. Cá, já adicionamos uma funcionalidade de alternar para cada afazer `todo`. Isto é feito adicionando uma propriedade `done` para cada objeto de afazer `todo`, e utilizando `v-model` para vinculá-lo ao caixa de confirmação `checkbox`:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

O próxima melhoria que podemos adicionar é de ser capaz de esconder os afazeres `todos` completados. Nós já temos um botão que alterna o estado `hideCompleted`. Mas como interpretamos listas de itens diferentes com base neste estado?

<div class="options-api">

Introduzindo a <a target="_blank" href="/guide/essentials/computed.html">propriedade computada</a>. Nós podemos declarar uma propriedade que é computada de maneira reativa a partir de outras propriedades utilizando a opção `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // retorna os afazeres `todos` filtrados com base no `this.hideCompleted`
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // retorna os afazeres `todos` filtrados com base no `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Introduzindo a função <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Nós podemos criar uma referência computada que computa seu `.value` baseado em outras fontes de dados reativos:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // retorna afazeres `todos` filtrados com base nos
  // `todos.value` & `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // retorna os afazeres `todos` filtrados com base nos
      // `todos.value` & `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Uma propriedade computada rastreia outro estado reativo utilizado em sua computação como dependências. Ela cacheia o resultado e atualiza-o automaticamente quando suas dependências mudarem.

Agora, experimente adicionar a propriedade computada `filteredTodos` e implementar sua lógica de computação! Se implementada corretamente, confirmar um afazer `todo` no momento que estiveres escondendo itens completados deveria também escondê-lo instantaneamente.
