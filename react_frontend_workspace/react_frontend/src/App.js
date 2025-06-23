import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
// Import TailwindCSS (project should have tailwind set up in postcss for full use)

const COLORS = {
  accent: "#F59E42",
  primary: "#374151",
  secondary: "#6D28D9",
};

const PAGE_SIZE = 12;

// PUBLIC_INTERFACE
function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Load favorites from localStorage on mount
    const fav = localStorage.getItem("book_favorites");
    if (fav) setFavorites(JSON.parse(fav));
  }, []);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Save favorites to localStorage when changed
    localStorage.setItem("book_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // PUBLIC_INTERFACE
  const fetchBooks = useCallback(
    async (search = query, index = startIndex) => {
      if (!search) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          "https://www.googleapis.com/books/v1/volumes",
          {
            params: {
              q: search,
              startIndex: index,
              maxResults: PAGE_SIZE,
            },
          }
        );
        setBooks(res.data.items || []);
        setResultCount(res.data.totalItems || 0);
      } catch (e) {
        setBooks([]);
        setResultCount(0);
      }
      setIsLoading(false);
    },
    [query, startIndex]
  );

  // PUBLIC_INTERFACE
  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    fetchBooks(query, 0);
  };

  // PUBLIC_INTERFACE
  const handlePage = (newIndex) => {
    setStartIndex(newIndex);
    fetchBooks(query, newIndex);
  };

  // PUBLIC_INTERFACE
  const openModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  const closeModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

  // PUBLIC_INTERFACE
  const isFavorited = (book) =>
    favorites.some((fav) => fav.id === book.id);

  // PUBLIC_INTERFACE
  const toggleFavorite = (book) => {
    if (isFavorited(book)) {
      setFavorites(favorites.filter((fav) => fav.id !== book.id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  // Helper for responsive Tailwind grid column count
  const gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{background: "#fff"}}>
      {/* Top nav */}
      <nav className="flex-shrink-0 sticky top-0 z-10 bg-white py-3 px-4 shadow sm:px-8 flex items-center justify-between"
        style={{borderBottom: "1px solid #eee", background: "#fff"}}>
        <div className="flex items-center gap-2">
          <span style={{color: COLORS.secondary, fontWeight: 700, fontSize: "1.5rem"}} role="img" aria-label="Book">📚</span>
          <span
            className="font-semibold text-lg"
            style={{color: COLORS.primary, letterSpacing: "1px"}}
          >
            Book Explorer
          </span>
        </div>
        <form className="flex items-center gap-2 w-full max-w-xl mx-8" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books (e.g. Dune, Tolkien, React)..."
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            style={{
              borderColor: COLORS.secondary,
              background: "#faf9fe",
              color: COLORS.primary,
              fontSize: "1rem",
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search books"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded font-semibold shadow"
            style={{background: COLORS.accent, color: "#fff"}}
          >
            Search
          </button>
        </form>
        <button
          className="ml-4 flex items-center gap-2 px-3 py-2 rounded transition hover:bg-gray-100"
          style={{
            color: COLORS.secondary,
            fontWeight: 600,
            border: `1px solid ${COLORS.secondary}`,
            boxShadow: "none"
          }}
          onClick={() => setShowFavorites(!showFavorites)}
          aria-label="Show favorites"
        >
          <span>★</span> Favorites
          {favorites.length > 0 && (
            <span className="ml-1 text-xs text-white rounded bg-orange-500 px-2 py-1 font-bold">
              {favorites.length}
            </span>
          )}
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto pt-6 pb-10 px-4 sm:px-8 relative"
        style={{minHeight: "70vh"}}>
        {/* Book grid */}
        <div className="flex flex-col sm:flex-row gap-6 relative">
          {/* Main results */}
          <main className="flex-1">
            {isLoading && (
              <div className="my-20 text-center text-xl text-gray-400 animate-pulse">Loading...</div>
            )}
            {!isLoading && books.length === 0 && (
              <div className="my-20 text-center text-gray-300">
                {query ? "No books found. Try a different search." : <span className="text-lg">Start searching for books above!</span>}
              </div>
            )}
            {!isLoading && books.length > 0 && (
              <>
                <div className={`grid gap-6 mt-2 ${gridCols}`}>
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      openModal={openModal}
                      isFavorited={isFavorited(book)}
                      toggleFavorite={toggleFavorite}
                      accent={COLORS.accent}
                      secondary={COLORS.secondary}
                    />
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-center mt-10 gap-4">
                  <button
                    className="px-3 py-2 rounded shadow"
                    style={{background: COLORS.secondary, color: "#fff"}}
                    onClick={() => handlePage(Math.max(0, startIndex - PAGE_SIZE))}
                    disabled={startIndex === 0}
                  >Previous</button>
                  <span className="text-gray-500 font-semibold">
                    {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, resultCount)} of {resultCount}
                  </span>
                  <button
                    className="px-3 py-2 rounded shadow"
                    style={{background: COLORS.secondary, color: "#fff"}}
                    onClick={() => handlePage(startIndex + PAGE_SIZE)}
                    disabled={startIndex + PAGE_SIZE >= resultCount}
                  >Next</button>
                </div>
              </>
            )}
          </main>
          {/* Slide-out or persistent favorites */}
          <aside
            className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 z-40 ${showFavorites ? "translate-x-0" : "translate-x-full"} sm:static sm:translate-x-0 sm:h-auto sm:w-64 sm:ml-6`}
            style={{boxShadow: showFavorites ? "0 0 32px 0 #aaa" : "none"}}
            aria-label="Book favorites"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-bold text-lg" style={{color: COLORS.secondary}}>Favorites</span>
              <button className="sm:hidden text-gray-400 hover:text-gray-600" onClick={() => setShowFavorites(false)} title="Close">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[75vh] px-4 py-2">
              {favorites.length === 0 ? (
                <div className="text-gray-400 py-10 text-center text-sm">
                  No favorites yet.<br />Add books with <span className="text-orange-500">★</span>
                </div>
              ) : (
                <ul className="space-y-2">
                  {favorites.map((book) => (
                    <li key={book.id} className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 px-2 py-1 rounded" onClick={() => openModal(book)}>
                      <img
                        src={
                          book.volumeInfo?.imageLinks?.thumbnail ||
                          "https://via.placeholder.com/60x90?text=No+Cover"
                        }
                        alt={book.volumeInfo?.title}
                        className="w-8 h-12 object-cover flex-shrink-0 border border-gray-200 rounded shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">
                          {book.volumeInfo?.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {book.volumeInfo?.authors?.join(", ")}
                        </div>
                      </div>
                      <button
                        onClick={e => {e.stopPropagation(); toggleFavorite(book);}}
                        className="ml-1"
                        title={isFavorited(book) ? 'Remove from favorites' : 'Add to favorites'}
                        style={{color: COLORS.accent, background: "none", border: "none", padding: 0, fontSize: "1.1em"}}
                      >
                        {isFavorited(book) ? "★" : "☆"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
      {/* Book Details Modal */}
      {showModal && selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={closeModal}
          isFavorited={isFavorited(selectedBook)}
          toggleFavorite={() => toggleFavorite(selectedBook)}
          accent={COLORS.accent}
        />
      )}
      {/* Dark overlay for modal on mobile */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeModal}
          role="presentation"
        />
      )}

      {/* Slide-out favorites overlay (mobile) */}
      {showFavorites && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 sm:hidden"
          onClick={() => setShowFavorites(false)}
          role="presentation"
        />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function BookCard({ book, openModal, isFavorited, toggleFavorite, accent, secondary }) {
  return (
    <div className="relative rounded shadow hover:shadow-lg transition cursor-pointer bg-white flex flex-col items-center group border border-gray-200" onClick={() => openModal(book)}>
      <img
        src={
          book.volumeInfo?.imageLinks?.thumbnail ||
          "https://via.placeholder.com/128x180?text=No+Cover"
        }
        alt={book.volumeInfo?.title}
        className="w-24 h-36 object-cover rounded mt-4 mb-2 group-hover:scale-[1.09] transition"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col items-center w-full px-2 py-1">
        <div className="text-center font-semibold line-clamp-2 text-sm text-gray-900">{book.volumeInfo?.title}</div>
        <div className="text-center text-xs text-gray-500 truncate max-w-full">{book.volumeInfo?.authors?.join(", ")}</div>
      </div>
      <button
        onClick={e => {e.stopPropagation(); toggleFavorite(book);}}
        className="absolute top-2 right-2 text-xl"
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        style={{color: accent, background: "none", border: "none", padding: 0}}
        aria-label="Toggle favorite"
      >
        {isFavorited ? "★" : "☆"}
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function BookModal({ book, onClose, isFavorited, toggleFavorite, accent }) {
  const info = book.volumeInfo || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="bg-white max-w-md w-full rounded-lg shadow-2xl relative p-6 flex flex-col" style={{zIndex: 55}}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={onClose} title="Close" aria-label="Close details">
          &times;
        </button>
        <div className="flex gap-4 items-start">
          <img
            src={info?.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover"}
            alt={info?.title}
            className="w-28 h-40 object-cover rounded shadow border border-gray-100"
          />
          <div className="flex flex-col flex-1">
            <div className="font-bold text-lg mb-1 text-gray-900">{info.title}</div>
            <div className="text-xs text-gray-500 mb-1">
              {info.authors && <>by {info.authors.join(", ")}</>}
            </div>
            <div className="text-xs mb-2 text-gray-500">{info.publishedDate}</div>
            {info.categories &&
              <div className="text-xs mb-1 text-purple-400">#{info.categories[0]}</div>
            }
            <div className="flex gap-2 mt-2 items-center">
              <button
                onClick={toggleFavorite}
                className="px-3 py-2 rounded"
                style={{
                  color: isFavorited ? "#fff" : accent,
                  background: isFavorited ? accent : "#fff",
                  border: `1.8px solid ${accent}`,
                  fontWeight: 600
                }}
                aria-label="Favorite this book"
              >
                {isFavorited ? "★ Favorited" : "☆ Add to Favorites"}
              </button>
              {info.infoLink &&
                <a
                  href={info.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline text-blue-600"
                  style={{fontWeight: 600}}
                >
                  More Info
                </a>
              }
            </div>
          </div>
        </div>
        <div className="mt-5 text-gray-700 text-sm max-h-48 overflow-y-auto leading-relaxed">
          {
            info.description
              ? <span dangerouslySetInnerHTML={{__html: info.description.substring(0, 1200)}} />
              : <i>No description available.</i>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
