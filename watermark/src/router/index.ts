import * as VueRouter from 'vue-router'
import WatermarkingPage from '../views/WatermarkingPage.vue'
import LegalNotices from '../views/LegalNotices.vue'
import TermsAndConditions from '../views/TermsAndConditions.vue'
import Accessibility from '../views/AccessibilityPage.vue'

const routes = [
  {
    path: '/',
    name: 'WatermarkingPage',
    component: WatermarkingPage
  },
  {
    path: '/mentions-legales',
    name: 'LegalNotices',
    component: LegalNotices
  },
  {
    path: '/conditions-generales-d-utilisation',
    name: 'TermsAndConditions',
    component: TermsAndConditions
  },
  {
    path: '/accessibilite',
    name: 'Accessibility',
    component: Accessibility
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
