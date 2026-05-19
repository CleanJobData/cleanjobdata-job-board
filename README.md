# Lovable Job Board Template

A production-ready, high-performance job board template built with **React**, **Tailwind CSS**, and the **CleanJobData API**. This template is designed to be used with [Lovable.dev](https://lovable.dev).

## 🚀 Quick Start

The fastest way to get your job board live is to use the **Edit with Lovable** button on the project page.

1. **Open the project** in [Lovable](https://lovable.dev/projects/aa61da57-8d77-42a2-92b7-cf9bec734d61).
2. **Add your API key** to the environment variables.
3. **Publish** your site.

## 🛠 Configuration

This template requires the following environment variables to connect to the CleanJobData API:

- `CLEANJOBDATA_API_URL`: `https://api.cleanjobdata.com`
- `CLEANJOBDATA_API_KEY`: Your API key from the [CleanJobData Dashboard](https://cleanjobdata.com/dashboard).

## Features

- **Modern Stack**: React 19, TanStack Router, TanStack Start, Tailwind CSS v4.
- **Fast & Scannable**: Optimized job grid with server-side rendering.
- **Advanced Filtering**: Search by title, location, remote, seniority, salary, and more.
- **Responsive Design**: Mobile-first approach with a beautiful UI.
- **Type Safe**: Strict TypeScript implementation for all API responses.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/CleanJobData/cleanjobdata-job-board.git
cd cleanjobdata-job-board
```

### 2. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
CLEANJOBDATA_API_URL=https://api.cleanjobdata.com
CLEANJOBDATA_API_KEY=your_api_key_here
```

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your job board in action.

## License

This project is released into the public domain under [The Unlicense](LICENSE). 
Feel free to use, modify, and distribute it without any restrictions!

---

Built by [CleanJobData](https://cleanjobdata.com)
