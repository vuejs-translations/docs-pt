# Ranhuras {#slots}

Além de passar dados através das propriedades, o componente pai também pode passar fragmentos de modelo de marcação ao componente filho através das **ranhuras**:

<div class="sfc">

```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```

</div>

No componente filho, este pode interpretar o conteúdo da ranhura a partir do componente pai usando o elemento `<slot>` como escoadouro (ou escape):

<div class="sfc">

```vue-html
<!-- no modelo de marcação do filho -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- no modelo de marcação do filho -->
<slot></slot>
```

</div>

O conteúdo dentro do escoadouro `<slot>` tratado como conteúdo de "retrocesso (ou retorno)": este será exibido se o pai não passou nenhum conteúdo de ranhura:

```vue-html
<slot>Fallback content</slot>
```

Atualmente não estamos passando nenhum conteúdo de ranhura ao `<ChildComp>`, então devemos ver o conteúdo de retrocesso (ou retorno). Vamos fornecer algum conteúdo de ranhura ao filho enquanto fazemos uso do estado da `msg` do pai.
