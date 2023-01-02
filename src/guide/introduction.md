---
footer: false
---

# Introdução {#introduction}

:::info Tu estás a ler documentação da Vue 3!

- O suporte para a Vue 2 terminará no dia 31 de Dezembro de 2023. Saiba mais a respeito da [LTS Extendida da Vue 2](https://v2.vuejs.org/lts/).
- A documentação da Vue 2 foi movida para [v2.vuejs.org](https://v2.vuejs.org/).
- Atualizando a partir da Vue 2? Consulte o [Guia de Migração](https://v3-migration.vuejs.org/).
:::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses-path/beginner" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Faixa da Vue Mastery" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Aprenda Vue com o Curso em Vídeo da <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Logótipo da Vue Mastery" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## O que a Vue é? {#what-is-vue}

Vua (pronunciado /vjuː/, como **view** ) é uma abstração de JavaScript para construção de interfaces de utilizador. Ela constrói sobre a HTML, CSS e JavaScript padrão, e fornece um modelo de programação declarativa baseada em componente que ajuda-te a programar interfaces de utilizador eficientemente, sejam elas simples ou complexas.

Cá está um exemplo mínimo:

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

O exemplo acima demonstra as duas funcionalidades principais de Vue:

- **Interpretação Declarativa**: a Vue estende a HTML padrão com uma sintaxe de modelo de marcação que permite-nos descrever de maneira declarativa o resultado de HTML baseado no estado de JavaScript.

- **Reatividade**: a Vue rastreia automaticamente as mudanças de estado de JavaScript e atualiza eficientemente o DOM quando as mudanças acontecem.

É possível que já tenhas questões - não te preocupes. Cobriremos cada pequeno detalhe no resto da documentação. Por agora, por favor leia tudo assim podes ter um entendimento de alto nível do que a Vue oferece.

:::tip Pré-requisitos
O resto da documentação presume familiaridade fundamental com a HTML, CSS e JavaScript. Se fores totalmente novo para desenvolvimento de frontend, pode não ser a melhor ideia saltar direto para uma abstração como teu primeiro passo - domine os fundamentos e depois volte! Experiência prévia com outras abstração ajuda, mas não é obrigatória.
:::

## A Abstração Progressiva {#the-progressive-framework}

A Vua é uma abstração e ecossistema que cobre a maioria das funcionalidades comuns necessárias no desenvolvimento de frontend. Porém a web é extremamente diversa - as coisas que construimos na web podem variar drasticamente na forma e escala. Com isto em mente, a Vue está desenhada para ser flexível e adotável incrementalmente. Dependendo do teu caso de uso, a Vue pode ser utilizada nas diferentes maneiras:

- Otimizando o HTML estático sem uma etapa de construção
- Embutindo como Componentes de Web em qualquer página
- Aplicação de Página Única (SPA, sigla em Inglês)
- Interpretação no Lado do Servidor (SSR, sigla em Inglês)
- Geração de Sítio Estático (SSG, sigla em Inglês)
- Mirando aplicações de Área de trabalho, Móvel, WebGL, e até mesmo o Terminal

Se considerares estes conceitos intimidantes, não te preocupes! A aula e o guia só exigem conhecimento básico em HTML, CSS e JavaScript, e deves ser capaz de seguir adiante sem ser um especialista em quaisquer um destes.

Se fores um programador experiente interessado em como integrar melhor a Vue na tua pilha, ou estiveres curioso a respeito do que estes terms querem dizer, nós os discutimos em mais detalhes em [Maneiras de Utilização da Vue](/guide/extras/ways-of-using-vue).

Apesar da flexibilidade, o conhecimento principal a respeito de como a Vua funciona é partilhado por todos estes casos de uso. Mesmo se agora fores apenas um principiante, o conhecimento adquirido pelo caminho manter-se-á útil a medida que cresceres para lidares com objetivos mais ambiciosos no futuro. Se fores um veterano, podes escolher a maneira ideal de entregar a Vue baseado nos problemas que estás tentando resolver, enquanto conservas a mesma produtividade. Isto é a razão de nós chamarmos a Vue de "A Abstração Progressiva": é uma abstração que pode crescer contigo e adaptar-se as tuas necessidades.

## Componentes de Ficheiro Único {#single-file-components}

Na maioria dos projetos de Vue com ferramenta de construção ativada, nós criamos componentes de Vue utilizando um formato de ficheiro parecido com a HTML chamado de **Componentes de Ficheiro Único** (também conhecido como ficheiros `*.vue`, abreviado como **SFC (em Inglês)**). Um Componente de Ficheiro Único de Vue, como o nome sugere, resume a lógica (JavaScript) do componente, modelo de marcação (HTML) e os estilos (CSS) em um único ficheiro. Cá está o exemplo anterior, escrito no formato de Componente de Ficheiro Único:

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

O Componente de Ficheiro Único é uma funcionalidade definida de Vue, é a maneira recomendada para criar componentes de Vue **se** o teu caso de uso justificar uma configuração de construção. Tu podes aprender mais a respeito de [como e porquê de Componente de Ficheiro Único](/guide/scaling-up/sfc) nesta secção dedicada - mas por agora, saiba apenas que a Vue cuidará de toda configuração de ferramentas de construção por ti.

## Estilos de API {#api-styles}

Os componentes de Vue podem ser criados em dois estilos de API diferentes: **API de Opções** e **API de Composição**.

### API de Opções {#options-api}

Com respeito a API de Opções, definimos uma lógica do componente utilizando um objeto de opções tais como `data`, `methods`, e `mounted`. As propriedades definidas pelas opções são expostas no `this` dentro das funções, que apontam para a instância do componente:

```vue
<script>
export default {
  // As propriedades retornadas de `data()` tornam-se estados reativos
  // e serão expostas no `this`.
  data() {
    return {
      count: 0
    }
  },

  // Os métodos são funções que alteram o estado e acionam atualizações.
  // Elas podem ser atadas como ouvintes de evento no modelos de marcação.
  methods: {
    increment() {
      this.count++
    }
  },

  // Gatilhos do ciclo de vida são chamados em diferentes fases
  // de um ciclo de vida do componente.
  // Esta função será chamada quando o componente for montado.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gcmVhY3RpdmUgc3RhdGVcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbiAgbWV0aG9kczoge1xuICAgIGluY3JlbWVudCgpIHtcbiAgICAgIHRoaXMuY291bnQrK1xuICAgIH1cbiAgfSxcblxuICAvLyBsaWZlY3ljbGUgaG9va3NcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgVGhlIGluaXRpYWwgY291bnQgaXMgJHt0aGlzLmNvdW50fS5gKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPkNvdW50IGlzOiB7eyBjb3VudCB9fTwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4ifQ==)

### API de Composição {#composition-api}

Com respeito a API de Composição, definimos a lógica do componente utilizando funções da API importadas. Nos Componentes de Ficheiro Único, a API de Composição é normalmente utilizada com [`<script setup>`](/api/sfc-script-setup). O atributo `setup` é uma dica que faz a Vue realizar transformações em tempo de compilação que permite-nos utilizar a API de Composição com menos "boilerplate". Por exemplo, importações e variáveis de alto nível / funções declaradas na `<script setup>` são imediatamente utilizáveis no modelo de marcação.

Cá está o mesmo componente, com o mesmo modelo de marcação, porém utilizando a API de Composição e `<script setup>`:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// estado reativo
const count = ref(0)

// funções que alteram o estado e acionam atualizações
function increment() {
  count.value++
}

// gatilhos de ciclo de vida
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG4vLyByZWFjdGl2ZSBzdGF0ZVxuY29uc3QgY291bnQgPSByZWYoMClcblxuLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbmZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgY291bnQudmFsdWUrK1xufVxuXG4vLyBsaWZlY3ljbGUgaG9va3Ncbm9uTW91bnRlZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBUaGUgaW5pdGlhbCBjb3VudCBpcyAke2NvdW50LnZhbHVlfS5gKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50XCI+Q291bnQgaXM6IHt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

### Qual escolher? {#which-to-choose}

Ambos estilos de API são completamente capazes de cobrir casos de uso comuns. Eles são interfaces diferentes alimentadas pelo o mesmo exato sistema subjacente. Na verdade, a API de Opções está implementada em cima da API de Composição! Os conceitos fundamentais e conhecimentos a respeito da Vue são partilhas pelos dois estilos.

A API de Opções estão centrados em torno do conceito de um "instância de componente" (`this` como visto no exemplo), que melhor se alinha normalmente com uma modelo mental de baseado em classe para utilizadores chegando com antecedentes em linguagem de programação orientada a objeto. Isto também é mais amigável a principiantes abstraindo longe os detalhes de reatividade e forçando a organização do código através de grupos de opção.

A API de Composição está centrada em torno da declaração de variáveis de estado reativo imediatamente no escopo de função, e compor estado a partir de várias funções juntas para manipular complexidade. Isto é uma forma mais livre, exige o entendimento de como a reatividade funciona na Vue para ser utilizada eficientemente. Em troca, sua flexibilidade ativam padrões mais poderosos para organização e reutilização de lógica.

Tu podes aprender mais a respeito da comparação entre os dois estilos e os potenciais benefícios da API de Composição na [FAQ da API de Composição](/guide/extras/composition-api-faq).

Se fores novo para Vue, cá está nossa recomendação geral:

- Para fins de aprendizado, vá com o estilo que parecer-te mais fácil de entender. Novamente, a maioria dos conceitos fundamentais são partilhados entre os dois estilos. Tu podes sempre escolher o outro estilo depois.

- Para uso em produção:

  - Vá com a API de Opções se não estiveres utilizando ferramentas de construção, ou planeias utilizar a Vue primordialmente em cenários de baixa complexidade, por exemplo otimização progressiva.

  - Vá com a API de Composição + Componentes de Ficheiro Único se planeares construir aplicações completas com a Vue.

Tu não precisas comprometeres-te com apenas um estilo durante a fase de aprendizado. O resto da documentação fornecerá exemplos de código em ambos estilos onde for aplicável, e podes alternar entre eles em qualquer momento utilizando **interruptores de Preferência de API** no cimo da barra lateral esquerda.

## Continua Com Dúvidas? {#still-got-questions

Consulte a nossa [FAQ](/about/faq).

## Escolha o Teu Caminho de Aprendizado {#pick-your-learning-path}

Programadores diferentes tem diferentes estilos de aprendizado. Sinta-te livre para escolher um caminho de aprendizado que se adequa as tuas preferências - ainda que nós recomendamos avançar sobre todo conteúdo, se possível!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Experimente a Aula</p>
    <p class="next-steps-caption">Para aqueles que preferem o aprendizado de coisas com prática.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Leia o Guia</p>
    <p class="next-steps-caption">O guia acompanha-te através de cada aspeto da abstração de maneira detalhada.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Consulte os Exemplos</p>
    <p class="next-steps-caption">Explore os exemplos de funcionalidades principais e tarefas de UI comuns.</p>
  </a>
</div>
