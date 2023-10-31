# Emissões {#emits}

Além de receber propriedades, um componente filho também pode emitir eventos ao componente pai:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// declarar eventos emitidos
const emit = defineEmits(['response'])

// emitir com argumento
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // declarar eventos emitidos
  emits: ['response'],
  setup(props, { emit }) {
    // emitir com argumento
    emit('response', 'hello from child')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // declarar eventos emitidos
  emits: ['response'],
  created() {
    // emitir com argumento
    this.$emit('response', 'hello from child')
  }
}
```

</div>

O primeiro argumento para <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> é o nome do evento. Quaisquer argumentos adicionais são passados ao ouvinte de evento.

O pai pode ouvir os eventos emitidos pelo filho usando a `v-on` - eis que o manipulador recebe a argumento adicional a partir da chamada de emissão do filho e o atribui ao estado local:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Agora experimente-o tu mesmo no editor.
