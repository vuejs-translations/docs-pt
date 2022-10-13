import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Hello World!')

    function reverseMessage() {
      // Acessa/altera o valor de uma `ref` através da
      // sua propriedade `.value`
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('A navegação foi impedida.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
