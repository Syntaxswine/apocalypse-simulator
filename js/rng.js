// Deterministic RNG. Every run in this simulator is reproducible from its seed:
// same seed + same parameters => same history, down to the year. That is not a
// nicety, it is what makes a claim like "at these settings the modal ending is X"
// checkable by somebody else.
//
// splitmix64-style 32-bit variant (mulberry32). Fast, passes the smallness tests
// we care about, and has no dependency on Math.random — which is banned here so
// that nothing can silently make a run irreproducible.

export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    // uniform [0,1)
    next,
    // true with probability p
    bern: (p) => next() < p,
    // uniform [lo,hi)
    range: (lo, hi) => lo + next() * (hi - lo),
    // integer in [0,n)
    int: (n) => Math.floor(next() * n),
    // pick from an array
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    // standard normal, Box-Muller. Cached pair discarded on purpose: keeping a
    // cache would make the stream depend on call parity, which breaks the
    // "same seed, same history" guarantee when a hazard is toggled off.
    normal: () => {
      const u = Math.max(next(), 1e-12), v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    // lognormal with a stated median and a multiplicative sigma. This is the
    // right default shape for catastrophe magnitudes: bounded below by zero,
    // fat to the right, and specified by "typical value" and "how many times
    // bigger the bad ones are" rather than by a mean nobody can intuit.
    lognormal(median, sigma) {
      return median * Math.exp(sigma * this.normal());
    },
  };
}

// Hash a string to a 32-bit seed, so a shared URL like #seed=carrington
// reproduces exactly. FNV-1a.
export function seedFromString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
