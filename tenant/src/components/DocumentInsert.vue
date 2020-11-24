<template>
  <div>
    <table>
      <tr>
        <th>Les pièces acceptées</th>
        <th>Les pièces refusées</th>
      </tr>
      <tr>
        <td>
          <ul>
            <li v-for="(v, k) in allowList" :key="k">
              {{ v }}
            </li>
          </ul>
        </td>
        <td>
          <ul>
            <li v-for="(v, k) in blockList" :key="k">
              {{ v }}
            </li>
          </ul>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DocumentInsert extends Vue {
  @Prop({
    default() {
      return [];
    }
  })
  private allowList!: string[];
  @Prop({
    default() {
      return [];
    }
  })
  private blockList!: string[];
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
