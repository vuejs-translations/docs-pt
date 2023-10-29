# Interpretação de Lista {#list-rendering}

Nós podemos usar a diretiva `v-for` para interpretar uma lista de elementos baseados num vetor de origem:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Neste exemplo, `todo` é uma variável local representando o elemento do vetor sobre qual está sendo iterado atualmente. Este apenas é acessível no ou dentro do elemento de `v-for`, semelhante ao âmbito duma função.

Repara em como também estamos dando para cada objeto `todo` um `id` único, e vinculando-o conforme o <a target="_blank" href="/api/built-in-special-attributes#key">atributo `key` especial</a> para cada `<li>`. O `key` permite a Vue mover com precisão cada `<li>` para corresponder com a posição do seu objeto correspondente no vetor.

Há duas maneiras de atualizar a lista:

1. Chamar [métodos de mutação](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) sobre o vetor de origem:

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Substituir o vetor por um novo:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Eis que temos uma lista de afazeres simples - tente implementar uma lógica para os métodos `addTodo()` e `removeTodo()` para fazer o exercício funcionar!

Mais detalhes sobre a `v-for`: <a target="_blank" href="/guide/essentials/list">Guia - Interpretação de Lista</a>
