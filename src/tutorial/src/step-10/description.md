# Observadores

Algumas vezes podemos precisar executar "efeitos colaterais" de forma reativa - por exemplo, registando um número na consola no momento que ele mudar. Nós podemos alcançar isto com os observadores: 

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // sim, console.log() é um efeito colateral
  console.log(`new count is: ${newCount}`)
})
```

O `watch()` pode observar uma referência diretamente, e a resposta é disparada sempre que o valor da `count` mudar. O `watch` também pode observar outros tipos de fontes de dados - mais detalhes são cobridos no <a target="_blank" href="/guide/essentials/watchers.html">Guia - Observadores</a>.

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // sim, console.log() é um efeito colateral
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

Aqui, estamos utilizando a opção `watch` para observar as mudanças da propriedade `count`. A resposta de `watch` é chamada quando a `count` mudar, e recebe o novo valor como argumento. Mais detalhes são cobertos na <a target="_blank" href="/guide/essentials/watchers.html">Guia - Observadores</a>.

</div>

Um exemplo mais prático do que o de registo na consola seria a requisição de novos dados quando uma `id` mudar. O código que nós temos está requisitando os dados de afazeres `todos` a partir de uma API de imitação na montagem do componente. Também existe um botão que incrementa o `id` de afazer `todo` que deveria ser requisitado. Experimente implementar um observador que requisita um novo afazer `todo` quando o botão é clicado.
