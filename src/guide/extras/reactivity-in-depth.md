---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Reatividade em Profundidade {#reactivity-in-depth}

Uma das funcionalidades mais distintas da Vue é o sistema de reatividade discreto. O estado do componente consiste de objetos de JavaScript reativos. Quando os modificas, a visão atualiza. Isto torna a gestão de estado simples e intuitiva, mas também é importante entender como isto funciona para evitar algumas surpresas nada agradáveis. Nesta seção, escavaremos alguns dos detalhes de baixo nível do sistema de reatividade da Vue.

## O Que é Reatividade? {#what-is-reactivity}

Este termo surge bastante na programação estes dias, mas o que as pessoas querem dizer quando dizem isto? Reatividade é um paradigma de programação que permite-nos ajustar às mudanças duma maneira declarativa. O exemplo canónico que as pessoas normalmente mostram, uma vez que é um excelente exemplo, é uma folha de cálculo de Excel:

<SpreadSheet />

Neste exemplo a célula A2 é definida através duma fórmula de `= A0 + A1` (podes clicar na A2 para inspecionar ou editar a fórmula), assim a folha de cálculo dá-nos 3. Nenhum surpresa lá. Mas se atualizares a `A0` ou `A1`, notarás que a `A2` também atualiza-se automaticamente.

A JavaScript normalmente não funciona desta maneira. Se fossemos escrever algo comparável em JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Continua 3
```

Quando mudamos `A0`, `A2` não muda automaticamente.

Então como faríamos isto em JavaScript? Primeiro, para re-executar o código que atualiza `A2`, vamos envolvê-lo numa função:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Depois, precisamos definir alguns termos:

- A função `update()` produz um **efeito colateral**, ou **efeito** para abreviar, porque modifica o estado do programa.

- `A0` e `A1` são considerados **dependências** do efeito, visto que os seus valores são usados para realizar o efeito. O efeito é dito ser um **subscritor** para as suas dependências.

O que precisamos é duma função mágica que pode invocar `update()` (o **efeito**) sempre `A0` ou `A1` (as **dependências**) mudarem:

```js
whenDepsChange(update)
```

Esta função `whenDepsChange()` tem as seguintes tarefas:

1. Rastrear quando uma variável é lida. Por exemplo, quando avalia a expressão `A0 + A1`, ambas `A0` e `A1` são lidas.

2. Se uma variável é lida quando existir um efeito atualmente em execução, fazer deste efeito um subscritor para esta variável. Por exemplo, porque `A0` e `A1` são lidas quando `update()` estiver sendo executada, `update()` torna-se uma subscritora para ambos `A0` e `A1` depois da primeira chamada.

3. Detetar quando uma variável é mudada. Por exemplo, quando `A0` for atribuída um novo valor, notifica todos os seus efeitos de subscritor para re-executar.

## Como a Reatividade Funciona na Vue? {#how-reactivity-works-in-vue}

Nós não podemos na realidade rastrear a leitura e escrita de variáveis locais como no exemplo. Só não existe nenhum mecanismo para fazer isto em JavaScript puro. Mesmo assim o que **podemos** fazer, é intercetar a leitura e escrita de **propriedades de objeto**

Existem duas maneiras de intercetar o acesso de propriedade na JavaScript: [recuperadores](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [definidores](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) e [delegações](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). A Vue 2 usava exclusivamente recuperadores / definidores devido as limitações de suporte do navegador. Na Vue 3, as delegações são usadas para objetos reativos e recuperadores / definidores são usados para referências. No seguinte bloco de código temos algum pseudo-código que ilustra como funcionam:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Os trechos de código mostrados são destinados à explicar os conceitos fundamentais da forma mais simples possível, então muitos detalhes são omitidos, e os casos extremos ignorados.
:::

Isto explica um pouco as [limitações dos objetos reativos](/guide/essentials/reactivity-fundamentals#limitations-of-reactive) que discutimos na seção de fundamentos:

- Quando atribuis ou desestruturas uma propriedade dum objeto reativo para uma variável local, a reatividade é "desconectada" porque o acesso à variável local já não aciona as armadilhas da delegação de recuperação ou definição.

- A delegação retornada a partir da `reactive()`, embora comportando-se tal como a original, tem uma identidade diferente se a compararmos com a original usando o operador `===`.

Dentro de `track()`, verificamos se existe um efeito em execução atualmente. Se existir um, nós procuramos os efeitos do subscritor (armazenado num conjunto) para a propriedade ser rastreada, e adicionamos o efeito ao conjunto:

```js
// Isto será definido exatamente antes dum efeito ser executado.
// Lidaremos com isto depois.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

As subscrições do efeito são armazenadas numa estrutura de dados `WeakMap<target, Map<key, Set<effect>>>` global. Se nenhum conjunto de efeitos de subscrição foi encontrado para uma propriedade (rastreada pela primeira vez), será criado. Isto é o que a função `getSubscribersForProperty()` faz, em resumo. Por simplicidade, pularemos os seus detalhes.

Dentro de `trigger()`, novamente procuraremos os feitos do subscritor para a propriedade. Mas desta vez os invocamos:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Agora vamos voltar atrás para a função `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Ela envolve a função `update` pura num efeito que define a si mesmo como o atual efeito ativo antes de executar a atualização de fato. Isto permite `track()` chamar durante a atualização para localizar o atual efeito ativo.

Neste ponto, criamos um efeito que rastreia automaticamente suas dependências, e re-executa sempre que uma dependência mudar. Nós chamamos isto um **Efeito Reativo**.

A Vue fornece uma API que permite-nos criar efeitos reativos: [`watchEffect()`](/api/reactivity-core#watcheffect). De fato, podes ter notado que funciona de maneira muito semelhante à `whenDepsChange()` mágica no exemplo. Nós podemos agora retrabalhar o exemplo original usando as verdadeiras APIs da Vue:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // rastreia A0 e A1
  A2.value = A0.value + A1.value
})

// aciona o efeito
A0.value = 2
```

Usar um efeito reativo para mudar uma referência não é o caso de uso mais interessante - de fato, usar uma propriedade computada a torna mais declarativa:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Internamente, `computed` gere sua invalidação e re-calculo usando um efeito reativo.

E o que é um exemplo dum efeito reativo comum e útil? Bem, atualizar o DOM! Nós podemos implementar uma "interpretação reativa" simples como esta:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `count is: ${count.value}`
})

// atualiza o DOM
count.value++
```

De fato, isto é muito próximo de como um componente da Vue mantém o estado e o DOM em sincronia - cada instância de componente cria um efeito reativo para gerar e atualizar o DOM. Claro, os componentes da Vue usam maneiras muito mais eficientes para atualizar o DOM do que `innerHTML`. Isto é discutido no [Mecanismo de Interpretação](./rendering-mechanism).

<div class="options-api">

As APIs `ref()`, `computed()`, e `watchEffect()` são todas parte da API de Composição. Se apenas tens estado a usar a API de Opções com a Vue até aqui, notarás que API de Composição é mais próxima de como o sistema de reatividade da Vue funciona nos bastidores. De fato, na Vue 3 a API de Opções é implementada em cima da API de Composição. Todo acesso de propriedade na instância do componente (`this`) aciona os recuperadores / definidores para o rastreio da reatividade, e opções como `watch` e `computed` invocam suas equivalentes de API de Composição internamente.

</div>

## Reatividade de Tempo de Execução vs. de Tempo de Compilação {#runtime-vs-compile-time-reactivity}

O sistema de reatividade da Vue é essencialmente baseado em tempo de execução: o rastreio e acionamento são todos realizados enquanto o código está em execução diretamente no navegador. Os pós da reatividade de tempo de execução são que pode trabalhar sem uma etapa de construção, e existem muito poucos casos extremos. Por outro lado, isto torna-o restrito pelas limitações de sintaxe da JavaScript, conduzindo à necessidade de contentores de valor como referências de Vue.

Algumas abstrações, tais como a [Svelte](https://svelte.dev/), escolheram superar tais limitações implementando a reatividade durante a compilação. Ela analisa e transforma o código para simular reatividade. A etapa de compilação permite a abstração alterar as semânticas da própria JavaScript - por exemplo, injetar implicitamente código que realiza analises de dependência e acionamento de efeito em torno do acesso às variáveis definidas localmente. A desvantagem é que tais transformações exigem uma etapa de construção, e alterar as semânticas da JavaScript é essencialmente criar uma linguagem que parece-se com a JavaScript mas compila para outro coisa.

A equipa da Vue explorou esta direção através duma funcionalidade experimental chamada [Transformação de Reatividade](/guide/extras/reactivity-transform), mas no final decidimos que não seria muito atraente para o projeto devido à este [raciocínio](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Depuração da Reatividade {#reactivity-debugging}

É excelente que o sistema de reatividade da Vue rastreia automaticamente as dependências, mas em alguns casos podemos querer compreender exatamente o que está sendo rastreado, ou que está causando um componente para redesenhar.

### Gatilhos da Depuração do Componente {#component-debugging-hooks}

Nós podemos depurar quais dependências são usadas durante a interpretação dum componente e qual dependência está acionar uma atualização usando os gatilhos do ciclo de vida <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> e <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Ambos gatilhos receberão um evento depurador que contém informação sobre a dependência em questão. É recomendado colocar uma declaração `debugger` nas funções de resposta para inspecionar interativamente a dependência:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Os gatilhos de depuração do componente apenas funcionam no modo de desenvolvimento.
:::

Os objetos do evento de depuração tem o seguinte tipo:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Depuração Computada {#computed-debugging}

<!-- TODO options API equivalent -->

Nós podemos depurar propriedades computadas passando a `computed()` um segundo objeto de opções com as funções de resposta `onTrack` e `onTrigger`:

- `onTrack` será chamada quando uma propriedade reativa ou referência é rastreada como uma dependência.
- `onTrigger` será chamada quando a função de resposta observadora for acionada pela mutação duma dependência.

Ambas funções de resposta receberão eventos depuradores no [mesmo formato](#debugger-event) como gatilhos de depuração do componente:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // acionada quando `count.value` for rastreado como uma dependência
    debugger
  },
  onTrigger(e) {
    // acionada quando `count.value` for mudada
    debugger
  }
})

// acesso ao `plusOne`, deve acionar `onTrack`
console.log(plusOne.value)

// mutação de `count.value`, deve acionar `onTrigger`
count.value++
```

:::tip
As opções computadas `onTrack` e `onTrigger` apenas funcionam em modo de desenvolvimento.
:::

### Depuração do Observador {#watcher-debugging}

<!-- TODO options API equivalent -->

Semelhante a `computed()`, os observadores também suportam as opções `onTrack` e `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
As opções observadoras `onTrack` e `onTrigger` apenas funcionam em modo de desenvolvimento.
:::

## Integração com Sistemas de Estado Externos {#integration-with-external-state-systems}

O sistema de reatividade da Vue funciona convertendo profundamente opções de JavaScript simples em delegações reativas. A conversão profunda pode ser desnecessária ou algumas vezes indesejada quando integramos com sistemas de gestão de estado externos (por exemplo, se uma solução externa também usa delegações).

A ideia geral de integrar o sistema de reatividade da Vue com uma solução de gestão estado externa é segurar o estado externo numa [`shallowRef`](/api/reactivity-advanced#shallowref). Uma referência superficial é apenas reativa quando a sua propriedade `.value` for acessada - o valor interno é deixado intacto. Quando o estado externo muda, substitui o valor da referência para acionar atualizações.

### Dado Imutável {#immutable-data}

Se estiveres a implementar uma funcionalidade de desfazer / refazer, provavelmente queres tirar uma fotografia do estado da aplicação sobre cada edição do utilizador. No entanto, o sistema de reatividade mutável da Vue não é o mais adequado para isto se a árvore de estado for grande, porque seriar o objeto de estado inteiro em cada atualização pode ser dispendioso em termos de ambos custos de CPU e memória.

As [estruturas de dados imutáveis](https://en.wikipedia.org/wiki/Persistent_data_structure) resolvem isto nunca mudando os objetos de estado - ao invés disto, cria novos objetos que partilham as mesmas, partes não modificadas com aquelas antigas. Existem diferentes maneiras de usar dados imutáveis na JavaScript, mas recomendamos usar [Immer](https://immerjs.github.io/immer/) com a Vue porque permite-te usar dados imutáveis enquanto mantém a sintaxe mais ergonómica e mutável.

Nós podemos integrar `immer` com a Vue através duma simples função de composição:

```js
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNplU8Fu2zAM/RXOlzpAYu82zEu67lhgpw3bJcrBs5VYqywJkpxmMPzvoyjZNRodbJF84iOppzH7ZkxxHXhWZXvXWGE8OO4H88iU6I22HkYYHH/ue25hgrPVPTwUpQh28dc9MAXAVKOV83AUnvduC4Npa8+fg3GCw3I8PwbwGD64vPCSV8Cy77y2Cn4PnGXbFGu1wpC36EPHRO67c78cD6fgVfgOiOB9gnMtXczA1GnDFFPnQTVeaAVeXy6SSsyFavltE/OvKs+pGTg8zsxkHwl9KgIBtvbhzkl0yIWU+zIOFEeJBgKNxORoAewHSX/cSQHX3VnbA8vyMXa3pfqxb0i1CRXZWZb6w1U1snYOT40JvQ4+NVI0Lxi865NliTisMRHChOVSNaUUscCSKtyXq7LRdP6fDNvYPw3G85vftbzRtg6TrUAKxXe+s3q4dF/mQdC5bJtFTe362qB4tELVURKWAthhNc87+OhSw2V33htXleWgzMulaHQfFfj0ufhYfCpb4XySJHc9Zv7a63aQqKh0+xNRR8kiZ1K2sYhqeBI1xVHPi+xdV0upX3/w8yJ8fCiIYIrfCLPIaZH4n9rxnx7nlQQVH4YLHpTLW8YV8A0W1Ye4PO7sZiU/ylFca4mSP8yl5yvv/O4sZcSmw8/iW8bXdSTcjDiFgUz/AcH6WZQ=)

### Maquinas de Estado {#state-machines}

A [Máquina de Estado](https://en.wikipedia.org/wiki/Finite-state_machine) é um modelo para descrever todos os possíveis estados em que uma aplicação pode estar, e todas as possíveis maneiras que pode transitar de um estado para um outro. Enquanto isto pode ser exagero para componentes simples, pode ajudar a tornar fluxos de estado complexo mais robustos e manejáveis.

Uma das implementações de máquina de estado mais popular em JavaScript é a [XState](https://xstate.js.org/). Neste exemplo mostramos uma função de composição que integra com ela:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

A [RxJS](https://rxjs.dev/) é uma biblioteca para trabalhar com fluxos de evento assíncronos. A biblioteca [VueUse](https://vueuse.org/) fornece a extensão [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) para conectar os fluxos da RxJS com o sistema de reatividade da Vue.

## Conexão com os Sinais {#connection-to-signals}

Muitas outras abstrações têm introduzido reatividade primitivas semelhante as referências da API de Composição da Vue, sob o termo "sinais":

- [Sinais de Solid](https://www.solidjs.com/docs/latest/api#createsignal)
- [Sinais de Angular](https://github.com/angular/angular/discussions/49090)
- [Sinais de Preact](https://preactjs.com/guide/v10/signals/)
- [Sinais de Qwik](https://qwik.builder.io/docs/components/state/#usesignal)

Fundamentalmente, sinais são o mesmo tipo de reatividade primitiva como as referências da Vue. É um contentor de valor que fornece rastreio de dependência sobre o acesso, e acionamento de efeito colateral sobre a mutação. Este paradigma baseado na reatividade primitiva não é particularmente um conceito novo no mundo do frontend: data para trás para implementações como [observáveis de Knockout](https://knockoutjs.com/documentation/observables.html) e [Rastreador de Meteor](https://docs.meteor.com/api/tracker.html) de mais de uma década atrás. A API de Opções da Vue e a biblioteca de gestão de estado da React [MobX](https://mobx.js.org/) também são baseadas sobre os mesmos princípios, mas escondem os primitivos atrás de propriedades de objeto.

Embora não uma característica necessária para algo qualificar como sinais, hoje o conceito é discutido com frequência ao lado do modelo de interpretação onde as atualizações são realizadas através de subscrições finamente ajustados. Devido ao uso do DOM Virtual, a Vue atualmente [depende de compiladores para alcançar otimizações semelhantes](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). No entanto, também estamos a explorar uma nova estratégia de compilação inspirada na Solid (Modo de Vapor) que não dependo do DOM Virtual e tira mais partido do sistema de reatividade embutido da Vue.

### Compromissos de Desenho da API {#api-design-trade-offs}

O desenho dos sinais da Preact e Qwik são muito semelhantes a [`shallowRef`](/api/reactivity-advanced#shallowref) da Vue: Todos os três fornecem uma interface mutável através da propriedade `.value`. Nós focaremos a discussão sobre os sinais de Solid e Angular.

#### Sinais de Solid {#solid-signals}

O desenho da API `createSignal()` da Solid enfatiza a segregação da leitura e escrita. Os sinais são expostos como um recuperador de apenas leitura e definidor separado:

```js
const [count, setCount] = createSignal(0)

count() // acessar o valor
setCount(1) // atualizar o valor
```

Repara como o sinal `count` pode ser passado sem o definidor. Isto garante qua o estado nunca pode ser mudado a menos que o definidor seja também explicitamente exposto. Se esta garantia de segurança justifica a sintaxe mais verbosa poderia estar sujeita ao requisito do gosto do projeto e pessoal - mas no caso de preferires este estilo de API, podes facilmente replicá-lo na Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Sinais de Angular {#angular-signals}

A Angular está a passar por algumas mudanças fundamentais renunciando a verificação suja e introduzindo sua própria implementação duma reatividade primitiva. A API de Sinal da Angular parece-se com isto:

```js
const count = signal(0)

count() // acessar o valor
count.set(1) // definir novo valor
count.update((v) => v + 1) // atualização baseada no valor anterior

// mudar objetos profundos com a mesma identidade
const state = signal({ count: 0 })
state.mutate((o) => {
  o.count++
})
```

Novamente, podemos facilmente replicar a API na Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  s.mutate = (mutator) => {
    mutator(r.value)
    triggerRef(r)
  }
  return s
}
```

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9UslOwzAQ/ZVRLiRQEsqxpBUIvoADp0goTd3U4DiWl4AU5d8ZL3E3iZtn5r1Z3vOYvAiRD4Ykq6RUjaRCgyLaiE3FaSd6qWEERVteswU0fSeMJjuYYC/7Dm7youatYbW895D8S91UvOJNz5VGuOEa1oGePmRzYdebLSNYmRumaQbrjSfg8xYeEVsWfh/cBANNOsFqTTACKA/LzavrTtUKxjEyp6kssDZj3vygAPJjL1Bbo3XP4blhtPleV4nrlBuxw1npYLca4A6WWZU4PADljSQd4drRC8//rxfKaW+f+ZJg4oJbFvG8ZJFcaYreHL041Iz1P+9kvwAtadsS6d7Rm1rB55VRaLAzhvy6NnvDG01x1WAN5VTTmn3UzJAMRrudd0pa++LEc9wRpRDlHZT5YGu2pOzhWHAJWxvnakxOHufFxqx/4MxzcEinIYP+eV5ntOe5Rx94IYjopxOZUhnIEr+4xPMrjuG1LPFftkTj5DNJGhwYBZ4BJz3DV56FmJLpD1DrKXU=)

Comparado as referências da Vue, o estilo de API baseado em recuperador da Solid e Angular fornece alguns compromissos interessantes quando usada nos componentes da Vue:

- `()` é ligeiramente menos verboso do que `.value`, mas a atualização do valor é mais verbosa.
- Não existe nenhum desembrulho de referência: acesso aos valores sempre `()`. Isto torna o acesso ao valor consistente em toda parte. Isto também significa que podes passar sinais puros como propriedades de componente.

Se estes estilos de API adequam-se a ti é até algum ponto subjetivo. O nosso objetivo acima é demonstrar a similaridade subjacente e os compromissos entre estes diferentes desenhos de API. Nós também queremos mostrar que a Vue é flexível: de fato não estás trancado nas APIs existentes. Se for necessário, podes criar a tua própria API de reatividade primitiva adequar-se mais as necessidades específicas.
