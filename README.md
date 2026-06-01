# 端侧模型量化部署技术专题

This repository contains a public online course book and HTML slide deck for “端侧模型量化部署技术专题”.

The course covers edge AI deployment framing, PTQ/QAT, large-model quantization, accuracy repair, compression and distillation, runtime deployment chains, VLM/Agent edge patterns, and case-based wrap-up.

## Structure

- `docs/`: Docusaurus course book chapters.
- `src/pages/slides.tsx`: reveal.js HTML slide deck.
- `src/data/course.ts`: shared course agenda and slide/page data.
- `static/img/`: public visual assets.

The original Word outline is intentionally not committed. Public content is stored as Markdown and TypeScript data.

## Local Development

```bash
npm install
npm run start
```

## Build

```bash
npm run build
```

The static site is generated into `build/`.

## Deployment

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `build`
- Production branch: `main`

## License

Code is licensed under the MIT License. Course content is licensed under CC BY 4.0; see `CONTENT_LICENSE.md`.
