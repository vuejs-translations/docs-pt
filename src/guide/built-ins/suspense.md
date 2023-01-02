---
outline: deep
---

# Suspense {#suspense}

:::warning Funcionalidade Experimental
`<Suspense>` é uma funcionalidade experimental. Não é garantido de que chegue a estado estável e a API pode mudar antes disso acontecer.
:::

`<Suspense>` é um componente embutido para orquestração de dependências assíncronas em uma árvore de componente. Ele pode interpretar um estado de carregamento enquanto espera por várias dependências assíncronas encaixadas em baixo da árvore de componente ser resolvida.

## Dependências Assíncronas {#async-dependencies}

Para explicar o problema que `<Suspense>` está tentando solucionar e como ele interage com estas dependências assíncronas, vamos imaginar uma hierarquia de componente como a seguinte:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (componente com setup() assíncrono)
   └─ <Content>
      ├─ <ActivityFeed> (componente assíncrono)
      └─ <Stats> (componente assíncrono)
```

Na árvore de componente existem vários componentes encaixados dos quais a interpretação depende de algum recurso assíncrono para ser resolvida primeiro. Sem `<Suspense>`, cada um deles precisará lidar com o seus próprios estados "carregando" (loading, em Inglês), "erro" (error, em Inglês) e "carregado" (loaded, em Inglês). No pior cenário, podemos ver três giradores de carregamento na página, com o conteúdo exibindo em momentos diferentes.

O componente `<Suspense>` dá-nos a habilidade de exibir os estados de erro e carregamento enquanto servimos estas dependências assíncronas encaixadas para serem resolvidas.

Existem dois tipos das dependências assíncronas que `<Suspense>` pode servir:

1. Os componentes com um gatilho `setup()` assíncrono. Isto inclui componentes utilizando `<script setup>` com expressões `await` de alto nível.

2. [Componentes Assíncronos](/guide/components/async.html).

### `async setup()` {#async-setup}

Um gatilho de `setup()` do componente da API de Composição pode ser assíncrono:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

Se estiver a utilizar `<script setup>`, a presença de expressões `await` de alto nível automaticamente faz do componente uma dependência assíncrona:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Componentes Assíncronos {#async-components}

Os componentes assíncronos são **"suspensivos"** por padrão. Isto significa que se ele tiver um `<Suspense>` na cadeia do componente pai, ele será tratado como uma dependência assíncrona daquele `<Suspense>`. Neste caso, o estado de carregamento será controlado pelo `<Suspense>`, e as opções de carregamento (loading, em Inglês), erro (error, em Inglês), atraso (delay, em Inglês), e pausa (timeout, em Inglês) do próprio componente serão ignorados.

O componente assíncrono pode sair do controlo do `Suspense` e permitir que o componente sempre controle o seu próprio estado de carregamento especificando `suspensible: false` nas suas opções.

## Estado de Carregamento {#loading-state}

O componente `<Suspense>` tem duas ranhuras: `#default` e `#fallback`. Ambas ranhuras apenas têm em conta **um** nó filho imediato. O nó na ranhura padrão é mostrado se possível. Se não, o nó na ranhura retrocessiva (fallback, em Inglês) será mostrada.

```vue-html
<Suspense>
  <!-- componente com dependências assíncronas encaixada -->
  <Dashboard />

  <!-- estado de carregamento através da ranhura #fallback -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

Na interpretação inicial, `<Suspense>` interpretará o conteúdo da sua ranhura padrão na memória. Se quaisquer dependências assíncronas forem encontradas durante o processo, ele entrará um estado **pendente (pending, em Inglês)**. Durante o estado pendente, o conteúdo retrocessivo será exibido. Quando todas dependências assíncronas encontradas tiver sido resolvidas, `<Suspense>` entre em um estado **resolvido (resolved, em Inglês)** e o conteúdo da ranhura padrão resolvida é exibido.

Se nenhuma das dependências assíncronas foi encontra durante a interpretação, `<Suspense>` irá diretamente para um estado resolvido.

Uma vez em um estado resolvido, `<Suspense>` apenas reverterá para um estado pendente se nó de raiz da ranhura `#default` é substituída. As novas dependências assíncronas encaixadas no fundo da árvore **não** causarão o `<Suspense>` a reverter para um estado pendente.

Quanto uma reversão acontece, conteúdo retrocessivo não será imediatamente exibido. Ao invés do, `<Suspense>` exibirá conteúdo `#default` anterior enquanto espera que o novo conteúdo e suas dependências assíncronas sejam resolvidas. Este comportamento pode ser configurado com a propriedade `timeout`: `<Suspense>` mudará para conteúdo retrocessivo se demorar mais que o `timeout` para interpretar o novo conteúdo padrão. Um valor de `timeout` de `0` causará o conteúdo retrocessivo ser exibido imediatamente quando o conteúdo for substituído.

## Eventos {#events}

O componente `<Suspense>` emite 3 eventos: `pending`, `resolve` e `fallback`. O evento `pending` ocorre quando estiveres entrando em um estado pendente. O evento `resolve` é emitido quando o novo conteúdo termina a resolução na ranhura `default`. O evento `fallback` é disparado quando os conteúdos da ranhura `fallback` são exibidos.

Os eventos poderiam ser utilizado, por exemplo, para mostrar o indicador de carregamento na frente do DOM antigo enquanto os novos componentes estavam carregando.

## Manipulação de Erro {#error-handling}

`<Suspense>` atualmente não fornece manipulação de erro através do próprio componente - no entanto, podes utilizar a opção [`errorCaptured`](/api/options-lifecycle.html#errorcaptured) ou o gatilho [`onErrorCaptured()`](/api/composition-api-lifecycle.html#onerrorcaptured) para capturar e manipular erros assíncronos no componente pai de `<Suspense>`.

## Combinando com Outros Componentes {#combining-with-other-components}

É comum querer utilizar `<Suspense>` em conjunto com os componentes [`<Transition>`](./transition) e [`<KeepAlive>`](./keep-alive). A ordem de encaixamento destes componentes é importante para conseguir que todos eles funcionem corretamente.

Além disto, estes componentes são frequentemente utilizados em conjunto com o componente `<RouterView>` do [Roteador de Vue (Vue Router, em Inglês)](https://router.vuejs.org/).

O seguinte exemplo mostra como encaixar estes componentes para que todos eles se comportem como o esperado. Para combinações mais simples podes remover os componentes que não precisas:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- conteúdo principal -->
          <component :is="Component"></component>

          <!-- estado de carregamento -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

O Roteador de Vue (Vue Router, em Inglês) tem suporte embutido para [componentes carregados preguiçosamente](https://router.vuejs.org/guide/advanced/lazy-loading.html) utilizando importações dinâmicas. Estes são distintos dos componentes assíncronos e atualmente não acionarão `<Suspense>`. No entanto, podem ainda ter componentes assíncronos como descendentes e estes podem acionar `<Suspense>` de maneira normal.
