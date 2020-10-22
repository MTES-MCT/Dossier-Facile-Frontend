$('#tenantSituation').on('change', function () {
    if (this.value === '3' || this.value === '4') {
        var modal = $('#tenantSituationWarning');
        mr.modals.showModal(modal);
        // $('.modal-file').modal('show');
    }
});