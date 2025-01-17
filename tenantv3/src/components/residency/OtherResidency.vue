<template>
  <BackLinkRow label="En situation précaire" to="/documents-locataire/2" />
  <p>
    Cochez la case suivante si vous êtes dans une situation précaire (sans-abri, victime de
    violences conjugales par exemple). La phrase suivante sera ajouté à votre dossier :
    <em
      >Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3
      derniers mois</em
    >.
  </p>
  <div class="fr-checkbox-group fr-mb-2w displa">
    <input id="precarious-checkbox" type="checkbox" />
    <label class="fr-label" for="precarious-checkbox">Vous êtes dans une situation précaire</label>
  </div>
  <div class="fr-highlight">
    <p>
      Vous êtes sans-abri ? Le <a href="tel:115">115</a> est un numéro national d'assistance et
      d'orientation pour les personnes sans-abri. Il est ouvert 7j/7 et 24h/24.
    </p>
  </div>
  <div class="fr-highlight">
    <p>
      Vous êtes victime de violences conjugales ? Le <a href="tel:3919">3919</a> est un numéro
      d’assistance et d’information destiné aux femmes victimes de violences. Le service est anonyme
      et gratuit. Des associations et organismes publics peuvent également vous venir en aide.
      Consultez la page
      <a href="https://www.service-public.fr/particuliers/vosdroits/F12544" target="_blank">
        violences conjugales du site service-public.fr</a
      >.
    </p>
  </div>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
</script>
