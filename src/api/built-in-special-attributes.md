# Atributos Especiais Embutidos {#built-in-special-attributes}

## `key` {#key}

O atributo especial `key` é primariamente usado como uma sugestão para o algoritmo do DOM virtual da Vue identificar os nós virtuais quando diferenciar a nova lista de nós contra a antiga lista.

- **Espera:** `number | string | symbol`

- **Detalhes**

  Sem chaves, a Vue usa um algoritmo que minimiza o movimento de elemento e tenta remendar ou reusar elementos do mesmo tipo no lugar o máximo possível. Com chaves, reorganizará os elementos baseado na mudança de ordem das chaves, e os elementos com chaves que não estão mais presentes sempre serão removidos ou destruídos.

  Os filhos do mesmo pai comum devem ter **chaves únicas**. As chaves duplicadas causarão erros de interpretação.

  O caso de uso mais comum é combinado com `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Também pode ser usado para forçar a substituição dum elemento ou componente ao invés de reusá-lo. Isto pode ser útil quando queremos:

  - Acionar corretamente os gatilhos do ciclo de vida dum componente
  - Acionar transições

  Por exemplo:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Quando `text` mudar, o `<span>` sempre será substituído ao invés de ser remendado, depois uma transição será acionada.

- **Consulte também** [Guia - Interpretação de Lista - Mantendo o Estado com `key`](/guide/essentials/list#maintaining-state-with-key)

## `ref` {#ref}

Denota uma [referência do modelo de marcação](/guide/essentials/template-refs).

- **Espera:** `string | Function`

- **Detalhes**

  `ref` é usado para registar uma referência à um elemento ou à um componente filho.

  Na API de Opções, a referência será registada sob o objeto `this.$refs` do componente:

  ```vue-html
  <!-- armazenado como this.$refs.p -->
  <p ref="p">hello</p>
  ```

  Na API de Composição, a referência será armazenada em uma `ref` com o nome correspondente:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  Se usado sobre um elemento de DOM simples, a referência será este elemento; se usada sobre um componente filho, a referência será a instância do componente filho.

  Alternativamente, a `ref` pode aceitar um valor de função que fornece controlo total sobre onde armazenar a referência:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  Uma nota importante sobre o tempo de registo da referência: uma vez que as próprias referências são criadas como resultado da função de interpretação, devemos esperar até o componente ser montado antes de acessá-las.

  `this.$refs` também não é reativa, portanto não devemos tentar usá-la nos modelos de marcação para vínculo de dados.

- **Consulte também**
  - [Guia - Referências do Modelo de Marcação](/guide/essentials/template-refs)
  - [Guia - Tipos para Referências do Modelo de Marcação](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" data-text="typescript" />
  - [Guia - Tipos para Referências do Modelo de Marcação do Componente](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" data-text="typescript" />

## `is` {#is}

Usado para vincular os [componentes dinâmicos](/guide/essentials/component-basics#dynamic-components).

- **Espera:** `string | Component`

- **Uso sobre os elementos nativos** <sup class="vt-badge">3.1+</sup>

  Quando o atributo `is` for usado sobre um elemento de HTML nativo, será interpretado como um [elemento embutido personalizado](https://html.spec.whatwg.org/multipage/custom-elements#custom-elements-customized-builtin-example), que é uma funcionalidade da plataforma da Web nativa.

  Existe, no entanto, um caso de uso onde podemos precisar que a Vue substitua um elemento nativo por um elemento da Vue, como explicado nas [Advertências de Analise do Modelo de Marcação de DOM](/guide/essentials/component-basics#dom-template-parsing-caveats). Nós podemos prefixar o valor do atributo `is` com `vue:` assim a Vue interpretará o elemento como um componente de Vue:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Consulte também**

  - [Elementos Especiais Embutidos - `<component>`](/api/built-in-special-elements#component)
  - [Componentes Dinâmicos](/guide/essentials/component-basics#dynamic-components)
