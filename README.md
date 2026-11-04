# البوليفارد — Boulevard World (Mexico zone)

Static mirror of https://maxick.grok.me prepared for GitHub Pages at `/boulevard/`.

- Live (intended): https://blvdworld-sa.github.io/boulevard/
- Festive Mexican restyle via `festive.css` + `festive.js` override layer (content unchanged).

## Publish

```bash
gh repo create blvdworld-sa/boulevard --public --source=. --remote=origin --push
gh api repos/blvdworld-sa/boulevard/pages -X POST -f 'source[branch]=main' -f 'source[path]=/'
```
