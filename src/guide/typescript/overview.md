---
outline: deep
---

# Utilizando a Vue com TypeScript

Um sistema de tipo como TypeScript pode detetar muitos erros comuns através da analise estática em tempo de execução. Isto reduz a risco de erros de tempo de execução na produção, e também permite-nos refatorar o código com mais confiança em aplicações de grande escala. A TypeScript também melhora a ergonomia do programador através da conclusão automática baseada em tipo nas IDEs.

A Vue está escrita ele própria em TypeScript e fornece suporte de TypeScript de primeira classe. Todos os pacotes de Vue oficiais vêm com as declarações de tipo empacotada que deve funcionar fora da caixa.

## Configuração de Projeto

A [`create-vue`](https://github.com/vuejs/create-vue), a ferramenta de estruturante de projeto oficial, oferece as opções para estruturar um projeto de Vue preparado com TypeScript e alimentado com a [Vite](https://vitejs.dev/).

### Visão Geral

Com uma configuração baseada na Vite, o servidor de desenvolvimento e o empacotador são apenas para tradução de código e realizam qualquer verificação de tipo. Isto garante que o servidor de desenvolvimento da Vite permaneça extremamente rápido mesmo quando estiveres utilizando a TypeScript.

- Durante o desenvolvimento, recomendamos a confiança sobre uma boa [configuração de IDE](#suporte-de-ide) para obter reações imediatas sobre os erros de tipo.

- Se estiveres utilizando Componentes de Ficheiro Único, utilize o utilitário [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) para verificação de tipo na linha de comando e para geração de declaração de tipo. O `vue-tsc` é um embrulhador em torno de `tsc`, a interface de linha de comando do próprio TypeScript. Ele funciona em grande parte da mesma maneira que a `tsc` exceto que suporta Componentes de Ficheiro Único de Vue além de ficheiros de TypeScript. Tu podes executar `vue-tsc` no modo observador em paralelo ao servidor de desenvolvimento da Vite.

- A Interface de Linha de Comando da Vue também fornece suporte a TypeScript, mas não é mais recomendado. Consulte as [notas abaixo]()

### Suporte de IDE

- O [Visual Studio Code](https://code.visualstudio.com/) é fortemente recomendado para o seu excelente suporte fora da caixa para TypeScript.

  - A [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) é a extensão do Visual Studio Code oficial que oferece suporte de TypeScript dentro do Componentes de Ficheiro Único de Vue, com muitas outras excelente funcionalidades.

    :::tip
    A Volar substitui o [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), nossa extensão Visual Studio Code oficial anterior para Vue 2. Se tiveres a Vetur atualmente instalada, certifica-te de a desativar em projetos de Vue 3.
    :::

  - [Extensão de Vue de TypeScript](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) é também necessário receber suporte de tipo para importações de `*.vue` em ficheiros de TypeScript.

- O [WebStorm](https://www.jetbrains.com/webstorm/) também fornece suporte fora da caixa para ambos TypeScript e Vue. Outras IDEs da JetBrains suportam-os também, ou fora da caixa ou através de [uma extensão gratuita](https://plugins.jetbrains.com/plugin/9442-vue-js).

### Configurando o `tsconfig.json`

Os projetos estruturados através da `create-vue` inclui o `tsconfig.json` pré-configurado. A configuração de base é abstraída no pacote [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Dentro do projeto, utilizamos [Referências de Projeto](https://www.typescriptlang.org/docs/handbook/project-references.html) para garantir os tipos correto para execução de código em ambientes diferentes (por exemplo, aplicação versus teste).

Quando estiveres configurando o `tsconfig.json` manualmente, algumas opções notáveis incluem:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) está definido para `true` porque a Vite utiliza a [esbuild](https://esbuild.github.io/) para tradução de código TypeScript e está sujeito as limitações para tradução de código de ficheiro código.

- Se estiveres utilizando a API de Opções, precisas definir [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) para `true` (ou pelo menos ativa a parte [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) da bandeira `strict`) para influenciar a verificação de tipo do `this` nas opções de componente. De outro modo `this` será tratado como `any`.

- Se tiveres configurado os pseudónimos resolvedores na tua ferramenta de construção, por exemplo o pseudónimo `@/*` configurado por padrão em um projeto `create-vue`, também precisas configurá-lo pelo TypeScript através [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

See also:
Consulte também:

- [Documentação das opções do compilador de TypeScript oficial](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Advertências de compilação de TypeScript da esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Modo de Aquisição

> Esta secção apenas aplica-se para VSCode + Volar.

Para conseguir colocar os Componentes de Ficheiro Único de Vue e TypeScript funcionando juntos, a Volar cria uma instância de serviço da linguagem TypScript separada conciliadas com suporte especifico de Vue, e utiliza-o nos Componentes de Ficheiro Único de Vue. Ao mesmo tempo, ficheiros de TypeScript simples ainda continuam manipulado pelo serviço da linguagem TypeScript embutido do VSCode, o qual é o porque precisamos da [Extensão de Vue de TypeScript](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) para suportar as importações de Componente de Ficheiro Único nas instâncias de serviço da linguagem TypeScript: uma da Volar, um do serviço embutido do VSCode. Isto é um pouco ineficiente e pode levar a problemas de desempenho em projetos grandes.

A Volar fornece uma funcionalidade chamada "Modo de Aquisição" (ou "Takeover Mode") para melhorar o desempenho. No modo de aquisição, a Volar fornece suporte para ambos de ficheiros de Vue e TypeScript utilizando uma única instância de serviço da linguagem TypeScript.

Para ativar o Modo de Aquisição, precisas desativar o serviço da linguagem TypeScript embutido do VSCode no **espaço de trabalho do teu projeto apenas** seguindo estas etapas:

1. No teu espaço de trabalho, coloque a paleta de comando com `Ctrl + Shift + P` (macOS: `Cmd + Shift + P`).
2. Digite `built` e selecione "Extensions: Show Built-in Extensions" ou "Extensões: Mostrar Extensões Embutidas" (Português)
3. Digite `typescript` na caixa de pesquisa de extensão (não remova o prefixo `@builtin`).
4. Clique no pequeno ícone de engrenagem da "TypeScript and JavaScript Language Features" ou "Funcionalidades da Linguagem JavaScript e TypeScript" (Português), e selecione "Disable (Workspace)" ou "Desativar (Espaço de Trabalho)" (Português).
5. Recarregue o espaço de trabalho. O modo de aquisição será ativado quando abrires um ficheiro de Vue ou TypeScript.

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Nota sobre a Linha de Comando de Vue e o `ts-loader`

Em configurações baseadas em Webpack tais como Linha de Comando de Vue, é comum se realizar verificação de tipo como parte da conduta de transformação de módulo, por exemplo com `ts-loader`. Isto, no entanto, não é uma solução decente porque o sistema de tipo precisa ter conhecimento do gráfico de módulo inteiro para realizar as verificações de tipo. A etapa de transformação de módulo individual simplesmente não é o lugar correto para a tarefa. Isto leva aos seguintes problemas:

- O `ts-loader` pode apenas verificar o tipo pós-transformação do código. Isto não se alinha com os erros que vemos em IDEs ou a partir de `vue-tsc`, que mapeia diretamente de volta para o código-fonte.

- A verificação de tipo pode ser lenta. Quando é realizada na mesma linha ou processo com as transformações de código, ele afeta significativamente a velocidade da construção do aplicação inteira.

- Nós já temos a verificação de tipo executando diretamente no nossa IDE em um processo separado, assim o custo da experiência de programação a abrandar o ritmo simplesmente não é uma bom acordo.

Se estiveres atualmente utilizando a Vue 3 + TypeScript através da Linha de Comando de Vue, recomendamos fortemente a migração para a Vite. Nós também estamos trabalhando sobre opções de Linha de Comando para possibilitar o suporte de TypeScript de tradução de código apenas, para que possas mudar para `vue-tsc` pela verificação de tipo.

## Notas de Utilização Geral

### `defineComponent()`

Para permitir que a TypeScript infira os tipos apropriadamente dentro das opções do componente, precisamos definir componentes com [`defineComponent()`](/api/general.html#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inferência de tipo ativada
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

A `defineComponent()` também suporta inferência de propriedades passadas para `setup()` quando estiveres utilizando a API de Composição sem o `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inferência de tipo ativada
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

Consulte também:
- [Nota sobre a Sacudidura de Árvore de Webpack](/api/general.html#note-on-webpack-treeshaking)
- [Testes de Tipo para `defineComponent`](https://github.com/vuejs/core/blob/main/test-dts/defineComponent.test-d.tsx)

:::tip
A `defineComponent()` também ativa a inferência de tipo para os componentes definidos em JavaScript simples.
:::

### Utilização em Componentes de Ficheiro Único

Para utilizar a TypeScript nos Componentes de Ficheiro Único, adicione o atributo `lang="ts"` aos marcadores de `<script>`. Quando `lang="ts"` estiver presente, todas as expressões de modelo de marcação também gozam de verificação de tipo rigorosa.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- verificação de tipo e conclusão automática ativada -->
  {{ count.toFixed(2) }}
</template>
```

O `lang="ts"` também pode ser utilizado com `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript ativado
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- verificação de tipo e conclusão automática ativada -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript nos Modelos de Marcação

O `<template>` também suporta a TypeScript nas expressões de vinculação quando `<script lang="ts">` ou `<script setup lang="ts">` serem utilizado. Isto é útil nos casos onde precisas realizar fusão de tipo nas expressões de modelo de marcação.

Cá está um exemplo artificial:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- erro porque "x" poderia ser uma sequência de caracteres -->
  {{ x.toFixed(2) }}
</template>
```

Isto pode ser solucionado com uma molde de tipo em linha:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Se estiveres utilizando a Linha de Comando de Vue ou uma configuração baseada em Webpack, a TypeScript nas expressões de modelo de marcação exigem `vue-loader@^16.8.0`.
:::

## Receitas Especificas da API

- [TypeScript com a API de Composição](./composition-api)
- [TypeScript com a API de Opções](./options-api)
