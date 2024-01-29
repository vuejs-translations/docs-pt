# Funções de Composição {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip DICA
Esta seção presume conhecimento básico da API de Composição. Se estivermos a aprender a Vue com a API de Opções apenas, podemos definir a Preferência de API para API de Composição (usando o interruptor em cima do menu lateral) e reler os capítulos [Fundamentos de Reatividade](/guide/essentials/reactivity-fundamentals) e [Gatilhos do Ciclo de Vida](/guide/essentials/lifecycle).
:::

## O Que é uma "Função de Composição"? {#what-is-a-composable}

No contexto das aplicações de Vue, uma "função de composição" é uma função que influencia a API de Composição da Vue a resumir e reutilizar **lógica com estado**.

Quando estamos a construir aplicações de frontend, frequentemente precisamos reutilizar a lógica para tarefas comuns. Por exemplo, podemos precisar formatar datas em muitos lugares, assim extraímos uma função reutilizável para isto. Esta função formatadora resume a **lógica sem estado**: ela recebe alguma entrada e imediatamente retorna a saída esperada. Existem muitas bibliotecas por aí a fora para reutilização de lógica sem estado - por exemplo [`lodash`](https://lodash.com/) e [`date-fns`](https://date-fns.org/), as quais já podes ter ouvido falar.

Em contrapartida, a lógica com estado envolve a gestão de estado que muda ao longo do tempo. Um exemplo simples seria o rastreio da posição atual do rato em uma página. Nos cenários do mundo real, poderia ser também lógica mais complexa tal como gestos de toque ou estado da conexão com uma base de dados.

## Exemplo de Rastreador de Rato {#mouse-tracker-example}

Se fossemos implementar a funcionalidade de rastreio de rato utilizando a API de Composição diretamente de dentro de um componente, ela se pareceria com isto:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Mas e se quisermos reutilizar a mesma lógica em vários componentes? Nós podemos extrair a lógica em um ficheiro externo, como uma função de composição:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// por convenção, os nomes da função de composição começa com "use"
export function useMouse() {
  // estado resumido e gerido pela função de composição
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  // uma função de composição pode atualizar o seu estado gerido ao longo do tempo.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // uma função de composição também pode prender-se no ciclo de vida do seu
  // componente proprietário para configurar e deitar abaixo os
  // efeitos colaterais
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expor o estado gerido como valor de retorno
  return { x, y }
}
```

E isto é como pode ser utilizada nos componentes:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Conforme podemos ver, a lógica fundamental permanece idêntica - tudo o que tivemos que fazer foi movê-la para uma função externa e retornar o estado que deveria ser exposto. Tal como dentro de um componente, podes utilizar uma grama completa de [funções de API de Composição](/api/#composition-api) nas funções de composição. A mesma funcionalidade de `useMouse()` pode agora ser utilizada em qualquer componente.

Mesmo assim a parte mais fantástica das funções de composição, é que podes também encaixá-las: uma função de composição pode chamar uma ou mais outras funções funções de composição. Isto permite-nos compor lógica complexa utilizando pequenas unidades isoladas, semelhante a como compomos uma aplicação inteira utilizando componentes. De fato, é por isto que decidimos chamar a coleção de APIs que torna este padrão possível de API de Composição.

Por exemplo, podemos extrair a lógica de adição e remoção dum ouvinte de evento de DOM para a sua própria função de composição:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // se quiseres, podes também fazer isto suportar
  // sequências de caracteres de seletor como alvo
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

E agora a nossa função de composição `useMouse()` pode ser simplificada para:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip DICA
Cada instância de componente chamando `useMouse()` criará as suas próprias cópias do estado `x` e `y` então elas não interferirão umas com as outras. Se quiseres lidar com o estado partilhado entre os componentes, leia o capítulo [Gestão de Estado](/guide/scaling-up/state-management).
:::

## Exemplo de Estado Assíncrono {#async-state-example}

A função de composição `useMouse()` não recebe quaisquer argumentos, então vamos dar uma vista de olhos em um outro exemplo que utiliza um argumento. Quando estamos a fazer requisição de dados assíncronos, frequentemente precisamos manipular estados diferentes: carregamento, sucesso e erro:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

Seria entediante ter de repetir este padrão em todo componente que precisar requisitar dados. Vamos extraí-lo para uma função de composição:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Agora no nosso componente podes apenas fazer:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Aceitando Estado Reativo {#accepting-reactive-state}

A `useFetch()` recebe uma sequência de caracteres de URL estática como entrada - depois realiza a requisição apenas uma vez e depois está feito. E se quiséssemos requisitar novamente sempre que a URL mudar? No sentido de alcançar isto, precisamos de passar o estado reativo numa função de composição, e deixar a função de composição criar os observadores que realizam ações usando o estado passado.

Por exemplo, `useFetch()` deve ser capaz de aceitar uma referência:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// isto deve acionar novamente uma requisição
url.value = '/new-url'
```

Ou, aceitar uma função recuperadora:

```js
// requisitar novamente quando `props.id` mudar
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Nós podemos refazer a nossa implementação existente com as APIs [`watchEffect()`](/api/reactivity-core.html#watcheffect) e [`toValue()`](/api/reactivity-utilities.html#tovalue)

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = (dt) => {
    fetch(toValue(url))
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = error))
  }

  watchEffect(() => {
    // reiniciar o estado antes de requisitar
    fetchData(url)
  })

  return { data, error }
}
```

`toValue()` é uma API adicionada na 3.3. Está desenhada para normalizar referências e recuperadores para valores. Se o argumento for uma referência, retorna o valor da referência; se o argumento for uma função, chamará a função e retornará o seu valor de retorno. De outro modo, retorna o argumento como está. Funciona de maneira semelhante ao [`unref()`](/api/reactivity-utilities#unref), mas com tratamento especial para funções.

Repara que a `toValue(url)` é chamada **dentro** da função de resposta da `watchEffect`. Isto garante que quaisquer dependências reativas acessadas durante a normalização da `toValue()` sejam rastreadas pelo observador.

Esta versão da `useFetch()` agora aceita sequências de caracteres de URL estáticas, referências, e recuperadores, tornando-a mais flexível. O efeito de observação executará imediatamente, e rastreará quaisquer dependências acessadas durante a `toValue(url)`. Se nenhum dependência for rastreada (por exemplo, a URL já é uma sequência de caracteres), o efeito apenas executa uma vez; de outro modo, executará novamente sempre que uma dependência rastreada mudar.

Eis [a versão atualizada de `useFetch()`](https://play.vuejs.org/#eNptVMFu2zAM/RXOFztYZncodgmSYAPWnTZsKLadfFFsulHrSIZEJwuC/PtIyXaTtkALxxT5yPf45FPypevyfY/JIln6yumOwCP13bo0etdZR3ACh80cKrvresIaztA4u4OUi9KLpN7jN6RqO53nxRjKHz1nlqayxhNslMc/roUVpFuizi+K4tFb07Wqwq1ta3Q5HTtd2RpzblqQra0vGCCW65oreaIs/ZjOxmAf8MYRs2wGq/XU6D3X5HvV9sj5Y8UJakVqDuicdXMGJHfk0VcTj4wxOX9ZRFVYD34h3PGchPwG8N2qGjobZlpIYLnpiayB/YfGulWZaNAGPpUJfK5aXT1JRIbXZbI+nUDD+bwsYklAL2lZ6z1X64ZTw2CcKcAM3a1/2s6/gzsJAzKL3hA6rBfAWCE536H36gEDriwwFA4zTSMEpox7L8+L/pxacPv4K86Brcc4jGjFNV/5AS3TlrbLzqHwkLPYkt/fxFiLUto85Hk+ni+LScpknlwYhX147buD4oO7psGK5kD2r+zxhQdLg/9CSdObijSzvVoinGSeuPYwbPSP6VtZ8HgSJHx5JP8XA2TKH00F0V4BFaAouISvDHhiNrBB3j1CI90D5ZglfaMHuYXAx3Dc2+v4JbRt9wi0xWDymCpTbJ01tvftEbwFTakHcqp64guqPKgJoMYOTc1+OcLmeMUlEBzZM3ZUdjVqPPj/eRq5IAPngKwc6UZXWrXcpFVH4GmVqXkt0boiHwGog9IEpHdo+6GphBmgN6L1DA66beUC9s4EnhwdeOomMlMSkwsytLac5g7aR11ibkDZSLUABRk+aD8QoMiS1WSCcaKwISEZ2MqXIaBfLSpmchUb05pRsTNUIiNkOFjr9SZxyJTHOXx1YGR49eGRDP4rzRt6lmay86Re7DcgGTzAL74GrEOWDUaRL9kjb/fSoWzO3wPAlXNB9M1+KNrmcXF8uoab/PaCljQLwCN5oS93+jpFWmYyT/g8Zel9NEJ4S2fPpYMsc7i9uQlREeecnP8DWEwr0Q==), com um atraso artificial e erro posto aleatório para propósitos de demonstração.

## Convenções e Boas Práticas {#conventions-and-best-practices}

### Nomeação {#naming}

É uma convenção nomear as funções funções de composição com nomes em "camelCase" que começam com o termo "use".

### Argumentos de Entrada {#input-arguments}

Uma função de composição pode aceitar argumentos de referência mesmo se não depender delas para a reatividade. Se estiveres a escrever uma função de composição que pode ser utilizada por outros programadores, é uma boa ideia lidar com o caso de os argumentos de entrada serem referências no lugar de valores brutos. A função utilitária [`unref()`](/api/reactivity-utilities#unref) dará jeito para este propósito:

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // se "maybeRef" for de fato uma referência, seu ".value"
  // será retornado, de outro modo, "maybeRef" é retornada como está
  const value = unref(maybeRef)
}
```

Se a tua função de composição produzir efeitos reativos quando a entrada é uma referência, certifica-te de ou explicitamente observar a referência com `watch()`, ou chamar `unref()` dentro de uma `watchEffect()` para que seja apropriadamente rastreada.

### Valores de Retorno {#return-values}

Tu tens provavelmente reparado que tens estado exclusivamente utilizando `ref()` ao invés de `reactive()` nas funções de composição. A convenção recomendada é para os funções de composição sempre retornar um objeto não reativo simples contendo várias referências. Isto permite que seja desestruturada nos componentes enquanto preserva a reatividade:

```js
// "x" e "y" são referências
const { x, y } = useMouse()
```

O retorno de um objeto reativo de uma função de composição causará que tais desestruturações percam a conexão de reatividade com o estado dentro da função de composição, enquanto as referências preservarão esta conexão.

Se preferires usar o estado retornado dos funções de composição como propriedades de objeto, podes envolver o objeto retornado com `reactive()` para que as referências sejam desembrulhadas. Por exemplo:

```js
const mouse = reactive(useMouse())
// "mouse.x" está ligado a referência original
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Efeitos Colaterais {#side-effects}

É aceitável realizar efeitos colaterais (por exemplo, adicionando ouvintes de evento de DOM ou requisitando dados) nas funções de composição, porém preste atenção as seguintes regras:

- Se estiveres a trabalhar sobre uma aplicação que usa a [Interpretação no Lado do Servidor](/guide/scaling-up/ssr) (SSR, sigla em Inglês), certifica-te de realizar os efeitos colaterais específicos de DOM nos gatilhos de ciclo de vida de pós-montagem, por exemplo, `onMounted()`. Estes gatilhos são apenas chamados no navegador, assim podes estar certo de que o código dentro deles tem acesso ao DOM.

- Lembra-te de limpar os efeitos colaterais no `onUnmounted()`. Por exemplo, se uma função de composição definir um ouvinte de evento de DOM, ele deve remover este ouvinte no `onUnmounted()` conforme temos visto no exemplo `useMouse()`. Pode ser uma boa ideia usar uma função de composição que automaticamente faz isto por ti, como exemplo da `useEventListener()`.

### Restrições de Uso {#usage-restrictions}

As funções de composição devem apenas ser chamadas de maneira **síncrona** no `<script setup>` ou no gatilho `setup()`. Em alguns casos, podes também chamá-las nos gatilhos de ciclo de vida tais como `onMounted()`.

Existem os contextos onde a Vue é capaz de determinar a atual instância de componente ativo. Para ter acesso à uma instância de componente ativa é necessária para que:

1. Os gatilhos de ciclo de vida possam ser registadas a ela.

2. As propriedades computadas e observadores possam ser ligados a ela, para que elas possam ser colocadas quando a instância for desmontada para evitar fugas de memória.

:::tip DICA
O `<script setup>` é o único lugar onde podes chamar as funções de composição **depois** do uso de `await`. O compilador restaura automaticamente o contexto da instância ativa por ti depois da operação assíncrona.
:::

## Extraindo Funções de Composição para Organização de Código {#extracting-composables-for-code-organization}

As funções de composição podem ser extraídas não apenas para reaproveitar, mas também para a organização de código. A medida que a complexidade dos teus componentes crescer, podes acabar com componentes que são muito grandes para navegar e compreender. A API de Composição dá-te completa flexibilidade para organizar o código do teu componente em funções mais pequenas baseadas nas preocupações lógicas:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Até certo ponto, podes pensar destas funções de composição extraídas como serviços isolados de componente que podem conversar uns com os outros.

## Usando Funções de Composição na API de Opções {#using-composables-in-options-api}

Se estiveres usando a API de Opções, as funções de composição devem ser chamadas dentro de `setup()`, e as vinculações retornadas dem ser retornadas a partir de `setup()` para que elas sejam expostas ao `this` e para o modelo de marcação:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // As propriedades expostas de "setup()" podem ser acessadas no ``this
    console.log(this.x)
  }
  // ...outras opções
}
```

## Comparações com Outras Técnicas {#comparisons-with-other-techniques}

### vs. Misturas (Mixins) {#vs-mixins}

Os utilizadores chegando da Vue 2 podem estar familiarizados com a opção [mixins](/api/options-composition#mixins), que também permite-nos extrair a lógica do componente em unidades reutilizáveis. Existem três desvantagens primarias em relação ao mixins:

1. **Fonte obscura de propriedades**: quando estiver utilizando muitos mixins, torna-se pouco claro qual propriedade de instância é injetada por qual mixin, tornando-o difícil localizar a implementação e entender o comportamento do componente. É também o do porquê que nós recomendamos a utilização do padrão de referências + desestruturação para as funções de composição: isto torna a fonte da propriedade clara nos componentes consumindo.

2. **Colisão de nome de espaço**: vários mixins de diferentes autores podem potencialmente registar a mesmas chaves de propriedade, causando colisões de nome de espaço. Com as funções de composição, podes renomear os valores desestruturados se houverem chaves conflituosas de diferentes funções de composição. 

3. **Comunicação cruzada de mixin implícita**: vários mixins que precisam interagir uns com os outros têm de depender de chaves de propriedade partilhas, tornando-os implicitamente associados. Com as funções de composição, os valores retornados de uma função de composição podem ser passados para uma outra como argumentos, tal como as funções normais.

Pelas razões acima, não mais recomendamos a utilização de mixins na Vue 3. A funcionalidade é mantida apenas por razões de migração e familiaridade.

### vs. Componentes Sem Interpretação {#vs-renderless-components}

No capítulo de ranhuras de componente, discutimos o padrão de [Componente Sem Interpretação](/guide/components/slots#renderless-components) baseado nas ranhuras isoladas. Nós até implementamos a mesma demonstração de rastreio de rato usando os componentes sem interpretação.

A principal vantagem das funções de composição sobre os componentes sem interpretação é que as funções de composição não incorrem em despesas gerais da instância de componente adicional. Quando utilizadas por uma aplicação inteira, a quantidade de instâncias de componente adicionais criadas pelo padrão de componente sem interpretação pode tornar-se em despesas gerais de desempenho visível.

A recomendação é usar as funções de composição quando reutilizar a lógica pura, e usar os componentes quando estiveres reutilizando tanto a lógica e o esquema visual.

### vs. Gatilhos de React (React Hooks) {#vs-react-hooks}

Se tens experiência com a React, talvez notes que isto parece muito semelhante aos gatilhos de React personalizados. A API de Composição foi em parte inspirada pelos gatilhos de React, e as funções de composição de Vue são de fato semelhantes aos gatilhos de React em termos de capacidades de composição lógica. No entanto, as funções de composição de Vue são baseadas no sistema de reatividade refinado da Vue, o qual é fundamentalmente diferente do modelo de execução dos gatilhos de React. Isto é discutido em mais detalhes nas [Perguntas Frequentes sobre API de Composição](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Leituras Adicionais {#further-reading}

- [Reatividade Em Profundidade](/guide/extras/reactivity-in-depth): para um entendimento de baixo nível de como o sistema de reatividade da Vue funciona.
- [Gestão de Estado](/guide/scaling-up/state-management): para padrões de gerência de estado partilhado por vários componentes.
- [Testagem de Funções de Composição](/guide/scaling-up/testing#testing-composables): dicas sobre teste unitário de funções de composição.
- [VueUse](https://vueuse.org/): Um coleção que sempre cresce de funções de composição de Vue. O código-fonte é também um grande recurso de aprendizado.
