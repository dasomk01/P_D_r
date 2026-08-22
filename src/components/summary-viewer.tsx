import type { InlineRun, InlineStyle, SummaryBlock } from "@/lib/summary/parse";

const INLINE_STYLE: Record<InlineStyle, React.CSSProperties> = {
  normal: {},
  yama: { color: "#7030A0", textDecoration: "underline" },
  yamaBold: { color: "#7030A0", textDecoration: "underline", fontWeight: 700 },
  emphasis: { color: "#CC0000" },
  professorNote: { color: "#0070C0" },
};

function Runs({ runs }: { runs: InlineRun[] }) {
  return (
    <>
      {runs.map((run, i) => (
        <span key={i} style={INLINE_STYLE[run.style]}>
          {run.text}
        </span>
      ))}
    </>
  );
}

function Box({
  bg,
  border,
  children,
}: {
  bg: string;
  border?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="my-2 rounded-md px-4 py-3 text-sm leading-relaxed"
      style={{ backgroundColor: bg, border: border ? `1px solid ${border}` : undefined }}
    >
      {children}
    </div>
  );
}

export function SummaryViewer({ blocks }: { blocks: SummaryBlock[] }) {
  return (
    <article className="flex flex-col gap-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="mt-6 mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {block.text}
              </h2>
            );

          case "image":
            return (
              <p key={i} className="italic text-zinc-400 dark:text-zinc-600">
                [이미지: {block.label}]
              </p>
            );

          case "yamaOnly":
            return (
              <div key={i} className="my-2">
                <p style={{ color: "#7030A0", fontWeight: 700 }}>[YAMA-ONLY]</p>
                <ul className="list-disc pl-5">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );

          case "tyBox":
            return (
              <Box key={i} bg="#FFD7D7">
                <span style={{ color: "#CC0000", fontWeight: 700 }}>
                  {block.quote && `"${block.quote}" - `}
                  <Runs runs={block.runs} />
                </span>
              </Box>
            );

          case "case":
            return (
              <Box key={i} bg="#EBF3FB">
                <Runs runs={block.runs} />
              </Box>
            );

          case "example":
            return (
              <Box key={i} bg="#F0FFF0">
                <Runs runs={block.runs} />
              </Box>
            );

          case "lectureOnly":
          case "unconfirmed":
            return (
              <p key={i} className="italic" style={{ color: "#999999" }}>
                {block.type === "unconfirmed" && "[확인필요] "}
                <Runs runs={block.runs} />
              </p>
            );

          case "lectureEmphasis":
            return (
              <p key={i} style={{ color: "#FF6600" }}>
                <Runs runs={block.runs} />
              </p>
            );

          case "paragraph":
          default:
            return (
              <p key={i}>
                <Runs runs={block.runs} />
              </p>
            );
        }
      })}
    </article>
  );
}
