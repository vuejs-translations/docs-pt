# Interpretação de Lista

Nós podemos utilizar a diretiva `v-for` para interpretar uma lista de elementos com em um arranjo (*array*, em Inglês) de conteúdo:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Aqui `todo` é uma variável local representando um elemento de arranjo que está sendo iterado atualmente. Só é acessível no ou dentro do elemento `v-for`.

Repare em como também estamos atribuindo para cada objeto `todo` um `id` único, e vinculando-o com o <a target="_blank" href="/api/built-in-special-attributes.html#key">atributo especial `key`</a> de cada `<li>`. O `key` permite a Vue mover com precisão cada `<li>` a corresponder com a posição do seu objeto correspondente no arranjo.

Há duas maneiras de atualizar a lista:

1. Chamar [métodos de mutação](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) sobre o arranjo de conteúdo:

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

2. Substituir o arranjo por um novo:

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

Aqui temos um lista de tarefas a fazer simples - experimente implementar a lógica para métodos `addTodo()` e `removeTodo()` para fazer o exercício funcionar!

Mais detalhes a respeito de `v-for`: <a target="_blank" href="/guide/essentials/list.html">Guia - Interpretação de Lista</a>
