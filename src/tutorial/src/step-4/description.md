# Ouvintes de Evento {#event-listeners}

Nós podemos ouvir os eventos do DOM usando a diretiva `v-on`:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

Por causo do seu uso frequente, a `v-on` também tem uma sintaxe abreviada:

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

Agora, `increment` refere-se a uma função declarada usando a opção `methods`:

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // atualizar o estado do componente
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // atualizar o estado do componente
      this.count++
    }
  }
})
```

</div>

Dentro dum método, podemos acessar a instância do componente usando `this`. A instância do componente expõe as propriedades de dados declaradas por `data`. Nós podemos atualizar o estado do componente modificando estas propriedades.

</div>

<div class="composition-api">

<div class="sfc">

Aqui, `increment` refere-se a uma função declarada no `<script setup>`:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // atualizar o estado do componente
  count.value++
}
</script>
```

</div>

<div class="html">

Aqui, `increment` refere-se a um método no objeto retornado a partir da `setup()`:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // atualizar o estado do componente
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

Dentro da função, podemos atualizar o estado do componente modificando as referências.

</div>

Os ouvintes de evento também podem usar expressões em linha, e podem simplificar tarefas comuns com os modificadores. Estes detalhes são cobertos no <a target="_blank" href="/guide/essentials/event-handling">Guia - Manipulação de Evento</a>.

Agora, tente implementar <span class="options-api">o método</span><span class="composition-api">a função</span> `increment` e vinculá-la ao botão usando a `v-on`.
