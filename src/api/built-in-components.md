---
pageClass: api
---

# Componentes Embutidos {#built-in-components}

:::info Registo e Uso
Os componentes embutidos podem ser usados diretamente em modelos sem a necessidade de registo. Eles também são passíveis de ter a sua árvore agitada: são apenas incluídos na construção quando forem usados.

Quando os usarmos nas [funções de interpretação](/guide/extras/render-function), precisam ser importados explicitamente. Por exemplo:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* propriedades */
})
```

:::

## `<Transition>` {#transition}

Fornece efeitos de transição animados para um **único** elemento ou componente.

- **Propriedades**

  ```ts
  interface TransitionProps {
    /**
     * Usado para gerar automaticamente nomes de classes CSS de transição.
     * exemplo `name: 'fade'` expandirá automaticamente para `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * Decide aplicar classes CSS de transição.
     * Padrão: true
     */
    css?: boolean
    /**
     * Especifica o tipo de eventos de transição à aguardar
     * para determinar a transição e o tempo.
     * O comportamento padrão é detetar automaticamente o tipo
     * que tiver a maior duração.
     */
    type?: 'transition' | 'animation'
    /**
     * Especifica durações explícitas para as transições.
     * O comportamento padrão é esperar pelo primeiro evento `transitionend`
     * ou `animationend` no elemento de transição raiz.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Controla a sequência de tempo das transições que entram ou saem.
     * O comportamento padrão é simultâneo.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Define aplicar a transição na interpretação inicial.
     * Padrão: false
     */
    appear?: boolean

    /**
     * Propriedades para personalizar as classes de transição.
     * Use kebab-case nos modelos de marcação, exemplo enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Eventos**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (apenas `v-show`)
  - `@appear-cancelled`

- **Exemplo**

  Elemento simples:

  ```vue-html
  <Transition>
    <div v-if="ok">conteúdo alternado</div>
  </Transition>
  ```

  Forçar uma transição mudando o atributo `key`:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Componente dinâmico, com o modo de transição + animação ao aparecer:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Ouvir eventos de transição:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">conteúdo ativado</div>
  </Transition>
  ```

- **Consulte também:** [Guia de `<Transition>`](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Fornece efeitos de transição para **múltiplos** elementos ou componentes numa lista.

- **Propriedades**

  `<TransitionGroup>` aceita as mesmas propriedades que o `<Transition>` exceto `mode`, e mais duas propriedades adicionais:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Se não definido, desenha um fragmento.
     */
    tag?: string
    /**
     * Para personalizar as classes CSS aplicadas durante as transições de movimento.
     * Use kebab-case em modelos de marcação, exemplo move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Eventos**

  `<TransitionGroup>` emite os mesmos eventos que `<Transition>`.

- **Detalhes**

  Por padrão, `<TransitionGroup>` não desenha um elemento de DOM que envolve, mas pode ser definido através da propriedade `tag`.

  Note que todo filho num `<transition-group>` deve ser [**identificado unicamente**](/guide/essentials/list#maintaining-state-with-key) para que as animações funcionem apropriadamente.

  `<TransitionGroup>` suporta transições de movimento através de transformações de CSS. Quando a posição dum filho na tela é mudada após uma atualização, será aplicada uma classe de movimento CSS (gerada automaticamente pelo atributo `name` ou configurada pela propriedade `move-class`). Se a propriedade de CSS `transform` é passível de transição quando a classe de movimento é aplicada, o elemento será suavemente animado até o seu destino usando a [técnica FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Exemplo**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Consulte também:** [Guia - `TransitionGroup`](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Armazena para consulta imediata os componentes alternados dinamicamente envolvidos dentro.

- **Propriedades**

  ```ts
  interface KeepAliveProps {
    /**
     * Se especificado, apenas componentes com nomes correspondidos
     * pelo `include` estarão na memória de consulta imediata.
     */
    include?: MatchPattern
    /**
     * Qualquer componente com um nome correspondidos pelo `exclude`
     * não estarão na memória de consulta imediata.
     */
    exclude?: MatchPattern
    /**
     * O número máximo de instâncias de componente à armazenar
     * na memória de consulta imediata.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Detalhes**

  Quando envolvido em torno dum componente dinâmico, `<KeepAlive>` armazena para consulta imediata as instâncias de componente inativo sem destruí-las.

  Só pode existir uma instância de componente como filho direto de `<KeepAlive>` em qualquer momento.

  Quando um componente é alternado dentro de `<KeepAlive>`, seus gatilhos de ciclo de vida `activated` e `deactivated` são invocados de acordo, fornecendo uma alternativa ao `mounted` e `unmounted`, que não são chamados. Isto aplica-se ao filho direto de `<KeepAlive>` e também a todos os seus descendentes.

- **Exemplo**

  Uso básico:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  Quando usado com os ramos `v-if` / `v-else`, só deve existir um componente desenhado de cada vez:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Usado em conjunto com `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Usando `include` / `exclude`:

  ```vue-html
  <!-- sequência de caracteres delimitada por vírgula -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (use `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- vetor (use `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Uso com `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Consulte também:** [Guia - `KeepAlive`](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Desenha o conteúdo da sua ranhura numa outra parte do DOM.

- **Propriedades**

  ```ts
  interface TeleportProps {
    /**
     * Obrigatório. Específica o contentor alvo.
     * Pode ser ou um seletor ou um elemento verdadeiro.
     */
    to: string | HTMLElement
    /**
     * Quando `true`, o conteúdo continuará na sua localização
     * original ao invés de ser movido para o contentor alvo.
     * Pode ser mudado dinamicamente.
     */
    disabled?: boolean
  }
  ```

- **Exemplo**

  Especificando o contentor alvo:

  ```vue-html
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />
  ```

  Desativar condicionalmente:

  ```vue-html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

- **Consulte também:** [Guia - `Teleport`](/guide/built-ins/teleport.html)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Usado para orquestrar dependências assíncronas encaixadas numa árvore de componente.

- **Propriedades**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
  }
  ```

- **Eventos**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Detalhes**

  `<Suspense>` aceita duas ranhuras: a ranhura `#default` e a ranhura `#fallback`. Ele exibirá o conteúdo da ranhura de retorno (`#fallback`) enquanto desenha a ranhura padrão (`#default`) na memória.

  Se encontrar dependências assíncronas ([Componentes Assíncronos](/guide/components/async) e componentes com [`async setup()`](/guide/built-ins/suspense#async-setup)) enquanto desenha a ranhura padrão, aguardará até todos serem resolvidos antes de exibir a ranhura padrão.

- **Consulte também:** [Guia - `Suspense`](/guide/built-ins/suspense)
