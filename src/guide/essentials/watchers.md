# Observadores

## Exemplo Básico

As propriedades computadas permite-nos calcular declarativamente valores derivados. No entanto, existêm casos onde precisamos realizar "efeitos colaterais" em reação as mudanças de estado - por exemplo, alterando o DOM, ou mudando um outro pedaço do estado baseado no resultado de uma operação assíncrona.

<div class="options-api">

Com a API de Opções, podemos utilizar a [opção `watch`](/api/options-state.html#watch) para acionar uma função sempre que uma propriedade reativa mudar:

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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gJ0Vycm9yISBDb3VsZCBub3QgcmVhY2ggdGhlIEFQSS4gJyArIGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

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

Com a API de Composição, podemos utilizar a [função `watch`](/api/reactivity-core.html#watch) para acionar uma resposta sempre que um pedaço do estado reativo mudar:

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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbnN3ZXIudmFsdWUgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

### Observar Tipos de Fonte

O primeiro argumento do `watch` pode ser de diferentes tipos de "fontes" reativas: pode ser uma referência (incluindo referências computadas), um objeto reativo, uma função recuperada, ou um arranjo de várias fontes:

```js
const x = ref(0)
const y = ref(0)

// referência única
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
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

## Observadores Profundos

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

:::warning Utilize com Cautela
A observação profunda precisa percorrer todas propriedades encaixadas dentro do objeto observado, e pode ser caro quando utilizada sobre grandes estruturas de dados. Utilize-a só quando necessário e esteja ciente das implicações de desempenho.
:::

<div class="options-api">

## Observadores Incansáveis \*

O `watch` é preguiçoso por padrão: a resposta não será chamada até que a fonte observada tenha mudado. Mas em alguns casos podemos querer que a mesma lógica de resposta seja executada incansavelmente - por exemplo, podemos querer pedir alguns dados iniciais, e depois pedir novamente os dados sempre que o estado relevante mudar.

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

## `watchEffect()` \*\*

O `watch()` é preguiçoso: a resposta não será chamada até que a fonte observada tenha sido mudada. Mas em alguns casos podemos querer que a mesma lógica de resposta seja executada incansavelmente - por exemplo, podemos querer pedir alguns dados iniciais, e depois pedir novamente os dados sempre que o estado relevante mudar. Nós podemos nos encontrar fazendo isto:

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// pedir imediatamente
fetchData()
// ...depois observar por mudanças na url
watch(url, fetchData)
```

Isto pode ser simplificado com [`watchEffect()`](/api/reactivity-core.html#watcheffect). A `watchEffect()` permite-nos realizar um efeito colateral imediatamente enquanto rastreiamos as dependências reativas do efeito. O exemplo acima pode ser reescrito como:

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

Cá, a resposta executará imediatamente. Durante a sua execução, também rastreiará automaticamente o `url.value` como uma dependência (semelhante as propriedades computadas). Sempre que `url.value` mudar, a resposta será executada novamente.

Tu podes consultar [este exemplo](/examples/#fetching-data) com `watchEffect` e a requisição reativa de dados em ação.

:::tip
A `watchEffect` só rastreia dependências durante sua execução **síncrona**. Quando estiveres utilizando-a com uma resposta assíncrona, apenas as propriedades acessadas antes do primeiro visto `await` serão executadas.
:::

### `watch` vs. `watchEffect`

Ambos `watch` e `watchEffect` permitem-nos realizar efeitos colaterais de maneira reativa. A principal diferença entre elas está na maneira de como elas rasteiam as dependências reativas:

- `watch` só rastreia a fonte observada explicitamente. Ela não rastreiará nada acessado dentro da resposta. Além disto, a resposta só aciona quando a fonte tiver sido de fato mudada. `watch` separa rastreiamente de dependência do efeito colateral, dando-nos controlo mais preciso sobre quando a resposta deveria disparar.

- `watchEffect`, por outro lado, combina o rastreiamente de dependência e efeito colateral em uma fase. Ela rastreia automaticamente toda propriedade reativa acessada durante sua execução síncrona. Isto é mais conveniente e normalmente resulta em um código mais conciso, mas torna as suas dependências reativas menos explícitas.

</div>

## Tempo de Fluxo de Resposta

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

## `this.$watch()` \*

Também é possível criar observadores imperativamente utilizando o [método de instância `$watch()`](/api/component-instance.html#watch):

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

## Parando um Observador

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
