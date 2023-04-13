# Atributos Especiais Embutidos {#built-in-special-attributes}

## key {#key}

O atributo especial `key` é usado principalmente como uma dica para o algoritmo de DOM virtual do Vue identificar vnodes ao comparar a nova lista de nós com a velha lista.

- **Espera:** `number | string | symbol`

- **Detalhes**

  Sem as chaves, Vue usa um algoritmo que minimiza a movimentação de elementos e tenta corrigir/reusar elementos do mesmo tipo no local, tanto quanto possível. Com chaves, ele reordenará elementos com base na alteração da ordem das chaves, e os elementos com chaves que não estão mais presentes sempre serão removidos/destruídos.

  Filhos do mesmo pai comum devem ter **chaves únicas**. Chaves duplicadas causarão erros de apresentação.

  O caso de uso mais comum é combinado com `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Também pode ser usado para forçar a substituição de um elemento/componente em vez de reutilizá-lo. Isso pode ser útil quando você deseja:

  - Acionar corretamente gatilhos de ciclo de vida de um componente
  - Acionar transições

  Por exemplo:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Quando `text` mudar, o `<span>` sempre será substituído ao invés de alterado, então uma transição será acionada.

- **Veja também:** [Guia - Interpretação de Lista - Mantendo o Estado com `key`](/guide/essentials/list.html#maintaining-state-with-key)

## ref {#ref}

Denota uma [referência do modelo de marcação](/guide/essentials/template-refs.html).

- **Espera:** `string | Function`

- **Detalhes**

  `ref` é usado para registrar uma referência a um elemento ou a um componente filho.

  Na API de Opções, a referência será registrada sob o objeto `this.$refs` do componente:

  ```vue-html
  <!-- armazenado como this.$refs.p -->
  <p ref="p">hello</p>
  ```

  Na API de Composição, a referência será armazenada em uma ref com o nome compatível:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  Se usado em um elemento DOM simples, a referência será aquele elemento; se usado em um componente filho, a referência será a instância do componente filho.

  Alternativamente `ref` pode aceitar um valor de função que fornece controle total de onde armazenar a referência:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  Uma nota importante sobre o tempo de registro de ref: como refs são criadas pelo resultado de uma função _render_, você deve aguardar até que o componente seja montado antes de acessá-las.

  `this.$refs` não é reativo, portanto você não deve tentar usar em modelos para vincular dados.

- **Veja também:**
  - [Guia - Referências do Modelo de Marcação](/guide/essentials/template-refs.html)
  - [Guia - Atribuindo Tipos as Referências do Modelo de Marcação](/guide/typescript/composition-api.html#typing-template-refs) <sup class="vt-badge ts" />
  - [Guia - Tipos as Referências do Modelo de Marcação de Componente](/guide/typescript/composition-api.html#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

Usado para vincular [componentes dinâmicos](/guide/essentials/component-basics.html#dynamic-components).

- **Espera:** `string | Component`

- **Uso em elementos nativos** <sup class="vt-badge">3.1+</sup>

  Quando o atributo `is` é usado em um elemento HTML nativo, ele será interpretado como um [Elemento embutido personalizado](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), que é um recurso nativo da plataforma web.

  Há, no entanto, um caso de uso em que você pode precisar do Vue para substituir um elemento nativo por um componente Vue, conforme explicado em [Advertências de Analise de Modelo de Marcação de DOM](/guide/essentials/component-basics.html#dom-template-parsing-caveats). Você pode prefixar o valor do atributo `is` com o atributo `vue:` para que o Vue apresente o elemento como um componente Vue:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Veja também:**

  - [Elementos Especiais Embutidos - `<component>`](/api/built-in-special-elements.html#component)
  - [Componentes Dinâmicos](/guide/essentials/component-basics.html#dynamic-components)
