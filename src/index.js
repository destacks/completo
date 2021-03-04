function completo(element, target) {
  const open = "open";
  const closed = "closed";
  const list = document.createElement("DIV");
  element.classList.add("completo-input");
  list.setAttribute("class", "completo-list");
  list.classList.add(closed);
  list.style.width = `${element.offsetWidth}px`;
  element.parentNode.appendChild(list);

  element.addEventListener("keyup", function () {
    fetchFromTarget(element.value, target);
  });

  function createListItems(result) {
    let listItems = "";
    for (let i = 0; i < result.length; i++) {
      listItems += `<div class="completo-list-item">${result[i]}</div>`;
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
}
