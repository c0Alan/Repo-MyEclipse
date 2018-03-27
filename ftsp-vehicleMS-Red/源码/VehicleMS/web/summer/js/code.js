function composeCheckBox(hidId, boxId, type) {
    var hid = document.getElementById(hidId);
    var box = document.getElementById(boxId);

    if (type == 'bitCode') {
        if (box.checked) {
            hid.value = hid.value | (1 << (box.value - 1));
        } else {
            if ((hid.value & (1 << (box.value - 1))) !== 0) {
                hid.value = hid.value & (~(1 << (box.value - 1)));
            }
        }
    } else {
        var hidValue = hid.value.split(";");
        var composeValue = "";
        if (box.checked) {
            hid.value += box.value + ";";
        } else {
            for (var i = 0; i < hidValue.length; i++) {
                if (hidValue[i] == box.value) {
                    hidValue[i] = "";
                }
                if (hidValue[i] !== "") {
                    composeValue += hidValue[i] + ";";
                }
            }
            hid.value = composeValue;
        }
    }
}