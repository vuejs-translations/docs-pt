# Glossário {#glossary}

Este glossário está destinado a fornecer alguma orientação sobre os significados de termos técnicos que são de uso comum quando falamos sobre a Vue. Está destinado a ser *descritivo* de como os termos são comummente usados, e não a ser uma especificação *prescritiva* de como devem ser usados. Alguns termos podem ter significados ou nuances ligeiramente diferentes dependendo do contexto envolvente.

[[TOC]]

## componente assíncrono {#async-component}

Um *componente assíncrono* é um embrulho em torno dum componente que permite que o componente embrulhado seja carregado preguiçosamente. Este é normalmente usado como uma maneira de reduzir o tamanho dos ficheiros `.js` construídos.

A Vue Router tem uma funcionalidade semelhante para o [carregamento preguiçoso de componentes de rota](https://vue-router-docs-pt.netlify.app/guide/advanced/lazy-loading), embora esta não use a funcionalidade de componentes assíncronos da Vue.

Para mais detalhes consulte:
- [Guia - Componentes Assíncronos](/guide/components/async)

## macro de compilador {#compiler-macro}

Um *macro de compilador* é o código especial que é processado por um compilador e convertido para outra coisa. Eles são efetivamente uma forma inteligente de substituição de sequência de caracteres.

O compilador de [SFC](#single-file-component) da Vue suporta várias macros, tais como `defineProps()`, `defineEmits()`, e `defineExpose()`. Estas macros são intencionalmente desenhadas para parecerem-se com funções normais de JavaScript para que possam influenciar o mesmo analisador e ferramental de inferência de tipo em torno da JavaScript ou TypeScript. No entanto, não são funções verdadeiras que são executadas no navegador. Estas são sequências de caracteres especiais que o compilador deteta e substitui pelo código de JavaScript que verdadeiramente será executado.

As macros têm limitações no seu uso que não aplicam-se ao código de JavaScript normal. Por exemplo, podes pensar que `const dp = defineProps` permitiria-te criar um pseudónimo para `defineProps`, mas na verdade resultará num erro. Existem também limitações em quais valores podem ser passados para `defineProps()`, visto que os 'argumentos' têm de ser processados pelo compilador e não em tempo de execução.

Para mais detalhes consulte:
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup#defineexpose)

## componente {#component}

O termo *componente* não é exclusivo à Vue. É comum às muitas abstrações de interface de utilizador. Ele descreve um pedaço da interface de utilizador, tal como um botão ou caixa de confirmação. Os componentes também pode ser combinados para formar componentes maiores.

Os componentes são o mecanismo primário fornecido pela Vue para separar uma interface de utilizador em pedaços menores, tanto para melhorar a capacidade de manutenção e permitir a reutilização de código.

Um componente de Vue é um objeto. Todas as propriedades são opcionais, mas nem um modelo de marcação ou função de interpretação é obrigatório para o componente desenhar. Por exemplo, o seguinte objeto seria um componente válido:

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

Na prática, a maioria das aplicações de Vue são escritas usando [Componentes de Ficheiro Único](#single-file-component) (ficheiros `.vue`). Embora estes componentes podem não parecer ser objetos à primeira vista, o compilador de componentes de ficheiro único os converterá num objeto, que é usado como exportação padrão para o ficheiro. Duma perspetiva externa, um ficheiro `.vue` é apenas um módulo de ECMAScript que exporta um objeto de componente.

As propriedades dum objeto de componente são normalmente referidas como *opções*. Isto é onde a [API de Opções](#options-api) recebe o seu nome.

As opções para um componente definem como as instâncias deste componente deveriam ser criadas. Os componentes são concetualmente semelhantes às classes, apesar da Vue não usar verdadeiras classes de JavaScript para as definir.

O termo componente também pode ser usado mais vagamente para fazer referência às instâncias do componente.

Para mais detalhes consulte:
- [Guia - Fundamentos de Componentes](/guide/essentials/component-basics)

A palavra 'componente' também aparece em vários outros termos:
- [componente assíncrono](#async-component)
- [componente dinâmico](#dynamic-component)
- [componente funcional](#functional-component)
- [Componente da Web](#web-component)

## função de composição {#composable}

O termo *função de composição* descreve um padrão de uso comum na Vue. Não é uma funcionalidade separa de Vue, é apenas uma maneira de usar a [API de Composição](#composition-api) da abstração.


* Um função de composição é uma função.
* As funções de composição são usadas para encapsular e reutilizar lógica com estado.
* O nome da função normalmente começa com `use`, para que outros programadores saibam que é uma função de composição.
* A função é normalmente esperada ser chamada durante a execução síncrona da função `setup()` do componente (ou, equivalentemente, durante a execução dum bloco `<script setup>`). Isto ata a invocação da função de composição para o contexto do componente atual, por exemplo através de chamadas para `provide()`, `inject()` ou `onMounted()`.
* As funções de composição normalmente retornam um objeto simples, e não um objeto reativo. Este objeto normalmente contém referências e funções e é esperado ser desestruturado dentro do código de chamada.

Tal como acontece com muitos padrões, pode existir alguma discordância sobre se um código específico qualifica para o rótulo. Nem todas as funções utilitárias de JavaScript são funções de composição. Se uma função não usa a API de Composição então provavelmente não é uma função de composição. Se não espera ser chamada durante a execução síncrona da `setup()` então provavelmente não é uma função de composição. As funções de composição são especialmente usadas para encapsular lógica com estado, não são apenas uma convenção de nomenclatura para funções.

Consulte [Guia - Funções de Composição](/guide/reusability/composables) para mais detalhes sobre a escrita de funções de composição.

## API de Composição {#composition-api}

A *API de Composição* é uma coleção de funções usadas para escrever componentes e funções de composição na Vue.

O termo é também usado para descrever um dos dois estilos principais usados para escrever componentes, o outro sendo a [API de Opções](#options-api). Os componentes escritos usando a API de Composição usam ou `<script setup>` ou uma função `setup()` explícita.

Consulte as [Questões Frequentes sobre API de Composição](/guide/extras/composition-api-faq) por mais detalhes.

## elemento personalizado {#custom-element}

Um *elemento personalizado* é uma funcionalidade do padrão dos [Componentes da Web](#web-component), que é implementado nos navegadores da Web modernos. Faz referência a habilidade de usar um elemento de HTML personalizado na tua marcação de HTML para incluir um Componente da Web naquele ponto na página.

A Vue tem suporte embutido para interpretar elementos personalizados e permiti-los que sejam usados diretamente nos modelos de marcação do componente da Vue.

Os elementos personalizados não deveriam ser confundidos com a habilidade de incluir componentes da Vue como marcadores dentro dum outro modelo de marcação do componente da Vue. Os elementos personalizados são usados para criar os Componentes da Web, e não componentes da Vue.

Para mais detalhes consulte:
- [Guia - Vue e os Componentes da Web](/guide/extras/web-components)

## diretiva {#directive}

O termo *diretiva* refere-se aos atributos do modelo de marcação começando com o prefixo `v-`, ou suas abreviaturas equivalentes.

As diretivas embutidas incluem `v-if`, `v-for`, `v-bind`, `v-on`, `v-slot`.

A Vue também suporta a criação de diretivas personalizadas, embora sejam normalmente apenas usadas como uma 'escotilha de fuga' para manipulação de nós do DOM diretamente. As diretivas personalizadas geralmente não podem ser usadas para recriar a funcionalidade das diretivas embutidas.

Para mais detalhes consulte:
- [Guia - Sintaxe do Modelo de Marcação - Diretivas](/guide/essentials/template-syntax#directives)
- [Guia - Diretivas Personalizadas](/guide/reusability/custom-directives)

## componente dinâmico {#dynamic-component}

O termo *componente dinâmico* é usado para descrever casos onde a escolha de qual componente filho à desenhar precisa ser feita dinamicamente. Normalmente, isto é alcançado usando `<component :is="type">`.

Um componente dinâmico não é um tipo especial de componente. Qualquer componente pode ser usado como um componente dinâmico. É a escolha do componente que é dinâmica, ao invés do próprio componente.

Para mais detalhes consulte:
- [Guia - Fundamentos de Componentes - Componentes Dinâmicos](/guide/essentials/component-basics#dynamic-components)

## efeito {#effect}

Consulte [efeito reativo](#reactive-effect) e [efeito colateral](#side-effect).

## evento {#event}

O uso de eventos para comunicação entre diferentes partes dum programa é comum para muitas áreas diferentes da programação. Dentro da Vue, o termo é comummente aplicado à ambos eventos de elemento de HTML nativo e eventos de componentes de Vue. A diretiva `v-on` é usada nos modelos de marcação para ouvir ambos tipos de evento.

Para mais detalhes consulte:
- [Guia - Manipulação de Evento](/guide/essentials/event-handling)
- [Guia - Eventos de Componente](/guide/components/events)

## fragmento {#fragment}

O termo *fragmento* refere-se à um tipo especial de [VNode](#vnode) que é usado como pai para outros nós virtuais, mas que por si mesmo não interpreta quaisquer elementos.

O nome provém do conceito semelhante dum [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) na API do DOM nativa.

Os fragmentos são usados para suportar componentes com vários nós de raiz. Embora tais componentes possam parecer ter várias raízes, nos bastidores usam um nó de fragmento como uma única raiz, como pai dos nós de 'raiz'.

Os fragmentos são também usados pelo compilador do modelo de marcação como uma maneira de envolver vários nós dinâmicos, por exemplo aqueles criados através de `v-for` ou `v-if`. Isto permite sugestões adicionais a serem passadas para o algoritmo de remendo do [VDOM ou  DOM Virtual](#virtual-dom). Muito disto é manipulado internamente, mas um lugar onde podes encontrar isto diretamente é usando uma `key` num marcador `<template>` com `v-for`. Neste cenário, a `key` é adicionada como uma [propriedade](#prop) ao nó virtual do fragmento.

Os nós do fragmento são atualmente desenhados para o DOM como nós de texto vazio, ainda que seja um detalhe de implementação. Tu podes encontrar estes nós de texto se usares `$el` ou tentares percorrer o DOM com as APIs do navegador embutido.

## componente funcional {#functional-component}

Uma definição de componente é normalmente um objeto contendo opções. Pode não parecer assim se estiveres usando `<script setup>`, mas o componente exportado a partir do ficheiro `.vue` continuará a ser um objeto.

Um *componente funcional* é uma forma alternativa de componente que é declarado usando uma função. Esta função age como [função de interpretação](#render-function) para o componente.

Um componente funcional não pode ter nenhum estado de si mesmo. Também não passa pelo ciclo de vida do componente normal, então os gatilhos do ciclo de vida não podem ser usados. Isto torna-os ligeiramente mais leves do que os componentes com estado normais.

Para mais detalhes consulte:
- [Guia - Funções de Interpretação & JSX - Componentes Funcionais](/guide/extras/render-function#functional-components)

## Içamento {#hoisting}

O termo *içamento* é usado para descrever a execução duma seção de código antes dela ser alcançada, antes do outro código. A execução é 'içada' para um ponto anterior.

A JavaScript usa içamento para algumas estruturas, tais como `var`, `import` e declarações de função.

Num contexto de Vue, o compilador de modelo de marcação aplica *içamento estático* para melhorar o desempenho. Quando convertes um modelo de marcação para uma função de interpretação, os nós virtuais que correspondem ao conteúdo estático podem ser criados de uma vez e depois reutilizados. Estes nós virtuais estáticos são descritos como içados porque são criados fora da função de interpretação, antes de executar. Uma forma semelhante de içamento é aplicada aos objetos ou arranjos estáticos que são gerados pelo compilador de modelo de marcação.

Por mais detalhes consulte:
- [Guia - Mecanismo de Interpretação - Içamento Estático](/guide/extras/rendering-mechanism#static-hoisting)

## Modelo de Marcação no DOM {#in-dom-template}

Existem várias maneiras de especificar um modelo de marcação para um componente. Na maioria dos casos o modelo de marcação é fornecido como uma sequência de caracteres.

O termo *modelo de marcação no DOM* refere-se ao cenário onde o modelo de marcação é fornecido na forma de nós de DOM, ao invés duma sequência de caracteres. A Vue então converte os nós de DOM numa sequência de caracteres de modelo de marcação usando `innerHTML`.

Normalmente, um modelo de marcação em DOM começa como marcação de HTML escrita diretamente no HTML da página. O navegador então analisa esta em nós de DOM, o que a Vue então usa para ler a `innerHTML`.

Para mais detalhes consulte:
- [Guia - Criação duma Aplicação - Modelo de Marcação do Componente de Raiz no DOM](/guide/essentials/application#in-dom-root-component-template)
- [Guia - Fundamentos de Componente - Advertências de Analise de Modelo de Marcação de DOM](/guide/essentials/component-basics#dom-template-parsing-caveats)
- [Opções: Interpretação - modelo de marcação](/api/options-rendering#template)

## injetar {#inject}

Consulte [fornecer / injetar](#provide-inject).

## gatilhos do ciclo de vida {#lifecycle-hooks}

Uma instância de componente da Vue passa por um ciclo de vida. Por exemplo, é criada, montada, atualizada, e desmontada.

Os *gatilhos do ciclo de vida* são uma maneira de ouvir todos estes eventos do ciclo de vida.

Com a API de Opções, cada gatilho é fornecido como uma opção separada, por exemplo `mounted`. A API de Composição usa funções, tais como `onMounted()`.

Para mais detalhes consulte:
- [Guia - Gatilhos do Ciclo de Vida](/guide/essentials/lifecycle)

## macro {#macro}

Consulte a [macro do compilador](#compiler-macro).

## ranhura nomeada {#named-slot}

Um componente pode ter várias ranhuras, diferenciadas por nome. As ranhuras exceto a ranhura padrão são referidas como *ranhuras nomeadas*.

Para mais detalhes consulte:
- [Guia - Ranhuras - Ranhuras Nomeadas](/guide/components/slots#named-slots)

## API de Opções {#options-api}

Os componentes de Vue são definidas usando objetos. As propriedades destes objetos de componente são conhecidas como *opções*.

Os componentes podem ser escritos em dois estilos. Um estilo usa a [API de Composição](#composition-api) em conjunto com `setup` (ou através uma opção `setup()` ou `<script setup>`). O outro estilo faz uso muito pouco direto da API de Composição, usando várias opções de componente para alcançar um resultado semelhante. As opções do componente que são usadas nesta maneira são referidas como *API de Opções*.

A API de Opções inclui opções tais como `data()`, `computed`, `methods` e `created()`.

Algumas opções, tais como `props`, `emits` e `inheritAttrs`, podem ser usados quando escrevemos componentes com qualquer API. Já que são opções de componente, poderiam ser consideradas parte da API de Opções. No entanto, uma vez que estas opções também são usadas em conjunto com a `setup()`, é normalmente mais útil pensar delas como características partilhadas entre os dois estilos de componente.

A própria função `setup()` é uma opção de componente, então *poderia* ser considerada como parte da API de Opções. No entanto, isto não é como o termo 'API de Opções' é normalmente usado. Ao invés disto, a função `setup()` é considerada como parte da API de Composição.

## extensão {#plugin}

Embora o termo *extensão* possa ser usado numa grande variedade de contextos, a Vue tem um conceito específico duma extensão como uma maneira de adicionar funcionalidade à uma aplicação.

As extensões são adicionadas à uma aplicação chamando `app.use(plugin)`. A própria extensão ou é uma função ou um objeto com uma função `install`. Esta função será passada à instância da aplicação e pode então fazer tudo aquilo que precisa fazer.

Para mais detalhes consulte:
- [Guia - Extensões](/guide/reusability/plugins)

## propriedade {#prop}

Existem três usos comuns do termo *propriedade* na Vue:

* Propriedades de componente
* Propriedades de nó virtual
* Propriedades de ranhura

As *propriedades de componente* são o que a maioria das pessoas consideram como propriedades. Estas são explicitamente definidas por um componente usando ou `defineProps()` ou a opção `props`.

O termo *propriedades de nó virtual* referem-se às propriedades do objeto passado como segundo argumento à `h()`. Estas podem incluir propriedades de componente, mas também podem incluir eventos de componente, eventos de DOM, atributos de DOM e propriedades de DOM. Normalmente apenas encontrarias propriedades de nó virtual se estivesses a trabalhar com funções de interpretação para manipular diretamente os nós virtuais.

As *propriedades de ranhura* são propriedades passadas à uma ranhura isolada.

Em todos os casos, as propriedades são propriedades que são a partir doutro lado.

Embora a palavra *props* derive da palavra *propriedades*, o termo *props* tem um significado muito mais específico no contexto da Vue. Tu deves evitar usá-a como uma abreviação de propriedades.

Para mais detalhes consulte:
- [Guia - Propriedades](/guide/components/props)
- [Guia - Funções de Interpretação & JSX](/guide/extras/render-function)
- [Guia - Ranhuras - Ranhuras Isoladas](/guide/components/slots#scoped-slots)

## fornecer / injetar {#provide-inject}

`provide` e `inject` são uma forma de comunicação inter-componente.

Quando um componente *fornece* um valor, todos os descendentes deste componente podem então escolher agarrar este valor, usando `inject`. Ao contrário das propriedades, o componente fornecedor não sabe precisamente qual componente está a receber o componente.

`provide` e `inject` são algumas usadas para evitar a *perfuração de propriedade*. Elas também podem ser usadas como uma maneira implícita para um componente comunicar com os conteúdos da sua ranhura.

`provide` também pode ser usada no nível da aplicação, tornando um valor disponível para todos os componentes dentro desta aplicação.

Para mais detalhes consulte
- [Guia - fornecer / injetar](/guide/components/provide-inject)

## efeito reativo {#reactive-effect}

Um *efeito reativo* é a parte do sistema de reatividade da Vue. Refere-se ao processo de rastrear as dependências duma função e re-executar esta função quando os valores destas dependências mudarem.

`watchEffect()` é a maneira mais direta de criar um efeito. Várias outras partes da Vue usam os efeitos internamente, por exemplo, atualizações de interpretação de componente, `computed()` e `watch()`.

A Vue apenas pode rastrear dependências dentro dum efeito reativo. Se o valor duma propriedade for lido fora dum efeito reativo 'perderá' a reatividade, no sentido de que a Vue não saberá o que fazer se esta propriedade mudar subsequentemente.

O termo deriva de 'efeito colateral'. A chamada da função de efeito é um efeito colateral do valor da propriedade sendo mudada.

Para mais detalhes consulte:
- [Guia - Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## reatividade {#reactivity}

Em geral, a *reatividade* refere-se à habilidade de automaticamente realizar ações em resposta às mudanças de dados. Por exemplo, atualizar o DOM ou fazer uma requisição de rede quando um valor de dado mudar.

No contexto da Vue, a reatividade é usada para descrever uma coleção de funcionalidades. Estas funcionalidades combinam-se para formar um *sistema de reatividade*, que é exposto através da [API de Reatividade](#reactivity-api).

Existem várias diferentes maneiras que um sistema de reatividade poderia ser implementado. Por exemplo, poderia ser feito pela analise estática do código para determinar suas dependências. No entanto, a Vue não emprega esta forma de sistema de reatividade.

Ao invés disto, o sistema de reatividade da Vue rastreia o acesso de propriedade em tempo de execução. Ele faz isto usando embrulhos de delegação e funções de recuperação e definição para a propriedades.

Para mais detalhes consulte:
- [Guia - Fundamentos da Reatividade](/guide/essentials/reactivity-fundamentals)
- [Guia - Reatividade em Profundidade](/guide/extras/reactivity-in-depth)

## API de Reatividade {#reactivity-api}

A *API de Reatividade* é uma coleção de funções do núcleo da Vue relacionadas à [reatividade](#reactivity). Estas podem ser usadas independentemente dos componentes. Ela inclui funções tais como `ref()`, `reactive()`, `computed()`, `watch()` e `watchEffect()`.

A API de Reatividade é um subconjunto da API de Composição.

Para mais detalhes consulte:
- [API de Reatividade: Núcleo](/api/reactivity-core)
- [API de Reatividade: Utilitários](/api/reactivity-utilities)
- [API de Reatividade: Avançado](/api/reactivity-advanced)

## referência {#ref}

> Esta entrada é sobre o uso de `ref` para a reatividade. Para o atributo `ref` usado nos modelos de marcação, consulte [referência do modelo de marcação](#template-ref).

Uma `ref` é parte do sistema de reatividade da Vue. Ela é um objeto com uma única propriedade reativa, chamada de `value`.

Existem vários tipos diferentes de referência. Por exemplo, referências podem ser criadas usando `ref()`, `shallowRef()`, `computed()`, e `customRef()`. A função `isRef()` pode ser usada para verificar se um objeto é uma referência, e `isReadonly()` pode ser usado para verificar se a referência permite a re-atribuição direta do seu valor.

Para mais detalhes consulte:
- [Guia - Fundamentos da Reatividade](/guide/essentials/reactivity-fundamentals)
- [API de Reatividade: Núcleo](/api/reactivity-core)
- [API de Reatividade: Utilitários](/api/reactivity-utilities)
- [API de Reatividade: Avançado](/api/reactivity-advanced)

## função de interpretação {#render-function}

Uma *função de interpretação* é a parte dum componente que gera os nós virtuais usados durante a interpretação. Os modelos de marcação são compilados para as funções de interpretação.

Para mais detalhes consulte:
- [Guia - Funções de Interpretação & JSX](/guide/extras/render-function)

## agendador {#scheduler}

O *agendador* é a parte do interior da Vue que controla o horário de quando os [efeitos de reatividade](#reactive-effect) são executados.

Quando estado de reatividade muda, a Vue não aciona imediatamente a atualização da interpretação. Ao invés disto, ela organiza-os por grupos usando uma fila. Isto garante que um componente apenas re-interpreta-se uma vez, mesmo se várias mudanças forem feitas aos dados subjacentes.

Os [observadores](/guide/essentials/watchers) são também organizados por grupos usando a fila agendadora. Os observadores com `flush: 'pre'` (o padrão) executarão antes da interpretação do componente, ao passo que aqueles com `flush: 'post'` executarão depois da interpretação do componente.

As tarefas no agendador são também usadas para realizar várias outras tarefas internas, tais como acionar alguns [gatilhos do ciclo de vida](#lifecycle-hooks) e atualizar [referências do modelo de marcação](#template-ref).

## ranhura isolada {#scoped-slot}

O termo *ranhura isolada* é usado para referir-se à [ranhura](#slot) que recebe [propriedades](#prop).

Historicamente, a Vue fez uma distinção muito maior entre ranhuras isoladas e não isoladas. Até algum ponto poderiam ser consideradas como duas funcionalidades separadas, unificadas por trás duma sintaxe de modelo de marcação comum.

Na Vue 3, as APIs da ranhura foram simplificadas para fazer todas as ranhuras comportarem-se como ranhuras isoladas. No entanto, os casos de uso para ranhuras isoladas e não isoladas muitas vezes diferem, assim o termo ainda prova-se útil como uma maneira para referir-se às ranhuras com propriedades.

As propriedades passadas à uma ranhura apenas podem ser usadas dentro duma região específica do modelo de marcação pai, responsável por definir os conteúdos da ranhura. Esta região do modelo de marcação comporta-se como uma âmbito de variável para as propriedades, daí o nome 'ranhura isolada'.

Para mais detalhes consulte:
- [Guia - Ranhuras - Ranhuras Isoladas](/guide/components/slots#scoped-slots)

## SFC {#sfc}

Consulte o [Componente Ficheiro Único](#single-file-component).

## efeito colateral {#side-effect}

O termo *efeito colateral* não é específico à Vue. Ele é usado para descrever operações ou funções que fazem algo além dos seus âmbitos locais.

Por exemplo, no contexto de definição duma propriedade como `user.name = null`, é esperado que esta mudará o valor de `user.name`. Se também fizer outra coisa, como acionar o sistema de reatividade da Vue, então isto deveria ser descrito como um efeito colateral. Este é origem do termo [efeito de reatividade](#reactive-effect) dentro da Vue.

Quando uma função é descrita como tendo efeitos colaterais, significa que a função realiza alguma tipo de ação que é observável fora da função, à parte de só retornar um valor. Isto pode significar que atualiza um valor no estado, ou aciona uma requisição de rede.

O termo é frequentemente usado quando descrevemos a interpretação ou propriedades computadas. É considerado boa prática para interpretação não ter nenhum efeito colateral. Do mesmo modo, a função recuperadora para uma propriedade computada não deveria ter nenhum efeito colateral.

## Componente de Ficheiro Único {#single-file-component}

O termo *Componente de Ficheiro Único*, ou SFC em Inglês, refere-se ao formato de ficheiro `.vue` que é comummente usado para os componentes da Vue.

Consulte também:
- [Guia - Componentes de Ficheiro Único](/guide/scaling-up/sfc)
- [Especificação da Sintaxe do SFC](/api/sfc-spec)

## ranhura {#slot}

As ranhuras são usadas para passar conteúdo para componentes filhos. Ao passo que as propriedades são usadas para passar valores de dados, as ranhuras são usadas para passar conteúdo mais rico consistindo de elementos de HTML e outros componentes de Vue.

Para mais detalhes consulte:
- [Guia - Ranhuras](/guide/components/slots)

## referência do modelo de marcação {#template-ref}

O termo *referência do modelo de marcação* refere-se ao uso dum atributo `ref` num marcador dentro dum modelo de marcação. Depois do componente ser desenhado, este atributo é usado para povoar uma propriedade correspondente com ou o elemento de HTML ou a instância do componente que corresponde ao marcador no modelo de marcação.

Se estiveres a usar a API de Opções então as referências são expostas através das propriedades do objeto `$refs`.

Com a API de Composição, as referências do modelo de marcação povoam uma [referência](#ref) reativa com o mesmo nome.

As referências do modelo de marcação não devem ser confundidas com as referências reativas encontradas no sistema de reatividade da Vue.

Para mais detalhes consulte:
- [Guia - Referências do Modelo de Marcação](/guide/essentials/template-refs)

## VDOM {#vdom}

Consulte o [DOM virtual](#virtual-dom).

## DOM virtual {#virtual-dom}

O termo *DOM virtual* (VDOM como é conhecido em Inglês) não é exclusivo à Vue. É uma abordagem comum usada por várias abstrações da Web para gestão de atualizações da interface de utilizador.

Os navegadores usam uma árvore de nós para representar o estado atual da página. Esta árvore, e as APIs de JavaScript usadas para interagir com esta, são referidas como *modelo do objeto do documento*, ou *DOM* na sua abreviatura em Inglês.

A manipulação do DOM é uma dos maiores obstáculo do desempenho. O DOM virtual fornece uma estratégia para lidar com isto.

No lugar de criar nós de DOM diretamente, os componentes da Vue geram uma descrição de quais nós de DOM gostariam. Estas descrições são objetos de JavaScript simples, conhecidos como nós do DOM virtual (ou VDOM na sua abreviatura em Inglês). A criação de nós de DOM virtual é relativamente barato.

Toda vez que um componente é reinterpretado, a nova árvore de nós de DOM é compara à árvore anterior de nós de DOM e quaisquer diferenças são então aplicadas ao DOM verdadeiro. Se nada tiver mudado então o DOM não precisa de ser tocado.

A Vue usa uma abordagem híbrida que chamamos de [DOM Virtual Informado pelo Compilador](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). O compilador de modelo de marcação da Vue é capaz de aplicar otimizações de desempenho baseado na analise estática do modelo de marcação. No lugar de realizar uma comparação completa das antigas e novas árvores de nós virtuais do componente em tempo de execução, a Vue pode usar a informação extraída pelo compilador para reduzir a comparação apenas às partes da árvore que podem de fato mudar.

Para mais detalhes consulte:
- [Guia - Mecanismo de Interpretação](/guide/extras/rendering-mechanism)
- [Guia - Funções de Interpretação & JSX](/guide/extras/render-function)

## nó virtual {#vnode}

Um *nó virtual* mas conhecido como (VNode, abreviatura em Inglês) é um *nó de DOM virtual*. Eles podem ser criados usando a função [`h()`](/api/render-function#h).

Consulte a seção do [DOM virtual] para mais informação.

## Componente da Web {#web-component}

O padrão dos *Componentes da Web* é uma coleção de funcionalidade implementadas nos navegadores da Web modernos.

Os componentes da Vue não são Componentes da Web, mas `defineCustomElement()` pode ser usado para criar um [elemento personalizado](#custom-element) a partir dum componente de Vue. A Vue também suporta o uso de elementos personalizados dentro dos componentes da Vue.

Para mais detalhes consulte:
- [Guia - Vue e os Componentes da Web](/guide/extras/web-components)
