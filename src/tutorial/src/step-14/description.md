# Ranhuras

Além da passagem de dados através de propriedades, o componente pai também pode passar fragmentos de modelo de marcação para o componente filho através de **ranhuras (slots)**:

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

No componente filho, ele pode interpretar o conteúdo da ranhura do componente pai utilizando o elemento `<slot>` como escape (*outlet*):

<div class="sfc">

```vue-html
<!-- in child template -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- in child template -->
<slot></slot>
```

</div>

O conteúdo dentro do escape `<slot>` será tratado como conteúdo de "resposta": ele será exibido se o componente pai não passar nenhum conteúdo de ranhura:

```vue-html
<slot>Fallback content</slot>
```

Atualmente não estamos passando nenhum conteúdo de ranhura para `<ChildComp>`, assim deves ver o conteúdo de resposta. Vamos fornecer algum conteúdo de ranhura para o componente filho enquanto fazemos uso do estado `msg` do componente pai.
