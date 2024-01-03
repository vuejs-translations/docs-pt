# Roteamento {#routing}

## Roteamento do Lado do Cliente vs Lado do Servidor {#client-side-vs-server-side-routing}

Rotear no lado do servidor significa que o servidor envia uma resposta baseada no caminho da URL que o utilizador visita. Quando clicamos sobre uma ligação numa aplicação da Web interpretada do lado do servidor tradicional, o navegador recebe uma resposta de HTML a partir do servidor e recarrega a página inteira com o novo HTML.

Numa [Aplicação de Página Única](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA, sigla em Inglês), no entanto, a JavaScript do lado do cliente pode intercetar a navegação, pedir dinamicamente novos dados, e atualizar a página atual sem recarregamento completo da página. Isto normalmente resulta numa experiência de uso mais elegante, especialmente para os casos de uso que são mais como "aplicações" de verdade, onde o utilizador é esperado realizar muitas interações sobre um longo período de tempo.

Em tais aplicações de página única, o "roteamento" é feito sobre o lado do cliente, no navegador. Um roteador do lado do cliente é responsável por gerir a visão interpretada da aplicação usando as APIs do navegador tais como [API de História](https://developer.mozilla.org/en-US/docs/Web/API/History) ou o [evento `hashchange`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event).

## Roteador Oficial {#official-router}

<!-- TODO update links -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="Curso Grátis de Vue Router">
    Assistir um curso gratuito na Vue School
  </VueSchoolLink>
</div>

A Vue está bem adaptada para construir aplicações de página única. Para a maioria das aplicações de página única, é recomendado usar a [biblioteca Vue Router](https://github.com/vuejs/router) suportada oficialmente. Para mais detalhes, consultar a [documentação](https://vue-router-docs-pt.netlify.app/) da Vue Router.

## Roteamento Simples do Zero {#simple-routing-from-scratch}

Se apenas precisarmos dum roteamento muito simples e não desejarmos envolver uma biblioteca roteadora completa, podemos fazer isto com os [Componentes Dinâmicos](/guide/essentials/component-basics#dynamic-components) e atualizar o estado do componente atual ouvindo os [eventos de `hashcache`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) do navegador ou usando a [API de História](https://developer.mozilla.org/en-US/docs/Web/API/History).

Eis um exemplo simples:

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
