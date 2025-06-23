import React from "react";
import "../App.css";

/**
 * Book card grid item for the main results.
 */
// PUBLIC_INTERFACE
function BookCard({ book, openModal, isFavorited, toggleFavorite, style }) {
  // For touch feedback (mobile): sets a temporary "active" shadow
  const [touchActive, setTouchActive] = React.useState(false);
  return (
    <div
      className={
        "book-card group cursor-pointer focus:outline-none select-none transition-all duration-150 shadow-md hover:shadow-xl hover:scale-[1.03] hover:z-10 border border-gray-100/80 hover:border-secondary focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97]" +
        (touchActive ? " shadow-xl scale-[1.02]" : "")
      }
      tabIndex={0}
      aria-label={`View details for ${book.volumeInfo?.title}`}
      onClick={() => openModal(book)}
      onKeyPress={e => { if (e.key === "Enter" || e.key === " ") openModal(book); }}
      onTouchStart={() => setTouchActive(true)}
      onTouchEnd={() => setTouchActive(false)}
      onMouseLeave={() => setTouchActive(false)}
      style={style}
    >
      <img
        src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover"}
        alt={book.volumeInfo?.title}
        className={
          "cover transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:-rotate-2 group-focus-visible:scale-110 group-focus-visible:-rotate-2 group-hover:shadow-lg"
        }
        loading="lazy"
        draggable={false}
      />
      <div className="book-title text-base font-semibold text-primary transition-colors duration-150 group-hover:text-secondary">{book.volumeInfo?.title}</div>
      <div className="book-authors text-xs text-gray-500">{book.volumeInfo?.authors?.join(", ")}</div>
      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(book); }}
        className="fav-btn focus:outline-none text-accent hover:text-secondary transition-colors duration-100 text-xl"
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        tabIndex={0}
      >
        <span className="transition-all duration-150 group-hover:scale-125" aria-hidden>
          {isFavorited ? "★" : "☆"}
        </span>
        <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
      </button>
    </div>
  );
}

export default BookCard;
