
const API = 'http://localhost:3000/api';

async function loadOrders() {
  try {
    const res = await fetch(API + '/orders');

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await res.json();

    const list = document.getElementById('orders');

    // Clear existing orders
    list.replaceChildren();

    orders.forEach((o) => {
      const li = document.createElement('li');

      // Create the order ID element
      const id = document.createElement('b');
      id.textContent = '#' + o.id;

      // Create customer and item text
      const details = document.createTextNode(
        ' ' + o.customer + ' - ' + o.item + ' '
      );

      // Create the status element
      const status = document.createElement('em');
      status.textContent = o.status;

      // Create the ETA text
      const eta = document.createTextNode(
        ' (' + o.eta_text + ')'
      );

      // Append all elements to the list item
      li.append(id, details, status, eta);

      // Append the list item to the orders list
      list.appendChild(li);
    });

  } catch (e) {
    console.error('Error loading orders:', e);
  }
}

document.getElementById('add').addEventListener('click', async () => {
  try {
    const customer = document.getElementById('customer').value;
    const item = document.getElementById('item').value;

    const res = await fetch(API + '/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, item }),
    });

    document.getElementById('msg').textContent = res.ok
      ? 'Order placed!'
      : 'Something went wrong';

    if (res.ok) {
      loadOrders();
    }

  } catch (e) {
    console.error('Error placing order:', e);
    document.getElementById('msg').textContent = 'Unable to place order';
  }
});

// Initial order loading
loadOrders();

// Refresh orders every 5 seconds
setInterval(loadOrders, 5000);
