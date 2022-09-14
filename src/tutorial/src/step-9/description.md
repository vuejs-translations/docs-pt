# Ciclo de Vida e Referências do Modelo de Marcação

Até aqui, a Vue tem lidando com todos as atualizações da DOM por nós, graças a reatividade e interpretação declarativa. No entanto, inevitavelmente haverá casos onde precisaremos trabalhar manualmente com a DOM.

Nós podemos requisitar uma **referência do modelo de marcação** - por exemplo, uma referência a um elemento no modelo de marcação - utilizando o <a target="_blank" href="/api/built-in-special-attributes.html#ref">atributo especial `ref`</a>:

```vue-html
<p ref="p">hello</p>
```

<div class="composition-api">

Para acessar a referência, precisamos declarar <span class="html"> e expor</span> uma referência com o nome respondente:

<div class="sfc">

```js
const p = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const p = ref(null)

  return {
    p
  }
}
```

</div>

Repara que a referência é inicializada com o valor `null`. Isto é porque o elemento ainda não existe no momento que <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> é executada. O referência do modelo de marcação só é acessível depois do componente ser **montado**.

Para executar o código depois de montar, podemos utilizar a função `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // O componente já está montado.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // O componente já está montado.
    })
  }
})
```

</div>
</div>

<div class="options-api">

O elemento será exposto no `this.$refs` como `this.$refs.p`. No entanto, só podes acessá-lo depois do componente estar **montado**.

Para executar o código depois montar, podemos utilizar a opção `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // O componente já está montado.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // O componente já está montado.
  }
})
```

</div>
</div>

Este é chamado de um **gatilho do ciclo de vida** - ele permite-nos registar uma resposta a ser chamada em certos momentos do ciclo de vida do componente. Existe outros gatilhos tais como <span class="options-api">`created` e `updated`</span><span class="composition-api">`onUpdated` e `onUnmounted`</span>. Consulte o <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Diagrama do Ciclo de Vida</a> por mais detalhes.

Agora, experimente adicionar um gatilho <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>, acessar o `<p>` através de <span class="options-api">`this.$refs.p`</span><span class="composition-api">`p.value`</span>, e executar algumas operações diretas de DOM sobre ela (por exemplo, mudando sua `textContent`).
