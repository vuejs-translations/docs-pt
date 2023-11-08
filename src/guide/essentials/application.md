# Criando uma Aplicação de Vue {#creating-a-vue-application}

## A Instância da Aplicação {#the-application-instance}

Todas as aplicações de Vue começam com a criação duma nova **instância de aplicação** com a função [`createApp`](/api/application#createapp):

```js
import { createApp } from 'vue'

const app = createApp({
  /* opções do componente de raiz */
})
```

## O Componente de Raiz {#the-root-component}

O objeto que passamos à `createApp` é na realidade um componente. Todas as aplicações exigem um "componente de raiz" que pode conter outros componentes como seus filhos.

Se estivermos a usar os componentes de ficheiro único, normalmente importamos o componente de raiz a partir dum outro ficheiro:

```js
import { createApp } from 'vue'
// importar o componente de raiz `App`
// a partir dum componente de ficheiro único.
import App from './App.vue'

const app = createApp(App)
```

Embora muitos dos exemplos neste guia apenas precisam dum único componente, a maioria das aplicações reias são organizadas numa árvore de componentes reutilizáveis e encaixados. Por exemplo, a árvore de componente duma aplicação de afazeres pode parecer-se com isto:

```
App (componente de raiz)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

Nas seções posteriores do guia, discutiremos como definir e compor vários componentes. Antes disto, nos concentraremos no que acontece dentro dum único componente.

## Montando a Aplicação {#mounting-the-app}

Uma instância de aplicação não interpretará nada até o seu método `mount()` ser chamado. Esta espera um argumento "contentor", que pode ser ou elemento do DOM verdadeiro ou uma sequência de caracteres de seletor:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

O conteúdo do componente de raiz da aplicação será desenhado dentro do elemento contentor. O elemento contentor por si só não é considerado parte da aplicação.

O método `.mount()` sempre deve ser chamado depois de todas as configurações e registos de recurso da aplicação serem feitas. Também nota que o seu valor de retorno, ao contrário dos métodos de registo de recurso, é a instância do componente de raiz ao invés da instância da aplicação.

### Modelo de Marcação do Componente de Raiz no DOM {#in-dom-root-component-template}

O modelo de marcação para o componente de raiz é normalmente parte do próprio componente, mas também é possível fornecer o modelo de marcação separadamente escrevendo-o diretamente dentro do contentor de montagem:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

A Vue usará automaticamente a `innerHTML` do contentor como modelo de marcação se o componente de raiz já não tiver uma opção `template`.

Os modelos de marcação no DOM são frequentemente usados nas aplicações que [usam a Vue sem uma etapa de construção](/guide/quick-start#using-vue-from-cdn). Eles também podem ser usados em conjunto com abstrações do lado do servidor, onde a modelo de marcação de raiz pode ser gerado dinamicamente pelo servidor.

## Configurações da Aplicação {#app-configurations}

A instância da aplicação expõe um objeto `.config` que permite-nos configurar algumas opções de nível de aplicação, por exemplo, definindo um manipulador de erro de nível de aplicação que captura os erros a partir de todos componentes descendentes:

```js
app.config.errorHandler = (err) => {
  /* manipular o erro */
}
```

A instância da aplicação também fornece alguns métodos para o registo de recursos isolados em âmbitos da aplicação. Por exemplo, registando um componente:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Isto torna o `TodoDeleteButton` disponível para uso em qualquer parte da nossa aplicação. Nós discutiremos o registo de componentes e outros tipos de recursos sem seções posteriores do guia. Nós também podemos pesquisar a lista completa das APIs da instância da aplicação na sua [referência de API](/api/application).

Certifica-te de aplicar todas as configurações da aplicação antes da montagem da aplicação!

## Várias Instâncias de Aplicação {#multiple-application-instances}

Nós não estamos restritos à uma única instância de aplicação na mesma página. A API da `createApp` permite que várias aplicações de Vue coexistam na mesma página, cada uma com o seu próprio âmbito de aplicação para configuração e recursos globais:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Se estivermos a usar a Vue para melhorar o HTML gerado pelo servidor e apenas precisamos da Vue para controlar partes específicas duma página grande, devemos evitar montar uma única instância de aplicação de Vue sobre a página inteira. No lugar disto, devemos criar várias instâncias de aplicação pequenas e montá-las sobre os elementos de que são responsáveis.
