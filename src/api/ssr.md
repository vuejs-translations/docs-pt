# Server-Side Rendering API {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Exportado de `vue/server-renderer`**

- **Type**

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

  ### SSR Context

  Você pode passar um objeto de contexto opcional, que pode ser usado para gravar dados adicionais durante a renderização, por exemplo [acessando conteúdo de teletransportações](/guide/scaling-up/ssr.html#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  A maioria das outras APIs SSR nesta página também aceita opcionalmente um objeto de contexto. O objeto de contexto pode ser acessado no código do componente por meio do helper [useSSRContext](#usessrcontext).

- **Veja também:** [Guia - Interpretação no Lado do Servidor (SSR)](/guide/scaling-up/ssr.html)

## renderToNodeStream() {#rendertonodestream}

Renderiza a entrada como um [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exportado de `vue/server-renderer`**

- **Type**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Exemplo**

  ```js
  // dentro de um manipulador http Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Note
  Este método não é suportado na construção ESM de `vue/server-renderer`, que é dissociado de ambientes Node.js. Use [`pipeToNodeWritable`](#pipetonodewritable) como alternativa.
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Renderiza e canaliza para uma instância [Node.js Writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) existente.

- **Exportado de `vue/server-renderer`**

- **Type**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Exemplo**

  ```js
  // dentro de um manipulador http Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Renderiza entrada como um [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Exportado de `vue/server-renderer`**

- **Type**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Exemplo**

  ```js
  // inside an environment with ReadableStream support
  return new Response(renderToWebStream(app))
  ```

  :::tip Note
  Em ambientes que não expõe o construtor `ReadableStream` no escopo global, [`pipeToWebWritable()`](#pipetowebwritable) deverá ser usado como alternativa.
  :::

## pipeToWebWritable() {#pipetowebwritable}

Renderiza e canaliza para uma instância de [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) existente.

- **Exportado de `vue/server-renderer`**

- **Type**

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
  // TransformStream é disponível em ambientes como CloudFlare workers.
  // em Node.js, TransformStream precisa ser importado explicitamente de 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Renderiza entrada em modo de streaming usando uma interface simples de leitura.

- **Exportado de `vue/server-renderer`**

- **Type**

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
          console(`render completo: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // error encontrado
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Uma API de tempo de execução para recuperar o contexto do objeto passado para `renderToString()` ou outras APIs de renderização de servidor.
- **Type**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Exemplo**

  O contexto recuperado pode ser usado para anexar informações necessárias para renderizar o HTML final (por exemplo, metadados de cabeçalho).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // certifique-se de chamá-lo apenas durante o SSR
  // https://vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...anexar propriedades ao contexto
  }
  </script>
  ```
