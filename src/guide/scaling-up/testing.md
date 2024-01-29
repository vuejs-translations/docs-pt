<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Testes {#testing}

## Por que Testar? {#why-test}

Os testes automatizados ajudam a construir aplicações Vue complexas de forma rápida e confiante evitando regressões e encorajando a separar a nossa aplicação em funções, módulos, classes e componentes testáveis. Tal como em qualquer aplicação, a nova aplicação Vue pode quebrar de várias maneiras, e é importante que se possa capturar estes problemas e corrigi-los antes do lançamento. 

Neste guia, cobriremos a terminologia básica e forneceremos nossas recomendações sobre quais ferramentas escolher para a nossa aplicação Vue 3.

Existe uma seção específica de Vue cobrindo as funções de composição. Veja [Testando as Funções de Composição](#testing-composables) para mais detalhes.

## Quando Testar {#when-to-test}

Começamos testando com antecedência! Recomendamos começar escrevendo testes o quanto antes possível. Quanto mais esperamos para adicionar testes à nossa aplicação, mais dependências nossa aplicação terá, e mais difícil será começar.

## Tipos de Testes {#testing-types}

Quando projetamos a estratégia de testes da nossa aplicação Vue, devemos aproveitar os seguintes tipos de testes:

- **Unitário**: Verifica se as entradas de uma função, classe ou função de composição estão produzindo a saída esperada ou efeitos colaterais.
- **Componente**: Verifica se o nosso componente monta, interpreta, pode receber interações, e comporta-se como esperado. Esses testes importam mais código do que os testes unitários, são mais complexos, e exigem mais tempo para executarem.
- **Ponta-a-Ponta**: Verifica funcionalidades que abrangem várias páginas e faz requisições de rede reais contra a nossa aplicação Vue construída para produção. Esses testes frequentemente envolvem levantar um base de dados ou outro _backend_.

Cada tipo de teste desempenha um papel na estratégia de testes da nossa aplicação, e cada um nos protegerá contra diferentes tipos de problemas.

## Visão Geral {#overview}

Discutiremos brevemente sobre cada tipo de teste, como podem ser implementados às nossas aplicações Vue, e forneceremos algumas recomendações gerais.

## Testes Unitário {#unit-testing}

Os testes unitários são escritos para verificar se as pequenas e isoladas unidades de código estão funcionando como esperado. Um teste unitário normalmente cobre uma única função, classe, função de composição ou módulo. Testes unitários focam na exatidão lógica e só se preocupam com uma pequena porção da funcionalidade geral da aplicação. Eles podem simular grandes partes do ambiente da nossa aplicação (por exemplo, estado inicial, classes complexas, módulos de terceiros e requisições de rede).

Em geral, os testes unitários capturarão problemas com a lógica de negócio da função e com sua exatidão lógica.

Consideremos como exemplo esta função `increment`:

```js
// helpers.js
export function increment (current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Como ela é muito autossuficiente, será fácil invocar a função de incrementar e afirmar que ela retorna o que deve retornar, então escreveremos um Teste Unitário.

Se qualquer uma destas asserções falhar, é claro que o problema está contido dentro da função `increment`:

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('incrementa o número autal por 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('não incrementa o número atual além do máximo', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('tem um valor máximo padrão de 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Como mencionado anteriormente, testes unitários são normalmente aplicados sobre lógicas de negócio, componentes, classes, módulos ou funções autossuficientes que não envolvem a interpretação da interface gráfica da aplicação, requisições de rede, ou outras questões de ambiente.

Estes são normalmente módulos simples de JavaScript / TypeScript que não estão relacionados com Vue. Em geral, escrever testes unitários para a lógica de negócio em aplicações Vue não difere significativamente de aplicações usando outras abstrações.

Existem dois casos onde FAZEMOS teste unitários de funcionalidades específicas Vue:

1. Funções de Composição
2. Componentes

### Funções de Composição {#composables}

Uma categoria de funções específicas das aplicações Vue são as [Funções de Composição](/guide/reusability/composables), que podem exigir manipulação especial durante os testes. Veja a seção [Testando as Funções de Composição](#testing-composables) para mais detalhes.

### Testes Unitário de Componentes {#unit-testing-components}

Um componente pode ser testado de duas maneiras:

1. Caixa-branca: Testes Unitários

   Os testes que são "testes de caixa-branca" são conscientes dos detalhes da implementação e das dependências de um componente. Eles estão focados em **isolar** o componente sob teste. Esses testes normalmente envolverão simular algun ou todos os filhos do nosso componente, bem como configurar o estado de extensões e dependências (por exemplo, Pinia).

2. Caixa-preta: Testes de Componente

   Os testes que são "testes de caixa-preta" não são conscientes dos detalhes da implementação de um componente. Estes testes simulam o mínimo possível para testar a integração entre nosso componente e todo o sistema. Eles normalmente interpretam todos os componentes filhos e são considerados mais como um "teste de integração". Veja as [recomendações de Teste de Componente](#component-testing) abaixo.

### Recomendação {#recommendation}

- [Vitest](https://vitest.dev/)

  Desde que a configuração oficial criada por `create-vue` está baseada em [Vite](https://pt.vitejs.dev/), recomendamos usar uma abstração de testes unitários que pode aproveitar a mesma canalização de configuração e transformação diretamente a partir de Vite. [Vitest](https://vitest.dev/) é uma abstração de testes unitários projetada especificamente para este propósito, criada e mantida pelos membros do time Vue / Vite. Ela se integra com projetos baseados em Vite com o mínimo esforço, e é extremamente rápida.

### Outras Opções {#other-options}

- [Jest](https://jestjs.io/) é uma abstração popular de testes unitários. No entanto, apenas recomendamos Jest se houver um conjunto de testes Jest que precisa ser migrado para um projeto baseado em Vite, uma vez que Vitest oferece uma integração mais uniforme e um melhor desempenho.

## Testes de Componente {#component-testing}

Em aplicações Vue, componentes são os blocos de construção principais da interface do usuário. Componentes são portanto a unidade natural de isolamento quando se trata sobre validar o comportamento da aplicação. A partir de uma perspectiva de granularidade, testes de componente situam-se em algum lugar sobre os testes unitários e podem ser considerados uma forma de testes de integração. Grande parte da aplicação Vue deve ser coberta por testes de componente e recomendamos que cada componente Vue tenha o seu próprio arquivo `spec`.

Testes de componente devem capturar problemas relativos as propriedades do componente, eventos, _slots_ que ele fornece, estilos, classes, gatilhos do ciclo de vida, e mais.

Testes de componente não devem simular componentes filhos, mas testar as interações entre o componente e os seus filhos ao interagir com os componentes como o usuário faria. Por exemplo, um teste de componente seria clicar em um elemento como um usuário, ao invés de interagir de maneira programática com o componente.

Os testes de componente devem se concentrar sobre interfaces públicas do componente em vez dos detalhes de implementação interna. Para a maioria dos componentes, a interface pública é limitada a: eventos emitidos, propriedades, e _slots_. Ao testar, lembremos de **testar o que um componente faz, e não como ele faz**.

**FAZER**

- Para lógica **Visual**: afirme a intepretação correta baseada nas propriedades e _slots_ inseridos.
- Para lógica **Comportamental**: afirme atualizações de interpretação corretas ou eventos emitidos em resposta às ações feitas pelo usuário.

  No exemplo abaixo, demonstraremos um componente `Stepper` que tem um elemento DOM rotulado "increment" e pode ser clicado. Passamos uma propriedade chamada `max` que impede o `Stepper` de ser incrementado além de `2`, assim se clicarmos no botão 3 vezes, a interface do usuário deve continuar a mostrar `2`.

  Não sabemos nada sobre a implementação do `Stepper`, apenas que a "entrada" é a propriedade `max` e a "saída" é o estado do DOM como o usuário enxergará.

<VTCodeGroup>
  <VTCodeGroupTab label="Vue Test Utils">
  
  ```js
  const valueSelector =  '[data-testid=stepper-value]'
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

  </VTCodeGroupTab>

  <VTCodeGroupTab label="Cypress">

  ```js
  const valueSelector = '[data-testid=stepper-value]'
  const buttonSelector = '[data-testid=increment]'

  mount(Stepper, {
    props: {
      max: 1
    }
  })

  cy.get(valueSeletor).should('be.visible').and('contain.text', '0')
    .get(buttonSelector).click()
    .get(valueSelector).should('contain.text', '1')
  ```

  </VTCodeGroupTab>

  <VTCodeGroupTab label="Testing Library">
  
  ```js
  const { getByText } = render(Stepper, {
    props: {
      max: 1
    }
  })

  // Asserir implicitamente que "0" está dentro do componente
  getByText('0')

  const button = getByRole('button', { name: /increment/i })

  // Despachar um evento de clique ao nosso botão de incremento.
  await fireEvent.click(button)

  getByText('1')

  await fireEvent.click(button)
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

- **NÃO FAZER**

  Não afirmar o estado privado de uma instância de componente ou testar métodos privados de um componente. Testar detalhes de implementação tornam os testes frágeis, já que estão mais sujeitos a quebrarem ou exigirem atualizações quando a implementação mudar.

  O trabalho definitivo do componente é apresentar a saída DOM correta, assim os testes que focam na saída DOM fornecem o mesmo nível de garantia de exatidão (se não mais) enquanto são mais robustos e resilientes à mudanças.

  Não depender exclusivamente de testes _snapshot_. Afirmar strings HTML não caracterizam exatidão. Escrevamos testes com intencionalidade.

  Se um método precisa ser testado minuciosamente, considere extraí-lo em uma função utilitária isolada e escrever um teste unitário dedicado para ele. Se ele não puder ser extraído de maneira limpa, ele pode ser testado como parte de testes de componente, integração, ou ponta-a-ponta que o cubra.

### Recomendação {#recommendation-1}

- [Vitest](https://vitest.dev/) para componentes ou funções de composição que são interpretados de maneira acéfala (por exemplo, a função [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) de VueUse). Os componentes e o DOM podem ser testados com o uso de [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro).

- [Teste de Componente da Cypress](https://on.cypress.io/component) para componentes cujo comportamento esperado depende da interpretação apropriada dos estilos ou do acionamento de eventos DOM nativos. Pode ser usado com a Testing Library através de [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

As principais diferenças entre Vitest e executores baseados no navegador são a velocidade e o contexto de execução. Resumidamente, executores baseados em navegador, como Cypress, podem capturar problemas que executores baseados em node, como Vitest, não podem (por exemplo, problemas de estilo, eventos reais de DOM nativo, cookies, armazenamento local e falhas da rede), mas os executores baseados em navegador são **mais lentos do que Vitest em ordens de magnitude** porque eles abrem um navegador, compilam as folhas de estilo, e mais. Cypress é um executor baseado em navegador que suporta testes de componente. Leia a [página de comparação Vitest](https://vitest.dev/guide/comparisons.html#cypress) para as últimas informações comparando Vitest e Cypress.

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
