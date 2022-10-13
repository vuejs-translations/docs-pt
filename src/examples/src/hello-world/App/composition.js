import { ref } from 'vue'

export default {
  setup() {
    // A "ref" é uma fonte de dado reativa que guarda um valor.
    // Tecnicamente, não precisamos envolver uma sequência de caracteres
    // com ref() para exibe-la, mas veremos no próximo exemplo do porquê
    // ser preciso caso alguma vez tencionamos mudar o valor.
    const message = ref('Hello World!')

    return {
      message
    }
  }
}
