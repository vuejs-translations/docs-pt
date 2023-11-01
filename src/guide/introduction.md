---
footer: false
---

# Introdução {#introduction}

:::info Lemos a Documentação da Vue 3!

- O suporte da Vue 2 terminará no dia 31 de Dezembro de 2023. Saiba mais sobre o [Suporte de Longo Prazo Estendido da Vue 2](https://v2.vuejs.org/lts/).
- A documentação da Vue 2 foi movida para [v2.vuejs.org](https://v2.vuejs.org/).
- Migrando da Vue 2? Consulte o [Guia de Migração](https://v3-migration.vuejs.org/pt).
:::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Faixa da Vue Mastery" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Estude a Vue com a <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Logótipo da Vue Mastery" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## O Que é Vue? {#what-is-vue}

Vue (pronunciado /vjuː/, como **view** ) é uma abstração de JavaScript para construção de interfaces de aplicações de utilizador. Ela constrói sobre a HTML, CSS e JavaScript padrão, e fornece um modelo de programação declarativa baseado em componente que ajuda-nos a desenvolver eficientemente interfaces de utilizador, sejam elas simples ou complexas.

Eis um exemplo minimalista:

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```
</div>

<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**Resultado**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

O exemplo acima demonstra as duas funcionalidades principais da Vue:

- **Interpretação Declarativa**: a Vue estende a HTML padrão com uma sintaxe de modelo de marcação que permite-nos descrever de maneira declarativa o resultado de HTML baseado no estado de JavaScript.

- **Reatividade**: a Vue rastreia automaticamente as mudanças de estado de JavaScript e atualiza eficientemente o DOM quando as mudanças ocorrerem.

Se houverem questões, não é coisa de preocupar-se porque cobriremos todos os pequenos detalhes no resto da documentação. Por agora, vamos ler, assim podemos ter uma compreensão de alto nível do que a Vue oferece.

:::tip Pré-Requisitos
O resto da documentação presume familiaridade básica com a HTML, CSS e JavaScript. Se formos totalmente novos ao desenvolvimento do frontend, pode não ser a melhor ideia saltar direto para uma abstração como primeiro passo - dominamos os fundamentos e depois avançamos para uma abstração! Nós podemos confirmar o nosso nível de conhecimento com [esta re-introdução à JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Experiência prévia com outras abstração ajuda, mas não é obrigatória.
:::

## A Abstração Progressiva {#the-progressive-framework}

A Vue é uma abstração e ecossistema que cobre a maioria das funcionalidades comuns necessárias no desenvolvimento de frontend. Porém a web é extremamente diversa - as coisas que construimos na web podem variar drasticamente na forma e escala. Com isto em mente, a Vue está desenhada para ser flexível e adotável incrementalmente. Dependendo do teu caso de uso, a Vue pode ser utilizada nas diferentes maneiras:

- Otimizando o HTML estático sem uma etapa de construção
- Embutindo como Componentes da Web em qualquer página
- Aplicação de Página Única, ou SPA
- Interpretação do Lado do Servidor, ou SSR
- Produção de Aplicação Estática, ou SSG
- Mirando aplicações de nativas de área de trabalho, móvel, WebGL, e até mesmo o terminal

Se considerarmos estes conceitos intimidantes, não precisamos de preocupar-nos! O seminário interativo e o guia apenas exigem conhecimento básico de HTML, CSS e JavaScript, e devemos ser capazes de acompanhar sem sermos um especialista em quaisquer um destes.

Se formos programadores experientes interessados em como integrar melhor a Vue na nossa pilha, ou formos curiosos sobre o que estes termos significam, os discutimos com mais detalhes na seção [Maneiras de Usar a Vue](/guide/extras/ways-of-using-vue).

Apesar da flexibilidade, o conhecimento principal sobre como a Vue funciona é partilhado por todos estes casos de uso. Mesmo se formos apenas iniciantes no momento, o conhecimento adquirido ao longo do caminho ainda será útil a medida que crescermos para enfrentarmos objetivos mais ambiciosos no futuro. Se formos veteranos, podemos escolher uma maneira ideal de entregar a Vue baseado nos problemas que estamos a tentar resolver, enquanto conservamos a mesma produtividade. É por isto que chamamos a Vue de "A Abstração Progressiva": é uma abstração que pode crescer connosco e adaptar-se às nossas necessidades.

## Componentes de Ficheiro Único {#single-file-components}

Na maioria dos projetos de Vue com a ferramenta de construção ativada, críamos os componentes da Vue usando um formato de ficheiro parecido com a HTML chamado de **Componente de Ficheiro Único** (também conhecido como ficheiros de extensão `*.vue`, abreviado como **SFC** na sua versão de nome em Inglês). Um componente de ficheiro único de Vue, como o nome sugere, encapsula a lógica do componente (JavaScript), o modelo de marcação (HTML), e os estilos (CSS) num único ficheiro. Eis o exemplo anterior, escrito no formato de componente de ficheiro único:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>

```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

O componente de ficheiro único é uma funcionalidade de definição da Vue e é a maneira recomendada para criar componentes de Vue *se* o nosso caso de uso justificar uma configuração de construção. Nós podemos aprender mais sobre [como e porquê do componente de ficheiro único](/guide/scaling-up/sfc) nesta seção dedicada - mas por agora, apenas saibamos que a Vue lidará com toda a configuração das ferramentas de construção por nós.

## Estilos de API {#api-styles}

Os componentes de Vue podem ser criados dentro de dois diferentes estilos de API: **API de Opções** e **API de Composição**.

### API de Opções {#options-api}

Com a API de Opções, definimos a lógica do componente usando um objeto de opções tais como `data`, `methods`, e `mounted`. As propriedades definidas pelas opções são expostas sobre o `this` dentro das funções, o qual aponta para instância do componente:

```vue
<script>
export default {
  // As propriedades retornadas a partir da `data()`
  // tornam-se estados reativos e serão expostas no `this`.
  data() {
    return {
      count: 0
    }
  },

  // Os métodos são funções que alteram o estado e acionam atualizações.
  // Elas podem ser vinculadas como ouvintes de evento nos
  // modelos de marcação.
  methods: {
    increment() {
      this.count++
    }
  },

  // Os gatilhos do ciclo de vida são chamados em diferentes fases
  // do ciclo de vida do componente.
  // Esta função será chamada quando o componente estiver montado.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### API de Composição {#composition-api}

Com a API de Composição, definimos a lógica do componente usando funções da API importadas. Nos componentes de ficheiro único, a API de Composição é normalmente usada com o [`<script setup>`](/api/sfc-script-setup). O atributo `setup` é dica que faz a Vue realizar transformações no momento da compilação que permite-nos usar a API de Composição com menos padrões. Por exemplo, importações e variáveis de alto nível ou funções declaradas no `<script setup>` são diretamente usáveis no modelo de marcação.

Eis o mesmo componente, com o mesmo exato modelo de marcação, mas usando a API de Composição e o `<script setup>`:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// o estado reativo
const count = ref(0)

// as funções que alteram o estado e acionam atualizações
function increment() {
  count.value++
}

// os gatilhos de ciclo de vida
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### Qual Escolher? {#which-to-choose}

Ambos estilos de API são completamente capazes de cobrir casos de uso comuns. São interfaces diferentes alimentadas pelo mesmo exato sistema subjacente. Na verdade, a API de Opções está implementada em cima da API de Composição! Os conceitos fundamentais e conhecimentos sobre a Vue são partilhados por ambos estilos.

A API de Opções está centrada em torno do conceito duma "instância de componente" (`this` como visto no exemplo), a qual normalmente alinha-se melhor com um modelo mental baseado em classe para os utilizadores provenientes de linguagens orientadas a objetos. Também é mais amigável aos iniciantes abstraindo muito os detalhes da reatividade e forçando a organização do código através de grupos de opções.

A API de Composição está centrada em torno da declaração de variáveis de estado reativo diretamente no âmbito de aplicação da função e da composição de estado a partir de várias funções juntas para lidar com a complexidade. É a forma mais livre e exige um entendimento de como a reatividade funciona na Vue para ser usada efetivamente. Em troca, sua flexibilidade permite padrões mais poderosos para organização e reutilização da lógica.

Nós podemos aprender mais sobre a comparação entre os dois estilos e os potenciais benefícios da API de Composição nas [Questões Frequentes da API de Composição](/guide/extras/composition-api-faq).

Se formos novos para a Vue, eis a nossa recomendação geral:

- Para fins de aprendizado, devemos seguir com o estilo que parecer mais fácil de entender para nós. Novamente, a maioria dos conceitos são partilhados entre os dois estilos. Nós podemos sempre escolher o outro estilo mais tarde.

- Para uso de produção:

  - Sigamos com a API de Opções se não estivermos a usar ferramentas de construção, ou planeamos usar a Vue primariamente em cenários de menor complexidade, por exemplo otimização progressiva.

  - Sigamos com a API de Composição + Componentes de Ficheiro Único se planeamos construir aplicações completas com a Vue.

Nós não precisamos de nos comprometer com apenas um estilo durante a fase de aprendizado. O resto da documentação fornecerá exemplos de código em ambos estilos onde for aplicável, e podemos alternar entre os estilos a qualquer momento usando o **interruptor de preferência de API** no canto superior esquerdo da página (em cima do menu lateral).

## Questões? {#still-got-questions}

Consulte as nossas [Questões Feitas Com Frequência](/about/faq).

## Escolha o Teu Caminho de Aprendizado {#pick-your-learning-path}

Diferentes programadores têm diferentes estilos de aprendizado. Sintamos à vontade para escolhermos um caminho de aprendizado que adapta-se às nossas preferências - apesar de recomendarmos avançar por todo o conteúdo, se possível!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Experimentar o Seminário Interativo</p>
    <p class="next-steps-caption">Para aqueles que preferem aprender as coisas na prática.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Ler o Guia</p>
    <p class="next-steps-caption">O guia acompanha-nos por todos os aspetos da abstração em completo detalhe.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Consultar os Exemplos Interativos</p>
    <p class="next-steps-caption">Explore os exemplos interativos das funcionalidades principais e tarefas de interfaces de aplicações comuns.</p>
  </a>
</div>
