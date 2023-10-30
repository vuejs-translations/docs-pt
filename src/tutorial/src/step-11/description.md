# Componentes {#components}

Até aqui, apenas temos estado a trabalhar com um único componente. As aplicações reais de Vue normalmente são criadas com componentes encaixados.

Um componente pai pode interpretar um outro componente no seu modelo de marcação como um componente filho. Para usar um componente filho, primeiro precisamos importá-lo:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

Nós também precisamos registar o componente usando a opção `components`. Eis que estamos usando a abreviatura de propriedade de objeto para registar o componente `ChildComp` sob a chave `ChildComp`.

</div>
</div>

<div class="sfc">

Depois, podemos usar o componente no modelo de marcação como:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

Nós também precisamos registar o componente usando a opção `components`. Eis que estamos usando a abreviatura de propriedade de objeto para registar o componente `ChildComp` sob a chave `ChildComp`.

Já que estamos a escrever o modelo de marcação no DOM, este estará sujeito as regras de analise sintática do navegador, o qual é insensível a caixa para os nomes de marcador. Portanto, precisamos usar o nome no padrão de *caixa-espetada* para referenciar o componente filho:


```vue-html
<child-comp></child-comp>
```

</div>


Agora experimente tu mesmo - importe o componente filho e interprete-o no modelo de marcação.
