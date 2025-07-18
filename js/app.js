document.addEventListener("DOMContentLoaded", () => {
  const calc = document.getElementById("calculator");
  const form = document.getElementById("calculator-form");

  //Inputs
  const incomeInput = document.getElementById("income");
  const daysInput = document.getElementById("days");
  const tuberculosisCheckbox = document.getElementById("tuberculosis");

  //Elements to display results
  const employerDaysElem = calc.querySelector(".employer .days");
  const employerValueElem = calc.querySelector(".employer .value");
  const insuranceDaysElem = calc.querySelector(".insurance .days");
  const insuranceValueElem = calc.querySelector(".insurance .value");
  const dailyAllowanceElements = calc.querySelectorAll(
    ".compensation__allowance-value"
  );
  const totalDaysElem = calc.querySelector(".calculator__total-days");
  const totalCompensationElem = calc.querySelector(
    ".calculator__total-compensation"
  );

  const sanitizeNumber = (value) => Number(value.replace(/[^0-9.]/g, ""));

  const getMaxDays = (hasTuberculosis) => (hasTuberculosis ? 240 : 182);

  const formatCurrency = (value) =>
    value.toLocaleString("et-EE", { minimumFractionDigits: 2 }) + "€";

  const checkPluralization = (value) => `${value} day${value !== 1 ? "s" : ""}`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const hasTuberculosis = tuberculosisCheckbox.checked;
    const maxDaysAllowed = getMaxDays(hasTuberculosis);
    const income = parseFloat(sanitizeNumber(incomeInput.value));
    const days = parseInt(sanitizeNumber(daysInput.value, 10));

    //Get compensated days
    const compensatedDays = Math.min(days, maxDaysAllowed);
    const employerDays = Math.max(0, Math.min(compensatedDays, 8) - 3);
    const insuranceDays = Math.max(0, compensatedDays - 8);
    const totalCompensationDays = employerDays + insuranceDays;

    //Count the values of compensation
    const dailyAllowance = +((income * 0.7) / 30).toFixed(2);
    const employerSum = +(employerDays * dailyAllowance).toFixed(2);
    const insuranceSum = +(insuranceDays * dailyAllowance).toFixed(2);
    const totalCompensation = +(employerSum + insuranceSum).toFixed(2);

    //Update DOM elements
    employerDaysElem.textContent = checkPluralization(employerDays);
    employerValueElem.textContent = formatCurrency(employerSum);
    insuranceDaysElem.textContent = checkPluralization(insuranceDays);
    insuranceValueElem.textContent = formatCurrency(insuranceSum);
    totalDaysElem.textContent = checkPluralization(totalCompensationDays);
    totalCompensationElem.textContent = formatCurrency(totalCompensation);
    dailyAllowanceElements.forEach(
      (e) => (e.textContent = formatCurrency(dailyAllowance))
    );
  });
});
