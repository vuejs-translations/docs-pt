<script setup>
import TestingApiSwitcher from './TestingApiSwitcher.vue'
</script>

# Testes {#testing}

## Porquê Testar? {#why-test}

Os testes automatizados ajudam-te e a tua construir aplicações de Vue complexas rapidamente e com confiança pela prevenção de regressões e encorajam-te a quebrar a tua aplicação em funções, módulos, classes, e componentes testáveis. Tal como em qualquer aplicação, a tua nova aplicação de Vue pode quebrar-se de muitas maneiras e é importante que possas capturar estes problemas e corrigi-los antes do lançamento.

Neste guia, cobriremos a terminologia fundamental e forneceremos as nossas recomendações a respeito de quais ferramentas escolher para a tua aplicação de Vue 3.

Existe uma seção específica da Vue que cobre as funções de composição. Consulte abaixo a [Testando as Funções de Composição](#testing-composables) para mais detalhes.

## Quando Testar {#when-to-test}

Comece a testar desde o inicio! Nós recomendamos-te começar a escrever testes o mais cedo que puderes. Quanto mais tempo esperares para adicionar testes à tua aplicação, mas dependências a tua aplicação terá, e mais difícil será começar.

## Tipos de Testes {#testing-types}

Quando estiveres a desenhar a estratégia de testes da tua aplicação de Vue, deves influenciar os seguintes tipos de testes:

- **Unitário**: Verifica se as entradas para uma dada função, classe, ou constituível estão a produzir o resultado esperado ou efeitos colaterais.
- **Componente**: Verifica se o teu componente monta, apresenta, pode ser interagido com, e comporta-se como esperado. Estes testes importam mais código do que os testes unitários, são mais complexos, e exigem mais tempo para serem executados.
- **Ponta-a-Ponta**: Verifica se as funcionalidades que abrangem várias páginas e realizam requisições de rede reais contra a tua aplicação de Vue construída para produção. Estes testes muitas vezes envolvem levantar uma base de dado ou outro backend.

Cada tipo de testes desempenha um papel na estratégia de testes da tua aplicação e cada um proteger-te-á contra diferentes tipos de problemas. 

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

1. Funções de Composição
2. Componentes

### Funções de Composição {#composables}

Uma categoria de funções especificas às aplicações de Vue são as [Funções de Composição](/guide/reusability/composables), que podem exigir manipulação especial durante os testes. Consulte a [Testando as Funções de Composição](#testing-composables) abaixo para mais detalhes.

### Teste Unitário de Componentes {#unit-testing-components}

Um componente pode ser testado de duas maneiras:

1. Caixa Branca ou Whitebox: Teste Unitário

   Os testes que são "testes de Caixa Branca" estão conscientes dos detalhes de implementação e dependências de um componente. Eles estão concentrados no **isolamento** do componente sob teste. Estes testes usualmente envolverão a imitação de algumas, se não de todos os filhos do teu componente, bem como a composição do estado da extensão e dependências (por exemplo, Vuex).

2. Caixa Preta ou Blackbox: Teste de Componente

   Os testes que são "testes de Caixa Preta" são não têm consciência dos detalhes de implementação de um componente. Estes testes imitam tão pouco quanto possível para testar a integração do teu componente e o sistema inteiro. Eles usualmente apresentam todos os componentes filhos e são considerados mais de uma "integração de teste". Consulte as [recomendações de Teste de Componente](#component-testing) abaixo.

### Recomendação {#recommendation}

- [Vitest](https://vitest.dev/)

  Já que a configuração oficial criada pela `create-vue` é baseada na [Vite](https://pt.vitejs.dev/), recomendamos o uso de uma abstração de teste unitário que pode influenciar a mesma conduta de configuração e transformação diretamente a partir da Vite. A [Vitest](https://vitest.dev/) é uma abstração de teste unitário desenhada especificamente para este propósito, criada e mantida pelos membros da equipa da Vue / Vite. Ela integra com projetos baseados em Vite com mínimo de esforço, e é estrondosamente rápida.

### Outras Opções {#other-options}

- [Peeky](https://peeky.dev/) é um outro executor de teste unitário rápido com integração de Vite de primeira classe. Ele é também criado por um membro da equipa principal da Vue e oferece uma interface de teste baseada em GUI.

- [Jest](https://jestjs.io/) é uma abstração de teste unitário popular, e pode ser posta a funcionar com a Vite através do pacote [vite-test](https://github.com/sodatea/vite-jest). No entanto, apenas recomendados a Jest se tiveres um conjunto de teste de Jest existente que precisa ser migrado para um projeto baseado na Vite, já que a Vitest oferece uma integração mais fluida e melhor desempenho.

## Teste de Componente {#component-testing}

Em aplicações de Vue, os componentes são os blocos de construção principais da interface do utilizador. Os componentes são portanto a unidade natural de isolamento quando isto aproxima-se da validação do comportamento da tua aplicação. A partir de uma perspetiva de granularidade, a teste de componente situa-se em algum lugar acima do teste unitário e pode ser considerado uma forma de teste de integração. Grande parte da tua aplicação em Vue deve ser coberta por um teste de componente e recomendamos que cada componente de Vue tenha o seu próprio ficheiro de especificação `spec`.

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

- [Vitest](https://vitest.dev/) para componentes ou funções de composição que apresentam de maneira desgovernada (por exemplo, a função [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) na VueUse). Os componentes e o DOM podem ser testados com o uso da [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro).

- [Teste de Componente da Cypress](https://on.cypress.io/component) para os componentes cujos comportamento esperado depende da apresentação apropriada dos estilos ou o acionar de eventos de DOM nativos. Pode ser usado com a Testing Library através da [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

As principais diferenças entre a Vitest e executores baseados no navegador são velocidade e contexto de execução. Resumidamente, executores baseados em navegador, como Cypress, podem capturar problemas que executores baseados em node, como Vitest, não podem (por exemplo, problemas de estilo, eventos verdadeiros de DOM nativo, cookies, armazenamento local (localStorage), e falhas da rede), mas os executores baseado em navegador são **ordens de magnitude mais lentos do que a Vitest** porque eles abrem um navegador, compilam as tuas folhas de estilos, e muito mais. A Cypress é um executor baseado em navegador que suporta a teste de componente. Leia a [página de comparação da Vitest](https://vitest.dev/guide/comparisons.html#cypress) para informações mais recentes comparando a Vitest e Cypress.

### Bibliotecas de Montagem {#mounting-libraries}

O teste de componente muitas vezes envolve a montagem do componente a ser testado em isolamento, acionar eventos de entrada de utilizador de maneira simulada, e afirmar sobre a saída do DOM apresentado. Existem bibliotecas utilitárias dedicadas que tornam estas tarefas mais simples.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) é a biblioteca de testes de componente de baixo nível oficial que foi escrita para oferecer aos utilizadores acesso às APIs específicas da Vue. É também a biblioteca de baixo nível sobre qual a `@testing-library/vue` é construída.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) é uma biblioteca de testes de Vue focada em testar componentes sem depender dos detalhes de implementação. A sua diretriz é que quanto mais os testes refletirem a maneira que o software é usado, mas confiança podem fornecer.

Nós recomendamos usar a `@vue/test-utils` para testar os componentes nas aplicações. A `@testing-library/vue` tem problemas com testes de componente assíncrono com Suspense, então deve ser usada com cautela.

### Outras Opções {#other-options-1}

- [Nightwatch](https://v2.nightwatchjs.org/) é uma executor de teste E2E com suporte a Teste de Componente de Vue. ([Projeto de Exemplo](https://github.com/nightwatchjs-community/todo-vue) na versão 2 da Nightwatch)

## Testes de Ponta-a-Ponta {#e2e-testing}

Enquanto os testes unitários oferecem aos programadores algum grau de confiança, os testes unitários e de componente estão limitados em suas capacidades de fornecer cobertura holística de uma aplicação quando implementada em produção. Como resultado, os testes de ponta-a-ponta (E2E, sigla em Inglês) oferecem cobertura naquilo que é provavelmente o aspeto mais importante de uma aplicação: aquilo que acontece quando utilizadores de fato usam as tuas aplicações.

Os testes de ponta-a-ponta concentram-se sobre o comportamento de aplicações de várias páginas que fazem requisições de rede contra a tua aplicação de Vue construída para produção. Eles muitas vezes envolvem levantar uma base de dados ou outro backend e pode até estar a executar contra um ambiente de qualidade.

Os testes de ponta-a-ponta muitas vezes capturarão problemas com o teu roteador, biblioteca de gestão de estado, componentes de alto nível (por exemplo, uma Aplicação (`App`) ou Esquema (`Layout`)), recursos públicos, ou qualquer manipulação de requisição. Conforme mencionado acima, eles capturam problemas críticos que podem ser impossíveis de capturar com testes unitários ou testes de componente.

Os testes de ponta-a-ponta não importam nenhum código da tua aplicação de Vue, mas dependem completamente do teste da tua aplicação com a navegação através de páginas inteiras em um navegador de verdade.

Os testes ponta-a-ponta validam muitas camadas na tua aplicação. Eles podem tanto mirar a tua aplicação construída localmente, ou mesmo um ambiente de qualidade (staging, em Inglês). O teste contra o teu ambiente de qualidade não apenas inclui o código do teu frontend e servidor estático, mas todos serviços e infraestrutura de backend associados.

> Quanto mais os teus testes espelharem a maneira que o teu software é usado, mais confiança eles podem dar-te - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Autor da Testing Library

Por testarem como as ações do utilizador impactam a tua aplicação, os testes E2E são muitas vezes a chave para segurança mais alta nos casos em queremos saber se uma aplicação está devidamente funcional ou não.

### Escolhendo uma Solução de Testes de Ponta-a-Ponta {#choosing-an-e2e-testing-solution}

Enquanto o teste de ponta-ponta (E2E) na Web tem ganhado uma reputação negativa por causa testes de pouca confiança e atraso do processos de desenvolvimento, ferramentas de E2E modernas têm feito progressos consideráveis para criar testes mais fiáveis, interativos, e úteis. Quando escolheres uma abstração de testes de ponta-a-ponta, as seguintes seções fornecem algum guia sobre coisas para manter em mente quando estiveres a escolher uma abstração de testes para a tua aplicação.

#### Testes Cruzado de Navegador {#cross-browser-testing}

Um dos benefício primários que o teste de ponta-a-ponta (E2E) é conhecida por ser sua capacidade de testar a tua aplicação através de vários navegadores. Enquanto isto pode parecer desejável para ter 100% cobertura cruzada de navegador, é importante notar que o teste cruzado de navegador tem reduzido os retornos sobre os recursos de uma equipa devido ao tempo adicional e poder de máquina exigido para executá-los consistentemente. Como resultado, é importante ser cuidadoso a respeito deste compromisso quando estiveres a escolher a quantidade de teste cruzado de navegador a tua aplicação precisa.

#### Laços de Reações Mais Rápidos {#faster-feedback-loops}

Um dos problemas primários com os testes de ponta-a-ponta (E2E) e o desenvolvimento é que executar o conjunto inteiro leva muito tempo. Normalmente, isto apenas é feito em condutas de integração e implementação contínua (CI/CD). As abstrações de testes de ponta-a-ponta modernas têm ajudado a resolver isto adicionado funcionalidades como execuções paralelas, que permitem as condutas de CI/CD muitas vezes executarem magnitudes mais rápido do que antes. Além disto, quando estiveres a programar localmente, a capacidade de executar seletivamente um único teste para a página sobre a qual estás a trabalhar enquanto também fornece o recarregamento instantâneo dos testes pode ajudar a impulsionar o fluxo de trabalho e produtividade do programador.

#### Experiência de Depuração de Primeira Classe {#first-class-debugging-experience}

Embora os programadores têm tradicionalmente dependido dos exames de registos em uma janela de terminal para ajudar a determinar o que correu mal em um teste, as abstrações de teste de ponta-a-ponta permitem os programadores influenciar ferramentas com as quais eles já estão familiarizados, por exemplo, ferramentas de programador do navegador.

#### Visibilidade no Modo Desgovernado {#visibility-in-headless-mode}

Quando os testes de ponta-a-ponta estão a executar em condutas de integração / implementação contínuas, eles estão muitas vezes a executar em navegadores desgovernados (por exemplo, nenhum navegador visível é aberto para o utilizador observar). Uma funcionalidade crítica das abstrações de testes de ponta-a-ponta modernas é a capacidade de ver fotografias e ou vídeos da aplicação durante os testes, fornecendo alguma compreensão no do porquê dos erros estarem a acontecer. Historicamente, era tedioso manter estas integrações.

### Recomendação {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  Em geral, acreditamos que a Cypress fornece a solução mais completa de E2E com funcionalidades como uma interface gráfica informativa, excelente capacidade de depuração, afirmações e implementações forjadas, execução paralela, fotografias e muito mais. Conforme mencionado acima, ela também fornece suporte para [Teste de Componente](https://docs.cypress.io/guides/component-testing/introduction). No entanto, ela apenas suporta navegadores baseados no Chromium e a Firefox.

### Outras Opções {#other-options-2}

- [Playwright](https://playwright.dev/) é também uma excelente solução de testes de ponta-a-ponta com uma gama maior de suporte de navegador (principalmente o WebKit). Consulte o [Porquê a Playwright](https://playwright.dev/docs/why-playwright) para mais detalhes.

- [Nightwatch v2](https://v2.nightwatchjs.org/) é uma solução de testes ponta-a-ponta baseada sno [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). Isto dá-lhe a gama de suporte de navegador mais alargada.

## Receitas {#recipes}

### Adicionar a Vitest à um Projeto {#adding-vitest-to-a-project}

Em um projeto de Vue baseado em Vite, execute:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

A seguir, atualize a configuração da Vite para adicionar o bloco da opção `test`:

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // ativa as APIs de teste global parecidas com as de Jest
    globals: true,
    // simular a DOM com `happy-dom`
    // (exige a instalação de `happy-dom` como uma dependência par)
    environment: 'happy-dom'
  }
})
```

:::tip DICA
Se estiveres a usar a TypeScript, adicione `vitest/globals` ao campo `types` do teu ficheiro `tsconfig.json`.

```json
// tsconfig.json

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Depois crie um ficheiro terminando em `*.test.js` no teu projeto. Tu podes colocar todos os ficheiros de teste em um diretório de teste na raiz do projeto, ou em diretórios de teste próximos do teus ficheiros de código-fonte. A Vitest procurará automaticamente por eles usando a convenção de nomeação.

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

  // afirmar a saída
  getByText('...')
})
```

Finalmente, atualizar o teu ficheiro `package.json` para adicionar o programa que executa o teste e executá-lo:

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

### Teste de Funções de Composição {#testing-composables}

> Esta seção presume que tens lido a seção [Funções de Composição](/guide/reusability/composables.html).

No que diz respeito a testes de funções de composição, podemos dividi-los em duas categorias: funções de composição que não dependem de uma instância de componente hospedeira, e funções de composição que dependem. 

Um constituível que depende de uma instância de componente hospedeira quando usa as seguintes APIs:

- Gatilhos do Ciclo de Vida
- Fornecimento (`provide`) / Injeção (`inject`) 

Se uma constituível apenas usar as APis de Reatividade, então ela pode ser testada diretamente invocando-a e afirmando os seus métodos ou estados retornados:

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

Uma constituível que depende dos gatilhos do ciclo de vida ou `provide` / `inject` precisam ser envolvidas em um componente hospedeiro para ser testado. Nós podemos criar um auxiliar como o seguinte:

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // suprimir aviso de ausência do modelo de marcação
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // retornar o resultado e a instância da aplicação
  // para teste do fornecimento ou desmontagem
  return [result, app]
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // imitar o fornecimento para o teste das injeções
  app.provide(...)
  // executar as afirmações
  expect(result.foo.value).toBe(1)
  // acionar o gatilho de desmontagem se necessário
  app.unmount()
})
```

Para funções de composição mais complexas, poderia também ser mais fácil testá-lo escrevendo os testes contra o componente envolvedor usando as técnicas de [Testes de Componente](#component-testing).

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
