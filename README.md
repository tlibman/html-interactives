# HTML Mathematical Interactives

A collection of interactive HTML/JavaScript tools designed to help students learn and visualize various mathematical concepts. These tools provide hands-on, visual learning experiences for calculus, complex analysis, and other mathematical topics.

## 🎯 Overview

This project contains a series of standalone HTML files that use modern web technologies (HTML5, JavaScript, p5.js, PIXI.js) to create interactive mathematical visualizations and games. Each tool is designed to be educational, engaging, and accessible directly in a web browser without requiring any installation.

## 📚 Available Tools

### 1. **Epsilon-Delta Continuity Learning Tool** (`epsilon_delta_continuity.html`)
- **Purpose**: Interactive exploration of the formal definition of continuity using ε-δ notation
- **Features**:
  - Visual representation of functions with adjustable ε and δ values
  - Multiple function options (polynomial, trigonometric, exponential)
  - Real-time feedback on continuity conditions
  - Educational explanations of the ε-δ relationship
- **Educational Value**: Helps students understand the rigorous definition of continuity through visual experimentation

### 2. **Complex Number Puzzle Game** (`complex_puzzle_game.html`)
- **Purpose**: Game-based learning of complex number transformations
- **Features**:
  - Interactive complex plane visualization
  - Multiple transformation types (translation, rotation, scaling, conjugation)
  - Progressive difficulty levels
  - Score tracking and feedback system
- **Educational Value**: Reinforces understanding of complex number operations through gamification

### 3. **Riemann Sum Explorer** (`riemann.html`)
- **Purpose**: Visualization of Riemann sums and numerical integration
- **Features**:
  - Multiple function types (polynomial, trigonometric, exponential, logarithmic)
  - Adjustable number of rectangles (1-100)
  - Different sum types (left, right, midpoint)
  - Real-time area calculation and error analysis
  - True area comparison when available
- **Educational Value**: Demonstrates the concept of numerical integration and convergence

### 4. **Euler's Method Visualizer** (`euler.html`)
- **Purpose**: Interactive exploration of Euler's method for solving differential equations
- **Features**:
  - Visual representation of the Bernoulli ODE: y' = y² - y
  - Adjustable step size and initial conditions
  - Comparison with exact solution
  - Slope field visualization
  - Error analysis
- **Educational Value**: Shows the relationship between numerical and analytical solutions to ODEs

### 5. **Taylor Series Visualizer** (`taylor2.html`)
- **Purpose**: Interactive exploration of Taylor and Fourier series approximations
- **Features**:
  - Multiple function types (sin, cos, exp, ln, arctan, geometric series)
  - Adjustable number of terms
  - Real-time visualization of convergence
  - Comparison between Taylor and Fourier series
  - Support for both standard and special functions
- **Educational Value**: Demonstrates how series approximations improve with more terms

### 6. **Mean Value Theorem Games** (`mvt_game.html`, `mvt_game_easy.html`, `mvt2.html`)
- **Purpose**: Interactive exploration of the Mean Value Theorem
- **Features**:
  - Multiple function options with different characteristics
  - Drag-and-drop interface for selecting points
  - Real-time slope calculations and comparisons
  - Educational feedback and hints
  - Different difficulty levels
- **Educational Value**: Helps students understand the geometric interpretation of the Mean Value Theorem

### 7. **Interval Notation Visualizer** (`interval.html`)
- **Purpose**: Visual representation of interval notation on the number line
- **Features**:
  - Interactive input for interval notation
  - Visual representation of open/closed intervals
  - Support for various interval formats
  - Real-time updates
- **Educational Value**: Reinforces understanding of interval notation and set theory

### 8. **Continuity Puzzle Game** (`continuity_puzzle_game.html`)
- **Purpose**: Game-based learning of function continuity concepts
- **Features**:
  - Interactive puzzle-solving interface
  - Multiple continuity scenarios
  - Progressive difficulty levels
  - Educational feedback system
- **Educational Value**: Reinforces understanding of continuity through interactive problem-solving

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Usage
1. Clone or download this repository
2. Open any `.html` file in your web browser
3. Start exploring and learning!

### Example Usage
```bash
# Clone the repository
git clone https://github.com/tlibman/html-interactives.git

# Navigate to the project directory
cd html-interactives

# Open any tool in your browser
open epsilon_delta_continuity.html  # macOS
# or
start epsilon_delta_continuity.html  # Windows
# or simply double-click the file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **p5.js**: Graphics and animation library
- **PIXI.js**: 2D rendering engine (for interval visualizer)

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
html-interactives/
├── README.md
├── epsilon_delta_continuity.html      # Epsilon-delta continuity tool
├── epsilon_delta_continuity.js        # Supporting JavaScript
├── complex_puzzle_game.html           # Complex number puzzle game
├── continuity_puzzle_game.html        # Continuity puzzle game
├── continuity_puzzle_game.js          # Supporting JavaScript
├── epsilon-delta-game.html            # Alternative epsilon-delta game
├── riemann.html                       # Riemann sum explorer
├── euler.html                         # Euler's method visualizer
├── taylor2.html                       # Taylor series visualizer
├── mvt_game.html                      # Mean Value Theorem game
├── mvt_game_easy.html                 # Easy MVT game
├── mvt2.html                          # Alternative MVT game
└── interval.html                      # Interval notation visualizer
```

## 🎓 Educational Applications

### Classroom Use
- **Interactive Demonstrations**: Use these tools during lectures to demonstrate mathematical concepts
- **Student Exploration**: Allow students to experiment with parameters and observe results
- **Homework Assignments**: Assign specific explorations or challenges using these tools
- **Assessment**: Use the games and interactive elements for formative assessment

### Self-Study
- **Concept Reinforcement**: Use tools to reinforce understanding of mathematical concepts
- **Visual Learning**: Benefit from visual representations of abstract mathematical ideas
- **Practice**: Use games and interactive elements for practice and skill development

### Topics Covered
- **Calculus**: Limits, continuity, derivatives, integrals, series
- **Complex Analysis**: Complex numbers, transformations
- **Differential Equations**: Numerical methods, exact solutions
- **Real Analysis**: Epsilon-delta definitions, convergence
- **Set Theory**: Interval notation, number lines

## 🤝 Contributing

Contributions are welcome! If you'd like to add new mathematical tools or improve existing ones:

1. Fork the repository
2. Create a feature branch
3. Add your interactive tool or improvements
4. Ensure the tool is educational and well-documented
5. Submit a pull request

### Guidelines for New Tools
- Keep tools focused on a specific mathematical concept
- Include clear instructions and educational context
- Use responsive design for different screen sizes
- Ensure accessibility where possible
- Add appropriate comments in the code

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍🏫 Author

Created by [Tanny Libman](https://github.com/tlibman) for educational purposes.

## 🙏 Acknowledgments

- **p5.js Team**: For the excellent graphics library
- **PIXI.js Team**: For the 2D rendering engine
- **Mathematical Community**: For inspiration and educational content
- **Students and Educators**: For feedback and suggestions

## 📞 Support

If you have questions, suggestions, or encounter issues:
- Open an issue on GitHub
- Contact the author directly
- Check the browser console for any error messages

---

**Happy Learning!** 🎓✨

These tools are designed to make mathematics more accessible, engaging, and understandable through interactive visualization and hands-on exploration. 