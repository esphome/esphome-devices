import {
  VALID_TYPES,
  VALID_BOARDS,
  VALID_STANDARDS,
} from "../utils/validFrontmatter";

interface ValidOptionsProps {
  set: ReadonlySet<string>;
}

export function ValidOptions({ set }: ValidOptionsProps) {
  const values = Array.from(set).sort();
  return (
    <>
      {values.map((value, index) => (
        <span key={value}>
          <code>{value}</code>
          {index < values.length - 1 && ", "}
        </span>
      ))}
    </>
  );
}

export function TypeOptions() {
  return <ValidOptions set={VALID_TYPES} />;
}

export function BoardOptions() {
  return <ValidOptions set={VALID_BOARDS} />;
}

export function StandardOptions() {
  return <ValidOptions set={VALID_STANDARDS} />;
}
