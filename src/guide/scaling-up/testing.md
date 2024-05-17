<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Testes {#testing}

## Por que Testar? {#why-test}

Os testes automatizados ajudam-nos e a nossa equipa a construirmos aplicações complexas de Vue rapidamente e confiantemente evitando regressões e encorajando-nos a separar a nossa aplicação em funções, módulos, classes, e componentes testáveis. Tal como acontece com qualquer aplicação, a nossa nova aplicação de Vue pode quebrar de várias maneiras, e é importante que possamos capturar estes problemas e os corrigir antes do lançamento. 

Neste guia, cobriremos a terminologia básica e forneceremos as nossas recomendações sobre quais ferramentas escolher para a nossa aplicação de Vue 3.

Existe uma seção específica da Vue cobrindo as funções de composição. Consultar [Testando as Funções de Composição](#testing-composables) por mais detalhes.

## Quando Testar? {#when-to-test}

Começamos testando no princípio! Nós recomendamos começar escrevendo testes o mais cedo possível. Quanto mais esperamos para adicionar os testes à nossa aplicação, mais dependências a nossa aplicação terá, e mais difícil será começar.

## Tipos de Testes {#testing-types}

Quando desenharmos a estratégia de testes da nossa aplicação de Vue, devemos influenciar os seguintes tipos de testes:

- **Unitário**: Verifica se as entradas à uma dada função, classe, função de composição estão produzindo a saída esperada ou efeitos colaterais.
- **Componente**: Verifica se o nosso componente monta, interpreta, pode ser interagido com, e comporta-se como esperado. Estes testes importam mais código do que os testes unitários, são mais complexos, e exigem mais tempo para executarem.
- **Ponta-a-Ponta**: Verifica se as funcionalidades que abrangem várias páginas e faz requisições de rede reais contra a nossa aplicação de Vue construída para produção. Estes testes frequentemente envolvem levantar um base de dados ou outro backend.

Cada tipo de teste desempenha um papel na estratégia de testes da nossa aplicação, e cada um nos protegerá contra diferentes tipos de problemas.

## Visão Geral {#overview}

Nós discutiremos brevemente sobre cada tipo de teste, como estes podem ser implementados às nossas aplicações de Vue, e forneceremos algumas recomendações gerais.

## Teste Unitário {#unit-testing}

Os testes unitários são escritos para verificar se as pequenas e isoladas unidades de código estão funcionando como esperado. Um teste unitário normalmente cobre uma única função, classe, função de composição, ou módulo. Os testes unitários focam-se na exatidão lógica e os mesmos apenas preocupam-se com uma pequena porção da funcionalidade geral da aplicação. Estes podem simular grandes partes do ambiente da nossa aplicação (por exemplo, estado inicial, classes complexas, módulos de terceiros, e requisições de rede).

No geral, os testes unitários capturarão os problemas com a lógica de negócio da função e com a exatidão lógica.

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

Uma vez que é muito autónoma, será fácil invocar a função `increment` e asserir que esta retorna o que é suposto retornar, então escreveremos um Teste Unitário.

Se quaisquer uma destas asserções falhar, está claro que o problema está contido dentro da função `increment`:

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

Conforme mencionado anteriormente, o teste unitário é normalmente aplicado à lógica de negócio, componentes, classes, módulos ou funções autónomas que não envolvem a interpretação da interface gráfica da aplicação, requisições de rede, ou outras preocupações ambientais.

Estes são normalmente módulos simples de JavaScript ou TypeScript que não estão relacionados com a Vue. No geral, escrever testes unitários para lógica de negócio em aplicações de Vue não difere significativamente das aplicações usando outras abstrações.

Existem duas casos onde REALIZAMOS teste unitários de funcionalidades específicas da Vue:

1. Funções de Composição
2. Componentes

### Funções de Composição {#composables}

Uma categoria de funções específicas às aplicações de Vue são as [Funções de Composição](/guide/reusability/composables), que podem exigir manipulação especial durante os testes. Consultar a seção [Testando as Funções de Composição](#testing-composables) abaixo por mais detalhes.

### Teste Unitário dos Componentes {#unit-testing-components}

Um componente pode ser testado de duas maneiras:

1. Caixa Branca: Teste Unitário

   Os testes que são "testes de Caixa Branca" estão conscientes dos detalhes da implementação e dependências dum componente. Estes estão focados em **isolar** o componente sob teste. Estes testes normalmente envolverão simular algumas, se não todos os filhos do nosso componente, bem como configurar o estado da extensão ou dependências (por exemplo, a Pinia).

2. Caixa Preta: Teste de Componente

   Os testes que são "testes de Caixa Preta" não estão conscientes dos detalhes da implementação dum componente. Estes testes simulam apenas o possível para testar a integração do nosso componente e do nosso sistema inteiro. Estes normalmente interpretam todos os componentes filhos e são considerados mais dum "teste de integração". Consultar as [recomendações de Teste de Componente](#component-testing) abaixo.

### Recomendação {#recommendation}

- [Vitest](https://vitest.dev/)

  Uma vez que a configuração oficial criada pela `create-vue` está baseada na [Vite](https://pt.vitejs.dev/), recomendamos usar uma abstração de teste unitário que pode influenciar diretamente a mesma conduta de configuração e transformação a partir da Vite. A [Vitest](https://vitest.dev/) é uma abstração de teste unitário desenhada especificamente para este propósito, criada e mantida pelos membros da equipa da Vue e Vite. Esta integra-se com os projetos baseados na Vite com o mínimo esforço, e é extremamente rápida.

### Outras Opções {#other-options}

- [Jest](https://jestjs.io/) é uma abstração de teste unitário popular. No entanto, apenas recomendamos a Jest se houver um conjunto de teste de Jest que precisa ser migrado a um projeto baseado na Vite, uma que a Vitest oferece uma integração mais transparente e um desempenho melhor.

## Teste de Componente {#component-testing}

Nas aplicações de Vue, os componentes são os principais blocos de construção da interface do utilizador. Os componentes são, portanto, a unidade natural da isolação quando se trata de validar o comportamento da nossa aplicação. Do ponto de vista da granularidade, os testes de componentes situam-se algures acima dos testes unitários e podem ser considerados uma forma de testes de integração. Grande parte da nossa aplicação de Vue deve ser coberta por um teste de componente e recomendamos que cada componente da Vue tenha o seu próprio ficheiro de especificações.

Os testes de componentes devem detetar problemas relacionados com as propriedades, eventos, ranhuras que o componente fornece, estilos, classes, funções gatilhos do ciclo de vida e muito mais.

Os testes de componentes não devem simular componentes filhos, mas sim testar as interações entre o nosso componente e seus filhos, interagindo com os componentes como um utilizador faria. Por exemplo, um teste de componente deve clicar num elemento como um utilizador faria, em vez de interagir programaticamente com o componente.

Os testes de componentes devem centrar-se nas interfaces públicas do componente e não nos detalhes de implementação interna. Para a maioria dos componentes, a interface pública é limitada a: eventos emitidos, propriedades e ranhuras. Quando testarmos, lembremos-nos de **testar o que um componente faz, e não como este faz**.

**FAZER**

- Para lógica **Visual**: asserir a saída correta da interpretação baseada nas propriedades e ranhuras introduzidas.
- Para lógica **Comportamental**: asserir atualizações corretas da interpretação ou eventos emitidos em resposta aos eventos de entrada do utilizador.

  No exemplo abaixo, demonstramos um componente `Stepper` que tem um elemento de DOM rotulado "increment" e pode ser clicado. Nós passamos uma propriedade chamada `max` que impede o `Stepper` de ser incrementado além de `2`, então se clicarmos no botão 3 vezes, a interface do utilizador ainda deve dizer `2`.

  Nós não sabemos nada sobre a implementação do `Stepper`, apenas que a "entrada" é a propriedade `max` e a "saída" é o estado do DOM como o utilizador o verá.

<VTCodeGroup>
  <VTCodeGroupTab label="Vue Test Utils">
  
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

  cy.get(valueSelector).should('be.visible').and('contain.text', '0')
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

  Não asserir o estado privado da instância dum componente ou testar métodos privados dum componente. Testar detalhes de implementação fragiliza os testes, uma vez que estes estão sujeitos a quebrarem ou exigem atualizações quando a implementação mudar.

  O trabalho definitivo do componente é interpretar a saída correta do DOM, então os testes que focam-se na saída do DOM fornecem o mesmo nível de garantia de exatidão (se não mais) enquanto é mais robusto e resiliente à mudança.

  Não depender exclusivamente dos testes instantâneos. Asserir as sequências de caracteres de HTML não descreve exatidão. Precisamos escrever os testes intencionalidade.

  Se um método precisar ser testado meticulosamente, devemos considerar extraí-lo para uma função utilitária autónoma e escrever um teste unitário dedicado a esta. Se não poder ser extraída claramente, pode ser testada como uma parte dum teste de componente, integração, ou de ponta-a-ponta que a cobre.

### Recomendação {#recommendation-1}

- [Vitest](https://vitest.dev/) para componentes ou funções de composição que interpretam-se de maneira desgovernada (por exemplo, a função [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) na VueUse). Os componentes e o DOM podem ser testados usando a [`@vue/test-utils`](https://github.com/vuejs/test-utils).

- [Teste de Componente da Cypress](https://on.cypress.io/component) para os componentes cujo comportamento esperado depende da interpretação correta dos estilos ou acionam eventos nativos do DOM. Esta pode ser usada com a Testing Library através da [`@testing-library/cypress`](https://testing-library.com/docs/cypress-testing-library/intro).

As principais diferenças entre a Vitest e outras ferramentas que executam testes com a assistência do navegador são a velocidade e o contexto da execução. Em resumo, as ferramentas que executam testes com a assistência do navegador, como a Cypress, conseguem capturar problemas que ferramentas que executam testes sem a assistência do navegador, como a Vitest, não consegue (por exemplo, problemas de estilo, eventos nativos do DOM, biscoitos (cookies), armazenamento local, falhas de rede), mas as ferramentas que executam testes com a assistência do navegador são _muito mais lentas do que a Vitest_ porque estas precisam abrir um navegador, compilar as nossas folhas de estilo, e muito mais. A Cypress é uma ferramenta de execução de testes com assistência do navegador que suporta testes de componente. Nós podemos consultar a [página de comparação da Vitest](https://vitest.dev/guide/comparisons#cypress) por informação mais atualizada comparando a Vitest e a Cypress.

### Bibliotecas de Montagem {#mounting-libraries}

O teste de componente muitas vezes envolve a montagem isolada do componente a ser testado, acionar eventos de entrada do utilizador de maneira simulada, e asserir sobre a saída do DOM apresentado. Existem bibliotecas utilitárias dedicadas que simplificam estas tarefas.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) é a biblioteca oficial de testes de componente de baixo nível escrita para oferecer aos utilizadores acesso às APIs específicas da Vue. É também a biblioteca de baixo nível sobre qual a `@testing-library/vue` foi construída.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) é uma biblioteca de testes de Vue focada em testar componentes sem depender dos detalhes de implementação. A sua diretriz é que quanto mais os testes refletirem a maneira que o software é usado, mais confiáveis são.

Nós recomendamos usar a `@vue/test-utils` para testar os componentes nas aplicações. A `@testing-library/vue` tem problemas com testes de componente assíncrono com Suspense, por isto deve ser usada com cautela.

### Outras Opções {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) é uma ferramenta de execução de teste de ponto-a-ponta com suporte a Testes de Componente de Vue. ([Projeto de Exemplo](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) para testes de componentes entre os navegadores que dependem da interação nativa do utilizador baseado na automatização padronizada. Esta também pode ser usada com a Testing Library.

## Testes de Ponta-a-Ponta {#e2e-testing}

Embora os testes unitários ofereçam aos programadores um certo grau de confiança, os testes unitários e de componentes são limitados na sua capacidade de fornecer uma cobertura holística duma aplicação quando implantada em produção. Consequentemente, os testes de ponta-a-ponta fornecem cobertura sobre o que é, sem dúvida, o aspeto mais importante duma aplicação: o que acontece quando os utilizadores usam efetivamente as nossas aplicações.

Os testes de ponta-a-ponta concentram-se no comportamento da aplicação de várias páginas que faz requisições de rede contra a nossa aplicação de Vue construída para produção. Estes envolvem frequentemente a criação duma base de dados ou outro backend e podem até ser executadas num ambiente de teste em tempo real.

Os testes de ponta-a-ponta detetam frequentemente problemas com o nosso roteador, biblioteca de gestão de estados, componentes de alto nível (por exemplo, uma aplicação ou um esquema), recursos públicos ou qualquer tratamento de requisições. Como já foi referido, estes detetam problemas críticos que podem ser impossíveis de detetar com os testes unitários ou testes de componentes.

Os testes de ponta-a-ponta não importam nenhum código da nossa aplicação de Vue, mas dependem completamente de testar a nossa aplicação navegando por páginas inteiras num navegador de verdade.

Os testes de ponta-a-ponta validam muitas das camadas da nossa aplicação. Estes podem ser direcionados a nossa aplicação criada localmente ou mesmo a um ambiente de teste em tempo real. Os testes efetuados no nosso ambiente de teste incluem não só o nosso código de frontend e o servidor estático, mas também todos os serviços e infraestruturas de backend associados.

> Quanto mais os testes refletirem a maneira que o nosso software é usado, mas confiáveis serão - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Autor da Testing Library

Ao testar como o impacto das ações do utilizador na nossa aplicação, os testes de ponta-a-ponta são muitas vezes a chave para uma maior confiança no bom funcionamento duma aplicação.

### Escolhendo uma Solução de Testes de Ponta-a-Ponta {#choosing-an-e2e-testing-solution}

Embora os testes de ponta-a-ponta na Web tenham ganho uma reputação negativa de testes não fiáveis e de atrasarem os processos de desenvolvimento, as ferramentas modernas de testes de ponta-a-ponta deram passos adiante para criar testes mais fiáveis, interativos e úteis. Ao escolher uma abstração de testes de ponta-a-ponta, as secções seguintes fornecem algumas orientações sobre os aspetos a ter em conta ao escolher uma abstração de testes para a nossa aplicação.

#### Testes entre Navegadores {#cross-browser-testing}

Um dos principais benefícios pelos quais os testes de ponta-a-ponta são conhecidos é a sua capacidade de testar a nossa aplicação em vários navegadores. Embora possa parecer desejável ter 100% de cobertura entre os navegadores, é importante notar que os testes entre navegadores têm um retorno decrescente nos recursos duma equipa devido ao tempo adicional e à potência da máquina necessários para os executar consistentemente. Como resultado, é importante ter em conta este compromisso ao escolher a quantidade de testes entre navegadores de que a nossa aplicação necessita.

#### Ciclos de Reações Mais Rápidos {#faster-feedback-loops}

Um dos principais problemas dos testes e do desenvolvimento de ponta-a-ponta é que a execução de todo o conjunto demora muito tempo. Normalmente, isto só é feito em condutas de integração e implantação contínuas. As abstrações modernas de testes de ponta-a-ponta ajudaram a resolver isto adicionando recursos como paralelismo, que permite que a integração contínua e as condutas de implantação contínua sejam executadas com mais rapidez do que antes. Além disto, ao desenvolver localmente, a capacidade de executar seletivamente um único teste para a página em que trabalhamos, ao mesmo tempo que fornece a recarga a quente de testes, podem ajudar a impulsionar o fluxo de trabalho e a produtividade dum programador.

#### Experiência de Depuração de Primeira Classe {#first-class-debugging-experience}

Embora os programadores tenham tradicionalmente dependido da analise de registos numa janela de terminal para determinar o que correu mal num teste, as abstrações modernas de teste de ponta-a-ponta permitem que os programadores influenciem ferramentas com as quais já estão familiarizados, por exemplo, as ferramentas de programação do navegador.

#### Visibilidade no Modo Desgovernado {#visibility-in-headless-mode}

Quando os testes de ponta-a-ponta são executados nas condutas de integração ou implantação contínuas, são frequentemente executados nos navegadores desgovernado (ou seja, não é aberto nenhum navegador visível para o utilizador assistir). Uma funcionalidade crítica das modernas abstrações de teste de ponta-a-ponta é a capacidade de ver fotografias e/ou vídeos da aplicação durante o teste, fornecendo alguma informação sobre a razão pela qual os erros acontecem. Historicamente, era tedioso manter estas integrações.

### Recomendação {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  Geralmente, acreditamos que o Cypress fornece a solução mais completa de ponta-a-ponta com recursos como uma interface gráfica informativa, excelente capacidade de depuração, asserções e esboços integrados, resistência a falhas, paralelismo e fotografias. Tal como já foi referido, este também suporta o [teste de componentes](https://docs.cypress.io/guides/component-testing/introduction). Esta suporta navegadores baseados no Chromium, Firefox, Electron. O suporte de Webkit está disponível, mas marcado como experimental.

### Outras Opções {#other-options-2}

- [Playwright](https://playwright.dev/) é também uma excelente solução de teste de ponta-a-ponta que suporta todos os motores de apresentação modernos incluindo Chromium, Webkit, e Firefox. Podemos testar no Windows, Linux, e macOS, localmente ou sobre integração contínua, desgovernado ou governado com emulação móvel nativa do Google Chrome para Android e Mobile Safari.

- [Nightwatch](https://nightwatchjs.org/) é uma solução de teste ponta-a-ponta baseada no [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). Isto dá-lhe a mais ampla gama de suporte de navegadores, incluindo teste móvel nativo. As soluções baseadas na Selenium serão mais lentas do que a Playwright ou Cypress.

- [WebdriverIO](https://webdriver.io/) é uma abstração de automatização de testes para Web e móveis baseada no protocolo WebDriver.

## Receitas {#recipes}

### Adicionando a Vitest a um Projeto {#adding-vitest-to-a-project}

Num projeto de Vue baseado na Vite, executamos:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

Em seguida, atualizamos a configuração da Vite para adicionar o bloco de opções `test`:

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // ativar as APIs de teste globais semelhantes a jest
    globals: true,
    // simular o DOM com happy-dom
    // (exige a instalação do happy-dom como uma dependência de pares)
    environment: 'happy-dom'
  }
})
```

:::tip DICA
Se nós usarmos a TypeScript, adicionamos `vitest/globals` ao campo `types` no nosso `tsconfig.json`:

```json
// tsconfig.json

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Depois, criamos um ficheiro terminado em `*.test.js` em nosso projeto. Nós podemos colocar todos os ficheiros de teste num diretório de teste na raiz do projeto ou em diretórios de teste junto aos nossos ficheiros de origem. A Vitest procurá-los-á utilizando automaticamente a convenção de nomes:

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

  // asserir a saída
  getByText('...')
})
```

Finalmente, atualizamos o `package.json` para adicionar o programa de teste e executá-lo:

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

### Testes de Funções de Composição {#testing-composables}

> Esta secção parte pressupõe a leitura da secção [Funções de Composição](/guide/reusability/composables).

Quando se trata de testar as funções de composição, podemos dividi-los em duas categorias: funções de composição que dependem duma instância de componente hospedeiro e funções de composição que dependem.

Uma função de composição que depende duma instância de componente hospedeiro quando usa as seguintes APIS:

- Funções Gatilhos do Ciclo de Vida
- Fornecer / Injetar

Se uma função de composição apenas usar as APIs de reatividade, pode ser testado invocando-o diretamente e asserindo o seu estado ou métodos retornados:

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

Uma função de composição que depende das funções gatilhos do ciclo de vida ou de fornecer e injetar precisa ser envolvida num componente hospedeiro para ser testada. Nós podemos criar um auxiliar como o seguinte:

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // suprimir aviso de modelo de marcação em falta
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // retornar o resultado e a instância da aplicação
  // para testar o fornecer ou desmontar
  return [result, app]
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // simular o fornecer para testar as injeções
  app.provide(...)
  // executar as asserções
  expect(result.foo.value).toBe(1)
  // acionar a função gatilho de desmontagem se necessário
  app.unmount()
})
```

No caso de funções de composição mais complexas, também pode ser mais fácil testá-las escrevendo testes para o componente envolvente usando técnicas de [teste de componentes](#component-testing).

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
