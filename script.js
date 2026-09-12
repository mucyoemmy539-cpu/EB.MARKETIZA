const products=[
{id:1,name:"Premium Hoodie",category:"Fashion",price:499,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"},
{id:2,name:"Classic Sneakers",category:"Shoes",price:799,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"},
{id:3,name:"Wireless Headphones",category:"Electronics",price:999,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"},
{id:4,name:"Smart Watch",category:"Accessories",price:1299,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"},
{id:5,name:"Beauty Collection",category:"Beauty",price:599,image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"},
{id:6,name:"Modern Chair",category:"Home",price:1499,image:"https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"},
{id:7,name:"Gaming Controller",category:"Gaming",price:699,image:"https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80"},
{id:8,name:"Sport Shoes",category:"Sports",price:899,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"},
{id:9,name:"Travel Backpack",category:"Accessories",price:449,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"},
{id:10,name:"Kids Toy",category:"Kids",price:299,image:"https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80"},
{id:11,name:"Basic T-Shirt",category:"Fashion",price:249,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"},
{id:12,name:"Bluetooth Speaker",category:"Electronics",price:549,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"}
];
let cart=[];
function displayProducts(list=products){const grid=document.getElementById("productsGrid");grid.innerHTML="";if(!list.length){grid.innerHTML="<p>No products found.</p>";return}list.forEach(product=>{const card=document.createElement("div");card.className="product";card.innerHTML=`<img class="product-image" src="${product.image}" alt="${product.name}"><div class="product-info"><div class="product-category">${product.category}</div><h3 class="product-name">${product.name}</h3><div class="product-price">${product.price.toLocaleString()} kr</div><button class="add-button" onclick="addToCart(${product.id})">Add to Cart</button></div>`;grid.appendChild(card)})}
function addToCart(id){const product=products.find(p=>p.id===id);if(!product)return;cart.push(product);updateCart();alert(`${product.name} added to your cart!`)}
function removeFromCart(index){cart.splice(index,1);updateCart()}
function updateCart(){document.getElementById("cartCount").textContent=cart.length;const items=document.getElementById("cartItems");items.innerHTML="";let total=0;cart.forEach((product,index)=>{total+=product.price;const item=document.createElement("div");item.className="cart-item";item.innerHTML=`<div><strong>${product.name}</strong><br>${product.price.toLocaleString()} kr</div><button class="remove-button" onclick="removeFromCart(${index})">Remove</button>`;items.appendChild(item)});document.getElementById("cartTotal").textContent=total.toLocaleString()+" kr"}
function openCart(){document.getElementById("cartModal").style.display="flex";updateCart()}
function closeCart(){document.getElementById("cartModal").style.display="none"}
function filterProducts(category){displayProducts(category==="All"?products:products.filter(p=>p.category===category));document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function searchProducts(){const search=document.getElementById("searchInput").value.toLowerCase();displayProducts(products.filter(p=>p.name.toLowerCase().includes(search)||p.category.toLowerCase().includes(search)))}
function checkout(){if(!cart.length){alert("Your cart is empty.");return}alert("Checkout is ready for the next step. Payment integration will be added later.")}
function sendMessage(event){event.preventDefault();alert("Thank you! Your message has been received.");event.target.reset()}
displayProducts();updateCart();
