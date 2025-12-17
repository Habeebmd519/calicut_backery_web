import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* FIREBASE CONFIG (YOUR PROJECT) */
const firebaseConfig = {
    apiKey: "AIzaSyCvidsit63tq7q9wCofKcMC_7Itqmq0wVxQ",
    authDomain: "calicut-backery.firebaseapp.com",
    projectId: "calicut-backery",
    storageBucket: "calicut-backery.appspot.com",
    messagingSenderId: "582930547188",
    appId: "1:582930547188:web:8c31eb5a3bbd80034a79a1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productsDiv = document.getElementById("products");
const loadingDiv = document.getElementById("loading");
const menuBtn = document.getElementById("menuBtn");
const popupMenu = document.getElementById("popupMenu");
const searchBtn = document.getElementById("searchBtn");
const searchBarSection = document.getElementById("searchBarSection");
const searchInput = document.getElementById("searchInput");

let allProducts = []; // Store all products

/* LOAD MENU ITEMS FROM FIRESTORE */
async function loadMenu() {
    try {
        const snapshot = await getDocs(collection(db, "menu"));

        loadingDiv.style.display = "none";

        if (snapshot.empty) {
            productsDiv.innerHTML = "<p>No items found</p>";
            return;
        }

        snapshot.forEach(doc => {
            const item = doc.data();
            allProducts.push(item); // save each item
        });

        displayProducts(allProducts); // display all items initially

    } catch (error) {
        loadingDiv.innerText = "Failed to load items";
        console.error(error);
    }
}

/* DISPLAY PRODUCTS FUNCTION */
function displayProducts(products) {
    if (products.length === 0) {
        productsDiv.innerHTML = "<p>No items found</p>";
        return;
    }

    productsDiv.innerHTML = ""; // clear previous
    products.forEach(item => {
        productsDiv.innerHTML += `
        <div class="card">
          <img src="${item.image}" alt="${item.name}">
          <div class="card-content">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
            <div class="status ${item.isAvailable ? 'available' : 'out'}">
              ${item.isAvailable ? "Available" : "Out of Stock"}
            </div>
          </div>
        </div>
      `;
    });
}

/* POPUP MENU TOGGLE */
menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    popupMenu.style.display = popupMenu.style.display === "block" ? "none" : "block";
});

/* CLOSE MENU WHEN CLICKING OUTSIDE */
document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !popupMenu.contains(e.target)) {
        popupMenu.style.display = "none";
    }
});

/* SEARCH BAR ANIMATION TOGGLE */
searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBarSection.classList.toggle("active");
    if (searchBarSection.classList.contains("active")) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        displayProducts(allProducts);
    }
});

/* CLOSE SEARCH BAR WHEN CLICKING OUTSIDE */
document.addEventListener("click", (e) => {
    if (!searchBarSection.contains(e.target) && !searchBtn.contains(e.target)) {
        if (searchBarSection.classList.contains("active")) {
            searchBarSection.classList.remove("active");
            searchInput.value = "";
            displayProducts(allProducts);
        }
    }
});

/* PREVENT CLOSING WHEN CLICKING INSIDE INPUT */
searchInput.addEventListener("click", (e) => {
    e.stopPropagation();
});

/* SEARCH FILTER FUNCTIONALITY */
searchInput.addEventListener("input", (e) => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(item =>
        item.name.toLowerCase().includes(query)
    );
    displayProducts(filtered);
});

/* INITIAL LOAD */
loadMenu();
