# Article Template

Use [`article-template.html`](/Volumes/dev/neuroide.github.io/templates/article-template.html) as the page skeleton for any new site article.

## Required steps

1. Copy the HTML template into the target topic folder:
   `topics/<topic-slug>/<article-slug>.html`
2. Replace all `{{...}}` placeholders.
3. Keep the article body inside `<div class="article-body">...</div>`.
4. If the article uses equations, keep the MathJax scripts at the bottom of the page.
5. Add the article card to the relevant topic index page:
   `topics/<topic-slug>/index.html`
6. Add the article to [`data/search.json`](/Volumes/dev/neuroide.github.io/data/search.json) with:
   `title`, `url`, `topic`, `type`, `excerpt`, `keywords`
7. If the article should be featured globally, add it to [`index.html`](/Volumes/dev/neuroide.github.io/index.html).

## Asset paths

- Logos and profile images live under `/fig/`
- Content illustrations live under `/fig/images/`

## Example metadata

- `TOPIC`: `Robotics`
- `TYPE`: `Systems`
- `DOMAIN_SUBDOMAIN`: `Fleet Systems / Intralogistics`
- `TOPIC_SLUG`: `robotics`
- `MONTH_YEAR`: `March 2026`
- `NEXT_ARTICLE_URL`: `/topics/robotics/validation-stack.html`
- `NEXT_ARTICLE_LABEL`: `Robotics Software and Evaluation Stack`
