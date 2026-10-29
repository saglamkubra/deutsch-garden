type Node = null | boolean | number | [number, ...unknown[]];
type Packed = {
  version: number;
  strings: string[];
  shapes: string[][];
  root: Node;
};
/** Decode trusted build-time JSON; never evaluates code or accepts remote input. */
export function unpackCourses(value: unknown): unknown {
  const data = value as Packed;
  if (data.version !== 1) throw Error("Ders veri biçimi desteklenmiyor.");
  function decode(node: unknown): unknown {
    if (!Array.isArray(node)) return node;
    if (node[0] === 0) return data.strings[node[1]];
    if (node[0] === 1) return node.slice(1).map(decode);
    if (node[0] === 2)
      return Object.fromEntries(
        data.shapes[node[1]].map((key, i) => [key, decode(node[i + 2])]),
      );
    throw Error("Ders verisi çözülemedi.");
  }
  return decode(data.root);
}
