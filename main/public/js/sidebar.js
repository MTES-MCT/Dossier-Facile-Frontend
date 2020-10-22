var MAX_COPROSPECTS = 5;
var cant = 0;
var remainigCotenantSlots;

$(document).ready(function () {
    cant = $('.tenant-input').length;
    remainigCotenantSlots = MAX_COPROSPECTS - cant;

    if (remainigCotenantSlots <= 0) {
        $('#add-cotenant-prospect').removeClass('btn--primary');
        $('#add-cotenant-prospect').addClass('btn--disabled');
    }
    $('.booking-prospect').each(function (index) {
        $('#propertyId').val($(this).attr('data-propertyId'));
        $('#prospectId').val($(this).attr('data-prospectId'));
        $('#propertyName').val($(this).attr('data-propertyName'));
        $('#bookingProspectFirstName').val($(this).attr('data-firstName'));
        $('#bookingProspectLastName').val($(this).attr('data-lastName'));
        $('#hour').val('00:00');
        var modal = $('#bookingModal');
        mr.modals.showModal(modal);
    });

    $('.prospect-to-process').append('<span class="to-process-indicator"></span>');
    $('.prospect-to-process2').append('<span class="to-process-indicator2"></span>');

    $('#add-cotenant-prospect').on('click', function () {
        addColocataire();
    });

    $('#process-prospect').on('click', function () {
        processProspect();
    });

    $('#addProspectButton').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            //$(this).addClass('disabled');
            //$('#addProspectButtonAndBooking').addClass('disabled');
            $('#addProspectFormButton').click();
        }
    });

    $('#addProspectButtonAndBooking').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            //$(this).addClass('disabled');
            //$('#addProspectButton').addClass('disabled');
            $('#booking').val(true);
            $('#addProspectFormButton').click();
        }
    });

    $('#deleteProspectButton').on('click', function () {
        $('#deleteProspectFormButton').click();
    });

    $('#editProspectNoteButton').on('click', function () {
        $('#editProspectNoteFormButton').click();
    });

    $('#bookingButton').on('click', function () {
        $('#bookingFormButton').click();
    });

    $("a[id^='suppress']").on('click', function () {
        $('#delete').attr('action', $(this).attr('data-href'));
        var modal = $('#deleteProspectModal');
        mr.modals.showModal(modal);
    });

    $(".button-delete-property").click(function () {
        var id = $(this).data('id');
        $("#delete-form-property").attr('action', '/agent/property/' + id + '/delete');
        var modal = $('#deletePropertyModal');
        mr.modals.showModal(modal);
    });

    $(".button-modify-property").click(function () {
        var id = $(this).data('id');
        $("#edit-form-property").attr('action', '/agent/property/' + id);
        var modal = $('#modalEditProperty');
        mr.modals.showModal(modal);
    });


    $(".button-delete-agent-operator").click(function () {
        var id = $(this).data('id');
        $("#delete-form-agent-operator").attr('action', '/agent/mes-agents/' + id + '/delete');
        var modal = $('#deleteAgentOperatorModal');
        mr.modals.showModal(modal);
    });

    $('#button-create-agent-operator').click(function () {
        var modal = $('#modalCreateEditAgentOperator');
        mr.modals.showModal(modal);
    });

    $('.button-edit-agent-operator').click(function () {
        var modal = $('#modalCreateEditAgentOperator');
        var firstName = $(this).attr("data-firstName");
        var lastName = $(this).attr("data-lastName");
        var email = $(this).attr("data-email");
        var id = $(this).attr('data-id');
        $('#firstName').val(firstName);
        $('#lastName').val(lastName);
        $('#email').val(email);
        $('#formCreateEditAgentOperator').attr('action', '/agent/mes-agents/' + id);
        mr.modals.showModal(modal);
    });

    $("a[id^='edit-note']").on('click', function () {
        $('#edit-note-form').attr('action', $(this).attr('data-href'));
        $('#customMessage').val($(this).attr('data-value'));
        var modal = $('#editProspectNote');
        mr.modals.showModal(modal);
    });

    $('.modal-container').bind('modalClosed.modals.mr', function () {
        if (remainigCotenantSlots <= 0) {
            $('#add-cotenant-prospect').removeClass('btn--disabled');
            $('#add-cotenant-prospect').addClass('btn--primary');
        }
        remainigCotenantSlots = MAX_COPROSPECTS;
        cant = 0;
        $('#data-join-tenant').empty();
        $('#prospectFirstName').val('');
        $('#prospectLastName').val('');
        $('#prospectEmail').val('');
        $('#prospectPhone').val('');
        $('#prospectSalary').val('0');
        $('#prospectSituation').prop('selectedIndex', 0);
        $('#prospectGuarantor').prop('selectedIndex', 0);
        $('#prospectProperty').prop('selectedIndex', 0);
        $('#addProspectButtonAndBooking').removeClass('disabled');
        $('#addProspectButton').removeClass('disabled');
    });

    $('#select-prospects').on('click', function () {
        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
            $('#select-properties').removeClass('selected');
            $('#selected-entity').val('prospect');
        }
    });

    $('#select-properties').on('click', function () {
        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
            $('#select-prospects').removeClass('selected');
            $('#selected-entity').val('property');
        }
    });

    $("#searchBox").autocomplete({
        source: function (request, response) {
            var entity = $('#selected-entity').val();
            $.ajax({
                url: "/agent/search",
                dataType: "json",
                data: {
                    key: request.term,
                    entity: entity,
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        select: function (event, ui) {
            var entity = $('#selected-entity').val();
            if (entity === 'property') {
                window.location = '/agent/property/' + ui.item.id;
            } else {
                window.location = '/agent/search-result?key=' + ui.item.value;
            }
        },
        minLength: 2
    });

    $("#prospectLastName").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/prospect/name",
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
            $("#prospectLastName").val(ui.item.lastName);
            return false;
        },
        select: function (event, ui) {
            $("#prospectLastName").val(ui.item.lastName);
            $("#prospectFirstName").val(ui.item.firstName);
            $("#prospectEmail").val(ui.item.email);
            $("#prospectPhone").val(ui.item.phone);
            $("#prospectSituation option").filter(function () {
                return $(this).text() === ui.item.tenantSituation;
            }).prop("selected", true);
            $("#salary").val(ui.item.salary);
            $("#prospectGuarantor").val(ui.item.guarantor);
            $("#prospectProperty option").filter(function () {
                return $(this).text() === ui.item.propertyName
            }).prop("selected", true);
            return false;
        },
        minLength: 2
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.lastName + " (" + item.firstName + ")" + "</div>")
            .appendTo(ul);
    };

    $("a[id^='show-interest'], a[id^='wait'], a[id^='mute'], a[id^='unmute']").on('click', function () {
        $('#prospect-action').attr('action', $(this).attr('data-href'));
        $('#prospectActionFormButton').click();
    });

    $("a[id^='book']").on('click', function () {
        $('#propertyId').val($(this).attr('data-propertyId'));
        $('#prospectId').val($(this).attr('data-prospectId'));
        $('#propertyName').val($(this).attr('data-propertyName'));
        $('#bookingProspectFirstName').val($(this).attr('data-firstName'));
        $('#bookingProspectLastName').val($(this).attr('data-lastName'));
        $('#hour').val('00:00');
        var modal = $('#bookingModal');
        mr.modals.showModal(modal);
    });

    $('#visitDate').datepicker({dateFormat: 'dd-mm-yy'});

    $('#hour').clockpicker({
        default: 'now',
        placement: 'bottom',
        align: 'left',
        donetext: 'Done',
        autoclose: false,
        vibrate: true,
        fromnow: 0
    });

    $('.order-column').on('click', function (e) {
        var arr = window.location.pathname.split('?');
        var path = arr[0];
        var prospect_id;
        if (arr.length > 1) {
            var vars = arr[1].split('&');
            for (var i = 0; i < vars.length; i++) {
                if (vars[i].indexOf('prospect_id') >= 0) {
                    prospect_id = vars[i].split('=')[1];
                }
                // if (vars[i].indexOf('order_by') >= 0) {
                //     order_by = vars[i].split('=')[1];
                // }
            }
        }
        if (prospect_id) {
            path += '?prospect_id=' + prospect_id;
        }
        var order_by;
        if ($(this).hasClass('first-name-column')) {
            order_by = 'prenom' + ($(this).children(":first").hasClass('order-up') ? 'down' : 'up');
        }
        if ($(this).hasClass('last-name-column')) {
            order_by = 'nom' + ($(this).children(":first").hasClass('order-up') ? 'down' : 'up');
        }
        if ($(this).hasClass('salary-column')) {
            order_by = 'salary' + ($(this).children(":first").hasClass('order-up') ? 'down' : 'up');
        }
        if (order_by) {
            if (prospect_id) {
                path += '&';
            } else {
                path += '?';
            }
            path += 'order_by=' + order_by;
        }
        window.location = path;
    });
});

function addColocataire() {
    if (remainigCotenantSlots <= 0)
        return false;

    var html = '<div id="tenant-div' + cant + '" class="row">' +
        '           <div class="col-6">' +
        '               <div class="text-left mt-4">' +
        '                   <span> Prénom : </span>' +
        '                   <input type="text" autocomplete="true" id="coProspectFirstName_' + cant + '" ' +
        '                       placeholder="Ex : Jean-Michel" class="small add-prospect first-name validation-required" ' +
        '                       name="coProspects[' + cant + '].firstName"/>' +
        '               </div>' +
        '' +
        '               <div class="text-left">' +
        '                   <span> Nom : </span>' +
        '                   <input type="text" autocomplete="true" id="coProspectLastName_' + cant + '" ' +
        '                       placeholder="Ex : Dupont" class="small add-prospect last-name validation-required"' +
        '                       name="coProspects[' + cant + '].lastName"/>' +
        '               </div>' +
        '           </div>' +
        '           <div class="col-6">' +
        '               <div class="text-left mt-4">' +
        '                   <span> Email : </span>' +
        '                   <input type="email" id="coProspectEmail_' + cant + '" autocomplete="off" ' +
        '                       placeholder="Ex : Jean-Michel@exemple.fr" class="small add-prospect email validation-required"' +
        '                       name="coProspects[' + cant + '].email"/>' +
        '               </div>' +
        '' +
        '               <div class="text-left mt-4">' +
        '                   <fieldset id="less-tenant-button-fieldset">' +
        '                       <a class="btn btn--disabled btn--icon px-3 less-tenant-button" href="javascript:void(0)" data-id="' + cant + '" onclick="return delColocataire(' + cant + ');">' +
        '                            <span class="btn__text pl-5">' +
        '                             <i class="icon-Remove-User"></i> Supprimer un colocataire' +
        '                            </span>' +
        '                       </a>' +
        '                   </fieldset>' +
        '               </div>' +
        '           </div>' +
        '       </div>';

    $("#data-join-tenant").append(html);
    cant++;
    remainigCotenantSlots--;

    if (remainigCotenantSlots === 0) {
        $("#add-cotenant-prospect").removeClass('btn--primary');
        $("#add-cotenant-prospect").addClass('btn--disabled');
    }
    return false;
}

function delColocataire(index) {
    var id = '#tenant-div' + index;
    for (var i = index + 1; i < cant; i++) {
        $('#tenant-div' + i).find('#coProspectFirstName_' + i).attr('name', 'coProspects[' + (i - 1) + '].firstName');
        $('#tenant-div' + i).find('#coProspectLastName_' + i).attr('name', 'coProspects[' + (i - 1) + '].lastName');
        $('#tenant-div' + i).find('#coProspectEmail_' + i).attr('name', 'coProspects[' + (i - 1) + '].email');
        $('#tenant-div' + i).attr('id', 'tenant-div' + (i - 1));
    }
    $(id).remove();
    cant--;
    remainigCotenantSlots++;

    $("#add-cotenant-prospect").removeClass('btn--disabled');
    $("#add-cotenant-prospect").addClass('btn--primary');

    return false;
}

function validateFormByClass(customClass) {
    $('.' + customClass + '.invalid').each(function () {
        $(this).removeClass("invalid");
    });

    var isValid = true;
    $('input.' + customClass + '[type="text"]').each(function () {
        if ($(this).parent().parent().is(":visible") && $(this).is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    $('input.' + customClass + '[type="number"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid");
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });

    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('input.' + customClass + '[type="email"]').each(function () {
        if ($(this).parent().parent().is(":visible")
            && !$(this).hasClass('no-validate') && !$(this).hasClass('special-validation')) {
            if ($.trim($(this).val()) == '' || !filter.test($(this).val())) {
                isValid = false;
                $(this).addClass("invalid");
            } else {
                $(this).removeClass("invalid")
            }
        } else {
            $(this).removeClass("invalid")
        }
    });
    return isValid;
}

function processProspect() {
    $.ajax({
        url: "/agent/nextProspectToProcess",
        dataType: "json",
        type: "GET",
        success: function (prospectId) {
            window.location = '/agent/prospect/' + prospectId;
        }
    });
}