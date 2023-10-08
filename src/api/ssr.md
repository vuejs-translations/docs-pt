# API da Interpretação do Lado do Servidor {#server-side-rendering-api}

## `renderToString()` {#rendertostring}

- **Exportada a partir do `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Exemplo**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### Contexto da Interpretação no Lado do Servidor {#ssr-context}

  Nós podemos passar um objeto de contexto opcional, o qual pode ser usado para gravar dados adicionais durante a interpretação, por exemplo [acessando o conteúdo dos teletransportes](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  A maioria das outras APIs da Interpretação do Lado do Servidor nesta página também aceitam opcionalmente um objeto de contexto. O objeto de contexto pode ser acessado no código do componente através da auxiliar [`useSSRContext`](#usessrcontext).

- **Consulte também** [Guia - Interpretação do Lado do Servidor](/guide/scaling-up/ssr)

## `renderToNodeStream()` {#rendertonodestream}

Interpreta a entrada como uma [corrente legível da Node.js](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exportada a partir do `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Exemplo**

  ```js
  // dentro dum manipulador de HTTP da Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip NOTA
  Este método não suportado na construção de módulo de ECMAScript do `vue/server-renderer`, que é separado dos ambientes da Node.js. No lugar disto, usamos a [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## `pipeToNodeWritable()` {#pipetonodewritable}

Interpreta e canaliza à uma instância de [corrente gravável da Node.js](https://nodejs.org/api/stream.html#stream_writable_streams) existente.

- **Exportada a partir do `vue/server-renderer`**

- **Tipo**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Exemplo**

  ```js
  // dentro dum manipulador de http da Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## `renderToWebStream()` {#rendertowebstream}

Interpreta a entrada como uma [corrente legível de Web](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Exportada a partir do `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Exemplo**

  ```js
  // dentro dum ambiente com suporte de `ReadableStream`
  return new Response(renderToWebStream(app))
  ```

  :::tip NOTA
  Nos ambientes que não expõem o construtor `ReadableStream` no âmbito global, [`pipeToWebWritable()`](#pipetowebwritable) deve ser usado.
  :::

## `pipeToWebWritable()` {#pipetowebwritable}

Interpreta e canaliza à uma instância de [conduta gravável de Web](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) existente.

- **Exportada a partir do `vue/server-renderer`**

- **Tipo**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Exemplo**

  Isso é normalmente usado em combinação com [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // `TransformStream` é disponível em ambientes como operários da
  // CloudFlare. Na Node.js, `TransformStream` precisa ser
  // importado explicitamente a partir de 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## `renderToSimpleStream()` {#rendertosimplestream}

Interpreta a entrada no modo de corrente usando uma simples interface legível.

- **Exportado de `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Exemplo**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // feito
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // erro encontrado
      }
    }
  )
  ```

## `useSSRContext()` {#usessrcontext}

Uma API de tempo de execução para recuperar o objeto do contexto passado à `renderToString()` ou outras APIs interpretação do servidor.


- **Tipo**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Exemplo**

  O contexto recuperado pode ser usado para anexar informação que for necessária para produzir o HTML final (por exemplo, metadados de cabeçalho).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // Temos apenas de certificar-nos de chamá-la durante a
  // interpretação do lado do servidor
  // https://pt.vitejs.dev/guide/ssr#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...anexar propriedades ao contexto
  }
  </script>
  ```
