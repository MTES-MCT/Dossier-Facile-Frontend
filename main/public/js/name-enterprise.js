$(document).ready(function () {
    $("#nomEnterprise").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/locataire/super-facile/nom-entreprise-autocomplete",
                dataType: "json",
                data: {
                    key: request.term
                },
                success: function (data) {
                    response(data);
                }
            })
        },
        focus: function (event, ui) {
            $("#nomEnterprise").val(ui.item.name);
            return false;
        },
        select: function (event, ui) {
            $("#nomEnterprise").val(ui.item.name);
            return false;
        },
        minLength: 0
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.name + "</div>")
            .appendTo(ul);
    };


});