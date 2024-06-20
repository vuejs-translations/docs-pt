import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
//import { textAdPlugin } from './textAdMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Documentação',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Guia', link: '/guide/introduction' },
      { text: 'Tutorial', link: '/tutorial/' },
      { text: 'Exemplos', link: '/examples/' },
      { text: 'Introdução Rápida', link: '/guide/quick-start' },
      // { text: 'Guia de Estilo', link: '/style-guide/' },
      { text: 'Glossário', link: '/glossary/' },
      {
        text: 'Documentação da Vue 2',
        link: 'https://v2.vuejs.org'
      },
      {
        text: 'Guia de Migração (Vue 2)',
        link: 'https://v3-migration.vuejs.org/pt/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Zona de Testes',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Ecossistema',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Recursos',
        items: [
          { text: 'Parceiros', link: '/partners/' },
          { text: 'Temas', link: '/ecosystem/themes' },
          { text: 'Componentes de Interface', link: 'https://ui-libs.vercel.app/' },
          { text: 'Certificação', link: 'https://certification.vuejs.org/?ref=vuejs-nav'},
          { text: 'Empregos', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Loja de Roupas', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Bibliotecas Oficiais',
        items: [
          { text: 'Vue Router', link: 'https://vue-router-docs-pt.netlify.app/' },
          { text: 'Pinia', link: 'https://pinia-docs-pt.netlify.app/' },
          { text: 'Guia do Ferramental', link: '/guide/scaling-up/tooling' }
        ]
      },
      {
        text: 'Cursos',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Pedir Ajuda',
        items: [
          {
            text: 'Conversas da Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Discussões da GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Comunidade da DEV', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Novidades',
        items: [
          { text: 'Blogue', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'Eventos', link: 'https://events.vuejs.org/' },
          { text: 'Boletins Informativos', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'Sobre',
    activeMatch: `^/about/`,
    items: [
      { text: 'Questões Frequentes', link: '/about/faq' },
      { text: 'Equipa', link: '/about/team' },
      { text: 'Lançamentos', link: '/about/releases' },
      {
        text: 'Guia da Comunidade',
        link: '/about/community-guide'
      },
      { text: 'Código de Conduta', link: '/about/coc' },
      {
        text: 'O Documentário',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Patrocinar',
    link: '/sponsor/'
  },
  {
    text: 'Parceiros',
    link: '/partners/',
    activeMatch: `^/partners/`
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Começar',
      items: [
        { text: 'Introdução', link: '/guide/introduction' },
        {
          text: 'Introdução Rápida',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Fundamentos',
      items: [
        {
          text: 'Criando uma Aplicação',
          link: '/guide/essentials/application'
        },
        {
          text: 'Sintaxe do Modelo de Marcação',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Fundamentos de Reatividade',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Propriedades Computadas',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Vínculo de Classe e Estilo',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Interpretação Condicional',
          link: '/guide/essentials/conditional'
        },
        { text: 'Interpretação de Lista', link: '/guide/essentials/list' },
        {
          text: 'Manipulação de Evento',
          link: '/guide/essentials/event-handling'
        },
        { text: 'Vínculo de Entrada de Formulário', link: '/guide/essentials/forms' },
        {
          text: 'Gatilhos do Ciclo de Vida',
          link: '/guide/essentials/lifecycle'
        },
        { text: 'Observadores', link: '/guide/essentials/watchers' },
        { text: 'Referências do Modelo', link: '/guide/essentials/template-refs' },
        {
          text: 'Fundamentos dos Componentes',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: 'Componentes em Profundidade',
      items: [
        {
          text: 'Registo',
          link: '/guide/components/registration'
        },
        { text: 'Propriedades', link: '/guide/components/props' },
        { text: 'Eventos', link: '/guide/components/events' },
        { text: 'Modelo Virtual', link: '/guide/components/v-model' },
        {
          text: 'Atributos',
          link: '/guide/components/attrs'
        },
        { text: 'Ranhuras', link: '/guide/components/slots' },
        {
          text: 'Fornecimento e Injeção',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Componentes Assíncronos',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Reutilização',
      items: [
        {
          text: 'Funções de Composição',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Diretivas Personalizadas',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Extensões', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Componentes Embutidos',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Escalando para Cima',
      items: [
        { text: 'Componentes de Ficheiro Único', link: '/guide/scaling-up/sfc' },
        { text: 'Ferramental', link: '/guide/scaling-up/tooling' },
        { text: 'Roteamento', link: '/guide/scaling-up/routing' },
        {
          text: 'Gestão de Estado',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testes', link: '/guide/scaling-up/testing' },
        {
          text: 'Interpretação do Lado do Servidor',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Boas Práticas',
      items: [
        {
          text: 'Implementação em Produção',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Desempenho',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Acessibilidade',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Segurança',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Visão Geral', link: '/guide/typescript/overview' },
        {
          text: 'TypeScript e a API de Composição',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TypeScript e a API de Opções',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Tópicos Adicionais',
      items: [
        {
          text: 'Maneiras de Usar a Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Questões Frequentes sobre Composição',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reatividade em Profundidade',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mecanismo de Interpretação',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Função de Interpretação & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue e os Componentes da Web',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Técnicas de Animação',
          link: '/guide/extras/animation'
        },
        // {
        //   text: 'Construindo uma Biblioteca para Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue para Programadores de React',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API Global',
      items: [
        { text: 'Aplicação', link: '/api/application' },
        {
          text: 'Geral',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'API de Composição',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Reatividade: Núcleo',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reatividade: Utilitários',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reatividade: Avançado',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Gatilhos do Ciclo de Vida',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Injeção de Dependência',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: 'API de Opções',
      items: [
        { text: 'Opções: Estado', link: '/api/options-state' },
        { text: 'Opções: Interpretação', link: '/api/options-rendering' },
        {
          text: 'Opções: Ciclo de Vida',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Opções: Composição',
          link: '/api/options-composition'
        },
        { text: 'Opções: Outros', link: '/api/options-misc' },
        {
          text: 'Instância do Componente',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Recursos Embutidos',
      items: [
        { text: 'Diretivas', link: '/api/built-in-directives' },
        { text: 'Componentes', link: '/api/built-in-components' },
        {
          text: 'Elementos Especiais',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Atributos Especiais',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Componente de Ficheiro Único',
      items: [
        { text: 'Especificação da Sintaxe', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Funcionalidades de CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'APIs Avançadas',
      items: [
        { text: 'Função de Interpretação', link: '/api/render-function' },
        { text: 'Interpretação do Lado do Servidor', link: '/api/ssr' },
        { text: 'Tipos de Utilitários de TypeScript', link: '/api/utility-types' },
        { text: 'Interpretador Personalizado', link: '/api/custom-renderer' },
        { text: 'Opções de Compilação', link: '/api/compile-time-flags' },
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Básico',
      items: [
        {
          text: 'Olá Mundo',
          link: '/examples/#hello-world'
        },
        {
          text: 'Manipulando a Entrada do Utilizador',
          link: '/examples/#handling-input'
        },
        {
          text: 'Vinculações de Atributo',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Condicionais e Laços de Repetição',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Vínculos de Formulário',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Componente Simples',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Exemplos Práticos',
      items: [
        {
          text: 'Editor de Markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Requisição de Dados',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Grade com Ordenação e Filtração',
          link: '/examples/#grid'
        },
        {
          text: 'Visão de Árvore',
          link: '/examples/#tree'
        },
        {
          text: 'Gráfico em SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modal com Transições',
          link: '/examples/#modal'
        },
        {
          text: 'Lista com Transições',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Contador',
          link: '/examples/#counter'
        },
        {
          text: 'Conversor de Temperatura',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Marcador de Voo',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Temporizador',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Desenhador de Circulo',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Células',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Guia de Estilo',
      items: [
        {
          text: 'Visão Geral',
          link: '/style-guide/'
        },
        {
          text: 'A - Indispensável',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Fortemente Recomendado',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recomendado',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Use com Cautela',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
// const i18n: ThemeConfig['i18n'] = {
// }

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'pt-PT',
  title: 'Vue.js',
  description: 'Vue.js - A Abstração Progressiva de JavaScript',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://pt.vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - A Abstração de JavaScript Progressiva'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/uwu.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    // i18n,

    localeLinks: [
    	{
    		link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
    	},
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/translation-gang/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: '/translations/',
        text: 'Ajude-Nos a Traduzir!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-pt',
      text: 'Editar esta página na GitHub'
    },

    footer: {
      license: {
        text: 'Licença MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Direitos de Autor © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
        //.use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
})
