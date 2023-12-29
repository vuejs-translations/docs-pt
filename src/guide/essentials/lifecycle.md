# Funções Gatilho do Ciclo de Vida {#lifecycle-hooks}

Cada instância do componente de Vue percorre uma séria de etapas de inicialização quando for criado - por exemplo, este precisa definir a observação de dados, compilar o modelo de marcação, montar a instância ao DOM, e atualizar o DOM quando os dados mudarem. Pelo caminho, este também executa funções chamadas de funções gatilhos do ciclo de vida, dando aos utilizadores a oportunidade de adicionar o seu próprio código em estágios específicos.

## Registando Funções Gatilho do Ciclo de Vida {#registering-lifecycle-hooks}

Por exemplo, a função gatilho <span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> pode ser usada para executar o código depois do componente ter terminado a interpretação inicial e criado os nós do DOM:

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`the component is now mounted.`)
  }
}
```

</div>

Também existem outras funções gatilhos que serão chamadas em diferentes estágios do ciclo de vida da instância, com as mais comummente usadas sendo <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted), [`onUpdated`](/api/composition-api-lifecycle#onupdated), e [`onUnmounted`](/api/composition-api-lifecycle#onunmounted).</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted), [`updated`](/api/options-lifecycle#updated), e [`unmounted`](/api/options-lifecycle#unmounted).</span>

<div class="options-api">

Todas as funções gatilhos do ciclo de vida são chamadas com o seu contexto de `this` apontando a instância ativa atualmente que estiver invocando-a. Nota que isto significa que devemos evitar usar funções flecha quando declaramos funções gatilhos do ciclo de vida, uma vez que não seremos capazes de acessar a instância do componente através da `this` se o fizermos.

</div>

<div class="composition-api">

Quando chamamos `onMounted`, a Vue associa automaticamente a função de resposta registada com a instância do componente ativo atualmente. Isto exige que estas funções gatilhos estejam registadas **de maneira síncrona** durante a definição do componente. Por exemplo, não devemos fazer isto:

```js
setTimeout(() => {
  onMounted(() => {
    // isto não funcionará.
  })
}, 100)
```

Reparemos que isto não significa que a chamada deve ser colocada de maneira léxica dentro da `setup()` ou `<script setup>`. A `onMounted()` pode ser chamada numa função externa enquanto a pilha de chamada for síncrona e surgir de dentro da `setup()`.

</div>

## Diagrama do Ciclo de Vida {#lifecycle-diagram}

Eis um diagrama do ciclo de vida da instância. Nós não precisamos entender completamente o que está acontecendo neste momento, mas conforme aprendermos e construirmos mais, será uma referência útil:

![Diagrama do Ciclo de Vida do Componente](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

Consultar a <span class="composition-api">[referência da API das Funções Gatilhos do Ciclo de Vida](/api/composition-api-lifecycle)</span><span class="options-api">[referência da API das Funções Gatilhos do Ciclo de Vida](/api/options-lifecycle)</span> por detalhes sobre todas as funções gatilhos do ciclo de vida e seus respetivos casos de uso.
