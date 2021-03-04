function completo(element, target) {
  element.addEventListener("click", function () {
    console.log("Click");
  });

  element.addEventListener("keyup", function () {
    fetchFromTarget(element.value, target);
  });

  function fetchFromTarget(value, target) {
    fetch(`${target}?query=${value}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
            console.log(data[0]["result"]);
        } else {
            console.log([]);
        }
      });
  }

  console.log("Initialized");
}
