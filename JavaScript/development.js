const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(`Please check "${selection}" selector, no such element exist`);
};
const toggleNav = getElement('.toggle-nav');
const sidebarOverlay = getElement('.sidebar-overlay');
const closeButton = getElement('.sidebar-close');
toggleNav.addEventListener('click',() => {
  sidebarOverlay.classList.add('show');
});
closeButton.addEventListener('click',() => {
  sidebarOverlay.classList.remove('show');
});
const cartOverlay = getElement('.cart-overlay');
const closeCartButton = getElement('.cart-close');
const toggleCartButton = getElement('.toggle-cart');
const productCartButtonList = [...document.querySelectorAll('.product-cart-button')];
toggleCartButton.addEventListener('click',() => {
  cartOverlay.classList.add('show');
});
closeCartButton.addEventListener('click',() => {
  cartOverlay.classList.remove('show');
});
productCartButtonList.forEach((button) => {
  button.addEventListener('click', () => {
    cartOverlay.classList.add('show');
  });
});
const singleProductAddToCartBtn = getElement('.addToCartButton');
singleProductAddToCartBtn.addEventListener('click',() => {
  cartOverlay.classList.add('show');
});