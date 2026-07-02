# Guide d'installation et de configuration - DossierFacile Frontend

Ce document décrit les étapes d'installation et de lancement du monorepo DossierFacile Frontend sur MacOS / Linux.
Il est formaté pour être facilement interprétable par un agent IA (LLM-first) ou suivi par un développeur.

## 1. Prérequis Système

### 1.1. Clé SSH (Authentification GitHub)
Obligatoire pour cloner le dépôt et interagir avec GitHub.

```bash
# Générer la clé (accepter l'emplacement par défaut, définir une passphrase)
ssh-keygen -t ed25519 -C "votre_email@example.com"

# Lancer l'agent SSH et ajouter la clé (macOS)
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

**Configuration SSH `~/.ssh/config` (macOS) :**
Ajoutez ce contenu à votre fichier `~/.ssh/config` :
```text
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

> **[🤖 Action Humaine]**
> Ajoutez la clé publique (`cat ~/.ssh/id_ed25519.pub`) sur votre profil GitHub : [GitHub SSH Keys](https://github.com/settings/keys).

### 1.2. Clé GPG (Signature des commits)
**Obligatoire pour DossierFacile.** Les commits non signés seront rejetés.
1. Suivre la [documentation GitHub sur la génération d'une clé GPG](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).
2. Forcer la signature par défaut globalement pour Git :
```bash
git config --global commit.gpgsign true
```

---

## 2. Cloner le Projet

```bash
mkdir -p ~/Projets
cd ~/Projets
git clone git@github.com:MTES-MCT/Dossier-Facile-Frontend.git
cd Dossier-Facile-Frontend

# Naviguer vers la branche de développement / de test adéquate
git checkout -b test/morgane origin/test/morgane
```

---

## 3. Configuration de l'environnement NodeJS

Ce projet utilise **Node.js 22** et **pnpm**.

```bash
# 1. Utiliser le bon environnement Node via nvm (lit le .nvmrc)
nvm install
nvm use

# 2. Installer pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 3. Installer les dépendances du monorepo
pnpm install
```

---

## 4. Variables d'Environnement (.env.local)

Les applications front doivent pointer vers les backends de préproduction. 

**Exécution (LLM / CLI) :** Initialiser les fichiers locaux depuis les templates.
```bash
cp owner/.env.example owner/.env.local
cp tenantv3/.env.example tenantv3/.env.local
cp www/.env.example www/.env.local
cp watermark/.env.example watermark/.env.local
```

> **[🤖 Action Humaine] : Peupler les secrets depuis VaultWarden**
> Récupérez les valeurs dans VaultWarden et copiez-les dans les fichiers `*.env.local` correspondants :
> - Note `Owner .env.local` -> fichier `owner/.env.local`
> - Note `Tenant .env.local` -> fichier `tenantv3/.env.local`
> - Note `WWW .env.local` -> fichier `www/.env.local`
> - Note `Watermark .env.local` -> fichier `watermark/.env.local`
> 
> *Note (Projet Owner)* : Lors de sa connexion locale, Keycloak redirige parfois mal. Si le navigateur bloque après l'authentification, retourner manuellement sur `http://localhost:3000`.

---

## 5. Démarrer l'environnement de développement

Lancez tous les services front simultanément depuis la racine du monorepo.

```bash
pnpm --filter owner --filter tenantv3 --filter www --filter watermark dev
```
