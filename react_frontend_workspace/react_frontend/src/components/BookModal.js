import React from "react";
import "../App.css";

/**
 * Modal dialog for detailed book info.
 */
// PUBLIC_INTERFACE
function BookModal({ book, onClose, isFavorited, toggleFavorite }) {
  const info = book.volumeInfo || {};

  return (
    <div
      className="overlay"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="book-modal"
        tabIndex={0}
        aria-label={`Details for ${info.title}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={onClose}
          title="Close"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="row">
          <img
            src={info?.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover"}
            alt={info?.title}
            className="cover"
          />
          <div className="meta">
            <div className="title">{info.title}</div>
            {info.authors &&
              <div className="authors">by {info.authors.join(", ")}</div>
            }
            {info.publishedDate &&
              <div className="date">{info.publishedDate}</div>
            }
            {info.categories &&
              <div className="category">#{info.categories[0]}</div>
            }
            <button
              className={`fav-btn${isFavorited ? " favorited" : ""}`}
              onClick={toggleFavorite}
              aria-pressed={!!isFavorited}
              tabIndex={0}
            >
              {isFavorited ? "★ Favorited" : "☆ Add to Favorites"}
            </button>
            {info.infoLink &&
              <a
                href={info.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="more-link"
              >
                More Info
              </a>
            }
          </div>
        </div>
        <div className="desc">
          {info.description
            ? <span dangerouslySetInnerHTML={{ __html: info.description.substring(0, 1200) }} />
            : <i>No description available.</i>
          }
        </div>
      </div>
    </div>
  );
}

export default BookModal;
