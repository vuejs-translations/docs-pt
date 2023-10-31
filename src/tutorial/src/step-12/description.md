# Propriedades {#props}

Um componente filho pode aceitar uma entrada a partir do pai através das **propriedades**. Primeiro, este precisa declarar as propriedades que aceita:

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

Notar que a `defineProps()` é uma macro de tempo de compilação e não precisa ser importada. Uma vez declara, a propriedade `msg` pode ser usada no modelo de marcação do componente filho. Esta também pode ser acessada na JavaScript através do objeto retornado da `defineProps()`.

</div>

<div class="html">

```js
// no componente filho
export default {
  props: {
    msg: String
  },
  setup(props) {
    // acessar `props.msg`
  }
}
```

Uma vez declarada, a propriedade `msg` é exposta sobre a `this` e pode ser usada no modelo de marcação do componente filho. As propriedades recebidas são passadas à `setup()` como primeiro argumento.

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

Uma vez declarada, a propriedade `msg` é exposta sobre a `this` e pode ser usada no modelo de marcação do componente.

</div>

O pai pode passar a propriedade ao filho tal como os atributos. Para passar um valor dinâmico, também podemos usar a sintaxe da `v-bind`:

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
