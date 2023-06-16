# Regras Prioridade D: Use com Cautela {#priority-d-rules-use-with-caution}

Algumas funcionalidades do Vue existem para acomodar casos extremos raros ou suavizar migrações de uma base de código legado. Entretanto, ao serem utilizadas excessivamente, elas podem tornar o seu código mais difícil de manter ou até mesmo se tornarem uma fonte de bugs. Estas regras demonstram funcionalidades possivelmente arriscadas, descrevendo quando e porquê elas devem ser evitadas.

## Seletores de elemento com `scoped` {#element-selectors-with-scoped}

**Seletores de elemento devem ser evitados com `scoped`.**

Prefira seletores de classe em vez de seletores de elemento nos estilos `scoped`, porque um grande número de seletores de elemento diminuem a velocidade.

::: details Explicação Detalhada
Para definir estilos em escopo, o Vue adiciona um atributo único aos elementos componentes, algo como `data-v-f3f3eg9`. Então os seletores são modificados para que apenas elementos correspondentes com este atributo sejam selecionados (e.g. `button[data-v-f3f3eg9]`).

O problema é que um grande número de seletores elemento-atributo (e.g. `button[data-v-f3f3eg9]`) serão consideravelmente mais lentos do que seletores classe-atributo (e.g. `.btn-close[data-v-f3f3eg9]`), então seletores de classe devem ser escolhidos sempre quando possível.
:::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Comunicação pai-filho implícita {#implicit-parent-child-communication}

**Props e eventos devem ser preferíveis para a comunicação entre componentes pai-filho, ao invés de `this.$parent` ou de realizar mutações em props.**

Uma aplicação Vue ideal segue props para baixo, eventos para cima. Manter-se a esta convenção tornará os seus componentes mais fáceis de se entender. Entretanto, existem casos extremos em que a mutação de props ou `this.$parent` pode simplificar dois componentes já profudamente acoplados.

O problema é, há muitos outros casos _simples_ onde esses padrões podem ser convenientes. Cuidado: não fique tentando a trocar simplicidade (estar apto a entender o fluxo do seu estado) por conveniência a curto-prazo (escrever menos código).

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>
