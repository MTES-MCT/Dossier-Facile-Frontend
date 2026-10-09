import visaleUrl from '../assets/logos/visale.webp'
import anilUrl from '../assets/logos/anil.webp'
import unmlUrl from '../assets/logos/UNML.webp'
import cllajUrl from '../assets/logos/CLLAJ.webp'

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
import pdpUrl from '../assets/logos/partir_de_paris.webp'
import pautionsUrl from '../assets/logos/pautions.webp'
import jinkaUrl from '../assets/logos/jinka.webp'
import immopadUrl from '../assets/logos/immopad.webp'
import omnireaUrl from '../assets/logos/omnirea.webp'
import eonImmobilierUrl from '../assets/logos/eon_immobilier.webp'
import immojeuneUrl from '../assets/logos/immojeune.webp'
import myappartUrl from '../assets/logos/myappart.png'
import laforetUrl from '../assets/logos/laforet.webp'
import ouestfranceImmoUrl from '../assets/logos/ouestfrance-immo.svg'
import figaroImmoUrl from '../assets/logos/figaro-immobilier.svg'
import cnousUrl from '../assets/logos/Crous.png'
import dgesipUrl from '../assets/logos/dgesip.png'
import servicePublicUrl from '../assets/logos/Service-public.fr.png'
import ministereInterieurUrl from '../assets/logos/Ministère_de_l_Intérieur.png'
import lokavizUrl from '../assets/logos/lokaviz.png'
import ministerLogementUrl from '../assets/logos/Ministère_du_Logement_et_de_la_Rénovation_urbaine.png'
import filigraneFacileUrl from '../assets/logos/FiligraneFacile.png'

export interface Partner {
  name: string
  determinant: string
  image: string
  href: string
  height: string
  width: string
}

export const INSTITUTIONAL_PARTNERS: Partner[] = [
  {
    image: cnousUrl,
    name: 'CROUS',
    determinant: 'du',
    href: 'https://www.lescrous.fr/',
    height: '120',
    width: '120'
  },
  {
    image: dgesipUrl,
    name: 'Ministère chargé de l’Enseignement Supérieur et de la recherche',
    determinant: 'du',
    href: 'https://www.enseignementsup-recherche.gouv.fr/',
    height: '180',
    width: '220'
  },
  {
    image: anilUrl,
    name: 'ANIL, l’agence nationale pour l’information sur le logement',
    determinant: "de l'",
    href: 'https://www.anil.org/votre-projet/vous-etes-locataire/se-loger/dans-le-prive/',
    height: '80',
    width: '80'
  },
  {
    image: servicePublicUrl,
    name: 'Service Public',
    determinant: 'de',
    href: 'https://www.service-public.fr/particuliers/vosdroits/R51424',
    height: '93',
    width: '270'
  },
  {
    image: ministereInterieurUrl,
    name: 'Ministère de l’intérieur',
    determinant: 'du',
    href: 'https://www.masecurite.interieur.gouv.fr/fr/fiches-pratiques/habitation/eviter-faux-dossiers-location-grace-dossierfacile?hl=dossierfacile',
    height: '150',
    width: '200'
  },
  {
    image: visaleUrl,
    name: 'visale.fr - connecte emploi et logement',
    determinant: 'de',
    height: '48',
    href: 'https://www.visale.fr/',
    width: '150'
  },
  {
    image: unmlUrl,
    name: 'Union nationale des missions locales',
    determinant: "de l'",
    href: 'https://www.unml.info/',
    height: '60',
    width: '118'
  },
  {
    image: cllajUrl,
    name: 'Comités Locaux pour le Logement Autonome des Jeunes',
    determinant: 'des',
    href: 'https://www.projet-toit.fr/mon-dossier-de-location/',
    height: '60',
    width: '137'
  },
  {
    image: ministerLogementUrl,
    name: 'Ministère du logement et de la rénovation urbaine',
    determinant: 'du',
    href: 'https://www.ecologie.gouv.fr/dossiers/comment-faciliter-lacces-logement',
    width: '250',
    height: '179'
  },
  {
    image: filigraneFacileUrl,
    name: 'Filigrane facile',
    determinant: 'de',
    href: 'https://filigrane.beta.gouv.fr/',
    width: '250',
    height: '73'
  }
]

export const PARTNERS: Partner[] = [
  {
    image: papUrl,
    name: 'PAP - Particulier à Particulier',
    determinant: 'de',
    height: '60',
    href: 'https://www.pap.fr',
    width: '167'
  },
  {
    image: jinkaUrl,
    name: 'Jinka',
    determinant: 'de',
    href: 'https://www.jinka.fr',
    height: '60',
    width: '185'
  },
  {
    image: locserviceUrl,
    name: 'locservice.fr - location et colocation entre particuliers',
    determinant: 'de',
    height: '60',
    href: 'https://www.locservice.fr/',
    width: '144'
  },
  {
    image: laforetUrl,
    name: 'Laforêt',
    determinant: 'de',
    height: '60',
    href: 'https://www.laforet.com/',
    width: '300'
  },
  {
    image: ouestfranceImmoUrl,
    name: 'Ouestfrance-immo',
    determinant: 'de',
    height: '60',
    href: 'https://www.ouestfrance-immo.com/',
    width: '250'
  },
  {
    image: unDeuxTroisLogerUrl,
    name: '123Loger',
    determinant: 'de',
    height: '60',
    href: 'https://www.123loger.com/',
    width: '60'
  },
  {
    image: figaroImmoUrl,
    name: 'Figaro immobilier',
    determinant: 'du',
    height: '60',
    href: 'https://immobilier.lefigaro.fr/',
    width: '200'
  },
  {
    image: lokavizUrl,
    name: 'Lokaviz',
    determinant: 'de',
    href: 'https://www.lokaviz.fr/',
    width: '250',
    height: '60'
  },
  {
    image: myappartUrl,
    name: 'MyAppart',
    determinant: 'de',
    href: 'https://www.my-appart.fr',
    height: '93',
    width: '248'
  },
  {
    image: fasttUrl,
    name: 'fastt',
    determinant: 'de',
    height: '60',
    href: 'https://www.fastt.org/',
    width: '95'
  },
  {
    image: flatsyUrl,
    name: 'flatsy',
    determinant: 'de',
    height: '60',
    href: 'https://www.flatsy.fr/',
    width: '174'
  },
  {
    image: hugoUrl,
    name: 'monsieur Hugo',
    determinant: 'de',
    height: '39',
    href: 'https://www.monsieurhugo.com/',
    width: '210'
  },
  {
    image: clickandrentUrl,
    name: 'click and rent',
    determinant: 'de',
    height: '30',
    href: 'https://www.clickandrent.fr/',
    width: '209'
  },
  {
    image: qlowerUrl,
    name: 'qlower',
    determinant: 'de',
    height: '30',
    href: 'https://www.qlower.com/',
    width: '148'
  },
  {
    image: jelouebienUrl,
    name: 'je loue bien.com',
    determinant: 'de',
    height: '30',
    href: 'https://www.jelouebien.com/',
    width: '227'
  },
  {
    image: gererseulUrl,
    name: 'gérer seul - ma gestion locative',
    determinant: 'de',
    height: '46',
    href: 'https://www.gererseul.com/',
    width: '200'
  },
  {
    image: superimmoUrl,
    name: 'superimmo',
    determinant: 'de',
    height: '60',
    href: 'https://www.superimmo.com/',
    width: '222'
  },
  {
    image: wiziUrl,
    name: 'wizi',
    determinant: 'de',
    height: '60',
    href: 'https://www.wizi.io/',
    width: '151'
  },
  {
    image: rentilaUrl,
    name: 'rentila',
    determinant: 'de',
    height: '60',
    href: 'https://www.rentila.com/',
    width: '102'
  },
  {
    image: platoimmoUrl,
    name: 'plato immo',
    determinant: 'de',
    height: '60',
    href: 'https://www.plato.immo/',
    width: '133'
  },
  {
    image: immoloyerUrl,
    name: 'immobilier loyer',
    determinant: 'de',
    height: '60',
    href: 'https://www.immobilierloyer.com/',
    width: '208'
  },
  {
    image: immopadUrl,
    name: 'immopad',
    determinant: "d'",
    height: '60',
    href: 'https://www.immopad.com/',
    width: '188'
  },
  {
    image: omnireaUrl,
    name: 'omnirea',
    determinant: "d'",
    height: '60',
    href: 'https://omnirea.fr/',
    width: '172'
  },
  {
    image: emjysoftUrl,
    name: 'emjysoft - gestion locative',
    determinant: "d'",
    height: '60',
    href: 'https://www.emjysoft.com/logiciel-gestion-locative/',
    width: '162'
  },
  {
    image: timciUrl,
    name: 'Timci - gestion de biens',
    determinant: 'de',
    height: '60',
    href: 'https://www.timci.com',
    width: '189'
  },
  {
    image: ispUrl,
    name: 'ISP Group - Immobilier et consulting',
    determinant: "d'",
    height: '60',
    href: 'https://www.isp-group.immo/louer/',
    width: '99'
  },
  {
    image: jsoftUrl,
    name: 'JSoft - Logiciel de gestion locative immobilière',
    determinant: 'de',
    height: '60',
    href: 'https://www.jsoft.fr/logiciel-gestion-immobiliere/',
    width: '240'
  },
  {
    image: pdpUrl,
    name: 'Partir de Paris',
    determinant: 'de',
    href: 'https://www.partirdeparis.fr/',
    width: '196',
    height: '58'
  },
  {
    image: pautionsUrl,
    name: 'Pautions',
    determinant: 'de',
    href: 'https://pautions.fr',
    height: '55',
    width: '232'
  },
  {
    image: eonImmobilierUrl,
    name: 'Eon Immobilier',
    determinant: 'de',
    height: '53',
    href: 'https://www.eon-immobilier.com/',
    width: '240'
  },
  {
    image: immojeuneUrl,
    name: 'Immmojeune',
    determinant: "d'",
    height: '67',
    href: 'https://www.immojeune.com',
    width: '144'
  }
]
