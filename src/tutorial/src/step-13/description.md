# Emissões

Além do recebimento de propriedades, um componente filho também pode emitir eventos para o componente pai:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// declara eventos emitidos
const emit = defineEmits(['response'])

// emitir com argumento
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // declara eventos emitidos
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
  // declara eventos emitidos
  emits: ['response'],
  created() {
    // emitir com argumento
    this.$emit('response', 'hello from child')
  }
}
```

</div>

O primeiro argumento para <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> é um nome de evento. Quaisquer argumentos além do primeiro são passados para o ouvinte de evento. 

O componente pai pode ouvir os eventos emitidos pelo componente filho utilizando o `v-on` - aqui o manipulador recebe o argumento adicional a partir da chamada da emissão do componente filho e atribui-o para o estado local:

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
