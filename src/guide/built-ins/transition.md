<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transição {#transition}

A Vue oferece dois componentes embutidos que podem ajudar a trabalhar com as transições e animações em resposta as mudanças de estado:

- `<Transition>` para aplicação de animações quando um elemento ou componente está entrando ou saindo do DOM. Isto é abordado nesta página.

- `<TransitionGroup>` para aplicação de animações quando um elemento ou componente é inserido, removido, movido de dentro de uma lista de `v-for`. Isto é abordado [no próximo capítulo](/guide/built-ins/transition-group.html).

Além destes dois componentes, podemos também aplicar animações na Vue usando outras técnicas tais como alternância de classes de CSS ou animações orientadas a estado através vinculações de estilo. Estas técnicas adicionais são abordadas no capítulo [Técnicas de Animação](/guide/extras/animation.html).

## O Componente `<Transition>` {#the-transition-component}

`<Transition>` é um componente embutido: isto significa que está disponível em qualquer modelo de marcação do componente sem ter que registá-lo. Isto pode ser utilizado para aplicar animações de entrada e saída sobre os elementos ou componentes passados para ele através da sua ranhura padrão. A entrada e saída pode ser acionada por um dos seguintes:

- Interpretação condicional através de `v-if`
- Exibição condicional através de `v-show`
- Alternância de componentes dinâmicos através do elemento especial `<component>`

Isto é um exemplo de uso mais básico:

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* nós explicaremos o que são estas classes fazem a seguir! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip Dica
`<Transition>` apenas suporta um único elemento ou componente como seu conteúdo de ranhura. Se o conteúdo é um componente, o componente deve também ter apenas um único elemento de raiz.
:::

Quando um elemento em um componente `<Transition>` é inserido ou removido, isto é o que acontece:

1. A Vue automaticamente farejará se elemento alvo tiver transições de CSS ou animações aplicadas. Se tiver, um número de [classes de transições de CSS](#classes-de-transição) serão adicionadas ou removidas no momento apropriado.

2. Se houverem ouvintes para [gatilhos de JavaScript](#gatilhos-de-javascript), estes gatilhos serão chamados no momento apropriado.

3. Se nenhuma transição ou animação de CSS for detetada e nenhum gatilho de JavaScript for fornecido, as operações do DOM para inserção e ou remoção serão executadas sobre o próximo quadro de animação do navegador.

## Transições Baseadas em CSS {#css-based-transitions}

### Classes de Transição {#transition-classes}

Existem seis classes aplicadas para as transições de entrada e saída.

![Diagrama de Transição](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: Estado inicial para entrada. Adicionado antes do elemento ser inserido, removido um quadro depois do elemento ser inserido.

2. `v-enter-active`: estado ativo para entrada. Aplciado durante a fase de entrada inteira. Adicionado antes do elemento ser inserido, removido quando a transição ou animação terminar. Esta calsse pode ser usada para definir a duração, o atraso e a curva de flexão para a transição de entrada.

3. `v-enter-to`: Estado final para entrada. Adicionado um quadro depois do elemento ser inserido (no mesmo momento que `v-enter-from` for removido), removido quando a transição ou animação terminar.

4. `v-leave-from`: Estado inicial para saída. Adicionada imediatamente quando a transição de saída for acionada, removida depois de um quadro.

5. `v-leave-active`: Estado ativo para saída. Aplicada durante a fase de saída inteira. Adicionada imediatamente quando um transição de saída é acionada, removida quando a transição ou animação termina. Esta classe pode ser usada para definir a duração, atraso e a curva de flexão para a transição de saída.

6. `v-leave-to`: Estado final para saída. Adicionada um quadro depois de uma transição de saída ser acionada (ao mesmo tempo que `v-leave-from` é removida), removida quando a transição ou animação termina.

`v-enter-active` e `v-leave-active` dão-nos a habilidade de especificar curvas de flexão diferentes para as transições de entrada ou saída, as quais veremos exemplos nas seguintes secções.

### Transições Nomeadas {#named-transitions}

Um transição pode ser nomeada através da propriedade `name`:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Para uma transição nomeada, suas classes de transição serão prefixadas com seu nome no lugar de `v`. Por exemplo, a classe aplicada para a transição de cima será `fade-enter-active` no lugar de `v-enter-active`. A CSS para a transição de desaparecimento (`fade`, em Inglês) deve parecer-se com isto:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Transições de CSS {#css-transitions}

`<Transition>` é comummente usado em conjunto com [transições de CSS nativa](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), conforme visto no exemplo básico de cima. A propriedade de CSS `transition` é uma forma abreviada que permite-nos especificar vários aspetos de uma transição, incluindo propriedades que devem ser animadas, duração da transição, e [curvas de flexão](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

Abaixo está mais um exemplo avançado que realiza transição de várias propriedades, com diferentes durações e curvas de flexão para entrada e saída:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*

  Animações de entrada e saída podem usar diferentes
  duranções e funções de tempo.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### Animações de CSS {#css-animations}

As [animações de CSS nativa](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) são aplicadas da mesma maneira que as transições de CSS com a diferença de que `*-enter-from` não é removida imediatamente depois do elemento ser inserido, mas sobre um evento de `animationend`.

Para a maior parte das animações de CSS, podemos simplesmente declará-las sob as classes `*-enter-active` e `*-leave-active`. Abaixo encontra-se o exemplo disto:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### Classes de Transição Personalizadas {#custom-transition-classes}

Tu podes também especificar classes de transição personalizadas passando as seguintes propriedades para o `<Transition>`:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Estas irão sobrepor-se aos nomes convencionais das classes. Isto é especialmente útil quando queres combinar o sistema de transição da Vue com uma biblioteca de animação de CSS existente, tal como [Animate.css](https://daneden.github.io/animate.css/):

```vue-html
<!-- assumindo que Animate.css está incluída na página -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### Usando Juntas Transições e Animações {#using-transitions-and-animations-together}

A Vue precisa atribuir ouvintes de evento para saber quando uma transição termina. Isto pode ser tanto `transitionend` ou `animationend`, dependendo do tipo de regras de CSS aplicada. Se estás apenas a usar um ou o outro, a Vue pode automaticamente detetar o tipo correto.

No entanto, em alguns casos podes desejar ter ambos no mesmo elemento, por exemplo, ter uma animação de CSS acionada pela Vue, juntamente com um efeito de transição de CSS sobre pairar do ponteiro do rato. Nestes casos, terás que declarar explicitamente o tipo que quiseres que a Vue preocupe-se passando a propriedade `type`, com o valor de ou `animation` ou `transition`:

```vue-html
<Transition type="animation">...</Transition>
```

### Transições Encaixadas e Durações de Transição Explícita {#nested-transitions-and-explicit-transition-durations}

Apesar das classes de transição serem apenas aplicadas ao elemento filho direto no `<Transition>`, podemos aplicar a transição aos elementos encaixados usando seletores de CSS encaixado:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* regras que miram os elementos encaixados */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... outras CSS necessárias omitidas */
```

Nós podemos até mesmo adicionar um atraso de transição para o elemento encaixado na entrada, o que cria uma sequência de animação de entrada escalonada:

```css{3}
/* atrasar a entrada do elemento encaixado para o efeito escalonado */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

No entanto, isto cria um pequeno problema. Por padrão, o componente `<Transition>` tenta automaticamente saber quando a transição terminou ouvindo o **primeiro** evento `transitionend` ou `animationend` sobre o elemento de transição de raiz. Com uma transição encaixada, o comportamento desejado deve ser esperar até as transições de todos elementos internos estiverem termidas.

Nestes casos podes especificar uma duração de transição explícita (em milissegundos) usando a propriedade `duration` no componente `<transition>`. A duração total deve corresponder ao atraso mais a duração da transição do elemento interno:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

Se necessário, podes também especificar valores separados para as durações de entrada e saída usando um objeto:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Considerações de Desempenho {#performance-considerations}


Tu podes reparar que as animações mostradas acima estão na maior parte das vezes usando propriedades como `transform` e `opacity`. Estas propriedades são eficiantes ao animar porque:


1. Elas não afetam a disposição do documento durante a animação, então elas não acionam cálculos de disposição de CSS dispendiosos em cada quadro da animação.

2. A maior parte dos navegadores podem influenciar a aceleração de hardware da GPU quando estão animando a `transform`.

Em comparação, propriedades como `height` ou `margin` acionarão a disposição de CSS, então são muito mais dispensiosas para animar, e devem ser usadas com cautela. Nós podemos consultas recursos como [CSS-Triggers](https://csstriggers.com/) para saber quais propriedades acionarão a disposição se as animarmos.

## Gatilhos de JavaScript {#javascript-hooks}

Tu podes ligar-te ao processo de transição com a JavaScript ouvindo os eventos sobre o componente `<Transition>`:

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// chamada antes do elemento ser inserido no DOM.
// usa isto para definir o estado "enter-from" do elemento
function onBeforeEnter(el) {}

// chamada um quadro depois do elemento ser inserido.
// usa isto para iniciar a animação de entrada.
function onEnter(el, done) {
  // chama a resposta "done" para indicar o fim da transição
  // opcional se usada em conjunto com a CSS
  done()
}

// chamada quando a transição de entrada termina.
function onAfterEnter(el) {}
function onEnterCancelled(el) {}

// chamada antes do gatilho de saída.
// A maior parte das vezes, deves apenas usar o gatilho de saída
function onBeforeLeave(el) {}

// chamada quando a transição de saída começa.
// usa isto para iniciar a animação de saída.
function onLeave(el, done) {
  // chama a resposta "done" para indicar o fim da transição
  // opcional se usada em conjunto com a CSS
  done()
}

// chamda quando a transição de saída termina e o
// elemento foi removido do DOM.
function onAfterLeave(el) {}

// apenas disponível com as transições de "v-show"
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // chamada antes do elemento ser inserido no DOM.
    // usa isto para definir o estado "enter-from" do elemento
    onBeforeEnter(el) {},

    // chamada um quadro depois do elemento ser inserido.
    // usa isto para iniciar a animação de entrada.
    onEnter(el, done) {
      // chama a resposta "done" para indicar o fim da transição
      // opcional se usada em conjunto com a CSS
      done()
    },

    // chamada quando a transição de entrada termina.
    onAfterEnter(el) {},
    onEnterCancelled(el) {},

    // chamada antes do gatilho de saída.
    // A maior parte das vezes, deves apenas usar o gatilho de saída
    onBeforeLeave(el) {},

    // chamada quando a transição de saída começa.
    // usa isto para iniciar a animação de saída.
    onLeave(el, done) {
      // chama a resposta "done" para indicar o fim da transição
      // opcional se usada em conjunto com a CSS
      done()
    },

    // chamda quando a transição de saída termina e o
    // elemento foi removido do DOM.
    onAfterLeave(el) {},

    // apenas disponível com as transições de "v-show"
    onLeaveCancelled(el) {}
  }
}
```

</div>

Estes gatilhos podem ser usados em conjunto com as transições ou animações de CSS ou por conta própria.

Quando usamos transições em JavaScript apenas, é usualmente uma boa ideia adicionar a propriedade `:css="false"`. Isto diz explicitamente a Vue para ignorar a deteção automática de transição de CSS. Além de ter ligeiramente um desempenho melhor, isto também impedi as regras de CSS de acidentalmente interferirem com a transição:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

Com `:css="false"`, somos também completamente responsáveis pelo controle de quando a transição termina. Neste caso, as respostas `done` são obrigatórias para os gatilhos `@enter` e `@leave`. De outro modo, os gatilhos serão chamados de maneira síncrona e a transição terminará imediatamente.

Cá está uma demonstração usando a [biblioteca GreenSock](https://greensock.com/) para realizar as animações. Tu podes, com certeza, usar qualquer outra biblioteca de animação que quiseres, por exemplo [Anime.js](https://animejs.com/) ou [Motion One](https://motion.dev/).

<JsHooks />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## Transições Reutilizáveis {#reusable-transitions}

As transições podem ser reutilizadas através do sistema de componente da Vua. Para criar uma transição reutilizável, podemos criar um componente que envolve o componente `<Transition>` e passar o conteúdo da ranhura:

```vue{5}
<!-- MyTransition.vue -->
<script>
// Lógica dos gatilhos de JavaScript...
</script>

<template>
  <!-- envolve o componente Transition embutido -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- passa o conteúdo da ranhura -->
  </Transition>
</template>

<style>
/*
  CSS necessária...
  Nota: evite usar <style scoped> aqui já que não
  se aplica ao conteúdo da ranhura.
*/
</style>
```

Agora `MyTransition` pode ser importada e usada tal como a versão embutida:

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## Transição sobre o Aparecimento {#transition-on-appear}

Se quiseres também aplicar uma transição sobre a interpretação inicial de um nó, podes adicionar o atributo `appear`:

```vue-html
<Transition appear>
  ...
</Transition>
```

## Transição Entre Elementos {#transition-between-elements}

Além de alternar um elemento com `v-if` ou `v-show`, podemos também realizar a transição entre dois elementos usando `v-if`, `v-else` ou `v-else-if`:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

<BetweenElements />

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

## Modos de Transição {#transition-modes}

No exemplo anterior, as entradas e saídas dos elementos são animadas ao mesmo tempo, e tinhamos que torná-las `position: absolute` para evitar o problema de disposição quando ambos elementos estiverem presentes no DOM.

No entanto, em alguns casos isto não é uma opção, ou simplesmente não é o comportamento desejado. Nós podemos desejar deixar o elemento ser animado primeiro, e para entrada o elemento ser apenas inserido **depois** de terminada a animação de saída. Orquestrar tais animações manualmente seria muito complicado - felizmente, podemos ativar este comportamento passando para `<Transition>` uma propriedade `mode`:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Cá está a demonstração anterior com `mode="out-in"`:

<BetweenElements mode="out-in" />

`<Transition>` também suporta `mode="in-out"`, embora que seja muito menos usada com frequência.

## Transição Entre Componentes {#transition-between-components}

`<Transition>` também pode ser usada em torno dos [componentes dinâmicos](/guide/essentials/component-basics.html#componentes-dinâmicos):

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>

## Transições Dinâmicas {#dynamic-transitions}

As propriedades de `<Transition>` como `name` também podem ser dinâmicas! Ela permite-nos aplicar dinamicamente transições diferentes baseadas na mudança de estado:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Isto pode ser útil quando tiveres definido transições ou animações de CSS usando as convenções de classe de transição da Vue e quiseres alternar entre elas.

Tu também podes aplicar comportamento diferente nos gatilhos de transição de JavaScript baseado no estado atual do teu componente. Finalmente, a maneira fundamental de criar transições dinâmicas é através de [componentes de transição reutilizáveis](#transições-reutilizáveis) que aceitam propriedades para mudar a natureza da transição ou transições a ser usadas. Isto pode soar foleiro, mas o único limite é realmente a tua imaginação.

---

**Relacionado ao**

- [Referência da API de `<Transition>`](/api/built-in-components.html#transition)
