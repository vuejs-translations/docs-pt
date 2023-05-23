# Teletransporte {#teleport}

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Aula Gratuita sobre Teleport de Vue.js"/>

`<Teleport>` é um componente embutido que permite-nos "teletransportar" uma parte de um modelo de marcação do componente para um nó de DOM que existe fora da hierarquia do DOM deste componente.

## Uso Básico {#basic-usage}


Algumas vezes podemos correr para os seguintes cenários: uma parte de um modelo de marcação do componente pertence a ele logicamente, mas a partir de um ponto de vista visual, ele deve ser exibido noutro lugar no DOM, fora da aplicação de Vue.

O exemplo mais comum disto é quando construimos um modal de tela cheia. Idealmente, queremos que o botão do modal e o próprio modal vivam dentro do mesmo componente, já que estão ambos relacionados ao estado abertura e fechamento do modal. Mas isto significa que o modal será interpretado junto do botão, profundamente encaixado na hierarquia do DOM da aplicação. Isto pode criar algumas questões complicadas quando posicionamos o modal através de CSS.

Considere a seguinte estrutura de HTML:

```vue-html
<div class="outer">
  <h3>Vue Teleport Example</h3>
  <div>
    <MyModal />
  </div>
</div>
```

E cá está a implementação do `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

O componente contém um `<button>` para acionar a abertura do modal, e a `<div>` uma classe `.modal`, a qual conterá o conteúdo do modal e um botão que se fecha a si mesmo.

Quando usamos este componente dentro da estrutura inicial de HTML, existe um número de potenciais questões:

- `position: fixed` apenas coloca o elemento relativo a janela de exibição quando nenhum elemento ancestral tiver a propriedade `transform`, `perspective` ou `filter` definida. Se, por exemplo, tencionamos animar o ancestral `<div class="outer">` com a transformação de CSS, quebraria a disposição do modal!

- O `z-index` do modal é restrito pelos seus elementos que o contém. Se houver um outro elemento que sobrepõem-se ao `<div class="outer">` e tiver um `z-index` superior, ele cobriria o nosso modal.

`<Teleport>` fornece um maneira clara de os contornar, permitindo-nos fugir da estrutura de DOM encaixada. Vamos modificar `<MyModal>` para usar `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

O alvo do `to` de `<Teleport>` espera uma sequência de caracteres de seletor de CSS ou um nó de DOM real. Aqui, estamos essencialmente dizendo a Vue para "**teletransportar** este fragmento de modelo de marcação **para** o marcador **`body`**".

Tu podes clicar no botão abaixo e inspecionar o marcador `<body>` através da ferramenta de programação do navegador:

<script setup>
let open = $ref(false)
</script>

<div class="demo">
  <button @click="open = true">Open Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Hello from the modal!</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Tu podes combinar `<Teleport>` com [`<Transition>`](./transition) para criar modais animados - consulte o [exemplo](/examples/#modal).

:::tip Dica
O alvo `to` da teletransportação já deve estar no DOM quando o componente `<Teleport>` for montado. Idealmente, isto deve ser um elemento fora da aplicação de Vue inteira. Se virando um outro elemento interpretado pela Vue, precisas certificar-te de que o elemento seja montado antes do `<Teleport>`.
:::

## Usando com Componentes {#using-with-components}

`<Teleport>` apenas altera a estrutura do DOM interpretada - ele não afeta a hierarquia lógica dos componentes. Isto é, se `<Teleport>` contiver um componente, este componente continuará a ser um filho lógico do componente pai contendo o `<Teleport>`. A passagem de propriedades e emissão de evento continuarão a funcionar da mesma maneira.

Isto também significa que as injeções de um componente pai funcionam como esperado, e que o componente filho será encaixado abaixo do componente pai na Ferramenta de Programação de Vue, ao invés de ser colocado para onde o conteúdo real foi movido.

## Desativando o Teletransporte {#disabling-teleport}

Em alguns casos, podemos querer desativar condicionalmente `<Teleport>`. Por exemplo, podemos interpretar um componente como uma sobreposição para a área de trabalho, mas em linha no telemóvel. `<Teleport>` suporta a propriedade `disabled` que pode ser alternada dinamicamente:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Onde o estado `isMobile` pode ser atualizado dinamicamente detetando mudanças de consulta de media.

## Vários Teletransporte sobre o Mesmo Alvo {#multiple-teleports-on-the-same-target}


Um caso de uso comum seria um componente `<Modal>` reutilizável, com o potencial para várias instâncias a serem ativadas ao mesmo tempo. Para este tipo de cenário, vários componentes `<Teleport>` podem montar seus conteúdos para o mesmo elemento de alvo. A ordem será um simples adição - depois as montagens serão localizadas depois dos anteriores dentro do elemento de alvo.

Dada o seguinte uso:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

O resultado interpretado seria:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

---

**Relacionado ao**

- [Referência de API de `<Teleport>`](/api/built-in-components#teleport)
- [Manipulando Teletransportações na SSR](/guide/scaling-up/ssr#teleports)
