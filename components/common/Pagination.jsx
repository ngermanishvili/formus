"use client";
export default function Pagination({ activePage, setActivePage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  let pagesToShow = pages;
  if (totalPages > 5) {
    if (activePage <= 3) {
      pagesToShow = [...pages.slice(0, 4), "...", totalPages];
    } else if (activePage >= totalPages - 2) {
      pagesToShow = [1, "...", ...pages.slice(totalPages - 4)];
    } else {
      pagesToShow = [
        1,
        "...",
        activePage - 1,
        activePage,
        activePage + 1,
        "...",
        totalPages,
      ];
    }
  }

  return (
    <ul className="pagination">
      <li className="page-item">
        <a
          className="page-link page-prev cursor-pointer flex justify-center align-center"
          onClick={() => setActivePage((pre) => (pre > 1 ? pre - 1 : pre))}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </a>
      </li>

      {pagesToShow.map((pageNumber, index) => (
        <li key={index} className="page-item ">
          {pageNumber === "..." ? (
            <span className="page-link h-full ">...</span>
          ) : (
            <a
              onClick={() => setActivePage(pageNumber)}
              className={`page-link cursor-pointer ${
                pageNumber === activePage ? "active" : ""
              }`}
            >
              {pageNumber}
            </a>
          )}
        </li>
      ))}

      <li className="page-item">
        <a
          className="page-link page-next cursor-pointer"
          onClick={() =>
            setActivePage((pre) => (pre < totalPages ? pre + 1 : pre))
          }
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </li>
    </ul>
  );
}
