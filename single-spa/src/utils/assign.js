// Object.assign() is not available in IE11. And the babel compiled output for object spread
// syntax checks a bunch of Symbol stuff and is almost a kb. So this function is the smaller replacement.
// 将参数列表的key, value都移到arguments[0]上，相当于Object.assign()的简单替代
export function assign() {
  for (let i = arguments.length - 1; i > 0; i--) {
    for (let key in arguments[i]) {
      if (key === "__proto__") {
        continue;
      }
      arguments[i - 1][key] = arguments[i][key];
    }
  }

  return arguments[0];
}
