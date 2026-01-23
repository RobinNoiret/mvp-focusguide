# 📋 Design System - Référence Complète des Classes

Ce document fournit un **mapping complet** de tous les noms de classes CSS utilisés dans le TypeScript et leur définition correspondante dans `global.css`.

---

## 📊 Table des Matières

1. [Classes Utilitaires de Texte](#classes-utilitaires-de-texte)
2. [Classes Utilitaires de Surface](#classes-utilitaires-de-surface)
3. [Classes Utilitaires de Bordure](#classes-utilitaires-de-bordure)
4. [Classes Utilitaires d'États](#classes-utilitaires-détats)
5. [Classes de Boutons](#classes-de-boutons)
6. [Classes de Badges](#classes-de-badges)
7. [Classes d'Inputs](#classes-dinputs)
8. [Classes de Cards](#classes-de-cards)
9. [Classes de Modales](#classes-de-modales)
10. [Classes de Navigation & Sidebar](#classes-de-navigation--sidebar)
11. [Classes Kanban](#classes-kanban)
12. [Classes de Formulaires](#classes-de-formulaires)
13. [Classes Spéciales](#classes-spéciales)
14. [Classes d'Avatars](#classes-davatars)
15. [Classes d'Animations](#classes-danimations)

---

## 🎨 Classes Utilitaires de Texte

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `text-primary` | `color: var(--color-text-primary)` | Texte principal (noir par défaut) |
| `text-secondary` | `color: var(--color-text-secondary)` | Texte secondaire (gris-600) |
| `text-tertiary` | `color: var(--color-text-tertiary)` | Texte tertiaire (gris-500) |
| `text-muted` | `color: var(--color-text-muted)` | Texte désactivé/faible (gris-400) |
| `text-brand` | `color: var(--color-text-brand)` | Texte brand (chartreuse - rouge actuellement) |

**Exemple d'usage:**
```tsx
<p className="text-primary">Texte principal</p>
<p className="text-secondary">Texte secondaire</p>
<p className="text-muted">Texte discret</p>
```

---

## 🎨 Classes Utilitaires de Surface

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `bg-surface-primary` | `background: var(--color-surface-primary)` | Fond blanc principal |
| `bg-surface-secondary` | `background: var(--color-surface-secondary)` | Fond gris clair secondaire |
| `bg-surface-tertiary` | `background: var(--color-surface-tertiary)` | Fond très léger tertiaire |

**Exemple d'usage:**
```tsx
<div className="bg-surface-primary">Contenu principal</div>
<div className="bg-surface-secondary">Section secondaire</div>
```

---

## 🎨 Classes Utilitaires de Bordure

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `border-primary` | `border-color: var(--color-border-primary)` | Bordure principale (gris-200) |
| `border-secondary` | `border-color: var(--color-border-secondary)` | Bordure secondaire (gris-300) |
| `border-brand` | `border-color: var(--color-border-brand)` | Bordure brand (chartreuse/rouge) |

**Exemple d'usage:**
```tsx
<div className="border border-primary">Bordure principale</div>
<div className="border border-brand">Bordure brand</div>
```

---

## 🎨 Classes Utilitaires d'États

### Succès
| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `bg-success-light` | `background: var(--color-success-light)` | Fond vert clair pour succès |
| `text-success` | `color: var(--color-success)` | Texte vert pour succès |

### Erreur
| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `bg-error-light` | `background: var(--color-error-light)` | Fond rouge clair pour erreur |
| `text-error` | `color: var(--color-error)` | Texte rouge pour erreur |

### Avertissement
| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `bg-warning-light` | `background: var(--color-warning-light)` | Fond orange clair |
| `text-warning` | `color: var(--color-warning)` | Texte orange |

### Info
| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `bg-info-light` | `background: var(--color-info-light)` | Fond bleu clair |
| `text-info` | `color: var(--color-info)` | Texte bleu |

**Exemple d'usage:**
```tsx
<div className="bg-success-light">
  <p className="text-success">✓ Succès !</p>
</div>
```

---

## 🔘 Classes de Boutons

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `btn-brand` | Fond chartreuse + texte dark + hover | Bouton d'action primaire |
| `btn-secondary` | Fond gris + bordure + texte dark | Bouton d'action secondaire |
| `btn-ghost` | Texte dark + hover transparent | Bouton sans fond |
| `btn-danger` | Fond rouge + texte blanc | Bouton d'action dangereuse |
| `btn-success` | Fond vert + texte blanc | Bouton de confirmation |

**Détails CSS:**
```css
.btn-brand {
  @apply bg-[color:var(--color-brand-primary)]
         text-[color:var(--color-brand-dark)]
         hover:bg-[color:var(--color-hover-brand)]
         transition-colors rounded-lg px-4 py-2 font-semibold;
}
```

**Exemple d'usage:**
```tsx
<button className="btn-brand">Action primaire</button>
<button className="btn-secondary">Action secondaire</button>
<button className="btn-danger">Supprimer</button>
```

---

## 🏷️ Classes de Badges

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `badge-success` | Fond vert clair + texte vert foncé | Badge de succès |
| `badge-error` | Fond rouge clair + texte rouge foncé | Badge d'erreur |
| `badge-warning` | Fond orange clair + texte orange foncé | Badge d'avertissement |
| `badge-info` | Fond bleu clair + texte bleu foncé | Badge d'information |
| `badge-neutral` | Fond gris + texte gris | Badge neutre |

**Détails CSS:**
```css
.badge-success {
  @apply bg-[color:var(--color-success-light)]
         text-[color:var(--color-success-dark)]
         px-3 py-1 rounded-full text-xs font-medium;
}
```

**Exemple d'usage:**
```tsx
<span className="badge-success">En cours</span>
<span className="badge-error">Erreur</span>
```

---

## 📝 Classes d'Inputs

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `input-base` | Fond blanc + bordure + focus ring | Input standard |
| `input-sm` | Hauteur 8px + padding réduit | Input petit |
| `input-lg` | Hauteur 12px + padding augmenté | Input grand |
| `textarea-base` | Comme input-base + resize-none | Textarea standard |
| `input-error` | Bordure rouge + ring rouge | Input en erreur |
| `input-success` | Bordure verte + ring verte | Input validé |
| `input-disabled` | Fond gris + texte gris + disabled | Input désactivé |

**Détails CSS:**
```css
.input-base {
  @apply bg-[color:var(--color-surface-primary)]
         text-[color:var(--color-text-primary)]
         border border-[color:var(--color-border-primary)]
         rounded-lg px-4 py-2
         placeholder:text-[color:var(--color-text-muted)]
         focus:outline-none focus:ring-2 focus:ring-[color:var(--color-focus-ring)]
         focus:border-transparent transition-colors;
}
```

**Exemple d'usage:**
```tsx
<input className="input-base" type="text" placeholder="Entrez..." />
<textarea className="textarea-base"></textarea>
<input className="input-base input-error" />
```

---

## 🃏 Classes de Cards

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `card-base` | Fond blanc + bordure + padding | Card standard |
| `card-elevated` | Fond blanc + bordure subtile + shadow | Card avec ombre |
| `card-header` | Flex + bordure inférieure | En-tête de card |
| `card-title` | Heading-3 bold + texte primary | Titre de card |
| `card-subtitle` | Body-sm + texte secondary | Sous-titre |
| `card-content` | Texte primary | Contenu principal |
| `card-footer` | Flex + bordure supérieure | Pied de card |
| `card-hover` | Shadow hover + cursor pointer | Card interactive |

**Détails CSS:**
```css
.card-base {
  @apply bg-[color:var(--color-surface-primary)]
         border border-[color:var(--color-border-primary)]
         rounded-lg p-4 transition-all;
}
```

**Exemple d'usage:**
```tsx
<div className="card-base">
  <div className="card-header">
    <h3 className="card-title">Titre</h3>
  </div>
  <div className="card-content">Contenu</div>
  <div className="card-footer">
    <button className="btn-brand">Action</button>
  </div>
</div>
```

---

## 🪟 Classes de Modales

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `modal-overlay` | Position fixe + overlay noir/50 | Overlay semi-transparent |
| `modal-container` | Fond blanc + border + shadow | Conteneur de modale |
| `modal-header` | Flex + bordure inférieure | En-tête de modale |
| `modal-title` | Heading-2 bold + texte primary | Titre de modale |
| `modal-close` | Bouton fermeture stylisé | Bouton fermer |
| `modal-body` | Padding + space-y-4 | Contenu de modale |
| `modal-footer` | Flex end + gap-3 + bordure sup | Pied de modale |

**Détails CSS:**
```css
.modal-overlay {
  @apply fixed inset-0 z-50 bg-black/50 flex items-center justify-center;
}

.modal-container {
  @apply relative bg-[color:var(--color-surface-primary)]
         rounded-lg shadow-xl w-full max-w-md mx-4
         border border-[color:var(--color-border-primary)];
}
```

**Exemple d'usage:**
```tsx
<div className="modal-overlay">
  <div className="modal-container">
    <div className="modal-header">
      <h2 className="modal-title">Titre</h2>
      <button className="modal-close">×</button>
    </div>
    <div className="modal-body">
      {/* Contenu */}
    </div>
    <div className="modal-footer">
      <button className="btn-ghost">Annuler</button>
      <button className="btn-brand">Confirmer</button>
    </div>
  </div>
</div>
```

---

## 🧭 Classes de Navigation & Sidebar

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `sidebar-container` | Position fixed left + flex col + border right | Conteneur sidebar |
| `sidebar-header` | Flex center + border bottom + padding | En-tête sidebar |
| `sidebar-logo` | Text-lg bold + texte primary | Logo sidebar |
| `nav-item` | Flex gap-3 + padding + hover | Item navigation |
| `nav-item-active` | Fond brand + bold + texte dark | Item actif |
| `nav-item-disabled` | Texte muted + opacity 50 + no hover | Item désactivé |
| `nav-icon` | h-5 w-5 flex-shrink-0 | Icône de navigation |

**Détails CSS:**
```css
.sidebar-container {
  @apply fixed left-0 top-0 z-30 flex h-screen flex-col
         border-r border-[color:var(--color-border-primary)]
         bg-[color:var(--color-surface-primary)] transition-all duration-300;
}

.nav-item {
  @apply flex items-center gap-3 rounded-lg px-3 py-3 transition-colors
         text-[color:var(--color-text-primary)]
         hover:bg-[color:var(--color-hover-surface)];
}

.nav-item-active {
  @apply bg-[color:var(--color-brand-primary)] font-semibold
         text-[color:var(--color-brand-dark)]
         hover:bg-[color:var(--color-hover-brand)];
}
```

**Exemple d'usage (from Sidebar.tsx):**
```tsx
<aside className="sidebar-container">
  <div className="sidebar-header">
    <Target className="h-6 w-6 text-brand" />
    <span className="sidebar-logo">Focus Guide</span>
  </div>

  <nav>
    <ul>
      <li>
        <Link
          href="/today"
          className={cn(
            'nav-item',
            isActive && 'nav-item-active'
          )}
        >
          <Home className="nav-icon" />
          <span>Today</span>
        </Link>
      </li>

      <li>
        <span className={cn('nav-item', 'nav-item-disabled')}>
          <Calendar className="nav-icon" />
          <span>Calendrier</span>
        </span>
      </li>
    </ul>
  </nav>
</aside>
```

---

## 📊 Classes Kanban

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `kanban-board` | Flex gap-4 + overflow-x auto | Conteneur kanban |
| `kanban-column` | Flex col + border + min-w-[280px] | Colonne kanban |
| `kanban-column-header` | Flex justify-between + border bottom | En-tête colonne |
| `kanban-column-title` | Font semibold + texte primary | Titre colonne |
| `kanban-column-body` | Flex-1 + overflow-y + space-y-2 | Contenu colonne |
| `kanban-column-over` | Ring brand + bg brand/5 | Colonne au survol (drag) |
| `kanban-column-invalid` | Ring error + bg error/5 | Colonne en erreur (drop invalide) |
| `kanban-task` | Flex col + border + padding + shadow | Tâche/carte kanban |
| `kanban-task-title` | Font medium + texte primary | Titre tâche |
| `kanban-task-meta` | Text-xs + texte secondary + mt-2 | Métadonnées tâche |

**Détails CSS:**
```css
.kanban-board {
  @apply flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory;
}

.kanban-column {
  @apply flex min-w-[280px] flex-col rounded-lg
         border border-[color:var(--color-border-primary)]
         bg-[color:var(--color-surface-primary)] shadow-sm transition-all;
}

.kanban-task {
  @apply bg-[color:var(--color-surface-primary)]
         border border-[color:var(--color-border-primary)]
         rounded-md p-3 shadow-sm hover:shadow-md
         transition-all cursor-grab active:cursor-grabbing;
}
```

**Exemple d'usage (from KanbanBoard.tsx):**
```tsx
<div className="kanban-board">
  <div className={cn('kanban-column', dragOverColId === column.id && 'kanban-column-over')}>
    <div className="kanban-column-header">
      <h3 className="kanban-column-title">{column.name}</h3>
    </div>
    <div className="kanban-column-body">
      {tasks.map(task => (
        <div key={task.id} className="kanban-task">
          <h4 className="kanban-task-title">{task.name}</h4>
          <p className="kanban-task-meta">Projet: {task.projectName}</p>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## 📋 Classes de Formulaires

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `form-group` | space-y-2 | Groupe de formulaire |
| `form-label` | block font-medium + texte primary | Label formulaire |
| `form-label-required` | Ajoute `*` rouge après | Label requis |
| `form-hint` | Text-xs + texte secondary | Indication/aide |
| `form-error` | Text-xs + texte error + flex gap-1 | Message d'erreur |
| `form-success` | Text-xs + texte success + flex gap-1 | Message de succès |

**Détails CSS:**
```css
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-[color:var(--color-text-primary)];
}

.form-label-required::after {
  @apply content-['*'] text-[color:var(--color-error)] ml-1;
}

.form-error {
  @apply text-xs text-[color:var(--color-error)] mt-1 flex items-center gap-1;
}
```

**Exemple d'usage:**
```tsx
<div className="form-group">
  <label className="form-label form-label-required">
    Nom de la tâche
  </label>
  <input className="input-base w-full" type="text" />
  {error && (
    <div className="form-error">
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  )}
  <p className="form-hint">Max 100 caractères</p>
</div>
```

---

## 🎁 Classes Spéciales

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `empty-state` | Flex center + py-12 + text-center | État vide |
| `empty-state-icon` | h-12 w-12 + texte muted | Icône empty state |
| `empty-state-title` | Font medium + texte secondary | Titre empty state |
| `empty-state-description` | Text-sm + texte muted | Description empty state |
| `skeleton` | Animate-pulse + bg secondary | Placeholder loading |
| `skeleton-text` | h-4 + bg secondary + rounded | Placeholder texte |
| `skeleton-circle` | h-10 w-10 + rounded-full | Placeholder avatar |
| `divider-subtle` | border-b + bordure subtle | Séparateur subtil |
| `divider-primary` | border-b + bordure primary | Séparateur principal |
| `divider-brand` | border-b + bordure brand | Séparateur brand |
| `divider-vertical` | border-l + bordure primary | Séparateur vertical |

**Exemple d'usage:**
```tsx
{tasks.length === 0 && (
  <div className="empty-state">
    <ListTodo className="empty-state-icon" />
    <h3 className="empty-state-title">Aucune tâche</h3>
    <p className="empty-state-description">Créez votre première tâche</p>
  </div>
)}

<div className="divider-primary my-4"></div>

{/* Loading state */}
<div className="space-y-2">
  <div className="skeleton-text"></div>
  <div className="skeleton-text"></div>
</div>
```

---

## 👤 Classes d'Avatars

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `avatar` | Inline-flex + rounded-full + font-semibold | Avatar de base |
| `avatar-xs` | h-6 w-6 text-xs | Avatar très petit |
| `avatar-sm` | h-8 w-8 text-sm | Avatar petit |
| `avatar-md` | h-10 w-10 text-base | Avatar moyen |
| `avatar-lg` | h-12 w-12 text-lg | Avatar grand |
| `avatar-brand` | Fond brand + texte dark | Avatar brand |
| `avatar-neutral` | Fond gris + texte secondary | Avatar neutre |

**Détails CSS:**
```css
.avatar-md {
  @apply h-10 w-10 text-base;
}

.avatar-brand {
  @apply bg-[color:var(--color-brand-primary)]
         text-[color:var(--color-brand-dark)];
}
```

**Exemple d'usage (from Sidebar.tsx):**
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full avatar-md avatar-brand">
  {getInitials(user?.name)}
</div>
```

---

## 🎬 Classes d'Animations

| Classe TypeScript | CSS Générée | Cas d'Usage |
|---|---|---|
| `transition-fast` | transition-all duration-150 | Transition rapide (150ms) |
| `transition-normal` | transition-all duration-300 | Transition normale (300ms) |
| `transition-slow` | transition-all duration-500 | Transition lente (500ms) |
| `hover-lift` | hover:-translate-y-1 | Effet de levée au hover |
| `hover-glow` | hover:shadow-lg glow brand | Effet de luminescence |
| `focus-visible-brand` | focus ring brand | Focus visible stylisé |

**Exemple d'usage:**
```tsx
<button className="btn-brand transition-normal hover-lift">
  Action
</button>

<div className="card-base transition-fast hover:shadow-md">
  Contenu
</div>
```

---

## 🔍 Guide Rapide de Refactoring

### Avant (Hardcoded)
```tsx
<div className="fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-[#E5E5E5] bg-white">
  <div className="flex items-center gap-3 border-b border-[#E5E5E5] p-4">
    <span className="text-lg font-bold text-[#262626]">Focus Guide</span>
  </div>
  <nav className="flex-1 p-3">
    <Link
      href="/today"
      className="flex items-center gap-3 rounded-lg px-3 py-3 bg-[#D9FC00] text-[#262626] font-semibold"
    >
      <Home className="h-5 w-5" />
      Today
    </Link>
  </nav>
</div>
```

### Après (Design System)
```tsx
<aside className="sidebar-container">
  <div className="sidebar-header">
    <span className="sidebar-logo">Focus Guide</span>
  </div>
  <nav>
    <Link
      href="/today"
      className={cn('nav-item', isActive && 'nav-item-active')}
    >
      <Home className="nav-icon" />
      Today
    </Link>
  </nav>
</aside>
```

**Avantages:**
- ✅ Classes réutilisables
- ✅ Cohérence garantie
- ✅ Changement centralisé dans `global.css`
- ✅ Dark mode automatique
- ✅ Maintenance simplifiée

---

## 🎯 Points Clés à Retenir

1. **Tous les styles sont dans `global.css`** - Aucun style hardcoded Tailwind
2. **Variables CSS** - Tous les couleurs utilisent `var(--color-*)`
3. **Classes composées** - Combinez classes pour des variations (ex: `avatar-md avatar-brand`)
4. **Utiliser `cn()` helper** - Pour les classes conditionnelles avec `classnames`
5. **Dark mode automatique** - Aucun code spécial requis, les variables changent dans `.dark`

---

**Créé:** 2026-01-23
**Version:** 1.0.0
**Maintenu par:** Focus Guide Team
