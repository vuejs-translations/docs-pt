# Componentes Assíncronos

## Utilização Básica

Em aplicações grandes, podemos precisar dividir a aplicação em pedaços mais pequenos e apenas carregar um componente a partir do servidor quando for necessário. Para tornar isto possível, a Vue tem uma função [`defineAsyncComponent`](/api/general.html#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...carrega o componente do servidor
    resolve(/* componente carregado */)
  })
})
// ... utilize `AsyncComp` como um componente normal
```

Conforme podes ver, a `defineAsyncComponent` aceita um função carregadora que retorna uma Promessa. A resposta `resolve` da Promessa deve ser chamada quando tiveres recuperado definição do teu componente do servidor. Tu também podes chamar `reject(reason)` para indicar que o carregamento falhou.

A [importação dinâmica de módulo de ECMASCript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) também retorna uma Promessa, então na maior parte das vezes a utilizaremos em conjunto com a `defineAsyncComponent`. Empacotadores como a Vite e Webpack também suportam a sintaxe, assim podemos a utilizar para importar Componentes de Ficheiro Único (SFCs, sigla em Inglês) de Vue:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

O `AsyncComp` resultante é um componente embrulhador que só chama a função carregadora quando estiver realmente interpretado na página. Além disto, ele passará adiante quaisquer propriedades e ranhuras para o componente interno, assim podes utilizar o embrulhador assíncrono para substituir continuamente o componente original enquanto estiver realizando o carregamento preguiçoso.

Tal como os componentes normais, os componentes assíncronos podem ser [registados globalmente](/guide/components/registration.html#registo-global) utilizando `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Tu também podes utilizar a `defineAsyncComponent` quando estiveres [registando um componente localmente](/guide/components/registration.html#registo-local):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Eles também podem ser definidos diretamente dentro do seu componente pai:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Estados de Erro e Carregamento

Operações assíncronas inevitavelmente envolvem estados de erro e carregamento - a `defineAsyncComponent()` suporta a manipulação destes estados através de opções avançadas:

```js
const AsyncComp = defineAsyncComponent({
  // A função carregadora
  loader: () => import('./Foo.vue'),

  // Um componente para utilizar enquanto o componente assíncrono está carregando
  loadingComponent: LoadingComponent,
  // Atraso antes da exibição do componente de carregamento. Predefinido como: 200ms
  delay: 200,

  // Um componente para utilizar se o carregamento falhar
  errorComponent: ErrorComponent,
  // O componente de erro será mostrado se uma pausa for
  // fornecida e ultrapassada. Predefinida como: Infinity
  timeout: 3000
})
```

Se um componente de carregamento for fornecido, ele será mostrado primeiro enquanto o componente interno estiver sendo carregado. Existe um valor de 200ms predefinido para o atraso antes do componente de carregamento ser exibido - isto é porque em ligações de rede rápidas, um estado de carregamento instantâneo pode ser substituído muito rápido e acabar parecendo como um tremeluzir.

Se um componente de erro for fornecido, ele será mostrado quando a Promessa retorna pela função carregadora for rejeitada. Tu também podes especificar uma pausa para mostrar o componente de erro quando a requisição estiver demorando muito.

## Utilizando com Suspense

Os componentes assíncronos podem ser utilizados com o componente embutido `<Suspense>`. A interação entre o `<Suspense>` e os componentes assíncronos estão documentadas num [capítulo dedicado ao `<Suspense>`](/guide/built-ins/suspense.html).
