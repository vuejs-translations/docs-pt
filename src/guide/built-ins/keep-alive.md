<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# Preservação de Componente {#keepalive}

O `<KeepAlive>` é um componente embutido que permite-nos condicionalmente guardar para consulta imediata as instâncias de componente quando mudamos dinamicamente entre vários componentes.

## Utilização Básica {#basic-usage}

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

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Experimente-o na Zona de Testes](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip Dica
Quando utilizada nos [modelos de marcação de DOM](/guide/essentials/component-basics.html#advertências-de-analise-de-modelo-marcação-de-dom), ele deve ser referenciado como `<keep-alive>`.
:::

## Incluir / Excluir {#include-exclude}

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

## Máximo de Instâncias Cacheadas {#max-cached-instances}

Nós podemos limitar o número máximo de instâncias de componente que podem ser cacheadas através da propriedade `max`. Quando `max` é especificada, `<KeepAlive>` comporta-se como um [cache de LRU](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): se o número de instâncias cacheadas exceder a contagem máxima especidada, a menor instância cacheada acessada recentemente será destruída para arranjar espaço para uma nova.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Ciclo de Vida da Instância Cacheada {#lifecycle-of-cached-instance}

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
  // e também quando desmontada
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
