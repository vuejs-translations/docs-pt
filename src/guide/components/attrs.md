---
outline: deep
---

# Atributos que Caiem

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

## Herança de Atributo

Um "atributo que cai" é um atributo ou ouvinte de evento `v-on` que é passado para um componente, mas não é explicitamente declarado nas [propriedades](./props) ou [emissões](./events.html#declarando-eventos-emitidos) do componente que está recebendo. Exemplos comuns disto incluem atributos de `class`, `style` e `id`.

Quando um componente interpreta um único elemento de raiz, os atributos que caiem serão automaticamente adicionados aos atributos do elemento de raiz. Por exemplo, dado um componente `<MyButton>` com o seguinte modelo de marcação:

```vue-html
<!-- modelo de marcação do <MyButton> -->
<button>click me</button>
```

E um componente pai utilizando este componente com:

```vue-html
<MyButton class="large" />
```

O DOM interpretado final seria:

```html
<button class="large">click me</button>
```

### Fundição de `class` e `style`

Se o elemento de raiz do componente filho já tiver atributos `class` ou `style` existente, ele será fundido com os valores de `class` e `style` que são herdados do componente pai. Suponha que mudamos o modelo de marcação do `<MyButton>` no exemplo anterior para:

```vue-html
<!-- modelo de marcação do <MyButton> -->
<button class="btn">click me</button>
```

Então o DOM interpretado final agora tornar-se-ia:

```html
<button class="btn large">click me</button>
```

### Herança de Ouvinte `v-on`

A mesmo regra aplica-se aos ouvintes de evento `v-on`:

```vue-html
<MyButton @click="onClick" />
```

O ouvinte de `click` será adicionado ao elemento de raiz do `<MyButton>`, por exemplo, o elemento `<button>` nativo. Quando o `<button>` nativo for clicado, acionará o método `onClick` do componente pai. Se o `<button>` nativo já tiver um ouvinte de `click` vinculado com `v-on`, então ambos ouvintes acionarão.

### Herança de Componente Encaixado

Se um componente interpretar um outro componente como seu nó de raiz, por exemplo, refatoramos `<MyButton>` para interpretar um `<BaseButton>` como seu raiz:

```vue-html
<!-- modelo de marcação do <MyButton/> que simplesmente interpreta um outro componente -->
<BaseButton />
```

Então os atributos que caiem recebidos pelo `<MyButton>` será automaticamente passados para `<BaseButton>`.

Nota que:

1. Os atributos passados não incluem quaisquer atributos que são declarados como propriedades, ou ouvintes de `v-on` dos eventos declarados pelo `<MyButton>` - em outras palavras, as propriedades e ouvintes declarados têm sido "consumidas" pelo `<MyButton>`.

2. Os atributos passados podem ser aceitados como propriedades pelo `<BaseButton>`, se declarados por ele.

## Desativando a Herança de Atributo

Se **não** quiseres que um componente herde atributos automaticamente, podes definir `inheritAttrs: false` nas opções do componente.

<div class="composition-api">

Se estiveres utilizando `<script setup>`, precisarás declarar esta opção utilizando um bloco `<script>` normal separado:

```vue
<script>
// utilize <script> normal para declarar as opções
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...lógica de "setup"
</script>
```

</div>

O cenário comum para desativação da herança de atributo é quando os atributos precisam ser aplicados para outros elementos para além do nó de raiz. Ao definir a opção `inheritAttrs` para `false`, podes conseguir o controlo total sobre onde os atributos que caiem devem ser aplicados.

Estes atributos que caiem podem ser acessados diretamente nas expressões de modelo de marcação como `$attrs`:

```vue-html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

O objeto `$attrs` inclui (por exemplo, `class`, `style`, ouvintes de `v-on`, etc.).

Algumas notas:

- Ao contrário das propriedades, os atributos que caiem preservam sua caixa original na JavaScript, assim um atributo como `foo-bar` precisa ser acessado como `$attrs['foo-bar']`.

- Um ouvinte de evento de `v-on` como `@click` será exposto sobre o objeto como uma função sob `$attrs.onClick`.

Utilizando o nosso exemplo de componente `<MyButton>` da [secção anterior](#herança-de-atributo) - algumas vezes precisamos envolver o atual elemento `<button>` com um `<div>` adicional para propósitos de estilização:

```vue-html
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
```

Nós queremos que todos atributos que caiem como `class` e ouvintes de `v-on` sejam aplicados ao `<button>` interno, e não ao `<div>`. Nós podemos alcançar isto com o `inheritAttrs: false` e `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

Lembra-te de que a [`v-bind` sem um argumento](/guide/essentials/template-syntax.html#vincular-vários-atributos-dinamicamente) vincula todas as propriedades de um objeto como atributos do elemento alvo.

## Herança de Atributo sobre Vários Nós de Raiz

Ao contrário dos componentes com um único nó de raiz, os componente com vários nós de raiz não tem comportamento de cair de atributo. Se `$attrs` não for vinculado explicitamente, um aviso de tempo de execução será emitido.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Se `<CustomLayout>` tiver o seguinte modelo de marcação de várias raízes, existirá um aviso porque a Vue não pode estar certa sobre onde aplicar os atributos que caiem:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

O aviso será suprimido se `$attrs` for explicitamente vinculado:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Acessando Atributos Que Caiem na JavaScript

<div class="composition-api">

Se necessário, podemos acessar os atributos que caiem de um componente no `<script setup>` utilizando a API `useAttrs()`:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Se não estiveres utilizando o `<script setup>`, `attrs` será exposta como uma propriedade do contexto de `setup()`:

```js
export default {
  setup(props, ctx) {
    // os atributos que caiem são expostos como ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Nota que apesar do objeto `attrs` sempre refletir os atributos que caiem mais recentes, ele não é reativo (por razões de desempenho). Tu não podes utilizar os observadores para observar as suas mudanças. Se precisares de reatividade, utilize uma propriedade. Alternativamente, podes utilizar `onUpdated()` para realizar os efeitos colaterais com `attrs` mais recente sobre cada atualização.

</div>

<div class="options-api">

Se necessário, podemos acessar os atributos que caiem de um componente através da propriedade de instância `$attrs`:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
