# Vínculos de Formulário {#form-bindings}

Usando a `v-bind` e `v-on` ao mesmo tempo, podemos criar vínculos bidirecionais sobre os elementos de entrada de formulário:

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // um manipulador de `v-on` recebe o
    // evento nativo do DOM como argumento.
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // um manipulador de `v-on` recebe o
  // evento nativo do DOM como argumento.
  text.value = e.target.value
}
```

</div>

Tente digitar na caixa de entrada - deve ser possível ver o texto no `<p>` atualizando-se ao digitar.

Para simplificar os vínculos bidirecionais, a Vue fornece uma diretiva, `v-model`, a qual é essencialmente uma açúcar sintática para o que vimos acima:

```vue-html
<input v-model="text">
```

A `v-model` sincroniza automaticamente o valor do `<input>` com o estado vinculado, assim já não precisamos usar um manipulador de evento para isto.

A `v-model` não funciona apenas sobre as entradas de texto (`<input type="text">`), mas também sobre outros tipos de entrada tais como, caixas de confirmação (`<input type="checkbox">`), botões de rádio (`<input type="radio">`), e listas pendentes de seleção (`<select>`). Nós cobriremos mais detalhes no <a target="_blank" href="/guide/essentials/forms">Guia - Vínculos de Formulário</a>.

Agora, tente refazer o código usando a `v-model`.
