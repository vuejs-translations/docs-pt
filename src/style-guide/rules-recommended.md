# Regras Prioridade C: Recomendado {#priority-c-rules-recommended}

Onde múltiplas opções igualmente boas existem, uma escolha arbitrária pode ser feita para garantir consistência. Nestas regras, descrevemos cada opção aceitável e sugerimos uma escolha padrão. Isso significa que você pode ficar à vontade para realizar uma escolha diferente em sua própria base de código, desde que você seja consistente e tenha um bom motivo. Mas por favor, tenha um bom motivo! Ao adotar o padrão da comunidade, você irá:

1. Treinar seu cérebro para analisar mais facilmente a maior parte do código da comunidade que encontrar
2. Ser capaz de copiar e colar a maior parte dos exemplos de código da comunidade sem modificações
3. Frequentemente encontrar novos parceiros que já estão acostumados ao seu estilo de código preferido, ao menos no âmbito Vue

## Ordem das opções de componente/instância {#component-instance-options-order}

**Opções de componente/instância devem ser ordenadas consistentemente.**

Esta é a ordem padrão que recomendamos para opções de componente. Elas são divididas em categorias, então você saberá onde adicionar novas propriedades de plugins.

1. **Conscientização Global** (exige conhecimento além do componente)

   - `name`

2. **Opções do Compilador de Modelo** (mudam a maneira que modelos são compilados)

   - `compilerOptions`

3. **Dependências de Modelo** (recursos usados no modelo)

   - `components`
   - `directives`

4. **Composição** (mescla propriedades nas opções)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Interface** (a interface para o componente)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **API de Composição** (ponto de entrada para usar a API de Composição)

   - `setup`

7. **Estado Local** (propriedades locais reativas)

   - `data`
   - `computed`

8. **Eventos** (_callbacks_ acionados por eventos reativos)

   - `watch`
   - Eventos do Ciclo de Vida (na ordem em que são chamados)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Propriedades não reativas** (propriedades da instância independentes da reatividade do sistema)

   - `methods`

10. **Interpretação** (a descrição declarativa da saída do componente)
    - `template`/`render`

## Ordem dos atributos de elementos {#element-attribute-order}

**Os atributos dos elementos (incluindo componentes) devem ser ordenados consistentemente.**

Esta é a ordenação padrão que recomendamos para opções do componente. Elas estão divididas em categorias, então você saberá onde adicionar atributos e diretivas personalizadas.

1. **Definição** (fornece as opções do componente)

   - `is`

2. **Interpretação de Listas** (cria múltiplas variações do mesmo elemento)

   - `v-for`

3. **Condicionais** (se o elemento é interpretado/mostrado)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Modificadores de Interpetação** (mudam a forma que o elemento é interpretado)

   - `v-pre`
   - `v-once`

5. **Conscientização Global** (exige conhecimento além do componente)

   - `id`

6. **Atributos Únicos** (atributos que exigem valores únicos)

   - `ref`
   - `key`

7. **Vinculação Bidirecional** (combina vinculações e eventos)

   - `v-model`

8. **Outros Atributos** (todos os atributos não especificados vinculados ou não vinculados)

9. **Eventos** (ouvintes de evento dos componentes)

   - `v-on`

10. **Conteúdo** (substituem o conteúdo do elemento)
    - `v-html`
    - `v-text`

## Linhas vazias em opções de componente/instância {#empty-lines-in-component-instance-options}

**Você pode querer adicionar uma linha vazia entre propriedades de várias linhas, especialmente se as opções não couberem mais na sua tela sem rolagem.**

Quando os componentes começam a parecer abarrotados ou difíceis de se ler, adicionar espaços entre propriedades com múltiplas linhas pode torná-lo fácil de se ler novamente. Em alguns editores, como o Vim, opções de formatação como essa podem também tornar mais fácil de se navegar com o teclado.

<div class="style-example style-example-good">
<h3>Bom</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

```js
// Não ter espaços também é bom, desde que o componente
// seja fácil de ler e de navegar.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

## Ordem de elementos de nível superior de Componentes de Arquivo Único {#single-file-component-top-level-element-order}

**[Componentes de Arquivo Único](/guide/scaling-up/sfc) devem sempre ordenar os identificadores `<script>`, `<template>`, e `<style>` consistentemente, com o `<style>` por último, porque ao menos uma das outras duas é sempre necessária.**

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
