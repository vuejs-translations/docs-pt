---
outline: deep
---

# Desempenho {#performance}

## Visão Geral {#overview}

A Vue é desenhada para ser otimizada para a maior parte dos casos de uso comuns sem muita necessidade de otimizações manuais. No entanto, existe sempre cenários desafiadores onde afinamento adicional é necessário. Nesta seção, discutiremos o que deverias prestar atenção quando toca o desempenho em uma aplicação de Vue.

Primeiro, vamos discutir dois aspetos principais de desempenho da web:

- **Desempenho do Carregamento da Página**: quão rápido a aplicação mostra o conteúdo e torna-se interativa na visita inicial. Isto é usualmente medido usando métricas vitais da web como [Pintura Alargada do Conteúdo (LCP)](https://web.dev/lcp/) e [Primeiro Atraso da Entrada (FID)](https://web.dev/fid/).

- **Desempenho da Atualização**: quão rápido a aplicação atualiza-se em resposta a entrada do utilizador. Por exemplo, quão rápido uma lista atualiza quando o utilizador digita em uma caixa de pesquisa, ou quão rápido a página alterna quando o utilizador clica em uma ligação de navegação em uma Aplicação de Página Única (SPA).

Enquanto seria ideal maximizar ambos, diferentes arquiteturas de frontend tendem a afetar o quão fácil é alcançar o desempenho desejado nestes aspetos. Além disto, o tipo de aplicação que estás a construir influencia grandemente no que deves priorizar em termos de desempenho. Portanto, o primeiro passo de garantir o desempenho ideal está em escolher a arquitetura correta para o tipo de aplicação que estás a construir:

- Consulte a [Maneiras de Usar a Vue](/guide/extras/ways-of-using-vue) para veres como podes influenciar a Vue de maneiras diferentes.

- O programador Jason Miller discute os tipos de aplicações de web e suas respetivas implementações ou entregas ideais nos [Holótipos de Aplicação](https://jasonformat.com/application-holotypes/).

## Opções de Perfilamento {#profiling-options}

Para melhorar o desempenho, precisamos de primeiro saber como medi-lo. Existem um número de excelentes ferramentas que podem ajudar neste aspeto:

Para o perfilamento do desempenho do carregamento das implementações de produção:

- [Entendimentos da PageSpeed](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Para perfilamento do desempenho durante o desenvolvimento local:

- [Painel de Desempenho das Ferramentas de Programação do Chrome](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application.html#app-config-performance) ativa marcadores de desempenho específicas da Vue na linha do tempo do desempenho das Ferramentas de Programação do Chrome.
- [Extensão de Ferramentas de Programação de Vue](/guide/scaling-up/tooling#browser-devtools) também fornece uma funcionalidade de perfilamento do desempenho.

## Otimizações do Carregamento da Página {#page-load-optimizations}

Existem muitas aspetos agnósticos de abstração para otimização do desempenho do carregamento da página - consulte [este guia da web.dev](https://web.dev/fast/) para um arredondamento para cima compreensivo. Nesta seção, iremos primeiramente concentrar-nos nas técnicas que são específicas para Vue.

### Escolhendo a Arquitetura Correta {#choosing-the-right-architecture}

Se o teu caso de uso for sensível ao desempenho do carregamento da página, evite entregá-lo como uma Aplicação de Página Única (SPA) pura no lado do cliente. Tu queres que o teu servidor esteja enviando diretamente o HTML contendo o conteúdo que os utilizadores querem ver. A apresentação pura do lado do cliente sofre de lentidão de tempo para o conteúdo. Isto pode ser mitigado com a [Interpretação no Lado do Servidor (SSR, sigle em Inglês)](/guide/extras/ways-of-using-vue#fullstack-ssr) ou [Geração de Página Estática](/guide/extras/ways-of-using-vue#jamstack-ssg). Consulte o [Guia de SSR](/guide/scaling-up/ssr) para aprender a respeito de como realizar a Interpretação no Lado do Servidor com a Vue. Se a tua aplicação não tiver requisitos ricos de interatividade, também podes usar um servidor de backend tradicional para produzir o HTML e melhorá-lo com a Vue no cliente.

Se a tua aplicação principal tiver que ser uma Aplicação de Página Única, mas tem páginas de publicidade (chegada (landing, em Inglês), sobre, blogue), entregue-as separadamente! A tuas páginas de publicidade devem idealmente ser implementadas em produção como HTML estático com o mínimo de JavaScript, usando Geração de Página Estática (SSG).

### Tamanho do Pacote e Sacudidura de Árvore {#bundle-size-and-tree-shaking}

Uma das maneiras mais efetivas de melhorar o desempenho do carregamento da página é entregando pacotes de JavaScript mais pequenos. Listamos abaixo algumas maneiras de reduzir o tamanho do pacote quando estiveres a usar a Vue:

- Utilize uma etapa de construção se possível

  - Muitas das APIs da Vue são ["passíveis de sacudidura"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) se empacotadas através de uma ferramenta de construção moderna. Por exemplo, se não usas o componente embutido `<Transition>`, não será incluído no pacote de produção final. A sacudidura de árvore também pode remover outros módulos que não são usados no teu código-fonte.

  - Quando estiveres a usar uma etapa de construção, os modelos de marcação são pré-compilados assim não precisamos de entregar o compilador da Vue para o navegador. Isto economiza **14kb** de JavaScript gzipado minificado e evita o custo de compilação de tempo de execução.

- Seja prudente quanto o tamanho quando estiveres introduzindo novas dependências! Em aplicações do mundo real, os pacotes inchados são mais frequentemente um resultado da introdução de dependências pesadas sem aperceber-se dele:

  - Se estiveres a usar uma etapa de construção, prefira dependências que oferecem formatos de módulos de ECMAScript e são amigáveis a sacudidura de árvore. Por exemplo, prefira `lodash-es` acima do `lodash`.

  - Consulte o tamanho de uma dependência e avaliar se a funcionalidade que fornece é digna. Nota se a dependência é amigável a sacudidura de árvore, o aumento do tamanho real dependerá das APIs que realmente estiveres a importar a partir dela. Ferramentas como [bundlejs.com](https://bundlejs.com/) podem ser usadas para verificações rápidas, mas medir com a tua configuração de construção real sempre será o mais preciso.

- Se estiveres a usar a Vue primariamente para otimização progressiva e preferes evitar uma etapa de construção, considere então usar a [petite-vue](https://github.com/vuejs/petite-vue) (apenas **6kb**).

### Separação de Código {#code-splitting}

A separação de código é onde uma ferramenta de construção separa o pacote da aplicação em vários pedaços mais pequenos, os quais podem então ser carregados sobre demanda ou em simultâneo. Com a separação de código apropriada, as funcionalidades exigidas no carregamento da página podem ser descarregados imediatamente, com pedaços adicionais sendo carregados preguiçosamente apenas quando necessário, assim melhorando o desempenho.

Os empacotadores como o Rollup (que é sobre o qual a Vite é baseada) ou Webpack podem criar automaticamente pedaços separados detetando a sintaxe de importação dinâmica de Módulo de ECMAScript:

```js
// lazy.js e suas dependências serão separadas em um pedaço separado
// e apenas carregadas quando `loadLazy()` for chamada.
function loadLazy() {
  return import('./lazy.js')
}
```

O carregamento preguiçoso é melhor usado em funcionalidades que não são imediatamente necessárias depois do carregamento da página. Em aplicações de Vue, isto pode ser usado em conjunto com a funcionalidade de [Componente Assíncrono](/guide/components/async) da Vue para criar pedaços separados para as árvores de componente:

```js
import { defineAsyncComponent } from 'vue'

// um pedaço separado é criado para `Foo.vue` e suas dependências.
// ele é apenas buscado sobre demanda quando o componente assíncrono for
// apresentado na página.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Para as aplicações usando a Vue Router, é fortemente recomendado usar o carregamento preguiçoso para os componentes da rota. A Vue Router tem suporte explícito para o carregamento preguiçoso, separado a partir de `defineAsyncComponent`. Consulte [Rotas de Carregamento Preguiçoso](https://router.vuejs.org/guide/advanced/lazy-loading) para mais detalhes.

## Atualizar Otimizações {#update-optimizations}

### Estabilidade de Propriedades {#props-stability}

Na Vue, um componente filho apenas atualiza quando pelo menos uma de suas propriedades recebidas tenha mudado. Considere o seguinte exemplo:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Dentro do componente `<ListItem>`, ele usa as suas propriedades`id` e `activeId` para determinar se ele é o item ativo atualmente. Embora isto funciona, o problema é que sempre que `activeId` mudar, **cada** `<ListItem>` na lista tem que atualizar!

Idealmente, apenas os itens cujos estados ativos mudados devem atualizar. Nós podemos alcançar isto movendo o cálculo de estado ativo para o pai, e fazer o `<ListItem>` aceitar diretamente uma propriedade `active`:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Agora, para a maior parte dos componentes a propriedade `active` continuarão a mesma quando `activeId` mudar, assim eles já não precisam de atualizar. No geral, a ideia é manter as propriedades passadas para os componentes filhos o mais estável possível.

### `v-once` {#v-once}

`v-once` é uma diretiva embutida que pode ser usada para apresentar o conteúdo que depende de dados em tempo de execução mas nunca precisa de atualizar. A sub-árvore inteira sobre a qual é usado será ignorada para atualizações futuras. Consulte a [referência da sua API](/api/built-in-directives#v-once) para mais detalhes.

### `v-memo` {#v-memo}

`v-memo` é uma diretiva embutida que pode ser usada para ignorar condicionalmente a atualização de sub-árvores grandes ou listas de `v-for`. Consulte a [referência da sua API](/api/built-in-directives#v-memo) para mais detalhes.

### Estabilidade Computada <sup class="vt-badge" data-text="3.4+" /> {#computed-stability}

Começando na 3.4, uma propriedade computada apenas acionará os efeitos quando seu valor computado tiver mudado a partir do valor anterior. Por exemplo, a seguinte `isEven` computada apenas aciona os efeitos se o valor retornado tiver mudado de `true` ao `false`, ou vice-versa:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// não acionará novos registos porque
// o valor computado continua `true`
count.value = 2
count.value = 4
```

Isto reduz acionamentos de efeito desnecessários, mas infelizmente não funciona se o computado cria um novo objeto sobre cada cálculo:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Uma vez que um novo objeto é criado toda vez, o novo valor é sempre tecnicamente diferente do valor antigo. Mesmo se a propriedade `isEven` permanecer a mesma, a Vue não será capaz de saber a menos que esta realize uma comparação profunda do valor antigo e do novo valor. Tal comparação poderia ser dispendiosa e provavelmente inútil.

Ao invés disto, podemos otimizar isto comparando manualmente o novo valor com o valor antigo, e condicionalmente retornar o valor antigo se sabermos que nada mudou:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Exemplo da Zona de Testes](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Nota que sempre devemos realizar a computação completa antes de comparar e retornar o valor antigo, para que as mesmas dependências possam ser colecionadas sobre toda execução.

## Otimizações Gerais {#general-optimizations}

> As seguintes dicas afetam tanto carregamento da página e a desempenho da atualização.

### Virtualizar Listas Grandes {#virtualize-large-lists}

Um dos problemas de desempenho mais comuns em todas aplicações de frontend é apresentação de listas grandes. Não importa o quão otimizada uma abstração seja, apresentar uma lista com milhares de itens **será** lento por causa do número enorme de nós do DOM que o navegador precisa manipular.

No entanto, não temos de necessariamente apresentar todos estes nós adiantado. Na maioria dos casos, o tamanho da tela do utilizador pode apresentar apenas um subconjunto pequeno da nossa lista grande. Nós podes melhorar grandemente o desempenho com a **virtualização da lista**, a técnica de apenas apresentar os itens que estão atualmente em ou próximos à janela de exibição em uma lista grande.

Implementar a virtualização de lista não é fácil, felizmente existem bibliotecas da comunidade existentes que podes usar diretamente:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Reduzir as Despesas Gerais de Reatividade para as Grandes Estruturas Imutáveis {#reduce-reactivity-overhead-for-large-immutable-structures}

O sistema de reatividade da Vue é profundo por padrão. Enquanto isto torna a gestão de estado intuitiva, cria um certo nível de despesas gerais quando o tamanho dos dados é grande, porque cada acesso de propriedade aciona armadilhas de delegação que realizam o rastreamento de dependência. Isto normalmente torna-se evidente quando lidamos com grandes arranjos de objetos profundamente encaixados, onde uma única apresentação precisa acessar mais de 100.000 propriedades, assim ele deve apenas afetar casos de uso muito específicos.

A Vue fornece uma escotilha de saída para abandonar a reatividade profunda usando a [`shallowRef()`](/api/reactivity-advanced#shallowref) e a [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). As APIs Superficiais (Shallow, em Inglês) criam o estado que é reativo apenas no nível da raiz, e expõem todos os objetos encaixados intocados. Isto mantém o acesso de propriedade encaixada rápido, com o compromisso sendo que agora devemos tratar todos os objetos encaixados como imutáveis, e as atualizações apenas podem ser acionadas substituindo o estado de raiz:

```js
const shallowArray = shallowRef([
  /* lista grande de objetos profundos */
])

// isto não acionará atualizações...
shallowArray.value.push(newObject)
// isto faz:
shallowArray.value = [...shallowArray.value, newObject]

// isto não acionará atualizações...
shallowArray.value[0].foo = 1
// isto faz:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Evitar Abstrações Desnecessárias de Componente {#avoid-unnecessary-component-abstractions}

Algumas vezes podemos criar [componentes sem apresentação](/guide/components/slots#renderless-components) ou componentes de ordem superior (por exemplo, componentes que apresentam outros componentes com propriedades adicionais) para melhor abstração ou organização do código. Embora não haja nada de errado com isto, lembra-te de que as instâncias de componente são mais dispendiosas do que nós simples do DOM, e criar muitos deles por causa de padrões de abstração incorrerá em custos de desempenho.

Nota que reduzir apenas algumas instâncias não terá efeito evidente, então não te preocupes se o componente for apresentado apenas algumas vezes na aplicação. O melhor cenário para considerar esta otimização é novamente listas grandes. Suponha uma lista de 100 itens onde cada componente de item contém muitos componentes filhos. Remover uma abstração desnecessária de componente aqui poderia resultar em uma redução de centenas de instâncias de componente.
