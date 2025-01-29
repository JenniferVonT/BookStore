/**
 * The main client side script.
 */

const addToCartForms = document.querySelectorAll('.addToCartForm')

addToCartForms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const isbn = event.target[0].value
    const quantiy = parseInt(event.target[1].value)

    await addToCart(isbn, quantiy)
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
    console.log(response)
  }
}
