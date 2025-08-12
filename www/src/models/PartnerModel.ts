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
import lokappyUrl from '../assets/logos/lokappy.webp'
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

interface Partner {
  name: string
  image: string
  href: string
  height: string
  width: string
}

export const INSTITUTIONAL_PARTNERS: Partner[] = [
  {
    image: cnousUrl,
    name: 'CNOUS',
    href: 'https://www.lescrous.fr/les-crous/le-cnous/',
    height: '120',
    width: '120'
  },
  {
    image: dgesipUrl,
    name: 'DGESIP',
    href: 'https://www.enseignementsup-recherche.gouv.fr/fr/direction-generale-de-l-enseignement-superieur-et-de-l-insertion-professionnelle-dgesip-83714',
    height: '180',
    width: '180'
  },
  {
    image: anilUrl,
    href: 'https://www.anil.org/votre-projet/vous-etes-locataire/se-loger/dans-le-prive/',
    height: '80',
    width: '80',
    name: 'ANIL, l’agence nationale pour l’information sur le logement'
  },
  {
    image: servicePublicUrl,
    name: 'Service Public',
    href: 'https://www.service-public.fr/particuliers/vosdroits/R51424',
    height: '120',
    width: '280'
  },
  {
    image: ministereInterieurUrl,
    name: 'Ministère de l’intérieur',
    href: 'https://www.masecurite.interieur.gouv.fr/fr/fiches-pratiques/habitation/eviter-faux-dossiers-location-grace-dossierfacile?hl=dossierfacile',
    height: '150',
    width: '200'
  },
  {
    image: visaleUrl,
    height: '48',
    href: 'https://www.visale.fr/',
    name: 'visale.fr - connecte emploi et logement',
    width: '150'
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
    href: 'https://www.projet-toit.fr/mon-dossier-de-location/',
    name: 'Comités Locaux pour le Logement Autonome des Jeunes',
    height: '60',
    width: '137'
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
    image: laforetUrl,
    height: '60',
    name: 'Laforêt',
    href: 'https://www.laforet.com/',
    width: '300'
  },
  {
    image: ouestfranceImmoUrl,
    height: '60',
    name: 'Ouestfrance-immo',
    href: 'https://www.ouestfrance-immo.com/',
    width: '250'
  },
  {
    image: unDeuxTroisLogerUrl,
    height: '60',
    href: 'https://www.123loger.com/',
    name: '123Loger',
    width: '60'
  },
  {
    image: figaroImmoUrl,
    height: '60',
    name: 'Figaro immobilier',
    href: 'https://immobilier.lefigaro.fr/',
    width: '200'
  },
  {
    image: myappartUrl,
    href: 'https://www.my-appart.fr',
    name: 'MyAppart',
    height: '93',
    width: '248'
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
    image: pdpUrl,
    href: 'https://www.partirdeparis.fr/',
    name: 'Partir de Paris',
    width: '196',
    height: '58'
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
  },
  {
    image: eonImmobilierUrl,
    height: '53',
    href: 'https://www.eon-immobilier.com/',
    name: 'Eon Immobilier',
    width: '240'
  },
  {
    image: immojeuneUrl,
    height: '67',
    href: 'https://www.immojeune.com',
    name: 'Immmojeune',
    width: '144'
  }
]
