# Vue e os Componentes da Web {#vue-and-web-components}

Os [Componentes da Web](https://developer.mozilla.org/en-US/docs/Web/Web_Components) é um termo abrangente para um conjunto de APIs nativas da Web que permitem os programadores criar elementos personalizados reutilizáveis.

Nós consideramos a Vue e os Componentes da Web como sendo tecnologias essencialmente complementares. A Vue tem excelente suporta para tanto consumir e criar elementos personalizados. Quer estejas a integrar os elementos personalizados à uma aplicação de Vue existente, ou usar a Vue para construir e distribuir elementos personalizados, estás em boa companhia.

## Usando Elementos Personalizados na Vue {#using-custom-elements-in-vue}

A Vue [atinge um pontuação perfeita de 100% nos testes da Custom Elements Everywhere]. Consumir elementos personalizados dentro de uma aplicação de Vue funciona em grande parte da mesma maneira como usamos elementos de HTML nativos, com algumas coisas a manter em mente:

### Saltando a Resolução de Componente {#skipping-component-resolution}

Por padrão, a Vue tentará resolver um marcador de HTML que não é nativo como um componente de Vue registado antes de retroceder para apresentá-lo como um elemento personalizado. Isto fará a Vue emitir um aviso `failed to resolve component` (falhou em resolver o componente) durante o desenvolvimento. Para deixar a Vue saber que certos elementos deveriam ser tratados como elementos personalizados e saltar a resolução de componente, podemos especificar a [opção `compilerOptions.isCustomElement`].

Se estiveres a usar Vue com uma configuração de construção, a opção deveria ser passada através das configurações de construção já que é uma opção do tempo de compilação. 

#### Exemplificar a Configuração No Navegador {#example-in-browser-config}

```js
// Apenas funciona se usas a compilação no navegador.
// Se usas ferramentas de construção,
// consulte os exemplos de configuração abaixo.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Exemplificar a Configuração da Vite {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // trata todos os marcadores com um travessão,
          // como elementos personalizados.
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Exemplificar a Configuração da Linha de Comando da Vue {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // trata qualquer marcador que começa com `ion-`,
          // como elementos personalizados.
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Passando Propriedades do DOM {#passing-dom-properties}

Já que os atributos do DOM apenas podem ser sequências de caracteres, precisamos de passar dados complexos para os elementos personalizados como propriedades de DOM. Quando definires propriedades num elemento personalizado, a Vue 3 verifica automaticamente a presença da propriedade do DOM usando o operador `in` e preferirá definir o valor como uma propriedade de DOM se a chave estiver presente. Isto significa que, na maioria dos casos, não precisarás de pensar sobre isto se o elemento personalizado segue as [boas práticas recomendadas](https://web.dev/custom-elements-best-practices/).

No entanto, poderia existir casos onde os dados devem ser passados como uma propriedade de DOM, mas o elemento personalizado não define ou reflete apropriadamente a propriedade (fazendo a verificação de `in` falhar). Neste caso, podes forçar um vínculo de `v-bind` para ser definido como uma propriedade de DOM usando o modificador `.prop`:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- abreviação equivalente -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Construindo Elementos Personalizados com a Vue {#building-custom-elements-with-vue}

O benefício primário dos elementos personalizados é que podem ser usados com qualquer abstração, ou mesmo sem uma abstração. Isto faz deles ideal para distribuir componentes onde o consumidor final talvez não esteja a usar a mesma pilha de frontend, ou quando quiseres isolar a aplicação final dos detalhes de implementação dos componentes que usa.

### defineCustomElement {#definecustomelement}

A Vue suporta a criação de elementos personalizados usando explicitamente as mesmas APIs de componente de Vue através do método [`defineCustomElement`](/api/general#definecustomelement). O método aceita o mesmo argumento que [`defineComponent`](/api/general#definecomponent), mas ao invés desta retorna um construtor de elemento personalizado que estende o `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // opções normais de componente de Vue
  props: {},
  emits: {},
  template: `...`,

  // apenas para defineCustomElement: CSS é injetada na raiz sombra
  styles: [`/* inlined css */`]
})

// Regista o elemento personalizado.
// Depois do registo, todos marcadores `<my-vue-element>`
// na página serão atualizados.
customElements.define('my-vue-element', MyVueElement)

// Tu podes também instanciar programaticamente o elemento:
// (apenas pode ser feito depois do registo)
document.body.appendChild(
  new MyVueElement({
    // propriedades iniciais (opcional)
  })
)
```

#### Ciclo de Vida {#lifecycle}

- Um elemento personalizado de Vue montará uma instância de componente de Vue interna dentro da sua raiz sombra quando a [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) do elemento for chamada pela primeira vez.

- Quando a `disconnectedCallback` do elemento for invocada, a Vue verificará se o elemento está separado do documento depois de um tiquetaque de micro-tarefa.

  - Se o elemento ainda estiver no documento, é uma mudança e a instância do componente será preservada;

  - Se o elemento estiver separado do documento, é uma remoção e a instância do componente será desmontada.

#### Propriedades {#props}

- Todas propriedades declaradas usando a opção `props` será definida sobre o elemento personalizado como propriedades. A Vue lidará automaticamente com a reflexão entre atributos ou propriedades onde oportuno.

  - Os atributos sempre são refletidos para as propriedades correspondentes.

  - As propriedades com valores primitivos (`string`, `boolean` ou `number`) são refletidos como atributos.

- A Vue também lança automaticamente as propriedades declaradas com os tipos `Boolean` ou `Number` para o tipo desejado quando são definidas como atributos (os quais sempre são sequências de caracteres). Por exemplo, dada as seguinte declaração de propriedades:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  E o uso do elemento personalizado:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  No componente, `selected` será lançada para `true` (booleano) e `index` será lançada para `1` (número).

#### Eventos {#events}

Os eventos emitidos através de `this.$emit` ou `emit` de configuração são despachados como [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) nativos sobre o elemento personalizado. Os argumentos de eventos adicionais (carga) serão expostos como um arranjo sobre o objeto `CustomEvent` como sua propriedade `detail`.

#### Ranhuras {#slots}

Dentro do componente, as ranhuras podem ser apresentadas usando o elemento `<slot/>` como de costume. No entanto, quando consomes o elemento resultante, este apenas aceita a [sintaxe de ranhuras nativas](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- As [ranhuras isoladas](/guide/components/slots#scoped-slots) não são suportadas.

- Quando passares ranhuras nomeadas, use o atributo `slot` ao invés da diretiva `v-slot`:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Fornecer ou Injetar {#provide-inject}

A [API de Fornecimento ou Injeção](/guide/components/provide-inject#provide-inject) e sua [API de composição equivalente](/api/composition-api-dependency-injection#provide) também funciona entre os elementos personalizados definidos pela Vue. No entanto, nota que este funciona **apenas entre elementos personalizados**, por exemplo, um elemento personalizado definido pela Vue não será capaz de injetar propriedades fornecidas por um componente de Vue que não é um elemento personalizado.

### Componente de Ficheiro Único como Elemento Personalizado {#sfc-as-custom-element}

A `defineCustomElement` também funciona com Componentes de Ficheiro Único de Vue (SFCs, sigla em Inglês). No entanto, com a configuração de ferramental padrão, o `<style>` dentro dos Componentes de Ficheiro Único continuarão a ser extraídos e fundidos em um único ficheiro de CSS durante a construção de produção. Quando executares um Componente de Ficheiro Único como um elemento personalizado, é frequentemente desejável injetar os marcadores `<style>` para o raiz sombra do elemento personalizado.

O ferramental de Componente de Ficheiro Único oficial suporta a importação de Componentes de Ficheiro Único no "modo de elemento personalizado" (requer `@vitejs/plugin-vue@^1.4.0` ou `vue-loader@^16.5.0`). Um Componente de Ficheiro Único carregado no modo de elemento personalizado embute os seus marcadores `<style>` como sequências de caracteres de CSS e as expõe sob a opção `styles` do componente. Isto será buscada pela `defineCustomElement` e injetado para a raiz sombra do elemento quando instanciada.

Para optar para este modo, simplesmente termine o nome do teu ficheiro de componente com `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// converte para construtor de elemento personalizado
const ExampleElement = defineCustomElement(Example)

// registar
customElements.define('my-example', ExampleElement)
```

Se desejas personalizar o quais ficheiros deveriam ser importados no modo de elemento personalizado (por exemplo, tratar _todos_ os Componentes de Ficheiro Único como elementos personalizados), podes passar a opção `customElement` para as respetivas extensões de construção:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Conselhos para uma Biblioteca de Elementos Personalizado da Vue {#tips-for-a-vue-custom-elements-library}

Quando construires elementos personalizados com Vue, os elementos dependerão do executor da Vue. Existe um custo de tamanho base de mais ou menos 16kb dependendo de quantas funcionalidades estão a ser usadas. Isto significa que não é ideal usar a Vue se estás a entregar um único elemento personalizado - talvez queiras usar a JavaScript pura, [petite-vue](https://github.com/vuejs/petite-vue), ou abstrações que se especializam no tamanho de executor pequeno. No entanto, o tamanho de base é mais do que justificável se estás a entregar uma coleção de elementos personalizados com lógica complexa, já que a Vue permitirá que cada componente possa ser criado com menos código.

Se os elementos personalizados serão usados numa aplicação que também está a usar a Vue, podes escolher expor a Vue a partir do pacote construído assim os elementos estarão a usar a mesmo cópia de Vue a partir da aplicação hospedeira.

É recomendado exportar os construtores de elemento individual para dar aos teus utilizadores a flexibilidade de importá-los sobre demanda e registá-los com nomes de marcador desejado. Tu podes também exportar uma função de conveniência para registar automaticamente todos os elementos. Cá esta um ponto de entrada de exemplo duma biblioteca de elemento personalizado de Vue:

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// exportar os elementos de maneira individual
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Se tiveres muitos componentes, podes também influenciar as funcionalidades da ferramenta de construção tais como a [importação de glob](https://pt.vitejs.dev/guide/features#glob-import) da Vite ou [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) da Webpack para carregar todos os componentes a partir dum diretório.

## Componentes da Web vs. Componentes da Vue {#web-components-vs-vue-components}

Alguns programadores acreditam que os modeles de componente proprietário da abstração deveriam ser evitados, e que usar exclusivamente os Elementos Personalizados tornam uma aplicação "imune ao futuro". Cá tentaremos explicar o porquê que acreditamos que isto é uma abordagem demasiadamente simplista de enfrentar o problema.

Existe de fato um certo nível de funcionalidade que sobrepõe-se entre os Elementos Personalizados e Componentes de Vue: ambos permitem-nos definir componentes reutilizáveis com a passagem de dados, emissão de evento, e gestão do ciclo de vida. No entanto, as APIs de Componentes da Web são relativamente de baixo nível e esqueletos. Para construiremos uma aplicação de fato, precisamos de razoavelmente algumas capacidades adicionais que a plataforma não cobre:

- Um sistema de criação de modelos de marcação declarativo e eficiente;

- Um sistema de gestão de estado reativo que facilita a extração e reutilização da lógica através de componente;

- Um maneira otimizada de gerar os componentes no servidor e hidratá-los no cliente (SSR, sigla em Inglês), o que é importante para otimização do motor de pesquisa (SEO, sigla em Inglês) e [Métricas Vitais da Web tais como LCP](https://web.dev/vitals/). A interpretação no lado do servidor de elementos personalizados nativos normalmente envolve a simulação do DOM na Node.js e depois a serialização do DOM modificado, enquanto a interpretação no lado de servidor da Vue compila para uma concatenação de sequência de caracteres sempre que possível, o que é muito mais eficiente.

O modelo de componente da Vue está desenhado com estas necessidades em mente como um sistema coerente.

Com uma equipa de engenharia competente, provavelmente poderias construir o equivalente sobre os Elementos Personalizados nativos -  mas isto também significa que estás a comprometer-se com fardo de manutenção de longo prazo de uma abstração interna, enquanto perdes os benefícios do ecossistema e comunidade duma abstração madura como a Vue.

Também existem abstrações construídas usando Elementos Personalizados como fundamento de seu modelo de componente, mas todas inevitavelmente têm de introduzir suas soluções proprietárias para os problemas listados acima. Usar estas abstrações implica comprar suas decisões técnicas sobre como solucionar estes problemas - o que, apesar o que pode ser anunciado, não protegem-te automaticamente de potenciais problemas do futuro.

Também existem algumas onde encontramos limitações nos elementos personalizados:

- A avaliação incansável da ranhura dificulta a composição do componente. As [ranhuras isoladas](/guide/components/slots#scoped-slots) da Vue são um poderoso mecanismo para composição de componente, que não podem ser suportadas pelos elementos personalizados devido a natura ansiosa das ranhuras nativas. As ranhuras ansiosas também significa que o recebimento do componente não pode controlar quanto ou se gera um pedaço de conteúdo da ranhura.

- Entregar elementos personalizados com CSS isolado do DOM sombra hoje requer fixar o CSS dentro da JavaScript para que possam ser injetadas nas raízes sombra em tempo de execução. Eles também resultam em estilos duplicados na marcação em cenários de interpretação no lado do servidor (SSR, sigla em Inglês). Existem [funcionalidades de plataforma](https://github.com/whatwg/html/pull/4898/) sendo trabalhadas sobre esta área - mas desde agora ainda não são universalmente suportas, e ainda existem preocupações quanto ao desempenho de produção ou interpretação no lado do servidor (SSR, sigla em Inglês) a serem abordados. No entretanto, os Componentes de Ficheiro Único da Vue fornecem [mecanismos de isolamento de CSS](/api/sfc-css-features) que suportam extração de estilos para ficheiros de CSS simples.

A Vue sempre continuará atualizada com padrões mais recentes na plataforma da Web, e entregaremos felizmente tudo aquilo que a plataforma fornecer se isto tornar o nosso trabalho mais fácil. No entanto, o nosso objetivo é fornecer soluções que funcionam bem e funcionam hoje. Isto significa que temos de incorporar novas funcionalidades da plataforma com uma mentalidade crítica - e isto envolve preencher os espaços em branco onde os padrões não conseguem enquanto isto for o caso.
