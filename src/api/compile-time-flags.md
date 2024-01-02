---
outline: deep
---

# Opções de Compilação {#compile-time-flags}

:::tip DICA
As opções de compilação apenas aplicam-se quando usamos a construção de `esm-bundler` da Vue (isto é, `vue/dist/vue.esm-bundler.js`).
:::

Quando usamos a Vue com uma etapa de construção, é possível configurar um número de opções de compilação para ativar ou desativar certas funcionalidades. O benefício de usar as opções de compilação é que as funcionalidades desativadas desta maneira podem ser removidas do pacote final através da agitação da árvore.

A Vue funcionará mesmo se estas opções não forem explicitamente configuradas. No entanto, é recomendado sempre configurá-las para que as funcionalidades relevantes podem ser removidas corretamente quando possível.

Consultar os [Guias de Configuração](#configuration-guides) sobre como configurá-las dependendo da nossa ferramenta de construção.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Predefinida como:** `true`

  Ativa ou desativa o suporte da API de Opções. Desativar isto resultará em pacotes menores, mas pode afetar a compatibilidade com as bibliotecas de terceiros se estas dependerem da API de Opções.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Predefinida como:** `false`

  Ativa ou desativa o suporta das ferramentas de programação nas construções de produção. Isto resultará em mais código incluído no pacote, então é recomendado ativar isto apenas para fins de depuração.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" /> {#VUE_PROD_HYDRATATION_MISMATCH_DETAILS}

- **Predefinida como:** `false`

  Ativa ou desativa avisos detalhados para as disparidades de hidratação nas construções de produção. Isto resultará em mais código incluído no pacote, então é recomendado ativar isto apenas para fins de depuração.

## Guias de Configuração {#configuration-guides}

### Vite {#vite}

A `@vitejs/plugin-vue` fornece automaticamente valores padrão para estas opções. Para mudar os valores padrão, usamos a [opção de configuração `define`](https://pt.vitejs.dev/config/shared-options#define) da Vite:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // ativar detalhes de disparidade de hidratação na
    // construção de produção
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### `vue-cli` {#vue-cli}

A `@vue/cli-service` fornece automaticamente os valores padrão para algumas destas opções. Para configurar ou mudar os valores:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### `webpack` {#webpack}

As opções devem ser definidas usando a [`DefinePlugin`](https://webpack.js.org/plugins/define-plugin/) da Webpack:

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

As opções devem ser definidas usando [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
