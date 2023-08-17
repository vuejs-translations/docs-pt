<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Temas</template>
      <template
        #lead
      >Consulte os temas, Equipamentos de UI, e extensões. Nós podemos ver como uma aplicação do mundo real é construída com a Vue através dos nossos parceiros.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Queres mencionar os teus temas?
      <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Contacte-nos!</a>
    </ThemeContact>
  </div>
</template>
