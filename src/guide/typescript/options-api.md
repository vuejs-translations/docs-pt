# TypeScript com a API de Opções

> Esta página presume que já leste a visão geral no [Utilizando a Vue com a TypeScript](./overview).

:::tip
Embora a Vue suporte a utilização da TypeScript com a API de Opções, é recomendado utilizar a Vue com a TypeScript através da API de Composição visto que ela oferece a inferência de tipo mais simples, mais eficiente e mais robusta.
:::

## Tipando Propriedades do Componente

A inferência de tipo para as propriedades na API de Opções exige o envolvimento do componente com `defineComponent()`. Com isto, a Vue é capaz de inferir os tipos para as propriedades baseada na opção `props`, levando opções adicionais tais como `required: true` e `default` em conta:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inferência de tipo ativada
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // type: string | undefined
    this.id // type: number | string | undefined
    this.msg // type: string
    this.metadata // type: any
  }
})
```

No entanto, as opções `props` de tempo de execução apenas suportam a utilização de funções construtoras como um tipo da propriedade - não existe maneira de especificar tipos complexos tais como objetos com propriedades encaixadas ou assinaturas de chamada de função.

Para anotar tipos de propriedades complexas, podemos utilizar o tipo utilitário `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // fornece tipo mais específico para `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // também pode anotar funções
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // Erro de TS: argumento de tipo 'string' não é
    // atribuível ao parâmetro de tipo 'number'
    this.callback?.('123')
  }
})
```

### Advertências

Devido a uma [limitação de desenho](https://github.com/microsoft/TypeScript/issues/38845) na TypeScript, tens que ser cuidadoso quando estiveres utilizando valores de função para as opções de propriedade `validator` e `default` - certifica-te de que utilizas funções em flecha:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Certifica-te de que utilizas funções em flecha
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Isto impedi a TypeScript de ter que inferir o tipo do `this` dentro destas funções, o que, infelizmente, pode causar falha na inferência de tipo.

## Tipando Emissões do Componente

Nós podemos declarar o tipo da carga esperada para um evento emitido utilizando a sintaxe de objeto da opção `emits`. Além disto, todos os eventos emitidos não declarados lançarão um erro de tipo quando chamados:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // realiza a validação em tempo de execução
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Erro de tipo!
      })

      this.$emit('non-declared-event') // Erro de tipo!
    }
  }
})
```

## Tipando Propriedades Computadas

Uma propriedade computada infere o seu tipo baseado no seu valor de retorno:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // type: string
  }
})
```

Em alguns casos, podes querer explicitamente anotar o tipo de uma propriedade computada para garantir que sua implementação esteja correta:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // anotar explicitamente o tipo de retorno
    greeting(): string {
      return this.message + '!'
    },

    // anotando uma propriedade computada gravável
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

As anotações explícitas também podem ser exigidas em alguns casos extremos onde a TypeScript falha em inferir o tipo de uma propriedade computada por causa de laços de inferência circular.

## Tipando Manipuladores de Evento

Quando estiveres lidando com eventos de DOM nativos, pode ser útil tipar o argumento que passamos para o manipulador corretamente. Vamos dar uma vista de olhos neste exemplo:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` tem implicitamente o tipo `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sem a anotação de tipo, o argumento `event` terá implicitamente um tipo de `any`. Isto também resultará em um erro de TypeScript se `"strict": true` ou `"noImplicitAny": true` forem utilizadas no `tsconfig.json`. É portanto recomendado anotar explicitamente o argumento dos manipuladores de eventos. Além disto, podes precisar de explicitamente fundir as propriedades no `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Aumentando Propriedades Globais

Algumas extensões são instaladas globalmente e suas propriedades estão disponíveis para todas instâncias de componente através de [`app.config.globalProperties`](/api/application.html#app-config-globalproperties). Por exemplo, podemos instalar `this.$http` para requisição de dados ou `this.$translate` para internacionalização. Para fazer isto funcionar bem com a TypeScript, a Vue expõe uma interface `ComponentCustomProperties` desenhada para ser aumentada através da [aumentação de módulo de TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Consulte também:

- [Testes unitários de TypeScript para as extensões de tipo de componente](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### Colocação de Aumentação de Tipo

Nós podemos colocar esta aumentação de tipo em um ficheiro `.ts`, ou em um ficheiro `*.d.ts` de largura de projeto. De um modo ou outro, certifica-te de que é incluída no `tsconfig.json`. Para autores de extensão ou biblioteca, este ficheiro deve ser especificado na propriedade `types` no `package.json`.

Para tirar vantagem da aumentação de módulo, precisarás garantir que a aumentação é colocada em um [módulo de TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html). Isto é, o ficheiro precisa conter ao menos um `import` ou `export` de alto nível, mesmo se for apenas `export {}`. Se a aumentação for colocada fora de um módulo, ela sobrescreverá os tipos originais no lugar de aumentá-los!

```ts
// Não funciona, sobrescreve os tipos originais.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Funciona corretamente
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Aumentando Opções Personalizadas

Algumas extensões, por exemplo `vue-router`, fornecem suporta para opções de componente personalizadas tais como `beforeRouterEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Sem a aumentação de tipo adequada, os argumentos deste gatilho terão implicitamente o tipo `any`. Nós podemos aumentar a interface `ComponentCustomOptions` para suportar estas opções personalizadas:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Agora a opção `beforeRouteEnter` será apropriadamente tipada. Nota que isto é apenas um exemplo - bibliotecas bem tipadas como `vue-router` devem automaticamente realizar estas aumentações em suas próprias definições de tipo.

A colocação desta aumentação está sujeita as [mesmas restrições](#colocação-de-aumentação-de-tipo) que as aumentações de propriedade globais.

Consulte também:

- [Testes Unitário de TypeScript para Extensões de Tipo de Componente](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)
