# Opções: Estado {#options-state}

## `data` {#data}

Uma função que retorna o estado reativo inicial para a instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Detalhes**

  Espera-se que a função retorne um objeto de JavaScript simples, que será tornado reativo pela Vue. Depois da instância ser criada, o objeto de dados reativo pode ser acessado com `this.$data`. A instância do componente também delega todas as propriedades encontradas no objeto de dados, então `this.a` será equivalente à `this.$data.a`.

  Todas as propriedades de dados de alto nível devem ser incluídas no objeto de dados retornado. A adição de novas propriedades à `this.$data` é possível, mas *não* é recomendada. Se o valor desejado duma propriedade ainda não estiver disponível, então um valor vazio tal como `undefined` ou `null` deveria ser incluído como preservador de lugar para garantir que a Vue saiba que a propriedade existe. 

  As propriedades que começam com `_` ou `$` **não** serão delegadas na instância do componente porque podem entrar em conflito com as propriedades internas e métodos da API da Vue. Nós teremos de acessá-las como `this.$data._property`. 

  **Não** é recomendado retornar objetos com os seus próprios comportamentos de estado, como objetos da API do navegador e propriedades do protótipo. O objeto retornado deveria ser idealmente um objeto simples que apenas representa o estado do componente.

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Nota que se usarmos uma função de seta com a propriedade `data`, o `this` não será a instância do componente, mas ainda podemos acessar a instância como o primeiro argumento da função:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **Consulte também:** [Reatividade em Profundidade](/guide/extras/reactivity-in-depth.html)

## `props` {#props}

Declara as propriedades dum componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > Os tipos estão simplificados por questões de legibilidade.

- **Detalhes**

  Na Vue, todas as propriedades do componente precisam ser explicitamente declaradas. As propriedades podem ser declaradas de duas formas:

  - De forma simples usando um vetor de sequências de caracteres
  - De forma completa usando um objeto onde cada chave de propriedade é o nome da propriedade, e o valor é o tipo da propriedade (uma função construtura) ou opções avançadas.

  Com a sintaxe baseada em objetos, cada propriedade pode ainda definir as seguintes opções:

  - **`type`**: Pode ser um dos seguintes construtores nativos: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, qualquer função construtora personalizada ou um vetor destes. No modo de desenvolvimento, a Vue verificará se o valor duma propriedade corresponde o tipo declarado, e lançará um aviso se não corresponder. Consulte a [Validação de Propriedade](/guide/components/props.html#prop-validation) por mais detalhes.

    Além disto nota que uma propriedade com o tipo `Boolean` afeta o seu comportamento de moldagem de valores em ambos desenvolvimento e produção. Consulte a [Moldagem Booleana](/guide/components/props.html#boolean-casting) por mais detalhes.

  - **`default`**: Especifica o valor padrão duma propriedade quando não é passada pelo pai ou quando tem o valor `undefined`. Os valores padrão de objeto ou vetor devem ser retornados usando uma função de fábrica. A função de fábrica também recebe o objeto de propriedades puro como argumento.

  - **`required`**: Define se a propriedade é obrigatória. Num ambiente que não é de produção, um aviso na consola será lançado se este valor for verdadeiro e a propriedade não for passada.

  - **`validator`**: Função de validação personalizada que recebe o valor da propriedade como o único argumento. No modo de desenvolvimento, um aviso da consola será lançado se esta função retornar um valor falso (por exemplo, se a validação falhar).

- **Exemplo**

  Declaração simples:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Declaração de objeto com validações:

  ```js
  export default {
    props: {
      // verificação de tipo
      height: Number,
      // verificação de tipo mais outras validações
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **Consulte também:**
  - [Guia - Propriedades](/guide/components/props.html)
  - [Guia - Tipos para as Propriedades dos Componentes](/guide/typescript/options-api.html#typing-component-props) <sup class="vt-badge ts" data-text="typescript" />

## `computed` {#computed}

Declara propriedades computadas a serem expostas na instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Detalhes**

  A opção aceita um objeto onde a chave é o nome da propriedade computada, e o valor é ou um recuperador computado, ou um objeto com métodos `get` e `set` (para as propriedades computadas graváveis).

  Todos os recuperadores e definidores têm o seu próprio contexto de `this` automaticamente vinculado à instância do componente.

  Nota que se estivermos a usar uma função de seta com uma propriedade computada, `this` não apontará para a instância do componente, mas ainda podemos acessar a instância como o primeiro argumento da função:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // somente leitura
      aDouble() {
        return this.a * 2
      },
      // gravável
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **Consulte também**
  - [Guia - Propriedades Computadas](/guide/essentials/computed.html)
  - [Guia - Tipos para as Propriedades Computadas](/guide/typescript/options-api.html#typing-computed-properties) <sup class="vt-badge ts" data-text="typescript" />

## `methods` {#methods}

Declara métodos a serem misturados à instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Detalhes**

  Os métodos declarados podem ser acessados diretamente na instância do componente, ou usados nas expressões do modelo de marcação. Todos os métodos têm o seu contexto de `this` automaticamente vinculado à instância do componente, mesmo quando passados.

  Devemos evitar funções de seta quando declaramos métodos, porque não terão acesso à instância do componente através de `this`.

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **Consulte também** a [Manipulação de Evento](/guide/essentials/event-handling.html)

## `watch` {#watch}

Declara as funções de resposta de observação a serem invocadas sobre a mudança de dados.

- **Tipo**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // predefinido como: false
    deep?: boolean // predefinido como: false
    flush?: 'pre' | 'post' | 'sync' // predefinido como: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Os tipos estão simplificados por questões de legibilidade.

- **Detalhes**

  A opção `watch` espera um objeto onde as chaves estão as propriedades reativas da instância do componente a serem observadas (por exemplo, as propriedades declaradas através da `data` ou `computed`) — e os seus valores são as funções de resposta correspondentes. A função de resposta recebe o novo valor e o valor antigo da fonte observada.

  Além das propriedades do nível da raiz, a chave também pode ser um caminho simples delimitado por pontos, por exemplo, `a.b.c`. Nota que este uso **não** suporta expressões complexas - apenas caminhos delimitados por ponto são suportados. Se precisarmos de observar fontes de dados complexas, devemos usar a API [`$watch()`](/api/component-instance.html#watch) imperativa.

  O valor também pode ser a sequência de caracteres dum nome de método (declarado através dos `methods`), ou um objeto que contém opções adicionais. Quando usamos a sintaxe de objeto, a função de resposta deve ser declarada sob o campo `handler`. As propriedades adicionais incluem:

  - **`immediate`**: aciona a função de resposta imediatamente sobre a criação do observador. O valor antigo será `undefined` na primeira chamada.  
  - **`deep`**: força a travessia profunda da fonte se for um objeto ou um vetor, para que a função de resposta dispare sobre as mutações profundas. Consulte os [Observadores Profundos](/guide/essentials/watchers.html#deep-watchers).
  - **`flush`**: ajusta o tempo de descarga da função de resposta. Consulte o [Tempo de Descarga da Função de Resposta](/guide/essentials/watchers.html#callback-flush-timing) e a [`watchEffect()`](/api/reactivity-core.html#watcheffect).
  - **`onTrack / onTrigger`**: depura as dependências do observador. Consulte a [Depuração do Observador](/guide/extras/reactivity-in-depth.html#watcher-debugging).

  Devemos evitar usar funções de seta quando declaramos funções de resposta de observação porque não terão acesso à instância do componente através de `this`.

- **Exemplo**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // observando uma propriedade de alto nível
      a(val, oldVal) {
        console.log(`nova: ${val}, antiga: ${oldVal}`)
      },
      // sequência de caracteres do nome do método
      b: 'someMethod',
      // a função de resposta será chamada sempre que alguma
      // das propriedades do objeto observado mudar independente da
      // sua profundidade encaixada.
      c: {
        handler(val, oldVal) {
          console.log('c mudou')
        },
        deep: true
      },
      // observando uma única propriedade encaixada:
      'c.d': function (val, oldVal) {
        // fazer alguma coisa
      },
      // a função de resposta será chamada imediatamente
      // após o início da observação
      e: {
        handler(val, oldVal) {
          console.log('e mudou')
        },
        immediate: true
      },
      // podemos passar um vetor de funções de respostas,
      // serão chamados um atrás do outro
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 disparado')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 disparado')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b mudou')
      },
      handle1() {
        console.log('handle 1 disparado')
      }
    },
    created() {
      this.a = 3 // => novo: 3, antigo: 1
    }
  }
  ```

- **Consulte também** [Observadores](/guide/essentials/watchers.html)

## `emits` {#emits}

Declara os eventos personalizados emitidos pelo componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Detalhes**

  Os eventos emitidos podem ser declarados de duas formas:

  - De forma simples usando um vetor de sequências de caracteres
  - De forma completa usando um objeto onde cada chave de propriedade é o nome do evento, e o valor ou é `null` ou é uma função de validação.

  A função de validação receberá argumentos adicionais passados para a chamada de `$emit` do componente. Por exemplo, se `this.$emit('foo', 1)` for chamado, a função de validação correspondente para `foo` receberá o argumento `1`. A função de validação deve retornar um booleano para indicar se os argumentos do evento são válidos.

  Nota que a opção `emits` afeta os ouvintes de eventos que são considerados ouvintes de eventos do componente, em vez de ouvintes de eventos nativos do DOM. Os ouvintes para eventos declarados serão removidos do objeto `$attrs` do componente, assim não serão passados ao elemento raiz do componente. Consulte os [Atributos](/guide/components/attrs.html) por mais detalhes.

- **Exemplo**

  Sintaxe de vetor:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Sintaxe de objeto:

  ```js
  export default {
    emits: {
      // sem validação
      click: null,

      // com validação
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **Consulte também**
  - [Guia - Atributos](/guide/components/attrs.html)
  - [Guia - Tipos para as Emissões do Componente](/guide/typescript/options-api.html#typing-component-emits) <sup class="vt-badge ts" data-text="typescript" />

## `expose` {#expose}

Declara as propriedades públicas expostas quando a instância do componente for acessada por um pai através das referências do modelo de marcação.

- **Tipo**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Detalhes**

  Por padrão, uma instância de componente expõe todas as propriedades da instância ao pai quando acessada através de `$parent`, `$root`, ou referências do modelo de marcação. Isto pode ser indesejável, visto que um componente provavelmente possui estado interno ou métodos que devem permanecer privados para evitar associação rigorosa.

  A opção `expose` espera uma lista de sequências de caracteres de nomes de propriedade. Quando `expose` for usada, apenas as propriedades explicitamente listadas serão expostas sobre a instância pública do componente.

  `expose` apenas afeta as propriedades definidas pelo utilizador - não filtra as propriedades da instância do componente embutido.

- **Exemplo**

  ```js
  export default {
    // apenas `publicMethod` estará disponível na instância pública
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
