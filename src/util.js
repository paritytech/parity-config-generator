export function mix (a, b) {
  if (typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) || Array.isArray(b)) {
    return typeof b === 'undefined' ? a : b;
  }

  Object.keys(a).forEach(key => {
    a[key] = mix(a[key], b[key]);
  });

  return a;
}

export function clone (val) {
  return JSON.parse(JSON.stringify(val));
}
