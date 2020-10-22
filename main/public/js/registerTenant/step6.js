$(document).ready(function () {
    var defaultValueRadio = $('input[name=guarantorType]:checked').val();

    if (defaultValueRadio === 'LOCATIO') {
        $("#guarantorTypeConfirm").removeClass("hidden");
    } else {
        $('#guarantorTypeCheckBoxConfirme').prop("checked", true);
    }

    $('input[type=radio][name=guarantorType]').change(function () {
        if (this.value != defaultValueRadio) {
            if (this.value === 'LOCATIO') {
                $("#guarantorTypeConfirm").removeClass("hidden");
                $('#guarantorTypeCheckBoxConfirme').prop("checked", false);
            } else {
                $("#guarantorTypeConfirm").addClass("hidden");
                $('#guarantorTypeCheckBoxConfirme').prop("checked", true);
            }
            defaultValueRadio = $('input[name=guarantorType]:checked').val();
        }
    });

    $("#guarantorTypeCheckBoxConfirmeUtility").on('click', function (e) {
        $("#guarantorTypeCheckBoxConfirme").trigger('click');
    });
});