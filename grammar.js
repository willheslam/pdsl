const {
  obj,
  entry,
  not,
  and,
  or,
  gt,
  gte,
  lt,
  lte,
  btw
} = require("./helpers");
const tokens = {
  NOT: "\\!",
  AND: "\\&\\&",
  OR: "\\|\\|",
  BTW: "\\<\\s\\<",
  GT: "\\>",
  GTE: "\\>\\=",
  LT: "\\<",
  LTE: "\\<\\=",
  ENTRY: "\\:",
  OBJ: "\\{",
  OBJ_CLOSE: "\\}",
  ARG: "\\,",
  SYMBOL: "[a-zA-Z_]+[a-zA-Z0-9_-]*",
  NUMBER: "-?\\d+\\.?\\d*",
  STRING_DOUBLE: `\\"[^\\"]*\\"`,
  STRING_SINGLE: `\\'[^\\']*\\'`,
  PREDICATE_LOOKUP: "@{LINK:(\\d+)}",
  PRECEDENCE: "\\(",
  PRECEDENCE_CLOSE: "\\)"
};
const grammar = {
  // LITERALS
  [tokens.SYMBOL]: token => ({
    type: "SymbolLiteral",
    token,
    toString() {
      return token;
    }
  }),
  [tokens.NUMBER]: token => ({
    type: "NumericLiteral",
    token: Number(token),
    toString() {
      return token;
    }
  }),
  [tokens.STRING_DOUBLE]: token => ({
    type: "StringLiteral",
    token: token.match(/\"(.*)\"/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.STRING_SINGLE]: token => ({
    type: "StringLiteral",
    token: token.match(/\'(.*)\'/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.PREDICATE_LOOKUP]: token => {
    return {
      type: "PredicateLookup",
      token: token.match(/@{LINK:(\d+)}/)[1],
      toString() {
        return token;
      }
    };
  },

  // OPERATORS

  [tokens.NOT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: not,
    toString() {
      return token;
    },
    prec: 10
  }),
  [tokens.AND]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: and,
    prec: 20,
    toString() {
      return token;
    }
  }),

  [tokens.OR]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: or,
    prec: 30,
    toString() {
      return token;
    }
  }),
  [tokens.BTW]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: btw,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GTE]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: gte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LTE]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: lte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: gt,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: lt,
    prec: 50,
    toString() {
      return token;
    }
  }),

  // functions have highest precidence
  [tokens.ENTRY]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: entry,
    prec: 100,
    toString() {
      return token;
    }
  }),

  [tokens.OBJ]: token => ({
    type: "VariableArityOperator",
    token,
    arity: 0,
    runtime: obj,
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.OBJ_CLOSE]: token => ({
    type: "VariableArityOperatorClose",
    token,
    matchingToken: "{",
    toString() {
      return token;
    }
  }),

  [tokens.ARG]: token => ({
    type: "ArgumentSeparator",
    token,
    toString() {
      return token;
    }
  }),

  [tokens.PRECEDENCE]: token => ({
    type: "PrecidenceOperator",
    token,
    toString() {
      return token;
    }
  }),
  [tokens.PRECEDENCE_CLOSE]: token => ({
    type: "PrecidenceOperatorClose",
    token,
    toString() {
      return token;
    }
  })
};

function isOperator(node) {
  if (!node) return false;
  return node.type === "Operator";
}

function isLiteral(node) {
  if (!node) return false;
  return (
    { NumericLiteral: 1, StringLiteral: 1, SymbolLiteral: 1 }[node.type] ||
    false
  );
}

function isPredicateLookup(node) {
  if (!node) return false;
  return node.type === "PredicateLookup";
}
function isVaradicFunctionClose(node) {
  if (!node) return false;
  return node.type === "VariableArityOperatorClose";
}

function isVaradicFunction(node) {
  if (!node) return false;
  return node.type === "VariableArityOperator";
}

function isArgumentSeparator(node) {
  if (!node) return false;
  return node.type === "ArgumentSeparator";
}
function isPrecidenceOperator(node) {
  if (!node) return false;
  return node.type === "PrecidenceOperator";
}

function isPrecidenceOperatorClose(node) {
  if (!node) return false;
  return node.type === "PrecidenceOperatorClose";
}

module.exports = {
  grammar,
  tokens,
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
};
