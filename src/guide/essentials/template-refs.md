# Referências do Modelo de Marcação {#template-refs}

Embora o modelo de interpretação declarativa da Vue abstraia a maior parte das operações diretas do DOM por ti, ainda existe casos onde precisamos de acesso direto aos elementos do DOM subjacentes. Para conseguir isto, podemos utilizar o atributo especial `ref`:

```vue-html
<input ref="input">
```

O `ref` é um atributo especial, similar ao atributo `key` discutido no capitulo `v-for`. Ele permite-nos obter uma referência direta para um elemento de DOM especifico ou instância de componente depois de ser montada. Isto pode ser útil quando quiseres, por exemplo, focar programaticamente uma entrada (`input`) na montagem do componente, ou inicializar uma biblioteca de terceiro sobre um elemento.

## Acessando as Referências {#accessing-the-refs}

<div class="composition-api">

Para obter a referência com a API de Composição, precisamos declarar uma `ref` com o mesmo nome:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// declara uma `ref` para segurar a referência de elemento
// o nome deve corresponder ao valor de `ref` do modelo de marcação
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Se não estiveres utilizando a `<script setup>`, certifica-te de também retornar a referência a partir de `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</div>
<div class="options-api">

A referência resultante é exposta sobre `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Nota que só podes acessar a referência **depois do componente ser montado.** Se tentares acessar <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> em uma expressão de modelo de marcação, será `null` na primeira interpretação. Isto porque o elemento não existe até depois da primeira interpretação!

<div class="composition-api">

Se estiveres tentando observar as mudanças de uma referência de modelo de marcação, certifica-te de representar o caso onde a referência tem o valor `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // ainda não está montado, ou o elemento foi desmontado (por exemplo, pelo v-if)
  }
})
```

Consulte também: [Tipando Referências de Modelo de Marcação](/guide/typescript/composition-api.html#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Referências dentro de `v-for` {#refs-inside-v-for}

> Exige a versão 3.2.25 em diante

<div class="composition-api">

Quando o `ref` é utilizado dentro de `v-for`, a referência correspondente deve conter uma valor de arranjo (`Array`), que será povoada com os elementos depois de montar:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBsaXN0ID0gcmVmKFsxLCAyLCAzXSlcblxuY29uc3QgaXRlbVJlZnMgPSByZWYoW10pXG5cbm9uTW91bnRlZCgoKSA9PiB7XG4gIGFsZXJ0KGl0ZW1SZWZzLnZhbHVlLm1hcChpID0+IGkudGV4dENvbnRlbnQpKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDx1bD5cbiAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGxpc3RcIiByZWY9XCJpdGVtUmVmc1wiPlxuICAgICAge3sgaXRlbSB9fVxuICAgIDwvbGk+XG4gIDwvdWw+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

Quando o `ref` é utilizado dentro de `v-for`, o valor de referência resultante será um arranjo (`array`) contendo os elementos correspondentes:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDogWzEsIDIsIDNdXG4gICAgfVxuICB9LFxuICBtb3VudGVkKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMuaXRlbXMpXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDx1bD5cbiAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGxpc3RcIiByZWY9XCJpdGVtc1wiPlxuICAgICAge3sgaXRlbSB9fVxuICAgIDwvbGk+XG4gIDwvdWw+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

Deve ser notado que o arranjo de referência **não** garante a mesma ordem conforme o arranjo (`array`) de origem.

## Referências de Função {#function-refs}

No lugar de uma chave de sequência de caracteres, o atributo `key` também pode ser atado a uma função, que será chamada em cada atualização do componente e dar-te-á completa flexibilidade sobre onde guardar a referência do elemento. A função recebe a referência do elemento como primeiro argumento:

```vue-html
<input :ref="(el) => { /* atribui `el` a uma propriedade ou referência */ }">
```

Nota que estamos utilizando uma vinculação de `:ref` dinâmica assim podemos passar nela uma função no lugar de uma sequência de caracteres de nome de referência. Quando o elemento é desmontado, o argumento será `null`. Tu podes, claro, utilizar um método no lugar de uma função em linha.

## Referência no Componente {#ref-on-component}

> Esta secção presume conhecimento de [Componentes](/guide/essentials/component-basics). Esteja a vontade para saltá-la e voltar mais tarde.

O `ref` também pode ser utilizado sobre um componente filho. Neste caso a referência será aquela de uma instância de componente:

<div class="composition-api">

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value segurará uma instância de <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child segurará uma instância de <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Se o componente filho estiver utilizando a API de Opções ou não utilizando `<script setup>`, a</span><span class="options-api">A</span> instância referenciada será idêntica ao `this` do componente filho, o que significa que o componente pai terá total acesso as todas propriedades e métodos do componente filho. Isto torna-o fácil de criar detalhes de implementação atrelados firmemente entre o pai e o filho, assim as referências do componente só deve ser utilizadas quando forem absolutamente necessários - na maioria dos casos, deves tentar implementar interações entre o pai e o filho utilizando as interfaces de propriedades e emissão padrão primeiro.

<div class="composition-api">

Uma exceção é que componentes utilizando `<script setup>` são **privados por padrão**: um componente pai referenciando um componente filho utilizando `<script setup>` não será capaz de acessar nada a menos que o componente filho escolha expor uma interface publica utilizando a macro `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Macros do compilador, tais como `defineExpose`, não precisam ser importados.
defineExpose({
  a,
  b
})
</script>
```

Quando um pai recebe uma instância deste componente através de referências de modelo de marcação, a instância recuperada será da forma `{ a: number, b: number }` (referências são desembrulhadas automaticamente como instâncias normais).

Consulte também: [Tipando Referências de Modelo de Marcação do Componente](/guide/typescript/composition-api.html#tipando-referências-de-modelo-de-marcação-do-componente) <sup class="vt-badge ts" />

</div>
<div class="options-api">

A opção `expose` pode ser utilizada para limitar o acesso a instância do filho:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

No exemplo acima, um pai referenciando este componente através de referência de modelo de marcação só será capaz de acessar `publicData` e `publicMethod`.

</div>
