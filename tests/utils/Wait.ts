let timeoutId: NodeJS.Timeout;

export default function Wait(ms = 10000) {
  return new Promise((resolve) => {
    if (timeoutId !== undefined) resolve(true);
    timeoutId = setTimeout(() => {
      resolve(true);
    }, ms); // wait 10 sec
  });
}
