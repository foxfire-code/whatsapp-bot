export function isOwner(sender, owners = []) {
  const num = sender.split("@")[0];
  return owners.includes(num);
}
