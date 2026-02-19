import { Link } from "react-router-dom";
import "./Breadcrumb.css";

type Crumb = {
  label: string;
  to?: string; // ha nincs to, akkor ez az aktuális oldal
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}

          {index < items.length - 1 && <span className="separator">/</span>}
        </span>
      ))}
    </nav>
  );
}
