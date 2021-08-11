const client = contentful.createClient({
     space: "48t1s0p1dk0p",
     accessToken: "your api key",
});
const cartButton = document.querySelector('.cart-button');
const closeCart = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsCenter = document.querySelector('.products-center');
let cart = [];
class Products {
     async getProducts(){
          try {
               let contentful = await client.getEntries({
                    content_type: "comfyHouseProducts"
               });
               let result = await fetch('products.json');
               let data = await result.json();
               let products = data.items;
               products = products.map(item => {
                    const {title,price} = item.fields;
                    const {id} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return {title,price,id,image};
               });
               return products;
          }catch(error){
               console.log(error);
          }
     }
}
class UI {
     displayProducts(products){
          let result = "";
          products.forEach(product => {
               result += `
                    <article class="product">
                         <div class="img-container">
                         <img src=${product.image}alt="product" class="product-image"/>
                         <button class="bag-button" data-id=${product.id}><i class="fas fa-shopping-cart"></i>add to cart</button>
                         </div>
                         <h3>${product.title}</h3>
                         <h4>$${product.price}</h4>
                    </article>
               `;
          });
          productsCenter.innerHTML = result;
     }
     getBagButtons(){
          const buttons = [...document.querySelectAll('.bag-button')];
          buttonsDOM = buttons;
          buttons.forEach(button => {
               let inCart = cart.find(item => item.id === id);
               if(inCart){
                    button.innerText = 'In Cart';
                    button.disabled = true;
               }else{
                    button.addEventListener('click',event => {
                         event.target.innerText = 'In Bag';
                         event.target.disabled = true;
                         let cartItem = {...Storage.getProducts(id),amount: 1};
                         cart = [...cart,cartItem];
                         Storage.saveCart(cart);
                         this.setCartValues(cart);
                         this.addCartItem(cartItem);
                         this.showCart();
                    });
               }
          });
     }
     setCartValues(cart){
          let temporaryTotal = 0;
          let itemsTotal = 0;
          cart.map(item => {
               temporaryTotal += item.price * item.amount;
               itemsTotal += item.amount;
          });
          cartTotal.innerText = parseFloat(temporaryTotal.toFixed(2));
          cartItems.innerText = itemsTotal;
     }
     addCartItem(item){
          const div = document.createElement('div');
          div.classList.add('cart-item');
          div.innerHTML = `
               <img src=${item.image} alt="product" />
               <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
               </div>
               <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
               </div>
          `;
          cartContent.appendChild(div);
     }
     showCart(){
          cartOverlay.classList.add('transparentBackground');
          cartDOM.classList.add('showCart');
     }
     setupApp(){
          cart = Storage.getCart();
          this.setCartValues(cart);
          this.populateCart(cart);
          cartButton.addEventListener('click',this.showCart);
          closeCart.addEventListener('click',this.hideCart);
     }
     populateCart(cart){
          cart.forEach(item => this.addCartItem(item));
     }
     hideCart(){
          cartOverlay.classList.remove('transparentBackground');
          cartDOM.classList.remove('showCart');
     }
     cartLogic(){
          clearCart.addEventListener('click',() => {
               this.clearCart();
          });
          cartContent.addEventListener('click',event => {
               if(event.target.classList.contains('remove-item')){
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cart = cart.filter(item => item.id !== id);
                    this.setCartValues(cart);
                    Storage.saveCart(cart);
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    const buttons = [...document.querySelectorAll('.bag-button')];
                    buttons.forEach(button => {
                         if(parseInt(button.dataset.id) === id){
                              button.disabled = false;
                              button.innerHTML = '<i class="fas fa-shopping-cart"></i>add to bag';
                         }
                    });
               }else if(event.target.classList.contains('fa-chevron-up')){
                    let addAmount = event.target;
                    let id = addAmount.dataset.id;
                    let temporaryItem = cart.find(item => item.id === id);
                    temporaryItem.amount = temporaryItem.amount + 1;
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    addAmount.nextElementSibling.innerText = temporaryItem.amount;
               }else if(event.target.classList.contains('fa-chevron-down')){
                    let lowerAmount = event.target;
                    let id = lowerAmount.dataset.id;
                    let temporaryItem = cart.find(item => item.id === id);
                    temporaryItem.amount = temporaryItem.amount - 1;
                    if(temporaryItem.amount > 0){
                         Storage.saveCart(cart);
                         this.setCartValues(cart);
                         lowerAmount.previousElementSibling.innerText = temporaryItem.amount;
                    }else{
                         cart = cart.filter(item => item.id !== id);
                         this.setCartValues(cart);
                         Storage.saveCart(cart);
                         cartContent.replaceChild(lowerAmount.parentElement.parentElement);
                         const buttons = [...document.querySelectorAll('.bag-button')];
                         buttons.forEach(button => {
                              if(parseInt(button.dataset.id) === id){
                                   button.disabled = false;
                                   button.innerHTML = '<i class="fas fa-shopping-cart"></i>add to bag';
                              }
                         });
                    }
               }
          });
     }
     clearCart(){
          let cartItems = cart.map(item => item.id);
          cartItems.forEach(id => this.removeItem(id));
          while(cartContent.children.length > 0){
               cartContent.removeChild(cartContent.children[0]);
          }
          this.hideCart();
     }
     removeItem(id){
          cart = cart.filter(item => item.id !== id);
          this.setCartValues(cart);
          Storage.saveCart(cart);
          let button = this.getSingleButton(id);
          button.disabled = false;
          button.innerHTML = '<i class="fas fa-shopping-cart"></i>add to chart';
     }
     getSingleButton(id){
          return buttonsDOM.find(button => button.dataset.id === id);
     }
}
class Storage {
     static saveProducts(products){
          localStorage.setItem('products',JSON.stringify(products));
     }
     static getProduct(id){
          let product = JSON.parse(localStorage.getItem('products'));
          return products.find(product => product.id === id);
     }
     static saveCart(cart){
          localStorage.setItem('cart',JSON.stringify(cart));
     }
     static getCart(){
          return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
     }
}
document.addEventListener('DOMContentLoaded',() => {
     const ui = new UI();
     const products = new Products();
     ui.setupApp();
     products.getProducts().then(products => {
          ui.displayProducts(products);
          Storage.saveProducts(products);
     }).then(() => {
          ui.getBagButtons();
          ui.cartLogic();
     });
});