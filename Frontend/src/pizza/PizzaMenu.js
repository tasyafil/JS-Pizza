/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var filteredPizzas = 0;

var PizzaFilters = {
    Meat: "м'ясні",
    Pineapple: "з ананасами",
    Mushroom: "з грибами",
    Seafood: "з морепродуктами",
    Vegan: "вега"
}

$("#meat").click(function () {
    filterPizza("м'ясні");
    $(".all-pizzas").text("М'ясні піци");
    $(".pizza-number").text(filteredPizzas);
    filteredPizzas = 0;
})

$("#pineapple").click(function () {
    filterPizza("з ананасами");
    $(".all-pizzas").text("Піци з ананасами");
    $(".pizza-number").text(filteredPizzas);
    filteredPizzas = 0;
})

$("#mushroom").click(function () {
    filterPizza("з грибами");
    $(".all-pizzas").text("Піци з грибами");
    $(".pizza-number").text(filteredPizzas);
    filteredPizzas = 0;
})

$("#seafood").click(function () {
    filterPizza("з морепродуктами");
    $(".all-pizzas").text("Піци з морепродуктами");
    $(".pizza-number").text(filteredPizzas);
    filteredPizzas = 0;
})

$("#vegan").click(function () {
    filterPizza("вега");
    $(".all-pizzas").text("Вегетаріанські піци");
    $(".pizza-number").text(filteredPizzas);
    filteredPizzas = 0;
})

$("#all").click(function () {
    initialiseMenu();
    $(".all-pizzas").text("Усі піци");
    $(".pizza-number").text(8);
    filteredPizzas = 0;
})

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big, pizza.big_size.price);
        });

        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small, pizza.small_size.price);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        for (var i = 0; i < pizza.filters.length; i++) {
            if (pizza.filters[i] == filter) {
                pizza_shown.push(pizza);
                filteredPizzas++;
            }
        }

        //TODO: зробити фільтри

    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
exports.PizzaFilters = PizzaFilters;