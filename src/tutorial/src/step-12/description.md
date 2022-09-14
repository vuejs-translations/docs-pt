# Propriedades

Um componente filho pode aceitar uma entrada a partir do pai através das **propriedades**. Primeiro, ele precisa declarar as propriedades que ele aceita:

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Nota que `defineProps()` é uma macro de tempo de compilação e não precisa ser importada. Uma vez declarada, a propriedade `msg` pode ser utilizada no modelo de marcação do componente filho. Ela também pode ser acessada na JavaScript através do objeto retornado de `defineProps()`.

</div>

<div class="html">

```js
// no componente filho
export default {
  props: {
    msg: String
  },
  setup(props) {
    // acessa props.msg
  }
}
```

Uma vez declarada, a propriedade `msg` é exposta no `this` e pode ser utilizada no modelo de marcação do componente filho. As propriedades recebidas são passadas para `setup()` como primeiro argumento.

</div>

</div>

<div class="options-api">

```js
// no componente filho
export default {
  props: {
    msg: String
  }
}
```

Uma vez declarada, a propriedade `msg` é exposta no `this` e pode ser utilizada no modelo de marcação do componente.

</div>

O componente pai pode passar a propriedade para o componente filho tal como atributos. Para passar um valor dinâmico, também podemos utilizar a sintaxe de `v-bind`:

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

Agora experimente-o tu mesmo no editor.
