# Interpretação Declarativa

<div class="sfc">

O que vês no editor é um Componente de Ficheiro Único de Vue (SFC, sigla em Inglês). Um Componente de Ficheiro Único é um bloco de código autossuficiente reutilizável que encapsula em um conjunto a HTML, CSS e JavaScript que fazem parte do componente dentro de um ficheiro `.vue`.

</div>

A funcionalidade principal da Vue é **interpretação declarativa**: utilizando uma sintaxe de modelo de marcação de hipertexto (`template`) que estende a HTML, podemos descrever como a HTML deve se parecer com base no estado da JavaScript. Quando o estado muda, a HTML atualiza-se automaticamente.

<div class="composition-api">

Os estados que quando mudados podem acionar atualizações são considerados **reativos**. Nós podemos declarar estado reativo utilizando a API `reactive()` da Vue. Objetos criados a partir de `reactive()` são [Delegações (Proxies, termo em Inglês)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) de JavaScript que funcionam tal como objetos normais:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

A `reactive()` só funciona em objetos (incluindo arranjos (arrays, termo em Inglês) e tipos embutidos como `Map` e `Set`). A `ref()`, por outro lado, pode receber qualquer tipo de valor e criar um objeto que expõe o valor interno com uma propriedade `.value`:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

Os detalhes a respeito de `reactive()` e `ref()` são discutidos na <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">Guia - Fundamentos de Reatividade</a>.

<div class="sfc">

O estado reativo declarado no bloco `<script setup>` do componente pode ser diretamente utilizado no modelo de marcação de hipertexto (*template*, termo em Inglês).

</div>

<div class="html">

O objeto que está sendo passado para `createApp()` é um componente de Vue. Um estado do componente deve ser declarado dentro de sua função `setup()`, e retornado com uso de um objeto:

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

As propriedades no objeto retornado estarão disponíveis no modelo de marcação de hipertexto (*template*, em Inglês). Isto é como podemos interpretar texto dinâmico com base no valor de `message`, utilizando a sintaxe de bigodes:

</div>

```vue-html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```

Repare como não precisamos utilizar `.value` quando estamos acessando a referência de `message` nos modelos de marcação de hipertexto: ela é desembrulhada automaticamente para utilização mais sucinta.

</div>

<div class="options-api">

Os estados que quando mudados podem acionar atualizações são considerados **reativos**. Na Vua, o estado reativo é segurado nos componentes. No exemplo de código, o objeto que está sendo passado para `createApp()` é um componente.

Nós podemos declarar estado reativo utilizando a opção de componente `data`, que deve ser uma função que retorna um objeto:

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

A propriedade `message` estará disponível no modelo de marcação de hipertexto. Isto é como podemos interpretar texto dinâmico com base no valor de `message`, utilizando a sintaxe de bigodes:

```vue-html
<h1>{{ message }}</h1>
```

</div>

O conteúdo dentro dos bigodes não é limitado identificadores ou caminhos apenas - podemos utilizar qualquer expressão válida de JavaScript:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Agora, experimente criar tu mesmo algum estado reativo, e utilize-o para interpretar o conteúdo de texto dinâmico para o `<h1>` no modelo de marcação de hipertexto. 

</div>

<div class="options-api">

Agora, experimente criar tu mesmo uma propriedade `data`, e utilize-a como conteúdo de texto para o `<h1>` no modelo de marcação de hipertexto.

</div>
