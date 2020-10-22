$(document).ready(function () {

    $("#acceptSharingInfoPartnerUtility").on('click', function (e) {
        if ($(this).is(":checked")) {
            var modal = $('#acceptSharingInfoPartnerModal');
            mr.modals.showModal(modal);
            $(this).prop("checked", false);
            $("#acceptSharingInfoPartner").prop("checked", false);
        } else {
            $(this).prop("checked", false);
            $("#acceptSharingInfoPartner").prop("checked", false);
        }
    });
    $('#confirmButtonInfoPartnerModal').click(function (e) {
        $("#acceptSharingInfoPartnerUtility").prop("checked", true)
        $("#acceptSharingInfoPartner").prop("checked", true);
    })

    var actionModalJoinTenant = $('#modalJoinTenant form').attr('action');
    $('.modifier-button').click(function (e) {
        e.preventDefault();
        var firstName = $(this).attr('data-firstName');
        var lastName = $(this).attr('data-lastName');
        var email = $(this).attr('data-email');
        var id = $(this).attr('data-id');
        var slug = $(this).attr('data-slug');
        $('#firstNameJoinTenant').val(firstName);
        $('#lastNameJoinTenant').val(lastName);
        $('#emailJoinTenant').val(email);
        $('#emailJoinTenant').attr('disabled', 'disabled');
        $('#titleModalJoinTenant').text('Modifier les information de mon colocataire');

        var modal = $('#modalJoinTenant');
        mr.modals.showModal(modal);
        $('#modalJoinTenant form').attr('action', '/locataire/editTenant/' + id + '/' + slug);
    });

    $('#modalJoinTenant').on("modalClosed.modals.mr", function () {
        $('#modalJoinTenant form').attr('action', actionModalJoinTenant);
        $('#firstNameJoinTenant').val('');
        $('#lastNameJoinTenant').val('');
        $('#emailJoinTenant').val('');
        $('#emailJoinTenant').removeAttr('disabled');
        $('#titleModalJoinTenant').text('Rentrez les informations de votre nouveau colocataire');
    });

    $('.edit-button').click(function (e) {
        var selector = '#' + $(this).attr('data-id');
        hideInputs();
        $(selector).attr('required', 'required');
        $(selector).parent().removeClass('hidden');
        $(selector).parent().parent().removeClass('hidden');
        var modal = $('#modalInformation');
        mr.modals.showModal(modal);
    });

    $('.verified-item').each(function () {
        this.innerHTML = this.innerText + ' <span>&#10004;</span>';
    });

    $('.verified-item').click(function () {
        var id = $(this).attr("data-id");
        if (id === "1") {
            var modal = $('#informationAction');
            mr.modals.showModal(modal);
        } else if (id === "2" || id === "3" || id === "4" || id === "5" || id === "6") {
            var pathname = window.location.pathname;
            var slug = pathname.split('/')[3];
            console.log(slug);
            window.location.replace("/registerTenant/backStep/" + slug + "?file=" + (id - 1));
            /*var modal = $('.modal-file');
            var number = parseInt(id) - 1;
            $(".file-modal").attr("data-id", number);
            mr.modals.showModal(modal);*/
        }

    });

    $('.modal-file-button').click(function (e) {
        e.preventDefault();
        var modal = $('.modal-file');
        var number = $(this).attr('data-id');
        $(".file-modal").each(function () {
            $(this).attr("data-id", number);
        });
        mr.modals.showModal(modal);
    });

    $('.file-modal').click(function (e) {
        var number = $(this).attr('data-id');
        var action = $(this).attr('data-action');
        $('#number').val(number);
        $('#fileActionUploadType').val(action);
        $('#file').click();
    });

    $('#file').change(function () {
        if ($(this).val() !== '') {
            var routeItems = window.location.href.split("/");
            var slug = routeItems[routeItems.length - 1];
            $.ajax({
                url: "/file/" + slug,
                type: "POST",
                data: new FormData($("#form-file")[0]),
                processData: false,
                contentType: false,
                cache: false,
                success: function (data) {
                    var notification = $('#success');
                    mr.notifications.showNotification(notification);
                    /*setTimeout(function () {
                        notification.removeClass('notification--reveal');
                        notification.removeClass('notification--dismissed')
                    }, 3000);*/
                    // var number = $("#form-file").find("#number").val();
                    // $("#link-file-" + number).attr("href", data);
                    // $($("#link-file-" + number).parent().children('i')[1]).attr('class', 'icon icon-Hour text-warning pull-right')
                },
                error: function () {
                    var notification = $('#error');
                    mr.notifications.showNotification(notification);
                }
            });
        }
    });

    $("#pensionUtility").on('click', function (e) {
        $("#pension").trigger('click');
    });
    $("#otherSalariesUtility").on('click', function (e) {
        $("#otherSalaries").trigger('click');
    });

});

function hideInputs() {
    $('#modalInformation form div div.input').each(function (e) {
        $(this).addClass('hidden');
    });
    $('#modalInformation form div div input').each(function (e) {
        $(this).removeAttr('required');
    });
}