function lexer(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
        let char = input[cursor];

        // skipping spaces
        if (/\s/.test(char)) {
            cursor++;
            continue;
        }

        // Character
        if (/[a-zA-Z]/.test(char)) {
            let word = "";
            while (/[a-zA-Z]/.test(char)) {
                word += char;
                char = input[++cursor];
            }
            if (word === "ye" || word === "bata" || word === "agar" || word === "warna") {
                tokens.push({ type: "keyword", value: word });
            } else {
                tokens.push({ type: "identifier", value: word });
            }
            continue;
        }

        // Number
        if (/[0-9]/.test(char)) {
            let num = "";
            while (/[0-9]/.test(char)) {
                num += char;
                char = input[++cursor];
            }
            tokens.push({ type: "number", value: parseInt(num) });
            continue;
        }

        // Semicolon
        if (char === ";") {
            tokens.push({ type: "semicolon", value: ";" });
            cursor++;
            continue;
        }

        // Operator
        if (/[\+\-\*\%\/\\\<\>\=]/.test(char)) {
            tokens.push({ type: "operator", value: char });
            cursor++;
            continue;
        }
    }

    return tokens;
}

// Define the parser function
function parser(tokens) {
    const ast = {
      type: "Program",
      body: [],
    };
  
    while (tokens.length > 0) {
      let token = tokens.shift();
  
      if (token.type === "keyword" && token.value === "ye") {
        let declaration = {
          type: "Declaration",
          name: tokens.shift().value,
          value: null,
        };
  
        if (tokens[0].type === "operator" && tokens[0].value === "=") {
          tokens.shift();
  
          let expression = "";
          while (tokens.length > 0 && tokens[0].type !== "keyword") {
            expression += tokens.shift().value;
          }
          declaration.value = expression.trim();
        }
        ast.body.push(declaration);
      }
  
      if (token.type === "keyword" && token.value === "bata") {
        // Parsing print statements
        let expression = tokens.shift().value;
        // Check if it's an if-else condition
        if (expression.includes('?')) {
          let parts = expression.split('?');
          let condition = parts[0].trim();
          let trueExpression = parts[1].split(':')[0].trim();
          let falseExpression = parts[1].split(':')[1].trim();
          ast.body.push({
            type: "ConditionalPrint",
            condition: condition,
            trueExpression: trueExpression,
            falseExpression: falseExpression
          });
        } else {
          ast.body.push({
            type: "Print",
            expression: expression
          });
        }
      }
    }
  
    return ast;
  }
  

function codeGenerate(node) {
    switch (node.type) {
      case "Program":
        return node.body.map(codeGenerate).join("\n");
  
      case "Declaration":
        return `${node.name} = ${node.value};`;
  
      case "Print":
        return `console.log(${node.expression});`;
  
      case "ConditionalPrint":
        return `console.log(${node.condition} ? ${node.trueExpression} : ${node.falseExpression});`;
    }
  }
const input = `
    ye a = 20;
    ye b = 10;
    agar a < b;
        ye c = a + b;
    warna
        ye c = a - b;
    bata c;
`;

function compiler(input) {
    const tokens = lexer(input);
    const ast = parser(tokens);
    const exCode = codeGenerate(ast); // Changed to use lowercase function name
    return exCode;
}

function codeRunner(input) {
    eval(input);
}

// Compile and execute the input
let raw = compiler(input);
// console.log(raw);
codeRunner(raw);
