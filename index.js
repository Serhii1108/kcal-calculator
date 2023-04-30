const APIkey = "3e61f3c71bcab8b4624869f2d45e1f49";
const appId = "33c470f3";

function getItem(name) {
  const url = `https://trackapi.nutritionix.com/v2/search/instant?query=${name}&branded=false&detailed=true`;
  const Http = new XMLHttpRequest();

  Http.open("GET", url, false);
  Http.setRequestHeader("x-app-id", appId);
  Http.setRequestHeader("x-app-key", APIkey);
  Http.send();

  const res = JSON.parse(Http.responseText).common[0];

  Http.abort();

  if (res) {
    const foodName = res.food_name;
    const kcal = res.full_nutrients.filter((el) => el.attr_id == 208)[0].value;
    const photoUrl = res.photo.thumb;

    return { foodName, kcal, photoUrl };
  }

  return undefined;
}

function run() {
  const input = document.getElementById("input");
  const addBtn = document.getElementById("addBtn");
  const list = document.getElementById("list");
  const errorMessage = document.querySelector(".error-message");
  const totalKcalEl = document.getElementById("totalKcal");

  let totalKcal = 0;
  let amountOfItems = 0;

  addBtn.addEventListener("click", () => {
    if (input.value.length > 2) {
      const item = getItem(input.value);
      input.value = "";

      if (item) {
        // Add item
        amountOfItems++;
        const listItem = `
          <li class="list-item" id="item${amountOfItems}">
            <img src="${item.photoUrl}" class="item-img" alt="food" />
            <p class="item-title">${item.foodName} - <span class="item-kcal"><b>${item.kcal}</b></span> Kcal</p>
            <div class="delete">
              <img src="./assets/trash.svg" alt="trash" />
            </div>
          </li>
        `;
        list.innerHTML += listItem;
        totalKcal += +item.kcal;
        totalKcalEl.innerHTML = Math.round(totalKcal);

        // Remove item
        const removeBtnsList = document.querySelectorAll(".delete");
        removeBtnsList.forEach((el) => {
          el.addEventListener("click", (e) => {
            const item = e.target.parentElement.parentElement;

            const itemKcal = item.querySelector(".item-kcal").innerText;
            totalKcal -= itemKcal;
            totalKcalEl.innerHTML = Math.round(totalKcal);

            list.removeChild(item);
          });
        });
      } else {
        errorMessage.classList.remove("transparent");
        setTimeout(() => {
          errorMessage.classList.add("transparent");
        }, 3000);
      }
    }
  });
}

run();
