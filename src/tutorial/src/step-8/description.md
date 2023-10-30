# Propriedade Computada {#computed-property}

Continuaremos construindo em cima da lista de afazeres do passo anterior. Neste, já adicionamos uma funcionalidade de alternância à cada afazer (ou `todo`). Isto é feito adicionando uma propriedade `done` à cada objeto `todo`, e usando `v-model` para vinculá-lo à uma caixa de confirmação (ou `checkbox`):

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

A próxima melhoria que podemos adicionar é a de ser capaz de esconder os afazeres (ou `todos`) realizados (ou completados). Já temos um botão que alterna o estado de `hideCompleted`. Mas como interpretamos os diferentes items da lista baseado neste estado?

<div class="options-api">

Introduzindo a <a target="_blank" href="/guide/essentials/computed">propriedade computada</a>. Nós podemos declarar uma propriedade que é computada de maneira reativa a partir de outras propriedades usando a opção `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // retornar os `todos` filtrados baseado na `this.hideCompleted`
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
      // retornar os `todos` filtrados baseado na `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Introduzindo a função <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Nós podemos criar uma referência computada que calcula o seu `.value` baseado em outras fontes de dados reativos:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // retornar os `todos` filtrados baseado no
  // `todos.value` e `hideCompleted.value`
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
      // retornar os `todos` filtrados baseado no
      // `todos.value` e `hideCompleted.value`
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

Uma propriedade computada rastreia outro estado reativo usado no seu cálculo como dependência. Ela armazena para consulta imediata o resultado e atualiza-o automaticamente quando suas dependências mudarem.

Agora, tente adicionar a propriedade computada `filteredTodos` e implementar sua lógica de computação! Se for implementada corretamente, colocar um visto no afazer (ou `todo`) quando escondemos os itens concluídos (ou completados) também deve escondê-lo instantaneamente.
