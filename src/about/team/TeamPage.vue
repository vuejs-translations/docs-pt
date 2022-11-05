<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>Conheça a Equipa</template>
      <template #lead>
        O desenvolvimento da Vue e seu ecossistema é guiado por uma equipa internacional, alguns dos quais escolhidos para serem
        <span
          class="nowrap"
        >mencionados abaixo.</span>
      </template>

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
        >Aprenda mais acerca das equipas</VTLink>
      </template>
    </TeamHero>

    <TeamList :members="membersCoreData">
      <template #title>Membros da Equipa Principal</template>
      <template
        #lead
      >Os membros da equipa principal são aqueles que estão ativamente envolvidos na manutenção de um ou mais projetos principais. Eles têm feito contribuições significativas para o ecossistema da Vue, com uma dedicação de longo prazo para o sucesso do projeto e seus utilizadores.</template>
    </TeamList>

    <TeamList :members="membersEmeritiData as Member[]">
      <template #title>Equipa Principal Emerita</template>
      <template
        #lead
      >Cá honramos alguns membros da equipa principal que não mais são ativos os quais fizeram contribuições valiosas no passado.</template>
    </TeamList>

    <TeamList :members="membersPartnerData as Member[]">
      <template #title>Parceiros da Comunidade</template>
      <template
        #lead
      >Alguns membros da comunidade de Vue a tem enriquecido tanto, que merecem menção especial. Temos desenvolvido um relacionamento mais intimo com estes parceiros chaves, muitas vezes coordenando com eles a respeito de futuras funcionalidades e novidades.</template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
