<template>
  <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
    <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
      Voir le fil d’Ariane
    </button>
    <div id="breadcrumb-1" class="fr-collapse">
      <ol class="fr-breadcrumb__list">
        <li><a class="fr-breadcrumb__link" href="/">Accueil</a></li>
        <li>
          <a class="fr-breadcrumb__link" aria-current="page">{{ currentPage }}</a>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ currentPage: string }>()
</script>
