---
outline: deep
---

# Fundamentos de Reatividade

:::tip Preferência de API
Esta páginas e muitos outros capítulos adiante neste guia contém diferente conteúdo para a API de Opções e API de Composição. A tua preferência atual é a <span class="options-api">API de Opções</span><span class="composition-api">API de Composição</span>. Tu podes alternar entre os estilos de API utilizando o interruptor "Preferência de API" no canto superior esquerdo da barra lateral.
:::

## Declarando Estado Reactivo

<div class="options-api">

Com a API de Opções, utilizamos a opção `data` para declarar estado reativo de um componente. O valor da opção deve ser uma função que retorna um objeto. A Vue chamará a função quando estiver criando uma nova instância do componente, e envolve o objeto retornado no seu sistema de reatividade. Quaisquer propriedades de alto nível deste objeto são delegados sobre a instância do componente (`this` dentro dos métodos e gatilhos do cíclo de vida):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` é um gatilho de cíclo de vida que explicaremos adiante
  mounted() {
    // `this` refere-se a instância do componente.
    console.log(this.count) // => 1

    // o dado também pode ser alterado
    this.count = 2
  }
}
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDFcbiAgICB9XG4gIH0sXG5cbiAgLy8gYG1vdW50ZWRgIGlzIGEgbGlmZWN5Y2xlIGhvb2sgd2hpY2ggd2Ugd2lsbCBleHBsYWluIGxhdGVyXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gYHRoaXNgIHJlZmVycyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnQpIC8vID0+IDFcblxuICAgIC8vIGRhdGEgY2FuIGJlIG11dGF0ZWQgYXMgd2VsbFxuICAgIHRoaXMuY291bnQgPSAyXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIENvdW50IGlzOiB7eyBjb3VudCB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Estas propriedades de instância só são adicionadas quando a instância for criada primeiro, então precisar garantir que elas estão todas presentes no objeto retornado pela função `data`. Onde necessário, utilize `null`, `undefined` ou algum outro valor segurador de lugar para as propriedades onde o valor desejado ainda não está disponível.

É possível adicionar uma nova propriedade diretamente ao `this` sem incluí-la no `data`. No entanto, propriedades adicionadas desta maneira não serão capazes de acionar atualizações reativas.

A Vue utiliza um prefixo `$` quando está expondo suas próprias APIs embutidas através da instância do componente. Ela também reserva o prefixo `_` para propriedades internas. Tu deves evitar a utilização de nomes para propriedades de `data` de alto nível que comecem com quaisquer destes caracteres.

### Delegação Reativa versus Delegação Original \*

Na Vue 3, os dados são feitos reativos influenciando as [Delegações de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Utilizadores chegando da Vue 2 devem estar cientes do seguinte caso extremo:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

Quando acessares `this.someObject` depois de atribuí-lo, o valor é uma delegação reativa do `newObject` original. **Ao contrário da Vue 2, o `newObject` original é deixado intacto e não será tornado reativo: certifica-te de sempre acessar o estado reativo como uma propriedade de `this`**.

</div>

<div class="composition-api">

Nós podemos criar um objeto ou arranjo reativo com a função [`reactive()`](/api/reactivity-core.html#reactive):

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

Os objetos reativos são [Delegações de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) e comportam-se como objetos normais. A diferença é que a Vue é capaz de rastreiar mutações e acessos de propriedade de um objeto reativo. Se estiveres curioso a respeitos dos detalhes, nós explicamos como o sistema de reativadade da Vue funciona em [Reatividade em Profundidade](/guide/extras/reactivity-in-depth.html) - mas recomendamos a leitura dele depois de teres terminado o guia principal.

Consulte também: [Tipando a Reactive](/guide/typescript/composition-api.html#typing-reactive) <sup class="vt-badge ts" />

Para utilizar o estado reativo em um modelo de marcação do componente, declare-os e retorne-os a partir de uma função `setup()` do componente:

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` é um gatilho especial dedicado à API de composição.
  setup() {
    const state = reactive({ count: 0 })

    // expor o estado para o modelo de marcação
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

Semelhantemente, podemos declarar funcções que alteram o estado reativo no mesmo escopo, e expor ele como um método junto do estado:

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // não esqueça de expor a função também.
    return {
      state,
      increment
    }
  }
}
```

Os métodos expostos são normalmente utilizados como ouvintes de evento:

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>` \*\*

Expor o estado e métodos manualmente através da `setup()` pode ser verboso. Felizmente, só é necessário quando não estás utilizando uma etapa de construção. Quando estiveres utilizando Componentes de Ficheiro Único (SFCs, sigla em Inglês), podemos simplificar grandemente a utilização com `<script setup>`:

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHsgY291bnQ6IDAgfSlcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBzdGF0ZS5jb3VudCsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPlxuICAgIHt7IHN0YXRlLmNvdW50IH19XG4gIDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

As importações e variáveis de alto nível declaradas no `<script setup>` são automaticamente utilizáveis no modelo de marcação do mesmo componente.

> Para o resto do guia, estaremos principalmente utilizando a sintaxe SFC + `<script setup>` para exemplos de código da API de Composição, visto que é o uso mais comum para os programadores de Vue.

</div>

<div class="options-api">

## Declarando Métodos \*

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Aula Gratuita Sobre Métodos de Vue.js"/>

Para adicionar métodos à uma instância de componente utilizamos a opção `methods`. Isto deve ser um objeto contendo os métodos desejados:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // métodos podem ser chamados nos gatilhos de clico de vida, ou em outros métodos!
    this.increment()
  }
}
```

A Vue vincula automaticamente o valor `this` para `methods` para que sempre referir-se a instância de componente. Isto garante que um método preserva o valor `this` correto se for utilizado como um ouvinte de evento ou resposta. Tu deves evitar a utilização de funções em flecha quando estiveres definindo os `methods`, visto que impedi a Vue de vincular o valor `this` apropriado:

```js
export default {
  methods: {
    increment: () => {
      // MAU: nenhum acesso de `this` aqui!
    }
  }
}
```

Tal como todas as outras propriedades da instância de componente, o `methods` são acessíveis a partir de dentro do modelo de marcação do componente. Dentro de um modelo de marcação são comummente utilizadas como ouvintes de evento:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICB0aGlzLmNvdW50KytcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnQoKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

No exemplo acima, o método `increment` será chamado quando o `<button>` clicado.

</div>

### Tempo de Atualização do DOM

Quando alteras o estado reativo, o DOM é atualizado automaticamente. No entanto, deve ser notado que as atualizações do DOM não são aplicadas de maneira sincróna. Ao invés disto, a Vue ampara-os até o "próximo momento" no ciclo de atualização para garantir que cada componente precise atualizar apenas uma vez não importa quantas mudanças de estado tens feito.

Para esperar pela atualização do DOM terminar depois de uma mudança de estado, podes utilizar a API global [`nextTick()`](/api/general.html#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // acessa o DOM atualizado
  })
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // acessa o DOM atualizado
      })
    }
  }
}
```

</div>

### Reatividade Profunda

Na Vue, o estado é profundamente reativo por padrão. Isto signifca que podes esperar que as mudanças sejam detetadas mesmo quando alteras objetos ou arranjos encaixados:

<div class="options-api">

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // estes funcionarão como esperado.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // estes funcionarão como esperado.
  obj.nested.count++
  obj.arr.push('baz')
}
```

</div>

É também possível criar explicitamente [objetos reativos superficiais](/api/reactivity-advanced.html#shallowreactive) onde a reatividade é apenas rastreada ao nível da raiz, no entanto só são normalmente necessárias em casos de uso avançados.

<div class="composition-api">

### Delegação Reativa vs. Original \*\*

É importante notar que o valor retornado da `reactive()` é uma [Delegação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) do objeto original, a qual não é igual ao objeto original:

```js
const raw = {}
const proxy = reactive(raw)

// delegação NÃO é igual ao original.
console.log(proxy === raw) // false
```

Apenas a delegação é reativa - a mutação do objeto original não acionará atualizações. Portanto, a boa prática quando estiveres trabalhando com o sistema de reatividade da Vue é **utilizar exclusivamente as versões delegadas do teu estado**.

Para garantir o acesso consistente à delegação, a chamada de `reactive()` sobre o mesmo objeto sempre retorna a mesma delegação, e a chamada `reactive()` sobre uma delegação existente também retorna aquela mesma delegação:

```js
// a chamada de reactive() sobre o mesmo objeto retorna a mesma delegação
console.log(reactive(raw) === proxy) // true

// a chamada de reactive() sobre uma delegação retorna a si mesma
console.log(reactive(proxy) === proxy) // true
```

Este regra também aplica-se aos objetos encaixados. Devido a reatividade profunda, os objetos encaixados dentro de um objeto reativo também são delegações:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitações da `reactive()` \*\*

A API de `reactive()` tem duas limitações

1. Ela apenas funciona para os tipos de objetos (objetos, arranjos, e [tipos de coleção](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) tais como `Map` e `Set`). Ela não pode segurar [tipos primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) tais como `string`, `number`, ou `boolean`.

2. Visto que o rastreamento da reatividade da Vue funciona funciona sobre o acesso de propriedade, devemos sempre manter a mesma referência para objeto reativo. Isto significa que não podemos "substituir" facilmente um objeto reativo porque a conexão da reatividade para a primeira referência é perdida:

   ```js
   let state = reactive({ count: 0 })

   // a referência acima ({ count: 0 }) já não está sendo rastreada (conexão da reatividade está perdida!)
   state = reactive({ count: 1 })
   ```

   Isto também significa que quando atribuimos ou desestruturamos uma propriedade do objeto reativo em variáveis locais, ou quando passamos esta propriedade para uma função, perderemos a conexão da reativade:

   ```js
   const state = reactive({ count: 0 })

   // `n` é uma variável local que está desconectada
   // do `state.count`.
   let n = state.count
   // não afeta o estado original
   n++

   // `count` também está desconectado do `state.count`.
   let { count } = state
   // não afeta o estado original
   count++

   // a função recebe um número simples e
   // não será capaz de rastreiar as mudanças
   callSomeFunction(state.count)
   ```

## Variáveis Reativas com `ref()` \*\*

Para tratar as limitações da `reactive()`, a Vue também fornece uma função [`ref()`](/api/reactivity-core.html#ref) que permite-nos criar **"referências reativas"** que podem segurar qualquer tipo de valor:

```js
import { ref } from 'vue'

const count = ref(0)
```

A `ref()` recebe o argumento e retorna-o envolvido dentro de um objeto de referência com uma propriedade `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

Consulte também: [Tipando as Referências](/guide/typescript/composition-api.html#tipando-as-referências) <sup class="vt-badge ts" />

Semelhante as propriedades em um objeto reactivo, a propriedade `.value` de uma referência é reativa. Além disto, quando estiveres segurando tipos de objeto, a referência converte automaticamente seu `.value` com a `reactive()`:

Uma referência contendo um valor de objeto pode substituir reativamente o objeto inteiro:

```js
const objectRef = ref({ count: 0 })

// isto funciona reativamente
objectRef.value = { count: 1 }
```

As referências também podem ser passadas para funções ou desestruturadas a partir de objetos simples sem perderem a reatividade:

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// a função recebe uma referência
// ela precisa acessar o valor através de `.value`
// porém ela reterá a conexão da reatividade
callSomeFunction(obj.foo)

// continua reativo
const { foo, bar } = obj
```

Em outras palavras, a `ref()` permite-nos criar uma "referência" para qualquer valor e passá-lo por aí sem perda da reatividade. Esta capacidade é muito importante visto que é frequentemente utilizada quando estamos extraindo a lógica para as [Funções Constituíveis](/guide/reusability/composables.html).

### Desembrulhamento da Referência nos Modelos de Marcação \*\*

Quando as referências são acessadas como propriedades de alto nível no modelo de marcação, elas são automaticamente "desembrulhadas" assim não é preciso utilizar `.value`. Cá está o anterior exemplo `counter`, utilizando a `ref()`:

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- `.value` não é necessário  -->
  </button>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnQgPSByZWYoMClcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBjb3VudC52YWx1ZSsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Nota que o desembrulhamento só aplica-se se a referência for uma propriedade de alto nível sobre o contexto de interpretação do modelo de marcação. Como um exemplo, `foo` é uma propriedade de alto nível, mas `object.foo` não é.

Então dado o seguinte objeto:

```js
const object = { foo: ref(1) }
```

A seguinte expressão **NÃO** funcionará como esperado:

```vue-html
{{ object.foo + 1 }}
```

O resultado interpretado será `[object Object]` porque `object.foo` é um objeto de referência. Nós podemos corrigir aquilo tornando `foo` uma propriedade de alto nível:

```js
const { foo } = object
```

```vue-html
{{ foo + 1 }}
```

Agora o resultado da interpretação será `2`.

Uma coisa para anotar é que uma referência também será desembrulhada se for o resultado do valor avaliado de uma interpolação de texto (por exemplo, um marcador <code v-pre>{{ }}</code>), assim o seguinte interpretará `1`:

```vue-html
{{ object.foo }}
```

Isto é apenas uma funcionalidade de conveniência da interpolação de texto e é equivalente ao <code v-pre>{{ object.foo.value }}</code>.

### Desembrulhamento da Referência nos Objetos Reativos \*\*

Quando uma `ref` for acessada ou alterada como uma propriedade de um objeto reativo, também é desembrulhada automaticamente assim comporta-se como uma propriedade normal:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Se uma nova referência for atribuida à uma propridade ligada à uma referência existente, substituirá a antiga referência:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// a referência original agora está desconectada do `state.count`
console.log(count.value) // 1
```

O desembrulhamento da referência apenas acontence quando encaixado dentro de um objeto de reativadade profunda. Não aplica-se quando for acessado como uma propriedade de um [objeto de reatividade superficial](/api/reactivity-advanced.html#shallowreactive).

#### Desembrulhamento da Referência nos Arranjos e Coleções

Ao contrário dos objetos reativos, não existe desembrulhamento realizado quando a referência for acesssada como um elemento de um arranjo reativo ou um tipo de coleção nativa como `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// precisa da `.value`
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// precisa da `.value`
console.log(map.get('count').value)
```

</div>

<div class="options-api">

### Métodos com Estado \*


Em alguns casos, podemos precisar criar dinamicamente uma função de método, por exemplo criando um manipulador de evento "debounced":

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Debouncing with Lodash
    click: debounce(function () {
     // ... responde ao clique ...
    }, 500)
  }
}
```

No entanto, esta abordagem é problemática porque os componentes que são reutilizados porque uma função "debounced" **tem estado**: ela mantém algum estado interno sobre o tempo decorrido. Se várias instância de componente partilharem a mesma função "debounced", interferirão umas as outras.

Para manter cada função "debounced" da instância do componente independente das outras, podemos criar uma versão "debounced" no gatilho de ciclo de vida `created`:

```js
export default {
  created() {
    // agora cada instância tem sua própria cópia do manipulador "debounced"
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // também é uma boa ideia cancelar o temporizador
    // quando o componente for removido
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
     // ... responde ao clique ...
    }
  }
}
```

</div>

<div class="composition-api">

## Transformação da Reatividade <sup class="vt-badge experimental" /> \*\*

Ter que utilizar a `.value` com as referência é uma desvantagem imposta pelas restrições da linguagem de JavaScript. No entanto, com as transformações de tempo de compilação podemos melhorar a ergonomia anexando automaticamente a `.value` nos localizações apropriadas. A Vue fornece uma transformação de tempo de compilação que permite-nos escrever o anterior exemplo de "counter" desta maneira:

```vue
<script setup>
let count = $ref(0)

function increment() {
  // não existe necessidade para ".value"
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Tu podes aprender mais a respeito da [Transformação de Reatividade](/guide/extras/reactivity-transform.html) na sua secção dedicada. Toma nota de que ela atualmente continua experimental e pode mudar antes de ser finalizada.

</div>
