$(document).ready(function () {
    if ($("#formLocataire").attr('data-type') == 'create') {
        $("#formLocataire").attr('action', '/creer-compte/create-colocation')
    } else if ($("#formLocataire").attr('data-type') == 'join') {
        $("#formLocataire").attr('action', '/creer-compte/join-colocation')
    }
    function equalCardsContainer() {
        var height = 0;
        $(".equal-cards-container .card").each(function () {
            if ($(this).height() > height) {
                height = $(this).height();
            }
        });
        $(".equal-cards-container .card").height(height)
    }

    equalCardsContainer();

    function onWindowResize() {
        $(window).resize($.throttle(function () {
            $(".equal-cards-container .card").height("auto");
            equalCardsContainer();
        }, 200))
    }

    onWindowResize()


    function formControlTouched() {
        $(".form-control").keyup(function (e) {
            if (e.target.value) {
                $(this).removeClass("form-control-untouched").removeClass("invalid")
            }
            else {
                $(this).addClass("form-control-untouched")
            }
        })
    }

    formControlTouched();

    // function formSubmit() {
    //     var forms = $("form");
    //     forms.each(function (index) {
    //         var currentForm = $(this);
    //         $(this).find(".submit").click(function (e) {
    //             e.preventDefault();
    //             currentForm.submit();
    //         });
    //     })
    // }
    //
    // formSubmit();

    $(".envoyer").click(function (e) {
        $("#errors").empty();
        //e.preventDefault();
        $(this).prop('disabled', true);
        $(this).attr('data-loading-text', "<i class='fa fa-circle-o-notch fa-spin'></i> Création en cours...")
        $(this).button('loading');
        if (validate()) {
            sendForm("/info-locataire", true)
        } else {
            $(".envoyer").prop('disabled', false)
            $(".envoyer").button('reset');
        }
    });

    $(".modify").click(function (e) {
        //e.preventDefault();
        $(this).prop('disabled', true);
        $(this).attr('data-loading-text', "<i class='fa fa-circle-o-notch fa-spin'></i> Création en cours...")
        $(this).button('loading');
        if (validate_form()) {
            sendForm("/locataire/modifier-mon-compte", false)
        } else {
            $(".modify").prop('disabled', false)
            $(".modify").button('reset');
        }
    });


    $(".file-link").click(function (e) {
        e.preventDefault();
        $('#link-info').modal('show');
    });
    $(".visit-link").click(function (e) {
        e.preventDefault();
        $('#link-info2').modal('show');
    });
    $(".linkPrevent").click(function (e) {
        e.preventDefault();
    });
    $(".closebtnaction").click(function (e) {
        e.preventDefault();
        $('#link-info').modal('hide');
        $('#link-info2').modal('hide');
    });


    $(".clearEmails").click(function () {
        $('.emailsList').val('');
        $('#confirm').modal('hide');
    });

    function sendForm(url, onSuccessNewPage) {
        $.ajax({
            url: url,
            type: "POST",
            data: new FormData($("#formLocataire")[0]),
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            success: function () {
                var url = window.location.href;
                var arr = url.split("/");
                var domain = arr[0] + "//" + arr[2];
                if (onSuccessNewPage) {
                    window.location.href = domain + "/compte-cree"
                } else {
                    $('#confirm').modal('show');
                    $(".envoyer").prop('disabled', false)
                    $(".envoyer").button('reset');
                    $(".modify").prop('disabled', false)
                    $(".modify").button('reset');
                }
            },
            error: function (data) {
                for (var i = 0; i < data.responseJSON.length; i++) {
                    $("#" + data.responseJSON[i].field).addClass("invalid")
                    $("#" + data.responseJSON[i].field + "-error").text(data.responseJSON[i].defaultMessage)
                    $("#" + data.responseJSON[i].field + "-error").show()
                    $("#errors").append("<span style='color: red'>Cette adresse email est déjà utilisée</span><br/>")
                }
                $(".envoyer").prop('disabled', false)
                $(".envoyer").button('reset');
                $(".modify").prop('disabled', false)
                $(".modify").button('reset');
            }
        });
    }

    $("#email").focus(function () {
        $("#email-error").hide();
    })
    $("#lastName").focus(function () {
        $("#lastName-error").hide();
    })
    $("#firstName").focus(function () {
        $("#firstName-error").hide();
    })


    function sendOwnerSubscriptionForm(e) {
        e.preventDefault();
        if (validate_form()) {
            $.ajax({
                url: "/subscription",
                type: "POST",
                data: new FormData($("#proprio_subscribe")[0]),
                processData: false,
                contentType: false,
                cache: false,
                success: function () {
                    $(".proprio_form_parent").hide();
                    $("#subscription_success").show();
                    $('#confirm').modal('show');
                },
                error: function () {
                    // Handle upload error
                    // ...
                }
            });
        }
    }

    $("#proprio_subscribe").submit(function (e) {
        sendOwnerSubscriptionForm(e);
    });
    $("img.submit").click(function (e) {
        sendOwnerSubscriptionForm(e);
    });

    function enableTooltips() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    enableTooltips();

    function addFileReaderInput() {
        $(".input-file-container").each(function () {
            var input = $(this).find(".input-file");
            var id = input.attr("id");
            var fileReader = $(this).find(".file-reader");

            $(this).find(".img,img").click(function () {
                fileReader.click()
            });
            input.click(function () {
                fileReader.click()
            });

            fileReader.change(function () {
                var value = $(this).val();
                var latestValue = "";
                for (var i = value.length; i > 0; i--) {
                    if (!/\\/.test(value[i])) {
                        if (value[i]) {
                            latestValue = latestValue + value[i];
                        }
                    }
                    else i = 0;
                }
                var result = "";
                for (var i = latestValue.length; i >= 0; i--) {
                    if (latestValue[i] !== undefined) {
                        result = result + latestValue[i];
                    }
                }

                input.val(result);
            });

        });
    }

    addFileReaderInput();

    $(".add_owner").click(function (e) {
        e.preventDefault();
        $(".add_owner").before($('<input type="email" autocomplete="true" class="emailsList form-control form-control-formatted form-control-untouched marg_top_10" placeholder="Email" name="emailsList" value="">'));
    });

    $(".change-link-input").click(function (e) {
        $(".file" + $(this).attr('data-id')).toggle()
    })


    $("#dossierButton").click(function (e) {
        $("#toggleInfo").collapse('toggle');
        $("#toggleInfo2").collapse('hide');
    })
    $("#garantButton").click(function (e) {
        $("#toggleInfo").collapse('hide');
        $("#toggleInfo2").collapse('toggle');
    })

    /*$('.files-input').each(function (i) {
     $(this).change(function () {
     createFileInputs(i, $(this));
     })
     })*/
    /*function createFileInputs(id, o) {
     var id1 = 'input-text' + id + '-1'
     var id2 = 'input-file' + id + '-1'
     var id3 = 'input-text' + id + '-2'
     var id4 = 'input-file' + id + '-2'
     var name = "";
     if (o.hasClass('guarantor-file')) {
     name = 'guarantor.quarantorFiles[' + (id - 5) + ']';
     } else {
     name = 'files[' + id + ']';

     }
     if (o.val() && o.val()) {
     if (!$("#" + id1).length) {
     o.parent().append('<input type="text" class="no-validate form-control form-control-formatted form-control-untouched input-file" placeholder="Ajouter un document" id="' + id1 + '" readonly="" style="margin-top: 10px;"/>')
     o.parent().append('<input type="file" id="' + id2 + '" class="no-validate hidden" accept="image/!*, .pdf" name="' + name + '"/>')
     $("#" + id1).click(function () {
     $('#' + id2).click();
     })
     }
     $("#" + id2).change(function () {
     if ($(this).val() && $(this).val()) {
     if (!$("#" + id3).length) {
     $(this).parent().append('<input type="text" class="no-validate form-control form-control-formatted form-control-untouched input-file" placeholder="Ajouter un document" id="' + id3 + '" readonly="" style="margin-top: 10px;"/>')
     $(this).parent().append('<input type="file" id="' + id4 + '" class="no-validate hidden" accept="image/!*, .pdf" name="' + name + '"/>')

     $("#" + id3).click(function () {
     $('#' + id4).click();
     })
     }
     $("#" + id1).val($(this).val().split('\\')[2]);
     $("#" + id4).change(function () {
     if ($(this).val() && $(this).val()) {
     $("#" + id3).val($(this).val().split('\\')[2]);
     } else {
     $("#" + id3).val("");
     }
     })

     } else {
     $("#" + id3).remove()
     $("#" + id4).remove()
     $("#" + id1).val("");
     }
     })

     } else {
     $("#" + id1).remove()
     $("#" + id2).remove()
     $("#" + id3).remove()
     $("#" + id4).remove()
     }
     }*/
    var cont = 0;
    $('.add-input').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        var name = 'files[' + id + ']';
        var div = $('#div-file-' + id);
        var text = 'input-texts' + cont;
        var file = 'input-files' + cont;
        var minus = 'minus' + cont;
        if (!$(this).hasClass('add-file-guarantor')) {
            div.append('<div href="" class="input-icon text-center info-icon input-file-container top-buffer"> <input data-id="' + id + '" id="' + text + '"type="text" class="form-control form-control-formatted form-control-untouched input-file" placeholder="Ajouter un document" readonly=""/> <input type="file" id="' + file + '" class="files-input hidden file-reader" accept="image/*, .pdf"  name="' + name + '"/> <a class="img info-icon text-alter"> <span id="' + minus + '" class="blue-cross fa fa-times"></span> </a> </div>')

        } else {
            div.append('<div href="" class="input-icon text-center info-icon input-file-container top-buffer"> <input data-id="' + id + '" id="' + text + '"type="text" class="form-control form-control-formatted form-control-untouched input-file guarantor" placeholder="Ajouter un document" readonly=""/> <input type="file" id="' + file + '" class="files-input hidden file-reader" accept="image/*, .pdf"  name="guarantor.' + name + '"/> <a class="img info-icon text-alter"> <span id="' + minus + '" class="blue-cross fa fa-times"></span> </a> </div>')

        }
        $("#" + text).click(function () {
            $('#' + file).click();
        })

        $("#" + file).change(function () {
            if ($(this).val() && $(this).val()) {
                $("#" + text).val($(this).val().split('\\')[2]);
            } else {
                $("#" + text).val("");
            }
        })
        cont++;

        var inputs = $('#div-file-' + id + ' input');

        if ($(inputs).length == 6) {
            $(this).attr('hidden', true);
        }
        var o = $(this)
        $('#' + minus).click(function (e) {
            e.preventDefault();
            $(this).parent().parent().remove();
            o.attr('hidden', false)
        })
    })

    $("#guarantor").click(function () {
        $(".info-guarantor").toggle()
    })


});

function validate_form() {
    $("#errors").empty();
    $("#create-tenant").prop('disabled', true);
    $("#create-tenant").attr('data-loading-text', "<i class='fa fa-circle-o-notch fa-spin'></i> Création en cours...")
    $("#create-tenant").button('loading');
    var fileNames = [
        "Pièce d'identité en cours de validité",
        "Justificatif de domicile",
        "Justificatif de situation professionnelle",
        "Avis d'imposition",
        "Justificatif de ressources"
    ];

    var isValid = true;
    $('input[type="text"]').each(function () {
        if ($(this).parent().parent().is(":visible")) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid")
                if ($(this).hasClass("guarantor")) {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span style='color: red'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    } else {
                        $("#errors").append("<span style='color: red'>Le champ " + $(this).attr("placeholder") + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    }

                } else {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span style='color: red'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant</span><br/>")

                    } else {

                        $("#errors").append("<span style='color: red'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
                    }
                }
            }
            else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    $('input[type="number"]').each(function () {
        if ($(this).parent().parent().is(":visible")) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid")
                $("#errors").append("<span style='color: red'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            }
            else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    $('input[type="password"]').each(function () {
        if ($(this).parent().parent().is(":visible")) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid")
                $("#errors").append("<span style='color: red'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            }
            else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('input[type="email"]').each(function () {
        if ($(this).parent().parent().is(":visible")) {
            if ($.trim($(this).val()) == '') {
                $(this).addClass("invalid")
                isValid = false;
                $("#errors").append("<span style='color: red'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else if (!filter.test($(this).val())) {
                isValid = false;
                $(this).addClass("invalid")
                $("#errors").append("<span style='color: red'>Votre adresse email n'est pas au bon format</span><br/>")

            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
        // if ($('input.checkbox_check').is(':checked')) {
    });

    var allowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'pdf'];
    $('input[type="file"]').each(function () {
        if ($(this).parent().parent().is(":visible") && !$(this).hasClass('no-validate')) {
            var value = $(this).val();
            file = value.toLowerCase(),
                extension = file.substring(file.lastIndexOf('.') + 1);

            if ($.inArray(extension, allowedExtensions) == -1) {
                $(this).addClass("invalid");
            } else {
                $(this).removeClass("invalid");
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    $("#create-tenant").prop('disabled', false)
    $("#create-tenant").button('reset');
    if ($('.invalid').length > 0) {
        return false
    }

    return isValid;

}

