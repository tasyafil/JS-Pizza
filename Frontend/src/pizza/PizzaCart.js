/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('./Storage');
var API = require('../API');

var totalValue = 0;
var orderNumber = 0;


//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size, price) {
    //Додавання однієї піци в кошик покупок
    var flag = 0;


    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza == pizza && Cart[i].size == size) {
            Cart[i].quantity++;
            Cart[i].totalPrice += Cart[i].price;
            totalValue += Cart[i].price;
            $(".sum-value").text(totalValue + ' грн.');
            flag = 1;
        }
    }

    //Приклад реалізації, можна робити будь-яким іншим способом
    if (flag == 0) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price: price,
            totalPrice: price
        });

        totalValue += price;
        $(".sum-value").text(totalValue + ' грн.');
        orderNumber++;
        $(".count-label").text(orderNumber);
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i] == cart_item) {
            Cart.splice(i, 1);
        }
    }

    //Після видалення оновити відображення
    updateCart();
}

function clearCart() {
    Cart = [];
    totalValue = 0;
    $(".sum-value").text(totalValue + ' грн.');
    orderNumber = 0;
    $(".count-label").text(orderNumber);

    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    var saved_cart = Storage.read("cart");
    var oldTotal = Storage.read("sum");
    var oldOrder = Storage.read("order");
    $(".sum-value").text(oldTotal + ' грн.');
    $(".count-label").text(oldOrder);

    if (saved_cart) {
        Cart = saved_cart;
        totalValue = oldTotal;
        orderNumber = oldOrder;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.write("cart", Cart);
    Storage.write("sum", totalValue);
    Storage.write("order", orderNumber);

    //Очищаємо старі піци в кошику
    $cart.html("");



    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $(".clear-order").click(function () {
            clearCart();
        })

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            cart_item.totalPrice += cart_item.price;
            totalValue += cart_item.price;
            $(".sum-value").text(totalValue + ' грн.');


            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if (cart_item.quantity > 1) {
                cart_item.quantity -= 1;
                cart_item.totalPrice -= cart_item.price;
                totalValue -= cart_item.price;
                $(".sum-value").text(totalValue + ' грн.');

            } else if (cart_item.quantity == 1) {
                removeFromCart(cart_item);
                totalValue -= cart_item.price;
                $(".sum-value").text(totalValue + ' грн.');
                orderNumber--;
                $(".count-label").text(orderNumber);
            }
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".delete").click(function(){

            removeFromCart(cart_item);
            totalValue -= cart_item.totalPrice;
            $(".sum-value").text(totalValue + ' грн.');
            orderNumber--;
            $(".count-label").text(orderNumber);

            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }



    Cart.forEach(showOnePizzaInCart);

}

$(".next-step-button").click(function () {
    createOrder();
})

function createOrder() {
    API.createOrder( {
        name: $("#inputName").val(),
        phone: $("#inputPhone").val(),
        order: Cart
    }), function (err, callback) {
        if (err) {
            alert("can't create order")
        } else {
            console.log(callback);
        }
    }
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.clearCart = clearCart;
exports.PizzaSize = PizzaSize;

exports.createOrder = createOrder;