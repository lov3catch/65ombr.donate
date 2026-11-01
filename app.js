const componentData = [
  { name: "Raspberry Pi 4 2GB Model B+", price: 4050, image: "part-01-raspberry-pi4.png" },
  { name: "Ліцензія R2D2", price: 1000, image: "part-02-r2d2-license.png" },
  { name: "Комутатор TP-LINK TL-SG105", price: 800, image: "part-03-tp-link-tl-sg105.png" },
  { name: "Регульований DC-перетворювач 60–36 В", price: 500, image: "part-04-dc-converter-60v-36v.png" },
  { name: "Вентилятор 60×60", price: 200, image: "part-05-fan-60x60.png" },
  { name: "Регулятор напруги Matek BEC12S-PRO", price: 950, image: "part-06-matek-bec12s-pro.png" },
  { name: "Конденсатори Low ESR, 2 шт.", price: 400, image: "part-07-low-esr-capacitor.png" },
  { name: "Кабель JST GX1.25 6-pin, 2 шт.", price: 60, image: "part-08-jst-gx125-6pin-cable.png" },
  { name: "Кабель живлення Raspberry Pi TX30", price: 30, image: "part-09-raspberry-tx30-power-cable.png" },
  { name: "Кабель живлення комутатора TX30", price: 30, image: "part-10-switch-tx30-power-cable.png" },
  { name: "Кабель від камери JST GX1.25 5-pin — RJ-45", price: 70, image: "part-11-camera-jst-rj45-cable.png" },
  { name: "Кабель RJ-45 — RJ-45: комутатор — Raspberry Pi", price: 60, image: "part-12-rj45-switch-raspberry.png" },
  { name: "Кабель RJ-45 — RJ-45: комутатор — Starlink", price: 90, image: "part-13-rj45-switch-starlink.png" },
  { name: "Кабель живлення IN DC TX30", price: 30, image: "part-14-in-dc-tx30-power-cable.png" },
  { name: "Витратні матеріали", price: 500, image: "part-15-consumables-kit.png" },
  { name: "Starlink Mini", price: 19999, image: "part-16-starlink-mini.png" },
  { name: "Starlink Local Priority 200 ГБ, 1 місяць", price: 3209, image: "part-17-local-priority-200gb.png" },
].sort((first, second) => first.price - second.price);

const track = document.querySelector("#partsTrack");
const viewport = document.querySelector("#partsViewport");
const range = document.querySelector("#partsRange");
const countOutput = document.querySelector("#countOutput");
const donationOutput = document.querySelector("#donationOutput");
const selectionStatus = document.querySelector("#selectionStatus");
const supportButton = document.querySelector("#supportButton");
const supportButtonAmount = document.querySelector("#supportButtonAmount");
const qaItems = [...document.querySelectorAll(".qa-item")];
const currency = new Intl.NumberFormat("uk-UA");
const campaignProgress = window.CAMPAIGN_PROGRESS ?? {};
const campaignGoal = componentData.reduce((sum, component) => sum + component.price, 0);
const selectedIndices = new Set([0]);
let currentDonationTotal = 0;

function toNonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function renderCampaignProgress() {
  const collectedAmount = Math.round(toNonNegativeNumber(campaignProgress.collectedAmount));
  const collectedDrones = Math.floor(toNonNegativeNumber(campaignProgress.collectedDrones));
  const progressPercent = campaignGoal > 0
    ? Math.min(100, (collectedAmount / campaignGoal) * 100)
    : 0;
  const roundedPercent = Math.round(progressPercent);

  document.querySelectorAll(".fund-progress-copy, .footer-progress-copy").forEach((progressCopy) => {
    const amount = progressCopy.querySelector("strong");
    const percent = progressCopy.querySelector("output");

    if (amount) {
      amount.innerHTML = `${currency.format(collectedAmount)} ₴ <small>/ ${currency.format(campaignGoal)} ₴</small>`;
    }
    if (percent) percent.value = `${roundedPercent}%`;
  });

  document.querySelectorAll(".fund-progress-track, .footer-progress-track").forEach((progressTrack) => {
    progressTrack.setAttribute("aria-valuemax", String(campaignGoal));
    progressTrack.setAttribute("aria-valuenow", String(Math.min(collectedAmount, campaignGoal)));
    progressTrack.querySelector("span")?.style.setProperty("--fund-progress", `${progressPercent}%`);
  });

  document.querySelectorAll(".drone-count strong").forEach((droneCount) => {
    droneCount.innerHTML = `${currency.format(collectedDrones)} <small>шт.</small>`;
  });
}

qaItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    qaItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

range.max = String(componentData.length);

componentData.forEach((component, index) => {
  const item = document.createElement("li");
  item.className = "part-card";
  item.dataset.index = String(index);
  item.setAttribute("aria-label", `${component.name}, ${currency.format(component.price)} гривень`);
  item.innerHTML = `
    <button
      class="check-mark"
      type="button"
      data-index="${index}"
      aria-label="Обрати ${component.name}"
      aria-pressed="false"
    >✓</button>
    <img class="part-image" src="assets/${component.image}" alt="${component.name}" width="128" height="128" loading="lazy" decoding="async" />
    <span class="part-name">${component.name}</span>
    <span class="part-price">${currency.format(component.price)} ₴</span>
  `;
  track.append(item);
});

const completionItem = document.createElement("li");
completionItem.className = "completion-card";
completionItem.hidden = true;
completionItem.setAttribute("role", "status");
completionItem.setAttribute("aria-live", "polite");
completionItem.innerHTML = `
  <img
    class="completion-image"
    src="assets/complete-dron.png"
    alt="Готовий важкий шестироторний дрон"
    width="256"
    height="256"
    loading="lazy"
    decoding="async"
  />
  <div class="completion-copy">
    <span class="completion-kicker">Комплект зібрано</span>
    <strong>Готовий важкий дрон</strong>
    <p>Усі необхідні деталі профінансовано — апарат готовий до фінального складання.</p>
  </div>
  <span class="completion-check" aria-hidden="true">✓</span>
`;
track.append(completionItem);

const cards = [...track.querySelectorAll(".part-card")];

function selectFirstComponents(count) {
  selectedIndices.clear();

  componentData.slice(0, count).forEach((_, index) => {
    selectedIndices.add(index);
  });
}

function updateSelection({ syncRange = true } = {}) {
  const selectedComponents = componentData.filter((_, index) => selectedIndices.has(index));
  const selectedCount = selectedComponents.length;
  const total = selectedComponents.reduce((sum, component) => sum + component.price, 0);
  const progress = (selectedCount / componentData.length) * 100;
  currentDonationTotal = total;

  cards.forEach((card, index) => {
    const isSelected = selectedIndices.has(index);
    const checkButton = card.querySelector(".check-mark");
    const component = componentData[index];
    card.classList.toggle("is-selected", isSelected);
    checkButton.setAttribute("aria-pressed", String(isSelected));
    checkButton.setAttribute(
      "aria-label",
      isSelected
        ? `Зняти вибір з ${component.name}`
        : `Обрати ${component.name}`,
    );
  });

  if (syncRange) range.value = String(selectedCount);
  range.style.setProperty("--progress", `${progress}%`);
  countOutput.value = `${selectedCount} / ${componentData.length}`;
  donationOutput.value = `${currency.format(total)} ₴`;
  supportButtonAmount.textContent = `${currency.format(total)} ₴`;
  const donationPage = new URL("donation.html", document.baseURI);
  donationPage.searchParams.set("amount", String(total));
  donationPage.searchParams.set(
    "parts",
    [...selectedIndices]
      .sort((first, second) => first - second)
      .map((index) => index + 1)
      .join(","),
  );
  supportButton.href = selectedCount === 0 ? "#selector" : donationPage.href;
  supportButton.setAttribute("aria-disabled", String(selectedCount === 0));
  supportButton.setAttribute(
    "aria-label",
    selectedCount === 0
      ? "Спочатку оберіть деталь"
      : `Підтримати збір на суму ${currency.format(total)} гривень`,
  );
  completionItem.hidden = selectedCount !== componentData.length;

  if (selectedCount === 0) {
    selectionStatus.textContent = "Оберіть хоча б одну деталь";
  } else if (selectedCount === componentData.length) {
    selectionStatus.textContent = "Ви покриваєте весь комплект — усі деталі позначено";
  } else if (selectedCount === 1) {
    selectionStatus.textContent = `Обрано: ${selectedComponents[0].name}`;
  } else {
    selectionStatus.textContent = `Обрано ${selectedCount} позицій — кожну можна змінити окремо`;
  }
}

range.addEventListener("input", () => {
  selectFirstComponents(Number(range.value));
  updateSelection({ syncRange: false });
});

track.addEventListener("click", (event) => {
  const checkButton = event.target.closest(".check-mark");
  if (!checkButton) return;

  const index = Number(checkButton.dataset.index);
  if (selectedIndices.has(index)) {
    selectedIndices.delete(index);
  } else {
    selectedIndices.add(index);
  }
  updateSelection();
  checkButton.focus();
});

supportButton.addEventListener("click", (event) => {
  if (currentDonationTotal <= 0) event.preventDefault();
});

document.querySelectorAll('a[href*="send.monobank.ua"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "monobank_click", {
      link_url: link.href,
      link_text: link.textContent.trim(),
      click_source: "footer_jar_link",
    });
  });
});

viewport.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  event.preventDefault();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const nextValue = Math.min(componentData.length, Math.max(0, Number(range.value) + direction));
  range.value = String(nextValue);
  selectFirstComponents(nextValue);
  updateSelection({ syncRange: false });
});

renderCampaignProgress();
updateSelection();
