export function FHLogo({ size = "48px" }: { size?: string }) {
  return (
    <a href="https://fh-wedel.de">
      <img
        src="https://scontent-ham3-1.xx.fbcdn.net/v/t39.30808-1/326391977_5996287837084498_964917462734101031_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=f907e8&_nc_ohc=kNgHZWwC5qgQ7kNvwHFRWA2&_nc_oc=AdnYCeCKuqViYHu6sh6w957csH8wQm25_OYT7NaPSulo-fqtQ2rFVFZKRk-vESEavOaJ2orJzKpP_2Oxtoh_ELpv&_nc_zt=24&_nc_ht=scontent-ham3-1.xx&_nc_gid=VAlEI75RnHIja_kdkimTnQ&oh=00_AflAg-lZF2iiq9eVEgcqZXKNCiLXmVWyadgjHmvZKqnhAQ&oe=69573020"
        alt="FH Wedel Logo"
        width={size}
        height={size}
      />
    </a>
  );
}

export function MyCampusLogo({ size = "48px" }: { size?: string }) {
  return (
    <a href="https://mycampus.fh-wedel.de">
      <img
        src="https://mycampus.fh-wedel.de/campus/VAADIN/themes/campus/favicon-96x96.png?v=0.20.1.a1e638a7ba2536b00e30a62c59c284b49241ac8d"
        alt="FH Wedel Logo"
        width={size}
        height={size}
      />
    </a>
  );
}
