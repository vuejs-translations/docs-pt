# Opções: Outros {#options-misc}

## `name` {#name}

Explicitamente declara um nome de exibição para o componente.
Declara explicitamente um nome de exibição para o componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Detalhes**

  O nome dum componente é usado para o seguinte:

  - Auto-referência recursiva no modelo de marcação do próprio componente
  - Exibição na árvore de inspeção de componentes das ferramentas de programação da Vue
  - Exibição em traços de componentes de aviso

  Quando usamos os componentes de ficheiro único, o componente já infere o seu próprio nome a partir do nome do ficheiro. Por exemplo, um ficheiro chamado `MyComponent.vue` terá o nome de exibição inferido "MyComponent".

  Um outro caso é que quando um componente é registado globalmente com [`app.component`](/api/application#app-component), o identificador global é definido automaticamente como seu nome.

  A opção `name` permite-nos sobrepor o nome inferido, ou explicitamente fornecer um nome quando nenhum nome puder ser inferido (por exemplo, quando não estamos usando ferramentas de construção, ou um componente que não é de ficheiro único embutido).

  Existe um caso onde `name` é explicitamente necessário: quando correspondemos contra componentes passíveis de armazenamento de consulta imediata no [`<KeepAlive>`](/guide/built-ins/keep-alive) através das suas propriedades `include / exclude`.

  :::tip DICA
  Desde a versão 3.2.34, um componente de ficheiro único usando `<script setup>` inferirá automaticamente a sua opção `name` baseado no nome do ficheiro, removendo a necessidade de manualmente declarar o nome mesmo quando usado com `<KeepAlive>`.
  :::

## `inheritAttrs` {#inheritattrs}

Controla se o comportamento padrão de passagem de atributo do componente deveria ser ativado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // predefinido como: true
  }
  ```

- **Detalhes**

  Por padrão, os vínculos de atributos do âmbito de aplicação pai que não são reconhecidos como propriedades "cairão". Isto significa que quando tivermos um componente de única raiz, estes vínculos serão aplicados ao elemento raiz do componente filho como atributos de HTML normais. Quando escrevemos um componente que envolve um elemento alvo ou um outro componente, isto pode não ser sempre o comportamento desejado. Pela definição de `inheritAttrs` para `false`, este comportamento padrão pode ser desligado. Os atributos estão disponíveis através da propriedade de instância `$attrs` e podem ser explicitamente vinculadas à um elemento que é de raiz usando `v-bind`.

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
  Quando declaramos esta opção num componente que usa `<script setup>`, podemos usar a macro [`defineOptions`](/api/sfc-script-setup#defineoptions):

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({ 
    inheritAttrs: false 
  })
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

  Desde a versão 3.3 podemos também usar `defineOptions` diretamente no `<script setup>`:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
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

- **Consulte também** [Atributos de Passagem](/guide/components/attrs)

## `components` {#components}

Um objeto que regista os componentes a serem disponibilizados à instância do componente.

- **Tipo**

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
      // abreviatura
      Foo,
      // registar sob um nome diferente
      RenamedBar: Bar
    }
  }
  ```

- **Consulte também** [Registo de Componente](/guide/components/registration)

## `directives` {#directives}

Um objeto que regista as diretivas a serem disponibilizadas à instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Exemplo**

  ```js
  export default {
    directives: {
      // ativa `v-focus` no modelo de marcação
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

  Um dicionário de diretivas a serem disponibilizadas à instância do componente.

- **Consulte também** [Diretivas Personalizadas](/guide/reusability/custom-directives)
