function completo(element, target) {
  let row = 0;
  const open = "open";
  const closed = "closed";
  const active = "active";
  const list = document.createElement("DIV");

  list.setAttribute("class", "completo-list");
  list.classList.add(closed);
  element.setAttribute("autocomplete", "off");
  element.classList.add("completo-input");
  element.parentNode.insertBefore(list, element.nextSibling);

  element.addEventListener("keydown", function (e) {
    if (e.keyCode === 40) {
      // Down
      e.preventDefault();
      const normalizedRow = normalize(row + 1, list);
      if (normalizedRow > 0) setActiveRow(normalizedRow, list);
    } else if (e.keyCode === 38) {
      // Up
      e.preventDefault();
      const normalizedRow = normalize(row - 1, list);
      if (normalizedRow >= 0) setActiveRow(normalizedRow, list);
    } else if (e.keyCode === 13) {
      // Enter
      if (row > 0) element.value = list.children[row - 1].innerText;
      closeList();
    }
  });

  element.addEventListener("input", function () {
    fetchFromTarget(element.value, target);
    console.log("fetch");
  });

  list.addEventListener("mouseover", function (e) {
    for (let i = 0; i < list.children.length; i++) {
      if (e.target.innerText === list.children[i].innerText) {
        setActiveRow(i + 1, list);
      }
    }
  });

  list.addEventListener("click", function (e) {
    element.value = e.target.innerText;
    closeList();
  });

  document.addEventListener("click", function (e) {
    closeList();
  });

  function createListItems(result) {
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
      closeList();
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
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalize(activeRow, list) {
    const listLength = list.children.length;
    if (activeRow > listLength) {
      activeRow = listLength;
    } else if (activeRow < 0) {
      activeRow = 0;
    }
    return activeRow;
  }

  function setActiveRow(activeRow, list) {
    row = activeRow;
    const indexActiveRow = activeRow - 1;
    for (let i = 0; i < list.children.length; i++) {
      if (indexActiveRow === i) {
        list.children[i].classList.add(active);
      } else {
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
}
