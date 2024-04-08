# Fundamentos dos Componentes {#components-basics}

Os componentes permitem-nos separar os elementos da interface em pedaços independentes e reutilizáveis, e pensar sobre cada pedaço em isolamento. É comum para uma aplicação ser organizada numa árvore de componentes encaixados:

![Árvore de Componente](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Isto é muito semelhante a como encaixamos os elementos de HTML nativos, mas a Vue implementa o seu próprio modelo de componente que permite-nos encapsular o conteúdo personalizado e a lógica em cada componente. A Vue também lida muito bem com os Componentes da Web nativos. Se estivermos curiosos sobre a relação entre os Componentes da Vue e os Componentes da Web nativos, [podemos ler mais sobre isto neste artigo](/guide/extras/web-components).

## Definindo um Componente {#defining-a-component}

Quando usamos uma etapa de construção, normalmente definimos cada componente num ficheiro dedicado usando a extensão `.vue` - conhecido como [Componente de Ficheiro Único](/guide/scaling-up/sfc) (SFC, que é a forma abreviada no idioma original):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

Quando não usamos uma etapa de construção, um componente da Vue pode ser definido como um simples objeto de JavaScript contendo opções específicas da Vue: 

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // Também pode mirar um modelo de marcação no DOM:
  // template: '#my-template-element'
}
```

</div>

Neste exemplo o modelo de marcação é incorporado como uma sequência de caracteres de JavaScript, a qual a Vue compilará rapidamente. Nós também podemos usar um seletor de identificador único apontando para um elemento (normalmente elementos `<template>` nativos) - a Vue usará o seu conteúdo como fonte do modelo de marcação.

O exemplo acima define um único componente e exporta-o como exportação padrão dum ficheiro `.js`, mas podemos usar exportações nomeadas para exportar vários componentes a partir do mesmo ficheiro.

## Usando um Componente {#using-a-component}

:::tip NOTA
Nós usaremos a sintaxe de SFC para o resto deste guia - os conceitos em torno dos componentes são os mesmos independentemente de se estivermos usando uma etapa de construção ou não. A seção dos [Exemplos](/examples/) mostra o uso do componente em ambos cenários.
:::

Para usarmos um componente filho, precisamos de importá-lo no componente pai. Assumindo que colocamos o nosso componente contador dentro dum ficheiro chamado `ButtonCounter.vue`, o componente será exposto como exportação padrão do ficheiro:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Para expormos o componente importado ao nosso modelo de marcação, precisamos [registá-lo](/guide/components/registration) com a opção `components`. O componente estará então disponível como um marcador usando a chave sob a qual está registado.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Com o `<script setup>`, os componentes importados são disponibilizados automaticamente ao modelo de marcação.

</div>

Também é possível registar um componente globalmente, tornando-o disponível para todos os componentes numa dada aplicação sem ter de importá-lo. As vantagens e inconvenientes do registo global contra o registo local é discutido na seção de [Registo de Componente](/guide/components/registration) dedicada.

Os componentes podem ser reutilizados quantas vezes quisermos:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Repara que quando clicamos sobre os botões, cada um mantém o seu próprio `count` separado. Isto porque cada vez que usarmos um componente, uma nova **instância** do mesmo é criada.

Nos componentes de ficheiro único, é recomendado usar os nomes de marcadores em `PascalCase` para os componentes filhos para diferenciá-los dos elementos de HTML nativos. Apesar dos nomes dos marcadores de HTML nativos serem insensíveis a caracteres maiúsculos e minúsculos, o componente de ficheiro único da Vue é um formato compilado então somos capazes de usar nomes de marcadores sensíveis a caracteres maiúsculos e minúsculos nele. Nós também somos capazes de usar `/>` para fechar um marcador.

Se estivermos escrevendo os nossos modelos de marcação diretamente no DOM (por exemplo, como conteúdo dum elemento `<template>` nativo), o modelo de marcação estará sujeito ao comportamento de analise sintática de HTML nativo do navegador. Em tais casos, precisaremos usar `kebab-case` e fechar explicitamente os marcadores dos componentes:

```vue-html
<!-- se este modelo de marcação for escrito no DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Consulte as [Advertências da Analise Sintática do Modelo de Marcação no DOM](#in-dom-template-parsing-caveats) por mais detalhes.

## Passando as Propriedades {#passing-props}

Se estivermos construindo um blogue, precisaremos possivelmente dum componente representando uma publicação de blogue. Nós queremos que todas as publicações de blogue partilhem a mesma disposição visual, mas com conteúdo diferente. Tal componente não será útil a menos que possamos passar dados a este, tais como o título e conteúdo da publicação específica que queremos exibir. É onde as propriedades entram.

As propriedades são atributos personalizados que podemos registar sobre um componente. Para passarmos um título ao nosso componente de publicação de blogue, devemos declará-lo na lista de propriedades que este componente aceita, usando a <span class="options-api">opção [`props`](/api/options-state#props)</span><span class="composition-api">macro [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Quando um valor for passado a um atributo da propriedade, este torna-se uma propriedade sobre a instância deste componente. O valor desta propriedade é acessível dentro do modelo de marcação e sobre o conteúdo `this` do componente, tal como qualquer outra propriedade do componente.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

A `defineProps` é uma macro do momento da compilação que apenas está disponível dentro do `<script setup>` e não precisa de ser explicitamente importada. As propriedades declaradas são automaticamente expostas ao modelo de marcação. A `defineProps` também retorna um objeto que contém todas as propriedades passadas ao componente, para que possamos acessá-las na JavaScript se necessário:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Consulte também: [Tipificando as Propriedades do Componente](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Se não estivermos usando o `<script setup>`, as propriedades devem ser declaradas usando a opção `props`, e o objeto de `props` será passado à `setup()` como primeiro argumento:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Um componente pode ter quantas propriedades acharmos conveniente, por padrão, qualquer valor pode ser passado a qualquer propriedade.

Depois duma propriedade ser registada, podemos passar os dados à esta como um atributo personalizado, desta maneira:

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

Numa aplicação normal, no entanto, possivelmente teremos um vetor de publicações no nosso componente pai:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

</div>

Então desejaremos interpretar um componente para cada uma, usando `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Repara como a `v-for` é usada para passar os valores dinâmicos da propriedade. Isto é especialmente útil quando não sabemos antecipadamente qual é o exato conteúdo que iremos interpretar.

É tudo o que precisamos saber sobre as propriedades por agora, mas depois de terminarmos a leitura desta página e estivermos confortáveis com o seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre as [Propriedades](/guide/components/props).

## Ouvindo Eventos {#listening-to-events}

Conforme desenvolvermos o nosso componente `<BlogPost>`, algumas funcionalidades podem precisar de comunicarem-se de volta ao componente pai. Por exemplo, podemos decidir incluir uma funcionalidade de acessibilidade para ampliar o texto das publicações de blogue, enquanto deixamos o resto da página no seu tamanho padrão.

No componente pai, podemos suportar esta funcionalidade adicionando uma <span class="options-api">propriedade de dados</span><span class="composition-api">referência</span> `postFontSize`:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

A qual pode ser usada no modelo de marcação para controlar o tamanho da fonte de todas as publicações de blogue:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Agora adicionaremos um botão ao modelo de marcação do componente `<BlogPost>`:

```vue{5}
<!-- BlogPost.vue, omitindo <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

O botão ainda não faz nada - queremos clicar sobre o botão para comunicar ao pai que este deve ampliar o tamanho da fonte do texto de todas as publicações. Para solucionarmos este problema, os componentes fornecem um sistema de eventos personalizados. O pai pode escolher ouvir qualquer evento sobre a instância do componente filho com a `v-on` ou `@`, tal como faríamos com um evento de DOM nativo:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Então o componente filho pode emitir um evento sobre si mesmo chamando o [método **`$emit`**](/api/component-instance#emit) embutido, passando o nome do evento:

```vue{5}
<!-- BlogPost.vue, omitindo <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Graças ao ouvinte `@enlarge-text="postFontSize += 0.1"`, o pai receberá o evento e atualizará o valor da `postFontSize`.

<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Nós podemos opcionalmente declarar os eventos emitidos usando a <span class="options-api">opção [`emits`](/api/options-state#emits)</span><span class="composition-api">macro [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Isto documenta todos os eventos que um componente emite e [valida-os](/guide/components/events#events-validation) opcionalmente. Também permite a Vue evitar aplicá-los implicitamente como ouvintes nativos ao elemento de raiz do componente filho.

<div class="composition-api">

Semelhante à `defineProps`, a `defineEmits` apenas é utilizável no `<script setup>` e não precisa de ser importada. Esta retorna uma função `emit` que é equivalente ao método `$emit`. Esta pode ser usada para emitir eventos na seção `<script setup>` dum componente, onde `$emit` não está diretamente acessível:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Consulte também: [Tipificando as Emissões do Componente](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Se não estivermos usando o `<script setup>`, podemos declarar os eventos emitidos usando a opção `emits`. Nós podemos acessar a função `emit` como uma propriedade do contexto de configuração (passada à `setup()` como segundo argumento):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

É tudo que precisamos saber sobre os eventos personalizados dos componentes por agora, mas depois que terminarmos a leitura desta página e estivermos confortáveis como o seu conteúdo, recomendamos voltar para ler o guia completa sobre os [Eventos Personalizados](/guide/components/events).

## Distribuição de Conteúdo com as Ranhuras {#content-distribution-with-slots}

Tal como com os elementos de HTML, é muitas vezes útil ser capaz de passar conteúdo para um componente, desta maneira:

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

O qual pode interpretar alguma coisa do tipo:

:::danger ISTO É UM ERRO PARA FINS DE DEMONSTRAÇÃO
Something bad happened.
:::

Isto pode ser alcançado usando o elemento `<slot>` personalizado da Vue:

```vue{4}
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Conforme veremos acima, usamos `<slot>` como uma reserva de espaço de onde queremos que conteúdo seja interpretado - e é isto. Terminamos!

<div class="options-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

É tudo o que precisamos saber sobre as ranhuras por agora, mas depois de terminarmos a leitura desta página e estivermos confortáveis com o seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre as [Ranhuras](/guide/components/slots).

## Componentes Dinâmicos {#dynamic-components}

Algumas vezes é útil alternar dinamicamente entre os componentes, como numa interface composta por abas:

<div class="options-api">

[Abrir o exemplo na Zona de Testes](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Abrir o exemplo na Zona de Testes](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

O exemplo acima foi possível através do elemento `<component>` da Vue com o atributo especial `is`:

<div class="options-api">

```vue-html
<!-- O componente muda quando `currentTab` mudar -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- O componente muda quando `currentTab` mudar -->
<component :is="tabs[currentTab]"></component>
```

</div>

No exemplo acima, o valor passado para `:is` pode conter ou:

- a sequência de caracteres do nome dum componente registado, OU
- o verdadeiro objeto do componente importado

Nós também podemos usar o atributo `is` para criar os elementos de HTML normais.

Quando alternamos entre vários componentes com o `<component :is="...">`, um componente será desmontado quando este for alternado para fora. Nós podemos forçar os componentes inativos para manterem-se "vivos" com o [componente `<KeepAlive>`](/guide/built-ins/keep-alive) embutido.

## Advertências da Analise do Modelo de Marcação no DOM {#in-dom-template-parsing-caveats}

Se estivermos escrevendo os nossos modelos de marcação de Vue diretamente no DOM, a Vue precisará de recuperar a sequência de caracteres do modelo de marcação a partir do DOM. Isto leva a algumas advertências devido ao comportamento da analise sintática do HTML nativo do navegador.

:::tip NOTA
Deve ser notado que as limitações discutidas abaixo apenas aplicam-se se estivermos escrevendo os nossos modelos de marcação diretamente no DOM. Elas NÃO aplicam-se se estivermos usando os modelos de marcação de sequência de caracteres a partir das seguintes fontes:

- Componentes de Ficheiro Único
- Sequências de Caracteres de Modelo de Marcação Incorporado (por exemplo, `template: '...'`)
- `<script type="text/x-template">`
:::

### Insensibilidade aos Caracteres Maiúsculos e Minúsculos {#case-insensitivity}

Os marcadores da HTML e nomes de atributo são insensíveis aos caracteres maiúsculos e minúsculos, assim os navegadores interpretarão quaisquer caracteres maiúsculos como minúsculos. Isto significa que quando usamos os modelos de marcação no DOM, os nomes de componente de `PascalCase` e nomes de propriedade em `camelCase` ou os nomes de evento de `v-on`, todos precisam usar os seus equivalentes em `kebab-case` (delimitados por hífen):

```js
// `camelCase` em JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- `kebab-case` em HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Marcadores de Auto-Fechamento {#self-closing-tags}

Nós temos estado a usar os marcadores de auto-fechamento para os componentes nos anteriores exemplos de código:

```vue-html
<MyComponent />
```

Isto é porque o analisador sintático do modelo de marcação da Vue respeita o `/>` como uma indicação para o final de qualquer marcador, independentemente do seu tipo.

Nos modelos de marcação no DOM, no entanto, devemos sempre incluir explicitamente os marcadores de fechamento:

```vue-html
<my-component></my-component>
```

Isto porque a especificação da HTML apenas permite [alguns elementos específicos](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) omitirem os marcadores de fechamento, os mais comuns sendo `<input>` e `<img>`. Para todos os outros elementos, se omitirmos o marcador de fechamento, o analisador sintático da HTML nativa pensará que nunca terminamos a marcação de abertura. Por exemplo, o seguinte trecho:

```vue-html
<my-component /> <!-- tencionamos fechar o marcador nesta linha... -->
<span>hello</span>
```

será analisado sintaticamente como:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- mas o navegador fechará nesta linha. -->
```

### Restrições da Colocação do Elemento {#element-placement-restrictions}

Alguns elementos da HTML, tais como `<ul>`, `<ol>`, `<table>` e `<select>` têm restrições sobre quais elementos podem aparecer dentro destes, e alguns elementos tais como `<li>`, `<tr>`, e `<option>` apenas podem aparecer dentro de outros certos elementos.

Isto levará a problemas quando usarmos componentes com os elementos que têm tais restrições. Por exemplo:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

O componente personalizado `<blog-post-row>` será içado para fora como conteúdo inválido, causando erros na eventual saída interpretada. Nós podemos usar o [atributo especial `is`](/api/built-in-special-attributes#is) como uma solução:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip NOTA
Quando usado sobre os elementos da HTML nativa, o valor do `is` deve ser prefixado com `vue:` no sentido de ser interpretado como um componente de Vue. Isto é obrigatório para evitar a confusão com os [elementos personalizados embutidos](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) nativos.
:::

É tudo o que precisamos saber sobre as advertências da analise do modelo de marcação no DOM por agora - e é de fato, o fim dos _Fundamentos_ da Vue. Parabéns! Existe ainda muito mais para se aprender, mas primeiro, recomendamos dar uma pausa para experimentar a Vue por conta própria - construa alguma coisa divertida, ou consulte alguns dos [Exemplos](/examples/) se já não o fizeste.

Depois de estivermos confortáveis com o conhecimento que já digerimos, podemos seguir com o guia para aprendermos mais sobre os componentes em profundidade.
