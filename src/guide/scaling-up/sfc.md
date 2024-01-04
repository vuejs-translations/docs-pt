# Componentes de Ficheiro Único {#single-file-components}

## Introdução {#introduction}

O Componente de Ficheiro Único de Vue (mais conhecido como ficheiros `*.vue`, abreviado como **SFC** na sua sigla em Inglês) é um formato de ficheiro especial que permite-nos encapsular o modelo de marcação, a lógica, **e** a estilização dum componente de Vue num único ficheiro. Eis um componente de ficheiro único de exemplo:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

Conforme podemos ver, o Componente de Ficheiro Único da Vue é uma extensão natural do trio clássico HTML, CSS e JavaScript. Os blocos `<template>`, `<script>`, e `<style>` encapsulam e colocam a visão, a lógica e a estilização dum componente no mesmo ficheiro. A sintaxe completa é definida na [Especificação da Sintaxe do Componente de Ficheiro Único](/api/sfc-spec).

## Por que Componente de Ficheiro Único? {#why-sfc}

Enquanto os Componentes de Ficheiro Único exigem uma etapa de construção, existem muitos benefícios em troca:

- Produzir componentes modularizados usando a sintaxe familiar de HTML, CSS e JavaScript
- [Colocação de interesses inerentemente associados](#what-about-separation-of-concerns)
- Modelos de marcação pré-compilados sem custo de compilação de execução
- [CSS isolado ao Componente](/api/sfc-css-features)
- [Sintaxe mais ergonómica quando trabalhamos com a API de Composição](/api/sfc-script-setup)
- Mais otimizações de compilação analisando de várias maneiras o modelo de marcação e o programa
- [Suporte de Ambiente de Desenvolvimento Integrado](/guide/scaling-up/tooling#ide-support) com a conclusão automática e verificação de tipo para as expressões do modelo de marcação
- Suporte de Substituição de Módulo Instantânea (HMR, sigla em Inglês) fora da caixa

O Componente de Ficheiro Único é uma funcionalidade determinante da Vue como uma abstração, e é a abordagem recomendada para usar a Vue nos seguintes cenários:

- Aplicações de Página Única (SPA, sigla em Inglês)
- Geração de Aplicação Estática (SSG, sigla em Inglês)
- Qualquer frontend que não for banal onde uma etapa de construção pode ser justificada para melhor experiência de programação (DX, sigla em Inglês).

Com isto dito, nos apercebemos de que existem cenários onde os Componentes de Ficheiro Único podem ser como um excesso. É por isto que a Vue pode continuar a ser usada através da JavaScript simples sem uma etapa de construção. Se estivermos apenas procurando melhorar em grande parte o HTML estático com interações leves, também podemos verificar a [`petite-vue`](https://github.com/vuejs/petite-vue), um subconjunto de 6kb da Vue otimizada para aprimoramento progressivo.

## Como Este Funciona? {#how-it-works}

O Componente de Ficheiro Único da Vue é um formato de ficheiro específico para a abstração e deve ser pré-compilado pela [`@vue/compiler-sfc`](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) para JavaScript e CSS padrão. Um Componente de Ficheiro Único compilado é um módulo (ECMAScript) de JavaScript padrão - o que significa que com a configuração de construção correta podemos importar um Componente de Ficheiro Único como um módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Os marcadores `<style>` dentro dos Componentes de Ficheiro Único são normalmente injetados como marcadores de `<style>` nativos durante o desenvolvimento para suportar as atualizações instantâneas. Para produção estes podem ser extraídos e combinados num único ficheiro de CSS.

Nós podemos brincar com os Componentes de Ficheiro Único e explorar como estes são compilados na [Zona de Testes de Componente de Ficheiro Único da Vue](https://play.vuejs.org/).

Nos projetos de verdade, normalmente integramos o compilador de SFC com uma ferramenta de construção tal como [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (que é baseada sobre [Webpack](https://webpack.js.org/)), e a Vue fornece ferramentas de estruturação de projetos oficiais para começares com os SFCs o mais rápido possível. Consulte mais detalhes na secção [Ferramental de SFC](/guide/scaling-up/tooling)

## E Quanto a Separação de Interesses? {#what-about-separation-of-concerns}

Os utilizadores que vêm dum contexto do desenvolvimento da Web tradicional podem ter a preocupação que os Componentes de Ficheiro Único estão misturando interesses diferentes no mesmo lugar - que HTML/CSS/JS eram suposto estarem separados!

Para responder esta questão, é importante para nós concordar que a **separação de interesses não é igual a separação de tipos de ficheiro**. O objetivo final dos princípios de engenharia é melhorar a manutenção das bases de código. A separação de interesses, quando aplicada dogmaticamente como separação de tipos de ficheiro, não nos ajuda a alcançar este objetivo no contexto das aplicações de frontend crescentemente complexas.

No desenvolvimento de interface de aplicação moderna, descobrimos que ao invés de dividir a base de código em três enorme camadas que entrelaçam-se umas às outras, faz muito mais sentido dividi-las em componentes associados livremente e compo-los. Dentro dum componente, o seu modelo de marcação, lógica, e estilos estão inerentemente associados, e colocá-los realmente torna o componente mais coeso e sustentável.

Nota que mesmo se não gostarmos da ideia dos Componentes de Ficheiro Único, ainda podemos influenciar as suas funcionalidade de recarregamento instantâneo e pré-compilação separando o nosso JavaScript, e CSS em ficheiros separados usando [Importações de Recursos](/api/sfc-spec#src-imports).
