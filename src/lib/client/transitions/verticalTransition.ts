import { cubicOut } from "svelte/easing";

export default function verticalTransition(
  node: Node & Element,
  { delay = 0, duration = 400, easing = cubicOut } = {},
) {
  // Get initial computed styles for all properties we want to animate
  const computed = getComputedStyle(node);

  // Helper function to safely parse a CSS value string (e.g., "10px" -> {value: 10, unit: "px"})
  const parseStyleValue = (style: string) => {
    const match = style.match(/^(\d*\.?\d+)(.+)$/);
    if (match) {
      // Found a number followed by a unit
      return { value: parseFloat(match[1]), unit: match[2] };
    }

    // Handle specific cases like '0px', '0%', unitless '0'
    if (style === "0px") return { value: 0, unit: "px" };
    if (style === "0%") return { value: 0, unit: "%" };
    if (parseFloat(style) === 0) return { value: 0, unit: "px" }; // Sometimes computedStyle might return '0'

    // If parsing fails, log a warning and default to 0px
    console.warn("Could not parse style value for verticalTransition transition:", style);
    return { value: 0, unit: "px" };
  };

  // Parse and store initial values and units for all properties
  const { value: initialHeight, unit: heightUnit } = parseStyleValue(
    computed.height,
  );
  const { value: initialPaddingTop, unit: paddingTopUnit } = parseStyleValue(
    computed.paddingTop,
  );
  const { value: initialPaddingBottom, unit: paddingBottomUnit } =
    parseStyleValue(computed.paddingBottom);
  const { value: initialMarginTop, unit: marginTopUnit } = parseStyleValue(
    computed.marginTop,
  );
  const { value: initialMarginBottom, unit: marginBottomUnit } =
    parseStyleValue(computed.marginBottom);

  // Store the original values to animate from
  const oHeight = initialHeight;
  const oPT = initialPaddingTop;
  const oPB = initialPaddingBottom;
  const oMT = initialMarginTop;
  const oMB = initialMarginBottom;

  return {
    delay,
    duration,
    easing,
    // Use (1 - t) to animate FROM the original value TO 0
    css: (t: number) => `
          height: ${(t) * oHeight}${heightUnit};
          padding-top: ${(t) * oPT}${paddingTopUnit};
          padding-bottom: ${(t) * oPB}${paddingBottomUnit};
          margin-top: ${(t) * oMT}${marginTopUnit};
          margin-bottom: ${(t) * oMB}${marginBottomUnit};
          opacity: ${t}; /* Also animate opacity from 1 down to 0 */
          overflow: hidden; /* Keep content from overflowing during collapse */
      `,
  };
}