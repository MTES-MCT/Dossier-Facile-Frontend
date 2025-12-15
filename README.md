# DossierFacile Front-end

> DossierFacile.fr a été créé par le Ministère de la Transition écologique pour aider à la réalisation de dossiers de location.

Ce projet correspond aux sites [DossierFacile](https://dossierfacile.logement.gouv.fr) et [FiligraneFacile](https://filigrane.beta.gouv.fr)
Nous utilisons [pnpm](https://pnpm.io/) pour compiler le projet en monorepo, nous utilisons le framework [Vue](https://vuejs.org/).

Ce projet est composé de 4 apps : **www** pour la page d'accueil, blog etc. **tenantv3** pour la partie locataire, **owner** pour la partie propriétaire et **watermark** pour le site Filigrane.

Des composants partagés entre les applis sont également disponible dans le répertoire df-shared-next.

Pour finir, des tests end to end sont présents dans le répertoire e2e-tests

## Pré-requis

Vous aurez besoin de [node](https://nodejs.org/en/) v22 et [pnpm](https://pnpm.io/) pour construire le projet.

## Installation

Cloner ce repository et exécutez `pnpm install` pour installer les dépendences.

### Configuration

Dans chaque dossier `www`, `tenantv3`, `owner` et `watermark`, copier le fichier `.env.example` dans `.env.local` et modifiez les valeurs adéquates.

### robots.txt behaviour

The build injects a `robots.txt` file based on `VITE_ENVIRONMENT`:

- `prod` keeps `public/robots.txt` (allowing the app to be indexed).
- any other value replaces it with a disallow-all robots file at build time via `df-shared-next/src/plugin/robots`.

### Backend

Assurez-vous d'avoir installé et configuré correctement la partie [backend](https://github.com/MTES-MCT/dossierfacile-backend) afin que la partie front puisse fonctionner.

### Lancement

Vous pouvez lancer les applications depuis la racine avec `pnpm --filter www dev` `pnpm --filter tenantv3 dev` `pnpm --filter owner dev` et `pnpm --filter watermark dev`, ou bien depuis le dossier d'une application avec `pnpm dev`.

## Lancer les tests end-to-end

Démarrez les applications locales, ainsi que les api backend correspondantes, et lancez `pnpm --filter e2e-tests test`.

## Contributions

Les pull requests sont possibles. Pour des changements majeurs, veuillez d'abord contacter l'équipe sur l'adresse contact@dossierfacile.fr.

## License

[MIT](https://choosealicense.com/licenses/mit/)

### ⚠️ IMPORTANT : Limites d'utilisation
Bien que ce code soit distribué sous licence open source MIT, certains éléments contenus dans ce repository sont protégés et leur réutilisation est strictement interdite :

### Marque DossierFacile
Ce repository utilise le nom et le logo de [DossierFacile](https://www.dossierfacile.logement.gouv.fr/), qui constituent une marque déposée de l'État français. Toute utilisation de cette marque en dehors du contexte officiel est interdite.

### Système de Design de l'État Français (DSFR)
Ce repository met en oeuvre le [Système de Design de l'État Français (DSFR)](https://www.systeme-de-design.gouv.fr/). **Il est formellement interdit à tout autre acteur d'utiliser le DSFR pour des sites web ou des applications**. Le DSFR représente l'identité numérique de l'État français.

### Sanctions légales
En cas d'usage non autorisé, vous vous exposez à des poursuites légales, notamment sur la base des articles suivants :
- Usurpation des symboles de la République française ([art. 444-1 Code pénal](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418825))
- Contrefaçon ([art. L335-2 Code de la propriété intellectuelle](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032655082))
- Entrave au fonctionnement d'un système automatisé de traitement de données de l'État ([art. 323-2 Code pénal](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000030939443))
- Escroquerie ([art. 313-2 du Code pénal](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049531795))

**Recommandation** : Si vous souhaitez réutiliser ce code, supprimez ou remplacez tous les éléments liés à la marque DossierFacile et au DSFR avant déploiement.
