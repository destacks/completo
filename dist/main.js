"use strict";
function completo(element, target, debug) {
    if (debug === void 0) { debug = false; }
    /* Initial checks */
    if (element.parentNode === null) {
        throw Error("element.parentNode is null");
    }
    var row = 0;
    var open = "open";
    var closed = "closed";
    var active = "active";
    var list = document.createElement("DIV");
    list.setAttribute("class", "completo-list");
    list.classList.add(closed);
    element.setAttribute("autocomplete", "off");
    element.classList.add("completo-input");
    element.parentNode.insertBefore(list, element.nextSibling);
    element.addEventListener("keydown", function (e) {
        if (e.keyCode === 40) {
            if (debug)
                console.log("down");
            e.preventDefault();
            var normalizedRow = normalize(row + 1, list);
            if (normalizedRow > 0)
                setActiveRow(normalizedRow, list);
        }
        else if (e.keyCode === 38) {
            if (debug)
                console.log("up");
            e.preventDefault();
            var normalizedRow = normalize(row - 1, list);
            if (normalizedRow >= 0)
                setActiveRow(normalizedRow, list);
        }
        else if (e.keyCode === 13) {
            if (debug)
                console.log("enter");
            var listChildren = list.children[row - 1];
            if (row > 0)
                element.value = listChildren.innerText;
            closeList();
        }
    });
    element.addEventListener("input", function () {
        fetchFromTarget(element.value, target);
    });
    list.addEventListener("mouseover", function (e) {
        var targetElement = e.target;
        for (var i = 0; i < list.children.length; i++) {
            var listChildren = list.children[i];
            if (targetElement.innerText === listChildren.innerText) {
                setActiveRow(i + 1, list);
            }
        }
    });
    list.addEventListener("click", function (e) {
        var targetElement = e.target;
        element.value = targetElement.innerText;
        closeList();
    });
    document.addEventListener("click", function (e) {
        closeList();
    });
    function createListItems(result) {
        var listItems = "";
        for (var i = 0; i < result.length; i++) {
            var escapedResult = escape(result[i]);
            var escapedValue = escape(element.value);
            var regex = new RegExp(escapedValue, "g");
            var replaced = escapedResult.replace(regex, "<span class=\"completo-match\">".concat(escapedValue, "</span>"));
            listItems += "<div class=\"completo-item\">".concat(replaced, "</div>");
        }
        if (listItems) {
            if (list.classList.contains(closed)) {
                list.classList.remove(closed);
            }
            list.classList.add(open);
        }
        else {
            closeList();
        }
        return listItems;
    }
    function fetchFromTarget(value, target) {
        fetch("".concat(target, "?query=").concat(value))
            .then(function (response) { return response.json(); })
            .then(function (data) {
            if (Array.isArray(data) && data.length) {
                var result = data[0]["result"];
                list.innerHTML = createListItems(result);
            }
            else {
                var result = [];
                list.innerHTML = createListItems(result);
            }
        });
        if (debug)
            console.log("fetch");
    }
    function escape(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    function normalize(activeRow, list) {
        var listLength = list.children.length;
        if (activeRow > listLength) {
            activeRow = listLength;
        }
        else if (activeRow < 0) {
            activeRow = 0;
        }
        return activeRow;
    }
    function setActiveRow(activeRow, list) {
        row = activeRow;
        var indexActiveRow = activeRow - 1;
        for (var i = 0; i < list.children.length; i++) {
            if (indexActiveRow === i) {
                list.children[i].classList.add(active);
            }
            else {
                list.children[i].classList.remove(active);
            }
        }
    }
    function closeList() {
        if (list.classList.contains(open)) {
            list.classList.remove(open);
        }
        list.classList.add(closed);
        row = 0;
    }
    if (debug)
        console.log("initialized");
}
