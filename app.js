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

    } catch (error) {
        loadingDiv.innerText = "Failed to load items";
        console.error(error);
    }
}

loadMenu();
