# On-Page SEO Audit: https://donate.65ombr.online/

**Primary target query:** допомога ЗСУ  
**Secondary queries:** 65 ОМБр; задонатити на ЗСУ; модернізація важкого дрона  
**Page role:** благодійний конверсійний лендинг  
**Audit date:** 2026-11-18  
**Auditor:** Codex

---

## Summary

Страница доступна по HTTPS, возвращает `200 OK`, разрешена для индексации, содержит один H1, корректный `lang="uk"`, синхронизированный FAQ JSON-LD и рабочие локальные ссылки. Главные проблемы — отсутствие canonical, sitemap и robots, доступность дубля `/index.html`, слабый H1 для целевого запроса и перегруженные title/meta. Публичный поиск не показал результатов по домену; это не доказательство отсутствия в индексе, окончательная проверка возможна только через Google Search Console.

**Overall score:** Needs work

| Dimension | Score | One-line note |
|---|---|---|
| Title tag | Needs work | Целевой запрос стоит в начале, но title длинный — 66 символов |
| Meta description | Needs work | На live 165 символов, в PR 180; текст может обрезаться |
| Header structure | Needs work | H1 один, но это слоган без запросов «допомога ЗСУ» и «65 ОМБр» |
| Body content | Pass | Цель, получатель, причина и способ помощи раскрыты понятно |
| Internal links | Needs work | Ссылки валидны, но donation/thanks ведут на дубль `index.html` |
| Images and media | Needs work | Alt и размеры корректны, но два hero PNG весят около 2,7 МБ |
| URL slug | Needs work | Корневой URL хороший, но `/index.html` отдаёт тот же HTML с 200 |
| On-page schema | Pass | FAQPage валиден и совпадает с видимым FAQ |

---

## Critical fixes

### 1. Задать основной URL

- **Current:** `/` и `/index.html` возвращают одинаковую страницу с `200 OK`; canonical отсутствует.
- **Problem:** поисковику приходится самостоятельно выбирать основной URL; внутренние ссылки с donation/thanks усиливают дубль `/index.html`.
- **Fix:** добавить на главную `<link rel="canonical" href="https://donate.65ombr.online/">`, `og:url` с тем же URL и заменить ссылки `index.html` / `index.html#selector` на `/` / `/#selector`.

### 2. Настроить обнаружение и контроль индексации

- **Current:** `/robots.txt` и `/sitemap.xml` возвращают 404; публичный поиск не показал результатов по домену.
- **Problem:** это не блокирует Googlebot, но для нового одностраничного сайта без подтверждённых внешних ссылок замедляет обнаружение и лишает владельца диагностики.
- **Fix:** создать sitemap только с `https://donate.65ombr.online/`, добавить robots с разрешением обхода и ссылкой на sitemap; подтвердить доменную собственность в Google Search Console, отправить sitemap и запросить индексацию главной через URL Inspection.

### 3. Опубликовать актуальную версию

- **Current:** live-страница имеет `Last-Modified: 2026-11-08`; PR #6 открыт и не слит.
- **Problem:** поисковики видят старый текст без последних правок SKORN.
- **Fix:** после утверждения SEO-изменений слить PR, дождаться успешного GitHub Pages deployment и повторно проверить live HTML.

---

## Important fixes

### 1. Улучшить title, description и H1

- Сократить title до безопасной длины.
- Переписать description без суммы и Zaslip, если эти детали не должны появляться в поисковом сниппете.
- Сделать H1 описательным для запросов «допомога ЗСУ» и «65 ОМБр», а «З нас — дрон. З вас — зв’язок» оставить визуальным слоганом.

### 2. Добавить полноценную карточку для соцсетей

- Добавить абсолютные `og:image`, `twitter:image`, `og:image:width`, `og:image:height`, `og:image:alt`.
- Использовать изображение 1200×630 и `twitter:card=summary_large_image`.

### 3. Оптимизировать первый экран

- `skorn-pixel.png` — 1,39 МБ, `brigade_logo-site-style.png` — 1,38 МБ; оба 1254×1254, хотя выводятся около 200–270 px.
- Подготовить версии около 512×512 в оптимизированном PNG/WebP и сохранить чёткость pixel-art.
- Оставить hero-изображения без lazy loading; динамические карточки деталей уже используют `loading="lazy"`.

### 4. Исправить ошибки HTML-валидатора

- W3C Nu на live нашёл `aria-label` на generic `div` без подходящей роли и недопустимый `role="img"` на `section`.
- Это не прямой блок индексации, но влияет на качество разметки и доступность.

---

## Nice-to-have polish

- Добавить `WebSite` JSON-LD с названием, URL и `inLanguage`; FAQPage можно оставить, но Google обычно не показывает FAQ rich results для сайтов вне авторитетных государственных и медицинских ресурсов.
- Получить хотя бы одну индексируемую внешнюю ссылку с официального ресурса бригады или публичной страницы сбора.
- Исключить `assets/source/` и неиспользуемые промежуточные файлы из Pages-артефакта.
- Подключить Bing Webmaster Tools после настройки sitemap.
- Проверить Core Web Vitals после публикации через Search Console/PageSpeed. Автоматический PageSpeed API во время аудита вернул 429, поэтому лабораторные показатели не подтверждены.

---

## Drafted replacements

### Title tag

> **Current:** Модернізація важкого дрона Starlink для 65 ОМБр | «Важлива деталь» (66)
> **Proposed:** Допомога ЗСУ — збір для 65 ОМБр | Важлива деталь (48)

### Meta description

> **Current PR:** Важкий дрон підрозділу SKORN 65 ОМБр уже є. Збираємо 68 978 ₴ на комплект модернізації: Starlink Mini, бортовий комп’ютер, живлення, мережеве обладнання, кабелі та деталь «Zaslip». (180)
> **Proposed:** Допомога ЗСУ для підрозділу SKORN 65 ОМБр: збір на модернізацію важкого дрона. Оберіть необхідну деталь, щоб задонатити на ЗСУ через monobank. (142)

### H1

> **Current:** З нас — дрон. З вас — зв’язок
> **Proposed:** Допомога ЗСУ: збір для підрозділу SKORN 65 ОМБр

Слоган «З нас — дрон. З вас — зв’язок» оставить рядом как отдельный визуальный текст.

### Header outline

```text
H1: Допомога ЗСУ: збір для підрозділу SKORN 65 ОМБр
  H2: Про модернізацію
  H2: Обери деталь
  H2: З нас — дрон. З вас — зв’язок
```

---

## Implementation notes

`robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://donate.65ombr.online/sitemap.xml
```

В sitemap включать только индексируемую главную страницу. `donation.html` и `thanks.html` правильно имеют `noindex,follow` и не должны попадать в sitemap.

---

## Verify after deploy

- [ ] `/`, canonical, `og:url` и sitemap используют один URL
- [ ] `/robots.txt` и `/sitemap.xml` возвращают 200
- [ ] donation/thanks ссылаются на `/`, а не `/index.html`
- [ ] Search Console Live Test видит H1, текст, CSS, JS и изображения
- [ ] URL Inspection показывает главную как индексируемую
- [ ] Rich Results Test принимает JSON-LD без ошибок
- [ ] Open Graph изображение отображается в Telegram/Facebook preview
- [ ] Core Web Vitals проверены после накопления данных

## References

- Google Search Console: https://developers.google.com/search/docs/monitor-debug/search-console-start
- Canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- FAQ rich results: https://developers.google.com/search/blog/2023/08/howto-faq-changes
