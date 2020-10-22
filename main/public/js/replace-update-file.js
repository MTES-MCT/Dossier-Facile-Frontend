$(document).ready(function () {
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
            var number = $('#number').val();
            $('#progress' + number).removeClass('hidden');
            var ajax = new XMLHttpRequest();
            var formdata = new FormData($("#form-file")[0]);
            ajax.upload.addEventListener("progress", progressHandler, false);
            ajax.addEventListener("load", completeHandler, false);
            ajax.addEventListener("progress", loadProgressHandler, false);
            ajax.addEventListener("error", errorHandler, false);
            ajax.addEventListener("abort", abortHandler, false);

            ajax.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var number = $("#form-file").find("#number").val();
                    $("#link-file-" + number).attr("href", this.responseText);
                    $($("#link-file-" + number).parent().children('i')[1]).attr('class', 'icon icon-Hour text-warning pull-right');
                    if ($($("#link-file-" + number).parent().children('span')).length > 0) {
                        $($("#link-file-" + number).parent().children('span')).attr('class', 'icon icon-Hour text-warning icon--xs')
                    }
                }
            };
            ajax.open("POST", $("#form-file")[0].action);

            ajax.send(formdata);
            $('#file').val('');

        }
    });

    function progressHandler(event) {
        var percent = Math.round((event.loaded / event.total) * 1000) / 10;
        console.log("percent: " + percent);
        setProgressPercent(percent);
    }

    function setProgressPercent(percent) {
        var number = $('#number').val();
        $('#progressBar' + number).attr("data-value", percent);
        $('.progress-horizontal__progress').css("width", percent + '%');
    }

    function completeHandler(event) {
        $('.progress-horizontal__progress').css('background-color', '#11c111');
        var notification = $('.success-notification');
        mr.notifications.showNotification(notification);
        setTimeout(function () {
            notification.removeClass('notification--reveal');
            notification.removeClass('notification--dismissed')
        }, 3000);
        var number = $('#number').val();
        $('#progress' + number).addClass('hidden');
    }

    function loadProgressHandler(event) {
        console.log("load progress: " + event.loaded + " / " + event.total);
        var percent = Math.round((event.loaded / event.total) * 1000) / 10;
        setProgressPercent(percent);
    }

    function errorHandler(event) {
        var notification = $('.error-notification');
        mr.notifications.showNotification(notification);
        setTimeout(function () {
            notification.removeClass('notification--reveal');
            notification.removeClass('notification--dismissed')
        }, 3000);
    }

    function abortHandler(event) {
        var notification = $('.error-notification');
        mr.notifications.showNotification(notification);
        setTimeout(function () {
            notification.removeClass('notification--reveal');
            notification.removeClass('notification--dismissed')
        }, 3000);
    }
});