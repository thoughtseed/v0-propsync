/**
 * Generates initials from a full name
 * @param fullName The full name to generate initials from
 * @returns A string of up to 2 characters representing the person's initials
 */
export function generateInitials(fullName: string): string {
  if (!fullName) return "??"
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
