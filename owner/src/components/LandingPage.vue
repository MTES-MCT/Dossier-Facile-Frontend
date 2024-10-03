<template>
  <div class="full-width bg--grey">
    <section class="df-image-background">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-7 fr-pr-2w">
            <div class="main-title-block">
              <h1 class="fr-h1 color--white">
                {{ t('landing.title') }}
              </h1>
              <p class="text-bold color--white fr-h4">
                {{ t('landing.subtitle1') }}
                {{ t('landing.subtitle2') }}
              </p>
              <p class="text-bold color--white">
                {{ t('landing.subtitle3') }}
              </p>
            </div>
          </div>
          <div class="fr-col-12 fr-col-lg-4">
            <SignupVerticalCard
              @on-register="onRegister"
              @on-login-franceconnect="loginFranceConnect"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="screenshot">
      <img src="../assets/landing/screenshot-top.png" alt="" class="justif-img" />
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container">
        <div class="fr-grid-row fr-p-4w">
          <span class="fr-h2 text-center">
            {{ t('landing.tagline') }}
          </span>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ t('landing.purpose.first.title') }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t('landing.purpose.first.content') }}</p>
              </div>
              <div class="fr-tile__img">
                <i class="ri-checkbox-circle-line purpose-icon"></i>
              </div>
            </div>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ t('landing.purpose.second.title') }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t('landing.purpose.second.content') }}</p>
              </div>
              <div class="fr-tile__img">
                <i class="ri-eye-2-line purpose-icon"></i>
              </div>
            </div>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ t('landing.purpose.third.title') }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t('landing.purpose.third.content') }}</p>
              </div>
              <div class="fr-tile__img">
                <i class="ri-timer-flash-line purpose-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ t('landing.citation.title') }}
        </h2>
        <div class="fr-grid-row">
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <figure class="fr-quote">
              <blockquote>
                <p>{{ t('landing.citation.s1') }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t('landing.citation.s1-author') }}</p>
              </figcaption>
            </figure>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <figure class="fr-quote">
              <blockquote>
                <p>{{ t('landing.citation.s2') }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t('landing.citation.s2-author') }}</p>
              </figcaption>
            </figure>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <figure class="fr-quote">
              <blockquote>
                <p>{{ t('landing.citation.s3') }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t('landing.citation.s3-author') }}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ t('landing.howto.title') }}
        </h2>
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-3 fr-grid-col fr-p-2w">
            <div class="fr-grid-row howto">
              <div class="fr-col-12 howto-title">
                <div class="ri-checkbox-circle-line"></div>
                {{ t('landing.howto.add-property.title') }}
              </div>
              <div class="fr-col-12">{{ t('landing.howto.add-property.content') }}</div>
              <div class="fr-col-12">
                <img src="../assets/landing/add-property.svg" alt="" class="justif-img" />
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-9 fr-grid-col fr-p-2w">
            <img src="../assets/landing/screenshot-howto-1.png" alt="" class="justif-img" />
          </div>
        </div>
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-3 fr-grid-col fr-p-2w">
            <div class="fr-grid-row howto">
              <div class="fr-col-12 howto-title">
                <div class="ri-eye-2-line"></div>
                {{ t('landing.howto.invite-tenant.title') }}
              </div>
              <div class="fr-col-12">{{ t('landing.howto.invite-tenant.content') }}</div>
              <div class="fr-col-12">
                <img src="../assets/landing/invite-tenant.svg" alt="" class="justif-img" />
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-9 fr-grid-col fr-p-2w">
            <img src="../assets/landing/screenshot-howto-2.png" alt="" class="justif-img" />
          </div>
        </div>
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-3 fr-grid-col fr-p-2w">
            <div class="fr-grid-row howto">
              <div class="fr-col-12 howto-title">
                <div class="ri-timer-flash-line"></div>
                {{ t('landing.howto.manage-tenant.title') }}
              </div>
              <div class="fr-col-12">{{ t('landing.howto.manage-tenant.content') }}</div>
              <div class="fr-col-12">
                <img src="../assets/landing/manage-tenant.svg" alt="" class="justif-img" />
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-9 fr-grid-col fr-p-2w">
            <img src="../assets/landing/screenshot-howto-3.png" alt="" class="justif-img" />
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ t('landing.result.title') }}<br />
          <span class="text--light-blue">{{ t('landing.result.title1') }}</span>
          {{ t('landing.result.title2') }}
          <span class="blue-text">{{ t('landing.result.title3') }}</span>
        </h2>
        <div class="fr-grid-row">
          <img src="../assets/landing/screenshot-bottom.png" alt="" class="justif-img" />
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-2w">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-lg-12 fr-col-12">
            <SignupCard @on-register="onRegister" @on-login-franceconnect="loginFranceConnect" />
          </div>
        </div>
      </div>
    </section>
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ t('signuppage.mail-sent') }}
              </p>
              <p>
                {{ t('signuppage.clic-to-confirm') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { User } from 'df-shared-next/src/models/User'
import { useI18n } from 'vue-i18n'
import Modal from 'df-shared-next/src/components/Modal.vue'
import useOwnerStore from '../store/owner-store'
import SignupVerticalCard from './auth/SignupVerticalCard.vue'
import SignupCard from './auth/SignupCard.vue'

const FRANCE_CONNECT_LOGIN_URL = import.meta.env.VITE_SSO_FRANCE_CONNECT_LOGIN_URL
const MAIN_URL = `${import.meta.env.VITE_OWNER_URL}`

const store = useOwnerStore()
const { t } = useI18n()
const isValidModalVisible = ref(false)
const toast = useToast()

function closeModal() {
  isValidModalVisible.value = false
  window.location.replace(MAIN_URL)
}
function loginFranceConnect() {
  if (FRANCE_CONNECT_LOGIN_URL) {
    window.location.href = FRANCE_CONNECT_LOGIN_URL.toString()
  }
}
function onRegister(user: User) {
  if (user?.email && user.password) {
    store.register(user).then(
      () => {
        isValidModalVisible.value = true
      },
      (error) => {
        if (
          error.response?.data?.errors?.filter(
            (e: any) => e?.code === 'UniqueEmailActiveAccount'
          ) !== undefined
        ) {
          toast.error(t('signuppage.duplicate-email').toString(), {
            timeout: 7000
          })
          return
        }
        toast.error(t('signuppage.register-error').toString(), {
          timeout: 7000
        })
      }
    )
  }
}
</script>

<style scoped lang="scss">
.df-image-background {
  width: 100%;
  height: 700px;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 40% !important;
  background-image: url('../assets/cover-features.webp');
  z-index: 0;
}
.main-title-block {
  top: 100px;
  position: relative;
  @media (max-width: 992px) {
    top: 30px;
  }
}
.screenshot {
  margin-top: -105px;
  @media (max-width: 992px) {
    display: none;
    margin-top: 0;
  }
}
.purpose-icon {
  font-size: 4rem;
  color: #0063cb;
}
.howto {
  :last-child {
    margin-right: 0.5rem;
    @media (max-width: 992px) {
      display: none;
      margin-top: 0;
    }
  }
}
.howto-title {
  display: inline-flex;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.75rem;

  :first-child {
    margin-right: 0.5rem;
  }
}
.text-center {
  text-align: center;
}
.justif-img {
  margin-left: auto;
  margin-right: auto;
}
</style>
