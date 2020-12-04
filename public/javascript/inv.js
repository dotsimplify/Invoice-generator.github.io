
function roundNumber(number, decimals) {
    var newString; // The new rounded number
    decimals = Number(decimals);
    if (decimals < 1) {
        newString = (Math.round(number)).toString();
    } else {
        var numString = number.toString();
        if (numString.lastIndexOf(".") == -1) { // If there is no decimal point
            numString += "."; // give it one at the end
        }
        var cutoff = numString.lastIndexOf(".") + decimals; // The point at which to truncate the number
        var d1 = Number(numString.substring(cutoff, cutoff + 1)); // The value of the last decimal place that we'll end up with
        var d2 = Number(numString.substring(cutoff + 1, cutoff + 2)); // The next decimal, after the last one we want
        if (d2 >= 5) { // Do we need to round up at all? If not, the string will just be truncated
            if (d1 == 9 && cutoff > 0) { // If the last digit is 9, find a new cutoff point
                while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
                    if (d1 != ".") {
                        cutoff -= 1;
                        d1 = Number(numString.substring(cutoff, cutoff + 1));
                    } else {
                        cutoff -= 1;
                    }
                }
            }
            d1 += 1;
        }
        if (d1 == 10) {
            numString = numString.substring(0, numString.lastIndexOf("."));
            var roundedNum = Number(numString) + 1;
            newString = roundedNum.toString() + '.';
        } else {
            newString = numString.substring(0, cutoff) + d1.toString();
        }
    }
    if (newString.lastIndexOf(".") == -1) { // Do this again, to the new string
        newString += ".";
    }
    var decs = (newString.substring(newString.lastIndexOf(".") + 1)).length;
    for (var i = 0; i < decimals - decs; i++) newString += "0";
    //var newNumber = Number(newString);// make it a number if you like
    return newString; // Output the result to the form field (change for your purposes)
}

function update_total() {
    var total = 0;
    $('.price').each(function(i) {
        price = $(this).html();
        if (!isNaN(price)) total += Number(price);
    });
    var gst = total * 18 / 100;
    gst = parseFloat(gst.toFixed(2))
    $('#subtotal').html(total);
    $('#gst').html(gst)
    var totalAmount = total + gst;
    totalAmount = roundNumber(totalAmount, 2)
    $('#total').html(totalAmount);
    update_balance();
}

function update_balance() {
    var due = $("#total").html() - $("#paid").val();
    due = roundNumber(due, 2);

    $('.due').html(+due);
}

function update_price() {
    var row = $(this).parents('.item-row');
    var price = row.find('.cost').val() * row.find('.qty').val();
    price = roundNumber(price, 2);
    isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html(price);

    update_total();
}

function bind() {
    $(".cost").blur(update_price);
    $(".qty").blur(update_price);
}

$(document).ready(function() {

    $('input').click(function() {
        $(this).select();
    });

    $("#paid").blur(update_balance);

    $("#addrow").click(function() {
        $(".item-row:last").after('<tr class="item-row"><td> <button class="delete btn btn-warning btn-sm" title="Remove row">X</button></td><td><input type="text" name="itemName" class="form-control col-sm"></td><td><input type="text" name="description" class="form-control"></td><td><input type="text" class="cost text-right form-control" name="itemPrice"></td><td><input type="text" class="qty text-right form-control" name="qty"></td><td><textarea class="price text-center notext" form-control" name="Price" readonly></textarea></td></tr>');
        if ($(".item-row").length > 1) $(".delete").show();
        bind();
    });
    bind();
    $("#tbUser").on('click', '.delete', function() {
        $(this).closest('tr').remove();
        update_total();
        bind();
    });
});
