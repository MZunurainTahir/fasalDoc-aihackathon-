# Contributing to FasalDoc

Thank you for your interest in helping FasalDoc empower smallholder farmers across Pakistan and South Asia!

## How to Contribute

1. **Fork the repository** and create your feature branch (`git checkout -b feature/amazing-feature`).
2. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```
3. **Copy environment files**:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
4. **Make your changes** following the existing code style.
5. **Run quality checks**:
   ```bash
   npm run type-check
   npm test
   npm run build
   ```
6. **Commit** with clear messages and push to your fork.
7. **Open a Pull Request** describing the change and why it helps farmers.

## Areas We Love Help With

- More Pakistan-specific crop/livestock disease entries and verified remedies
- Provincial market rates and government scheme data
- Urdu translations and voice UX improvements
- Offline-first features and PWA enhancements
- IoT sensor integrations

## Code Style

- TypeScript strict mode is enabled.
- Prefer functional React components with hooks.
- Keep UI mobile-first and accessible.
- Bilingual (Urdu + English) labels where user-facing.

## Questions?

Open an issue or reach out to the maintainers.
