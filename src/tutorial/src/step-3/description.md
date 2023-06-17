# Vinculação de Atributo

Na Vue, os bigodes são utilizados apenas para interpolação de texto. Para vincular um atributo à um valor dinâmico, utilizamos a diretiva `v-bind`:

```vue-html
<div v-bind:id="dynamicId"></div>
```

Uma **diretiva** é um atributo especial que começa com o prefixo `v-`. Elas são parte da sintaxe de modelo de marcação de hipertexto da Vue. Similar as interpolações de texto, os valores de diretiva são expressões de JavaScript que têm acesso ao estado do componente. Os detalhes a respeito de `v-bind` e a sintaxe de diretiva são discutidos no <a target="_blank" href="/guide/essentials/template-syntax.html">Guia - Sintaxe de Modelo de Marcação `template`</a>.

A parte depois do sinal de dois pontos (`:id`) é o "argumento" da diretiva. Aqui, o atributo `id` do elemento será sincronizado com a propriedade `dynamicId` do estado do componente.

Uma vez que `v-bind` é utilizado com frequência, ele tem uma sintaxe abreviada dedicada: 

```vue-html
<div :id="dynamicId"></div>
```

Agora, experimente adicionar uma vinculo de `class` dinâmica ao `<h1>`, utilizando a <span class="options-api">propriedade de dados</span><span class="composition-api">referência</span> `titleClass` como seu valor. Se for vinculado corretamente, o texto deve tornar-se vermelho.
