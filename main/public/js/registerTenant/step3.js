var cant = 1;
var remainigCotenantSlots;
var offset = 1;

function setFieldsForCreate() {
    if ($('.tenant-input').length >= 5) {
        return;
    }

    validate = 'validation-required';

    cant = 1;
    remainigCotenantSlots = 5 - ($('.tenant-input').length + cant);

    var buttonsHtml =
        '       <div class="col-md-12 pt-4 mb-3 d-flex flex-column flex-md-row" id="tenant-buttons">' +
        '           <div class="mb-2 mb-md-0 mr-md-3">' +
        '               <fieldset id="plus-tenant-button-fieldset">' +
        '                   <a class="btn btn--primary btn--icon px-3" href="#" id="plus-tenant-button" onclick="return addColocataire();">' +
        '                       <span class="btn__text pl-5">' +
        '                           <i class="icon-Add-User"></i> Ajouter un colocataire' +
        '                       </span>' +
        '                   </a>' +
        '               </fieldset>' +
        '           </div>' +
        '' +
        '           <div>' +
        '               <fieldset id="less-tenant-button-fieldset">' +
        '                   <a class="btn btn--disabled btn--icon px-3" href="#" id="less-tenant-button" onclick="return delColocataire();">' +
        '                       <span class="btn__text pl-5">' +
        '                           <i class="icon-Remove-User"></i> Supprimer un colocataire' +
        '                       </span>' +
        '                   </a>' +
        '               </fieldset>' +
        '           </div>' +
        '       </div>';

    var html = '<div id="tenant-div' + cant + '" class="row">' +
        '           <div class="col-12 text-left mt-4">' +
        '                   <span> Prénom de votre colocataire : </span>' +
        '                   <input type="text" autocomplete="true" id="firstName" ' +
        '                       placeholder="Ex : Jean-Michel" class="small ' + validate + '" ' +
        '                       name="tenants[1].firstName"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Nom de votre colocataire : </span>' +
        '               <input type="text" autocomplete="true" id="lastName" ' +
        '                   placeholder="Ex : Dupont" class="small ' + validate + '"' +
        '                   name="tenants[1].lastName"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Email de votre colocataire : </span>' +
        '               <input type="email" id="email" autocomplete="off" ' +
        '                   placeholder="Ex : Jean-Michel@exemple.fr" class="small ' + validate + '"' +
        '                   name="tenants[1].email"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Salaire net mensuel de votre colocataire : </span>' +
        '               <input type="number" id="salary" autocomplete="true" ' +
        '                   placeholder="Ex : 1000&euro;" class="small ' + validate + '"' +
        '                   name="tenants[1].salary"/>' +
        '           </div>' +
        '       </div>';

    $("#data-join-tenant").append(html);
    $("#data-join-tenant-buttons").append(buttonsHtml);
    $("#data-tenant-exist").removeClass("hidden");

    $('#plus-tenant-button-fieldset').attr('disabled', false);
    $("#plus-tenant-button").removeClass("btn--disabled");
    $("#plus-tenant-button").addClass("btn--primary");

    if ($('.tenant-input').length == 0)
        $('#less-tenant-button-fieldset').attr('disabled', true);
    else {
        $("#less-tenant-button-fieldset").attr('disabled', false);
        $("#less-tenant-button").removeClass('btn--disabled');
        $("#less-tenant-button").addClass('btn-orange');
    }

    if (remainigCotenantSlots <= 0) {
        $('#plus-tenant-button-fieldset').attr('disabled', true);

        $("#plus-tenant-button").removeClass('btn--primary');
        $("#plus-tenant-button").addClass('btn--disabled');
    }
}

$(document).ready(function () {
    $('input[type=radio][name="tenants[0].tenantType"]').change(function () {
        $("#data-join-tenant").empty();
        $("#data-join-tenant-buttons").empty();
        $("#data-tenant-exist").addClass("hidden");

        if (this.value === 'CREATE') {
            setFieldsForCreate();
        } else if (this.value === 'COUPLE') {
            var html2 = '<div class="row"><div class="col-md-12 text-left">\n    <span> Prénom du conjoint : </span>\n    <input type="text" autocomplete="true" id="firstName"\n           placeholder="Ex : Jean-Michel" class="small validate-required"\n           name="tenants[1].firstName"/>\n</div>\n\n<div class="col-md-12 text-left">\n    <span class="font"> Nom du conjoint : </span>\n    <input type="text" autocomplete="true" id="lastName"\n           placeholder="Ex : Dupont" class="small validate-required"\n           name="tenants[1].lastName"/>\n</div>\n\n<div class="col-md-12 text-left">\n    <span> Email du conjoint : </span>\n    <input type="email" id="email" autocomplete="off"\n           placeholder="Ex : Jean-Michel@exemple.fr" class="small validate-required"\n           name="tenants[1].email"/>\n</div>\n\n<div class="col-md-12 text-left">\n    <span class="font"> Salaire net mensuel du conjoint : </span>\n    <input type="number" id="salary" autocomplete="true"\n           placeholder="Ex : 1000&euro;" class="small validate-required"\n           name="tenants[1].salary"/>\n</div></div>';
            $("#data-join-tenant").append(html2);
        } else {
            cant = 1;
        }
    });

    if ($('input:radio:checked').length > 0) {
        if ($('input:radio:checked').attr('data-id') === "ALONE") {
            $("#data-join-tenant").empty();
            $("#data-join-tenant-buttons").empty();
            $("#plus-tenant-button").addClass("hidden");
            $("#data-tenant-exist").addClass("hidden");
            cant = 1;
        } else if ($('input:radio:checked').val() === 'CREATE') {
            setFieldsForCreate();
        }
    }

    if ($('.tenant-input').length != 0)
        offset = 0;
});

function addColocataire() {
    if (cant > 5 || remainigCotenantSlots <= 0)
        return false;

    ++cant;
    --remainigCotenantSlots;
    validationGroup = cant;
    var html = '<div id="tenant-div' + cant + '" class="row">' +
        '           <div class="col-12 text-left mt-4">' +
        '               <span> Prénom de votre colocataire : </span>' +
        '               <input type="text" autocomplete="true" id="firstName" ' +
        '                   placeholder="Ex : Jean-Michel" class="small validation-required"' +
        '                   name="tenants[' + cant + '].firstName"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Nom de votre colocataire : </span>' +
        '               <input type="text" autocomplete="true" id="lastName" ' +
        '                   placeholder="Ex : Dupont" class="small validation-required"' +
        '                   name="tenants[' + cant + '].lastName"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Email de votre colocataire : </span>' +
        '               <input type="email" id="email" autocomplete="off" ' +
        '                   placeholder="Ex : Jean-Michel@exemple.fr" class="small validation-required"' +
        '                   name="tenants[' + cant + '].email"/>' +
        '           </div>' +
        '' +
        '           <div class="col-12 text-left">' +
        '               <span> Salaire net mensuel de votre colocataire : </span>' +
        '               <input type="number" id="salary" autocomplete="true" ' +
        '                   placeholder="Ex : 1000&euro;" class="small validation-required"' +
        '                   name="tenants[' + cant + '].salary"/>' +
        '           </div>' +
        '       </div>';

    $("#data-join-tenant").append(html);

    if (remainigCotenantSlots <= 0) {
        $('#plus-tenant-button-fieldset').attr('disabled', true);

        $("#plus-tenant-button").removeClass('btn--primary');
        $("#plus-tenant-button").addClass('btn--disabled');
    }
    $("#less-tenant-button-fieldset").attr('disabled', false);
    $("#less-tenant-button").removeClass('btn--disabled');
    $("#less-tenant-button").addClass('btn-orange');

    return false;
}

function delColocataire() {
    if (cant < 1 + offset)
        return false;

    var id = '#tenant-div' + cant;
    $(id).remove();
    cant--;
    remainigCotenantSlots++;

    if (cant < 1 + offset) {
        $('#less-tenant-button-fieldset').attr("disabled", true);

        $("#less-tenant-button").removeClass("btn-orange");
        $("#less-tenant-button").addClass("btn--disabled");
    }

    $("#plus-tenant-button-fieldset").attr('disabled', false);
    $("#plus-tenant-button").removeClass('btn--disabled');
    $("#plus-tenant-button").addClass('btn--primary');

    return false;
}
