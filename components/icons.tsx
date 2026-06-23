/* MegaPortal — iconos (stroke, lucide-style). Exportados como { Icon } */
import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = (props: IconProps) => React.ReactElement;

export const Icon = (function () {
  const S = ({ d, children, ...p }: { d?: string; children?: React.ReactNode } & IconProps): React.ReactElement =>
    React.createElement(
      "svg",
      { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...p },
      children || React.createElement("path", { d })
    );
  const P = (...ds: string[]): IconComponent => (props) => S({ ...props, children: ds.map((d, i) => React.createElement("path", { d, key: i })) });
  const raw = (children: React.ReactNode): IconComponent => (props) => S({ ...props, children });

  return {
    home: P("M3 10.5 12 3l9 7.5", "M5 9.5V21h14V9.5", "M9 21v-6h6v6"),
    cart: raw([
      React.createElement("circle", { cx: 9, cy: 20, r: 1.4, key: "a" }),
      React.createElement("circle", { cx: 18, cy: 20, r: 1.4, key: "b" }),
      React.createElement("path", { d: "M2 3h2.5l2 12.5h11l2-9H6", key: "c" }),
    ]),
    plus: P("M12 5v14", "M5 12h14"),
    box: raw([
      React.createElement("path", { d: "M21 8 12 3 3 8v8l9 5 9-5V8Z", key: "a" }),
      React.createElement("path", { d: "M3 8l9 5 9-5", key: "b" }),
      React.createElement("path", { d: "M12 13v8", key: "c" }),
    ]),
    wallet: raw([
      React.createElement("path", { d: "M3 7a2 2 0 0 1 2-2h12v4", key: "a" }),
      React.createElement("path", { d: "M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4", key: "b" }),
      React.createElement("path", { d: "M21 9v6h-5a3 3 0 0 1 0-6h5Z", key: "c" }),
    ]),
    doc: raw([
      React.createElement("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z", key: "a" }),
      React.createElement("path", { d: "M14 3v5h5", key: "b" }),
      React.createElement("path", { d: "M9 13h6M9 17h6", key: "c" }),
    ]),
    sheet: raw([
      React.createElement("rect", { x: 4, y: 3, width: 16, height: 18, rx: 2, key: "a" }),
      React.createElement("path", { d: "M8 8h8M8 12h8M8 16h5", key: "b" }),
    ]),
    bell: P("M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"),
    check: P("M20 6 9 17l-5-5"),
    chevR: P("M9 6l6 6-6 6"),
    chevL: P("M15 6l-9 6 9 6"),
    arrowR: P("M5 12h14", "M13 5l7 7-7 7"),
    truck: raw([
      React.createElement("path", { d: "M3 6h11v9H3z", key: "a" }),
      React.createElement("path", { d: "M14 9h4l3 3v3h-7z", key: "b" }),
      React.createElement("circle", { cx: 7, cy: 18, r: 1.6, key: "c" }),
      React.createElement("circle", { cx: 17, cy: 18, r: 1.6, key: "d" }),
    ]),
    search: raw([
      React.createElement("circle", { cx: 11, cy: 11, r: 7, key: "a" }),
      React.createElement("path", { d: "m20 20-3.2-3.2", key: "b" }),
    ]),
    download: P("M12 3v12", "M7 11l5 4 5-4", "M5 21h14"),
    upload: P("M12 21V9", "M7 13l5-4 5 4", "M5 3h14"),
    logout: P("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"),
    pin: P("M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"),
    calendar: raw([
      React.createElement("rect", { x: 3, y: 5, width: 18, height: 16, rx: 2, key: "a" }),
      React.createElement("path", { d: "M3 9h18M8 3v4M16 3v4", key: "b" }),
    ]),
    user: P("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21a8 8 0 0 1 16 0"),
    phone: P("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"),
    mail: raw([
      React.createElement("rect", { x: 3, y: 5, width: 18, height: 14, rx: 2, key: "a" }),
      React.createElement("path", { d: "m3 7 9 6 9-6", key: "b" }),
    ]),
    info: raw([
      React.createElement("circle", { cx: 12, cy: 12, r: 9, key: "a" }),
      React.createElement("path", { d: "M12 11v5M12 8h.01", key: "b" }),
    ]),
    pen: P("M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"),
    file: raw([
      React.createElement("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z", key: "a" }),
      React.createElement("path", { d: "M14 3v5h5", key: "b" }),
    ]),
    eye: P("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
    clock: raw([
      React.createElement("circle", { cx: 12, cy: 12, r: 9, key: "a" }),
      React.createElement("path", { d: "M12 7v5l3 2", key: "b" }),
    ]),
    shield: P("M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z", "M9 12l2 2 4-4"),
    lock: raw([
      React.createElement("rect", { x: 5, y: 11, width: 14, height: 9, rx: 2, key: "a" }),
      React.createElement("path", { d: "M8 11V8a4 4 0 0 1 8 0v3", key: "b" }),
    ]),
    layers: P("M12 3 3 8l9 5 9-5-9-5Z", "M3 13l9 5 9-5", "M3 16l9 5 9-5"),
    x: P("M6 6l12 12M18 6 6 18"),
    minus: P("M5 12h14"),
    filter: P("M3 5h18", "M6 12h12", "M10 19h4"),
    trash: P("M4 7h16", "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", "M6 7l1 13h10l1-13"),
    bolt: P("M13 2 4 14h7l-1 8 9-12h-7l1-8Z"),
    bag: raw([
      React.createElement("path", { d: "M6 8h12l-1 12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 8Z", key: "a" }),
      React.createElement("path", { d: "M9 8V6a3 3 0 0 1 6 0v2", key: "b" }),
      React.createElement("path", { d: "M9.5 13h5", key: "c" }),
    ]),
    bucket: raw([
      React.createElement("path", { d: "M5 7h14l-1.4 12.2a1 1 0 0 1-1 .8H7.4a1 1 0 0 1-1-.8L5 7Z", key: "a" }),
      React.createElement("path", { d: "M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3", key: "b" }),
    ]),
    drop: P("M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3Z"),
  };
})();

export type IconName = keyof typeof Icon;
