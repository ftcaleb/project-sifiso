/**
 * Shared scroll state for the hero survey.
 *
 * A plain mutable singleton rather than React state: the 3D scene reads this
 * every frame and the value changes on every scroll event. Putting it in state
 * would re-render the tree 60 times a second for no reason.
 */
export const heroScan = {
  /** 0 at rest, 1 when the survey has crossed the whole city. */
  progress: 0,
};

/** Total components on the register, matching the MERIDIAN™ dashboard. */
export const TOTAL_COMPONENTS = 186204;
