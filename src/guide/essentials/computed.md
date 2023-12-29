# Propriedades Computadas {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Aula Gratuita de Propriedades Computadas de Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Aula Gratuita de Propriedades Computadas de Vue.js"/>
</div>

## Exemplo Básico {#basic-example}

As expressões no modelo de marcação são muito convenientes, porém estas estão destinadas às operações simples. Colocar muita lógica nos nossos modelos de marcação pode torná-los inchados e difíceis de manter. Por exemplo, se tivermos um objeto com um vetor encaixado:

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

E queremos exibir mensagens diferentes se o `author` já tiver alguns livros ou não:

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

Neste ponto, o modelo de marcação está ficando um pouco desarrumado. Nós temos que olhar neste por um segundo antes de percebermos que este realiza um cálculo dependendo da `author.books`. Acima de tudo, provavelmente não queremos ser repetitivos ao incluir este cálculo no modelo de marcação mais de uma vez.

É por isto que para lógica complexa que inclui dados reativos, é recomendado usar uma **propriedade computada**. Eis o mesmo exemplo, refeito:

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
      // `this` aponta à instância do componente
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Eis que declaramos uma propriedade computada `publishedBooksMessage`.

Nós podemos experimentar mudar o valor do vetor `books` na `data` da aplicação e veremos como `publishedBookMessage` está mudando por consequência.

Nós podemos vincular os dados às propriedades computadas nos modelos de marcação tal como uma propriedade normal. A Vue está consciente de que `this.publishedBooksMessage` depende da `this.author.books`, então esta atualizará quaisquer vínculos que dependem da `this.publishedBooksMessage` quando `this.author.books` mudar.

Consultar também: [Tipificando as Propriedades Computadas](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

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

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Eis que declaramos uma propriedade computada `publishedBooksMessage`. A função `computed()` espera uma função recuperada ser passada, e o valor retornado ser uma **referência computada**. Semelhante às referências normais, podemos acessar o resultado computado como `publishedBooksMessage.value`. As referências computadas também são embrulhadas automaticamente nos modelos de marcação, assim podemos referenciá-las sem `.value` nas expressões do modelo de marcação.

Uma propriedade computada rastreia automaticamente suas dependências reativas. A Vue está consciente de que a computação de `publishedBooksMessage` depende da `author.books`, então esta atualizará quaisquer vínculos que dependem da `publishedBooksMessage` quando `author.books` mudar.

Consultar também: [Tipificando os Computados](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Armazenamento de Consulta Imediata de Computado vs Métodos {#computed-caching-vs-methods}

Nós podemos ter reparado que podemos alcançar o mesmo resultado invocando um método na expressão:

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

No lugar duma propriedade computada, podemos definir a mesma função como um método. Para resultado final, as duas abordagens são de fato exatamente a mesma. No entanto, a diferença é que as **propriedades computadas são armazenadas para consulta imediata baseada nas suas dependências reativas**. Uma propriedade computada apenas reavaliará quando algumas das suas dependências reativas tiverem mudado. Isto significa que enquanto `author.books` não tiver mudado, vários acessos ao `publishedBooksMessage` retornarão imediatamente o resultado computado anteriormente sem precisar executar a função recuperadora novamente.

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

Por que precisamos do armazenamento de consulta imediata? Imaginemos que temos uma propriedade computada dispendiosa `list`, que exige percorrer um vetor enorme e fazer muitos cálculos. Depois podemos ter outras propriedades computadas que por sua vez dependem da `list`. Sem o armazenamento de consulta imediata, estaríamos executando o recuperador da `list` mais vezes do que necessário! Nos casos onde não queremos o armazenamento de consulta imediata, usamos uma chamada de método.

## Propriedades Computadas Graváveis {#writable-computed}

As propriedades computadas são por padrão apenas recuperadoras. Se tentarmos atribuir um novo valor a uma propriedade computada, receberemos um aviso de execução. Nos casos raros onde precisamos duma propriedade computada "gravável", podemos criar uma fornecendo ambos um recuperador e um definidor:

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
        // Nota: estamos usando a sintaxe de atribuição desestruturada.
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Agora quando executarmos `this.fullName = 'John Doe'`, o definidor será invocado e `this.firstName` e `this.lastName` serão atualizadas por consequência.

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
    // Nota: estamos usando a sintaxe de atribuição desestruturada.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Agora quando executarmos `fullName.value = 'John Doe'`, o definidor será invocado e `firstName` e `lastName` serão atualizadas por consequência.

</div>

## Boas Práticas {#best-practices}

### Os recuperadores não deveriam ter efeitos colaterais {#getters-should-be-side-effect-free}

É importante lembrar que as funções recuperadoras computadas apenas deveriam realizar computação pura e ser livres de efeitos colaterais. Por exemplo, **não fazer requisições assíncronas ou alterar o DOM dentro dum recuperador computado!** Pensemos duma propriedade computada como declarativamente descrevendo como derivar um valor baseado em outros valores - sua única responsabilidade deveria ser computar e retornar este valor. Mais tarde no guia discutiremos como realizamos efeitos colaterais em reação às mudanças de estado com os [observadores](./watchers).

### Evitar alterar o valor computado {#avoid-mutating-computed-value}

O valor retornado duma propriedade computada é o estado derivado. Consideremos esta como uma fotografia temporária - toda vez que o estado de origem mudar, uma nova fotografia é criada. Não faz sentido alterar uma fotografia, então um valor de retorno computado deveria ser tratado como destinada apenas a leitura e nunca deveria ser alterada - ao invés disto, atualizamos o estado de origem do qual este depende para acionar novos cálculos.
