// --------------------------
// ✅ Global Currency Setup
// --------------------------
const USD_TO_INR = 83;
function formatINR(price) {
    return price.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

// --------------------------
// ✅ Load Products on Products Page
// --------------------------
function loadProducts(category = "all") {
    let url = "https://fakestoreapi.com/products";

    if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = "";

            data.forEach(product => {
                let priceInRupees = product.price * USD_TO_INR;
                productList.innerHTML += `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title.substring(0, 20)}...</h3>
                        <p>₹${formatINR(priceInRupees)}</p>
                        <button onclick="viewProduct(${product.id})">View</button>
                        <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
                    </div>
                `;
            });
        });
}

// ✅ When dropdown changes → Filter products
function filterByCategory() {
    const selectedCategory = document.getElementById("categorySelect").value;
    loadProducts(selectedCategory);
}

// ✅ When page first loads → Show all products
if (document.getElementById("product-list")) {
    loadProducts();
}

// --------------------------
// ✅ View Product Details
// --------------------------
function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// --------------------------
// ✅ Single Product Page Logic
// --------------------------
if (document.getElementById("product-detail")) {
    const params = new URLSearchParams(window.location.search);
    let productId = params.get("id");

    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            let priceInRupees = product.price * USD_TO_INR;
            document.getElementById("product-detail").innerHTML = `
                <img src="${product.image}" style="width:200px;">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <h3>Price: ₹${formatINR(priceInRupees)}</h3>
                <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
            `;
        });
}

// --------------------------
// ✅ Cart Functions
// --------------------------
function addToCart(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, title, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
}

if (document.getElementById("cart-items")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsDiv = document.getElementById("cart-items");
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let priceInRupees = item.price * USD_TO_INR;
        cartItemsDiv.innerHTML += `
            <div class="product-card">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title.substring(0, 20)}</h3>
                <p>₹${formatINR(priceInRupees)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("total-price").innerText = formatINR(total * USD_TO_INR);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

