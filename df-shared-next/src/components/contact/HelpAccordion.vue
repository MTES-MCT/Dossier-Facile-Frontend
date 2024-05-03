<template>
    <div class="fr-accordions-group">
    <section class="fr-accordion" v-for="e in elements" :key="e.id">
        <h3 class="fr-accordion__title">
            <button class="fr-accordion__btn" aria-expanded="false" :aria-controls="e.id">{{ e.title }}</button>
        </h3>
        <div class="fr-collapse" :id="e.id">
            <p v-html="e.content"></p>
            <div class="fr-highlight">
                <p v-html="e.highlight"></p>
            </div>
        </div>
    </section>
</div>

</template>

<script setup lang="ts">
import { AccordionHelpModel } from '@/models/AccordionHelpModel';

const props = defineProps<{
    elements: AccordionHelpModel[],
}>();

</script>