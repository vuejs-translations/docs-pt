---
outline: deep
---

# Fundamentos de Reatividade {#reactivity-fundamentals}

:::tip Preferência de API
Esta páginas e muitos outros capítulos adiante neste guia contém diferente conteúdo para a API de Opções e API de Composição. A tua preferência atual é a <span class="options-api">API de Opções</span><span class="composition-api">API de Composição</span>. Tu podes alternar entre os estilos de API utilizando o interruptor "Preferência de API" no canto superior esquerdo da barra lateral.
:::

<div class="options-api">

## Declarando Estado Reativo \* {#declaring-reactive-state}

Com a API de Opções, utilizamos a opção `data` para declarar estado reativo de um componente. O valor da opção deve ser uma função que retorna um objeto. A Vue chamará a função quando estiver criando uma nova instância do componente, e envolve o objeto retornado no seu sistema de reatividade. Quaisquer propriedades de alto nível deste objeto são delegados sobre a instância do componente (`this` dentro dos métodos e gatilhos do ciclo de vida):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` é um gatilho de ciclo de vida que explicaremos adiante
  mounted() {
    // `this` refere-se a instância do componente.
    console.log(this.count) // => 1

    // o dado também pode ser alterado
    this.count = 2
  }
}
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Estas propriedades de instância só são adicionadas quando a instância for criada primeiro, então precisar garantir que elas estão todas presentes no objeto retornado pela função `data`. Onde necessário, utilize `null`, `undefined` ou algum outro valor segurador de lugar para as propriedades onde o valor desejado ainda não está disponível.

É possível adicionar uma nova propriedade diretamente ao `this` sem incluí-la no `data`. No entanto, propriedades adicionadas desta maneira não serão capazes de acionar atualizações reativas.

A Vue utiliza um prefixo `$` quando está expondo suas próprias APIs embutidas através da instância do componente. Ela também reserva o prefixo `_` para propriedades internas. Tu deves evitar a utilização de nomes para propriedades de `data` de alto nível que comecem com quaisquer destes caracteres.

### Delegação Reativa vs Delegação Original \* {#reactive-proxy-vs-original}

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

## Declarando Estado Reativo \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

Na API de Composição, a maneira recomendada de declarar estado reativo é usando a função [`ref()`](/api/reactivity-core#ref):

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` recebe o argumento e retorna-o embrulhado dentro dum objeto de referência com uma propriedade `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Consulte também: [Tipos para as Referências](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

Para acessar as referências no modelo de marcação dum componente, declaramos e as retornamos a partir da função `setup()` dum componente:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup()` é um gatilho especial dedicado para a API de Composição.
  setup() {
    const count = ref(0)

    // expor a referência ao modelo de marcação
    return {
      count
    }
  }
}
``` 

```vue-html
<div>{{ count }}</div>
```

Repara que **não** precisávamos anexar `.value` quando usamos a referência no modelo de marcação. Por conveniência, as referências são automaticamente desembrulhada quando usadas dentro dos modelos de marcação (com algumas [advertências](#caveat-when-unwrapping-in-templates)).

Tu também podes modificar a referência diretamente nos manipuladores de evento:

```vue-html
<button @click="count++">
  {{ count }}
</button>
```

Para lógica mais complexa, podemos declarar funções que modificam as referências no mesmo escopo e expo-las como métodos ao lado do estado:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // `.value` é necessário na JavaScript
      count.value++
    }

    // também não esqueças de expor a função.
    return {
      count,
      increment
    }
  }
}
```

Os métodos expostos podem então ser usados como manipuladores de evento:

```vue-html
<button @click="increment">
  {{ count }}
</button>
```

Nesta ligação está o exemplo ao vivo na [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), sem usar quaisquer ferramentas de construção.

### `<script setup>` \*\* {#script-setup}

Expor manualmente o estado e os métodos através de `setup()` pode ser verboso. Felizmente, pode ser evitado quando usamos [Componentes de Ficheiro Único](/guide/scaling-up/sfc). Nós podemos simplificar o uso com o `<script setup>`:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

As importações, variáveis, e funções de alto nível declaradas no `<script setup>` são automaticamente usáveis no modelo de marcação do mesmo componente. Pense do modelo de marcação como uma função de JavaScript declarada no mesmo escopo - naturalmente tem acesso à tudo for declarado ao lado dele.

:::tip DICA
Para o resto do guia, estaremos primariamente a usar a sintaxe de Componente de Ficheiro Único + `<script setup>` para os exemplos de código da API de Composição, uma vez que é uso mais comum para os programadores de Vue.

Se não estiveres a usar Componente de Ficheiro Único, ainda podes usar a API de Composição com a opção [`setup()`](/api/composition-api-setup).
::::

### Porquê Referências? \*\* {#why-refs}

Tu podes estar a perguntar a si mesmo porquê precisamos de referências com `.value` no lugar de variáveis simples. Para explicar isto, precisaremos de discutir brevemente como o sistema de reatividade da Vue funciona.

Quando usas uma referência no modelo de marcação, e mudas o valor da referência mais tarde, a Vue deteta automaticamente a mudança e atualiza o DOM por consequência. Isto é tornado possível com um rastreio de dependência baseado no sistema de reatividade. Quando um componente é desenhado pela primeira vez, a Vue **rastreia** todas as referências que foram usadas durante o desenho. Depois, quando uma referência for mudada, **acionará** o redesenho para os componentes que estão a rastreia-lo.

Na JavaScript padrão, não existe nenhuma maneira de detetar o acesso ou mutação de variáveis simples. Mas podemos intercetar operações de recuperação e definição duma propriedade.

A propriedade `.value` dá a Vue oportunidade de detetar quando uma referência foi acessada ou mudada. Nos bastidores, a Vue realiza o rastreio no seu recuperador, e realiza acionamento no seu definidor. Concetualmente, podes pensar duma referência como um objeto que se parece com isto:

```js
// pseudo-código, e não implementação verdadeira
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Uma outra característica fantástica das referências é que ao contrário das variáveis simples, podes passar referências para funções enquanto reténs o acesso ao último valor e a conexão da reatividade. Isto é particularmente útil quando refazemos lógica complexa em código reutilizável.

O sistema de reatividade é discutido em mais detalhes na seção [Reatividade em Profundidade](/guide/extras/reactivity-in-depth)
</div>

<div class="options-api">

## Declarando Métodos \* {#declaring-methods}

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

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

No exemplo acima, o método `increment` será chamado quando o `<button>` clicado.

</div>

### Reatividade Profunda {#deep-reactivity}

Na Vue, o estado é profundamente reativo por padrão. Isto significa que podes esperar que as mudanças serem detetadas mesmo quando alteras objetos ou arranjos encaixados:

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

As referências podem segurar qualquer tipo de valor, incluindo objetos profundamente encaixados, vetores, ou estruturas de dados embutidas da JavaScript tal como a `Map`.

Uma referência tornará o seu valor profundamente reativo, Isto significa que podes esperar as mudanças serem detetadas mesmo quando mudares os objetos ou vetores encaixados:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // estes funcionarão como esperado.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Os valores não primitivos são transformados em delegações reativas através da [`reactive()`](#reactive), que é discutida abaixo.

Também é possível abandonar a reatividade profunda com as [referências superficiais](/api/reactivity-advanced#shallowref). Para as referências superficiais, apenas o acesso de `.value` é rastreado para reatividade. As referências superficiais pode ser usadas para otimização do desempenho evitando o custo de observação dos grandes objetos, ou em casos onde o estado interno é gerido por uma biblioteca externa.

Leitura avançada:

- [Custos de Reatividade Reduzido pelas Estruturas Imutáveis](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integração com Sistemas de Estado Externos](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Tempo de Atualização do DOM {#dom-update-timing}

Quando alteras o estado reativo, o DOM é atualizado automaticamente. No entanto, deve ser notado que as atualizações do DOM não são aplicadas de maneira síncrona. Ao invés disto, a Vue ampara-os até o "próximo momento" no ciclo de atualização para garantir que cada componente precise atualizar apenas uma vez não importa quantas mudanças de estado tens feito.

Para esperar pela atualização do DOM terminar depois de uma mudança de estado, podes utilizar a API global [`nextTick()`](/api/general#nexttick):

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

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Existe uma outra maneira de declarar o estado reativo, com a API `reactive()`. Ao contrário duma referência que envolve o valor interno num objeto especial, a `reactive()` torna um objeto por si só reativo:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Consulte também: [Tipos para a Função `reactive`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Uso no modelo de marcação:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Os objetos reativos são [Delegações de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) e comportam-se como objetos normais. A diferença é que a Vue é capaz de intercetar o acesso e mutação de todas as propriedades dum objeto reativo para rastreio e acionamento da reatividade.

`reactive()` converte o objeto profundamente: os objetos encaixados também são envolvidos com `reactive()` quando acessados. Também é chamada por `ref()` internamente quando o valor da referência for um objeto. Semelhante às referências superficiais, existe também a API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) para abandonar a reatividade profunda.

### Delegação Reativa vs. Original \*\* {#reactive-proxy-vs-original-1}

É importante notar que o valor retornado da `reactive()` é uma [Delegação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) do objeto original, a qual não é igual ao objeto original:

```js
const raw = {}
const proxy = reactive(raw)

// a delegação NÃO é igual ao original.
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

Este regra também aplica-se aos objetos encaixados. Devido a reatividade profunda, os objetos encaixados dentro dum objeto reativo também são delegações:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitações da `reactive()` \*\* {#limitations-of-reactive}

A API de `reactive()` tem duas limitações

1. **Tipos de valor limitados**: apenas funciona para os tipos de objetos (objetos, arranjos, e [tipos de coleção](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) tais como `Map` e `Set`). Ela não pode segurar [tipos primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) tais como `string`, `number`, ou `boolean`.

2. **Não substituir um objeto inteiro**: uma vez que o rastreio da reatividade da Vue funciona sobre o acesso de propriedade, devemos sempre manter a mesma referência para objeto reativo. Isto significa que não podemos "substituir" facilmente um objeto reativo porque a conexão da reatividade para a primeira referência é perdida:

   ```js
   let state = reactive({ count: 0 })

   // a referência acima ({ count: 0 }) não está mais a ser rastreada
   // (conexão da reatividade está perdida!)
   state = reactive({ count: 1 })
   ```

3. **Não é amigável à desestruturação**: quando desestruturamos uma propriedade dum objeto reativo em variáveis locais, ou quando passamos esta propriedade à uma função, perderemos a conexão da reatividade:

   ```js
   const state = reactive({ count: 0 })

   // `count` está desconectado da `state.count` quando desestruturada.
   let { count } = state.count
   // não afeta o estado original
   count++

   // a função recebe um número simples e
   // não será capaz de rastrear as mudanças para `state.count`
   // temos de passar o objeto inteiro para reter a reatividade
   callSomeFunction(state.count)
   ```

Devido à estas limitações, recomendamos usar `ref()` como API primária para declaração de estado reativo.

## Detalhes Adicionais do Desembrulhamento da Referência \*\* {#additional-ref-unwrapping-details}

### Como Propriedade de Objeto Reativo \*\* {#ref-unwrapping-as-reactive-object-property}

Uma referência é automaticamente desembrulhada quando acessada ou modificada como uma propriedade dum objeto reativo. Em outras palavras, comporta-se como uma propriedade normal:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Se uma nova referência for atribuída à uma propriedade ligada à uma referência existente, substituirá a referência antiga:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// a referência original agora está desconectada da `state.count`
console.log(count.value)
```

O desembrulhamento da referência apenas acontece quando encaixada dentro dum objeto reativo profundo. Não aplica-se quando é acessada como uma propriedade dum [objeto de reatividade superficial](/api/reactivity-advanced#shallowreactive).

### Advertências nos Vetores e Coleções \*\* {#caveat-in-arrays-and-collections}

Ao contrário dos objetos reativos, **não existe** desembrulhamento realizado quando a referência é acessada como um elemento dum vetor ou um tipo de coleção nativa como `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// neste caso precisas de `.value`
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// neste caso precisas de `.value`
console.log(map.get('count').value)
```

### Advertências Quando Desembrulhamos nos Modelos de Marcação \*\* {#caveat-when-unwrapping-in-templates}

O desembrulhamento de referência nos modelos de marcação apenas aplica-se se a referência for uma propriedade de alto nível no contexto de interpretação do modelo de marcação.

No exemplo abaixo, `count` e `object` são propriedades de alto nível, mas `object.id` não:

```js
const count = ref(0)
const object = { id: ref(0) }
```

Portanto, esta expressão funciona como esperado:

```vue-html
{{ count + 1 }}
```

...enquanto isto **NÃO**:

```vue-html
{{ object.id + 1 }}
```

O resultado desenhado será `[object Object]1` uma vez que `object.id` não é desembrulhado quando avaliamos a expressão e continua um objeto de referência. Para corrigir isto, podemos desestruturar `id` à uma propriedade de alto nível:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Agora o resultado da interpretação será `2`.

Um outra coisa à notar é que uma referência é desembrulhada se for o valor avaliado final duma interpolação de texto (por exemplo, um marcador <code v-pre>{{ }}</code>, então o seguinte exemplo desenhará `1`):

```vue-html
{{ object.id }}
```

Isto é apenas um funcionalidade de conveniência da interpolação de texto e é equivalente ao <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Métodos com Estado \* {#stateful-methods}


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
