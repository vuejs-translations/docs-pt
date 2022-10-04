# Fundamentos de Componentes

Os componentes permitem-te separar a Interface de Utilizador (UI, sigla em Inglês) em pedaços independentes e reutilizáveis, e pensar a respeito de cada pedaço separadamente. É comum para uma aplicação ser organizada em uma árvore de componentes encaixados:

![Árvore de Componente](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

É muito semelhante a como encaixamos elementos nativos de HTML, mas a Vue implemente seu próprio modelo de componente que permite-nos resumir o conteúdo e lógica personalizados dentro de cada componente. A Vua também trabalha com Componentes de Web nativos, [leia mais a respeito](/guide/extras/web-components.html).

## Definindo um Componente

Quando estamos utilizando um etapa de construção, normalmente definimos cada componente de Vue em um ficheiro dedicado utilizando a extensão `.vue` - conhecido como [Componente de Ficheiro Único](/guide/scaling-up/sfc.html) (SFC, sigla e abreviação em Inglês):

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

Para expor o componente importado para o nosso modelo de marcação, precisamos [registá-lo](/guide/components/registration.html) com a opção `components`. O componente estará então disponível como um marcador utilizando a chave sob qual está registado.

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

Também é possível registar um componente globalmente, tornando-o disponível para todos os componentes em uma dada aplicação sem ter de importá-lo. Os prós e os contras o registo global versus o registo local são discutidos em uma secção dedicada [Registo de Componente](/guide/components/registration.html).

Os componentes podem ser reutilizados quantas quiseres:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7XG4gICAgQnV0dG9uQ291bnRlclxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGNvdW50ID0gcmVmKDApXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

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

Consulte [Advertências de Analise de Modelo de Marcação de DOM](#advertências-de-analise-de-modelo-de-marcação-de-dom) para mais detalhes.

## Passando Propriedades

Se estivermos construindo um blogue, provavelmente precisaremos de um componente representando uma publicação de blogue. Nós queremos todas as publicações de blogue partilhando o mesmo esquema visual, mas com conteúdo diferente. Tal componente não será útil a menos que possas passar dados para ele, tais como o título e o conteúdo específico da publicação que queremos mostrar. É onde as propriedades entram.

As propriedades (`props`) são atributos personalizados que podes registar sobre um componente. Para passar um título ao componente de publicação de blogue, deves declará-lo em uma lista de propriedades que este componente aceita, utilizando a <span class="options-api">opção [`props`](/api/options-state.html#props)</span><span class="composition-api">macro [`defineProps`](/api/sfc-script-setup.html#defineprops-defineemits)</span>:

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

Consulte também: [Tipando Propriedades de Componente](/guide/typescript/composition-api.html#tipando-propriedades-de-componente) <sup class="vt-badge ts" />

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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ3RpdGxlJ11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoND57eyB0aXRsZSB9fTwvaDQ+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuPC90ZW1wbGF0ZT4ifQ==)

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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF0sXG4gICAgICBwb3N0Rm9udFNpemU6IDFcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgOnN0eWxlPVwieyBmb250U2l6ZTogcG9zdEZvbnRTaXplICsgJ2VtJyB9XCI+XG4gICAgPEJsb2dQb3N0XG4gICAgICB2LWZvcj1cInBvc3QgaW4gcG9zdHNcIlxuICAgICAgOmtleT1cInBvc3QuaWRcIlxuICAgICAgOnRpdGxlPVwicG9zdC50aXRsZVwiXG4gICAgICBAZW5sYXJnZS10ZXh0PVwicG9zdEZvbnRTaXplICs9IDAuMVwiXG4gICAgPjwvQmxvZ1Bvc3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQmxvZ1Bvc3QudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IFsndGl0bGUnXSxcbiAgZW1pdHM6IFsnZW5sYXJnZS10ZXh0J11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJibG9nLXBvc3RcIj5cblx0ICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuXHQgIDxidXR0b24gQGNsaWNrPVwiJGVtaXQoJ2VubGFyZ2UtdGV4dCcpXCI+RW5sYXJnZSB0ZXh0PC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcblxuY29uc3QgcG9zdEZvbnRTaXplID0gcmVmKDEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8ZGl2IDpzdHlsZT1cInsgZm9udFNpemU6IHBvc3RGb250U2l6ZSArICdlbScgfVwiPlxuICAgIDxCbG9nUG9zdFxuICAgICAgdi1mb3I9XCJwb3N0IGluIHBvc3RzXCJcbiAgICAgIDprZXk9XCJwb3N0LmlkXCJcbiAgICAgIDp0aXRsZT1cInBvc3QudGl0bGVcIlxuICAgICAgQGVubGFyZ2UtdGV4dD1cInBvc3RGb250U2l6ZSArPSAwLjFcIlxuICAgID48L0Jsb2dQb3N0PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG5kZWZpbmVFbWl0cyhbJ2VubGFyZ2UtdGV4dCddKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImJsb2ctcG9zdFwiPlxuICAgIDxoND57eyB0aXRsZSB9fTwvaDQ+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgnZW5sYXJnZS10ZXh0JylcIj5FbmxhcmdlIHRleHQ8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiJ9)

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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQWxlcnRCb3ggfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PEFsZXJ0Qm94PlxuICBcdFNvbWV0aGluZyBiYWQgaGFwcGVuZWQuXG5cdDwvQWxlcnRCb3g+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJBbGVydEJveC52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJhbGVydC1ib3hcIj5cbiAgICA8c3Ryb25nPkVycm9yITwvc3Ryb25nPlxuICAgIDxici8+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuLmFsZXJ0LWJveCB7XG4gIGNvbG9yOiAjNjY2O1xuICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmODtcbn1cbiAgXG5zdHJvbmcge1xuXHRjb2xvcjogcmVkOyAgICBcbn1cbjwvc3R5bGU+In0=)

</div>
<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxBbGVydEJveD5cbiAgXHRTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuXHQ8L0FsZXJ0Qm94PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQWxlcnRCb3gudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnQtYm94XCI+XG4gICAgPHN0cm9uZz5FcnJvciE8L3N0cm9uZz5cbiAgICA8YnIvPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5hbGVydC1ib3gge1xuICBjb2xvcjogIzY2NjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG59XG4gIFxuc3Ryb25nIHtcblx0Y29sb3I6IHJlZDsgICAgXG59XG48L3N0eWxlPiJ9)

</div>

É tudo o que precisas saber a respeito das ranhuras por agora, mas uma vez terminada a leitura desta página e estiveres confortável com o seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre [Ranhuras](/guide/components/slots).

## Componentes Dinâmicos

Algumas vezes é útil alternar entre componentes dinamicamente, como em uma interface separada:

<div class="options-api">

[Abra o exemplo na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEhvbWUsXG4gICAgUG9zdHMsXG4gICAgQXJjaGl2ZVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VGFiOiAnSG9tZScsXG4gICAgICB0YWJzOiBbJ0hvbWUnLCAnUG9zdHMnLCAnQXJjaGl2ZSddXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cInRhYiBpbiB0YWJzXCJcbiAgICAgICA6a2V5PVwidGFiXCJcbiAgICAgICA6Y2xhc3M9XCJbJ3RhYi1idXR0b24nLCB7IGFjdGl2ZTogY3VycmVudFRhYiA9PT0gdGFiIH1dXCJcbiAgICAgICBAY2xpY2s9XCJjdXJyZW50VGFiID0gdGFiXCJcbiAgICAgPlxuICAgICAge3sgdGFiIH19XG4gICAgPC9idXR0b24+XG5cdCAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50VGFiXCIgY2xhc3M9XCJ0YWJcIj48L2NvbXBvbmVudD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZGVtbyB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIHBhZGRpbmc6IDIwcHggMzBweDtcbiAgbWFyZ2luLXRvcDogMWVtO1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cblxuLnRhYi1idXR0b24ge1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogM3B4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogM3B4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQ6ICNmMGYwZjA7XG4gIG1hcmdpbi1ib3R0b206IC0xcHg7XG4gIG1hcmdpbi1yaWdodDogLTFweDtcbn1cbi50YWItYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWItYnV0dG9uLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICNlMGUwZTA7XG59XG4udGFiIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgcGFkZGluZzogMTBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgSG9tZSBjb21wb25lbnRcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIlBvc3RzLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIFBvc3RzIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQXJjaGl2ZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBBcmNoaXZlIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>
<div class="composition-api">

[Abra o exemplo na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuIFxuY29uc3QgY3VycmVudFRhYiA9IHJlZignSG9tZScpXG5cbmNvbnN0IHRhYnMgPSB7XG4gIEhvbWUsXG4gIFBvc3RzLFxuICBBcmNoaXZlXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cIihfLCB0YWIpIGluIHRhYnNcIlxuICAgICAgIDprZXk9XCJ0YWJcIlxuICAgICAgIDpjbGFzcz1cIlsndGFiLWJ1dHRvbicsIHsgYWN0aXZlOiBjdXJyZW50VGFiID09PSB0YWIgfV1cIlxuICAgICAgIEBjbGljaz1cImN1cnJlbnRUYWIgPSB0YWJcIlxuICAgICA+XG4gICAgICB7eyB0YWIgfX1cbiAgICA8L2J1dHRvbj5cblx0ICA8Y29tcG9uZW50IDppcz1cInRhYnNbY3VycmVudFRhYl1cIiBjbGFzcz1cInRhYlwiPjwvY29tcG9uZW50PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbi5kZW1vIHtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgcGFkZGluZzogMjBweCAzMHB4O1xuICBtYXJnaW4tdG9wOiAxZW07XG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuXG4udGFiLWJ1dHRvbiB7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgbWFyZ2luLXJpZ2h0OiAtMXB4O1xufVxuLnRhYi1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZTBlMGUwO1xufVxuLnRhYi1idXR0b24uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBwYWRkaW5nOiAxMHB4O1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiSG9tZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBIb21lIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiUG9zdHMudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgUG9zdHMgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJBcmNoaXZlLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIEFyY2hpdmUgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

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

Quando estiveres alternando entre vários componentes com `<component :is="...">`, um componente será desmontado quando ele for alternado para fora. Nós podemos forçar os componentes inativos a manterem-se "vivos" com o [componente `<KeepAlive>`](/guide/built-ins/keep-alive.html) embutido.

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
