# Componentes

Até aqui, apenas temos estado trabalhando com um componente único. Aplicações de Vue reais normalmente são criadas com componentes encaixados.

Um componente pai pode interpretar um outro componente no seu modelo de marcação como um componente filho. Para utilizar um componente filho, precisamos importá-lo primeiro:

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

Também precisamos registar o componente utilizando a opção `components`. Cá estamos utilizando a abreviação da propriedade do objeto para registar o componente `ChildComp` sob a chave `ChildComp`.

</div>
</div>

<div class="sfc">

Depois, podemos utilizar o componente no modelo de marcação como:

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

Também precisamos registar o componente utilizando a opção `components`. Cá estamos utilizando a abreviação da propriedade do objeto para registar o componente `ChildComp` sob a chave `ChildComp`.

Uma vez que estamos escrevendo o modelo de marcação no DOM, ele será sujeito as regras de analise do navegador, que é insensível a caixa para nomes de marcador. Portanto, precisamos utilizar o nome no padrão *kebab-case* para referenciar o componente filho:


```vue-html
<child-comp></child-comp>
```

</div>


Agora experimente-o tu mesmo - importe o componente filho e interprete-o no modelo de marcação.
