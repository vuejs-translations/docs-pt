# Opções: Composição {#options-composition}

## provide {#provide}

Fornece valores que podem ser injetados por componentes descendentes.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Detalhes:**

  `provide` e [`inject`](#inject) são usados ​​juntos para permitir que um componente ancestral sirva como um injetor de dependência para todos os seus descendentes, independentemente de quão profunda seja a hierarquia do componente, desde que estejam no mesmo pai corrente.

  A opção `provide` deve ser um objeto ou uma função que retorna um objeto. Este objeto contém as propriedades que estão disponíveis para injeção em seus descendentes. Você pode usar símbolos como chaves neste objeto.

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

  Observe no exemplo acima, a `msg` fornecida NÃO será reativa. Veja [Trabalhando com Reatividade](/guide/components/provide-inject.html#working-with-reactivity) para mais detalhes.

- **Veja também:** [Provide / Inject](/guide/components/provide-inject.html)

## inject {#inject}

Declare as propriedades a serem injetadas no componente atual, localizando-as nos provedores ancestrais.

- **Type**

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

  - Um array de strings, ou
  - Um objeto em que as chaves são o nome da ligação local e o valor é:
    - A chave (string ou Symbol) para procurar nas injeções disponíveis, ou
    - Um objeto onde:
      - A propriedade `from` é a chave (string ou Symbol) para procurar nas injeções disponíveis e
      - A propriedade `default` é usada como valor de fallback. Semelhante aos valores padrão das propiedades, uma factory function é necessária para   tipos de objeto para evitar o compartilhamento de valor entre várias instâncias de componentes

  Uma propriedade injetada será `undefined` se não houver propriedade correspondente ou o valor padrão não for fornecido.

  Observe que as ligações injetadas NÃO são reativas. Isso é intencional. No entanto, se o valor injetado for um objeto reativo, as propriedades desse objeto permanecem reativas. Veja [Trabalhando com Reatividade](/guide/components/provide-inject.html#working-with-reactivity) para mais detalhes.

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

  Se precisar ser injetado de uma propriedade com um nome diferente, use `from` para denotar a propriedade de origem:

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

  Semelhante aos padrões de propriedade, você precisa usar uma factory function para valores não primitivos:

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

- **Veja também:** [Provide / Inject](/guide/components/provide-inject.html)

## mixins {#mixins}

Uma matriz de objetos opcionais a serem misturados no componente atual.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Detalhes:**

  A opção `mixins` aceita um array de objetos mixin. Esses objetos mixin podem conter opções de instância como objetos de instância normais, e eles serão mesclados com as opções eventuais usando a lógica de mesclagem de certas opções. Por exemplo, se seu mixin contiver um gancho `created` e o próprio componente também tiver um, ambas as funções serão chamadas.

  Os ganchos do Mixin são chamados na ordem em que são fornecidos e chamados antes dos próprios ganchos do componente.

  :::warning Não é mais recomendado
  No Vue 2, os mixins eram o principal mecanismo para criar blocos reutilizáveis ​​de componentes lógicos. Enquanto os mixins continuam a ser suportados no Vue 3, [API de Composição](/guide/reusability/composables.html) é a abordagem preferencial para reutilização de código entre componentes.
  :::

- **Exemplo:**

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

## extends {#extends}

Uma "class base" de componente para ser estendida.

- **Type:**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Detalhes:**

  Permite que um componente estenda outro, herdando suas opções de componentes.

  De uma perspectiva de implementação, `extends` é quase idêntico a `mixins`. O componente especificado por `extends` será tratado como se fosse o primeiro mixin.

  No entanto, `extends` e `mixins` expressam intenções diferentes. A opção `mixins` é usada principalmente para compor pedaços de funcionalidade, enquanto `extends` se preocupa principalmente com herança.

  Tal como acontece com `mixins`, todas as opções serão mescladas usando a estratégia de mesclagem relevante.

- **Exemplo:**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```
