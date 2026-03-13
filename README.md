# 📸 Photo Gallery

> 🌐 **Live:** [live page](https://rustom-photo-gallery.vercel.app/)  
> 📂 **Repo:** [rustom-photo-gallery](https://github.com/Rustom-yadav/rustom-photo-gallery)

A React photo gallery that fetches images from the Picsum API, with search by author and favourites (persisted in localStorage).

---

## ✨ Features

- Fetch 30 photos from [Picsum Photos API](https://picsum.photos/)
- Responsive grid: 1 column (mobile), 2 (tablet), 4 (desktop)
- Search by author name (real-time, no extra API call)
- Mark photos as favourites (useReducer + localStorage)
- Loading spinner and error state

## 🛠️ Stack

- React + Vite
- Tailwind CSS
- Custom hook `useFetchPhotos`, `useCallback`, `useMemo`

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open [localhost](http://localhost:5173).

## 📜 License

MIT © Rustom 
