export function Avatar({ username, hue, size = 40 }: { username: string; hue: number; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(135deg, hsl(${hue} 70% 50%), hsl(${(hue + 40) % 360} 70% 38%))`,
      }}
    >
      {username.slice(0, 2).toUpperCase()}
    </span>
  );
}
