import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

type Activity = {
  id: number;
  activityName: string;
  activityDescr: string;
  activityURL: string;
};

export default function LandingPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/activities/")
      .then(res => res.json())
      .then(data => {
        // képek teljes URL-re javítása
        const fixed = data.map((item: any) => ({
          ...item,
          activityURL: "http://localhost:8000" + item.activityURL
        }));
        setActivities(fixed);
        setLoading(false);
      })
      .catch(err => {
        console.error("ACTIVITY FETCH ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>Professzionális rovarirtás Magyarországon</h1>
        <p>Gyors, biztonságos és engedéllyel végzett kártevőirtás lakossági és üzleti ügyfeleknek.</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">Ügyfél belépés</Link>
        </div>
      </section>

      {/* ACTIVITY LISTA */}
      <section className="services">
        <h2>Tevékenységeink</h2>

        {loading && <p>Betöltés…</p>}
        {!loading && activities.length === 0 && (
          <p>Jelenleg nincsenek felvitt tevékenységek.</p>
        )}

        <div className="service-grid">
          {activities.map(act => (
            <Link
              key={act.id}
              to={`/admin/activities?id=${act.id}`}
              className="service-card-link"
            >
              <div className="service-card">
                <img
                  src={act.activityURL}
                  alt={act.activityName}
                  className="service-image"
                />
                <h3>{act.activityName}</h3>
                <p>
                  {act.activityDescr.length > 120
                    ? act.activityDescr.slice(0, 120) + "..."
                    : act.activityDescr}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MIÉRT MINKET */}
      <section className="why-us">
        <h2>Miért válasszon minket?</h2>

        <ul>
          <li>✔ 20+ év szakmai tapasztalat</li>
          <li>✔ Engedéllyel rendelkező szakemberek</li>
          <li>✔ Környezetbarát technológiák</li>
          <li>✔ Gyors kiszállás és garancia</li>
        </ul>
      </section>

      {/* KAPCSOLAT */}
      <section className="contact">
        <h2>Kapcsolatfelvétel</h2>

        <form
          className="contact-form"
          onSubmit={e => {
            e.preventDefault();
            alert("A kapcsolatfelvételi backend még nincs bekötve.");
          }}
        >
          <input type="text" placeholder="Név" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Telefonszám" required />
          <textarea placeholder="Üzenet" rows={4}></textarea>

          <button type="submit" className="btn-primary">Üzenet küldése</button>
        </form>
      </section>

      <footer className="footer">
        <p>© 2026 Insecta – Minden jog fenntartva.</p>
      </footer>

    </div>
  );
}
