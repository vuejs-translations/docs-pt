# Observadores {#watchers}

Algumas vezes podemos precisar executar "efeitos colaterais" de forma reativa - por exemplo, registar um número na consola no momento que ele mudar. Nós podemos alcançar isto com os observadores: 

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // sim, console.log() é um efeito colateral
  console.log(`new count is: ${newCount}`)
})
```

A `watch()` pode observar diretamente uma referência, e a função de resposta é disparada sempre que o valor da `count` mudar. A `watch` também pode observar outros tipos de fonte de dados - mais detalhes são cobertos no <a target="_blank" href="/guide/essentials/watchers">Guia - Observadores</a>.

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

Neste exemplo, estamos a usar a opção `watch` para observar as mudanças à propriedade `count`. A função de resposta da observação é chamada quando a `count` mudar, e recebe o novo valor como argumento. Mais detalhes são cobertos no <a target="_blank" href="/guide/essentials/watchers">Guia - Observadores</a>.

</div>

Um exemplo mais prático do que o exemplo anterior seria a requisição de novos dados quando um identificador único (ou `id`) mudar. O código que temos está à requisitar os dados de afazeres (ou `todos`) a partir duma API de simulação sobre a montagem do componente. Também existe um botão que incrementa o identificador único (ou `id`) do afazer (ou `todo`) que deveria ser requisitado. Tente implementar um observador que requisita um novo afazer (ou `todo`) quando o botão for clicado.
