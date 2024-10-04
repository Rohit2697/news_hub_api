export default function trimString(input: string): string {
  const trimIndex = input.indexOf(' [+');
  if (trimIndex !== -1) {
    return input.substring(0, trimIndex).trim();
  }
  return input.trim();
}