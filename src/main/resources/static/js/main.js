$(document).ready(function () {


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
        e.preventDefault();
        if (validate()) {
            sendForm();
        }
    });


    function validate() {

        var isValid = true;
        $('input[type="text"]').each(function () {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).addClass("invalid")
            }
            else {
                $(this).removeClass("invalid")
            }
        });
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        $('input[type="email"]').each(function () {
            if (!filter.test($(this).val())) {
                isValid = false;
                $(this).addClass("invalid")
            } else {
                $(this).removeClass("invalid")
            }
        });

        var allowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'pdf'];
        $('input[type="file"]').each(function () {
            var value = $(this).val();
            file = value.toLowerCase(),
                extension = file.substring(file.lastIndexOf('.') + 1);

            if ($.inArray(extension, allowedExtensions) == -1) {
                $(this).addClass("invalid");
            } else {
                $(this).removeClass("invalid");
            }
        });

        if ($('.invalid').length > 0) {
            return false
        }

        return isValid;

    }


    $(".clearEmails").click(function () {
        $('#emailsList').val('');
        $('#confirm').modal('hide');
    });

    function sendForm() {
        $.ajax({
            url: "/info-locataire",
            type: "POST",
            data: new FormData($("#formLocataire")[0]),
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            success: function () {
                $('#confirm').modal('show');
                // Handle upload success
                // ...
            },
            error: function () {
                // Handle upload error
                // ...
            }
        });
    }


    $(".envoyer").click(function (e) {
        e.preventDefault();
        if (validate()) {
            sendForm();
        }
    });

    function sendOwnerSubscriptionForm(e) {
        e.preventDefault();
        if (validate()) {
            $.ajax({
                url: "/subscription",
                type: "POST",
                data: new FormData($("#proprio_subscribe")[0]),
                processData: false,
                contentType: false,
                cache: false,
                success: function () {
                    $("#proprio_subscribe").hide();
                    $("#subscription_success").show();
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
});
