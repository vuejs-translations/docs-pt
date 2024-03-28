# Componentes Assíncronos {#async-components}

## Uso Básico {#basic-usage}

Em grandes aplicações, podemos precisar dividir a aplicação em partes menores e apenas carregar um componente do servidor quando for necessário. Para possibilitar isto, a Vue tem uma função [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...carregar o componente do servidor
    resolve(/* componente carregado */)
  })
})
// ... usar `AsyncComp` como um componente normal
```

Como podemos ver, `defineAsyncComponent` aceita uma função carregadora que retorna uma promessa. A função de resposta `resolve` da promessa deve ser chamada quando tivermos recuperado a definição da nosso componente do servidor. Nós também podemos chamar `reject(reason)` para indicar que o carregamento falhou.

A [importação dinâmica do módulo da ECMAScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) também retorna uma promessa, então na maioria das vezes a usaremos em conjunto com a `defineAsyncComponent`. As empacotadoras como a Vite e Webpack também suportam a sintaxe (e a usarão como pontos de separação do pacote), assim podemos usá-la para importar os componentes de ficheiro único da Vue:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

O `AsyncComp` resultante é um componente embrulhador que só chama a função carregadora quando estiver realmente desenhada na página. Além disto, este passará adiante quaisquer propriedades e ranhuras ao componente interno, assim podemos usar o embrulhador assíncrono para substituir perfeitamente o componente original enquanto realizamos o carregamento preguiçoso.

Tal como acontece com os componentes normais, os componentes assíncronos podem ser [registados globalmente](/guide/components/registration#global-registration) usando `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Nós também podemos usar a `defineAsyncComponent` quando estivermos [registando um componente localmente](/guide/components/registration#local-registration):

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

Estes também podem ser definidos diretamente dentro do seu componente pai:

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

## Carregamento e Estados de Erro {#loading-and-error-states}

Operações assíncronas inevitavelmente envolvem carregamento e estados de erro - a `defineAsyncComponent()` suporta a manipulação destes estados através de opções avançadas:

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

## Utilizando com Suspense {#using-with-suspense}

Os componentes assíncronos podem ser utilizados com o componente embutido `<Suspense>`. A interação entre o `<Suspense>` e os componentes assíncronos estão documentadas num [capítulo dedicado ao `<Suspense>`](/guide/built-ins/suspense.html).
