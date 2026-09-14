/**
 * Ambient stub for the Framer code-component API.
 * In Framer these are provided by the runtime; this stub only exists so the
 * local Vite/TypeScript harness can type-check `src/framer-entry.tsx`.
 */
declare module "framer" {
  export const ControlType: {
    Boolean: "boolean";
    Number: "number";
    String: "string";
    Color: "color";
    Enum: "enum";
    Image: "image";
    ResponsiveImage: "responsiveimage";
    File: "file";
    Link: "link";
    EventHandler: "eventhandler";
    Object: "object";
    Array: "array";
  };
  export function addPropertyControls(
    component: unknown,
    controls: Record<string, { type: string; title?: string; [k: string]: unknown }>
  ): void;
  /** Where the component is currently being rendered (editor canvas, preview, export, thumbnail). */
  export const RenderTarget: {
    current(): string;
    canvas: string;
    preview: string;
    export: string;
    thumbnail: string;
  };
}
