$(document).ready(function () {


    // Step 1
    $(".guarantor-file-button").on('click', function (e) {
        e.preventDefault();
        $(this).parent().find(".guarantor-file-input").trigger('click');
    });

    $(".guarantor-file-input").each(function () {
        $(this).change(function () {
            var filename = getFilenameFromPath($(this).val());
            $(this).parent().children(".my-auto").text(filename)
        });
    });


    window.defaultValueRadio = $('input[name=guarantorType]:checked').val();

    if (window.defaultValueRadio === 'LOCATIO') {
        $(".classic-guarantor-name").removeClass('hidden');
    }

    $('input[type=radio][name=guarantorType]').change(function () {
        $("#file-errors").empty();
        if (this.value === 'NONE') {
            $(".classic-guarantor-name").addClass('hidden');
            $(".classic-guarantor-files").addClass('hidden');
            $(".visale-guarantor-form").addClass('hidden');
        }
        if (this.value === 'LOCATIO') {
            $(".classic-guarantor-name").removeClass('hidden');

            if (window.defaultValueRadio !== 'LOCATIO') {
                $(".classic-guarantor-files").removeClass('hidden');
            }

            $(".visale-guarantor-form").addClass('hidden');
        }
        if (this.value === 'VISALE') {
            $(".classic-guarantor-name").addClass('hidden');
            $(".classic-guarantor-files").addClass('hidden');

            if (window.defaultValueRadio !== 'VISALE') {
                $(".visale-guarantor-form").removeClass('hidden');
            }
        }
    });


});

function notEmptyFiles() {
    var checkedRadio = $('input[name=guarantorType]:checked').val();
    $("#file-errors").empty();
    if (checkedRadio === 'LOCATIO') {
        if (window.defaultValueRadio === 'LOCATIO') {
            return validate_form2();
        }
        var empty = false;
        $('.classic-guarantor-form').find('input[type="file"]').each(function () {
            if ($.trim($(this).val()) === '') {
                empty = true;
            }
        });
        if (empty) {
            $("#file-errors").append("<span class='color--error'>Attention: Tous les documents sont nécessaire !</span><br/>");
            validate_form2();
            return false;
        } else {
            return validate_form2();
        }
    } else if (checkedRadio === 'VISALE') {
        if (window.defaultValueRadio === 'VISALE') {
            return validate_form2();
        }
        var empty = false;
        $('.visale-guarantor-form').find('input[type="file"]').each(function () {
            if ($.trim($(this).val()) === '') {
                empty = true;
            }
        });
        if (empty) {
            $("#file-errors").append("<span class='color--error'>Attention: Tous les documents sont nécessaire !</span><br/>");
            validate_form2();
            return false;
        } else {
            return validate_form2();
        }
    } else {
        return validate_form2();
    }
}

function getFilenameFromPath(path) {
    var fileNameIndex = path.lastIndexOf("/") + 1;
    if (fileNameIndex <= 0)
        fileNameIndex = path.lastIndexOf("\\") + 1;

    return path.substr(fileNameIndex);
}