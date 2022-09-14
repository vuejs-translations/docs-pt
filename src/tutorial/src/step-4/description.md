# Ouvintes de Eventos

Nós podemos ouvir os eventos de DOM utilizando a diretiva `v-on`:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

Devido ao seu uso frequente, `v-on` também tem uma sintaxe abreviada:

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

Agora, `increment` refere-se a uma função declarada utilizando a opção `methods`:

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
      // atualize o estado do componente
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
      // atualize o estado do componente
      this.count++
    }
  }
})
```

</div>

Dentro de um método, podemos acessar uma instância de componente utilizando `this`. A instância de componente expõe as propriedades de dados declaradas pelo `data`. Nós podemos atualizar o estado do componente pela modificação destas propriedades.

</div>

<div class="composition-api">

<div class="sfc">

Aqui, `increment` está referindo-se a uma função declarada na `<script setup>`:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // update component state
  // atualize o estado do componente
  count.value++
}
</script>
```

</div>

<div class="html">

Aqui, `increment` está referindo-se a um método no objeto retornado de `setup()`:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // atualize o estado do componente
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

Dentro da função, podemos atualizar o estado do componente pela modificação de suas referências.

</div>

Os ouvintes de eventos também podem utilizar expressões em linha, e podem simplificar tarefas comuns com modificadores. Estes detalhes são cobertos na <a target="_blank" href="/guide/essentials/event-handling.html">Guia - Manipulação de Evento</a>.

Agora, experimente implementar tu mesmo <span class="options-api">o método</span><span class="composition-api">a função</span> `increment` e vinculá-lo ao botão utilizando `v-on`.
