# Componentes de Ficheiro Único {#single-file-components}

## Introdução {#introduction}

Os Componentes de Ficheiro Único (também conhecido como ficheiros de `*.vue`, abreviados como **SFC (Single-File Component, em Inglês)**) é um formato de ficheiro especial que permite-nos resumir o modelo de marcação, a lógica, **e** os estilos de um componente de Vue em um único ficheiro. Cá está um exemplo de SFC:

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

Conforme podemos observar, o Componente de Ficheiro Único de Vue é uma extensão natural do trio clássico HTML, CSS e JavaScript. Os blocos `<template>`, `<script>`, e `<style>` resumem e colocam o panorama, a lógica e o estilo de um componente no mesmo ficheiro. A sintaxe completa é definida na [Especificação da Sintaxe de SFC](/api/sfc-spec).

## Porquê SFC {#why-sfc}

Embora os Componentes de Ficheiro Único precisem de uma etapa de construção, existem numerosos benefícios em troca:

- Produzir componentes modularizados usando a sintaxe familiar de HTML, CSS e JavaScript
- [Colocação de interesses inerentemente associados](#what-about-separation-of-concerns)
- Modelos de marcação pré-compilados
- [CSS isolado no Componente](/api/sfc-css-features)
- [Sintaxe mais ergonómica quando trabalhamos com a API de Composição](/api/sfc-script-setup)
- Mais otimizações de tempo de compilação pela analise cruzada do modelo de marcação e o programa (ou script se preferires)
- [Suporte de IDE](/guide/scaling-up/tooling#ide-support) auto-conclusão e verificação de tipo para expressões de modelo de marcação
- Suporte de Substituição de Módulo Instantânea (HMR, sigla em Inglês) fora da caixa

O SFC é uma funcionalidade de definição de Vue como uma abstração, e é a abordagem recomendada para usar a Vue nos seguintes cenários:


- Aplicações de Página Única (SPA, sigla em Inglês)
- Geração de Sítio Estático (SSG, sigla em Inglês)
- Qualquer frontend não seja insignificante onde uma etapa de construção possa ser justificada para uma melhor experiência de programação (DX, sigla em Inglês).

Isto dito, apercebemos-nos de que existem cenários onde os SFCs podem parecer ser exagero. É por isto que Vue pode continuar a ser usada através de JavaScript simples sem uma etapa de construção. Se estiveres apenas procurando otimizar HTML em grande parte estático com interações leves, podes também consultar a [petite-vue](https://github.com/vuejs/petite-vue), um subconjunto de 6kb de Vue otimizado para otimização gradual.

## Como isto Funciona {#how-it-works}

O Componente de Ficheiro Único de Vue (Vue SFC, em Inglês) é um formato de ficheiro específico para a abstração e deve ser pré-compilado pelo [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) para a JavaScript e CSS padrão. Um SFC compilado é um módulo de ECMASCript de JavScript padrão - o que significa que com a configuração de construção apropriada podes importar um SFC como um módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Os marcadores `<style>` dentro dos SFCs são normalmente injetados como marcadores `<style>` nativos durante o desenvolvimento para suportar as atualizações instantâneas. Para produção eles podem ser extraídos e fundidos em um único ficheiro de CSS.

Tu podes brincar com os SFCs e explorar como eles são compilados na [Zona de Testes de SFC da Vue](https://play.vuejs.org/).

Nos projetos de verdade, normalmente integramos o compilador de SFC com uma ferramenta de construção tal como [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (que é baseada sobre [Webpack](https://webpack.js.org/)), e a Vue fornece ferramentas de estruturação de projetos oficiais para começares com os SFCs o mais rápido possível. Consulte mais detalhes na secção [Ferramental de SFC](/guide/scaling-up/tooling)

## E a Separação de Interesses? {#what-about-separation-of-concerns}

Os utilizadores chegando de um fundo em desenvolvimento de web tradicional podem ter a preocupação de que os SFCs estão misturando diferentes interesses no mesmo lugar - nos quais HTML/CSS/JS eram suposto estarem separados!

Para responder esta questão, é importante para nós concordar que a **separação de interesses não é equivalente a separação de tipos de ficheiro**. O objetivo fundamental dos princípios de engenharia é melhorar a sustentabilidade das bases de código. A separação de interesses, quando aplicada dogmaticamente como separação de tipos de ficheiro, não ajuda-nos a alcançar aquele objetivo no contexto de aplicações de frontend complexas de maneira crescente.

No desenvolvimento de Interface de Utilizador, temos descobrido que ao invés de dividir a base de código em três grandes camadas que se entrelaçam umas com as outras, faz muito mais sentido dividi-los em componentes livremente associados e compo-los. Dentro de um componente, seu modelo de marcação, lógica, e estilos estão inerentemente associados, e a sua colocação torna o componente mais coeso e sustentável.

Nota que mesmo se não gostares da ideia dos Componentes de Ficheiro Único, ainda podes influenciar suas funcionalidades de carregamento instantâneo e pré-compilação separando o teu JavaScript e CSS em ficheiros separados usando as [importações de recurso](/api/sfc-spec#src-imports).
