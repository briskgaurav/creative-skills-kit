/**
 * Minimal YAML-frontmatter parser.
 *
 * Skills are plain-text SKILL.md files, so we deliberately avoid pulling in
 * a YAML dependency. This handles exactly the shapes our frontmatter needs:
 * flat `key: value` pairs, quoted strings, inline `[a, b, c]` lists,
 * indented `- item` block lists, and folded/literal block scalars
 * (`key: >-` / `key: |-` and friends). Anything more exotic is out of scope.
 */

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const BLOCK_SCALAR_RE = /^[|>][+-]?\d*$/;

/**
 * @param {string} raw
 * @returns {{ data: Record<string, unknown>, body: string }}
 */
export function parseFrontmatter(raw) {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) {
    return { data: {}, body: raw };
  }

  const [, block, body] = match;
  const data = {};
  const lines = block.split(/\r?\n/);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }

    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!kv) {
      i++;
      continue;
    }

    const [, key, rawValue] = kv;

    if (BLOCK_SCALAR_RE.test(rawValue)) {
      const { text, nextIndex } = consumeBlockScalar(lines, i + 1, rawValue[0] === ">");
      data[key] = text;
      i = nextIndex;
      continue;
    }

    if (rawValue === "") {
      // Possibly a block list on following lines.
      const list = [];
      let j = i + 1;
      while (j < lines.length) {
        const listItem = /^\s*-\s+(.*)$/.exec(lines[j]);
        if (!listItem) break;
        list.push(unquote(listItem[1].trim()));
        j++;
      }
      data[key] = list;
      i = j;
      continue;
    }

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      const inner = rawValue.slice(1, -1).trim();
      data[key] = inner === "" ? [] : inner.split(",").map((s) => unquote(s.trim()));
      i++;
      continue;
    }

    data[key] = unquote(rawValue.trim());
    i++;
  }

  return { data, body: body ?? "" };
}

/**
 * Consumes an indented YAML block scalar (folded `>` or literal `|`),
 * starting right after the `key: >-` line. Stops at the first line that
 * isn't indented (or end of block). Chomping indicators (`-`/`+`) are
 * treated the same: trailing blank lines are trimmed either way.
 */
function consumeBlockScalar(lines, startIndex, folded) {
  const collected = [];
  let blockIndent = null;
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      collected.push("");
      i++;
      continue;
    }

    const indent = /^(\s*)/.exec(line)[1].length;
    if (blockIndent === null) {
      if (indent === 0) break;
      blockIndent = indent;
    }
    if (indent < blockIndent) break;

    collected.push(line.slice(blockIndent));
    i++;
  }

  while (collected.length && collected[collected.length - 1] === "") {
    collected.pop();
  }

  const text = folded
    ? collected.join(" ").replace(/\s+/g, " ").trim()
    : collected.join("\n");

  return { text, nextIndex: i };
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
