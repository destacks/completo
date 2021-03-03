function completo(element, target) {
  element.addEventListener("click", function () {
    console.log("Click");
  });

  element.addEventListener("keyup", function () {
    fetchFromTarget(element.value, target);
  });

  function fetchFromTarget(value, target) {
      console.log(`Fetching with value "${value}"\nfrom "${target}"`);
  }

  console.log("Initialized");
}
