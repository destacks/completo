function completo(element, target) {
  let row = 0;
  let resultLength = 0;
  const open = "open";
  const closed = "closed";
  const list = document.createElement("DIV");
  const width = window.getComputedStyle(element).getPropertyValue("width");

  list.setAttribute("class", "completo-list");
  list.classList.add(closed);
  list.style.width = width;
  element.setAttribute("autocomplete", "off");
  element.classList.add("completo-input");
  element.parentNode.insertBefore(list, element.nextSibling);

  element.addEventListener("keydown", function (e) {
    if (e.keyCode === 40) {
      row += 1;
      row = normalize(row, resultLength);
      console.log("down", row);
    } else if (e.keyCode === 38) {
      row -= 1;
      row = normalize(row, resultLength);
      console.log("up", row);
    } else if (e.keyCode === 13) {
      console.log("enter", row);
    }
  });

  element.addEventListener("input", function () {
    fetchFromTarget(element.value, target);
    console.log("fetch");
  });

  function createListItems(result) {
    resultLength = result.length;
    let listItems = "";
    for (let i = 0; i < result.length; i++) {
      const escapedResult = escape(result[i]);
      const escapedValue = escape(element.value);
      const replaced = escapedResult.replaceAll(
        escapedValue,
        `<span class="completo-match">${escapedValue}</span>`
      );
      listItems += `<div class="completo-item">${replaced}</div>`;
    }
    if (listItems) {
      if (list.classList.contains(closed)) {
        list.classList.remove(closed);
      }
      list.classList.add(open);
    } else {
      if (list.classList.contains(open)) {
        list.classList.remove(open);
      }
      list.classList.add(closed);
    }
    return listItems;
  }

  function fetchFromTarget(value, target) {
    fetch(`${target}?query=${value}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const result = data[0]["result"];
          list.innerHTML = createListItems(result);
        } else {
          const result = [];
          list.innerHTML = createListItems(result);
        }
      });
  }

  function escape(string) {
    return string
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&/g, "&amp;");
  }

  function normalize(row, resultLength) {
    if (row > resultLength) {
      row = resultLength;
    } else if (row < 0) {
      row = 0;
    }
    return row;
  }  
}
