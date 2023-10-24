# Vínculos de Atributo {#attribute-bindings}

Na Vue, os bigodes são apenas usado para interpolação de texto. Para vincular um atributo à um valor dinâmico, usamos a diretiva `v-bind`:

```vue-html
<div v-bind:id="dynamicId"></div>
```

Uma **diretiva** é um atributo especial que começa com o prefixo `v-`. Eles fazem parte da sintaxe do modelo de marcação da Vue. Semelhante às interpolações de texto, os valores da diretiva são expressão de JavaScript que têm acesso ao estado do componente. Os detalhes completos da `v-bind` e sintaxe de diretiva são discutidos no <a target="_blank" href="/guide/essentials/template-syntax.html">Guia - Sintaxe do Modelo de Marcação</a>.

A parte depois do sinal de dois pontos (`:id`) é o "argumento" da diretiva. Aqui, o atributo `id` do elemento será sincronizado com a propriedade `dynamicId` a partir do estado do componente.

Uma vez que a `v-bind` é usada com muita frequência, esta tem uma sintaxe de abreviatura dedicada: 

```vue-html
<div :id="dynamicId"></div>
```

Agora, tente adicionar um vínculo de `class` dinâmico ao `<h1>`, usando a <span class="options-api">propriedade de dados</span><span class="composition-api">referência</span> como seu valor. Se for vinculado corretamente, o texto deve tonar-se vermelho.
