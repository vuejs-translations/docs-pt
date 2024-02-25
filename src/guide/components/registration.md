# Registo de Componente {#component-registration}

> Esta página pressupõe conhecimento dos [Fundamentos dos Componentes](/guide/essentials/component-basics). Nós precisamos ler este artigo se os conceitos dos componentes forem novos para nós.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Aula Grátis de Registo de Componente de Vue.js"/>

Um componente da Vue precisa ser "registado" para que a Vue saiba onde localizar a sua implementação quando for encontrado num modelo de marcação. Existem duas maneiras de registar os componentes: global e local.

## Registo Global {#global-registration}

Nós podemos disponibilizar os componentes globalmente na [aplicação atual de Vue](/guide/essentials/application) usando o método `app.component()`:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // o nome registado
  'MyComponent',
  // a implementação
  {
    /* ... */
  }
)
```

Se usarmos os componentes compostos por um único ficheiro (SFCs), registaremos os ficheiros `.vue` importados:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

O método `app.component()` pode ser encadeado:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Os componentes registados globalmente podem ser usados no modelo de marcação de qualquer componente dentro desta aplicação:

```vue-html
<!-- isto funcionará em qualquer componente dentro da aplicação -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Isto aplica-se a todos os subcomponentes, o que significa que todos estes três componentes também estarão disponíveis _dentro de uns dos outros_.

## Registo Local {#local-registration}

Embora conveniente, o registo global tem algumas desvantagens:

1. O registo global impedi os sistemas de construção de remover os componentes que não são usados (mais conhecido como "agitação de árvore" (tree-shaking)). Se registarmos globalmente um componente, mas acabarmos não usando este em nenhum lugar na nossa aplicação, este ainda será incluído no pacote final.

2. O registo global torna o relacionamento de dependência menos explícito em grandes aplicações. Este dificulta a localização da implementação dum componente filho a partir dum componente pai que usa o componente filho. Isto pode afetar a sustentabilidade a longo prazo semelhante ao uso de muitas variáveis globais.

O registo local limita a disponibilidade dos componentes registados apenas ao componente atual. Este torna o relacionamento de dependências mais explícito, e é mais amigável a agitação da árvore de componentes.

<div class="composition-api">

Quando usamos o componente de um único ficheiro (SFC) com o `<script setup>`, os componentes importados podem ser usados localmente sem fazer-se o registo:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

No componente que não estivermos usando o `<script setup>`, precisaremos usar a opção `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

O registo local é feito usando a opção `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Para cada propriedade no objeto `components`, a chave será o nome do componente registado, enquanto o valor conterá a implementação do componente. O exemplo acima usa a abreviação de propriedade da especificação da ECMAScript de 2015 e é equivalente a:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Notemos que **os componentes registados localmente também não _estão_ disponíveis dentro dos componentes descendentes**. Neste caso, `ComponentA` será disponibilizado apenas ao componente atual, e não aos componentes filho ou descendente.

## Caixa do Nome do Componente {#component-name-casing}

Durante todo o guia, usaremos os nomes de CaixaPascal quando registarmos os componentes. Isto porque:

1. Os nomes de CaixaPascal são identificadores válidos de JavaScript. Isto facilita a importação e registo de componentes na JavaScript. Este também ajuda os ambientes de desenvolvimento integrado com a conclusão automática de código.

2. `<PascalCase />` torna mais óbvio de que isto é um componente de Vue ao invés dum elemento de HTML nativo dentro dos modelos de marcação. Este também diferencia os componentes da Vue dos elementos personalizados (componentes da Web).

Isto é um estilo recomendado quando trabalharmos com o componente de um único ficheiro ou modelos de marcação na forma de sequência de caracteres. No entanto, conforme discutido nas [Advertências da Analise do Modelo de Marcação no DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), os marcadores de CaixaPascal não são utilizáveis nos modelos de marcação do DOM.

Felizmente, a Vue suporta a resolução de marcadores de caixa-espetada para os componentes registados usando a CaixaPascal. Isto significa que um componente registado como `MyComponent` pode ser referenciado no modelo de marcação como `<MyComponent>` ou `<my-component>`. Isto permite-nos usar o mesmo código de registo de componente de JavaScript independentemente da origem do modelo de marcação.
