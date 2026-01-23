# 🎨 Focus Guide - Design System & Style Guide

Ce document décrit le système de design unifié pour Focus Guide.

## Table des matières

1. [Palette de couleurs](#palette-de-couleurs)
2. [Utilisation des variables CSS](#utilisation-des-variables-css)
3. [Classes utilitaires](#classes-utilitaires)
4. [Composants](#composants)
5. [Dark mode](#dark-mode)
6. [Exemples pratiques](#exemples-pratiques)

---

## Palette de couleurs

### Brand (Identité Focus Guide)

```css
--color-brand-primary: #D9FC00;    /* Chartreuse - couleur signature */
--color-brand-dark: #262626;       /* Texte principal */
--color-brand-light: #EDEAE9;      /* Fond clair */
```

### Grises (Hiérarchie et états)

```css
--color-gray-50: #F9F9F9;          /* Très clair */
--color-gray-100: #F3F3F3;         /* Clair */
--color-gray-200: #E5E5E5;         /* Bordures légères */
--color-gray-300: #D9D9D9;         /* Bordures */
--color-gray-400: #A0A0A0;         /* Texte secondaire */
--color-gray-500: #808080;         /* Texte muted */
--color-gray-600: #666666;         /* Texte moyen */
--color-gray-700: #4D4D4D;         /* Texte semi-bold */
--color-gray-800: #333333;         /* Texte très dark */
--color-gray-900: #1A1A1A;         /* Texte ultra-dark */
```

### Couleurs fonctionnelles

```css
/* Succès */
--color-success: #10B981;
--color-success-light: #D1FAE5;
--color-success-dark: #047857;

/* Erreur */
--color-error: #EF4444;
--color-error-light: #FEE2E2;
--color-error-dark: #DC2626;

/* Avertissement */
--color-warning: #F59E0B;
--color-warning-light: #FEF3C7;
--color-warning-dark: #D97706;

/* Info */
--color-info: #3B82F6;
--color-info-light: #DBEAFE;
--color-info-dark: #1D4ED8;
```

---

## Utilisation des variables CSS

### Variables disponibles

Toutes les variables CSS sont définies dans `src/app/globals.css` et organisées en catégories :

#### 1. Surfaces (Arrière-plans)

```css
--color-surface-primary: #FFFFFF;    /* Surface principale */
--color-surface-secondary: var(--color-gray-100);
--color-surface-tertiary: var(--color-gray-50);
--color-surface-inverse: var(--color-brand-dark);
```

#### 2. Texte (Hiérarchie)

```css
--color-text-primary: var(--color-brand-dark);      /* Principal */
--color-text-secondary: var(--color-gray-600);      /* Secondaire */
--color-text-tertiary: var(--color-gray-500);       /* Tertiaire */
--color-text-muted: var(--color-gray-400);          /* Muted */
--color-text-inverse: #FFFFFF;                      /* Inverse */
--color-text-brand: var(--color-brand-primary);     /* Brand */
```

#### 3. Bordures

```css
--color-border-primary: var(--color-gray-200);      /* Principale */
--color-border-secondary: var(--color-gray-300);    /* Secondaire */
--color-border-subtle: var(--color-gray-100);       /* Subtile */
--color-border-brand: var(--color-brand-primary);   /* Brand */
```

#### 4. Interactions

```css
--color-hover-brand: #C9F600;       /* Hover sur brand */
--color-hover-surface: var(--color-gray-100);
--color-hover-inverse: rgba(0, 0, 0, 0.04);

--color-focus-ring: var(--color-brand-primary);
--color-focus-ring-offset: #FFFFFF;

--color-active-brand: #B0DA00;      /* Active sur brand */
--color-active-surface: var(--color-gray-200);

--color-disabled-bg: var(--color-gray-100);
--color-disabled-text: var(--color-gray-400);
--color-disabled-border: var(--color-gray-200);
```

### Comment utiliser les variables CSS

**Option 1 : Directement dans les classes Tailwind**

```html
<!-- Texte -->
<p class="text-[color:var(--color-text-primary)]">Texte principal</p>
<p class="text-[color:var(--color-text-secondary)]">Texte secondaire</p>
<p class="text-[color:var(--color-text-muted)]">Texte muted</p>

<!-- Fond -->
<div class="bg-[color:var(--color-surface-primary)]">Fond principal</div>
<div class="bg-[color:var(--color-surface-secondary)]">Fond secondaire</div>

<!-- Bordure -->
<div class="border border-[color:var(--color-border-primary)]">Bordure</div>
```

**Option 2 : Utiliser les classes utilitaires (recommandé)**

```html
<!-- Classes de texte -->
<p class="text-primary">Texte principal</p>
<p class="text-secondary">Texte secondaire</p>
<p class="text-brand">Texte brand</p>

<!-- Classes de surface -->
<div class="bg-surface-primary">Fond principal</div>
<div class="bg-surface-secondary">Fond secondaire</div>

<!-- Classes de bordure -->
<div class="border border-primary">Bordure principale</div>
<div class="border border-brand">Bordure brand</div>
```

---

## Classes utilitaires

### Texte

```html
<p class="text-primary">Texte principal (dark)</p>
<p class="text-secondary">Texte secondaire (gray-600)</p>
<p class="text-tertiary">Texte tertiaire (gray-500)</p>
<p class="text-muted">Texte muted (gray-400)</p>
<p class="text-brand">Texte brand (chartreuse)</p>
```

### Surfaces

```html
<div class="bg-surface-primary">Fond blanc principal</div>
<div class="bg-surface-secondary">Fond gris secondaire</div>
<div class="bg-surface-tertiary">Fond très clair tertiaire</div>
```

### Bordures

```html
<div class="border border-primary">Bordure principale</div>
<div class="border border-secondary">Bordure secondaire</div>
<div class="border border-brand">Bordure brand</div>
```

### États

```html
<!-- Succès -->
<div class="bg-success-light">
  <p class="text-success">Succès !</p>
</div>

<!-- Erreur -->
<div class="bg-error-light">
  <p class="text-error">Erreur !</p>
</div>

<!-- Avertissement -->
<div class="bg-warning-light">
  <p class="text-warning">Attention !</p>
</div>

<!-- Info -->
<div class="bg-info-light">
  <p class="text-info">Information</p>
</div>
```

---

## Composants

### Boutons

```html
<!-- Brand button -->
<button class="btn-brand">Action primaire</button>

<!-- Secondary button -->
<button class="btn-secondary">Action secondaire</button>

<!-- Ghost button -->
<button class="btn-ghost">Action fantôme</button>
```

### Badges

```html
<span class="badge-success">Succès</span>
<span class="badge-error">Erreur</span>
<span class="badge-warning">Attention</span>
<span class="badge-info">Info</span>
```

### Input

```html
<input class="input-base" type="text" placeholder="Entrez du texte" />
```

### Card

```html
<div class="card-base">
  <h3 class="text-primary font-semibold">Titre de la card</h3>
  <p class="text-secondary">Contenu de la card</p>
</div>
```

### Divider

```html
<div class="divider-subtle"></div>
```

---

## Dark mode

Toutes les couleurs sont automatiquement adaptées en mode sombre. Aucune modification nécessaire dans le code !

### Variantes dark mode

Lorsque le mode sombre est activé (classe `.dark` sur `<html>`), les variables CSS se changent automatiquement :

```css
/* Light mode (par défaut) */
--color-surface-primary: #FFFFFF;
--color-text-primary: #262626;

/* Dark mode (classe .dark appliquée) */
.dark {
  --color-surface-primary: #1A1A1A;
  --color-text-primary: #FFFFFF;
}
```

Utilisez simplement les classes normales partout :

```html
<!-- Fonctionne en light ET dark mode -->
<div class="bg-surface-primary text-primary">
  Contenu intelligent pour tous les modes
</div>
```

---

## Exemples pratiques

### Exemple 1 : Card avec titre et contenu

```html
<div class="card-base">
  <h3 class="text-primary font-semibold mb-2">Titre important</h3>
  <p class="text-secondary mb-4">Description du contenu</p>
  <p class="text-muted text-sm">Note secondaire</p>
</div>
```

### Exemple 2 : Form input avec label

```html
<label class="text-primary font-semibold block mb-2">
  Votre nom
</label>
<input
  class="input-base w-full"
  type="text"
  placeholder="Entrez votre nom"
/>
```

### Exemple 3 : Notification de succès

```html
<div class="bg-success-light border border-[color:var(--color-success)] rounded-lg p-4">
  <p class="text-success font-semibold">✓ Action réussie !</p>
  <p class="text-[color:var(--color-success-dark)] text-sm">
    Votre changement a été enregistré
  </p>
</div>
```

### Exemple 4 : Bouton avec hover

```html
<button class="btn-brand hover:shadow-md transition-shadow">
  Cliquez-moi
</button>
```

### Exemple 5 : Navigation avec hiérarchie

```html
<nav class="bg-surface-primary border-b border-primary p-4">
  <h1 class="text-primary text-heading-2 font-bold">Focus Guide</h1>
  <p class="text-secondary">Gérez vos tâches efficacement</p>
</nav>
```

---

## Bonnes pratiques

### ✅ À FAIRE

1. **Utiliser les classes utilitaires plutôt que les variables brutes**
   ```html
   <!-- ✓ Bon -->
   <p class="text-primary">Texte</p>

   <!-- ✗ Moins bon -->
   <p class="text-[color:var(--color-text-primary)]">Texte</p>
   ```

2. **Préférer les variables plutôt que les couleurs en dur**
   ```html
   <!-- ✓ Bon -->
   <div class="bg-[color:var(--color-brand-primary)]"></div>

   <!-- ✗ Mauvais -->
   <div class="bg-[#D9FC00]"></div>
   ```

3. **Utiliser la hiérarchie des couleurs pour la clarté**
   ```html
   <!-- Titre principal -->
   <h1 class="text-primary font-bold text-heading-1">Titre</h1>

   <!-- Sous-titre -->
   <h2 class="text-secondary text-heading-3">Sous-titre</h2>

   <!-- Texte supplémentaire -->
   <p class="text-muted text-sm">Détails</p>
   ```

4. **Tester en dark mode lors de vos développements**
   ```html
   <!-- Le dark mode fonctionne automatiquement -->
   <div class="text-primary bg-surface-primary">
     Testé en light et dark mode
   </div>
   ```

### ❌ À ÉVITER

1. **Hardcoder des couleurs**
   ```html
   <!-- ✗ Ne pas faire -->
   <p class="text-gray-600 text-[#262626] text-blue-500">Texte</p>
   ```

2. **Mélanger variables et classes tailwind classiques**
   ```html
   <!-- ✗ Inconsistant -->
   <div class="bg-gray-100 text-[color:var(--color-text-primary)]"></div>
   ```

3. **Oublier les états fonctionnels (hover, focus, disabled)**
   ```html
   <!-- ✗ Pas d'interaction visuelle -->
   <button class="bg-[color:var(--color-brand-primary)]">Bouton</button>

   <!-- ✓ Correct -->
   <button class="btn-brand">Bouton</button>
   ```

---

## Mise à jour future

Pour ajouter de nouvelles couleurs ou modifier la palette :

1. **Modifier `src/app/globals.css`**
   - Ajouter les nouvelles variables CSS dans `:root`
   - Ajouter les variantes dark mode si nécessaire

2. **Ajouter les classes utilitaires**
   - Créer les classes pour faciliter l'utilisation
   - Documenter dans ce guide

3. **Mettre à jour tailwind.config.ts si besoin**
   - Ajouter les couleurs à la configuration Tailwind
   - Permettre l'utilisation via `bg-[nomcouleur]` etc.

---

**Maintenu par :** Focus Guide Team
**Dernière mise à jour :** 2026-01-23
**Version :** 1.0.0
