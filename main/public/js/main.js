$(document).ready(function () {
    const ref = window.location.href;
    if (ref.includes('#quelles_pieces_sont_demandees_aux_locataires')) {
        $('#quelles_pieces_sont_demandees_aux_locataires').addClass('active');
    }
    if (ref.includes('#quelles_pieces_sont_demandees_aux_garants')) {
        $('#quelles_pieces_sont_demandees_aux_garants').addClass('active');
    }
    $("span[title]").click(function () {
        var $title = $(this).find(".title");
        if (!$title.length) {
            $(this).append(' <span class="title">' + $(this).attr("title") + '</span>');
        } else {
            $title.remove();
        }
    });
    $('#finishProcessButton').click(function (e) {
        e.preventDefault();
        var action = $('#processFileForm').attr('action') + '&finishProcess=true';
        $('#processFileForm').attr('action', action);
        $('#processFileForm').submit();
    });

    $('.submit-form-delete-example').click(function (e) {
        e.preventDefault();
        $(this).parent().submit();
    });
    $('.submit-form-delete-prospect').click(function (e) {
        e.preventDefault();
        $(this).parent().submit();
    });
    $(function () {
        $('[data-toggle="popover"]').popover()
    });

    $("#notificationDemandsVisitUtility").on('click', function (e) {
        $("#notificationDemandsVisit").trigger('click');
    });
    $("#notificationAfterVisitUtility").on('click', function (e) {
        $("#notificationAfterVisit").trigger('click');
    });
    if ($("#notificationDemandsVisit").is(":checked")) {
        $("#notificationDemandsVisitUtility").prop('checked', true);
    }
    if ($("#notificationAfterVisit").is(":checked")) {
        $("#notificationAfterVisitUtility").prop('checked', true);
    }
    $("#checkbox-switch").change(function () {
        var id = $(this).attr('data-id');
        window.location = "/agent/property/notification/" + id;
    });
    $(".modal-info-link").click(function (e) {
        e.preventDefault();
        var modal = $(".modal-info");
        mr.modals.showModal(modal);
    });
    $(".modal-tenant-validated-button").click(function (e) {
        e.preventDefault();
        var modal = $('.modal-tenant-validated');
        var number = $(this).attr("data-id");
        $("#modal-yes").attr("data-id", number);
        mr.modals.showModal(modal);
    });
    $("#modal-yes").click(function (e) {
        e.preventDefault();
        var number = $(this).attr("data-id");
        var modal = $('.modal-file');
        $(".file-modal").each(function () {
            $(this).attr("data-id", number);
        });
        mr.modals.showModal(modal);
    });
    $(".link-modal-connect").click(function (e) {
        e.preventDefault();
        var modal = $('.modal-connect');
        mr.modals.showModal(modal);
    });
    $("#finish-account-create").bind("modalClosed.modals.mr", function () {
        window.location.replace("/");
    });

    $(".tr-property").click(function (e) {
        if ($(e.target).is("a") || $(e.target).is("i")) {
            return;
        }
        var propertyId = $(this).attr("data-id");
        window.location.replace("/agent/property/" + propertyId);
    });
    $(".tr-property-table").click(function (e) {
        if ($(e.target).is("a") || $(e.target).is("i")) {
            return;
        }
        var prospectId = $(this).attr("data-id");
        $("div[id^='row-show-details']").removeClass('selected-prospect');
        $(this).addClass('selected-prospect');
        $("div[id^='details']").addClass('hidden');
        $('#details' + prospectId).removeClass('hidden');
    });
    if (document.cookie.indexOf("locatioCookie=true") < 0) {
        $("#cookie").fadeIn('slow');
        $("#hideCookie").click(function () {
            $("#cookie").fadeOut('slow');
            document.cookie = "locatioCookie=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        });
    }

    $("#disconnectButton").click(function (e) {
        e.preventDefault();
        document.cookie = "super_facile_cookies_message_dismissed=true; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
        $("#formLogout").submit();
    });

    // Javascript to enable link to tab
    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
    }

    $(".ing").click(function (e) {
        e.preventDefault();
    });
    $("#formLocataire").fadeIn("slow");
    if ($("#formLocataire").attr('data-type') === 'CREATE') {
        $("#formLocataire").attr('action', '/creer-compte/create-colocation')
    } else if ($("#formLocataire").attr('data-type') === 'JOIN') {
        $("#formLocataire").attr('action', '/creer-compte/join-colocation')
    }

    if ($(".dropdown-menu").length) {
        $(".dropdown-menu").on("show.bs.dropdown", function (event) {
            var src = $(event.relatedTarget)[0];
            src.dataset.toggle = "tab";
            src.dataset.target = "#properties,#no-title";
            src.tab("show");
            src.dataset.toggle = "dropdown";
            src.dataset.target = null;
        });
    }

    $("#email").focus(function () {
        $("#email-error").hide();
    });
    $("#lastName").focus(function () {
        $("#lastName-error").hide();
    });
    $("#firstName").focus(function () {
        $("#firstName-error").hide();
    });

    $("#messageForm").submit(function (e) {
        sendNewMessage(e, "/message/new", $(this), name, '');
    });

    function sendNewMessage(e, url, form, name, id, next) {
        e.preventDefault();
        $.ajax({
            url: url,
            type: "POST",
            data: new FormData(form[0]),
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                var message = $("#message" + id).val().replace(/(?:\r\n|\r|\n)/g, '<br/>');

                var html =
                    '<li>' +
                    '    <div class="comment">' +
                    '        <div class="comment__body w-100">' +
                    '            <h5 class="type--fine-print"> ' + name + ' </h5>' +
                    '' +
                    '            <div class="comment__meta">' +
                    '                <span> ' + data['creationDate'] + '</span>' +
                    '            </div>' +
                    '' +
                    '            <p> ' + message + ' </p>' +
                    '       </div>' +
                    '    </div>' +
                    '</li>';

                $("#messageArea" + id).prepend(html);
                $("#message" + id).val('');
                $("#messageArea" + id).animate({
                    scrollTop: $("#messageArea" + id)[0].scrollHeight
                });
                next && next();

            },
            error: function (data) {
                console.log("An error on upload has ocurred :(");
            }
        });

    }

    function enableTooltips() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    enableTooltips();

    var modal = GetURLParameter('modal');
    if (modal) {
        mr.modals.showModal('#info-modal');
    }

    var pathname = window.location.pathname;
    if (pathname.includes("processFile") || pathname.includes("show-file-with-error")) {
        $('.label-check').addClass("hidden");
    }
});


function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function validate_form() {
    $("#errors").empty();
    $('.invalid').each(function () {
        $(this).removeClass("invalid");
    });

    $("#create-tenant").prop('disabled', true);
    $("#create-tenant").removeClass('btn--primary');
    $("#create-tenant").addClass('btn--disabled');

    $("#create-tenant").attr('data-loading-text', "<i class='fa fa-circle-o-notch fa-spin'></i> Création en cours...");
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
        if ($(this).parent().parent().is(":visible") && $(this).is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                if ($(this).hasClass("guarantor")) {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span class='color--error'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    } else {
                        $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    }

                } else {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span class='color--error'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant</span><br/>")

                    } else {

                        $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
                    }
                }
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    $('input[type="number"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    $('input[type="checkbox"].checked-required').each(function () {
        var id = $(this)[0].id;
        var label = $('label[for="' + id + '"]');
        if ($(this).parent().parent().is(":visible") && !$(this).hasClass('no-validate')) {
            if (!$(this).is(":checked")) {
                isValid = false;

                label.addClass("invalid");
                $("#errors").append("<span class='color--error'>Veuillez cocher la case ci-dessus pour continuer</span><br/>")
            } else {
                label.removeClass("invalid");
            }
        } else {
            label.removeClass("invalid");
        }
    });

    $('input[type="password"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    var filter = /^([\w-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('input[type="email"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                $(this).addClass("invalid");
                isValid = false;
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else if (!filter.test($(this).val())) {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Votre adresse email n'est pas au bon format</span><br/>")

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
        if ($(this).parent().parent().is(":visible") && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            var value = $(this).val();

            if (value == '') {
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le document est nécessaire</span><br/>")
            }

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

    $("#create-tenant").removeClass('btn--disabled');
    $("#create-tenant").addClass('btn--primary');
    $("#create-tenant").prop('disabled', false);

    $("#create-tenant").button('reset');
    if ($('.invalid').length > 0) {
        return false;
    }

    if ($('#acceptVerification').length > 0 &&
        !$("#file4Generated").is(":checked") &&
        !$('#acceptVerification').is(":checked")) {

        $('#acceptVerification').addClass('invalid');
        $("#errors").append("<span class='color--error'>Veuillez cocher la case ci-dessus pour continuer</span><br/>");
        return false;
    }
    if ($('#acceptSharingInfoPartner').length > 0 &&
        !$('#acceptSharingInfoPartner').is(":checked")) {
        $('#acceptSharingInfoPartner').addClass('invalid');
        $("#errors").append("<span class='color--error'>Attention, vous devez cocher cette case pour pouvoir continuer</span><br/>");
        return false;
    }
    if (isValid) {
        $('#step5SubmitButton').hide();
        $('#loading').show();
    }
    return isValid;
}

function validateFormStep2And5() {
    $("#errors").empty();
    $('.invalid').each(function () {
        $(this).removeClass("invalid");
    });

    var cantEmpty = 0;
    /* if ($("#file5Generated").is(":checked")) {
         return true;
     }*/
    var size = $('input[type="file"]').length;
    $('input[type="file"]').each(function () {
        if ($(this).parent().is(":visible")) {
            var default_value = $(this).prop("defaultValue");
            if ($.trim($(this).val()) === '' && default_value === '') {
                cantEmpty++;
            }
        }
    });
    if (cantEmpty === size) {
        $('input[type="file"]').each(function () {
            $(this).addClass("invalid");
        });

        $("#errors").append("<span class='color--error'>Au moins un document est requis</span><br/>");
        return false;
    } else {
        $('#step5SubmitButton').hide();
        $('#loading').show();
        return true;
    }
}

function updateMessagesTenant() {
    $.ajax({
        url: '/message/listNews',
        type: 'get',
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                var html =
                    '<li>' +
                    '    <div class="comment"' +
                    '        <div class="comment__body">' +
                    '' +
                    '            <h5 class="type--fine-print"> Administrateur </h5>' +
                    '' +
                    '            <div class="comment__meta">' +
                    '                <span> ' + result[i]['creationDate'] + '</span>' +
                    '            </div>' +
                    '' +
                    '            <p> ' + result[i]['message'] + ' </p>' +
                    '       </div>' +
                    '    </div>' +
                    '</li>';

                // var html =
                //     '<li class="chat-message">' +
                //     '<div class="message">' +
                //     '<div class="avatar"> ' +
                //     '<i style="background-color: rgb(255, 86, 82);">A</i> ' +
                //     '</div>' +
                //     '<div class="container-message"> ' +
                //     '<div class="title-header">' +
                //     '<span>Administrateur' +
                //     '</span>' +
                //     '</div>' +
                //     '<div class="">' + result[i]['creationDate'] +
                //     '</div>' +
                //     '<div class="content message-admin">' +
                //     '<p>' + result[i]['message'] +
                //     '</p> ' +
                //     '</div> ' +
                //     '</div> ' +
                //     '</div>' +
                //     '</li>';
                $("#messageArea").prepend(html);
                $("#messageArea").animate({
                    scrollTop: $("#messageArea")[0].scrollHeight
                });
            }
        },
        error: function () {
            console.log('An error has ocurred when checking new messages');
        }
    })
}

function validate_form2() {
    $("#errors").empty();
    $('.invalid').each(function () {
        $(this).removeClass("invalid");
    });

    $("#create-tenant").prop('disabled', true);
    $("#create-tenant").removeClass('btn--primary');
    $("#create-tenant").addClass('btn--disabled');

    $("#create-tenant").attr('data-loading-text', "<i class='fa fa-circle-o-notch fa-spin'></i> Création en cours...");
    $("#create-tenant").button('loading');
    var fileNames = [
        "Pièce d'identité en cours de validité",
        "Justificatif de domicile",
        "Justificatif de situation professionnelle",
        "Avis d'imposition",
        "Justificatif de ressources"
    ];

    var isValid = true;
    $('#modifier-profile-form input[type="text"]').each(function () {
        if ($(this).parent().parent().is(":visible") && $(this).is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                if ($(this).hasClass("guarantor")) {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span class='color--error'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    } else {
                        $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant dans la partie garant (si vous n'avez pas de garant merci de décocher la case \"J'ai un garant\")</span><br/>")
                    }

                } else {
                    if ($(this).attr('data-id')) {
                        $("#errors").append("<span class='color--error'>Le champ " + fileNames[$(this).attr('data-id')] + " est manquant</span><br/>")

                    } else {

                        $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
                    }
                }
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    $('#modifier-profile-form input[type="number"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    $('#modifier-profile-form input[type="checkbox"].checked-required').each(function () {
        var id = $(this)[0].id;
        var label = $('label[for="' + id + '"]');
        if ($(this).parent().parent().is(":visible") && !$(this).hasClass('no-validate')) {
            if (!$(this).is(":checked")) {
                isValid = false;

                label.addClass("invalid");
                $("#errors").append("<span class='color--error'>Veuillez cocher la case ci-dessus pour continuer</span><br/>")
            } else {
                label.removeClass("invalid");
            }
        } else {
            label.removeClass("invalid");
        }
    });

    $('#modifier-profile-form input[type="password"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('#modifier-profile-form input[type="email"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                $(this).addClass("invalid");
                isValid = false;
                $("#errors").append("<span class='color--error'>Le champ " + $(this).attr("placeholder") + " est manquant</span><br/>")
            } else if (!filter.test($(this).val())) {
                isValid = false;
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Votre adresse email n'est pas au bon format</span><br/>")

            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
        // if ($('input.checkbox_check').is(':checked')) {
    });

    var allowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'pdf'];
    $('#modifier-profile-form input[type="file"]').each(function () {
        if ($(this).parent().parent().is(":visible") && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            var value = $(this).val();

            if (value == '') {
                $(this).addClass("invalid");
                $("#errors").append("<span class='color--error'>Le document est nécessaire</span><br/>")
            }

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

    $("#create-tenant").removeClass('btn--disabled');
    $("#create-tenant").addClass('btn--primary');
    $("#create-tenant").prop('disabled', false);

    $("#create-tenant").button('reset');
    if ($('.invalid').length > 0) {
        return false;
    }

    if ($('#acceptVerification').length > 0 &&
        !$("#file4Generated").is(":checked") &&
        !$('#acceptVerification').is(":checked")) {

        $('#acceptVerification').addClass('invalid');
        $("#errors").append("<span class='color--error'>Veuillez cocher la case ci-dessus pour continuer</span><br/>");
        return false;
    }

    return isValid;
}

function copyToClipboard(id) {
    var from = document.getElementById(id);
    var range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(from);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}

