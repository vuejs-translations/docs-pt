---
outline: deep
---

<script setup>
import { onMounted, ref } from 'vue'

let version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Lançamentos {#releases}

<p v-if="version">
A versão estável mais recente da Vue é a <strong>{{ version }}</strong>.
</p>
<p v-else>
Consultando a versão mais recente...
</p>

Um relatório completo dos lançamentos passados está disponível na [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Ciclo de Lançamento {#release-cycle}

A Vue não tem um ciclo de lançamento fixo.

- Os lançamentos de remedo são feitos quando necessários.

- Os lançamentos secundários sempre contém novas funcionalidades, com um quando de tempo normal entre 3 à aproximadamente 6 meses. Os lançamentos secundários sempre passam por uma fase de pré-lançamento beta.

- Os lançamentos primários serão anunciados com antecedência, e passarão primeiro por uma fase de discussão e fases de pré-lançamentos alfa ou beta.

## Casos Extremos de Versionamento Semântico {#semantic-versioning-edge-cases}

Os lançamentos da Vue seguem o [Versionamento Semântico](https://semver.org/) com alguns casos extremos.

### Definições de TypeScript {#typescript-definitions}

Nós podemos entregar mudanças incompatíveis com as definições de TypeScript entre versões **secundárias**. Isto porque:

1. Algumas vezes a própria TypeScript entrega mudanças incompatíveis entre versões secundárias, e podemos ter de ajustar os tipos para suportar versões mais novas de TypeScript.

2. Ocasionalmente podemos precisar de adotar funcionalidades que apenas estão disponíveis numa versão mais nova da TypeScript, elevando a versão mínima exigida da TypeScript.

Se estiveres a usar a TypeScript, podes usar um limite de versionamento semântico que tranca a versão secundária atual e manualmente atualizar quando uma nova versão secundária da Vue for lançada.

### Compatibilidade de Código Compilado com Executores Mais Antigos {#compiled-code-compatibility-with-older-runtime}

Uma versão **secundária** mais recente do compilador da Vue pode gerar código que não é compatível com o executor da Vue duma versão secundária mais antiga. Por exemplo, o código gerado pelo compilador da Vue 3.2 pode não ser completamente compatível se consumido pelo executor da Vue 3.1.

Isto é apenas uma preocupação para os autores de biblioteca, porque nas aplicações, a versão do compilador e a versão do executor é sempre a mesma. Uma divergência de versão apenas pode acontecer se entregares código de componente de Vue pré-compilado como um pacote, e um consumidor usá-lo num projeto usando uma versão mais antiga da Vue. Como resultado, o teu pacote pode precisar de declarar explicitamente uma versão secundária obrigatória mínima da Vue.

## Pré-Lançamentos {#pre-releases}

Os lançamentos secundários normalmente passam por um número não fixo de lançamentos beta. Os lançamentos primários passarão por uma fase alfa e uma fase beta.

Os pré-lançamentos estão destinados para testes de integração ou estabilidade, e para primeiros adotantes fornecerem comentários para as funcionalidades instáveis. Não use os pré-lançamentos em produção. Todos os pré-lançamentos são considerados instáveis e podem entrar mudanças de rutura consigo, então sempre fixe as versões exatas quando usares pré-lançamentos.

## Depreciações {#deprecations}

Nós podemos periodicamente depreciar funcionalidades que têm novas e melhores substitutos nos lançamentos secundários. As funcionalidades depreciadas continuarão a funcionar, e serão removidas no próximo lançamento primário depois de entrada no estado de depreciação.

## RFCs {#rfcs}

As novas funcionalidades com superfície de API substancial e mudanças primárias para Vue passarão pelo processo de **Pedidos Por Comentários**. Este processo está destinado a fornecer um caminho consistente e controlado para as novas funcionalidades entrarem na abstração, e dar aos utilizadores uma oportunidade de participar e oferecer comentários no processo de desenho.

O processo é conduzido no repositório [vuejs/rfcs](https://github.com/vuejs/rfcs) na GitHub.

## Funcionalidades Experimentais {#experimental-features}

Algumas funcionalidades são entregadas e documentadas numa versão estável da Vue, mas marcadas como experimentais. As funcionalidades experimentais são normalmente funcionalidades que têm uma discussão de RFC associada com a maioria dos problemas de desenho resolvidos no estudo, mas continua carente de comentário de uso do mundo real.

O objetivo das funcionalidades experimentais é permitir os utilizadores fornecerem comentários para elas testando-as numa configuração de produção, sem ter de usar uma versão instável da Vue. As próprias funcionalidades experimentais são consideradas instáveis, e deveriam ser apenas usadas duma maneira controlada, com a expetativa de que a funcionalidade pode mudar entre quaisquer tipos de lançamento.
