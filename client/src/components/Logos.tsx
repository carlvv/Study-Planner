export function FHLogo({ size = "48px" }: { size?: string }) {
  return (
    <img
      src="/images/logo.jpg"
      alt="FH Wedel Logo"
      width={size}
      height={size}
    />
  );
}

export function MyCampusLogo({ size = "48px" }: { size?: string }) {
  return (
    <img
      src="https://mycampus.fh-wedel.de/campus/VAADIN/themes/campus/favicon-96x96.png?v=0.20.1.a1e638a7ba2536b00e30a62c59c284b49241ac8d"
      alt="FH Wedel Logo"
      width={size}
      height={size}
    />
  );
}
