# Observadores {#watchers}

## Exemplo Básico {#basic-example}

As propriedades computadas permite-nos calcular declarativamente valores derivados. No entanto, existêm casos onde precisamos realizar "efeitos colaterais" em reação as mudanças de estado - por exemplo, alterando o DOM, ou mudando um outro pedaço do estado baseado no resultado de uma operação assíncrona.

<div class="options-api">

Com a API de Opções, podemos utilizar a [opção `watch`](/api/options-state#watch) para acionar uma função sempre que uma propriedade reativa mudar:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)'
    }
  },
  watch: {
    // sempre que `question` mudar, esta função executará
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNptUk2PmzAQ/SuvXAA1sdVrmt0qqnroqa3UIxcLhuCGjKk/wkYR/70OBJLuroRkPDPvzbznuSS7rhOnQMkm2brS6s4/F0wvnbEeFdUqtB6XgoFKeZXl0z9gyQfL8w34G8h5bXiDNF3NQcWuJxtDv25Zh+CCatszSsNeaYZakDgqexD4vM7TCT9cj2Ek65Uvm83cTUr0DTGdyN7RZaN4T24F32iHOnA5hnvdtrCBJ+RcnTH180wrmLaaL4s+QNd4LBOaK3r5UWfplzTHM9afHmoxdhV78rtRcpbPmVHEf1qO5BtTuUWNcmcu8QC9046kk4l4Qvq70XzQvBdC3CyKJfb8OEa01fn4OC7Wq15pj5qidVnaeN+5jZRncmxE72upOp0uY77ulU3gSCT+uOhXnt9yiy6U1zdBRtYa+9aK+9TfrgUf8NWEtgKbK6mKQN8Qdj+/C6T4iJHkXcsKjt9WLpsZL56OXas8xRuw7cYD2LlDXKYoT7K5b+OU22rugsdpfTQVtU9FMueLBHKikRNPpLtcbnuLYZjCW7m0TIZ/92UFiQ==))

A opção `watch` também suporta um caminho delimitado por ponto como chave:

```js
export default {
  watch: {
    // Nota: apenas caminhos simples. Expressões não são suportados.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

Com a API de Composição, podemos utilizar a [função `watch`](/api/reactivity-core#watch) para acionar uma resposta sempre que um pedaço do estado reativo mudar:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// `watch` trabalha diretamente sobre uma referência
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNplkkGPmzAQhf/KKxdA3Rj1mpJUUdVDT22lHrlYxDRuYOzaJjRC/PcdxyGr3b2A7PfmmzcMc3awVlxGlW2z2rdO2wCvwmj3DenBGhcww6nuCZMM7QkLOmcG5FyRN9RQa8gH/BuVD9oQdtFb5Hm5KpL8pNx6/+vu8xj9KPv+CnYFqQnyhTFIdxb4vCkjpaFb32JVnyD9lVoUpKaVVmK3x9wQoLtXgtB0VP9/cOMveYk9Np/K5MM9l7jIflScLv990nTW9EcIwXNFR3DX1YwYk4dxyrNXTlIHdCrGyk8hWL+tqqvyZMQUukpaHYOnujdtilTLHPHXGyrKUiRH8i9obx+5UM4Z98j6Pu23qH/AVzP2R5CJRMl14aRw+PldIMdH3Bh3bnzxY+FcdZW2zPvlQ1CD7WVQfALquPToP/gzL4RHqsg89rJNWq3JjgGXzWCOqt812ao3GaqEqRKHcfO8/gDLkq7r6tEyW54Bf5TTlg==)

### Observar Tipos de Fonte {#watch-source-types}

O primeiro argumento do `watch` pode ser de diferentes tipos de "fontes" reativas: pode ser uma referência (incluindo referências computadas), um objeto reativo, uma função recuperada, ou um arranjo de várias fontes:

```js
const x = ref(0)
const y = ref(0)

// referência única
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// recuperador
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// arranjo de várias fontes
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Tome nota de que não podes observar uma propriedade de um objeto reativo desta maneira:

```js
const obj = reactive({ count: 0 })

// isto não funcionará porque estamos passando um número para `watch()`
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

Ao invés daquilo, utilize um recuperador:

```js
// Ao invés daquilo, utilize um recuperador:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

</div>

## Observadores Profundos {#deep-watchers}

<div class="options-api">

A `watch` é superficial por padrão: a resposta só acionará quando a propriedade observada for atribuida um valor novo - ele não acionará sobre mudanças de propriedade encaixada.

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Nota: cá `newValue` será igual ao `oldValue`
        // sobre as mutações encaixadas enquanto o próprio objeto
        // não for substítuido.
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Quando chamares `watch()` diretamente sobre um objeto reativo, ela criará implicitamente um observador profundo - a resposta será acionada sobre todas as mutações encaixadas:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // dispara sobre mutações de propriedade encaixada
  // Nota: cá `newValue` será igual ao `oldValue`
  // porque ambos eles apontam para o mesmo objeto!
})

obj.count++
```

Isto deve ser distinguido de um recuperador que retorna um objeto reativo - no recente caso, a resposta só disparará se o recuperador retornar um objeto diferente:

```js
watch(
  () => state.someObject,
  () => {
    // dispara só quando `state.someObject` for substituido
  }
)
```

Tu podes, no entanto, forçar o segundo caso para um observador profundo utilizando explicitamente a opção `deep`:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Nota: cá `newValue` será igual ao `oldValue`
    // *a menos que* `state.someObject` tenha sido substituido
  },
  { deep: true }
)
```

</div>

:::warning USE COM CAUTELA
A observação profunda precisa percorrer todas propriedades encaixadas dentro do objeto observado, e pode ser caro quando utilizada sobre grandes estruturas de dados. Utilize-a só quando necessário e esteja ciente das implicações de desempenho.
:::

## Observadores Incansáveis {#eager-watchers}

O `watch` é preguiçoso por padrão: a resposta não será chamada até que a fonte observada tenha mudado. Mas em alguns casos podemos querer que a mesma lógica de resposta seja executada incansavelmente - por exemplo, podemos querer pedir alguns dados iniciais, e depois pedir novamente os dados sempre que o estado relevante mudar.

<div class="options-api">

Nós podemos forçar que uma resposta do observador seja executada imediatamente declarando-a utilizando um objeto com uma função `handler` e a opção `immediate: true`:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // isto será executado imediatamente sobre a criação do componente.
      },
      // forçar a execução incansável da resposta
      immediate: true
    }
  }
  // ...
}
```

</div>

<div class="composition-api">

Nós podemos forçar uma resposta do observador a ser executada imediatamente passando a opção `immediate: true`:

```js
watch(source, (newValue, oldValue) => {
  // executado imediatamente, depois novamente quando `source` mudar
}, { immediate: true })
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

É comum para a função de resposta do observador usar exatamente o mesmo estado reativo como fonte. Por exemplo, considere o seguinte código, que usa um observador para carregar um recurso remoto sempre que a referência `todoId` mudar:

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```

Em particular, repare em como o observador usa o `todoId` duas vezes, uma vez como fonte e depois novamente dentro da função de resposta.

Isto pode ser simplificado com [`watchEffect()`](/api/reactivity-core#watcheffect). A `watchEffect()` permite-nos rastrear as dependências reativas da função de resposta automaticamente. O observador acima pode ser reescrito como:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Aqui, a função de resposta executará imediatamente, não há necessidade de especificar `immediate: true`. Durante a sua execução, ela rastreará automaticamente o `todoId.value` como uma dependência (similar as propriedades computadas). Sempre que `todoId.value` mudar, a função de resposta será executada novamente. Com a `watchEffect()`, já não precisamos passar `todoId` explicitamente como valor de fonte.

Tu podes consultar [este exemplo](/examples/#fetching-data) de `watchEffect` e da requisição reativa de dados em ação.

Para exemplos como este, com apenas uma dependência, o benefício da `watchEffect()` é relativamente pequeno. Mas para os observadores que têm várias dependências, usar `watchEffect()` remove o fardo de ter que manter a lista de dependências manualmente. Além disto, se precisares observar várias propriedades em uma estrutura encaixada, a `watchEffect()` pode provar-se mais eficiente do que um observador profundo, já que ele apenas rastreará as propriedades que são usadas na função de resposta, em vez de rastrear recursivamente todos eles.

:::tip DICA
A `watchEffect` só rastreia dependências durante sua execução **síncrona**. Quando estiveres utilizando-a com uma resposta assíncrona, apenas as propriedades acessadas antes do primeiro visto `await` serão executadas.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

Ambos `watch` e `watchEffect` permitem-nos realizar efeitos colaterais de maneira reativa. A principal diferença entre elas está na maneira de como elas rasteiam as dependências reativas:

- `watch` só rastreia a fonte observada explicitamente. Ela não rastreiará nada acessado dentro da resposta. Além disto, a resposta só aciona quando a fonte tiver sido de fato mudada. `watch` separa rastreiamente de dependência do efeito colateral, dando-nos controlo mais preciso sobre quando a resposta deveria disparar.

- `watchEffect`, por outro lado, combina o rastreiamente de dependência e efeito colateral em uma fase. Ela rastreia automaticamente toda propriedade reativa acessada durante sua execução síncrona. Isto é mais conveniente e normalmente resulta em um código mais conciso, mas torna as suas dependências reativas menos explícitas.

</div>

## Tempo de Fluxo de Resposta {#callback-flush-timing}

Quando alterares o estado reativo, ele pode acionar tanto as atualizações de componente de Vue e respostas de observador criadados por ti.

Por padrão, respostas de observador criadas pelo utilizador são chamadas **antes** das atualização de componente de Vue. Isto significa que se tentares acessar o DOM de dentro de uma resposta de observador, o DOM estará no estado antes da Vue tiver aplicado quaisquer atualizações.

Se quiseres acessar o DOM em uma resposta de observador **depois** da Vue tiver atualizado-o, precisas especificar a opção `flush: 'post'`:

<div class="options-api">

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

A `watchEffect()` pós-fluxo também tem um pseudónimo de conveniência, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* executada depois das atualizações de Vue */
})
```

</div>

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Também é possível criar observadores imperativamente utilizando o [método de instância `$watch()`](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Isto é útil para quando precisares definir um observador condicionalmente, ou apenas observar algo em resposta à interação do utilizador. Ele também permite-te parar o observador de maneira prematura.

</div>

## Parando um Observador {#stopping-a-watcher}

<div class="options-api">

Os observadores declarados utilizando a opção `watch` ou o método de instância `$watch` são paradas automaticamente quando o componente proprietário for desmontado, assim na maioria dos casos não precisas te preocupares acerca de parar o observador por ti mesmo.

Em caso raro onde precisas parar um observador antes do componente proprietário ser desmontado, a API de `$watch()` retorna uma função para isto:

```js
const unwatch = this.$watch('foo', callback)

// ...quando o observador não é mais necessário:
unwatch()
```

</div>

<div class="composition-api">

Os observadores declarados sincronamente dentro de  `setup()` ou `<script setup>` estão vinculados a instância do componente proprietário, e serão paradas automaticamente quando o componente proprietário for desmontado. Na maioria dos casos, não precisas te preocupares acerca de parar o observador por ti mesmo.

A chave aqui é que o observador deve ser criado **sincronamente**: se o observador for criado em uma resposta assíncrona, ele não estará vinculado ao componente proprietário e deve ser parado manualmente para evitar fugas de memória. Cá está um exemplo:

```vue
<script setup>
import { watchEffect } from 'vue'

// este aqui será parado automaticamente
watchEffect(() => {})

// ...este aqui não será!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Para parar manualmente um observado, utilize a função retornada para lidar com isto. Isto funciona para ambos `watch` e `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...mais tarde, quando for mais necessária
unwatch()
```

Nota que deve haver muito poucos casos onde precisas criar observadores assincronamente, e criação síncrona deve ser a preferida sempre que possível. Se precisares esperar por algum dado assíncrono, podes tornar a tua lógica de observação condicional:

```js
// dados a serem carregados assincronamente
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // faça algo quando os dados forem carregados
  }
})
```

</div>
