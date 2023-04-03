# Acessibilidade {#accessibility}

A acessibilidade da web (também conhecida como a11y) refere-se a prática de criar páginas e aplicações de web que podem ser usadas por qualquer um — seja essa uma pessoa com uma deficiência, uma conexão lenta, hardware destroçado ou desatualizado ou simplesmente alguém em um ambiente desfavorável. Por exemplo, adicionar legendas à um vídeo ajuda tanto os teus utilizadores surdos e com dificuldades de audição quanto os teus utilizadores que estão em um ambiente ruidoso e que não podem ouvir seus telemóveis. Similarmente, certificar-te que o teu texto não é de muito contraste muito baixo ajudará tanto os teus utilizadores de visão fraca quanto os teus utilizadores que estão a tentar usar os seus telemóveis na luz do sol forte.

Pronto para começar mas não sem a certeza de por onde?

Consulte o [guia de planeamento e gerência da acessibilidade da web](https://www.w3.org/WAI/planning-and-managing/) fornecido pelo [Consórcio da World Wide Web (W3C)](https://www.w3.org/)

## Ligação de Salto {#skip-link}

Tu deves adicionar uma ligação no topo de cada página que vai diretamente para a área do conteúdo principal assim os utilizadores podem salter o conteúdo que é repetido em várias páginas de Web.

Normalmente, isto é feito no topo de `App.vue` visto que será o primeiro elemento concentrável em todas as tuas páginas:

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
  </li>
</ul>
```

Para esconder a ligação se não ela é focada, podes adicionar o seguinte estilo:

```css
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

Uma vez que o utilizador mudar a rota, traga o foco de volta para a ligação saltar. Isto pode ser alcançado chamando o foco na referência do modelo de marcação da ligação saltar (assumindo o uso da `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[Leia a documentação sobre a ligação "saltar para o conteúdo principal"](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Estrutura de Conteúdo {#content-structure}

Um dos pedaços mais importantes da acessibilidade é garantir que o desenho possa suportar a implementação acessível. O desenho deve considerar não apenas o contraste de cor, seleção de fonte, tamanho de texto, e linguagem mas também como o conteúdo é estruturado na aplicação.

### Cabeçalhos {#headings}

Os utilizadores podem navegar em uma aplicação através dos cabeçalhos. Ter cabeçalhos descritivos para cada seção da tua aplicação torna mais fácil para os utilizadores prever o conteúdo de cada seção. Quando falamos de cabeçalhos, existem algumas práticas de acessibilidade recomendadas:

- Encaixar cabeçalhos nas suas ordem de classificação: `<h1>` - `<h6>`
- Não saltar cabeçalhos dentro de uma seção
- Usar marcadores de cabeçalho verdadeiros ao invés da estilização de texto para dar a aparência visual dos cabeçalhos

[Leia mais sobre cabeçalhos](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html):

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### Marcos {#landmarks}

Os [marcos](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) fornecem acesso programático às seções dentro de uma aplicação. Os utilizadores que dependem de tecnologia ajustantes podem navegar para cada seção da aplicação e saltar sobre o conteúdo. Tu podes usar os [papeis de ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) para ajudar-te a alcançar isto.

| HTML            | Papeis de ARIA            | Propósito do Marco                                                                                                |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | Cabeçalho principal: título da página.                                                                                 |
| nav             | role="navigation"    | Coleção de ligações adequadas para uso quando estiveres a navegar pelo documento ou documentos relacionados.                          |
| main            | role="main"          | O conteúdo principal ou central do documento.                                                                    |
| footer          | role="contentinfo"   | Informação sobre o documento pai: notas de rodapé ou direitos de autor ou ligações para o relatório de privacidade.                         |
| aside           | role="complementary" | Sustenta o conteúdo principal, mais é separado e significativo em seu próprio conteúdo.                                 |
| _Not available_ | role="search"        | Esta seção contém a funcionalidade de pesquisa para a aplicação.                                            |
| form            | role="form"          | Coleção de elementos associados ao formulário.                                                                         |
| section         | role="region"        | O conteúdo que é relevante e para o qual os utilizadores provavelmente quererão navegar. O rótulo deve ser fornecido para este elemento.|

:::tip DICA:
É recomendado usar os elementos de HTML de marco com atributos do papel do marco redundante para maximizar a compatibilidade com [navegadores antigos que não suportam os elementos semânticos da HTML5](https://caniuse.com/#feat=html5semantic).
:::

[Leia mais sobre os marcos](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Formulários Semânticos {#semantic-forms}

Quando criares um formulário, podes usar os seguintes elementos: `<form>`, `<label>`, `<input>`, `<textarea>`, e `<button>`.

Os rótulos são normalmente colocados no princípio ou a esquerda dos campos do formulário:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Simple Form" slug="dyNzzWZ" :height="368" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Nota como podes incluir `autocomplete='on'` no elemento de formulário e aplicar-se-á à todas entradas no teu formulário. Tu podes também definir [valores diferentes para o atributo `autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) para cada entrada.

### Rótulos {#labels}

Forneça rótulos para descrever o propósito de todos os mecanismo de controlo do formulário: ligando `for` e `id`:

```vue-html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<!-- <common-codepen-snippet title="Form Label" slug="XWpaaaj" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Se inspecionares este elemento nas ferramentas de programação do teu navegador Google Chrome e abrires a aba de Acessibilidade dentro da aba de Elementos, verás como a entrada recebe o seu nome a partir do rótulo:

![Ferramentas de Programação do Chrome exibindo o nome acessível da entrada do rótulo](./images/AccessibleLabelChromeDevTools.png)

:::warning Aviso:
Embora tenhas visto rótulos envolvendo os campos de entrada como este:

```vue-html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

A definição explícita dos rótulos com um identificador correspondente é melhor suportado pela tecnologia ajudante.
:::

#### `aria-label` {#aria-label}

Tu podes também atribuir a entrada um nome acessível com o [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label):

```vue-html
<label for="name">Name</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

<!-- <common-codepen-snippet title="Form ARIA label" slug="NWdvvYQ" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Esteja a vontade para inspecionar este elemento nas Ferramentas de Programação do Chrome para veres como o nome acessível tem mudado:

![Ferramentas de Programação do Chrome exibindo o nome acessível da entrada do `aria-label`](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

O uso de [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) é parecido com o `aria-label` exceto que é usado se o texto do rótulo estiver visível na tela. É emparelhado com os outros elementos pelo seu `id` e podes ligar vários `id`:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Form ARIA labelledby" slug="MWJvvBe" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

![Ferramentas de Programação do Chrome exibindo o nome acessível da entrada do `aria-labelledby`](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

O [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) é usado da mesma maneira que o `aria-labelledby` exceto que fornece uma descrição com informação adicional que o utilizador possa precisar. Isto pode ser usado para descrever o critério para qualquer entrada:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Form ARIA describedby" slug="gOgxxQE" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Tu podes ver a descrição inspecionando as Ferramentas de Programação do Chrome:

![Ferramentas de Programação do Chrome exibindo o nome acessível da entrada do `aria-labelledby` e a descrição com o `aria-describedby`](./images/AccessibleARIAdescribedby.png)

### Espaço Reservado {#placeholder}

Evite usar espaços reservados visto que podem confundir muitos utilizadores.

Um dos problemas com os espaços reservados é que não cumprem com o [critério de contraste de cor](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) por padrão; corrigir o contraste de cor faz o espaço reservado parecer como dados pré-povoado nos campos de entrada. Olhando no seguinte exemplo, podes ver que o espaço reservado do Último Nome o qual cumpre com o critério de contraste de cor parece-se com dado pré-povoado:

![Espaço reservado acessível](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

É melhor fornecer todas as informações que o utilizador precisa para preencher os formulários fora de quaisquer entradas.

### Instruções {#instructions}

Quando estiveres a adicionar as instruções para os teus campos de entrada, certifica-te de ligá-lo corretamente ao campo de entrada. Tu podes fornecer instruções adicionais e vincule vários identificadores dentro de um [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). Isto permite um desenho mais flexível:

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

Alternativamente, podes atribuir as instruções ao campo de entrada com o [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<!-- <common-codepen-snippet title="Form Instructions" slug="WNREEqv" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

### Escondendo Conteúdo {#hiding-content}

Normalmente não é recomendado esconder visualmente os rótulos, mesmo se a entrada tiver um nome acessível. No entanto, se a funcionalidade da entrada pode ser entendida com o conteúdo circundante, então podemos esconder o rótulo visual.

Observemos este campo de pesquisa:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

Nós podemos fazer isto porque o botão de pesquisa ajudará os utilizadores visuais a identificarem o propósito do campo de entrada.

Nós podemos usar a CSS para esconder visualmente os elementos mas mantê-los disponíveis para a tecnologia assistiva:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

<!-- <common-codepen-snippet title="Form Search" slug="QWdMqWy" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

#### `aria-hidden="true"` {#aria-hidden-true}

Adding `aria-hidden="true"` will hide the element from assistive technology but leave it visually available for other users. Do not use it on focusable elements, purely on decorative, duplicated or offscreen content.

```vue-html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### Botões {#buttons}

Quando estiveres a usar os botões dentro de um formulário, deves definir o tipo para evitar a submissão do formulário. Tu podes também usar uma entrada para criar os botões:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Botões -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Botões de entrada -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

<!-- <common-codepen-snippet title="Form Buttons" slug="JjEyrYZ" :height="467" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

### Imagens Funcionais {#functional-images}

Tu podes usar esta técnica para criar imagens funcionais.

- Campos de entrada

  - Estas imagens agirão como um botão de tipo submissão em formulários

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- Ícones

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

<!-- <common-codepen-snippet title="Functional Images" slug="jOyLGqM" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

## Padrões {#standards}

A Iniciativa de Acessibilidade da Web (WAI, sigla em Inglês) do Consórcio da World Wide Web (W3C, sigla em Inglês) desenvolve os padrões de acessibilidade da web para os diferentes componentes:

- [Diretrizes de Acessibilidade do Agente do Utilizador (UAAG, sigla em Inglês)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - Os navegadores da web e leitores de media, incluindo alguns aspetos de tecnologias assistivas.
- [Diretrizes de Acessibilidade de Ferramenta de Autoria (ATAG, sigla em Inglês)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - As ferramentas de autoria
- [Diretrizes de Acessibilidade do Conteúdo da Web (WCAG, sigla em Inglês)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - O conteúdo da web - usado por programadores, ferramentas de autoria, e ferramentas de avaliação da acessibilidade.

### Diretrizes de Acessibilidade do Conteúdo da Web (WCAG) {#web-content-accessibility-guidelines-wcag}

A [WCAG 2.1](https://www.w3.org/TR/WCAG21/) estende o [WCAG 2.0](https://www.w3.org/TR/WCAG20/) e permite a implementação de novas tecnologias endereçando as mudanças para a web. O W3C encoraja o uso da versão mais atual de WCAG quando estiveres a desenvolver ou a atualizar as políticas de acessibilidade da Web.

#### WCAG 2.1 Quatro Princípios Orientadores Principais (abreviado como POUR, em Inglês): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Percebível](https://www.w3.org/TR/WCAG21/#perceivable)
  - Os utilizadores devem ser capazes de perceber a informação sendo apresentada
- [Operável](https://www.w3.org/TR/WCAG21/#operable)
  - Formulários de interface, controlos, e navegação são operáveis
- [Compreensível](https://www.w3.org/TR/WCAG21/#understandable)
  - A informação e a operação da interface de utilizador devem ser compreensíveis para todos utilizadores.
- [Robusta](https://www.w3.org/TR/WCAG21/#robust)
  - Os utilizadores devem ser capazes de acessar o conteúdo conforme o avanço das tecnologias

#### Iniciativa de Acessibilidade da Web - Aplicações de Internet Ricas em Acessibilidade (WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

A WAI-ARIA do W3C fornece orientação sobre como construir conteúdo dinâmico e controlos de interface de utilizador avançados:

- [Aplicações de Internet Ricas em Acessibilidade (WAI-ARIA, sigla em Inglês) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Práticas de Autoria da WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Recursos {#resources}

### Documentação {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Aplicações de Internet Ricas em Acessibilidade (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Práticas de Autoria da WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Tecnologias Assistivas {#assistive-technologies}

- Leitores de Ecrã
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Ferramentas de Ampliação de Conteúdo
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.zoomtext.com/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Testagem {#testing}

- Ferramentas Automatizadas
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Ferramentas de Cores
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Outras Ferramentas Úteis
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [Focus Indicator](https://chrome.google.com/webstore/detail/focus-indicator/heeoeadndnhebmfebjccbhmccmaoedlf?hl=en-US…)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Utilizadores {#users}

A Organização Mundial da Saúde estima que 15% da população mundial tem alguma forma de deficiência, 2-4% deles com severidade. Isto é estimado em 1 bilhão de pessoas mundialmente; tornando as pessoas com deficiências o maior grupo minoritário no mundo.

Existem uma grande gama de deficiência, que podem ser divididas aproximadamente em quatro categorias:

- _[Visual](https://webaim.org/articles/visual/)_ - Estes utilizadores podem beneficiarem-se do uso de leitores de ecrã, ampliação de ecrã, controlo de contraste de ecrã, ou exibição de braille.
- _[Auditiva](https://webaim.org/articles/auditory/)_ - Estes utilizadores podem beneficiarem-se do legendamento, transcrições ou vídeo de linguagem gestual.
- _[Motora](https://webaim.org/articles/motor/)_ - Estes utilizadores podem beneficiarem-se de uma gama de [tecnologias assistivas para deficiências motoras](https://webaim.org/articles/motor/assistive): software de reconhecimento de voz, acompanhamento do olho, acesso de interruptor único, vara de mão, teclado adaptável ou outras tecnologias assistivas.
- _[Cognitiva](https://webaim.org/articles/cognitive/)_ - Estes utilizadores podem beneficiarem-se de media complementar, organização estrutural do conteúdo, escrita clara e simples.

Consulte as seguintes ligações da WebAim para entenderes as necessidades dos utilizadores:

- [Perspetivas da Acessibilidade da Web: Explorar o Impacto e Benefícios para Todos](https://www.w3.org/WAI/perspective-videos/)
- [As Histórias dos Utilizadores da Web](https://www.w3.org/WAI/people-use-web/user-stories/)
