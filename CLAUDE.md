# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal academic website built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. The site is deployed via GitHub Pages.

## Development Commands

### Local Development with Docker (Recommended)
```bash
docker compose pull
docker compose up
```
Site runs at `http://localhost:8080`

### Local Development without Docker
```bash
bundle install
pip install jupyter
bundle exec jekyll serve
```
Site runs at `http://localhost:4000`

### Build for Production
```bash
bundle exec jekyll build
```
Output goes to `_site/` directory.

### Code Formatting
```bash
npm install
npx prettier --check .
npx prettier --write .
```

## Architecture

### Key Configuration
- `_config.yml`: Main site configuration (url, baseurl, theme settings, Jekyll plugins)
- Changes to `_config.yml` require server restart

### Content Structure
- `_pages/`: Website pages (about.md is the homepage via `permalink: /`)
- `_posts/`: Blog posts (format: `YYYY-MM-DD-title.md`)
- `_news/`: News items displayed on homepage
- `_projects/`: Project pages
- `_bibliography/papers.bib`: Publications in BibTeX format

### Data Files
- `_data/cv.yml`: CV content (fallback if `assets/json/resume.json` doesn't exist)
- `_data/coauthors.yml`: Co-author links for publications
- `_data/repositories.yml`: GitHub repos to display
- `_data/socials.yml`: Social media links

### Styling
- `_sass/_themes.scss`: Theme colors (edit `--global-theme-color`)
- `_sass/_variables.scss`: Available color options
- `_sass/_base.scss`: Font and spacing customizations

### Layouts
- `_layouts/about.liquid`: Homepage layout
- `_layouts/page.liquid`: Standard page layout
- `_layouts/post.liquid`: Blog post layout
- `_layouts/bib.liquid`: Publication entry layout

## Publications

Publications are auto-generated from `_bibliography/papers.bib`. Supported BibTeX fields:
- `pdf`, `code`, `slides`, `poster`, `video`, `website`, `blog`
- `abstract`, `arxiv`, `doi`
- `selected={true}` to show on homepage

Author highlighting configured in `_config.yml` under `scholar:last_name` and `scholar:first_name`.

## Deployment

Pushes to `main` branch auto-deploy via GitHub Actions to `gh-pages` branch. The workflow:
1. Builds site with Jekyll
2. Purges unused CSS
3. Deploys to GitHub Pages
