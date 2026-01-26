# Build AI-Powered Apps

A modern **Bun-based** monorepo project for building a chatbot application using **TypeScript**. This project is optimized for fast development, consistent code formatting, and scalable package management via **workspaces**.

---

## 📦 Project Overview

- **Runtime**: Bun
- **Language**: TypeScript (peer dependency)
- **Module System**: ES Modules
- **Package Manager**: Bun (with workspace support)
- **Repo Type**: Private monorepo

This repository is structured to support multiple packages under a single workspace, making it suitable for growing chatbot-related features (core logic, UI, integrations, etc.).

---

## 📁 Project Structure

```txt
chatbot-app/
├─ index.ts              # Main entry point
├─ package.json
├─ packages/             # Workspace packages
│  ├─ client/
│  └─ server/
├─ .husky/               # Git hooks
├─ .prettierrc           # Prettier config (if present)
└─ README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (latest recommended)
- **TypeScript** `^5` (required as a peer dependency)

Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

---

### Install Dependencies

```bash
bun install
```

This will install dependencies for the root project and all workspace packages.

---

## ▶️ Scripts

### Development

```bash
bun run dev
```

Runs the application using `index.ts` as the entry point.

---

### Format Code

```bash
bun run format
```

Formats all files using **Prettier**.

---

### Git Hooks Setup

```bash
bun run prepare
```

Initializes **Husky** to enable Git hooks (typically used with `lint-staged`).

---

## 🧩 Workspaces

This project uses **Bun workspaces**:

```json
"workspaces": [
  "packages/*"
]
```

Each package inside `packages/` can have its own `package.json` and dependencies while sharing the same lockfile and tooling.

---

## 🛠️ Dependencies

### Dev Dependencies

| Package                   | Purpose                                |
| ------------------------- | -------------------------------------- |
| `@types/bun`              | Bun type definitions                   |
| `prettier`                | Code formatting                        |
| `husky`                   | Git hooks                              |
| `lint-staged`             | Run scripts on staged files            |
| `concurrently`            | Run multiple commands in parallel      |
| `@tailwindcss/typography` | Typography utilities (for UI packages) |

---

### Peer Dependencies

| Package      | Version |
| ------------ | ------- |
| `typescript` | `^5`    |

> ⚠️ Make sure TypeScript is installed in the consuming environment.

---

## 🧪 Code Style & Quality

- **Prettier** is used for consistent formatting
- **Husky + lint-staged** ensures clean commits
- ES Module syntax is enforced via:

```json
"type": "module"
```

---

## 🔐 Private Package

```json
"private": true
```

This package is not intended to be published to npm.

---

## 🧠 Notes

- Designed for fast iteration with Bun
- Monorepo-friendly
- Ready for chatbot logic, API integrations, or frontend packages

---

## 📄 License

Private project — no public license.

---

If you want, I can also:

- Add a **README per workspace package**
- Generate **lint-staged config**
- Add **TypeScript / Bun best practices**
- Convert this into **API documentation**
