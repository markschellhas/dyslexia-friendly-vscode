# Change Log

All notable changes to the "dyslexia-friendly" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2026-08-24

### Changed

- Updated development dependencies to current stable versions (TypeScript 5.9, ESLint 10, webpack 5.109, webpack-cli 7, and VS Code test packages).
- Migrated linting from the legacy `.eslintrc.json` setup to ESLint flat config (`eslint.config.mjs`).
- Added npm overrides for `diff` and `serialize-javascript` to clear known transitive vulnerabilities.

## [1.0.2] - 2024-07-20

### Added

- Marketplace icon.
- Repository metadata in `package.json`.

### Changed

- Display name is now "Dyslexia Friendly VS Code".

## [1.0.0] - 2024-07-20

### Added

- Initial release: OpenDyslexic-oriented editor settings, a "Make Dyslexia Friendly" command, and a Dyslexia Friendly theme.

[Unreleased]: https://github.com/markschellhas/dyslexia-friendly-vscode/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/markschellhas/dyslexia-friendly-vscode/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/markschellhas/dyslexia-friendly-vscode/compare/v1.0.0...v1.0.2
[1.0.0]: https://github.com/markschellhas/dyslexia-friendly-vscode/releases/tag/v1.0.0
