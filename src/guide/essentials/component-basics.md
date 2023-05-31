# Fundamentos de Componentes

Os componentes permitem-te separar a Interface de Utilizador (UI, sigla em Inglês) em pedaços independentes e reutilizáveis, e pensar a respeito de cada pedaço separadamente. É comum para uma aplicação ser organizada em uma árvore de componentes encaixados:

![Árvore de Componente](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

É muito semelhante a como encaixamos elementos nativos de HTML, mas a Vue implemente seu próprio modelo de componente que permite-nos resumir o conteúdo e lógica personalizados dentro de cada componente. A Vua também trabalha com Componentes de Web nativos, [leia mais a respeito](/guide/extras/web-components).

## Definindo um Componente

Quando estamos utilizando um etapa de construção, normalmente definimos cada componente de Vue em um ficheiro dedicado utilizando a extensão `.vue` - conhecido como [Componente de Ficheiro Único](/guide/scaling-up/sfc) (SFC, sigla e abreviação em Inglês):

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

Quando não estamos utilizando uma etapa de construção, um componente de Vue pode ser definido como um simples objeto de JavaScript contendo opções especificas de Vue:

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
  // or `template: '#my-template-element'`
}
```

</div>

O modelo de marcação está em linha como um sequência de caracteres de JavaScript, o qual a Vue compilará rapidamente. Tu também podes utilizar um seletor de ID apontando para um elemento (normalmente elementos `<template>` nativos) - a Vue utilizará o seu conteúdo como fonte do modelo de marcação.

O exemplo acima define um único componente e o exporta como exportação padrão de um ficheiro `.js`, porém podes utilizar exportações nomeadas para exportar vários componentes do mesmo ficheiro.

## Utilizando um Componente

:::tip
Nós estaremos utilizando a sintaxe de SFC para o resto deste guia - os conceitos em torno dos componentes são os mesmos independentemente de estares utilizando uma etapa de construção ou não. A secção de [Exemplos](/examples/) apresenta a utilização de componente em ambos cenários.
:::

Para utilizar um componente filho, precisamos importá-lo dentro do componente pai. Assumindo de que colocamos o nosso componente `counter` (contador) dentro de um ficheiro chamado de `ButtonCounter.vue`, o componente será exposto como exportação padrão do ficheiro:

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

Para expor o componente importado para o nosso modelo de marcação, precisamos [registá-lo](/guide/components/registration) com a opção `components`. O componente estará então disponível como um marcador utilizando a chave sob qual está registado.

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

No caso de `<script setup>`, os componentes importados são automaticamente tornados disponíveis para o modelo de marcação.

</div>

Também é possível registar um componente globalmente, tornando-o disponível para todos os componentes em uma dada aplicação sem ter de importá-lo. Os prós e os contras o registo global versus o registo local são discutidos em uma secção dedicada [Registo de Componente](/guide/components/registration).

Os componentes podem ser reutilizados quantas quiseres:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>

Repare que quando clicar sobre os botões, cada um mantém seu próprio, `count` separado. É por isto que toda vez que utilizares um componente, uma nova **instância** dele é criada.

Em componentes de ficheiro único, é recomendado utilizar nomes de marcador em `PascalCase` para os componentes filhos para diferenciá-los dos elementos de HTML nativos. Embora os nomes de marcador de HTML sejam insensíveis a caixa, O Componente de Ficheiro Único de Vue é um formato compilado assim somos capazes de utilizar nomes de marcador sensíveis a caixa nele. Nós também somos capazes de utilizar `/>` para fechar um marcador.

Se estiveres escrevendo os teus modelos de marcação diretamente em um DOM (por exemplo, como conteúdo de um elemento `<template>` nativo), o modelo de marcação estará sujeito ao comportamento de analise de HTML nativo do navegador. Em tais casos, precisarás utilizar `kebab-case` e fechamento explicito de marcadores para os componentes:

```vue-html
<!-- se este modelo de marcação estiver escrito no DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Consulte [Advertências de Analise de Modelo de Marcação de DOM](#dom-template-parsing-caveats) para mais detalhes.

## Passando Propriedades

Se estivermos construindo um blogue, provavelmente precisaremos de um componente representando uma publicação de blogue. Nós queremos todas as publicações de blogue partilhando o mesmo esquema visual, mas com conteúdo diferente. Tal componente não será útil a menos que possas passar dados para ele, tais como o título e o conteúdo específico da publicação que queremos mostrar. É onde as propriedades entram.

As propriedades (`props`) são atributos personalizados que podes registar sobre um componente. Para passar um título ao componente de publicação de blogue, deves declará-lo em uma lista de propriedades que este componente aceita, utilizando a <span class="options-api">opção [`props`](/api/options-state#props)</span><span class="composition-api">macro [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

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

Quando um valor é passado para um atributo de propriedade, ele torna-se uma propriedade naquela instância de componente. O valor daquela propriedade é acessível dentro do modelo de marcação e no contexto `this` do componente, tal como qualquer outra propriedade de componente.

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

A `defineProps` é uma macro de tempo de compilação que só está disponível dentro de `<script setup>` e não precisa ser explicitamente importada. As propriedades declaradas são expostas automaticamente para o modelo de marcação. A `defineProps` também retorna um objeto que contém todas as propriedades passadas para o componente, para que possamos acessá-los em JavaScript caso necessário:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Consulte também: [Atribuindo Tipos as Propriedades do Componente](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Se não estiveres utilizando `<script setup>`, as propriedades devem ser declaradas utilizando a opção `props`, e o objeto de propriedades será passado para o `setup()` como primeiro argumento:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Um componente pode ter quantas propriedades achares conveniente, por padrão, qualquer valor pode ser passado para qualquer propriedade.

Assim que uma propriedade é registada, podes dados para ela como um atributo personalizado, desta maneira:

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

Em uma aplicação normal, no entanto, provavelmente terás um arranjo de publicações no teu componente pai:

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

Então desejarás interpretar um componente para cada publicação, utilizando `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Repara como `v-bind` é utilizado para passar valores de propriedade dinâmica. Isto é especialmente útil quando não sabes o exato conteúdo que estarás a interpretar antes da hora marcada.

É tudo que precisas saber a respeito das propriedades por agora, mas assim que terminada a leitura desta página e estiveres confortável com o seu conteúdo, recomendamos retornar a leitura do guia completo em [Propriedades](/guide/components/props.html).

## Ouvindo Eventos

A medida que programamos o nosso componente `<BlogPost>`, algumas funcionalidades podem precisar comunicar para cima para o componente pai. Por exemplo, podemos decidir incluir uma funcionalidade de acessibilidade para aumentar o texto das publicações de blogue, enquanto deixamos o resto da página em seu tamanho padrão.

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

Que pode ser utilizada no modelo de marcação para controlar o tamanho da fonte de todas as publicações de blogue:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Agora vamos adicionar um botão para o modelo de marcação do componente `<BlogPost>`:

```vue{5}
<!-- BlogPost.vue, omitindo <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

O botão ainda não faz nada - queremos clicar no botão para comunicar para o componente pai que ele deveria aumentar o texto de todas publicações. Para resolver este problema, os componentes oferecem um sistema de eventos personalizados. O componente pai pode escolher ouvir qualquer evento sobre a instância de componente filho com a `v-on` ou `@`, tal como faria com um evento de DOM nativo:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Então o componente filho pode emitir um evento sobre si mesmo chamando o [método **`$emit`**](/api/component-instance.html#emit) embutido, passando o nome do evento:

```vue{5}
<!-- BlogPost.vue, omitindo <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Graças ao ouvinte `@enlarge-text="postFontSize += 0.1"`, o componente pai receberá o evento e atualizará o valor de `postFontSize`.

<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Nós podemos opcionalmente declarar eventos emitidos utilizando a <span class="options-api">opção [`emits`](/api/options-state.html#emits)</span><span class="composition-api">macro [`defineEmits`](/api/sfc-script-setup.html#defineprops-defineemits)</span>:

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

Isto documenta todos os eventos que um componente emite e [valida-os](/guide/components/events.html#validação-de-eventos) opcionalmente. Ela também permite a Vue evitar aplicá-los implicitamente como ouvintes nativos para o elemento de raiz do componente filho.

<div class="composition-api">

Semelhante a `defineProps`, a `defineEmits` só é utilizável em `<script setup>` e não precisa ser importada. Ela retorna uma função `emit` que é equivalente ao método `$emit`. Ela pode ser utilizada para emitir eventos na secção `<script setup>` de um componente, onde `$emit` não é diretamente acessível:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Consulte também: [Tipando Emissões de Componente](/guide/typescript/composition-api.html#typing-component-emits) <sup class="vt-badge ts" />

Se não estiveres utilizando `<script setup>`, podes declarar os eventos emitidos utilizando a opção `emits`. Tu podes acessar a função `emit` como uma propriedade do contexto de configuração (passada para `setup()` como segundo argumento):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

É tudo que precisas saber a respeito de eventos de componentes personalizados por agora, mas assim que terminares a leitura desta página e estiveres confortável com o seu conteúdo, recomendamos retornar à leitura do guia completo sobre [Eventos Personalizados](/guide/components/events).

## Distribuição de Conteúdo com Ranhuras

Tal como com elementos de HTML, é muitas vezes útil ser capaz de passar conteúdo para um componente, desta maneira:

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

Que pode interpretar alguma coisa tipo:

:::danger Isto é um Erro para Fins de Demonstração
Something bad happened. (Alguma coisa má aconteceu).
:::

Isto pode ser alcançado utilizando o elemento `<slot>` personalizado da Vue:

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

Como verás acima, utilizamos o `<slot>` como um espaço reservado onde queremos que conteúdo esteja – e é isto. Terminamos! 

<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

É tudo o que precisas saber a respeito das ranhuras por agora, mas uma vez terminada a leitura desta página e estiveres confortável com o seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre [Ranhuras](/guide/components/slots).

## Componentes Dinâmicos

Algumas vezes é útil alternar entre componentes dinamicamente, como em uma interface separada:

<div class="options-api">

[Abra o exemplo na Zona de Testes](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Abra o exemplo na Zona de Testes](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

O que está acima é tornado possível pelo elemento `<component>` da Vue com o atributo especial `is`:

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

No exemplo acima, o valor passado para `:is` pode conter tanto:

- a sequência de caracteres de nome de um componente registado, OU
- o objeto de componente importado

Tu também podes utilizar o atributo `is` para criar elementos de HTML regulares.

Quando estiveres alternando entre vários componentes com `<component :is="...">`, um componente será desmontado quando ele for alternado para fora. Nós podemos forçar os componentes inativos a manterem-se "vivos" com o [componente `<KeepAlive>`](/guide/built-ins/keep-alive) embutido.

## Advertências de Analise de Modelo de Marcação de DOM

Se estiveres escrevendo os teus modelos de marcação de Vue diretamente no DOM, a Vue precisará recuperar a sequência de caracteres de modelo de marcação a partir do DOM. Isto leva para algumas advertências devido ao comportamento de analise de HTML nativo do navegador.

:::tip
Deve ser notado que as limitações discutidas abaixo só se aplicam se estiveres escrevendo os teus modelos de marcação diretamente no DOM. Elas não se aplicam se estiveres utilizando modelos de marcação de sequências de caracteres das seguintes fontes:

- Componentes de Ficheiro Único
- Sequências de Caracteres de Modelo de Marcação (por exemplo, `template: '...'`)
- `<script type="text/x-template">`
:::

### Insensibilidade de Caixa

Os marcadores de HTML e nomes de atributos são insensíveis a caixa, então os navegadores interpretarão quaisquer caracteres maiúsculos como minúsculos. Isto significa que quando estiveres utilizando modelos de marcação no DOM, nomes de componente em "PascalCase" e nomes de propriedades em "camelCase" ou todos os nomes de eventos de `v-on` precisam utilizar os seus equivalentes em "kebab-case" (delimitado por hífen):

```js
// "camelCase" em JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- "kebab-case" em HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Marcadores de Auto-Fechamento

Nós temos estado a utilizar marcadores de auto-fechamento para os componentes nos exemplos de código anterior:

```vue-html
<MyComponent />
```

Isto é porque o analisador de modelo da Vue respeita a `/>` como uma indicação para o final de qualquer marcador, independente o seu tipo.

Nos modelos de marcação de DOM, no entanto, devemos sempre incluir explicito os marcadores de fechamento:

```vue-html
<my-component></my-component>
```

Isto é porque a especificação de HTML só permite [alguns elementos específicos](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) omitirem os marcadores de fechamento, os mais comuns sendo `<input>` e `<img>`. Para todos os outros elementos, se omitires o marcador de fechamento, o analisador de HTML nativo pensará que nunca terminaste o marcador de abertura. Por exemplo, o seguinte fragmento:

```vue-html
<my-component /> <!-- cá nós tencionamos fechar o marcador... -->
<span>hello</span>
```

será analisado como:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- mas o navegador irá fechar ele aqui. -->
```

### Restrições de Colocação de Elemento

Alguns elementos de HTML, tais como `<ul>`, `<ol>`, `<table>` e `<select>` têm restrições sobre quais elementos podem aparecer dentro deles, e alguns elementos tais como `<li>`, `<tr>`, e `<option>` só podem aparecer dentro certos elementos.

Isto levará a problemas quando estiveres utilizando componentes com elementos que têm tais restrições. Por exemplo:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

O componente personalizado `<blog-post-row>` será levantado como conteúdo inválido, causando erros no resultado interpretado final. Nós podemos utilizar o [atributo `is`](/api/built-in-special-attributes.html#is) especial como uma solução:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
Quando utilizado sobre elementos de HTML nativo, o valor de `is` deve ser prefixado com `vue:` para ser interpretada como um componente de Vue. Isto é necessário para evitar confusão com os [elementos embutidos personalizados](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) nativo.
:::

É tudo o que precisas saber a respeito das advertências de analise de modelo de marcação de DOM por agora - e de fato, o fim dos _Essenciais_ da Vue. Parabéns! Há ainda mais para aprender, mas primeiro, recomendamos dar uma pausa para brincar com a Vue sozinho - construa alguma coisa divertida, ou consulte alguns dos [Exemplos](/examples/) se ainda não o fizeste.

Uma vez que estiveres confortável com o conhecimento já assimilaste, siga no guia para aprenderes mais a respeito de componentes em profundidade.
