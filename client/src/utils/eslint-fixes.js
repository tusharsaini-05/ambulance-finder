"use client"

/**
 * ESLint Fixes Guide
 *
 * This file provides guidance on fixing common ESLint warnings in your project.
 */

import { useEffect } from "react"

/**
 * 1. Replace == with === (eqeqeq rule)
 *    - Search for all instances of == and replace with ===
 *    - Example: if (type == 0) → if (type === 0)
 */
const fixEqualityComparison = (type) => {
  // Bad:
  // if (type == 0) return "Client"

  // Good:
  if (type === 0) return "Client"
  return "Driver"
}

/**
 * 2. Add alt attributes to img elements (jsx-a11y/alt-text rule)
 *    - Add descriptive alt text to all img elements
 *    - Example: <img src="profile.jpg" /> → <img src="profile.jpg" alt="User profile" />
 *    - For decorative images, use empty alt: <img src="decoration.jpg" alt="" />
 */
const ImageComponent = () => {
  // Bad:
  // <img src="/profile.jpg" />

  // Good:
  return <img src="/profile.jpg" alt="User profile" />
}

/**
 * 3. Fix useEffect dependencies (react-hooks/exhaustive-deps rule)
 *    - Add all variables used inside useEffect to the dependency array
 */
const fetchData = () => {} // Placeholder for fetchData function

const ComponentWithEffect = ({ id }) => {
  // Bad:
  // useEffect(() => {
  //   fetchData(id);
  // }, []);

  // Good:
  useEffect(() => {
    fetchData(id)
  }, [id])

  return <div>Component</div>
}

/**
 * 4. Style prop fix
 *    - Style props must be objects, not strings
 */
const StyledComponent = () => {
  // Bad:
  // <div style="color: red">Text</div>

  // Good:
  return <div style={{ color: "red" }}>Text</div>
}

export { fixEqualityComparison, ImageComponent, ComponentWithEffect, StyledComponent }
