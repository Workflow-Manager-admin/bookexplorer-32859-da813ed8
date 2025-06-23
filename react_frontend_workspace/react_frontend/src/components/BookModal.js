import React from "react";
import "../App.css";

/**
 * Modal dialog for detailed book info.
 */
// PUBLIC_INTERFACE
function BookModal({ book, onClose, isFavorited, toggleFavorite }) {
  const info = book.volumeInfo || {};

  // For swipe down to close (mobile gesture)
  const modalRef = React.useRef(null);
  const startY = React.useRef(null);
  const dy = React.useRef(0);

  React.useEffect(() => {
    function onTouchStart(e) {
      startY.current = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      if (startY.current !== null) {
        dy.current = e.touches[0].clientY - startY.current;
        if (modalRef.current && dy.current > 0 && dy.current < 120) {
          modalRef.current.style.transform = `translateY(${dy.current}px)`;
          modalRef.current.style.transition = "transform 0s";
        }
      }
    }
    function onTouchEnd() {
      if (dy.current > 70) {
        onClose();
      } else if (modalRef.current) {
        modalRef.current.style.transform = "";
        modalRef.current.style.transition = "transform .25s cubic-bezier(.2,1.8,.7,1.1)";
      }
      startY.current = null;
      dy.current = 0;
    }
    const m = modalRef.current;
    if (m) {
      m.addEventListener("touchstart", onTouchStart, { passive: true });
      m.addEventListener("touchmove", onTouchMove, { passive: false });
      m.addEventListener("touchend", onTouchEnd, { passive: true });
    }
    return () => {
      if (m) {
        m.removeEventListener("touchstart", onTouchStart);
        m.removeEventListener("touchmove", onTouchMove);
        m.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [onClose]);

  return (
    <div
      className="overlay transition-colors duration-200 bg-black/30 sm:bg-black/20"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{backdropFilter: "blur(2px)"}}
    >
      <div
        ref={modalRef}
        className="book-modal animate-modalInOpen max-w-lg w-[95vw] rounded-2xl shadow-2xl border border-secondary/10 relative flex flex-col focus:outline-none bg-white"
        tabIndex={0}
        aria-label={`Details for ${info.title}`}
        onClick={e => e.stopPropagation()}
        style={{
          animation: "modalIn .37s cubic-bezier(.22,2.4,.4,1) backwards",
          touchAction: "pan-y",
          WebkitTapHighlightColor: "transparent"
        }}
      >
        <button
          className="close-btn absolute right-3 top-2 text-2xl text-gray-400 hover:text-primary transition-colors duration-100"
          onClick={onClose}
          title="Close"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="row flex gap-6 items-start mb-2">
          <img
            src={info?.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover"}
            alt={info?.title}
            className="cover w-24 h-36 rounded-lg shadow bg-zinc-100"
            draggable={false}
          />
          <div className="meta flex-1">
            <div className="title text-xl font-bold text-primary mb-1">{info.title}</div>
            {info.authors && (
              <div className="authors text-sm text-secondary font-medium">by {info.authors.join(", ")}</div>
            )}
            {info.publishedDate && (
              <div className="date text-xs text-accent mt-1">{info.publishedDate}</div>
            )}
            {info.categories && (
              <div className="category text-xs text-secondary italic">#{info.categories[0]}</div>
            )}
            <button
              className={
                `fav-btn mt-3 px-5 py-2 transition-all duration-100 border rounded focus:outline-none font-semibold ${
                  isFavorited
                  ? "bg-accent text-white border-accent animate-bounce-in"
                  : "bg-white text-accent border-accent hover:bg-accent/10"
                }`
              }
              onClick={toggleFavorite}
              aria-pressed={!!isFavorited}
              tabIndex={0}
            >
              <span className="inline-block text-xl mr-1 align-middle">{isFavorited ? "★" : "☆"}</span>
              <span className="align-middle">{isFavorited ? "Favorited" : "Add to Favorites"}</span>
            </button>
            {info.infoLink && (
              <a
                href={info.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="more-link ml-2 text-secondary underline font-medium text-base hover:text-primary"
              >
                More Info
              </a>
            )}
            {/* Swipe close hint (mobile only) */}
            <span className="block sm:hidden text-[12px] text-gray-400 mt-3 select-none" aria-hidden>
              Swipe down to close
            </span>
          </div>
        </div>
        <div className="desc text-[15px] text-gray-700 leading-relaxed mt-2 max-h-[180px] overflow-y-auto">
          {info.description ? (
            <span dangerouslySetInnerHTML={{ __html: info.description.substring(0, 1200) }} />
          ) : (
            <i>No description available.</i>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookModal;
