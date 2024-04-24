# Modelo Virtual do Componente {#component-v-model}

## Uso Básico {#basic-usage}

A `v-model` pode ser usada num componente para implementar um vínculo bidirecional.

<div class="composition-api">

Desde a Vue 3.4, a abordagem recomendada para alcançar isto é usar a macro [`defineModel()`](/api/sfc-script-setup#definemodel):

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
</template>
```

O pai pode então vincular um valor com `v-model`:

```vue-html
<!-- Parent.vue -->
<Child v-model="countModel" />
```

O valor retornado por `defineModel()` é uma referência. Esta pode ser acessada e alterada como qualquer outra referência, exceto que comporta-se como um vínculo bidirecional entre um valor pai e um valor local:

- Seu `.value` é sincronizado com o valor vinculado pela `v-model` do pai;
- Quando é alterada pelo filho, faz com que o valor vinculado ao pai também seja atualizado.

Isto significa que também podemos vincular esta referência a um elemento de entrada nativo com `v-model`, simplificando o embrulhar de elementos de entrada nativos enquanto fornecemos o mesmo uso de `v-model`:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Exemplo de Testes](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)


### Nos Bastidores {#under-the-hood}

A `defineModel` é uma macro de conveniência. O compilador expande-a ao seguinte:

- Uma propriedade com o nome de `modelValue`, com a qual o valor da referência local é sincronizado;
- Um evento com o nome de `update:modelValue`. que é emitido quando o valor da referência local é alterado.

É assim que implementaríamos o mesmo componente filho mostrado acima antes da versão 3.4:

```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

Como podemos ver, é um pouco mais verboso. No entanto, é útil para compreender o que acontece nos bastidores.

Uma vez que `defineModel` declara uma propriedade, podemos então declarar as opções da propriedade subjacente passando-a a `defineModel`:

```js
// tornar o `v-model` obrigatório
const model = defineModel({ required: true })

// fornecer um valor padrão
const model = defineModel({ default: 0 })
```

:::warning AVISO
Se tivermos um valor `default` para a propriedade `defineModel` e não fornecermos nenhum valor para esta propriedade do componente pai, isto pode causar uma dessincronização entre os componentes pai e filho. No exemplo abaixo, a `myRef` do componente pai é `undefined`, mas `model` do componente filho é `1`:

```js
// componente filho:
const model = defineModel({ default: 1 })

// componente pai:
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

</div>

<div class="options-api">

Primeiro, revisitaremos como a `v-model` é usada sobre um elemento nativo:

```vue-html
<input v-model="searchText" />
```

Nos bastidores, o compilador do modelo de marcação expande `v-model` ao equivalente mais verboso por nós: Então o código acima faz o mesmo que o seguinte:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Quando usada sobre um componente, `v-model` expande-se para isto:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

Para que isto realmente funcione, o componente `<CustomInput>`  deve fazer duas coisas:

1. Vincular o atributo `value` de um elemento nativo `<input>` à propriedade `modelValue`.
2. Quando um evento de `input` nativo é acionado, emitir um evento personalizado `update:modelValue` com o novo valor.

Eis o que se passa em ação:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Agora a `v-model` deve funcionar perfeitamente com este componente:

```vue-html
<CustomInput v-model="searchText" />
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

Uma outra maneira de implementar a `v-model` dentro deste componente é usar uma propriedade `computed` gravável com um recuperador e um definidor. O método `get` deve retornar a propriedade `modelValue` e o método `set` deve emitir o evento correspondente:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## Argumentos da `v-model` {#v-model-arguments}

A `v-model` sobre um componente também pode aceitar um argumento:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

No componente filho, podemos suportar o argumento correspondente passando uma sequência de caracteres à `defineModel()` como seu primeiro argumento:

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFkl9PwjAUxb9K05dhglsMb2SQqOFBE9Soj31Zxh0Uu7bpHxxZ9t29LWOiQXzaes7p2a+9a+mt1unOA53S3JaGa0csOK/nTPJaK+NISwxUpCOVUTVJMJoM1nJ/r/BNgnS9nWYnWujFMCFMlkpaRxx3AsgsFI6S3XWtViBIYda+Dg3QFLUWkFwxmWcHFqTAhQPUCwe4IiTf3Mzbtq/qujzDddRPYfruaUzNGI1PRkmG0Twb+uiY/sI9cw0/0VdQcQnL0D5KovgfL5fa4/69jiDQOOTo+S6SOYtfrvg63VolkauNN0lLxOUCzLN2HMkYnZLoBK8QQn0+Rs0ZD+OjXm6g/Dijb20TNEZfDFgwOwQZPIdzAWQN9uLtKXIPJtL7gH3BfAWrhA+Mh9idlyvEPslF2of4J3G5freLxoG0x0MF0JDsYp5RHE6Y1F9H/8adpJO4j8mOdl/Hw/nf)

Se as opções de propriedade também forem necessárias, devem ser passadas depois do nome do modelo:

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>Uso antes da 3.4</summary>

```vue
<!-- MyComponent.vue -->
<script setup>
defineModel({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

Neste caso, ao invés da propriedade `modelValue` e evento `update:modelValue` padrão, o componente filho deve esperar uma propriedade `title` e emitir um evento `update:title` para atualizar o valor do pai:

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## Vários Vínculos de `v-model` {#multiple-v-model-bindings}

Com o aproveitamento da capacidade de mirar uma propriedade e um evento em particular, como aprendemos anteriormente com os argumentos da `v-model`, podemos agora criar vários vínculos de `v-model` numa única instância de componente.

Cada `v-model` sincronizar-se-á com uma propriedade diferente, sem a necessidade de opções adicionais no componente:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>Uso antes da 3.4</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## Manipulação de Modificadores da `v-model` {#handling-v-model-modifiers}

Quando aprendemos sobre os vínculos de entrada de formulário, vimos que a `v-model` tem [modificadores embutidos](/guide/essentials/forms#modifiers) — `.trim`, `.number` e `.lazy`. Em alguns casos, também podemos querer que a `v-model` sobre o nosso componente de entrada personalizado suporte modificadores personalizados.

Criaremos um exemplo de modificador personalizado, `capitalize`, que transforma a primeira letra da sequência de caracteres fornecida pelo vínculo de `v-model` em maiúscula:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

Os modificadores adicionados a `v-model` de um componente podem ser acessados no componente filho através da desestruturação do valor de retorno da `defineModel()` da seguinte maneira:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

Para ajustar condicionalmente como o valor de ser lido ou escrito baseado nos modificadores, podemos passar as opções `get` e `set` a `defineModel()`. Estas duas opções recebem o valor na recuperação ou definição da referência do modelo e devem retornar um valor transformado. É assim que podemos usar a opção `set` para implementar o modificador `capitalize`:

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

<details>
<summary>Uso antes da 3.4</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

Os modificadores adicionados a uma `v-model` de um componente serão fornecidos ao componente através da propriedade `modelModifiers`. No exemplo abaixo, criamos um componente que contém uma propriedade `modelModifiers` que tem como padrão um objeto vazio:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Observemos que a propriedade `modelModifiers` do componente contém `capitalize` e seu valor é `true` — devido ao fato de ter sido definida sobre o vínculo da `v-model` `v-model.capitalize="myText"`.

Agora temos a nossa propriedade configurada, podemos verificar as chaves do objeto `modelModifiers` e escrever um manipulador para alterar o valor emitido. No código abaixo, transformaremos a primeira letra da sequência de caracteres em maiúscula sempre que o elemento `<input />` disparar um evento `input`.

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Experimentar na Zona de Testes](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### Modificadores para `v-model` com Argumentos {#modifiers-for-v-model-with-arguments}

<div class="options-api">

Para vínculos de `v-model` com ambos argumento e modificadores, o nome da propriedade gerada será `argumento + "Modificadores"`. Por exemplo:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

As declarações correspondentes devem ser:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

Eis um outro exemplo de uso de modificadores com várias `v-model` com diferentes argumentos:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true}
</script>
```

<details>
<summary>Uso antes da 3.4</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true}
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true}
  }
}
</script>
```

</div>
