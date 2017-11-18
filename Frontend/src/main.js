/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('../../Backend/data/Pizza_List');
    var API = require("./API");

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    function validateName() {
        var expr = $("#inputName").val();
        return expr.match(/^([a-zA-Zа-яА-Я]+|[a-zA-Zа-яА-Я]+[ ][a-zA-Zа-яА-Я]+|([a-zA-Zа-яА-Я]+[\-][a-zA-Zа-яА-Я]+))+$/);
    }

    function validatePhone() {
        var expr = $("#inputPhone").val();
        if (expr.match(/^0([0-9]{9})$/) || expr.match(/^\+380([0-9]{9})$/)) {
            return true;
        } else {
            return false;
        }
    }

    function validateAddress() {
        if ($("#inputAddress").val() === $("#order-summary-address").text()) {
            return true;
        } else {
            return false;
        }
    }

    $(".next-step-button").click(function () {
        if (validateName() && validatePhone() && validateAddress()) {
            API.createOrder({
                name: $("#inputName").val(),
                phone: $("#inputPhone").val(),
                address: $("#inputAddress").val(),
                order: require("./pizza/PizzaCart").getPizzaInCart(),
                total: parseInt($(".sum-value").text())
            }), function (err, server_data) {
                if (err) {
                    console.log(err);
                } else {
                    alert("order created!");
                    LiqPayCheckout.init({
                        data: server_data.data,
                        signature: server_data.signature,
                        embedTo: "#liqpay",
                        mode: "popup"	//	embed	||	popup
                    }).on("liqpay.callback", function(data){
                        console.log(data.status);
                        console.log(data);
                    }).on("liqpay.ready", function(data){
                        //	ready
                    }).on("liqpay.close", function(data){
                        //	close
                    });
                }
            }
        }
    })
});