# [pt.vuejs.org](https://pt.vuejs.org)

## Colaborar

Este sítio foi construído com a [VitePress](https://vitepress.dev/) e dependa da [`@vue/theme`](https://github.com/vuejs/vue-theme). O conteúdo do sítio está escrito no formato Markdown (`.md`) localizado no diretório `src/`. Para edições simples, podemos editar diretamente o ficheiro na GitHub e gerar um pedido de atualização do ramo principal do repositório.

Para desenvolvimento local, a [`pnpm`](https://pnpm.io/) é preferida para gestão de pacotes:

```bash
pnpm i
pnpm run dev
```

Este projeto exige a versão `v18` ou superior da Node.js. E é recomendado ativar a [`corepack`](https://nodejs.org/api/corepack.html):

```bash
corepack enable
```


## Trabalhar no Conteúdo

- Consultar a documentação da VitePress sobre as [extensões de Markdown](https://vitepress.dev/guide/markdown) suportadas e a capacidade de [usar a sintaxe da Vue dentro do ficheiro de Markdown](https://vitepress.dev/guide/using-vue).

- Consultar o [Guia de Redação](https://github.com/vuejs/docs/blob/main/.github/contributing/writing-guide.md) para conhecer as nossas regras e recomendações sobre a redação e manutenção do conteúdo da documentação.

## Trabalhar no Tema

Se for necessário efetuar alterações ao tema, consultar as [instruções para desenvolver o tema juntamente com a documentação](https://github.com/vuejs/vue-theme#developing-with-real-content).
