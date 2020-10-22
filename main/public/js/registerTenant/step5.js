$(document).ready(function () {

    // Step 1
    $("#step1_button_1").on('click', function (e) {
        e.preventDefault();
        $("#step1_input_1").trigger('click');
    });
    $("#step1_button_2").on('click', function (e) {
        e.preventDefault();
        $("#step1_input_2").trigger('click');
    });

    $("#step1_input_1").change(function () {
        var filename = getFilenameFromPath($("#step1_input_1").val());
        $("#step1_input_1_filename").text(filename);
    });
    $("#step1_input_2").change(function () {
        var filename = getFilenameFromPath($("#step1_input_2").val());
        $("#step1_input_2_filename").text(filename);
    });


    // Step 2
    $("#step2_button_1").on('click', function (e) {
        e.preventDefault();
        $("#step2_input_1").trigger('click');
    });
    $("#step2_button_2").on('click', function (e) {
        e.preventDefault();
        $("#step2_input_2").trigger('click');
    });
    $("#step2_button_3").on('click', function (e) {
        e.preventDefault();
        $("#step2_input_3").trigger('click');
    });

    $("#step2_input_1").change(function () {
        var filename = getFilenameFromPath($("#step2_input_1").val());
        $("#step2_input_1_filename").text(filename);
    });
    $("#step2_input_2").change(function () {
        var filename = getFilenameFromPath($("#step2_input_2").val());
        $("#step2_input_2_filename").text(filename);
    });
    $("#step2_input_3").change(function () {
        var filename = getFilenameFromPath($("#step2_input_3").val());
        $("#step2_input_3_filename").text(filename);
    });


    // Step 3

    var file3Count = $("#work-document-container").children().length;

    $("#add-work-document").on('click', function (e) {
        if (file3Count < 10) {
            $("#work-document-container").append('<br\>');
            var html = '<div class="row">' +
                '<div class="col-md-12">' +
                '<input type="file" class="input-file hidden" accept="image/*, .pdf" name="files[0]" onchange="return changeFile(' + file3Count + ')" id="step3_input_' + file3Count + '"/>' +
                '<a class="btn btn--primary btn--icon" href="#" onclick="return pickFile(' + file3Count + ');">' +
                '<span class="btn__text">' +
                '<i class="icon-Add-File"></i> Ajouter un document</span>' +
                '</a>' +
                '<span class="ml-3 my-auto" id="step3_filename_' + file3Count + '"></span>' +
                '</div>' +
                '</div>';
            file3Count++;
        }
        $("#work-document-container").append(html);
    });

    // Step 4
    $("#step4_button").on('click', function (e) {
        e.preventDefault();
        $("#step4_input").trigger('click');
    });

    $("#step4_input").change(function () {
        var filename = getFilenameFromPath($("#step4_input").val());
        $("#step4_filename").text(filename);
    });
    $("#step4_button0").on('click', function (e) {
        e.preventDefault();
        $("#step4_input0").trigger('click');
    });

    $("#step4_input0").change(function () {
        var filename = getFilenameFromPath($("#step4_input0").val());
        $("#step4_filename0").text(filename);
    });
    $("#step4_button1").on('click', function (e) {
        e.preventDefault();
        $("#step4_input1").trigger('click');
    });

    $("#step4_input1").change(function () {
        var filename = getFilenameFromPath($("#step4_input1").val());
        $("#step4_filename1").text(filename);
    });
    $("#step4_button2").on('click', function (e) {
        e.preventDefault();
        $("#step4_input2").trigger('click');
    });

    $("#step4_input2").change(function () {
        var filename = getFilenameFromPath($("#step4_input2").val());
        $("#step4_filename2").text(filename);
    });

    // Step 5
    $("#step5_button_1").on('click', function (e) {
        e.preventDefault();
        $("#step5_input_1").trigger('click');
    });
    $("#step5_button_2").on('click', function (e) {
        e.preventDefault();
        $("#step5_input_2").trigger('click');
    });
    $("#step5_button_3").on('click', function (e) {
        e.preventDefault();
        $("#step5_input_3").trigger('click');
    });

    $("#step5_input_1").change(function () {
        var filename = getFilenameFromPath($("#step5_input_1").val());
        $("#step5_input_1_filename").text(filename);
    });
    $("#step5_input_2").change(function () {
        var filename = getFilenameFromPath($("#step5_input_2").val());
        $("#step5_input_2_filename").text(filename);
    });
    $("#step5_input_3").change(function () {
        var filename = getFilenameFromPath($("#step5_input_3").val());
        $("#step5_input_3_filename").text(filename);
    });

    // ------------------------------------------------------------------

    $("#file4GeneratedUtility").on('click', function (e) {
        $("#file4Generated").trigger('click');
    });

    $("#acceptVerificationUtility").on('click', function (e) {
        $("#acceptVerification").trigger('click');
    });

    $("#causeFile4Generated").toggle();

    $("#file4Generated").change(function (e) {
        $("#checkboxAcceptVerification").toggle();
        $(".inputFile4").toggle();
        $("#causeFile4Generated").toggle();
        $("#impot-image").toggle();

        $("#acceptVerification").prop('checked', this.checked);

        if ($("#file4Generated").is(":checked")) {
            $('#errors').empty();
            $("#step4_input").addClass('no-validate');

            $('.invalid').each(function () {
                $(this).removeClass('invalid');
            });

            $("#step4_input").val('');
            $("#progress").hide();
            if ($('#textFile4').is(":visible")) {
                $("#textFile4").attr("required", "required");
            }
        } else {
            $("#step4_input").removeClass('no-validate');
            $("#progress").show();
            $("#textFile4").removeAttr("required");
        }
    });

    $('input[type=radio][name=typeFile5]').change(function () {
        if (this.value === 'TYPE1') {
            $("#divTextFile5").hide();
            $("#textFile5").removeAttr("required");
            $("#file5file3").show();
        } else if (this.value === 'TYPE2') {
            $("#divTextFile5").show();
            $("#textFile5").attr("required", "required");
            $("#file5file3").hide();
        }
    });
    $('input[type=radio][name=causeFile4Generated]').change(function () {
        if (this.value === 'FOREIGNER') {
            $("#divTextFile4").hide();
            $("#textFile4").removeAttr("required");
            // $("#file5file3").show();
        } else if (this.value === 'CHILD') {
            $("#divTextFile4").hide();
            $("#textFile4").removeAttr("required");
        } else if (this.value === 'OTHER') {
            $("#divTextFile4").show();
            $("#textFile4").attr("required", "required");
        }
    });
});

function getFilenameFromPath(path) {
    var fileNameIndex = path.lastIndexOf("/") + 1;
    if (fileNameIndex <= 0)
        fileNameIndex = path.lastIndexOf("\\") + 1;

    return path.substr(fileNameIndex);
}

function pickFile(index) {
    $("#step3_input_" + index).trigger('click');
    return false;
}

function changeFile(index) {
    var filename = getFilenameFromPath($("#step3_input_" + index).val());
    $("#step3_filename_" + index).text(filename)
}