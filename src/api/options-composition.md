# Opções: Composição {#options-composition}

## `provide` {#provide}

Fornece valores que podem ser injetados pelos componentes descendentes.

- **Tipo**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Detalhes**

  `provide` e [`inject`](#inject) são usadas ao mesmo tempo para permitir um componente ancestral servir como um injetor de dependência para todos os seus descendentes, independentemente de quão profunda é a hierarquia do componente, enquanto estiverem na mesma cadeia primaria.

  A opção `provide` deve ser ou um objeto ou uma função que retorna um objeto. Este objeto contém as propriedades que estão disponíveis para a injeção para os seus descendentes. Nós podemos usar símbolos como chaves neste objeto.

- **Exemplo**

  Uso básico:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Usando uma função para fornecer o estado por componente:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Nota que no exemplo acima, a `msg` fornecida NÃO será reativa. Consulte [Trabalhando com a Reatividade](/guide/components/provide-inject#working-with-reactivity) por mais detalhes.

- **Consulte também** [Fornecer ou Injetar](/guide/components/provide-inject)

## `inject` {#inject}

Declara as propriedades a injetar no componente atual localizando-as a partir dos fornecedores ancestrais.

- **Tipo**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Detalhes**

  A opção `inject` deve ser:

  - Um vetor de sequências de caracteres, ou
  - Um objeto onde as chaves são o nome de vínculo local e o valor é ou:
    - A chave (sequência de caracteres ou símbolo) à procurar nas injeções disponíveis, ou
    - Um objeto onde:
      - A propriedade `from` é a chave (sequência de caracteres ou símbolo) à procurar nas injeções disponíveis, e
      - A propriedade `default` é usada como valor de retrocesso. Semelhante aos valores padrão das propriedades, uma função de fábrica é necessária para os tipos de objeto para impedir a partilha de valor entre várias instância do componente.

  Uma propriedade injetada será `undefined` se nenhuma propriedade correspondente e nem um valor padrão foi fornecido.

  Nota que os vínculos injetados NÃO são reativos. Isto é intencional. No entanto, se o valor injetado for um objeto reativo, as propriedades deste objeto permanecem reativas. Consulte [Trabalhando com a Reatividade](/guide/components/provide-inject#working-with-reactivity) por mais detalhes.

- **Exemplo**

  Uso básico:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Usando um valor injetado como padrão para uma propriedade:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Usando um valor injetado como entrada de dados:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  As injeções podem ser opcionais com valor padrão:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Se precisar ser injetado a partir duma propriedade com um nome diferente, use `from` para denotar a propriedade da fonte:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Semelhante aos padrões de propriedade, precisamos usar uma função de fábrica para os valores não primitivos:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Consulte também** [Fornecer ou Injetar](/guide/components/provide-inject)

## `mixins` {#mixins}

Uma vetor de objetos opcionais a serem misturados no componente atual.

- **Tipo**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Detalhes**

  A opção `mixins` aceita um vetor de objetos de mistura. Estes objetos de mistura podem conter opções de instância como objetos de instância normais, e serão combinadas contra as opções eventuais usando a lógica de combinação de opção certa. Por exemplo, se a nossa mistura contiver um gatilho `updated` e o próprio componente também tiver um, ambas funções serão chamadas.

  Os gatilhos da mistura são chamados na ordem que são fornecidos, e chamados bem antes dos gatilhos do próprio componente.

  :::warning NÃO É MAIS RECOMENDADO
  Na Vue 2, as misturas eram o mecanismo primário para criação de pedaços reutilizáveis da lógica do componente. Embora as misturas continuam a ser suportadas na Vue 3, as [Funções de Composição usando a API de Composição](/guide/reusability/composables) agora são a abordagem preferida para reutilização de código entre os componentes.
  :::

- **Exemplo**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## `extends` {#extends}

Um componente de "classe de base" a partir do qual estender.

- **Type:**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Detalhes**

  Permite que um componente estenda outro, herdando suas opções de componente.

  A partir duma perspetiva de implementação, `extends` é quase idêntico à `mixins`. O componente especificado pela `extends` será tratado como se fosse a primeira mistura.

  No entanto, `extends` e `mixins` expressam diferentes intenções. A opção `mixins` é primariamente usada para compor pedaços de funcionalidade, ao passo que `extends` está primariamente preocupada com a herança.

  Tal como acontece com a `mixins`, quaisquer opções (exceto para `setup()`) serão combinadas usando a estratégia de combinação relevante.

- **Exemplo**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning NÃO RECOMENDADA PARA API DE COMPOSIÇÃO
  `extends` está desenhada para a API de Opções e não lida com a combinação do gatilho `setup()`.

  Na API de Composição, o modelo mental preferido para reutilização da lógica é "composição" acima da "herança". Se tivermos lógica dum componente que precisa ser reutilizada num outro, consideramos extrair a lógica relevante para uma [Função de Composição](/guide/reusability/composables#composables).

  Se ainda tencionamos "estender" um componente usando a API de Composição, podemos chamar a `setup()` do componente de base na `setup()` do componente que se estende:

  ```js
  import Base from './Base.js'

  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // vínculos locais
      }
    }
  }
  ```
  :::
