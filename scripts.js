// Automata CORE
const rules = [
  {
    pattern: [true, true, true],
    rule: true
  },
  {
    pattern: [true, true, false],
    rule: true
  },
  {
    pattern: [true, false, true],
    rule: true
  },
  {
    pattern: [true, false, false],
    rule: false
  },
  {
    pattern: [false, true, true],
    rule: false
  },
  {
    pattern: [false, true, false],
    rule: false
  },
  {
    pattern: [false, false, true],
    rule: false
  },
  {
    pattern: [false, false, false],
    rule: true
  }
];
const width = 100;
let startingCondition = 'singleOn';
let rows = [];

function genRow(rows, width, rules) {
  const newRow = [];
  for (let i = 0; i < width; i++) {
    // Make first row
    if (rows.length === 0) {
      if (startingCondition === 'random') {
        newRow.push(Math.random() >= 0.5);
      }
      if (startingCondition === 'singleOn') {
        if (i === width / 2) {
          newRow.push(true);
        } else {
          newRow.push(false);
        }
      }
    } else {
      const prevRow = rows[rows.length - 1];
      const prevSelf = prevRow[i];
      const left = prevRow[i === 0 ? prevRow.length - 1 : i - 1];
      const right = prevRow[i === prevRow.length - 1 ? 0 : i + 1];
      const prevArr = [left, prevSelf, right];
      const res = rules.reduce(
        (prev, curr) => {
          const matchesPattern = JSON.stringify(curr.pattern) ===
            JSON.stringify(prevArr);
          if (matchesPattern) {
            return curr.rule;
          }
          return prev;
        },
        false
      );
      newRow.push(res);
    }
  }
  return rows.concat([newRow]);
}

// Rendering Automata
function renderCell(on) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.classList.add(on ? 'on' : 'off');
  return cell;
}

function renderRow(cells) {
  const row = document.createElement('div');
  row.classList.add('row');
  cells.forEach(cell => row.appendChild(renderCell(cell)));
  return row;
}

function render(rows) {
  const $container = document.getElementById('container');
  const currentRows = document.getElementsByClassName('row');
  if (rows.length === 0) {
    $container.innerHTML = '';
  }
  rows.forEach((row, i) => {
    if (i > currentRows.length || currentRows.length === 0) {
      const renderedRow = renderRow(row);
      $container.appendChild(renderedRow);
    }
  });
}

function run() {
  rows = genRow(rows, width, rules);
  render(rows);
}

run();
let interval;

// Handling UI
$stopButton = document.getElementById('stop-button');
$startButton = document.getElementById('start-button');
$clearButton = document.getElementById('clear-button');
$stopButton.addEventListener('click', () => clearInterval(interval));
$startButton.addEventListener('click', () => interval = setInterval(run, 10));
$clearButton.addEventListener('click', () => {
  rows = [];
  render(rows);
  run();
});
rules.forEach((r, i) => document.getElementById(`rule-${i}`).checked = r.rule);
Array.prototype.forEach.call(
  document.getElementsByClassName('rule-check'),
  elem => elem.addEventListener('click', e => {
    const index = parseInt(e.target.id.replace('rule-', ''));
    rules[index].rule = e.target.checked;
  })
);
document.getElementById('random-check').addEventListener('click', e => {
  if (e.target.checked) {
    startingCondition = 'random';
  } else {
    startingCondition = 'singleOn';
  }
  rows = [];
  render(rows);
  run();
});
