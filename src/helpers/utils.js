export default function setFakeDelay(callback) {
  return setTimeout(() => {
    callback();
  }, 500); // 500 milliseconds
}
