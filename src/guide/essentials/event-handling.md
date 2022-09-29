# Manipulação de Evento

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Aula Gratuita Sobre Eventos em Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Aula Gratuita Sobre Eventos em Vue.js"/>
</div>

## Ouvindo Eventos

Nós podemos utilizar a diretiva `v-on`, que normalmente abreviamos para o simbolo `@`, para ouvir os eventos do DOM e executar algum código de JavaScript quando são acionadas. A utilização seria `v-on:click="handler"` ou com o atalho, `@click="handler"`.

O valor de `handler` (manipulador) pode ser um dos seguintes:

1. **Manipuladores em linha:** O código de JavaScript em linha pode ser executado quando o evento é acionado (semelhante ao atributo `onclick` nativo).

2. **Manipuladores de método:** O nome da propriedade ou o caminho que aponta para um método definido no componente.

## Manipuladores Em Linha

Os manipuladores em linha normalmente são utilizados em casos simples, por exemplo:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnRlciA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcblx0ICByZXR1cm4ge1xuICAgIFx0Y291bnRlcjogMFxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Manipuladores de Método

A lógica para muitos manipuladores de evento será mais complexa, e provavelmente não é viável com manipuladores em linha. É por isto que a `v-on` também pode aceitar o nome ou caminho de um metódo do componente que gostarias de chamar.

Por exemplo:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` é um evento de DOM nativo
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` dentro de métodos aponta para atual instância ativa
    alert(`Hello ${this.name}!`)
    // `event` é um evento de DOM nativo
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` é o nome do método definido acima -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbmFtZSA9IHJlZignVnVlLmpzJylcblxuZnVuY3Rpb24gZ3JlZXQoZXZlbnQpIHtcbiAgYWxlcnQoYEhlbGxvICR7bmFtZS52YWx1ZX0hYClcbiAgLy8gYGV2ZW50YCBpcyB0aGUgbmF0aXZlIERPTSBldmVudFxuICBpZiAoZXZlbnQpIHtcbiAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJncmVldFwiPkdyZWV0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1Z1ZS5qcydcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBncmVldChldmVudCkge1xuICAgICAgLy8gYHRoaXNgIGluc2lkZSBtZXRob2RzIHBvaW50cyB0byB0aGUgY3VycmVudCBhY3RpdmUgaW5zdGFuY2VcbiAgICAgIGFsZXJ0KGBIZWxsbyAke3RoaXMubmFtZX0hYClcbiAgICAgIC8vIGBldmVudGAgaXMgdGhlIG5hdGl2ZSBET00gZXZlbnRcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxidXR0b24gQGNsaWNrPVwiZ3JlZXRcIj5HcmVldDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Um manipulador de método recebe automaticamente o objeto de evento de DOM nativo que o aciona - no exemplo acima, somos capazes de acessar o elemento despachando o evento através de `event.target.tagName`.

<div class="composition-api">

Consulte: [Tipando Manipuladores de Evento](/guide/typescript/composition-api.html#tipando-manipulandores-de-evento) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Consulte: [Tipando Manipuladores de Evento](/guide/typescript/options-api.html#tipando-manipulandores-de-evento) <sup class="vt-badge ts" />

</div>

### Método vs. Deteção Em Linha

O compilador do modelo de marcação deteta os manipuladores de método verificando se o valor de sequência de caracteres de `v-on` é um identificador de JavaScript válido ou caminho de acesso de propriedade. Por exemplo, `foo`, `foo.bar` e `foo['bar']` são tratados como manipuladores de métodos, enquanto `foo()` e `count++` são tratados como manipuladores em linha.

## Chamando Métodos em Manipuladores Em Linha

No lugar de vincular diretamente para um nome de método, também podemos chamar métodos em um manipulador em linha. Isto permite-nos passar os argumentos personalizados do método ao invés do evento nativo:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmZ1bmN0aW9uIHNheShtZXNzYWdlKSB7XG4gIGFsZXJ0KG1lc3NhZ2UpXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8YnV0dG9uIEBjbGljaz1cInNheSgnaGknKVwiPlNheSBoaTwvYnV0dG9uPlxuICA8YnV0dG9uIEBjbGljaz1cInNheSgnd2hhdCcpXCI+U2F5IHdoYXQ8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0aG9kczoge1xuXHQgIHNheShtZXNzYWdlKSB7XG4gICAgXHRhbGVydChtZXNzYWdlKVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ2hpJylcIj5TYXkgaGk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ3doYXQnKVwiPlNheSB3aGF0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Acessando Argumento de Evento nos Manipuladores Em Linha

Algumas vezes também precisamos acessar o evento de DOM original em um manipulador em linha. Tu podes passá-lo para um método utilizando variável especial `$event`, ou utilizar uma função em flecha em linha:

```vue-html
<!-- utilizando a variável especial $event -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- utilizando a função em flecha em linha -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // agore temos acesso ao evento nativo
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // agore temos acesso ao evento nativo
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Modificadores de Evento

É muito comum precisar chamar `event.preventDefault()` ou `event.stopPropagation()` dentro de manipuladores de evento. Ainda que possamos fazer isto facilmente dentro de métodos, seria melhor se os métodos pudessem ser puramente a respeito da lógica dos dados em vez de ter que lidar com detalhes de evento de DOM.

Para tratar este problema, a Vua fornece **modificadores de evento** para `v-on`. Recorda-te de que os modificadores são nomes especiais depois do nome do evento denotados por um ponto.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- o propagação do evento de clique será interrompida -->
<a @click.stop="doThis"></a>

<!-- o evento de submeter já não recarregará a página -->
<form @submit.prevent="onSubmit"></form>

<!-- modificadores podem ser encadeiados -->
<a @click.stop.prevent="doThat"></a>

<!-- apenas o modificador -->
<form @submit.prevent></form>

<!-- apenas aciona o manipulador se `event.target` for o próprio elemento -->
<!-- por exemplo, não um elemento filho -->
<div @click.self="doThat">...</div>
```

::: tip
A ordem importa quando estiveres utilizando modificadores porque o código relevante é gerado na mesma ordem. Portanto a utilização de `@click.prevent.self` impedirá **a ação de cliques padrão sobre o próprio elemento e seus filhos** enquanto `@click.self.prevent` só impedirá a ação de cliques padrão sobre o próprio elemento.
:::

Os modificadores `.capture`, `.once`, e `.passive` refletem as [opções do método `addEventListener` nativo](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- utilize o modo de captura quando estiveres adicionando o ouvinte de evento -->
<!-- por exemplo, um evento mirando um elemento interno é manipulado aqui antes de ser manipulado por aquele elemento -->
<div @click.capture="doThis">...</div>

<!-- o evento de clique será acionado no máximo uma vez -->
<a @click.once="doThis"></a>

<!-- o comportamente padrão do evento de rolagem (rolando) acontecerá -->
<!-- imediatamente, no lugar de esperar o `onScroll` terminar  -->
<!-- neste caso ele contém `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

O modificador `.passive` é normalmente utilizado com o ouvintes de evento de toque para [melhorar o desempenho nos dispositivos móveis](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).

::: tip
Não utilize `.passive` e `.prevent` juntos, porque `.passive` já indica para o navegador que _não_ tencionas previnir o comportamente padrão do evento, e provavelmente verás um aviso a partir do navegador se o fizeres.
:::

## Modificadores de Tecla

Quando estivermos ouvindo por eventos teclado, precisamos com frequência verificar por teclas especificas. A Vue permite a adição de modificadores de tecla para `v-on` ou `@` quando estivermos ouvindo por eventos de tecla:

```vue-html
<!-- só chama `vm.submit()` quando a `tecla` pressionada for `Enter` -->
<input @keyup.enter="submit" />
```

Tu podes utilizar diretamente quaisquer nomes de tecla válidos expostos através de [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) como modificadores convertendo-os para "kebab-case".

```vue-html
<input @keyup.page-down="onPageDown" />
```

No exemplo acima, o manipulador só será chamado se `$event.key` for igual a `'PageDown'`.

### Pseudónimos de Tecla

A Vua fornece pseudónimos para as teclas mais comummente utilizadas:

- `.enter`
- `.tab`
- `.delete` (captura ambas teclas "Delete" e "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Teclas Modificadoras do Sistema

Tu podes utilizar os seguintes modificadores para acionares ouvintes de eventos de teclado ou rato apenas quando a tecla modificadora correspondente for pressionada:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Nota
Nos teclados de Macintosh, meta é a tecla de comando (⌘). Nos teclados de Windows, meta é a tecla de Windows (⊞). Nos teclados de Sun Microsystems, meta é marcado como um diamante sólido (◆). Em certos teclados, especialmente teclados de MIT e máquina de Lisp e sucessores, tais como o teclado de Knight, teclado space-cadet, meta é rotulado “META”. Nos teclados simbólicos, meta é rotulado “META” ou “Meta”.
:::

Por exemplo:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Nota que as teclas modificadoras são diferentes das teclas normais e quando utilizadas com eventos de `keyup`, elas têm que ser pressionadas quando o evento for emitido. Em outras palavras, `keyup.ctrl` só acionará se libertares uma tecla enquanto estiveres pressionando `ctrl` para baixo. Não acionará se libertares apenas a tecla `ctrl`. 
:::

### O Modificador `.exact`

O modificador `.exact` permite o controlo da combinação exata de modificadores de sistema necessária para acionar um evento.

```vue-html
<!-- isto disparará mesmo se Alt ou Shift também for pressionado -->
<button @click.ctrl="onClick">A</button>

<!-- isto só disparará quando Ctrl e não outras teclas for pressionado -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- isto só disparará quando nenhum dos modificadores do sistema for pressionado -->
<button @click.exact="onClick">A</button>
```

## Modificadores de Botão de Rato

- `.left`
- `.right`
- `.middle`

Estes modificadores limitam o manipulador para os eventos acionadados por um botão de rato especifico.
