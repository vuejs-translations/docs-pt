<script setup>
import TestingApiSwitcher from './TestingApiSwitcher.vue'
</script>

# Testagem {#testing}

## Porquê Testar? {#why-test}

Os testes automatizados ajudam-te e a tua construir aplicações de Vue complexas rapidamente e com confiança pela prevenção de regressões e encorajam-te a quebrar a tua aplicação em funções, módulos, classes, e componentes testáveis. Tal como em qualquer aplicação, a tua nova aplicação de Vue pode quebrar-se de muitas maneiras e é importante que possas capturar estes problemas e corrigi-los antes do lançamento.

Neste guia, cobriremos a terminologia fundamental e forneceremos as nossas recomendações a respeito de quais ferramentas escolher para a tua aplicação de Vue 3.

Existe uma seção específica da Vue que cobre os constituíveis. Consulte abaixo a [Testagem das Constituíveis](#testing-composables) para mais detalhes.

## Quando Testar {#when-to-test}

Comece a testar desde o inicio! Nós recomendamos-te começar a escrever testes o mais cedo que puderes. Quanto mais tempo esperares para adicionar testes à tua aplicação, mas dependências a tua aplicação terá, e mais difícil será começar.

## Tipos de Testagem {#testing-types}

Quando estiveres a desenhar a estratégia de testagem da tua aplicação de Vue, deves influenciar os seguintes tipos de testagem:

- **Unitário**: Verifica se as entradas para uma dada função, classe, ou constituível estão a produzir o resultado esperado ou efeitos colaterais.
- **Componente**: Verifica se o teu componente monta, apresenta, pode ser interagido com, e comporta-se como esperado. Estes testes importam mais código do que os testes unitários, são mais complexos, e exigem mais tempo para serem executados.
- **Ponta-a-Ponta**: Verifica se as funcionalidades que abrangem várias páginas e realizam requisições de rede reais contra a tua aplicação de Vue construída para produção. Estes testes muitas vezes envolvem levantar uma base de dado ou outro backend.

Cada tipo de testagem desempenha um papel na estratégia de testagem da tua aplicação e cada um proteger-te-á contra diferentes tipos de problemas. 

## Visão Geral {#overview}

Nós discutiremos brevemente o que cada um destes é, como eles podem ser implementados em aplicações de Vue, e forneceremos algumas recomendações gerais.

## Testes Unitários {#unit-testing}

Os testes unitários são escritos para verificar se aquelas pequenas e isoladas unidades de código são estão a funcionar como esperado. Um teste unitário normalmente cobre uma única função, classe, constituível, ou módulo. Os testes unitários focam-se na correção da lógica e apenas diz respeito a elas mesmas com uma pequena porção da funcionalidade global da aplicação. Eles podem imitar grandes partes do ambiente da tua aplicação (por exemplo, estado inicial, classes complexas, módulos de terceiros, e requisições da rede).

Em geral, os testes unitários capturarão os problemas com a lógica de negócio da função e correção da lógica.

Tome como exemplo esta função `increment`:

```js
// helpers.js
export function increment (current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Uma vez que está muito autossuficiente, será fácil invocar a função `increment` e afirmar que ela retorna o que é suposto retornar, assim escreveremos um Teste Unitário.

Se quaisquer destas afirmações falhar, é claro que o problema está contido dentro da `increment` função.

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Conforme mencionado anteriormente, o teste unitário é normalmente aplicado à lógica de negócio autossuficiente, componentes, classes, módulos ou funções que não envolvem a apresentação da interface do utilizador (UI, sigla em Inglês), requisições de rede, ou outras preocupações ambientais.

Eles são tipicamente módulos planos de JavaScript / TypeScript não relacionados a Vue. Em geral, escrever testes unitários para a lógica de negócio em aplicações de Vue não difere significativamente de aplicações usando outras abstrações.

Existem duas exemplos onde FAZES teste unitário de funcionalidades especificas da Vue:

1. Constituíveis
2. Componentes

### Constituíveis {#composables}

Uma categoria de funções especificas às aplicações de Vue são as [Constituíveis](/guide/reusability/composables.html), que podem exigir manipulação especial durante os testes. Consulte a [Testagem de Constituíveis](#testing-composables) abaixo para mais detalhes.

### Teste Unitário de Componentes {#unit-testing-components}

Um componente pode ser testado de duas maneiras:

1. Caixa Branca ou Whitebox: Teste Unitário

   Os testes que são "testes de Caixa Branca" estão conscientes dos detalhes de implementação e dependências de um componente. Eles estão concentrados no **isolamento** do componente sob teste. Estes testes usualmente envolverão a imitação de algumas, se não de todos os filhos do teu componente, bem como a composição do estado da extensão e dependências (por exemplo, Vuex).

2. Caixa Preta ou Blackbox: Teste de Componente

   Os testes que são "testes de Caixa Preta" são não têm consciência dos detalhes de implementação de um componente. Estes testes imitam tão pouco quanto possível para testar a integração do teu componente e o sistema inteiro. Eles usualmente apresentam todos os componentes filhos e são considerados mais de uma "integração de teste". Consulte as [recomendações de Teste de Componente](#component-testing) abaixo.

### Recomendação {#recommendation}

- [Vitest](https://vitest.dev/)

  Já que a configuração oficial criada pela `create-vue` é baseada na [Vite](https://vitejs.dev/), recomendamos o uso de uma abstração de teste unitário que pode influenciar a mesma conduta de configuração e transformação diretamente a partir da Vite. A [Vitest](https://vitest.dev/) é uma abstração de teste unitário desenhada especificamente para este propósito, criada e mantida pelos membros da equipa da Vue / Vite. Ela integra com projetos baseados em Vite com mínimo de esforço, e é estrondosamente rápida.

### Outras Opções {#other-options}

- [Peeky](https://peeky.dev/) é um outro executor de teste unitário rápido com integração de Vite de primeira classe. Ele é também criado por um membro da equipa principal da Vue e oferece uma interface de teste baseada em GUI.

- [Jest](https://jestjs.io/) é uma abstração de testagem unitária popular, e pode ser posta a funcionar com a Vite através do pacote [vite-test](https://github.com/sodatea/vite-jest). No entanto, apenas recomendados a Jest se tiveres um conjunto de teste de Jest existente que precisa ser migrado para um projeto baseado na Vite, já que a Vitest oferece uma integração mais fluida e melhor desempenho.

## Testagem de Componente {#component-testing}

Em aplicações de Vue, os componentes são os blocos de construção principais da interface do utilizador. Os componentes são portanto a unidade natural de isolamento quando isto aproxima-se da validação do comportamento da tua aplicação. A partir de uma perspetiva de granularidade, a testegam de componente situa-se em algum lugar acima da testagem unitária e pode ser considerada uma forma de testagem de integração. Grande parte da tua aplicação em Vue deve ser coberta por um teste de componente e recomendamos que cada componente de Vue tenha o seu próprio ficheiro de especificação `spec`.

Os testes de componente devem capturar problemas relativos as propriedades do teu componente, eventos, ranhuras que ele fornece, estilos, classes, gatilhos do ciclo de vida, e muito mais.

Os testes de componente não devem imitar os componentes filhos, mas testar as interações entre o teu componente e os seus componentes filhos ao interagir com os componentes como o utilizador faria. Por exemplo, um teste de componente deve clicar sobre um elemento como um utilizador faria ao invés de interagir programaticamente com o componente.

Os testes de componente deve concentrar-se sobre interfaces públicas do componente em vez dos detalhes de implementação interna. Para a maior parte dos componentes, a interface pública está limitada a: eventos emitidos, propriedades, e ranhuras. Quando estiveres a testar, lembra-te de **testar o que um componente faz, e não como ele o faz**.

**FAZER**

- Para lógica **Visual**: afirmar saída correta do interpretador baseada nas propriedades e ranhuras introduzidas.
- Para lógica **Comportamental**: afirmar atualizações ou eventos emitidos corretos do interpretador em resposta aos eventos de entrada do utilizador.

  No exemplo abaixo, demonstraremos um componente `Stepper` que tem um elemento de DOM rotulado "increment" e pode ser clicado. Nós passamos uma propriedade chamada `max` que impedi o `Stepper` de ser incrementado além de `2`, assim se clicarmos o botão 3 vezes, a interface do utilizador deve continuar a dizer `2`.

  Nós não sabemos nada a respeito da implementação do `Stepper`, apenas que a "entrada" é a propriedade `max` e a "saída" é o estado do DOM como o utilizador o verá.

<TestingApiSwitcher>

<div class="testing-library-api">

```js
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // Afirma implicitamente que "0" está dentro do componente

const button = getByText('increment')

// Despacha um evento de clique para o nosso botão de incrementar.
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

</div>

<div class="vtu-api">

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

</div>

<div class="cypress-api">

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector).should('be.visible').and('contain.text', '0')
  .get(buttonSelector).click()
  .get(valueSelector).should('contain.text', '1')
```

</div>

</TestingApiSwitcher>

- **NÃO FAZER**

  Não afirmar o estado privado de uma instância de componente ou testar métodos privados de um componente. Testar detalhes de implementação torna os testes frágeis, já que eles estão sujeitos a quebrarem ou exigirem atualizações quando a implementação mudar.

  O derradeiro trabalho do componente é apresentar a saída correta do DOM, assim os testes que se concentram na saída do DOM fornecem o mesmo nível de garantia de correção (se não mais) enquanto é mais robusto e resiliente para mudar.

  Não depender exclusivamente de testes instantâneos. Afirmação de sequências de caracteres de HTML não descrevem correção. Escreve os testes com intencionalidade.

  Se um método precisa ser testado meticulosamente, considere extraí-lo para uma função utilitária isolada e escrever um teste unitário dedicado para ele. Se poder ser extraído suavemente, pode ser testado como uma parte de um componente, integração, ou teste ponta-a-ponta que o cubra.

### Recomendação {#recommendation-1}

- [Vitest](https://vitest.dev/) para componentes ou constituíveis que apresentam de maneira desgovernada (por exemplo, a função [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) na VueUse). Os componentes e o DOM podem ser testados com o uso da [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro).

- [Testagem de Componente da Cypress](https://on.cypress.io/component) para os componentes cujos comportamento esperado depende da apresentação apropriada dos estilos ou o acionar de eventos de DOM nativos. Pode ser usado com a Testing Library através da [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

As principais diferenças entre a Vitest e executores baseados no navegador são velocidade e contexto de execução. Resumidamente, executores baseados em navegador, como Cypress, podem capturar problemas que executores baseados em node, como Vitest, não podem (por exemplo, problemas de estilo, eventos verdadeiros de DOM nativo, cookies, armazenamento local (localStorage), e falhas da rede), mas os executores baseado em navegador são **ordens de magnitude mais lentos do que a Vitest** porque eles abrem um navegador, compilam as tuas folhas de estilos, e muito mais. A Cypress é um executor baseado em navegador que suporta a testagem de componente. Leia a [página de comparação da Vitest](https://vitest.dev/guide/comparisons.html#cypress) para informações mais recentes comparando a Vitest e Cypress.

### Bibliotecas de Montagem {#mounting-libraries}

A testagem de componente muitas vezes envolve a montagem do componente a ser testado em isolamento, acionar eventos de entrada de utilizador de maneira simulada, e afirmar sobre a saída do DOM apresentado. Existem bibliotecas utilitárias dedicadas que tornam estas tarefas mais simples.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) é uma biblioteca de testagem de Vue focada em testar componentes sem depender dos detalhes de implementação. Construída com a acessibilidade em mente, sua abordagem também torna a refatoração mais suave. Seu princípio orientador é que quanto mais testes refletirem a maneira que o software é usado, mais confiança eles podem oferecer.

- - [`@vue/test-utils`](https://github.com/vuejs/test-utils) é a biblioteca de testagem de componente de baixo nível oficial que foi escrita para oferecer aos utilizadores acesso às APIs específicas da Vue. É também a biblioteca de baixo nível sobre qual a `@testing-library/vue` é construída.

Nós recomendamos usar a `@testing-library/vue` para testagem de componentes nas aplicações, já que o seu foco alinha-se melhor com a testagem das prioridades das aplicações. Use `@vue/test-utils` apenas se estiveres a construir componentes avançados que exijam a testagem de aspetos internos específicos da Vue.

### Outras Opções {#other-options-1}

- [Nightwatch](https://v2.nightwatchjs.org/) é uma executor de teste E2E com suporte a Testagem de Componente de Vue. ([Projeto de Exemplo](https://github.com/nightwatchjs-community/todo-vue) na versão 2 da Nightwatch)

## Testagem E2E {#e2e-testing}

Enquanto os testes unitários oferecem aos programadores algum grau de confiança, os testes unitários e de componente estão limitados em suas capacidades de fornecer cobertura holística de uma aplicação quando implementada em produção. Como resultado, os testes de ponta-a-ponta (E2E, sigla em Inglês) oferecem cobertura naquilo que é provavelmente o aspeto mais importante de uma aplicação: aquilo que acontece quando utilizadores de fato usam as tuas aplicações.

Os testes de ponta-a-ponta concentram-se sobre o comportamento de aplicações de várias páginas que fazem requisições de rede contra a tua aplicação de Vue construída para produção. Eles muitas vezes envolvem levantar uma base de dados ou outro backend e pode até estar a executar contra um ambiente de qualidade.

Os testes de ponta-a-ponta muitas vezes capturarão problemas com o teu roteador, biblioteca de gestão de estado, componentes de alto nível (por exemplo, uma Aplicação (`App`) ou Esquema (`Layout`)), recursos públicos, ou qualquer manipulação de requisição. Conforme mencionado acima, eles capturam problemas críticos que podem ser impossíveis de capturar com testes unitários ou testes de componente.

Os testes de ponta-a-ponta não importam nenhum código da tua aplicação de Vue, mas dependem completamente da testagem da tua aplicação com a navegação através de páginas inteiras em um navegador de verdade.

Os testes ponta-a-ponta validam muitas camadas na tua aplicação. Eles podem tanto mirar a tua aplicação construída localmente, ou mesmo um ambiente de qualidade (staging, em Inglês). A testagem contra o teu ambiente de qualidade não apenas inclui o código do teu frontend e servidor estático, mas todos serviços e infraestrutura de backend associados.

> Quanto mais os teus testes espelharem a maneira que o teu software é usado, mais confiança eles podem dar-te - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Autor da Testing Library

Por testarem como as ações do utilizador impactam a tua aplicação, os testes E2E são muitas vezes a chave para segurança mais alta nos casos em queremos saber se uma aplicação está devidamente funcional ou não.

### Choosing an E2E Testing Solution {#choosing-an-e2e-testing-solution}

While end-to-end (E2E) testing on the web has gained a negative reputation for unreliable (flaky) tests and slowing down development processes, modern E2E tools have made strides forward to create more reliable, interactive, and useful tests. When choosing an E2E testing framework, the following sections provide some guidance on things to keep in mind when choosing a testing framework for your application.

#### Cross-browser testing {#cross-browser-testing}

One of the primary benefits that end-to-end (E2E) testing is known for is its ability to test your application across multiple browsers. While it may seem desirable to have 100% cross-browser coverage, it is important to note that cross browser testing has diminishing returns on a team's resources due the additional time and machine power required to run them consistently. As a result, it is important to be mindful of this trade-off when choosing the amount of cross-browser testing your application needs.

#### Faster feedback loops {#faster-feedback-loops}

One of the primary problems with end-to-end (E2E) tests and development is that running the entire suite takes a long time. Typically, this is only done in continuous integration and deployment (CI/CD) pipelines. Modern E2E testing frameworks have helped to solve this by adding features like parallelization, which allows for CI/CD pipelines to often run magnitudes faster than before. In addition, when developing locally, the ability to selectively run a single test for the page you are working on while also providing hot reloading of tests can help to boost a developer's workflow and productivity.

#### First-class debugging experience {#first-class-debugging-experience}

While developers have traditionally relied on scanning logs in a terminal window to help determine what went wrong in a test, modern end-to-end (E2E) test frameworks allow developers to leverage tools that they are already familiar with, e.g. browser developer tools.

#### Visibility in headless mode {#visibility-in-headless-mode}

When end-to-end (E2E) tests are run in continuous integration / deployment pipelines, they are often run in headless browsers (i.e., no visible browser is opened for the user to watch). A critical feature of modern E2E testing frameworks is the ability to see snapshots and/or videos of the application during testing, providing some insight into why errors are happening. Historically, it was tedious to maintain these integrations.

### Recommendation {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  Overall, we believe Cypress provides the most complete E2E solution with features like an informative graphical interface, excellent debuggability, built-in assertions and stubs, flake-resistance, parallelization, and snapshots. As mentioned above, it also provides support for [Component Testing](https://docs.cypress.io/guides/component-testing/introduction). However, it only supports Chromium-based browsers and Firefox.

### Other Options {#other-options-2}

- [Playwright](https://playwright.dev/) is also a great E2E testing solution with a wider range of browser support (mainly WebKit). See [Why Playwright](https://playwright.dev/docs/why-playwright) for more details.

- [Nightwatch v2](https://v2.nightwatchjs.org/) is an E2E testing solution based on [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). This gives it the widest browser support range.

## Recipes {#recipes}

### Adding Vitest to a Project {#adding-vitest-to-a-project}

In a Vite-based Vue project, run:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

Next, update the Vite configuration to add the `test` option block:

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: 'happy-dom'
  }
})
```

:::tip
If you are using TypeScript, add `vitest/globals` to the `types` field in your `tsconfig.json`.

```json
// tsconfig.json

{
 "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```
:::

Then create a file ending in `*.test.js` in your project. You can place all test files in a test directory in project root, or in test directories next to your source files. Vitest will automatically search for them using the naming convention.

```js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // assert output
  getByText('...')
})
```

Finally, update `package.json` to add the test script and run it:

```json{4}
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### Testing Composables {#testing-composables}

> This section assumes you have read the [Composables](/guide/reusability/composables.html) section.

When it comes to testing composables, we can divide them into two categories: composables that do not rely on a host component instance, and composables that do.

A composable depends on a host component instance when it uses the following APIs:

- Lifecycle hooks
- Provide / Inject

If a composable only uses Reactivity APIs, then it can be tested by directly invoking it and asserting its returned state / methods:

```js
// counter.js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js
// counter.test.js
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

A composable that relies on lifecycle hooks or Provide / Inject needs to be wrapped in a host component to be tested. We can create a helper like the following:

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // suppress missing template warning
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app]
}
```
```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // mock provide for testing injections
  app.provide(...)
  // run assertions
  expect(result.foo.value).toBe(1)
  // trigger onUnmounted hook if needed
  app.unmount()
})
```

For more complex composables, it could also be easier to test it by writing tests against the wrapper component using [Component Testing](#component-testing) techniques.

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
