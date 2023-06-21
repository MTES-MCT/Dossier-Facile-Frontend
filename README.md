# DossierFacile Front-end

<pre>
DossierFacile.fr a été créé par le Ministère de la Transition écologique
pour aider à la réalisation de dossiers de location.

</pre>

The project is available at [DossierFacile.fr](https://dossierfacile.fr)
We are using [yarn](https://yarnpkg.com/) to build the project with monorepo, [storybook](https://storybook.js.org/) to build components, [Vue](https://vuejs.org/) for the framework.

The project is composed of 4 apps : **main** for the homepage, blog etc. **tenant** for the tenant private part, **owner** for the owner private part and **bo** for the back-office used by the operators to validate records.

The apps use standalone components available in the shared folder.

## Pre-requisites

You will need [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) to build the project.

## Installation

Clone this repository and run `yarn install` to install all the dependencies.

Go to any app, e.g: `cd main` and run `yarn serve` to launch the project.

## Run end-to-end tests

Start your local applications and run `yarn e2e test`.

## Use storybook

You can use storybook to test standalone components. You can run `npm run storybook` at the root level of the project.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
