
//select element yg mau di render

//museum Card
const museumElement = document.querySelector("#card__container");
//render cart list
const cartElement = document.querySelector("#list__item");
//render total price
const totalElement = document.querySelector("#total");
//render nothing
const nothingElement = document.querySelector("#nothing");
//total price


// Rendering Museum Card
function renderMuseum() {
  museums.forEach ( (museum) => {
    museumElement.innerHTML += `
      <div class="card">
        <img src="${museum.src}" alt="${museum.name}" class="card__image">
        <h2>${museum.name}</h2>
        <p>${museum.description}</p>
        <p><span>Rp.</span>${museum.price}</p>
        <div class="button__container" onClick="addToCart(${museum.id})">
          <button class="buyButton" >Buy Ticket 
                  <i class='bx bx-cart'></i>
            </button>
        </div>
      </div>
    `;
  })
}

renderMuseum();


// Cart Array
let cart = [];

//CARI ID DI SETIAP CARD LALU MASUKAN KE ADD TO CART
function addToCart(id) {
  //gimana caranya biar cart ga bisa di push 2 kali
  const isTicketInCart = cart.some((item) => item.id === id)

  if (isTicketInCart) {
    alert('Item is already in the cart');
  } else {
    const item = museums.find((museum) => museum.id === id);
    // gimana caranya tau berapa jumlah ticket yg dibeli/value
    cart.push({
      //push more item in array
      ...item, numberOfTickets : 1
    });
  }


  updateCart();
}

// function updateCart dan harga
function updateCart() {
  renderCart();
  renderPrice();
}


// menghitung total price
function renderPrice() {
  
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfTickets
  })

  totalElement.innerHTML = `
    <div class="total__container">
      <p class="total__title">Total Price:</p>
      <p id="total__price"><span>Rp.</span> ${totalPrice}</p>
      <button class="totalButton" onclick="openPayment()" >Pay now</button>
    </div>
  `;
}



// DIBAWAH SINI AKU RENDER CART

function renderCart() {
    cartElement.innerHTML = "";
    cart.forEach((item) => {
      cartElement.innerHTML += `
      <div class="cart">
          <div class="cart__item cart-content">
              <img class="cart__item-image" src="${item.src}" alt="">
              <p class="cart__item-title">${item.name}</p>
          </div>
          <p class="cart__item-price cart-content"><span>Rp.</span> ${item.price}</p>
          <div class="cart__item-quantity cart-content">
              <button class="btn-plus" onClick="changeNumberOfTickets('plus', ${item.id})"><i class='bx bx-plus' style='color:#ffffff' ></i></button>
              <p class="number">${item.numberOfTickets}</p>
              <button class="btn-minus" onClick="changeNumberOfTickets('minus', ${item.id})"><i class='bx bx-minus' style='color:#ffffff' ></i></button>
              <button class="btn-remove" onClick="removeItemFromCart(${item.id})">Remove Item</button>
          </div>
      </div>
      `;
    })

    if (cart.length === 0) {
      totalElement.style.display = 'none'; 
      nothingElement.style.display = 'block'
    } else {
      totalElement.style.display = 'block'; 
      nothingElement.style.display = 'none'
    }
    
}

// Removing cart button
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

// mengubah jumlah ticket yang akan dibeli

function changeNumberOfTickets (count , id) {
  //edit numberOfTicket yang ada di cart[]
  //updating cart jadi cart = cart
  cart = cart.map((item) => {

    // ambil numberOfTickets yang awalnya di setting 1
    let numberOfTickets = item.numberOfTickets;

    if (item.id === id){
      if (count === "minus" ) {
        // set limit, biar ga bisa decrement ke 0 dan negative
        if (numberOfTickets > 1) {
          numberOfTickets--;
        }
      } else if (count === "plus" ) {
        numberOfTickets++;
      }
    }

    //return biar klo ga ada count yg berjalan, akan ttp ke awal numberOfTicket yg di setting
    return {
      ...item,
      numberOfTickets: numberOfTickets,
    }
  })

  updateCart()
}

// buat atm, biar 1234-2312-4214-2134
// Get the credit card number input element
const cardNumberInput = document.getElementById('card-number');
const errorMessage = document.getElementById('error-message')

cardNumberInput.addEventListener('input', function () {

    const cleanedInput = this.value.replace(/\D/g, '');

    if (cleanedInput.length === 0 || cleanedInput.length > 16) {
        this.value = '';
    } else {
        let formattedInput = '';
        for (let i = 0; i < cleanedInput.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedInput += '-';
            }
            formattedInput += cleanedInput[i];
        }
        this.value = formattedInput;
    }
    if (cleanedInput.length !== 16) {
      errorMessage.textContent = '*Card number must have exactly 16 digits.';
  } else {
      errorMessage.textContent = ''; 
  }
});


// POPUP PAYMENT CONTAINER

let popupPayment = document.getElementById('popupPayment')

function openPayment() {
    popupPayment.classList.add("open__payment");
    popupPayment.classList.remove("close__payment");
}

function closePayment() {
  popupPayment.classList.add("close__payment");
  popupPayment.classList.remove("open__payment");
}

// POPUP PAY BUTTON DENGAN HARUS MENGISI SELURUH FORM

let confirmed = document.getElementById('confirmed')
const nameUser = document.getElementById('name-user');
const lastNameUser = document.getElementById('last-name');
const ibanInput = document.getElementById('card-number');
const rules1Input = document.getElementById('rules1');
const rules2Input = document.getElementById('rules2');

function check(){
  if (
    nameUser.value.trim() !== '' &&
    lastNameUser.value.trim() !== '' &&
    ibanInput.value.trim() !== '' &&
    rules1Input.checked &&
    rules2Input.checked
  ) {
    confirmed.classList.add('payOpened');
    confirmed.classList.remove('payClosed');
  } else {
  alert('Please fill out all required fields and accept the rules.');
  return false;
  } 
}



// PEMBAYARAN
function pay() {
  const input = prompt('Masukkan jumlah pembayaran (dalam angka):');
  
  if (input !== null && !isNaN(input)) {
    const paymentAmount = parseFloat(input);
    const totalPriceElement = document.querySelector("#total__price");
    const totalPrice = parseFloat(totalPriceElement.textContent.replace('Rp. ', ''));

    if (paymentAmount < totalPrice) {
      alert('Maaf, jumlah pembayaran tidak sesuai dengan total harga.');
    } else {
      const change = paymentAmount - totalPrice;
      if (change > 0) {
        alert(`Terimakasih! Pembayaran berhasil, enjoy your trip!\nHere's your change: Rp. ${change.toFixed(2)}`);
      } else if (change === 0) {
        alert('Terimakasih! Pembayaran berhasil, enjoy your trip!');
      } else {
        alert('Pembayaran gagal, silahkan coba lagi.');
      }
    }
  } else {
    alert('Masukkan jumlah pembayaran yang valid.');
  }
}


