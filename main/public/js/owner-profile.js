$(document).ready(function () {

    var saved = $('#saved').val();
    if (saved) {
        $('#modify-owner-compte-notification').fadeIn('slow');

        setTimeout(function () {
            $('#modify-owner-compte-notification').fadeOut('slow');
        }, 7000);
    }
});