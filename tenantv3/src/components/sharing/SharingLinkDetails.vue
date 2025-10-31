<template>
  <div class="details">
    <div class="wrapper">
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">Informations générales</h3>
        <table class="table">
          <tbody>
            <tr>
              <td class="fr-text-mention--grey">Titre du partage</td>
              <td>
                {{ link.title }}
                <button type="button" class="blue-text">Modifier</button>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Créé le</td>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Expire le</td>
              <td>
                {{ formatDate(link.expirationDate) }}
                <button type="button" class="blue-text">Modifier</button>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Type de dossier</td>
              <td>{{ link.fullData ? 'Avec justificatifs' : 'Sans justificatifs' }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Créé par</td>
              <td>TODO</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">Statistiques d’utilisation</h3>
        <table class="table">
          <tbody>
            <tr>
              <td class="fr-text-mention--grey">Première consultation</td>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Dernière consultation</td>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">Nombre de consultations</td>
              <td>{{ link.nbVisits }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="info">
      <LinkWarning />
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import LinkWarning from './LinkWarning.vue'

defineProps<{ link: ApartmentSharingLink }>()

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')
</script>

<style scoped>
.details {
  border-radius: 0 0 4px 4px;
  padding: 10px 16px;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
}
.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.section {
  display: flex;
  flex-direction: column;
  flex: 1 0 20rem;
}
.table {
  display: flex;
  flex-direction: column;
  tr {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-top: 4px;
    td + td {
      flex: 1;
      text-align: right;
    }
  }
}
.info {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
}
h3 {
  border-bottom: 1px solid var(--blue-france-sun-113-625);
}
</style>
