<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive

O `<KeepAlive>` é um componente embutido que permite-nos cachear condicionalmente as instâncias de componente quando mudamos dinamicamente entre vários componentes.

## Utilização Básica

No capítulo de Fundamentos de Componente, introduzimos a sintaxe para [Componentes Dinâmicos](/guide/essentials/component-basics.html#componentes-dinâmicos), utilizando o elemento especial `<component>`:

```vue-html
<component :is="activeComponent" />
```

Por padrão, uma instância de componente ativa será desmontada quando mudamos para outra instância de componente. Isto causará que qualquer estado mudado que ele segura ser perdido.

No exemplo abaixo, temos dois componentes com conteúdo - (A) contém um contador, enquando (B) contém uma messagem síncronizada com uma entrada através `v-model`. Tente atualizar o estado de um deles, mude para outro, e então mude de volta para ele: 

<SwitchComponent />

Notarás que quando mudado de volta, o anterior estado mudado teria sido reiniciado.

A criação de nova instância de componente na troca é um comportamente normalmente útil, mas neste caso, gostariamos muito que as duas instâncias de componente sejam preservadas mesmo quando estiverem inativas. Para solucionar este problema, podemos envolver o nosso componente dinâmico com o componente embutido `<KeepAlive>`:

```vue-html
<!-- Os componentes inativos serão cacheados! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Agora, o estado será persistido através das mudanças de componente:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHNoYWxsb3dSZWYgfSBmcm9tICd2dWUnXG5pbXBvcnQgQ29tcEEgZnJvbSAnLi9Db21wQS52dWUnXG5pbXBvcnQgQ29tcEIgZnJvbSAnLi9Db21wQi52dWUnXG5cbmNvbnN0IGN1cnJlbnQgPSBzaGFsbG93UmVmKENvbXBBKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRlbW9cIj5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEJcIiAvPiBCPC9sYWJlbD5cbiAgICA8S2VlcEFsaXZlPlxuICAgICAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50XCI+PC9jb21wb25lbnQ+XG4gICAgPC9LZWVwQWxpdmU+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBjb3VudCA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+Q3VycmVudCBjb21wb25lbnQ6IEE8L3A+XG4gIDxzcGFuPmNvdW50OiB7eyBjb3VudCB9fTwvc3Bhbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJjb3VudCsrXCI+KzwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cbiIsIkNvbXBCLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5jb25zdCBtc2cgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wQSBmcm9tICcuL0NvbXBBLnZ1ZSdcbmltcG9ydCBDb21wQiBmcm9tICcuL0NvbXBCLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ29tcEEsIENvbXBCIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6ICdDb21wQSdcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkZW1vXCI+XG4gICAgPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2LW1vZGVsPVwiY3VycmVudFwiIHZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgdmFsdWU9XCJDb21wQlwiIC8+IEI8L2xhYmVsPlxuICAgIDxLZWVwQWxpdmU+XG4gICAgICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRcIj48L2NvbXBvbmVudD5cbiAgICA8L0tlZXBBbGl2ZT5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBBLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQTwvcD5cbiAgPHNwYW4+Y291bnQ6IHt7IGNvdW50IH19PC9zcGFuPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj4rPC9idXR0b24+XG48L3RlbXBsYXRlPlxuIiwiQ29tcEIudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXNnOiAnJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>

:::tip Dica
Quando utilizada nos [modelos de marcação de DOM](/guide/essentials/component-basics.html#advertências-de-analise-de-modelo-marcação-de-dom), ele deve ser referenciado como `<keep-alive>`.
:::

## Incluir / Excluir

Por padrão, `<KeepAlive>` cacheará qualquer instância de componente no lado de dentro. Nós podemos personalizar este comportamento através das propriedades `include` e `exclude`. Ambas propriedades podem ser uma sequência de caracteres delimitada por vírgula, uma `RegExp` (Expressão Regular), ou arranjo contendo quaisquer tipos:

```vue-html
<!-- sequência de caracteres delimitada por vírgula -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- expressão regular (ou regex) (utilize `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- arranjo (ou array) (utilize `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

A correspondência é verificada contra a opção [name](/api/options-misc.html#name) do componente, assim os componentes que precisam ser cacheados condicionalmente pelo `KeepAlive` devem declarar de maneira explícita uma opção `name`.

## Máximo de Instâncias Cacheadas

Nós podemos limitar o número máximo de instâncias de componente que podem ser cacheadas através da propriedade `max`. Quando `max` é especificada, `<KeepAlive>` comporta-se como um [cache de LRU](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): se o número de instâncias cacheadas exceder a contagem máxima especidada, a menor instância cacheada acessada recentemente será destruída para arranjar espaço para uma nova.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Ciclo de Vida da Instância Cacheada

Quando uma instância de componente for removida do DOM mas for parte de uma árvore de componente cacheada pelo  `<KeepAlive>`, ele entra em um estado **desativado** no lugar de ser desmontada. Quando uma instância de componente for inserida no DOM como parte de uma árvore cacheada, ele é **ativado**.

<div class="composition-api">

Um componente que é mantido vivo pode registar gatilhos de ciclo de vida para estes dois estados utilizando [`onActivated()`](/api/composition-api-lifecycle.html#onactivated) e [`onDeactivated()`](/api/composition-api-lifecycle.html#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // chamada na montagem inicial
  // e toda vez que ela for inserida novamente do cache
})

onDeactivated(() => {
  // chamada quando removida do DOM para o cache
  // e tamém quando desmontada
})
</script>
```

</div>
<div class="options-api">

Um componente que é mantido vivo pode registar gatilhos de ciclo de vida para estes dois estados utilizando os gatilhos [`activated`](/api/options-lifecycle.html#activated) e [`deactivated`](/api/options-lifecycle.html#deactivated):

```js
export default {
  activated() {
    // chamada na montagem inicial
    // e toda vez que ela for inserida novamente do cache
  },
  deactivated() {
    // chamada quando removida do DOM para o cache
    // e tamém quando desmontada
  }
}
```

</div>

Nota que:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> é também chamada na montagem, e <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> na desmontagem.

- Ambos gatilhos funcionam para não apenas o componente de raiz cacheado pelo `<KeepAlive>`, mas também para componentes descendentes na árvore cacheada.

---

**Relacionado a**

- [Referência de API de `<KeepAlive>`](/api/built-in-components.html#keepalive)
