let createProduct = document.querySelector(".create-btn");
let mainForm = document.querySelector(".main-form");
let closeBtn = document.querySelector(".close-btn");
let form = document.querySelector("form");
let container = document.querySelector(".container");

createProduct.addEventListener("click", () => {
  mainForm.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  mainForm.style.display = "none";
});

let productId = 0;
let products = [];
let editingProduct = null;

function createCard(product) {
  // Card
  const card = document.createElement("div");
  card.className = "card";

  // Image
  const img = document.createElement("img");
  img.src = `${product.productImage}`;
  img.alt = "image";

  // Details
  const details = document.createElement("div");
  details.className = "details";

  // Title
  const title = document.createElement("h3");
  title.textContent = `${product.productName}`;

  // Description
  const desc = document.createElement("p");
  desc.textContent = `${product.productDesc}`;

  // Price
  const price = document.createElement("p");
  price.className = "price";
  price.textContent = `${product.productPrice}`;

  // Actions
  const actions = document.createElement("div");
  actions.className = "actions";

  // Update Button
  const updateBtn = document.createElement("button");
  updateBtn.className = "update";
  updateBtn.textContent = "Update";

  updateBtn.addEventListener("click", () => {
    mainForm.style.display = "block";

    document.querySelector("#product-name").value = product.productName;
    document.querySelector("#description").value = product.productDesc;
    document.querySelector("#price").value = product.productPrice;
    document.querySelector("#image-url").value = product.productImage;

    editingProduct = {
      product,
      title,
      desc,
      price,
      img,
    };
  });

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    let result = products.find((elem) => {
      return product.productId == elem.productId;
    });
    console.log(result);
    card.remove();
  });

  actions.append(updateBtn, deleteBtn);
  details.append(title, desc, price, actions);
  card.append(img, details);

  container.appendChild(card);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let productName = document.querySelector("#product-name").value;
  let productDesc = document.querySelector("#description").value;
  let productPrice = document.querySelector("#price").value;
  let productImage = document.querySelector("#image-url").value;

  if (editingProduct) {
    // Update object
    editingProduct.product.productName = productName;
    editingProduct.product.productDesc = productDesc;
    editingProduct.product.productPrice = productPrice;
    editingProduct.product.productImage = productImage;

    // Update UI
    editingProduct.title.textContent = productName;
    editingProduct.desc.textContent = productDesc;
    editingProduct.price.textContent = productPrice;
    editingProduct.img.src = productImage;

    editingProduct = null;
  } else {
    // Add new product
    let product = {
      productId,
      productName,
      productDesc,
      productPrice,
      productImage,
    };

    productId++;
    products.push(product);
    createCard(product);
  }

  form.reset();
  mainForm.style.display = "none";
});
