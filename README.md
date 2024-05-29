# Cote 780

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Utiliser les textes du Google Sheets (utilisable côté front uniquement)

1. Ajouter un fichier .env à la racine avec :
```sh
I18N_SPREADSHEET_ID = '<LE_BON_ID_A_DEMANDER_A_EVAN>'
```

2. Sur le fichier .vue où vous voulez l'utiliser, ajouter ces 2 lignes en haut de la fonction setup :
```js
import { useI18n } from "vue-i18n";
const { t } = useI18n();
```

3. À l'endroit où vous voulez utiliser un texte, utiliser l'id du texte en question, par exemple si le texte est dans la catégorie "intro" et a pour nom "start" :
```html
<h1>{{ t("intro.start") }}</h1>
```