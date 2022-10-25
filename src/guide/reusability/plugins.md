# Extensões

## Introdução

As extensões são códigos auto-contidos que normalmente adicionam funcionalidade de nível de aplicação para a Vue. Isto é como instalamos uma extensão:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* opções opcionais */
})
```

Uma extensão é definida tanto como um objeto que expõe um método `install()`, ou simplesmente como uma função que atua como a própria função de instalação. A função de instalação recebe a [instância de aplicação](/api/application.html) juntamente com as opções adicionais passadas para `app.use()`, se houverem:

```js
const myPlugin = {
  install(app, options) {
    // configura a aplicação
  }
}
```

Não existe escopo definido estritamente para uma extensão, mas os cenários comuns onde as extensões são úteis incluem:

1. Registar um ou mais componentes globais ou diretivas personalizas com [`app.component()`](/api/application.html#app-component) e [`app.directive()`](/api/application.html#app-directive).

2. Tornar um recurso [injetável](/guide/components/provide-inject.html) em toda a aplicação chamando [`app.provide()`](/api/application.html#app-provide).

3. Adicionar propriedades de instância global ou métodos atribuindo-os à [`app.config.globalProperties`](/api/application.html#app-config-globalproperties).

4. Uma biblioteca que precisa realizar alguma combinação do que está acima (por exemplo [vue-router](https://github.com/vuejs/vue-router-next)).

## Escrevendo uma Extensão

Para melhor entender como criar as tuas próprias extensões de Vue.js, criaremos uma versão muito simplificada de uma extensão que exibe sequências de caracteres de `i18n` (forma abreviada para [Internacionalização](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

Vamos começar definindo o objeto da extensão. É recomendado criá-lo em um ficheiro separado e exportá-lo, como mostrado abaixo para manter a lógica contida e separada.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // O código da extensão vai cá
  }
}
```

Nós queremos fazer uma função para traduzir as chaves disponíveis para aplicação inteira, assim exporemos utilizando `app.config.globalProperties`. Esta função receberá uma sequência de caracteres `key` delimitada por ponto, a qual utilizaremos para procurar a sequência de caracteres traduzida nas opções fornecidas pelo utilizador.

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // injeta um método "$translate()" disponível globalmente
    app.config.globalProperties.$translate = (key) => {
      // recupera uma propriedade encaixada nas `options`
      // utilizando `key` como caminho
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

A extensão espera que os utilizadores passem um objeto contendo as chaves traduzidas através das opções quando eles utilizarem a extensão, assim deveria ser utilizado desta maneira:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

A nossa função `$translate` pegará uma sequência de caracteres tal como `greetings.hello`, procura dentro da configuração fornecida pelo utilizador e retorna o valor traduzido - neste caso, `Bonjour!`:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Consulte também: [Aumentando Propriedades Globais](/guide/typescript/options-api.html#aumentando-propriedades-globais) <sup class="vt-badge ts" />

:::tip
Utilize as propriedades globais cuidadosamente, já que pode rapidamente tornar-se as coisas confusas se muitas propriedades globais injetadas por extensões diferentes forem utilizadas em toda uma aplicação.
:::

### Fornecer / Injetar com as Extensões

As extensões também permitem-nos utilizar `inject` para fornecer uma função ou atributo aos utilizadores da extensão. Por exemplo, podemos permitir que a aplicação tenha acesso ao parâmetro `options` para ser capaz de utilizar o objeto de traduções.

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  }
}
```

Os utilizadores da extensão agora serão capazes de injetar as opções da extensão em seus componentes utilizando a chave `i18n`:

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
