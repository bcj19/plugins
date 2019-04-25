var plugin = "CartMgr";

window[plugin].tools = {
  buildTransactionID: function (length) {
    var transID = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      transID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return transID;
  }
}

window[plugin].init = function () {
  this.cart = {
    items: {},
    status: 'closed'
  };
  this.transactions = {};
}

window[plugin].open = function () {
  this.cart.status = 'open';
}

window[plugin].add = function (payload) {
  var sku = payload.sku || '';
  if (sku) {
    if (this.cart.status === 'closed') {
      // open the cart
      this.open();
    }

    if (!this.cart.items[sku]) {
      var qty = Number(payload.qty).toFixed(2),
        amt = Number(payload.amt).toFixed(2),
        ttl = qty * amt;

      this.cart.items[sku] = {
        qty: payload.qty,
        amt: payload.amt,
        ttl: ttl
      }
    } else {
      var qty = this.cart.items[sku].qty + payload.qty,
      amt = Number(payload.amt).toFixed(2),
      ttl = Number(qty * amt).toFixed(2);

      this.cart.items[sku] = {
        qty: qty,
        amt: amt,
        ttl: ttl
      }
    }
    return this.cart;
  } else {
    console.log('A SKU must be specified when adding a product to the cart.');
  }
}

window[plugin].remove = function (payload) {
  if (payload && this.cart.status === 'open') {
    var sku = payload.sku,
      qtyToRemove = payload.qty;

    if (this.cart.items[sku]) {
      var qtyRemaining = this.cart.items[sku].qty - qtyToRemove;
      if (qtyRemaining < 1) {
        delete this.cart.items[sku];
      } else {
        this.cart.items[sku] = {
          qty: qtyRemaining,
          amt: this.cart.items[sku].amt,
          ttl: qtyRemaining * this.cart.items[sku].amt
        }
      }
    }

    return this.cart;
  }
}

window[plugin].checkout = function () {
  this.cart.subtotal = (function () {
    var subtotal = 0,
      items = window[plugin].cart.items;

    for (var key in items) {
      subtotal = subtotal + items[key].ttl;
    }
    return Number(subtotal).toFixed(2);
  })();

  this.cart.shipping = Number(5.00.toFixed(2));
  this.cart.tax = Number((this.cart.subtotal * .1).toFixed(2));
}

window[plugin].purchase = function () {
  if (!this.cart.subtotal) {
    this.checkout();
  }
  var transID = this.tools.buildTransactionID(15);
  this.cart.status = 'complete';
  this.transactions[transID] = this.cart;
  this.transactions[transID].subtotal = Number(this.cart.subtotal);
  this.transactions[transID].total = Number((Number(this.cart.subtotal) + Number(this.cart.tax) + Number(this.cart.shipping)).toFixed(2));
  this.cart = {
    items: {},
    status: 'closed'
  }
  return this.cart;
}