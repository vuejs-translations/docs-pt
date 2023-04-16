# Options: Misc {#options-misc}

## name {#name}

Explicitamente declara um nome de exibição para o componente.

- **Type**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Detalhes**

  O nome de um componente é usado para o seguinte:

  - Auto-referência recursiva no próprio modelo do componente
  - Exibição na árvore de inspeção de componentes do Vue DevTools
  - Exibição em rastreamentos de componentes de aviso

  Quando você usa componentes de arquivo único, o componente já infere seu próprio nome a partir do nome do arquivo. Por exemplo, um arquivo chamado `MyComponent.vue` terá o nome de exibição inferido "MyComponent".

  Outro caso é quando um componente é registrado globalmente com [`app.component`](/api/application.html#app-component), o ID global é definido automaticamente como seu nome.

  A opção `name` permite que você substitua o nome inferido ou forneça explicitamente um nome quando nenhum nome puder ser inferido (por exemplo, quando não estiver usando ferramentas de construção ou um componente embutido não SFC).

  Há um caso em que `name` é explicitamente necessário: ao comparar com componentes que podem ser armazenados em cache em [`<KeepAlive>`](/guide/built-ins/keep-alive.html) por meio de suas props `include / exclude`.

  :::tip
  Desde a versão 3.2.34, um componente de arquivo único usando `<script setup>` inferirá automaticamente sua opção `name` com base no nome do arquivo, removendo a necessidade de declarar manualmente o nome mesmo quando usado com `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Controla se o comportamento fallthrough de atributo padrão do componente deve ser ativado.

- **Type**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Detalhes**

  Por padrão, as vinculações de atributo de escopo pai que não são reconhecidas como props serão "fallthrough". Isso significa que, quando temos um componente de raiz única, essas vinculações serão aplicadas ao elemento raiz do componente filho como atributos HTML normais. Ao criar um componente que envolve um elemento de destino ou outro componente, nem sempre esse é o comportamento desejado. Definindo `inheritAttrs` como `false`, esse comportamento padrão pode ser desabilitado. Os atributos estão disponíveis através da propriedade de instância `$attrs` e podem ser vinculados explicitamente a um elemento não-raiz usando `v-bind`.

- **Exemplo**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  Ao declarar esta opção em um componente que usa `<script setup>`, um bloco separado `<script>` é necessário:

  ```vue
  <script>
  export default {
    inheritAttrs: false
  }
  </script>

  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **Veja também:** [Atributos que Caem](/guide/components/attrs.html)

## components {#components}

Um objeto que registra os componentes a serem disponibilizados para a instância do componente.

- **Type**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Exemplo**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // forma abreviada
      Foo,
      // registra com um nome diferente
      RenamedBar: Bar
    }
  }
  ```

- **Veja também:** [Registo de Componente](/guide/components/registration.html)

## directives {#directives}

Um objeto que registra as diretivas a serem disponibilizadas para a instância do componente.

- **Type**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Exemplo**

  ```js
  export default {
    directives: {
      // habilita v-focus no template
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

  Um hash de diretivas a serem disponibilizadas para a instância do componente.

- **Veja também:** [Diretivas Personalizadas](/guide/reusability/custom-directives.html)
