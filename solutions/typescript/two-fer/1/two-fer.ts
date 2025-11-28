/**
 * This stub is provided to make it straightforward to get started.
 */

export function twoFer(who?: string): string {
  let name: string;

  if (who === undefined) {
    name = "you";
  } else {
    name = who;
  }

  return `One for ${name}, one for me.`;
}
