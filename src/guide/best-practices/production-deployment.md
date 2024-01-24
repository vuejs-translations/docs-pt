# Implementação em Produção {#production-deployment}

## Desenvolvimento vs. Produção {#development-vs-production}

Durante o desenvolvimento, a Vue fornece vários recursos para melhorar a experiência de programação:

- Avisos para erros comuns e armadilhas
- Propriedades / validação de eventos
- [Gatilhos de depuração da reatividade](/guide/extras/reactivity-in-depth.html#reactivity-debugging)
- Integração com ferramentas de programação

No entanto, estas funcionalidades tornam-se inúteis em produção. Algumas das verificações de alerta também podem gerar uma pequena sobrecarga de desempenho. Ao implementar em produção, devemos eliminar todas as ramificações de código escritos para executar apenas em desenvolvimento e não usados em produção, para obter um tamanho de carga útil menor e um melhor desempenho.

## Sem Ferramentas de Construção {#without-build-tools}

Se estiver usando a Vue sem uma ferramenta de construção carregando-a a partir da CDN ou programa hospedado de maneira autónoma, certifique-se de usar o pacote de produção (ficheiros de distribuição que terminam em `.prod.js`) quando estiver a implementar a aplicação em produção. Os pacotes de produção são pré-minificados onde têm todos os ramos de código escrito para ser apenas usado em desenvolvimento removido.

- Se estiver usando o pacote global (acessando através da global `Vue`): use `vue.global.prod.js`.
- Se estiver usando o pacote de Módulo de ECMAScript (acessando através de importações de Módulo de ECMAScript nativas): use `vue.esm-browser.prod.js`.

Consulte o [guia do ficheiro de distribuição](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) para mais detalhes.

## Com Ferramentas de Construção {#with-build-tools}

Os projetos estruturados via `create-vue` (baseado em Vite) ou a Interface de Linha de Comando da Vue (baseada na Webpack) são pré-configuradas para construções de produção.

Se estiver usando uma configuração personalizada, certifique-se de que:

1. `vue` resolve para `vue.runtime.esm-bundler.js`.
2. As [opções da funcionalidade de tempo de compilação](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) são configuradas apropriadamente.
3. <code>process.env<wbr>.NODE_ENV</code> é substítuido com a `"production"` durante a construção.

Referências adicionais:

- [Guia de construção de produção da Vite](https://vitejs.dev/guide/build.html)
- [Guia de implementação em produção da Vite](https://vitejs.dev/guide/static-deploy.html)
- [Guia de implementação em produção da Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Rastreando erros em Tempo de Execução {#tracking-runtime-errors}

O [manipulador de erro de nível da aplicação](/api/application.html#app-config-errorhandler) pode ser usado para comunicar os erros aos serviços de rastreamento:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // comunicar erro aos serviços de rastreio
}
```

Serviços como [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) e [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) também fornecem integrações oficiais para Vue.
