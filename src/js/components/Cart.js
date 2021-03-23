import{select, classNames, templates, settings} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    console.log('new cart', thisCart);

  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = element.querySelector(select.cart.address);
    thisCart.dom.phone = element.querySelector(select.cart.phone);

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {};
    payload.phone = thisCart.dom.phone.value;
    payload.address = thisCart.dom.address.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subTotalPrice = thisCart.subTotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    console.log('payload', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }

  add(menuProduct) {
    const thisCart = this;

    // generate HTML based on templates
    const generatedHTML = templates.cartProduct(menuProduct);
    // było: const generatedHTML = templates.menuProduct(menuProduct.data);
    // create dom element
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    /*//find menu container
    const cartContainer = thisCart.dom.productList;
    //add element do menu
    cartContainer.appendChild(generatedDOM);*/

    thisCart.dom.productList.appendChild(thisCart.element);

    thisCart.products.push(new CartProduct(menuProduct, thisCart.element));

    thisCart.update();
  }

  update() {

    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.totalNumber = parseInt(thisCart.totalNumber) + parseInt(product.amount);
      thisCart.subTotalPrice = parseInt(thisCart.subTotalPrice) + parseInt(product.price);
    }
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    thisCart.totalPrice = thisCart.deliveryFee + thisCart.subTotalPrice;

    if (thisCart.subTotalPrice > 0) {
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      for (let totalPrice of thisCart.dom.totalPrice) {
        totalPrice.innerHTML = thisCart.totalPrice;
      }
    } else {
      thisCart.dom.deliveryFee.innerHTML = 0;
      for (let totalPrice of thisCart.dom.totalPrice) {
        totalPrice.innerHTML = 0;
      }
    }
  }

  remove(cartProduct) {

    const thisCart = this;

    const elementIndex = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(elementIndex, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
}

export default Cart;
