# Guide Complet : Intégration SMTP Email - Explication Étape par Étape

Ce document explique en détail comment l'intégration SMTP email a été implémentée dans ce projet Vite + React.

---

## 📋 Vue d'Ensemble

L'intégration SMTP permet d'envoyer automatiquement des emails à `espaceauto92.info@gmail.com` lorsque les utilisateurs remplissent les formulaires de contact, de commande de pièces, ou de demande de compte professionnel sur le site web.

**Architecture :**

```
Formulaire Frontend → Netlify Function → Nodemailer → Serveur SMTP → Email reçu
```

**Avantages :**
- ✅ Pas de backend séparé à héberger
- ✅ Fonctions serverless sur Netlify (similaire aux API Routes Next.js)
- ✅ Emails HTML stylisés et professionnels
- ✅ Configuration via variables d'environnement

---

## 🔧 Étape 1 : Installation des Dépendances

### 1.1 Installation de Nodemailer

Nodemailer est une bibliothèque Node.js qui permet d'envoyer des emails via SMTP.

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer @netlify/functions
```

**Fichier modifié :** `package.json`

**Résultat :**
- `nodemailer` : Bibliothèque principale pour l'envoi d'emails
- `@types/nodemailer` : Types TypeScript pour une meilleure autocomplétion
- `@netlify/functions` : Types pour les fonctions serverless Netlify

---

## 🔐 Étape 2 : Configuration des Variables d'Environnement

### 2.1 Création du fichier `.env.local`

Un fichier `.env.local` doit être créé à la racine du projet pour stocker les informations SMTP de manière sécurisée.

**Variables requises :**

```env
SMTP_HOST=smtp.gmail.com          # Adresse du serveur SMTP
SMTP_PORT=587                     # Port SMTP (587 pour TLS, 465 pour SSL)
SMTP_SECURE=false                 # true pour SSL (port 465), false pour TLS (port 587)
SMTP_USER=espaceauto92.info@gmail.com   # Email utilisé pour l'authentification SMTP
SMTP_PASSWORD=cuwm avyu hmml alit  # Mot de passe d'application Gmail
SMTP_FROM=espaceauto92.info@gmail.com     # Adresse email de l'expéditeur
```

**Important :**
- ⚠️ Le fichier `.env.local` est dans `.gitignore` et ne sera jamais commité sur Git
- 🔒 Ces informations sont sensibles et doivent rester privées
- 📧 Pour Gmail, utilisez un **mot de passe d'application** (pas votre mot de passe principal)
- 🌐 Pour la production sur Netlify, ajoutez ces variables dans **Netlify Dashboard → Site settings → Environment variables**

### 2.2 Configuration sur Netlify

1. Allez sur [Netlify Dashboard](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings → Environment variables**
4. Ajoutez toutes les variables SMTP :
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM`

---

## 🛠️ Étape 3 : Création des Fonctions Serverless Netlify

Netlify Functions fonctionnent comme les API Routes de Next.js - elles permettent de créer des endpoints backend sans héberger un serveur séparé.

### 3.1 Fonction `/netlify/functions/contact` (Formulaire principal)

**Fichier créé :** `netlify/functions/contact.ts`

**Fonctionnalités :**
- Gère les formulaires de contact ET de devis/compte professionnel
- Envoie des emails via SMTP avec template HTML stylisé
- Supporte tous les types de formulaires (contact, commande pièces, compte pro)

**Structure du code :**

```typescript
// 1. Import des dépendances
import type { Handler } from '@netlify/functions'
import nodemailer from 'nodemailer'

// 2. Configuration SMTP depuis les variables d'environnement
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}

// 3. Fonction handler pour Netlify
export const handler: Handler = async (event, context) => {
  // 4. Gestion CORS
  if (event.httpMethod === 'OPTIONS') { ... }

  // 5. Parse des données du formulaire
  const body = JSON.parse(event.body || '{}')
  const { type = 'contact', subject, ...formData } = body

  // 6. Création du transporteur SMTP
  const transporter = nodemailer.createTransport(SMTP_CONFIG)

  // 7. Génération du template HTML
  const htmlContent = createEmailHTML(formData, type)

  // 8. Envoi de l'email
  await transporter.sendMail({
    from: `"Espace Auto 92" <${SMTP_CONFIG.auth.user}>`,
    to: RECIPIENT_EMAIL,
    subject: emailSubject,
    html: htmlContent,
  })

  // 9. Retour de la réponse
  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}
```

**Points clés :**

1. **Configuration du transporteur SMTP** (lignes 5-12)
   - Lit les variables d'environnement
   - Configure la connexion au serveur SMTP
   - Authentifie avec les identifiants fournis

2. **Template HTML de l'email** (fonction `createEmailHTML`)
   - Email HTML stylisé avec des couleurs et une mise en page professionnelle
   - Sections pour : Informations du contact, Détails du véhicule/service, Message
   - Design responsive pour les clients email
   - Couleurs de marque (rouge #dc2626)

3. **Envoi de l'email** (lignes 140-146)
   - Utilise `transporter.sendMail()` pour envoyer
   - Définit l'expéditeur comme "Espace Auto 92"
   - Destinataire : `espaceauto92.info@gmail.com`
   - Sujet dynamique selon le type de formulaire

4. **Gestion des erreurs** (try/catch)
   - Try/catch pour capturer les erreurs
   - Retourne un message d'erreur approprié avec code HTTP 500

### 3.2 Fonction `/netlify/functions/send-email` (Formulaires simples)

**Fichier créé :** `netlify/functions/send-email.ts`

**Utilisation :**
- Version simplifiée pour les formulaires courts
- Utilisé pour les modals de contact rapides

**Différences avec `/contact` :**
- Moins de champs (name, email, phone, message, service)
- Template HTML plus simple
- Sujet fixe : "DEMANDE DE CONTACT"

---

## 🎨 Étape 4 : Intégration dans les Formulaires Frontend

### 4.1 Service Email (`src/lib/emailService.ts`)

**Fonction principale :**

```typescript
export async function sendEmail(
  subject: string,
  formData: Record<string, any>,
  useSimpleForm: boolean = false
): Promise<void> {
  if (useSimpleForm) {
    await sendViaEmailAPI(subject, formData)
  } else {
    const type = formData.companyName || formData.siret ? 'devis' : 'contact'
    await sendViaContactAPI(subject, formData, type)
  }
}
```

**Flux de données :**

```
Utilisateur remplit le formulaire
    ↓
Clic sur "Envoyer"
    ↓
handleSubmit() est appelé
    ↓
sendEmail(subject, formData) est appelé
    ↓
fetch('/.netlify/functions/contact', { method: 'POST', body: JSON.stringify(formData) })
    ↓
Netlify Function reçoit les données
    ↓
Email envoyé via SMTP
    ↓
Réponse JSON retournée
    ↓
Message de succès/erreur affiché à l'utilisateur
```

### 4.2 Page Contact (`/contact`)

**Fichier :** `src/pages/ContactPage.tsx`

**Implémentation :**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const emailSubject = formData.subject || 'Envoyez-nous un message'
    await sendEmail(emailSubject, formData)
    
    // Succès
    alert('Merci pour votre message! Nous vous contacterons rapidement.')
    setFormData({ name: '', email: '', ... }) // Réinitialiser
  } catch (error) {
    // Erreur
    alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 4.3 Formulaire de Commande de Pièces

**Fichier :** `src/components/sections/PartsOrderingForm.tsx`

**Utilisation :**
- Sujet : "Commandez Votre Pièce"
- Type : 'contact' (détecté automatiquement)
- Inclut : informations véhicule, pièces, contact

### 4.4 Formulaire Compte Professionnel

**Fichier :** `src/pages/ProPage.tsx`

**Utilisation :**
- Sujet : "Demande d'ouverture de compte professionnel"
- Type : 'devis' (détecté automatiquement via companyName/siret)
- Inclut : informations entreprise, SIRET, adresse

---

## 📧 Étape 5 : Structure de l'Email Envoyé

### 5.1 Template HTML

L'email est un document HTML complet avec :

1. **Header** (lignes 70-76)
   - Fond rouge dégradé (#dc2626 → #991b1b)
   - Titre : "DEMANDE DE CONTACT" ou "Nouvelle demande de devis de [Nom]"

2. **Section Informations du Contact** (lignes 82-95)
   - Fond gris clair avec bordure rouge
   - Affiche : Prénom, Nom, Entreprise, Email, Téléphone, Adresse, SIRET
   - Liens cliquables pour email et téléphone

3. **Section Détails du Véhicule/Service** (lignes 97-108)
   - Fond bleu clair avec bordure bleue
   - Affiche : Service, Groupe de pièce, Année, Marque, Modèle, Matricule
   - Badge d'urgence si applicable

4. **Section Message** (lignes 110-118)
   - Fond rose clair avec bordure rouge
   - Affiche le message de l'utilisateur
   - Préserve les sauts de ligne avec `white-space: pre-wrap`

5. **Footer** (lignes 123-130)
   - Informations sur l'origine du message
   - Branding Espace Auto 92
   - Adresse : 426 Avenue de la République, 92000 Nanterre

### 5.2 Mapping des Services

Les valeurs de service sont mappées vers des noms lisibles :

```typescript
const serviceNames: { [key: string]: string } = {
  'Moteur': 'Moteur',
  'Transmission': 'Transmission',
  'Freinage': 'Freinage',
  // ... etc
}
```

---

## 🔄 Étape 6 : Flux Complet d'Envoi d'Email

### Scénario : Utilisateur remplit le formulaire de contact

1. **Frontend (Client)**
   ```
   Utilisateur saisit ses informations
   → Clic sur "Envoyer le Message"
   → handleSubmit() exécuté
   → sendEmail(subject, formData) appelé
   → fetch('/.netlify/functions/contact', { method: 'POST', body: formData })
   ```

2. **Netlify Function (Serveur)**
   ```
   Fonction serverless reçoit la requête POST
   → Parse le JSON body
   → Crée le transporteur Nodemailer avec les credentials SMTP
   → Génère le template HTML de l'email
   → Envoie l'email via transporter.sendMail()
   ```

3. **SMTP Server**
   ```
   Nodemailer se connecte au serveur SMTP (smtp.gmail.com)
   → Authentifie avec SMTP_USER et SMTP_PASSWORD
   → Envoie l'email à espaceauto92.info@gmail.com
   ```

4. **Réponse**
   ```
   Si succès : { success: true, messageId: '...', message: 'Email envoyé avec succès' }
   Si erreur : { success: false, error: 'Erreur...' }
   ```

5. **Frontend (Client)**
   ```
   Reçoit la réponse JSON
   → Affiche un message de succès ou d'erreur
   → Réinitialise le formulaire si succès
   ```

---

## 🎯 Étape 7 : Gestion des Erreurs

### 7.1 Erreurs Possibles

1. **Erreur de connexion SMTP**
   - Vérifier `SMTP_HOST` et `SMTP_PORT`
   - Vérifier la connexion internet

2. **Erreur d'authentification**
   - Vérifier `SMTP_USER` et `SMTP_PASSWORD`
   - Pour Gmail, utiliser un mot de passe d'application
   - Vérifier que "Accès moins sécurisé" est activé si nécessaire

3. **Erreur de validation**
   - Vérifier que tous les champs requis sont remplis
   - Vérifier le format de l'email

### 7.2 Gestion dans le Code

```typescript
try {
  // Code d'envoi d'email
  await transporter.sendMail({...})
  return NextResponse.json({ success: true })
} catch (error: any) {
  console.error('Error sending email:', error)
  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email: ' + error.message
    })
  }
}
```

---

## 📊 Étape 8 : Types de Formulaires Supportés

### 8.1 Formulaire de Contact (`type: 'contact'`)

**Utilisé dans :**
- Page `/contact`
- Formulaire de commande de pièces

**Champs :**
- name/fullName, email, phone, subject, message
- year, make, model, matricule (pour commande pièces)
- partGroup, partSubGroup (pour commande pièces)

**Sujet email :** "DEMANDE DE CONTACT" ou sujet personnalisé

### 8.2 Formulaire de Devis/Compte Pro (`type: 'devis'`)

**Utilisé dans :**
- Page `/pro` (demande compte professionnel)

**Champs :**
- companyName, siret, email, phone, address, city, postalCode, additionalInfo

**Sujet email :** "Demande d'ouverture de compte professionnel"

**Détection automatique :** Si `companyName` ou `siret` est présent, type = 'devis'

---

## 🔒 Étape 9 : Sécurité

### 9.1 Protection des Credentials

- ✅ Variables d'environnement dans `.env.local`
- ✅ `.env.local` dans `.gitignore`
- ✅ Pas de credentials hardcodés dans le code
- ✅ Variables d'environnement configurées sur Netlify

### 9.2 Validation des Données

- ✅ Validation côté client (required fields)
- ✅ Validation côté serveur (format email, etc.)
- ✅ Protection contre l'injection HTML (échappement avec `escapeHtml()`)

### 9.3 CORS

- ✅ Headers CORS configurés dans les fonctions Netlify
- ✅ Support des requêtes OPTIONS (preflight)

---

## 📝 Résumé des Fichiers Créés/Modifiés

### Fichiers Créés :

1. ✅ `netlify/functions/contact.ts` - Fonction principale pour formulaires complets
2. ✅ `netlify/functions/send-email.ts` - Fonction pour formulaires simples
3. ✅ `EMAIL_SETUP.md` - Documentation de configuration

### Fichiers Modifiés :

1. ✅ `package.json` - Ajout de nodemailer et @netlify/functions
2. ✅ `src/lib/emailService.ts` - Intégration des fonctions Netlify
3. ✅ `src/pages/ContactPage.tsx` - Utilisation du service email
4. ✅ `src/pages/ProPage.tsx` - Utilisation du service email
5. ✅ `src/components/sections/PartsOrderingForm.tsx` - Utilisation du service email

---

## 🚀 Test de l'Intégration

### Pour tester localement :

1. **Configurer `.env.local`** avec vos credentials SMTP
2. **Installer les dépendances** : `npm install`
3. **Démarrer Netlify Dev** : `netlify dev` (ou `npm run dev` pour le frontend seulement)
4. **Remplir un formulaire** sur `/contact`, `/pro`, ou la page d'accueil
5. **Vérifier** que l'email arrive à `espaceauto92.info@gmail.com`

### Pour tester en production :

1. **Configurer les variables d'environnement** sur Netlify Dashboard
2. **Déployer** le site sur Netlify
3. **Tester** les formulaires sur le site en production
4. **Vérifier** les logs dans Netlify Functions pour voir les erreurs éventuelles

### Vérifications :

- ✅ Email reçu dans la boîte de réception
- ✅ Format HTML correct
- ✅ Toutes les informations présentes
- ✅ Liens email/téléphone fonctionnels
- ✅ Message de succès affiché sur le site
- ✅ Pas d'ouverture d'Outlook ou autre client email

---

## 🎓 Concepts Clés Appris

1. **Nodemailer** : Bibliothèque Node.js pour l'envoi d'emails
2. **Netlify Functions** : Fonctions serverless (similaires aux API Routes Next.js)
3. **Variables d'environnement** : Stockage sécurisé des credentials
4. **SMTP** : Protocole pour l'envoi d'emails
5. **Templates HTML** : Création d'emails HTML stylisés
6. **Gestion d'erreurs** : Try/catch et messages d'erreur appropriés

---

## 📚 Ressources

- [Documentation Nodemailer](https://nodemailer.com/about/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

**C'est tout ! L'intégration SMTP est maintenant complète et fonctionnelle.** 🎉

Les emails sont envoyés directement via SMTP sans ouvrir de client email, et tout fonctionne sans backend séparé grâce aux fonctions serverless Netlify.
