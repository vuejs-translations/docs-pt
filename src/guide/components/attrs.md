---
outline: deep
---

# Atributos de Passagem {#fallthrough-attributes}

> Esta página parte do princípio de que já lemos a secção [Fundamentos dos Componentes](/guide/essentials/component-basics). Nós precisamos de a ler primeiro se formos novos aos componentes.

## Herança de Atributo {#attribute-inheritance}

Um "atributo de passagem" é um atributo ou ouvinte de evento de `v-on` que é passado a um componente, mas não é explicitamente declarado nas [propriedades](./props) ou [emissões](./events#declaring-emitted-events) do componente recetor. Os exemplos comuns disto incluem os atributos `class`, `style`, e `id`.

Quando um componente desenhar um único elemento de raiz, os atributos de passagem serão automaticamente adicionados aos atributos do elemento de raiz. Por exemplo, dado um componente `<MyButton>` com o seguinte modelo de marcação:

```vue-html
<!-- modelo de marcação do <MyButton> -->
<button>click me</button>
```

E um pai que utiliza este componente com:

```vue-html
<MyButton class="large" />
```

O modelo de objeto do documento (DOM) resultante seria:

```html
<button class="large">click me</button>
```

Neste exemplo, `<MyButton>` não declarou `class` como uma propriedade aceita. Portanto, `class` é tratado como um atributo de passagem e automaticamente adicionado ao elemento de raiz do `<MyButton>`.

### Fusão de `class` e `style` {#class-and-style-merging}

Se o elemento de raiz do componente filho já tiver atributos `class` ou `style` existentes, este será fundido com os valores de `class` e `style` que serão herdados do pai. Suponhamos que alteramos o modelo de marcação do `<MyButton>` no exemplo anterior para:

```vue-html
<!-- modelo de marcação do <MyButton> -->
<button class="btn">click me</button>
```

Então, o modelo de objeto do documento (DOM) resultante tornar-se-ia agora:

```html
<button class="btn large">click me</button>
```

### Herança de Ouvinte de `v-on` {#v-on-listener-inheritance}

A mesma regra se aplica aos ouvintes de eventos de `v-on`:

```vue-html
<MyButton @click="onClick" />
```

O ouvinte de `click` será adicionado ao elemento de raiz do `<MyButton>`, ou seja, o elemento nativo `<button>`. Quando o `<button>` nativo for clicado, acionará o método `onClick` do componente pai. Se o `<button>` nativo já tiver um ouvinte de `click` vinculado com `v-on`, então ambos os ouvintes serão acionados.

### Herança de Componente Encaixado {#nested-component-inheritance}

Se um componente desenhar outro componente como seu nó de raiz, por exemplo, nós refizemos `<MyButton>` para desenhar um `<BaseButton>` como sua raiz:

```vue-html
<!-- modelo de marcação do <MyButton/> que simplesmente desenha um outro componente -->
<BaseButton />
```

Então os atributos de passagem recebidos por `<MyButton>` serão automaticamente encaminhados ao `<BaseButton>`.

Nota que:

1. Os atributos encaminhados não incluem quaisquer atributos que são declarados como propriedades, ou ouvintes de `v-on` de eventos declarados por `<MyButton>` - em outras palavras, as propriedades e os ouvintes declarados foram "consumidos" por `<MyButton>`.

2. Os atributos encaminhados podem ser aceites como propriedades por `<BaseButton>`, se declarados por este.

## Desativando a Herança de Atributo {#disabling-attribute-inheritance}

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

Lembra-te de que a [`v-bind` sem um argumento](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) vincula todas as propriedades de um objeto como atributos do elemento alvo.

## Herança de Atributo sobre Vários Nós de Raiz {#attribute-inheritance-on-multiple-root-nodes}

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

## Acessando Atributos Que Caiem na JavaScript {#accessing-fallthrough-attributes-in-javascript}

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
