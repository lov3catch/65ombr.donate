const MAX_SINGLE_DONATION = 29999;
const currency = new Intl.NumberFormat("uk-UA");
const query = new URLSearchParams(window.location.search);

const rawAmount = Number(query.get("amount"));
const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? Math.round(rawAmount) : 0;
const selectedParts = [
  ...new Set(
    (query.get("parts") ?? "")
      .split(",")
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 17),
  ),
];
const parts = selectedParts.length;

const amountOutput = document.querySelector("#donationAmount");
const partsCount = document.querySelector("#partsCount");
const warning = document.querySelector("#limitWarning");
const widget = document.querySelector("#monoWidget");
const placeholder = document.querySelector("#monoPlaceholder");
const mockAmount = document.querySelector("#mockAmount");
const jarLink = document.querySelector("#monoJarLink");

amountOutput.value = `${currency.format(amount)} ₴`;
mockAmount.value = `${currency.format(amount)} ₴`;
partsCount.textContent = parts > 0 ? `Обрано деталей: ${parts}` : "Суму не обрано";

if (amount > MAX_SINGLE_DONATION) {
  warning.hidden = false;
  warning.textContent =
    `Обрана сума перевищує ліміт одного донату ${currency.format(MAX_SINGLE_DONATION)} ₴. ` +
    "Для повної підтримки може знадобитися кілька платежів.";
}

function parseOfficialMonoUrl(value) {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    const isHttps = parsed.protocol === "https:";
    const isMonoHost = parsed.hostname === "monobank.ua" || parsed.hostname.endsWith(".monobank.ua");
    return isHttps && isMonoHost ? parsed : null;
  } catch {
    return null;
  }
}

const config = window.MONOBANK_CONFIG ?? {};
const jarUrl = parseOfficialMonoUrl(config.jarUrl);

if (jarUrl) {
  if (amount > 0) {
    jarUrl.searchParams.set("amount", String(amount));
  } else {
    jarUrl.searchParams.delete("amount");
  }

  jarLink.href = jarUrl.href;
  jarLink.hidden = false;
  jarLink.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "monobank_click", {
      link_url: jarUrl.href,
      link_text: jarLink.textContent.trim(),
      click_source: "donation_page",
      selected_amount: amount,
      selected_parts: parts,
    });
  });
}

const widgetTemplate = String(config.widgetUrlTemplate ?? "").trim();
const widgetUrl = parseOfficialMonoUrl(
  widgetTemplate ? widgetTemplate.replaceAll("{amount}", encodeURIComponent(String(amount))) : "",
);

if (jarUrl && !widgetUrl) {
  widget.hidden = true;
}

if (widgetUrl) {
  const frame = document.createElement("iframe");
  frame.className = "mono-frame";
  frame.src = widgetUrl.href;
  frame.title = `Віджет monobank для донату ${currency.format(amount)} гривень`;
  frame.loading = "eager";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.setAttribute("allow", "payment");
  placeholder.remove();
  widget.append(frame);
}
