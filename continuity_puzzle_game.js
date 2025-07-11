// Continuity Puzzle Game
let currentPuzzle;
let selectedFunctions = [];
let selectedOperator = null;
let score = 0;
let attempts = 0;
let totalGames = 0;
let correctAnswers = 0;
let currentStreak = 0;
let message = "Welcome! Click 'New Game' to start. Then select a function, then an operator, then another function.";
let messageType = "info";
let messageTimer = 0;

// Game state
let gameStats = {
    totalGames: 0,
    correctAnswers: 0,
    currentStreak: 0
};

// Hard-coded discontinuity sets for each function combination
const continuityAnalysis = {};

// Modified functions with discontinuities at different points
const functions = {
    identity: {
        name: "Identity",
        description: "f(x) = x",
        evaluate: x => x,
        latex: "x"
    },
    reciprocal: {
        name: "Reciprocal", 
        description: "f(x) = 1/x",
        evaluate: x => x === 0 ? null : 1/x,
        latex: "1/x"
    },
    rational1: {
        name: "Rational",
        description: "f(x) = (x+3)/(x-3)",
        evaluate: x => x === 3 ? null : (x+3)/(x-3),
        latex: "(x+3)/(x-3)"
    },
    log: {
        name: "Natural Log",
        description: "f(x) = ln(x)",
        evaluate: x => x <= 0 ? null : Math.log(x),
        latex: "ln(x)"
    },
    floor: {
        name: "Floor",
        description: "f(x) = ⌊x⌋",
        evaluate: x => Math.floor(x),
        latex: "⌊x⌋"
    },
    piecewise1: {
        name: "Piecewise",
        description: "f(x) = x² if x ≥ 2, x-1 if x < 2",
        evaluate: x => x >= 2 ? x*x : x-1,
        latex: "x² if x ≥ 2, x-1 if x < 2"
    },
    absolute: {
        name: "Absolute Ratio",
        description: "f(x) = |x-1|/(x-1)",
        evaluate: x => x === 1 ? null : Math.abs(x-1)/(x-1),
        latex: "|x-1|/(x-1)"
    },
    tangent: {
        name: "Tangent",
        description: "f(x) = tan(x)",
        evaluate: x => {
            const cosX = Math.cos(x);
            return Math.abs(cosX) < 1e-10 ? null : Math.sin(x)/cosX;
        },
        latex: "tan(x)"
    }
};

// Operators for combining functions
const operators = {
    add: {
        symbol: "+",
        name: "Addition",
        latex: "+",
        combine: (f1, f2) => (x) => {
            const y1 = f1(x);
            const y2 = f2(x);
            if (y1 === null || y2 === null) return null;
            return y1 + y2;
        }
    },
    multiply: {
        symbol: "×",
        name: "Multiplication",
        latex: "×",
        combine: (f1, f2) => (x) => {
            const y1 = f1(x);
            const y2 = f2(x);
            if (y1 === null || y2 === null) return null;
            return y1 * y2;
        }
    },
    divide: {
        symbol: "÷",
        name: "Division",
        latex: "÷",
        combine: (f1, f2) => (x) => {
            const y1 = f1(x);
            const y2 = f2(x);
            if (y1 === null || y2 === null || y2 === 0) return null;
            return y1 / y2;
        }
    },
    compose: {
        symbol: "∘",
        name: "Composition",
        latex: "∘",
        combine: (f1, f2) => (x) => {
            const y2 = f2(x);
            if (y2 === null) return null;
            return f1(y2);
        }
    }
};

// Pre-computed puzzle database
const puzzleDatabase = [];

// Hard-coded discontinuity sets for each function
const functionDiscontinuities = {
    identity: [],
    reciprocal: [0],
    rational1: [3],
    log: [0],
    floor: [], // Discontinuous at all integers, handled specially
    piecewise1: [2],
    absolute: [1],
    tangent: [] // Discontinuous at (2k+1)π/2, handled specially
};

// Hard-coded discontinuity sets for all combinations
function generateHardCodedContinuityAnalysis() {
    const functionKeys = Object.keys(functions);
    const operatorKeys = Object.keys(operators);
    
    for (const f1Key of functionKeys) {
        for (const f2Key of functionKeys) {
            for (const opKey of operatorKeys) {
                const key = `${f1Key}|${opKey}|${f2Key}`;
                continuityAnalysis[key] = getHardCodedDiscontinuitySet(f1Key, opKey, f2Key);
            }
        }
    }
    
    console.log('Hard-coded continuity analysis:', continuityAnalysis);
}

function getHardCodedDiscontinuitySet(f1Key, opKey, f2Key) {
    const f1Discontinuities = functionDiscontinuities[f1Key];
    const f2Discontinuities = functionDiscontinuities[f2Key];
    
    switch(opKey) {
        case 'add':
        case 'multiply':
            // Union of discontinuities
            return [...new Set([...f1Discontinuities, ...f2Discontinuities])].sort((a, b) => a - b);
            
        case 'divide':
            // Union of discontinuities plus where f2(x) = 0
            const denominatorZeros = getDenominatorZeros(f2Key);
            return [...new Set([...f1Discontinuities, ...f2Discontinuities, ...denominatorZeros])].sort((a, b) => a - b);
            
        case 'compose':
            return getCompositionDiscontinuities(f1Key, f2Key);
            
        default:
            return [];
    }
}

function getDenominatorZeros(funcKey) {
    // Find where f(x) = 0
    switch(funcKey) {
        case 'identity':
            return [0];
        case 'reciprocal':
            return []; // 1/x never equals 0
        case 'rational1':
            return [-3]; // (x+3)/(x-3) = 0 when x+3 = 0, so x = -3
        case 'log':
            return [1]; // ln(x) = 0 when x = 1
        case 'floor':
            return [0]; // floor(x) = 0 when 0 ≤ x < 1
        case 'piecewise1':
            return [1]; // x-1 = 0 when x = 1 (for x < 2), x² = 0 when x = 0 (for x ≥ 2)
        case 'absolute':
            return []; // |x-1|/(x-1) never equals 0
        case 'tangent':
            return [0]; // tan(x) = 0 when x = kπ
        default:
            return [];
    }
}

function getCompositionDiscontinuities(f1Key, f2Key) {
    const discontinuities = [...functionDiscontinuities[f2Key]];
    
    // Special cases for composition
    if (f1Key === 'floor') {
        // floor∘f2 is discontinuous where f2(x) is an integer
        const integerPoints = getIntegerOutputs(f2Key);
        discontinuities.push(...integerPoints);
    } else if (f1Key === 'reciprocal') {
        // 1/f2 is discontinuous where f2(x) = 0
        const zeros = getDenominatorZeros(f2Key);
        discontinuities.push(...zeros);
    } else if (f1Key === 'log') {
        // ln(f2) is discontinuous where f2(x) ≤ 0
        const nonPositivePoints = getNonPositiveOutputs(f2Key);
        discontinuities.push(...nonPositivePoints);
    } else if (f1Key === 'rational1') {
        // (f2+3)/(f2-3) is discontinuous where f2(x) = 3
        const threePoints = getOutputEqualsThree(f2Key);
        discontinuities.push(...threePoints);
    } else if (f1Key === 'piecewise1') {
        // piecewise∘f2 is discontinuous where f2(x) = 2
        const twoPoints = getOutputEqualsTwo(f2Key);
        discontinuities.push(...twoPoints);
    } else if (f1Key === 'absolute') {
        // |f2-1|/(f2-1) is discontinuous where f2(x) = 1
        const onePoints = getOutputEqualsOne(f2Key);
        discontinuities.push(...onePoints);
    } else if (f1Key === 'tangent') {
        // tan(f2) is discontinuous where f2(x) = (2k+1)π/2
        const tangentDiscontinuities = getTangentDiscontinuities(f2Key);
        discontinuities.push(...tangentDiscontinuities);
    }
    
    return [...new Set(discontinuities)].sort((a, b) => a - b);
}

function getIntegerOutputs(funcKey) {
    // Find x where f(x) is an integer
    switch(funcKey) {
        case 'identity':
            return [0, 1, 2, 3, -1, -2, -3];
        case 'reciprocal':
            return [1, -1, 0.5, -0.5, 0.25, -0.25];
        case 'rational1':
            return [0, 6, -1.5, 4.5]; // Some integer outputs
        case 'log':
            return [1, Math.E, Math.E*Math.E]; // ln(1)=0, ln(e)=1, ln(e²)=2
        case 'floor':
            return [0, 1, 2, 3, -1, -2, -3]; // All integers
        case 'piecewise1':
            return [0, 1, 2, 3, -1, -2]; // Some integer outputs
        case 'absolute':
            return [0, 2]; // |x-1|/(x-1) outputs -1, 1, or undefined
        case 'tangent':
            return [0, Math.PI, 2*Math.PI]; // tan(0)=0, tan(π)=0, etc.
        default:
            return [];
    }
}

function getNonPositiveOutputs(funcKey) {
    // Find x where f(x) ≤ 0
    switch(funcKey) {
        case 'identity':
            return [0, -1, -2, -3];
        case 'reciprocal':
            return [-1, -2, -3]; // 1/x ≤ 0 when x < 0
        case 'rational1':
            return [-3, -1, -2]; // (x+3)/(x-3) ≤ 0 in certain intervals
        case 'log':
            return [0, -1, -2]; // ln(x) ≤ 0 when 0 < x ≤ 1
        case 'floor':
            return [0, -1, -2, -3]; // floor(x) ≤ 0 when x < 1
        case 'piecewise1':
            return [0, 1, -1, -2]; // Some non-positive outputs
        case 'absolute':
            return [0, 1]; // |x-1|/(x-1) outputs -1 when x < 1
        case 'tangent':
            return [0, Math.PI, 2*Math.PI]; // tan(x) ≤ 0 in certain intervals
        default:
            return [];
    }
}

function getOutputEqualsThree(funcKey) {
    // Find x where f(x) = 3
    switch(funcKey) {
        case 'identity':
            return [3];
        case 'reciprocal':
            return [1/3];
        case 'rational1':
            return []; // (x+3)/(x-3) = 3 has no solution
        case 'log':
            return [Math.exp(3)];
        case 'floor':
            return [3.5]; // floor(3.5) = 3
        case 'piecewise1':
            return [Math.sqrt(3)]; // x² = 3 when x = √3
        case 'absolute':
            return [4]; // |x-1|/(x-1) = 1 when x > 1, never equals 3
        case 'tangent':
            return [Math.atan(3)];
        default:
            return [];
    }
}

function getOutputEqualsTwo(funcKey) {
    // Find x where f(x) = 2
    switch(funcKey) {
        case 'identity':
            return [2];
        case 'reciprocal':
            return [0.5];
        case 'rational1':
            return [9]; // (x+3)/(x-3) = 2 when x = 9
        case 'log':
            return [Math.exp(2)];
        case 'floor':
            return [2.5]; // floor(2.5) = 2
        case 'piecewise1':
            return [Math.sqrt(2)]; // x² = 2 when x = √2
        case 'absolute':
            return [3]; // |x-1|/(x-1) = 1 when x > 1, never equals 2
        case 'tangent':
            return [Math.atan(2)];
        default:
            return [];
    }
}

function getOutputEqualsOne(funcKey) {
    // Find x where f(x) = 1
    switch(funcKey) {
        case 'identity':
            return [1];
        case 'reciprocal':
            return [1];
        case 'rational1':
            return []; // (x+3)/(x-3) = 1 has no solution
        case 'log':
            return [Math.E];
        case 'floor':
            return [1.5]; // floor(1.5) = 1
        case 'piecewise1':
            return [1, -1]; // x² = 1 when x = ±1
        case 'absolute':
            return [2]; // |x-1|/(x-1) = 1 when x > 1
        case 'tangent':
            return [Math.PI/4]; // tan(π/4) = 1
        default:
            return [];
    }
}

function getTangentDiscontinuities(funcKey) {
    // Find x where f(x) = (2k+1)π/2
    const tangentPoints = [];
    for (let k = -2; k <= 2; k++) {
        const point = (2*k + 1) * Math.PI / 2;
        const solutions = getOutputEqualsValue(funcKey, point);
        tangentPoints.push(...solutions);
    }
    return tangentPoints;
}

function getOutputEqualsValue(funcKey, value) {
    // Find x where f(x) = value
    switch(funcKey) {
        case 'identity':
            return [value];
        case 'reciprocal':
            return value !== 0 ? [1/value] : [];
        case 'rational1':
            // (x+3)/(x-3) = value
            // x+3 = value*(x-3)
            // x+3 = value*x - 3*value
            // x - value*x = -3*value - 3
            // x(1-value) = -3(value+1)
            // x = -3(value+1)/(1-value)
            return value !== 1 ? [-3*(value+1)/(1-value)] : [];
        case 'log':
            return value > 0 ? [Math.exp(value)] : [];
        case 'floor':
            return Number.isInteger(value) ? [value + 0.5] : [];
        case 'piecewise1':
            if (value >= 0) {
                return [Math.sqrt(value), -Math.sqrt(value)];
            } else {
                return [value + 1];
            }
        case 'absolute':
            if (value === 1) return [2];
            if (value === -1) return [0];
            return [];
        case 'tangent':
            return [Math.atan(value)];
        default:
            return [];
    }
}

generateHardCodedContinuityAnalysis();

// Generate all possible combinations and their continuity sets
function generatePuzzleDatabase() {
    const functionKeys = Object.keys(functions);
    
    for (let i = 0; i < functionKeys.length; i++) {
        for (let j = i; j < functionKeys.length; j++) {
            const f1Key = functionKeys[i];
            const f2Key = functionKeys[j];
            const f1 = functions[f1Key];
            const f2 = functions[f2Key];
            
            for (const opKey in operators) {
                const op = operators[opKey];
                const combinedFunc = op.combine(f1.evaluate, f2.evaluate);
                
                // Use mathematical analysis instead of point testing
                const key = `${f1Key}|${opKey}|${f2Key}`;
                const discontinuitySet = continuityAnalysis[key] || [];
                
                // Convert discontinuity set to human-readable format
                const continuitySet = formatContinuitySet(discontinuitySet);
                
                // Only add if the continuity set is interesting (not empty and not all reals)
                if (continuitySet !== "∅" && continuitySet !== "ℝ") {
                    puzzleDatabase.push({
                        f1: f1Key,
                        f2: f2Key,
                        operator: opKey,
                        targetSet: continuitySet,
                        combinedFunction: combinedFunc,
                        latex: `${f1.latex} ${op.latex} ${f2.latex}`
                    });
                }
            }
        }
    }
    
    console.log(`Generated ${puzzleDatabase.length} puzzles`);
}

function formatContinuitySet(discontinuitySet) {
    if (discontinuitySet.length === 0) {
        return "ℝ";
    } else {
        // Convert discontinuity points to human-readable format
        const displayValues = discontinuitySet.map(x => {
            // Handle common mathematical constants
            if (Math.abs(x - Math.PI/2) < 0.01) return "π/2";
            if (Math.abs(x - Math.PI) < 0.01) return "π";
            if (Math.abs(x - 3*Math.PI/2) < 0.01) return "3π/2";
            if (Math.abs(x - 2*Math.PI) < 0.01) return "2π";
            if (Math.abs(x - Math.PI/4) < 0.01) return "π/4";
            if (Math.abs(x - Math.E) < 0.01) return "e";
            if (Math.abs(x - Math.exp(2)) < 0.01) return "e²";
            if (Math.abs(x - Math.exp(3)) < 0.01) return "e³";
            if (Math.abs(x - Math.sqrt(2)) < 0.01) return "√2";
            if (Math.abs(x - Math.sqrt(3)) < 0.01) return "√3";
            if (Math.abs(x - 1/3) < 0.01) return "1/3";
            if (Math.abs(x - 0.5) < 0.01) return "0.5";
            if (Math.abs(x + 0.5) < 0.01) return "-0.5";
            if (Math.abs(x - 1.5) < 0.01) return "1.5";
            if (Math.abs(x - 2.5) < 0.01) return "2.5";
            if (Math.abs(x - 3.5) < 0.01) return "3.5";
            if (Math.abs(x - Math.atan(1)) < 0.01) return "π/4";
            if (Math.abs(x - Math.atan(2)) < 0.01) return "arctan(2)";
            if (Math.abs(x - Math.atan(3)) < 0.01) return "arctan(3)";
            // Round to 3 decimal places for other values
            return Math.round(x * 1000) / 1000;
        });
        
        if (displayValues.length === 1) {
            return `ℝ \\ {${displayValues[0]}}`;
        } else {
            return `ℝ \\ {${displayValues.join(', ')}}`;
        }
    }
}

function analyzeContinuity(combinedFunc) {
    // Test points around common discontinuity locations
    const testPoints = [-5, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const discontinuityPoints = [];
    
    for (const x of testPoints) {
        try {
            const result = combinedFunc(x);
            if (result === null || result === undefined || !isFinite(result)) {
                discontinuityPoints.push(x);
            }
        } catch (e) {
            discontinuityPoints.push(x);
        }
    }
    
    // Format the continuity set (complement of discontinuity set)
    return formatContinuitySet(discontinuityPoints);
}


// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    generatePuzzleDatabase();
    setupUI();
    generateNewPuzzle();
    
    // Load stats from localStorage
    loadStats();
    
    // Set up message timer
    setInterval(function() {
        if (messageTimer > 0) {
            messageTimer--;
                    if (messageTimer === 0) {
            setMessage("Select a function, then an operator, then another function!", "info");
        }
        }
    }, 100);
});

function setupUI() {
    // Create function buttons
    const functionContainer = document.getElementById('functionButtons');
    functionContainer.innerHTML = '';
    
    Object.keys(functions).forEach(key => {
        const func = functions[key];
        const button = document.createElement('button');
        button.className = 'function-btn';
        button.innerHTML = `<strong>${func.name}</strong><br><small>${func.description}</small>`;
        button.onclick = () => selectFunction(key);
        functionContainer.appendChild(button);
    });
    
    // Create operator buttons
    const operatorContainer = document.getElementById('operatorButtons');
    operatorContainer.innerHTML = '';
    
    Object.keys(operators).forEach(key => {
        const op = operators[key];
        const button = document.createElement('button');
        button.className = 'operator-btn';
        button.textContent = `${op.symbol} ${op.name}`;
        button.onclick = () => selectOperator(key);
        operatorContainer.appendChild(button);
    });
    
    // Setup control buttons
    document.getElementById('checkBtn').onclick = checkAnswer;
    document.getElementById('clearBtn').onclick = clearSelection;
    document.getElementById('hintBtn').onclick = showHint;
    document.getElementById('newGameBtn').onclick = generateNewPuzzle;
}

function selectFunction(funcKey) {
    if (selectedFunctions.includes(funcKey)) {
        setMessage("This function is already selected.", "error");
        return;
    }
    
    if (selectedFunctions.length === 0) {
        // First function
        selectedFunctions.push(funcKey);
        setMessage("Now select an operator.", "info");
    } else if (selectedFunctions.length === 1 && selectedOperator) {
        // Second function
        selectedFunctions.push(funcKey);
        setMessage("Great! Now click 'Check Answer' to see if your combination is correct.", "info");
    } else if (selectedFunctions.length === 1 && !selectedOperator) {
        setMessage("Please select an operator first, then the second function.", "error");
        return;
    } else {
        setMessage("You can only select two functions. Clear your selection first.", "error");
        return;
    }
    
    updateUI();
}

function selectOperator(opKey) {
    if (selectedFunctions.length === 0) {
        setMessage("Please select a function first.", "error");
        return;
    }
    
    if (selectedFunctions.length === 1) {
        selectedOperator = opKey;
        setMessage("Now select the second function.", "info");
    } else if (selectedFunctions.length === 2) {
        selectedOperator = opKey;
        setMessage("Perfect! Click 'Check Answer' to verify your combination.", "info");
    }
    
    updateUI();
}

function updateUI() {
    // Update function buttons
    const functionButtons = document.querySelectorAll('.function-btn');
    functionButtons.forEach((btn, index) => {
        const funcKey = Object.keys(functions)[index];
        btn.classList.remove('selected');
        if (selectedFunctions.includes(funcKey)) {
            btn.classList.add('selected');
        }
    });
    
    // Update operator buttons
    const operatorButtons = document.querySelectorAll('.operator-btn');
    operatorButtons.forEach((btn, index) => {
        const opKey = Object.keys(operators)[index];
        btn.classList.remove('selected');
        if (selectedOperator === opKey) {
            btn.classList.add('selected');
        }
    });
    
    // Update combination display
    const combinationDisplay = document.getElementById('combinationDisplay');
    if (selectedFunctions.length === 2 && selectedOperator) {
        const f1 = functions[selectedFunctions[0]];
        const f2 = functions[selectedFunctions[1]];
        const op = operators[selectedOperator];
        combinationDisplay.innerHTML = `${f1.latex} ${op.latex} ${f2.latex}`;
    } else if (selectedFunctions.length === 2) {
        const f1 = functions[selectedFunctions[0]];
        const f2 = functions[selectedFunctions[1]];
        combinationDisplay.innerHTML = `${f1.latex} ? ${f2.latex}`;
    } else if (selectedFunctions.length === 1 && selectedOperator) {
        const f1 = functions[selectedFunctions[0]];
        const op = operators[selectedOperator];
        combinationDisplay.innerHTML = `${f1.latex} ${op.latex} ?`;
    } else if (selectedFunctions.length === 1) {
        const f1 = functions[selectedFunctions[0]];
        combinationDisplay.innerHTML = `${f1.latex} ? ?`;
    } else {
        combinationDisplay.innerHTML = "Select a function, then an operator, then another function";
    }
}

function clearSelection() {
    selectedFunctions = [];
    selectedOperator = null;
    updateUI();
    setMessage("Selection cleared. Choose a function, then an operator, then another function.", "info");
}

function checkAnswer() {
    if (selectedFunctions.length !== 2 || !selectedOperator) {
        setMessage("Please select exactly two functions and an operator.", "error");
        return;
    }
    
    attempts++;
    updateStats();
    
    const f1Key = selectedFunctions[0];
    const f2Key = selectedFunctions[1];
    const opKey = selectedOperator;
    
    // Use the hard-coded continuity analysis
    const key = `${f1Key}|${opKey}|${f2Key}`;
    const userContinuitySet = formatContinuitySet(continuityAnalysis[key] || []);
    
    // Check if the user's combination produces the target continuity set
    if (userContinuitySet === currentPuzzle.targetSet) {
        score += 10;
        correctAnswers++;
        currentStreak++;
        const f1 = functions[f1Key];
        const f2 = functions[f2Key];
        const op = operators[opKey];
        setMessage(`🎉 Correct! Your combination ${f1.name} ${op.symbol} ${f2.name} is continuous exactly on ${currentPuzzle.targetSet}.`, "success");
        messageTimer = 300; // 5 seconds
        setTimeout(generateNewPuzzle, 3000);
    } else {
        currentStreak = 0;
        const f1 = functions[f1Key];
        const f2 = functions[f2Key];
        const op = operators[opKey];
        setMessage(`❌ Incorrect. Your combination ${f1.name} ${op.symbol} ${f2.name} is continuous on ${userContinuitySet}, but we need ${currentPuzzle.targetSet}. Try again!`, "error");
        messageTimer = 180; // 3 seconds
    }
    
    updateStats();
}

function showHint() {
    const hints = [
        "Think about where each function is discontinuous.",
        "Consider how the operator affects the domain of the combined function.",
        "Remember: division by zero creates discontinuities.",
        "Composition can change the domain significantly.",
        "Addition and multiplication preserve most discontinuities.",
        "The target set shows exactly where the function should be continuous."
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    setMessage(`💡 Hint: ${randomHint}`, "hint");
    messageTimer = 240; // 4 seconds
}

function generateNewPuzzle() {
    if (puzzleDatabase.length === 0) {
        setMessage("No more puzzles available. Refresh the page to generate new ones.", "error");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * puzzleDatabase.length);
    currentPuzzle = puzzleDatabase[randomIndex];
    
    // Remove this puzzle from the database to avoid repetition
    puzzleDatabase.splice(randomIndex, 1);
    
    // Update UI
    document.getElementById('targetSet').textContent = currentPuzzle.targetSet;
    clearSelection();
    
    totalGames++;
    updateStats();
    
    setMessage(`New puzzle! Find a combination that is continuous exactly on ${currentPuzzle.targetSet}.`, "info");
}



function setMessage(text, type) {
    message = text;
    messageType = type;
    
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('streak').textContent = currentStreak;
    
    const accuracy = totalGames > 0 ? Math.round((correctAnswers / totalGames) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    saveStats();
}

function saveStats() {
    const stats = {
        score,
        totalGames,
        correctAnswers,
        currentStreak,
        attempts
    };
    localStorage.setItem('continuityGameStats', JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem('continuityGameStats');
    if (saved) {
        const stats = JSON.parse(saved);
        score = stats.score || 0;
        totalGames = stats.totalGames || 0;
        correctAnswers = stats.correctAnswers || 0;
        currentStreak = stats.currentStreak || 0;
        attempts = stats.attempts || 0;
        updateStats();
    }
} 