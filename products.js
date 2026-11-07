
const products = [
  { name: "G Pro X Superlight 2", brand: "Logitech", category: "Gaming Gear" },
  { name: "G305 Lightspeed", brand: "Logitech", category: "Gaming Gear" },
  { name: "Viper V3 Pro", brand: "Razer", category: "Gaming Gear" },
  { name: "DeathAdder V3", brand: "Razer", category: "Gaming Gear" },
  { name: "Apex Pro TKL", brand: "SteelSeries", category: "Gaming Gear" },
  { name: "Cloud III", brand: "HyperX", category: "Gaming Gear" },

  { name: "iPhone 16", brand: "Apple", category: "Smartphones" },
  { name: "iPhone 16 Pro", brand: "Apple", category: "Smartphones" },
  { name: "Galaxy S25 Ultra", brand: "Samsung", category: "Smartphones" },
  { name: "Galaxy S25", brand: "Samsung", category: "Smartphones" },
  { name: "Pixel 9 Pro", brand: "Google", category: "Smartphones" },

  { name: "GeForce RTX 5070", brand: "NVIDIA", category: "PC Components" },
  { name: "GeForce RTX 4060", brand: "NVIDIA", category: "PC Components" },
  { name: "Ryzen 7 7800X3D", brand: "AMD", category: "PC Components" },
  { name: "Ryzen 5 7600", brand: "AMD", category: "PC Components" },
  { name: "Core i5-14400F", brand: "Intel", category: "PC Components" }
];

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const results = document.createElement("div");
results.id = "productResults";
searchForm.insertAdjacentElement("afterend", results);

const style = document.createElement("style");
style.textContent = `
#productResults {
  max-width:660px;
  margin:18px auto 0;
  text-align:left;
}
.result-heading {
  color:#b8ff65;
  font-size:13px;
  margin-bottom:12px;
}
.product-result {
  background:#141d27;
  border:1px solid rgba(255,255,255,.10);
  border-radius:11px;
  padding:15px;
  margin-bottom:9px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  animation:rise .35s ease both;
}
.product-result h3 {
  color:#f4f7fa;
  font-size:14px;
  margin-bottom:4px;
}
.product-result p {
  color:#8795a5;
  font-size:11px;
}
.product-result span {
  color:#b8ff65;
  font-size:10px;
  white-space:nowrap;
}
.no-results {
  color:#aab5c2;
  background:#141d27;
  padding:18px;
  border-radius:10px;
  font-size:13px;
}
`;
document.head.appendChild(style);

function showProducts(query) {
  const term = query.trim().toLowerCase();

  if (!term) {
    results.innerHTML = "";
    return;
  }

  const matches = products.filter(product =>
    `${product.name} ${product.brand} ${product.category}`
      .toLowerCase()
      .includes(term)
  );

  if (matches.length === 0) {
    results.innerHTML = `
      <div class="no-results">
        No matching products found in our starter catalog.
        Try another brand or model.
      </div>
    `;
    return;
  }

  results.innerHTML = `
    <div class="result-heading">
      ${matches.length} matching product${matches.length === 1 ? "" : "s"}
    </div>
    ${matches.map(product => `
      <div class="product-result">
        <div>
          <h3>${product.brand} ${product.name}</h3>
          <p>${product.category}</p>
        </div>
        <span>PRICE DATA PENDING</span>
      </div>
    `).join("")}
  `;
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  showProducts(searchInput.value);
});

searchInput.addEventListener("input", () => {
  showProducts(searchInput.value);
});

document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.cat;
    searchInput.value = category;
    showProducts(category);
    document.getElementById("categories").scrollIntoView({
      behavior: "smooth"
    });
  });
});

