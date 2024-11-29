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
