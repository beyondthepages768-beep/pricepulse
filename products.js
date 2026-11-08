
// PricePulse — Live Product Search
// No sample products or invented prices.

const API_URL = "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("productResults");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatPrice(price) {
  if (!price || !price.value || !price.currency) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: price.currency
    }).format(Number(price.value));
  } catch {
    return price.value + " " + price.currency;
  }
}

async function showProducts(query) {
  const term = query.trim();

  if (term.length < 2) {
    results.innerHTML =
      '<div class="no-results">Enter at least 2 characters.</div>';
    return;
  }

  const country =
    document.getElementById("countrySelect")?.value || "US";

  results.innerHTML =
    '<div class="no-results">Searching live retailer listings...</div>';

  try {
    const response = await fetch(
      API_URL + "/api/search?q=" +
      encodeURIComponent(term) +
      "&country=" + encodeURIComponent(country)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed.");
    }

    if (!data.items || data.items.length === 0) {
      results.innerHTML =
        '<div class="no-results">No listings found in this marketplace.</div>';
      return;
    }

    results.innerHTML = `
      <div class="result-heading">
        ${data.count} live listings · ${escapeHTML(data.country)}
        · Source: eBay
      </div>

      ${data.items.map(item => `
        <article class="product-result">

          <div class="product-main">
            ${item.image ? `
              <img class="product-image"
                src="${escapeHTML(item.image)}"
                alt=""
                loading="lazy">
            ` : ""}

            <div class="product-info">
              <h3>${escapeHTML(item.title)}</h3>
              <p>
                ${escapeHTML(item.condition || "Condition not specified")}
                · ${escapeHTML(item.seller || "Seller not listed")}
              </p>
              <small>
                Checked:
                ${escapeHTML(new Date(item.verifiedAt).toLocaleString())}
              </small>
            </div>
          </div>

          <div class="product-side">
            <strong>${escapeHTML(formatPrice(item.price))}</strong>

            ${item.itemUrl ? `
              <a href="${escapeHTML(item.itemUrl)}"
                 target="_blank"
                 rel="noopener noreferrer">
                 View listing ↗
              </a>
            ` : ""}
          </div>

        </article>
      `).join("")}
    `;

  } catch (error) {
    results.innerHTML =
      '<div class="no-results">' +
      escapeHTML(error.message) +
      '</div>';
  }
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  showProducts(searchInput.value);
});

searchInput.addEventListener("input", () => {
  showProducts(searchInput.value);
});

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    searchInput.value = card.dataset.cat;
    showProducts(card.dataset.cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
