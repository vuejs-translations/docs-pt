# Ranhuras {#slots}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="Aula Gratuita Sobre Ranhuras de Vue.js"/>

## Conteúdo da Ranhura e a Saída de Ranhura {#slot-content-and-outlet}

Nós temos aprendido que os componentes podem aceitar propriedades, as quais podem ser valores de JavaScript de qualquer tipo. Mas quanto ao conteúdo do modelo de marcação? Em alguns casos, podemos desejar passar um fragmento de modelo de marcação para um componente filho, e permitir que o componente filho interprete o fragmento dentro do seu próprio modelo de marcação.

Por exemplo, podemos ter um componente `<FancyButton>` que suporta este tratamento:

```vue-html{2}
<FancyButton>
  Click me! <!-- conteúdo da ranhura -->
</FancyButton>
```

O modelo de marcação do `<FancyButton>` se parece com isto:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- saída de ranhura -->
</button>
```

O elemento `<slot>` é uma **saída de ranhura** que indica onde o **conteúdo de ranhura** fornecido pelo componente deve ser interpretado.

![diagrama da ranhura](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

E o DOM interpretado final:

```html
<button class="fancy-btn">Click me!</button>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>

Com as ranhuras, a `<FancyButton>` é responsável pela interpretação do `<button>` externo (e sua estilização fantástica), enquanto o conteúdo interno é fornecido pelo componente pai.

Um outro maneira de entender as ranhuras é comparando-os as funções de JavaScript:

```js
// componente pai passando o conteúdo de ranhura 
FancyButton('Click me!')

// "FancyButton" interpreta o conteúdo de ranhura no seu...
// próprio modelo de marcação
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

O conteúdo de ranhura não é apenas limitado ao texto. Ele pode ser qualquer conteúdo de modelo de marcação válido. Por exemplo, podemos passar vários elementos, ou mesmo outros componentes:

```vue-html
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>

Ao utilizar as ranhuras, o nosso `<FancyButton>` é mais flexível e reutilizável. Nós podemos agora utilizá-lo em diferentes lugares com conteúdo interno diferente, mas todos com a mesma estilização fantástica.

O mecanismo de ranhura dos componentes de Vue são inspirados pelo [elemento `<slot>` de Componente de Web nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), mas com capacidades adicionais que veremos mais tarde.

## Escopo de Interpretação {#render-scope}

O conteúdo de ranhura tem acesso ao escopo de dados do componente pai, porque é definido no componente pai. Por exemplo:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Aqui ambos interpolações de <span v-pre>`{{ message }}`</span> interpretarão o mesmo conteúdo.

O conteúdo de ranhura **não** tem acesso aos dados do componente filho. As expressões nos modelos de marcação de Vue podem apenas acessar o escopo em que são definidas, consistente com a possibilidade léxica da JavaScript. Em outras palavras:

> As expressões no modelo de marcação do componente pai apenas têm acesso ao escopo do componente pai; as expressões no modelo de marcação do componente filho apenas têm acesso ao escopo do componente filho.

## Conteúdo Retrocessivo {#fallback-content}

Existem casos onde é útil especificar conteúdo retrocessivo (por exemplo, padrão) para uma ranhura, para ser interpretado apenas quando nenhum conteúdo for fornecido. Por exemplo, em um componente `<SubmitButton>`:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

Nós podemos desejar que o texto "Submit" seja interpretado dentro do `<button>` se o componente pai não forneceu qualquer conteúdo de ranhura. Para tornar o "Submit" o conteúdo retrocessivo, podemos colocá-lo entre os marcadores `<slot>`:

```vue-html{3}
<button type="submit">
  <slot>
    Submit <!-- conteúdo retrocessivo -->
  </slot>
</button>
```

Agora quando utilizarmos `<SubmitButton>` em componente pai, sem nenhum conteúdo sendo fornecido para a ranhura:

```vue-html
<SubmitButton />
```

Isto interpretará o conteúdo retrocessivo, "Submit":

```html
<button type="submit">Submit</button>
```

Mas se fornecermos o conteúdo:

```vue-html
<SubmitButton>Save</SubmitButton>
```

Então o conteúdo fornecido será interpretado no lugar:

```html
<button type="submit">Save</button>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>

## Ranhuras Nomeadas {#named-slots}

Existem momentos quando é útil ter várias saídas de ranhura em um único componente. Por exemplo, em um componente `<BaseLayout>` com o seguinte modelo de marcação:

```vue-html
<div class="container">
  <header>
    <!-- Nós queremos o conteúdo de cabelo aqui -->
  </header>
  <main>
    <!-- Nós queremos o conteúdo principal aqui -->
  </main>
  <footer>
    <!-- Nós queremos o conteúdo de rodapé aqui -->
  </footer>
</div>
```

Para estes casos, o elemento `<slot>` tem um atributo especial, `name`, o qual pode ser utilizado para atribuir um identificador único para ranhuras diferentes assim podes determinar onde o conteúdo dever ser interpretado:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Uma saída de `<slot>` sem `name` implicitamente tem o nome de "default".

Em um componente pai utilizando `<BaseLayout>`, precisamos de uma maneira de passar vários fragmentos de conteúdo de ranhura, cada mirando uma saída de ranhura diferente. Isto é onde **ranhuras nomeadas** entram.

Para passar uma ranhura nomeada, precisamos utilizar um elemento `<template>` com a diretiva `v-slot`, e depois passar o nome da ranhura como um argumento para `v-slot`:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- conteúdo para a ranhura de cabeçalho -->
  </template>
</BaseLayout>
```

A `v-slot` tem um abreviação dedicada `#`, assim  `<template v-slot:header>` pode ser abreviada para apenas `<template #header>`. Pense disto como "interpretar este fragmento de modelo de marcação na ranhura 'header' do componente filho".

![diagrama de ranhuras nomeada](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

Aqui está o código passando conteúdo para todas as três ranhuras para `<BaseLayout>` utilizando a sintaxe abreviada:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

Quando um componente aceita ambos uma ranhura padrão e ranhuras nomeadas, todos os nós de alto nível que não são `<template>` são implicitamente tratados como conteúdo para a ranhura padrão. Assim o exemplo acima também pode ser escrito como:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- ranhura padrão implícita -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

Agora tudo dentro dos elementos `<template>` será passado às ranhuras correspondente. O resultado de HTML interpretado será: 

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

Além disso, isto pode ajudar-te a entender as ranhuras nomeadas melhor utilizando a analogia de função de JavaScript:

```js
// passando vários fragmentos de ranhura com diferentes nomes
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// "<BaseLayout>" interpreta-os em diferentes lugares
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Nomes de Ranhura Dinâmicos {#dynamic-slot-names}

Os [argumentos de diretiva dinâmicos](/guide/essentials/template-syntax#argumentos-dinâmicos) também funcionam sobre a `v-slot`, permitindo a definição de nomes de ranhura dinâmicos:

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- com a forma abreviada -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Toma nota que a expressão está sujeita às [restrições de sintaxe](/guide/essentials/template-syntax#diretivas) dos argumentos de diretiva dinâmicos.

## Ranhuras Isoladas {#scoped-slots}

Conforme discutido no [Escopo de Interpretação](#escope-de-interpretação), o conteúdo de ranhura não tem acesso ao estado no componente filho.

No entanto, existem casos onde poderia ser útil se um conteúdo da ranhura poder fazer uso dos dados de ambos escopo do componente pai e escopo do componente filho. Para alcançar isto, precisamos de uma maneira para o componente filho passar dados para uma ranhura quando estiver interpretando-o.

De fato, podemos fazer exatamente isto - nós podemos passar atributos para uma ranhura de saída da mesma maneira que passamos propriedades para um componente.

```vue-html
<!-- modelo de marcação do <MyComponent> -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

O recebimento das propriedades de ranhura é um pouco diferente de quando estamos utilizando uma única ranhura padrão versus a utilização de ranhuras nomeadas. Nós mostraremos como receber as propriedades utilizando uma única ranhura padrão primeiro, utilizando `v-slot` diretamente no marcador do componente filho:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![diagrama de ranhuras isoladas](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

As propriedades passadas para a ranhura pelo componente filho estão disponíveis como valor da diretiva `v-slot` correspondente, a qual pode ser acessada pelas expressões dentro da ranhura.

Tu podes pensar em uma ranhura isolada como uma função sendo passada para o componente filho. O componente filho então chama-a, passando propriedades como argumentos:

```js
MyComponent({
  // passando a ranhura padrão, mas como uma função
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // chamar a função da ranhura com as propriedades!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

De fato, isto está muito próximo de como as ranhuras isoladas são compiladas, e de como usaríamos as ranhuras isoladas no manual de [funções de interpretação](/guide/extras/render-function).

Repare que as `v-slot="slotProps"` correspondem a assinatura da função de ranhura. Tal como com os argumentos de função, podemos utilizar a desestruturação na `v-slot`:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Ranhuras Isoladas Nomeadas {#named-scoped-slots}

As ranhuras isoladas nomeadas funcionam de maneira semelhante - propriedades de ranhura são acessíveis como valor da diretiva `v-slot`: `v-slot:name="slotProps"`. Quando estiveres utilizando a forma abreviada, se parece com isto:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Passando as propriedades para uma ranhura nomeada:

```vue-html
<slot name="header" message="hello"></slot>
```

Nota que o `name` de uma ranhura não será incluído nas propriedades porque está reservado - então o `headerProps` resultante seria `{ message: 'hello' }`.

Se estiveres misturando as ranhuras nomeadas com a ranhura isolada padrão, precisas utilizar um marcador `<template>` explícito para a ranhura padrão. A tentativa de colocar a diretiva `v-slot` diretamente sobre o componente resultará em um erro de compilação. Isto é para evitar qualquer ambiguidade a respeito do escopo das propriedades da ranhura padrão. Por exemplo:

```vue-html
<!-- Este modelo de marcação não compilará -->
<template>
  <MyComponent v-slot="{ message }">
    <p>{{ message }}</p>
    <template #footer>
      <!-- "message" pertence à ranhura padrão, e não está disponível aqui -->
      <p>{{ message }}</p>
    </template>
  </MyComponent>
</template>
```

A utilização de um marcador `<template>` explícito para a ranhura padrão ajuda a tornar claro de que a propriedade `message` não está disponível dentro de outra ranhura:

```vue-html
<template>
  <MyComponent>
    <!-- Utilize ranhura padrão explícita -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

### Exemplo de Lista Fantástica {#fancy-list-example}

Tu podes estar perguntando a si mesmo o que seria um bom caso de uso para ranhuras isoladas. Aqui está um exemplo: imagine um componente `<FancyList>` que interpreta uma lista de itens - ele pode resumir a lógica para o carregamento de dados remoto, utilizando os dados para exibir uma lista, ou mesmo funcionalidades avançadas como paginação ou rolamento infinito. No entanto, queremos ser flexíveis a respeito da aparência de cada item e deixar a estilização de cada item para componente pai que está consumindo-o. Assim a utilização desejada se parece com isto:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

Dentro do `<FancyList>`, podemos interpretar o mesmo `<slot>` várias vezes com diferentes dados de item (repara que estamos utilizando a `v-bind` para passar um objeto como propriedades de ranhura):

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqFU11r20AQ/CtbhWIHZMlxkjZVHUMf2r6EUkgolCgPZ2mlHDndHXcnU9fVf++evixDP16Md9cztzszPgQftI52NQZJsLaZ4dqBRVfrTSp5pZVx8InJbH/HrYPCqApmUTx2PHCWynXcIQlDhcNKC+aQKoD1EZ0wzRe1EbdpQJ9pAIlGs9CsROpcLNOgBRBkIIAzTl9peICtyvch1BaNZBWGIPgLWmhGDKFyvoNMMGsJ4HGTGU315tCxQNOsY3/dcTTCKnSMYNs90I+HxwgAv3yjf7PpvkxJ1jE9Pmwfn95/FIvqkyGV1u0Fgs2Uxpw6kV8ADh5XKOkWlv/EBJbRDVbvfTNTQpkEzq5W25ubS2o1rfaeZBOEwYktf/fzAAYLaHo3OwdTmSlJHmmjtIVbyLHgEr/6av44642bhTAbLJs9nR9RXm6PIt75YzeIY6hU9kKtSpGTOaPDCnTZM5dlKmmjB16hqt18fg63m+7mlibaMVEjkT12enauJTC7b1WCe6Gchc81z5H2GUyi+ccdk/Bd1dRtDUpgtYQmpGXchOUbcT/UThnO/D0T/BdaUXAGD6hFTWuyI9EFEfltnkjxkKrlkm78V+hrMaRBcNgteEHhetWdJ1CW7nkSzjvFchIliqIhQIKfoAtl+kgDl51I09xbEgT8DWPuCbPlMh/reIxmz7yO2wX/k0aAWnTGAAlhKY5+vnB7TXJJJbHNJIBmuT8ggWv9o29tWfZSGlXLPCGoRGYWpaEzUbr55cV1jmXoU5xfvlvB6vo1FW+u3mJRnLf4Vms6vX97yk+ejo9UzJRcenf++O5ZURQD3fgnaX4DS1Wb6Q==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqFU11r20AQ/CtbhWIHZMlxkjZVHUMf2r6EUkgolCgPZ2mlHDndHXcnU9fVf++evixDP16Md9cztzszPgQftI52NQZJsLaZ4dqBRVfrTSp5pZVx8InJbH/HrYPCqApmUTx2PHCWynXcIQlDhcNKC+aQKoD1EZ0wzRe1EbdpQJ9pAIlGs9CsROpcLNOgBRBkIIAzTl9peICtyvch1BaNZBWGIPgLWmhGDKFyvoNMMGsJ4HGTGU315tCxQNOsY3/dcTTCKnSMYNs90I+HxwgAv3yjf7PpvkxJ1jE9Pmwfn95/FIvqkyGV1u0Fgs2Uxpw6kV8ADh5XKOkWlv/EBJbRDVbvfTNTQpkEzq5W25ubS2o1rfaeZBOEwYktf/fzAAYLaHo3OwdTmSlJHmmjtIVbyLHgEr/6av44642bhTAbLJs9nR9RXm6PIt75YzeIY6hU9kKtSpGTOaPDCnTZM5dlKmmjB16hqt18fg63m+7mlibaMVEjkT12enauJTC7b1WCe6Gchc81z5H2GUyi+ccdk/Bd1dRtDUpgtYQmpGXchOUbcT/UThnO/D0T/BdaUXAGD6hFTWuyI9EFEfltnkjxkKrlkm78V+hrMaRBcNgteEHhetWdJ1CW7nkSzjvFchIliqIhQIKfoAtl+kgDl51I09xbEgT8DWPuCbPlMh/reIxmz7yO2wX/k0aAWnTGAAlhKY5+vnB7TXJJJbHNJIBmuT8ggWv9o29tWfZSGlXLPCGoRGYWpaEzUbr55cV1jmXoU5xfvlvB6vo1FW+u3mJRnLf4Vms6vX97yk+ejo9UzJRcenf++O5ZURQD3fgnaX4DS1Wb6Q==)

</div>

### Componentes Sem Interpretação {#renderless-components}

O caso de uso de `<FancyList>` que discutimos acima resume ambas a lógica reutilizável (requisição de dados, paginação etc) e a saída visual, enquanto está delegando parte da saída visual para o componente consumidor através das ranhuras isoladas.

Se empurrarmos este conceito um pouco adiante, podemos surgir com componentes que apenas resumem a lógica e não interpretam nada por si mesmos - a saída visual é completamente delegada ao componente consumidor com as ranhuras isoladas. Nós chamamos este tipo de componente um **Componentes Sem Interpretação**.

Um exemplo de componente sem interpretação poderia ser um que resume a lógica do rastreio da posição atual do rato:

```vue-html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

Embora um padrão interessante, a maioria do que pode ser alcançada com os Componentes Sem Interpretação pode ser alcançada de uma maneira mais eficiente com a API de Composição, sem ficar sujeito a despesas gerais do encaixamento de componente adicionais. Depois, veremos como podemos implementar a mesma funcionalidade de rastreio do rato com uma [Função de Composição](/guide/reusability/composables).

Com isto dito, ranhuras isoladas ainda são úteis nos casos onde precisamos de ambos resumir a lógica **e** compor a saída visual, tal como no exemplo de `<FancyList>`.
