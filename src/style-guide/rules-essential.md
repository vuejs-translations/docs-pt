# Regras Prioridade A: Essencial {#priority-a-rules-essential}

Estas regras ajudam a prevenir erros, então aprenda e siga-as a qualquer custo. Exceções podem existir, mas devem ser muito raras e feitas somente por aqueles com conhecimento especializado em JavaScript e Vue. 

## Use nomes de componente com multipalavras {#use-multi-word-component-names}

Nomes de componentes do usuário devem sempre conter multipalavras, exceto componentes raiz `App`. User component names should always be multi-word, except for root `App` components. Isto [previne conflitos](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) com elementos HTML existentes e futuros, visto que todos os elementos HTML são formados por apenas uma palavra.

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<!-- em modelos pré-compilados -->
<Item />

<!-- em modelos dentro do DOM -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<!-- em modelos pré-compilados -->
<TodoItem />

<!-- em modelos dentro do DOM -->
<todo-item></todo-item>
```

</div>

## Use definições de propriedades detalhadas {#use-detailed-prop-definitions}

No código desenvolvido, definições de propriedades devem ser tão detalhadas quanto possível, especificando ao menos os seus tipos.

::: details Explicação Detalhada
[Definições de propriedades](/guide/components/props#prop-validation) detalhadas possuem duas vantagens:

- Elas documentam a API do componente, para que seja fácil ver como o componente deve ser usado.
- No desenvolvimento, Vue avisará se um componente receber propriedades com o formato incorreto, ajudando-o a capturar potenciais causas de erro.
  :::

<div class="options-api">
<div class="style-example style-example-bad">
<h3>Ruim</h3>

```js
// Isto é aceitável apenas ao prototipar
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```js
props: {
  status: String
}
```

```js
// Ainda melhor!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>
</div>

<div class="composition-api">
<div class="style-example style-example-bad">
<h3>Ruim</h3>

```js
// Isto é aceitável apenas ao prototipar
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Ainda melhor!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>
</div>

## Use chaves de identificação no `v-for` {#use-keyed-v-for}

`key` com `v-for` é _sempre_ exigido em componentes, de forma a manter o estado do componente interno até a subárvore. E mesmo para elementos, é uma boa prática manter o comportamento previsível, como a [constância de objetos](https://bost.ocks.org/mike/constancy/) em animações.

::: details Explicação Detalhada
Digamos que você tenha uma lista de tarefas:

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Aprenda a usar v-for'
      },
      {
        id: 2,
        text: 'Aprenda a usar key'
      }
    ]
  }
}
```

E então você as separa alfabeticamente. Ao atualizar o DOM, o Vue irá aperfeiçoar a renderização para desempenhar o menor número possível de mutações no DOM. Isto pode significar apagar o primeiro elemento de tarefa, e então adicioná-lo novamente ao final da lista.

O problema é que há casos em que é importante não apagar qualquer elemento que permanecerá no DOM. Por exemplo, você pode querer usar `<transition-group>` para animar a ordenação da lista, ou manter o foco se o elemento renderizado é um `<input>`. Nestes casos, adicionar uma chave única para cada item (ex.: `:key="todo.id"`) irá dizer ao Vue como se comportar de forma mais previsível.

Em nossa experiência, o melhor é _sempre_ adicionar uma chave única, para que você e seu time nunca precisem se preocupar com esses casos extremos. Então, em raros cenários com questões críticas de desempenho onde a constância de objetos não é necessária, você pode fazer uma exceção de forma consciente.
:::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Evite `v-if` com `v-for` {#avoid-v-if-with-v-for}

**Nunca use `v-if` com `v-for` no mesmo elemento.**

Geralmente existem dois casos onde isso pode ser tentador:

- Para filtrar itens em uma lista (ex.: `v-for="user in users" v-if="user.isActive"`). Nestes casos, substitua `users` com um novo dado computado que retorne a sua lista filtrada (ex.: `activeUsers`).

- Para evitar renderizar uma lista se ela deverá ser escondida (ex.: `v-for="user in users" v-if="shouldShowUsers"`). Nestes casos, mova o `v-if` para o elemento pai. (ex.: `ul`, `ol`).

::: details Explicação Detalhada
Quando Vue processa diretrizes, o `v-if` tem uma prioridade maior do que o `v-for`, então para este modelo:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Acontecerá um erro, porque a diretriz `v-if` deve ser examinada primeiro e a variável de iteração `user` não existe neste momento.

Isto pode ser arrumado ao se iterar sobre um dado computado, assim:

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Alternativamente, podemos usar uma tag `<template>` com `v-for` para envolver o elemento `<li>`:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Use estilos de componente em escopo {#use-component-scoped-styling}

Para aplicações, estilos em um componente de nível maior `App` e em componentes de layout podem ser globais, mas todos os outros componentes devem utilizar estilo em escopo.

Isto é relevante apenas para [componentes de arquivo único](/guide/scaling-up/sfc). _Não_ é exigido que o [atributo `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html) seja usado. O escopo pode ser realizado através de [módulos CSS](https://vue-loader.vuejs.org/en/features/css-modules), uma estratégia baseada em classes como [BEM](http://getbem.com/), ou outra biblioteca/convenção.

**Bibliotecas de componente, entretanto, devem preferir uma estratégia baseada em classes ao invés de usar o atributo `scoped`.**

Isto torna mais fácil a sobreposição de estilos internos, com nomes de classes de fácil leitura que não possuem especificidade alta, mas que muito improvavelmente resultarão em um conflito.

::: details Explicação Detalhada
Se você está desenvolvendo um projeto grande, trabalhando com outros desenvolvedores, ou às vezes incluindo algum HTML/CSS de terceiros (ex.: do Auth0), um escopo consistente irá garantir que seus estilos se apliquem somente aos componentes para que foram designados.

Além do atributo `scoped`, usar nomes de classe únicos podem ajudar a garantir que o CSS de terceiros não se apliquem em seu próprio HTML. Por exemplo, muitos projetos usam nomes de classe `button`, `btn`, ou `icon`, então mesmo ao não usar uma estratégia como o BEM, adicionar um prefixo específico do app e/ou específico do componente (ex.: `ButtonClose-Icon`) pode fornecer alguma proteção.
:::

<div class="style-example style-example-bad">
<h3>Ruim</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bom</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Usando o atributo `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Usando módulos CSS -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Usando a convenção BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
