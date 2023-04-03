# Segurança {#security}

## Reportando Vulnerabilidades {#reporting-vulnerabilities}

Quando uma vulnerabilidade é reportada, ela torna-se imediatamente a nossa máxima preocupação, com um colaborar em tempo integral largando tudo para trabalhar sobre ela. Para reportar uma vulnerabilidade, envie um correio-eletrónico para [security@vuejs.org](mailto:security@vuejs.org).

Embora a descoberta de novas vulnerabilidades seja rara, também recomendamos sempre usar as versões mais recentes da Vue e suas bibliotecas acompanhantes oficiais para assegurar que a tua aplicação continue a mais segura possível.

## Regra Nº1: Nunca Usar Modelos de Marcação Duvidosos {#rule-no-1-never-use-non-trusted-templates}

A regra de segurança mais fundamental quando estiveres a usar a Vue é **nunca usar conteúdo duvidoso como modelo de marcação do teu componente**. Fazer isto é equivalente a permitir a execução de JavaScript arbitrário na tua aplicação - e pior, poderia levar à servir brechas se o código for executado durante a interpretação no lado do servidor. Um exemplo de tal uso seria:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA FAZER ISTO
}).mount('#app')
```

Os modelos de marcação de Vue são compilados para JavaScript, e as expressões dentro dos modelos de marcação serão executadas como parte do processo de interpretação. Embora as expressões sejam avaliadas contra um contexto de interpretação específico, por causa da complexidade dos potenciais ambientes de execução global, é inviável para uma abstração como a Vue proteger-te completamente da potencial execução de código malicioso sem sofrer com as despesas gerais de desempenho irrealistas. A maneira mais direta de evitar esta categoria de problemas no conjunto é certificar-se de que os conteúdos dos teus modelos de marcação da Vue sejam sempre de confiança e inteiramente controlados por ti.

## O Que a Vue Faz Para Proteger-te {#what-vue-does-to-protect-you}

### Conteúdo de HTML {#html-content}

Quer estejas usando os modelos de marcação ou funções de interpretação, o conteúdo é escapado automaticamente. Isto significa que neste modelo de marcação: 

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

Assim evitando a injeção de programa. Este escapamento é feito usando as APIs nativas do navegador, como `textContent`, assim uma vulnerabilidade apenas pode existir se o próprio navegador estiver vulnerável.

### Vínculos de Atributos {#attribute-bindings}

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

## Possíveis Perigos {#potential-dangers}

Em qualquer aplicação de web, permitir conteúdo não desinfetado, fornecido pelo utilizador ser executado como HTML, CSS, ou JavaScript é potencialmente perigoso, então deve ser evitado onde quer que for possível. Mas existem momentos quando o risco pode ser aceitável.

Por exemplo, serviços como CodePen e JSFiddle permitem que o conteúdo fornecido pelo utilizador seja executado, mas está em um contexto onde este é esperado e isolado em uma caixa de areia para alguma extensão dentro de elementos de `iframe`. Nestes casos onde uma funcionalidade importante inerentemente requer algum nível de vulnerabilidade, está sobre à tua equipa pesar a importância da funcionalidade contra os cenários de piores caso que a vulnerabilidade possibilita.

### Injeção de HTML {#html-injection}

Conforme aprendeste anteriormente, a Vue escapa automaticamente o conteúdo de HTML, impedindo-te de acidentalmente injetar HTML executável para dentro da tua aplicação. No entanto, **em casos onde sabes que o HTML é seguro**, podes explicitamente interpretar o conteúdo do HTML:

- Usando um modelo de marcação:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Usando uma função de interpretação:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Usando uma função de interpretação com JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
O HTML fornecido pelo utilizador nunca pode ser considerado 100% seguro a menos que seja um `iframe` isolado em uma caixa de areia ou em uma parte da aplicação onde apenas o utilizador que escreveu aquele HTML pode sempre ser exposto à ele. Adicionalmente, permitir que os utilizadores escrevam seus próprios modelos de marcação de Vue atrai perigos parecidos.
:::

### Injeção de URL {#url-injection}

Numa URL como esta:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Existe um possível problema de segurança se a URL não tiver sido "desinfetada" para evitar a execução de JavaScript usando `javascript:`. Existem bibliotecas tais como [`sanitize-url`](https://www.npmjs.com/package/@braintree/sanitize-url) para ajudar com isto, mas nota: se estiveres sempre a fazer a desinfeção no frontend, já tens um problema de segurança. **As URLs fornecidas pelo utilizador deveriam sempre ser desinfetadas no teu backend antes mesmo de serem guardadas em uma base de dados.** Portanto o problema é evitado para _todos_ os clientes conectando-se à tua API, incluindo aplicações móveis nativas. Também nota que mesmo com URLs desinfetadas, a Vue não pode ajudar-te a garantir que conduzam para destinos seguros.

### Injeção de Estilo {#style-injection}

Olhando neste exemplo:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Suponhamos que `sanitizedUrl` foi desinfetada, para que seja definitivamente uma URL verdadeira e não JavaScript. Com a `userProvidedStyles`, utilizadores maliciosos poderiam continuar a fornecer CSS para "sequestrar o clique", por exemplo estilizando a ligação para um caixa transparente sobre o botão "Log In" (iniciar em Português). Então se `https://user-controlled-website.com/` estiver construída para parecer-se com a página de inicialização da tua aplicação, podem já ter capturado uma informação de inicialização verdadeira do utilizador.

Tu podes ser capaz de imaginar como permitir que o conteúdo fornecido pelo utilizador para um elemento `<style>` criaria uma vulnerabilidade ainda mais grande, dando este controlo completo do utilizador sobre como estilizar a página inteira. É por isto que a Vue evita a interpretação de marcadores de `style` dentro dos modelos de marcação, tais como:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Para manter os teus utilizadores completamente seguros sequestro de clique, recomendados apenas permitir o controlo completo sobre a CSS dentro de um `iframe` isolado em caixa de areia. Alternativamente, quando estiveres fornecendo controlo de utilizador através de um vínculo de estilo, recomendamos usar a sua [sintaxe de objeto](/guide/essentials/class-and-style#binding-to-objects-1) e permitir apenas que os utilizadores forneçam valores para propriedades específicas que sejam seguros para eles controlarem, como esta:

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

Nós sempre discordamos fortemente de interpretar um elemento `<script>` com a Vue, já que os modelos de marcação e funções de interpretação nunca deveriam ter efeitos colaterais. No entanto, isto não é a única maneira de incluir sequências de caracteres que seriam avaliadas como JavaScript em tempo de execução.

Todo elemento de HTML tem atributos com valores aceitando sequências de caracteres de JavaScript, tais como `onclick`, `onfocus`, e `onmouseenter`. Vincular o JavaScript fornecido pelo utilizador para quaisquer um destes atributos de eventos é um potencial risco de segurança, então deveria ser evitada.

:::warning
O JavaScript fornecido pelo utilizador nunca pode ser considerado 100% seguro a menos que esteja em um `iframe` isolado em um caixa de areia ou em uma parte da aplicação onde apenas o utilizador que escreveu aquele JavaScript pode sempre ser exposto à ele.
:::

Algumas vezes recebemos relatórios de vulnerabilidade sobre como é possível fazer programação cruzada de aplicação (XSS, sigla em Inglês) nos modelos de marcação de Vue. Em geral, não consideramos tais casos como sendo vulnerabilidades reais porque não existe nenhuma maneira prática de proteger os programadores de dois cenários que permitiriam a XSS:

1. O programador está explicitamente pedindo para Vue interpretar conteúdo não desinfetado fornecido pelo utilizador como modelos de marcação de Vue. Isto é inerentemente inseguro, e não existe nenhuma maneira da Vue saber a origem.

2. O programador está montando a Vue à uma página de HTML inteira que parece conter conteúdo fornecido pelo utilizador gerado pelo servidor. Isto é fundamentalmente o mesmo problema da \#1, mas algumas vezes os programadores podem fazer isto sem darem-se conta disto. Isto pode conduzir a possíveis vulnerabilidades onde o atacante fornece o HTML que é seguro como HTML simples mas inseguro como um modelo de marcação de Vue. A boa prática é **nunca montar a Vue sobre nós que podem conter conteúdo fornecido pelo utilizador e gerado pelo servidor**.

## Boas Práticas {#best-practices}

A regra geral é que se permitires que conteúdo não desinfetado fornecido pelo utilizador seja executado (como ou HTML, JavaScript, ou mesmo CSS), podes estar a expor-te a ti mesmo à ataques. Este aconselhamento provasse verdadeiro seja se estiveres a usar a Vue, ou uma outra abstração, ou mesmo nenhuma abstração.

Além das recomendações feitas acima para os [Possíveis Perigos](#potential-dangers), também recomendamos familiarizares-te com estes recursos:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Depois use o que aprenderes para também revisares o código-fonte das tuas dependências por padrões potencialmente perigosos, se quaisquer uma delas incluir componentes de terceiros ou de outro modo influencia o que é apresentado ao DOM.

## Coordenação do Backend {#backend-coordination}

As vulnerabilidades de segurança de HTTP, tais como a falsificação de requisição de página cruzada (CSRF ou XSRF, siglas em Inglês) e inclusão de programa de página cruzada (XSSI, sigla em Inglês), são primeiramente dirigidos sobre o backend, então não são uma preocupação da Vue. No entanto, continua a ser uma boa ideia comunicar com a tua equipa de backend para aprenderes a como melhor interagir com as suas APIs, por exemplo, submetendo fichas de CSRF com as submissões de formulário.

## Interpretação no Lado do Servidor (SSR) {#server-side-rendering-ssr}

Existem algumas preocupações de segurança adicionais quando usas a SSR, então certifica-te de seguir as boas práticas sublinhadas ao longo da [nossa documentação da SSR](/guide/scaling-up/ssr) para evitares vulnerabilidades.
