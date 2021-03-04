function completo(element, target) {
  const list = document.createElement("DIV");
  list.setAttribute("id", `${element.id}-list`);
  list.setAttribute("class", "completo-list");
  element.parentNode.appendChild(list);

  element.addEventListener("click", function () {
    console.log("Click");
  });

  element.addEventListener("keyup", function () {
    fetchFromTarget(element.value, target);
  });

  function createListItems(result) {
    let listItems = "";
    for (let i = 0; i < result.length; i++) {
      listItems += `<div class="completo-list-item">${result[i]}</div>`;
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

  console.log("Initialized");
}
