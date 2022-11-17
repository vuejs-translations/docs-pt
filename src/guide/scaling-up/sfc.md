# Componentes Single-File

## Introdução

Componentes Single-File Vue (também conhecidos como arquivos `*.vue`, abreviados como **SFC**) são um formato de arquivo especial que nos permite encapsular o *template*, a lógica **e** a estilização de um componente Vue em um único arquivo. Este é um exemplo de SFC:

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Olá Mundo!'
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

Como podemos ver, SFC no Vue são uma extensão natural do clássico trio HTML, CSS e JavaScript. Os blocos `<template>`, `<script>`, e `<style>` agrupam e definem a visualização, a lógica e a estilização de um componente em um mesmo arquivo. A sintaxe completa é definida na [Especificação de Sintaxe SFC](/api/sfc-spec).

## Por quê SFC

Embora SFCs exijam uma etapa de compilação, há muitos benefícios em retorno:

- Criar componentes modularizados usando a sintaxe familiar de HTML, CSS e JavaScript
- [Colocação de preocupações acopladas intrinsicamente](#what-about-separation-of-concerns)
- _Templates_ pré-compilados sem custo de compilação no _runtime_
- [CSS isolado por componente](/api/sfc-css-features)
- [Sintaxe mais ergonômica ao trabalhar com a API de Composição](/api/sfc-script-setup)
- Mais otimizações no tempo de compilação através da análise cruzada do _template_ e do script
- [Suporte da IDE](/guide/scaling-up/tooling.html#ide-support) com preenchimento automático e verificação de tipos para expressões de _template_
- Suporte de _Hot-Module Replacement_ (HMR) pronto para uso

SFC é um recusro definidor do Vue como _framework_, e é a abordagem recomendada para usar o Vue nos seguintes cenários:

- Aplicações de Página Única (SPA)
- Geração de Site Estático (SSG)
- Qualquer _frontend_ não trivial em que uma etapa de compilação possa ser justificada para uma melhor experiência de desenvolvimento (DX).

Dito isso, percebemos que existem cenários onde os SFCs possam parecer um exagero. É por isso que o Vue pode ser usado com JavaScript simples sem uma etapa de compilação. Se você procura apenas aprimorar um HTML amplamente estático com interações leves, você pode conferir o [petite-vue](https://github.com/vuejs/petite-vue), um subconjunto de 6kB do Vue otimizado para aprimoramento progressivo.

## Como Funciona

O SFC do Vue é um arquivo de _framework_ específico que precisa ser pré-compilado pelo [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) em JavaScript e CSS padrão. Um SFC compilado é um módulo JavaScript (ES) padrão - o que significa que com uma configuração de compilação adequada você pode importar um SFC como um módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Identificadores `<style>` dentro de SFCs são tipicamente injetadas como identificadores `<style>` nativos durante o desenvolvimento para suportar _hot updates_. Em produção eles podem ser extraídos e mesclados em um único arquivo CSS.

Você pode experimentar os SFCs e explorar como eles são compilados no [Playground Vue SFC](https://sfc.vuejs.org/).

Em projetos reais, nós tipicamente integramos o compilador SFC com uma ferramenta de compilação como o [Vite](https://vitejs.dev/) ou o [Vue CLI](http://cli.vuejs.org/) (que é baseado no [webpack](https://webpack.js.org/)), e o Vue fornece ferramentas de montagem oficiais para você começar com SFCs o mais rápido possível. Confira mais detalhes na seção [Ferramentas SFC](/guide/scaling-up/tooling).

## E a Separação de Preocupações?

Alguns usuários vindo de um contexto tradicional de desenvolvimento web podem ter preocupações de que SFCs misturam diferentes preocupações no mesmo local - em qual HTML/CSS/JS deveriam estar separados!

Para responder esta pergunta, é importante concordamos que **a separação de preocupações não é igual a separação de tipos de arquivo**. O objetivo final dos princípios de engenharia é de melhorar a manutenção das bases de código. A separação de preocupações, quando aplicada dogmaticamente como separação de tipos de arquivo, não nos ajuda a alcançar este objetivo no contexto de aplicações _frontend_ cada vez mais complexas.

No desenvolvimento moderno de UI, descobrimos que ao invés de dividir a base de código em três enormes camadas que se entrelaçam, faz muito mais sentido dividí-las em componentes vagamente acoplados e compô-los. Dentro de um componente, seu _template_, lógica, e estilos são intrinsicamente acoplados, e colocá-los juntos na verdade torna o seu componente mais coeso e sustentável.

Observe que mesmo que você não goste da ideia de Componentes Single-File, você ainda pode aproveitar seus recursos de _hot-reloading_ e pré-compilação separando o JavaScript e o CSS em arquivos diferentes usando [Src Imports](/api/sfc-spec.html#src-imports).
