# البوليفارد — Boulevard World (منطقة المكسيك – منطقة التجارة الرائجة)

Static mirror of https://maxick.grok.me prepared for GitHub Pages at `/boulevard/`.

- Live: https://blvdworld-sa.github.io/boulevard/
- Premium BLVD-World-inspired restyle via `festive.css` + `festive.js`, with the Mexico zone renamed to **منطقة المكسيك – منطقة التجارة الرائجة** and investment-oriented merchant copy.

## Publish

```bash
gh repo create blvdworld-sa/boulevard --public --source=. --remote=origin --push
gh api repos/blvdworld-sa/boulevard/pages -X POST -f 'source[branch]=main' -f 'source[path]=/'
```
