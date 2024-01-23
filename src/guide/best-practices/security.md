# Segurança {#security}

## Relatório de Vulnerabilidades {#reporting-vulnerabilities}

Quando uma vulnerabilidade é reportada, ela imediatamente se torna nossa principal preocupação, com um colaborar em tempo integral largando tudo para trabalhar nela. Para relatar uma vulnerabilidade, envie um e-mail para [security@vuejs.org](mailto:security@vuejs.org).

Embora a descoberta de novas vulnerabilidades seja rara, também recomendamos sempre usar as versões mais recentes do Vue e suas bibliotecas oficiais para garatinr que sua aplicação permaneça a mais segura possível.

## Regra Nº1: Nunca Usar Modelos de Marcação Duvidosos {#rule-no-1-never-use-non-trusted-templates}

A regra de segurança mais fundamental ao usar o Vue é **nunca usar conteúdo não confiável como modelo de marcação do componente**. Fazer isso equivale a permitir a execução arbitrária de JavaScript na sua aplicação - e pior, pode levar a violações se o código for executado durante a renderização no lado do servidor. Um exemplo desse uso:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA FAÇA ISTO
}).mount('#app')
```

Os modelos de marcação Vue são compilados em JavaScript, e as expressões dentro dos modelos de marcação serão executadas como parte do processo de renderização. Embora as expressões sejam avaliadas em relação a um contexto de renderização específico, devido à complexidade dos potenciais ambientes de execução global, é inviável para uma estrutura como o Vue protegê-lo completamente da possível execução de código malicioso sem sofrer com as despesas gerais de desempenho irrealistas. A maneira mais direta de evitar essa categoria de problemas é garantir que o conteúdo dos seus modelos Vue seja sempre confiável e totalmente controlado por você.

## O Que Vue Faz Para Proteger-te {#what-vue-does-to-protect-you}

### Conteúdo HTML {#html-content}

Seja usando os modelos de marcação ou funções de renderização, o conteúdo é escapado automaticamente. Isto significa que neste modelo:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

Se `userProvidedString` continha:

```js
'<script>alert("hi")</script>'
```

Então seria escapado para o seguinte HTML:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

Assim evitando a injeção de script. Este escapamento é feito usando as APIs nativas do navegador, como `textContent`, assim uma vulnerabilidade apenas pode existir se o próprio navegador estiver vulnerável.

### Vínculação de Atributos {#attribute-bindings}

Similarmente, os vínculos de atributos dinâmicos também são escapados automaticamente. Isto significa que neste modelo de marcação:

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

Se `userProvidedString` continha:

```js
'" onclick="alert(\'hi\')'
```

Então seria escapado para o seguinte HTML:

```vue-html
&quot; onclick=&quot;alert('hi')
```

Assim evitando o fechamento do atributo `title` para injetar HTML novo e arbitrário. Este escapamento é feito usando as APIs nativas do navegador, como `setAttribute`, assim uma vulnerabilidade apenas pode existir se o próprio navegador estiver vulnerável.

## Perigos Potenciais {#potential-dangers}

Em qualquer aplicação web, permitir conteúdo não desinfetado, fornecido pelo usuário ser executado como HTML, CSS, ou JavaScript é potencialmente perigoso, então deve ser evitado onde quer que for possível. Há momentos em que algum risco pode ser aceitável.

Por exemplo, serviços como CodePen e JSFiddle permitem que o conteúdo fornecido pelo usuário seja executado, mas está em um contexto onde este é esperado e isolado em uma área restrita até certo ponto dentro de `iframe`. Nestes casos onde uma funcionalidade importante exige inerentemente algum nível de vulnerabilidade, está sobre o seu time avaliar a importância do recurso em relação aos piores cenários que a vulnerabilidade permite.

### Injeção de HTML {#html-injection}

Conforme foi aprendido anteriormente, no Vue escapa automaticamente o conteúdo HTML, evitando de acidentalmente injetar HTML executável para dentro da sua aplicação. No entanto, **em casos onde é sabido que o HTML é seguro**, pode explicitamente renderizar o conteúdo HTML:

- Usando um modelo de marcação:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Usando uma função de renderização:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Usando uma função de renderização com JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning AVISO
O HTML fornecido pelo usuário nunca pode ser considerado 100% seguro a menos que seja um `iframe` isolado em uma área restrita ou em uma parte da aplicação onde apenas o usuário que escreveu aquele HTML pode sempre ser exposto à ele. Adicionalmente, permitir que os usuárioes escrevam seus próprios modelos de marcação de Vue atrai perigos parecidos.
:::

### Injeção de URL {#url-injection}

Em uma URL como esta:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Há um possível problema de segurança se a URL não tiver sido "desinfetada" para evitar a execução de JavaScript usando `javascript:`. Existem bibliotecas como [`sanitize-url`](https://www.npmjs.com/package/@braintree/sanitize-url) para ajudar com isto, mas observe: se estiver fazendo a desinfeção de URL no frontend, já existe um problema de segurança. **URLs fornecidas pelo usuário devem sempre ser desinfetadas no seu backend antes mesmo de serem salvas em uma base de dados.** Portanto o problema é evitado para _todos_ os clientes conectados à sua API, incluindo aplicações móveis nativas. Observe também que mesmo com URLs desinfetadas, o Vue não pode ajudar a garantir que eles levem para destinos seguros.

### Injeção de Estilo {#style-injection}

Olhando para este exemplo:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Suponhamos que `sanitizedUrl` tenha sido desinfetada, para que seja definitivamente uma URL verdadeira e não JavaScript. Com a `userProvidedStyles`, usuárioes maliciosos poderiam continuar a fornecer CSS para "sequestrar o clique", por exemplo estilizando a ligação para um caixa transparente sobre o botão "Log In" (iniciar em Português). Então se `https://user-controlled-website.com/` for criado para se parecer com a página de login do seu aplicativo, eles poderão ter capturado apenas as informações reais de login de um usuário.

Imagine como permitir que o conteúdo fornecido pelo usuário para um elemento `<style>` criaria uma vulnerabilidade ainda maior, dando este controle completo ao usuário sobre como estilizar a página inteira. É por isto que Vue evita a renderização de marcadores de `style` dentro dos modelos de marcação, como:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Para manter seus usuários totalmente seguros de 'sequestro de clique', recomendados permitir apenas o controle completo sobre CSS dentro de um `iframe` isolado em uma àrea restritta. Alternativamente, ao fornecer controle ao usuário por meio de um vínculo de estilo, recomendamos usar a [sintaxe de objeto](/guide/essentials/class-and-style#binding-to-objects-1) e permitir que os usuários forneçam apenas valores para propriedades específicas que sejam seguros para eles controlarem, como este:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Injeção de JavaScript {#javascript-injection}

Nós sempre discordamos fortemente de interpretar um elemento `<script>` com Vue, já que os modelos de marcação e funções de renderização nunca devem ter efeitos colaterais. No entanto, está não é a única maneira de incluir sequências de caracteres que seriam avaliadas como JavaScript em tempo de execução.

Todo elemento HTML tem atributos com valores aceitando sequências de caracteres de JavaScript, como `onclick`, `onfocus`, e `onmouseenter`. Vincular o JavaScript fornecido pelo usuário a qualquer um destes atributos de eventos é um potencial risco de segurança, então deve ser evitado.

:::warning AVISO
O JavaScript fornecido pelo usuário nunca pode ser considerado 100% seguro a menos que esteja em um `iframe` isolado em uma área restrita ou em uma parte da aplicação onde apenas o usuário que escreveu aquele JavaScript possa ser exposto a ele.
:::

Algumas vezes recebemos relatórios de vulnerabilidade sobre como é possível fazer programação cruzada de aplicação (XSS, sigla em Inglês) nos modelos de marcação de Vue. Em geral, não consideramos esses casos como vulnerabilidades reais porque não há uma maneira prática de proteger os programadores dos dois cenários que permitiriam o XSS:

1. O programador está explicitamente pedindo para o Vue interpretar conteúdo não desinfetado fornecido pelo usuário como modelos de marcação de Vue. Isto é inerentemente inseguro, e não existe nenhuma maneira do Vue saber a origem.

2. O programador está montando a Vue à uma página de HTML inteira que parece conter conteúdo fornecido pelo usuário gerado pelo servidor. Isto é fundamentalmente o mesmo problema da \#1, mas algumas vezes os programadores podem fazer isto sem darem-se conta disto. Isto pode conduzir a possíveis vulnerabilidades onde o atacante fornece o HTML que é seguro como HTML simples mas inseguro como um modelo de marcação Vue. A boa prática é **nunca montar a Vue em nós que possam conter conteúdo fornecido pelo usuário e gerado pelo servidor**.

## Boas Práticas {#best-practices}

A regra geral é que se permitires que conteúdo não desinfetado fornecido pelo usuário seja executado (como ou HTML, JavaScript, ou mesmo CSS), podes estar se expondo. Este conselho é realmente verdadeiro seja usando Vue, ou uma outra abstração, ou mesmo nenhuma abstração.

Além das recomendações feitas acima para os [Perigos Potenciais](#potential-dangers), também recomendamos familiarizar-se com estes recursos:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Depois use o que aprendeu para revisar também o código-fonte de suas dependências em busca de padrões potencialmente perigosos, se um deles incluir componentes de terceiros ou de outro modo influenciar o que é renderizado mo DOM.

## Coordenação do Backend {#backend-coordination}

As vulnerabilidades de segurança HTTP, como a falsificação de requisição de página cruzada (CSRF ou XSRF, siglas em Inglês) e inclusão de scripts de página cruzada (XSSI, sigla em Inglês), são abordadas principalmente no backend, portanto não são uma preocupação do Vue. No entanto, continua a ser uma boa ideia comunicar com o seu time backend para saber como interagir melhor com as suas APIs, por exemplo, eviando fichas de CSRF com envios de formulário.

## Renderização no Lado do Servidor (SSR) {#server-side-rendering-ssr}

Existem algumas preocupações adicionais de segurança ao usar o SSR, portanto, siga as práticas recomendadas descritas em nossa [nossa documentação da SSR](/guide/scaling-up/ssr) para evitar vulnerabilidades.
