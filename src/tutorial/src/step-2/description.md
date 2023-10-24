# Interpretação Declarativa {#declarative-rendering}

<div class="sfc">

O que vemos no editor é um componente de ficheiro único de Vue. Um componente de ficheiro único é um bloco auto-suficiente de código reutilizável que encapsula o HTML, CSS e JavaScript que se relacionam, escritos dentro dum ficheiro `.vue`.

</div>

A funcionalidade principal da Vue é a **interpretação declarativa**: usando uma sintaxe de modelo de marcação que estende o HTML, podemos descrever como o HTML deve parecer-se baseado no estado de JavaScript. Quando o estado mudar, o HTML atualiza-se automaticamente.

<div class="composition-api">

Os estados que podem acionar atualizações quando mudados são considerados **reativos**. Nós podemos declarar o estado reativo usando a API `reactive()` da Vue. Os objetos criados a partir da `reactive()` são [Delegações](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) que funcionam como os objetos normais:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

A `reactive()` apenas funciona sobre os objetos (incluindo vetores e tipos embutidos como `Map` e `Set`). A `ref()`, por outro lado, pode receber qualquer tipo de valor e criar um objeto que expõe o valor interno sob uma propriedade `.value`:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

Os detalhes sobre a `reactive()` e `ref()` são discutidos no <a target="_blank" href="/guide/essentials/reactivity-fundamentals">Guia - Fundamentos de Reatividade</a>.

<div class="sfc">

O estado reativo declarado no bloco `<script setup>` do componente pode ser usado diretamente no modelo de marcação. Isto é como podemos interpretar texto dinâmico baseado no valor do objeto `counter` e a referência `message`, usando a sintaxe de bigodes (ou chavetas):

</div>

<div class="html">

O objeto sendo passado à `createApp()` é um componente de Vue. O estado dum componente deve ser declarado dentro da sua função `setup()`, e retornado usando um objeto:

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

As propriedades no objeto retornado estarão disponíveis no modelo de marcação. Isto é como podemos interpretar texto dinâmico baseado no valor de `message`, usando a sintaxe de bigodes (ou chavetas):

</div>

```vue-html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```

Repara como não precisávamos de usar `.value` quando acessamos a referência `message` nos modelos de marcação: é automaticamente desembrulhada para uso mais sucinto.

</div>

<div class="options-api">

Os estados que podem acionar atualizações quando mudados são considerados **reativos**. Na Vue, o estado reativo é seguro nos componentes. <span class="html">No exemplo acima, o objeto sendo passado à `createApp()` é um componente.</span>

Nós podemos declarar o estado reativo usando a opção `data` do componente, que deve ser uma função que retorna um objeto:

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

A propriedade `message` estará disponível no modelo de marcação. Isto é como podemos interpretar texto dinâmico baseado no valor de `message`, usando a sintaxe de bigodes (ou chavetas):

```vue-html
<h1>{{ message }}</h1>
```

</div>

O conteúdo dentro dos bigodes não está limitado apenas à identificadores ou caminhos - podemos usar qualquer expressão de JavaScript válida:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Agora, tente criar algum estado reativo por conta própria, e use-o para interpretar o conteúdo de texto dinâmico para o `<h1>` no modelo de marcação.

</div>

<div class="options-api">

Agora, tente criar uma propriedade de dados por conta própria, e use-a como conteúdo de texto para o `<h1>` no modelo de marcação.

</div>
