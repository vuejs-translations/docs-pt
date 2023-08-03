# Propriedades Computadas {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Aula gratuita sobre as Propriedades Computadas de Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Aula gratuita sobre as Propriedades Computadas de Vue.js"/>
</div>

## Exemplo Básico {#basic-example}

As expressões no modelo de marcação são muito convenientes, porém elas são destinadas à operações simples. Colocar muita lógica nos teus modelos de marcação pode torná-los inchados e difíceis de manter. Por exemplo, se tivermos um objeto com um arranjo (`array`) encaixado:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

</div>

E quisermos exibir mensagens diferentes caso o `author` tiver alguns livros ou não:

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

Neste ponto, o modelo de marcação está ficando um pouco desarrumado. Nós precisamos olhar nele por um segundo antes de perceber que ela realiza um cálculo dependendo de `author.books`. Mais importante, nós provavelmente não queremos nos repetir se precisarmos incluir este cálculo no modelo de marcação mais de uma vez.

É por isto que para lógica complexa que inclui dados reativos, é recomendado utilizar uma **propriedade computada**. Cá está o mesmo exemplo, refeito.

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // um recuperador computado
    publishedBooksMessage() {
      // `this` aponta para instância do componente
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Cá temos declarado uma propriedade computada `publishedBooksMessage`.

Tente mudar o valor do arranjo `books` no `data` da aplicação e verás como `publishedBooksMessage` está mudando por consequência.

Tu podes vincular dados às propriedades computadas no modelo de marcação tal como uma propriedade normal. A Vue está consciente de que `this.publishedBooksMessage` depende de `this.author.books`, assim ela atualizará qualquer vínculos que dependem de `this.publishedBooksMessage` quando `this.author.books` mudar.

Consulte também: [Tipos para as Propriedades Computadas](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// uma referência computada
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Cá temos declarados uma propriedade computada `publishedBooksMessage`. A função `computed()` espera que seja passada uma função recuperadora, e o valor retornado é uma **referência computada**. Semelhante as referências normais, podes acessar o resultado computado como `publishedBooksMessage.value`. As referências computadas também são desembrulhadas automaticamente nos modelos de marcação assim podes referenciá-las sem `.value` nas expressões do modelo de marcação.

Uma propriedade computada rastreia automaticamente suas dependências reativas. A Vue está consciente de que a computação de `publishedBooksMessage` depende de `author.books`, assim ela atualizará quaisquer vínculos que dependem de `publishedBooksMessage` quando `author.books` mudar.

Consulte também: [Tipos para os Computados](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Armazenamento de consulta imediata de computado vs Métodos {#computed-caching-vs-methods}

Tu podes ter reparado que podemos alcançar o mesmo resultado invocando um método na expressão:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// no componente
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// no componente
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

</div>

No lugar de uma propriedade computada, podemos definir a mesma função como um método. Para o resultado final, as duas abordagens são de fato exatamente a mesma. No entanto, a diferença é que as **propriedades computadas são armazenadas para consulta imediata com base nas suas dependências reativas**. Uma propriedade computada só será reavaliada quando alguma de suas dependências reativas tiver mudado. Isto significa que enquanto `author.books` não tiver mudado, vários acessos ao `publishedBooksMessage` retornarão imediatamente o resultado computado anteriormente sem ter que executar a função recuperadora novamente.

Isto também significa que a seguinte propriedade computada nunca atualizará, porque `Date.now()` não é uma dependência reativa:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

Em comparação, uma invocação de método **sempre** executará a função sempre que um reinterpretação acontecer.

Porquê que precisamos de armazenamento de consulta imediata? Imagine que temos uma propriedade computada cara `list`, que precisa iterar através de um enorme arranjo (`array`) e fazendo muitos cálculos. Então podemos ter outras propriedades computadas que como consequência dependem de `list`. Sem o armazenamento de consulta imediata, estaríamos executando o recuperador de `list` mais vezes do que o necessário! Nos casos onde não quiseres o armazenamento de consulta imediata, utilize uma chamada de método.

## Propriedades Computadas Graváveis {#writable-computed}

As propriedades computadas são por definição apenas recuperadores. Se tentares atribuir um novo valor à uma propriedade computada, receberás um aviso em tempo de execução. Em casos raros onde precisas de um propriedade computada "gravável", podes criar uma fornecendo ambos um recuperador e um definidor:

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // recuperador
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // definidor
      set(newValue) {
        // Nota: nós estamos utilizando a sintaxe de atribuição de desestruturação.
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Agora quando executares `this.fullName = 'John Doe'`, o definidor será invocado e `this.firstName` e `this.lastName` serão atualizados por consequência.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // recuperador
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // definidor
  set(newValue) {
    // Nota: nós estamos utilizando a sintaxe de atribuição de desestruturação.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Agora quando executares `fullName.value = 'John Doe'`, o definidor será invocado e `firstName` e `lastName` serão atualizados por consequência.

</div>

## Boas Práticas {#best-practices}

### Os recuperadores deve estar livres de efeitos colaterais {#getters-should-be-side-effect-free}

É importante lembrar que as funções de recuperação computadas só devem realizar cálculo puro e estar livres de efeitos colaterais. Por exemplo, **não faça requisições assíncronas ou mutações de DOM dentro de um recuperador computado!** Considere uma propriedade computada como descrevendo de maneira declarativa como derivar um valor com base em outros valores - seu única responsabilidade deve ser computar e retornar aquele valor. Adiante no guia discutiremos como podemos realizar efeitos colaterais em reação as mudanças de estado com [observadores](./watchers).

### Evite a mutação de valor computado {#avoid-mutating-computed-value}

O valor retornado a partir de uma propriedade computada é um estado derivado. Considere-o como uma fotografia temporária - toda vez que o estado de origem mudar, uma nova fotografia é criada. Não faz sentido mudar uma fotografia, então um valor de retorno computado deve ser tratado como apenas-leitura e nunca ser mudada - ao invés disto, atualize o estado de origem do qual ele depende para acionar novos cálculos.
