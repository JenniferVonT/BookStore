/**
 * @file Defines the main client side script.
 * @module index
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

/* ----------------Handle the add to cart functionality---------------- */

const addToCartForms = document.querySelectorAll('.addToCartForm')

addToCartForms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const isbn = event.target[0].value
    const quantity = parseInt(event.target[1].value)

    await addToCart(isbn, quantity)
  })
})

/**
 * Handles sending book data to the server to be added to the cart.
 *
 * @param {string} isbn - The books isbn.
 * @param {Number} quantity - The amount to add.
 */
async function addToCart (isbn, quantity) {
  const formData = new URLSearchParams()
  formData.append('isbn', isbn)
  formData.append('quantity', quantity)

  const response = await fetch('./books/addToCart', {
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })

  if (response.ok) {
    addedToCartMessageHandler(isbn)
  }
}

/**
 * Handles the showing and removing of the added to cart message.
 *
 * @param {String} isbn - The isbn id of the element to show that it is added
 */
function addedToCartMessageHandler (isbn) {
  const addedMessage = document.getElementById(isbn)

  // First show the message.
  addedMessage.classList.remove('hidden')

  // Then hide the message after 2 seconds.
  setTimeout(() => {
    addedMessage.classList.add('hidden')
  }, 2000)
}
