# 🚗 Espace Auto 92 - Vite + React Project

A modern, high-performance automotive website built with **Vite + React + TypeScript**, featuring 3D animations, multi-language support, and comprehensive automotive services.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Technology Stack

### Core Framework
- **Vite 5** - Lightning-fast build tool and dev server
- **React 18** with TypeScript
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling

### 3D Graphics & Animations
- **Three.js** for 3D car models
- **@react-three/fiber** for React integration
- **@react-three/drei** for 3D utilities
- **Lottie React** for 2D animations
- **Framer Motion** for UI animations

### Internationalization
- **React Context** for locale management
- **Custom i18n hook** for translations
- **URL-based routing** for languages

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   ├── sections/           # Page sections
│   ├── search/             # Search functionality
│   └── ui/                 # Reusable UI components
├── pages/                  # Page components
├── providers/              # Context providers
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
├── data/                   # Static data
│   └── messages/           # Translation files
└── styles/                 # Global styles
```

## 🌟 Key Features

### 1. Lightning-Fast Development
- **⚡ Vite HMR** - Instant hot module replacement
- **🔥 Fast builds** - 10x faster than Webpack
- **📦 Optimized bundles** - Smaller, faster loading
- **🛠️ Zero config** - Works out of the box

### 2. 3D Interactive Car Model
- Procedural 3D car built with Three.js primitives
- Smooth animations and interactions
- Performance optimized with React Three Fiber

### 3. Multi-Language Support
- French and English translations
- URL-based language routing
- Context-based translation management

### 4. Product Search System
- Fuzzy search with Fuse.js
- Real-time search results
- Category filtering

### 5. Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Dark/light theme support

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Accent**: Red (#ef4444)
- **Success**: Green (#10b981)

### Components
- Custom UI components with shadcn/ui patterns
- Consistent design tokens
- Accessible components

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading of 3D components
- Route-based code splitting
- Optimized bundle chunks

### Image Optimization
- Lazy loading images
- Optimized formats
- Responsive images

### Bundle Optimization
- Manual chunk splitting
- Tree shaking
- Dead code elimination

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔄 Development Workflow

### Available Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

## 🌟 Advantages of Vite + React

### Performance Benefits
- **⚡ 10x faster** development server startup
- **🔥 Instant HMR** - changes appear immediately
- **📦 Smaller bundles** - better tree shaking
- **🚀 Faster builds** - optimized for production

### Developer Experience
- **🛠️ Zero configuration** - works out of the box
- **📚 Better TypeScript** support
- **🔍 Hot module replacement** that actually works
- **🎯 Modern tooling** - ES modules, native ESM

## 🎯 Business Features

### Automotive Services
1. **Carte Grise** - Vehicle registration processing
2. **Pièces Auto** - Auto parts search and ordering
3. **Réparation** - Repair services
4. **Diagnostic** - Vehicle diagnostics
5. **Entretien** - Maintenance services

### User Experience
- Intuitive navigation with clear service categories
- Fast search with instant results
- Mobile-optimized for on-the-go access
- Professional design building trust

## 🚀 Migration Benefits

### From Next.js to Vite + React
- **⚡ Faster development** - No more slow compilation
- **🔄 Better HMR** - Changes appear instantly
- **📦 Smaller bundles** - Better performance
- **🛠️ Simpler setup** - Less configuration
- **🎯 Modern tooling** - Latest web standards

## 📄 License

This project is licensed under the MIT License.

---

**Espace Auto 92** - Your trusted automotive partner in Nanterre since 2017.

















