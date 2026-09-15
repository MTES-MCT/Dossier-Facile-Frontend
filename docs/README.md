# Documentation Technique DossierFacile Frontend

Bienvenue dans la documentation technique du projet DossierFacile Frontend.

## Guides & Architectures

- 📘 [**Architecture et Guide des Analyses de Documents (`document-analysis-guide.md`)**](./document-analysis-guide.md) : Fonctionnement global du cycle d'analyse (polling, timeout, overtime, slots), responsabilités des composants (`AnalysisWrapper`, `UploadFileWithAnalysis`, `AnalysisFooter`) et guide pas-à-pas pour créer une nouvelle analyse de document.
- 📘 [**Stratégies d'Erreurs d'Analyse Automatique (`document-analysis-error-strategies.md`)**](./document-analysis-error-strategies.md) : Guide complet expliquant le paradigme de stratégie (`BaseAnalysisErrorStrategy`), l'affichage personnalisé des blocs d'erreurs d'analyse de documents (`AnalysisErrorBlock.vue`), et comment créer ou remplacer des stratégies pour les différents types de documents.
- 🔒 [**Audit & Remédiation des Dépendances (`dependency-audit.md`)**](./dependency-audit.md) : Guide et méthodologie pour les audits de sécurité Snyk, la mise à jour des dépendances via `pnpm-workspace` et les `pnpm.overrides`.
