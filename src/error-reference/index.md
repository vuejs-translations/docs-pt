<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Referência do Código de Erro de Produção {#error-reference}

## Erros de Execução {#runtime-errors}

Nas construções de produção, o terceiro argumento passado às seguintes APIs do manipulador de erro serão um código curto ao invés da sequência de caracteres da informação completa:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (API de Composição)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (API de Opções)

A seguinte tabela mapeia os códigos às suas sequências de caracteres da informação completa.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Erros do Compilador {#compiler-errors}

A seguinte tabela fornece um mapeamento dos códigos de erro do compilador de produção às suas mensagens originais.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
