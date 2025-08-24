const cardOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let history = [];

function getNeighbors(index) {
  const above = index > 0 ? cardOrder[index - 1] : cardOrder[cardOrder.length - 1];
  const below = index < cardOrder.length - 1 ? cardOrder[index + 1] : cardOrder[0];
  return [above, below];
}

function processCard(value, suit) {
  const selectedCard = `${value} of ${suit}`;
  history.push(selectedCard);
  drawTable();
}

function drawTable() {
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  const th = document.createElement("th");
  th.textContent = "Value";
  headerRow.appendChild(th);

  suits.forEach(suit => {
    const th = document.createElement("th");
    th.textContent = suit.charAt(0).toUpperCase() + suit.slice(1);
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  let highlights = [];

  history.forEach((cardStr, idx) => {
    const [val, , suit] = cardStr.split(" ");
    const index = cardOrder.indexOf(val);
    const [above, below] = getNeighbors(index);
    highlights.push({
      value: val,
      suit: suit,
      above,
      below,
      isLatest: idx === history.length - 1,
    });
  });

  cardOrder.forEach(value => {
    const row = document.createElement("tr");
    const tdLabel = document.createElement("td");
    tdLabel.textContent = value;
    row.appendChild(tdLabel);

    suits.forEach(suit => {
      const cardText = `${value} of ${suit}`;
      const td = document.createElement("td");
      td.textContent = cardText;

      let appliedClass = "";

      for (let h of highlights) {
        if (value === h.value) {
          appliedClass = h.isLatest ? "green" : "blue";
        } else if ((value === h.above || value === h.below) && suit === h.suit) {
          appliedClass = h.isLatest ? "yellow" : "orange";
        }

        if (h.isLatest && appliedClass) break;
      }

      if (appliedClass) td.classList.add(appliedClass);

      td.style.cursor = 'pointer';
      td.onclick = () => {
        processCard(value, suit);
      };

      row.appendChild(td);
    });

    table.appendChild(row);
  });

  document.getElementById("tableContainer").innerHTML = "";
  document.getElementById("tableContainer").appendChild(table);
}

function endSession() {
  if (history.length === 0) {
    alert("No cards were entered.");
    return;
  }

  let historyHTML = "<h3>Session Ended. Card History:</h3><ul>";
  history.forEach((card, i) => {
    historyHTML += `<li>${card}</li>`;
  });
  historyHTML += "</ul>";
  document.getElementById("history").innerHTML = historyHTML;

  document.querySelectorAll('#tableContainer td').forEach(td => {
    td.onclick = null;
  });
}

document.addEventListener('DOMContentLoaded', drawTable);
