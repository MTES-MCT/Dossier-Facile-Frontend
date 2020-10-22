$(document).ready(function () {

    // Step 1
    $("#identity_card_button").on('click', function (e) {
        e.preventDefault();
        $("#identity_card").trigger('click');
    });

    $("#identity_card").change(function () {
        var filename = getFilenameFromPath($("#identity_card").val());
        $("#identity_card_filename").text(filename);
    });

    $("#identity_card_button2").on('click', function (e) {
        e.preventDefault();
        $("#identity_card2").trigger('click');
    });

    $("#identity_card2").change(function () {
        var filename = getFilenameFromPath($("#identity_card2").val());
        $("#identity_card_filename2").text(filename);
    });

    // Step 2
    $("#domicile_button").on('click', function (e) {
        e.preventDefault();
        $("#domicile").trigger('click');
    });

    $("#domicile").change(function () {
        var filename = getFilenameFromPath($("#domicile").val());
        $("#domicile_filename").text(filename);
    });

    // Step 4
    $("#impots_button0").on('click', function (e) {
        e.preventDefault();
        $("#impots0").trigger('click');
    });

    $("#impots0").change(function () {
        var filename = getFilenameFromPath($("#impots0").val());
        $("#impots_filename0").text(filename);
    });

    $("#impots_button1").on('click', function (e) {
        e.preventDefault();
        $("#impots1").trigger('click');
    });

    $("#impots1").change(function () {
        var filename = getFilenameFromPath($("#impots1").val());
        $("#impots_filename1").text(filename);
    });

    $("#impots_button2").on('click', function (e) {
        e.preventDefault();
        $("#impots2").trigger('click');
    });

    $("#impots2").change(function () {
        var filename = getFilenameFromPath($("#impots2").val());
        $("#impots_filename2").text(filename);
    });

    $("#impots_button3").on('click', function (e) {
        e.preventDefault();
        $("#impots3").trigger('click');
    });

    $("#impots3").change(function () {
        var filename = getFilenameFromPath($("#impots3").val());
        $("#impots_filename3").text(filename);
    });

    // Steps 3 and 5
    $("#file0").change(function () {
        var filename = getFilenameFromPath($("#file0").val());
        $("#file0_filename").text(filename);
    });
    $("#file1").change(function () {
        var filename = getFilenameFromPath($("#file1").val());
        $("#file1_filename").text(filename);
    });
    $("#file2").change(function () {
        var filename = getFilenameFromPath($("#file2").val());
        $("#file2_filename").text(filename);
    });

    $('input[type=radio][name="guarantor.typeFile4Guarantor"]').change(function () {
        if (this.value === 'TYPE1') {
            $("#divTextFile5").hide();
            $("#textFile5").removeAttr("required");
            $(".file4guarantor").show();
            $("#titleFile4Type1").show()
            $("#titleFile4Type2").hide()
        } else if (this.value === 'TYPE2') {
            $("#divTextFile5").show();
            $("#textFile5").attr("required", "required");
            $(".file4guarantor").hide();
            $("#titleFile4Type1").hide()
            $("#titleFile4Type2").show()
        }
    });
});

// Steps 3 and 5
function clickedFileButton(cont) {
    $("#file" + cont).trigger('click');
    return false;
}

function getFilenameFromPath(path) {
    var fileNameIndex = path.lastIndexOf("/") + 1;
    if (fileNameIndex <= 0)
        fileNameIndex = path.lastIndexOf("\\") + 1;

    return path.substr(fileNameIndex);
}