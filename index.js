function toggleCalculator() {
    const type = document.getElementById("calculatorType").value;
    document.getElementById("valueCalc").style.display = type === "value" ? "block" : "none";
    document.getElementById("yieldCalc").style.display = type === "yield" ? "block" : "none";
    document.getElementById("pageTitle").innerText = type === "value" ? "Value Calculator" : "Yield Calculator";
}

function formatWithCommas(value) {
    if (!value && value !== 0) return "";
    let clean = value.toString().replace(/[^0-9.]/g, "");
    let parts = clean.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts[1] !== undefined ? parts[0] + "." + parts[1].slice(0, 2) : parts[0];
}

function formatValue(input) {
    let originalValue = input.value;
    input.value = formatWithCommas(originalValue);
}

function parseFormattedNumber(val) {
    if (!val) return 0;
    return Number(val.toString().replace(/,/g, ""));
}

function calculateValue() {
    const rawMtdInput = document.getElementById("mtd").value;
    const val = parseFormattedNumber(document.getElementById("value").value);
    const mtd = Number(rawMtdInput) / 100;
    const ytd = Number(document.getElementById("ytd").value) / 100;
    const itd = Number(document.getElementById("itd").value) / 100;

    if (!isNaN(val) && !isNaN(mtd) && rawMtdInput !== "") {
        const resultValue = val * (1 + mtd);
        
        // הצגת ה-MTD בתוצאות
        document.getElementById("newMTDResult").innerText = Number(rawMtdInput).toFixed(2);
        
        document.getElementById("newValue").innerText = resultValue.toLocaleString("en-US", {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        });
        document.getElementById("newYTD").innerText = (((1 + ytd) * (1 + mtd) - 1) * 100).toFixed(2);
        document.getElementById("newITD").innerText = (((1 + itd) * (1 + mtd) - 1) * 100).toFixed(2);
    } else {
        document.getElementById("newMTDResult").innerText = "-";
        document.getElementById("newValue").innerText = "-";
        document.getElementById("newYTD").innerText = "-";
        document.getElementById("newITD").innerText = "-";
    }
}

function recalculateValue() {
    const newVal = document.getElementById("newValue").innerText;
    if (newVal !== "-") document.getElementById("value").value = newVal;
    
    const newYTD = document.getElementById("newYTD").innerText;
    if (newYTD !== "-") document.getElementById("ytd").value = newYTD;

    const newITD = document.getElementById("newITD").innerText;
    if (newITD !== "-") document.getElementById("itd").value = newITD;

    calculateValue();
}

function calculateYield() {
    const open = parseFormattedNumber(document.getElementById("openBal").value);
    const yearEnd = parseFormattedNumber(document.getElementById("yearEndBal").value);
    const prev = parseFormattedNumber(document.getElementById("prevBal").value);
    const curr = parseFormattedNumber(document.getElementById("currBal").value);

    document.getElementById("yieldMTD").innerText = (prev !== 0) ? ((curr / prev - 1) * 100).toFixed(2) : "-";
    document.getElementById("yieldYTD").innerText = (yearEnd !== 0) ? ((curr / yearEnd - 1) * 100).toFixed(2) : "-";
    document.getElementById("yieldITD").innerText = (open !== 0) ? ((curr / open - 1) * 100).toFixed(2) : "-";
}

function copyToValue() {
    document.getElementById("calculatorType").value = "value";
    toggleCalculator();

    document.getElementById("mtd").value = document.getElementById("yieldMTD").innerText !== "-" ? document.getElementById("yieldMTD").innerText : "";
    document.getElementById("ytd").value = document.getElementById("yieldYTD").innerText !== "-" ? document.getElementById("yieldYTD").innerText : "";
    document.getElementById("itd").value = document.getElementById("yieldITD").innerText !== "-" ? document.getElementById("yieldITD").innerText : "";

    const currVal = document.getElementById("currBal").value;
    if (currVal) document.getElementById("value").value = formatWithCommas(currVal);
}

function copyToYield() {
    document.getElementById("calculatorType").value = "yield";
    toggleCalculator();

    const mtdVal = document.getElementById("mtd").value;
    if (mtdVal) document.getElementById("yieldMTD").innerText = mtdVal;

    document.getElementById("prevBal").value = document.getElementById("value").value;
    document.getElementById("currBal").value = document.getElementById("newValue").innerText !== "-" ? document.getElementById("newValue").innerText : "";
    
    calculateYield();
}

function copyValue(elementId, btn) {
    let text = document.getElementById(elementId).innerText;
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text.replace(/,/g, "")); 
    
    const originalText = btn.innerText;
    btn.innerText = "Copied";
    btn.disabled = true;
    setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 1200);
}

function resetAll() {
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.querySelectorAll(".results-grid div[id]").forEach(el => el.innerText = "-");
}
