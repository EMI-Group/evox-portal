# EvoX Portal

EvoX Portal is the Landing Pages of EvoX, built with **Astro 5.0**, **Tailwind CSS v4**, and **Iconify**.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `v18.17.1` or higher
- **pnpm**: `v8.0.0` or higher (Recommended)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EMI-Group/evox-portal
   cd evox-portal
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```
   The site will be available at `http://localhost:4321`.

## 🛠️ Components & Architecture

- **Framework**: [Astro 5](https://astro.build/) - Selected for its excellent performance and content-first architecture.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Using the latest features including CSS-first configuration and high-performance engine.
- **Icons**: [astro-icon](https://github.com/natemoo-re/astro-icon) with Heroicons and Simple Icons sets.
- **Content**: Managed via [Content Collections](https://docs.astro.build/en/guides/content-collections/) for blogs and library metadata.

## 📁 Project Structure

```text
src/
├── assets/             # Images and static assets
├── components/         # Reusable Astro components (Header, Footer, etc.)
├── content/            # Markdown blogs and JSON library data
│   ├── blogs/          # Blog posts (.md)
│   └── libs.json       # Ecosystem project data
├── layouts/            # Page layouts
├── pages/              # Routing (Home, Blogs, Libraries)
└── styles/             # Global CSS and Tailwind directives
```

## 📜 Available Scripts

| Script           | Description                                                     |
| :--------------- | :-------------------------------------------------------------- |
| `pnpm dev`       | Starts the local development server with HMR.                   |
| `pnpm build`     | Bundles your site into static files for production to `./dist`. |
| `pnpm preview`   | Previews your build locally before deploying.                   |
| `pnpm astro ...` | Run any specialized Astro CLI commands.                         |

## 🌟 Key Features

- **GPU Visualization**: Interactive demos of evolutionary algorithms.
- **Dynamic Blogs**: Paginated news and updates sourced from Markdown.
- **Ecosystem Directory**: Clean, searchable list of EvoX-related libraries.
- **Community Focused**: Quick access to QQ Groups and Discord channels.
- **Fully Responsive**: Optimized for everything from mobile phones up to large desktop monitors.

---

Built with ❤️ by the EvoX Team.
