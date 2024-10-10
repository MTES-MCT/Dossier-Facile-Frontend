import visaleUrl from '../assets/logos/visale.webp'
import anilUrl from '../assets/logos/anil.webp'
import unmlUrl from '../assets/logos/UNML.webp'
import cllajUrl from '../assets/logos/CLLAJ.webp'
import fuUrl from '../assets/logos/FranceUniversites.webp'

import papUrl from '../assets/logos/pap.webp'
import locserviceUrl from '../assets/logos/loc_service.webp'
import fasttUrl from '../assets/logos/fastt.webp'
import flatsyUrl from '../assets/logos/flatsy.webp'
import hugoUrl from '../assets/logos/monsieur_hugo.webp'
import clickandrentUrl from '../assets/logos/clickandrent.webp'
import qlowerUrl from '../assets/logos/qlower.webp'
import jelouebienUrl from '../assets/logos/jelouebien.webp'
import gererseulUrl from '../assets/logos/gererseul.webp'
import unDeuxTroisLogerUrl from '../assets/logos/123Loger.webp'
import superimmoUrl from '../assets/logos/superimmo.webp'
import wiziUrl from '../assets/logos/wizi.webp'
import rentilaUrl from '../assets/logos/rentila.webp'
import platoimmoUrl from '../assets/logos/platoimmo.webp'
import immoloyerUrl from '../assets/logos/immoloyer.webp'
import emjysoftUrl from '../assets/logos/emjysoft_gestion_locative.webp'
import timciUrl from '../assets/logos/timci.webp'
import ispUrl from '../assets/logos/isp_group.webp'
import jsoftUrl from '../assets/logos/jsoft.webp'
import mclUrl from '../assets/logos/mon_carnet_logement.webp'
import pdpUrl from '../assets/logos/partir_de_paris.webp'
import goodlizUrl from '../assets/logos/goodliz.webp'
import pautionsUrl from '../assets/logos/pautions.webp'
import jinkaUrl from '../assets/logos/jinka.webp'
import lokappyUrl from '../assets/logos/lokappy.webp'
import immopadUrl from '../assets/logos/immopad.webp'
import mydomusUrl from '../assets/logos/mydomus.webp'
import omnireaUrl from '../assets/logos/omnirea.webp'

interface Partner {
  name: string
  image: string
  href: string
  height: string
  width: string
}

export const INSTITUTIONAL_PARTNERS: Partner[] = [
  {
    image: visaleUrl,
    height: '48',
    href: 'https://www.visale.fr/',
    name: 'visale.fr - connecte emploi et logement',
    width: '150'
  },
  {
    image: anilUrl,
    href: 'https://www.anil.org/',
    height: '80',
    width: '80',
    name: 'ANIL, l’agence nationale pour l’information sur le logement'
  },
  {
    image: unmlUrl,
    href: 'https://www.unml.info/',
    name: 'Union nationale des missions locales',
    height: '60',
    width: '118'
  },
  {
    image: cllajUrl,
    href: 'https://www.uncllaj.org/',
    name: 'Comités Locaux pour le Logement Autonome des Jeunes',
    height: '60',
    width: '137'
  },
  {
    image: fuUrl,
    href: 'https://franceuniversites.fr/',
    name: 'France Universités',
    height: '60',
    width: '194'
  }
]

export const PARTNERS: Partner[] = [
  {
    image: papUrl,
    height: '60',
    href: 'https://www.pap.fr',
    name: 'PAP - Particulier à Particulier',
    width: '167'
  },
  {
    image: jinkaUrl,
    href: 'https://www.jinka.fr',
    name: 'Jinka',
    height: '60',
    width: '185'
  },
  {
    image: locserviceUrl,
    height: '60',
    href: 'https://www.locservice.fr/',
    name: 'locservice.fr - location et colocation entre particuliers',
    width: '144'
  },
  {
    image: fasttUrl,
    height: '60',
    href: 'https://www.fastt.org/',
    name: 'fastt',
    width: '95'
  },
  {
    image: flatsyUrl,
    height: '60',
    href: 'https://www.flatsy.fr/',
    name: 'flatsy',
    width: '174'
  },
  {
    image: hugoUrl,
    height: '39',
    href: 'https://www.monsieurhugo.com/',
    name: 'monsieur Hugo',
    width: '210'
  },
  {
    image: clickandrentUrl,
    height: '30',
    href: 'https://www.clickandrent.fr/',
    name: 'click and rent',
    width: '209'
  },
  {
    image: qlowerUrl,
    height: '30',
    href: 'https://www.qlower.com/',
    name: 'qlower',
    width: '148'
  },
  {
    image: jelouebienUrl,
    height: '30',
    href: 'https://www.jelouebien.com/',
    name: 'jelouebien.com',
    width: '227'
  },
  {
    image: gererseulUrl,
    height: '46',
    href: 'https://www.gererseul.com/',
    name: 'gererseul – ma gestion locative',
    width: '200'
  },
  {
    image: unDeuxTroisLogerUrl,
    height: '60',
    href: 'https://www.123loger.com/',
    name: '123Loger',
    width: '60'
  },
  {
    image: superimmoUrl,
    height: '60',
    href: 'https://www.superimmo.com/',
    name: 'superimmo',
    width: '222'
  },
  {
    image: wiziUrl,
    height: '60',
    href: 'https://www.wizi.io/',
    name: 'wizi',
    width: '151'
  },
  {
    image: rentilaUrl,
    height: '60',
    href: 'https://www.rentila.com/',
    name: 'rentila',
    width: '102'
  },
  {
    image: platoimmoUrl,
    height: '60',
    href: 'https://www.plato.immo/',
    name: 'plato.immo',
    width: '133'
  },
  {
    image: immoloyerUrl,
    height: '60',
    href: 'https://www.immobilierloyer.com/',
    name: 'immobilier loyer',
    width: '208'
  },
  {
    image: immopadUrl,
    height: '60',
    href: 'https://www.immopad.com/',
    name: 'immopad',
    width: '188'
  },
  {
    image: mydomusUrl,
    height: '60',
    href: 'https://www.mydomus.co/',
    name: 'mydomus',
    width: '214'
  },
  {
    image: omnireaUrl,
    height: '60',
    href: 'https://omnirea.fr/',
    name: 'omnirea',
    width: '172'
  },
  {
    image: emjysoftUrl,
    height: '60',
    href: 'https://www.emjysoft.com/logiciel-gestion-locative/',
    name: 'emjysoft - gestion locative',
    width: '162'
  },
  {
    image: timciUrl,
    height: '60',
    href: 'https://www.timci.com',
    name: 'Timci - gestion de biens',
    width: '189'
  },
  {
    image: ispUrl,
    height: '60',
    href: 'https://www.isp-group.immo/louer/',
    name: 'ISP Group - Immobilier et consulting',
    width: '99'
  },
  {
    image: jsoftUrl,
    height: '60',
    href: 'https://www.jsoft.fr/logiciel-gestion-immobiliere/',
    name: 'JSoft - Logiciel de gestion locative immobilière',
    width: '240'
  },
  {
    image: mclUrl,
    height: '60',
    href: 'https://moncarnetlogement.fr/',
    name: 'Mon carnet logement',
    width: '194'
  },
  {
    image: pdpUrl,
    href: 'https://www.partirdeparis.fr/',
    name: 'Partir de Paris',
    width: '196',
    height: '58'
  },
  {
    image: goodlizUrl,
    href: 'https://goodliz.com',
    name: 'GoodLiz',
    height: '60',
    width: '77'
  },
  {
    image: pautionsUrl,
    href: 'https://pautions.fr',
    name: 'Pautions',
    height: '55',
    width: '232'
  },
  {
    image: lokappyUrl,
    height: '60',
    href: 'https://lokappy.co/',
    name: 'lokappy',
    width: '231'
  }
]
