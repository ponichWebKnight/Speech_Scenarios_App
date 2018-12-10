function cancelOrYes() {
    $('button').on('click', function () {
        if (confirm(title) === false) {
            $('form').submit(function () {
                return false;
            });
            location.reload();
        }
    });
}
