# Tipos de Utilitários de TypeScript {#utility-types}

:::info INFORMAÇÃO
Esta página lista apenas alguns tipos de utilitários comummente usados que podem precisar de explicação para o seu uso. Para uma lista completa de tipos exportados, consulte o [código-fonte](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## `PropType<T>` {#proptype-t}

Usado para anotar uma propriedade com tipos mais avançados quando usamos as declarações de propriedades de execução.

- **Exemplo**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // fornecer tipo mais específico ao `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Consulte também:** [Guia - Tipos para as Propriedades do Componente](/guide/typescript/options-api#typing-component-props)

## `MaybeRef<T>` {#mayberef}

Pseudónimo para `T | Ref<T>`. Útil para anotar argumentos de [Funções de Composição](/guide/reusability/composables).

- Apenas suportado na 3.3+.

## `MaybeRefOrGetter<T>` {#maybereforgetter}

Pseudónimo para `T | Ref<T> | (() => T)`. Útil para anotar argumentos de [Funções de Composição](/guide/reusability/composables).

- Apenas suportado na 3.3+.

## `ExtractPropTypes<T>` {#extractproptypes}

Extrai tipos de propriedades a partir dum objeto de opções de propriedades de tempo de execução. Os tipos extraídos são rosto interno - isto é, as propriedades resolvidas recebidas pelo componente. Isto significa que propriedades booleanas e propriedades com os valores padrão são sempre definidas, mesmo se não forem obrigatórias.

Para extrair propriedades de rosto público, isto é, propriedades que o pai é permitido passar, usamos [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Exemplo**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## `ExtractPublicPropTypes<T>` {#extractpublicproptypes}

Extrai tipos de propriedade a partir dum objeto de opções de propriedades de tempo de execução. Os tipos extraídos são rosto público - isto é, as propriedades que o pai é permitido passar.

- **Exemplo**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## `ComponentCustomProperties` {#componentcustomproperties}

Usado para aumentar o tipo da instância do componente para suportar as propriedades globais personalizadas.

- **Exemplo**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

:::tip DICA
Os aumentos devem ser colocados num ficheiro `.ts` ou `.d.ts` de módulo. Consulte [Colocação do Aumento de Tipo](/guide/typescript/options-api#augmenting-global-properties) por mais detalhes.
:::

- **Consulte também:** [Guia - Aumentando Propriedades Globais](/guide/typescript/options-api#augmenting-global-properties)

## `ComponentCustomOptions` {#componentcustomoptions}

Usado para aumentar os tipos das opções do componente para suportar opções personalizadas.

- **Exemplo**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

:::tip DICA
Os aumentos devem ser colocados num ficheiro `.ts` ou `.d.ts` de módulo. Consulte [Colocação do Aumento de Tipo](/guide/typescript/options-api#augmenting-global-properties) por mais detalhes.
:::

- **Consulte também:** [Guia - Aumentando Propriedades Globais](/guide/typescript/options-api#augmenting-global-properties)

## `ComponentCustomProps` {#componentcustomprops}

Usado para aumentar as propriedades de TSX permitidas no sentido de usar propriedades não declaradas sobre os elementos de TSX.

- **Exemplo**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // agora funciona mesmo se `hello` não for uma propriedade declara
  <MyComponent hello="world" />
  ```

:::tip DICA
Os aumentos devem ser colocados num ficheiro `.ts` ou `.d.ts` de módulo. Consulte [Colocação do Aumento de Tipo](/guide/typescript/options-api#augmenting-global-properties) por mais detalhes.
:::

## `CSSProperties` {#cssproperties}

Usado para aumentar os valores permitidos nos vínculos da propriedade de estilo.

- **Exemplo**

  Permitir qualquer propriedade de CSS personalizada

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```
  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip DICA
Os aumentos devem ser colocados num ficheiro `.ts` ou `.d.ts` de módulo. Consulte [Colocação do Aumento de Tipo](/guide/typescript/options-api#augmenting-global-properties) por mais detalhes.
:::
  
:::info CONSULTE TAMBÉM
Os marcadores `<style>` de componente de ficheiro único suportam ligação de valores de CSS ao estado do componente dinâmico usando a função de CSS `v-bind`. Isto permite propriedades personalizadas sem aumento de tipo.

- [`v-bind()` na CSS](/api/sfc-css-features#v-bind-in-css)
:::
