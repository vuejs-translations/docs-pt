# Tipos de Utilitário {#utility-types}

:::info
Esta página lista apenas alguns tipos de utilitários comumente usados ​​que podem precisar de explicação de uso. Para obter uma lista completa dos tipos exportados, consulte o [código fonte](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Usado para anotar uma propriedade com tipos mais avançados ao usar declarações de propriedades em tempo de execução.

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
        // provide more specific type to `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Veja também:** [Guia - Atribuindo Tipos as Propriedades do Componente](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties {#componentcustomproperties}

Usado para aumentar o tipo de instância do componente para oferecer suporte a propriedades globais personalizadas.

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

  :::tip
  Aumentações devem ser colocadas em um arquivo de módulo `.ts` ou `.d.ts`. Veja [Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties) para mais detalhes.
  :::

- **Veja também:** [Guia - Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Usado para aumentar os tipos de opções do componente para suportar opções customizadas.

- **Exemplo**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Aumentações devem ser colocadas em um arquivo de módulo `.ts` ou `.d.ts`. Veja [Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties) para mais detalhes.
  :::

- **Veja também:** [Guia - Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomProps {#componentcustomprops}

Usado para aumentar propriedades TSX permitidas para usar propriedades não declaradas em elementos TSX.

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
  // now works even if hello is not a declared prop
  <MyComponent hello="world" />
  ```

  :::tip
  Aumentações devem ser colocadas em um arquivo de módulo `.ts` ou `.d.ts`. Veja [Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties) para mais detalhes.
  :::

## CSSProperties {#cssproperties}

Usado para aumentar os valores permitidos em associações de propriedade de estilo.

- **Exemplo**

  Permitir qualquer propriedade customizada de CSS

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
  <div :style="{ '--bg-color': 'blue' }">
  ```

 :::tip
  Aumentações devem ser colocadas em um arquivo de módulo `.ts` ou `.d.ts`. Veja [Aumentando Propriedades Globais](/guide/typescript/options-api.html#augmenting-global-properties) para mais detalhes.
  :::
  
  :::info Veja também
As tags SFC `<style>` suportam a vinculação de valores CSS ao estado do componente dinâmico usando a função CSS `v-bind`. Isso permite propriedades personalizadas sem aumento de tipo.

- [v-bind() em CSS](/api/sfc-css-features.html#v-bind-in-css)
  :::
